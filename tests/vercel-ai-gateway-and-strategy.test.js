import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import {
  PROVIDER_CONFIGS,
  fetchProviderModels,
  streamProviderChatCompletion
} from "../src/ai/providerClient.js";
import {
  MODEL_STRATEGIES,
  filterModelsByStrategy,
  findRecommendedVisionModel,
  getModelCapabilities,
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
import AIAssistantDrawer from "../src/components/AIAssistantDrawer.vue";
import * as imageProcessor from "../src/ai/imageProcessor.js";

afterEach(() => {
  aiSession.drawerOpen = false;
  clearAIConnection();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("Vercel AI Gateway provider configuration", () => {
  it("registers vercel_ai_gateway in PROVIDER_CONFIGS with official endpoint", () => {
    const config = PROVIDER_CONFIGS.vercel_ai_gateway;
    expect(config).toBeDefined();
    expect(config.name).toBe("Vercel AI Gateway");
    expect(config.apiBase).toBe("https://ai-gateway.vercel.sh/v1");
  });

  it("registers vercel_ai_gateway in AI_PROVIDERS and AI_KEY_SESSION_KEYS", () => {
    const vercel_ai_gateway_id = "vercel_ai_gateway";
    const found = AI_PROVIDERS.find((p) => p.id === vercel_ai_gateway_id);
    expect(found).toBeDefined();
    expect(found.name).toBe("Vercel AI Gateway");
    expect(found.portal).toBe("https://vercel.com/docs/ai-gateway");
    expect(AI_KEY_SESSION_KEYS.vercel_ai_gateway).toBe("fitcycle_vercel_ai_gateway_session_key");
  });

  it("isolates Vercel AI Gateway API keys in session storage", () => {
    setActiveProvider("vercel_ai_gateway");
    expect(getActiveProvider().id).toBe("vercel_ai_gateway");

    setSessionApiKey("v-gw-test-key-12345", "vercel_ai_gateway");
    expect(getActiveApiKey()).toBe("v-gw-test-key-12345");
    expect(sessionStorage.getItem(AI_KEY_SESSION_KEYS.vercel_ai_gateway)).toBe("v-gw-test-key-12345");

    clearAIConnection();
    expect(getActiveApiKey()).toBe("");
    expect(sessionStorage.getItem(AI_KEY_SESSION_KEYS.vercel_ai_gateway) || "").toBe("");
  });

  it("fetches and normalizes models from Vercel AI Gateway endpoint", async () => {
    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          { id: "google/gemini-2.0-flash" },
          { id: "openai/gpt-4o-mini" },
          { id: "deepseek/deepseek-reasoner" },
          { id: "openai/dall-e-3" } // Should be filtered out as non-chat model
        ]
      })
    }));

    const models = await fetchProviderModels("vercel_ai_gateway", "v-gw-test-key", { fetchImpl: mockFetch });
    expect(mockFetch).toHaveBeenCalledWith("https://ai-gateway.vercel.sh/v1/models", expect.objectContaining({
      headers: {
        Authorization: "Bearer v-gw-test-key",
        "Content-Type": "application/json"
      }
    }));

    const modelIds = models.map((m) => m.id);
    expect(modelIds).toContain("google/gemini-2.0-flash");
    expect(modelIds).toContain("openai/gpt-4o-mini");
    expect(modelIds).toContain("deepseek/deepseek-reasoner");
    expect(modelIds).not.toContain("openai/dall-e-3");
  });

  it("streams chat completion through Vercel AI Gateway endpoint", async () => {
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({
          value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Fitcycle AI"}}]}\n\n'),
          done: false
        })
        .mockResolvedValueOnce({
          value: new TextEncoder().encode('data: [DONE]\n\n'),
          done: true
        })
    };

    const mockFetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      body: { getReader: () => mockReader }
    }));

    const tokens = [];
    const result = await streamProviderChatCompletion({
      provider: "vercel_ai_gateway",
      apiKey: "test-gateway-key",
      model: "google/gemini-2.0-flash",
      messages: [{ role: "user", content: "hello" }],
      onToken: (t) => tokens.push(t)
    }, { fetchImpl: mockFetch });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-gateway-key",
          "Content-Type": "application/json"
        }
      })
    );
    expect(result.content).toBe("Fitcycle AI");
    expect(tokens).toEqual(["Fitcycle AI"]);
  });
});

describe("Vercel AI Gateway cross-creator model capabilities", () => {
  it("accurately detects Google Gemini multimodal vision and tools", () => {
    const gemini = normalizeProviderModel("vercel_ai_gateway", { id: "google/gemini-2.0-flash" });
    expect(gemini.capabilities.text).toBe(true);
    expect(gemini.capabilities.image).toBe(true);
    expect(gemini.capabilities.tools).toBe(true);
    expect(gemini.capabilities.reasoning).toBe(false);
  });

  it("accurately detects OpenAI GPT-4o and GPT-4o-mini capabilities", () => {
    const gpt4o = normalizeProviderModel("vercel_ai_gateway", { id: "openai/gpt-4o" });
    const gpt4oMini = normalizeProviderModel("vercel_ai_gateway", { id: "openai/gpt-4o-mini" });
    expect(gpt4o.capabilities.image).toBe(true);
    expect(gpt4o.capabilities.tools).toBe(true);
    expect(gpt4oMini.capabilities.image).toBe(true);
    expect(gpt4oMini.capabilities.tools).toBe(true);
  });

  it("accurately detects Anthropic Claude 3.5 Sonnet vision and tools", () => {
    const claude = normalizeProviderModel("vercel_ai_gateway", { id: "anthropic/claude-3-5-sonnet" });
    expect(claude.capabilities.image).toBe(true);
    expect(claude.capabilities.tools).toBe(true);
    expect(claude.capabilities.reasoning).toBe(false);
  });

  it("accurately detects DeepSeek-V3 vs DeepSeek-R1 through Vercel Gateway", () => {
    const dsChat = normalizeProviderModel("vercel_ai_gateway", { id: "deepseek/deepseek-chat" });
    const dsR1 = normalizeProviderModel("vercel_ai_gateway", { id: "deepseek/deepseek-reasoner" });

    // DeepSeek-V3: tools enabled, pure text
    expect(dsChat.capabilities.text).toBe(true);
    expect(dsChat.capabilities.image).toBe(false);
    expect(dsChat.capabilities.tools).toBe(true);
    expect(dsChat.capabilities.reasoning).toBe(false);

    // DeepSeek-R1: reasoning enabled, pure text
    expect(dsR1.capabilities.text).toBe(true);
    expect(dsR1.capabilities.image).toBe(false);
    expect(dsR1.capabilities.tools).toBe(false);
    expect(dsR1.capabilities.reasoning).toBe(true);
  });

  it("accurately detects OpenAI o1 and o3 reasoning models", () => {
    const o3 = normalizeProviderModel("vercel_ai_gateway", { id: "openai/o3-mini" });
    expect(o3.capabilities.reasoning).toBe(true);
  });
});

describe("Model selection strategy rationalization", () => {
  it("provides 4 comprehensive strategy definitions with badges", () => {
    expect(MODEL_STRATEGIES).toHaveLength(4);
    const ids = MODEL_STRATEGIES.map((s) => s.id);
    expect(ids).toEqual(["all", "speed", "vision", "reasoning"]);
  });

  it("correctly classifies models into strategic archetypes", () => {
    const r1 = { id: "deepseek-reasoner", capabilities: { text: true, image: false, tools: false, reasoning: true } };
    const vision = { id: "glm-4.6v", capabilities: { text: true, image: true, tools: true, reasoning: false } };
    const speed = { id: "deepseek-chat", capabilities: { text: true, image: false, tools: true, reasoning: false } };
    const plain = { id: "basic-text", capabilities: { text: true, image: false, tools: false, reasoning: false } };

    expect(getModelStrategy(r1).id).toBe("reasoning");
    expect(getModelStrategy(r1).icon).toBe("🧠");

    expect(getModelStrategy(vision).id).toBe("vision");
    expect(getModelStrategy(vision).icon).toBe("👁️");

    expect(getModelStrategy(speed).id).toBe("speed");
    expect(getModelStrategy(speed).icon).toBe("⚡");

    expect(getModelStrategy(plain).id).toBe("general");
  });

  it("filters models by strategic scenario", () => {
    const presets = DEFAULT_PRESET_MODELS.vercel_ai_gateway;
    expect(presets.length).toBeGreaterThanOrEqual(6);

    const speedModels = filterModelsByStrategy(presets, "speed");
    const visionModels = filterModelsByStrategy(presets, "vision");
    const reasoningModels = filterModelsByStrategy(presets, "reasoning");

    expect(speedModels.some((m) => m.id === "deepseek/deepseek-chat")).toBe(true);
    expect(visionModels.some((m) => m.id === "google/gemini-2.0-flash")).toBe(true);
    expect(visionModels.some((m) => m.id === "openai/gpt-4o")).toBe(true);
    expect(reasoningModels.some((m) => m.id === "deepseek/deepseek-reasoner")).toBe(true);
  });

  it("finds recommended vision model correctly", () => {
    const presets = DEFAULT_PRESET_MODELS.vercel_ai_gateway;
    const recommended = findRecommendedVisionModel(presets);
    expect(recommended).not.toBeNull();
    expect(recommended.capabilities.image).toBe(true);
  });
});

describe("UI Integration: AISettingsPanel and AIAssistantDrawer with Vercel Gateway & Strategy", () => {
  it("renders Vercel AI Gateway option in settings and allows switching", async () => {
    const wrapper = mount(AISettingsPanel);
    const buttons = wrapper.findAll("button");
    const vercelBtn = buttons.find((b) => b.text().includes("Vercel AI Gateway"));
    expect(vercelBtn).toBeDefined();

    await vercelBtn.trigger("click");
    expect(aiSession.activeProvider).toBe("vercel_ai_gateway");
    wrapper.unmount();
  });

  it("displays strategy filter pills in settings panel when connected", async () => {
    setActiveProvider("vercel_ai_gateway");
    setSessionApiKey("test-key", "vercel_ai_gateway");
    const wrapper = mount(AISettingsPanel);

    // Strategy filter tabs should exist
    const text = wrapper.text();
    expect(text).toContain("按训练场景策略筛选");
    expect(text).toContain("极速全能");
    expect(text).toContain("视觉识图");
    expect(text).toContain("深度思考");
    wrapper.unmount();
  });

  it("displays strategy pills in quick model picker and allows filtering in drawer", async () => {
    setActiveProvider("vercel_ai_gateway");
    setSessionApiKey("test-key", "vercel_ai_gateway");
    aiSession.drawerOpen = true;

    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    await wrapper.get('[data-testid="toggle-quick-model-picker"]').trigger("click");
    await nextTick();

    expect(wrapper.find('[data-testid="quick-model-picker-modal"]').exists()).toBe(true);
    const popoverText = wrapper.find('[data-testid="quick-model-picker-modal"]').text();
    expect(popoverText).toContain("极速全能");
    expect(popoverText).toContain("视觉识图");
    expect(popoverText).toContain("深度思考");

    wrapper.unmount();
  });

  it("renders intelligent vision upgrade button when attachments are added to pure text model", async () => {
    setActiveProvider("vercel_ai_gateway");
    setSessionApiKey("test-key", "vercel_ai_gateway");
    setSelectedModel("deepseek/deepseek-chat", "vercel_ai_gateway"); // text-only model
    aiSession.drawerOpen = true;

    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    expect(getActiveModelId()).toBe("deepseek/deepseek-chat");

    // Initially no banner
    expect(wrapper.text()).not.toContain("当前模型不支持图片识别");

    // Mock image processor in jsdom test environment
    vi.spyOn(imageProcessor, "processImageFile").mockResolvedValue({
      name: "gym-machine.png",
      type: "image/png",
      width: 800,
      height: 600,
      dataUrl: "data:image/png;base64,mockImageData",
      size: 10240
    });

    // Simulate file attachment
    const file = new File(["dummy image content"], "gym-machine.png", { type: "image/png" });
    const fileInput = wrapper.get('input[type="file"]');
    Object.defineProperty(fileInput.element, "files", { value: [file] });
    await fileInput.trigger("change");
    await flushPromises();
    await nextTick();

    // Now intelligent vision upgrade banner should be displayed
    expect(wrapper.text()).toContain("当前模型不支持图片识别");
    const switchBtn = wrapper.findAll("button").find((b) => b.text().includes("一键切至"));
    expect(switchBtn).toBeDefined();

    // Clicking switch button changes active model to Gemini 2.0 Flash
    await switchBtn.trigger("click");
    await nextTick();

    expect(getActiveModelId()).toBe("google/gemini-2.0-flash");
    wrapper.unmount();
  });
});
