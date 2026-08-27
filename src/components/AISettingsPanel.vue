<template>
  <section class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3.5" aria-labelledby="ai-settings-title">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 id="ai-settings-title" class="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>✦</span> AI 助手
        </h3>
        <p class="mt-1 text-[11px] text-zinc-500 leading-relaxed">OpenRouter 直连。API Key 仅保存在本次浏览器会话，关闭标签页后清除。</p>
      </div>
      <span class="text-[10px] px-2 py-1 rounded-full border"
            :class="connected ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 text-zinc-500'">
        {{ connected ? '已连接' : '未连接' }}
      </span>
    </div>

    <div class="space-y-2">
      <label for="openrouter-key" class="block text-[11px] font-medium text-zinc-300">OpenRouter API Key</label>
      <input id="openrouter-key" v-model="draftKey" type="password" autocomplete="off" spellcheck="false"
             placeholder="sk-or-v1-…"
             class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2.5 text-xs text-zinc-100 font-mono outline-none" />
      <div class="grid grid-cols-2 gap-2">
        <button type="button" @click="testConnection" :disabled="loading || !draftKey.trim()"
                class="py-2.5 rounded-xl bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-xs font-bold active:scale-95">
          {{ loading ? '连接中…' : '测试连接并获取模型' }}
        </button>
        <button type="button" @click="clearConnection" :disabled="loading || (!draftKey && !connected)"
                class="py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 disabled:text-zinc-700 text-zinc-300 text-xs font-bold active:scale-95">
          一键清除连接
        </button>
      </div>
      <p v-if="statusText" class="text-[11px] leading-relaxed" :class="statusError ? 'text-red-400' : 'text-emerald-400'" role="status">
        {{ statusText }}
      </p>
    </div>

    <div v-if="connected" class="space-y-2.5 pt-1 border-t border-zinc-800/80">
      <label for="model-search" class="block text-[11px] font-medium text-zinc-300">搜索并选择当前模型</label>
      <input id="model-search" v-model="modelSearch" type="search" placeholder="名称或模型 ID"
             class="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-3 py-2.5 text-xs text-zinc-100 outline-none" />
      <select v-model="selectedModelId" size="5"
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs text-zinc-200 outline-none overflow-auto">
        <option v-for="model in visibleModels" :key="model.id" :value="model.id" class="py-1.5">
          {{ model.name }} — {{ model.id }}
        </option>
      </select>
      <p v-if="!visibleModels.length" class="text-[11px] text-zinc-500">没有匹配的文字对话模型。</p>

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
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { aiSession, clearAIConnection, setSelectedModel, setSessionApiKey } from "../ai/aiSession.js";
import { fetchOpenRouterModels, testOpenRouterConnection } from "../ai/openrouterClient.js";
import { filterModels } from "../ai/modelCapabilities.js";

const draftKey = ref(aiSession.apiKey);
const modelSearch = ref("");
const loading = ref(false);

const connected = computed(() => Boolean(aiSession.apiKey && aiSession.models.length));
const statusText = computed(() => aiSession.connectionMessage);
const statusError = computed(() => aiSession.connectionState === "error");
const visibleModels = computed(() => filterModels(aiSession.models, modelSearch.value).slice(0, 120));
const selectedModel = computed(() => aiSession.models.find((model) => model.id === aiSession.selectedModelId) || null);
const selectedModelId = computed({
  get: () => aiSession.selectedModelId,
  set: (value) => setSelectedModel(value)
});

watch(() => aiSession.apiKey, (value) => {
  if (!value) draftKey.value = "";
});

async function testConnection() {
  loading.value = true;
  aiSession.connectionState = "loading";
  aiSession.connectionMessage = "";
  const key = draftKey.value.trim();
  try {
    await testOpenRouterConnection(key);
    const models = await fetchOpenRouterModels(key);
    setSessionApiKey(key);
    aiSession.models = models;
    if (!models.some((model) => model.id === aiSession.selectedModelId)) setSelectedModel(models[0]?.id || "");
    aiSession.connectionState = "connected";
    aiSession.connectionMessage = `连接成功，已获取 ${models.length} 个文字对话模型。`;
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
.capability-badge {
  border-radius: 9999px;
  border-width: 1px;
  padding: 0.2rem 0.5rem;
  font-size: 10px;
  line-height: 1;
}
.capability-on { border-color: rgb(16 185 129 / 0.35); background: rgb(16 185 129 / 0.1); color: rgb(52 211 153); }
.capability-off { border-color: rgb(63 63 70); color: rgb(113 113 122); }
</style>
