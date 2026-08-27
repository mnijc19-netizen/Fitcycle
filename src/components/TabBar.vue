<template>
  <nav class="fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 px-2 pt-1.5"
       :class="[
         store.settings.uiSkin === 'chamber' 
           ? 'bg-[#070B14]/95 backdrop-blur-2xl border-t border-[#E5C378]/30 shadow-2xl shadow-black' 
           : store.settings.uiSkin === 'cs'
           ? 'bg-[#080C14]/95 backdrop-blur-2xl border-t border-[#F97316]/40 shadow-2xl shadow-black'
           : 'bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80'
       ]"
       style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px);">
    
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
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#E5C378] font-bold -translate-y-0.5' : store.settings.uiSkin === 'cs' ? 'text-[#F97316] font-black -translate-y-0.5 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-amber-400 font-bold scale-105') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#5C6E8F] hover:text-[#9AA8C2]' : store.settings.uiSkin === 'cs' ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-zinc-500 hover:text-zinc-300')
              ]">
        
        <!-- Icon Container -->
        <div class="relative w-6 h-6 flex items-center justify-center">
          <!-- Chamber Skill Icon -->
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="headhunterIcon" 
               alt="Headhunter"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'today' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.7)] scale-110' : 'opacity-60 grayscale-[30%]']" />
          
          <!-- CS2 Headshot Crosshair -->
          <svg v-else-if="store.settings.uiSkin === 'cs'" class="w-6 h-6 object-contain transition-all" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <line x1="12" y1="1.5" x2="12" y2="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <line x1="12" y1="19" x2="12" y2="22.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <line x1="1.5" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <line x1="19" y1="12" x2="22.5" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>

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
              class="w-1 h-1 rounded-full bg-[#E5C378] mt-0.5 shadow-[0_0_4px_#E5C378]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'today'" 
              class="w-1 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 2: CYCLE (周期) -->
      <!-- ============================================== -->
      <button @click="switchTab('cycle')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'cycle' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#E5C378] font-bold -translate-y-0.5' : store.settings.uiSkin === 'cs' ? 'text-[#F97316] font-black -translate-y-0.5 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-amber-400 font-bold scale-105') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#5C6E8F] hover:text-[#9AA8C2]' : store.settings.uiSkin === 'cs' ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-zinc-500 hover:text-zinc-300')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="rendezvousIcon" 
               alt="Rendezvous"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'cycle' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.7)] scale-110' : 'opacity-60 grayscale-[30%]']" />

          <!-- CS2 C4 Explosive -->
          <svg v-else-if="store.settings.uiSkin === 'cs'" class="w-6 h-6 object-contain transition-all" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="13" rx="2" fill="#1E293B" stroke="currentColor" stroke-width="1.5" />
            <rect x="7" y="6" width="4" height="13" fill="#CA8A04" opacity="0.6" />
            <rect x="13" y="8" width="6" height="5" rx="0.5" fill="#0F172A" />
            <circle cx="14.5" cy="10.5" r="0.9" fill="#EF4444" class="animate-pulse" />
            <circle cx="17.5" cy="10.5" r="0.9" fill="#22C55E" />
            <path d="M5 6 Q9 2 13 6" stroke="#EF4444" stroke-width="1.5" fill="none" />
          </svg>

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">周期</span>
        
        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'cycle'" 
              class="w-1 h-1 rounded-full bg-[#E5C378] mt-0.5 shadow-[0_0_4px_#E5C378]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'cycle'" 
              class="w-1 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 3: CALENDAR (日历) -->
      <!-- ============================================== -->
      <button @click="switchTab('calendar')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'calendar' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#E5C378] font-bold -translate-y-0.5' : store.settings.uiSkin === 'cs' ? 'text-[#F97316] font-black -translate-y-0.5 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-amber-400 font-bold scale-105') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#5C6E8F] hover:text-[#9AA8C2]' : store.settings.uiSkin === 'cs' ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-zinc-500 hover:text-zinc-300')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="trademarkIcon" 
               alt="Trademark"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'calendar' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.7)] scale-110' : 'opacity-60 grayscale-[30%]']" />

          <!-- CS2 Global Elite / Rating Trophy -->
          <svg v-else-if="store.settings.uiSkin === 'cs'" class="w-6 h-6 object-contain transition-all" viewBox="0 0 24 24" fill="none">
            <path d="M2 12 Q6 7 12 9 Q18 7 22 12 Q17 17 12 15 Q7 17 2 12 Z" fill="#1E293B" stroke="currentColor" stroke-width="1.5" />
            <circle cx="12" cy="12" r="4.5" fill="#38BDF8" stroke="currentColor" stroke-width="1.2" />
            <line x1="8" y1="12" x2="16" y2="12" stroke="#0F172A" stroke-width="1" />
            <line x1="12" y1="8" x2="12" y2="16" stroke="#0F172A" stroke-width="1" />
            <polygon points="12,3 13,6 16,6 13.5,8 14.5,11 12,9 9.5,11 10.5,8 8,6 11,6" fill="currentColor" />
          </svg>

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">日历</span>

        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'calendar'" 
              class="w-1 h-1 rounded-full bg-[#E5C378] mt-0.5 shadow-[0_0_4px_#E5C378]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'calendar'" 
              class="w-1 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 4: EXERCISES (动作库) -->
      <!-- ============================================== -->
      <button @click="switchTab('exercises')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'exercises' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#E5C378] font-bold -translate-y-0.5' : store.settings.uiSkin === 'cs' ? 'text-[#F97316] font-black -translate-y-0.5 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-amber-400 font-bold scale-105') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#5C6E8F] hover:text-[#9AA8C2]' : store.settings.uiSkin === 'cs' ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-zinc-500 hover:text-zinc-300')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="tourDeForceIcon" 
               alt="Tour De Force"
               class="w-6 h-6 object-contain transition-all"
               :class="[store.activeTab === 'exercises' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.7)] scale-110' : 'opacity-60 grayscale-[30%]']" />

          <!-- CS2 Karambit Knife -->
          <svg v-else-if="store.settings.uiSkin === 'cs'" class="w-6 h-6 object-contain transition-all" viewBox="0 0 24 24" fill="none">
            <path d="M7 4 Q17 3 20 12 Q18 16 11 11 Q14 7 7 4 Z" fill="url(#cs-karambit-gradient)" stroke="currentColor" stroke-width="1.2" />
            <path d="M7 4 L4 11 L7 17 L11 11 Z" fill="#1E293B" stroke="currentColor" stroke-width="1.2" />
            <circle cx="8" cy="18" r="3" fill="#0F172A" stroke="currentColor" stroke-width="1.5" />
            <defs>
              <linearGradient id="cs-karambit-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#F97316" />
                <stop offset="50%" stop-color="#38BDF8" />
                <stop offset="100%" stop-color="#A855F7" />
              </linearGradient>
            </defs>
          </svg>

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">动作</span>

        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'exercises'" 
              class="w-1 h-1 rounded-full bg-[#E5C378] mt-0.5 shadow-[0_0_4px_#E5C378]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'exercises'" 
              class="w-1 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
      </button>

      <!-- ============================================== -->
      <!-- TAB 5: STATS & SETTINGS (统计设置) -->
      <!-- ============================================== -->
      <button @click="switchTab('stats')" 
              class="flex flex-col items-center justify-center py-1 transition-all group relative"
              :class="[
                store.activeTab === 'stats' 
                  ? (store.settings.uiSkin === 'chamber' ? 'text-[#E5C378] font-bold -translate-y-0.5' : store.settings.uiSkin === 'cs' ? 'text-[#F97316] font-black -translate-y-0.5 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-amber-400 font-bold scale-105') 
                  : (store.settings.uiSkin === 'chamber' ? 'text-[#5C6E8F] hover:text-[#9AA8C2]' : store.settings.uiSkin === 'cs' ? 'text-[#64748B] hover:text-[#94A3B8]' : 'text-zinc-500 hover:text-zinc-300')
              ]">
        
        <div class="relative w-6 h-6 flex items-center justify-center">
          <img v-if="store.settings.uiSkin === 'chamber'" 
               :src="chamberProfileIcon" 
               alt="Chamber Profile"
               class="w-5 h-5 object-contain transition-all"
               :class="[store.activeTab === 'stats' ? 'brightness-125 drop-shadow-[0_0_8px_rgba(229,195,120,0.7)] scale-110' : 'opacity-60 grayscale-[30%]']" />

          <!-- CS2 Tactical Chicken with Helmet -->
          <svg v-else-if="store.settings.uiSkin === 'cs'" class="w-6 h-6 object-contain transition-all" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="14" rx="7" ry="6" fill="#FDE047" stroke="#CA8A04" stroke-width="1.2" />
            <circle cx="16" cy="10" r="4" fill="#FDE047" stroke="#CA8A04" stroke-width="1.2" />
            <polygon points="19,10 22,11 19,12" fill="#F97316" />
            <circle cx="17" cy="9.5" r="0.8" fill="#000000" />
            <path d="M13 9 Q16 4 19 9 Z" fill="#1E293B" stroke="currentColor" stroke-width="1" />
            <rect x="13" y="8.5" width="6.5" height="1.2" rx="0.5" fill="currentColor" />
            <path d="M6 13 L4 11 M6 15 L4 17" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" />
          </svg>

          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <span class="text-[10px] mt-1 font-medium tracking-tight">统计设置</span>

        <span v-if="store.settings.uiSkin === 'chamber' && store.activeTab === 'stats'" 
              class="w-1 h-1 rounded-full bg-[#E5C378] mt-0.5 shadow-[0_0_4px_#E5C378]"></span>
        <span v-else-if="store.settings.uiSkin === 'cs' && store.activeTab === 'stats'" 
              class="w-1 h-1 rounded-full bg-[#F97316] mt-0.5 shadow-[0_0_6px_#F97316]"></span>
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
const chamberProfileIcon = "./themes/chamber/icons/chamber-profile.svg";

function switchTab(tabName) {
  store.activeTab = tabName;
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}
</script>


