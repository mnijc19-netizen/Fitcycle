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
          <span class="text-zinc-200 font-medium">默认组间休息时间</span>
          <span class="font-bold text-amber-400 font-mono">{{ store.settings.defaultRestSeconds }} 秒</span>
        </div>
        <div class="grid grid-cols-4 gap-1.5">
          <button v-for="sec in [45, 60, 90, 120]" :key="sec"
                  @click="store.settings.defaultRestSeconds = sec"
                  class="py-2 rounded-xl border text-xs font-mono font-bold transition-all"
                  :class="[store.settings.defaultRestSeconds === sec ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-300']">
            {{ sec }}s
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
          <div class="text-xs font-medium text-zinc-200">触感震动反馈 (Haptic)</div>
          <div class="text-[10px] text-zinc-500">点击打勾与按键时提供微震动反馈</div>
        </div>
        <button @click="store.settings.vibrationEnabled = !store.settings.vibrationEnabled"
                class="w-12 h-6 rounded-full transition-colors relative p-0.5"
                :class="[store.settings.vibrationEnabled ? 'bg-amber-500' : 'bg-zinc-800']">
          <div class="w-5 h-5 rounded-full bg-white transition-transform transform"
               :class="[store.settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0']"></div>
        </button>
      </div>

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

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, exportBackupJSON, importBackupJSON, resetAllDataToDefault } from "../store/fitnessStore.js";

const fileInput = ref(null);

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
        alert("🎉 备份数据已成功恢复！");
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
    alert("已恢复默认设置！");
  }
}
</script>
