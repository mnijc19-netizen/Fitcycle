import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true
});

/**
 * Filter out internal LLM thinking tags, English tool preambles, and raw function call logs
 */
export function cleanAIMessage(rawText) {
  if (typeof rawText !== "string") return "";

  let text = rawText;

  // 1. Strip <think>...</think> reasoning blocks (from DeepSeek R1 / Qwen)
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // 2. Strip unclosed <think> if streaming
  text = text.replace(/<think>[\s\S]*$/gi, "");

  // 3. Strip leading English tool invocation / thinking preambles
  // e.g. "Let me check your recent training records and today's context to give you a useful answer about yesterday's workout."
  text = text.replace(/^(Let me (?:check|look|analyze|search|find|retrieve|inspect|review|see)|I (?:will|am going to|shall|have) (?:check|analyze|look|search|review)|Sure, let me|Allow me to)[^\n.!?]*[.!?\n]+\s*/gi, "");

  // 4. Strip raw tool calling / function execution debug output lines
  // e.g. "操作结果 · get_recent_workouts 查询完成", "Tool Call:", "Calling function:"
  text = text.replace(/(?:操作结果|Tool Result|Tool Call|Calling function)[\s\S]*?(?:查询完成|Completed|Finished)[\r\n]*/gi, "");
  text = text.replace(/^操作结果\s*·[^\n]*\n?/gim, "");
  text = text.replace(/^查询完成\s*\n?/gim, "");

  // 5. Clean up leading/trailing empty lines
  text = text.trim();

  return text;
}

/**
 * Renders cleaned markdown text to HTML with responsive table wrapper
 */
export function renderMarkdown(markdownText) {
  if (!markdownText) return "";
  const cleaned = cleanAIMessage(markdownText);
  try {
    let parsed = marked.parse(cleaned);
    // Wrap all <table> elements with responsive scroll container and style class
    parsed = parsed.replace(/<table>/gi, '<div class="table-wrapper"><table class="ai-markdown-table">');
    parsed = parsed.replace(/<\/table>/gi, '</table></div>');
    return parsed;
  } catch (e) {
    console.error("Markdown parse error:", e);
    return cleaned;
  }
}
