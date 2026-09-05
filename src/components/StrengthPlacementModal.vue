<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 16px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 16px);"
         @click.self="$emit('close')">
      
      <!-- Modal Container: Fixed Max Height, Flex Col to ensure Header & Footer are always pinned and visible -->
      <div class="relative w-full max-w-md max-h-[85vh] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 transition-all"
           :class="store.settings.themeMode === 'light'
             ? 'bg-white/98 border-slate-200 text-slate-900 shadow-slate-300/50'
             : 'bg-[#0C0F17]/98 border-zinc-800 text-white shadow-black/80'">
        
        <!-- Pinned Header -->
        <div class="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b"
             :class="store.settings.themeMode === 'light' ? 'border-slate-100 bg-white/60' : 'border-zinc-800/80 bg-zinc-900/40'">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold shadow-sm"
                 :class="store.settings.themeMode === 'light' ? 'bg-amber-500/15 text-amber-700' : 'bg-amber-500/20 text-amber-400'">
              ⚡
            </div>
            <div>
              <h2 class="text-base font-black tracking-tight"
                  :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
                力量水平与初始重量定级
              </h2>
              <p class="text-[11px] mt-0.5"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                按您的实际肉体水平，一键自适应全计划起步重量
              </p>
            </div>
          </div>

          <button @click="$emit('close')" 
                  title="关闭"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all active:scale-90 cursor-pointer"
                  :class="store.settings.themeMode === 'light' 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-500' 
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white'">
            ✕
          </button>
        </div>

        <!-- Scrollable Body Container -->
        <div class="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3 no-scrollbar">
          
          <!-- Level Cards Selection -->
          <div class="space-y-2.5">
            <div v-for="lvl in levels" :key="lvl.id"
                 @click="selectedLevel = lvl.id"
                 class="p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden"
                 :class="[
                   selectedLevel === lvl.id
                     ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                     : (store.settings.themeMode === 'light'
                         ? 'bg-slate-50/90 border-slate-200 hover:border-slate-300'
                         : 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700')
                 ]">
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ lvl.icon }}</span>
                  <span class="text-sm font-black"
                        :class="selectedLevel === lvl.id 
                          ? (store.settings.themeMode === 'light' ? 'text-amber-700' : 'text-amber-400')
                          : (store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100')">
                    {{ lvl.name }}
                  </span>
                  <span class="text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold"
                        :class="selectedLevel === lvl.id 
                          ? (store.settings.themeMode === 'light' ? 'bg-amber-500/20 text-amber-800 border-amber-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40')
                          : (store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-700 border-slate-300' : 'bg-zinc-800 text-zinc-300 border-zinc-700')">
                    {{ lvl.badge }}
                  </span>
                </div>

                <!-- Radio Circle Indicator -->
                <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                     :class="selectedLevel === lvl.id 
                       ? 'border-amber-500 bg-amber-500' 
                       : (store.settings.themeMode === 'light' ? 'border-slate-300' : 'border-zinc-700')">
                  <div v-if="selectedLevel === lvl.id" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>

              <p class="text-xs mt-1.5 leading-relaxed"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                {{ lvl.desc }}
              </p>

              <!-- Core Sample Weights Preview -->
              <div class="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t text-[10px] font-mono text-center"
                   :class="store.settings.themeMode === 'light' ? 'border-slate-200/60' : 'border-zinc-800/80'">
                <div class="p-1.5 rounded-lg border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white/90 border-slate-200/80' : 'bg-zinc-950/70 border-zinc-800'">
                  <div class="text-[9px]"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">卧推起步</div>
                  <div class="font-bold mt-0.5"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">{{ lvl.bench }}</div>
                </div>
                <div class="p-1.5 rounded-lg border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white/90 border-slate-200/80' : 'bg-zinc-950/70 border-zinc-800'">
                  <div class="text-[9px]"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">深蹲起步</div>
                  <div class="font-bold mt-0.5"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">{{ lvl.squat }}</div>
                </div>
                <div class="p-1.5 rounded-lg border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white/90 border-slate-200/80' : 'bg-zinc-950/70 border-zinc-800'">
                  <div class="text-[9px]"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">下拉/划船</div>
                  <div class="font-bold mt-0.5"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">{{ lvl.pull }}</div>
                </div>
              </div>
            </div>

            <!-- Custom Base Weights Option -->
            <div @click="selectedLevel = 'custom'"
                 class="p-3.5 rounded-2xl border transition-all cursor-pointer"
                 :class="[
                   selectedLevel === 'custom'
                     ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                     : (store.settings.themeMode === 'light'
                         ? 'bg-slate-50/90 border-slate-200 hover:border-slate-300'
                         : 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700')
                 ]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-base">🛠️</span>
                  <span class="text-xs font-bold"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
                    自定义我常做的核心重量
                  </span>
                </div>
                <div class="w-4 h-4 rounded-full border flex items-center justify-center"
                     :class="selectedLevel === 'custom' 
                       ? 'border-amber-500 bg-amber-500' 
                       : (store.settings.themeMode === 'light' ? 'border-slate-300' : 'border-zinc-700')">
                  <div v-if="selectedLevel === 'custom'" class="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
              </div>

              <div v-if="selectedLevel === 'custom'" class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t"
                   :class="store.settings.themeMode === 'light' ? 'border-slate-200/80' : 'border-zinc-800'">
                <div>
                  <span class="text-[10px] block mb-1"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">日常卧推 (kg)</span>
                  <input v-model.number="customForm.bench" type="number" step="2.5" 
                         class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none transition-colors"
                         :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500' : 'bg-zinc-950 border-zinc-700 text-white focus:border-amber-500'" />
                </div>
                <div>
                  <span class="text-[10px] block mb-1"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">日常深蹲 (kg)</span>
                  <input v-model.number="customForm.squat" type="number" step="5" 
                         class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none transition-colors"
                         :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500' : 'bg-zinc-950 border-zinc-700 text-white focus:border-amber-500'" />
                </div>
                <div>
                  <span class="text-[10px] block mb-1"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">日常下拉 (kg)</span>
                  <input v-model.number="customForm.pull" type="number" step="2.5" 
                         class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none transition-colors"
                         :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500' : 'bg-zinc-950 border-zinc-700 text-white focus:border-amber-500'" />
                </div>
              </div>
            </div>
          </div>

          <!-- Tip Callout -->
          <div class="p-3 rounded-xl text-[11px] leading-normal flex items-start gap-2 border"
               :class="store.settings.themeMode === 'light'
                 ? 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                 : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'">
            <span class="text-amber-500 flex-shrink-0 mt-0.5">💡</span>
            <span>确认后将自动更新推拉腿全套计划的默认起始重量。每次开练无需再手动从 20kg 空杆逐组删减添加。</span>
          </div>

        </div>

        <!-- Pinned Sticky Modal Footer with Action Buttons -->
        <div class="flex-shrink-0 p-4 sm:p-5 border-t flex items-center gap-2.5 relative z-10"
             :class="store.settings.themeMode === 'light' ? 'border-slate-100 bg-white/95' : 'border-zinc-800/80 bg-[#0C0F17]/95'">
          <button @click="$emit('close')" 
                  class="w-1/3 py-3 rounded-xl border text-xs font-bold active:scale-95 transition-all cursor-pointer text-center"
                  :class="store.settings.themeMode === 'light' 
                    ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700' 
                    : 'border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'">
            取消
          </button>
          <button @click="applyLevel" 
                  class="w-2/3 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer text-center select-none">
            确认并应用全计划起步重量
          </button>
        </div>

      </div>
    </div>
  </Teleport>
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
