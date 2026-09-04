<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

    <!-- Modal Card / Bottom Sheet -->
    <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
      
      <!-- Top Fixed Header Bar -->
      <div class="p-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            3D 动作指导
          </span>
          <span class="text-xs text-zinc-400">{{ exercise?.category }}</span>
        </div>

        <button @click="$emit('close')" 
                class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 flex items-center justify-center text-sm font-bold transition-all">
          ✕
        </button>
      </div>

      <!-- Single Smooth Touch-Scrollable Body -->
      <div class="overflow-y-auto flex-1 p-4 space-y-4 overscroll-contain" 
           style="-webkit-overflow-scrolling: touch; touch-action: pan-y;">
        
        <!-- 3D Muscle Diagram / Animation Display Box -->
        <div class="w-full h-60 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex items-center justify-center relative p-2 shadow-2xl">
          <img v-if="exercise?.gifUrl && !gifError" 
               :src="exercise.gifUrl" 
               :alt="exercise.name" 
               @error="gifError = true"
               class="w-full h-full object-contain mix-blend-screen transition-all" />
          
          <!-- Guaranteed 3D Muscle Diagram fallback -->
          <div v-show="!exercise?.gifUrl || gifError" class="w-full h-full flex items-center justify-center">
            <div v-html="muscleSvg" class="w-full h-full max-h-48 max-w-48 flex items-center justify-center"></div>
          </div>

          <!-- 3D Badges -->
          <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/40 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            3D 动作循环演示
          </span>
          <span class="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-zinc-300 border border-zinc-700/60">
            标准发力轨迹
          </span>
        </div>


        <!-- Title & Targets -->
        <div>
          <h2 class="text-xl font-black text-white tracking-tight">
            {{ exercise?.name }}
          </h2>
          <p v-if="exercise?.englishName" class="text-xs text-zinc-400 font-mono mt-0.5">
            {{ exercise.englishName }}
          </p>

          <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span class="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1">
              <span>🎯 主目标:</span> {{ exercise?.target }}
            </span>
            <span v-for="sec in exercise?.secondaryMuscles || []" :key="sec"
                  class="px-2 py-1 rounded-xl bg-zinc-800 text-zinc-300 text-xs border border-zinc-700">
              + {{ sec }}
            </span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center border-b border-zinc-800 gap-4 text-xs font-bold pt-1">
          <button @click="activeTab = 'tips'"
                  class="py-2 relative transition-colors"
                  :class="[activeTab === 'tips' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            动作要点
            <span v-if="activeTab === 'tips'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>

          <button @click="activeTab = 'substitutes'"
                  class="py-2 relative transition-colors flex items-center gap-1"
                  :class="[activeTab === 'substitutes' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            平替动作
            <span v-if="exercise?.substitutes?.length" class="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[9px] text-amber-400 font-mono">
              {{ exercise.substitutes.length }}
            </span>
            <span v-if="activeTab === 'substitutes'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>

          <button @click="activeTab = 'science'"
                  class="py-2 relative transition-colors"
                  :class="[activeTab === 'science' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            科学解析
            <span v-if="activeTab === 'science'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>

          <button @click="activeTab = 'history'"
                  class="py-2 relative transition-colors"
                  :class="[activeTab === 'history' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            历史记录
            <span v-if="activeTab === 'history'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>
        </div>

        <!-- TAB 1: 动作要点 (Tips) -->
        <div v-if="activeTab === 'tips'" class="space-y-2.5 text-xs">
          <div v-if="exercise?.tips" class="space-y-2">
            <div v-if="exercise.tips.prep" class="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl space-y-1">
              <div class="font-bold text-amber-400 flex items-center gap-1.5">
                <span>1️⃣</span> 准备姿态
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.prep }}</p>
            </div>

            <div v-if="exercise.tips.execution" class="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl space-y-1">
              <div class="font-bold text-amber-400 flex items-center gap-1.5">
                <span>2️⃣</span> 发力轨迹
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.execution }}</p>
            </div>

            <div v-if="exercise.tips.peak" class="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl space-y-1">
              <div class="font-bold text-emerald-400 flex items-center gap-1.5">
                <span>3️⃣</span> 顶峰收缩 (Peak Contraction)
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.peak }}</p>
            </div>

            <div v-if="exercise.tips.negative" class="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl space-y-1">
              <div class="font-bold text-sky-400 flex items-center gap-1.5">
                <span>4️⃣</span> 离心控制 (Negative / Stretch)
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.negative }}</p>
            </div>

            <div v-if="exercise.tips.breathing" class="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl space-y-1">
              <div class="font-bold text-purple-400 flex items-center gap-1.5">
                <span>🫁</span> 呼吸节奏
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.breathing }}</p>
            </div>
          </div>

          <!-- Common Mistakes -->
          <div v-if="exercise?.commonMistakes && exercise.commonMistakes.length" 
               class="p-3.5 bg-red-950/20 border border-red-500/30 rounded-2xl space-y-1.5">
            <div class="font-bold text-red-400 flex items-center gap-1.5">
              <span>⚠️</span> 常见错误与避坑指南
            </div>
            <ul class="space-y-1 pl-5 list-disc text-zinc-300">
              <li v-for="(mistake, mIdx) in exercise.commonMistakes" :key="mIdx" class="leading-relaxed">
                {{ mistake }}
              </li>
            </ul>
          </div>
        </div>

        <!-- TAB 2: 平替动作 (Substitutes) -->
        <div v-if="activeTab === 'substitutes'" class="space-y-2.5 text-xs">
          <p class="text-zinc-400 text-[11px]">
            💡 器械被占或想换刺激角度时，推荐以下高匹配平替：
          </p>

          <div v-if="exercise?.substitutes && exercise.substitutes.length" class="space-y-2">
            <div v-for="(sub, sIdx) in exercise.substitutes" :key="sIdx"
                 @click="handleSelectSubstitute(sub.name)"
                 class="p-3 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3">
              <div>
                <div class="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                  <span>🔄</span> {{ sub.name }}
                </div>
                <p class="text-zinc-400 text-xs mt-0.5">{{ sub.reason }}</p>
              </div>
              <button class="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30 flex-shrink-0">
                查看/替换
              </button>
            </div>
          </div>

          <div v-else class="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
            暂无预设平替，可在动作库中选择同部位动作
          </div>
        </div>

        <!-- TAB 3: 科学解析 (Science) -->
        <div v-if="activeTab === 'science'" class="space-y-3 text-xs">
          <div class="p-3.5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl space-y-2">
            <div class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>🔬</span> 动作美学目的与科学细节
            </div>
            <p class="text-zinc-200 leading-relaxed text-xs">
              {{ exercise?.scienceDetail || "注重动作规范与顶峰离心张力，避免代偿借力。" }}
            </p>
            <div v-if="exercise?.tags && exercise.tags.length" class="flex flex-wrap gap-1.5 pt-1">
              <span v-for="tag in exercise.tags" :key="tag" 
                    class="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-amber-300 border border-zinc-700">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- TAB 4: 历史记录 (History) -->
        <div v-if="activeTab === 'history'" class="space-y-2 text-xs">
          <div class="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between pb-1">
            <span>📈 个人历史打卡记录</span>
            <span class="text-[10px] text-zinc-500">最近 {{ exerciseHistory.length }} 次</span>
          </div>

          <div v-if="exerciseHistory.length" class="space-y-2">
            <div v-for="(hist, idx) in exerciseHistory" :key="idx"
                 class="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1">
              <div class="flex items-center justify-between text-zinc-400 font-mono">
                <span class="text-zinc-200 font-semibold">{{ hist.date }}</span>
                <span>{{ hist.planName }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(s, sIdx) in hist.sets" :key="sIdx"
                      class="px-2 py-0.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono font-medium text-emerald-400">
                  {{ s.weight }}kg × {{ s.reps }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            暂无历史打卡记录，完成该动作训练后将自动记录在此
          </div>
        </div>

        <!-- Bottom Spacing so content never gets covered by button -->
        <div class="h-6"></div>

      </div>

      <!-- Bottom Sticky CTA Button (Yellow / Amber prominent bar) -->
      <div class="p-3.5 bg-zinc-950 border-t border-zinc-800/80 flex-shrink-0 safe-bottom-padding">
        <button @click="handleActionStart" 
                class="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span>{{ store.activeWorkout ? '加入至当前训练' : '立即开练' }}</span>
        </button>
      </div>

    </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { store, getExerciseDetails, addExerciseToActiveWorkout } from "../store/fitnessStore.js";
import { getMuscleDiagramSvg } from "../utils/muscleDiagrams.js";

const props = defineProps({
  visible: Boolean,
  exercise: Object
});

const emit = defineEmits(["close", "selectSubstitute"]);

const activeTab = ref("tips");
const gifError = ref(false);

const muscleSvg = computed(() => {
  return getMuscleDiagramSvg(props.exercise?.category || "胸部", props.exercise?.target || props.exercise?.name || "");
});

watch(() => props.exercise, () => {
  gifError.value = false;
  activeTab.value = "tips";
});

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
  return history.slice(0, 5);
});

function handleSelectSubstitute(subName) {
  const match = getExerciseDetails(subName) || { name: subName, category: props.exercise?.category || "训练", target: props.exercise?.target || "" };
  props.exercise.value = match;
  emit("selectSubstitute", match);
}

function handleActionStart() {
  if (store.activeWorkout) {
    addExerciseToActiveWorkout(props.exercise);
    alert(`已将【${props.exercise.name}】添加到本次训练！`);
    emit("close");
  } else {
    emit("close");
    store.activeTab = "today";
  }
}
</script>
