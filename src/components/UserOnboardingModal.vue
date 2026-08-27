<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Non-intrusive Translucent Backdrop (Allows user to see the page underneath) -->
    <div class="absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity" @click="handleComplete"></div>

    <!-- Floating Glassmorphic Sheet Modal -->
    <div class="relative w-full max-w-sm bg-zinc-950/92 border border-zinc-700/70 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl space-y-3 overflow-hidden animate-in zoom-in-95 duration-200">
      
      <!-- Top Row: Navigation Badge & Prominent Skip Button -->
      <div class="flex items-center justify-between pb-2 border-b border-zinc-800/80">
        <div class="flex items-center gap-1.5 font-mono text-[11px] text-amber-400 font-bold">
          <span>✦</span>
          <span>特训极速向导 · {{ currentStep + 1 }}/{{ steps.length }}</span>
        </div>

        <!-- Prominent, High-contrast Skip Button Giving Full User Agency -->
        <button @click="handleComplete" 
                class="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1">
          <span>跳过引导</span>
          <span class="text-zinc-400">✕</span>
        </button>
      </div>

      <!-- 60FPS Hardware-Accelerated Native Swipe Carousel Container -->
      <div ref="carouselRef"
           @scroll.passive="onCarouselScroll"
           class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none overscroll-x-contain touch-pan-x py-1 w-full gap-4">
        
        <!-- Individual Swipe Slide Card -->
        <div v-for="(slide, idx) in steps" :key="idx" 
             class="w-full flex-shrink-0 snap-center flex flex-col justify-between min-h-[225px] space-y-3">
          
          <!-- Punchy Icon, Tag & Title -->
          <div class="text-center space-y-2">
            <div class="w-13 h-13 mx-auto rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform"
                 :class="slide.iconBg">
              {{ slide.icon }}
            </div>

            <div class="space-y-0.5">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                    :class="slide.tagStyle">
                {{ slide.tag }}
              </span>
              <h3 class="text-base font-black text-white tracking-tight">
                {{ slide.title }}
              </h3>
            </div>
          </div>

          <!-- Ultra-Concise 2-Bullet Feature Pills (Scannable in 3 seconds) -->
          <div class="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-2.5 space-y-1.5 text-left">
            <div v-for="(point, pIdx) in slide.highlights" :key="pIdx"
                 class="flex items-start gap-2 text-xs text-zinc-300">
              <span class="text-amber-400 font-bold text-xs mt-0.5">✓</span>
              <span class="leading-snug" v-html="point"></span>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom: Progress Dots & Swipe Hint / Action Buttons -->
      <div class="space-y-2.5 pt-2 border-t border-zinc-800/80">
        
        <!-- Interactive Progress Dots -->
        <div class="flex justify-center items-center gap-1.5">
          <button v-for="(_, dotIdx) in steps" :key="dotIdx"
                  @click="scrollToStep(dotIdx)"
                  class="h-1.5 rounded-full transition-all duration-300"
                  :class="[
                    currentStep === dotIdx 
                      ? 'w-6 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                      : 'w-1.5 bg-zinc-800 hover:bg-zinc-700'
                  ]"
                  :aria-label="`前往第 ${dotIdx + 1} 步`">
          </button>
        </div>

        <!-- Action Row -->
        <div class="flex items-center gap-2">
          <button v-if="currentStep < steps.length - 1"
                  @click="scrollToStep(currentStep + 1)"
                  class="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5">
            <span>下一步 (或左滑)</span>
            <span>❯</span>
          </button>

          <button v-else
                  @click="handleComplete"
                  class="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 active:scale-98 transition-all flex items-center justify-center gap-1.5">
            <span>🚀 开启特训之旅</span>
          </button>
        </div>

        <!-- Subtle Swipe Hint -->
        <p class="text-[10px] text-center text-zinc-500 font-mono">
          👈 左右滑动自由翻阅
        </p>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { store } from "../store/fitnessStore.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close"]);

const currentStep = ref(0);
const carouselRef = ref(null);

const steps = [
  {
    icon: "🏋️",
    iconBg: "bg-amber-500/15 border border-amber-500/30 text-amber-400",
    tag: "科学推拉腿",
    tagStyle: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    title: "单组超负荷 · 智能基准",
    highlights: [
      "<strong>单组实时比对：</strong>重量提升亮起 <span class='text-amber-400 font-bold'>🔥 PR</span>，次数增加亮起 <span class='text-emerald-400 font-bold'>⚡ 超负荷</span>",
      "<strong>自动排期轮转：</strong>推/拉/腿/休无缝推进，首次打卡自动沉淀为对比基准"
    ]
  },
  {
    icon: "🏆",
    iconBg: "bg-orange-500/15 border border-orange-500/30 text-orange-400",
    tag: "FPS 战力天梯",
    tagStyle: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    title: "做工吨位换算 · 段位勋章",
    highlights: [
      "<strong>7 阶硬核段位：</strong>真实力量做工换算战力分，从【新晋士兵】登顶【全球精英】",
      "<strong>防断练保护：</strong>0~72h 安全恢复零扣分，断练 5 天回归享 150% 爆发加成"
    ]
  },
  {
    icon: "⏱️",
    iconBg: "bg-sky-500/15 border border-sky-500/30 text-sky-400",
    tag: "组间休息",
    tagStyle: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    title: "微型边缘悬浮 · 自由拖拽",
    highlights: [
      "<strong>微型不挡视线：</strong>手指自由拖拽，靠边自动吸附，展开坐标稳固不跳位",
      "<strong>专属高定 HUD：</strong>尚博勒法式黄金腕表光晕与 CS2 拆弹 C4 沉浸音效"
    ]
  },
  {
    icon: "🤖",
    iconBg: "bg-purple-500/15 border border-purple-500/30 text-purple-400",
    tag: "AI 私教教练",
    tagStyle: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    title: "6 大模型直连 · 深度复盘",
    highlights: [
      "<strong>训练后智能复盘：</strong>输出 S~D 级客观评价与中枢神经恢复指南",
      "<strong>非侵入式阅读：</strong>AI 输出时可自由向上滑动查阅，密钥本地加密不上传"
    ]
  },
  {
    icon: "🎭",
    iconBg: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400",
    tag: "形体与高定",
    tagStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    title: "黄金 V-Taper · 减载盾牌",
    highlights: [
      "<strong>形体围度测绘：</strong>测算胸腰比与肩腰比，记录骨骼肌进化轨迹",
      "<strong>战术减载盾牌：</strong>出差、生病或减载周一键开启，战力衰减完全冻结"
    ]
  }
];

function onCarouselScroll(e) {
  const el = e.target;
  if (!el || !el.clientWidth) return;
  const index = Math.round(el.scrollLeft / el.clientWidth);
  if (index >= 0 && index < steps.length && index !== currentStep.value) {
    currentStep.value = index;
  }
}

function scrollToStep(idx) {
  currentStep.value = idx;
  const el = carouselRef.value;
  if (el && el.clientWidth) {
    el.scrollTo({
      left: idx * el.clientWidth,
      behavior: "smooth"
    });
  }
}

function handleComplete() {
  store.settings.hasSeenOnboarding = true;
  emit("close");
}
</script>