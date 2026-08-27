import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { filterModels, getMessageBlockReason, getModelCapabilities, normalizeOpenRouterModel } from "../src/ai/modelCapabilities.js";
import { runAssistantLoop } from "../src/ai/assistantRuntime.js";
import { createFitcycleToolRuntime } from "../src/ai/fitcycleTools.js";
import { fetchOpenRouterModels, streamChatCompletion, testOpenRouterConnection } from "../src/ai/openrouterClient.js";
import { exportBackupJSON, importBackupJSON, store, stopRestTimer } from "../src/store/fitnessStore.js";

let baseline;

function persistentDataSnapshot() {
  const data = JSON.parse(exportBackupJSON());
  delete data.exportTime;
  return data;
}

beforeEach(() => {
  baseline = exportBackupJSON();
  store.settings.soundEnabled = false;
  store.settings.vibrationEnabled = false;
});

afterEach(() => {
  stopRestTimer();
  importBackupJSON(baseline);
  vi.useRealTimers();
});

describe("dynamic model capabilities", () => {
  it("derives image and tools support from OpenRouter metadata", () => {
    const capable = normalizeOpenRouterModel({
      id: "vendor/vision-tool",
      name: "Vision Tool",
      architecture: { input_modalities: ["text", "image"], output_modalities: ["text"] },
      supported_parameters: ["temperature", "tools"]
    });
    const chatOnly = normalizeOpenRouterModel({
      id: "vendor/chat",
      architecture: { input_modalities: ["text"], output_modalities: ["text"] },
      supported_parameters: ["temperature"]
    });

    expect(capable.capabilities).toEqual({ text: true, image: true, tools: true, streaming: true });
    expect(chatOnly.capabilities.image).toBe(false);
    expect(chatOnly.capabilities.tools).toBe(false);
    expect(filterModels([capable, chatOnly], "vision")).toEqual([capable]);
    expect(getMessageBlockReason({ apiKey: "key", model: chatOnly, text: "看图", imageCount: 1 })).toContain("不支持图片");
    expect(getMessageBlockReason({ apiKey: "key", model: capable, text: "看图", imageCount: 1 })).toBe("");
  });

  it("validates the API key before treating a public model list as a connection", async () => {
    const unauthorized = vi.fn(async () => ({ ok: false, status: 401 }));
    await expect(testOpenRouterConnection("invalid-key", { fetchImpl: unauthorized })).rejects.toThrow("API Key 无效");

    const publicModels = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: [] }) }));
    await expect(fetchOpenRouterModels("invalid-key", { fetchImpl: publicModels })).resolves.toEqual([]);
    expect(unauthorized).toHaveBeenCalledWith(expect.stringMatching(/\/key$/), expect.any(Object));
  });

  it("does not advertise image input based on description text", () => {
    expect(getModelCapabilities({ architecture: { input_modalities: ["text"], output_modalities: ["text"] }, description: "image expert" }).image).toBe(false);
  });
});

describe("Fitcycle tool safety", () => {
  it("rejects invalid arguments before changing the store", () => {
    const runtime = createFitcycleToolRuntime();
    const before = JSON.stringify(store.activeWorkout);
    const result = runtime.request({ id: "bad-1", function: { name: "log_workout_set", arguments: '{"exercise_index":-1,"set_index":0,"weight":"heavy","reps":10}' } });
    expect(result.success).toBe(false);
    expect(result.code).toBe("invalid_arguments");
    expect(JSON.stringify(store.activeWorkout)).toBe(before);
  });

  it("deduplicates the same call_id so a retry cannot finish twice", () => {
    const runtime = createFitcycleToolRuntime();
    store.activeWorkout = {
      id: "active-test", planId: "plan-push", planName: "测试", shortName: "测试", color: "amber",
      date: "2026-08-27", startTime: Date.now() - 60000,
      exercises: [{ exerciseId: "ex-test", name: "测试动作", sets: [{ id: "set-test", weight: 10, reps: 10, completed: true }] }]
    };
    const beforeCount = store.workoutLogs.length;
    const call = { id: "finish-once", function: { name: "finish_workout", arguments: "{}" } };
    const first = runtime.request(call);
    const second = runtime.request(call);

    expect(first.success).toBe(true);
    expect(second.deduplicated).toBe(true);
    expect(store.workoutLogs.length).toBe(beforeCount + 1);
  });

  it("requires confirmation for preferences and cancel leaves them unchanged", () => {
    const runtime = createFitcycleToolRuntime();
    const before = store.settings.defaultRestSeconds;
    const pending = runtime.request({ id: "prefs-1", function: { name: "update_training_preferences", arguments: '{"default_rest_seconds":120}' } });
    expect(pending.status).toBe("confirmation_required");
    expect(store.settings.defaultRestSeconds).toBe(before);
    expect(runtime.cancel("prefs-1").status).toBe("cancelled");
    expect(store.settings.defaultRestSeconds).toBe(before);
  });

  it("executes a confirmed preference update and provides undo", () => {
    const runtime = createFitcycleToolRuntime();
    const before = store.settings.defaultRestSeconds;
    runtime.request({ id: "prefs-2", function: { name: "update_training_preferences", arguments: '{"default_rest_seconds":120}' } });
    const confirmed = runtime.confirm("prefs-2");
    expect(confirmed.success).toBe(true);
    expect(store.settings.defaultRestSeconds).toBe(120);
    expect(runtime.undo("prefs-2").success).toBe(true);
    expect(store.settings.defaultRestSeconds).toBe(before);
  });

  it("will not execute any tool for a model without tools capability", () => {
    const runtime = createFitcycleToolRuntime();
    const before = store.settings.defaultRestSeconds;
    const result = runtime.request({ id: "no-tools", function: { name: "update_training_preferences", arguments: '{"default_rest_seconds":120}' } }, { modelSupportsTools: false });
    expect(result.code).toBe("tools_unsupported");
    expect(store.settings.defaultRestSeconds).toBe(before);
  });

  it("will not unlock or switch to a locked skin", () => {
    const runtime = createFitcycleToolRuntime();
    store.settings.unlockedSkins = ["default"];
    runtime.request({ id: "skin-1", function: { name: "set_unlocked_skin", arguments: '{"skin_name":"chamber"}' } });
    const result = runtime.confirm("skin-1");
    expect(result.success).toBe(false);
    expect(store.settings.uiSkin).toBe("default");
    expect(store.settings.unlockedSkins).toEqual(["default"]);
  });

  it("stops after four tool-call rounds", async () => {
    let responseIndex = 0;
    const request = vi.fn(() => ({ success: true, message: "ok", data: {} }));
    const result = await runAssistantLoop({
      apiKey: "test-key",
      model: "vendor/tools",
      capabilities: { tools: true },
      messages: [{ role: "user", content: "连续查询" }],
      toolRuntime: { request },
      streamImpl: async () => {
        const id = `round-${responseIndex++}`;
        return { content: "", finishReason: "tool_calls", toolCalls: [{ id, type: "function", function: { name: "get_today_context", arguments: "{}" } }] };
      }
    });
    expect(result.status).toBe("tool_limit");
    expect(result.toolRounds).toBe(4);
    expect(request).toHaveBeenCalledTimes(4);
  });
});

describe("assistant network isolation", () => {
  it("parses streamed text and fragmented tool calls", async () => {
    const encoder = new TextEncoder();
    const events = [
      { choices: [{ delta: { content: "训" }, finish_reason: null }] },
      { choices: [{ delta: { content: "练", tool_calls: [{ index: 0, id: "call-", type: "function", function: { name: "get_today_", arguments: "{" } }] }, finish_reason: null }] },
      { choices: [{ delta: { tool_calls: [{ index: 0, id: "1", function: { name: "context", arguments: "}" } }] }, finish_reason: "tool_calls" }] }
    ];
    const body = new ReadableStream({
      start(controller) {
        events.forEach((event) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    });
    const tokens = [];
    const result = await streamChatCompletion({
      apiKey: "test-key", model: "vendor/tools", messages: [], onToken: (token) => tokens.push(token)
    }, { fetchImpl: async () => ({ ok: true, status: 200, body }) });

    expect(result.content).toBe("训练");
    expect(tokens).toEqual(["训", "练"]);
    expect(result.toolCalls[0]).toEqual({ id: "call-1", type: "function", function: { name: "get_today_context", arguments: "{}" } });
    expect(result.finishReason).toBe("tool_calls");
  });

  it("does not send tools to a chat-only model", async () => {
    const before = persistentDataSnapshot();
    const streamImpl = vi.fn(async (request) => {
      expect(request.tools).toEqual([]);
      return { content: "仅聊天", toolCalls: [], finishReason: "stop" };
    });
    const result = await runAssistantLoop({
      apiKey: "test-key", model: "vendor/chat", capabilities: { tools: false }, messages: [{ role: "user", content: "你好" }],
      toolRuntime: createFitcycleToolRuntime(), streamImpl
    });
    expect(result.content).toBe("仅聊天");
    expect(persistentDataSnapshot()).toEqual(before);
  });

  it("keeps training state unchanged when OpenRouter fails", async () => {
    const before = persistentDataSnapshot();
    await expect(runAssistantLoop({
      apiKey: "test-key", model: "vendor/chat", capabilities: { tools: false }, messages: [{ role: "user", content: "你好" }],
      toolRuntime: createFitcycleToolRuntime(), streamImpl: async () => { throw new Error("offline"); }
    })).rejects.toThrow("offline");
    expect(persistentDataSnapshot()).toEqual(before);
  });

  it("propagates stop generation without changing training state", async () => {
    const before = persistentDataSnapshot();
    const controller = new AbortController();
    const promise = streamChatCompletion({ apiKey: "test-key", model: "vendor/chat", messages: [], signal: controller.signal }, {
      fetchImpl: (_url, options) => new Promise((_resolve, reject) => {
        options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      })
    });
    controller.abort();
    await expect(promise).rejects.toMatchObject({ name: "AbortError" });
    expect(persistentDataSnapshot()).toEqual(before);
  });
});
