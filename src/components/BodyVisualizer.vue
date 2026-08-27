<template>
  <div class="relative w-full rounded-2xl bg-zinc-950/90 border border-zinc-800/90 p-3 overflow-hidden shadow-inner flex flex-col items-center select-none">
    
    <!-- Background Tactical / Holographic Grid -->
    <div class="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]"></div>
    
    <!-- Ambient Holographic Glow Aura -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-20"
         :class="themeGlowClass"></div>

    <!-- Top Floating Header & V-Taper Badge -->
    <div class="w-full flex items-center justify-between z-10 mb-1 text-left">
      <div class="flex items-center gap-1.5">
        <span class="text-xs">🧬</span>
        <span class="text-[11px] font-black text-white tracking-wide">3D 参数化形体比例透视</span>
      </div>
      <div class="flex items-center gap-1 font-mono">
        <span class="text-[9px] px-2 py-0.5 rounded-full border font-bold transition-all duration-300"
              :class="vTaperBadgeClass">
          {{ vTaperRating.icon }} {{ vTaperRating.title }} ({{ currentVTaper }})
        </span>
      </div>
    </div>

    <!-- Parametric Morphing Silhouette Canvas / SVG -->
    <div class="relative w-full max-w-[280px] h-[310px] flex items-center justify-center my-1 z-10">
      <svg viewBox="0 0 320 380" class="w-full h-full filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
        <defs>
          <!-- Body Mesh Linear Gradient -->
          <linearGradient id="bodySkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="themeColors.highlight" stop-opacity="0.9"/>
            <stop offset="30%" :stop-color="themeColors.primary" stop-opacity="0.6"/>
            <stop offset="70%" :stop-color="themeColors.secondary" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#09090b" stop-opacity="0.9"/>
          </linearGradient>

          <!-- Laser Scan Line Gradient -->
          <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="themeColors.primary" stop-opacity="0"/>
            <stop offset="50%" :stop-color="themeColors.highlight" stop-opacity="1"/>
            <stop offset="100%" :stop-color="themeColors.primary" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- Center Symmetry Axis Guide -->
        <line x1="160" y1="15" x2="160" y2="375" stroke="#27272a" stroke-width="1" stroke-dasharray="3 3"/>

        <!-- Real-Time Parametric Torso & Body Silhouette Path -->
        <path :d="bodySvgPath"
              fill="url(#bodySkinGrad)"
              :stroke="themeColors.stroke"
              stroke-width="2.5"
              stroke-linejoin="round"
              class="transition-all duration-300 ease-out"/>

        <!-- Pectoral Anatomy Muscle Sculpt Lines -->
        <path :d="pecsLeftSvgPath" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.5" class="transition-all duration-300"/>
        <path :d="pecsRightSvgPath" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.5" class="transition-all duration-300"/>

        <!-- Core / Six-Pack Abdominal Guide Lines -->
        <line :x1="160 - waistHalf * 0.4" :y1="135" :x2="160 + waistHalf * 0.4" :y2="135" :stroke="themeColors.muscleLine" stroke-width="1" stroke-dasharray="2 2"/>
        <line :x1="160 - waistHalf * 0.45" :y1="155" :x2="160 + waistHalf * 0.45" :y2="155" :stroke="themeColors.muscleLine" stroke-width="1" stroke-dasharray="2 2"/>
        <line :x1="160 - waistHalf * 0.4" :y1="175" :x2="160 + waistHalf * 0.4" :y2="175" :stroke="themeColors.muscleLine" stroke-width="1" stroke-dasharray="2 2"/>

        <!-- ============================================== -->
        <!-- Interactive Laser Measurement Dimension Guides -->
        <!-- ============================================== -->

        <!-- 1. Chest Laser Indicator Line -->
        <g class="transition-all duration-300">
          <line :x1="160 - chestHalf - 25" :y1="108" :x2="160 + chestHalf + 25" :y2="108"
                stroke="url(#laserGrad)" stroke-width="1.5" stroke-dasharray="2 2"/>
          <circle :cx="160 - chestHalf" cy="108" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <circle :cx="160 + chestHalf" cy="108" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <!-- Chest Readout Pill (Left) -->
          <rect :x="160 - chestHalf - 58" y="98" width="52" height="18" rx="4" fill="#09090b" :stroke="themeColors.primary" stroke-width="1"/>
          <text :x="160 - chestHalf - 32" y="111" font-family="'Impact', monospace" font-size="10" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            胸 {{ safeChest }}cm
          </text>
        </g>

        <!-- 2. Waist Laser Indicator Line (V-Taper Pivot) -->
        <g class="transition-all duration-300">
          <line :x1="160 - waistHalf - 25" :y1="180" :x2="160 + waistHalf + 25" :y2="180"
                stroke="url(#laserGrad)" stroke-width="1.5" stroke-dasharray="2 2"/>
          <circle :cx="160 - waistHalf" cy="180" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <circle :cx="160 + waistHalf" cy="180" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <!-- Waist Readout Pill (Right) -->
          <rect :x="160 + waistHalf + 6" y="170" width="52" height="18" rx="4" fill="#09090b" :stroke="themeColors.primary" stroke-width="1"/>
          <text :x="160 + waistHalf + 32" y="183" font-family="'Impact', monospace" font-size="10" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            腰 {{ safeWaist }}cm
          </text>
        </g>

        <!-- 3. Arm Bicep Dimension Pin (Right Arm) -->
        <g class="transition-all duration-300">
          <line :x1="160 + shoulderHalf + armRadius" y1="125" :x2="160 + shoulderHalf + armRadius + 18" y2="125"
                :stroke="themeColors.secondary" stroke-width="1"/>
          <circle :cx="160 + shoulderHalf + armRadius" cy="125" r="3" :fill="themeColors.highlight"/>
          <rect :x="160 + shoulderHalf + armRadius + 18" y="116" width="48" height="16" rx="4" fill="#09090b" :stroke="themeColors.secondary" stroke-width="1"/>
          <text :x="160 + shoulderHalf + armRadius + 42" y="128" font-family="'Impact', monospace" font-size="9" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            臂 {{ safeArm }}cm
          </text>
        </g>

        <!-- 4. Thigh Dimension Pin (Left Thigh) -->
        <g class="transition-all duration-300">
          <line :x1="160 - thighCenter - thighRadius" y1="260" :x2="160 - thighCenter - thighRadius - 18" y2="260"
                :stroke="themeColors.secondary" stroke-width="1"/>
          <circle :cx="160 - thighCenter - thighRadius" cy="260" r="3" :fill="themeColors.highlight"/>
          <rect :x="160 - thighCenter - thighRadius - 66" y="251" width="48" height="16" rx="4" fill="#09090b" :stroke="themeColors.secondary" stroke-width="1"/>
          <text :x="160 - thighCenter - thighRadius - 42" y="263" font-family="'Impact', monospace" font-size="9" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            腿 {{ safeThigh }}cm
          </text>
        </g>
      </svg>
    </div>

    <!-- Bottom Real-Time Morphing Calibration Stats Strip -->
    <div class="w-full grid grid-cols-4 gap-1.5 pt-2 border-t border-zinc-800/80 text-center font-mono text-[10px]">
      <div class="p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">胸腰比例</span>
        <span class="font-bold text-amber-300">{{ currentVTaper }}</span>
      </div>
      <div class="p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">臂胸协同</span>
        <span class="font-bold text-sky-400">{{ (safeArm / safeChest * 100).toFixed(0) }}%</span>
      </div>
      <div class="p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">腿腰比重</span>
        <span class="font-bold text-emerald-400">{{ (safeThigh / safeWaist * 100).toFixed(0) }}%</span>
      </div>
      <div class="p-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <span class="text-zinc-500 text-[8px] block">健美评级</span>
        <span class="font-bold text-white">{{ vTaperRating.shortGrade }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store/fitnessStore.js";

const props = defineProps({
  arm: { type: [Number, String], default: 35 },
  chest: { type: [Number, String], default: 100 },
  waist: { type: [Number, String], default: 80 },
  thigh: { type: [Number, String], default: 56 },
  weight: { type: [Number, String], default: 72 }
});

// Safe Fallback Numbers
const safeArm = computed(() => Math.max(20, Math.min(60, Number(props.arm) || 35)));
const safeChest = computed(() => Math.max(60, Math.min(150, Number(props.chest) || 100)));
const safeWaist = computed(() => Math.max(50, Math.min(140, Number(props.waist) || 80)));
const safeThigh = computed(() => Math.max(35, Math.min(90, Number(props.thigh) || 56)));

// Parametric Coordinate Math for Morphing SVG
const chestHalf = computed(() => {
  return 38 + (safeChest.value - 70) * 0.58;
});

const waistHalf = computed(() => {
  return 26 + (safeWaist.value - 60) * 0.45;
});

const shoulderHalf = computed(() => {
  return chestHalf.value + 16 + (safeArm.value - 25) * 0.35;
});

const armRadius = computed(() => {
  return 8 + (safeArm.value - 25) * 0.38;
});

const thighCenter = computed(() => {
  return waistHalf.value * 0.55 + 12;
});

const thighRadius = computed(() => {
  return 12 + (safeThigh.value - 40) * 0.36;
});

// V-Taper Ratio
const currentVTaper = computed(() => {
  if (safeWaist.value <= 0) return "1.25";
  return (safeChest.value / safeWaist.value).toFixed(2);
});

// Aesthetic V-Taper Rating Grade
const vTaperRating = computed(() => {
  const ratio = parseFloat(currentVTaper.value);
  if (ratio >= 1.55) {
    return { title: "阿诺德黄金倒三角", shortGrade: "殿堂 S+", icon: "👑", color: "amber" };
  } else if (ratio >= 1.40) {
    return { title: "古典健美倒三角", shortGrade: "战神 S", icon: "⚡", color: "sky" };
  } else if (ratio >= 1.28) {
    return { title: "硬核战术身形", shortGrade: "精英 A", icon: "🔥", color: "emerald" };
  } else if (ratio >= 1.18) {
    return { title: "健壮匀称雏形", shortGrade: "先锋 B", icon: "🌱", color: "indigo" };
  } else {
    return { title: "力量稳固基石", shortGrade: "新兵 C", icon: "🛡️", color: "zinc" };
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
      muscleLine: "rgba(249, 115, 22, 0.45)"
    };
  } else if (currentSkin.value === "chamber") {
    return {
      primary: "#EAB308",
      secondary: "#06B6D4",
      highlight: "#FFFBEB",
      stroke: "#EAB308",
      muscleLine: "rgba(234, 179, 8, 0.5)"
    };
  } else {
    return {
      primary: "#F59E0B",
      secondary: "#10B981",
      highlight: "#FEF08A",
      stroke: "#F59E0B",
      muscleLine: "rgba(245, 158, 11, 0.45)"
    };
  }
});

// Parametric SVG Full Human Silhouette Path
const bodySvgPath = computed(() => {
  const sh = shoulderHalf.value;
  const ch = chestHalf.value;
  const wh = waistHalf.value;
  const hh = wh + 6;
  const tc = thighCenter.value;
  const tr = thighRadius.value;
  const ar = armRadius.value;

  return `
    M 160 20
    C 172 20 178 30 178 44
    C 178 56 170 66 166 70
    L 168 76
    C 180 77 ${160 + sh - 8} 82 ${160 + sh} 88
    C ${160 + sh + ar} 96 ${160 + sh + ar + 4} 120 ${160 + sh + ar} 145
    C ${160 + sh + ar - 4} 165 ${160 + sh - 4} 185 ${160 + sh - 10} 220
    C ${160 + sh - 14} 230 ${160 + sh - 20} 230 ${160 + sh - 22} 222
    C ${160 + sh - 18} 190 ${160 + sh - 14} 165 ${160 + sh - 14} 140
    C ${160 + ch + 8} 125 ${160 + ch} 120 ${160 + ch} 115
    C ${160 + ch} 130 ${160 + wh + 4} 160 ${160 + wh} 180
    C ${160 + wh} 192 ${160 + hh} 205 ${160 + hh} 215
    C ${160 + tc + tr + 4} 235 ${160 + tc + tr + 6} 265 ${160 + tc + tr} 295
    C ${160 + tc + 14} 320 ${160 + tc + 16} 345 ${160 + tc + 14} 368
    L ${160 + tc - 4} 368
    C ${160 + tc - 6} 345 ${160 + tc - 4} 320 ${160 + tc - tr * 0.4} 295
    C ${160 + tc - tr * 0.8} 265 ${160 + 6} 240 160 226
    C ${160 - 6} 240 ${160 - tc + tr * 0.8} 265 ${160 - tc + tr * 0.4} 295
    C ${160 - tc + 4} 320 ${160 - tc + 6} 345 ${160 - tc + 4} 368
    L ${160 - tc - 14} 368
    C ${160 - tc - 16} 345 ${160 - tc - 14} 320 ${160 - tc - tr} 295
    C ${160 - tc - tr - 6} 265 ${160 - tc - tr - 4} 235 ${160 - hh} 215
    C ${160 - hh} 205 ${160 - wh} 192 ${160 - wh} 180
    C ${160 - wh - 4} 160 ${160 - ch} 130 ${160 - ch} 115
    C ${160 - ch} 120 ${160 - ch - 8} 125 ${160 - sh + 14} 140
    C ${160 - sh + 14} 165 ${160 - sh + 18} 190 ${160 - sh + 22} 222
    C ${160 - sh + 20} 230 ${160 - sh + 14} 230 ${160 - sh + 10} 220
    C ${160 - sh + 4} 185 ${160 - sh - ar + 4} 165 ${160 - sh - ar} 145
    C ${160 - sh - ar - 4} 120 ${160 - sh - ar} 96 ${160 - sh} 88
    C ${160 - sh + 8} 82 140 77 152 76
    L 154 70
    C 150 66 142 56 142 44
    C 142 30 148 20 160 20
    Z
  `.replace(/\s+/g, " ");
});

// Left Pectoral Arc
const pecsLeftSvgPath = computed(() => {
  const ch = chestHalf.value;
  return `M 158 95 C 158 116 ${160 - ch * 0.6} 120 ${160 - ch * 0.9} 112`;
});

// Right Pectoral Arc
const pecsRightSvgPath = computed(() => {
  const ch = chestHalf.value;
  return `M 162 95 C 162 116 ${160 + ch * 0.6} 120 ${160 + ch * 0.9} 112`;
});
</script>
