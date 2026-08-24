<template>
  <div v-if="store.restTimer.running || store.restTimer.remaining > 0" 
       class="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto transition-all duration-300 transform"
       :class="[store.restTimer.minimized ? 'translate-y-2' : 'translate-y-0']">
    
    <!-- Expanded view -->
    <div v-if="!store.restTimer.minimized" 
         class="bg-zinc-900/95 border border-zinc-700/80 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 text-white">
      
      <!-- Left: Circular Countdown indicator -->
      <div class="flex items-center gap-3">
        <div class="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          <svg class="w-12 h-12 transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="3.5" class="text-zinc-800" fill="transparent" />
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="3.5" 
                    :stroke-dasharray="125.6" 
                    :stroke-dashoffset="dashOffset" 
                    stroke-linecap="round"
                    class="text-emerald-400 transition-all duration-300" fill="transparent" />
          </svg>
          <span class="absolute font-mono font-bold text-sm text-emerald-400">
            {{ formatTime(store.restTimer.remaining) }}
          </span>
        </div>

        <div>
          <div class="text-xs text-zinc-400 font-medium">组间休息倒计时</div>
          <div class="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping" v-if="store.restTimer.running"></span>
            {{ store.restTimer.remaining === 0 ? "休息完毕，冲！" : "呼吸调整，准备下一组" }}
          </div>
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex items-center gap-1.5">
        <button @click="adjustRestTimer(-15)" 
                class="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 rounded-lg text-xs font-semibold">
          -15s
        </button>
        <button @click="adjustRestTimer(30)" 
                class="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 active:scale-95 rounded-lg text-xs font-semibold border border-emerald-500/30">
          +30s
        </button>
        <button @click="stopRestTimer" 
                class="p-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 active:scale-95 rounded-lg text-xs font-semibold ml-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Minimized pill -->
    <div v-else 
         @click="store.restTimer.minimized = false"
         class="bg-emerald-500 text-zinc-950 font-bold px-4 py-2 rounded-full shadow-lg flex items-center justify-between cursor-pointer active:scale-95 mx-auto w-48">
      <div class="flex items-center gap-2 text-xs">
        <span class="w-2 h-2 rounded-full bg-zinc-950 animate-pulse"></span>
        休息中: {{ formatTime(store.restTimer.remaining) }}
      </div>
      <span class="text-xs">展开 ❯</span>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { store, stopRestTimer, adjustRestTimer } from "../store/fitnessStore.js";

const dashOffset = computed(() => {
  const dur = store.restTimer.duration || 1;
  const rem = store.restTimer.remaining;
  const progress = Math.max(0, Math.min(1, rem / dur));
  return 125.6 * (1 - progress);
});

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m > 0) {
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return `${s}s`;
}
</script>
