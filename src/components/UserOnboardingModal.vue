<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden touch-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 16px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 16px);">
      
      <!-- Non-intrusive backdrop click to close -->
      <div class="absolute inset-0" @click="handleDismiss"></div>

      <!-- Sleek Apple-Style Glassmorphic Welcome Card -->
      <div class="relative w-full max-w-[380px] rounded-[28px] p-5 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-5 overflow-hidden animate-in zoom-in-95 duration-200 transition-all border overflow-x-hidden"
           style="touch-action: pan-y; max-width: min(380px, calc(100vw - 24px)); box-sizing: border-box;"
           :class="store.settings.themeMode === 'light' 
             ? 'bg-white/98 border-slate-200 text-slate-900 shadow-slate-300/40' 
             : 'bg-[#0C0F17]/98 border-zinc-800 text-white shadow-black/80'">
        
        <!-- Ambient Subtle Top Glow -->
        <div class="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
             :class="store.settings.themeMode === 'light' ? 'bg-amber-400' : 'bg-amber-500'"></div>

        <!-- Top Header: Micro Brand & Dismiss Cross -->
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold"
               :class="store.settings.themeMode === 'light' 
                 ? 'bg-amber-50 text-amber-900 border-amber-200' 
                 : 'bg-amber-500/10 text-amber-400 border-amber-500/20'">
            <span class="animate-pulse">✨</span>
            <span>欢迎开启 FitCycle</span>
          </div>

          <button @click="handleDismiss"
                  title="关闭向导"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all active:scale-90 cursor-pointer"
                  :class="store.settings.themeMode === 'light' 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-500' 
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white'">
            ✕
          </button>
        </div>

        <!-- Hero Brandmark & Welcome Title -->
        <div class="text-center space-y-2 relative z-10 pt-1">
          <div class="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border shadow-md transition-all"
               :class="store.settings.themeMode === 'light'
                 ? 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200 shadow-amber-900/5'
                 : 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-700/80 shadow-black/60'">
            <FitCycleLogo size="32" />
          </div>

          <div>
            <h2 class="text-xl font-black tracking-tight"
                :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
              开启你的极简科学特训
            </h2>
            <p class="text-xs mt-1 font-medium"
               :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
              专为健美与抗阻训练打造 · 纯粹 · 高效 · 免空杆起步
            </p>
          </div>
        </div>

        <!-- 3 Airy, Human-Friendly Feature Cards -->
        <div class="space-y-2.5 relative z-10">
          
          <!-- Card 1: 30s Strength Placement -->
          <div class="p-3 rounded-2xl border flex items-center gap-3 transition-all"
               :class="store.settings.themeMode === 'light' 
                 ? 'bg-amber-50/60 border-amber-200/80' 
                 : 'bg-zinc-900/60 border-zinc-800/80'">
            <div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center text-lg flex-shrink-0">
              ⚡
            </div>
            <div class="min-w-0">
              <h3 class="text-xs font-black"
                  :class="store.settings.themeMode === 'light' ? 'text-amber-950' : 'text-amber-300'">
                30秒力量定级 · 告别空杆重填
              </h3>
              <p class="text-[11px] mt-0.5 leading-snug"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                无论新手还是训练数月的老铁，一键测算推拉腿开局黄金组重，直接开练。
              </p>
            </div>
          </div>

          <!-- Card 2: PPL Split -->
          <div class="p-3 rounded-2xl border flex items-center gap-3 transition-all"
               :class="store.settings.themeMode === 'light' 
                 ? 'bg-sky-50/60 border-sky-200/80' 
                 : 'bg-zinc-900/60 border-zinc-800/80'">
            <div class="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-500 flex items-center justify-center text-lg flex-shrink-0">
              🎯
            </div>
            <div class="min-w-0">
              <h3 class="text-xs font-black"
                  :class="store.settings.themeMode === 'light' ? 'text-sky-950' : 'text-sky-300'">
                推 / 拉 / 腿 黄金分化循环
              </h3>
              <p class="text-[11px] mt-0.5 leading-snug"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                科学安排肌群轮转与神经超量恢复，今日练什么一目了然，无需费脑排期。
              </p>
            </div>
          </div>

          <!-- Card 3: Ergonomic Set Logging -->
          <div class="p-3 rounded-2xl border flex items-center gap-3 transition-all"
               :class="store.settings.themeMode === 'light' 
                 ? 'bg-emerald-50/60 border-emerald-200/80' 
                 : 'bg-zinc-900/60 border-zinc-800/80'">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center text-lg flex-shrink-0">
              🏋️
            </div>
            <div class="min-w-0">
              <h3 class="text-xs font-black"
                  :class="store.settings.themeMode === 'light' ? 'text-emerald-950' : 'text-emerald-300'">
                健身房防抖大按键 · 极速加片
              </h3>
              <p class="text-[11px] mt-0.5 leading-snug"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                大触控步进器、点击数字全选、杠铃片快捷胶囊，专注每一次肌肉收缩。
              </p>
            </div>
          </div>

        </div>

        <!-- Action Buttons Area -->
        <div class="space-y-2 pt-1 relative z-10">
          <!-- Primary CTA: 30s Placement -->
          <button @click="handleOpenStrength" 
                  class="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer select-none">
            <span>⚡</span>
            <span>30秒选定力量水平并开练</span>
          </button>

          <!-- Secondary CTA: Direct Jump to Workout -->
          <button @click="handleDismiss"
                  class="w-full py-2 text-xs font-bold transition-colors cursor-pointer text-center"
                  :class="store.settings.themeMode === 'light' 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-zinc-400 hover:text-zinc-200'">
            <span>稍后定级，直接开启今日训练 ›</span>
          </button>
        </div>

      </div>

    </div>
  </Teleport>
</template>

<script setup>
import { watch, onUnmounted } from "vue";
import { store } from "../store/fitnessStore.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import FitCycleLogo from "./FitCycleLogo.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close", "open-strength"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

function handleDismiss() {
  store.settings.hasSeenOnboarding = true;
  emit("close");
}

function handleOpenStrength() {
  store.settings.hasSeenOnboarding = true;
  emit("open-strength");
  emit("close");
}
</script>
