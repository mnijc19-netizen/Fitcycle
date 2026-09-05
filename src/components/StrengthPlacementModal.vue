<template>
  <div v-if="visible" 
       class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
       @click.self="$emit('close')">
    
    <div class="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar"
         :style="{ transform: 'translateZ(0)' }">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center text-base font-bold">
            ⚡
          </div>
          <div>
            <h2 class="text-base font-black tracking-tight text-slate-900 dark:text-white">
              力量水平与初始重量定级
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-zinc-400">
              按您的实际肉体水平，一键自适应全计划起步重量
            </p>
          </div>
        </div>

        <button @click="$emit('close')" 
                class="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-400 dark:text-zinc-400 flex items-center justify-center text-xs cursor-pointer">
          ✕
        </button>
      </div>

      <!-- Level Cards Selection -->
      <div class="space-y-2.5">
        <div v-for="lvl in levels" :key="lvl.id"
             @click="selectedLevel = lvl.id"
             class="p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden"
             :class="[
               selectedLevel === lvl.id
                 ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                 : 'bg-slate-50 dark:bg-zinc-850/60 border-slate-200 dark:border-zinc-800 hover:border-slate-300'
             ]">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">{{ lvl.icon }}</span>
              <span class="text-sm font-black" :class="selectedLevel === lvl.id ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-zinc-100'">
                {{ lvl.name }}
              </span>
              <span class="text-[10px] font-mono px-1.5 py-0.2 rounded border"
                    :class="selectedLevel === lvl.id ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40' : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-300 dark:border-zinc-700'">
                {{ lvl.badge }}
              </span>
            </div>

            <!-- Radio Circle -->
            <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                 :class="selectedLevel === lvl.id ? 'border-amber-500 bg-amber-500' : 'border-slate-300 dark:border-zinc-700'">
              <div v-if="selectedLevel === lvl.id" class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>

          <p class="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
            {{ lvl.desc }}
          </p>

          <!-- Core Sample Weights Preview -->
          <div class="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[10px] font-mono text-center">
            <div class="p-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
              <div class="text-slate-400 dark:text-zinc-500 text-[9px]">卧推起步</div>
              <div class="font-bold text-slate-800 dark:text-zinc-200 mt-0.5">{{ lvl.bench }}</div>
            </div>
            <div class="p-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
              <div class="text-slate-400 dark:text-zinc-500 text-[9px]">深蹲起步</div>
              <div class="font-bold text-slate-800 dark:text-zinc-200 mt-0.5">{{ lvl.squat }}</div>
            </div>
            <div class="p-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800">
              <div class="text-slate-400 dark:text-zinc-500 text-[9px]">下拉/划船</div>
              <div class="font-bold text-slate-800 dark:text-zinc-200 mt-0.5">{{ lvl.pull }}</div>
            </div>
          </div>
        </div>

        <!-- Custom Base Weights Option -->
        <div @click="selectedLevel = 'custom'"
             class="p-3 rounded-2xl border transition-all cursor-pointer"
             :class="[
               selectedLevel === 'custom'
                 ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                 : 'bg-slate-50 dark:bg-zinc-850/60 border-slate-200 dark:border-zinc-800 hover:border-slate-300'
             ]">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span>🛠️</span>
              <span class="text-xs font-bold text-slate-900 dark:text-zinc-100">自定义我常做的核心重量</span>
            </div>
            <div class="w-4 h-4 rounded-full border flex items-center justify-center"
                 :class="selectedLevel === 'custom' ? 'border-amber-500 bg-amber-500' : 'border-slate-300 dark:border-zinc-700'">
              <div v-if="selectedLevel === 'custom'" class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>

          <div v-if="selectedLevel === 'custom'" class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/80 dark:border-zinc-800">
            <div>
              <span class="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">日常卧推 (kg)</span>
              <input v-model.number="customForm.bench" type="number" step="2.5" class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <span class="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">日常深蹲 (kg)</span>
              <input v-model.number="customForm.squat" type="number" step="5" class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-white" />
            </div>
            <div>
              <span class="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">日常下拉 (kg)</span>
              <input v-model.number="customForm.pull" type="number" step="2.5" class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border bg-white dark:bg-zinc-900 text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tip Callout -->
      <div class="p-3 bg-slate-100 dark:bg-zinc-800/60 rounded-xl text-[11px] text-slate-600 dark:text-zinc-400 leading-normal flex items-start gap-2">
        <span class="text-amber-500 flex-shrink-0 mt-0.5">💡</span>
        <span>确认后将自动更新推拉腿全套计划的默认起始重量。每次开练无需再手动从 20kg 空杆逐组删减添加。</span>
      </div>

      <!-- Action Buttons -->
      <div class="pt-1 flex items-center gap-2">
        <button @click="$emit('close')" 
                class="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 active:scale-95 transition-all cursor-pointer">
          取消
        </button>
        <button @click="applyLevel" 
                class="w-2/3 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer">
          确认并应用全计划起步重量
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { store, setStrengthLevelAndRecalibrate } from "../store/fitnessStore.js";

const props = defineProps({
  visible: { type: Boolean, default: false }
});

const emit = defineEmits(["close", "applied"]);

const selectedLevel = ref(store.settings.strengthLevel || "intermediate");

const customForm = reactive({
  bench: store.settings.customBaseWeights?.bench || 50,
  squat: store.settings.customBaseWeights?.squat || 70,
  pull: store.settings.customBaseWeights?.pull || 45
});

const levels = [
  {
    id: "beginner",
    icon: "🌱",
    name: "新手入门",
    badge: "0~3个月",
    desc: "刚开始健身或久未训练，注重动作规范与神经募集，初始重量轻巧安全",
    bench: "25 kg",
    squat: "35 kg",
    pull: "25 kg"
  },
  {
    id: "intermediate",
    icon: "⚡",
    name: "进阶中坚",
    badge: "3~12个月",
    desc: "有持续规律训练习惯，动作掌握稳定，力量处于快速生长期 (官方推荐)",
    bench: "50 kg",
    squat: "70 kg",
    pull: "45 kg"
  },
  {
    id: "advanced",
    icon: "🔥",
    name: "资深老手",
    badge: "1年以上",
    desc: "系统训练多年，大重量做工，免去从小白重量繁琐加片的折磨",
    bench: "80 kg",
    squat: "110 kg",
    pull: "70 kg"
  }
];

function applyLevel() {
  const bases = selectedLevel.value === "custom" ? customForm : null;
  setStrengthLevelAndRecalibrate(selectedLevel.value, bases);
  emit("applied", selectedLevel.value);
  emit("close");
}
</script>
