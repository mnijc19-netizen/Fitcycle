<template>
  <nav class="fixed bottom-0 left-0 right-0 z-30 px-2 pt-1.5 transition-colors duration-200"
       :class="[
         store.settings.uiSkin === 'chamber' 
           ? 'bg-[#070B14]/98 backdrop-blur-2xl border-t border-[#E5C378]/30 shadow-2xl shadow-black' 
           : store.settings.uiSkin === 'cs'
           ? 'bg-[#080C14]/98 backdrop-blur-2xl border-t border-[#F97316]/40 shadow-2xl shadow-black'
           : 'bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80'
       ]"
       style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px); transform: translateZ(0); -webkit-transform: translateZ(0);">
    
    <!-- Top fine hairline shimmer for Chamber & CS2 -->
    <div v-if="store.settings.uiSkin === 'chamber'" 
         class="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#E5C378]/60 to-transparent pointer-events-none"></div>
    <div v-else-if="store.settings.uiSkin === 'cs'" 
         class="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#F97316]/70 to-transparent pointer-events-none"></div>

    <div class="max-w-md mx-auto grid grid-cols-5">

      <!-- ============================================== -->
      <!-- TAB 1: TODAY (今日) -->
      <!-- ============================================== -->
      <button @click="switchTab('today')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'today' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#F6E09E] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(246,224,158,0.9)]' : store.settings.uiSkin === 'cs' ? 'text-[#FF8A3D] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]' : 'text-amber-400 font-black scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#9AA8C2] hover:text-[#C5D1E8]' : store.settings.uiSkin === 'cs' ? 'text-[#94A3B8] hover:text-[#CBD5E1]' : 'text-zinc-400 hover:text-zinc-200')
              ]">
        
        <!-- Icon Container -->
        <div class="relative w-6 h-6 flex items-center justify-center">
          <!-- Chamber Skill Icon -->
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="headhunterIcon" 
               alt="Headhunter"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'today' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />
          
          <!-- CS2 Official AK-47 UI Icon -->
          <img v-else-if="store.settings.uiSkin === 'cs'" 
               :src="csHomeIcon" 
               alt="AK-47" 
               class="w-6 h-6 object-contain transition-all drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]"
               :class="[store.activeTab === 'today' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110' : 'opacity-75 grayscale-[30%]']" />

          <!-- Default SVG Icon -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>

          <!-- Active workout ping -->
          <span v-if="store.activeWorkout" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        <!-- Label -->
        <span class="text-[10px] mt-1 font-medium tracking-tight">今日</span>
        
        <!-- Active Indicator -->
        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'today'" 
              class="w-1.5 h-1.5 rounded-full bg-[#F6E09E] mt-0.5 shadow-[0_0_6px_#F6E09E]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'today'" 
              class="w-5 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 2: CYCLE (周期) -->
      <!-- ============================================== -->
      <button @click="switchTab('cycle')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'cycle' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#F6E09E] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(246,224,158,0.9)]' : store.settings.uiSkin === 'cs' ? 'text-[#FF8A3D] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]' : 'text-amber-400 font-black scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#9AA8C2] hover:text-[#C5D1E8]' : store.settings.uiSkin === 'cs' ? 'text-[#94A3B8] hover:text-[#CBD5E1]' : 'text-zinc-400 hover:text-zinc-200')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="rendezvousIcon" 
               alt="Rendezvous"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'cycle' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />

          <!-- CS2 Official C4 Explosive UI Icon -->
          <img v-else-if="store.settings.uiSkin === 'cs'" 
               :src="csCycleIcon" 
               alt="C4 Bomb" 
               class="w-6 h-6 object-contain transition-all drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]"
               :class="[store.activeTab === 'cycle' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110' : 'opacity-75 grayscale-[30%]']" />

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">周期</span>
        
        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'cycle'" 
              class="w-1.5 h-1.5 rounded-full bg-[#F6E09E] mt-0.5 shadow-[0_0_6px_#F6E09E]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'cycle'" 
              class="w-5 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 3: CALENDAR (日历) -->
      <!-- ============================================== -->
      <button @click="switchTab('calendar')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'calendar' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#F6E09E] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(246,224,158,0.9)]' : store.settings.uiSkin === 'cs' ? 'text-[#FF8A3D] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]' : 'text-amber-400 font-black scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#9AA8C2] hover:text-[#C5D1E8]' : store.settings.uiSkin === 'cs' ? 'text-[#94A3B8] hover:text-[#CBD5E1]' : 'text-zinc-400 hover:text-zinc-200')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="trademarkIcon" 
               alt="Trademark"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'calendar' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />

          <!-- CS2 Official Defuser UI Icon -->
          <img v-else-if="store.settings.uiSkin === 'cs'" 
               :src="csCalendarIcon" 
               alt="Defuser" 
               class="w-6 h-6 object-contain transition-all drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]"
               :class="[store.activeTab === 'calendar' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110' : 'opacity-75 grayscale-[30%]']" />

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">日历</span>

        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'calendar'" 
              class="w-1.5 h-1.5 rounded-full bg-[#F6E09E] mt-0.5 shadow-[0_0_6px_#F6E09E]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'calendar'" 
              class="w-5 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 4: EXERCISES (动作库) -->
      <!-- ============================================== -->
      <button @click="switchTab('exercises')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'exercises' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#F6E09E] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(246,224,158,0.9)]' : store.settings.uiSkin === 'cs' ? 'text-[#FF8A3D] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]' : 'text-amber-400 font-black scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#9AA8C2] hover:text-[#C5D1E8]' : store.settings.uiSkin === 'cs' ? 'text-[#94A3B8] hover:text-[#CBD5E1]' : 'text-zinc-400 hover:text-zinc-200')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="tourDeForceIcon" 
               alt="Tour De Force"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'exercises' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.8)] scale-110' : 'opacity-80 grayscale-[15%]']" />

          <!-- CS2 Official AWP Sniper UI Icon -->
          <img v-else-if="store.settings.uiSkin === 'cs'" 
               :src="csExercisesIcon" 
               alt="AWP Sniper" 
               class="w-6 h-6 object-contain transition-all drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]"
               :class="[store.activeTab === 'exercises' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110' : 'opacity-75 grayscale-[30%]']" />

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">动作</span>

        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'exercises'" 
              class="w-1.5 h-1.5 rounded-full bg-[#F6E09E] mt-0.5 shadow-[0_0_6px_#F6E09E]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'exercises'" 
              class="w-5 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 5: STATS & SETTINGS (统计设置) -->
      <!-- ============================================== -->
      <button @click="switchTab('stats')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'stats' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#F6E09E] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(246,224,158,0.9)]' : store.settings.uiSkin === 'cs' ? 'text-[#FF8A3D] font-black -translate-y-0.5 drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]' : 'text-amber-400 font-black scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#9AA8C2] hover:text-[#C5D1E8]' : store.settings.uiSkin === 'cs' ? 'text-[#94A3B8] hover:text-[#CBD5E1]' : 'text-zinc-400 hover:text-zinc-200')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <!-- Chamber Skin Inlined Tactical Card Profile SVG -->
          <svg v-if="store.settings.uiSkin === 'chamber'" 
               class="w-5 h-5 object-contain transition-all"
               :class="[store.activeTab === 'stats' ? 'text-[#F6E09E] drop-shadow-[0_0_8px_rgba(246,224,158,0.9)] scale-110' : 'text-[#9AA8C2] opacity-80']"
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
               class="w-6 h-6 object-contain transition-all drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]"
               :class="[store.activeTab === 'stats' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] scale-110' : 'opacity-75 grayscale-[30%]']" />

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">统计设置</span>

        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'stats'" 
              class="w-1.5 h-1.5 rounded-full bg-[#F6E09E] mt-0.5 shadow-[0_0_6px_#F6E09E]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'stats'" 
              class="w-5 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { store } from "../store/fitnessStore.js";
import { triggerHaptic } from "../utils/vibrate.js";

const headhunterIcon = "./themes/chamber/icons/headhunter.png";
const rendezvousIcon = "./themes/chamber/icons/rendezvous.png";
const trademarkIcon = "./themes/chamber/icons/trademark.png";
const tourDeForceIcon = "./themes/chamber/icons/tour-de-force.png";

const csHomeIcon = "./themes/cs/icons/ak47.svg";
const csCycleIcon = "./themes/cs/icons/c4.svg";
const csCalendarIcon = "./themes/cs/icons/defuser.svg";
const csExercisesIcon = "./themes/cs/icons/awp.svg";
const csStatsIcon = "./themes/cs/icons/skillgroup18.svg";

function switchTab(tabName) {
  if (store.activeTab === tabName) {
    // Repeated click on active tab -> iOS standard Natural Thumb Zone smooth scroll-to-top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (store.settings.vibrationEnabled) triggerHaptic("medium");
    return;
  }
  store.activeTab = tabName;
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}
</script>