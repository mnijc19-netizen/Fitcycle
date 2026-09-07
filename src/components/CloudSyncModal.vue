<template>
  <Teleport to="body">
    <div v-if="visible"
         class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 overflow-hidden touch-none select-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 text-left"
           style="touch-action: pan-y; max-width: min(32rem, 100vw); box-sizing: border-box;">
        
        <!-- Ergonomic Grabber -->
        <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0"></div>

        <!-- Header -->
        <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 text-base">
              ☁️
            </div>
            <div>
              <h3 class="text-sm font-black text-zinc-100 flex items-center gap-2">
                <span>云端跨端同步与备份</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                      :class="isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'">
                  {{ isOnline ? '在线' : '离线保护' }}
                </span>
              </h3>
              <p class="text-xs text-zinc-400 font-mono">手机/电脑跨设备数据同步 · 永久防丢</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="overflow-y-auto flex-1 p-4 space-y-4 overscroll-contain">
          
          <!-- Mode Tabs -->
          <div class="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
            <button @click="activeMode = 'gist'"
                    class="py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer"
                    :class="activeMode === 'gist' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'">
              GitHub Gist (推荐)
            </button>
            <button @click="activeMode = 'custom'"
                    class="py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer"
                    :class="activeMode === 'custom' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'">
              自定义接口 / REST
            </button>
          </div>

          <!-- Gist Sync Section -->
          <div v-if="activeMode === 'gist'" class="space-y-3.5">
            <div class="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-zinc-400 font-medium">同步机制：</span>
                <span class="text-amber-400 font-bold">私有 GitHub Gist (零成本·永久安全)</span>
              </div>
              <div class="text-xs text-zinc-400 leading-normal">
                无需自建服务器。凭个人 GitHub Token，数据直接加密托管在你的私有 Gist 中，手机与电脑一键互通。
              </div>
            </div>

            <!-- Token input -->
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-zinc-300">GitHub Personal Access Token (classic)</label>
                <a href="https://github.com/settings/tokens" target="_blank" class="text-xs text-amber-400 hover:underline">去生成 Token ↗</a>
              </div>
              <div class="relative">
                <input :type="showToken ? 'text' : 'password'"
                       v-model="githubToken"
                       placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                       class="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none pr-10" />
                <button type="button" @click="showToken = !showToken"
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200">
                  {{ showToken ? '隐藏' : '显示' }}
                </button>
              </div>
              <p class="text-xs text-zinc-500">仅需勾选 `gist` 权限即可，Token 仅保存在本地设备。</p>
            </div>

            <!-- Gist ID input (optional) -->
            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>Gist ID (已有备份请输入，首次可留空自动创建)</span>
              </label>
              <input type="text"
                     v-model="gistId"
                     placeholder="留空则在首次上传时自动创建新私有 Gist"
                     class="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none" />
            </div>

            <!-- Last Sync Status -->
            <div v-if="lastSyncTimeStr" class="p-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <span class="text-zinc-400">上次云端同步时间：</span>
              <span class="font-mono text-zinc-200 font-bold">{{ lastSyncTimeStr }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-2.5 pt-1">
              <button @click="handleGistPush"
                      :disabled="isSyncing || !githubToken.trim()"
                      class="py-3 px-3 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                <span>{{ isSyncing ? '同步中...' : '一键上传至云端' }}</span>
              </button>

              <button @click="handleGistPull"
                      :disabled="isSyncing || !githubToken.trim() || !gistId.trim()"
                      class="py-3 px-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-zinc-100 font-black text-xs rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                <span>{{ isSyncing ? '同步中...' : '从云端拉取恢复' }}</span>
              </button>
            </div>
          </div>

          <!-- Custom REST Section -->
          <div v-else class="space-y-3.5">
            <div class="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl text-xs text-zinc-400 leading-normal">
              支持将备份数据同步至自定义 Webhook、Serverless 函数或自建 Supabase 数据库。
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-300">自定义接口地址 (POST Endpoint)</label>
              <input type="text"
                     v-model="customEndpoint"
                     placeholder="https://api.yourdomain.com/fitcycle-sync"
                     class="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none" />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-zinc-300">API Key / Bearer Token (可选)</label>
              <input type="password"
                     v-model="customApiKey"
                     placeholder="Bearer token 或 anon key"
                     class="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none" />
            </div>

            <button @click="handleCustomSync"
                    :disabled="isSyncing || !customEndpoint.trim()"
                    class="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
              <span>{{ isSyncing ? '同步中...' : '一键推送至自定义云端' }}</span>
            </button>
          </div>

          <!-- Toast Message -->
          <div v-if="feedbackMsg"
               class="p-2.5 rounded-xl border text-xs leading-relaxed"
               :class="feedbackError ? 'bg-red-500/15 border-red-500/30 text-red-300' : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'">
            {{ feedbackMsg }}
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { store, updateCloudSyncConfig } from "../store/fitnessStore.js";
import { exportStateToBackupObject, pushToGitHubGist, pullFromGitHubGist, syncToCustomEndpoint } from "../engine/cloudSyncEngine.js";
import { isOnline } from "../utils/networkStatus.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close", "restored"]);

const activeMode = ref("gist");
const showToken = ref(false);
const isSyncing = ref(false);
const feedbackMsg = ref("");
const feedbackError = ref(false);

const githubToken = ref("");
const gistId = ref("");
const customEndpoint = ref("");
const customApiKey = ref("");

onMounted(() => {
  const syncConfig = store.settings?.cloudSync || {};
  githubToken.value = syncConfig.githubToken || "";
  gistId.value = syncConfig.gistId || "";
  customEndpoint.value = syncConfig.customSyncEndpoint || "";
  customApiKey.value = syncConfig.customSyncApiKey || "";
});

const lastSyncTimeStr = computed(() => {
  const t = store.settings?.cloudSync?.lastSyncTime;
  if (!t) return null;
  return new Date(t).toLocaleString();
});

function setFeedback(msg, isError = false) {
  feedbackMsg.value = msg;
  feedbackError.value = isError;
}

async function handleGistPush() {
  if (!githubToken.value.trim()) {
    setFeedback("请先输入 GitHub Personal Access Token", true);
    return;
  }

  isSyncing.value = true;
  setFeedback("正在打包并上传至 GitHub Gist...");

  const backupData = exportStateToBackupObject(store);

  const res = await pushToGitHubGist({
    token: githubToken.value.trim(),
    gistId: gistId.value.trim(),
    data: backupData
  });

  isSyncing.value = false;

  if (res.success) {
    if (res.gistId) gistId.value = res.gistId;
    updateCloudSyncConfig({
      githubToken: githubToken.value.trim(),
      gistId: gistId.value.trim(),
      lastSyncTime: Date.now()
    });
    setFeedback(`🎉 ${res.message} (Gist ID: ${res.gistId})`, false);
  } else {
    setFeedback(`❌ ${res.message}`, true);
  }
}

async function handleGistPull() {
  if (!githubToken.value.trim() || !gistId.value.trim()) {
    setFeedback("请提供 Token 和 Gist ID", true);
    return;
  }

  if (!confirm("确定要从云端拉取并恢复数据吗？本地已有修改将被云端备份覆盖！")) {
    return;
  }

  isSyncing.value = true;
  setFeedback("正在从 GitHub Gist 下载备份数据...");

  const res = await pullFromGitHubGist({
    token: githubToken.value.trim(),
    gistId: gistId.value.trim()
  });

  isSyncing.value = false;

  if (res.success && res.data) {
    // Apply backup data to store
    if (Array.isArray(res.data.plans)) store.plans = res.data.plans;
    if (Array.isArray(res.data.workoutLogs)) store.workoutLogs = res.data.workoutLogs;
    if (Array.isArray(res.data.exercises)) store.exercises = res.data.exercises;
    if (Array.isArray(res.data.pinnedExerciseIds)) store.pinnedExerciseIds = res.data.pinnedExerciseIds;
    if (res.data.activeCycle) store.activeCycle = res.data.activeCycle;
    if (res.data.weeklySchedule) store.weeklySchedule = res.data.weeklySchedule;
    if (res.data.bodyMetrics) store.bodyMetrics = res.data.bodyMetrics;
    if (res.data.honorProfile) store.honorProfile = res.data.honorProfile;
    if (res.data.settings) store.settings = { ...store.settings, ...res.data.settings };

    updateCloudSyncConfig({
      githubToken: githubToken.value.trim(),
      gistId: gistId.value.trim(),
      lastSyncTime: Date.now()
    });

    setFeedback("🎉 数据已成功从云端恢复！页面已同步更新", false);
    emit("restored");
  } else {
    setFeedback(`❌ ${res.message}`, true);
  }
}

async function handleCustomSync() {
  if (!customEndpoint.value.trim()) return;

  isSyncing.value = true;
  setFeedback("正在同步至自定义云端...");

  const backupData = exportStateToBackupObject(store);

  const res = await syncToCustomEndpoint({
    endpoint: customEndpoint.value.trim(),
    apiKey: customApiKey.value.trim(),
    data: backupData
  });

  isSyncing.value = false;

  if (res.success) {
    updateCloudSyncConfig({
      customSyncEndpoint: customEndpoint.value.trim(),
      customSyncApiKey: customApiKey.value.trim(),
      lastSyncTime: Date.now()
    });
    setFeedback("🎉 已成功推送至自定义云端！", false);
  } else {
    setFeedback(`❌ ${res.message}`, true);
  }
}
</script>
