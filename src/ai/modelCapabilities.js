function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function familyCapabilities(provider, modelId) {
  const id = String(modelId || "").toLowerCase();
  
  if (provider === "zhipu") {
    // Strictly Zhipu Vision series (GLM-4V / GLM-4.5V / GLM-4.6V / GLM-4V-Plus / GLM-4V-Flash) support image recognition
    // Pure text models (GLM-4-Flash, GLM-4-Plus, GLM-4-Air, GLM-4-Long, GLM-Zero) DO NOT support image
    const isImageSupported = /\d+(?:\.\d+)?v/i.test(id) || id.includes("visual") || id.includes("vision");
    const isToolsSupported = !id.includes("zero") && !id.includes("embedding");
    const isReasoning = id.includes("zero") || id.includes("4.5-air") || id.includes("reason");
    return { image: isImageSupported, tools: isToolsSupported, reasoning: isReasoning };
  }
  
  if (provider === "qwen") {
    // Qwen vision: qwen-vl-*, qwen2.5-vl-*, qwen-omni-*
    const isImageSupported = id.includes("-vl") || id.includes("omni") || id.includes("vision");
    const isToolsSupported = !id.includes("qwq");
    const isReasoning = id.includes("qwq");
    return { image: isImageSupported, tools: isToolsSupported, reasoning: isReasoning };
  }
  
  if (provider === "siliconflow") {
    const isImageSupported = id.includes("-vl") || id.includes("vision") || id.includes("4v");
    const isToolsSupported = !id.includes("r1") && !id.includes("reasoner") && !id.includes("qwq");
    const isReasoning = id.includes("r1") || id.includes("reasoner") || id.includes("qwq");
    return { image: isImageSupported, tools: isToolsSupported, reasoning: isReasoning };
  }
  
  if (provider === "deepseek") {
    return { image: false, tools: id === "deepseek-chat", reasoning: id === "deepseek-reasoner" };
  }
  
  if (provider === "moonshot") {
    return { image: false, tools: true, reasoning: false };
  }
  
  if (provider === "vercel_ai_gateway") {
    // Vercel AI Gateway format: <creator>/<model-name>
    // e.g. google/gemini-2.0-flash, openai/gpt-4o-mini, anthropic/claude-3-5-sonnet, deepseek/deepseek-reasoner
    const isImageSupported =
      id.includes("gemini") ||
      id.includes("gpt-4o") ||
      id.includes("gpt-4-turbo") ||
      id.includes("claude-3") ||
      id.includes("-vl") ||
      id.includes("vision") ||
      /\d+(?:\.\d+)?v/i.test(id) ||
      id.includes("multimodal");

    const isReasoning =
      id.includes("reasoner") ||
      id.includes("r1") ||
      id.includes("/o1") ||
      id.includes("/o3") ||
      id.includes("qwq") ||
      id.includes("thinking") ||
      id.includes("thought");

    const isToolsSupported =
      !id.includes("reasoner") &&
      !id.includes("r1") &&
      !id.includes("o1-preview") &&
      !id.includes("o1-mini") &&
      !id.includes("embedding");

    return { image: isImageSupported, tools: isToolsSupported, reasoning: isReasoning };
  }
  
  return { image: false, tools: true, reasoning: false };
}

export function getModelCapabilities(model, provider = "") {
  const architecture = model?.architecture || {};
  const input = asArray(architecture.input_modalities || model?.input_modalities).map(String);
  const output = asArray(architecture.output_modalities || model?.output_modalities).map(String);
  const parameters = asArray(model?.supported_parameters || model?.features).map(String);
  const modality = typeof architecture.modality === "string" ? architecture.modality : "";
  const id = String(model?.id || "");
  const family = familyCapabilities(provider, id);

  const isArchitectureImage = input.includes("image") || modality.split("->")[0]?.includes("image");

  return {
    text: input.includes("text") || modality.startsWith("text") || input.length === 0,
    image: isArchitectureImage || family.image,
    tools: parameters.includes("tools") || parameters.includes("function_calling") || family.tools,
    reasoning: family.reasoning,
    streaming: model?.supports_streaming !== false && (output.includes("text") || modality.endsWith("text") || output.length === 0)
  };
}

export function normalizeProviderModel(provider, model) {
  const capabilities = getModelCapabilities(model, provider);
  
  return {
    id: String(model?.id || ""),
    name: String(model?.name || model?.id || "未命名模型"),
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
  if (id.includes("embedding") || id.includes("tts") || id.includes("asr") || id.includes("rerank") || id.includes("ocr") || id.includes("image") || id.includes("dall-e") || id.startsWith("cogview")) return false;
  return true;
}

export function filterModels(models, searchText) {
  const query = String(searchText || "").trim().toLowerCase();
  if (!query) return models;
  return models.filter((model) =>
    `${model.name} ${model.id} ${model.description}`.toLowerCase().includes(query)
  );
}

export function getMessageBlockReason({ apiKey, model, text, imageCount = 0 }) {
  if (!apiKey) return "请先在设置页连接 AI 提供商。";
  if (!model) return "请先在设置页选择模型。";
  if (!String(text || "").trim() && imageCount === 0) return "请输入内容或选择图片。";
  if (imageCount > 0 && !model.capabilities?.image) return "当前模型不支持图片输入，请移除图片或更换模型。";
  return "";
}

export const MODEL_STRATEGIES = [
  { id: "all", name: "全部", icon: "✦", description: "查看所有可用大模型" },
  { id: "speed", name: "极速全能", icon: "⚡", description: "秒级极速响应，支持动作打卡与训练数据感知，高性价比日常首选" },
  { id: "vision", name: "视觉识图", icon: "👁️", description: "多模态视觉识别，支持健身房器械拍照、身材体态与饮食分析" },
  { id: "reasoning", name: "深度思考", icon: "🧠", description: "原生思维链，用于多周力量大周期规划与突破顽固瓶颈" }
];

export function getModelStrategy(model, provider = "") {
  const caps = model?.capabilities || getModelCapabilities(model, provider);
  if (caps.reasoning) {
    return {
      id: "reasoning",
      name: "深度思考",
      icon: "🧠",
      badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      hint: "思维链深度推演，突破训练瓶颈"
    };
  }
  if (caps.image) {
    return {
      id: "vision",
      name: "视觉识图",
      icon: "👁️",
      badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      hint: "支持拍照器械识别与身材分析"
    };
  }
  if (caps.tools) {
    return {
      id: "speed",
      name: "极速全能",
      icon: "⚡",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      hint: "超快响应，支持训练数据读写感知"
    };
  }
  return {
    id: "general",
    name: "通用对话",
    icon: "💬",
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

