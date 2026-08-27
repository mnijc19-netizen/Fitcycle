function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getModelCapabilities(model) {
  const architecture = model?.architecture || {};
  const input = asArray(architecture.input_modalities).map(String);
  const output = asArray(architecture.output_modalities).map(String);
  const parameters = asArray(model?.supported_parameters).map(String);
  const modality = typeof architecture.modality === "string" ? architecture.modality : "";

  return {
    text: input.includes("text") || modality.startsWith("text") || input.length === 0,
    image: input.includes("image") || modality.split("->")[0]?.includes("image"),
    tools: parameters.includes("tools"),
    streaming: output.includes("text") || modality.endsWith("text") || output.length === 0
  };
}

export function normalizeOpenRouterModel(model) {
  return {
    id: String(model?.id || ""),
    name: String(model?.name || model?.id || "未命名模型"),
    description: String(model?.description || ""),
    contextLength: Number(model?.context_length) || null,
    pricing: model?.pricing || null,
    capabilities: getModelCapabilities(model),
    raw: model
  };
}

export function filterModels(models, searchText) {
  const query = String(searchText || "").trim().toLowerCase();
  if (!query) return models;
  return models.filter((model) =>
    `${model.name} ${model.id} ${model.description}`.toLowerCase().includes(query)
  );
}

export function getMessageBlockReason({ apiKey, model, text, imageCount = 0 }) {
  if (!apiKey) return "请先在设置页连接 OpenRouter。";
  if (!model) return "请先在设置页选择模型。";
  if (!String(text || "").trim() && imageCount === 0) return "请输入内容或选择图片。";
  if (imageCount > 0 && !model.capabilities?.image) return "当前模型不支持图片输入，请移除图片或更换模型。";
  return "";
}
