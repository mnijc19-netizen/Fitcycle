<template>
  <div>
    <!-- International Big-Tech Standard Sleek Sticky Navbar -->
    <header class="sticky top-0 z-40 w-full select-none transition-all duration-300 backdrop-blur-xl border-b relative overflow-hidden"
            :class="navbarThemeClasses"
            :style="{ paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 8px), 12px)' }">
      
      <!-- CS2 Dust2 Hero Atmosphere Backdrop (Non-blocking / pointer-events-none) -->
      <div v-if="store.settings.uiSkin === 'cs'" 
           class="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-luminosity z-0"
           :style="{ backgroundImage: `url(${csHeroBg})` }">
        <img :src="csHeroBg" alt="CS2 Dust2 Hero" class="hidden" />
      </div>

      <div class="max-w-lg mx-auto px-4 pb-3 flex flex-col gap-2 relative z-10">
        
        <!-- Main Top Bar Row -->
        <div class="flex items-center justify-between gap-3">
          
          <!-- Left: FitCycle Brandmark & Dynamic Status -->
          <div class="flex items-center gap-2.5 min-w-0">
            <!-- International Vector Logo -->
            <div class="relative flex-shrink-0 cursor-pointer transition-transform active:scale-95" 
                 @click="store.activeTab = 'today'">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center border shadow-md transition-all"
                   :class="logoFrameClasses">
                <FitCycleLogo size="24" />
              </div>
            </div>

            <!-- Brand Typography & Sub-Status -->
            <div class="min-w-0 flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="text-base font-black tracking-tight text-white font-sans leading-tight">
                  FitCycle
                </span>
                <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border leading-none tracking-wider uppercase"
                      :class="badgeThemeClasses">
                  {{ themeBadgeText }}
                </span>
              </div>

              <!-- Contextual Daily Status & Subtitle -->
              <div class="flex items-center gap-1.5 text-[11px] font-mono truncate mt-0.5 leading-tight">
                <template v-if="honorData.isDeloadActive">
                  <span class="text-sky-400 font-bold flex items-center gap-1">
                    <span>🛡️</span>
                    <span>减载免战 (剩{{ honorData.shieldDaysRemaining }}天)</span>
                  </span>
                </template>
                <template v-else>
                  <span class="text-zinc-400 font-medium">{{ todayFormatted }}</span>
                  <span class="text-zinc-600">·</span>
                  <span class="font-bold truncate" :class="cycleHighlightClass">{{ todayCycleDay.name }}</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Right: Ergonomic Utility Controls (Zero Blocking / Zero Overlap) -->
          <div class="flex items-center gap-1.5 flex-shrink-0">
            
            <!-- CS2 Agent Compact Switcher Avatar (Non-blocking Mini Inlay) -->
            <button v-if="store.settings.uiSkin === 'cs'"
                    @click="nextCsAgent"
                    type="button"
                    :title="`当前干员: ${currentCsAgent.role} (点击轮换)`"
                    class="w-8 h-8 rounded-lg bg-zinc-900 border border-orange-500/40 p-0.5 flex items-center justify-center overflow-hidden hover:border-orange-400 active:scale-95 transition-all shadow-sm">
              <img :src="currentCsAgent.url" :alt="currentCsAgent.name" class="w-full h-full object-contain" />
            </button>

            <!-- AI Coach Trigger Button -->
            <button @click="aiSession.drawerOpen = true"
                    type="button"
                    title="打开 FitCycle AI 智能教练"
                    class="h-8 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 transition-all border cursor-pointer"
                    :class="aiButtonClasses">
              <span class="text-xs">✦</span>
              <span class="tracking-wide">AI 教练</span>
            </button>

            <!-- Workout in Progress OR Quick Cycle Switcher -->
            <button v-if="store.activeWorkout" 
                    @click="store.activeTab = 'today'"
                    type="button"
                    class="h-8 px-2.5 sm:px-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse active:scale-95 cursor-pointer shadow-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>训练中</span>
            </button>

            <button v-else 
                    @click="showCycleModal = true"
                    type="button"
                    title="切换推拉腿分化或排期模式"
                    class="h-8 px-2.5 rounded-full text-xs font-medium flex items-center gap-1 active:scale-95 transition-all border cursor-pointer shadow-sm"
                    :class="cycleButtonClasses">
              <span>分化</span>
              <span class="text-[10px] opacity-70">▾</span>
            </button>
          </div>

        </div>

        <!-- CS2 Tactical Micro-HUD Telemetry Ribbon (Sleek & Integrated) -->
        <div v-if="store.settings.uiSkin === 'cs'" 
             class="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded-lg bg-orange-950/20 border border-orange-500/20 text-orange-400/90">
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span class="font-bold tracking-wider">CS2 // HUD</span>
            </span>
            <span class="text-zinc-500">128 TICK</span>
          </div>
          <div class="flex items-center gap-2 text-zinc-400">
            <span class="flex items-center gap-1 text-emerald-400 font-bold">
              <img :src="csHealthCross" alt="HP" class="w-2.5 h-2.5 object-contain inline" />
              <span>+100 HP</span>
            </span>
            <span>·</span>
            <span class="flex items-center gap-1 text-sky-400 font-bold">
              <img :src="csArmorHelmet" alt="AP" class="w-3 h-3 object-contain inline" />
              <span>100 AP</span>
            </span>
            <span>·</span>
            <span class="flex items-center gap-1 text-amber-400 font-bold">
              <img :src="csMoneyChevron" alt="Cash" class="w-2.5 h-2.5 object-contain inline" />
              <span>$16,000</span>
            </span>
          </div>
        </div>

      </div>
    </header>

    <!-- Cycle Editor Modal -->
    <CycleEditorModal :visible="showCycleModal" @close="showCycleModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, getCycleDayForDate, getFullHonorProfile } from "../store/fitnessStore.js";
import { aiSession } from "../ai/aiSession.js";
import CycleEditorModal from "./CycleEditorModal.vue";
import FitCycleLogo from "./FitCycleLogo.vue";
import { triggerHaptic } from "../utils/vibrate.js";

const honorData = computed(() => getFullHonorProfile());
const showCycleModal = ref(false);

// CS2 Agents Switcher
const csAgentIndex = ref(0);
const csAgents = [
  { name: "Markus Delrow", role: "CT · 马尔库斯·戴劳", url: "./themes/cs/agents/ct_delrow.png" },
  { name: "Elite Trapper Solman", role: "T · 捕兽者索尔曼", url: "./themes/cs/agents/t_solman.png" },
  { name: "Number K", role: "T · 老K", url: "./themes/cs/agents/t_number_k.png" },
  { name: "Phoenix Enforcer", role: "T · 凤凰战士", url: "./themes/cs/agents/t_phoenix.png" }
];
const currentCsAgent = computed(() => csAgents[csAgentIndex.value]);

const csHeroBg = "./themes/cs/hero/cs-hero.jpg";
const csHealthCross = "./themes/cs/hud/health_cross.svg";
const csArmorHelmet = "./themes/cs/hud/armor_helmet.svg";
const csMoneyChevron = "./themes/cs/hud/chevron_money.svg";

function nextCsAgent() {
  csAgentIndex.value = (csAgentIndex.value + 1) % csAgents.length;
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

const todayCycleDay = computed(() => getCycleDayForDate());

const todayFormatted = computed(() => {
  const d = new Date();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
});

// Dynamic Theme Style Computations
const navbarThemeClasses = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "bg-[#080c14]/90 border-orange-500/20";
  if (skin === "chamber") return "bg-[#060a14]/90 border-[#E5C378]/20";
  return "bg-zinc-950/90 border-white/5";
});

const logoFrameClasses = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "bg-zinc-900 border-orange-500/40 shadow-orange-500/20";
  if (skin === "chamber") return "bg-[#0a1122] border-[#E5C378]/40 shadow-[#E5C378]/20";
  return "bg-zinc-900 border-amber-500/30 shadow-amber-500/10";
});

const themeBadgeText = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "TACTICAL";
  if (skin === "chamber") return "HAUTE";
  return "PRO";
});

const badgeThemeClasses = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "bg-orange-500/15 border-orange-500/40 text-orange-400";
  if (skin === "chamber") return "bg-[#E5C378]/15 border-[#E5C378]/40 text-[#E5C378]";
  return "bg-amber-500/15 border-amber-500/30 text-amber-400";
});

const cycleHighlightClass = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "text-orange-400";
  if (skin === "chamber") return "text-[#E5C378]";
  return "text-amber-400";
});

const aiButtonClasses = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border-orange-500/30";
  if (skin === "chamber") return "bg-[#E5C378]/15 hover:bg-[#E5C378]/25 text-[#E5C378] border-[#E5C378]/30";
  return "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30";
});

const cycleButtonClasses = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-orange-500/30";
  if (skin === "chamber") return "bg-[#0b1224] hover:bg-[#131d36] text-zinc-300 border-[#E5C378]/30";
  return "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-800";
});
</script>
