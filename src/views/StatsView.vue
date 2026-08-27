<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">

    
    <!-- Top Header -->
    <div>
      <h2 class="text-lg font-black text-white flex items-center gap-2">
        <span>📊</span> 训练数据与系统设置
      </h2>
      <p class="text-xs text-zinc-400">
        训练容量分析、偏好设置与数据备份恢复
      </p>
    </div>

    <!-- Overall Lifetime Metrics Grid -->
    <div class="grid grid-cols-2 gap-2.5">
      <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
        <div class="text-xs text-zinc-400 font-medium flex items-center gap-1">
          <span>🏋️</span> 累计总容量
        </div>
        <div class="text-xl font-black text-emerald-400 font-mono">
          {{ totalVolumeMetric }} <span class="text-xs font-normal text-zinc-400">kg</span>
        </div>
      </div>

      <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
        <div class="text-xs text-zinc-400 font-medium flex items-center gap-1">
          <span>🔥</span> 累计打卡次数
        </div>
        <div class="text-xl font-black text-amber-400 font-mono">
          {{ store.workoutLogs.length }} <span class="text-xs font-normal text-zinc-400">次</span>
        </div>
      </div>

      <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
        <div class="text-xs text-zinc-400 font-medium flex items-center gap-1">
          <span>⏱️</span> 累计训练时长
        </div>
        <div class="text-xl font-black text-sky-400 font-mono">
          {{ totalHoursMetric }} <span class="text-xs font-normal text-zinc-400">小时</span>
        </div>
      </div>

      <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
        <div class="text-xs text-zinc-400 font-medium flex items-center gap-1">
          <span>🎯</span> 完成总组数
        </div>
        <div class="text-xl font-black text-purple-400 font-mono">
          {{ totalSetsMetric }} <span class="text-xs font-normal text-zinc-400">组</span>
        </div>
      </div>
    </div>

    <!-- Recent 7-Workout Volume Trend Visualizer -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">近期训练容量趋势 (kg)</span>
        <span class="text-[10px] text-zinc-500 font-mono">最近 7 次</span>
      </div>

      <div v-if="recentVolumeStats.length" class="space-y-2 pt-2">
        <div class="flex items-end justify-between gap-2 h-28 px-1">
          <div v-for="(item, idx) in recentVolumeStats" :key="idx"
               class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <span class="text-[9px] font-mono text-zinc-400">{{ item.volume > 0 ? `${Math.round(item.volume / 1000)}k` : '0' }}</span>
            <div class="w-full bg-zinc-800 rounded-t-lg overflow-hidden flex items-end" style="height: 70px">
              <div class="w-full transition-all duration-500 rounded-t-lg"
                   :class="[
                     item.color === 'amber' ? 'bg-amber-500' :
                     item.color === 'sky' ? 'bg-sky-500' :
                     item.color === 'purple' ? 'bg-purple-500' :
                     'bg-emerald-500'
                   ]"
                   :style="{ height: `${Math.max(8, item.percent)}%` }">
              </div>
            </div>
            <span class="text-[9px] text-zinc-500 font-mono truncate w-full text-center">{{ item.shortDate }}</span>
          </div>
        </div>
      </div>

      <div v-else class="py-8 text-center text-xs text-zinc-500">
        记录更多训练后将生成容量走势图
      </div>
    </div>

    <!-- User Gym Settings -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3.5">
      <div class="text-xs font-bold text-zinc-400 uppercase tracking-wider">
        ⚙️ 训练与计时器偏好
      </div>

      <!-- Rest Timer Duration Setting -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-200 font-medium">默认组间休息时长</span>
          <span class="font-bold text-amber-400 font-mono">{{ store.settings.defaultRestSeconds }} 秒</span>
        </div>
        <div class="grid grid-cols-4 gap-1.5">
          <button v-for="item in [
                    { sec: 60, label: '泵感' },
                    { sec: 90, label: '标准推荐' },
                    { sec: 120, label: '大肌群' },
                    { sec: 180, label: '力量' }
                  ]" 
                  :key="item.sec"
                  @click="store.settings.defaultRestSeconds = item.sec"
                  class="py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5"
                  :class="[store.settings.defaultRestSeconds === item.sec ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-md shadow-amber-500/20' : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700']">
            <span class="text-xs font-mono font-black leading-none">{{ item.sec }}s</span>
            <span class="text-[9px] leading-none opacity-85 font-medium">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <!-- Sound Toggle -->
      <div class="flex items-center justify-between py-1 border-t border-zinc-800/80">
        <div>
          <div class="text-xs font-medium text-zinc-200">打卡提示音与倒计时铃声</div>
          <div class="text-[10px] text-zinc-500">完成单组及休息结束时播放清脆提示音</div>
        </div>
        <button @click="store.settings.soundEnabled = !store.settings.soundEnabled"
                class="w-12 h-6 rounded-full transition-colors relative p-0.5"
                :class="[store.settings.soundEnabled ? 'bg-amber-500' : 'bg-zinc-800']">
          <div class="w-5 h-5 rounded-full bg-white transition-transform transform"
               :class="[store.settings.soundEnabled ? 'translate-x-6' : 'translate-x-0']"></div>
        </button>
      </div>

      <!-- Vibration Toggle -->
      <div class="flex items-center justify-between py-1 border-t border-zinc-800/80">
        <div>
          <div class="text-xs font-medium text-zinc-200">触感强震动反馈 (Haptic)</div>
          <div class="text-[10px] text-zinc-500">休息倒计时结束与打卡时提供穿透震动</div>
        </div>
        <button @click="store.settings.vibrationEnabled = !store.settings.vibrationEnabled"
                class="w-12 h-6 rounded-full transition-colors relative p-0.5"
                :class="[store.settings.vibrationEnabled ? 'bg-amber-500' : 'bg-zinc-800']">
          <div class="w-5 h-5 rounded-full bg-white transition-transform transform"
               :class="[store.settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0']"></div>
        </button>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- Personalized Appearance / Compact Skin Carousel -->
    <!-- ============================================== -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3 transition-all">
      <div class="flex items-center justify-between">
        <div class="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>🎨</span> 个性化外观
        </div>
        <span v-if="store.settings.unlockedSkins.length > 1" 
              class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
          已解锁 {{ store.settings.unlockedSkins.length }} 款皮肤 (可横向滑动)
        </span>
      </div>

      <!-- Horizontal Scrollable Skin Carousel -->
      <div v-if="store.settings.unlockedSkins.length > 1" class="space-y-2.5">
        <div class="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none snap-x snap-mandatory">
          <!-- Option 1: Default Skin -->
          <button @click="handleSelectSkin('default')"
                  class="flex-shrink-0 w-[165px] snap-start p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[96px]"
                  :class="[
                    store.settings.uiSkin === 'default' 
                      ? 'bg-zinc-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/40' 
                      : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 opacity-75'
                  ]">
            <div class="flex items-center justify-between w-full">
              <span class="text-xs font-bold text-zinc-100 flex items-center gap-1">
                <span>🌑</span> 默认外观
              </span>
              <span v-if="store.settings.uiSkin === 'default'" class="w-2 h-2 rounded-full bg-amber-400"></span>
            </div>
            <div class="text-[10px] text-zinc-400 leading-tight">
              经典深灰黑 · 活力琥珀金
            </div>
            <div class="flex items-center gap-1 mt-1">
              <span class="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span v-if="store.settings.uiSkin === 'default'" class="text-[9px] text-amber-400 font-bold ml-auto font-mono">当前生效</span>
            </div>
          </button>

          <!-- Option 2: Chamber Skin (if unlocked) -->
          <button v-if="store.settings.unlockedSkins.includes('chamber')"
                  @click="handleSelectSkin('chamber')"
                  class="flex-shrink-0 w-[165px] snap-start p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[96px]"
                  :class="[
                    store.settings.uiSkin === 'chamber' 
                      ? 'bg-[#0D1627] border-[#E5C378] shadow-md ring-1 ring-[#E5C378]/50' 
                      : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 opacity-75'
                  ]">
            <div class="flex items-center justify-between w-full">
              <span class="text-xs font-bold text-zinc-100 flex items-center gap-1">
                <span>⚜️</span> 尚博勒
              </span>
              <span v-if="store.settings.uiSkin === 'chamber'" class="w-2 h-2 rounded-full bg-[#E5C378]"></span>
            </div>
            <div class="text-[10px] text-zinc-400 leading-tight">
              法式精密深蓝 · 香槟流金
            </div>
            <div class="flex items-center gap-1 mt-1">
              <span class="w-2.5 h-2.5 rounded-full bg-[#070B14] border border-[#1E3052]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#E5C378]"></span>
              <span v-if="store.settings.uiSkin === 'chamber'" class="text-[9px] text-[#E5C378] font-bold ml-auto font-mono">当前生效</span>
            </div>
          </button>

          <!-- Option 3: CS2 Skin (if unlocked) -->
          <button v-if="store.settings.unlockedSkins.includes('cs')"
                  @click="handleSelectSkin('cs')"
                  class="flex-shrink-0 w-[165px] snap-start p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[96px]"
                  :class="[
                    store.settings.uiSkin === 'cs' 
                      ? 'bg-[#0F172A] border-[#F97316] shadow-md ring-1 ring-[#F97316]/50' 
                      : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 opacity-75'
                  ]">
            <div class="flex items-center justify-between w-full">
              <span class="text-xs font-bold text-zinc-100 flex items-center gap-1">
                <span>🎯</span> CS2 特训
              </span>
              <span v-if="store.settings.uiSkin === 'cs'" class="w-2 h-2 rounded-full bg-[#F97316]"></span>
            </div>
            <div class="text-[10px] text-zinc-400 leading-tight">
              官方正版全景 · 索尔曼&戴劳
            </div>
            <div class="flex items-center gap-1 mt-1">
              <span class="w-2.5 h-2.5 rounded-full bg-[#080C14] border border-[#1E293B]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
              <span v-if="store.settings.uiSkin === 'cs'" class="text-[9px] text-[#F97316] font-bold ml-auto font-mono">当前生效</span>
            </div>
          </button>
        </div>

        <!-- Restore Default Skin Button (Visible when custom skin is active) -->
        <div v-if="store.settings.uiSkin !== 'default'" class="pt-0.5">
          <button @click="handleRestoreDefaultSkin"
                  class="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium rounded-xl border border-zinc-800 transition-colors flex items-center justify-center gap-1.5">
            <span>↩️</span> 恢复默认外观
          </button>
        </div>
      </div>

      <!-- Passcode Input Form (Always available to unlock more skins) -->
      <div class="space-y-2.5 pt-1" :class="[store.settings.unlockedSkins.length > 1 ? 'border-t border-zinc-800/60 pt-3' : '']">
        <p class="text-xs text-zinc-400 leading-relaxed">
          {{ store.settings.unlockedSkins.length > 1 ? '输入其他暗号，解锁更多主题皮肤' : '输入暗号，解锁隐藏界面皮肤' }}
        </p>

        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <input type="text"
                     name="skin_passcode"
                     v-model="passcodeInput"
                     maxlength="30"
                     autocomplete="off"
                     autocapitalize="off"
                     autocorrect="off"
                     spellcheck="false"
                     @keydown.enter.prevent="handlePasscodeSubmit"
                     placeholder="输入解锁暗号..."
                     class="w-full bg-zinc-950 border text-xs text-zinc-100 rounded-xl px-3 py-2.5 focus:outline-none transition-colors"
                     :class="[passcodeError ? 'border-red-500/80 focus:border-red-500' : 'border-zinc-800 focus:border-amber-500/60']" />
            </div>

            <button @click="handlePasscodeSubmit"
                    class="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center flex-shrink-0">
              确认
            </button>
          </div>

          <!-- Subtle inline error message -->
          <div v-if="passcodeError" class="text-xs text-red-400 flex items-center gap-1 pl-1 pt-0.5">
            <span>⚠️</span> 暗号不正确
          </div>
        </div>
      </div>
    </div>

    <!-- Fitcycle AI Coach Settings Compact Entry Card -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl flex items-center justify-between cursor-pointer hover:border-amber-500/40 active:scale-98 transition-all group"
         @click="showAISettingsModal = true"
         data-testid="open-ai-settings-modal">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/10">
          ✦
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-bold text-zinc-100">智能教练设置 (Fitcycle AI)</h3>
            <span class="text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium"
                  :class="aiConnected ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 bg-zinc-950 text-zinc-500'">
              {{ aiConnected ? '● 已就绪' : '○ 未连接' }}
            </span>
          </div>
          <p class="text-[11px] text-zinc-400 truncate mt-0.5">
            {{ aiConnected ? `${activeAIProvider.name} · ${activeAIModel?.name || getActiveModelId()}` : '点击连接 DeepSeek / 智谱 / 通义千问 / 硅基流动' }}
          </p>
        </div>
      </div>
      <div class="text-zinc-500 group-hover:text-amber-400 transition-colors text-sm font-bold pl-2">
        ›
      </div>
    </div>

    <!-- Full AI Settings Modal Sheet -->
    <div v-if="showAISettingsModal" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="showAISettingsModal = false"></div>
      
      <!-- Modal Container with Fixed Header and Scrollable Body -->
      <section class="relative w-full max-w-lg h-[min(88dvh,720px)] bg-zinc-950 border border-zinc-700 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-6 duration-200">
        <!-- Fixed Header -->
        <header class="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 font-bold text-sm">✦</span>
            <h2 class="text-xs font-bold text-zinc-100 uppercase tracking-wider">智能教练配置 (Fitcycle AI)</h2>
          </div>
          <button type="button" @click="showAISettingsModal = false" class="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition-colors">✕</button>
        </header>

        <!-- Scrollable Content Area with Generous Bottom Padding -->
        <div class="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4" style="padding-bottom: max(calc(env(safe-area-inset-bottom, 0px) + 6rem), 5rem);">
          <AISettingsPanel @open-chat="handleOpenChatFromSettings" />
        </div>
      </section>
    </div>

    <!-- Data Backup & Reset -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      <div class="text-xs font-bold text-zinc-400 uppercase tracking-wider">
        💾 数据安全与备份
      </div>
      <p class="text-[11px] text-zinc-400 leading-relaxed">
        所有计划与打卡记录均保存在手机本地浏览器中，离线可用。建议定期导出备份文件或在不同设备间迁移数据。
      </p>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <button @click="handleExport" 
                class="py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-zinc-200 rounded-xl border border-zinc-700/80 flex items-center justify-center gap-1.5">
          <span>📤</span> 导出备份 JSON
        </button>

        <button @click="triggerFileInput" 
                class="py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs font-bold text-zinc-200 rounded-xl border border-zinc-700/80 flex items-center justify-center gap-1.5">
          <span>📥</span> 导入备份文件
        </button>
        <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileSelected" />
      </div>

      <div class="pt-2 border-t border-zinc-800">
        <button @click="handleResetDefaults" 
                class="w-full py-2.5 bg-zinc-950 hover:bg-red-950/30 text-zinc-500 hover:text-red-400 text-xs font-semibold rounded-xl border border-zinc-800/80 transition-colors">
          恢复默认推拉腿黄金计划设置
        </button>
      </div>
    </div>

    <!-- In-page Toast Notification -->
    <div v-if="toastText"
         class="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900/95 border border-amber-500/50 shadow-2xl rounded-full text-xs font-bold text-amber-400 flex items-center gap-2 backdrop-blur-md">
      <span>✨</span>
      <span>{{ toastText }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AISettingsPanel from "../components/AISettingsPanel.vue";
import {
  aiSession,
  getActiveApiKey,
  getActiveProvider,
  getActiveModelId,
  getActiveModels
} from "../ai/aiSession.js";
import { 
  store, 
  exportBackupJSON, 
  importBackupJSON, 
  resetAllDataToDefault,
  unlockSkin,
  setUISkin,
  restoreDefaultSkin
} from "../store/fitnessStore.js";

const showAISettingsModal = ref(false);
const activeAIProvider = computed(getActiveProvider);
const activeAIModels = computed(getActiveModels);
const aiConnected = computed(() => Boolean(getActiveApiKey() && activeAIModels.value.length));
const activeAIModel = computed(() => activeAIModels.value.find((m) => m.id === getActiveModelId()));

function handleOpenChatFromSettings() {
  showAISettingsModal.value = false;
  aiSession.drawerOpen = true;
}

const fileInput = ref(null);
const passcodeInput = ref("");
const showPasscode = ref(false);
const passcodeError = ref(false);
const toastText = ref("");
let toastTimeout = null;

function showToast(msg) {
  toastText.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastText.value = "";
  }, 2500);
}

function handlePasscodeSubmit() {
  passcodeError.value = false;
  const result = unlockSkin(passcodeInput.value);
  if (result.success) {
    passcodeInput.value = "";
    passcodeError.value = false;
    showToast(result.message);
  } else {
    passcodeError.value = true;
  }
}

function handleSelectSkin(skinName) {
  setUISkin(skinName);
  if (skinName === "chamber") {
    showToast("已启用尚博勒隐藏皮肤");
  } else if (skinName === "cs") {
    showToast("💥 已启用 CS2 完美特训战术皮肤");
  } else {
    showToast("已切换至默认外观");
  }
}

function handleRestoreDefaultSkin() {
  const result = restoreDefaultSkin();
  showToast(result.message);
}

const totalVolumeMetric = computed(() => {
  const sum = store.workoutLogs.reduce((acc, l) => acc + (l.totalVolume || 0), 0);
  return sum.toLocaleString();
});

const totalHoursMetric = computed(() => {
  const totalSec = store.workoutLogs.reduce((acc, l) => acc + (l.durationSeconds || 0), 0);
  return (totalSec / 3600).toFixed(1);
});

const totalSetsMetric = computed(() => {
  return store.workoutLogs.reduce((acc, l) => acc + (l.totalSets || 0), 0);
});

const recentVolumeStats = computed(() => {
  const logs = [...store.workoutLogs]
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    .slice(-7);

  if (!logs.length) return [];
  const maxVol = Math.max(1, ...logs.map(l => l.totalVolume || 0));

  return logs.map(l => {
    const parts = (l.date || "").split("-");
    const shortDate = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : l.date;
    return {
      date: l.date,
      shortDate,
      volume: l.totalVolume || 0,
      color: l.color || "amber",
      percent: Math.round(((l.totalVolume || 0) / maxVol) * 100)
    };
  });
});

function handleExport() {
  const json = exportBackupJSON();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `FitCycle_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerFileInput() {
  if (fileInput.value) fileInput.value.click();
}

function handleFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result;
    if (typeof content === "string") {
      const ok = importBackupJSON(content);
      if (ok) {
        showToast("🎉 备份数据已成功恢复！");
      } else {
        alert("❌ 备份文件格式错误，导入失败。");
      }
    }
  };
  reader.readAsText(file);
}

function handleResetDefaults() {
  if (confirm("确定要恢复出厂默认设置吗？已有的自定义修改将被重置为推拉腿黄金模板。")) {
    resetAllDataToDefault();
    showToast("已恢复出厂默认设置！");
  }
}
</script>

