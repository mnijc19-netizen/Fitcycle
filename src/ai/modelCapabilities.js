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
    const isReasoning = id.includes("zero");
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
  if (id.includes("embedding") || id.includes("tts") || id.includes("asr") || id.includes("rerank") || id.includes("ocr") || id.includes("image") || id.startsWith("cogview")) return false;
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
