<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="handleBackdropClick"></div>

      <!-- Modal Card -->
      <div class="relative z-10 w-full max-w-sm rounded-3xl border shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92dvh] overflow-y-auto overscroll-contain"
           :class="store.settings.themeMode === 'light' 
             ? 'bg-white border-amber-300 text-slate-900 shadow-amber-900/15' 
             : 'bg-zinc-950 border-amber-500/40 text-zinc-100 shadow-black/80'">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-inner"
                  :class="store.settings.themeMode === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'">
              🔥
            </span>
            <div>
              <h3 class="text-base font-black tracking-tight"
                  :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
                练后 Zone 2 科学燃脂
              </h3>
              <p class="text-xs font-medium"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                糖原已耗尽 · 直击脂肪氧化
              </p>
            </div>
          </div>

          <button @click="$emit('close')"
                  class="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors active:scale-95 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mode Selector Carousel / Grid -->
        <div class="space-y-1.5">
          <div class="text-xs font-bold flex items-center justify-between"
               :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-300'">
            <span>选择低冲击有氧方式:</span>
            <span class="text-amber-500 font-semibold">{{ currentMode.tag }}</span>
          </div>

          <div class="grid grid-cols-3 gap-1.5">
            <button v-for="mode in CARDIO_MODE_LIST" :key="mode.id"
                    @click="selectMode(mode.id)"
                    class="p-2 rounded-xl border text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
                    :class="selectedModeKey === mode.id
                      ? (store.settings.themeMode === 'light' 
                          ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-bold shadow-sm' 
                          : 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold')
                      : (store.settings.themeMode === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850')">
              <span class="text-lg">{{ mode.icon }}</span>
              <span class="text-xs leading-tight line-clamp-1">{{ mode.shortName }}</span>
            </button>
          </div>
          
          <div class="p-2 rounded-xl text-xs leading-relaxed"
               :class="store.settings.themeMode === 'light' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-zinc-900/90 text-zinc-300 border border-zinc-800'">
            💡 <span class="font-bold">{{ currentMode.name }}</span>：{{ currentMode.desc }}
          </div>
        </div>

        <!-- Zone 2 Scientific Target Island -->
        <div class="p-3 rounded-2xl border space-y-1.5"
             :class="store.settings.themeMode === 'light'
               ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
               : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              你的专属 Zone 2 燃脂心率区间
            </span>
            <span class="text-xs font-mono font-black px-2 py-0.5 rounded-full"
                  :class="store.settings.themeMode === 'light' ? 'bg-emerald-200/60 text-emerald-900' : 'bg-emerald-500/20 text-emerald-300'">
              {{ zone2Info.formattedRange }}
            </span>
          </div>
          <p class="text-xs leading-normal opacity-90">
            {{ zone2Info.bodySensoryCue }}
          </p>
        </div>

        <!-- Duration Picker (Only when not running) -->
        <div v-if="!isRunning && elapsedSeconds === 0" class="space-y-1.5">
          <div class="text-xs font-bold"
               :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-300'">
            目标时长:
          </div>
          <div class="grid grid-cols-4 gap-1.5">
            <button v-for="d in [15, 20, 30, 0]" :key="d"
                    @click="targetMinutes = d"
                    class="py-2 px-1 rounded-xl border text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer text-center"
                    :class="targetMinutes === d
                      ? (store.settings.themeMode === 'light' ? 'bg-amber-500 text-zinc-950 border-amber-600 shadow-sm' : 'bg-amber-400 text-zinc-950 border-amber-400 shadow-md')
                      : (store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-900 border-zinc-800 text-zinc-400')">
              {{ d === 0 ? '自由' : `${d}分` }}
            </button>
          </div>
        </div>

        <!-- Big Live Timer Display -->
        <div class="p-4 rounded-2xl border text-center space-y-2 relative overflow-hidden"
             :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'">
          
          <div class="text-xs font-bold uppercase tracking-wider text-amber-500">
            {{ isRunning ? '正在进行低强度燃脂' : (elapsedSeconds > 0 ? '已暂停' : '已就绪') }}
          </div>

          <div class="text-4xl font-black font-mono tracking-tight"
               :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
            {{ timerDisplay }}
          </div>

          <!-- Live Dynamic Metric Tickers -->
          <div class="grid grid-cols-2 gap-2 pt-1 border-t border-current/10">
            <div class="p-2 rounded-xl bg-current/5">
              <span class="text-xs text-zinc-400 block font-medium">预计消耗</span>
              <span class="text-sm font-black font-mono text-amber-400">
                {{ liveCalories }} <span class="text-xs font-normal">kcal</span>
              </span>
            </div>
            <div class="p-2 rounded-xl bg-current/5">
              <span class="text-xs text-zinc-400 block font-medium">METs 等效做工</span>
              <span class="text-sm font-black font-mono text-emerald-400">
                {{ liveTonnage }} <span class="text-xs font-normal">kg</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Action Control Buttons -->
        <div class="space-y-2 pt-1">
          <!-- Start / Pause / Resume Controls -->
          <div class="flex items-center gap-2">
            <button v-if="!isRunning" 
                    @click="startTimer"
                    class="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{{ elapsedSeconds === 0 ? '开始有氧计时' : '继续计时' }}</span>
            </button>

            <button v-else 
                    @click="pauseTimer"
                    class="flex-1 py-3 bg-zinc-800 hover:bg-zinc-750 text-amber-400 border border-amber-500/40 font-black rounded-xl text-sm active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              <span>暂停</span>
            </button>

            <!-- Complete & Save Button -->
            <button v-if="elapsedSeconds >= 60 || targetMinutes > 0" 
                    @click="finishCardio"
                    class="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-1 cursor-pointer">
              <span>完成</span>
            </button>
          </div>

          <!-- Secondary/Cancel Button -->
          <button @click="$emit('close')" 
                  class="w-full py-2.5 rounded-xl border text-xs font-semibold active:scale-98 transition-colors cursor-pointer text-center"
                  :class="store.settings.themeMode === 'light' 
                    ? 'border-slate-200 text-slate-600 hover:bg-slate-100' 
                    : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'">
            暂不进行，返回力量总结
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import { store } from "../store/fitnessStore.js";
import { 
  CARDIO_MODES, 
  CARDIO_MODE_LIST, 
  calculateZone2HeartRate, 
  calculateCardioCalories, 
  calculateCardioTonnage, 
  createCardioSession 
} from "../engine/cardioEngine.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { triggerHaptic } from "../utils/vibrate.js";

const props = defineProps({
  visible: { type: Boolean, default: false }
});

const emit = defineEmits(["close", "completed"]);

// Timer state
const isRunning = ref(false);
const elapsedSeconds = ref(0);
let timerInterval = null;

function stopTimerInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetState() {
  stopTimerInterval();
  isRunning.value = false;
  elapsedSeconds.value = 0;
  selectedModeKey.value = "incline_walk";
  targetMinutes.value = 20;
}

watch(() => props.visible, (isOpen) => {
  if (isOpen) {
    lockBodyScroll();
    resetState();
  } else {
    unlockBodyScroll();
    stopTimerInterval();
  }
}, { immediate: true });

onUnmounted(() => {
  unlockBodyScroll();
  stopTimerInterval();
});

// Mode and Target
const selectedModeKey = ref("incline_walk");
const currentMode = computed(() => CARDIO_MODES[selectedModeKey.value] || CARDIO_MODES.incline_walk);
const targetMinutes = ref(20);

// Zone 2 info calculated from user age
const zone2Info = computed(() => {
  const age = store.settings?.userAge || 25;
  return calculateZone2HeartRate(age);
});

function selectMode(key) {
  if (isRunning.value) return;
  selectedModeKey.value = key;
  if (CARDIO_MODES[key]?.defaultMinutes) {
    targetMinutes.value = CARDIO_MODES[key].defaultMinutes;
  }
}

function startTimer() {
  isRunning.value = true;
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
  
  stopTimerInterval();
  timerInterval = setInterval(() => {
    elapsedSeconds.value += 1;
    
    // Auto-complete if target reached in countdown mode
    if (targetMinutes.value > 0 && elapsedSeconds.value >= targetMinutes.value * 60) {
      finishCardio();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning.value = false;
  stopTimerInterval();
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

const timerDisplay = computed(() => {
  if (targetMinutes.value > 0) {
    // Countdown display
    const totalSec = targetMinutes.value * 60;
    const remaining = Math.max(0, totalSec - elapsedSeconds.value);
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  } else {
    // Countup display
    const m = Math.floor(elapsedSeconds.value / 60);
    const s = elapsedSeconds.value % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
});

const activeMinutesForCalc = computed(() => {
  if (elapsedSeconds.value > 0) {
    return Math.max(1, Math.round(elapsedSeconds.value / 60));
  }
  return targetMinutes.value > 0 ? targetMinutes.value : 20;
});

const liveCalories = computed(() => {
  const weight = store.settings?.userWeight || 70;
  return calculateCardioCalories(selectedModeKey.value, activeMinutesForCalc.value, weight);
});

const liveTonnage = computed(() => {
  const weight = store.settings?.userWeight || 70;
  return calculateCardioTonnage(selectedModeKey.value, activeMinutesForCalc.value, weight, liveCalories.value);
});

function handleBackdropClick() {
  if (isRunning.value) return; // Prevent accidental close while running
  emit("close");
}

function finishCardio() {
  stopTimerInterval();
  isRunning.value = false;
  
  const weight = store.settings?.userWeight || 70;
  const age = store.settings?.userAge || 25;
  const duration = activeMinutesForCalc.value;

  const session = createCardioSession({
    modeKey: selectedModeKey.value,
    durationMinutes: duration,
    weightKg: weight,
    age
  });

  if (store.settings.vibrationEnabled) triggerHaptic("success");
  emit("completed", session);
}
</script>
