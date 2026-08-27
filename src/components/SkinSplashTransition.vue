<template>
  <Teleport to="body">
    <Transition name="splash-fade">
      <div v-if="visible" 
           @click="dismissEarly"
           class="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer">
        
        <!-- ============================================== -->
        <!-- 1. CS2 Cinematic Game-Entry Splash (反恐精英 2) -->
        <!-- ============================================== -->
        <div v-if="activeSkin === 'cs'" class="relative w-full h-full flex flex-col justify-between items-center bg-[#090A0C] overflow-hidden">
          <!-- Background Tactical Ambient Glow -->
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#f97316_0%,transparent_60%)] opacity-30 pointer-events-none"></div>
          
          <!-- Diagonal Slanted Tactical Slash Background Lines -->
          <div class="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#f97316_0,#f97316_2px,transparent_2px,transparent_20px)]"></div>

          <!-- Top HUD Status -->
          <div class="w-full pt-10 px-6 flex items-center justify-between z-20 font-mono text-xs text-orange-400">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
              <span class="font-black tracking-widest uppercase">SOURCE 2 // CONNECTING...</span>
            </div>
            <span class="text-zinc-500 text-[10px]">128 TICKRATE · SUB-TICK</span>
          </div>

          <!-- Center Master Image Banner (High-Definition CS2 Hero) -->
          <div class="relative w-full max-w-4xl px-4 flex-1 flex items-center justify-center z-10">
            <div class="relative w-full max-h-[75vh] aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.4)] border-2 border-orange-500/80 bg-zinc-950 flex items-center justify-center transform scale-100 animate-in zoom-in-95 duration-300">
              <img :src="csSplashUrl" 
                   alt="Counter-Strike 2" 
                   class="w-full h-full object-cover object-center filter brightness-105 contrast-110" />
              
              <!-- Subtle Holographic Scanline Overlay -->
              <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-orange-500/10 to-transparent bg-[length:100%_4px]"></div>
              
              <!-- Glowing Orange Eye Flare Effect for Operatives -->
              <div class="absolute top-[28%] left-[17%] w-4 h-4 bg-orange-500 rounded-full blur-md opacity-80 animate-pulse"></div>
              <div class="absolute top-[32%] left-[34%] w-4 h-4 bg-orange-500 rounded-full blur-md opacity-80 animate-pulse"></div>
            </div>
          </div>

          <!-- Bottom Tactical Progress Bar & Weapon Specs -->
          <div class="w-full pb-10 px-6 z-20 max-w-xl text-center space-y-2">
            <div class="flex justify-between text-[11px] font-mono font-bold text-orange-300">
              <span class="tracking-widest">TACTICAL HUD INITIALIZING</span>
              <span>100%</span>
            </div>
            <!-- High Speed Animated Progress Bar -->
            <div class="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-orange-500/40 p-0.5">
              <div class="h-full bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out w-full animate-pulse shadow-[0_0_12px_rgba(249,115,22,0.8)]"></div>
            </div>
            <div class="text-[9px] font-mono text-zinc-500 tracking-wider">
              点击屏幕任意位置可即时跳过 (CLICK TO SKIP)
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- 2. Valorant Chamber Splash (无畏契约 尚博勒) -->
        <!-- ============================================== -->
        <div v-else-if="activeSkin === 'chamber'" class="relative w-full h-full flex flex-col justify-between items-center bg-[#070B14] overflow-hidden">
          <!-- Background Radiant Crystal Geometric Shards -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e3a8a_0%,#070B14_80%)] pointer-events-none opacity-50"></div>
          <div class="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Top Haute Horlogerie Gold Status -->
          <div class="w-full pt-10 px-6 flex items-center justify-between z-20 font-mono text-xs text-[#E5C378]">
            <div class="flex items-center gap-2">
              <span class="text-sm">⚜️</span>
              <span class="font-black tracking-widest uppercase">VALORANT // PROTOCOL 781-A</span>
            </div>
            <span class="text-cyan-400 text-[10px] tracking-widest uppercase">AGENT CHAMBER</span>
          </div>

          <!-- Center Master Image Banner (High-Definition Chamber Splash) -->
          <div class="relative w-full max-w-4xl px-4 flex-1 flex items-center justify-center z-10">
            <div class="relative w-full max-h-[75vh] aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(229,195,120,0.35)] border-2 border-[#E5C378]/90 bg-[#0B1322] flex items-center justify-center transform scale-100 animate-in zoom-in-95 duration-300">
              <img :src="chamberSplashUrl" 
                   alt="Chamber Valorant" 
                   class="w-full h-full object-cover object-center filter brightness-105 contrast-105" />
              
              <!-- Haute Horlogerie Gold Geometric Border Filigree -->
              <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#E5C378]"></div>
              <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#E5C378]"></div>
              <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#E5C378]"></div>
              <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#E5C378]"></div>
            </div>
          </div>

          <!-- Bottom French Elegance Quote & Golden Progress Bar -->
          <div class="w-full pb-10 px-6 z-20 max-w-xl text-center space-y-2">
            <div class="flex justify-between text-[11px] font-mono font-bold text-[#E5C378]">
              <span class="tracking-widest">“YOU WANT TO PLAY? LET'S PLAY.”</span>
              <span class="text-cyan-400">READY</span>
            </div>
            <!-- Golden/Cyan Radian Progress Bar -->
            <div class="w-full h-2 bg-[#0B1322] rounded-full overflow-hidden border border-[#E5C378]/50 p-0.5">
              <div class="h-full bg-gradient-to-r from-[#E5C378] via-cyan-400 to-[#F6E09E] rounded-full transition-all duration-1000 ease-out w-full animate-pulse shadow-[0_0_14px_rgba(229,195,120,0.9)]"></div>
            </div>
            <div class="text-[9px] font-mono text-zinc-400 tracking-wider">
              点击屏幕任意位置可即时跳过 (CLICK TO SKIP)
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- 3. Default Classic Obsidian & Gold Transition  -->
        <!-- ============================================== -->
        <div v-else class="relative w-full h-full flex flex-col justify-between items-center bg-zinc-950 overflow-hidden">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,#f59e0b_0%,transparent_65%)] opacity-20 pointer-events-none"></div>

          <!-- Top Status -->
          <div class="w-full pt-10 px-6 flex items-center justify-between z-20 font-mono text-xs text-amber-400">
            <span class="font-black tracking-widest">FITCYCLE // ATHLETIC ENGINE</span>
            <span class="text-zinc-500 text-[10px]">CLASSIC BLACK-GOLD</span>
          </div>

          <!-- Center Logo & Emblem -->
          <div class="relative flex-1 flex flex-col items-center justify-center z-10 space-y-4">
            <div class="w-24 h-24 rounded-3xl bg-zinc-900 border-2 border-amber-500/80 shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center text-4xl animate-bounce">
              🏋️
            </div>
            <div class="text-center">
              <h2 class="text-xl font-black text-white tracking-wider">FITCYCLE 极速引擎</h2>
              <p class="text-xs text-amber-400/80 font-mono mt-1">力量做工与战力天梯已就绪</p>
            </div>
          </div>

          <!-- Bottom Progress -->
          <div class="w-full pb-10 px-6 z-20 max-w-xl text-center space-y-2">
            <div class="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
              <div class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out w-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"></div>
            </div>
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

const csSplashUrl = "/themes/splash/cs2-splash.png";
const chamberSplashUrl = "/themes/splash/chamber-splash.png";

let timerId = null;

function showSplash(skinName) {
  activeSkin.value = skinName || "default";
  visible.value = true;

  // Play game entry audio and haptic
  playSkinSwitchSound(activeSkin.value);
  triggerHaptic("heavy");

  if (timerId) clearTimeout(timerId);
  // Auto-dismiss after 1750ms (1.75s)
  timerId = setTimeout(() => {
    visible.value = false;
    skinSplashState.visible = false;
  }, 1750);
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
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-fade-enter-from {
  opacity: 0;
  transform: scale(1.04);
}

.splash-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
