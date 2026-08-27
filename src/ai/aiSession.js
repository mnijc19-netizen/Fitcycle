import { reactive } from "vue";

export const AI_PROVIDERS = [
  { id: "deepseek", name: "DeepSeek", keyLabel: "DeepSeek API Key", portal: "https://platform.deepseek.com", tag: "高性价比 · 深度思考" },
  { id: "zhipu", name: "智谱 GLM", keyLabel: "智谱 API Key", portal: "https://open.bigmodel.cn", tag: "GLM-4V · 支持识图" },
  { id: "qwen", name: "通义千问", keyLabel: "阿里云百炼 API Key", portal: "https://bailian.console.aliyun.com", tag: "千问大模型 · 视觉/推理" },
  { id: "siliconflow", name: "硅基流动", keyLabel: "SiliconFlow API Key", portal: "https://cloud.siliconflow.cn", tag: "满血 R1/V3 · 多模型" },
  { id: "moonshot", name: "月之暗面", keyLabel: "Moonshot API Key", portal: "https://platform.moonshot.cn", tag: "Kimi · 超长上下文" }
];

export const AI_KEY_SESSION_KEYS = {
  deepseek: "fitcycle_deepseek_session_key",
  zhipu: "fitcycle_zhipu_session_key",
  qwen: "fitcycle_qwen_session_key",
  siliconflow: "fitcycle_siliconflow_session_key",
  moonshot: "fitcycle_moonshot_session_key"
};

const MODEL_SESSION_KEYS = {
  deepseek: "fitcycle_deepseek_model",
  zhipu: "fitcycle_zhipu_model",
  qwen: "fitcycle_qwen_model",
  siliconflow: "fitcycle_siliconflow_model",
  moonshot: "fitcycle_moonshot_model"
};

const CACHED_MODELS_KEYS = {
  deepseek: "fitcycle_deepseek_models_cache",
  zhipu: "fitcycle_zhipu_models_cache",
  qwen: "fitcycle_qwen_models_cache",
  siliconflow: "fitcycle_siliconflow_models_cache",
  moonshot: "fitcycle_moonshot_models_cache"
};

const PROVIDER_SESSION_KEY = "fitcycle_ai_provider";
const LEGACY_OPENROUTER_KEYS = ["fitcycle_openrouter_session_key", "fitcycle_openrouter_model"];

export const DEFAULT_PRESET_MODELS = {
  deepseek: [
    {
      id: "deepseek-chat",
      name: "DeepSeek-V3 (通用对话)",
      description: "高性价比通用大模型，支持工具调用与训练数据感知",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "deepseek-reasoner",
      name: "DeepSeek-R1 (深度思考)",
      description: "深度推理与思维链模型，适合动作逻辑分析与复盘",
      capabilities: { text: true, image: false, tools: false, streaming: true, reasoning: true }
    }
  ],
  zhipu: [
    {
      id: "glm-4-plus",
      name: "GLM-4-Plus (高智能旗舰)",
      description: "智谱顶级通用全功能模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4v-plus",
      name: "GLM-4V-Plus (视觉识图旗舰)",
      description: "智谱顶级多模态模型，支持身材与动作识别",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4v",
      name: "GLM-4V (多模态识图)",
      description: "多模态图像识别与图文分析",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4v-flash",
      name: "GLM-4V-Flash (极速识图)",
      description: "极速响应多模态识图模型",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4-air",
      name: "GLM-4-Air (高性价比旗舰)",
      description: "高性价比纯文本通用模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4-flash",
      name: "GLM-4-Flash (免费极速纯文本)",
      description: "极速响应免费纯文本模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4-flashx",
      name: "GLM-4-FlashX (极速增强纯文本)",
      description: "超快推理纯文本模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4-long",
      name: "GLM-4-Long (百万超长上下文)",
      description: "超长上下文长文档处理",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-zero-preview",
      name: "GLM-Zero-Preview (深度思考推理)",
      description: "智谱思维链深度推理模型",
      capabilities: { text: true, image: false, tools: false, streaming: true, reasoning: true }
    }
  ],
  qwen: [
    {
      id: "qwen-max",
      name: "通义千问 Max (旗舰推理)",
      description: "阿里云百炼顶级大模型，擅长复杂推导与计划制定",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "qwen-plus",
      name: "通义千问 Plus (主力均衡)",
      description: "性能均衡的高通用性大模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "qwen-turbo",
      name: "通义千问 Turbo (极速轻量)",
      description: "百炼极速响应大模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "qwen-vl-max",
      name: "Qwen-VL-Max (视觉识图旗舰)",
      description: "通义千问最强多模态视觉大模型，支持精准识图",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "qwen-vl-plus",
      name: "Qwen-VL-Plus (视觉识图通用)",
      description: "通义千问通用视觉大模型，支持图片识别",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "qwen2.5-vl-72b-instruct",
      name: "Qwen2.5-VL-72B (顶级开源视觉)",
      description: "最强开源视觉模型，高精度图片理解",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "qwq-32b-preview",
      name: "QwQ-32B-Preview (深度思考推理)",
      description: "通义千问深度推理模型，展示完整思维链",
      capabilities: { text: true, image: false, tools: false, streaming: true, reasoning: true }
    },
    {
      id: "qwen-long",
      name: "通义千问 Long (百万长文本)",
      description: "超长上下文长文档处理",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    }
  ],
  siliconflow: [
    {
      id: "deepseek-ai/DeepSeek-V3",
      name: "DeepSeek-V3 (满血 671B)",
      description: "硅基流动托管满血 DeepSeek-V3",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "deepseek-ai/DeepSeek-R1",
      name: "DeepSeek-R1 (满血 671B 深度思考)",
      description: "硅基流动托管满血 DeepSeek-R1 深度推理",
      capabilities: { text: true, image: false, tools: false, streaming: true, reasoning: true }
    },
    {
      id: "Qwen/Qwen2.5-VL-72B-Instruct",
      name: "Qwen2.5-VL-72B (多模态识图)",
      description: "通义千问开源最强视觉模型",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "Qwen/Qwen2.5-72B-Instruct",
      name: "Qwen2.5-72B-Instruct",
      description: "通义千问 72B 纯文本对话模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "Qwen/QwQ-32B-Preview",
      name: "QwQ-32B-Preview (深度推理)",
      description: "千问深度思考模型",
      capabilities: { text: true, image: false, tools: false, streaming: true, reasoning: true }
    },
    {
      id: "THUDM/glm-4-9b-chat",
      name: "GLM-4-9B-Chat (智谱开源)",
      description: "智谱开源通用模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    }
  ],
  moonshot: [
    {
      id: "moonshot-v1-auto",
      name: "Kimi Auto (智能上下文)",
      description: "月之暗面智能自适应长文本大模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "moonshot-v1-8k",
      name: "Kimi 8K",
      description: "通用 8K 上下文对话模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "moonshot-v1-32k",
      name: "Kimi 32K",
      description: "32K 长文本处理大模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "moonshot-v1-128k",
      name: "Kimi 128K",
      description: "128K 超长上下文大模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
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

const initApiKeys = {};
const initSelectedModelIds = {};
const initModelsByProvider = {};

AI_PROVIDERS.forEach(({ id }) => {
  initApiKeys[id] = readStorageValue(AI_KEY_SESSION_KEYS[id]);
  const models = readCachedModels(id);
  initModelsByProvider[id] = models;
  initSelectedModelIds[id] = readStorageValue(MODEL_SESSION_KEYS[id]) || (models[0]?.id || "");
});

const currentKey = initApiKeys[initActiveProvider];

export const aiSession = reactive({
  activeProvider: initActiveProvider,
  apiKeys: initApiKeys,
  selectedModelIds: initSelectedModelIds,
  modelsByProvider: initModelsByProvider,
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

