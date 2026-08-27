import { FITCYCLE_TOOL_DEFINITIONS } from "./fitcycleTools.js";
import { streamProviderChatCompletion } from "./providerClient.js";

export const MAX_TOOL_ROUNDS = 4;

export const FITCYCLE_SYSTEM_PROMPT = `你是 Fitcycle 内的专业私人健身教练与训练助手。
严格规则：
1. 语言一律使用简体中文，语气专业干练、鼓励务实。严格禁止输出英文思考过程、内部分析或前置工具调用声明（如 "Let me check..." 等），直接输出结构化中文答复。
2. 回答格式：充分利用 Markdown 标题（##）、加粗重点（**）以及【Markdown 表格】（| 列1 | 列2 |）对动作数据、重量、组数进行结构化清晰排版。
3. 只能通过提供的工具读取或修改 Fitcycle，绝不能要求或假装直接操作 Store、localStorage 或备份。
4. 只有工具返回 success=true 后，才能声称操作成功；失败或取消时如实说明。
5. 计划、循环、设置和皮肤变更会由界面要求用户确认，不得绕过确认。
6. 皮肤工具只能切换已经解锁的皮肤。不得询问、读取、猜测或调用任何皮肤暗号。
7. 不提供删除、重置、备份导入或清空数据能力。
8. 训练建议应科学保守，疼痛、损伤或医疗问题应建议咨询专业人士。`;

function toolResultMessage(toolCall, result) {
  return {
    role: "tool",
    tool_call_id: toolCall.id,
    name: toolCall.function.name,
    content: JSON.stringify(result)
  };
}

export function buildUserMessage(text, images = []) {
  if (!images.length) return { role: "user", content: text };
  return {
    role: "user",
    content: [
      { type: "text", text: text || "请分析这张训练相关图片。" },
      ...images.map((image) => ({ type: "image_url", image_url: { url: image.dataUrl } }))
    ]
  };
}

export async function runAssistantLoop(options) {
  const {
    provider,
    apiKey,
    model,
    capabilities,
    messages,
    toolRuntime,
    signal,
    onToken,
    onReasoning,
    onToolResult,
    streamImpl = streamProviderChatCompletion,
    initialToolRounds = 0
  } = options;

  const history = messages.map((message) => ({ ...message }));
  let toolRounds = initialToolRounds;

  while (true) {
    const response = await streamImpl({
      provider,
      apiKey,
      model,
      messages: [{ role: "system", content: FITCYCLE_SYSTEM_PROMPT }, ...history],
      tools: capabilities.tools ? FITCYCLE_TOOL_DEFINITIONS : [],
      signal,
      onToken,
      onReasoning
    });


    const assistantMessage = {
      role: "assistant",
      content: response.content || "",
      ...(response.toolCalls.length ? { tool_calls: response.toolCalls } : {})
    };
    history.push(assistantMessage);

    if (!response.toolCalls.length) {
      return { status: "completed", content: response.content, history, toolRounds };
    }
    if (!capabilities.tools) {
      return { status: "tools_unsupported", content: response.content, history, toolRounds };
    }
    if (toolRounds >= MAX_TOOL_ROUNDS) {
      return { status: "tool_limit", content: "已达到单次请求最多 4 轮工具调用的限制。", history, toolRounds };
    }
    toolRounds += 1;

    for (const toolCall of response.toolCalls) {
      const result = toolRuntime.request(toolCall, { modelSupportsTools: capabilities.tools });
      if (result.status === "confirmation_required") {
        return { status: "confirmation_required", pending: result, toolCall, history, toolRounds };
      }
      history.push(toolResultMessage(toolCall, result));
      onToolResult?.(result);
    }
  }
}

export async function resumeAssistantAfterDecision(options) {
  const result = options.confirm
    ? options.toolRuntime.confirm(options.pending.callId)
    : options.toolRuntime.cancel(options.pending.callId);
  options.onToolResult?.(result);
  const history = options.history.map((message) => ({ ...message }));
  history.push(toolResultMessage(options.toolCall, result));
  return runAssistantLoop({ ...options, messages: history, initialToolRounds: options.toolRounds });
}
