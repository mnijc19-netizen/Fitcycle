<template>
  <header class="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3 safe-area-top">
    <div class="max-w-md mx-auto flex items-center justify-between">
      
      <!-- Brand & Status -->
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/40 flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
          <img :src="logoUrl" alt="包皮健身 Logo" class="w-full h-full object-cover" />
        </div>

        <div>
          <div class="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
            包皮健身
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-normal border border-amber-500/30">
              PRO
            </span>
          </div>
          <div class="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
            <span>{{ todayFormatted }}</span>
            <span>·</span>
            <span class="text-amber-400 font-bold">{{ todayCycleDay.name }}</span>
          </div>
        </div>
      </div>


      <!-- Quick Action / Status indicator -->
      <div class="flex items-center gap-2">
        <button v-if="store.activeWorkout" 
                @click="store.activeTab = 'today'"
                class="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          训练进行中
        </button>

        <button v-else 
                @click="showCycleModal = true"
                class="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 rounded-full text-xs font-medium flex items-center gap-1">
          <span>🔄 分化</span>
        </button>
      </div>

    </div>

    <!-- Cycle Editor Modal -->
    <CycleEditorModal :visible="showCycleModal" @close="showCycleModal = false" />
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, getCycleDayForDate } from "../store/fitnessStore.js";
import CycleEditorModal from "./CycleEditorModal.vue";
import logoUrl from "../assets/logo.png";


const showCycleModal = ref(false);

const todayCycleDay = computed(() => {
  return getCycleDayForDate();
});

const todayFormatted = computed(() => {
  const d = new Date();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
});
</script>
