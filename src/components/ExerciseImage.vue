<template>
  <div class="relative overflow-hidden bg-zinc-950 flex items-center justify-center select-none"
       :class="[customClass || 'rounded-2xl w-full aspect-square']">
    
    <!-- Animated GIF Image -->
    <img v-if="gifSrc && !hasError" 
         :src="gifSrc" 
         :alt="alt || '动作演示'"
         loading="lazy"
         @load="loaded = true"
         @error="handleError"
         class="w-full h-full object-contain mix-blend-screen transition-opacity duration-300"
         :class="[loaded ? 'opacity-100' : 'opacity-0']" />

    <!-- Fallback / Loading 3D Anatomy Visualizer -->
    <div v-if="!loaded || hasError || !gifSrc" 
         class="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-zinc-900 to-zinc-950">
      
      <!-- Skeleton 3D Anatomy Figure -->
      <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner animate-pulse">
        {{ getCategoryEmoji(category) }}
      </div>

      <div class="text-[11px] font-bold text-zinc-300 mt-2 truncate max-w-[90%]">
        {{ name || '动作演示' }}
      </div>
      <div class="text-[9px] text-amber-400/90 font-mono mt-0.5">
        {{ target || '3D 发力轨迹' }}
      </div>

      <!-- Small 3D Badge -->
      <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-zinc-900/80 text-[8px] font-bold text-zinc-400 border border-zinc-700/60">
        3D 动图
      </span>
    </div>

    <!-- Live indicator on corner -->
    <div v-if="loaded && !hasError && gifSrc" 
         class="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      3D 动图
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  src: String,
  name: String,
  category: String,
  target: String,
  alt: String,
  customClass: String
});

const loaded = ref(false);
const hasError = ref(false);

const gifSrc = computed(() => {
  return props.src || "";
});

watch(() => props.src, () => {
  loaded.value = false;
  hasError.value = false;
});

function handleError() {
  hasError.value = true;
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
</script>
