<template>
  <Teleport to="body">
    <Transition name="cinematic-shutter">
      <div v-if="visible" 
           @click="dismissEarly"
           class="fixed inset-0 z-[99999] flex flex-col justify-between items-center bg-black overflow-hidden select-none cursor-pointer">
        
        <!-- ========================================================= -->
        <!-- 1. CS2 Cinematic Tactical Shutter (反恐精英 2 全息战术过场) -->
        <!-- ========================================================= -->
        <div v-if="activeSkin === 'cs'" 
             class="relative w-full h-full flex flex-col justify-between items-center bg-[#080B10] px-6 py-12 overflow-hidden">
          
          <!-- Background Cybernetic Tactical Grid & Orange Lens Flare -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#ea580c_0%,transparent_60%)] opacity-20 pointer-events-none"></div>
          <div class="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,#f97316_0,#f97316_1px,transparent_1px,transparent_24px)]"></div>
          
          <!-- Animated Horizontal Laser Scan Line -->
          <div class="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-laser-scan opacity-70 pointer-events-none"></div>

          <!-- Top HUD Tactical Telemetry -->
          <div class="w-full max-w-md flex items-center justify-between z-20 font-mono text-[11px] text-orange-400/90 border-b border-orange-500/30 pb-3">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              <span class="font-black tracking-widest uppercase">VALVE // SOURCE 2</span>
            </div>
            <div class="flex items-center gap-3 text-[10px] text-zinc-400">
              <span class="px-1.5 py-0.5 rounded bg-orange-950/80 border border-orange-500/40 text-orange-300 font-bold">128 TICK</span>
              <span>SUB-TICK 0.00ms</span>
            </div>
          </div>

          <!-- Centerpiece: Tactical Holographic Radar & Bold CS2 Branding -->
          <div class="relative flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm space-y-6">
            
            <!-- Rotating Reticle Crosshair Aperture -->
            <div class="relative w-36 h-36 flex items-center justify-center">
              <!-- Outer Rotating Compass Ring -->
              <svg class="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#f97316" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.6"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ea580c" stroke-width="1" stroke-dasharray="2 4" opacity="0.4"/>
              </svg>

              <!-- Central Crosshair Reticle -->
              <div class="relative w-24 h-24 rounded-2xl bg-zinc-950/90 border-2 border-orange-500 shadow-[0_0_35px_rgba(249,115,22,0.6)] flex items-center justify-center p-3">
                <svg viewBox="0 0 48 48" class="w-full h-full fill-none stroke-orange-400" stroke-width="2.5" stroke-linecap="round">
                  <path d="M 24 6 L 24 16 M 24 32 L 24 42 M 6 24 L 16 24 M 32 24 L 42 24" />
                  <circle cx="24" cy="24" r="6" stroke="#fde047" stroke-width="2" />
                  <circle cx="24" cy="24" r="1.5" fill="#fde047" stroke="none" />
                </svg>
              </div>

              <!-- Corner Tactical Brackets -->
              <div class="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-orange-400"></div>
              <div class="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-orange-400"></div>
              <div class="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-orange-400"></div>
              <div class="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-orange-400"></div>
            </div>

            <!-- Bold CS2 Kinetic Typography -->
            <div class="text-center space-y-1.5">
              <h1 class="text-3xl sm:text-4xl font-black italic tracking-wider text-white drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] font-sans">
                COUNTER<span class="text-orange-500">-STRIKE</span> <span class="text-white px-2 py-0.5 rounded bg-orange-600 font-mono not-italic text-2xl">2</span>
              </h1>
              <p class="text-xs font-mono tracking-[0.25em] text-orange-300 uppercase">
                TACTICAL PROTOCOL ENGAGED
              </p>
            </div>

            <!-- Real-Time Telemetry Grid -->
            <div class="w-full grid grid-cols-3 gap-2 text-center font-mono text-[10px] pt-2">
              <div class="p-2 rounded-xl bg-zinc-950/80 border border-orange-500/30">
                <span class="text-zinc-500 text-[8px] block uppercase">LATENCY</span>
                <span class="font-bold text-orange-300">0.8 ms</span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-950/80 border border-orange-500/30">
                <span class="text-zinc-500 text-[8px] block uppercase">PACKET</span>
                <span class="font-bold text-emerald-400">0% LOSS</span>
              </div>
              <div class="p-2 rounded-xl bg-zinc-950/80 border border-orange-500/30">
                <span class="text-zinc-500 text-[8px] block uppercase">HUD LINK</span>
                <span class="font-bold text-sky-400">ONLINE</span>
              </div>
            </div>

          </div>

          <!-- Bottom Laser Energy Gauge -->
          <div class="w-full max-w-md z-20 space-y-2 text-center">
            <div class="flex justify-between text-[11px] font-mono font-bold text-orange-400">
              <span class="tracking-widest">DEPLOYING INTERFACE</span>
              <span class="animate-pulse font-mono">100%</span>
            </div>
            <!-- High Speed Animated Progress Bar -->
            <div class="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-orange-500/50 p-0.5 shadow-inner">
              <div class="h-full bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500 rounded-full animate-progress-fill shadow-[0_0_15px_rgba(249,115,22,1)]"></div>
            </div>
            <p class="text-[9px] font-mono text-zinc-500 tracking-wider">
              轻触屏幕任意位置即时跳过 (TAP TO SKIP)
            </p>
          </div>

        </div>

        <!-- ========================================================= -->
        <!-- 2. Chamber Haute Horlogerie Shutter (无畏契约 尚博勒高定过场) -->
        <!-- ========================================================= -->
        <div v-else-if="activeSkin === 'chamber'" 
             class="relative w-full h-full flex flex-col justify-between items-center bg-[#050814] px-6 py-12 overflow-hidden">
          
          <!-- French Luxury Midnight Blue & Gold Radian Glow -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#1e3a8a_0%,#050814_70%)] opacity-40 pointer-events-none"></div>
          <div class="absolute top-1/4 -right-20 w-80 h-80 bg-[#E5C378]/15 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Top Status -->
          <div class="w-full max-w-md flex items-center justify-between z-20 font-mono text-[11px] text-[#E5C378] border-b border-[#E5C378]/30 pb-3">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-[#E5C378] rotate-45 animate-pulse"></div>
              <span class="font-black tracking-widest uppercase">VALORANT // PROTOCOL 781-A</span>
            </div>
            <span class="text-cyan-400 text-[10px] tracking-widest uppercase font-bold">CHAMBER</span>
          </div>

          <!-- Centerpiece: Tourbillon Luxury Watch Core & Geometric Facet Shards -->
          <div class="relative flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm space-y-6">
            
            <!-- Rotating Haute Horlogerie Gold Crystal Aperture -->
            <div class="relative w-36 h-36 flex items-center justify-center">
              <svg class="absolute inset-0 w-full h-full animate-spin-reverse" viewBox="0 0 100 100">
                <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="#E5C378" stroke-width="1.5" opacity="0.6"/>
                <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" fill="none" stroke="#06B6D4" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
              </svg>

              <!-- Central Gold Tourbillon Emblem -->
              <div class="relative w-24 h-24 rounded-2xl bg-[#091122] border-2 border-[#E5C378] shadow-[0_0_40px_rgba(229,195,120,0.4)] flex items-center justify-center p-3">
                <svg viewBox="0 0 48 48" class="w-full h-full fill-none stroke-[#E5C378]" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M 24 4 L 40 14 L 40 34 L 24 44 L 8 34 L 8 14 Z" />
                  <circle cx="24" cy="24" r="8" stroke="#06B6D4" stroke-width="1.8" />
                  <path d="M 24 16 L 24 24 L 30 24" stroke="#FFFBEB" stroke-width="2" />
                </svg>
              </div>

              <!-- Luxury Guilloché Gold Corner Anchors -->
              <div class="absolute -top-2 -left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#E5C378]"></div>
              <div class="absolute -top-2 -right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#E5C378]"></div>
              <div class="absolute -bottom-2 -left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#E5C378]"></div>
              <div class="absolute -bottom-2 -right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#E5C378]"></div>
            </div>

            <!-- French Luxury Typographic Branding -->
            <div class="text-center space-y-1.5">
              <h1 class="text-3xl sm:text-4xl font-black tracking-widest text-[#FFFBEB] drop-shadow-[0_0_25px_rgba(229,195,120,0.6)] font-sans uppercase">
                CHAMBER
              </h1>
              <p class="text-xs font-mono tracking-[0.2em] text-[#E5C378]/90">
                HAUTE COUTURE & LETHAL PRECISION
              </p>
            </div>

            <!-- Tactical Weapon Loadout Spec -->
            <div class="w-full grid grid-cols-2 gap-2 text-center font-mono text-[10px] pt-2">
              <div class="p-2 rounded-xl bg-[#091122]/90 border border-[#E5C378]/40 text-left px-3">
                <span class="text-zinc-400 text-[8px] block uppercase">CUSTOM PISTOL</span>
                <span class="font-bold text-[#E5C378]">HEADHUNTER .50</span>
              </div>
              <div class="p-2 rounded-xl bg-[#091122]/90 border border-[#E5C378]/40 text-left px-3">
                <span class="text-zinc-400 text-[8px] block uppercase">SNIPER RIFLE</span>
                <span class="font-bold text-cyan-300">TOUR DE FORCE</span>
              </div>
            </div>

          </div>

          <!-- Bottom Cyan/Gold Energy Bar -->
          <div class="w-full max-w-md z-20 space-y-2 text-center">
            <div class="flex justify-between text-[11px] font-mono font-bold text-[#E5C378]">
              <span class="tracking-widest">“YOU WANT TO PLAY? LET'S PLAY.”</span>
              <span class="text-cyan-400 font-mono">ENGAGED</span>
            </div>
            <div class="w-full h-2 bg-[#091122] rounded-full overflow-hidden border border-[#E5C378]/50 p-0.5 shadow-inner">
              <div class="h-full bg-gradient-to-r from-[#E5C378] via-cyan-400 to-[#F6E09E] rounded-full animate-progress-fill shadow-[0_0_15px_rgba(229,195,120,1)]"></div>
            </div>
            <p class="text-[9px] font-mono text-zinc-500 tracking-wider">
              轻触屏幕任意位置即时跳过 (TAP TO SKIP)
            </p>
          </div>

        </div>

        <!-- ========================================================= -->
        <!-- 3. Default Obsidian Amber Shutter (经典黑金力量引擎过场)   -->
        <!-- ========================================================= -->
        <div v-else 
             class="relative w-full h-full flex flex-col justify-between items-center bg-zinc-950 px-6 py-12 overflow-hidden">
          
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#f59e0b_0%,transparent_60%)] opacity-20 pointer-events-none"></div>

          <!-- Top Status -->
          <div class="w-full max-w-md flex items-center justify-between z-20 font-mono text-[11px] text-amber-400 border-b border-amber-500/30 pb-3">
            <span class="font-black tracking-widest uppercase">FITCYCLE // ATHLETIC ENGINE</span>
            <span class="text-zinc-500 text-[10px]">TITANIUM GOLD</span>
          </div>

          <!-- Centerpiece: Kinetic Aperture & Brand -->
          <div class="relative flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm space-y-6">
            
            <div class="relative w-36 h-36 flex items-center justify-center">
              <svg class="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.6"/>
              </svg>

              <div class="relative w-24 h-24 rounded-2xl bg-zinc-900 border-2 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center p-3">
                <svg viewBox="0 0 48 48" class="w-full h-full fill-none stroke-amber-400" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M 6 24 L 42 24 M 14 14 L 14 34 M 10 18 L 10 30 M 34 14 L 34 34 M 38 18 L 38 30" />
                </svg>
              </div>
            </div>

            <div class="text-center space-y-1.5">
              <h1 class="text-3xl sm:text-4xl font-black tracking-wider text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] font-sans">
                FITCYCLE <span class="text-amber-400">PRO</span>
              </h1>
              <p class="text-xs font-mono tracking-[0.2em] text-amber-300/90">
                MAXIMUM PROGRESSIVE OVERLOAD
              </p>
            </div>

          </div>

          <!-- Bottom Progress -->
          <div class="w-full max-w-md z-20 space-y-2 text-center">
            <div class="flex justify-between text-[11px] font-mono font-bold text-amber-400">
              <span class="tracking-widest">SYSTEM READY</span>
              <span class="font-mono">100%</span>
            </div>
            <div class="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-amber-500/50 p-0.5 shadow-inner">
              <div class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full animate-progress-fill shadow-[0_0_15px_rgba(245,158,11,1)]"></div>
            </div>
            <p class="text-[9px] font-mono text-zinc-500 tracking-wider">
              轻触屏幕任意位置即时跳过 (TAP TO SKIP)
            </p>
          </div>

        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import { skinSplashState } from "../store/fitnessStore.js";
import { playSkinSwitchSound } from "../utils/audio.js";
import { triggerHaptic } from "../utils/vibrate.js";

const visible = ref(false);
const activeSkin = ref("default");

let timerId = null;

function showSplash(skinName) {
  activeSkin.value = skinName || "default";
  visible.value = true;

  // Play audio and haptic
  playSkinSwitchSound(activeSkin.value);
  triggerHaptic("heavy");

  if (timerId) clearTimeout(timerId);
  // Auto-dismiss after 1650ms (1.65s)
  timerId = setTimeout(() => {
    visible.value = false;
    skinSplashState.visible = false;
  }, 1650);
}

function dismissEarly() {
  if (timerId) clearTimeout(timerId);
  visible.value = false;
  skinSplashState.visible = false;
}

watch(() => skinSplashState.seq, (newSeq) => {
  if (newSeq > 0) {
    showSplash(skinSplashState.skin);
  }
});

onUnmounted(() => {
  if (timerId) clearTimeout(timerId);
});

defineExpose({
  showSplash
});
</script>

<style scoped>
.cinematic-shutter-enter-active,
.cinematic-shutter-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cinematic-shutter-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.cinematic-shutter-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes progressFill {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress-fill {
  animation: progressFill 1.3s cubic-bezier(0.1, 0.85, 0.25, 1) forwards;
}

@keyframes laserScan {
  0% { top: 0%; opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { top: 100%; opacity: 0; }
}

.animate-laser-scan {
  animation: laserScan 1.5s ease-in-out infinite;
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spinSlow 12s linear infinite;
}

@keyframes spinReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.animate-spin-reverse {
  animation: spinReverse 15s linear infinite;
}
</style>
