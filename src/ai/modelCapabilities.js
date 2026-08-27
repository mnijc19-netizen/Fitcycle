function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function zhipuFamilyCapabilities(modelId) {
  const id = modelId.toLowerCase();
  // All standard Zhipu GLM-4 / GLM-5 series models and vision models support image recognition
  const isImageSupported = id.startsWith("glm-") && !/^glm-(?:code|embedding|qa)/.test(id);
  const tools = id.startsWith("glm-") && !/^glm-(?:image|ocr|tts|asr)/.test(id);
  return { image: isImageSupported, tools };
}

export function getModelCapabilities(model, provider = "") {
  const architecture = model?.architecture || {};
  const input = asArray(architecture.input_modalities || model?.input_modalities).map(String);
  const output = asArray(architecture.output_modalities || model?.output_modalities).map(String);
  const parameters = asArray(model?.supported_parameters || model?.features).map(String);
  const modality = typeof architecture.modality === "string" ? architecture.modality : "";
  const id = String(model?.id || "");
  const family = provider === "zhipu" ? zhipuFamilyCapabilities(id) : { image: false, tools: provider === "deepseek" };

  return {
    text: input.includes("text") || modality.startsWith("text") || input.length === 0,
    image: input.includes("image") || modality.split("->")[0]?.includes("image") || family.image,
    tools: parameters.includes("tools") || parameters.includes("function_calling") || family.tools,
    streaming: model?.supports_streaming !== false && (output.includes("text") || modality.endsWith("text") || output.length === 0)
  };
}

export function normalizeProviderModel(provider, model) {
  return {
    id: String(model?.id || ""),
    name: String(model?.name || model?.id || "未命名模型"),
    description: String(model?.description || (provider === "deepseek" ? "DeepSeek 官方模型" : "智谱 GLM 官方模型")),
    contextLength: Number(model?.context_length) || null,
    pricing: model?.pricing || null,
    provider,
    capabilities: getModelCapabilities(model, provider),
    raw: model
  };
}

export function isSupportedChatModel(provider, model) {
  const id = String(model?.id || "").toLowerCase();
  if (!id) return false;
  if (provider === "deepseek") return true;
  if (provider === "zhipu") return id.startsWith("glm-") && !/^glm-(?:image|ocr|tts|asr)/.test(id);
  return false;
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
