<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop blur overlay -->
    <div class="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity" @click="handleComplete"></div>

    <!-- Onboarding Card Container -->
    <div class="relative w-full max-w-sm bg-zinc-950 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 overflow-hidden animate-in zoom-in-95 duration-200">
      
      <!-- Top Header Row: Step Tracker & Skip Button -->
      <div class="flex items-center justify-between text-xs pb-1 border-b border-zinc-800/80">
        <div class="flex items-center gap-1.5 font-mono text-[11px] text-amber-400 font-bold">
          <span>✦</span>
          <span>新兵特训领航 · {{ currentStep + 1 }}/{{ steps.length }}</span>
        </div>
        <button @click="handleComplete" class="text-zinc-500 hover:text-zinc-300 text-xs px-2 py-0.5 rounded-lg hover:bg-zinc-900 transition-colors">
          跳过引导 ✕
        </button>
      </div>

      <!-- Slide Content Presentation -->
      <div class="py-2 space-y-4 min-h-[310px] flex flex-col justify-between">
        
        <!-- Animated Hero Visual Icon & Badge -->
        <div class="space-y-3 text-center">
          <div class="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-xl transition-all duration-300 transform hover:scale-105"
               :class="steps[currentStep].iconBg">
            {{ steps[currentStep].icon }}
          </div>

          <div class="space-y-1">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                  :class="steps[currentStep].tagStyle">
              {{ steps[currentStep].tag }}
            </span>
            <h3 class="text-lg font-black text-white tracking-tight leading-snug">
              {{ steps[currentStep].title }}
            </h3>
            <p class="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto pt-1">
              {{ steps[currentStep].desc }}
            </p>
          </div>
        </div>

        <!-- Highlight Key Highlights Pill List -->
        <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 space-y-2 text-left">
          <div v-for="(point, pIdx) in steps[currentStep].highlights" :key="pIdx"
               class="flex items-start gap-2 text-xs text-zinc-300">
            <span class="text-amber-400 font-bold text-sm leading-none mt-0.5">✓</span>
            <span class="leading-relaxed">{{ point }}</span>
          </div>
        </div>

      </div>

      <!-- Bottom Step Dots & Navigation Buttons -->
      <div class="space-y-3 pt-2 border-t border-zinc-800/80">
        <!-- Progress Dots Indicator -->
        <div class="flex justify-center items-center gap-1.5">
          <button v-for="(_, dotIdx) in steps" :key="dotIdx"
                  @click="currentStep = dotIdx"
                  class="h-1.5 rounded-full transition-all duration-300"
                  :class="[
                    currentStep === dotIdx 
                      ? 'w-6 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                      : 'w-1.5 bg-zinc-800 hover:bg-zinc-700'
                  ]"
                  :aria-label="`前往第 ${dotIdx + 1} 步`">
          </button>
        </div>

        <!-- Action Buttons Row -->
        <div class="flex items-center gap-2">
          <button v-if="currentStep > 0" 
                  @click="currentStep--"
                  class="w-1/3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-xl text-xs font-bold active:scale-95 transition-all">
            上一步
          </button>

          <button v-if="currentStep < steps.length - 1"
                  @click="currentStep++"
                  class="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-1.5">
            <span>下一步</span>
            <span>❯</span>
          </button>

          <button v-else
                  @click="handleComplete"
                  class="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 active:scale-98 transition-all flex items-center justify-center gap-1.5">
            <span>🚀 开启特训之旅</span>
          </button>
        </div>
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

const steps = [
  {
    icon: "🏋️",
    iconBg: "bg-amber-500/20 border border-amber-500/40 text-amber-400",
    tag: "推拉腿 · 极速打卡",
    tagStyle: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    title: "科学推拉腿与超负荷对比",
    desc: "内置经典推拉腿分化循环，每次训练自动调取历史记录，让每一次进步都清晰可见。",
    highlights: [
      "单组实时比对：重量突破亮起【🔥 PR 徽标】，次数提升亮起【⚡ 超负荷】",
      "自动分化轮转：推/拉/腿/休无缝排期，支持自由加练与动作替换",
      "首训自动建档：第一次做动作自动记录为未来对比的法定基准"
    ]
  },
  {
    icon: "🏆",
    iconBg: "bg-orange-500/20 border border-orange-500/40 text-orange-400",
    tag: "战力天梯 · 排位排位",
    tagStyle: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    title: "FPS 战力天梯与年度服役勋章",
    desc: "将严谨的运动做工吨位转化为电竞段位，用真正的汗水解锁专属荣誉与勋章墙。",
    highlights: [
      "0~3000+ 积分：从【新晋士兵】一路晋升至【全球精英 / 赋能特工】",
      "4 阶科学防断练：0~72h 安全恢复不扣分，断练 5 天回归触发 150% 爆发复苏",
      "年度服役勋章：满 3000 分支持声望转生，领取 CS2 同款 6 阶转生年度勋章"
    ]
  },
  {
    icon: "⏱️",
    iconBg: "bg-sky-500/20 border border-sky-500/40 text-sky-400",
    tag: "组间休息 · 智能悬浮",
    tagStyle: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    title: "C4 / 尚博勒专属组间悬浮倒计时",
    desc: "专为手机端优化的边缘吸附悬浮窗，组间休息随时掌控，绝不遮挡做组视线。",
    highlights: [
      "微型悬浮不挡视线：支持手指自由拖拽，靠边自动吸附",
      "轻点自适应展开：在右侧向左展开，在左侧向右展开，坐标稳固不跳动",
      "专属皮肤音画：CS2 拆弹 C4 滴答声与尚博勒官方黄金腕表光晕"
    ]
  },
  {
    icon: "🤖",
    iconBg: "bg-purple-500/20 border border-purple-500/40 text-purple-400",
    tag: "AI 私教 · 深度复盘",
    tagStyle: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    title: "AI 智能体教练与 6 大厂商直连",
    desc: "无缝接入 DeepSeek、通义千问、智谱 GLM、OpenAI，训练结束后即时 S~D 级科学评语。",
    highlights: [
      "全方位客观复盘：基于渐进超负荷与中枢疲劳生成定制恢复建议",
      "非侵入式阅读：AI 输出打字时自由向上滑动查阅，杜绝强制滚动跳动",
      "本地安全沙箱：API 密钥只存放在手机本地浏览器，数据永不上传云端"
    ]
  },
  {
    icon: "🎭",
    iconBg: "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400",
    tag: "高定皮肤 · 形体测绘",
    tagStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    title: "电竞高定皮肤与黄金 V-Taper 测绘",
    desc: "在科学健美、CS2 战术特训与尚博勒法式高定间自由切换，记录形体黄金比例。",
    highlights: [
      "三大主题无缝切换：一键更换整套视觉调色盘、导航图标与 HUD 音效",
      "形体围度追踪：测算胸腰比、肩腰比，可视化记录骨骼肌形体进化",
      "战术减载盾牌：出差/受伤/减载周可一键开启免战保护，战力分完全冻结"
    ]
  }
];

function handleComplete() {
  store.settings.hasSeenOnboarding = true;
  emit("close");
}
</script>