<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Non-intrusive Translucent Backdrop (Allows user to see the page underneath) -->
      <div class="absolute inset-0" @click="handleComplete"></div>

      <!-- Floating Glassmorphic Sheet Modal with Dynamic Ambient Aura -->
      <div class="relative w-full max-w-sm bg-zinc-950/95 border rounded-3xl p-4 shadow-2xl backdrop-blur-2xl space-y-3 overflow-hidden animate-in zoom-in-95 duration-200 transition-colors"
           :class="currentSlideTheme.border">
      
      <!-- Dynamic Ambient Lighting Pulse Background -->
      <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
           :class="currentSlideTheme.glow"></div>

      <!-- Top Row: Navigation Category Tabs & Prominent Skip Button -->
      <div class="flex items-center justify-between pb-2 border-b border-zinc-800/80 relative z-10">
        <div class="flex items-center gap-1.5 font-mono text-[11px] font-bold"
             :class="currentSlideTheme.textColor">
          <span class="animate-pulse">✦</span>
          <span>特训全景向导 · {{ currentStep + 1 }}/{{ steps.length }}</span>
        </div>

        <!-- Prominent, High-contrast Skip Button Giving Full User Agency -->
        <button @click="handleComplete" 
                class="px-3 py-1 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1">
          <span>跳过引导</span>
          <span class="text-zinc-400">✕</span>
        </button>
      </div>

      <!-- Top Category Quick Pill Switcher -->
      <div class="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 relative z-10">
        <button v-for="(s, idx) in steps" :key="idx"
                @click="scrollToStep(idx)"
                class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all border"
                :class="[
                  currentStep === idx 
                    ? `${s.tagStyle} shadow-sm scale-105` 
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
                ]">
          {{ s.shortTag }}
        </button>
      </div>

      <!-- 60FPS Hardware-Accelerated Native Swipe Carousel Container -->
      <div ref="carouselRef"
           @scroll.passive="onCarouselScroll"
           class="flex overflow-x-auto snap-x snap-mandatory scrollbar-none overscroll-x-contain touch-pan-x py-1 w-full gap-4 relative z-10">
        
        <!-- Individual Swipe Slide Card -->
        <div v-for="(slide, idx) in steps" :key="idx" 
             class="w-full flex-shrink-0 snap-center flex flex-col justify-between min-h-[305px] space-y-3">
          
          <!-- Interactive Visual Demo Preview Stage (沉浸式功能微缩展演舞台) -->
          <div class="rounded-2xl p-3 border shadow-inner relative overflow-hidden bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-zinc-950/95"
               :class="slide.stageBorder">

            <!-- SLIDE 0: 渐进超负荷与单组比对 -->
            <div v-if="idx === 0" class="space-y-2 text-left">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-white flex items-center gap-1">
                  <span>🏋️</span> 杠铃卧推 · 第 1 组
                </span>
                <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-black border border-amber-500/40 animate-pulse">
                  🔥 PR 新纪录 +5kg
                </span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div class="text-sm font-black font-mono text-white">100.0 kg × 8 次</div>
                  <div class="text-[9px] text-zinc-400 font-mono">上次基准: 95.0kg × 8次</div>
                </div>
                <span class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  ⚡ 渐进超负荷
                </span>
              </div>
            </div>

            <!-- SLIDE 1: FPS 战力天梯与排位 -->
            <div v-else-if="idx === 1" class="space-y-2 text-left">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-white flex items-center gap-1">
                  <span>🏆</span> CS2 战力天梯排位
                </span>
                <span class="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-[9px] font-bold border border-orange-500/40">
                  2,950 FPS
                </span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-900/90 border border-orange-500/30 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">👑</span>
                  <div>
                    <div class="text-xs font-black text-white">全球精英 (The Global Elite)</div>
                    <div class="text-[9px] text-zinc-400">已解锁 6 阶至尊服役勋章</div>
                  </div>
                </div>
                <span class="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  0~72h 0扣分
                </span>
              </div>
            </div>

            <!-- SLIDE 2: 尚博勒高定法式金表 & 边缘悬浮倒计时 -->
            <div v-else-if="idx === 2" class="space-y-2 text-left">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-amber-300 flex items-center gap-1">
                  <span>⚜️</span> 尚博勒法式高定金表 HUD
                </span>
                <span class="text-[9px] font-mono text-sky-300">微型边缘吸附</span>
              </div>
              <div class="p-2 rounded-xl bg-[#090E17] border border-[#E5C378]/40 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg overflow-hidden border border-[#E5C378]/60 bg-black/80 flex items-center justify-center shadow-[0_0_10px_rgba(229,195,120,0.3)]">
                    <img :src="watchIcon" alt="Watch" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div class="text-xs font-black font-mono text-amber-300">01:30 组间休息</div>
                    <div class="text-[9px] text-zinc-400">展开坐标稳固 · 零跳位</div>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <span class="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-zinc-300">+30s</span>
                </div>
              </div>
            </div>

            <!-- SLIDE 3: AI 私教教练深度复盘 -->
            <div v-else-if="idx === 3" class="space-y-2 text-left">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-purple-300 flex items-center gap-1">
                  <span>✦</span> Fitcycle AI 深度复盘
                </span>
                <span class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold border border-purple-500/40">
                  评级 S+
                </span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-900/90 border border-purple-500/30 text-[10px] text-zinc-300 space-y-1">
                <p class="leading-relaxed">
                  “本场推日做工达 <span class="text-purple-300 font-bold font-mono">4.2 吨</span>，上胸与三头超负荷达标，建议补充优质蛋白与电解质！”
                </p>
                <div class="text-[9px] text-zinc-400 font-mono flex items-center gap-1 pt-0.5">
                  <span>🔒 本地密钥加密</span> · <span>⚡ 支持自由滑动阅读</span>
                </div>
              </div>
            </div>

            <!-- SLIDE 4: 战术减载盾牌与形体测绘 -->
            <div v-else-if="idx === 4" class="space-y-2 text-left">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-sky-300 flex items-center gap-1">
                  <span>🛡️</span> 战术减载盾牌与形体
                </span>
                <span class="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[9px] font-bold border border-sky-500/40">
                  做工充能
                </span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-900/90 border border-sky-500/30 flex items-center justify-between gap-2">
                <div>
                  <div class="text-xs font-black text-white flex items-center gap-1">
                    <span>🛡️ 盾牌储备: 1/2 枚</span>
                  </div>
                  <div class="text-[9px] text-zinc-400 font-mono">每16次打卡铸造 · 冻结7天战力</div>
                </div>
                <div class="text-right font-mono text-[9px]">
                  <span class="text-emerald-400 font-bold block">📐 胸腰比 1.42</span>
                  <span class="text-zinc-500">黄金 V-Taper</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Title & Subtitle -->
          <div class="text-center space-y-1">
            <h3 class="text-base font-black text-white tracking-tight">
              {{ slide.title }}
            </h3>
            <p class="text-[11px] text-zinc-400">
              {{ slide.subTitle }}
            </p>
          </div>

          <!-- Ultra-Concise 2-Bullet Feature Pills -->
          <div class="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-2.5 space-y-1.5 text-left">
            <div v-for="(point, pIdx) in slide.highlights" :key="pIdx"
                 class="flex items-start gap-2 text-xs text-zinc-300">
              <span class="text-amber-400 font-bold text-xs mt-0.5 flex-shrink-0">✓</span>
              <span class="leading-snug" v-html="point"></span>
            </div>
          </div>

        </div>

      </div>

      <!-- Bottom: Progress Dots & Action Buttons -->
      <div class="space-y-2.5 pt-2 border-t border-zinc-800/80 relative z-10">
        
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
                  class="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span>开启特训之旅</span>
          </button>
        </div>

        <!-- Subtle Swipe Hint -->
        <p class="text-[10px] text-center text-zinc-500 font-mono">
          左右滑动自由探索
        </p>

      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { store } from "../store/fitnessStore.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const currentStep = ref(0);
const carouselRef = ref(null);
const watchIcon = "./themes/chamber/icons/chamber-luxury-watch.svg";

const steps = [
  {
    shortTag: "🏋️ 超负荷",
    tagStyle: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    stageBorder: "border-amber-500/30",
    glow: "bg-amber-500",
    border: "border-amber-500/40 shadow-amber-500/10",
    textColor: "text-amber-400",
    title: "单组渐进超负荷 · 智能基准",
    subTitle: "每一组重量与次数，均有科学历史参照",
    highlights: [
      "<strong>单组即时比对：</strong>做工突破亮起 <span class='text-amber-400 font-bold'>🔥 PR</span>，次数增加亮起 <span class='text-emerald-400 font-bold'>⚡ 超负荷</span>",
      "<strong>全自动排期推进：</strong>推/拉/腿/休平滑轮转，首训自动沉淀为基准档案"
    ]
  },
  {
    shortTag: "🏆 战力天梯",
    tagStyle: "bg-orange-500/15 text-orange-300 border-orange-500/40",
    stageBorder: "border-orange-500/30",
    glow: "bg-orange-500",
    border: "border-orange-500/40 shadow-orange-500/10",
    textColor: "text-orange-400",
    title: "做工吨位换算 · 7 阶硬核天梯",
    subTitle: "CS2 同款官方荣誉转生与服役勋章体系",
    highlights: [
      "<strong>真实力量折算战力：</strong>从【新晋士兵】登顶【全球精英】，告别虚标",
      "<strong>生理防断练保护：</strong>0~72h 安全期零扣分，断练回归享 150% 爆发加成"
    ]
  },
  {
    shortTag: "⏱️ 悬浮金表",
    tagStyle: "bg-sky-500/15 text-sky-300 border-sky-500/40",
    stageBorder: "border-sky-500/30",
    glow: "bg-sky-500",
    border: "border-sky-500/40 shadow-sky-500/10",
    textColor: "text-sky-400",
    title: "尚博勒高定金表 · 边缘悬浮倒计时",
    subTitle: "微型视效不遮挡，靠边稳固吸附",
    highlights: [
      "<strong>微型零遮挡 HUD：</strong>手指自由拖拽，靠边自动吸附，展开坐标绝对稳固",
      "<strong>沉浸音效与提醒：</strong>组间休息结束触发微震动与法式高定金光呼吸环"
    ]
  },
  {
    shortTag: "🤖 AI 私教",
    tagStyle: "bg-purple-500/15 text-purple-300 border-purple-500/40",
    stageBorder: "border-purple-500/30",
    glow: "bg-purple-500",
    border: "border-purple-500/40 shadow-purple-500/10",
    textColor: "text-purple-400",
    title: "6 大大模型直连 · 训练深度复盘",
    subTitle: "输出 S~D 级客观评价与中枢神经恢复指南",
    highlights: [
      "<strong>全场多维度复盘：</strong>分析容量、心率储备与弱项肌群刺激深度",
      "<strong>非侵入式阅读体验：</strong>AI 输出时可自由向上滑动查阅，密钥本地加密"
    ]
  },
  {
    shortTag: "🛡️ 减载形体",
    tagStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    stageBorder: "border-emerald-500/30",
    glow: "bg-emerald-500",
    border: "border-emerald-500/40 shadow-emerald-500/10",
    textColor: "text-emerald-400",
    title: "战术减载盾牌 · 黄金 V-Taper 测绘",
    subTitle: "科学周期化减载与骨骼肌进化轨迹",
    highlights: [
      "<strong>战术免战盾牌：</strong>每完成 16 次训练充能 1 枚，激活冻结 7 天战力衰减",
      "<strong>黄金形体测绘：</strong>严谨追踪胸腰比、臂围与肩宽，雕刻古典阿诺德比例"
    ]
  }
];

const currentSlideTheme = computed(() => {
  return steps[currentStep.value] || steps[0];
});

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