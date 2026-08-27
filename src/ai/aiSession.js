import { reactive } from "vue";

export const AI_PROVIDERS = [
  { id: "deepseek", name: "DeepSeek", keyLabel: "DeepSeek API Key" },
  { id: "zhipu", name: "智谱 GLM", keyLabel: "智谱 API Key" }
];
export const AI_KEY_SESSION_KEYS = {
  deepseek: "fitcycle_deepseek_session_key",
  zhipu: "fitcycle_zhipu_session_key"
};
const MODEL_SESSION_KEYS = {
  deepseek: "fitcycle_deepseek_model",
  zhipu: "fitcycle_zhipu_model"
};
const CACHED_MODELS_KEYS = {
  deepseek: "fitcycle_deepseek_models_cache",
  zhipu: "fitcycle_zhipu_models_cache"
};
const PROVIDER_SESSION_KEY = "fitcycle_ai_provider";
const LEGACY_OPENROUTER_KEYS = ["fitcycle_openrouter_session_key", "fitcycle_openrouter_model"];

export const DEFAULT_PRESET_MODELS = {
  deepseek: [
    {
      id: "deepseek-chat",
      name: "DeepSeek-V3 (通用对话)",
      description: "高性价比通用模型，支持工具调用",
      capabilities: { text: true, image: false, tools: true, streaming: true }
    },
    {
      id: "deepseek-reasoner",
      name: "DeepSeek-R1 (深度思考)",
      description: "深度推理与逻辑思考模型",
      capabilities: { text: true, image: false, tools: false, streaming: true }
    }
  ],
  zhipu: [
    {
      id: "glm-5.3-flash",
      name: "GLM-5.3-Flash (超快旗舰)",
      description: "新一代超快多模态旗舰，支持识图与深度思考",
      capabilities: { text: true, image: true, tools: true, streaming: true }
    },
    {
      id: "glm-4.5",
      name: "GLM-4.5 (多模态通用)",
      description: "多模态通用大模型，支持识图与动作感知",
      capabilities: { text: true, image: true, tools: true, streaming: true }
    },
    {
      id: "glm-5",
      name: "GLM-5 (旗舰多模态)",
      description: "旗舰多模态大模型",
      capabilities: { text: true, image: true, tools: true, streaming: true }
    },
    {
      id: "glm-4-flash",
      name: "GLM-4-Flash (极速响应)",
      description: "极速响应多模态模型",
      capabilities: { text: true, image: true, tools: true, streaming: true }
    }
  ]
};

function readStorageValue(key) {
  try {
    if (typeof localStorage !== "undefined") {
      const val = localStorage.getItem(key);
      if (val) return val;
    }
    if (typeof sessionStorage !== "undefined") {
      return sessionStorage.getItem(key) || "";
    }
    return "";
  } catch {
    return "";
  }
}

function writeStorageValue(key, value) {
  try {
    if (typeof localStorage !== "undefined") {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    }
    if (typeof sessionStorage !== "undefined") {
      if (value) sessionStorage.setItem(key, value);
      else sessionStorage.removeItem(key);
    }
  } catch {
    // A blocked storage must not prevent the in-memory assistant from working.
  }
}

function readCachedModels(provider) {
  try {
    const raw = readStorageValue(CACHED_MODELS_KEYS[provider]);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_PRESET_MODELS[provider] ? JSON.parse(JSON.stringify(DEFAULT_PRESET_MODELS[provider])) : [];
}

const initActiveProvider = AI_PROVIDERS.some((item) => item.id === readStorageValue(PROVIDER_SESSION_KEY))
  ? readStorageValue(PROVIDER_SESSION_KEY)
  : "deepseek";

const initDeepSeekKey = readStorageValue(AI_KEY_SESSION_KEYS.deepseek);
const initZhipuKey = readStorageValue(AI_KEY_SESSION_KEYS.zhipu);

const initDeepSeekModels = readCachedModels("deepseek");
const initZhipuModels = readCachedModels("zhipu");

const initDeepSeekModel = readStorageValue(MODEL_SESSION_KEYS.deepseek) || (initDeepSeekModels[0]?.id || "deepseek-chat");
const initZhipuModel = readStorageValue(MODEL_SESSION_KEYS.zhipu) || (initZhipuModels[0]?.id || "glm-5.3-flash");

const currentKey = initActiveProvider === "deepseek" ? initDeepSeekKey : initZhipuKey;

export const aiSession = reactive({
  activeProvider: initActiveProvider,
  apiKeys: {
    deepseek: initDeepSeekKey,
    zhipu: initZhipuKey
  },
  selectedModelIds: {
    deepseek: initDeepSeekModel,
    zhipu: initZhipuModel
  },
  modelsByProvider: {
    deepseek: initDeepSeekModels,
    zhipu: initZhipuModels
  },
  drawerOpen: false,
  connectionState: currentKey ? "connected" : "idle",
  connectionMessage: "",
  clearRevision: 0,
  conversation: [],
  apiMessages: []
});

LEGACY_OPENROUTER_KEYS.forEach((key) => writeStorageValue(key, ""));

export function getActiveProvider() {
  return AI_PROVIDERS.find((item) => item.id === aiSession.activeProvider) || AI_PROVIDERS[0];
}

export function getActiveApiKey() {
  return aiSession.apiKeys[aiSession.activeProvider] || "";
}

export function getActiveModels() {
  const list = aiSession.modelsByProvider[aiSession.activeProvider];
  if (Array.isArray(list) && list.length > 0) return list;
  return DEFAULT_PRESET_MODELS[aiSession.activeProvider] || [];
}

export function getActiveModelId() {
  const current = aiSession.selectedModelIds[aiSession.activeProvider];
  if (current) return current;
  const models = getActiveModels();
  return models[0]?.id || "";
}

export function setActiveProvider(provider) {
  if (!AI_PROVIDERS.some((item) => item.id === provider)) return;
  if (aiSession.activeProvider !== provider) clearConversation();
  aiSession.activeProvider = provider;
  aiSession.connectionState = aiSession.apiKeys[provider] ? "connected" : "idle";
  aiSession.connectionMessage = "";
  writeStorageValue(PROVIDER_SESSION_KEY, provider);
}

export function setSessionApiKey(apiKey, provider = aiSession.activeProvider) {
  const clean = typeof apiKey === "string" ? apiKey.trim() : "";
  aiSession.apiKeys[provider] = clean;
  writeStorageValue(AI_KEY_SESSION_KEYS[provider], clean);
  if (clean) {
    aiSession.connectionState = "connected";
  } else if (!aiSession.apiKeys[aiSession.activeProvider]) {
    aiSession.connectionState = "idle";
  }
}

export function setSelectedModel(modelId, provider = aiSession.activeProvider) {
  const clean = typeof modelId === "string" ? modelId : "";
  aiSession.selectedModelIds[provider] = clean;
  writeStorageValue(MODEL_SESSION_KEYS[provider], clean);
}

export function setProviderModels(models, provider = aiSession.activeProvider) {
  const clean = Array.isArray(models) ? models : [];
  aiSession.modelsByProvider[provider] = clean;
  if (clean.length > 0) {
    writeStorageValue(CACHED_MODELS_KEYS[provider], JSON.stringify(clean));
  }
}

export function clearConversation() {
  aiSession.conversation.splice(0);
  aiSession.apiMessages.splice(0);
}

export function clearAIConnection() {
  AI_PROVIDERS.forEach(({ id }) => {
    setSessionApiKey("", id);
    setSelectedModel("", id);
    setProviderModels([], id);
    writeStorageValue(CACHED_MODELS_KEYS[id], "");
  });
  LEGACY_OPENROUTER_KEYS.forEach((key) => writeStorageValue(key, ""));
  aiSession.connectionState = "idle";
  aiSession.connectionMessage = "";
  clearConversation();
  aiSession.clearRevision += 1;
}

