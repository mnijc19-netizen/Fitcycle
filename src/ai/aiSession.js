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
const PROVIDER_SESSION_KEY = "fitcycle_ai_provider";
const LEGACY_OPENROUTER_KEYS = ["fitcycle_openrouter_session_key", "fitcycle_openrouter_model"];

function readSessionValue(key) {
  try {
    return typeof sessionStorage === "undefined" ? "" : sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeSessionValue(key, value) {
  try {
    if (typeof sessionStorage === "undefined") return;
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    // A blocked sessionStorage must not prevent the in-memory assistant from working.
  }
}

export const aiSession = reactive({
  activeProvider: AI_PROVIDERS.some((item) => item.id === readSessionValue(PROVIDER_SESSION_KEY))
    ? readSessionValue(PROVIDER_SESSION_KEY)
    : "deepseek",
  apiKeys: {
    deepseek: readSessionValue(AI_KEY_SESSION_KEYS.deepseek),
    zhipu: readSessionValue(AI_KEY_SESSION_KEYS.zhipu)
  },
  selectedModelIds: {
    deepseek: readSessionValue(MODEL_SESSION_KEYS.deepseek),
    zhipu: readSessionValue(MODEL_SESSION_KEYS.zhipu)
  },
  modelsByProvider: { deepseek: [], zhipu: [] },
  drawerOpen: false,
  connectionState: "idle",
  connectionMessage: "",
  clearRevision: 0,
  conversation: [],
  apiMessages: []
});

LEGACY_OPENROUTER_KEYS.forEach((key) => writeSessionValue(key, ""));

export function getActiveProvider() {
  return AI_PROVIDERS.find((item) => item.id === aiSession.activeProvider) || AI_PROVIDERS[0];
}

export function getActiveApiKey() {
  return aiSession.apiKeys[aiSession.activeProvider] || "";
}

export function getActiveModels() {
  return aiSession.modelsByProvider[aiSession.activeProvider] || [];
}

export function getActiveModelId() {
  return aiSession.selectedModelIds[aiSession.activeProvider] || "";
}

export function setActiveProvider(provider) {
  if (!AI_PROVIDERS.some((item) => item.id === provider)) return;
  if (aiSession.activeProvider !== provider) clearConversation();
  aiSession.activeProvider = provider;
  aiSession.connectionState = "idle";
  aiSession.connectionMessage = "";
  writeSessionValue(PROVIDER_SESSION_KEY, provider);
}

export function setSessionApiKey(apiKey, provider = aiSession.activeProvider) {
  const clean = typeof apiKey === "string" ? apiKey.trim() : "";
  aiSession.apiKeys[provider] = clean;
  writeSessionValue(AI_KEY_SESSION_KEYS[provider], clean);
}

export function setSelectedModel(modelId, provider = aiSession.activeProvider) {
  const clean = typeof modelId === "string" ? modelId : "";
  aiSession.selectedModelIds[provider] = clean;
  writeSessionValue(MODEL_SESSION_KEYS[provider], clean);
}

export function setProviderModels(models, provider = aiSession.activeProvider) {
  aiSession.modelsByProvider[provider] = Array.isArray(models) ? models : [];
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
  });
  LEGACY_OPENROUTER_KEYS.forEach((key) => writeSessionValue(key, ""));
  aiSession.connectionState = "idle";
  aiSession.connectionMessage = "";
  clearConversation();
  aiSession.clearRevision += 1;
}
