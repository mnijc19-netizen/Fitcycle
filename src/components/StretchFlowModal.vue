<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="handleClose"></div>

      <!-- Modal Card -->
      <div class="relative z-10 border rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3.5 animate-in slide-in-from-bottom duration-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
           :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700/80 text-white'">
        
        <!-- Top Ergonomic Pill -->
        <div class="w-10 h-1 rounded-full mx-auto -mt-1 flex-shrink-0"
             :class="store.settings.themeMode === 'light' ? 'bg-slate-300' : 'bg-zinc-700'"></div>

        <!-- Header -->
        <div class="flex items-center justify-between pb-2 border-b"
             :class="store.settings.themeMode === 'light' ? 'border-slate-200' : 'border-zinc-800'">
          <div class="flex items-center gap-2">
            <span class="text-base">🧘</span>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-sm font-black tracking-tight"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
                  3 分钟练后拉伸流
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      :class="store.settings.themeMode === 'light' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'">
                  {{ routineTitle }}
                </span>
              </div>
              <p class="text-[11px] mt-0.5"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-400'">
                ACSM 筋膜重置 · 平抑皮质醇 · 唤醒副交感加速超量恢复
              </p>
            </div>
          </div>

          <button @click="handleClose" 
                  aria-label="关闭拉伸流程"
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
                   ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50 scale-y-110' 
                   : (idx < currentStepIndex 
                       ? (store.settings.themeMode === 'light' ? 'bg-teal-600' : 'bg-teal-500') 
                       : (store.settings.themeMode === 'light' ? 'bg-slate-200' : 'bg-zinc-800'))
               ]">
          </div>
        </div>

        <!-- Scrollable Main Content -->
        <div class="flex-1 overflow-y-auto space-y-3.5 pr-0.5 -mr-0.5">
          <!-- Step Counter Badge & Duration -->
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono font-bold"
                  :class="store.settings.themeMode === 'light' ? 'text-emerald-800 font-black' : 'text-emerald-400'">
              动作 {{ currentStepIndex + 1 }} / {{ activeRoutine.length }}
            </span>
            <span class="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 text-slate-700 border border-slate-200 font-bold' : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'">
              🎯 目标：{{ currentExercise?.targetCount || '单侧 25-30秒' }}
            </span>
          </div>

          <!-- 3D GIF Showcase Container -->
          <div class="rounded-2xl border p-2 flex flex-col items-center justify-center relative overflow-hidden"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'">
            <div class="w-48 h-48 sm:w-56 sm:h-56 relative rounded-xl overflow-hidden flex items-center justify-center">
              <ExerciseImage 
                :src="currentExercise?.gifUrl" 
                :name="currentExercise?.name" 
                :category="'拉伸'" 
                customClass="w-full h-full object-contain rounded-xl"
              />
            </div>
            
            <!-- Dynamic Movement Name Overlay -->
            <div class="mt-2 text-center">
              <div class="font-black text-sm"
                   :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-white'">
                {{ currentExercise?.name }}
              </div>
              <div class="text-[11px] font-mono mt-0.5"
                   :class="store.settings.themeMode === 'light' ? 'text-slate-500 font-medium' : 'text-zinc-400'">
                {{ currentExercise?.englishName }}
              </div>
            </div>
          </div>

          <!-- Scientific Rationale ('为什么做这个？' ACSM 科学依据) -->
          <div class="p-3 rounded-2xl border space-y-1.5 transition-colors"
               :class="store.settings.themeMode === 'light' ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'">
            <div class="flex items-center gap-1.5 text-xs font-black text-emerald-600">
              <span>🌿</span>
              <span>ACSM 科学原理与恢复机制</span>
            </div>
            <p class="text-[11px] leading-relaxed"
               :class="store.settings.themeMode === 'light' ? 'text-emerald-900 font-medium' : 'text-zinc-200'">
              {{ currentExercise?.scienceWhy }}
            </p>
          </div>

          <!-- Biomechanical Cue & Safety -->
          <div class="p-3 rounded-2xl border space-y-2 text-xs"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'">
            <div class="flex items-start gap-2">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-600 border border-teal-500/30 flex-shrink-0">
                牵拉要点
              </span>
              <span class="text-[11px] leading-tight">
                {{ currentExercise?.tips?.execution || currentExercise?.target }}
              </span>
            </div>

            <div class="flex items-start gap-2">
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30 flex-shrink-0">
                避坑警示
              </span>
              <span class="text-[11px] leading-tight"
                    :class="store.settings.themeMode === 'light' ? 'text-rose-700 font-medium' : 'text-rose-300'">
                {{ currentExercise?.commonMistakes?.[0] || '严禁弹震式（Ballistic）剧烈晃动，深吸慢吐，牵拉感保持在 6~7 级舒适酸胀。' }}
              </span>
            </div>
          </div>

          <!-- Countdown Timer Support -->
          <div class="p-2.5 rounded-xl border flex items-center justify-between"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-zinc-800/70 border-zinc-700/60'">
            <div class="flex items-center gap-2">
              <span class="text-sm">⏱️</span>
              <span class="text-xs font-bold font-mono">
                倒计时保持：{{ remainingSeconds }} 秒
              </span>
            </div>
            <button @click="toggleTimer" 
                    class="px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    :class="timerActive 
                      ? 'bg-rose-500 text-white shadow-xs' 
                      : (store.settings.themeMode === 'light' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-500 text-zinc-950 font-black')">
              {{ timerActive ? '暂停' : (remainingSeconds < 25 && remainingSeconds > 0 ? '继续' : '开始保持 (25s)') }}
            </button>
          </div>
        </div>

        <!-- Footer Control Buttons -->
        <div class="pt-2 border-t flex items-center gap-2 flex-shrink-0"
             :class="store.settings.themeMode === 'light' ? 'border-slate-200' : 'border-zinc-800'">
          <button v-if="currentStepIndex > 0"
                  @click="prevStep" 
                  class="w-1/3 py-2.5 border rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'">
            上一个
          </button>

          <button v-if="currentStepIndex < activeRoutine.length - 1"
                  @click="nextStep" 
                  class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>下一个拉伸</span>
            <span>❯</span>
          </button>

          <button v-else
                  @click="finishStretch" 
                  class="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>✨ 拉伸完成 · 享受超量恢复！</span>
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
const remainingSeconds = ref(25);
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
  remainingSeconds.value = 25;
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
      title: '推日专属拉伸 (胸/肩/三头)',
      exerciseKeys: [
        { id: 'ex-stretch-doorway-pec', targetCount: '单侧 25-30秒', why: '高强度推胸后胸大肌与胸小肌处于持续痉挛短缩态，利用门框延展胸骨角与肋骨附着点，彻底释放锁骨下肌与肩峰间隙压力。' },
        { id: 'ex-stretch-across-chest-shoulder', targetCount: '单侧 25-30秒', why: '松解卧推与推举中承受巨大剪切应力的后三角肌与肩袖外旋肌群，恢复肩关节水平内收正常解剖滑移。' },
        { id: 'ex-stretch-standing-triceps', targetCount: '单侧 25-30秒', why: '将大臂完全上举至耳侧，不仅拉长三头肌内侧/外侧头，更能完全拉伸跨越肩关节的三头肌长头，预防肘关节骨刺与鹰嘴滑囊炎。' },
        { id: 'ex-stretch-rotator-cuff', targetCount: '双侧 20-25秒', why: '温和松解冈下肌与小圆肌等肩袖深层肌，恢复肱骨头在肩臼窝中的中立对位。' }
      ]
    };
  }

  if (planName.includes('拉') || planName.includes('pull') || planName.includes('背')) {
    return {
      title: '拉日专属拉伸 (背部/二头/前臂)',
      exerciseKeys: [
        { id: 'ex-stretch-unilateral-lat', targetCount: '单侧 25-30秒', why: '大重量划船与高位下拉后，背阔肌沿骨盆与肱骨全面收缩。侧屈配合深呼气能打开胸腰筋膜，消除下背僵硬紧绷。' },
        { id: 'ex-stretch-upper-back', targetCount: '保持 25-30秒', why: '双手抱胸含胸延展菱形肌与斜方肌中下部，恢复胸椎屈曲灵活性，消除上背膏肓穴附近酸痛。' },
        { id: 'ex-stretch-foam-roller-back', targetCount: '缓慢滚动 30秒', why: '利用自重滚压胸椎中段，松解竖脊肌肌筋膜粘连，促进毛细血管血液回流。' },
        { id: 'ex-stretch-reverse-wrist', targetCount: '双侧 25秒', why: '长时间硬握杠铃导致前臂屈肌群极度紧张，反向伸腕可极大降低网球肘与腕管综合征隐患。' }
      ]
    };
  }

  if (planName.includes('腿') || planName.includes('leg') || planName.includes('下肢') || planName.includes('深蹲')) {
    return {
      title: '腿日专属拉伸 (股四/腘绳/臀大肌/小腿)',
      exerciseKeys: [
        { id: 'ex-stretch-standing-quad', targetCount: '单侧 25-30秒', why: '单腿站立屈膝后拉，骨盆保持后倾，深度牵拉股四头肌中的双关节肌——股直肌，缓解髌腱高张力。' },
        { id: 'ex-stretch-seated-hamstring', targetCount: '单侧 25-30秒', why: '硬拉与深蹲使后链腘绳肌强力缩短。保持脊柱中立微屈膝下压，避免拉扯下背部。' },
        { id: 'ex-stretch-lying-glute', targetCount: '单侧 25-30秒', why: '4字形抱腿仰卧牵拉，精准松解臀大肌深层纤维与梨状肌，解除坐骨神经压迫感。' },
        { id: 'ex-stretch-standing-wall-calf', targetCount: '单侧 25-30秒', why: '推墙延展小腿三头肌（腓肠肌与比目鱼肌），促进下肢静脉血液回流，防止夜间小腿抽筋。' }
      ]
    };
  }

  // Default / Core / Full Body
  return {
    title: '全身系统性筋膜重置',
    exerciseKeys: [
      { id: 'ex-stretch-doorway-pec', targetCount: '单侧 25秒', why: '展开前链胸廓，恢复呼吸胸腔容积。' },
      { id: 'ex-stretch-unilateral-lat', targetCount: '单侧 25秒', why: '延展侧链背阔肌与胸腰筋膜，减轻脊柱轴向压力。' },
      { id: 'ex-stretch-seated-hamstring', targetCount: '单侧 25秒', why: '放松大腿后侧腘绳肌，避免骨盆过度后倾。' },
      { id: 'ex-stretch-cobra-abdominal', targetCount: '呼吸配合 25秒', why: '伸展腹直肌与髂腰肌，深慢鼻吸口呼，激活副交感神经系统。' }
    ]
  };
});

const routineTitle = computed(() => routineConfig.value.title);

const activeRoutine = computed(() => {
  return routineConfig.value.exerciseKeys.map(k => {
    const raw = getStoreExercise(k.id);
    return {
      id: k.id,
      name: raw?.name || '拉伸动作',
      englishName: raw?.englishName || '',
      gifUrl: raw?.gifUrl || './exercises/doorway-pec-stretch.gif',
      target: raw?.target || '筋膜松解',
      tips: raw?.tips || {},
      commonMistakes: raw?.commonMistakes || [],
      scienceWhy: k.why,
      targetCount: k.targetCount
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

function finishStretch() {
  if (store.settings.vibrationEnabled) triggerHaptic('heavy');
  emit('completed');
  handleClose();
}

function handleClose() {
  clearTimer();
  emit('close');
}
</script>
