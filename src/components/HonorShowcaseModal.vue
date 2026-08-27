<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
    <div class="bg-zinc-900 border border-zinc-700/80 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100">
      
      <!-- Modal Header -->
      <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60 flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-xl">🏆</span>
          <div>
            <h2 class="text-sm font-black text-white tracking-wide">荣誉殿堂 · 战力天梯</h2>
            <p class="text-[10px] text-zinc-400 font-mono">{{ honorData.presentation.skinName }}</p>
          </div>
        </div>
        <button @click="$emit('close')" 
                class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition-all">
          ✕
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="p-4 overflow-y-auto space-y-4 scrollbar-thin flex-1">
        
        <!-- Hero Rank Card -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/40 p-4 shadow-lg shadow-black/50 text-center space-y-3">
          
          <!-- Tactical Aura Background Glow -->
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Medal Badge Icon -->
          <div class="relative inline-flex items-center justify-center">
            <div class="w-20 h-20 rounded-2xl bg-zinc-900 border-2 border-amber-500/80 shadow-lg shadow-amber-500/20 flex items-center justify-center text-4xl transform hover:scale-105 transition-transform">
              {{ honorData.presentation.tierIcon }}
            </div>
            <!-- Annual Prestige Badge Tag -->
            <div class="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[9px] font-black border tracking-wider"
                 :style="{ backgroundColor: prestigeInfo.glow, borderColor: prestigeInfo.border, color: prestigeInfo.color }">
              {{ prestigeInfo.name }}
            </div>
          </div>

          <!-- Rank Titles -->
          <div class="space-y-0.5 pt-1">
            <div class="text-lg font-black text-white tracking-wide flex items-center justify-center gap-1.5">
              <span>{{ honorData.presentation.tierName }}</span>
            </div>
            <p class="text-xs text-amber-400/90 font-mono">{{ honorData.presentation.tierSub }}</p>
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

          <!-- Inactivity Status Notice -->
          <div v-if="honorData.decayInfo.decayPoints > 0" 
               class="p-2 rounded-xl bg-red-950/50 border border-red-500/40 text-[11px] text-red-300 text-left flex items-center gap-2">
            <span>🚨</span>
            <span class="leading-tight">{{ honorData.decayInfo.warningMessage }} (已衰减 -{{ honorData.decayInfo.decayPoints }}分)</span>
          </div>
          <div v-else class="p-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center justify-center gap-1.5">
            <span>⚡</span>
            <span>肌肉状态满血，未受怠惰衰减影响</span>
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
              
              <div class="text-2xl flex-shrink-0 pt-0.5">
                {{ badge.icon || '🎖️' }}
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
        <span>遵循《Fitcycle 底层宪法》统一战力天梯</span>
        <button @click="$emit('close')" class="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all">
          关闭
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getFullHonorProfile, performPrestigeReset } from "../store/fitnessStore.js";
import { PRESTIGE_MEDAL_COLORS } from "../engine/honorEngine.js";

defineProps({
  visible: Boolean
});

defineEmits(["close"]);

const activeBadgeTab = ref("all");

const honorData = computed(() => getFullHonorProfile());

const prestigeInfo = computed(() => {
  const level = honorData.value.prestigeLevel || 1;
  return PRESTIGE_MEDAL_COLORS[level - 1] || PRESTIGE_MEDAL_COLORS[0];
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

function handlePrestigeReset() {
  if (confirm("确定要开启年度荣誉转生吗？您将获得更高阶的稀有服役勋章！")) {
    performPrestigeReset();
  }
}
</script>