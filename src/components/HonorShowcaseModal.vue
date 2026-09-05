<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100">
        
        <!-- Top Ergonomic Grabber Pill -->
        <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0"></div>

        <!-- Modal Header -->
        <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-black tracking-wide" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">荣誉殿堂 · 战力天梯</h2>
              <p class="text-[10px] text-zinc-400 font-mono">{{ honorData.presentation.skinName }}</p>
            </div>
          </div>
          <button @click="$emit('close')" 
                  class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition-all cursor-pointer">
            ✕
          </button>
        </div>

      <!-- Scrollable Content -->
      <div class="p-4 overflow-y-auto space-y-4 scrollbar-thin flex-1 overscroll-contain"
           style="-webkit-overflow-scrolling: touch; touch-action: pan-y;">
        
        <!-- Hero Rank Card -->
        <div class="relative overflow-hidden rounded-2xl border p-4 shadow-lg text-center space-y-3"
             :class="store.settings.themeMode === 'light' ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-amber-500/30 shadow-slate-200/50' : 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-amber-500/40 shadow-black/50'">
          
          <!-- Tactical Aura Background Glow -->
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Medal Badge Icon (Clean & Unobstructed) -->
          <div class="flex items-center justify-center">
            <div class="w-28 h-28 rounded-3xl border-2 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center p-3.5 transform hover:scale-105 transition-transform"
                 :class="store.settings.themeMode === 'light' ? 'bg-white border-amber-500/50' : 'bg-zinc-950/90 border-amber-500/70'">
              <img v-if="honorData.presentation.tierSvg" :src="honorData.presentation.tierSvg" alt="Rank Medal" class="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
              <span v-else class="text-4xl">{{ honorData.presentation.tierIcon }}</span>
            </div>
          </div>

          <!-- Rank Titles & Service Medal Chips -->
          <div class="space-y-1 pt-1">
            <div class="text-lg font-black tracking-wide flex items-center justify-center gap-1.5"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
              <span>{{ honorData.presentation.tierName }}</span>
            </div>
            <p class="text-xs text-amber-400/90 font-mono">{{ honorData.presentation.tierSub }}</p>

            <!-- Distinct Annual Prestige Badge Pill (Non-Overlapping) -->
            <div class="flex items-center justify-center gap-1.5 pt-1.5">
              <div class="px-3 py-1 rounded-full text-[10px] font-black border tracking-wider flex items-center gap-1.5 shadow-sm"
                   :style="{ backgroundColor: prestigeInfo.glow, borderColor: prestigeInfo.border, color: prestigeInfo.color }">
                <img v-if="prestigeSvg" :src="prestigeSvg" alt="Prestige Star" class="w-3.5 h-3.5 object-contain inline-block" />
                <span>{{ prestigeInfo.name }}</span>
              </div>
              <div class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-400">
                {{ honorData.prestigeYear }} 年度
              </div>
            </div>
          </div>

          <!-- FPS Score & Decay Notice -->
          <div class="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
            <div class="text-left">
              <span class="text-zinc-500 text-[10px] block">综合战力积分 (FPS)</span>
              <span class="text-base font-black text-amber-400">{{ honorData.score }} <span class="text-[10px] text-zinc-500">PTS</span></span>
            </div>
            
            <div class="text-right">
              <span class="text-zinc-500 text-[10px] block">历史最高</span>
              <span class="text-xs font-bold text-zinc-300">{{ honorData.highestScore }} PTS</span>
            </div>
          </div>

          <!-- Tactical Deload Shield Inventory & Status Module -->
          <div class="p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-2.5 text-left">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                <span>🛡️</span>
                <span>战术减载免战盾牌</span>
              </div>
              <span class="text-[10px] font-mono font-black px-2 py-0.5 rounded-full border"
                    :class="honorData.shieldInventory.available > 0 ? 'bg-sky-500/15 border-sky-500/40 text-sky-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'">
                储备: {{ honorData.shieldInventory.available }}/{{ honorData.shieldInventory.maxCapacity }} 枚
              </span>
            </div>

            <!-- Shield Charging Progress Bar (1 Shield per 16 Unique Training Days) -->
            <div class="space-y-1">
              <div class="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span v-if="honorData.shieldInventory.isNoviceProbation" class="text-amber-400 font-bold">🌱 新兵筑基期 ({{ honorData.shieldInventory.currentChargeWorkouts }}/16 天)</span>
                <span v-else>下一枚充能: {{ honorData.shieldInventory.currentChargeWorkouts }}/16 天训练 (每日计1天)</span>
                <span class="text-sky-300 font-bold">还需 {{ honorData.shieldInventory.nextShieldRemaining }} 天打卡</span>
              </div>
              <div class="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div class="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500 rounded-full"
                     :style="{ width: `${honorData.shieldInventory.chargePercent}%` }"></div>
              </div>
            </div>

            <!-- Scientific Periodization Rationale & Physiological Reason -->
            <div class="p-2.5 rounded-xl bg-zinc-950 border border-sky-500/20 text-[10px] space-y-1 text-zinc-400">
              <div class="flex items-center gap-1 text-sky-300 font-bold">
                <span>🧬</span>
                <span>运动生理减载原理 (Deload Science)</span>
              </div>
              <p class="leading-relaxed text-zinc-300">
                连续规律特训 4~6 周（16天+，同日多次打卡仅计1天）后，中枢神经与肌腱劳损达临界值，需 7 天主动减载以消解疲劳、促发超量恢复。
              </p>
              <div class="flex items-center justify-between text-[9px] text-zinc-400 pt-0.5 border-t border-zinc-800/80 font-mono">
                <span>⚡ 门槛：每 16 天特训铸造 1 枚</span>
                <span>⏳ 冷却：使用后享 21 天自适应期</span>
              </div>
            </div>

            <!-- Shield Dynamic Status Banner & Action Button -->
            <!-- 1. Active State -->
            <div v-if="honorData.isDeloadActive"
                 class="p-2.5 rounded-xl bg-sky-950/60 border border-sky-500/50 text-[11px] text-sky-300 flex items-center justify-between gap-2 shadow-sm shadow-sky-500/20">
              <div class="flex items-center gap-2">
                <span class="text-base">🛡️</span>
                <span class="leading-tight font-medium">免战盾生效中 (剩余 {{ honorData.shieldDaysRemaining }} 天免扣分)</span>
              </div>
              <button @click="handleToggleDeload(false)" class="text-[10px] px-2.5 py-1 rounded-lg bg-sky-900 hover:bg-sky-800 text-sky-200 border border-sky-600/50 font-bold whitespace-nowrap active:scale-95 transition-all">
                提前归队
              </button>
            </div>

            <!-- 2. Cooldown State -->
            <div v-else-if="honorData.isCooldownActive"
                 class="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between gap-1.5">
              <span>⏳ 周期化自适应冷却中 (还需 {{ honorData.cooldownDaysRemaining }} 天)</span>
              <span class="text-zinc-600 font-mono text-[9px]">规律训练中</span>
            </div>

            <!-- 3. Ready to Activate -->
            <div v-else-if="honorData.shieldInventory.available > 0"
                 class="flex items-center justify-between gap-2 pt-0.5">
              <span class="text-[10px] text-zinc-400">消耗 1 枚盾牌，冻结 7 天战力衰减</span>
              <button @click="handleToggleDeload(true)" 
                      class="text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1">
                <span>🛡️</span>
                <span>激活 7 天免战盾</span>
              </button>
            </div>

            <!-- 4. No Shields Available (Novice vs Veteran) -->
            <div v-else class="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
              <span v-if="honorData.shieldInventory.isNoviceProbation" class="text-zinc-400">新兵筑基中，完成 16 次打卡自动解锁首枚</span>
              <span v-else>暂无可用盾牌，完成 16 次特训即可自动铸造</span>
              <span class="font-mono text-sky-400 font-bold">做工充能</span>
            </div>
          </div>

          <!-- Progression Bar to Next Tier -->
          <div v-if="!honorData.tier.isApex" class="space-y-1 text-left">
            <div class="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
              <span>下一阶晋级进度</span>
              <span class="text-amber-400 font-bold">{{ honorData.tier.progressPercent }}% ({{ honorData.score }} / {{ honorData.tier.nextTierScore }})</span>
            </div>
            <div class="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
                   :style="{ width: `${honorData.tier.progressPercent}%` }"></div>
            </div>
          </div>
          
          <div v-else class="pt-1">
            <button v-if="honorData.score >= 2900 && honorData.prestigeLevel < 6" 
                    @click="handlePrestigeReset"
                    class="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-lg shadow-purple-500/30 transition-all active:scale-95">
              👑 开启年度荣誉转生 (升阶至 {{ honorData.prestigeLevel + 1 }} 阶服役勋章)
            </button>
          </div>

        </div>

        <!-- Badges Specialization Wall -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-black text-zinc-200">三大专精荣誉勋章 (已解锁 {{ unlockedCount }} 枚)</h3>
            <span class="text-[10px] font-mono text-zinc-500">点击查看达成条件</span>
          </div>

          <!-- Badges Filter Tabs -->
          <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-mono">
            <button v-for="tab in filterTabs" :key="tab.key"
                    @click="activeBadgeTab = tab.key"
                    class="px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all"
                    :class="activeBadgeTab === tab.key 
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 font-black' 
                      : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'">
              {{ tab.label }}
            </button>
          </div>

          <!-- Badges Grid -->
          <div class="grid grid-cols-2 gap-2">
            <div v-for="badge in visibleBadges" :key="badge.id"
                 class="p-2.5 rounded-2xl border transition-all flex items-start gap-2 text-left relative overflow-hidden"
                 :class="badge.unlocked 
                   ? 'bg-zinc-950/90 border-amber-500/60 shadow-sm shadow-amber-500/10' 
                   : 'bg-zinc-950/40 border-zinc-800/80 opacity-60'">
              
              <!-- Vector Medal SVG or Fallback Icon -->
              <div class="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center flex-shrink-0 p-1 shadow-sm"
                   :class="badge.unlocked ? 'border-amber-500/40' : 'border-zinc-800'">
                <img v-if="badge.svg" :src="badge.svg" :alt="badge.name" class="w-full h-full object-contain" 
                     :class="badge.unlocked ? 'filter drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]' : 'grayscale opacity-40'" />
                <span v-else class="text-xl">{{ badge.icon || '🎖️' }}</span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1">
                  <span class="text-xs font-bold font-mono truncate" :class="badge.unlocked ? 'text-amber-300' : 'text-zinc-400'">
                    {{ badge.name }}
                  </span>
                  <span v-if="badge.unlocked" class="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                </div>
                <p class="text-[10px] text-zinc-500 leading-tight line-clamp-2 mt-0.5">{{ badge.desc }}</p>
              </div>

            </div>
          </div>

        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-3 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-[11px] text-zinc-400 flex-shrink-0">
        <button @click="$emit('open-rules')" 
                class="hover:text-amber-400 active:scale-95 cursor-pointer flex items-center gap-1 transition-all text-[11px] text-zinc-400">
          <span>📜 排位与衰减规则法典</span>
          <span class="text-[10px] text-amber-500">❯</span>
        </button>
        <button @click="$emit('close')" class="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer">
          关闭
        </button>
      </div>

    </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { getFullHonorProfile, performPrestigeReset, toggleDeloadShield } from "../store/fitnessStore.js";
import { PRESTIGE_MEDAL_COLORS } from "../engine/honorEngine.js";
import { PRESTIGE_MEDAL_SVGS } from "../engine/skinHonorSchemas.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(["close", "open-rules"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const activeBadgeTab = ref("all");

const honorData = computed(() => getFullHonorProfile());

const prestigeInfo = computed(() => {
  const level = honorData.value.prestigeLevel || 1;
  return PRESTIGE_MEDAL_COLORS[level - 1] || PRESTIGE_MEDAL_COLORS[0];
});

const prestigeSvg = computed(() => {
  const level = honorData.value.prestigeLevel || 1;
  return PRESTIGE_MEDAL_SVGS[level] || PRESTIGE_MEDAL_SVGS[1];
});

const filterTabs = [
  { key: "all", label: "全部勋章" },
  { key: "consistency", label: "自律与吨位" },
  { key: "aesthetics", label: "形体围度" },
  { key: "strength", label: "极限力量" },
  { key: "tactical", label: "战术彩蛋" }
];

const unlockedCount = computed(() => honorData.value.badges.filter(b => b.unlocked).length);

const visibleBadges = computed(() => {
  const all = honorData.value.badges;
  if (activeBadgeTab.value === "all") return all;
  if (activeBadgeTab.value === "consistency") return all.filter(b => b.category === "consistency" || b.category === "tonnage");
  return all.filter(b => b.category === activeBadgeTab.value);
});

function handleToggleDeload(enable) {
  if (enable) {
    if (confirm("🛡️ 确认消耗 1 枚战术盾牌开启【7天战术减载免战期】？\n\n期间战力怠惰衰减将完全冻结（0扣分），适合主动减载周或伤病休养！")) {
      const res = toggleDeloadShield(true, 7);
      if (!res.success) {
        alert(res.message);
      }
    }
  } else {
    toggleDeloadShield(false);
  }
}

function handlePrestigeReset() {
  if (confirm("确定要开启年度荣誉转生吗？您将获得更高阶的稀有服役勋章！")) {
    performPrestigeReset();
  }
}
</script>