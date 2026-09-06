<template>
  <div class="relative overflow-hidden flex items-center justify-center select-none"
       data-theme-preserve="true"
       :class="[
         customClass || 'rounded-2xl w-full aspect-square',
         store?.settings?.themeMode === 'light' ? 'bg-slate-100' : 'bg-zinc-950'
       ]">
    
    <!-- If 3D GIF loaded successfully -->
    <img v-if="effectiveSrc && !hasError" 
         :src="effectiveSrc" 
         :alt="name || '3D动作演示'"
         loading="lazy"
         @load="onImgLoad"
         @error="onError"
         class="w-full h-full object-contain transition-opacity duration-300 relative z-10"
         :class="[
           imgLoaded ? 'opacity-100' : 'opacity-0',
           store?.settings?.themeMode === 'light' ? 'mix-blend-multiply' : 'mix-blend-screen'
         ]" />

    <!-- Unified 3D Anatomical Placeholder (Zero 2D schematics, 100% consistent dark/light glass aesthetic) -->
    <div v-show="!imgLoaded || hasError || !effectiveSrc" 
         class="w-full h-full flex flex-col items-center justify-center relative transition-all"
         :class="[
           isMicro ? 'p-0.5' : 'p-2',
           store?.settings?.themeMode === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-300'
         ]">
      <div class="flex flex-col items-center justify-center animate-pulse" :class="isMicro ? 'gap-0' : 'gap-1'">
        <span :class="isMicro ? 'text-xs' : 'text-base sm:text-xl'">🏋️‍♂️</span>
      </div>
      
      <!-- 3D Badge: Only displayed when container is large enough (not micro) -->
      <span v-if="!isMicro" class="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[8px] font-bold text-amber-400 border border-amber-500/30">
        3D 动图
      </span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { store, getExerciseDetails } from "../store/fitnessStore.js";

const props = defineProps({
  src: String,
  name: String,
  category: String,
  target: String,
  customClass: String
});

const imgLoaded = ref(false);
const hasError = ref(false);

const isMicro = computed(() => {
  const cls = props.customClass || "";
  return cls.includes("w-4") || cls.includes("w-5") || cls.includes("w-6") || cls.includes("w-7") || cls.includes("w-8") || cls.includes("w-9") || cls.includes("w-10") || cls.includes("w-11") || cls.includes("w-12");
});

const effectiveSrc = computed(() => {
  if (props.src) return props.src;
  if (props.name) {
    const match = getExerciseDetails(props.name);
    if (match?.gifUrl) return match.gifUrl;
  }
  return "";
});

watch(() => [props.src, effectiveSrc.value], () => {
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
