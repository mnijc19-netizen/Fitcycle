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
    <!-- 2. CS2 (反恐精英 · 完美特训) CARTOON & TACTICAL HERO THEME -->
    <!-- ============================================== -->
    <header v-else-if="store.settings.uiSkin === 'cs'" 
            class="relative w-full overflow-hidden select-none border-b border-[#F97316]/30 bg-[#080C14] transition-all duration-300"
            style="min-height: 205px; padding-top: max(calc(env(safe-area-inset-top, 0px) + 6px), 12px);">
      
      <!-- CS2 Tactical Radar Grid & Background Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(249,115,22,0.18),transparent_70%)] pointer-events-none"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(56,189,248,0.12),transparent_60%)] pointer-events-none"></div>

      <!-- Tactical SVG Radar & Crosshair Overlays -->
      <div class="absolute top-1 right-2 w-44 h-44 opacity-25 pointer-events-none">
        <svg viewBox="0 0 160 160" class="w-full h-full text-[#F97316]">
          <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" fill="none" />
          <circle cx="80" cy="80" r="45" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.6" />
          <circle cx="80" cy="80" r="20" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.4" />
          <line x1="10" y1="80" x2="150" y2="80" stroke="currentColor" stroke-width="0.8" opacity="0.7" />
          <line x1="80" y1="10" x2="80" y2="150" stroke="currentColor" stroke-width="0.8" opacity="0.7" />
          <line x1="80" y1="80" x2="140" y2="35" stroke="#38BDF8" stroke-width="1.5" opacity="0.8" class="animate-spin origin-center" style="animation-duration: 6s;" />
        </svg>
      </div>

      <!-- CS2 Hero Art (Perfect World Anime / Meme Style Cute Tactical Operative + Helmet Chicken) -->
      <div class="absolute right-3 bottom-0 w-44 h-40 pointer-events-none flex items-end justify-end">
        <svg viewBox="0 0 200 180" class="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          <!-- CT Operative Body (Dark Blue Tactical Armor) -->
          <g transform="translate(45, 20)">
            <path d="M40 70 L95 70 L105 150 L30 150 Z" fill="#1E293B" stroke="#334155" stroke-width="2" />
            <path d="M45 80 L90 80 L88 120 L47 120 Z" fill="#0F172A" />
            <rect x="50" y="90" width="14" height="20" rx="3" fill="#F97316" opacity="0.9" />
            <rect x="70" y="90" width="14" height="20" rx="3" fill="#38BDF8" opacity="0.8" />
            
            <!-- Head / SAS Gasmask / Helmet -->
            <ellipse cx="68" cy="45" rx="26" ry="28" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
            <path d="M42 42 Q68 15 94 42 Z" fill="#334155" />
            <rect x="42" y="38" width="52" height="6" rx="2" fill="#475569" />
            
            <!-- Gasmask Goggles (Reflective Cyan Glass) -->
            <circle cx="58" cy="42" r="10" fill="#38BDF8" stroke="#0F172A" stroke-width="2" />
            <circle cx="58" cy="42" r="7" fill="#0284C7" />
            <circle cx="55" cy="40" r="3" fill="#FFFFFF" opacity="0.8" />
            
            <circle cx="78" cy="42" r="10" fill="#38BDF8" stroke="#0F172A" stroke-width="2" />
            <circle cx="78" cy="42" r="7" fill="#0284C7" />
            <circle cx="75" cy="40" r="3" fill="#FFFFFF" opacity="0.8" />
            <ellipse cx="68" cy="62" rx="10" ry="7" fill="#0F172A" stroke="#475569" stroke-width="1.5" />
            <circle cx="68" cy="62" r="4" fill="#F97316" />

            <!-- M4A1-S Silenced Rifle in Hand -->
            <path d="M15 105 L70 95 L72 108 L15 116 Z" fill="#090D16" stroke="#475569" stroke-width="1.5" />
            <rect x="-15" y="103" width="30" height="7" rx="3" fill="#1E293B" stroke="#F97316" stroke-width="1" />
          </g>

          <!-- 🐔 Perfect World Iconic Tactical Chicken with Helmet & Defuse Kit -->
          <g transform="translate(110, 85)">
            <ellipse cx="40" cy="55" rx="20" ry="18" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" />
            <ellipse cx="36" cy="56" rx="10" ry="7" fill="#EAB308" />
            <path d="M20 50 Q12 40 18 58 Z" fill="#CA8A04" />
            <circle cx="52" cy="42" r="11" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" />
            <polygon points="62,42 70,45 62,48" fill="#F97316" />
            <path d="M48 31 Q53 25 58 31 Z" fill="#EF4444" />
            <ellipse cx="58" cy="50" rx="3" ry="5" fill="#EF4444" />
            <circle cx="54" cy="40" r="2.5" fill="#000000" />
            <circle cx="55" cy="39" r="1" fill="#FFFFFF" />

            <!-- SWAT Mini Helmet on Chicken! -->
            <path d="M42 38 Q53 22 64 38 Z" fill="#1E293B" stroke="#334155" stroke-width="1.5" />
            <rect x="42" y="36" width="22" height="3" rx="1" fill="#F97316" />
            
            <!-- Mini Defuse Kit on Chicken Back -->
            <rect x="22" y="48" width="12" height="10" rx="2" fill="#0284C7" stroke="#38BDF8" stroke-width="1" />
            <line x1="28" y1="48" x2="35" y2="40" stroke="#38BDF8" stroke-width="1" stroke-dasharray="1 1" />
            <line x1="35" y1="72" x2="33" y2="82" stroke="#F97316" stroke-width="2" />
            <line x1="45" y1="72" x2="47" y2="82" stroke="#F97316" stroke-width="2" />
          </g>
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
                  CS2 · 完美特训
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

        <!-- Lower Hero Row: CS2 Tactical Stats & Meme Slogan -->
        <div class="mt-4 space-y-1.5">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg bg-[#0F172A]/90 border border-[#F97316]/40 text-[10px] text-[#F97316] font-mono backdrop-blur-md">
            <span>🎯</span>
            <span>{{ todayFormatted }}</span>
            <span>·</span>
            <span class="font-black text-[#F8FAFC]">{{ todayCycleDay.name }}</span>
            <span class="text-[9px] px-1 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">ECO 强起局</span>
          </div>

          <div class="text-[11px] text-[#94A3B8] flex items-center gap-1.5 pl-0.5 drop-shadow font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            <span>战术小鸡：“白给没关系，今日卧推必须爆头拉满！”</span>
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

