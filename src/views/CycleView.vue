<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-black flex items-center gap-2" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
          <span>分化与周期</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                :class="store.settings.themeMode === 'light' ? 'bg-amber-500/25 text-amber-800 border border-amber-600/40 font-black' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'">
            {{ store.activeCycle.days.length }}天轮转
          </span>
        </h2>
        <p class="text-xs mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
          科学轮转架构、单日做工定位与分化排期
        </p>
      </div>
      <button @click="showCycleEditor = true" 
              class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        <span>编辑分化</span>
      </button>
    </div>

    <!-- Deload Shield Active Status Banner in CycleView -->
    <div v-if="isDeloadActive" 
         class="p-3.5 rounded-3xl border shadow-lg flex items-center justify-between gap-3 text-left"
         :class="store.settings.themeMode === 'light' ? 'bg-sky-50 border-sky-300 shadow-sky-100/50 text-slate-900' : 'bg-gradient-to-r from-sky-950/90 to-zinc-950 border-sky-500/50 shadow-sky-950/30 text-white'">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-lg flex-shrink-0 animate-pulse">
          🛡️
        </div>
        <div class="min-w-0">
          <div class="text-xs font-black flex items-center gap-1.5"
               :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
            <span>战术减载免战期生效中</span>
            <span class="text-[10px] font-mono font-bold"
                  :class="store.settings.themeMode === 'light' ? 'text-sky-700' : 'text-sky-400'">剩余 {{ shieldDaysRemaining }} 天</span>
          </div>
          <p class="text-[10px] truncate mt-0.5"
             :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
            分化循环已进入休整保护模式，战力分 100% 冻结免扣
          </p>
        </div>
      </div>
      <button @click="toggleDeloadShield(false)" 
              class="px-2.5 py-1 text-xs font-bold rounded-xl border flex-shrink-0 active:scale-95 transition-all cursor-pointer"
              :class="store.settings.themeMode === 'light' ? 'bg-sky-600 hover:bg-sky-700 text-white border-sky-600 shadow-sm' : 'bg-sky-900/80 hover:bg-sky-800 text-sky-200 border-sky-600/50'">
        提前归队
      </button>
    </div>

    <!-- Modern Apple-Style Interactive Cycle Track -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold tracking-wide" :class="store.settings.themeMode === 'light' ? 'text-amber-800' : 'text-amber-400'">当前执行架构</span>
          <h3 class="text-base font-black" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">{{ store.activeCycle.name }}</h3>
        </div>
        <span class="px-2.5 py-1 border rounded-full text-xs font-mono font-semibold"
              :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-300'">
          每 {{ store.activeCycle.days.length }} 天一轮
        </span>
      </div>

      <!-- Segmented Train Track -->
      <div class="grid grid-cols-4 gap-1.5 pt-1">
        <button v-for="(day, idx) in store.activeCycle.days" :key="day.id || idx"
                @click="selectedPreviewDayIdx = idx"
                class="p-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1 relative"
                :class="[
                  selectedPreviewDayIdx === idx ? 
                  'bg-zinc-800 border-amber-500/80 shadow-md ring-1 ring-amber-400/40' : 
                  (store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 shadow-xs' : 'bg-zinc-950/70 border-zinc-800 hover:bg-zinc-850')
                ]">
          <!-- Day badge -->
          <span class="text-[10px] font-mono" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-bold' : 'text-zinc-400'">Day {{ idx + 1 }}</span>
          
          <span class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black my-0.5"
                :class="[
                  day.color === 'amber' ? 'bg-amber-500 text-zinc-950' :
                  day.color === 'sky' ? 'bg-sky-500 text-zinc-950' :
                  day.color === 'purple' ? 'bg-purple-500 text-white' :
                  'bg-emerald-500 text-zinc-950'
                ]">
            {{ day.shortName || (day.isRest ? '休' : '练') }}
          </span>

          <span class="text-[11px] font-bold truncate w-full" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">
            {{ day.name.split(' ')[0] }}
          </span>

          <!-- Active dot indicator -->
          <span v-if="selectedPreviewDayIdx === idx" class="w-1.5 h-1.5 rounded-full bg-amber-400 -mb-0.5"></span>
        </button>
      </div>

      <!-- Selected Day Detail Inset Preview Card -->
      <div v-if="selectedPreviewDay" 
           class="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-2 text-left animate-in fade-in duration-150">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">Day {{ selectedPreviewDayIdx + 1 }}: {{ selectedPreviewDay.name }}</span>
            <span class="text-[10px] font-mono" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-bold' : 'text-zinc-400'">
              ({{ getPlanExerciseCount(selectedPreviewDay.planId) }})
            </span>
          </div>
          <button @click="openPlanDetails(selectedPreviewDay.planId)" 
                  class="text-xs font-bold cursor-pointer transition-colors"
                  :class="store.settings.themeMode === 'light' ? 'text-amber-800 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'">
            编辑动作 ❯
          </button>
        </div>

        <!-- Exercises pills of this day -->
        <div v-if="selectedPreviewPlan && selectedPreviewPlan.exercises?.length" class="flex flex-wrap gap-1.5 pt-0.5">
          <span v-for="(ex, exIdx) in selectedPreviewPlan.exercises" :key="exIdx"
                @click="openExerciseDetailByName(ex.name)"
                class="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 cursor-pointer transition-colors">
            {{ ex.name }} <span class="text-zinc-500 font-mono text-[10px]">({{ ex.setsCount }}组)</span>
          </span>
        </div>
        <div v-else class="text-xs text-zinc-500 py-1">
          当天为完全休息与超量恢复日（无动作负荷）
        </div>
      </div>
    </div>

    <!-- Workout Plans Library / Templates Inset Group -->
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <span class="text-xs font-bold uppercase tracking-wider" :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-bold' : 'text-zinc-400'">训练计划模板库 ({{ store.plans.length }})</span>
        <button @click="openCreatePlan" class="text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors" :class="store.settings.themeMode === 'light' ? 'text-amber-800 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'">
          ➕ 新建计划
        </button>
      </div>

      <div class="space-y-2">
        <div v-for="plan in store.plans" :key="plan.id"
             class="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-2 transition-all hover:border-zinc-700">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full"
                    :class="[
                      plan.color === 'amber' ? 'bg-amber-400' :
                      plan.color === 'sky' ? 'bg-sky-400' :
                      plan.color === 'purple' ? 'bg-purple-400' :
                      'bg-emerald-400'
                    ]"></span>
              <h4 class="font-bold text-xs" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">{{ plan.name }}</h4>
            </div>
            <button @click="editPlan(plan)" 
                    class="p-1 px-2 text-xs rounded-lg transition-colors cursor-pointer"
                    :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold shadow-xs' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'">
              ✏️ 编辑
            </button>
          </div>

          <p v-if="plan.coreTarget" class="text-[11px]" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-400'">
            🎯 {{ plan.coreTarget }}
          </p>

          <!-- Exercise tag badges in this plan -->
          <div v-if="plan.exercises && plan.exercises.length" class="flex flex-wrap gap-1 pt-0.5">
            <span v-for="(ex, exIdx) in plan.exercises" :key="exIdx"
                  @click="openExerciseDetailByName(ex.name)"
                  class="px-2 py-0.5 rounded-lg text-[10px] cursor-pointer transition-colors"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border border-slate-300 text-slate-800 font-medium hover:border-amber-500/50' : 'bg-zinc-950 border border-zinc-800/90 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40'">
              {{ ex.name }} <span class="font-mono text-[10px]" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-500'">({{ ex.setsCount }}组)</span>
            </span>
          </div>
          <div v-else class="text-[11px]" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-500'">
            休息与超量恢复计划
          </div>

        </div>
      </div>
    </div>

    <!-- Science Principles Card (Clean Collapsible Accordion) -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-3.5 space-y-2">
      <button @click="showScienceCard = !showScienceCard" 
              class="w-full flex items-center justify-between text-xs font-bold text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer">
        <span class="flex items-center gap-1.5">
          <span>💡</span> 科学高效分化设计原理
        </span>
        <span class="text-xs text-zinc-500 font-mono">{{ showScienceCard ? '收起 ▴' : '展开 ▾' }}</span>
      </button>

      <div v-if="showScienceCard" class="space-y-2 text-xs pt-1 border-t border-zinc-800/80 animate-in fade-in duration-150">
        <div v-for="(sp, idx) in SCIENCE_PRINCIPLES" :key="idx"
             class="p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-1">
          <div class="font-bold text-zinc-100 flex items-center gap-1.5">
            <span class="text-amber-400 font-mono font-black">{{ idx + 1 }}.</span>
            <span>{{ sp.title }}</span>
          </div>
          <p class="text-[11px] text-zinc-400 leading-relaxed pl-3.5">
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
const selectedPreviewDayIdx = ref(0);
const showScienceCard = ref(false);

const honorData = computed(() => getFullHonorProfile());
const isDeloadActive = computed(() => honorData.value.isDeloadActive);
const shieldDaysRemaining = computed(() => honorData.value.shieldDaysRemaining);

const selectedPreviewDay = computed(() => {
  return store.activeCycle.days[selectedPreviewDayIdx.value] || store.activeCycle.days[0];
});

const selectedPreviewPlan = computed(() => {
  if (!selectedPreviewDay.value) return null;
  return store.plans.find(p => p.id === selectedPreviewDay.value.planId);
});

function getPlanExerciseCount(planId) {
  const p = store.plans.find(x => x.id === planId);
  if (!p) return "未关联";
  if (p.isRest) return "完全休息 / 修复神经系统";
  return `${p.exercises?.length || 0} 个精编动作`;
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
