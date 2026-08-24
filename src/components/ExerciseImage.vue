<template>
  <div class="relative overflow-hidden bg-zinc-950 flex items-center justify-center select-none"
       :class="[customClass || 'rounded-2xl w-full aspect-square']">
    
    <!-- If External GIF loaded successfully -->
    <img v-if="src && !hasError" 
         :src="src" 
         :alt="name || '动作演示'"
         loading="lazy"
         @load="onImgLoad"
         @error="onError"
         class="w-full h-full object-contain mix-blend-screen transition-opacity duration-300 relative z-10"
         :class="[imgLoaded ? 'opacity-100' : 'opacity-0']" />

    <!-- 3D Muscle Anatomy Diagram (Zero-lag, 100% reliable SVG representation) -->
    <div v-show="!imgLoaded || hasError || !src" 
         class="w-full h-full p-2 flex items-center justify-center relative bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div v-html="muscleSvg" class="w-full h-full max-h-36 max-w-36 flex items-center justify-center"></div>
      
      <!-- 3D Badge -->
      <span class="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[8px] font-bold text-amber-400 border border-amber-500/30">
        3D 解剖
      </span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getMuscleDiagramSvg } from "../utils/muscleDiagrams.js";

const props = defineProps({
  src: String,
  name: String,
  category: String,
  target: String,
  customClass: String
});

const imgLoaded = ref(false);
const hasError = ref(false);

const muscleSvg = computed(() => {
  return getMuscleDiagramSvg(props.category || "胸部", props.target || props.name || "");
});

watch(() => props.src, () => {
  imgLoaded.value = false;
  hasError.value = false;
});

function onImgLoad() {
  imgLoaded.value = true;
  hasError.value = false;
}

function onError() {
  hasError.value = true;
  imgLoaded.value = false;
}
</script>
