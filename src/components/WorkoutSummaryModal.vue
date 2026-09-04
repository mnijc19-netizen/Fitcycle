<template>
  <Teleport to="body" :disabled="isTest">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <div class="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-5 max-w-sm w-full max-h-[90dvh] overflow-y-auto shadow-2xl text-center relative zoom-in-95 duration-200 scrollbar-none">
        
        <!-- Top Decorative Glow -->
        <div class="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Trophy Icon -->
        <div class="w-14 h-14 mx-auto mb-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-inner text-amber-400">
          <svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
        </div>

      <h3 class="text-lg font-black text-zinc-100 tracking-tight">
        训练打卡完成！
      </h3>
      <p class="text-xs text-amber-400 font-medium mt-0.5">
        {{ summary?.planName || "今日训练" }}
      </p>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-2 my-4">
        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2">
          <div class="text-[10px] text-zinc-400 font-medium">训练用时</div>
          <div class="text-base font-black text-zinc-100 font-mono mt-0.5">
            {{ Math.round((summary?.durationSeconds || 60) / 60) }}<span class="text-xs font-normal text-zinc-400 ml-0.5">分</span>
          </div>
        </div>

        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2">
          <div class="text-[10px] text-zinc-400 font-medium">总容量</div>
          <div class="text-base font-black text-emerald-400 font-mono mt-0.5">
            {{ summary?.totalVolume || 0 }}<span class="text-xs font-normal text-zinc-400 ml-0.5">kg</span>
          </div>
        </div>

        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2">
          <div class="text-[10px] text-zinc-400 font-medium">完成组数</div>
          <div class="text-base font-black text-sky-400 font-mono mt-0.5">
            {{ summary?.totalSets || 0 }}<span class="text-xs font-normal text-zinc-400 ml-0.5">组</span>
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- FAST AI WORKOUT ANALYSIS & RECOVERY CARD -->
      <!-- ============================================== -->
      <div v-if="aiAnalysis" class="bg-zinc-950/80 border border-amber-500/40 rounded-2xl p-3.5 text-left mb-4 space-y-2.5 shadow-lg relative overflow-hidden">
        
        <!-- FPS Honor Points Earned Pill -->
        <div v-if="summary?.honorPointsEarned" class="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-950 border border-amber-500/50 flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div>
              <span class="text-white font-bold text-[11px] block">本次获得 FPS 战力加分</span>
              <span class="text-[9px] text-zinc-400">
                基础: +{{ summary.honorPointsEarned.basePoints }}
                <span v-if="summary.honorPointsEarned.overloadBonus"> | 超负荷: +{{ summary.honorPointsEarned.overloadBonus }}</span>
                <span v-if="summary.honorPointsEarned.isRedemptionRebound" class="text-purple-300 font-bold"> | 破冰复苏 1.5x</span>
              </span>
            </div>
          </div>

          <div class="text-right">
            <span class="text-base font-black text-amber-400">+{{ summary.honorPointsEarned.finalSessionPoints }}</span>
            <span class="text-[9px] text-zinc-500 block">PTS</span>
          </div>
        </div>

        <!-- AI Badge Header -->
        <div class="flex items-center justify-between">
          <div class="text-xs font-black text-amber-400 flex items-center gap-1.5 font-mono">
            <span class="animate-pulse">✦</span>
            <span>{{ aiAnalysis.tacticalBadge }}</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold font-mono"
                :class="[
                  aiAnalysis.intensityColor === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  aiAnalysis.intensityColor === 'sky' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                ]">
            {{ aiAnalysis.intensityLevel }}
          </span>
        </div>

        <!-- Coach Summary Comment -->
        <p class="text-xs text-zinc-300 leading-relaxed font-medium">
          {{ aiAnalysis.coachComment }}
        </p>

        <!-- Progressive Overload Insight -->
        <div class="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] space-y-1">
          <div class="text-zinc-400 font-bold flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-amber-400 stroke-2 fill-none stroke-currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>渐进超负荷分析:</span>
          </div>
          <p class="text-zinc-300 leading-normal">
            {{ aiAnalysis.overloadText }}
          </p>
        </div>

        <!-- Muscle & Nutrition Advice -->
        <div class="space-y-1.5 text-[11px] text-zinc-400 pt-0.5">
          <div class="flex items-start gap-1.5">
            <span class="text-amber-400 font-bold flex-shrink-0 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
              补给:
            </span>
            <span class="text-zinc-300 leading-snug">{{ aiAnalysis.nutritionAdvice }}</span>
          </div>
          <div class="flex items-start gap-1.5">
            <span class="text-sky-400 font-bold flex-shrink-0 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block"></span>
              恢复:
            </span>
            <span class="text-zinc-300 leading-snug">{{ aiAnalysis.sleepAdvice }}</span>
          </div>
        </div>

        <!-- Trigger Deep AI Conversation -->
        <button @click="openDeepAIReview"
                class="w-full mt-1 py-2 bg-amber-500/15 hover:bg-amber-500/25 active:scale-98 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all">
          <span>✦</span> 呼叫 AI 智能教练深度复盘
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2">
        <!-- Confirm / Dismiss Button -->
        <button @click="$emit('close')" 
                class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all">
          太棒了，完成收工
        </button>

        <!-- Hand-Slip Undo / Resume Workout Button -->
        <button @click="handleResumeWorkout"
                class="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium rounded-xl border border-zinc-800 transition-colors flex items-center justify-center gap-1.5">
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
import { ref, computed, watch } from "vue";
import confetti from "canvas-confetti";
import { store, resumeWorkoutFromSummary } from "../store/fitnessStore.js";
import { analyzeWorkoutSummary, buildDetailedWorkoutPrompt, buildInstantWorkoutCoachResponse } from "../ai/workoutAnalyzer.js";
import { aiSession, clearConversation } from "../ai/aiSession.js";

const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test";

const props = defineProps({
  visible: Boolean,
  summary: Object
});

const emit = defineEmits(["close"]);

const aiAnalysis = computed(() => {
  if (!props.summary) return null;
  return analyzeWorkoutSummary(props.summary, store.workoutLogs, store.settings.uiSkin);
});

function launchConfetti() {
  try {
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
    launchConfetti();
  }
});
</script>