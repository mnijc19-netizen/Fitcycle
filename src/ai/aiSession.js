import { reactive } from "vue";
import { store } from "../store/fitnessStore.js";
import { normalizeProviderModel } from "./modelCapabilities.js";

export const AI_PROVIDERS = [
  {
    id: "deepseek",
    name: "DeepSeek",
    keyLabel: "DeepSeek API Key",
    portal: "https://platform.deepseek.com",
    tag: "高性价比 · 深度思考",
    billingType: "tokens_only",
    billingBadge: "精确 Token 审计",
    billingDesc: "官方服务端物理回传 Token 消耗，单价与充值余额请参照官方控制台"
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    keyLabel: "OpenRouter API Key",
    portal: "https://openrouter.ai/keys",
    tag: "全网模型汇聚 · 自由路由",
    billingType: "tokens_and_cost",
    billingBadge: "Token + 实时金额",
    billingDesc: "官方原生提供实时模型定价，支持按 Token 真实精确换算消费金额"
  },
  {
    id: "zhipu",
    name: "智谱 GLM",
    keyLabel: "智谱 API Key",
    portal: "https://open.bigmodel.cn",
    tag: "GLM-4V · 支持识图",
    billingType: "tokens_only",
    billingBadge: "精确 Token 审计",
    billingDesc: "官方服务端物理回传 Token 消耗，单价与充值余额请参照官方控制台"
  },
  {
    id: "qwen",
    name: "通义千问",
    keyLabel: "阿里云百炼 API Key",
    portal: "https://bailian.console.aliyun.com",
    tag: "千问大模型 · 视觉/推理",
    billingType: "tokens_only",
    billingBadge: "精确 Token 审计",
    billingDesc: "官方服务端物理回传 Token 消耗，单价与充值余额请参照官方控制台"
  },
  {
    id: "siliconflow",
    name: "硅基流动",
    keyLabel: "SiliconFlow API Key",
    portal: "https://cloud.siliconflow.cn",
    tag: "满血 R1/V3 · 多模型",
    billingType: "tokens_only",
    billingBadge: "精确 Token 审计",
    billingDesc: "官方服务端物理回传 Token 消耗，单价与充值余额请参照官方控制台"
  },
  {
    id: "moonshot",
    name: "月之暗面",
    keyLabel: "Moonshot API Key",
    portal: "https://platform.moonshot.cn",
    tag: "Kimi · 超长上下文",
    billingType: "tokens_only",
    billingBadge: "精确 Token 审计",
    billingDesc: "官方服务端物理回传 Token 消耗，单价与充值余额请参照官方控制台"
  },
  {
    id: "vercel_ai_gateway",
    name: "Vercel AI Gateway",
    keyLabel: "AI Gateway API Key",
    portal: "https://vercel.com/docs/ai-gateway",
    tag: "全球聚合 · 多模型极速网关",
    billingType: "tokens_only",
    billingBadge: "精确 Token 审计",
    billingDesc: "官方服务端物理回传 Token 消耗，单价与充值余额请参照官方控制台"
  }
];

export const AI_KEY_SESSION_KEYS = {
  deepseek: "fitcycle_deepseek_session_key",
  zhipu: "fitcycle_zhipu_session_key",
  qwen: "fitcycle_qwen_session_key",
  siliconflow: "fitcycle_siliconflow_session_key",
  moonshot: "fitcycle_moonshot_session_key",
  vercel_ai_gateway: "fitcycle_vercel_ai_gateway_session_key",
  openrouter: "fitcycle_openrouter_session_key"
};

const MODEL_SESSION_KEYS = {
  deepseek: "fitcycle_deepseek_model",
  zhipu: "fitcycle_zhipu_model",
  qwen: "fitcycle_qwen_model",
  siliconflow: "fitcycle_siliconflow_model",
  moonshot: "fitcycle_moonshot_model",
  vercel_ai_gateway: "fitcycle_vercel_ai_gateway_model",
  openrouter: "fitcycle_openrouter_model"
};

const CACHED_MODELS_KEYS = {
  deepseek: "fitcycle_deepseek_models_cache",
  zhipu: "fitcycle_zhipu_models_cache",
  qwen: "fitcycle_qwen_models_cache",
  siliconflow: "fitcycle_siliconflow_models_cache",
  moonshot: "fitcycle_moonshot_models_cache",
  vercel_ai_gateway: "fitcycle_vercel_ai_gateway_models_cache",
  openrouter: "fitcycle_openrouter_models_cache"
};

const PROVIDER_SESSION_KEY = "fitcycle_ai_provider";

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
      id: "glm-4.5-air",
      name: "GLM-4.5-Air (智能体与深度思考)",
      description: "106B参数高性价比智能体模型，支持深度思考与工具调用 (1200万专享包)",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: true }
    },
    {
      id: "glm-4.6v",
      name: "GLM-4.6V (多模态视觉旗舰 · 106B)",
      description: "新一代视觉多模态大模型，原生支持高精识图与工具调用 (600万专享包)",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4.6v-flash",
      name: "GLM-4.6V-Flash (极速多模态)",
      description: "极速轻量多模态视觉识图模型",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4.5",
      name: "GLM-4.5 (新一代旗舰全能)",
      description: "智谱新一代通用旗舰基座模型",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "glm-4.5v",
      name: "GLM-4.5V (多模态图文)",
      description: "多模态视觉分析与图文理解",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
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
  ],
  vercel_ai_gateway: [
    {
      id: "google/gemini-2.0-flash",
      name: "Gemini 2.0 Flash (极速识图全能)",
      description: "超快响应延迟，原生支持高精器械识图与训练数据感知",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "openai/gpt-4o-mini",
      name: "GPT-4o mini (高性价比主力)",
      description: "极速且经济，支持图文理解与日常动作记录",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "openai/gpt-4o",
      name: "GPT-4o (多模态旗舰)",
      description: "顶级全能多模态旗舰，复杂器械结构与动作高精解析",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "anthropic/claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet (高智能图文)",
      description: "卓越的逻辑推演与视觉图表解析",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "deepseek/deepseek-chat",
      name: "DeepSeek-V3 (极速纯文本)",
      description: "极高性价比纯文本通用模型，支持工具感知",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false }
    },
    {
      id: "deepseek/deepseek-reasoner",
      name: "DeepSeek-R1 (深度思维链)",
      description: "满血思维链推理，周期瓶颈与复杂动作力线深度推演",
      capabilities: { text: true, image: false, tools: false, streaming: true, reasoning: true }
    }
  ],
  openrouter: [
    {
      id: "google/gemini-2.0-flash-001",
      name: "Gemini 2.0 Flash (极速识图全能)",
      description: "超快响应延迟，原生支持高精器械识图与训练数据感知",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false },
      pricing: { prompt: "0.0000001", completion: "0.0000004" }
    },
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet (高智能图文)",
      description: "卓越的逻辑推演与视觉图表解析",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false },
      pricing: { prompt: "0.000003", completion: "0.000015" }
    },
    {
      id: "deepseek/deepseek-chat",
      name: "DeepSeek-V3 (极速纯文本)",
      description: "极高性价比纯文本通用模型，支持工具感知",
      capabilities: { text: true, image: false, tools: true, streaming: true, reasoning: false },
      pricing: { prompt: "0.00000014", completion: "0.00000028" }
    },
    {
      id: "deepseek/deepseek-r1",
      name: "DeepSeek-R1 (深度思维链)",
      description: "满血思维链推理，周期瓶颈与复杂动作力线深度推演",
      capabilities: { text: true, image: false, tools: false, streaming: true, reasoning: true },
      pricing: { prompt: "0.00000055", completion: "0.00000219" }
    },
    {
      id: "openai/gpt-4o",
      name: "GPT-4o (多模态旗舰)",
      description: "顶级全能多模态旗舰，复杂器械结构与动作高精解析",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false },
      pricing: { prompt: "0.0000025", completion: "0.00001" }
    },
    {
      id: "openai/gpt-4o-mini",
      name: "GPT-4o mini (高性价比主力)",
      description: "极速且经济，支持图文理解与日常动作记录",
      capabilities: { text: true, image: true, tools: true, streaming: true, reasoning: false },
      pricing: { prompt: "0.00000015", completion: "0.0000006" }
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

export function isProviderSyncedFromAPI(provider) {
  try {
    const raw = readStorageValue(CACHED_MODELS_KEYS[provider]);
    return Boolean(raw && JSON.parse(raw)?.length > 0);
  } catch {
    return false;
  }
}

export function readCachedModels(provider) {
  try {
    const raw = readStorageValue(CACHED_MODELS_KEYS[provider]);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // API dynamically recognized models take authoritative precedence!
        // Always re-evaluate capabilities with the latest engine so any updates apply immediately:
        return parsed.map((m) => normalizeProviderModel(provider, m));
      }
    }
  } catch {}
  
  // Fallback defaults only when user has never fetched from API
  const defaults = DEFAULT_PRESET_MODELS[provider] ? JSON.parse(JSON.stringify(DEFAULT_PRESET_MODELS[provider])) : [];
  return defaults.map((m) => normalizeProviderModel(provider, m));
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
  pendingAutoRun: false,
  connectionState: currentKey ? "connected" : "idle",
  connectionMessage: "",
  clearRevision: 0,
  conversation: [],
  apiMessages: []
});

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

export function addCustomModel(modelId, modelName = "", provider = aiSession.activeProvider) {
  const cleanId = typeof modelId === "string" ? modelId.trim() : "";
  if (!cleanId) return null;
  const currentModels = [...getActiveModels()];
  let existing = currentModels.find((m) => m.id.toLowerCase() === cleanId.toLowerCase());
  if (!existing) {
    const rawModel = {
      id: cleanId,
      name: (typeof modelName === "string" && modelName.trim()) ? modelName.trim() : cleanId,
      description: "用户自定义添加模型"
    };
    const newModel = normalizeProviderModel(provider, rawModel);
    currentModels.unshift(newModel);
    setProviderModels(currentModels, provider);
    existing = newModel;
  }
  setSelectedModel(existing.id, provider);
  return existing;
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
  aiSession.connectionState = "idle";
  aiSession.connectionMessage = "";
  clearConversation();
  aiSession.clearRevision += 1;
}

/**
 * 1-click invocation of AI coach with user physiological profile and current exercise context.
 * 
 * @param {Object} options - { prompt: string, autoRun?: boolean, exercise?: Object, userProfile?: Object }
 * @returns {{ success: boolean, fullPromptText: string, conversationId: string }}
 */
export function openAICoachWithContext(options = {}) {
  const opts = options || {};
  const { prompt = "", autoRun = true, exercise = null, userProfile = null } = opts;

  let profile = userProfile;
  if (!profile && typeof store !== "undefined" && store?.settings) {
    profile = store.settings;
  }

  let fullPromptText = "";
  const metaSections = [];

  if (profile) {
    const height = profile.userHeight || 175;
    const weight = profile.userWeight || 70;
    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
    const goalMap = {
      hypertrophy: "肌肥大增肌",
      fat_loss: "高效减脂塑形",
      strength: "纯力量突破"
    };
    const levelMap = {
      beginner: "新手筑基",
      intermediate: "中阶进阶",
      advanced: "高阶健力",
      custom: "自定义水平"
    };
    metaSections.push(`【学员生理档案】身高: ${height}cm, 体重: ${weight}kg (BMI: ${bmi}) | 训练阶段: ${levelMap[profile.strengthLevel] || profile.strengthLevel || '中阶'} | 目标: ${goalMap[profile.trainingGoal] || profile.trainingGoal || '增肌'}`);
  }

  if (exercise) {
    let exStr = `【当前咨询动作】${exercise.name}`;
    if (exercise.englishName) exStr += ` (${exercise.englishName})`;
    if (exercise.category) exStr += ` | 部位: ${exercise.category}`;
    if (exercise.target) exStr += ` | 目标肌群: ${exercise.target}`;
    metaSections.push(exStr);
    if (exercise.scienceDetail) {
      metaSections.push(`【动作力学背景】${exercise.scienceDetail}`);
    }
  }

  const userQuestion = prompt || (exercise ? `请为我详细讲解【${exercise.name}】的标准力线走向、呼吸配合与避免代偿的关键要点。` : "请指导我的健身训练。");

  if (metaSections.length > 0) {
    fullPromptText = `${metaSections.join("\n")}\n\n【学员提问】\n${userQuestion}`;
  } else {
    fullPromptText = userQuestion;
  }

  aiSession.apiMessages.push({
    role: "user",
    content: fullPromptText
  });

  const displayBubbleText = prompt || (exercise ? `请指导【${exercise.name}】动作要领` : "请指导我的健身训练");

  aiSession.conversation.push({
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    role: "user",
    text: displayBubbleText
  });

  aiSession.pendingAutoRun = Boolean(autoRun);
  aiSession.drawerOpen = true;

  return {
    success: true,
    fullPromptText,
    conversationId: aiSession.conversation[aiSession.conversation.length - 1]?.id
  };
}


