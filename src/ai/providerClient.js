import { isSupportedChatModel, normalizeProviderModel } from "./modelCapabilities.js";

export const PROVIDER_CONFIGS = {
  deepseek: {
    name: "DeepSeek",
    apiBase: "https://api.deepseek.com"
  },
  zhipu: {
    name: "智谱 GLM",
    apiBase: "https://open.bigmodel.cn/api/paas/v4"
  }
};

export class AIProviderError extends Error {
  constructor(message, status = 0, code = "provider_error") {
    super(message);
    this.name = "AIProviderError";
    this.status = status;
    this.code = code;
  }
}

function getProviderConfig(provider, overrideBase) {
  const config = PROVIDER_CONFIGS[provider];
  if (!config) throw new AIProviderError("不支持的 AI 提供商", 0, "unknown_provider");
  return { ...config, apiBase: overrideBase || config.apiBase };
}

function requestHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
}

function safeFailure(providerName, status) {
  if (status === 401 || status === 403) return `${providerName} API Key 无效或没有访问权限`;
  if (status === 429) return `${providerName} 请求过于频繁或额度不足`;
  return `${providerName} 请求失败（HTTP ${status || "网络错误"}）`;
}

export async function fetchProviderModels(provider, apiKey, options = {}) {
  if (!apiKey) throw new AIProviderError("请先输入 API Key", 0, "missing_key");
  const config = getProviderConfig(provider, options.apiBase);
  const fetchImpl = options.fetchImpl || fetch;
  let response;
  try {
    response = await fetchImpl(`${config.apiBase}/models`, {
      headers: requestHeaders(apiKey),
      signal: options.signal
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new AIProviderError(`无法连接${config.name}，请检查网络后重试`, 0, "network_error");
  }
  if (!response.ok) throw new AIProviderError(safeFailure(config.name, response.status), response.status);

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new AIProviderError(`${config.name}返回了无法解析的模型列表`, response.status, "invalid_response");
  }
  if (!Array.isArray(payload?.data)) {
    throw new AIProviderError(`${config.name}模型列表格式异常`, response.status, "invalid_response");
  }
  return payload.data
    .filter((model) => isSupportedChatModel(provider, model))
    .map((model) => normalizeProviderModel(provider, model))
    .filter((model) => model.id && model.capabilities.text && model.capabilities.streaming);
}

function mergeToolCall(target, delta) {
  const index = Number.isInteger(delta?.index) ? delta.index : target.length;
  if (!target[index]) target[index] = { id: "", type: "function", function: { name: "", arguments: "" } };
  const current = target[index];
  if (delta.id) current.id += delta.id;
  if (delta.type) current.type = delta.type;
  if (delta.function?.name) current.function.name += delta.function.name;
  if (delta.function?.arguments) current.function.arguments += delta.function.arguments;
}

export async function streamProviderChatCompletion(request, options = {}) {
  const { provider, apiKey, model, messages, tools, signal, onToken } = request;
  const config = getProviderConfig(provider, options.apiBase);
  if (!apiKey) throw new AIProviderError(`请先连接${config.name}`, 0, "missing_key");
  if (!model) throw new AIProviderError("请先选择模型", 0, "missing_model");

  const body = { model, messages, stream: true };
  if (provider === "deepseek") body.thinking = { type: "disabled" };
  if (Array.isArray(tools) && tools.length) {
    body.tools = tools;
    body.tool_choice = "auto";
    body.parallel_tool_calls = false;
  }

  const fetchImpl = options.fetchImpl || fetch;
  let response;
  try {
    response = await fetchImpl(`${config.apiBase}/chat/completions`, {
      method: "POST",
      headers: requestHeaders(apiKey),
      body: JSON.stringify(body),
      signal
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new AIProviderError(`无法连接${config.name}，请检查网络后重试`, 0, "network_error");
  }
  if (!response.ok) throw new AIProviderError(safeFailure(config.name, response.status), response.status);
  if (!response.body?.getReader) throw new AIProviderError("当前浏览器无法读取流式响应", response.status, "stream_unavailable");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const toolCalls = [];
  let buffer = "";
  let content = "";
  let finishReason = null;

  const processEvent = (rawEvent) => {
    const dataLines = rawEvent.split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim());
    for (const dataText of dataLines) {
      if (!dataText || dataText === "[DONE]") continue;
      let payload;
      try {
        payload = JSON.parse(dataText);
      } catch {
        continue;
      }
      const choice = payload?.choices?.[0];
      const delta = choice?.delta || {};
      if (typeof delta.content === "string") {
        content += delta.content;
        onToken?.(delta.content);
      }
      if (Array.isArray(delta.tool_calls)) delta.tool_calls.forEach((toolCall) => mergeToolCall(toolCalls, toolCall));
      if (choice?.finish_reason) finishReason = choice.finish_reason;
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() || "";
    events.forEach(processEvent);
    if (done) break;
  }
  if (buffer.trim()) processEvent(buffer);

  return { content, toolCalls: toolCalls.filter(Boolean), finishReason };
}

