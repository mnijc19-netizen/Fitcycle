<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <div class="bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        <!-- Header -->
        <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-black text-zinc-100">自定义训练分化循环</h3>
              <p class="text-[10px] text-zinc-400 font-mono">自定义属于你的训练分化轮转天数与计划</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

      <!-- Body Content -->
      <div class="overflow-y-auto flex-1 p-4 space-y-5">
        
        <!-- Preset Quick Picks -->
        <div>
          <label class="text-xs font-bold text-zinc-400 tracking-wider uppercase">快速应用经典模板</label>
          <div class="grid grid-cols-3 gap-2 mt-2">
            <button v-for="preset in PRESET_CYCLES" :key="preset.id"
                    @click="applyPreset(preset)"
                    class="p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between"
                    :class="[editCycle.id === preset.id ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700']">
              <span class="font-bold truncate">{{ preset.name.split(' ')[0] }}</span>
              <span class="text-[10px] text-zinc-500 mt-1">{{ preset.days.length }}天一轮</span>
            </button>
          </div>
        </div>

        <!-- Cycle Name & Days Setup -->
        <div>
          <label class="text-xs font-bold text-zinc-400 tracking-wider uppercase">循环名称</label>
          <input v-model="editCycle.name" type="text" 
                 class="w-full mt-1.5 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white" />
        </div>

        <!-- Days Sequence -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-zinc-400 tracking-wider uppercase">
              分化轮转顺序 (共 {{ editCycle.days.length }} 天)
            </label>
            <button @click="addDay" class="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
              ➕ 添加一天
            </button>
          </div>

          <div class="space-y-2">
            <div v-for="(day, idx) in editCycle.days" :key="day.id || idx"
                 class="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex items-center justify-between gap-2.5">
              
              <!-- Left badge & index -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-mono font-bold flex items-center justify-center">
                  {{ idx + 1 }}
                </span>
                <span class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow"
                      :class="[
                        day.color === 'amber' ? 'bg-amber-500 text-zinc-950' : 
                        day.color === 'sky' ? 'bg-sky-500 text-zinc-950' : 
                        day.color === 'purple' ? 'bg-purple-500 text-white' : 
                        'bg-emerald-500 text-zinc-950'
                      ]">
                  {{ day.shortName || (day.isRest ? '休' : '练') }}
                </span>
              </div>

              <!-- Center: Plan selector -->
              <div class="flex-1 min-w-0">
                <select v-model="day.planId" @change="onDayPlanChange(day)"
                        class="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs rounded-xl px-2.5 py-2 font-medium">
                  <option v-for="plan in store.plans" :key="plan.id" :value="plan.id">
                    {{ plan.name }}
                  </option>
                </select>
              </div>

              <!-- Right: Move and Delete -->
              <div class="flex items-center gap-1 flex-shrink-0">
                <button v-if="idx > 0" @click="moveDay(idx, -1)" class="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs">
                  ↑
                </button>
                <button v-if="idx < editCycle.days.length - 1" @click="moveDay(idx, 1)" class="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs">
                  ↓
                </button>
                <button v-if="editCycle.days.length > 1" @click="removeDay(idx)" class="p-1.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg text-xs">
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Cycle Alignment (Anchor) -->
        <div class="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5">
          <div class="text-xs font-bold text-zinc-200">今天设为循环的第几天？</div>
          <p class="text-[11px] text-zinc-400 mt-0.5">
            点击下方按钮可立即将今天锚定为指定的训练日，系统将自动推导未来每天的计划：
          </p>
          <div class="grid grid-cols-4 gap-2 mt-2.5">
            <button v-for="(day, idx) in editCycle.days" :key="idx"
                    @click="setAnchorIndex(idx)"
                    class="py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all"
                    :class="[currentCycleIndex === idx ? 'bg-amber-500 text-zinc-950 border-amber-500 ring-2 ring-amber-500/30' : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800']">
              第 {{ idx + 1 }} 天<br/>
              <span class="text-[10px] opacity-80 font-normal">{{ day.shortName }}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
        <button @click="$emit('close')" class="w-1/3 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-xs">
          取消
        </button>
        <button @click="saveCycle" class="w-2/3 py-3 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 active:scale-98">
          保存分化设置
        </button>
      </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { store, saveCustomCycle, setTodayAsCycleIndex, getCycleDayForDate, uid } from "../store/fitnessStore.js";
import { PRESET_CYCLES } from "../data/defaultPlans.js";

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(["close"]);

const editCycle = ref(JSON.parse(JSON.stringify(store.activeCycle)));

watch(() => props.visible, (val) => {
  if (val) {
    editCycle.value = JSON.parse(JSON.stringify(store.activeCycle));
  }
});

const currentCycleIndex = computed(() => {
  const cd = getCycleDayForDate();
  return cd.cycleIndex;
});

function applyPreset(preset) {
  editCycle.value = JSON.parse(JSON.stringify(preset));
}

function onDayPlanChange(day) {
  const plan = store.plans.find(p => p.id === day.planId);
  if (plan) {
    day.name = plan.name;
    day.shortName = plan.shortName;
    day.color = plan.color;
    day.isRest = plan.isRest;
  }
}

function addDay() {
  const defaultPlan = store.plans[0];
  editCycle.value.days.push({
    id: uid("cd"),
    name: defaultPlan.name,
    shortName: defaultPlan.shortName,
    planId: defaultPlan.id,
    color: defaultPlan.color,
    isRest: defaultPlan.isRest
  });
}

function removeDay(idx) {
  if (editCycle.value.days.length <= 1) return;
  editCycle.value.days.splice(idx, 1);
}

function moveDay(idx, delta) {
  const newIdx = idx + delta;
  if (newIdx < 0 || newIdx >= editCycle.value.days.length) return;
  const item = editCycle.value.days.splice(idx, 1)[0];
  editCycle.value.days.splice(newIdx, 0, item);
}

function setAnchorIndex(idx) {
  setTodayAsCycleIndex(idx);
}

function saveCycle() {
  saveCustomCycle(editCycle.value);
  emit("close");
}
</script>
