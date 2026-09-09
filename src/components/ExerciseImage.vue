<template>
  <div class="relative overflow-hidden flex items-center justify-center select-none"
       data-theme-preserve="true"
       :class="[
         customClass || 'rounded-2xl w-full aspect-square',
         store?.settings?.themeMode === 'light' 
           ? 'bg-slate-100 border border-slate-200/80' 
           : 'bg-zinc-900/90 border border-zinc-800/90'
       ]">
    
    <!-- 3D GIF Display -->
    <img v-if="effectiveSrc && !hasError" 
         ref="imgRef"
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

    <!-- Sleek High-Contrast Skeleton & Anatomical Fallback (彻底告别死黑方块) -->
    <div v-show="!imgLoaded || hasError || !effectiveSrc" 
         class="absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-all z-0"
         :class="[
           isMicro ? 'p-0.5' : 'p-2',
           store?.settings?.themeMode === 'light' 
             ? 'bg-gradient-to-b from-slate-100 via-slate-200/70 to-slate-100 text-slate-700' 
             : 'bg-gradient-to-b from-zinc-800/80 via-zinc-850/90 to-zinc-900 text-zinc-300'
         ]">
      
      <!-- Center Anatomical Muscle / Category Shimmer Icon -->
      <div class="flex flex-col items-center justify-center"
           :class="[!hasError && effectiveSrc ? 'animate-pulse' : '']">
        <span :class="isMicro ? 'text-xs' : 'text-base sm:text-xl'">
          {{ categoryIcon }}
        </span>
      </div>
      
      <!-- 3D / Category Badge: Only displayed when container is not micro -->
      <span v-if="!isMicro" 
            class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-mono font-bold tracking-tight border"
            :class="store?.settings?.themeMode === 'light'
              ? 'bg-white/90 text-amber-800 border-amber-300/60 shadow-2xs'
              : 'bg-zinc-950/80 text-amber-400 border-amber-500/40 shadow-2xs'">
        {{ hasError ? '解剖示范' : '3D 动图' }}
      </span>

      <!-- Subtle Ambient Shimmer Line for loading feedback -->
      <div v-if="!imgLoaded && !hasError && effectiveSrc"
           class="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-[shimmer_2s_infinite] pointer-events-none"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { store, getExerciseDetails } from "../store/fitnessStore.js";

const props = defineProps({
  src: String,
  name: String,
  category: String,
  target: String,
  customClass: String
});

const imgRef = ref(null);
const imgLoaded = ref(false);
const hasError = ref(false);

const isMicro = computed(() => {
  const cls = props.customClass || "";
  return cls.includes("w-4") || cls.includes("w-5") || cls.includes("w-6") || cls.includes("w-7") || cls.includes("w-8") || cls.includes("w-9") || cls.includes("w-10") || cls.includes("w-11") || cls.includes("w-12");
});

const categoryIcon = computed(() => {
  const cat = (props.category || "").toLowerCase();
  const n = (props.name || "").toLowerCase();
  if (cat.includes("胸") || n.includes("卧推") || n.includes("夹胸")) return "🛡️";
  if (cat.includes("背") || n.includes("拉") || n.includes("划船") || n.includes("引体")) return "🦅";
  if (cat.includes("肩") || n.includes("推肩") || n.includes("平举")) return "🏹";
  if (cat.includes("臂") || cat.includes("手") || n.includes("弯举") || n.includes("三头")) return "💪";
  if (cat.includes("腿") || n.includes("蹲") || n.includes("蹬")) return "🦵";
  if (cat.includes("核心") || cat.includes("腹") || n.includes("卷腹")) return "🎯";
  if (cat.includes("热身")) return "⚡";
  if (cat.includes("拉伸")) return "🧘";
  if (cat.includes("有氧")) return "🔥";
  return "🏋️‍♂️";
});

const effectiveSrc = computed(() => {
  if (props.src) return props.src;
  if (props.name) {
    const match = getExerciseDetails(props.name);
    if (match?.gifUrl) return match.gifUrl;
  }
  return "";
});

function checkImgComplete() {
  if (imgRef.value && imgRef.value.complete && imgRef.value.naturalWidth > 0) {
    imgLoaded.value = true;
    hasError.value = false;
  }
}

watch(() => [props.src, effectiveSrc.value], () => {
  imgLoaded.value = false;
  hasError.value = false;
  nextTick(checkImgComplete);
});

// Watch tab switches so when user enters ExercisesView, cached images awaken immediately
watch(() => store.activeTab, (tab) => {
  if (tab === "exercises" || tab === "today") {
    nextTick(checkImgComplete);
  }
});

onMounted(() => {
  checkImgComplete();
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
