<template>
  <nav class="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 px-2 pt-1.5"
       style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px);">
    <div class="max-w-md mx-auto grid grid-cols-5">

      
      <!-- Tab 1: Today -->
      <button @click="switchTab('today')" 
              class="flex flex-col items-center justify-center py-1 transition-all"
              :class="[store.activeTab === 'today' ? 'text-amber-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300']">
        <div class="relative">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span v-if="store.activeWorkout" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <span class="text-[10px] mt-1">今日训练</span>
      </button>

      <!-- Tab 2: Cycle -->
      <button @click="switchTab('cycle')" 
              class="flex flex-col items-center justify-center py-1 transition-all"
              :class="[store.activeTab === 'cycle' ? 'text-amber-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300']">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="text-[10px] mt-1">分化循环</span>
      </button>

      <!-- Tab 3: Calendar -->
      <button @click="switchTab('calendar')" 
              class="flex flex-col items-center justify-center py-1 transition-all"
              :class="[store.activeTab === 'calendar' ? 'text-amber-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300']">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-[10px] mt-1">训练日历</span>
      </button>

      <!-- Tab 4: Exercises -->
      <button @click="switchTab('exercises')" 
              class="flex flex-col items-center justify-center py-1 transition-all"
              :class="[store.activeTab === 'exercises' ? 'text-amber-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300']">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text-[10px] mt-1">动作库</span>
      </button>

      <!-- Tab 5: Stats & Settings -->
      <button @click="switchTab('stats')" 
              class="flex flex-col items-center justify-center py-1 transition-all"
              :class="[store.activeTab === 'stats' ? 'text-amber-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300']">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="text-[10px] mt-1">统计设置</span>
      </button>

    </div>
  </nav>
</template>

<script setup>
import { store } from "../store/fitnessStore.js";
import { triggerHaptic } from "../utils/vibrate.js";

function switchTab(tabName) {
  store.activeTab = tabName;
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}
</script>
