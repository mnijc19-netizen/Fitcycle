<template>
  <div>
    <!-- ============================================== -->
    <!-- 1. CHAMBER (尚博勒) IMMERSIVE CHARACTER HERO THEME -->
    <!-- ============================================== -->
    <header v-if="store.settings.uiSkin === 'chamber'" 
            class="relative w-full overflow-hidden select-none border-b border-[#1E3052]/80 transition-all duration-300"
            style="min-height: 200px; padding-top: max(calc(env(safe-area-inset-top, 0px) + 6px), 12px);">
      
      <!-- High-Def Chamber Hero Banner Image -->
      <div class="absolute inset-0 w-full h-full bg-no-repeat pointer-events-none"
           :style="{
             backgroundImage: `url('./themes/chamber/hero/chamber-hero.webp')`,
             backgroundSize: 'cover',
             backgroundPosition: '68% center'
           }">
      </div>

      <!-- Multi-Layer Deep Navy Gradient Overlays for High Legibility -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/85 via-45% to-transparent pointer-events-none"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent pointer-events-none"></div>

      <!-- Subtle Precision Blueprint Crosshair Lines -->
      <div class="absolute top-0 right-0 w-32 h-32 opacity-15 pointer-events-none">
        <svg viewBox="0 0 100 100" class="w-full h-full text-[#E5C378]">
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 2" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="0.5" fill="none" />
        </svg>
      </div>

      <!-- Header Content Container -->
      <div class="relative z-10 max-w-md mx-auto px-4 pb-7 flex flex-col justify-between" style="min-height: 180px;">
        
        <!-- Top Nav Row: Brand Logo + Quick Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-lg overflow-hidden bg-[#0D1627] border border-[#E5C378]/60 flex items-center justify-center shadow-lg shadow-black/60 flex-shrink-0">
              <img :src="logoUrl" alt="Logo" class="w-full h-full object-cover" />
            </div>

            <div>
              <div class="text-sm font-black tracking-tight text-[#F7F6F2] flex items-center gap-1.5 drop-shadow">
                包皮健身
                <span class="text-[9px] px-1.5 py-0.2 rounded bg-[#E5C378]/20 text-[#E5C378] font-mono font-bold border border-[#E5C378]/40">
                  CHAMBER
                </span>
              </div>
              <div class="text-[10px] text-[#9AA8C2] font-mono tracking-wide">
                FRENCH PRECISION
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2">
            <button v-if="store.activeWorkout" 
                    @click="store.activeTab = 'today'"
                    class="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md animate-pulse">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              训练进行中
            </button>

            <button v-else 
                    @click="showCycleModal = true"
                    class="px-2.5 py-1 bg-[#0D1627]/90 hover:bg-[#142036] text-[#E5C378] border border-[#E5C378]/40 rounded-lg text-xs font-medium flex items-center gap-1 backdrop-blur-md shadow-md transition-all">
              <span>🔄 分化</span>
            </button>
          </div>
        </div>

        <!-- Lower Hero Row: Date, Plan & Chamber Status Badge -->
        <div class="mt-4 space-y-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0D1627]/80 border border-[#E5C378]/30 text-[10px] text-[#E5C378] font-mono backdrop-blur-md">
            <span>⚜️</span>
            <span>{{ todayFormatted }}</span>
            <span>·</span>
            <span class="font-bold text-[#F7F6F2]">{{ todayCycleDay.name }}</span>
          </div>

          <div class="text-xs text-[#9AA8C2] flex items-center gap-1.5 pl-0.5 drop-shadow">
            <span class="w-1.5 h-1.5 rounded-full bg-[#E06D3B]"></span>
            <span>定制优雅，枪枪爆头 · 高效拉伸肥大</span>
          </div>
        </div>

      </div>
    </header>

    <!-- ============================================== -->
    <!-- 2. CS2 (反恐精英 · 战术特勤) OFFICIAL CHARACTER HERO THEME -->
    <!-- ============================================== -->
    <header v-else-if="store.settings.uiSkin === 'cs'" 
            class="relative w-full overflow-hidden select-none border-b border-[#F97316]/40 transition-all duration-300"
            style="min-height: 200px; padding-top: max(calc(env(safe-area-inset-top, 0px) + 6px), 12px);">
      
      <!-- High-Def CS2 Hero Banner Image -->
      <div class="absolute inset-0 w-full h-full bg-no-repeat pointer-events-none"
           :style="{
             backgroundImage: `url('./themes/cs/hero/cs-hero.jpg')`,
             backgroundSize: 'cover',
             backgroundPosition: '45% center'
           }">
      </div>

      <!-- Multi-Layer Deep Slate & Tactical Orange Gradient Overlays for High Legibility -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#080C14] via-[#080C14]/85 via-50% to-transparent pointer-events-none"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/50 to-transparent pointer-events-none"></div>

      <!-- Subtle Tactical Precision Radar Crosshair Lines -->
      <div class="absolute top-0 right-0 w-36 h-36 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" class="w-full h-full text-[#F97316]">
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="0.75" stroke-dasharray="3 3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="0.75" stroke-dasharray="3 3" />
          <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="0.75" fill="none" />
          <circle cx="50" cy="50" r="15" stroke="currentColor" stroke-width="0.5" fill="none" />
        </svg>
      </div>

      <!-- Header Content Container -->
      <div class="relative z-10 max-w-md mx-auto px-4 pb-7 flex flex-col justify-between" style="min-height: 180px;">
        
        <!-- Top Nav Row: Brand Logo + Quick Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl overflow-hidden bg-[#0F172A] border border-[#F97316]/70 flex items-center justify-center shadow-lg shadow-black/80 flex-shrink-0">
              <img :src="logoUrl" alt="Logo" class="w-full h-full object-cover" />
            </div>

            <div>
              <div class="text-sm font-black tracking-tight text-[#F8FAFC] flex items-center gap-1.5 drop-shadow">
                包皮健身
                <span class="text-[9px] px-1.5 py-0.2 rounded bg-[#F97316]/20 text-[#F97316] font-mono font-black border border-[#F97316]/50">
                  CS2 · 战术特勤
                </span>
              </div>
              <div class="text-[10px] text-[#38BDF8] font-mono tracking-wider font-bold">
                TACTICAL OPERATIVE
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2">
            <button v-if="store.activeWorkout" 
                    @click="store.activeTab = 'today'"
                    class="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md animate-pulse">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              战斗进行中
            </button>

            <button v-else 
                    @click="showCycleModal = true"
                    class="px-2.5 py-1 bg-[#0F172A]/90 hover:bg-[#1E293B] text-[#F97316] border border-[#F97316]/40 rounded-xl text-xs font-bold flex items-center gap-1 backdrop-blur-md shadow-md transition-all">
              <span>🔄 战术分化</span>
            </button>
          </div>
        </div>

        <!-- Lower Hero Row: CS2 Tactical Stats & Official Slogan -->
        <div class="mt-4 space-y-1.5">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg bg-[#0F172A]/90 border border-[#F97316]/40 text-[10px] text-[#F97316] font-mono backdrop-blur-md">
            <span>🎯</span>
            <span>{{ todayFormatted }}</span>
            <span>·</span>
            <span class="font-black text-[#F8FAFC]">{{ todayCycleDay.name }}</span>
            <span class="text-[9px] px-1 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-bold">BUY PHASE</span>
          </div>

          <div class="text-[11px] text-[#94A3B8] flex items-center gap-1.5 pl-0.5 drop-shadow font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
            <span>起把狙！枪枪爆头 · 撕裂肌纤维</span>
          </div>

          <!-- Mini Tactical HUD indicators -->
          <div class="flex items-center gap-2.5 pt-0.5 text-[9px] font-mono text-[#64748B]">
            <span class="text-emerald-400 font-bold">💖 HP 100</span>
            <span class="text-sky-400 font-bold">🛡️ ARMOR 100</span>
            <span class="text-amber-400 font-bold">💰 $16,000</span>
          </div>
        </div>

      </div>
    </header>

    <!-- ============================================== -->
    <!-- 3. DEFAULT THEME CLASSIC NAVBAR (经典默认顶栏) -->
    <!-- ============================================== -->
    <header v-else 
            class="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 pb-3"
            style="padding-top: max(calc(env(safe-area-inset-top, 0px) + 8px), 14px);">
      <div class="max-w-md mx-auto flex items-center justify-between">
        
        <!-- Brand & Status -->
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/40 flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
            <img :src="logoUrl" alt="包皮健身 Logo" class="w-full h-full object-cover" />
          </div>

          <div>
            <div class="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              包皮健身
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-normal border border-amber-500/30">
                PRO
              </span>
            </div>
            <div class="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
              <span>{{ todayFormatted }}</span>
              <span>·</span>
              <span class="text-amber-400 font-bold">{{ todayCycleDay.name }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Action / Status indicator -->
        <div class="flex items-center gap-2">
          <button v-if="store.activeWorkout" 
                  @click="store.activeTab = 'today'"
                  class="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            训练进行中
          </button>

          <button v-else 
                  @click="showCycleModal = true"
                  class="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 rounded-full text-xs font-medium flex items-center gap-1">
            <span>🔄 分化</span>
          </button>
        </div>

      </div>
    </header>

    <!-- Cycle Editor Modal -->
    <CycleEditorModal :visible="showCycleModal" @close="showCycleModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, getCycleDayForDate } from "../store/fitnessStore.js";
import CycleEditorModal from "./CycleEditorModal.vue";
import logoUrl from "../assets/logo.png";

const showCycleModal = ref(false);

const todayCycleDay = computed(() => {
  return getCycleDayForDate();
});

const todayFormatted = computed(() => {
  const d = new Date();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
});
</script>

