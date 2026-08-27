<template>
  <div class="space-y-4 pb-12" aria-labelledby="ai-settings-title">
    <div class="flex items-start justify-between gap-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5">
      <div>
        <h3 id="ai-settings-title" class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <span class="text-amber-400">✦</span> 智能教练设置 (Fitcycle AI)
        </h3>
        <p class="mt-1 text-[11px] text-zinc-400 leading-relaxed">
          官方 API 直连。密钥仅加密存储在当前浏览器会话中，保障数据隐私。
        </p>
      </div>
      <span class="text-[10px] px-2.5 py-1 rounded-full border font-mono font-medium flex-shrink-0"
            :class="connected ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 bg-zinc-950 text-zinc-500'">
        {{ connected ? '● 已就绪' : '○ 未连接' }}
      </span>
    </div>

    <!-- 1. Provider Selection Tabs -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-zinc-200">1. 选择 AI 大模型服务商</label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" aria-label="AI 提供商">
        <button v-for="provider in AI_PROVIDERS" :key="provider.id" type="button"
                class="py-2.5 px-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 relative overflow-hidden active:scale-95"
                :class="aiSession.activeProvider === provider.id 
                  ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/50 shadow-md shadow-amber-500/10' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'"
                @click="selectProvider(provider.id)">
          <div class="flex items-center justify-between w-full">
            <span class="font-black text-xs text-white">{{ provider.name }}</span>
            <span v-if="aiSession.apiKeys[provider.id]" class="w-2 h-2 rounded-full bg-emerald-400" title="已配置 Key"></span>
          </div>
          <span class="text-[10px] opacity-75 truncate leading-tight">{{ provider.tag || provider.id }}</span>
        </button>
      </div>
    </div>

    <!-- 2. API Key Input with Show/Hide Toggle & Quick Portal Link -->
    <div class="space-y-2 pt-1 border-t border-zinc-800/80">
      <div class="flex items-center justify-between text-xs">
        <label for="provider-key" class="font-bold text-zinc-200">2. 配置 {{ activeProvider.name }} API Key</label>
        <a :href="portalLink" target="_blank" rel="noopener noreferrer" 
           class="text-[11px] text-amber-400 hover:text-amber-300 underline flex items-center gap-0.5">
          <span>获取 {{ activeProvider.name }} Key</span> <span>↗</span>
        </a>
      </div>
      
      <div class="relative">
        <input id="provider-key" v-model="draftKey" :type="showKey ? 'text' : 'password'" autocomplete="off" spellcheck="false"
               :placeholder="`粘贴您的 ${activeProvider.name} API Key`"
               class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2.5 pr-10 text-xs text-zinc-100 font-mono outline-none transition-colors" />
        <button type="button" @click="showKey = !showKey" 
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 text-xs transition-colors">
          {{ showKey ? '👁️' : '🔒' }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-0.5">
        <button type="button" @click="testConnection" :disabled="loading || !draftKey.trim()"
                class="py-2.5 rounded-xl bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-xs font-bold active:scale-95 shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-1.5">
          <span v-if="loading" class="w-3 h-3 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></span>
          <span>{{ loading ? '连接中…' : (connected ? '刷新并获取模型' : '验证并获取模型') }}</span>
        </button>
        <button type="button" @click="clearConnection" :disabled="loading || !hasAnyConnection"
                class="py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 disabled:text-zinc-700 text-zinc-300 text-xs font-bold active:scale-95 transition-all">
          清除全部连接
        </button>
      </div>

      <!-- Status Notification Message -->
      <div v-if="statusText" class="p-2.5 rounded-xl text-xs flex items-center gap-2 leading-relaxed" 
           :class="statusError ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'" 
           role="status">
        <span>{{ statusError ? '❌' : '✅' }}</span>
        <span>{{ statusText }}</span>
      </div>
    </div>

    <!-- 3. High-Visibility Model Selection Section -->
    <div v-if="connected" class="space-y-3 pt-2 border-t border-zinc-800/80">
      <div class="flex items-center justify-between">
        <label for="model-search" class="block text-xs font-bold text-zinc-200">
          3. 选择生效对话模型 (共 {{ visibleModels.length }} 款可用)
        </label>
        <span class="text-[10px] text-amber-400 font-mono">点击直接切换</span>
      </div>

      <!-- Quick Search Bar -->
      <div class="relative">
        <input id="model-search" v-model="modelSearch" type="search" 
               placeholder="🔍 输入名称搜索模型 ID (如 glm-4-plus, glm-4v, deepseek-r1)..."
               class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors" />
      </div>

      <!-- Visual Model Selection Cards (High Visibility!) -->
      <div class="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
        <div v-for="model in visibleModels" :key="model.id"
             @click="selectedModelId = model.id"
             class="p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 active:scale-98"
             :class="selectedModelId === model.id 
               ? 'bg-amber-500/20 border-amber-500/80 text-white shadow-sm ring-1 ring-amber-500/40' 
               : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700 text-zinc-300'">
          <div class="truncate">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-zinc-100 font-mono">{{ model.name || model.id }}</span>
              <span v-if="selectedModelId === model.id" class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-zinc-950 font-black">当前生效</span>
            </div>
            <div class="text-[10px] text-zinc-500 font-mono truncate mt-0.5">{{ model.id }}</div>
          </div>

          <!-- Feature Pills -->
          <div class="flex items-center gap-1 flex-shrink-0 text-[9px] font-mono">
            <span v-if="model.capabilities.reasoning" class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">深度思考</span>
            <span v-if="model.capabilities.image" class="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">视觉识图</span>
            <span v-if="model.capabilities.tools" class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">数据感知</span>
          </div>
        </div>
      </div>

      <!-- Hidden select for form bindings & test compatibility -->
      <select v-model="selectedModelId" class="hidden" aria-hidden="true">
        <option v-for="model in visibleModels" :key="model.id" :value="model.id">{{ formatModelLabel(model) }}</option>
      </select>
      <p v-if="!visibleModels.length" class="text-[11px] text-zinc-500">没有匹配的对话模型。</p>

      <!-- Active Model Capability Overview Card -->
      <div v-if="selectedModel" class="rounded-2xl bg-zinc-950 border border-zinc-800/90 p-3.5 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="text-xs font-bold text-zinc-100 break-words">{{ selectedModel.name }}</div>
          <span class="text-[10px] font-mono text-amber-400 font-bold">● 当前生效中</span>
        </div>
        <div class="text-[10px] text-zinc-500 font-mono break-all">{{ selectedModel.id }}</div>
        
        <div class="flex flex-wrap gap-1.5 pt-0.5">
          <span class="capability-badge capability-on">文字对话</span>
          <span class="capability-badge" :class="selectedModel.capabilities.image ? 'capability-on' : 'capability-off'">图片识别 {{ selectedModel.capabilities.image ? '✓' : '×' }}</span>
          <span class="capability-badge" :class="selectedModel.capabilities.tools ? 'capability-on' : 'capability-off'">数据感知 {{ selectedModel.capabilities.tools ? '✓' : '×' }}</span>
          <span class="capability-badge" :class="selectedModel.capabilities.streaming ? 'capability-on' : 'capability-off'">流式传输 {{ selectedModel.capabilities.streaming ? '✓' : '×' }}</span>
        </div>
        
        <p v-if="!selectedModel.capabilities.tools" class="text-[10px] text-amber-400/90 leading-tight">
          该模型可用于对话咨询，但不支持自动读取或修改 Fitcycle 训练数据。
        </p>
        <p v-if="!selectedModel.capabilities.image" class="text-[10px] text-zinc-500 leading-tight">
          当前选中的模型为纯文本对话模型；如需上传身材或动作图片分析，请选择带有「视觉识图」标识的模型（如 GLM-4V-Plus、Qwen-VL-Max）。
        </p>
      </div>

      <button type="button" data-testid="open-ai-assistant" @click="handleOpenChat"
              class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all">
        ✦ 打开 AI 教练对话
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const emit = defineEmits(["open-chat"]);

function handleOpenChat() {
  aiSession.drawerOpen = true;
  emit("open-chat");
}
import {
  AI_PROVIDERS,
  aiSession,
  clearAIConnection,
  getActiveApiKey,
  getActiveModelId,
  getActiveModels,
  getActiveProvider,
  setActiveProvider,
  setProviderModels,
  setSelectedModel,
  setSessionApiKey
} from "../ai/aiSession.js";
import { fetchProviderModels } from "../ai/providerClient.js";

const draftKey = ref(getActiveApiKey());
const showKey = ref(false);
const loading = ref(false);
const statusText = ref("");
const statusError = ref(false);
const modelSearch = ref("");

const activeProvider = computed(getActiveProvider);
const connected = computed(() => Boolean(getActiveApiKey()));
const portalLink = computed(() => activeProvider.value.portal);
const activeModels = computed(getActiveModels);

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
  const query = modelSearch.value.trim().toLowerCase();
  if (!query) return activeModels.value;
  return activeModels.value.filter((model) => {
    const id = model.id.toLowerCase();
    const name = (model.name || "").toLowerCase();
    return id.includes(query) || name.includes(query);
  });
});

watch(
  () => aiSession.activeProvider,
  () => {
    draftKey.value = getActiveApiKey();
    statusText.value = "";
    statusError.value = false;
    modelSearch.value = "";
  }
);

function selectProvider(providerId) {
  setActiveProvider(providerId);
}

function formatModelLabel(model) {
  if (!model) return "";
  if (model.name && model.name !== model.id) {
    return `${model.name} (${model.id})`;
  }
  return model.name || model.id;
}

async function testConnection() {
  loading.value = true;
  statusText.value = "";
  statusError.value = false;

  const targetProvider = aiSession.activeProvider;
  const key = draftKey.value.trim();

  if (!key) {
    statusText.value = "请先输入 API Key";
    statusError.value = true;
    loading.value = false;
    return;
  }

  try {
    const models = await fetchProviderModels(targetProvider, key);

    setSessionApiKey(key, targetProvider);
    setProviderModels(models, targetProvider);

    if (models.length > 0) {
      const current = getActiveModelId();
      const stillValid = models.some((m) => m.id === current);
      if (!stillValid) {
        setSelectedModel(models[0].id, targetProvider);
      }
    }

    statusText.value = `${activeProvider.value.name} 连接成功，已获取 ${models.length} 个可用对话模型。`;
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