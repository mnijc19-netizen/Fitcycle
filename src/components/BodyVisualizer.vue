<template>
  <div class="relative w-full rounded-2xl bg-zinc-950/95 border border-zinc-800 p-3.5 overflow-hidden shadow-2xl flex flex-col items-center select-none">
    
    <!-- Background Technical Grid & Ambient Lighting -->
    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:20px_20px]"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
         :class="themeGlowClass"></div>

    <!-- Header: Title, Live V-Taper Badge & Quick Height Setting Pill -->
    <div class="w-full flex items-center justify-between z-10 mb-1 text-left">
      <div class="flex items-center gap-1.5">
        <span class="text-sm">🧬</span>
        <div>
          <div class="flex items-center gap-1.5">
            <h4 class="text-xs font-black text-white tracking-wide">3D 拟真人偶身材透视</h4>
            <!-- Quick Height Pill -->
            <button @click="showHeightPicker = !showHeightPicker"
                    class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sky-300 border border-sky-500/30 flex items-center gap-0.5 active:scale-95 transition-all"
                    title="点击修改基准身高">
              <span>📏 身高 {{ userHeight }}cm</span>
              <span class="text-[8px] text-zinc-400">✎</span>
            </button>
          </div>
          <p class="text-[9px] text-zinc-500 font-mono">
            头身比 {{ headToBodyRatio }} · BMI {{ bmiValue }} ({{ bmiCategory }})
          </p>
        </div>
      </div>

      <!-- Live V-Taper Rating Badge -->
      <div class="flex items-center gap-1 font-mono">
        <span class="text-[10px] px-2.5 py-1 rounded-xl border font-black transition-all duration-300 shadow-sm whitespace-nowrap"
              :class="vTaperBadgeClass">
          {{ vTaperRating.icon }} {{ vTaperRating.title }} ({{ currentVTaper }})
        </span>
      </div>
    </div>

    <!-- Height Adjustment Popover (Quick Slider) -->
    <div v-if="showHeightPicker" 
         class="w-full p-2.5 mb-2 rounded-xl bg-zinc-900 border border-sky-500/40 z-20 space-y-1.5 animate-in fade-in zoom-in-95 duration-150 text-left">
      <div class="flex items-center justify-between text-[10px] text-zinc-300 font-mono">
        <span>⚙️ 调节基准身高 (决定纵向头身比与下肢比例)</span>
        <span class="text-sky-400 font-bold">{{ userHeight }} cm</span>
      </div>
      <input type="range" min="150" max="205" step="1" 
             v-model.number="userHeight" 
             @change="saveHeightPreference"
             class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400" />
      <div class="flex justify-between text-[8px] font-mono text-zinc-500">
        <span>150cm</span>
        <span>175cm (标准)</span>
        <span>205cm</span>
      </div>
    </div>

    <!-- Realistic 3D Humanoid Mannequin SVG Canvas -->
    <div class="relative w-full max-w-[320px] h-[370px] flex items-center justify-center my-1 z-10">
      <svg viewBox="0 0 340 450" class="w-full h-full filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
        <defs>
          <!-- 3D Realistic Muscle Shading Radial & Linear Gradients -->
          <linearGradient id="humanSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="themeColors.highlight" stop-opacity="0.95"/>
            <stop offset="25%" :stop-color="themeColors.primary" stop-opacity="0.85"/>
            <stop offset="65%" :stop-color="themeColors.secondary" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0.98"/>
          </linearGradient>

          <linearGradient id="muscleVolumeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
            <stop offset="50%" stop-color="#000000" stop-opacity="0.05"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
          </linearGradient>

          <linearGradient id="absBlockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
          </linearGradient>

          <!-- Laser Scan Dimension Gradient -->
          <linearGradient id="laserScanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="themeColors.primary" stop-opacity="0"/>
            <stop offset="50%" :stop-color="themeColors.highlight" stop-opacity="0.9"/>
            <stop offset="100%" :stop-color="themeColors.primary" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- Center Symmetry Axis Guide -->
        <line x1="170" y1="10" x2="170" y2="445" stroke="#27272a" stroke-width="1" stroke-dasharray="3 3"/>

        <!-- ============================================== -->
        <!-- 1. Realistic Human Head, Neck & Jaw (8-Head Proportional) -->
        <!-- ============================================== -->
        <g class="transition-all duration-300">
          <!-- Cranium / Head -->
          <ellipse cx="170" :cy="headCenterY" :rx="headRadiusX" :ry="headRadiusY" fill="url(#humanSkinGrad)" :stroke="themeColors.stroke" stroke-width="1.8"/>
          <ellipse cx="170" :cy="headCenterY" :rx="headRadiusX" :ry="headRadiusY" fill="url(#muscleVolumeGrad)"/>
          <!-- Facial Plane / Jawline -->
          <path :d="`M ${170 - headRadiusX * 0.7} ${headCenterY + headRadiusY * 0.3} Q 170 ${headCenterY + headRadiusY * 1.05} ${170 + headRadiusX * 0.7} ${headCenterY + headRadiusY * 0.3}`"
                fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2"/>
          <!-- Neck & Sternocleidomastoid Muscle (胸锁乳突肌) -->
          <path :d="`M ${170 - 7} ${headCenterY + headRadiusY * 0.8} L ${170 - 10} ${torsoTopY} M ${170 + 7} ${headCenterY + headRadiusY * 0.8} L ${170 + 10} ${torsoTopY}`"
                stroke="url(#humanSkinGrad)" stroke-width="14" stroke-linecap="round"/>
          <line :x1="170 - 5" :y1="headCenterY + headRadiusY * 0.8" :x2="170 - 7" :y2="torsoTopY" :stroke="themeColors.muscleLine" stroke-width="1.2"/>
          <line :x1="170 + 5" :y1="headCenterY + headRadiusY * 0.8" :x2="170 + 7" :y2="torsoTopY" :stroke="themeColors.muscleLine" stroke-width="1.2"/>
        </g>

        <!-- ============================================== -->
        <!-- 2. Anatomical Realistic Human Torso & Limbs -->
        <!-- ============================================== -->
        <path :d="humanoidBodyPath"
              fill="url(#humanSkinGrad)"
              :stroke="themeColors.stroke"
              stroke-width="2.2"
              stroke-linejoin="round"
              stroke-linecap="round"
              class="transition-all duration-300 ease-out"/>

        <!-- 3D Muscle Volume Shader -->
        <path :d="humanoidBodyPath"
              fill="url(#muscleVolumeGrad)"
              class="pointer-events-none transition-all duration-300"/>

        <!-- Clavicle / Collarbone (锁骨横连) -->
        <path :d="`M 170 ${torsoTopY + 4} Q ${170 - shoulderHalf * 0.45} ${torsoTopY + 5} ${170 - shoulderHalf * 0.85} ${torsoTopY}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.5"/>
        <path :d="`M 170 ${torsoTopY + 4} Q ${170 + shoulderHalf * 0.45} ${torsoTopY + 5} ${170 + shoulderHalf * 0.85} ${torsoTopY}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.5"/>

        <!-- Pectorals / Chest Armor Plates (立体胸肌厚甲) -->
        <path :d="pecsLeft3D" fill="url(#absBlockGrad)" :stroke="themeColors.highlight" stroke-width="1.3" class="transition-all duration-300"/>
        <path :d="pecsRight3D" fill="url(#absBlockGrad)" :stroke="themeColors.highlight" stroke-width="1.3" class="transition-all duration-300"/>

        <!-- Sternum Center Cleavage Line (胸骨中缝) -->
        <line x1="170" :y1="torsoTopY + 4" x2="170" :y2="chestY + 16" :stroke="themeColors.muscleLine" stroke-width="1.5"/>

        <!-- Deltoid 3D Rounded Muscle Sphere Caps (三角肌三束) -->
        <path :d="`M ${170 - shoulderHalf + 8} ${torsoTopY} Q ${170 - shoulderHalf + 14} ${torsoTopY + 22} ${170 - chestHalf - 2} ${chestY - 8}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>
        <path :d="`M ${170 + shoulderHalf - 8} ${torsoTopY} Q ${170 + shoulderHalf - 14} ${torsoTopY + 22} ${170 + chestHalf + 2} ${chestY - 8}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>

        <!-- Biceps Peak Arc (肱二头肌峰与肘部分界) -->
        <path :d="`M ${170 - shoulderHalf - armRadius * 0.2} ${chestY} Q ${170 - shoulderHalf - armRadius * 0.8} ${chestY + 22} ${170 - shoulderHalf - armRadius * 0.2} ${chestY + 44}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <path :d="`M ${170 + shoulderHalf + armRadius * 0.2} ${chestY} Q ${170 + shoulderHalf + armRadius * 0.8} ${chestY + 22} ${170 + shoulderHalf + armRadius * 0.2} ${chestY + 44}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>

        <!-- Serratus Anterior / Ribcage (前锯肌鲨鱼线) -->
        <path :d="`M ${170 - chestHalf * 0.85} ${chestY + 18} L ${170 - waistHalf * 0.72} ${chestY + 30}`" stroke="rgba(255,255,255,0.25)" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 - chestHalf * 0.8} ${chestY + 34} L ${170 - waistHalf * 0.68} ${chestY + 46}`" stroke="rgba(255,255,255,0.25)" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 + chestHalf * 0.85} ${chestY + 18} L ${170 + waistHalf * 0.72} ${chestY + 30}`" stroke="rgba(255,255,255,0.25)" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 + chestHalf * 0.8} ${chestY + 34} L ${170 + waistHalf * 0.68} ${chestY + 46}`" stroke="rgba(255,255,255,0.25)" stroke-width="1" class="transition-all duration-300"/>

        <!-- Six-Pack Abs (3D 雕刻腹肌 6 块) -->
        <line x1="170" :y1="chestY + 16" x2="170" :y2="waistY + 8" :stroke="themeColors.muscleLine" stroke-width="1.4"/>
        <!-- Upper Abs Row 1 -->
        <rect :x="170 - waistHalf * 0.42" :y="chestY + 20" :width="waistHalf * 0.36" height="14" rx="3.5" fill="url(#absBlockGrad)" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <rect :x="170 + waistHalf * 0.06" :y="chestY + 20" :width="waistHalf * 0.36" height="14" rx="3.5" fill="url(#absBlockGrad)" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <!-- Mid Abs Row 2 -->
        <rect :x="170 - waistHalf * 0.45" :y="chestY + 38" :width="waistHalf * 0.38" height="15" rx="3.5" fill="url(#absBlockGrad)" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <rect :x="170 + waistHalf * 0.07" :y="chestY + 38" :width="waistHalf * 0.38" height="15" rx="3.5" fill="url(#absBlockGrad)" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <!-- Lower Abs Row 3 -->
        <rect :x="170 - waistHalf * 0.42" :y="chestY + 57" :width="waistHalf * 0.36" height="15" rx="3.5" fill="url(#absBlockGrad)" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <rect :x="170 + waistHalf * 0.06" :y="chestY + 57" :width="waistHalf * 0.36" height="15" rx="3.5" fill="url(#absBlockGrad)" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>

        <!-- Adonis Belt / V-Cut (人鱼线 / 腹股沟) -->
        <path :d="`M ${170 - waistHalf * 0.9} ${waistY - 5} Q ${170 - waistHalf * 0.4} ${waistY + 12} 170 ${waistY + 28}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>
        <path :d="`M ${170 + waistHalf * 0.9} ${waistY - 5} Q ${170 + waistHalf * 0.4} ${waistY + 12} 170 ${waistY + 28}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>

        <!-- Vastus Medialis / Quad Teardrop & Knee (股内侧泪滴肌与膝盖骨) -->
        <path :d="`M ${170 - thighCenter + 5} ${kneeY - 38} Q ${170 - thighCenter + 2} ${kneeY - 18} ${170 - thighCenter + 7} ${kneeY - 8}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>
        <path :d="`M ${170 + thighCenter - 5} ${kneeY - 38} Q ${170 + thighCenter - 2} ${kneeY - 18} ${170 + thighCenter - 7} ${kneeY - 8}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>
        <!-- Kneecaps / Patella (膝盖骨) -->
        <ellipse :cx="170 - thighCenter" :cy="kneeY" rx="4.5" ry="5.5" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>
        <ellipse :cx="170 + thighCenter" :cy="kneeY" rx="4.5" ry="5.5" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.3" class="transition-all duration-300"/>
        <!-- Calf Diamonds / Gastrocnemius (小腿腓肠肌钻石峰) -->
        <path :d="`M ${170 - thighCenter - 7} ${kneeY + 22} Q ${170 - thighCenter - 13} ${kneeY + 44} ${170 - thighCenter - 3} ${kneeY + 65}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <path :d="`M ${170 + thighCenter + 7} ${kneeY + 22} Q ${170 + thighCenter + 13} ${kneeY + 44} ${170 + thighCenter + 3} ${kneeY + 65}`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>

        <!-- ============================================== -->
        <!-- 3. Dynamic Laser Precision Caliper Callouts -->
        <!-- ============================================== -->

        <!-- A. Chest Caliper (Left) -->
        <g class="transition-all duration-300">
          <line :x1="170 - chestHalf - 18" :y1="chestY" :x2="170 + chestHalf + 18" :y2="chestY"
                stroke="url(#laserScanGrad)" stroke-width="1.5" stroke-dasharray="2 2"/>
          <circle :cx="170 - chestHalf" :cy="chestY" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <circle :cx="170 + chestHalf" :cy="chestY" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <!-- Chest Callout Tag -->
          <rect :x="170 - chestHalf - 66" :y="chestY - 10" width="60" height="20" rx="6" fill="#09090b" :stroke="themeColors.primary" stroke-width="1.2"/>
          <text :x="170 - chestHalf - 36" :y="chestY + 4" font-family="'Impact', monospace" font-size="10" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            胸围 {{ safeChest }}cm
          </text>
        </g>

        <!-- B. Waist Caliper (Right) -->
        <g class="transition-all duration-300">
          <line :x1="170 - waistHalf - 18" :y1="waistY" :x2="170 + waistHalf + 18" :y2="waistY"
                stroke="url(#laserScanGrad)" stroke-width="1.5" stroke-dasharray="2 2"/>
          <circle :cx="170 - waistHalf" :cy="waistY" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <circle :cx="170 + waistHalf" :cy="waistY" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <!-- Waist Callout Tag -->
          <rect :x="170 + waistHalf + 6" :y="waistY - 10" width="60" height="20" rx="6" fill="#09090b" :stroke="themeColors.primary" stroke-width="1.2"/>
          <text :x="170 + waistHalf + 36" :y="waistY + 4" font-family="'Impact', monospace" font-size="10" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            腰围 {{ safeWaist }}cm
          </text>
        </g>

        <!-- C. Arm Bicep Dimension (Right Outer Arm) -->
        <g class="transition-all duration-300">
          <line :x1="170 + shoulderHalf + armRadius * 0.9" :y1="chestY + 16" :x2="170 + shoulderHalf + armRadius * 0.9 + 18" :y2="chestY + 16"
                :stroke="themeColors.secondary" stroke-width="1.2"/>
          <circle :cx="170 + shoulderHalf + armRadius * 0.9" :cy="chestY + 16" r="3" :fill="themeColors.highlight"/>
          <rect :x="170 + shoulderHalf + armRadius * 0.9 + 18" :y="chestY + 6" width="56" height="18" rx="5" fill="#09090b" :stroke="themeColors.secondary" stroke-width="1"/>
          <text :x="170 + shoulderHalf + armRadius * 0.9 + 46" :y="chestY + 19" font-family="'Impact', monospace" font-size="9.5" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            臂围 {{ safeArm }}cm
          </text>
        </g>

        <!-- D. Thigh Dimension (Left Quad) -->
        <g class="transition-all duration-300">
          <line :x1="170 - thighCenter - thighRadius * 0.95" :y1="kneeY - 50" :x2="170 - thighCenter - thighRadius * 0.95 - 18" :y2="kneeY - 50"
                :stroke="themeColors.secondary" stroke-width="1.2"/>
          <circle :cx="170 - thighCenter - thighRadius * 0.95" :cy="kneeY - 50" r="3" :fill="themeColors.highlight"/>
          <rect :x="170 - thighCenter - thighRadius * 0.95 - 74" :y="kneeY - 59" width="56" height="18" rx="5" fill="#09090b" :stroke="themeColors.secondary" stroke-width="1"/>
          <text :x="170 - thighCenter - thighRadius * 0.95 - 46" :y="kneeY - 46" font-family="'Impact', monospace" font-size="9.5" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            大腿 {{ safeThigh }}cm
          </text>
        </g>

      </svg>
    </div>

    <!-- Bottom Metric Calibration Summary Bar -->
    <div class="w-full grid grid-cols-4 gap-1.5 pt-2 border-t border-zinc-800/80 text-center font-mono text-[10px] z-10">
      <div class="p-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">胸腰比例</span>
        <span class="font-bold text-amber-300">{{ currentVTaper }}</span>
      </div>
      <div class="p-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">臂胸协同</span>
        <span class="font-bold text-sky-400">{{ (safeArm / safeChest * 100).toFixed(0) }}%</span>
      </div>
      <div class="p-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">腿腰比重</span>
        <span class="font-bold text-emerald-400">{{ (safeThigh / safeWaist * 100).toFixed(0) }}%</span>
      </div>
      <div class="p-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">自然健美</span>
        <span class="font-bold text-white">{{ vTaperRating.shortGrade }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store } from "../store/fitnessStore.js";

const props = defineProps({
  arm: { type: [Number, String], default: 35 },
  chest: { type: [Number, String], default: 100 },
  waist: { type: [Number, String], default: 80 },
  thigh: { type: [Number, String], default: 56 },
  weight: { type: [Number, String], default: 72 }
});

const showHeightPicker = ref(false);

// User Height (stored in store.settings.userHeight, defaults to 175cm)
const userHeight = computed({
  get() {
    return store.settings.userHeight || 175;
  },
  set(val) {
    store.settings.userHeight = Number(val) || 175;
  }
});

function saveHeightPreference() {
  showHeightPicker.value = false;
}

// Clamped Safe Numbers for Human Physiology (70kg-120kg Bodybuilders / Athletes)
const safeArm = computed(() => Math.max(22, Math.min(60, Number(props.arm) || 35)));
const safeChest = computed(() => Math.max(75, Math.min(145, Number(props.chest) || 100)));
const safeWaist = computed(() => Math.max(55, Math.min(130, Number(props.waist) || 80)));
const safeThigh = computed(() => Math.max(40, Math.min(85, Number(props.thigh) || 56)));
const safeWeight = computed(() => Math.max(45, Math.min(150, Number(props.weight) || 72)));

// BMI Calculation
const bmiValue = computed(() => {
  const hM = userHeight.value / 100;
  if (hM <= 0) return "22.5";
  return (safeWeight.value / (hM * hM)).toFixed(1);
});

const bmiCategory = computed(() => {
  const b = parseFloat(bmiValue.value);
  if (b < 18.5) return "偏瘦";
  if (b < 24.0) return "标准精壮";
  if (b < 27.9) return "强壮超重";
  return "高强健力";
});

// Head-to-Body Proportion Scale Factor (Determined by Height)
const heightScale = computed(() => {
  // Height 175cm is baseline 1.0
  return userHeight.value / 175;
});

const headToBodyRatio = computed(() => {
  // 160cm -> 6.9, 175cm -> 7.5, 185cm -> 7.9, 195cm -> 8.3
  return (6.4 + (userHeight.value - 150) * 0.035).toFixed(1);
});

// Vertical Anatomy Coordinates based on Height
const headCenterY = computed(() => 34);
const headRadiusX = computed(() => 13.5 / Math.sqrt(heightScale.value));
const headRadiusY = computed(() => 17 / Math.sqrt(heightScale.value));

const torsoTopY = computed(() => 64);
const chestY = computed(() => 64 + 38 * heightScale.value);
const waistY = computed(() => chestY.value + 68 * heightScale.value);
const hipY = computed(() => waistY.value + 36 * heightScale.value);
const kneeY = computed(() => hipY.value + 120 * heightScale.value);
const footY = computed(() => kneeY.value + 105 * heightScale.value);

// Horizontal Anatomical Proportions
const chestHalf = computed(() => {
  return 42 + (safeChest.value - 75) * 0.42;
});

const waistHalf = computed(() => {
  return 26 + (safeWaist.value - 55) * 0.35;
});

const shoulderHalf = computed(() => {
  return chestHalf.value + 16 + (safeArm.value - 25) * 0.28;
});

const armRadius = computed(() => {
  return 8 + (safeArm.value - 22) * 0.32;
});

const thighCenter = computed(() => {
  return waistHalf.value * 0.48 + 14;
});

const thighRadius = computed(() => {
  return 14 + (safeThigh.value - 40) * 0.30;
});

// V-Taper Ratio
const currentVTaper = computed(() => {
  if (safeWaist.value <= 0) return "1.25";
  return (safeChest.value / safeWaist.value).toFixed(2);
});

// Aesthetic V-Taper Rating Grade (Realistic Natural Sports Science Standards)
const vTaperRating = computed(() => {
  const ratio = parseFloat(currentVTaper.value);
  if (ratio >= 1.35) {
    return { title: "卓越古典倒三角", shortGrade: "殿堂 S+", icon: "👑", color: "amber" };
  } else if (ratio >= 1.26) {
    return { title: "战术黄金倒三角", shortGrade: "战神 S", icon: "🔥", color: "sky" };
  } else if (ratio >= 1.18) {
    return { title: "匀称精壮体型", shortGrade: "精英 A", icon: "⚡", color: "emerald" };
  } else if (ratio >= 1.10) {
    return { title: "健康力量体态", shortGrade: "先锋 B", icon: "🌱", color: "indigo" };
  } else {
    return { title: "力量筑基体格", shortGrade: "新兵 C", icon: "🛡️", color: "zinc" };
  }
});

const vTaperBadgeClass = computed(() => {
  const c = vTaperRating.value.color;
  if (c === "amber") return "bg-amber-500/15 border-amber-500/50 text-amber-300";
  if (c === "sky") return "bg-sky-500/15 border-sky-500/50 text-sky-300";
  if (c === "emerald") return "bg-emerald-500/15 border-emerald-500/50 text-emerald-300";
  if (c === "indigo") return "bg-indigo-500/15 border-indigo-500/50 text-indigo-300";
  return "bg-zinc-800 border-zinc-700 text-zinc-400";
});

// Theme Colors Adaptation
const currentSkin = computed(() => store.settings.uiSkin || "default");

const themeGlowClass = computed(() => {
  if (currentSkin.value === "cs") return "bg-orange-600";
  if (currentSkin.value === "chamber") return "bg-amber-400";
  return "bg-amber-500";
});

const themeColors = computed(() => {
  if (currentSkin.value === "cs") {
    return {
      primary: "#F97316",
      secondary: "#38BDF8",
      highlight: "#FDE047",
      stroke: "#F97316",
      muscleLine: "rgba(249, 115, 22, 0.55)"
    };
  } else if (currentSkin.value === "chamber") {
    return {
      primary: "#EAB308",
      secondary: "#06B6D4",
      highlight: "#FFFBEB",
      stroke: "#EAB308",
      muscleLine: "rgba(234, 179, 8, 0.6)"
    };
  } else {
    return {
      primary: "#F59E0B",
      secondary: "#10B981",
      highlight: "#FEF08A",
      stroke: "#F59E0B",
      muscleLine: "rgba(245, 158, 11, 0.55)"
    };
  }
});

// Pectoral Plate Left
const pecsLeft3D = computed(() => {
  const ch = chestHalf.value;
  const ty = torsoTopY.value;
  const cy = chestY.value;
  return `M 170 ${ty + 6} L ${170 - ch * 0.85} ${ty + 10} Q ${170 - ch * 0.95} ${cy - 2} ${170 - ch * 0.4} ${cy + 14} L 170 ${cy + 14} Z`;
});

// Pectoral Plate Right
const pecsRight3D = computed(() => {
  const ch = chestHalf.value;
  const ty = torsoTopY.value;
  const cy = chestY.value;
  return `M 170 ${ty + 6} L ${170 + ch * 0.85} ${ty + 10} Q ${170 + ch * 0.95} ${cy - 2} ${170 + ch * 0.4} ${cy + 14} L 170 ${cy + 14} Z`;
});

// Realistic Anthropomorphic 3D Humanoid Body Vector Path
const humanoidBodyPath = computed(() => {
  const sh = shoulderHalf.value;
  const ch = chestHalf.value;
  const wh = waistHalf.value;
  const ar = armRadius.value;
  const tc = thighCenter.value;
  const tr = thighRadius.value;
  const hip = wh + 5;

  const ty = torsoTopY.value;
  const cy = chestY.value;
  const wy = waistY.value;
  const hy = hipY.value;
  const ky = kneeY.value;
  const fy = Math.min(442, footY.value);

  return `
    M 170 ${ty - 2}
    C 178 ${ty - 2} ${170 + sh * 0.5} ${ty} ${170 + sh - 8} ${ty + 6}
    C ${170 + sh} ${ty + 8} ${170 + sh + 4} ${ty + 14} ${170 + sh + 4} ${ty + 24}
    C ${170 + sh + 4 + ar} ${cy - 6} ${170 + sh + 4 + ar * 0.9} ${cy + 20} ${170 + sh + 2 + ar * 0.6} ${cy + 45}
    C ${170 + sh + ar * 0.3} ${cy + 60} ${170 + sh - 2} ${wy + 5} ${170 + sh - 4} ${wy + 25}
    C ${170 + sh - 6} ${wy + 40} ${170 + sh - 8} ${wy + 55} ${170 + sh - 10} ${wy + 65}
    C ${170 + sh - 14} ${wy + 70} ${170 + sh - 18} ${wy + 68} ${170 + sh - 18} ${wy + 60}
    C ${170 + sh - 14} ${wy + 45} ${170 + sh - 12} ${wy + 25} ${170 + sh - 12} ${cy + 75}
    C ${170 + sh - 10} ${cy + 55} ${170 + ch + 6} ${cy + 25} ${170 + ch} ${cy + 14}
    C ${170 + ch - 2} ${cy + 25} ${170 + wh + 6} ${wy - 15} ${170 + wh} ${wy}
    C ${170 + wh - 2} ${wy + 12} ${170 + hip} ${hy - 12} ${170 + hip} ${hy}
    C ${170 + tc + tr + 2} ${hy + 20} ${170 + tc + tr + 4} ${ky - 55} ${170 + tc + tr} ${ky - 25}
    C ${170 + tc + tr * 0.5} ${ky - 5} ${170 + tc + 6} ${ky} ${170 + tc + 6} ${ky + 10}
    C ${170 + tc + 10} ${ky + 25} ${170 + tc + 10} ${ky + 50} ${170 + tc + 4} ${fy - 25}
    C ${170 + tc + 3} ${fy - 12} ${170 + tc + 4} ${fy - 4} ${170 + tc + 4} ${fy}
    L ${170 + tc - 8} ${fy}
    C ${170 + tc - 6} ${fy - 8} ${170 + tc - 4} ${fy - 18} ${170 + tc - 4} ${fy - 25}
    C ${170 + tc - 6} ${ky + 50} ${170 + tc - 6} ${ky + 25} ${170 + tc - 4} ${ky + 10}
    C ${170 + tc - 4} ${ky} ${170 + tc - tr * 0.5} ${ky - 5} ${170 + tc - tr * 0.8} ${ky - 25}
    C ${170 + tc - tr * 0.6} ${ky - 55} ${170 + 8} ${hy + 30} 170 ${hy + 15}
    C ${170 - 8} ${hy + 30} ${170 - tc + tr * 0.6} ${ky - 55} ${170 - tc + tr * 0.8} ${ky - 25}
    C ${170 - tc + tr * 0.5} ${ky - 5} ${170 - tc + 4} ${ky} ${170 - tc + 4} ${ky + 10}
    C ${170 - tc + 6} ${ky + 25} ${170 - tc + 6} ${ky + 50} ${170 - tc + 4} ${fy - 25}
    C ${170 - tc + 4} ${fy - 18} ${170 - tc + 6} ${fy - 8} ${170 - tc + 8} ${fy}
    L ${170 - tc - 4} ${fy}
    C ${170 - tc - 4} ${fy - 4} ${170 - tc - 3} ${fy - 12} ${170 - tc - 4} ${fy - 25}
    C ${170 - tc - 10} ${ky + 50} ${170 - tc - 10} ${ky + 25} ${170 - tc - 6} ${ky + 10}
    C ${170 - tc - 6} ${ky} ${170 - tc - tr * 0.5} ${ky - 5} ${170 - tc - tr} ${ky - 25}
    C ${170 - tc - tr - 4} ${ky - 55} ${170 - tc - tr - 2} ${hy + 20} ${170 - hip} ${hy}
    C ${170 - hip} ${hy - 12} ${170 - wh + 2} ${wy + 12} ${170 - wh} ${wy}
    C ${170 - wh - 6} ${wy - 15} ${170 - ch + 2} ${cy + 25} ${170 - ch} ${cy + 14}
    C ${170 - ch - 6} ${cy + 25} ${170 - sh + 10} ${cy + 55} ${170 - sh + 12} ${cy + 75}
    C ${170 - sh + 12} ${wy + 25} ${170 - sh + 14} ${wy + 45} ${170 - sh + 18} ${wy + 60}
    C ${170 - sh + 18} ${wy + 68} ${170 - sh + 14} ${wy + 70} ${170 - sh + 10} ${wy + 65}
    C ${170 - sh + 8} ${wy + 55} ${170 - sh + 6} ${wy + 40} ${170 - sh + 4} ${wy + 25}
    C ${170 - sh + 2} ${wy + 5} ${170 - sh - ar * 0.3} ${cy + 60} ${170 - sh - 2 - ar * 0.6} ${cy + 45}
    C ${170 - sh - 4 - ar * 0.9} ${cy + 20} ${170 - sh - 4 - ar} ${cy - 6} ${170 - sh - 4} ${ty + 24}
    C ${170 - sh - 4} ${ty + 14} ${170 - sh} ${ty + 8} ${170 - sh + 8} ${ty + 6}
    C ${170 - sh * 0.5} ${ty} 162 ${ty - 2} 170 ${ty - 2}
    Z
  `.replace(/\s+/g, " ");
});
</script>
