<template>
  <div class="space-y-4 pb-12" aria-labelledby="ai-settings-title">
    <div class="flex items-start justify-between gap-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
      <div>
        <h3 id="ai-settings-title" class="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-1.5">
          <span class="text-amber-400">✦</span> 智能教练设置 (Fitcycle AI)
        </h3>
        <p class="mt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          官方 API 直连。密钥仅加密存储在当前浏览器会话中，保障数据隐私。
        </p>
      </div>
      <span class="text-xs px-3 py-1 rounded-full border font-mono font-medium flex-shrink-0"
            :class="connected ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 bg-zinc-950 text-zinc-400'">
        {{ connected ? '● 已就绪' : '○ 未连接' }}
      </span>
    </div>

    <!-- 1. Compact Provider Selection Pills & Auto-Detect Header -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2">
          <label class="font-bold text-zinc-100 text-sm">1. 服务商</label>
          <span v-if="autoDetectedNotice" class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium animate-in fade-in">
            {{ autoDetectedNotice }}
          </span>
        </div>
        <a :href="portalLink" target="_blank" rel="noopener noreferrer" 
           class="text-xs sm:text-sm text-amber-400 hover:text-amber-300 underline flex items-center gap-0.5">
          <span>获取 {{ activeProvider.name }} Key</span> <span>↗</span>
        </a>
      </div>

      <!-- Horizontal Scrollable Compact Pills (Active provider is placed 1st for instant recognition) -->
      <div ref="providersScrollRef" class="flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="AI 提供商">
        <button v-for="provider in displayedProviders" :key="provider.id" type="button"
                :data-testid="`provider-btn-${provider.id}`"
                class="px-3.5 py-2 rounded-xl border text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 active:scale-95 cursor-pointer"
                :class="aiSession.activeProvider === provider.id 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm ring-1 ring-amber-500/40' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'"
                @click="selectProvider(provider.id)">
          <span v-if="aiSession.apiKeys[provider.id]" class="w-2 h-2 rounded-full bg-emerald-400" title="已配置 Key"></span>
          <span>{{ provider.name }}</span>
        </button>
      </div>

      <!-- Provider Billing Capability Callout (Zero Truncation Guaranteed) -->
      <div class="p-3 rounded-2xl border space-y-2 text-xs sm:text-sm transition-colors"
           :class="activeProvider.billingType === 'tokens_and_cost' 
             ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
             : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'"
           data-testid="provider-billing-notice">
        <div class="flex items-center justify-between gap-2">
          <span class="font-bold shrink-0 px-2 py-0.5 rounded text-xs flex items-center gap-1.5"
                :class="activeProvider.billingType === 'tokens_and_cost' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-300'">
            <span class="w-1.5 h-1.5 rounded-full" :class="activeProvider.billingType === 'tokens_and_cost' ? 'bg-emerald-400' : 'bg-zinc-400'"></span>
            <span>{{ activeProvider.billingBadge }}</span>
          </span>
          <span class="text-xs font-mono opacity-85 shrink-0">
            {{ activeProvider.billingType === 'tokens_and_cost' ? '实时计费: Token + 金额' : '实时计费: 仅回传 Token' }}
          </span>
        </div>
        <p class="text-xs sm:text-[13px] leading-relaxed break-words m-0"
           :class="activeProvider.billingType === 'tokens_and_cost' ? 'text-emerald-400/95' : 'text-zinc-300'">
          {{ activeProvider.billingDesc }}
        </p>
      </div>
    </div>

    <!-- 2. Smart API Key Input with Show/Hide Toggle & Proactive Auto-Detection -->
    <div class="space-y-2.5 pt-1.5 border-t border-zinc-800/80">
      <div class="flex items-center justify-between text-sm">
        <label for="provider-key" class="font-bold text-zinc-100 text-sm">2. 粘贴或输入 API Key</label>
        <span class="text-xs text-zinc-400 font-mono">支持智能识别服务商</span>
      </div>
      
      <div class="relative">
        <input id="provider-key" v-model="draftKey" :type="showKey ? 'text' : 'password'" autocomplete="off" spellcheck="false"
               :placeholder="`粘贴 ${activeProvider.name} 或任意平台 API Key (自动识别)`"
               class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3.5 py-3 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 font-mono outline-none transition-colors"
               @input="handleKeyInput"
               @paste="handleKeyPaste" />
        <button type="button" @click="showKey = !showKey" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 text-xs font-semibold transition-colors">
          {{ showKey ? '显示' : '隐藏' }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-0.5">
        <button type="button" @click="testConnection" :disabled="loading || !draftKey.trim()"
                class="py-3 rounded-xl bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-sm font-bold active:scale-95 shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                data-testid="test-connection-btn">
          <span v-if="loading" class="w-3.5 h-3.5 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></span>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>{{ loading ? '正在检测与连接…' : (connected ? '测试连接并刷新' : '测试连接并保存') }}</span>
        </button>
        <button type="button" @click="clearConnection" :disabled="loading || !hasAnyConnection"
                class="py-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 disabled:text-zinc-700 text-zinc-300 text-sm font-bold active:scale-95 transition-all cursor-pointer">
          清除全部连接
        </button>
      </div>

      <!-- Status Notification Message -->
      <div v-if="statusText" class="p-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 leading-relaxed" 
           :class="statusError ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'" 
           role="status">
        <span class="font-bold">{{ statusError ? '✕' : '✓' }}</span>
        <span>{{ statusText }}</span>
      </div>
    </div>

    <!-- 3. High-Visibility Model Selection Section -->
    <div v-if="connected" class="space-y-3.5 pt-2 border-t border-zinc-800/80">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <label for="model-search" class="block text-sm font-bold text-zinc-100">
            3. 选择生效对话模型 (共 {{ visibleModels.length }} 款可用)
          </label>
          <span class="text-xs px-2.5 py-0.5 rounded-full border font-mono font-medium"
                :class="isSyncedFromAPI ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 bg-zinc-900 text-zinc-400'">
            {{ isSyncedFromAPI ? '● API 实时动态识别' : '○ 基础离线预设' }}
          </span>
        </div>
        <button type="button" @click="testConnection" :disabled="loading || !draftKey.trim()"
                class="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                data-testid="refresh-api-models-btn"
                title="重新向官方接口发送请求，获取最新发布的大模型">
          <span v-if="loading" class="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></span>
          <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
          <span>{{ loading ? '正在获取…' : '再次获取官方最新模型' }}</span>
        </button>
      </div>

      <!-- Quick Search Bar & Collapsible Custom Model Input -->
      <div class="space-y-2">
        <div class="relative">
          <input id="model-search" v-model="modelSearch" type="search" 
                 placeholder="搜索任意大模型 (如 gpt, gemini, claude, deepseek, qwen, glm)..."
                 class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-3 pr-10 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors" />
          <button v-if="modelSearch" type="button" @click="modelSearch = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                  aria-label="清空搜索">✕</button>
        </div>

        <!-- Collapsible Custom Model Input Trigger -->
        <div class="flex items-center justify-between px-0.5">
          <button type="button" @click="showCustomInput = !showCustomInput"
                  class="text-xs sm:text-[13px] text-zinc-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer">
            <span class="text-amber-400">✦</span>
            <span>{{ showCustomInput ? '收起自定义模型' : '找不到所需模型？自定义指定模型 ID' }}</span>
            <span class="text-xs text-zinc-500">{{ showCustomInput ? '▲' : '▼' }}</span>
          </button>
          <span v-if="modelSearch && visibleModels.length" class="text-xs text-amber-400 font-mono">
            搜索到 {{ visibleModels.length }} 款
          </span>
        </div>

        <!-- Custom Model Input Row (Collapsible) -->
        <div v-show="showCustomInput" class="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/90 space-y-2 animate-in fade-in duration-150">
          <div class="flex items-center justify-between text-xs sm:text-sm">
            <span class="font-medium text-zinc-200 flex items-center gap-1">
              <span>自定义指定模型 ID</span>
            </span>
            <span class="text-xs text-zinc-400 font-mono">输入后将自动加入模型池</span>
          </div>
          <div class="flex gap-2">
            <input v-model="customModelInput" type="text"
                   :placeholder="customModelPlaceholder"
                   class="flex-1 bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-sm text-zinc-100 font-mono outline-none"
                   @keyup.enter="handleApplyCustomModel" />
            <button type="button" @click="handleApplyCustomModel" :disabled="!customModelInput.trim()"
                    class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-xs sm:text-sm font-bold active:scale-95 transition-all">
              选用
            </button>
          </div>
          <div v-if="customSuccessMsg" class="text-xs sm:text-sm text-emerald-400 flex items-center gap-1">
            <span>✓</span> <span>{{ customSuccessMsg }}</span>
          </div>
        </div>
      </div>

      <!-- 策略筛选分段标签 (Model Strategy Category Selector) -->
      <div class="space-y-2 pt-1">
        <div class="flex items-center justify-between text-sm">
          <span class="font-bold text-zinc-100 flex items-center gap-1">
            按训练场景策略筛选
          </span>
          <span class="text-xs text-zinc-400 font-mono">{{ visibleModels.length }} 款符合</span>
        </div>
        <div class="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          <button v-for="strat in MODEL_STRATEGIES" :key="strat.id" type="button"
                  @click="selectedStrategy = strat.id"
                  class="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1 flex-shrink-0 active:scale-95"
                  :class="selectedStrategy === strat.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'">
            <span>{{ strat.name }}</span>
            <span class="text-xs opacity-75 font-mono">({{ getStrategyCount(strat.id) }})</span>
          </button>
        </div>
        <p class="text-xs sm:text-[13px] text-zinc-300 leading-relaxed bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800/60">
          {{ activeStrategyObj.description }}
        </p>
      </div>

      <!-- 宫格卡片式模型选择列表 (2-Column Grid Layout - Clean, No English Descriptions) -->
      <div v-if="visibleModels.length" data-testid="models-grid" class="grid grid-cols-2 gap-2.5 max-h-[50vh] sm:max-h-[440px] min-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
        <div v-for="model in visibleModels" :key="model.id"
             @click="selectedModelId = model.id"
             class="p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 relative overflow-hidden active:scale-95"
             :class="selectedModelId === model.id 
               ? 'bg-amber-500/15 border-amber-500 text-white shadow-md ring-1 ring-amber-500/50' 
               : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 text-zinc-300'">
          
          <div class="space-y-1.5">
            <div class="flex items-start justify-between gap-1.5">
              <span class="text-sm font-bold text-zinc-100 font-mono line-clamp-2 leading-snug">{{ model.name || model.id }}</span>
              <span v-if="selectedModelId === model.id" class="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0 animate-pulse mt-0.5"></span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-zinc-400 font-mono truncate">
              <span v-if="getModelCreator(model)" class="px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-300 text-xs font-sans font-medium">{{ getModelCreator(model) }}</span>
              <span class="truncate">{{ model.id }}</span>
            </div>
          </div>

          <!-- Feature & Strategy Badges in Grid Card (Clean Chinese Badges, NO English Text) -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs font-mono pt-1.5 border-t border-zinc-800/50">
            <span class="px-2 py-0.5 rounded border text-xs font-bold flex items-center gap-0.5"
                  :class="getModelStrategy(model, aiSession.activeProvider).badgeClass">
              <span>{{ getModelStrategy(model, aiSession.activeProvider).name }}</span>
            </span>
            <span v-if="model.capabilities?.tools" class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">感知</span>
            <span v-if="!model.capabilities?.image" class="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-xs">纯文本</span>
          </div>

        </div>
      </div>

      <!-- Hidden select for form bindings & test compatibility -->
      <select v-model="selectedModelId" class="hidden" aria-hidden="true">
        <option v-for="model in visibleModels" :key="model.id" :value="model.id">{{ formatModelLabel(model) }}</option>
      </select>

      <!-- Friendly Empty Search State with Recommendations -->
      <div v-if="!visibleModels.length" class="py-6 px-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-center space-y-3">
        <div class="space-y-1">
          <div class="text-sm font-bold text-zinc-100">没有找到与「{{ modelSearch }}」完全匹配的模型</div>
          <p class="text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
            支持输入模型名或厂商，如 <code class="text-amber-400 font-mono">gpt</code>、<code class="text-amber-400 font-mono">gemini</code>、<code class="text-amber-400 font-mono">claude</code>、<code class="text-amber-400 font-mono">deepseek</code>、<code class="text-amber-400 font-mono">qwen</code>。
          </p>
        </div>

        <div v-if="recommendedFallbackModels.length" class="space-y-1.5 pt-1">
          <div class="text-xs text-zinc-400 font-bold uppercase tracking-wider">为您推荐以下相关模型：</div>
          <div class="flex flex-wrap justify-center gap-2">
            <button v-for="rec in recommendedFallbackModels" :key="rec.id" type="button"
                    @click="selectedModelId = rec.id; modelSearch = ''"
                    class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs sm:text-sm text-zinc-200 border border-zinc-700 font-mono flex items-center gap-1 active:scale-95 transition-all cursor-pointer">
              <span class="text-amber-400">✦</span>
              <span>{{ rec.name || rec.id }}</span>
            </button>
          </div>
        </div>

        <div class="pt-2 flex justify-center">
          <button type="button" @click="modelSearch = ''; selectedStrategy = 'all'"
                  class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/10 active:scale-95 transition-all cursor-pointer">
            清空搜索，浏览全部 {{ activeModels.length }} 款可用模型
          </button>
        </div>
      </div>

      <!-- Model Latency & Features Information Strip -->
      <div class="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2 text-xs sm:text-sm">
        <div class="flex items-center justify-between text-zinc-300">
          <span class="font-medium">当前选用生效：</span>
          <span class="font-mono text-amber-400 font-bold text-sm">{{ selectedModel?.name || selectedModelId }}</span>
        </div>
        
        <div class="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-zinc-800/60">
          <button type="button" @click="testActiveModelPing" :disabled="pingingModel"
                  class="text-xs sm:text-sm text-zinc-300 hover:text-amber-400 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer font-mono"
                  data-testid="test-active-model-btn"
                  title="向当前生效模型发送极简测试指令，测量实际延迟与连通状态">
            <span v-if="pingingModel" class="w-3 h-3 rounded-full border border-amber-400 border-t-transparent animate-spin"></span>
            <span v-else>⚡</span>
            <span>{{ pingingModel ? '正在测试连通性…' : '测试此模型连通性' }}</span>
          </button>
          
          <div v-if="pingResult" class="text-xs sm:text-sm font-mono flex items-center gap-1.5 px-3 py-1 rounded-lg border w-fit animate-in fade-in duration-150"
               :class="pingResult.success ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'"
               data-testid="ping-result-msg">
            <span class="font-bold">{{ pingResult.success ? '✓' : '✕' }}</span>
            <span>{{ pingResult.text }}</span>
          </div>
        </div>
      </div>

      <button type="button" data-testid="open-ai-assistant" @click="handleOpenChat"
              class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm sm:text-base font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer">
        ✦ 打开 AI 教练对话
      </button>
    </div>

      <!-- Shortcut to Token & Cost Audit Dashboard -->
      <div class="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs sm:text-sm text-zinc-400">
        <div class="flex items-center gap-1.5">
          <span>📊</span>
          <span>Token 用量与消费数据已独立建档</span>
        </div>
        <button type="button" @click="emit('open-audit')" 
                class="text-amber-400 hover:text-amber-300 font-medium active:scale-95 transition-all cursor-pointer flex items-center gap-0.5"
                data-testid="goto-audit-btn">
          <span>查看用量审计大盘</span>
          <span>❯</span>
        </button>
      </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";

const emit = defineEmits(["open-chat", "open-audit"]);

function handleOpenChat() {
  aiSession.drawerOpen = true;
  emit("open-chat");
}

const providersScrollRef = ref(null);

const displayedProviders = computed(() => {
  const activeId = aiSession.activeProvider;
  const activeItem = AI_PROVIDERS.find((p) => p.id === activeId);
  const others = AI_PROVIDERS.filter((p) => p.id !== activeId);
  return activeItem ? [activeItem, ...others] : AI_PROVIDERS;
});

onMounted(() => {
  nextTick(() => {
    providersScrollRef.value?.scrollTo({ left: 0, behavior: "instant" });
  });
});
import {
  AI_PROVIDERS,
  DEFAULT_PRESET_MODELS,
  addCustomModel,
  aiSession,
  clearAIConnection,
  getActiveApiKey,
  getActiveModelId,
  getActiveModels,
  getActiveProvider,
  isProviderSyncedFromAPI,
  setActiveProvider,
  setProviderModels,
  setSelectedModel,
  setSessionApiKey
} from "../ai/aiSession.js";
import {
  detectProviderFromKeyFingerprint,
  fetchProviderModels,
  probeProviderKey,
  testProviderConnection
} from "../ai/providerClient.js";
import {
  MODEL_STRATEGIES,
  filterModelsByStrategy,
  getModelCreator,
  getModelStrategy,
  matchesModelSearch,
  normalizeProviderModel
} from "../ai/modelCapabilities.js";

const draftKey = ref(getActiveApiKey());
const showKey = ref(false);
const loading = ref(false);
const statusText = ref("");
const statusError = ref(false);
const modelSearch = ref("");
const customModelInput = ref("");
const customSuccessMsg = ref("");
const selectedStrategy = ref("all");
const showCustomInput = ref(false);

const pingingModel = ref(false);
const pingResult = ref(null);
const autoDetectedNotice = ref("");
const isAutoSwitching = ref(false);

const activeProvider = computed(getActiveProvider);
const connected = computed(() => Boolean(getActiveApiKey()));
const portalLink = computed(() => activeProvider.value.portal);
const activeModels = computed(getActiveModels);
const isSyncedFromAPI = computed(() => isProviderSyncedFromAPI(aiSession.activeProvider));

const activeStrategyObj = computed(() => {
  return MODEL_STRATEGIES.find((s) => s.id === selectedStrategy.value) || MODEL_STRATEGIES[0];
});

function getStrategyCount(stratId) {
  if (stratId === "all") return activeModels.value.length;
  return filterModelsByStrategy(activeModels.value, stratId).length;
}

const customModelPlaceholder = computed(() => {
  if (aiSession.activeProvider === "zhipu") return "如 glm-4.5-air 或 glm-4.6v";
  if (aiSession.activeProvider === "deepseek") return "如 deepseek-chat 或 deepseek-reasoner";
  if (aiSession.activeProvider === "qwen") return "如 qwen2.5-72b-instruct";
  if (aiSession.activeProvider === "vercel_ai_gateway") return "如 google/gemini-2.0-flash 或 openai/gpt-4o";
  if (aiSession.activeProvider === "openrouter") return "如 anthropic/claude-3.5-sonnet 或 google/gemini-2.0-flash-001";
  return "输入模型 ID (如 custom-model-id)";
});

function handleApplyCustomModel() {
  const id = customModelInput.value.trim();
  if (!id) return;
  const added = addCustomModel(id);
  if (added) {
    customSuccessMsg.value = `已选用「${added.name || added.id}」`;
    customModelInput.value = "";
    setTimeout(() => {
      customSuccessMsg.value = "";
    }, 4000);
  }
}

const hasAnyConnection = computed(() => Object.values(aiSession.apiKeys).some((key) => Boolean(key)));

const selectedModelId = computed({
  get() {
    return getActiveModelId();
  },
  set(val) {
    setSelectedModel(val);
  }
});

const selectedModel = computed(() => activeModels.value.find((m) => m.id === selectedModelId.value) || null);

const visibleModels = computed(() => {
  const query = modelSearch.value.trim();
  if (!query) {
    return filterModelsByStrategy(activeModels.value, selectedStrategy.value);
  }

  // When search query is entered, first try searching inside current selected strategy
  if (selectedStrategy.value !== "all") {
    const strategyMatches = filterModelsByStrategy(activeModels.value, selectedStrategy.value)
      .filter((m) => matchesModelSearch(m, query));
    if (strategyMatches.length > 0) {
      return strategyMatches;
    }
  }

  // Fallback to searching globally across all models so user is never trapped in 0 results
  return activeModels.value.filter((m) => matchesModelSearch(m, query));
});

const recommendedFallbackModels = computed(() => {
  const query = modelSearch.value.trim().toLowerCase();
  if (!query) return [];
  if (query.includes("gpt")) {
    return activeModels.value.filter((m) => m.id.toLowerCase().includes("gpt")).slice(0, 4);
  }
  if (query.includes("gemini")) {
    return activeModels.value.filter((m) => m.id.toLowerCase().includes("gemini")).slice(0, 4);
  }
  if (query.includes("claude")) {
    return activeModels.value.filter((m) => m.id.toLowerCase().includes("claude")).slice(0, 4);
  }
  if (query.includes("deepseek")) {
    return activeModels.value.filter((m) => m.id.toLowerCase().includes("deepseek")).slice(0, 4);
  }
  if (query.includes("qwen")) {
    return activeModels.value.filter((m) => m.id.toLowerCase().includes("qwen")).slice(0, 4);
  }
  return activeModels.value.slice(0, 4);
});

watch(
  () => aiSession.activeProvider,
  () => {
    if (!isAutoSwitching.value) {
      draftKey.value = getActiveApiKey();
    }
    statusText.value = "";
    statusError.value = false;
    modelSearch.value = "";
    customModelInput.value = "";
    customSuccessMsg.value = "";
    selectedStrategy.value = "all";
    pingResult.value = null;
  }
);

watch(selectedModelId, () => {
  pingResult.value = null;
});

function selectProvider(providerId) {
  setActiveProvider(providerId);
  nextTick(() => {
    providersScrollRef.value?.scrollTo({ left: 0, behavior: "smooth" });
  });
}

function processKeyAutoDetection(rawKey) {
  const key = String(rawKey || "").trim();
  if (!key) {
    autoDetectedNotice.value = "";
    return;
  }
  const detected = detectProviderFromKeyFingerprint(key);
  if (detected && detected.provider !== aiSession.activeProvider) {
    isAutoSwitching.value = true;
    setActiveProvider(detected.provider);
    draftKey.value = key;
    autoDetectedNotice.value = `已识别: ${detected.name}`;
    setTimeout(() => {
      isAutoSwitching.value = false;
      autoDetectedNotice.value = "";
    }, 4500);
  }
}

function handleKeyInput() {
  processKeyAutoDetection(draftKey.value);
}

function handleKeyPaste(e) {
  const pasted = e.clipboardData?.getData("text") || "";
  if (pasted) {
    processKeyAutoDetection(pasted);
  }
}

function formatModelLabel(model) {
  if (!model) return "";
  if (model.name && model.name !== model.id) {
    return `${model.name} (${model.id})`;
  }
  return model.name || model.id;
}

async function testActiveModelPing() {
  if (!selectedModel.value || pingingModel.value) return;
  const key = getActiveApiKey();
  const prov = aiSession.activeProvider;
  if (!key) {
    pingResult.value = { success: false, text: "请先保存有效的 API Key" };
    return;
  }
  pingingModel.value = true;
  pingResult.value = null;
  try {
    const res = await testProviderConnection({
      provider: prov,
      apiKey: key,
      model: selectedModel.value.id
    });
    pingResult.value = {
      success: true,
      text: `连通正常 (${res.latencyMs}ms) · 响应:「${res.reply || 'OK'}」`
    };
  } catch (err) {
    pingResult.value = {
      success: false,
      text: `连通失败: ${err.message || '网络请求超时'}`
    };
  } finally {
    pingingModel.value = false;
  }
}

async function testConnection() {
  loading.value = true;
  statusText.value = "";
  statusError.value = false;

  let targetProvider = aiSession.activeProvider;
  const key = draftKey.value.trim();

  if (!key) {
    statusText.value = "请先输入 API Key";
    statusError.value = true;
    loading.value = false;
    return;
  }

  // 1. Fast fingerprint detection
  const detected = detectProviderFromKeyFingerprint(key);
  if (detected && detected.provider !== targetProvider) {
    targetProvider = detected.provider;
    isAutoSwitching.value = true;
    setActiveProvider(targetProvider);
    draftKey.value = key;
    autoDetectedNotice.value = `已识别: ${detected.name}`;
    setTimeout(() => {
      isAutoSwitching.value = false;
    }, 1000);
  }

  try {
    let ping;
    try {
      ping = await testProviderConnection({ provider: targetProvider, apiKey: key });
    } catch (testErr) {
      // 2. If test fails with 401/403 and key looks like a generic sk- key,
      // run multi-provider parallel probe to find the actual provider
      if ((testErr?.status === 401 || testErr?.status === 403) && key.startsWith("sk-")) {
        const otherCandidates = ["deepseek", "qwen", "siliconflow", "moonshot", "vercel_ai_gateway", "openrouter"]
          .filter((p) => p !== targetProvider);
        const probed = await probeProviderKey(key, otherCandidates);
        if (probed?.provider) {
          targetProvider = probed.provider;
          isAutoSwitching.value = true;
          setActiveProvider(targetProvider);
          draftKey.value = key;
          autoDetectedNotice.value = `探针匹配: ${probed.name}`;
          setTimeout(() => {
            isAutoSwitching.value = false;
          }, 1000);
          ping = await testProviderConnection({ provider: targetProvider, apiKey: key });
        } else {
          throw testErr;
        }
      } else {
        throw testErr;
      }
    }

    const models = await fetchProviderModels(targetProvider, key);

    // Merge defaults so promo models like glm-4.5-air / glm-4.6v aren't lost if remote /models endpoint omits them
    const existingIds = new Set(models.map((m) => m.id.toLowerCase()));
    const defaults = DEFAULT_PRESET_MODELS[targetProvider] || [];
    const merged = [...models];
    for (const d of defaults) {
      if (!existingIds.has(d.id.toLowerCase())) {
        merged.push(d);
      }
    }

    const normalizedMerged = merged.map((m) => normalizeProviderModel(targetProvider, m));

    setSessionApiKey(key, targetProvider);
    setProviderModels(normalizedMerged, targetProvider);

    if (normalizedMerged.length > 0) {
      const current = getActiveModelId();
      const stillValid = normalizedMerged.some((m) => m.id === current);
      if (!stillValid) {
        setSelectedModel(normalizedMerged[0].id, targetProvider);
      }
    }

    const latencyText = ping?.latencyMs ? ` (延迟 ${ping.latencyMs}ms)` : "";
    statusText.value = `${activeProvider.value.name} 连接测试成功${latencyText}，已动态识别并同步 ${normalizedMerged.length} 款官方可用对话模型。`;
    statusError.value = false;
  } catch (err) {
    statusText.value = err.message || "连接失败，请检查 API Key 是否有效。";
    statusError.value = true;
  } finally {
    loading.value = false;
  }
}

function clearConnection() {
  clearAIConnection();
  draftKey.value = "";
  pingResult.value = null;
  statusText.value = "已清除全部 AI 连接与本地密钥。";
  statusError.value = false;
}
</script>

<style scoped>
.capability-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
.capability-on {
  background-color: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.capability-off {
  background-color: rgba(39, 39, 42, 0.6);
  color: #71717a;
  border: 1px solid rgba(63, 63, 70, 0.5);
}
</style>