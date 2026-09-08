import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import {
  PROVIDER_CONFIGS,
  fetchProviderModels,
  streamProviderChatCompletion,
  testProviderConnection
} from "../src/ai/providerClient.js";
import {
  getModelCapabilities,
  getModelCreator,
  getModelStrategy,
  normalizeProviderModel
} from "../src/ai/modelCapabilities.js";
import {
  AI_KEY_SESSION_KEYS,
  AI_PROVIDERS,
  DEFAULT_PRESET_MODELS,
  aiSession,
  clearAIConnection,
  getActiveApiKey,
  getActiveModelId,
  getActiveModels,
  getActiveProvider,
  setActiveProvider,
  setProviderModels,
  setSelectedModel,
  setSessionApiKey
} from "../src/ai/aiSession.js";
import AISettingsPanel from "../src/components/AISettingsPanel.vue";

afterEach(() => {
  aiSession.drawerOpen = false;
  clearAIConnection();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("OpenRouter Provider Configuration and Headers", () => {
  it("registers openrouter in PROVIDER_CONFIGS with official base URL", () => {
    const config = PROVIDER_CONFIGS.openrouter;
    expect(config).toBeDefined();
    expect(config.name).toBe("OpenRouter");
    expect(config.apiBase).toBe("https://openrouter.ai/api/v1");
  });

  it("registers openrouter in AI_PROVIDERS and AI_KEY_SESSION_KEYS", () => {
    const found = AI_PROVIDERS.find((p) => p.id === "openrouter");
    expect(found).toBeDefined();
    expect(found.name).toBe("OpenRouter");
    expect(found.portal).toBe("https://openrouter.ai/keys");
    expect(AI_KEY_SESSION_KEYS.openrouter).toBe("fitcycle_openrouter_session_key");
  });

  it("isolates OpenRouter API keys in session storage", () => {
    setActiveProvider("openrouter");
    expect(getActiveProvider().id).toBe("openrouter");

    setSessionApiKey("sk-or-v1-test-key-9999", "openrouter");
    expect(getActiveApiKey()).toBe("sk-or-v1-test-key-9999");
    expect(sessionStorage.getItem(AI_KEY_SESSION_KEYS.openrouter)).toBe("sk-or-v1-test-key-9999");

    clearAIConnection();
    expect(getActiveApiKey()).toBe("");
    expect(sessionStorage.getItem(AI_KEY_SESSION_KEYS.openrouter) || "").toBe("");
  });

  it("passes OpenRouter recommended HTTP-Referer and X-Title headers in requests", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ id: "google/gemini-2.0-flash-001" }] })
    }));

    await fetchProviderModels("openrouter", "sk-or-test-key", { fetchImpl: mockFetch });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/models",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sk-or-test-key",
          "Content-Type": "application/json",
          "HTTP-Referer": expect.any(String),
          "X-Title": "FitCycle"
        })
      })
    );
  });
});

describe("OpenRouter Models Fetching, Normalization, and Capability Deduction", () => {
  it("fetches, normalizes, and filters non-chat models from OpenRouter endpoint", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          { id: "anthropic/claude-3.5-sonnet", name: "Anthropic: Claude 3.5 Sonnet" },
          { id: "google/gemini-2.0-flash-001", name: "Google: Gemini 2.0 Flash" },
          { id: "deepseek/deepseek-chat", name: "DeepSeek: DeepSeek V3" },
          { id: "deepseek/deepseek-r1", name: "DeepSeek: R1" },
          { id: "openai/whisper-large-v3" }, // Audio non-chat, should be filtered
          { id: "openai/text-embedding-3-large" } // Embedding non-chat, should be filtered
        ]
      })
    }));

    const models = await fetchProviderModels("openrouter", "sk-or-key", { fetchImpl: mockFetch });
    const ids = models.map((m) => m.id);

    expect(ids).toContain("anthropic/claude-3.5-sonnet");
    expect(ids).toContain("google/gemini-2.0-flash-001");
    expect(ids).toContain("deepseek/deepseek-chat");
    expect(ids).toContain("deepseek/deepseek-r1");
    expect(ids).not.toContain("openai/whisper-large-v3");
    expect(ids).not.toContain("openai/text-embedding-3-large");
  });

  it("correctly identifies capabilities for OpenRouter models", () => {
    const claude = normalizeProviderModel("openrouter", { id: "anthropic/claude-3.5-sonnet" });
    expect(claude.capabilities.image).toBe(true);
    expect(claude.capabilities.tools).toBe(true);
    expect(claude.capabilities.reasoning).toBe(false);

    const r1 = normalizeProviderModel("openrouter", { id: "deepseek/deepseek-r1" });
    expect(r1.capabilities.image).toBe(false);
    expect(r1.capabilities.tools).toBe(false); // Tool calling blocked for pure reasoning model
    expect(r1.capabilities.reasoning).toBe(true);

    const gemini = normalizeProviderModel("openrouter", { id: "google/gemini-2.0-flash-001" });
    expect(gemini.capabilities.image).toBe(true);
    expect(gemini.capabilities.tools).toBe(true);
  });

  it("correctly extracts creator names for OpenRouter model paths", () => {
    expect(getModelCreator({ id: "anthropic/claude-3.5-sonnet" })).toBe("Anthropic");
    expect(getModelCreator({ id: "meta-llama/llama-3.3-70b-instruct" })).toBe("Meta LLaMA");
    expect(getModelCreator({ id: "mistralai/mistral-large" })).toBe("Mistral");
    expect(getModelCreator({ id: "cohere/command-r-plus" })).toBe("Cohere");
    expect(getModelCreator({ id: "x-ai/grok-2" })).toBe("xAI (Grok)");
    expect(getModelCreator({ id: "openrouter-native-model", provider: "openrouter" })).toBe("OpenRouter");
  });
});

describe("OpenRouter Connection Testing and Latency Ping", () => {
  it("testProviderConnection executes 5-token completion ping with OpenRouter headers", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: "Hello from OpenRouter!" } }]
      })
    }));

    const result = await testProviderConnection(
      { provider: "openrouter", apiKey: "sk-or-key-ping", model: "anthropic/claude-3.5-sonnet" },
      { fetchImpl: mockFetch }
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer sk-or-key-ping",
          "HTTP-Referer": expect.any(String),
          "X-Title": "FitCycle"
        }),
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 5,
          stream: false
        })
      })
    );

    expect(result.success).toBe(true);
    expect(result.latencyMs).toBeGreaterThan(0);
    expect(result.reply).toBe("Hello from OpenRouter!");
    expect(result.provider).toBe("OpenRouter");
  });

  it("testProviderConnection verifies /models endpoint when model is omitted", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [] })
    }));

    const result = await testProviderConnection(
      { provider: "openrouter", apiKey: "sk-or-key-check" },
      { fetchImpl: mockFetch }
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/models",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sk-or-key-check",
          "X-Title": "FitCycle"
        })
      })
    );
    expect(result.success).toBe(true);
    expect(result.latencyMs).toBeGreaterThan(0);
  });
});

describe("UI Integration: AISettingsPanel with OpenRouter", () => {
  it("renders OpenRouter option and switches provider on click", async () => {
    const wrapper = mount(AISettingsPanel);
    const buttons = wrapper.findAll("button");
    const orBtn = buttons.find((b) => b.text().includes("OpenRouter"));
    expect(orBtn).toBeDefined();

    await orBtn.trigger("click");
    expect(aiSession.activeProvider).toBe("openrouter");

    // Portal link should direct to OpenRouter keys
    const link = wrapper.find('a[href="https://openrouter.ai/keys"]');
    expect(link.exists()).toBe(true);

    wrapper.unmount();
  });

  it("shows OpenRouter custom model placeholder example", async () => {
    setActiveProvider("openrouter");
    setSessionApiKey("sk-or-test-key", "openrouter");
    const wrapper = mount(AISettingsPanel);

    // Expand custom model
    const toggleBtn = wrapper.findAll("button").find((b) => b.text().includes("自定义指定模型 ID"));
    expect(toggleBtn).toBeDefined();
    await toggleBtn.trigger("click");

    const customInput = wrapper.find('input[placeholder*="anthropic/claude-3.5-sonnet"]');
    expect(customInput.exists()).toBe(true);

    wrapper.unmount();
  });

  it("executes active model ping test for OpenRouter and displays latency", async () => {
    setActiveProvider("openrouter");
    setSessionApiKey("sk-or-mock-key", "openrouter");
    setSelectedModel("anthropic/claude-3.5-sonnet", "openrouter");

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn(async (url) => {
      if (typeof url === "string" && url.includes("/chat/completions")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [{ message: { content: "Claude active" } }]
          })
        };
      }
      return { ok: true, status: 200, json: async () => ({ data: [] }) };
    });

    try {
      const wrapper = mount(AISettingsPanel);
      const pingBtn = wrapper.find('[data-testid="test-active-model-btn"]');
      expect(pingBtn.exists()).toBe(true);

      await pingBtn.trigger("click");
      await flushPromises();

      const pingMsg = wrapper.find('[data-testid="ping-result-msg"]');
      expect(pingMsg.exists()).toBe(true);
      expect(pingMsg.text()).toContain("连通正常");
      expect(pingMsg.text()).toContain("Claude active");

      wrapper.unmount();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
