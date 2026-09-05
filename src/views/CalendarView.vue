<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">

    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-black flex items-center gap-2" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
          <span>训练日历</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                :class="store.settings.themeMode === 'light' ? 'bg-amber-500/25 text-amber-800 border border-amber-600/40 font-black' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'">
            {{ store.workoutLogs.length }} 次打卡
          </span>
        </h2>
        <p class="text-xs mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
          周期训练日程、历史足迹与累计做工容量
        </p>
      </div>
      <button @click="jumpToToday" 
              class="px-3 py-1.5 active:scale-95 text-xs rounded-xl border transition-all cursor-pointer"
              :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border-slate-300 shadow-xs' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'">
        回到今天
      </button>
    </div>

    <!-- Calendar Month Card (Apple Activity Calendar Style) -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      
      <!-- Month Navigation -->
      <div class="flex items-center justify-between px-1">
        <h3 class="text-base font-black tracking-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
          {{ currentYear }}年 {{ currentMonth + 1 }}月
        </h3>
        <div class="flex items-center gap-1.5">
          <button @click="prevMonth" 
                  class="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-colors cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-bold shadow-xs' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border-zinc-800/80'"
                  title="上一月">
            ‹
          </button>
          <button @click="nextMonth" 
                  class="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-colors cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-bold shadow-xs' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border-zinc-800/80'"
                  title="下一月">
            ›
          </button>
        </div>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold py-1 border-b"
           :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-black border-slate-200' : 'text-zinc-500 border-zinc-800/80'">
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
             class="aspect-square rounded-2xl flex flex-col items-center justify-between p-1 transition-all cursor-pointer relative select-none"
             :class="[
               !cell.dateStr ? 'opacity-0 pointer-events-none' : '',
               selectedDateStr === cell.dateStr 
                 ? (store.settings.themeMode === 'light' ? 'ring-2 ring-amber-500 bg-amber-50 shadow-md border-amber-500/60' : 'ring-2 ring-amber-400 bg-zinc-800 shadow-md') 
                 : (store.settings.themeMode === 'light' ? 'bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/90 shadow-xs' : 'bg-zinc-950/60 hover:bg-zinc-800/50 border border-zinc-800/60'),
               cell.isToday ? (store.settings.themeMode === 'light' ? 'border-amber-600 font-black' : 'border border-amber-500/60 font-bold') : ''
             ]">
          
          <!-- Day number -->
          <span class="text-[11px] font-mono leading-none"
                :class="[
                  cell.isToday 
                    ? (store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400 font-bold') 
                    : (store.settings.themeMode === 'light' ? 'text-slate-800 font-bold' : 'text-zinc-400')
                ]">
            {{ cell.day }}
          </span>

          <!-- Status badge or dot -->
          <div class="w-full flex items-center justify-center my-auto">
            <!-- If logged -->
            <span v-if="cell.hasLog" 
                  class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm"
                  :class="[
                    cell.logColor === 'amber' ? 'bg-amber-500 text-zinc-950 shadow-amber-500/20' :
                    cell.logColor === 'sky' ? 'bg-sky-500 text-zinc-950 shadow-sky-500/20' :
                    cell.logColor === 'purple' ? 'bg-purple-500 text-white shadow-purple-500/20' :
                    'bg-emerald-500 text-zinc-950 shadow-emerald-500/20'
                  ]">
              {{ cell.logShortName || '✓' }}
            </span>
            <!-- If predicted by cycle -->
            <span v-else 
                  class="w-1.5 h-1.5 rounded-full"
                  :class="[
                    cell.cycleColor === 'amber' ? 'bg-amber-500/40' :
                    cell.cycleColor === 'sky' ? 'bg-sky-500/40' :
                    cell.cycleColor === 'purple' ? 'bg-purple-500/40' :
                    'bg-emerald-500/30'
                  ]">
            </span>
          </div>

          <!-- Bottom micro dot if volume exists -->
          <div class="h-1 flex items-center justify-center">
            <span v-if="cell.hasLog && cell.volume > 0" class="block w-1 h-1 rounded-full bg-emerald-400"></span>
            <span v-else-if="cell.isDeloadDay && !cell.hasLog" class="block w-1 h-1 rounded-full bg-sky-400 animate-pulse"></span>
          </div>

        </div>
      </div>

      <!-- Minimalist Legend -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400">
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span> 推日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-sky-500"></span> 拉日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-purple-500"></span> 腿日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 休息日
        </div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-sky-400"></span> 免战休整
        </div>
      </div>

    </div>

    <!-- Selected Date Details Card (Apple Health Inset Style) -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      
      <div class="flex items-center justify-between pb-2 border-b" :class="store.settings.themeMode === 'light' ? 'border-slate-200' : 'border-zinc-800'">
        <div class="flex items-center gap-2">
          <span class="text-sm font-black font-mono" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">{{ selectedDateStr }}</span>
          <span class="text-xs font-medium" :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-bold' : 'text-amber-400'">
            {{ isSelectedToday ? '(今天)' : '' }} · {{ selectedCycleDay.name }}
          </span>
        </div>

        <button v-if="!selectedDateLogs.length && !selectedCycleDay.isRest" 
                @click="startWorkoutForDate(selectedDateStr)"
                class="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
          <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span>立即开练</span>
        </button>
      </div>

      <!-- If Log Exists for this day -->
      <div v-if="selectedDateLogs.length" class="space-y-3">
        <div v-for="log in selectedDateLogs" :key="log.id"
             class="p-3.5 border rounded-2xl space-y-2.5"
             :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 shadow-xs' : 'bg-zinc-950/80 border-zinc-800'">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
                    :class="[
                      log.color === 'amber' ? 'bg-amber-500 text-zinc-950' :
                      log.color === 'sky' ? 'bg-sky-500 text-zinc-950' :
                      log.color === 'purple' ? 'bg-purple-500 text-white' :
                      'bg-emerald-500 text-zinc-950'
                    ]">
                {{ log.shortName || '练' }}
              </span>
              <div>
                <h4 class="font-bold text-xs" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">{{ log.planName }}</h4>
                <div class="text-[10px] font-mono mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-400'">
                  时长: {{ Math.round((log.durationSeconds || 60) / 60) }}分钟 · 容量: {{ log.totalVolume }}kg · {{ log.totalSets }}组
                </div>
              </div>
            </div>

            <button @click="removeLog(log.id)" 
                    class="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer" title="删除记录">
              🗑️
            </button>
          </div>

          <!-- Exercises list in this log -->
          <div v-if="log.exercises && log.exercises.length" class="space-y-1.5 pt-1">
            <div v-for="(ex, exIdx) in log.exercises" :key="exIdx"
                 class="p-2.5 rounded-xl border"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-100/90 border-slate-200 text-slate-900' : 'bg-zinc-900/60 border-zinc-800/60'">
              <div class="text-xs font-bold mb-1" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-200'">{{ ex.name }}</div>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(s, sIdx) in (ex.sets || []).filter(x => x.completed)" :key="sIdx"
                      class="px-2 py-0.5 rounded-lg text-[10px] font-mono"
                      :class="store.settings.themeMode === 'light' ? 'bg-white border border-slate-300 text-emerald-800 font-bold shadow-xs' : 'bg-zinc-950 border border-zinc-800 text-emerald-400'">
                  {{ s.weight }}kg × {{ s.reps }}次
                </span>
              </div>
            </div>
          </div>

          <div v-else class="text-xs text-emerald-400 font-medium py-1">
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
      <div v-else class="py-6 text-center text-xs text-zinc-500 space-y-1.5">
        <p class="text-zinc-400">该日期暂无训练记录</p>
        <p class="text-[11px] text-zinc-500">
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
