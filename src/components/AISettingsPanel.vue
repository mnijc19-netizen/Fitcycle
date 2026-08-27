<template>
  <section class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-4" aria-labelledby="ai-settings-title">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 id="ai-settings-title" class="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
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

    <!-- Provider Selection -->
    <div class="space-y-1.5">
      <label class="block text-[11px] font-medium text-zinc-300">选择 AI 服务商</label>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" aria-label="AI 提供商">
        <button v-for="provider in AI_PROVIDERS" :key="provider.id" type="button"
                class="py-2 px-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 active:scale-98"
                :class="aiSession.activeProvider === provider.id ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-md shadow-amber-500/20' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'"
                @click="selectProvider(provider.id)">
          <span class="font-bold">{{ provider.name }}</span>
          <span class="text-[9px] font-normal opacity-80 truncate max-w-full">{{ provider.tag || provider.id }}</span>
        </button>
      </div>
    </div>

    <!-- API Key Input with Show/Hide Toggle & Quick Portal Link -->
    <div class="space-y-2 pt-1">
      <div class="flex items-center justify-between text-[11px]">
        <label for="provider-key" class="font-medium text-zinc-300">{{ activeProvider.keyLabel }}</label>
        <a :href="portalLink" target="_blank" rel="noopener noreferrer" 
           class="text-[11px] text-amber-400 hover:text-amber-300 underline flex items-center gap-0.5">
          <span>获取 Key</span> <span>↗</span>
        </a>
      </div>
      
      <div class="relative">
        <input id="provider-key" v-model="draftKey" :type="showKey ? 'text' : 'password'" autocomplete="off" spellcheck="false"
               placeholder="仅粘贴当前厂商的 API Key"
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

    <!-- Model Selection Section -->
    <div v-if="connected" class="space-y-3 pt-2 border-t border-zinc-800/80">
      <div class="space-y-1.5">
        <label for="model-search" class="block text-[11px] font-medium text-zinc-300">选择或搜索 {{ activeProvider.name }} 模型</label>
        <input id="model-search" v-model="modelSearch" type="search" placeholder="输入名称筛选模型 ID..."
               class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none transition-colors" />
      </div>

      <select v-model="selectedModelId" size="4"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs text-zinc-200 outline-none overflow-auto font-mono">
        <option v-for="model in visibleModels" :key="model.id" :value="model.id" class="py-1.5 px-1 rounded hover:bg-zinc-800">{{ formatModelLabel(model) }}</option>
      </select>
      <p v-if="!visibleModels.length" class="text-[11px] text-zinc-500">没有匹配的对话模型。</p>

      <!-- Active Model Capability Overview Card -->
      <div v-if="selectedModel" class="rounded-2xl bg-zinc-950 border border-zinc-800/90 p-3.5 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="text-xs font-bold text-zinc-100 break-words">{{ selectedModel.name }}</div>
          <span class="text-[10px] font-mono text-amber-400">生效中</span>
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

      <button type="button" data-testid="open-ai-assistant" @click="aiSession.drawerOpen = true"
              class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all">
        ✦ 打开 AI 教练对话
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
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
import { filterModels } from "../ai/modelCapabilities.js";

const draftKey = ref(getActiveApiKey());
const modelSearch = ref("");
const loading = ref(false);
const showKey = ref(false);

const activeProvider = computed(getActiveProvider);
const activeModels = computed(getActiveModels);
const connected = computed(() => Boolean(getActiveApiKey() && activeModels.value.length));
const hasAnyConnection = computed(() => AI_PROVIDERS.some(({ id }) => Boolean(aiSession.apiKeys[id])) || Boolean(draftKey.value));
const statusText = computed(() => aiSession.connectionMessage);
const statusError = computed(() => aiSession.connectionState === "error");
const visibleModels = computed(() => filterModels(activeModels.value, modelSearch.value).slice(0, 120));
const selectedModel = computed(() => activeModels.value.find((model) => model.id === getActiveModelId()) || null);
const selectedModelId = computed({ get: getActiveModelId, set: (value) => setSelectedModel(value) });

function formatModelLabel(model) {
  if (!model) return "";
  if (model.name && model.name !== model.id) {
    return `${model.name} (${model.id})`;
  }
  return model.id;
}

const portalLink = computed(() => {
  return activeProvider.value?.portal || "https://platform.deepseek.com";
});

watch(() => aiSession.activeProvider, () => {
  draftKey.value = getActiveApiKey();
  modelSearch.value = "";
});

function selectProvider(provider) {
  setActiveProvider(provider);
}

async function testConnection() {
  loading.value = true;
  aiSession.connectionState = "loading";
  aiSession.connectionMessage = "";
  const key = draftKey.value.trim();
  const provider = aiSession.activeProvider;
  try {
    const models = await fetchProviderModels(provider, key);
    if (!models.length) throw new Error(`${getActiveProvider().name}未返回可用对话模型`);
    setSessionApiKey(key, provider);
    setProviderModels(models, provider);
    if (!models.some((model) => model.id === aiSession.selectedModelIds[provider])) setSelectedModel(models[0].id, provider);
    aiSession.connectionState = "connected";
    aiSession.connectionMessage = `${getActiveProvider().name}连接成功，已获取 ${models.length} 个对话模型。`;
  } catch (error) {
    aiSession.connectionState = "error";
    aiSession.connectionMessage = error instanceof Error ? error.message : "连接失败";
  } finally {
    loading.value = false;
  }
}

function clearConnection() {
  clearAIConnection();
  draftKey.value = "";
  modelSearch.value = "";
}
</script>

<style scoped>
.capability-badge { border-radius: 9999px; border-width: 1px; padding: 0.2rem 0.55rem; font-size: 10px; line-height: 1; font-weight: 500; }
.capability-on { border-color: rgb(16 185 129 / 0.4); background: rgb(16 185 129 / 0.12); color: rgb(52 211 153); }
.capability-off { border-color: rgb(63 63 70); color: rgb(113 113 122); }
</style>

