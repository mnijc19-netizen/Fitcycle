<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden touch-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 16px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 16px);"
         @click.self="$emit('close')">
      
      <!-- Modal Container: Fixed Max Height, Flex Col to ensure Header & Footer are always pinned and visible -->
      <div class="relative w-full max-w-lg max-h-[88vh] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 transition-all overflow-x-hidden"
           style="touch-action: pan-y; max-width: min(480px, calc(100vw - 24px)); box-sizing: border-box;"
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
                按生理指标与体能感知自适应测算，免记具体公斤数
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

        <!-- Scrollable Fluid Body Container -->
        <div class="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 no-scrollbar">
          
          <!-- SECTION 1: 生理特征与临床代谢基线 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black flex items-center gap-1.5"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">
                <span>🧬</span>
                <span>生理指标与代谢基准</span>
              </span>
              <span class="text-[10px]"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                影响相对力量系数与打卡能耗
              </span>
            </div>

            <!-- Gender Buttons -->
            <div class="grid grid-cols-2 gap-2">
              <button type="button" @click="form.gender = 'male'"
                      class="p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer"
                      :class="form.gender === 'male'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-500 shadow-sm ring-1 ring-amber-500/40'
                        : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400')">
                <span class="text-sm">♂</span>
                <span>男性 (Male)</span>
              </button>
              <button type="button" @click="form.gender = 'female'"
                      class="p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer"
                      :class="form.gender === 'female'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-500 shadow-sm ring-1 ring-amber-500/40'
                        : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400')">
                <span class="text-sm">♀</span>
                <span>女性 (Female)</span>
              </button>
            </div>

            <!-- Height, Weight, Age Row -->
            <div class="grid grid-cols-3 gap-2">
              <!-- Height -->
              <div class="p-2 rounded-xl border text-center"
                   :class="store.settings.themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'">
                <span class="text-[9px] block"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">身高 (cm)</span>
                <div class="flex items-center justify-center gap-1 mt-0.5">
                  <button type="button" @click="form.userHeight = Math.max(130, form.userHeight - 1)"
                          class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer"
                          :class="store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300'">−</button>
                  <span class="font-mono font-black text-xs"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">{{ form.userHeight }}</span>
                  <button type="button" @click="form.userHeight = Math.min(230, form.userHeight + 1)"
                          class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer"
                          :class="store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300'">+</button>
                </div>
              </div>

              <!-- Weight -->
              <div class="p-2 rounded-xl border text-center ring-1 ring-amber-500/30"
                   :class="store.settings.themeMode === 'light' ? 'bg-amber-50/40 border-amber-300/80' : 'bg-amber-500/5 border-amber-500/40'">
                <span class="text-[9px] block font-bold text-amber-500">体重 (kg)</span>
                <div class="flex items-center justify-center gap-1 mt-0.5">
                  <button type="button" @click="form.userWeight = Math.max(35, Number((form.userWeight - 1).toFixed(1)))"
                          class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer"
                          :class="store.settings.themeMode === 'light' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-800 text-amber-300'">−</button>
                  <span class="font-mono font-black text-xs text-amber-400">{{ form.userWeight }}</span>
                  <button type="button" @click="form.userWeight = Math.min(200, Number((form.userWeight + 1).toFixed(1)))"
                          class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer"
                          :class="store.settings.themeMode === 'light' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-800 text-amber-300'">+</button>
                </div>
              </div>

              <!-- Age -->
              <div class="p-2 rounded-xl border text-center"
                   :class="store.settings.themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'">
                <span class="text-[9px] block"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">年龄 (岁)</span>
                <div class="flex items-center justify-center gap-1 mt-0.5">
                  <button type="button" @click="form.userAge = Math.max(16, form.userAge - 1)"
                          class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer"
                          :class="store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300'">−</button>
                  <span class="font-mono font-black text-xs"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">{{ form.userAge }}</span>
                  <button type="button" @click="form.userAge = Math.min(90, form.userAge + 1)"
                          class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer"
                          :class="store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300'">+</button>
                </div>
              </div>
            </div>

            <!-- Instant Metabolic & Nutrition Card -->
            <div class="p-3.5 rounded-2xl border space-y-2 shadow-sm"
                 :class="store.settings.themeMode === 'light'
                   ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-50 border-amber-500/30'
                   : 'bg-gradient-to-br from-amber-500/15 via-zinc-950 to-zinc-900 border-amber-500/40'">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="text-sm">🔥</span>
                  <span class="text-xs font-black"
                        :class="store.settings.themeMode === 'light' ? 'text-amber-950' : 'text-amber-300'">
                    个人代谢基线 (Mifflin-St Jeor)
                  </span>
                </div>
                <div class="flex items-center gap-1 text-[10px] font-mono">
                  <span :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">BMI {{ bmi }}</span>
                  <span class="px-1.5 py-0.2 rounded-full border text-[9px] font-bold"
                        :class="bmiCategory.badgeBg + ' ' + bmiCategory.color">{{ bmiCategory.label }}</span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-1.5 font-mono text-center pt-0.5">
                <div class="p-1.5 rounded-lg border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white/80 border-slate-200/80' : 'bg-zinc-950/80 border-zinc-800'">
                  <span class="text-[8px] block"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">基础代谢 (BMR)</span>
                  <span class="text-xs font-black text-amber-400">{{ bmr }} <span class="text-[8px] font-normal">kcal</span></span>
                </div>
                <div class="p-1.5 rounded-lg border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white/80 border-slate-200/80' : 'bg-zinc-950/80 border-zinc-800'">
                  <span class="text-[8px] block"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">每日总消耗(TDEE)</span>
                  <span class="text-xs font-black"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">{{ tdee }} <span class="text-[8px] font-normal">kcal</span></span>
                </div>
                <div class="p-1.5 rounded-lg border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white/80 border-slate-200/80' : 'bg-zinc-950/80 border-zinc-800'">
                  <span class="text-[8px] block"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">每日建议蛋白质</span>
                  <span class="text-xs font-black text-emerald-400">{{ macros.dailyProteinTargetGrams }} <span class="text-[8px] font-normal">g</span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 2: 体能直觉感知与经验 -->
          <div class="space-y-3 pt-1">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black flex items-center gap-1.5"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">
                <span>⚡</span>
                <span>体能直觉感知 (免记具体公斤数)</span>
              </span>
              <span class="text-[10px] text-amber-500">科学自适应推导 💡</span>
            </div>

            <!-- Intuitive Push Perception (Pushups) -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-bold block"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-300'">
                连续标准俯卧撑的大致数量 (推力基准)
              </span>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="p in pushupTiers" :key="p.id"
                     @click="form.pushupTier = p.id"
                     class="p-2 rounded-xl border cursor-pointer transition-all"
                     :class="form.pushupTier === p.id
                       ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                       : (store.settings.themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-zinc-900/80 border-zinc-800')">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black"
                          :class="form.pushupTier === p.id ? 'text-amber-400' : (store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200')">
                      {{ p.name }}
                    </span>
                    <span class="text-[9px] font-mono px-1.5 py-0.2 rounded border"
                          :class="form.pushupTier === p.id ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'">
                      {{ p.badge }}
                    </span>
                  </div>
                  <p class="text-[10px] mt-0.5 line-clamp-1"
                     :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                    {{ p.desc }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Intuitive Lower Body Perception (Squat) -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-bold block"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-300'">
                徒手深蹲或爬楼感受 (下肢与核心基准)
              </span>
              <div class="grid grid-cols-3 gap-2">
                <div v-for="s in squatTiers" :key="s.id"
                     @click="form.squatTier = s.id"
                     class="p-2 rounded-xl border cursor-pointer transition-all text-center"
                     :class="form.squatTier === s.id
                       ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                       : (store.settings.themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-zinc-900/80 border-zinc-800')">
                  <div class="text-sm">{{ s.icon }}</div>
                  <div class="text-[11px] font-bold mt-0.5"
                       :class="form.squatTier === s.id ? 'text-amber-400' : (store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200')">
                    {{ s.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Training Experience Level (Maintains backward compatibility labels: 新手入门 / 进阶中坚 / 资深老手) -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-bold block"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-300'">
                抗阻训练年限档位
              </span>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" v-for="lvl in experienceLevels" :key="lvl.id"
                        @click="form.experienceLevel = lvl.id"
                        class="p-2 rounded-xl border text-center transition-all cursor-pointer"
                        :class="form.experienceLevel === lvl.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-400 ring-1 ring-amber-500/40'
                          : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-zinc-900/70 border-zinc-800 text-zinc-400')">
                  <div class="text-xs font-black">{{ lvl.name }}</div>
                  <div class="text-[9px] text-zinc-500">{{ lvl.badge }}</div>
                </button>
              </div>
            </div>

          </div>

          <!-- SECTION 3: 自适应起步重量矩阵预览与直填展开 -->
          <div class="p-3.5 rounded-2xl border space-y-2.5"
               :class="store.settings.themeMode === 'light'
                 ? 'bg-amber-50/50 border-amber-200/80'
                 : 'bg-zinc-900/90 border-zinc-800'">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-amber-500">🎯</span>
                <span class="text-xs font-black"
                      :class="store.settings.themeMode === 'light' ? 'text-amber-950' : 'text-amber-300'">
                  测算全计划起步重量 (基于 {{ form.userWeight }}kg)
                </span>
              </div>
              <button type="button" @click="showCustomMode = !showCustomMode"
                      class="text-[10px] text-amber-500 hover:text-amber-400 underline cursor-pointer">
                {{ showCustomMode ? '‹ 切回自适应推算' : '🛠️ 自定义我常做的核心重量' }}
              </button>
            </div>

            <!-- Standard Adaptive 3-Columns Preview -->
            <div v-if="!showCustomMode" class="grid grid-cols-3 gap-2 text-center font-mono">
              <div class="p-2 rounded-xl border"
                   :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'">
                <span class="text-[9px] block"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">上斜卧推起步</span>
                <span class="text-xs font-bold text-amber-400">{{ adaptiveWeights.weightsMap['上斜哑铃卧推'] }} kg/只</span>
                <span class="text-[8px] block text-zinc-500">双哑铃</span>
              </div>
              <div class="p-2 rounded-xl border"
                   :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'">
                <span class="text-[9px] block"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">哈克深蹲起步</span>
                <span class="text-xs font-bold text-amber-400">{{ adaptiveWeights.weightsMap['哈克深蹲 / 倒蹬腿举'] }} kg</span>
                <span class="text-[8px] block text-zinc-500">腿部负重</span>
              </div>
              <div class="p-2 rounded-xl border"
                   :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800'">
                <span class="text-[9px] block"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'">高位下拉起步</span>
                <span class="text-xs font-bold text-amber-400">{{ adaptiveWeights.weightsMap['对握/宽握高位下拉'] }} kg</span>
                <span class="text-[8px] block text-zinc-500">背部插销</span>
              </div>
            </div>

            <!-- Hardcore Direct Kg Inputs -->
            <div v-else class="grid grid-cols-3 gap-2 pt-1">
              <div>
                <span class="text-[9px] block mb-1"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">日常卧推 (kg)</span>
                <input v-model.number="customBases.bench" type="number" step="2.5" 
                       class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none"
                       :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500' : 'bg-zinc-950 border-zinc-700 text-white focus:border-amber-500'" />
              </div>
              <div>
                <span class="text-[9px] block mb-1"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">日常深蹲 (kg)</span>
                <input v-model.number="customBases.squat" type="number" step="5" 
                       class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none"
                       :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500' : 'bg-zinc-950 border-zinc-700 text-white focus:border-amber-500'" />
              </div>
              <div>
                <span class="text-[9px] block mb-1"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">日常下拉 (kg)</span>
                <input v-model.number="customBases.pull" type="number" step="2.5" 
                       class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none"
                       :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500' : 'bg-zinc-950 border-zinc-700 text-white focus:border-amber-500'" />
              </div>
            </div>

            <p class="text-[10px] leading-tight"
               :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
              💡 确认后将自动更新推拉腿全套计划中 9 大动作的初始组重，免除日常开练空杆反复加减的折磨。
            </p>
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
          <button @click="applyPlacement" 
                  class="flex-1 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer text-center select-none">
            确认并应用全计划起步重量
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted } from "vue";
import { store, saveUserProfileAndRecalibrate } from "../store/fitnessStore.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { 
  calculateBMI, 
  getBMICategory, 
  calculateBMR, 
  calculateTDEE, 
  calculateMacroTargets, 
  calculateAdaptiveWeights 
} from "../engine/bodyProfileEngine.js";

const props = defineProps({
  visible: { type: Boolean, default: false }
});

const emit = defineEmits(["close", "applied"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const showCustomMode = ref(false);

const form = reactive({
  gender: store.settings.gender || "male",
  userAge: store.settings.userAge || 25,
  userHeight: store.settings.userHeight || 175,
  userWeight: store.settings.userWeight || 70,
  trainingGoal: store.settings.trainingGoal || "hypertrophy",
  pushupTier: store.settings.pushupTier || "basic",
  squatTier: store.settings.squatTier || "natural",
  experienceLevel: store.settings.strengthLevel === "custom" ? "intermediate" : (store.settings.strengthLevel || "intermediate")
});

const customBases = reactive({
  bench: store.settings.customBaseWeights?.bench || 50,
  squat: store.settings.customBaseWeights?.squat || 70,
  pull: store.settings.customBaseWeights?.pull || 45
});

// Realtime Metabolic Computeds
const bmi = computed(() => calculateBMI(form.userWeight, form.userHeight));
const bmiCategory = computed(() => getBMICategory(bmi.value));
const bmr = computed(() => calculateBMR(form.gender, form.userWeight, form.userHeight, form.userAge));
const tdee = computed(() => calculateTDEE(bmr.value, "moderate"));
const macros = computed(() => calculateMacroTargets(form.userWeight, form.trainingGoal));

// Realtime Adaptive Weights Computed
const adaptiveWeights = computed(() => {
  return calculateAdaptiveWeights({
    gender: form.gender,
    weightKg: form.userWeight,
    pushupTier: form.pushupTier,
    squatTier: form.squatTier,
    experienceLevel: form.experienceLevel
  });
});

// Update custom bases when adaptive weights update if not manually touched
watch(adaptiveWeights, (newVal) => {
  if (!showCustomMode.value && newVal && newVal.estimatedBases) {
    customBases.bench = newVal.estimatedBases.bench;
    customBases.squat = newVal.estimatedBases.squat;
    customBases.pull = newVal.estimatedBases.pull;
  }
}, { immediate: true });

const pushupTiers = [
  { id: "beginner", name: "刚起步", badge: "<5个", desc: "神经募集期，规范轨迹" },
  { id: "basic", name: "基础体能", badge: "5~15个", desc: "常运动，具推力储备" },
  { id: "moderate", name: "规律训练", badge: "15~30个", desc: "胸肩手臂发力稳健" },
  { id: "elite", name: "高阶强者", badge: ">30个", desc: "大负荷抗阻老铁" }
];

const squatTiers = [
  { id: "sedentary", icon: "🛋️", name: "久坐偏少", desc: "多蹲几次腿酸" },
  { id: "natural", icon: "🚶", name: "体态自如", desc: "连蹲30次无压力" },
  { id: "strong", icon: "🏃", name: "强韧有力", desc: "经常腿训或大球类" }
];

const experienceLevels = [
  { id: "beginner", name: "新手入门", badge: "0~3个月" },
  { id: "intermediate", name: "进阶中坚", badge: "3~12个月" },
  { id: "advanced", name: "资深老手", badge: "1年以上" }
];

function applyPlacement() {
  saveUserProfileAndRecalibrate({
    gender: form.gender,
    userAge: form.userAge,
    userHeight: form.userHeight,
    userWeight: form.userWeight,
    trainingGoal: form.trainingGoal,
    pushupTier: form.pushupTier,
    squatTier: form.squatTier,
    strengthLevel: showCustomMode.value ? "custom" : form.experienceLevel,
    useCustom: showCustomMode.value,
    customBases: showCustomMode.value ? customBases : null
  });

  emit("applied", showCustomMode.value ? "custom" : form.experienceLevel);
  emit("close");
}
</script>
