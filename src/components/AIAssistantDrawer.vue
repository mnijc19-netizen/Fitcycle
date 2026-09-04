<template>
  <!-- Non-intrusive AI button: hidden on mobile devices to never block close buttons or modal cards; users access AI from the top Navbar -->
  <button v-if="!aiSession.drawerOpen" type="button" aria-label="打开 AI 助手" data-testid="ai-fab"
          class="hidden sm:flex !fixed right-4 bottom-20 z-20 w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-xl shadow-black/80 border border-amber-300 font-black text-xs active:scale-95 transition-all items-center justify-center pointer-events-auto backdrop-blur-md"
          @click="aiSession.drawerOpen = true">
    <span class="animate-pulse text-sm leading-none">✦</span>
  </button>

  <div v-if="aiSession.drawerOpen" class="fixed inset-0 z-50 flex items-end justify-center" data-testid="ai-drawer">
    <button type="button" class="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-label="关闭 AI 助手" @click="aiSession.drawerOpen = false"></button>
    <section class="relative w-full max-w-md h-[min(760px,calc(100dvh-24px))] bg-zinc-950 border border-zinc-700 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
             aria-label="Fitcycle AI 助手">

      <!-- Top Ergonomic Grabber Pill for Bottom Sheet Gesture -->
      <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0 z-20"></div>

      <!-- CS2 Tactical Background Backdrop -->
      <div v-if="store.settings.uiSkin === 'cs'" 
           class="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <img :src="csAiBg" alt="CS2 AI Backdrop" class="w-full h-full object-cover object-bottom filter contrast-125" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/80"></div>
      </div>

      <!-- Chamber Luxury Background Backdrop -->
      <div v-else-if="store.settings.uiSkin === 'chamber'" 
           class="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
        <img :src="chamberAiBg" alt="Chamber AI Backdrop" class="w-full h-full object-cover object-center" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-[#070B14]/80"></div>
      </div>

      <header class="relative z-10 flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 flex-shrink-0">
        <div class="min-w-0 flex-1">
          <div class="text-sm font-black text-zinc-100 flex items-center gap-2">
            <span class="text-amber-400 font-black">✦</span> Fitcycle AI
            <span v-if="activeApiKey" class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <button type="button"
                  data-testid="toggle-quick-model-picker"
                  @click="showQuickModelPicker = !showQuickModelPicker"
                  class="text-[10px] text-zinc-400 hover:text-amber-400 truncate flex items-center gap-1 mt-0.5 max-w-full group text-left transition-colors">
            <span class="truncate font-mono">{{ selectedModel ? `${activeProvider.name} · ${selectedModel.name}` : '未选择模型（点击选择）' }}</span>
            <span class="text-[9px] text-amber-400/80 group-hover:text-amber-300">▼</span>
          </button>
        </div>
        <div class="flex items-center gap-1.5">
          <button type="button" class="px-2.5 py-1 rounded-lg text-[10px] border border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-zinc-900 transition-colors" @click="handleClear">清空对话</button>
          <button type="button" class="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition-colors" aria-label="收起 AI 助手" @click="aiSession.drawerOpen = false">✕</button>
        </div>
      </header>

      <!-- ⚡ 快捷切换模型弹窗 (Quick Model Switcher Popover) -->
      <div v-if="showQuickModelPicker" 
           data-testid="quick-model-picker-modal"
           class="absolute top-14 left-3 right-3 z-40 bg-zinc-900/98 border border-zinc-700 rounded-2xl shadow-2xl p-3 space-y-2.5 backdrop-blur-xl">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <span class="text-amber-400">⚡</span> 快捷切换模型
          </div>
          <button type="button" @click="showQuickModelPicker = false" class="text-zinc-500 hover:text-zinc-300 text-xs px-1">✕</button>
        </div>

        <!-- Provider Horizontal Tabs -->
        <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button v-for="prov in AI_PROVIDERS" :key="prov.id" type="button"
                  @click="quickSwitchProvider(prov.id)"
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap transition-all"
                  :class="aiSession.activeProvider === prov.id ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'">
            {{ prov.name }}
          </button>
        </div>

        <!-- Model List -->
        <div class="max-h-52 overflow-y-auto space-y-1 pr-1 font-mono">
          <button v-for="m in activeModels" :key="m.id" type="button"
                  @click="quickSelectModel(m.id)"
                  class="w-full px-2.5 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between group"
                  :class="selectedModelId === m.id ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold' : 'hover:bg-zinc-800 text-zinc-300 border border-transparent'">
            <div class="min-w-0 flex-1 pr-2">
              <div class="text-[11px] truncate">{{ m.name }}</div>
              <div class="text-[9px] text-zinc-500 truncate">{{ m.id }}</div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span v-if="m.capabilities?.image" class="text-[9px] px-1 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">识图</span>
              <span v-if="m.capabilities?.reasoning" class="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">思考</span>
              <span v-if="selectedModelId === m.id" class="text-amber-400 text-xs">✓</span>
            </div>
          </button>
        </div>

        <div class="pt-1 border-t border-zinc-800 flex items-center justify-between text-[10px]">
          <span class="text-zinc-500">厂商: {{ activeProvider.name }}</span>
          <button type="button" @click="goToSettingsTab" class="text-amber-400 hover:text-amber-300 underline font-medium">管理 API 密钥 ↗</button>
        </div>
      </div>

      <div ref="messageList" 
           @scroll.passive="handleScroll"
           class="relative z-10 flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-3" 
           data-testid="ai-messages">
        <!-- Empty State with Quick Action Chips -->
        <div v-if="!aiSession.conversation.length" class="h-full min-h-52 flex flex-col items-center justify-center text-center px-4 py-6 space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shadow-lg shadow-amber-500/10">🤖</div>
          <div class="space-y-1">
            <p class="text-sm font-bold text-zinc-100">我是你的 FitCycle 智能教练</p>
            <p class="text-[11px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
              已接入你的训练计划、近期容量与动作库，随时为你提供科学复盘与指导。
            </p>
          </div>

          <!-- Quick Suggestion Cards Grid -->
          <div class="grid grid-cols-2 gap-2 w-full pt-1 text-left">
            <button v-for="(chip, idx) in defaultChips" :key="idx"
                    type="button"
                    @click="sendPrompt(chip.prompt)"
                    class="p-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-left transition-all space-y-1 group">
              <div class="text-amber-400 font-bold text-[11px] flex items-center gap-1 group-hover:text-amber-300">
                <span>{{ chip.icon }}</span> {{ chip.title }}
              </div>
              <div class="text-[10px] text-zinc-400 line-clamp-2">
                {{ chip.desc }}
              </div>
            </button>
          </div>
        </div>

        <!-- Conversation Bubbles -->
        <article v-for="message in aiSession.conversation" :key="message.id" class="flex flex-col" :class="message.role === 'user' ? 'items-end' : 'items-start'">
          <!-- State-Modifying Tool Results (With Undo) -->
          <div v-if="message.role === 'tool'" class="w-full rounded-2xl border px-3.5 py-2.5 text-[11px] shadow-sm"
               :class="message.success ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold">{{ message.success ? '操作已生效' : '操作未执行' }} · {{ message.tool || 'Fitcycle' }}</span>
              <button v-if="message.undoAvailable && !message.undone" type="button" class="px-2 py-1 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors" @click="undoToolMessage(message)">撤销</button>
            </div>
            <p class="mt-1 leading-relaxed">{{ message.text }}</p>
          </div>

          <!-- User Message Bubble -->
          <div v-else-if="message.role === 'user'" class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md bg-amber-500 text-zinc-950 font-medium rounded-tr-xs">
            <div v-if="message.images?.length" class="grid grid-cols-2 gap-1.5 mb-2">
              <img v-for="image in message.images" :key="image.name + image.size" :src="image.dataUrl" :alt="image.name" class="w-full max-h-32 rounded-xl object-cover" />
            </div>
            <p class="whitespace-pre-wrap break-words">{{ message.text }}</p>
          </div>

          <!-- AI Message Bubble with Thinking Box, Markdown Tables & Copy -->
          <div v-else class="max-w-[95%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xl bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-xs space-y-2.5 relative group">
            
            <!-- 🧠 深度思考过程展示框 (Collapsible Thinking Process Box) -->
            <div v-if="message.reasoning || (message.streaming && message.isThinking)"
                 class="rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden text-[11px] transition-all">
              <!-- Header with Toggle Button -->
              <button type="button" 
                      data-testid="toggle-reasoning"
                      @click="message.reasoningCollapsed = !message.reasoningCollapsed"
                      class="w-full px-3 py-2 flex items-center justify-between text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 transition-colors select-none text-left cursor-pointer">
                <span class="flex items-center gap-1.5 font-medium">
                  <span class="text-amber-400 text-xs" :class="{ 'animate-spin': message.streaming && message.isThinking }">✦</span>
                  <span class="text-zinc-300 font-bold">
                    {{ (message.streaming && message.isThinking) ? 'AI 正在深度思考…' : '已完成深度思考' }}
                  </span>
                </span>
                <span class="text-[10px] text-zinc-500 flex items-center gap-1">
                  <span>{{ message.reasoningCollapsed ? '展开' : '收起' }}</span>
                  <span class="transform transition-transform duration-200" :class="{ 'rotate-180': !message.reasoningCollapsed }">▼</span>
                </span>
              </button>

              <!-- Thinking Text Body -->
              <div v-show="!message.reasoningCollapsed" 
                   class="px-3 py-2.5 text-zinc-400 font-mono text-[11px] leading-relaxed border-t border-zinc-800/80 bg-zinc-950/60 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                {{ message.reasoning }}
                <span v-if="message.streaming && message.isThinking" class="inline-block w-1.5 h-3 ml-0.5 bg-amber-400 animate-pulse align-middle"></span>
              </div>
            </div>

            <!-- Loading initial pulse if no text and no reasoning yet -->
            <div v-if="message.streaming && !message.text && !message.reasoning" class="flex items-center gap-2 text-zinc-400 font-mono text-[11px] py-1">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>正在连接模型并准备生成…</span>
            </div>

            <!-- Rendered Clean Markdown with Responsive Table Wrapper -->
            <div v-if="message.text" class="ai-markdown-content text-xs leading-relaxed" v-html="renderMarkdown(message.text)"></div>
            <span v-if="message.streaming && !message.isThinking && message.text" class="inline-block w-2 h-3.5 bg-amber-400 animate-pulse align-middle ml-1"></span>

            <!-- Footer: Brand tag and Copy Button -->
            <div v-if="!message.streaming && (message.text || message.reasoning)" class="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-500 font-mono">
              <span class="flex items-center gap-1 text-zinc-400">
                <span>✦ Fitcycle AI</span>
              </span>
              <button type="button" @click="copyText(message.text)" 
                      class="hover:text-zinc-200 transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/60 hover:bg-zinc-800">
                <span>📋 复制</span>
              </button>
            </div>
          </div>
        </article>

        <!-- High-Impact Action Confirmation Modal -->
        <div v-if="pendingContext" class="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-zinc-200 space-y-2" data-testid="ai-confirmation">
          <div class="font-bold text-amber-400">执行前确认</div>
          <p class="leading-relaxed">{{ pendingContext.pending.preview }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold active:scale-95" :disabled="generating" @click="decidePending(true)">确认执行</button>
            <button type="button" class="py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold active:scale-95" :disabled="generating" @click="decidePending(false)">取消</button>
          </div>
        </div>
      </div>

      <!-- Floating Jump to bottom button when user scrolled up during generation -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2 scale-90"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-90"
      >
        <button v-if="generating && userScrolledUp" 
                type="button" 
                @click="jumpToBottom"
                class="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-zinc-900/95 border border-amber-500/70 shadow-2xl shadow-black text-amber-300 text-xs font-bold flex items-center gap-1.5 backdrop-blur-xl active:scale-95">
          <span class="animate-bounce text-sm">↓</span>
          <span>AI 正在输出 (点击回到底部)</span>
        </button>
      </transition>

      <footer class="relative z-10 flex-shrink-0 border-t border-zinc-800 bg-zinc-900/95 px-3 pt-2.5" style="padding-bottom:max(env(safe-area-inset-bottom, 0px), 10px)">
        <!-- Attached Images Thumbnail Strip -->
        <div v-if="attachments.length" class="flex gap-2 overflow-x-auto pb-2">
          <div v-for="(image, index) in attachments" :key="image.name + image.size" class="relative flex-shrink-0">
            <img :src="image.dataUrl" :alt="image.name" class="w-14 h-14 rounded-xl object-cover border border-zinc-700" />
            <button type="button" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center" :aria-label="`移除 ${image.name}`" @click="attachments.splice(index, 1)">✕</button>
          </div>
        </div>

        <!-- Clean Input Hint (Only shown for real errors, never distracting placeholder text) -->
        <p v-if="inputHint" class="text-[10px] mb-2 leading-tight" :class="inputHintError ? 'text-red-400' : 'text-zinc-500'">{{ inputHint }}</p>

        <!-- Input Bar Row -->
        <div class="flex items-end gap-2">
          <div class="flex gap-1 pb-0.5">
            <button type="button" class="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm flex items-center justify-center transition-colors" aria-label="拍照" @click="cameraInput?.click()">📷</button>
            <button type="button" class="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm flex items-center justify-center transition-colors" aria-label="从相册选择" @click="galleryInput?.click()">🖼️</button>
            <input ref="cameraInput" class="hidden" type="file" accept="image/*" capture="environment" @change="handleFiles" />
            <input ref="galleryInput" class="hidden" type="file" accept="image/*" multiple @change="handleFiles" />
          </div>
          <textarea v-model="draft" rows="1" enterkeyhint="send" placeholder="询问训练，或让 AI 记录一组…"
                    class="flex-1 max-h-28 min-h-10 resize-none bg-zinc-950 border border-zinc-700 focus:border-amber-500/60 rounded-xl px-3 py-2.5 text-xs text-zinc-100 outline-none leading-relaxed transition-colors"
                    @keydown.enter.exact.prevent="send"></textarea>
          <button v-if="generating" type="button" class="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center transition-colors active:scale-95" aria-label="停止生成" @click="stopGeneration">■</button>
          <button v-else type="button" class="w-10 h-10 rounded-xl bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black text-sm flex items-center justify-center shadow-md active:scale-95 transition-all" :disabled="Boolean(sendDisabledReason)" aria-label="发送" @click="send">↑</button>
        </div>

        <!-- Footer Shortcuts -->
        <div class="flex items-center justify-between mt-1.5 min-h-5">
          <button v-if="retryAvailable && !generating" type="button" class="text-[10px] text-amber-400 hover:text-amber-300 font-medium" @click="retryGeneration">重试上次请求</button>
          <button v-if="!activeApiKey" type="button" class="ml-auto text-[10px] text-amber-400 hover:text-amber-300 underline font-medium" @click="goToSettings">前往设置连接</button>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch, onUnmounted } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import {
  AI_PROVIDERS,
  aiSession,
  clearConversation,
  getActiveApiKey,
  getActiveModelId,
  getActiveModels,
  getActiveProvider,
  setActiveProvider,
  setSelectedModel
} from "../ai/aiSession.js";
import { buildUserMessage, resumeAssistantAfterDecision, runAssistantLoop } from "../ai/assistantRuntime.js";
import { createFitcycleToolRuntime } from "../ai/fitcycleTools.js";
import { processImageFile } from "../ai/imageProcessor.js";
import { getMessageBlockReason } from "../ai/modelCapabilities.js";
import { store } from "../store/fitnessStore.js";
import { renderMarkdown, cleanAIMessage, extractReasoningAndContent } from "../utils/aiService.js";

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
const showQuickModelPicker = ref(false);
let abortController = null;

watch(() => aiSession.drawerOpen, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (aiSession.drawerOpen) unlockBodyScroll();
});

const activeModels = computed(getActiveModels);
const selectedModelId = computed({ get: getActiveModelId, set: (val) => setSelectedModel(val) });

function quickSwitchProvider(providerId) {
  setActiveProvider(providerId);
}

function quickSelectModel(modelId) {
  setSelectedModel(modelId);
  showQuickModelPicker.value = false;
}

function goToSettingsTab() {
  showQuickModelPicker.value = false;
  aiSession.drawerOpen = false;
  store.activeTab = "stats";
}

const csAiBg = "./themes/cs/background.jpg";
const chamberAiBg = "./themes/chamber/hero/chamber-hero.webp";

const defaultChips = [
  {
    icon: "📊",
    title: "分析昨天训练表现",
    desc: "复盘时长、组数、总容量与动作评价",
    prompt: "我昨天那个计划怎么样"
  },
  {
    icon: "📋",
    title: "评估今日分化计划",
    desc: "根据当前推拉腿循环指导今日动作要点",
    prompt: "根据我今天的训练计划，给出今日核心动作和发力注意事项"
  },
  {
    icon: "🔄",
    title: "推荐器械替代动作",
    desc: "器械被占或居家训练时的同力线替换",
    prompt: "健身房卧推架和深蹲架全满了，请给我推荐推胸和练腿的最佳替代动作"
  },
  {
    icon: "📈",
    title: "渐进超负荷加重建议",
    desc: "根据历史组数推荐下一周期的目标重量",
    prompt: "我现在的上斜卧推已经能做 26kg 8次，下一阶段该如何渐进式超负荷？"
  }
];

const activeProvider = computed(getActiveProvider);
const activeApiKey = computed(getActiveApiKey);
const selectedModel = computed(() => getActiveModels().find((model) => model.id === getActiveModelId()) || null);
const sendDisabledReason = computed(() => getMessageBlockReason({
  apiKey: activeApiKey.value,
  model: selectedModel.value,
  text: draft.value,
  imageCount: attachments.value.length
}));

// Only show inputHint if there is an actual error, never distracting prompt text
const inputHint = computed(() => {
  if (inputError.value) return inputError.value;
  if (attachments.value.length && !selectedModel.value?.capabilities.image) {
    return `${selectedModel.value?.name || '当前模型'}不支持图片输入。`;
  }
  return "";
});
const inputHintError = computed(() => Boolean(inputError.value || (attachments.value.length && !selectedModel.value?.capabilities.image)));

watch(() => aiSession.conversation.length, scrollToBottom);
watch(
  () => [aiSession.drawerOpen, aiSession.pendingAutoRun],
  async ([isOpen, isAutoRun]) => {
    if (isOpen && isAutoRun && !generating.value) {
      aiSession.pendingAutoRun = false;
      if (activeApiKey.value) {
        await runCurrentHistory();
      } else {
        aiSession.conversation.push(makeMessage("assistant", "⚠️ **您尚未连接大模型 API Key**。\n\n请点击下方【前往设置连接】配置您的 DeepSeek、智谱 GLM 或通义千问 API Key，即可开启大模型实时在线深度分析！"));
      }
    }
  }
);
watch(() => aiSession.clearRevision, () => {
  abortController?.abort();
  attachments.value = [];
  draft.value = "";
  inputError.value = "";
  pendingContext.value = null;
  retryAvailable.value = false;
  toolRuntime.clear();
});

const userScrolledUp = ref(false);

function handleScroll() {
  if (!messageList.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messageList.value;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  // If user scrolled up more than 50px away from bottom, respect user's reading intent
  userScrolledUp.value = distanceFromBottom > 50;
}

function scrollToBottom(force = false) {
  nextTick(() => {
    if (!messageList.value) return;
    if (!force && userScrolledUp.value) return;
    messageList.value.scrollTop = messageList.value.scrollHeight;
  });
}

function jumpToBottom() {
  userScrolledUp.value = false;
  scrollToBottom(true);
}

function makeMessage(role, text, extra = {}) {
  return reactive({ id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, role, text, ...extra });
}

function copyText(text) {
  if (!text) return;
  const clean = cleanAIMessage(text);
  navigator.clipboard?.writeText(clean).catch(() => {});
}

// Only push state-changing mutations with undo support into conversation (hide read-only queries)
function addToolResult(result) {
  if (result.undoAvailable || !result.success) {
    aiSession.conversation.push(makeMessage("tool", result.message, {
      tool: result.tool,
      success: result.success,
      callId: result.callId,
      undoAvailable: result.undoAvailable,
      undone: false
    }));
  }
}

async function sendPrompt(promptText) {
  if (!promptText || generating.value) return;
  draft.value = promptText;
  await send();
}

async function runCurrentHistory(runOptions = {}) {
  const assistantBubble = makeMessage("assistant", "", { 
    streaming: true, 
    reasoning: "", 
    isThinking: false, 
    reasoningCollapsed: false 
  });
  aiSession.conversation.push(assistantBubble);
  generating.value = true;
  retryAvailable.value = false;
  userScrolledUp.value = false;
  scrollToBottom(true);
  abortController = new AbortController();
  
  let rawAccumulatedText = "";

  try {
    const baseOptions = {
      provider: aiSession.activeProvider,
      apiKey: activeApiKey.value,
      model: selectedModel.value?.id,
      capabilities: selectedModel.value?.capabilities || { text: true, tools: true, streaming: true },
      toolRuntime,
      signal: abortController.signal,
      onReasoning: (chunk) => {
        assistantBubble.isThinking = true;
        assistantBubble.reasoning += chunk;
        scrollToBottom(false);
      },
      onToken: (token) => {
        rawAccumulatedText += token;
        // Check if there are embedded <think> tags in the token stream
        const parsed = extractReasoningAndContent(rawAccumulatedText);
        if (parsed.reasoning) {
          assistantBubble.reasoning = parsed.reasoning;
          assistantBubble.isThinking = parsed.isThinking;
        } else if (assistantBubble.reasoning && !parsed.isThinking) {
          assistantBubble.isThinking = false;
        }
        assistantBubble.text = parsed.content;
        scrollToBottom(false);
      },
      onToolResult: addToolResult
    };
    const result = runOptions.pending
      ? await resumeAssistantAfterDecision({ ...baseOptions, ...runOptions })
      : await runAssistantLoop({ ...baseOptions, messages: aiSession.apiMessages });

    aiSession.apiMessages = result.history;
    assistantBubble.streaming = false;
    assistantBubble.isThinking = false;
    
    // Final clean up and parse
    const finalParsed = extractReasoningAndContent(result.content || rawAccumulatedText || assistantBubble.text);
    if (finalParsed.reasoning && !assistantBubble.reasoning) {
      assistantBubble.reasoning = finalParsed.reasoning;
    }
    assistantBubble.text = finalParsed.content || (result.status === "confirmation_required" ? "这个变更需要你确认后才会执行。" : "已为你处理完成。");
    
    // Auto-collapse reasoning after thinking finishes to keep answer prominent
    if (assistantBubble.reasoning) {
      assistantBubble.reasoningCollapsed = true;
    }
    
    if (result.status === "confirmation_required") pendingContext.value = result;
    if (result.status === "tool_limit") assistantBubble.text = result.content;
  } catch (error) {
    assistantBubble.streaming = false;
    assistantBubble.isThinking = false;
    if (error?.name === "AbortError") {
      assistantBubble.text = assistantBubble.text
        ? `${assistantBubble.text}\n\n（已停止生成）`
        : "已停止生成。";
      retryAvailable.value = true;
    } else {
      assistantBubble.text = error instanceof Error ? error.message : "AI 请求失败";
      retryAvailable.value = true;
    }
  } finally {
    generating.value = false;
    abortController = null;
    if (!userScrolledUp.value) {
      scrollToBottom(false);
    }
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
  userScrolledUp.value = false;
  scrollToBottom(true);
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

