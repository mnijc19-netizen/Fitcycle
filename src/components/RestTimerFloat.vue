<template>
  <div v-if="store.restTimer.running && store.restTimer.remaining > 0" 
       ref="timerWidgetRef"
       class="fixed z-40 pointer-events-auto select-none touch-none"
       :style="containerStyle"
       @touchstart.passive="onTouchStart"
       @touchmove="onTouchMove"
       @touchend="onTouchEnd"
       @mousedown="onMouseDown">

    <!-- ============================================== -->
    <!-- 1. CS2 C4 THEME VARIANT -->
    <!-- ============================================== -->
    
    <!-- CS2 Compact State -->
    <div v-if="!isExpanded && store.settings.uiSkin === 'cs'" 
         @click="toggleExpand"
         class="bg-[#080C14]/98 border border-[#F97316]/60 backdrop-blur-xl rounded-2xl pl-2 pr-3 py-1.5 shadow-2xl shadow-black flex items-center gap-2 text-white animate-in slide-in-from-right-4 duration-200 cursor-grab active:cursor-grabbing active:scale-95 group transition-transform">
      <!-- C4 Icon with surrounding red pulsing aura glow -->
      <div class="relative w-6 h-6 rounded-lg bg-[#141A12] border border-red-500/60 flex items-center justify-center flex-shrink-0">
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

    <!-- CS2 Expanded Action Bar (Directional zero-jump expansion) -->
    <div v-else-if="isExpanded && store.settings.uiSkin === 'cs'" 
         class="bg-[#080C14]/98 border border-[#F97316]/60 backdrop-blur-2xl rounded-2xl px-2.5 py-1.5 shadow-2xl shadow-black flex items-center gap-2 text-white animate-in zoom-in-95 duration-200">
      
      <!-- Action Buttons (Ordered dynamically: left when on right side, right when on left side) -->
      <div class="flex items-center gap-1 flex-shrink-0" :class="{ 'order-1': isRightHalf, 'order-2': !isRightHalf }">
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

      <!-- Mini C4 & Time (Statically aligned to edge) -->
      <div class="flex items-center gap-1.5 cursor-pointer" :class="{ 'order-2': isRightHalf, 'order-1': !isRightHalf }" @click="toggleExpand">
        <div class="relative w-6 h-6 rounded-lg bg-[#141A12] border border-red-500/60 flex items-center justify-center flex-shrink-0">
          <div class="absolute -inset-1 rounded-xl bg-red-500/25 blur-[2px] animate-pulse pointer-events-none"></div>
          <img :src="csC4TimerImg" alt="C4" class="w-full h-full object-contain p-0.5 relative z-10 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
        </div>
        <span class="font-mono font-black text-xs text-red-500 tracking-tight drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
          {{ formatTime(store.restTimer.remaining) }}
        </span>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- 2. CHAMBER (尚博勒) HAUTE-HORLOGERIE LUXURY GOLD WATCH THEME -->
    <!-- ============================================== -->
    
    <!-- Chamber Compact State -->
    <div v-else-if="!isExpanded && store.settings.uiSkin === 'chamber'" 
         @click="toggleExpand"
         class="bg-gradient-to-r from-[#070B14]/98 to-[#0D1627]/98 border border-[#E5C378]/70 backdrop-blur-2xl rounded-2xl pl-2 pr-3 py-1.5 shadow-[0_0_15px_rgba(229,195,120,0.25)] flex items-center gap-2 text-white animate-in slide-in-from-right-4 duration-200 cursor-grab active:cursor-grabbing active:scale-95 group transition-all">
      <!-- Bespoke Gold Wristwatch Icon -->
      <div class="relative w-7 h-7 rounded-xl bg-gradient-to-b from-[#0D1627] to-[#070B14] border border-[#E5C378]/60 flex items-center justify-center flex-shrink-0 shadow-md shadow-black/70">
        <div class="absolute -inset-1 rounded-xl bg-[#E5C378]/25 blur-[3px] animate-pulse pointer-events-none"></div>
        <img :src="chamberWatchImg" alt="Chamber Luxury Gold Watch" class="w-full h-full object-contain p-0.5 relative z-10 drop-shadow-[0_0_6px_rgba(246,224,158,0.8)]" />
      </div>

      <!-- Digital French Gold Countdown Display -->
      <div class="flex flex-col">
        <span class="font-mono font-black text-xs text-[#F6E09E] tracking-tight leading-none drop-shadow-[0_0_10px_rgba(246,224,158,0.85)]">
          {{ formatTime(store.restTimer.remaining) }}
        </span>
      </div>
    </div>

    <!-- Chamber Expanded Action Bar (Directional zero-jump expansion) -->
    <div v-else-if="isExpanded && store.settings.uiSkin === 'chamber'" 
         class="bg-gradient-to-r from-[#070B14]/98 to-[#0D1627]/98 border border-[#E5C378]/70 backdrop-blur-2xl rounded-2xl px-2.5 py-1.5 shadow-[0_0_20px_rgba(229,195,120,0.3)] flex items-center gap-2 text-white animate-in zoom-in-95 duration-200">
      
      <!-- Action Buttons (Ordered dynamically: left when on right side, right when on left side) -->
      <div class="flex items-center gap-1 flex-shrink-0" :class="{ 'order-1': isRightHalf, 'order-2': !isRightHalf }">
        <button @click.stop="adjustRestTimer(-15)" 
                class="px-2 py-1 bg-[#0D1627] hover:bg-[#142036] active:scale-90 text-[#9AA8C2] rounded-lg text-xs font-mono font-bold border border-[#1E3052] transition-all">
          -15s
        </button>
        <button @click.stop="adjustRestTimer(30)" 
                class="px-2 py-1 bg-[#E5C378]/20 hover:bg-[#E5C378]/30 active:scale-90 text-[#F6E09E] rounded-lg text-xs font-mono font-bold border border-[#E5C378]/50 transition-all">
          +30s
        </button>
        <button @click.stop="handleClose" 
                title="关闭休息计时"
                class="w-6 h-6 rounded-lg bg-[#E06D3B]/20 hover:bg-[#E06D3B]/30 text-[#E06D3B] active:scale-90 flex items-center justify-center text-xs font-bold border border-[#E06D3B]/40 transition-all">
          ✕
        </button>
      </div>

      <!-- Mini Chamber Watch & Time (Statically aligned to edge) -->
      <div class="flex items-center gap-1.5 cursor-pointer" :class="{ 'order-2': isRightHalf, 'order-1': !isRightHalf }" @click="toggleExpand">
        <div class="relative w-7 h-7 rounded-xl bg-gradient-to-b from-[#0D1627] to-[#070B14] border border-[#E5C378]/60 flex items-center justify-center flex-shrink-0 shadow-md shadow-black/70">
          <div class="absolute -inset-1 rounded-xl bg-[#E5C378]/25 blur-[3px] animate-pulse pointer-events-none"></div>
          <img :src="chamberWatchImg" alt="Chamber Luxury Gold Watch" class="w-full h-full object-contain p-0.5 relative z-10 drop-shadow-[0_0_6px_rgba(246,224,158,0.8)]" />
        </div>
        <span class="font-mono font-black text-xs text-[#F6E09E] tracking-tight drop-shadow-[0_0_10px_rgba(246,224,158,0.85)] pr-0.5">
          {{ formatTime(store.restTimer.remaining) }}
        </span>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- 3. DEFAULT CLASSIC THEME VARIANT -->
    <!-- ============================================== -->

    <!-- Default Compact Variant -->
    <div v-else-if="!isExpanded" 
         @click="toggleExpand"
         class="bg-zinc-900/95 border border-emerald-500/40 backdrop-blur-xl rounded-full pl-2 pr-3 py-1.5 shadow-2xl shadow-black/80 flex items-center gap-2 text-white animate-in slide-in-from-right-4 duration-200 cursor-grab active:cursor-grabbing active:scale-95 transition-transform">
      
      <div class="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 transform -rotate-90">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" class="text-zinc-800" fill="transparent" />
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" 
                  :stroke-dasharray="62.8" 
                  :stroke-dashoffset="miniDashOffset" 
                  stroke-linecap="round"
                  class="text-emerald-400 transition-all duration-300" fill="transparent" />
        </svg>
      </div>

      <span class="font-mono font-black text-xs text-emerald-400">
        {{ formatTime(store.restTimer.remaining) }}
      </span>
    </div>

    <!-- Default Expanded Action Bar (Directional zero-jump expansion) -->
    <div v-else 
         class="bg-zinc-900/98 border border-zinc-700/90 backdrop-blur-2xl rounded-2xl px-2.5 py-1.5 shadow-2xl shadow-black flex items-center gap-2 text-white animate-in zoom-in-95 duration-200">
      
      <!-- Action Buttons (Ordered dynamically: left when on right side, right when on left side) -->
      <div class="flex items-center gap-1 flex-shrink-0" :class="{ 'order-1': isRightHalf, 'order-2': !isRightHalf }">
        <button @click.stop="adjustRestTimer(-15)" 
                class="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-zinc-300 rounded-lg text-xs font-mono font-bold border border-zinc-700 transition-all">
          -15s
        </button>
        <button @click.stop="adjustRestTimer(30)" 
                class="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 active:scale-90 text-emerald-300 rounded-lg text-xs font-mono font-bold border border-emerald-500/30 transition-all">
          +30s
        </button>
        <button @click.stop="handleClose" 
                title="关闭休息计时"
                class="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 active:scale-90 text-zinc-400 flex items-center justify-center text-xs font-bold border border-zinc-700 transition-all">
          ✕
        </button>
      </div>

      <!-- Mini Progress Ring & Time (Statically aligned to edge) -->
      <div class="flex items-center gap-1.5 cursor-pointer" :class="{ 'order-2': isRightHalf, 'order-1': !isRightHalf }" @click="toggleExpand">
        <div class="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 transform -rotate-90">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" class="text-zinc-800" fill="transparent" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" 
                    :stroke-dasharray="62.8" 
                    :stroke-dashoffset="miniDashOffset" 
                    stroke-linecap="round"
                    class="text-emerald-400 transition-all duration-300" fill="transparent" />
          </svg>
        </div>
        <span class="font-mono font-black text-xs text-emerald-400">
          {{ formatTime(store.restTimer.remaining) }}
        </span>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { store, startRestTimer, stopRestTimer, adjustRestTimer } from "../store/fitnessStore.js";

const csC4TimerImg = "./themes/cs/hud/bomb_planted.svg";
const chamberWatchImg = "./themes/chamber/icons/chamber-luxury-watch.svg";
const timerWidgetRef = ref(null);

const isExpanded = ref(false);
const customPos = ref(null);
const isDragging = ref(false);

let dragStartX = 0;
let dragStartY = 0;
let initialElX = 0;
let initialElY = 0;
let hasMoved = false;

const isRightHalf = computed(() => {
  if (!customPos.value) return true;
  const winW = typeof window !== "undefined" ? window.innerWidth : 390;
  return customPos.value.x > winW / 2;
});

const containerStyle = computed(() => {
  const winW = typeof window !== "undefined" ? window.innerWidth : 390;

  if (customPos.value) {
    if (isRightHalf.value) {
      // Pin right edge position so expanding to the left keeps the timer badge 100% stationary
      const compactWidth = 84;
      const rightDistance = Math.max(8, winW - (customPos.value.x + compactWidth));
      return {
        right: `${rightDistance}px`,
        left: 'auto',
        top: `${customPos.value.y}px`,
        bottom: 'auto',
        transform: 'translateZ(0)',
        webkitTransform: 'translateZ(0)'
      };
    } else {
      // Pin left edge position so expanding to the right keeps the timer badge 100% stationary
      const leftDistance = Math.max(8, customPos.value.x);
      return {
        left: `${leftDistance}px`,
        right: 'auto',
        top: `${customPos.value.y}px`,
        bottom: 'auto',
        transform: 'translateZ(0)',
        webkitTransform: 'translateZ(0)'
      };
    }
  }

  return {
    right: '12px',
    left: 'auto',
    bottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 64px), 74px)',
    transform: 'translateZ(0)',
    webkitTransform: 'translateZ(0)'
  };
});

const miniDashOffset = computed(() => {
  const dur = store.restTimer.duration || 1;
  const rem = store.restTimer.remaining;
  const progress = Math.max(0, Math.min(1, rem / dur));
  return 62.8 * (1 - progress);
});

function toggleExpand() {
  if (!hasMoved) {
    isExpanded.value = !isExpanded.value;
  }
}

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

// Touch event handlers for mobile gesture dragging
function onTouchStart(e) {
  const touch = e.touches[0];
  dragStartX = touch.clientX;
  dragStartY = touch.clientY;
  hasMoved = false;
  isDragging.value = true;

  const el = timerWidgetRef.value;
  if (el) {
    const rect = el.getBoundingClientRect();
    initialElX = rect.left;
    initialElY = rect.top;
  }
}

function onTouchMove(e) {
  if (!isDragging.value) return;
  const touch = e.touches[0];
  const dx = touch.clientX - dragStartX;
  const dy = touch.clientY - dragStartY;

  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    hasMoved = true;
    const maxX = (window.innerWidth || 360) - 80;
    const maxY = (window.innerHeight || 640) - 70;
    const newX = Math.max(8, Math.min(maxX, initialElX + dx));
    const newY = Math.max(50, Math.min(maxY, initialElY + dy));
    customPos.value = { x: newX, y: newY };
  }
}

function onTouchEnd() {
  isDragging.value = false;
}

// Mouse event handlers for desktop preview dragging
function onMouseDown(e) {
  // Only handle left click on main body, not buttons
  if (e.target.tagName === "BUTTON") return;
  
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  hasMoved = false;
  isDragging.value = true;

  const el = timerWidgetRef.value;
  if (el) {
    const rect = el.getBoundingClientRect();
    initialElX = rect.left;
    initialElY = rect.top;
  }

  const onMouseMove = (moveEvent) => {
    if (!isDragging.value) return;
    const dx = moveEvent.clientX - dragStartX;
    const dy = moveEvent.clientY - dragStartY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved = true;
      const maxX = (window.innerWidth || 360) - 80;
      const maxY = (window.innerHeight || 640) - 70;
      const newX = Math.max(8, Math.min(maxX, initialElX + dx));
      const newY = Math.max(50, Math.min(maxY, initialElY + dy));
      customPos.value = { x: newX, y: newY };
    }
  };

  const onMouseUp = () => {
    isDragging.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}
</script>