<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">

    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>分化循环编排</span>
        </h2>
        <p class="text-xs text-zinc-400 mt-0.5">
          周期轮转架构、单日负荷定位与分化排期
        </p>
      </div>
      <button @click="showCycleEditor = true" 
              class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        <span>编辑分化</span>
      </button>
    </div>

    <!-- Deload Shield Active Status Banner in CycleView -->
    <div v-if="isDeloadActive" 
         class="p-3.5 rounded-3xl bg-gradient-to-r from-sky-950/90 to-zinc-950 border border-sky-500/50 shadow-lg shadow-sky-950/30 flex items-center justify-between gap-3 text-left">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-lg flex-shrink-0 animate-pulse">
          🛡️
        </div>
        <div class="min-w-0">
          <div class="text-xs font-black text-white flex items-center gap-1.5">
            <span>战术减载免战期生效中</span>
            <span class="text-[10px] text-sky-400 font-mono font-bold">剩余 {{ shieldDaysRemaining }} 天</span>
          </div>
          <p class="text-[10px] text-zinc-400 truncate mt-0.5">
            分化循环已进入休整保护模式，战力分 100% 冻结免扣
          </p>
        </div>
      </div>
      <button @click="toggleDeloadShield(false)" 
              class="px-2.5 py-1 bg-sky-900/80 hover:bg-sky-800 text-sky-200 text-xs font-bold rounded-xl border border-sky-600/50 flex-shrink-0 active:scale-95 transition-all">
        提前归队
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
import { ref, computed } from "vue";
import { store, getExerciseDetails, getFullHonorProfile, toggleDeloadShield } from "../store/fitnessStore.js";
import { SCIENCE_PRINCIPLES } from "../data/defaultPlans.js";
import CycleEditorModal from "../components/CycleEditorModal.vue";
import PlanEditorModal from "../components/PlanEditorModal.vue";
import ExerciseDetailModal from "../components/ExerciseDetailModal.vue";

const showCycleEditor = ref(false);
const showPlanEditor = ref(false);
const selectedPlanToEdit = ref(null);

const showExerciseDetailModal = ref(false);
const selectedExerciseDetail = ref(null);

const honorData = computed(() => getFullHonorProfile());
const isDeloadActive = computed(() => honorData.value.isDeloadActive);
const shieldDaysRemaining = computed(() => honorData.value.shieldDaysRemaining);

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
