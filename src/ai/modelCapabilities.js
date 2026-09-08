function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function familyCapabilities(provider, modelId) {
  const id = String(modelId || "").toLowerCase();
  
  // ==========================================
  // A. 深度思考判定 (Reasoning / Thinking Mode)
  // ==========================================
  // Accurate token-level boundary matching for R1, o1/o3, QwQ/QvR, GLM-Zero, thinking models
  const isDeepSeekR1 = /(?:^|[\/_\-.])(?:deepseek-)?r1(?:[\/_\-.]|$)/i.test(id) || id.includes("reasoner");
  const isOpenAIReasoning = /(?:^|[\/_\-.])o[13](?:-mini|-preview)?(?:[\/_\-.]|$)/i.test(id);
  const isQwenReasoning = id.includes("qwq") || id.includes("qvr");
  const isZhipuReasoning = id.includes("zero-preview") || id.includes("glm-zero") || (provider === "zhipu" && id.includes("4.5-air"));
  const isGenericReasoning = id.includes("reasoning") || id.includes("thinking") || id.includes("thought");

  const isReasoning = isDeepSeekR1 || isOpenAIReasoning || isQwenReasoning || isZhipuReasoning || isGenericReasoning;

  // ==========================================
  // B. 多模态视觉识图判定 (Vision / Image Modality)
  // ==========================================
  let isImage = false;

  if (provider === "zhipu") {
    // Strictly Zhipu Vision series: GLM-4V / GLM-4.5V / GLM-4.6V / GLM-4V-Plus / GLM-4V-Flash
    // Pure text models: GLM-4-Flash, GLM-4-Plus, GLM-4-Air, GLM-4.5, GLM-4.5-Air, GLM-Zero DO NOT support image
    isImage = /\d+(?:\.\d+)?v(?:[\/_\-.]|$)/i.test(id) || id.includes("visual") || id.includes("vision");
  } else if (provider === "qwen") {
    // Qwen vision: qwen-vl-*, qwen2-vl-*, qwen2.5-vl-*, qwen-omni-*
    isImage = id.includes("-vl") || id.includes("_vl") || id.includes("vl-") || id.includes("vision") || id.includes("omni");
  } else if (provider === "deepseek") {
    // DeepSeek official API models (deepseek-chat V3, deepseek-reasoner R1) are pure text
    isImage = id.includes("deepseek-vl");
  } else if (provider === "moonshot") {
    // Moonshot Kimi text models
    isImage = false;
  } else {
    // Vercel AI Gateway, SiliconFlow, and universal providers
    const isGemini = id.includes("gemini");
    const isGPT4Vision = id.includes("gpt-4o") || id.includes("gpt-4-turbo") || id.includes("chatgpt-4o");
    // Full OpenAI o1 has vision, while o1-mini and o1-preview do NOT have vision
    const isO1FullVision = /(?:^|[\/_\-.])o1(?:[\/_\-.]|$)/i.test(id) && !id.includes("mini") && !id.includes("preview");
    const isClaude3Vision = id.includes("claude-3") || id.includes("claude-4");
    const isVLSuffix = id.includes("-vl") || id.includes("_vl") || id.includes("vl-") || id.includes("internvl") || id.includes("minicpm-v");
    const isExplicitVision = id.includes("vision") || id.includes("visual") || id.includes("multimodal") || id.includes("pixtral");
    const isGLMV = /\d+(?:\.\d+)?v(?:[\/_\-.]|$)/i.test(id);

    isImage = isGemini || isGPT4Vision || isO1FullVision || isClaude3Vision || isVLSuffix || isExplicitVision || isGLMV;
  }

  // ==========================================
  // C. 数据感知与工具调用 (Tools / Function Calling)
  // ==========================================
  // Pure reasoning models explicitly reject the tools parameter in Chat Completions (causes HTTP 400)
  const toolsBlocked = isDeepSeekR1 || isQwenReasoning || id.includes("o1-preview") || id.includes("o1-mini") || id.includes("zero-preview");
  const isTools = !toolsBlocked && !id.includes("embedding");

  return {
    image: isImage,
    tools: isTools,
    toolsBlocked,
    reasoning: isReasoning
  };
}

export function getModelCapabilities(model, provider = "") {
  const architecture = model?.architecture || {};
  const input = asArray(architecture.input_modalities || model?.input_modalities || model?.modalities).map(String);
  const output = asArray(architecture.output_modalities || model?.output_modalities).map(String);
  const parameters = asArray(model?.supported_parameters || model?.features).map(String);
  const modality = typeof architecture.modality === "string" ? architecture.modality : "";
  const id = String(model?.id || "");
  const family = familyCapabilities(provider, id);

  const isArchitectureImage = input.includes("image") || modality.split("->")[0]?.includes("image");

  return {
    text: input.includes("text") || modality.startsWith("text") || input.length === 0,
    image: isArchitectureImage || family.image,
    tools: (parameters.includes("tools") || parameters.includes("function_calling") || family.tools) && !family.toolsBlocked,
    reasoning: family.reasoning,
    streaming: model?.supports_streaming !== false && (output.includes("text") || modality.endsWith("text") || output.length === 0)
  };
}

const FRIENDLY_NAMES = {
  "deepseek-chat": "DeepSeek-V3 (通用对话)",
  "deepseek-reasoner": "DeepSeek-R1 (深度思考)",
  "google/gemini-2.0-flash": "Gemini 2.0 Flash (极速识图全能)",
  "google/gemini-2.0-flash-001": "Gemini 2.0 Flash (极速识图全能)",
  "openai/gpt-4o-mini": "GPT-4o mini (高性价比主力)",
  "openai/gpt-4o": "GPT-4o (多模态旗舰)",
  "anthropic/claude-3-5-sonnet": "Claude 3.5 Sonnet (高智能图文)",
  "deepseek/deepseek-chat": "DeepSeek-V3 (极速纯文本)",
  "deepseek/deepseek-reasoner": "DeepSeek-R1 (深度思维链)",
  "deepseek/deepseek-r1": "DeepSeek-R1 (深度思维链)",
  "meta-llama/llama-3.3-70b-instruct": "Llama 3.3 70B (开源顶级)",
  "mistralai/mistral-large": "Mistral Large (高智能全能)",
  "glm-4.5-air": "GLM-4.5-Air (智能体与深度思考)",
  "glm-4.6v": "GLM-4.6V (多模态视觉旗舰 · 106B)",
  "glm-4.6v-flash": "GLM-4.6V-Flash (极速多模态)",
  "glm-4-flash": "GLM-4-Flash (免费极速纯文本)",
  "glm-4-plus": "GLM-4-Plus (高智能旗舰)",
  "glm-4v-plus": "GLM-4V-Plus (视觉识图旗舰)",
  "glm-zero-preview": "GLM-Zero-Preview (深度思考推理)",
  "qwen-max": "通义千问 Max (旗舰推理)",
  "qwen-plus": "通义千问 Plus (主力均衡)",
  "qwen-turbo": "通义千问 Turbo (极速轻量)",
  "qwen-vl-max": "Qwen-VL-Max (视觉识图旗舰)",
  "qwen-vl-plus": "Qwen-VL-Plus (视觉识图通用)",
  "qwq-32b-preview": "QwQ-32B-Preview (深度思考推理)",
  "moonshot-v1-auto": "Kimi Auto (智能上下文)"
};

export function formatModelDisplayName(id, fallbackName = "") {
  const cleanId = String(id || "");
  if (FRIENDLY_NAMES[cleanId]) return FRIENDLY_NAMES[cleanId];
  if (fallbackName && fallbackName !== cleanId) return fallbackName;
  return cleanId;
}

export function normalizeProviderModel(provider, model) {
  const id = String(model?.id || "");
  const capabilities = getModelCapabilities(model, provider);
  const name = formatModelDisplayName(id, model?.name);
  
  return {
    id,
    name,
    description: String(model?.description || `${provider} 官方模型`),
    contextLength: Number(model?.context_length) || null,
    pricing: model?.pricing || null,
    provider,
    capabilities,
    raw: model
  };
}

export function isSupportedChatModel(provider, model) {
  const id = String(model?.id || "").toLowerCase();
  if (!id) return false;
  // Exclude non-chat models (embeddings, audio/tts, image/video generation, rerankers)
  const isNonChat =
    id.includes("embedding") ||
    id.includes("bge-") ||
    id.includes("tts") ||
    id.includes("asr") ||
    id.includes("whisper") ||
    id.includes("rerank") ||
    id.includes("ocr") ||
    id.includes("dall-e") ||
    id.startsWith("cogview") ||
    id.includes("cogvideox") ||
    id.includes("stable-diffusion") ||
    id.includes("flux") ||
    id.includes("midjourney") ||
    id.includes("imagen-") ||
    id.includes("glm-image");

  return !isNonChat;
}

export function normalizeSearchToken(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[-_/. ]+/g, "");
}

export function getModelCreator(model) {
  const id = String(model?.id || "");
  if (id.includes("/")) {
    const prefix = id.split("/")[0].toLowerCase();
    const map = {
      openai: "OpenAI",
      google: "Google",
      anthropic: "Anthropic",
      deepseek: "DeepSeek",
      alibaba: "Alibaba 阿里",
      "deepseek-ai": "DeepSeek",
      "meta-llama": "Meta LLaMA",
      mistralai: "Mistral",
      cohere: "Cohere",
      "x-ai": "xAI (Grok)",
      nousresearch: "NousResearch",
      openbmb: "OpenBMB",
      opengvlab: "OpenGVLab",
      moonshot: "Moonshot",
      zhipu: "智谱 GLM",
      qwen: "通义千问"
    };
    return map[prefix] || prefix;
  }
  const prov = String(model?.provider || "");
  if (prov === "deepseek") return "DeepSeek";
  if (prov === "zhipu") return "智谱 GLM";
  if (prov === "qwen") return "通义千问";
  if (prov === "moonshot") return "月之暗面 Kimi";
  if (prov === "siliconflow") return "硅基流动";
  if (prov === "openrouter") return "OpenRouter";
  return "";
}

export function matchesModelSearch(model, searchText) {
  const rawQuery = String(searchText || "").trim().toLowerCase();
  if (!rawQuery) return true;

  const id = String(model?.id || "").toLowerCase();
  const name = String(model?.name || "").toLowerCase();
  const creator = getModelCreator(model).toLowerCase();

  // 1. Direct substring match
  if (id.includes(rawQuery) || name.includes(rawQuery) || creator.includes(rawQuery)) {
    return true;
  }

  // 2. Normalized alphanumeric match (stripping -, _, /, ., spaces)
  const normQuery = normalizeSearchToken(rawQuery);
  if (!normQuery) return true;

  const normId = normalizeSearchToken(id);
  const normName = normalizeSearchToken(name);

  if (normId.includes(normQuery) || normName.includes(normQuery)) {
    return true;
  }

  // 3. Multi-word search (e.g. "openai gpt", "gemini flash", "deepseek r1")
  const words = rawQuery.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allWordsMatch = words.every((w) => {
      const nw = normalizeSearchToken(w);
      return id.includes(w) || name.includes(w) || creator.includes(w) || normId.includes(nw) || normName.includes(nw);
    });
    if (allWordsMatch) return true;
  }

  return false;
}

export function filterModels(models, searchText) {
  if (!Array.isArray(models)) return [];
  const query = String(searchText || "").trim();
  if (!query) return models;
  return models.filter((model) => matchesModelSearch(model, query));
}

export function getMessageBlockReason({ apiKey, model, text, imageCount = 0 }) {
  if (!apiKey) return "请先在设置页连接 AI 提供商。";
  if (!model) return "请先在设置页选择模型。";
  if (!String(text || "").trim() && imageCount === 0) return "请输入内容或选择图片。";
  if (imageCount > 0 && !model.capabilities?.image) return "当前模型不支持图片输入，请移除图片或更换模型。";
  return "";
}

export const MODEL_STRATEGIES = [
  { id: "all", name: "全部", description: "查看所有可用大模型" },
  { id: "speed", name: "极速全能", description: "秒级极速响应，支持动作打卡与训练数据感知，高性价比日常首选" },
  { id: "vision", name: "视觉识图", description: "多模态视觉识别，支持健身房器械拍照、身材体态与饮食分析" },
  { id: "reasoning", name: "深度思考", description: "原生思维链，用于多周力量大周期规划与突破顽固瓶颈" }
];

export function getModelStrategy(model, provider = "") {
  const caps = model?.capabilities || getModelCapabilities(model, provider);
  if (caps.reasoning) {
    return {
      id: "reasoning",
      name: "深度思考",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      hint: "思维链深度推演，突破训练瓶颈"
    };
  }
  if (caps.image) {
    return {
      id: "vision",
      name: "视觉识图",
      badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      hint: "支持拍照器械识别与身材分析"
    };
  }
  if (caps.tools) {
    return {
      id: "speed",
      name: "极速全能",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      hint: "超快响应，支持训练数据读写感知"
    };
  }
  return {
    id: "general",
    name: "通用对话",
    badgeClass: "bg-zinc-800 text-zinc-400 border-zinc-700",
    hint: "纯文本健身问答"
  };
}

export function filterModelsByStrategy(models, strategyKey) {
  if (!Array.isArray(models)) return [];
  if (!strategyKey || strategyKey === "all") return models;
  if (strategyKey === "vision") return models.filter((m) => m.capabilities?.image);
  if (strategyKey === "reasoning") return models.filter((m) => m.capabilities?.reasoning);
  if (strategyKey === "speed") {
    return models.filter((m) => m.capabilities?.tools && !m.capabilities?.reasoning);
  }
  return models;
}

export function findRecommendedVisionModel(models) {
  if (!Array.isArray(models)) return null;
  return models.find((m) => m.capabilities?.image) || null;
}

