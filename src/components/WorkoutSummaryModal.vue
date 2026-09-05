<template>
  <Teleport to="body" :disabled="isTest">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-hidden touch-none select-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-3xl p-4 sm:p-5 max-w-sm w-full max-h-[90dvh] overflow-y-auto overflow-x-hidden shadow-2xl text-center zoom-in-95 duration-200 scrollbar-none overscroll-contain"
           style="-webkit-overflow-scrolling: touch; touch-action: pan-y; max-width: min(384px, calc(100vw - 24px)); box-sizing: border-box;">
        
        <!-- Top Decorative Glow - Contained within an overflow-hidden wrapper to strictly prevent expanding bounding box -->
        <div class="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div class="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
        </div>

        <!-- Trophy Icon -->
        <div class="w-14 h-14 mx-auto mb-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-inner text-amber-400 relative z-10">
          <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
        </div>

      <h3 class="text-lg font-black text-zinc-100 tracking-tight relative z-10">
        训练打卡完成！
      </h3>
      <p class="text-xs text-amber-400 font-medium mt-0.5 relative z-10 px-2 break-words leading-tight">
        {{ summary?.planName || "今日训练" }}
      </p>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-2 my-4 relative z-10">
        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2 min-w-0">
          <div class="text-[10px] text-zinc-400 font-medium truncate">训练用时</div>
          <div class="text-base font-black text-zinc-100 font-mono mt-0.5 truncate">
            {{ Math.round((summary?.durationSeconds || 60) / 60) }}<span class="text-xs font-normal text-zinc-400 ml-0.5">分</span>
          </div>
        </div>

        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2 min-w-0">
          <div class="text-[10px] text-zinc-400 font-medium truncate">总容量</div>
          <div class="text-base font-black text-emerald-400 font-mono mt-0.5 truncate">
            {{ summary?.totalVolume || 0 }}<span class="text-xs font-normal text-zinc-400 ml-0.5">kg</span>
          </div>
        </div>

        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2 min-w-0">
          <div class="text-[10px] text-zinc-400 font-medium truncate">完成组数</div>
          <div class="text-base font-black text-sky-400 font-mono mt-0.5 truncate">
            {{ summary?.totalSets || 0 }}<span class="text-xs font-normal text-zinc-400 ml-0.5">组</span>
          </div>
        </div>
      </div>

      <!-- Dopamine Total Tonnage Physical Metaphor -->
      <div class="bg-gradient-to-r from-amber-500/10 via-zinc-800/60 to-amber-500/10 border border-amber-500/30 rounded-2xl p-3 my-3 text-left relative z-10 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl flex-shrink-0">
          {{ tonnageMetaphor.icon }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-xs font-black text-amber-400 font-mono">{{ tonnageMetaphor.formattedTonnage }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">物理做工换算</span>
          </div>
          <p class="text-[11px] text-zinc-300 font-medium mt-0.5 leading-snug break-words">
            {{ tonnageMetaphor.description }}
          </p>
        </div>
      </div>

      <!-- 0~72h Supercompensation Recovery Timer Countdown -->
      <div class="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3 my-3 text-left relative z-10 space-y-1.5 shadow-sm">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-black text-emerald-400 flex items-center gap-1">
            <span class="animate-pulse">⚡</span> 生理超量重组黄金时钟已启动 (00:00 / 72:00)
          </span>
          <span class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex-shrink-0">
            72h免责
          </span>
        </div>
        <p class="text-[11px] text-emerald-200/90 leading-snug break-words">
          受宪法免责保护，0~72h 绝不扣分，肌纤维正在超量增生
        </p>
        <div class="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
          <div class="bg-emerald-400 h-full rounded-full transition-all duration-500"
               :style="{ width: `${supercompStatus.progressPercent}%` }"></div>
        </div>
      </div>

      <!-- Tier Progression Shimmer Bar & Celebratory Badge -->
      <div class="bg-zinc-950/70 border border-zinc-700/60 rounded-2xl p-3 my-3 text-left relative z-10 space-y-2 shadow-sm">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-xs font-black text-zinc-200 truncate">战力天梯进阶</span>
            <span v-if="tierAdvancement.hasLeveledUp" 
                  class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-zinc-950 shadow-md animate-bounce flex-shrink-0">
              🎉 段位晋级！
            </span>
          </div>
          <span class="text-xs font-mono font-bold text-amber-400 flex-shrink-0">
            +{{ tierAdvancement.pointsGained }} PTS
          </span>
        </div>

        <!-- Shimmer progress bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>{{ tierAdvancement.currentTier.name }}</span>
            <span>{{ tierAdvancement.progressPercent }}%</span>
          </div>
          <div class="w-full bg-zinc-800 h-2 rounded-full overflow-hidden relative">
            <div class="bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 h-full rounded-full transition-all duration-700 relative overflow-hidden"
                 :style="{ width: `${Math.max(5, tierAdvancement.progressPercent)}%` }">
              <div class="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <div class="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
            <span>本阶积分: {{ tierAdvancement.currentPointsInTier }} PTS</span>
            <span v-if="tierAdvancement.pointsNeededForNextTier > 0">距下一阶: {{ tierAdvancement.pointsNeededForNextTier }} PTS</span>
            <span v-else class="text-amber-400 font-bold">已达巅峰天梯</span>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- FAST AI WORKOUT ANALYSIS & RECOVERY CARD -->
      <!-- ============================================== -->
      <div v-if="aiAnalysis" class="bg-zinc-950/80 border border-amber-500/40 rounded-2xl p-3.5 text-left mb-4 space-y-2.5 shadow-lg relative overflow-hidden z-10">
        
        <!-- FPS Honor Points Earned Pill -->
        <div v-if="summary?.honorPointsEarned" 
             class="p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-mono overflow-hidden"
             :class="store.settings.themeMode === 'light' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-950 border-amber-500/50'">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <div class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <span class="font-bold text-[11px] block truncate"
                    :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">本次获得 FPS 战力加分</span>
              <span class="text-[9px] block truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                基础: +{{ summary.honorPointsEarned.basePoints }}
                <span v-if="summary.honorPointsEarned.overloadBonus"> | 超负荷: +{{ summary.honorPointsEarned.overloadBonus }}</span>
                <span v-if="summary.honorPointsEarned.isRedemptionRebound" class="font-bold" :class="store.settings.themeMode === 'light' ? 'text-purple-700' : 'text-purple-300'"> | 破冰 1.5x</span>
              </span>
            </div>
          </div>

          <div class="text-right flex-shrink-0">
            <span class="text-base font-black text-amber-400">+{{ summary.honorPointsEarned.finalSessionPoints }}</span>
            <span class="text-[9px] block" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-500'">PTS</span>
          </div>
        </div>

        <!-- AI Badge Header -->
        <div class="flex items-center justify-between gap-2">
          <div class="text-xs font-black text-amber-400 flex items-center gap-1.5 font-mono min-w-0 truncate">
            <span class="animate-pulse flex-shrink-0">✦</span>
            <span class="truncate">AI 智能教练复盘</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono flex-shrink-0"
                :class="[
                  aiAnalysis.intensityColor === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  aiAnalysis.intensityColor === 'sky' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                ]">
            {{ aiAnalysis.intensityLevel }}
          </span>
        </div>

        <!-- Coach Summary Comment -->
        <p class="text-xs text-zinc-300 leading-relaxed font-medium break-words">
          {{ aiAnalysis.coachComment }}
        </p>

        <!-- Progressive Overload Insight -->
        <div class="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] space-y-1 overflow-hidden">
          <div class="text-zinc-400 font-bold flex items-center gap-1.5 truncate">
            <svg class="w-3.5 h-3.5 text-amber-400 stroke-2 fill-none stroke-currentColor flex-shrink-0" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>渐进超负荷分析:</span>
          </div>
          <p class="text-zinc-300 leading-normal break-words">
            {{ aiAnalysis.overloadText }}
          </p>
        </div>

        <!-- Muscle & Nutrition Advice -->
        <div class="space-y-1.5 text-[11px] text-zinc-400 pt-0.5 overflow-hidden">
          <div class="flex items-start gap-1.5">
            <span class="text-amber-400 font-bold flex-shrink-0 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
              补给:
            </span>
            <span class="text-zinc-300 leading-snug break-words flex-1 min-w-0">{{ aiAnalysis.nutritionAdvice }}</span>
          </div>
          <div class="flex items-start gap-1.5">
            <span class="text-sky-400 font-bold flex-shrink-0 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block"></span>
              恢复:
            </span>
            <span class="text-zinc-300 leading-snug break-words flex-1 min-w-0">{{ aiAnalysis.sleepAdvice }}</span>
          </div>
        </div>

        <!-- Trigger Deep AI Conversation -->
        <button @click="openDeepAIReview"
                class="w-full mt-1 py-2 bg-amber-500/15 hover:bg-amber-500/25 active:scale-98 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer">
          <span>✦</span> 呼叫 AI 智能教练深度复盘
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2 relative z-10">
        <!-- Confirm / Dismiss Button -->
        <button @click="$emit('close')" 
                class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer">
          太棒了，完成收工
        </button>

        <!-- Hand-Slip Undo / Resume Workout Button -->
        <button @click="handleResumeWorkout"
                class="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium rounded-xl border border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
          <svg class="w-3.5 h-3.5 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a5 5 0 015 5v2m0 0l-3-3m3 3l3-3M3 10l3-3m-3 3l3 3" />
          </svg>
          手滑了？返回继续本次训练
        </button>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import confetti from "canvas-confetti";
import { store, resumeWorkoutFromSummary } from "../store/fitnessStore.js";
import { analyzeWorkoutSummary, buildDetailedWorkoutPrompt, buildInstantWorkoutCoachResponse } from "../ai/workoutAnalyzer.js";
import { aiSession, clearConversation } from "../ai/aiSession.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import {
  calculateTonnageMetaphor,
  calculateSupercompensationStatus,
  calculateTierAdvancement
} from "../engine/dopamineFeedbackEngine.js";

const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test";

const props = defineProps({
  visible: Boolean,
  summary: Object
});

const emit = defineEmits(["close"]);

const tonnageMetaphor = computed(() => {
  return calculateTonnageMetaphor(props.summary?.totalVolume || 0);
});

const supercompStatus = computed(() => {
  return calculateSupercompensationStatus(Date.now(), Date.now());
});

const tierAdvancement = computed(() => {
  const sessionPoints = props.summary?.honorPointsEarned?.finalSessionPoints || 0;
  const currentTotalPoints = store.userProfile?.honorPoints || (300 + sessionPoints);
  return calculateTierAdvancement(currentTotalPoints, sessionPoints);
});

const aiAnalysis = computed(() => {
  if (!props.summary) return null;
  return analyzeWorkoutSummary(props.summary, store.workoutLogs, store.settings.uiSkin);
});

function launchConfetti() {
  if (isTest || typeof window === "undefined" || !window.document?.createElement) return;
  try {
    const testCanvas = document.createElement("canvas");
    if (!testCanvas.getContext || !testCanvas.getContext("2d")) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#38bdf8", "#ec4899"]
    });
  } catch (e) {}
}

function handleResumeWorkout() {
  if (props.summary) {
    resumeWorkoutFromSummary(props.summary);
  }
  emit("close");
}

function openDeepAIReview() {
  if (!props.summary) return;
  emit("close");
  
  const userPrompt = buildDetailedWorkoutPrompt(props.summary);
  
  clearConversation();
  
  aiSession.apiMessages.push({
    role: "user",
    content: userPrompt
  });
  
  aiSession.conversation.push({
    id: `user_${Date.now()}`,
    role: "user",
    text: userPrompt
  });

  aiSession.pendingAutoRun = true;
  aiSession.drawerOpen = true;
}

watch(() => props.visible, (val) => {
  if (val) {
    lockBodyScroll();
    launchConfetti();
  } else {
    unlockBodyScroll();
  }
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});
</script>