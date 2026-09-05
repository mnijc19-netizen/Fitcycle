<template>
  <nav class="fixed bottom-0 left-0 right-0 z-30 px-2 pt-1.5 transition-colors duration-200"
       :class="tabBarThemeClasses"
       style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px); transform: translateZ(0); -webkit-transform: translateZ(0);">
    
    <!-- Top fine hairline shimmer for Chamber & CS2 -->
    <div v-if="store.settings.uiSkin === 'chamber'" 
         class="absolute top-0 left-1/4 right-1/4 h-[1px] pointer-events-none"
         :class="store.settings.themeMode === 'light' ? 'bg-gradient-to-r from-transparent via-[#C5A059]/70 to-transparent' : 'bg-gradient-to-r from-transparent via-[#E5C378]/60 to-transparent'"></div>
    <div v-else-if="store.settings.uiSkin === 'cs'" 
         class="absolute top-0 left-1/4 right-1/4 h-[1px] pointer-events-none"
         :class="store.settings.themeMode === 'light' ? 'bg-gradient-to-r from-transparent via-[#E04E00]/70 to-transparent' : 'bg-gradient-to-r from-transparent via-[#F97316]/70 to-transparent'"></div>

    <div class="max-w-md mx-auto grid grid-cols-5">

      <!-- ============================================== -->
      <!-- TAB 1: TODAY (今日) -->
      <!-- ============================================== -->
      <button @click="switchTab('today')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="getTabItemClasses('today')">
        
        <!-- Icon Container -->
        <div class="relative w-6 h-6 flex items-center justify-center">
          <!-- Chamber Skill Icon -->
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="headhunterIcon" 
               alt="Headhunter"
               class="w-6 h-6 object-contain transition-all"
               :style="store.settings.themeMode === 'light' ? (store.activeTab === 'today' ? 'filter: brightness(0.45) contrast(1.5) drop-shadow(0 1px 3px rgba(0,0,0,0.2));' : 'filter: brightness(0.3) contrast(1.3) opacity(0.85);') : ''"
               :class="[store.activeTab === 'today' ? 'brightness-110 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />
          
          <!-- CS2 Official AK-47 UI Icon (Mask-rendered for 100% Light & Dark Contrast) -->
          <template v-else-if="store.settings.uiSkin === 'cs'">
            <div class="w-6 h-6 transition-all"
                 :class="[
                   store.activeTab === 'today'
                     ? (store.settings.themeMode === 'light'
                         ? 'bg-[#C2410C] drop-shadow-[0_2px_6px_rgba(194,65,12,0.4)] scale-110'
                         : 'bg-[#FF8A3D] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110')
                     : (store.settings.themeMode === 'light'
                         ? 'bg-slate-700 hover:bg-slate-900 opacity-95'
                         : 'bg-[#94A3B8] hover:bg-white opacity-80')
                 ]"
                 :style="{
                   maskImage: `url(${csHomeIcon})`,
                   WebkitMaskImage: `url(${csHomeIcon})`,
                   maskSize: 'contain',
                   WebkitMaskSize: 'contain',
                   maskRepeat: 'no-repeat',
                   WebkitMaskRepeat: 'no-repeat',
                   maskPosition: 'center',
                   WebkitMaskPosition: 'center'
                 }">
            </div>
            <img :src="csHomeIcon" class="hidden" alt="AK-47" aria-hidden="true" />
          </template>

          <!-- Default SVG Icon -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>

          <!-- Active workout ping -->
          <span v-if="store.activeWorkout" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        <!-- Label -->
        <span class="text-[10px] mt-1 font-semibold tracking-tight">今日</span>
        
        <!-- Active Indicator -->
        <span v-if="store.activeTab === 'today'" :class="activeIndicatorClass"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 2: CYCLE (周期) -->
      <!-- ============================================== -->
      <button @click="switchTab('cycle')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="getTabItemClasses('cycle')">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="rendezvousIcon" 
               alt="Rendezvous"
               class="w-6 h-6 object-contain transition-all"
               :style="store.settings.themeMode === 'light' ? (store.activeTab === 'cycle' ? 'filter: brightness(0.45) contrast(1.5) drop-shadow(0 1px 3px rgba(0,0,0,0.2));' : 'filter: brightness(0.3) contrast(1.3) opacity(0.85);') : ''"
               :class="[store.activeTab === 'cycle' ? 'brightness-110 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />

          <!-- CS2 Official C4 Explosive UI Icon (Mask-rendered) -->
          <template v-else-if="store.settings.uiSkin === 'cs'">
            <div class="w-6 h-6 transition-all"
                 :class="[
                   store.activeTab === 'cycle'
                     ? (store.settings.themeMode === 'light'
                         ? 'bg-[#C2410C] drop-shadow-[0_2px_6px_rgba(194,65,12,0.4)] scale-110'
                         : 'bg-[#FF8A3D] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110')
                     : (store.settings.themeMode === 'light'
                         ? 'bg-slate-700 hover:bg-slate-900 opacity-95'
                         : 'bg-[#94A3B8] hover:bg-white opacity-80')
                 ]"
                 :style="{
                   maskImage: `url(${csCycleIcon})`,
                   WebkitMaskImage: `url(${csCycleIcon})`,
                   maskSize: 'contain',
                   WebkitMaskSize: 'contain',
                   maskRepeat: 'no-repeat',
                   WebkitMaskRepeat: 'no-repeat',
                   maskPosition: 'center',
                   WebkitMaskPosition: 'center'
                 }">
            </div>
            <img :src="csCycleIcon" class="hidden" alt="C4 Bomb" aria-hidden="true" />
          </template>

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-semibold tracking-tight">周期</span>
        
        <!-- Active Indicator -->
        <span v-if="store.activeTab === 'cycle'" :class="activeIndicatorClass"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 3: CALENDAR (日历) -->
      <!-- ============================================== -->
      <button @click="switchTab('calendar')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="getTabItemClasses('calendar')">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="trademarkIcon" 
               alt="Trademark"
               class="w-6 h-6 object-contain transition-all"
               :style="store.settings.themeMode === 'light' ? (store.activeTab === 'calendar' ? 'filter: brightness(0.45) contrast(1.5) drop-shadow(0 1px 3px rgba(0,0,0,0.2));' : 'filter: brightness(0.3) contrast(1.3) opacity(0.85);') : ''"
               :class="[store.activeTab === 'calendar' ? 'brightness-110 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />

          <!-- CS2 Official Defuser UI Icon (Mask-rendered) -->
          <template v-else-if="store.settings.uiSkin === 'cs'">
            <div class="w-6 h-6 transition-all"
                 :class="[
                   store.activeTab === 'calendar'
                     ? (store.settings.themeMode === 'light'
                         ? 'bg-[#C2410C] drop-shadow-[0_2px_6px_rgba(194,65,12,0.4)] scale-110'
                         : 'bg-[#FF8A3D] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110')
                     : (store.settings.themeMode === 'light'
                         ? 'bg-slate-700 hover:bg-slate-900 opacity-95'
                         : 'bg-[#94A3B8] hover:bg-white opacity-80')
                 ]"
                 :style="{
                   maskImage: `url(${csCalendarIcon})`,
                   WebkitMaskImage: `url(${csCalendarIcon})`,
                   maskSize: 'contain',
                   WebkitMaskSize: 'contain',
                   maskRepeat: 'no-repeat',
                   WebkitMaskRepeat: 'no-repeat',
                   maskPosition: 'center',
                   WebkitMaskPosition: 'center'
                 }">
            </div>
            <img :src="csCalendarIcon" class="hidden" alt="Defuser" aria-hidden="true" />
          </template>

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-semibold tracking-tight">日历</span>

        <!-- Active Indicator -->
        <span v-if="store.activeTab === 'calendar'" :class="activeIndicatorClass"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 4: EXERCISES (动作库) -->
      <!-- ============================================== -->
      <button @click="switchTab('exercises')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="getTabItemClasses('exercises')">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <!-- Chamber Skill Tour De Force -->
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="tourDeForceIcon" 
               alt="Tour De Force"
               class="w-6 h-6 object-contain transition-all"
               :style="store.settings.themeMode === 'light' ? (store.activeTab === 'exercises' ? 'filter: brightness(0.45) contrast(1.5) drop-shadow(0 1px 3px rgba(0,0,0,0.2));' : 'filter: brightness(0.3) contrast(1.3) opacity(0.85);') : ''"
               :class="[store.activeTab === 'exercises' ? 'brightness-110 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />

          <!-- CS2 Official AWP Sniper UI Icon (Mask-rendered) -->
          <template v-else-if="store.settings.uiSkin === 'cs'">
            <div class="w-6 h-6 transition-all"
                 :class="[
                   store.activeTab === 'exercises'
                     ? (store.settings.themeMode === 'light'
                         ? 'bg-[#C2410C] drop-shadow-[0_2px_6px_rgba(194,65,12,0.4)] scale-110'
                         : 'bg-[#FF8A3D] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110')
                     : (store.settings.themeMode === 'light'
                         ? 'bg-slate-700 hover:bg-slate-900 opacity-95'
                         : 'bg-[#94A3B8] hover:bg-white opacity-80')
                 ]"
                 :style="{
                   maskImage: `url(${csExercisesIcon})`,
                   WebkitMaskImage: `url(${csExercisesIcon})`,
                   maskSize: 'contain',
                   WebkitMaskSize: 'contain',
                   maskRepeat: 'no-repeat',
                   WebkitMaskRepeat: 'no-repeat',
                   maskPosition: 'center',
                   WebkitMaskPosition: 'center'
                 }">
            </div>
            <img :src="csExercisesIcon" class="hidden" alt="AWP Sniper" aria-hidden="true" />
          </template>

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-semibold tracking-tight">动作</span>

        <!-- Active Indicator -->
        <span v-if="store.activeTab === 'exercises'" :class="activeIndicatorClass"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 5: STATS & SETTINGS (统计设置) -->
      <!-- ============================================== -->
      <button @click="switchTab('stats')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="getTabItemClasses('stats')">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <!-- Chamber Skin Inlined Tactical Card Profile SVG -->
          <svg v-if="store.settings.uiSkin === 'chamber'" 
               class="w-5 h-5 object-contain transition-all"
               :class="[store.activeTab === 'stats' ? (store.settings.themeMode === 'light' ? 'text-[#854D0E] drop-shadow-[0_1px_3px_rgba(133,77,14,0.3)] scale-110' : 'text-inherit drop-shadow-[0_0_8px_rgba(246,224,158,0.9)] scale-110') : 'text-inherit opacity-85']"
               viewBox="0 0 512 512" fill="none">
            <path d="M80 120 C80 106.745 90.745 96 104 96 H360 L432 168 V392 C432 405.255 421.255 416 408 416 H104 C90.745 416 80 405.255 80 392 V120 Z" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <path d="M360 96 V168 H432" stroke="currentColor" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M256 180 L320 256 L256 332 L192 256 Z" stroke="currentColor" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.35" />
            <circle cx="256" cy="256" r="18" fill="currentColor" />
            <line x1="256" y1="136" x2="256" y2="166" stroke="currentColor" stroke-width="26" stroke-linecap="round" />
            <line x1="256" y1="346" x2="256" y2="376" stroke="currentColor" stroke-width="26" stroke-linecap="round" />
            <line x1="144" y1="256" x2="174" y2="256" stroke="currentColor" stroke-width="26" stroke-linecap="round" />
            <line x1="338" y1="256" x2="368" y2="256" stroke="currentColor" stroke-width="26" stroke-linecap="round" />
            <line x1="120" y1="368" x2="200" y2="368" stroke="currentColor" stroke-width="22" stroke-linecap="round" opacity="0.9" />
            <line x1="120" y1="148" x2="180" y2="148" stroke="currentColor" stroke-width="22" stroke-linecap="round" opacity="0.9" />
          </svg>

          <!-- CS2 Official Global Elite Rank Badge Icon -->
          <img v-else-if="store.settings.uiSkin === 'cs'" 
               :src="csStatsIcon" 
               alt="Global Elite" 
               class="w-6 h-6 object-contain transition-all"
               :class="[
                 store.activeTab === 'stats'
                   ? (store.settings.themeMode === 'light'
                       ? 'scale-110 drop-shadow-[0_2px_6px_rgba(194,65,12,0.4)]'
                       : 'brightness-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110')
                   : (store.settings.themeMode === 'light'
                       ? 'opacity-90 contrast-125 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]'
                       : 'opacity-75 grayscale-[30%]')
               ]" />

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-semibold tracking-tight">统计设置</span>

        <!-- Active Indicator -->
        <span v-if="store.activeTab === 'stats'" :class="activeIndicatorClass"></span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store/fitnessStore.js";
import { triggerHaptic } from "../utils/vibrate.js";
import { universalScrollToTop } from "../utils/scrollUtils.js";

const headhunterIcon = "./themes/chamber/icons/headhunter.png";
const rendezvousIcon = "./themes/chamber/icons/rendezvous.png";
const trademarkIcon = "./themes/chamber/icons/trademark.png";
const tourDeForceIcon = "./themes/chamber/icons/tour-de-force.png";

const csHomeIcon = "./themes/cs/icons/ak47.svg";
const csCycleIcon = "./themes/cs/icons/c4.svg";
const csCalendarIcon = "./themes/cs/icons/defuser.svg";
const csExercisesIcon = "./themes/cs/icons/awp.svg";
const csStatsIcon = "./themes/cs/icons/skillgroup18.svg";

const tabBarThemeClasses = computed(() => {
  const isLight = store.settings.themeMode === "light";
  const skin = store.settings.uiSkin;
  if (skin === "chamber") {
    return isLight
      ? "bg-[#FDFCFA]/98 backdrop-blur-3xl border-t border-[#D8CEB9] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      : "bg-[#070B14]/98 backdrop-blur-2xl border-t border-[#E5C378]/30 shadow-2xl shadow-black";
  }
  if (skin === "cs") {
    return isLight
      ? "bg-[#F8FAFC]/98 backdrop-blur-3xl border-t border-slate-300/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      : "bg-[#090D15]/98 backdrop-blur-2xl border-t border-[#FA5A00]/40 shadow-2xl shadow-black";
  }
  if (skin === "monochrome") {
    return isLight
      ? "bg-white/98 backdrop-blur-3xl border-t border-neutral-300 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      : "bg-black/98 backdrop-blur-2xl border-t border-neutral-800 shadow-2xl shadow-black";
  }
  return isLight
    ? "bg-white/98 backdrop-blur-3xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
    : "bg-[#0B0D11]/95 backdrop-blur-xl border-t border-zinc-800/80";
});

function getTabItemClasses(tabKey) {
  const isActive = store.activeTab === tabKey;
  const isLight = store.settings.themeMode === "light";
  const skin = store.settings.uiSkin;

  if (isActive) {
    if (skin === "chamber") {
      return isLight
        ? "text-[#967232] font-black -translate-y-0.5 drop-shadow-[0_0_8px_rgba(150,114,50,0.3)]"
        : "text-[#F6E09E] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(246,224,158,0.9)]";
    }
    if (skin === "cs") {
      return isLight
        ? "text-[#C2410C] font-black -translate-y-0.5 drop-shadow-[0_0_8px_rgba(194,65,12,0.3)]"
        : "text-[#FF8A3D] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]";
    }
    if (skin === "monochrome") {
      return isLight
        ? "text-black font-black -translate-y-0.5"
        : "text-white font-black -translate-y-0.5";
    }
    return isLight
      ? "text-[#B45309] font-black scale-105 drop-shadow-[0_0_8px_rgba(180,83,9,0.3)]"
      : "text-amber-400 font-black scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]";
  }

  // Inactive tab styling
  if (skin === "chamber") {
    return isLight ? "text-[#3B4858] font-bold hover:text-[#141B26]" : "text-[#9AA8C2] hover:text-[#C5D1E8]";
  }
  if (skin === "cs") {
    return isLight ? "text-[#334155] font-bold hover:text-[#090D16]" : "text-[#94A3B8] hover:text-[#CBD5E1]";
  }
  if (skin === "monochrome") {
    return isLight ? "text-neutral-800 font-bold hover:text-black" : "text-neutral-400 hover:text-neutral-200";
  }
  return isLight ? "text-slate-700 font-bold hover:text-slate-900" : "text-zinc-400 hover:text-zinc-200";
}

const activeIndicatorClass = computed(() => {
  const isLight = store.settings.themeMode === "light";
  const skin = store.settings.uiSkin;
  if (skin === "chamber") {
    return isLight
      ? "w-1.5 h-1.5 rounded-full bg-[#967232] mt-0.5 shadow-[0_0_4px_#967232]"
      : "w-1.5 h-1.5 rounded-full bg-[#F6E09E] mt-0.5 shadow-[0_0_6px_#F6E09E]";
  }
  if (skin === "cs") {
    return isLight
      ? "w-5 h-1 rounded-full bg-[#C2410C] mt-0.5 shadow-[0_0_4px_#C2410C]"
      : "w-5 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]";
  }
  if (skin === "monochrome") {
    return isLight
      ? "w-1.5 h-1.5 rounded-full bg-black mt-0.5"
      : "w-1.5 h-1.5 rounded-full bg-white mt-0.5";
  }
  return isLight
    ? "w-1.5 h-1.5 rounded-full bg-[#B45309] mt-0.5 shadow-[0_0_4px_rgba(180,83,9,0.5)]"
    : "w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-[0_0_6px_rgba(245,158,11,0.6)]";
});

function switchTab(tabName) {
  if (store.activeTab === tabName) {
    // Repeated click on active tab -> universal cross-engine smooth scroll-to-top
    universalScrollToTop(true);
    if (store.settings.vibrationEnabled) triggerHaptic("medium");
    return;
  }
  store.activeTab = tabName;
  universalScrollToTop(false);
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}
</script>