<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
    <div class="bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
      
      <!-- Top Interactive Hero Header with 3D Motion GIF -->
      <div class="relative bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-900 overflow-hidden">
        
        <!-- Action bar on top of image (Close, Share, Favorite) -->
        <div class="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              3D 动画演示
            </span>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 active:scale-95 transition-all">
            ✕
          </button>
        </div>

        <!-- Hero GIF / 3D Display Container -->
        <div class="w-full aspect-[4/3] max-h-64 flex items-center justify-center relative bg-black/40">
          <img v-if="exercise?.gifUrl && !imgError" 
               :src="exercise.gifUrl" 
               :alt="exercise.name"
               @error="imgError = true"
               class="w-full h-full object-contain mix-blend-screen p-2" />
          
          <!-- Fallback when GIF is unavailable -->
          <div v-else class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-950 to-zinc-900">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner mb-2 animate-bounce">
              {{ getCategoryEmoji(exercise?.category) }}
            </div>
            <div class="text-xs font-bold text-zinc-200">{{ exercise?.name }}</div>
            <div class="text-[10px] text-amber-400/90 mt-1">3D 发力解剖动态图</div>
          </div>

          <!-- Bottom Gradient Mask for smooth fade into content -->
          <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>

          <!-- Floating Badges like the reference image (3D, 1.0X speed) -->
          <div class="absolute bottom-3 left-4 z-10 flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-lg bg-zinc-900/90 backdrop-blur-md text-[10px] font-bold text-zinc-300 border border-zinc-700/80">
              3D 模型
            </span>
            <span class="px-2 py-0.5 rounded-lg bg-zinc-900/90 backdrop-blur-md text-[10px] font-bold text-zinc-300 border border-zinc-700/80">
              标准轨迹
            </span>
          </div>

          <div class="absolute bottom-3 right-4 z-10">
            <button @click="toggleSpeed" class="px-2.5 py-0.5 rounded-lg bg-zinc-900/90 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30 active:scale-95">
              {{ playSpeed }}X
            </button>
          </div>
        </div>

        <!-- Exercise Title & Highlighted Muscle Badges -->
        <div class="px-4 pt-1 pb-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-xl font-black text-white tracking-tight leading-snug">
                {{ exercise?.name }}
              </h2>
              <p v-if="exercise?.englishName" class="text-[11px] text-zinc-400 font-mono">
                {{ exercise.englishName }}
              </p>
            </div>
            <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex-shrink-0">
              {{ exercise?.category }}
            </span>
          </div>

          <!-- Target Muscles Pill Tags (Orange/Amber highlighted) -->
          <div class="flex flex-wrap items-center gap-1.5 mt-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1">
              <span>🎯 主目标:</span> {{ exercise?.target }}
            </span>
            <span v-for="sec in exercise?.secondaryMuscles || []" :key="sec"
                  class="px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-700">
              + {{ sec }}
            </span>
          </div>
        </div>

        <!-- Section Navigation Tabs (要点 / 平替动作 / 科学细节 / 历史) -->
        <div class="flex items-center border-b border-zinc-800 px-4 gap-6 text-xs font-bold">
          <button @click="activeTab = 'tips'"
                  class="py-2.5 relative transition-colors"
                  :class="[activeTab === 'tips' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            动作要点
            <span v-if="activeTab === 'tips'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>

          <button @click="activeTab = 'substitutes'"
                  class="py-2.5 relative transition-colors flex items-center gap-1"
                  :class="[activeTab === 'substitutes' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            平替动作
            <span v-if="exercise?.substitutes?.length" class="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[9px] text-amber-400 font-mono">
              {{ exercise.substitutes.length }}
            </span>
            <span v-if="activeTab === 'substitutes'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>

          <button @click="activeTab = 'science'"
                  class="py-2.5 relative transition-colors"
                  :class="[activeTab === 'science' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            科学解析
            <span v-if="activeTab === 'science'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>

          <button @click="activeTab = 'history'"
                  class="py-2.5 relative transition-colors"
                  :class="[activeTab === 'history' ? 'text-amber-400 font-black' : 'text-zinc-400 hover:text-zinc-200']">
            历史记录
            <span v-if="activeTab === 'history'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"></span>
          </button>
        </div>

      </div>

      <!-- Tab Content Area -->
      <div class="overflow-y-auto flex-1 p-4 space-y-4">
        
        <!-- TAB 1: 动作发力要点 (Tips) -->
        <div v-if="activeTab === 'tips'" class="space-y-3 text-xs">
          
          <div v-if="exercise?.tips" class="space-y-2.5">
            <div v-if="exercise.tips.prep" class="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-1">
              <div class="font-bold text-amber-400 flex items-center gap-1.5">
                <span>1️⃣</span> 准备姿态
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.prep }}</p>
            </div>

            <div v-if="exercise.tips.execution" class="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-1">
              <div class="font-bold text-amber-400 flex items-center gap-1.5">
                <span>2️⃣</span> 发力轨迹
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.execution }}</p>
            </div>

            <div v-if="exercise.tips.peak" class="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-1">
              <div class="font-bold text-emerald-400 flex items-center gap-1.5">
                <span>3️⃣</span> 顶峰收缩 (Peak Contraction)
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.peak }}</p>
            </div>

            <div v-if="exercise.tips.negative" class="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-1">
              <div class="font-bold text-sky-400 flex items-center gap-1.5">
                <span>4️⃣</span> 离心控制 (Negative / Stretch)
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.negative }}</p>
            </div>

            <div v-if="exercise.tips.breathing" class="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-1">
              <div class="font-bold text-purple-400 flex items-center gap-1.5">
                <span>🫁</span> 呼吸节奏
              </div>
              <p class="text-zinc-300 leading-relaxed pl-5">{{ exercise.tips.breathing }}</p>
            </div>
          </div>

          <!-- Common Mistakes -->
          <div v-if="exercise?.commonMistakes && exercise.commonMistakes.length" 
               class="p-3.5 bg-red-950/20 border border-red-500/30 rounded-2xl space-y-2">
            <div class="font-bold text-red-400 flex items-center gap-1.5">
              <span>⚠️</span> 常见错误与避坑指南
            </div>
            <ul class="space-y-1.5 pl-5 list-disc text-zinc-300">
              <li v-for="(mistake, mIdx) in exercise.commonMistakes" :key="mIdx" class="leading-relaxed">
                {{ mistake }}
              </li>
            </ul>
          </div>

        </div>

        <!-- TAB 2: 平替动作 (Substitutes) -->
        <div v-if="activeTab === 'substitutes'" class="space-y-3 text-xs">
          <div class="text-zinc-400 text-[11px] leading-relaxed">
            💡 当健身房器械被占或想换换刺激角度时，可直接切换为以下高匹配度平替动作：
          </div>

          <div v-if="exercise?.substitutes && exercise.substitutes.length" class="space-y-2.5">
            <div v-for="(sub, sIdx) in exercise.substitutes" :key="sIdx"
                 @click="handleSelectSubstitute(sub.name)"
                 class="p-3.5 bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3">
              <div>
                <div class="font-bold text-sm text-zinc-100 flex items-center gap-2">
                  <span>🔄</span> {{ sub.name }}
                </div>
                <p class="text-zinc-400 text-xs mt-1">
                  {{ sub.reason }}
                </p>
              </div>
              <button class="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/30 flex-shrink-0">
                查看/替换
              </button>
            </div>
          </div>

          <div v-else class="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
            暂无预设平替，可在动作库中自选同肌群动作
          </div>
        </div>

        <!-- TAB 3: 科学美学解析 (Science) -->
        <div v-if="activeTab === 'science'" class="space-y-3 text-xs">
          <div class="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>🔬</span> 动作美学目的与科学细节
            </div>
            <p class="text-zinc-200 leading-relaxed text-xs">
              {{ exercise?.scienceDetail || "注重动作规范与顶峰离心张力，避免代偿借力。" }}
            </p>
            <div v-if="exercise?.tags && exercise.tags.length" class="flex flex-wrap gap-1.5 pt-2">
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
                 class="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1.5">
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

      </div>

      <!-- Bottom Prominent Yellow/Amber CTA Button (Like screenshot) -->
      <div class="p-3.5 bg-zinc-950 border-t border-zinc-800">
        <button @click="handleActionStart" 
                class="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2">
          <span>🚀</span> {{ store.activeWorkout ? '加入/替换至当前训练' : '立即开始训练打卡' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { store, getExerciseDetails, startWorkout, addExerciseToActiveWorkout } from "../store/fitnessStore.js";

const props = defineProps({
  visible: Boolean,
  exercise: Object
});

const emit = defineEmits(["close", "selectSubstitute"]);

const activeTab = ref("tips");
const imgError = ref(false);
const playSpeed = ref("1.0");

watch(() => props.exercise, () => {
  imgError.value = false;
  activeTab.value = "tips";
});

function toggleSpeed() {
  if (playSpeed.value === "1.0") playSpeed.value = "0.5";
  else if (playSpeed.value === "0.5") playSpeed.value = "1.5";
  else playSpeed.value = "1.0";
}

function getCategoryEmoji(cat) {
  switch (cat) {
    case "胸部": return "🥋";
    case "背部": return "🦅";
    case "肩部": return "🛡️";
    case "手臂": return "💪";
    case "腿部": return "🦵";
    case "核心": return "⚡";
    default: return "🏋️";
  }
}

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
