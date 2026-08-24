<template>
  <div class="pb-24 px-4 pt-2 max-w-md mx-auto space-y-4">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black text-white flex items-center gap-2">
          <span>🔄</span> 分化循环设计
        </h2>
        <p class="text-xs text-zinc-400">
          自定义训练轮转周期与每日动作安排
        </p>
      </div>
      <button @click="showCycleEditor = true" 
              class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20">
        ⚙️ 自定义循环
      </button>
    </div>

    <!-- Active Cycle Overview Card -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs text-amber-400 font-bold tracking-wide">当前执行循环</span>
          <h3 class="text-base font-black text-white">{{ store.activeCycle.name }}</h3>
        </div>
        <span class="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-mono font-semibold">
          {{ store.activeCycle.days.length }} 天 / 轮
        </span>
      </div>

      <!-- Cycle visual chain -->
      <div class="space-y-2 pt-1">
        <div v-for="(day, idx) in store.activeCycle.days" :key="day.id || idx"
             class="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl flex items-center justify-between gap-3">
          
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black"
                  :class="[
                    day.color === 'amber' ? 'bg-amber-500 text-zinc-950' :
                    day.color === 'sky' ? 'bg-sky-500 text-zinc-950' :
                    day.color === 'purple' ? 'bg-purple-500 text-white' :
                    'bg-emerald-500 text-zinc-950'
                  ]">
              {{ day.shortName || (day.isRest ? '休' : '练') }}
            </span>
            <div>
              <div class="text-xs font-bold text-zinc-100">{{ day.name }}</div>
              <div class="text-[11px] text-zinc-400">
                {{ getPlanExerciseCount(day.planId) }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button @click="openPlanDetails(day.planId)" 
                    class="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg">
              查看动作
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Workout Plans Library / Templates -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">训练计划模板库</span>
        <button @click="openCreatePlan" class="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
          ➕ 新建计划
        </button>
      </div>

      <div class="space-y-2.5">
        <div v-for="plan in store.plans" :key="plan.id"
             class="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2.5">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full"
                    :class="[
                      plan.color === 'amber' ? 'bg-amber-400' :
                      plan.color === 'sky' ? 'bg-sky-400' :
                      plan.color === 'purple' ? 'bg-purple-400' :
                      'bg-emerald-400'
                    ]"></span>
              <h4 class="font-bold text-sm text-zinc-100">{{ plan.name }}</h4>
            </div>
            <div class="flex items-center gap-1">
              <button @click="editPlan(plan)" class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg">
                ✏️
              </button>
            </div>
          </div>

          <p v-if="plan.coreTarget" class="text-xs text-zinc-400">
            🎯 {{ plan.coreTarget }}
          </p>

          <!-- Exercise tag badges in this plan -->
          <div v-if="plan.exercises && plan.exercises.length" class="flex flex-wrap gap-1.5 pt-1">
            <span v-for="(ex, exIdx) in plan.exercises" :key="exIdx"
                  @click="openExerciseDetailByName(ex.name)"
                  class="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[11px] text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer transition-colors">
              {{ ex.name }} <span class="text-zinc-500 font-mono text-[10px]">({{ ex.setsCount }}组)</span>
            </span>
          </div>
          <div v-else class="text-xs text-zinc-500">
            休息与恢复计划（无动作）
          </div>

        </div>
      </div>
    </div>

    <!-- Science Principles Card (科学高效分化原理) -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 space-y-3">
      <div class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
        <span>💡</span> 这份新计划凭什么“最高效”？
      </div>

      <div class="space-y-2 text-xs">
        <div v-for="(sp, idx) in SCIENCE_PRINCIPLES" :key="idx"
             class="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
          <div class="font-bold text-zinc-100 flex items-center gap-1.5">
            <span class="text-amber-400 font-mono font-black">{{ idx + 1 }}.</span>
            <span>{{ sp.title }}</span>
          </div>
          <p class="text-zinc-400 leading-relaxed pl-4">
            {{ sp.desc }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CycleEditorModal :visible="showCycleEditor" @close="showCycleEditor = false" />
    
    <PlanEditorModal 
      :visible="showPlanEditor" 
      :plan="selectedPlanToEdit" 
      @close="showPlanEditor = false" 
    />

    <ExerciseDetailModal 
      :visible="showExerciseDetailModal" 
      :exercise="selectedExerciseDetail" 
      @close="showExerciseDetailModal = false" 
    />

  </div>
</template>

<script setup>
import { ref } from "vue";
import { store, getExerciseDetails } from "../store/fitnessStore.js";
import { SCIENCE_PRINCIPLES } from "../data/defaultPlans.js";
import CycleEditorModal from "../components/CycleEditorModal.vue";
import PlanEditorModal from "../components/PlanEditorModal.vue";
import ExerciseDetailModal from "../components/ExerciseDetailModal.vue";

const showCycleEditor = ref(false);
const showPlanEditor = ref(false);
const selectedPlanToEdit = ref(null);

const showExerciseDetailModal = ref(false);
const selectedExerciseDetail = ref(null);

function getPlanExerciseCount(planId) {
  const p = store.plans.find(x => x.id === planId);
  if (!p) return "未关联";
  if (p.isRest) return "完全休息 / 修复神经系统";
  return `${p.exercises?.length || 0} 个动作 · 针对拉伸区肥大`;
}

function openPlanDetails(planId) {
  const p = store.plans.find(x => x.id === planId);
  if (p) {
    editPlan(p);
  }
}

function editPlan(plan) {
  selectedPlanToEdit.value = plan;
  showPlanEditor.value = true;
}

function openCreatePlan() {
  selectedPlanToEdit.value = null;
  showPlanEditor.value = true;
}

function openExerciseDetailByName(name) {
  const full = getExerciseDetails(name) || { name, category: "训练动作", target: "主要刺激目标肌群" };
  selectedExerciseDetail.value = full;
  showExerciseDetailModal.value = true;
}
</script>
