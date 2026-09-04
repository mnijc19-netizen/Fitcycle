<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop blur -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <!-- Rules Codex Container -->
      <div class="relative w-full max-w-md bg-[var(--fc-modal-bg,#18181b)] border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-3 border-b border-zinc-800/80 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <svg class="w-4 h-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-black text-white">FitCycle 运动科学与排位规则法典</h3>
              <p class="text-[10px] text-zinc-400 font-mono">GAME RULES & SPORTS SCIENCE CODEX</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer">
            ✕
          </button>
        </div>

      <!-- Category Filter Tabs (Horizontal Scrollable) -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none overscroll-x-contain touch-pan-x">
        <button v-for="tab in ruleCategories" :key="tab.id"
                @click="activeCategory = tab.id"
                class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5"
                :class="[
                  activeCategory === tab.id 
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800/80'
                ]">
          <span>{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </div>

      <!-- Tab Content Panel (Scrollable) -->
      <div class="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs text-zinc-300 leading-relaxed font-sans overscroll-contain"
           style="-webkit-overflow-scrolling: touch;">
        
        <!-- 1. FPS 战力天梯与排位加分 -->
        <div v-if="activeCategory === 'ranking'" class="space-y-3">
          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
              <span>🏆</span> 7 阶绝对天梯段位体系
            </div>
            <p class="text-zinc-400 text-[11px]">
              FitCycle 战力分（FPS）基于你在健身房的真实做工与自律出勤综合评定，涵盖 7 个硬核段位：
            </p>
            <div class="grid grid-cols-2 gap-1.5 font-mono text-[10px] pt-1">
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800"><span class="text-zinc-400 font-bold">1阶 新晋士兵:</span> 0 ~ 499分</div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800"><span class="text-sky-400 font-bold">2阶 英勇先锋:</span> 500 ~ 999分</div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800"><span class="text-indigo-400 font-bold">3阶 坚毅守卫:</span> 1000 ~ 1499分</div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800"><span class="text-purple-400 font-bold">4阶 荣耀大师:</span> 1500 ~ 1999分</div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800"><span class="text-pink-400 font-bold">5阶 超凡战神:</span> 2000 ~ 2499分</div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800"><span class="text-red-400 font-bold">6阶 全球精英:</span> 2500 ~ 2999分</div>
              <div class="col-span-2 p-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/40 text-center">
                <span class="text-amber-300 font-black">7阶 赋能传奇 / 大地球:</span> 3000+ 分 (支持声望转生)
              </div>
            </div>
          </div>

          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
              <span>⚡</span> 做工吨位与加分公式
            </div>
            <p class="text-zinc-300 text-[11px]">
              单场训练加分 = <span class="font-mono text-amber-300 font-bold">基础打卡分 (+20)</span> + <span class="font-mono text-emerald-300 font-bold">做工吨位折算分 (吨位 × 动作强度系数)</span>。深蹲、硬拉等复合大动作将赋予更高做工权重！
            </p>
          </div>

          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
              <span>🎖️</span> 声望转生与年度服役勋章
            </div>
            <p class="text-zinc-300 text-[11px]">
              当战力达到 3000 分巅峰后，用户可选择【声望转生】，积分重置为 800 分，并永久领取当前年度的 CS2 同款声望星级勋章（最高可转生升至 6 阶紫星）！
            </p>
          </div>
        </div>

        <!-- 2. 衰减机制与战术减载 -->
        <div v-else-if="activeCategory === 'decay'" class="space-y-3">
          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="text-orange-400 font-black flex items-center gap-1.5 text-xs">
              <span>⏳</span> 4 阶生物学去适应衰减模型
            </div>
            <p class="text-zinc-400 text-[11px]">
              人体骨骼肌在停训后会经历水分消退与神经募集减弱，FitCycle 采用严格符合运动生理学的平滑衰减曲线：
            </p>
            <div class="space-y-1.5 font-mono text-[10px]">
              <div class="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                <span class="font-bold">0 ~ 72小时 (0-3天):</span> 科学超量恢复黄金期 · <span class="font-bold">100% 绝对保护 (0 扣分)</span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                <span class="font-bold">72 ~ 120小时 (4-5天):</span> 轻微去适应阶段 · 每日微扣 -15 FPS
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-300">
                <span class="font-bold">120 ~ 240小时 (6-10天):</span> 肌糖原消退阶段 · 每日扣减 -35 FPS
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-red-400">
                <span class="font-bold">240小时以上 (10天+):</span> 长期休眠保护底线 · 每日扣减 -60 FPS
              </div>
            </div>
          </div>

          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div class="text-emerald-400 font-black flex items-center gap-1.5 text-xs">
              <span>⚡</span> 150% 爆发复苏加成 (Comeback Boost)
            </div>
            <p class="text-zinc-300 text-[11px]">
              若因工作忙碌停训超过 5 天（$\ge 120\text{h}$），重新回归健身房完成首场打卡时，系统将自动触发 <span class="text-emerald-400 font-bold font-mono">150% 爆发复苏加成</span>，帮助你极速追回掉落分数！
            </p>
          </div>

          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="text-sky-400 font-black flex items-center gap-1.5 text-xs">
              <span>🛡️</span> 战术减载盾牌：运动生理学原理与充能法则
            </div>
            <p class="text-zinc-300 text-[11px] leading-relaxed">
              <strong>为什么需要主动减载？</strong> 在经历 4~6 周（16次+）高强度超负荷训练后，肌肉结缔组织微损伤与中枢神经系统（CNS）疲劳累积达临界值。适时进入 7 天减载期可消解深层疲劳、促发超量恢复，避免过度训练（Overtraining）与运动损伤。
            </p>
            <div class="space-y-1.5 font-mono text-[10px]">
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sky-300">
                <span class="font-bold">✦ 做工充能门槛:</span> 每扎实完成 <span class="font-bold text-amber-300">16 次有效特训打卡</span>（约 1 个月系统化推拉腿），自动充能铸造 1 枚战术盾牌。
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-300">
                <span class="font-bold">✦ 新兵筑基保护:</span> 新手前 16 次打卡处于神经募集筑基期（尚无深层神经疲劳），完成 16 次打卡方可解锁首枚盾牌，杜绝刚练 4 天就躺平。
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                <span class="font-bold">✦ 储备上限:</span> 最多同时储备 <span class="font-bold text-white">2 枚盾牌</span>，防止无限制屯卡。
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-300">
                <span class="font-bold">✦ 激活与效力:</span> 消耗 1 枚盾牌开启 <span class="font-bold">7 天战力绝对冻结期</span>（0 衰减），全站日历与看板同步置为休整状态。
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-orange-300">
                <span class="font-bold">✦ 周期自适应冷却:</span> 每次使用后享有 <span class="font-bold">21 天训练自适应冷却期</span>，确保两次减载之间有充足的超负荷训练积累。
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 渐进超负荷与动作基准 -->
        <div v-else-if="activeCategory === 'overload'" class="space-y-3">
          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
              <span>📈</span> 渐进超负荷比对法则
            </div>
            <p class="text-zinc-300 text-[11px]">
              增肌的核心在于施加超越以往的机械张力。系统在每次打卡时，会自动调取该动作最近一次的历史对应组：
            </p>
            <ul class="space-y-1.5 text-[11px] text-zinc-300 pl-1">
              <li class="flex items-center gap-1.5">
                <span class="text-amber-400">🔥</span> <strong>重量 PR 突破：</strong> 当前组重量超过上次历史，点亮金色火焰微标。
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-emerald-400">⚡</span> <strong>次数超负荷：</strong> 相同重量下完成更多有效次数，点亮翡翠能量光环。
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-zinc-400">✓</span> <strong>达成基准：</strong> 重量与次数与上次持平，巩固力量平台。
              </li>
              <li class="flex items-center gap-1.5">
                <span class="text-sky-400">🌱</span> <strong>首训建档：</strong> 首次完成动作自动沉淀为基准，供未来对比。
              </li>
            </ul>
          </div>

          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
              <span>🌙</span> 跨午夜训练与单日多练
            </div>
            <p class="text-zinc-300 text-[11px]">
              夜猫子训练（如 23:30 开始练到次日 00:30），训练日归属于起练日；单日多次训练（如早晨晨跑+晚上力量）做工容量全额合并累计，出勤打卡精确计为 1 次。
            </p>
          </div>
        </div>

        <!-- 4. 形体测绘与美学比例 -->
        <div v-else-if="activeCategory === 'body'" class="space-y-3">
          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="text-purple-400 font-black flex items-center gap-1.5 text-xs">
              <span>📐</span> 黄金 V-Taper 倒三角比例
            </div>
            <p class="text-zinc-300 text-[11px]">
              通过记录胸围、腰围、臂围与大腿围，系统基于解剖学标准自动计算视觉比例：
            </p>
            <div class="space-y-1 font-mono text-[10px]">
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between">
                <span>胸腰比 (Chest/Waist):</span>
                <span class="text-purple-300 font-bold">黄金标准 1.25 ~ 1.35+</span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between">
                <span>肩腰比 (Shoulder/Waist):</span>
                <span class="text-purple-300 font-bold">经典健美大师 1.40 ~ 1.618</span>
              </div>
            </div>
          </div>

          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1.5">
            <div class="text-purple-400 font-black flex items-center gap-1.5 text-xs">
              <span>⏱️</span> 7 天测绘防刷冷却与勋章
            </div>
            <p class="text-zinc-300 text-[11px]">
              围度测绘每 7 天最多计入 1 次基础出勤积分（+20 FPS）；当真实形体改善达 $\ge 1\text{cm}$ 时，将解锁专属形体蜕变勋章与丰厚声望加成！
            </p>
          </div>
        </div>

        <!-- 5. AI 私教与隐私安全 -->
        <div v-else-if="activeCategory === 'ai'" class="space-y-3">
          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="text-emerald-400 font-black flex items-center gap-1.5 text-xs">
              <span>🔒</span> 本地离线隐私沙箱
            </div>
            <p class="text-zinc-300 text-[11px]">
              FitCycle 采用 100% 离线优先架构。你的所有训练日志、形体围度以及配置的 AI API 密钥，全部**仅保存在你当前手机浏览器的 LocalStorage 中**，绝不经过任何第三方服务器中转。
            </p>
          </div>

          <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
            <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
              <span>💾</span> 数据备份与无损迁移
            </div>
            <p class="text-zinc-300 text-[11px]">
              支持在【统计设置】一键导出完整 JSON 备份文件，换手机或更换浏览器时导入即可秒级恢复 100% 历史战绩与排位！
            </p>
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div class="pt-2 border-t border-zinc-800/80 flex-shrink-0">
        <button @click="$emit('close')"
                class="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl text-xs transition-colors">
          我已了解
        </button>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
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

const activeCategory = ref("ranking");

const ruleCategories = [
  { id: "ranking", name: "战力天梯与排位", icon: "🏆" },
  { id: "decay", name: "衰减与减载盾牌", icon: "⏳" },
  { id: "overload", name: "超负荷与基准", icon: "⚡" },
  { id: "body", name: "形体测绘与比例", icon: "📐" },
  { id: "ai", name: "隐私与数据安全", icon: "🔒" }
];
</script>