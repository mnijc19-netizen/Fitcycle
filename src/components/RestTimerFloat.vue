<template>
  <div v-if="store.restTimer.running && store.restTimer.remaining > 0" 
       class="fixed z-40 pointer-events-auto select-none"
       :class="[
         isExpanded 
           ? 'left-4 right-4 max-w-md mx-auto' 
           : 'right-3'
       ]"
       :style="{ 
         bottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 64px), 74px)',
         transform: 'translateZ(0)',
         webkitTransform: 'translateZ(0)'
       }">

    <!-- 1. CS2 C4 MINIMAL CAPSULE (常态：微型小尺寸 C4 + 外围光环脉冲闪烁 + 倒计时，点击展开操作菜单) -->
    <div v-if="!isExpanded && store.settings.uiSkin === 'cs'" 
         @click="isExpanded = true"
         class="bg-[#080C14]/98 border border-[#F97316]/60 backdrop-blur-xl rounded-2xl pl-2 pr-3 py-1.5 shadow-2xl shadow-black flex items-center gap-2 text-white animate-in slide-in-from-right-4 duration-200 cursor-pointer active:scale-95 group transition-transform">
      <!-- C4 Icon with surrounding red pulsing aura glow -->
      <div class="relative w-6 h-6 rounded-lg bg-[#141A12] border border-red-500/60 flex items-center justify-center flex-shrink-0">
        <!-- Surrounding Red Pulsing Aura Ring -->
        <div class="absolute -inset-1 rounded-xl bg-red-500/30 blur-[2px] animate-pulse pointer-events-none"></div>
        <img :src="csC4TimerImg" alt="C4" class="w-full h-full object-contain p-0.5 relative z-10 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
      </div>

      <!-- Digital Red Countdown Display -->
      <div class="flex flex-col">
        <span class="font-mono font-black text-xs text-red-500 tracking-tight leading-none drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]">
          {{ formatTime(store.restTimer.remaining) }}
        </span>
      </div>
    </div>

    <!-- Default / Chamber Compact Variant -->
    <div v-else-if="!isExpanded" 
         class="bg-zinc-900/95 border border-emerald-500/40 backdrop-blur-xl rounded-full pl-2 pr-1.5 py-1.5 shadow-2xl shadow-black/80 flex items-center gap-2 text-white animate-in slide-in-from-right-4 duration-200">
      
      <!-- Mini Timer Progress Ring & Tap to Expand -->
      <div @click="isExpanded = true" class="flex items-center gap-2 cursor-pointer active:scale-95">
        <div class="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg class="w-8 h-8 transform -rotate-90">
            <circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2.5" class="text-zinc-800" fill="transparent" />
            <circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2.5" 
                    :stroke-dasharray="81.68" 
                    :stroke-dashoffset="miniDashOffset" 
                    stroke-linecap="round"
                    class="text-emerald-400 transition-all duration-300" fill="transparent" />
          </svg>
          <span class="absolute font-mono font-black text-[10px] text-emerald-400">
            {{ formatTime(store.restTimer.remaining) }}
          </span>
        </div>

        <div class="text-[11px] font-bold text-zinc-200 pr-0.5">
          休息中
        </div>
      </div>

      <!-- Quick +30s button -->
      <button @click.stop="adjustRestTimer(30)" 
              class="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 active:scale-90 rounded-full text-[10px] font-mono font-bold border border-emerald-500/30 transition-all">
        +30s
      </button>

      <!-- Instant Close Button (X) -->
      <button @click.stop="handleClose" 
              class="w-7 h-7 rounded-full bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 active:scale-90 text-zinc-400 flex items-center justify-center text-xs font-bold transition-all ml-0.5">
        ✕
      </button>

    </div>

    <!-- 2. CS2 C4 EXPANDED ACTION BAR (点击后展开：微型 C4 + 时间 + -15s + +30s + 关闭) -->
    <div v-else-if="isExpanded && store.settings.uiSkin === 'cs'" 
         class="bg-[#080C14]/98 border border-[#F97316]/60 backdrop-blur-2xl rounded-2xl px-2.5 py-1.5 shadow-2xl shadow-black flex items-center gap-2 text-white animate-in zoom-in-95 duration-200">
      
      <!-- Left: Mini C4 & Time (tap to collapse) -->
      <div class="flex items-center gap-1.5 cursor-pointer" @click="isExpanded = false">
        <div class="relative w-6 h-6 rounded-lg bg-[#141A12] border border-red-500/60 flex items-center justify-center flex-shrink-0">
          <div class="absolute -inset-1 rounded-xl bg-red-500/25 blur-[2px] animate-pulse pointer-events-none"></div>
          <img :src="csC4TimerImg" alt="C4" class="w-full h-full object-contain p-0.5 relative z-10 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
        </div>
        <span class="font-mono font-black text-xs text-red-500 tracking-tight drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] pr-1">
          {{ formatTime(store.restTimer.remaining) }}
        </span>
      </div>

      <!-- Action Buttons: -15s, +30s, 关闭 -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <button @click.stop="adjustRestTimer(-15)" 
                class="px-2 py-1 bg-[#0F172A] hover:bg-[#1E293B] active:scale-90 text-zinc-300 rounded-lg text-xs font-mono font-bold border border-zinc-700 transition-all">
          -15s
        </button>
        <button @click.stop="adjustRestTimer(30)" 
                class="px-2 py-1 bg-[#F97316]/20 hover:bg-[#F97316]/30 active:scale-90 text-[#F97316] rounded-lg text-xs font-mono font-bold border border-[#F97316]/40 transition-all">
          +30s
        </button>
        <button @click.stop="handleClose" 
                title="关闭休息计时 (DEFUSE)"
                class="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 active:scale-90 flex items-center justify-center text-xs font-bold border border-red-500/30 transition-all">
          ✕
        </button>
      </div>

    </div>

    <!-- Default / Chamber Full Expanded Modal -->
    <div v-else 
         class="bg-zinc-900/95 border border-zinc-700/90 backdrop-blur-2xl rounded-3xl p-3.5 shadow-2xl shadow-black flex items-center justify-between gap-3 text-white animate-in zoom-in-95 duration-200">
      
      <!-- Left: Circular Countdown indicator -->
      <div class="flex items-center gap-3 min-w-0" @click="isExpanded = false">
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

        <div class="truncate">
          <div class="text-[11px] text-zinc-400 font-medium">组间休息倒计时</div>
          <div class="text-xs font-semibold text-zinc-100 flex items-center gap-1.5 truncate">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" v-if="store.restTimer.running"></span>
            <span class="truncate">{{ store.restTimer.remaining === 0 ? "休息完毕，冲！" : "呼吸调整，准备下一组" }}</span>
          </div>
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex items-center gap-1 flex-shrink-0">
        <button @click.stop="adjustRestTimer(-15)" 
                class="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 rounded-xl text-xs font-bold">
          -15s
        </button>
        <button @click.stop="adjustRestTimer(30)" 
                class="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 active:scale-95 rounded-xl text-xs font-bold border border-emerald-500/30">
          +30s
        </button>

        <!-- Minimize Arrow -->
        <button @click.stop="isExpanded = false" 
                title="收起为侧边胶囊"
                class="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 active:scale-95 rounded-xl text-xs ml-0.5">
          ↙️
        </button>

        <!-- Stop Timer (X) -->
        <button @click.stop="handleClose" 
                title="关闭休息计时"
                class="p-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 active:scale-95 rounded-xl text-xs font-bold">
          ✕
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, startRestTimer, stopRestTimer, adjustRestTimer } from "../store/fitnessStore.js";

const csC4TimerImg = "./themes/cs/hud/bomb_planted.svg";

const isExpanded = ref(false);

const dashOffset = computed(() => {
  const dur = store.restTimer.duration || 1;
  const rem = store.restTimer.remaining;
  const progress = Math.max(0, Math.min(1, rem / dur));
  return 125.6 * (1 - progress);
});

const miniDashOffset = computed(() => {
  const dur = store.restTimer.duration || 1;
  const rem = store.restTimer.remaining;
  const progress = Math.max(0, Math.min(1, rem / dur));
  return 81.68 * (1 - progress);
});

function handleClose() {
  stopRestTimer();
  isExpanded.value = false;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m > 0) {
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return `${s}s`;
}
</script>
