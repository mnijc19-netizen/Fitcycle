import { isSupportedChatModel, normalizeProviderModel } from "./modelCapabilities.js";

export const PROVIDER_CONFIGS = {
  deepseek: {
    name: "DeepSeek",
    apiBase: "https://api.deepseek.com"
  },
  zhipu: {
    name: "智谱 GLM",
    apiBase: "https://open.bigmodel.cn/api/paas/v4"
  },
  qwen: {
    name: "通义千问 (阿里云百炼)",
    apiBase: "https://dashscope.aliyuncs.com/compatible-mode/v1"
  },
  siliconflow: {
    name: "硅基流动",
    apiBase: "https://api.siliconflow.cn/v1"
  },
  moonshot: {
    name: "月之暗面 Kimi",
    apiBase: "https://api.moonshot.cn/v1"
  },
  vercel_ai_gateway: {
    name: "Vercel AI Gateway",
    apiBase: "https://ai-gateway.vercel.sh/v1"
  },
  openrouter: {
    name: "OpenRouter",
    apiBase: "https://openrouter.ai/api/v1"
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

function requestHeaders(apiKey, provider = "") {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  if (provider === "openrouter") {
    headers["HTTP-Referer"] = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://fitcycle.app";
    headers["X-Title"] = "FitCycle";
  }
  return headers;
}

function safeFailure(providerName, status) {
  if (status === 401 || status === 403) return `${providerName} API Key 无效或没有访问权限`;
  if (status === 429) return `${providerName} 请求过于频繁或额度不足`;
  return `${providerName} 请求失败（HTTP ${status || "网络错误"}）`;
}

export function detectProviderFromKeyFingerprint(apiKey) {
  const key = String(apiKey || "").trim();
  if (!key) return null;

  // 1. OpenRouter keys: always start with sk-or-v1- or sk-or-
  if (/^sk-or(?:-v1)?-/i.test(key)) {
    return {
      provider: "openrouter",
      name: "OpenRouter",
      reason: "OpenRouter 专属密钥格式"
    };
  }

  // 2. Zhipu GLM keys: standard id.secret (two parts separated by a dot)
  if (key.includes(".") && key.split(".").length === 2 && !key.startsWith("sk-")) {
    return {
      provider: "zhipu",
      name: "智谱 GLM",
      reason: "智谱 GLM 专属双段签名"
    };
  }

  // 3. Vercel AI Gateway token
  if (/^v-gw-|^vercel_/i.test(key)) {
    return {
      provider: "vercel_ai_gateway",
      name: "Vercel AI Gateway",
      reason: "Vercel 网关专属密钥"
    };
  }

  return null;
}

export async function probeProviderKey(apiKey, candidateProviders = ["deepseek", "qwen", "siliconflow", "moonshot", "vercel_ai_gateway", "openrouter"], options = {}) {
  const key = String(apiKey || "").trim();
  if (!key) return null;
  const fetchImpl = options.fetchImpl || fetch;
  const timeoutMs = options.timeoutMs || 3000;

  const probeSingle = async (providerId) => {
    const config = getProviderConfig(providerId, options.apiBase);
    let signal = options.signal;
    let timeoutId;
    if (!signal && typeof AbortController !== "undefined") {
      const controller = new AbortController();
      signal = controller.signal;
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    try {
      const res = await fetchImpl(`${config.apiBase}/models`, {
        headers: requestHeaders(key, providerId),
        signal
      });
      if (timeoutId) clearTimeout(timeoutId);
      if (res.ok) {
        return { provider: providerId, name: config.name, status: res.status };
      }
      throw new Error(`Status ${res.status}`);
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      throw err;
    }
  };

  try {
    const result = await Promise.any(candidateProviders.map((p) => probeSingle(p)));
    return result;
  } catch {
    return null;
  }
}

export async function fetchProviderModels(provider, apiKey, options = {}) {
  let targetProvider = provider;
  let targetKey = apiKey;
  let targetOptions = options;

  if (typeof provider === "object" && provider !== null) {
    targetProvider = provider.provider;
    targetKey = provider.apiKey;
    targetOptions = provider.options || provider;
  }

  if (!targetKey) throw new AIProviderError("请先输入 API Key", 0, "missing_key");
  const config = getProviderConfig(targetProvider, targetOptions?.apiBase);
  const fetchImpl = targetOptions?.fetchImpl || fetch;
  let response;
  try {
    response = await fetchImpl(`${config.apiBase}/models`, {
      headers: requestHeaders(targetKey, targetProvider),
      signal: targetOptions?.signal
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
    .filter((model) => isSupportedChatModel(targetProvider, model))
    .map((model) => normalizeProviderModel(targetProvider, model))
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
  const { provider, apiKey, model, messages, tools, signal, onToken, onReasoning } = request;
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
      headers: requestHeaders(apiKey, provider),
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
  let reasoningContent = "";
  let finishReason = null;

  const processLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith("data:")) return;
    const dataText = trimmed.slice(5).trim();
    if (!dataText || dataText === "[DONE]") return;
    let payload;
    try {
      payload = JSON.parse(dataText);
    } catch {
      return;
    }
    const choice = payload?.choices?.[0];
    const delta = choice?.delta || {};

    if (delta.content) {
      content += delta.content;
      onToken?.(delta.content);
    }
    const reasoningDelta = delta.reasoning_content || delta.reasoning || delta.thought || "";
    if (typeof reasoningDelta === "string" && reasoningDelta.length > 0) {
      reasoningContent += reasoningDelta;
      onReasoning?.(reasoningDelta);
    }
    if (Array.isArray(delta.tool_calls)) {
      delta.tool_calls.forEach((call) => mergeToolCall(toolCalls, call));
    }
    if (choice?.finish_reason) {
      finishReason = choice.finish_reason;
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    lines.forEach(processLine);
  }
  if (buffer.trim()) processLine(buffer);

  return {
    content,
    reasoningContent,
    toolCalls: toolCalls.filter((c) => c && c.function?.name),
    finishReason
  };
}

export async function testProviderConnection(request, options = {}) {
  const { provider, apiKey, model } = request;
  const config = getProviderConfig(provider, options.apiBase);
  if (!apiKey) throw new AIProviderError(`请先输入${config.name} API Key`, 0, "missing_key");

  const startTime = Date.now();
  const fetchImpl = options.fetchImpl || fetch;

  // 1. If a specific model is targeted, verify with a lightweight completion ping
  if (model) {
    const body = {
      model,
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 5,
      stream: false
    };
    if (provider === "deepseek") body.thinking = { type: "disabled" };

    let response;
    try {
      response = await fetchImpl(`${config.apiBase}/chat/completions`, {
        method: "POST",
        headers: requestHeaders(apiKey, provider),
        body: JSON.stringify(body),
        signal: options.signal
      });
    } catch (error) {
      if (error?.name === "AbortError") throw error;
      throw new AIProviderError(`无法连接${config.name}，网络请求失败`, 0, "network_error");
    }

    const latencyMs = Math.max(1, Date.now() - startTime);

    if (!response.ok) {
      throw new AIProviderError(safeFailure(config.name, response.status), response.status);
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      return { success: true, latencyMs, reply: "OK", model, provider: config.name };
    }

    const reply = payload?.choices?.[0]?.message?.content || "OK";
    return {
      success: true,
      latencyMs,
      reply: String(reply).trim().slice(0, 40),
      model,
      provider: config.name
    };
  }

  // 2. Otherwise verify connection through the models list endpoint
  let response;
  try {
    response = await fetchImpl(`${config.apiBase}/models`, {
      headers: requestHeaders(apiKey, provider),
      signal: options.signal
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new AIProviderError(`无法连接${config.name}，网络请求失败`, 0, "network_error");
  }

  const latencyMs = Math.max(1, Date.now() - startTime);

  if (!response.ok) {
    throw new AIProviderError(safeFailure(config.name, response.status), response.status);
  }

  return {
    success: true,
    latencyMs,
    reply: "已成功联通官方接口",
    provider: config.name
  };
}


