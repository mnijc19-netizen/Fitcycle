<template>
  <button v-if="!aiSession.drawerOpen" type="button" aria-label="打开 AI 助手" data-testid="ai-fab"
          class="fixed right-4 z-40 w-12 h-12 rounded-full bg-amber-500 text-zinc-950 shadow-2xl shadow-black/70 border border-amber-300 font-black text-lg active:scale-95 transition-all"
          :style="{ bottom: store.restTimer.running ? '132px' : '76px' }"
          @click="aiSession.drawerOpen = true">
    ✦
  </button>

  <div v-if="aiSession.drawerOpen" class="fixed inset-0 z-50 flex items-end justify-center" data-testid="ai-drawer">
    <button type="button" class="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-label="关闭 AI 助手" @click="aiSession.drawerOpen = false"></button>
    <section class="relative w-full max-w-md h-[min(760px,calc(100dvh-24px))] bg-zinc-950 border border-zinc-700 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
             aria-label="Fitcycle AI 助手">
      <header class="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 flex-shrink-0">
        <div class="min-w-0">
          <div class="text-sm font-black text-zinc-100 flex items-center gap-2"><span class="text-amber-400">✦</span> Fitcycle AI</div>
          <div class="text-[10px] text-zinc-500 truncate">{{ selectedModel?.name || '请先在设置中连接 OpenRouter' }}</div>
        </div>
        <div class="flex items-center gap-1.5">
          <button type="button" class="px-2 py-1.5 rounded-lg text-[10px] border border-zinc-700 text-zinc-400" @click="handleClear">清空对话</button>
          <button type="button" class="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300" aria-label="收起 AI 助手" @click="aiSession.drawerOpen = false">✕</button>
        </div>
      </header>

      <div ref="messageList" class="flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-3" data-testid="ai-messages">
        <div v-if="!aiSession.conversation.length" class="h-full min-h-52 flex flex-col items-center justify-center text-center px-8">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-3">✦</div>
          <p class="text-sm font-bold text-zinc-200">训练页面会继续保持运行</p>
          <p class="mt-1 text-[11px] text-zinc-500 leading-relaxed">可询问动作、计划和训练统计。支持 tools 的模型才能操作 Fitcycle；高影响变更会先等待你的确认。</p>
        </div>

        <article v-for="message in aiSession.conversation" :key="message.id" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
          <div v-if="message.role === 'tool'" class="w-full rounded-2xl border px-3 py-2.5 text-[11px]"
               :class="message.success ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold">{{ message.success ? '操作结果' : '操作未执行' }} · {{ message.tool || 'Fitcycle' }}</span>
              <button v-if="message.undoAvailable && !message.undone" type="button" class="px-2 py-1 rounded-lg border border-emerald-500/30" @click="undoToolMessage(message)">撤销</button>
            </div>
            <p class="mt-1">{{ message.text }}</p>
          </div>
          <div v-else class="max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-lg"
               :class="message.role === 'user' ? 'bg-amber-500 text-zinc-950 rounded-br-md' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-md'">
            <div v-if="message.images?.length" class="grid grid-cols-2 gap-1.5 mb-2">
              <img v-for="image in message.images" :key="image.name + image.size" :src="image.dataUrl" :alt="image.name" class="w-full max-h-32 rounded-xl object-cover" />
            </div>
            <p class="whitespace-pre-wrap break-words">{{ message.text }}<span v-if="message.streaming" class="inline-block w-1.5 h-3 ml-1 bg-amber-400 animate-pulse align-middle"></span></p>
          </div>
        </article>

        <div v-if="pendingContext" class="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-zinc-200 space-y-2" data-testid="ai-confirmation">
          <div class="font-bold text-amber-400">执行前确认</div>
          <p class="leading-relaxed">{{ pendingContext.pending.preview }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold" :disabled="generating" @click="decidePending(true)">确认执行</button>
            <button type="button" class="py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold" :disabled="generating" @click="decidePending(false)">取消</button>
          </div>
        </div>
      </div>

      <footer class="flex-shrink-0 border-t border-zinc-800 bg-zinc-900/95 px-3 pt-2.5" style="padding-bottom:max(env(safe-area-inset-bottom, 0px), 10px)">
        <div v-if="attachments.length" class="flex gap-2 overflow-x-auto pb-2">
          <div v-for="(image, index) in attachments" :key="image.name + image.size" class="relative flex-shrink-0">
            <img :src="image.dataUrl" :alt="image.name" class="w-16 h-16 rounded-xl object-cover border border-zinc-700" />
            <button type="button" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px]" :aria-label="`移除 ${image.name}`" @click="attachments.splice(index, 1)">✕</button>
          </div>
        </div>
        <p v-if="inputHint" class="text-[10px] mb-2" :class="inputHintError ? 'text-red-400' : 'text-zinc-500'">{{ inputHint }}</p>
        <div class="flex items-end gap-2">
          <div class="flex gap-1 pb-1">
            <button type="button" class="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-sm" aria-label="拍照" @click="cameraInput?.click()">📷</button>
            <button type="button" class="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 text-sm" aria-label="从相册选择" @click="galleryInput?.click()">🖼️</button>
            <input ref="cameraInput" class="hidden" type="file" accept="image/*" capture="environment" @change="handleFiles" />
            <input ref="galleryInput" class="hidden" type="file" accept="image/*" multiple @change="handleFiles" />
          </div>
          <textarea v-model="draft" rows="1" enterkeyhint="send" placeholder="询问训练，或让 AI 记录一组…"
                    class="flex-1 max-h-28 min-h-10 resize-none bg-zinc-950 border border-zinc-700 focus:border-amber-500/60 rounded-xl px-3 py-2.5 text-xs text-zinc-100 outline-none"
                    @keydown.enter.exact.prevent="send"></textarea>
          <button v-if="generating" type="button" class="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400" aria-label="停止生成" @click="stopGeneration">■</button>
          <button v-else type="button" class="w-10 h-10 rounded-xl bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black" :disabled="Boolean(sendDisabledReason)" aria-label="发送" @click="send">↑</button>
        </div>
        <div class="flex items-center justify-between mt-1.5 min-h-5">
          <button v-if="retryAvailable && !generating" type="button" class="text-[10px] text-amber-400" @click="retryGeneration">重试上次请求</button>
          <button v-if="!aiSession.apiKey" type="button" class="ml-auto text-[10px] text-amber-400" @click="goToSettings">前往设置连接</button>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { aiSession, clearConversation } from "../ai/aiSession.js";
import { buildUserMessage, resumeAssistantAfterDecision, runAssistantLoop } from "../ai/assistantRuntime.js";
import { createFitcycleToolRuntime } from "../ai/fitcycleTools.js";
import { processImageFile } from "../ai/imageProcessor.js";
import { getMessageBlockReason } from "../ai/modelCapabilities.js";
import { store } from "../store/fitnessStore.js";

const MAX_ATTACHMENTS = 3;
const toolRuntime = createFitcycleToolRuntime();
const draft = ref("");
const attachments = ref([]);
const generating = ref(false);
const retryAvailable = ref(false);
const pendingContext = ref(null);
const cameraInput = ref(null);
const galleryInput = ref(null);
const messageList = ref(null);
const inputError = ref("");
let abortController = null;

const selectedModel = computed(() => aiSession.models.find((model) => model.id === aiSession.selectedModelId) || null);
const sendDisabledReason = computed(() => getMessageBlockReason({
  apiKey: aiSession.apiKey,
  model: selectedModel.value,
  text: draft.value,
  imageCount: attachments.value.length
}));
const inputHint = computed(() => inputError.value || sendDisabledReason.value);
const inputHintError = computed(() => Boolean(inputError.value || (attachments.value.length && !selectedModel.value?.capabilities.image)));

watch(() => aiSession.conversation.length, scrollToBottom);

function scrollToBottom() {
  nextTick(() => {
    if (messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight;
  });
}

function makeMessage(role, text, extra = {}) {
  return { id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, role, text, ...extra };
}

function addToolResult(result) {
  aiSession.conversation.push(makeMessage("tool", result.message, {
    tool: result.tool,
    success: result.success,
    callId: result.callId,
    undoAvailable: result.undoAvailable,
    undone: false
  }));
}

async function runCurrentHistory(runOptions = {}) {
  const assistantBubble = makeMessage("assistant", "", { streaming: true });
  aiSession.conversation.push(assistantBubble);
  generating.value = true;
  retryAvailable.value = false;
  abortController = new AbortController();
  try {
    const baseOptions = {
      apiKey: aiSession.apiKey,
      model: selectedModel.value.id,
      capabilities: selectedModel.value.capabilities,
      toolRuntime,
      signal: abortController.signal,
      onToken: (token) => { assistantBubble.text += token; scrollToBottom(); },
      onToolResult: addToolResult
    };
    const result = runOptions.pending
      ? await resumeAssistantAfterDecision({ ...baseOptions, ...runOptions })
      : await runAssistantLoop({ ...baseOptions, messages: aiSession.apiMessages });

    aiSession.apiMessages = result.history;
    assistantBubble.streaming = false;
    if (!assistantBubble.text) assistantBubble.text = result.content || (result.status === "confirmation_required" ? "这个变更需要你确认后才会执行。" : "已处理。 ");
    if (result.status === "confirmation_required") pendingContext.value = result;
    if (result.status === "tool_limit") assistantBubble.text = result.content;
  } catch (error) {
    assistantBubble.streaming = false;
    if (error?.name === "AbortError") {
      assistantBubble.text = assistantBubble.text || "已停止生成。";
    } else {
      assistantBubble.text = error instanceof Error ? error.message : "AI 请求失败";
      retryAvailable.value = true;
    }
  } finally {
    generating.value = false;
    abortController = null;
    scrollToBottom();
  }
}

async function send() {
  inputError.value = "";
  if (sendDisabledReason.value) return;
  const text = draft.value.trim();
  const images = attachments.value.map((image) => ({ ...image }));
  const userMessage = buildUserMessage(text, images);
  aiSession.apiMessages.push(userMessage);
  aiSession.conversation.push(makeMessage("user", text || "请分析这张图片。", { images }));
  draft.value = "";
  attachments.value = [];
  pendingContext.value = null;
  await runCurrentHistory();
}

async function decidePending(confirm) {
  const current = pendingContext.value;
  if (!current) return;
  pendingContext.value = null;
  await runCurrentHistory({
    confirm,
    pending: current.pending,
    toolCall: current.toolCall,
    history: current.history,
    toolRounds: current.toolRounds
  });
}

function stopGeneration() {
  abortController?.abort();
}

function retryGeneration() {
  if (!generating.value && aiSession.apiMessages.length) runCurrentHistory();
}

function handleClear() {
  abortController?.abort();
  clearConversation();
  toolRuntime.clear();
  pendingContext.value = null;
  retryAvailable.value = false;
}

function undoToolMessage(message) {
  const result = toolRuntime.undo(message.callId);
  message.text = result.message;
  message.success = result.success;
  message.undone = result.success;
}

async function handleFiles(event) {
  inputError.value = "";
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  const remaining = MAX_ATTACHMENTS - attachments.value.length;
  if (remaining <= 0) {
    inputError.value = `每次最多添加 ${MAX_ATTACHMENTS} 张图片。`;
    return;
  }
  try {
    for (const file of files.slice(0, remaining)) attachments.value.push(await processImageFile(file));
    if (files.length > remaining) inputError.value = `每次最多添加 ${MAX_ATTACHMENTS} 张图片。`;
  } catch (error) {
    inputError.value = error instanceof Error ? error.message : "图片处理失败";
  }
}

function goToSettings() {
  store.activeTab = "stats";
  aiSession.drawerOpen = false;
}
</script>
