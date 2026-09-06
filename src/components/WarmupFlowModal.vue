<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="handleClose"></div>

      <!-- Modal Card -->
      <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3.5 animate-in slide-in-from-bottom duration-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
           :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700/80 text-white'">
        
        <!-- Top Ergonomic Pill -->
        <div class="w-10 h-1 rounded-full mx-auto -mt-1 flex-shrink-0"
             :class="store.settings.themeMode === 'light' ? 'bg-slate-300' : 'bg-zinc-700'"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-2 border-b"
             :class="store.settings.themeMode === 'light' ? 'border-slate-200' : 'border-zinc-800'">
          <div class="flex items-center gap-2">
            <span class="text-base">🔥</span>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-sm font-black tracking-tight"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
                  3 分钟动态热身流
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      :class="store.settings.themeMode === 'light' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'">
                  {{ routineTitle }}
                </span>
              </div>
              <p class="text-[11px] mt-0.5"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                激活关节滑液 · 预热肌群神经传导
              </p>
            </div>
          </div>

          <button @click="handleClose" 
                  aria-label="关闭热身流程"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'">
            ✕
          </button>
        </div>

        <!-- Step Indicator Track -->
        <div class="flex items-center gap-1.5 px-0.5">
          <div v-for="(step, idx) in activeRoutine" :key="step.id"
               class="flex-1 h-1.5 rounded-full transition-all duration-300 cursor-pointer"
               @click="currentStepIndex = idx"
               :class="[
                 idx === currentStepIndex 
                   ? 'bg-amber-500 shadow-xs shadow-amber-500/50 scale-y-110' 
                   : (idx < currentStepIndex 
                       ? (store.settings.themeMode === 'light' ? 'bg-emerald-600' : 'bg-emerald-500') 
                       : (store.settings.themeMode === 'light' ? 'bg-slate-200' : 'bg-zinc-800'))
               ]">
          </div>
        </div>

        <!-- Scrollable Main Content -->
        <div class="flex-1 overflow-y-auto space-y-3.5 pr-0.5 -mr-0.5">
          <!-- Step Counter Badge & Duration -->
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono font-bold"
                  :class="store.settings.themeMode === 'light' ? 'text-amber-800' : 'text-amber-400'">
              动作 {{ currentStepIndex + 1 }} / {{ activeRoutine.length }}
            </span>
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'">
              🎯 目标：{{ currentExercise?.targetCount || '12-15次' }}
            </span>
          </div>

          <!-- 3D GIF Showcase Container -->
          <div class="rounded-2xl border p-2 flex flex-col items-center justify-center relative overflow-hidden"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'">
            <div class="w-48 h-48 sm:w-56 sm:h-56 relative rounded-xl overflow-hidden flex items-center justify-center">
              <ExerciseImage 
                :src="currentExercise?.gifUrl" 
                :name="currentExercise?.name" 
                :category="'热身'" 
                customClass="w-full h-full object-contain rounded-xl"
              />
            </div>
            
            <!-- Dynamic Movement Name Overlay -->
            <div class="mt-2 text-center">
              <div class="font-black text-sm"
                   :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
                {{ currentExercise?.name }}
              </div>
              <div class="text-[11px] font-mono text-zinc-400 mt-0.5">
                {{ currentExercise?.englishName }}
              </div>
            </div>
          </div>

          <!-- Scientific Rationale ('为什么做这个？' 破解懵逼) -->
          <div class="p-3 rounded-2xl border space-y-1.5 transition-colors"
               :class="store.settings.themeMode === 'light' ? 'bg-amber-50/70 border-amber-200/80 text-amber-950' : 'bg-amber-500/10 border-amber-500/25 text-amber-200'">
            <div class="flex items-center gap-1.5 text-xs font-black text-amber-500">
              <span>🧠</span>
              <span>动作原理与激活目标</span>
            </div>
            <p class="text-[11px] leading-relaxed"
               :class="store.settings.themeMode === 'light' ? 'text-amber-900' : 'text-zinc-200'">
              {{ currentExercise?.scienceWhy }}
            </p>
          </div>

          <!-- Biomechanical Dynamic Cue -->
          <div class="p-3 rounded-2xl border space-y-2 text-xs"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'">
            <div class="flex items-start gap-2">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                发力要点
              </span>
              <span class="text-[11px] leading-tight">
                {{ currentExercise?.cues?.positive || currentExercise?.target }}
              </span>
            </div>

            <div class="flex items-start gap-2">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0">
                避坑警示
              </span>
              <span class="text-[11px] leading-tight text-rose-300/90"
                    :class="store.settings.themeMode === 'light' ? 'text-rose-700' : 'text-rose-300'">
                {{ currentExercise?.commonMistakes?.[0] || '禁止憋气，全程保持深长呼吸与关节活动度控制。' }}
              </span>
            </div>
          </div>

          <!-- Quick Timer Support (For Time-Based Warmups like Jumping Jacks or Mobility Circles) -->
          <div v-if="currentExercise?.isTimed" 
               class="p-2.5 rounded-xl border flex items-center justify-between"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-zinc-800/70 border-zinc-700/60'">
            <div class="flex items-center gap-2">
              <span class="text-sm">⏱️</span>
              <span class="text-xs font-bold font-mono">
                计时模式：{{ remainingSeconds }} 秒
              </span>
            </div>
            <button @click="toggleTimer" 
                    class="px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    :class="timerActive 
                      ? 'bg-rose-500 text-white shadow-xs' 
                      : (store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-800' : 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600')">
              {{ timerActive ? '暂停' : (remainingSeconds < 30 && remainingSeconds > 0 ? '继续' : '开始计时') }}
            </button>
          </div>
        </div>

        <!-- Footer Control Buttons (Thumb-Zone Ergonomics) -->
        <div class="pt-2 border-t flex items-center gap-2 flex-shrink-0"
             :class="store.settings.themeMode === 'light' ? 'border-slate-200' : 'border-zinc-800'">
          <button v-if="currentStepIndex > 0"
                  @click="prevStep" 
                  class="w-1/3 py-2.5 border rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'">
            上一步
          </button>

          <button v-if="currentStepIndex < activeRoutine.length - 1"
                  @click="nextStep" 
                  class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>下一个动作</span>
            <span>❯</span>
          </button>

          <button v-else
                  @click="finishWarmup" 
                  class="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>完成热身 · 开始训练</span>
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { store } from '../store/fitnessStore.js';
import ExerciseImage from './ExerciseImage.vue';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock.js';
import { triggerHaptic } from '../utils/vibrate.js';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  plan: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'completed']);

const currentStepIndex = ref(0);
const remainingSeconds = ref(30);
const timerActive = ref(false);
let timerInterval = null;

// Lock scroll when visible
watch(() => props.visible, (val) => {
  if (val) {
    lockBodyScroll();
    currentStepIndex.value = 0;
    resetTimer();
  } else {
    unlockBodyScroll();
    clearTimer();
  }
});

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
  clearTimer();
});

function resetTimer() {
  clearTimer();
  remainingSeconds.value = currentExercise.value?.isTimed ? 30 : 20;
  timerActive.value = false;
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function toggleTimer() {
  if (timerActive.value) {
    clearTimer();
    timerActive.value = false;
  } else {
    timerActive.value = true;
    timerInterval = setInterval(() => {
      if (remainingSeconds.value > 1) {
        remainingSeconds.value--;
      } else {
        remainingSeconds.value = 0;
        clearTimer();
        timerActive.value = false;
        if (store.settings.vibrationEnabled) triggerHaptic('heavy');
      }
    }, 1000);
  }
}

// Find exercise in store by id or name
function getStoreExercise(id, name) {
  return store.exercises.find(e => e.id === id || e.name === name);
}

// Tailor routine based on current plan category / name
const routineConfig = computed(() => {
  const planName = (props.plan?.name || props.plan?.category || '').toLowerCase();
  
  if (planName.includes('推') || planName.includes('push') || planName.includes('胸') || planName.includes('肩')) {
    return {
      title: '推日专属 (胸/肩/三头)',
      exerciseKeys: [
        { id: 'ex-warmup-wrist-circles', targetCount: '双向各 15秒', isTimed: true, why: '大重量卧推与推举掌根承受巨大剪切力，必须充分润滑腕骨滑液，杜绝腕管压迫感。' },
        { id: 'ex-warmup-arm-circles', targetCount: '前后各 15次', isTimed: false, why: '全幅度多平面绕环，将滑液充分泵入盂肱关节，让三角肌与肩袖达到适宜做工温度。' },
        { id: 'ex-warmup-wall-slide', targetCount: '慢速 12次', isTimed: false, why: '激活下斜方肌与前锯肌，使肩胛骨紧贴胸壁形成坚实卧推支撑平台，彻底消除肩峰撞击咔咔声！' },
        { id: 'ex-warmup-band-pull-apart', targetCount: '顶峰停顿 15次', isTimed: false, why: '强力激活后束与冈下肌/小圆肌外旋力量，在卧推沉肩下压时锁死肩袖后方防御线。' }
      ]
    };
  }

  if (planName.includes('拉') || planName.includes('pull') || planName.includes('背')) {
    return {
      title: '拉日专属 (背部/二头/后束)',
      exerciseKeys: [
        { id: 'ex-warmup-cat-cow', targetCount: '呼吸配合 10次', isTimed: false, why: '逐节伸屈胸椎与腰椎，消除久坐僵硬，为大重量硬拉与划船建立中立位本体感觉。' },
        { id: 'ex-warmup-band-pull-apart', targetCount: '动态 15次', isTimed: false, why: '唤醒菱形肌与中下斜方肌，避免下拉与划船时斜方肌上部耸肩代偿，背部发力感倍增。' },
        { id: 'ex-warmup-inchworm', targetCount: '动态爬行 6次', isTimed: false, why: '动态拉伸后链腘绳肌，同时在手撑地爬行时激活核心与肩袖动态支撑能力。' },
        { id: 'ex-warmup-wrist-circles', targetCount: '双向各 15秒', isTimed: true, why: '预热屈肌腱与伸肌腱鞘，防止引体向上或重物悬吊时小臂紧绷与腱鞘炎症。' }
      ]
    };
  }

  if (planName.includes('腿') || planName.includes('leg') || planName.includes('下肢') || planName.includes('深蹲')) {
    return {
      title: '腿日专属 (股四/腘绳/臀大肌)',
      exerciseKeys: [
        { id: 'ex-warmup-kneeling-hip-flexor', targetCount: '每侧动态 10次', isTimed: false, why: '打开久坐极度缩短的髂腰肌与股直肌，让深蹲与腿举能顺畅下沉到深位，杜绝骨盆翻转！' },
        { id: 'ex-warmup-glute-bridge', targetCount: '顶峰停顿 12次', isTimed: false, why: '唤醒沉睡的臀大肌，避免硬拉深蹲全靠下背竖脊肌代偿造成腰痛。' },
        { id: 'ex-warmup-walking-lunges', targetCount: '每侧 8步', isTimed: false, why: '在单侧动态承重中激活膝关节、踝关节灵活性与髋关节三维稳定肌群。' },
        { id: 'ex-warmup-jumping-jacks', targetCount: '弹性跳跃 30秒', isTimed: true, why: '低冲击弹性温和升高骨骼肌体温与心率，增加全身血氧供应，提升爆发力准备。' }
      ]
    };
  }

  // Default / Full Body / Cardio
  return {
    title: '全身通用动态升温',
    exerciseKeys: [
      { id: 'ex-warmup-jumping-jacks', targetCount: '弹性跳跃 30秒', isTimed: true, why: '温和升高体温与心率，将血液从内脏快速分流至骨骼肌，进入运动战备状态。' },
      { id: 'ex-warmup-cat-cow', targetCount: '配合呼吸 10次', isTimed: false, why: '松动脊柱关节，建立深层腹内压与核心节律。' },
      { id: 'ex-warmup-arm-circles', targetCount: '前后各 15次', isTimed: false, why: '润滑肩关节滑液，预防各类推举与拉伸损伤。' },
      { id: 'ex-warmup-glute-bridge', targetCount: '顶峰停顿 12次', isTimed: false, why: '激活下后链臀肌，为全身复合动作筑牢基座。' }
    ]
  };
});

const routineTitle = computed(() => routineConfig.value.title);

const activeRoutine = computed(() => {
  return routineConfig.value.exerciseKeys.map(k => {
    const raw = getStoreExercise(k.id);
    return {
      id: k.id,
      name: raw?.name || '热身动作',
      englishName: raw?.englishName || '',
      gifUrl: raw?.gifUrl || './exercises/jumping-jacks.gif',
      target: raw?.target || '动态激活',
      tips: raw?.tips || {},
      commonMistakes: raw?.commonMistakes || [],
      scienceWhy: k.why,
      targetCount: k.targetCount,
      isTimed: k.isTimed
    };
  });
});

const currentExercise = computed(() => {
  return activeRoutine.value[currentStepIndex.value] || activeRoutine.value[0];
});

watch(currentStepIndex, () => {
  resetTimer();
});

function prevStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    if (store.settings.vibrationEnabled) triggerHaptic('light');
  }
}

function nextStep() {
  if (currentStepIndex.value < activeRoutine.value.length - 1) {
    currentStepIndex.value++;
    if (store.settings.vibrationEnabled) triggerHaptic('medium');
  }
}

function finishWarmup() {
  if (store.settings.vibrationEnabled) triggerHaptic('heavy');
  emit('completed');
  handleClose();
}

function handleClose() {
  clearTimer();
  emit('close');
}
</script>
