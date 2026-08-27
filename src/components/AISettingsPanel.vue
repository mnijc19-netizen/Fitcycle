<template>
  <section class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3.5" aria-labelledby="ai-settings-title">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 id="ai-settings-title" class="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5"><span>✦</span> AI 助手</h3>
        <p class="mt-1 text-[11px] text-zinc-500 leading-relaxed">厂商 API 直连。所有 Key 仅保存在本次浏览器会话，关闭标签页后清除。</p>
      </div>
      <span class="text-[10px] px-2 py-1 rounded-full border"
            :class="connected ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 text-zinc-500'">
        {{ connected ? '已连接' : '未连接' }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-2" aria-label="AI 提供商">
      <button v-for="provider in AI_PROVIDERS" :key="provider.id" type="button"
              class="py-2.5 rounded-xl border text-xs font-bold transition-colors"
              :class="aiSession.activeProvider === provider.id ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'bg-zinc-950 border-zinc-800 text-zinc-400'"
              @click="selectProvider(provider.id)">
        {{ provider.name }}
      </button>
    </div>

    <div class="space-y-2">
      <label for="provider-key" class="block text-[11px] font-medium text-zinc-300">{{ activeProvider.keyLabel }}</label>
      <input id="provider-key" v-model="draftKey" type="password" autocomplete="off" spellcheck="false"
             placeholder="仅粘贴当前厂商的 API Key"
             class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2.5 text-xs text-zinc-100 font-mono outline-none" />
      <div class="grid grid-cols-2 gap-2">
        <button type="button" @click="testConnection" :disabled="loading || !draftKey.trim()"
                class="py-2.5 rounded-xl bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-xs font-bold active:scale-95">
          {{ loading ? '连接中…' : '验证并获取模型' }}
        </button>
        <button type="button" @click="clearConnection" :disabled="loading || !hasAnyConnection"
                class="py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 disabled:text-zinc-700 text-zinc-300 text-xs font-bold active:scale-95">
          清除全部 AI 连接
        </button>
      </div>
      <p v-if="statusText" class="text-[11px] leading-relaxed" :class="statusError ? 'text-red-400' : 'text-emerald-400'" role="status">{{ statusText }}</p>
    </div>

    <div v-if="connected" class="space-y-2.5 pt-1 border-t border-zinc-800/80">
      <label for="model-search" class="block text-[11px] font-medium text-zinc-300">搜索并选择 {{ activeProvider.name }} 模型</label>
      <input id="model-search" v-model="modelSearch" type="search" placeholder="名称或模型 ID"
             class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2.5 text-xs text-zinc-100 outline-none" />
      <select v-model="selectedModelId" size="5"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs text-zinc-200 outline-none overflow-auto">
        <option v-for="model in visibleModels" :key="model.id" :value="model.id" class="py-1.5">{{ model.name }} — {{ model.id }}</option>
      </select>
      <p v-if="!visibleModels.length" class="text-[11px] text-zinc-500">没有匹配的对话模型。</p>

      <div v-if="selectedModel" class="rounded-2xl bg-zinc-950 border border-zinc-800 p-3 space-y-2">
        <div class="text-xs font-bold text-zinc-100 break-words">{{ selectedModel.name }}</div>
        <div class="text-[10px] text-zinc-500 font-mono break-all">{{ selectedModel.id }}</div>
        <div class="flex flex-wrap gap-1.5">
          <span class="capability-badge capability-on">文字</span>
          <span class="capability-badge" :class="selectedModel.capabilities.image ? 'capability-on' : 'capability-off'">图片 {{ selectedModel.capabilities.image ? '✓' : '×' }}</span>
          <span class="capability-badge" :class="selectedModel.capabilities.tools ? 'capability-on' : 'capability-off'">tools {{ selectedModel.capabilities.tools ? '✓' : '×' }}</span>
          <span class="capability-badge" :class="selectedModel.capabilities.streaming ? 'capability-on' : 'capability-off'">流式 {{ selectedModel.capabilities.streaming ? '✓' : '×' }}</span>
        </div>
        <p v-if="!selectedModel.capabilities.tools" class="text-[10px] text-amber-400/90">该模型可聊天，但不会收到或执行任何 Fitcycle 工具。</p>
        <p v-if="aiSession.activeProvider === 'deepseek'" class="text-[10px] text-zinc-500">DeepSeek 官方接口当前不接收图片；图片问题请切换到支持视觉的智谱 GLM 模型。</p>
      </div>
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

const activeProvider = computed(getActiveProvider);
const activeModels = computed(getActiveModels);
const connected = computed(() => Boolean(getActiveApiKey() && activeModels.value.length));
const hasAnyConnection = computed(() => AI_PROVIDERS.some(({ id }) => Boolean(aiSession.apiKeys[id])) || Boolean(draftKey.value));
const statusText = computed(() => aiSession.connectionMessage);
const statusError = computed(() => aiSession.connectionState === "error");
const visibleModels = computed(() => filterModels(activeModels.value, modelSearch.value).slice(0, 120));
const selectedModel = computed(() => activeModels.value.find((model) => model.id === getActiveModelId()) || null);
const selectedModelId = computed({ get: getActiveModelId, set: (value) => setSelectedModel(value) });

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
.capability-badge { border-radius: 9999px; border-width: 1px; padding: 0.2rem 0.5rem; font-size: 10px; line-height: 1; }
.capability-on { border-color: rgb(16 185 129 / 0.35); background: rgb(16 185 129 / 0.1); color: rgb(52 211 153); }
.capability-off { border-color: rgb(63 63 70); color: rgb(113 113 122); }
</style>
