<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Top Decorative Glow -->
      <div class="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Trophy Icon -->
      <div class="w-16 h-16 mx-auto mb-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
        🏆
      </div>

      <h3 class="text-xl font-black text-zinc-100 tracking-tight">
        训练打卡完成！
      </h3>
      <p class="text-xs text-amber-400 font-medium mt-1">
        {{ summary?.planName || "今日训练" }}
      </p>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-2.5 my-5">
        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2.5">
          <div class="text-[10px] text-zinc-400 font-medium">训练用时</div>
          <div class="text-lg font-black text-zinc-100 font-mono mt-0.5">
            {{ Math.round((summary?.durationSeconds || 60) / 60) }}<span class="text-xs font-normal text-zinc-400 ml-0.5">分</span>
          </div>
        </div>

        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2.5">
          <div class="text-[10px] text-zinc-400 font-medium">总容量</div>
          <div class="text-lg font-black text-emerald-400 font-mono mt-0.5">
            {{ summary?.totalVolume || 0 }}<span class="text-xs font-normal text-zinc-400 ml-0.5">kg</span>
          </div>
        </div>

        <div class="bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-2.5">
          <div class="text-[10px] text-zinc-400 font-medium">完成组数</div>
          <div class="text-lg font-black text-sky-400 font-mono mt-0.5">
            {{ summary?.totalSets || 0 }}<span class="text-xs font-normal text-zinc-400 ml-0.5">组</span>
          </div>
        </div>
      </div>

      <!-- Recovery Tip -->
      <div class="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-left mb-5 text-xs text-zinc-300 flex items-start gap-2.5">
        <span class="text-base flex-shrink-0">💡</span>
        <div>
          <span class="font-bold text-zinc-200">补给与恢复建议：</span>
          <p class="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
            训练后30分钟内适量摄入20-30g优质蛋白质及适量碳水，保证今晚充足睡眠，助力肌纤维超量恢复！
          </p>
        </div>
      </div>

      <!-- Confirm Button -->
      <button @click="$emit('close')" 
              class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all">
        太棒了，完成收工
      </button>

    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import confetti from "canvas-confetti";

const props = defineProps({
  visible: Boolean,
  summary: Object
});

defineEmits(["close"]);

function launchConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#f59e0b", "#10b981", "#38bdf8", "#ec4899"]
  });
}

watch(() => props.visible, (val) => {
  if (val) {
    launchConfetti();
  }
});
</script>
