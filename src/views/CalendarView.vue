<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">

    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black text-white flex items-center gap-2">
          <span>📅</span> 训练日历与足迹
        </h2>
        <p class="text-xs text-zinc-400">
          直观查看哪天训练了什么、打卡记录与总容量
        </p>
      </div>
      <button @click="jumpToToday" 
              class="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-xs text-zinc-300 rounded-lg border border-zinc-700">
        回到今天
      </button>
    </div>

    <!-- Calendar Month Card -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      
      <!-- Month Navigation -->
      <div class="flex items-center justify-between px-1">
        <h3 class="text-base font-black text-white">
          {{ currentYear }}年 {{ currentMonth + 1 }}月
        </h3>
        <div class="flex items-center gap-1">
          <button @click="prevMonth" class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs">
            ◀
          </button>
          <button @click="nextMonth" class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs">
            ▶
          </button>
        </div>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-zinc-500 py-1 border-b border-zinc-800">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
      </div>

      <!-- Calendar Days Grid -->
      <div class="grid grid-cols-7 gap-1.5">
        <div v-for="(cell, idx) in calendarCells" :key="idx"
             @click="cell.dateStr && selectDate(cell.dateStr)"
             class="aspect-square rounded-2xl flex flex-col items-center justify-between p-1 transition-all cursor-pointer relative"
             :class="[
               !cell.dateStr ? 'opacity-0 pointer-events-none' : '',
               selectedDateStr === cell.dateStr ? 'ring-2 ring-amber-400 bg-zinc-800' : 'bg-zinc-950/60 hover:bg-zinc-800/50',
               cell.isToday ? 'border border-amber-500/60 font-bold' : 'border border-zinc-800/70'
             ]">
          
          <!-- Day number -->
          <span class="text-[11px] font-mono"
                :class="[cell.isToday ? 'text-amber-400 font-bold' : 'text-zinc-300']">
            {{ cell.day }}
          </span>

          <!-- Status badge or dot -->
          <div class="w-full flex items-center justify-center">
            <!-- If logged -->
            <span v-if="cell.hasLog" 
                  class="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black shadow-sm"
                  :class="[
                    cell.logColor === 'amber' ? 'bg-amber-500 text-zinc-950' :
                    cell.logColor === 'sky' ? 'bg-sky-500 text-zinc-950' :
                    cell.logColor === 'purple' ? 'bg-purple-500 text-white' :
                    'bg-emerald-500 text-zinc-950'
                  ]">
              {{ cell.logShortName || '✓' }}
            </span>
            <!-- If predicted by cycle -->
            <span v-else 
                  class="w-1.5 h-1.5 rounded-full"
                  :class="[
                    cell.cycleColor === 'amber' ? 'bg-amber-500/50' :
                    cell.cycleColor === 'sky' ? 'bg-sky-500/50' :
                    cell.cycleColor === 'purple' ? 'bg-purple-500/50' :
                    'bg-emerald-500/30'
                  ]">
            </span>
          </div>

          <!-- Bottom micro dot if volume exists -->
          <div class="h-1">
            <span v-if="cell.hasLog && cell.volume > 0" class="block w-1 h-1 rounded-full bg-emerald-400"></span>
            <span v-else-if="cell.isDeloadDay && !cell.hasLog" class="block w-1 h-1 rounded-full bg-sky-400 animate-pulse"></span>
          </div>

        </div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400">
        <div class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded bg-amber-500"></span> 推日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded bg-sky-500"></span> 拉日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded bg-purple-500"></span> 腿日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded bg-emerald-500"></span> 休息日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2.5 h-2.5 rounded bg-sky-600 border border-sky-400 flex items-center justify-center text-[7px]">🛡️</span> 免战休整
        </div>
      </div>

    </div>

    <!-- Selected Date Details Card -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      
      <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div class="flex items-center gap-2">
          <span class="text-sm font-black text-white font-mono">{{ selectedDateStr }}</span>
          <span class="text-xs text-amber-400">
            {{ isSelectedToday ? '(今天)' : '' }} · {{ selectedCycleDay.name }}
          </span>
        </div>

        <button v-if="!selectedDateLogs.length && !selectedCycleDay.isRest" 
                @click="startWorkoutForDate(selectedDateStr)"
                class="px-2.5 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-zinc-950 font-bold text-xs rounded-lg border border-amber-500/30">
          ➕ 补打卡
        </button>
      </div>

      <!-- If Log Exists for this day -->
      <div v-if="selectedDateLogs.length" class="space-y-3">
        <div v-for="log in selectedDateLogs" :key="log.id"
             class="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-2.5">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black"
                    :class="[
                      log.color === 'amber' ? 'bg-amber-500 text-zinc-950' :
                      log.color === 'sky' ? 'bg-sky-500 text-zinc-950' :
                      log.color === 'purple' ? 'bg-purple-500 text-white' :
                      'bg-emerald-500 text-zinc-950'
                    ]">
                {{ log.shortName || '练' }}
              </span>
              <div>
                <h4 class="font-bold text-xs text-zinc-100">{{ log.planName }}</h4>
                <div class="text-[10px] text-zinc-400 font-mono">
                  时长: {{ Math.round((log.durationSeconds || 60) / 60) }}分钟 · 总容量: {{ log.totalVolume }}kg
                </div>
              </div>
            </div>

            <button @click="removeLog(log.id)" 
                    class="p-1.5 bg-zinc-900 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded-lg text-xs" title="删除记录">
              🗑️
            </button>
          </div>

          <!-- Exercises list in this log -->
          <div v-if="log.exercises && log.exercises.length" class="space-y-1.5 pt-1">
            <div v-for="(ex, exIdx) in log.exercises" :key="exIdx"
                 class="p-2 bg-zinc-900/60 rounded-xl">
              <div class="text-xs font-bold text-zinc-200 mb-1">{{ ex.name }}</div>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(s, sIdx) in (ex.sets || []).filter(x => x.completed)" :key="sIdx"
                      class="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] font-mono text-emerald-400">
                  {{ s.weight }}kg × {{ s.reps }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="text-xs text-emerald-400 font-medium">
            ✅ 当天标记为完全休息日
          </div>

        </div>
      </div>

      <!-- If Deload Shield Active on this day without log -->
      <div v-else-if="isSelectedDeloadDay" class="p-3.5 bg-sky-950/40 border border-sky-500/40 rounded-2xl space-y-1.5 text-left">
        <div class="flex items-center gap-2 text-xs font-bold text-sky-300">
          <span class="text-base">🛡️</span>
          <span>战术减载免战日 (战力冻结保护)</span>
        </div>
        <p class="text-xs text-zinc-300 leading-relaxed">
          当天属于申报的战术免战休整期，战力分受 100% 绝对保护（0 衰减），中枢神经与关节深度修复中。
        </p>
      </div>

      <!-- If No log for this day -->
      <div v-else class="py-6 text-center text-xs text-zinc-500 space-y-2">
        <p>该日期暂无打卡记录</p>
        <p class="text-[11px] text-zinc-400">
          按照分化循环预测，当天排期为：<span class="text-amber-400 font-bold">{{ selectedCycleDay.name }}</span>
        </p>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, getCycleDayForDate, startWorkout, deleteWorkoutLog } from "../store/fitnessStore.js";

const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth());
const selectedDateStr = ref(formatDateStr(now));

function formatDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const isSelectedToday = computed(() => {
  return selectedDateStr.value === formatDateStr(new Date());
});

const isSelectedDeloadDay = computed(() => {
  const deloadUntil = store.honorProfile?.deloadShieldUntil || 0;
  if (deloadUntil <= Date.now()) return false;
  const selTime = new Date(selectedDateStr.value + "T12:00:00").getTime();
  const startTime = deloadUntil - 7 * 86400000;
  return selTime >= startTime && selTime <= deloadUntil;
});

const selectedCycleDay = computed(() => {
  return getCycleDayForDate(selectedDateStr.value);
});

const selectedDateLogs = computed(() => {
  return store.workoutLogs.filter(l => l.date === selectedDateStr.value);
});

const calendarCells = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = formatDateStr(new Date());
  const deloadUntil = store.honorProfile?.deloadShieldUntil || 0;
  const isShieldActiveNow = deloadUntil > Date.now();
  const shieldStartTime = deloadUntil - 7 * 86400000;

  const cells = [];

  // Padding blanks for first week
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ day: "", dateStr: "" });
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const log = store.workoutLogs.find(l => l.date === dStr);
    const cycleDay = getCycleDayForDate(dStr);
    const dayTimestamp = new Date(dStr + "T12:00:00").getTime();
    const isDeloadDay = isShieldActiveNow && dayTimestamp >= shieldStartTime && dayTimestamp <= deloadUntil;

    cells.push({
      day,
      dateStr: dStr,
      isToday: dStr === todayStr,
      hasLog: !!log,
      isDeloadDay,
      logShortName: log ? (log.shortName || "练") : (isDeloadDay ? "🛡️" : ""),
      logColor: log ? (log.color || "amber") : (isDeloadDay ? "sky" : ""),
      volume: log ? (log.totalVolume || 0) : 0,
      cycleColor: cycleDay.color
    });
  }

  return cells;
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
}

function jumpToToday() {
  const t = new Date();
  currentYear.value = t.getFullYear();
  currentMonth.value = t.getMonth();
  selectedDateStr.value = formatDateStr(t);
}

function selectDate(dateStr) {
  selectedDateStr.value = dateStr;
}

function startWorkoutForDate(dateStr) {
  const cd = getCycleDayForDate(dateStr);
  startWorkout(cd.planId, dateStr);
  store.activeTab = "today";
}

function removeLog(logId) {
  if (confirm("确定要删除这条打卡记录吗？")) {
    deleteWorkoutLog(logId);
  }
}
</script>
