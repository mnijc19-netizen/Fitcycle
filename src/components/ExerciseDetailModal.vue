<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
    <div class="bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
      
      <!-- Header -->
      <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-base">
            🏋️
          </span>
          <div>
            <h3 class="text-base font-bold text-zinc-100">{{ exercise?.name }}</h3>
            <span class="text-xs text-amber-400 font-medium">{{ exercise?.category }} · {{ exercise?.target }}</span>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content Body -->
      <div class="overflow-y-auto flex-1 p-4 space-y-4">
        
        <!-- Science & Aesthetic details -->
        <div class="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
          <div class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <span>🔬</span> 动作美学目的与科学细节
          </div>
          <p class="text-xs text-zinc-200 leading-relaxed">
            {{ exercise?.scienceDetail || "暂无动作细节说明，可在动作库中编辑添加。" }}
          </p>
          <div v-if="exercise?.tags && exercise?.tags.length" class="flex flex-wrap gap-1.5 pt-1">
            <span v-for="tag in exercise.tags" :key="tag" 
                  class="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- History Records for this exercise -->
        <div class="space-y-2">
          <div class="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>📈 历史训练记录</span>
            <span class="text-[10px] text-zinc-500">最近 {{ exerciseHistory.length }} 次</span>
          </div>

          <div v-if="exerciseHistory.length" class="space-y-2">
            <div v-for="(hist, idx) in exerciseHistory" :key="idx"
                 class="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
              <div class="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
                <span class="text-zinc-300 font-semibold">{{ hist.date }}</span>
                <span>{{ hist.planName }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(s, sIdx) in hist.sets" :key="sIdx"
                      class="px-2 py-1 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono font-medium text-emerald-400">
                  {{ s.weight }}kg × {{ s.reps }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="p-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            暂无历史打卡记录，完成训练后将自动汇总在此
          </div>
        </div>

      </div>

      <!-- Close Button -->
      <div class="p-3 bg-zinc-950 border-t border-zinc-800">
        <button @click="$emit('close')" class="w-full py-3 bg-zinc-800 text-zinc-200 font-bold rounded-xl text-xs">
          关闭
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store/fitnessStore.js";

const props = defineProps({
  visible: Boolean,
  exercise: Object
});

defineEmits(["close"]);

const exerciseHistory = computed(() => {
  if (!props.exercise?.name) return [];
  const history = [];
  const logs = [...store.workoutLogs].sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  
  for (const log of logs) {
    if (log.exercises) {
      const match = log.exercises.find(e => e.name === props.exercise.name || e.exerciseId === props.exercise.id);
      if (match && match.sets && match.sets.length > 0) {
        history.push({
          date: log.date,
          planName: log.shortName || log.planName,
          sets: match.sets.filter(s => s.completed)
        });
      }
    }
  }
  return history.slice(0, 5); // show last 5
});
</script>
