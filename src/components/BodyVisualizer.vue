<template>
  <div class="relative w-full rounded-2xl bg-zinc-950/95 border border-zinc-800 p-3.5 overflow-hidden shadow-2xl flex flex-col items-center select-none">
    
    <!-- Background Technical Grid & Ambient Lighting -->
    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:20px_20px]"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
         :class="themeGlowClass"></div>

    <!-- Header: Title and Live V-Taper Badge -->
    <div class="w-full flex items-center justify-between z-10 mb-1 text-left">
      <div class="flex items-center gap-1.5">
        <span class="text-sm">🧬</span>
        <div>
          <h4 class="text-xs font-black text-white tracking-wide">3D 写实健美形体比例透视</h4>
          <p class="text-[9px] text-zinc-500 font-mono">基于人体测量学实时生成体态</p>
        </div>
      </div>
      <div class="flex items-center gap-1 font-mono">
        <span class="text-[10px] px-2.5 py-1 rounded-xl border font-black transition-all duration-300 shadow-sm"
              :class="vTaperBadgeClass">
          {{ vTaperRating.icon }} {{ vTaperRating.title }} ({{ currentVTaper }})
        </span>
      </div>
    </div>

    <!-- Realistic Human Physique Morphing SVG Canvas -->
    <div class="relative w-full max-w-[320px] h-[360px] flex items-center justify-center my-1 z-10">
      <svg viewBox="0 0 340 440" class="w-full h-full filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
        <defs>
          <!-- 3D Muscle Shading Radial & Linear Gradients -->
          <linearGradient id="physiqueBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="themeColors.highlight" stop-opacity="0.95"/>
            <stop offset="25%" :stop-color="themeColors.primary" stop-opacity="0.8"/>
            <stop offset="65%" :stop-color="themeColors.secondary" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0.95"/>
          </linearGradient>

          <linearGradient id="muscleShadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
            <stop offset="50%" stop-color="#000000" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
          </linearGradient>

          <!-- Laser Scan Dimension Gradient -->
          <linearGradient id="laserScanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" :stop-color="themeColors.primary" stop-opacity="0"/>
            <stop offset="50%" :stop-color="themeColors.highlight" stop-opacity="0.9"/>
            <stop offset="100%" :stop-color="themeColors.primary" stop-opacity="0"/>
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- Center Symmetry Axis Guide -->
        <line x1="170" y1="12" x2="170" y2="435" stroke="#27272a" stroke-width="1" stroke-dasharray="3 3"/>

        <!-- ============================================== -->
        <!-- 1. Anatomical Realistic Human Outer Silhouette -->
        <!-- ============================================== -->
        <path :d="anatomicalBodyPath"
              fill="url(#physiqueBodyGrad)"
              :stroke="themeColors.stroke"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              class="transition-all duration-300 ease-out"/>

        <!-- Ambient Depth Overlay -->
        <path :d="anatomicalBodyPath"
              fill="url(#muscleShadeGrad)"
              class="pointer-events-none transition-all duration-300"/>

        <!-- ============================================== -->
        <!-- 2. Sculpted Muscle Group Anatomy Overlay Lines -->
        <!-- ============================================== -->

        <!-- Head & Facial / Neck Anatomy -->
        <ellipse cx="170" cy="36" rx="14" ry="18" fill="#18181b" :stroke="themeColors.stroke" stroke-width="1.5"/>
        <path d="M 164 48 C 167 52 173 52 176 48" fill="none" :stroke="themeColors.muscleLine" stroke-width="1"/>
        <!-- Clavicle / Collarbone (锁骨) -->
        <path :d="`M 170 66 Q ${170 - shoulderHalf * 0.45} 67 ${170 - shoulderHalf * 0.85} 63`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.5"/>
        <path :d="`M 170 66 Q ${170 + shoulderHalf * 0.45} 67 ${170 + shoulderHalf * 0.85} 63`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.5"/>

        <!-- Pectorals / Chest Muscle Plates (胸大肌胸甲) -->
        <path :d="pecsLeftPlate" fill="rgba(255,255,255,0.06)" :stroke="themeColors.highlight" stroke-width="1.2" class="transition-all duration-300"/>
        <path :d="pecsRightPlate" fill="rgba(255,255,255,0.06)" :stroke="themeColors.highlight" stroke-width="1.2" class="transition-all duration-300"/>

        <!-- Sternum Center Cleavage Line (胸骨中缝) -->
        <line x1="170" y1="67" x2="170" y2="120" :stroke="themeColors.muscleLine" stroke-width="1.2"/>

        <!-- Deltoid / Shoulder Separation Crease (三角肌羽状分界线) -->
        <path :d="`M ${170 - shoulderHalf + 10} 63 Q ${170 - shoulderHalf + 16} 85 ${170 - chestHalf - 4} 95`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <path :d="`M ${170 + shoulderHalf - 10} 63 Q ${170 + shoulderHalf - 16} 85 ${170 + chestHalf + 4} 95`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>

        <!-- Biceps Peak Arc (肱二头肌隆起线) -->
        <path :d="`M ${170 - shoulderHalf - armRadius * 0.3} 100 Q ${170 - shoulderHalf - armRadius * 0.8} 120 ${170 - shoulderHalf - armRadius * 0.2} 140`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 + shoulderHalf + armRadius * 0.3} 100 Q ${170 + shoulderHalf + armRadius * 0.8} 120 ${170 + shoulderHalf + armRadius * 0.2} 140`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>

        <!-- Serratus Anterior / Ribcage Lines (前锯肌 / 鲨鱼线) -->
        <path :d="`M ${170 - chestHalf * 0.85} 125 L ${170 - waistHalf * 0.75} 135`" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 - chestHalf * 0.8} 140 L ${170 - waistHalf * 0.7} 150`" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 + chestHalf * 0.85} 125 L ${170 + waistHalf * 0.75} 135`" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 + chestHalf * 0.8} 140 L ${170 + waistHalf * 0.7} 150`" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="transition-all duration-300"/>

        <!-- Six-Pack Abs (6 块雕刻腹肌 + 腹直肌白线) -->
        <line x1="170" y1="120" x2="170" y2="185" :stroke="themeColors.muscleLine" stroke-width="1.2"/>
        <!-- Upper Abs Row 1 -->
        <rect :x="170 - waistHalf * 0.42" y="125" :width="waistHalf * 0.36" height="15" rx="3" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <rect :x="170 + waistHalf * 0.06" y="125" :width="waistHalf * 0.36" height="15" rx="3" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <!-- Mid Abs Row 2 -->
        <rect :x="170 - waistHalf * 0.45" y="145" :width="waistHalf * 0.38" height="16" rx="3" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <rect :x="170 + waistHalf * 0.07" y="145" :width="waistHalf * 0.38" height="16" rx="3" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <!-- Lower Abs Row 3 -->
        <rect :x="170 - waistHalf * 0.42" y="166" :width="waistHalf * 0.36" height="16" rx="3" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <rect :x="170 + waistHalf * 0.06" y="166" :width="waistHalf * 0.36" height="16" rx="3" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>

        <!-- Adonis Belt / V-Cut (人鱼线 / 腹股沟) -->
        <path :d="`M ${170 - waistHalf * 0.9} 175 Q ${170 - waistHalf * 0.4} 190 170 205`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <path :d="`M ${170 + waistHalf * 0.9} 175 Q ${170 + waistHalf * 0.4} 190 170 205`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>

        <!-- Quad Teardrops / Vastus Medialis (股内侧肌泪滴肌 & 膝盖骨) -->
        <path :d="`M ${170 - thighCenter + 6} 290 Q ${170 - thighCenter + 2} 310 ${170 - thighCenter + 8} 320`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <path :d="`M ${170 + thighCenter - 6} 290 Q ${170 + thighCenter - 2} 310 ${170 + thighCenter - 8} 320`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <!-- Kneecaps / Patella (膝盖骨) -->
        <circle :cx="170 - thighCenter" cy="330" r="5" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <circle :cx="170 + thighCenter" cy="330" r="5" fill="none" :stroke="themeColors.muscleLine" stroke-width="1.2" class="transition-all duration-300"/>
        <!-- Calf Muscle Peak (小腿腓肠肌) -->
        <path :d="`M ${170 - thighCenter - 8} 355 Q ${170 - thighCenter - 14} 375 ${170 - thighCenter - 4} 395`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>
        <path :d="`M ${170 + thighCenter + 8} 355 Q ${170 + thighCenter + 14} 375 ${170 + thighCenter + 4} 395`" fill="none" :stroke="themeColors.muscleLine" stroke-width="1" class="transition-all duration-300"/>

        <!-- ============================================== -->
        <!-- 3. Sleek Technical Caliper Dimension Callouts -->
        <!-- ============================================== -->

        <!-- A. Chest Caliper (Left) -->
        <g class="transition-all duration-300">
          <line :x1="170 - chestHalf - 20" y1="102" :x2="170 + chestHalf + 20" y2="102"
                stroke="url(#laserScanGrad)" stroke-width="1.5" stroke-dasharray="2 2"/>
          <circle :cx="170 - chestHalf" cy="102" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <circle :cx="170 + chestHalf" cy="102" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <!-- Chest Callout Tag -->
          <rect :x="170 - chestHalf - 68" y="92" width="62" height="20" rx="6" fill="#09090b" :stroke="themeColors.primary" stroke-width="1.2"/>
          <text :x="170 - chestHalf - 37" y="106" font-family="'Impact', monospace" font-size="10" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            胸围 {{ safeChest }}cm
          </text>
        </g>

        <!-- B. Waist Caliper (Right) -->
        <g class="transition-all duration-300">
          <line :x1="170 - waistHalf - 20" y1="172" :x2="170 + waistHalf + 20" y2="172"
                stroke="url(#laserScanGrad)" stroke-width="1.5" stroke-dasharray="2 2"/>
          <circle :cx="170 - waistHalf" cy="172" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <circle :cx="170 + waistHalf" cy="172" r="3.5" :fill="themeColors.highlight" :stroke="themeColors.stroke" stroke-width="1"/>
          <!-- Waist Callout Tag -->
          <rect :x="170 + waistHalf + 6" y="162" width="62" height="20" rx="6" fill="#09090b" :stroke="themeColors.primary" stroke-width="1.2"/>
          <text :x="170 + waistHalf + 37" y="176" font-family="'Impact', monospace" font-size="10" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            腰围 {{ safeWaist }}cm
          </text>
        </g>

        <!-- C. Arm Bicep Dimension (Right Outer Arm) -->
        <g class="transition-all duration-300">
          <line :x1="170 + shoulderHalf + armRadius * 0.9" y1="118" :x2="170 + shoulderHalf + armRadius * 0.9 + 18" y2="118"
                :stroke="themeColors.secondary" stroke-width="1.2"/>
          <circle :cx="170 + shoulderHalf + armRadius * 0.9" cy="118" r="3" :fill="themeColors.highlight"/>
          <rect :x="170 + shoulderHalf + armRadius * 0.9 + 18" y="108" width="56" height="18" rx="5" fill="#09090b" :stroke="themeColors.secondary" stroke-width="1"/>
          <text :x="170 + shoulderHalf + armRadius * 0.9 + 46" y="121" font-family="'Impact', monospace" font-size="9.5" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            臂围 {{ safeArm }}cm
          </text>
        </g>

        <!-- D. Thigh Dimension (Left Quad) -->
        <g class="transition-all duration-300">
          <line :x1="170 - thighCenter - thighRadius * 0.95" y1="270" :x2="170 - thighCenter - thighRadius * 0.95 - 18" y2="270"
                :stroke="themeColors.secondary" stroke-width="1.2"/>
          <circle :cx="170 - thighCenter - thighRadius * 0.95" cy="270" r="3" :fill="themeColors.highlight"/>
          <rect :x="170 - thighCenter - thighRadius * 0.95 - 74" y="261" width="56" height="18" rx="5" fill="#09090b" :stroke="themeColors.secondary" stroke-width="1"/>
          <text :x="170 - thighCenter - thighRadius * 0.95 - 46" y="274" font-family="'Impact', monospace" font-size="9.5" font-weight="bold" :fill="themeColors.highlight" text-anchor="middle">
            大腿 {{ safeThigh }}cm
          </text>
        </g>

      </svg>
    </div>

    <!-- Bottom Physiological Metric Chips -->
    <div class="w-full grid grid-cols-4 gap-1.5 pt-2.5 border-t border-zinc-800/80 text-center font-mono text-[10px] z-10">
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
        <span class="text-zinc-500 text-[8px] block">健美体态</span>
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

// Clamped Safe Numbers for Human Physiology (70kg-120kg Bodybuilders / Athletes)
const safeArm = computed(() => Math.max(22, Math.min(60, Number(props.arm) || 35)));
const safeChest = computed(() => Math.max(75, Math.min(145, Number(props.chest) || 100)));
const safeWaist = computed(() => Math.max(55, Math.min(130, Number(props.waist) || 80)));
const safeThigh = computed(() => Math.max(40, Math.min(85, Number(props.thigh) || 56)));

// Anatomical Proportions Calculation
const chestHalf = computed(() => {
  // 100cm baseline maps to ~54px half-width at chest
  return 42 + (safeChest.value - 75) * 0.42;
});

const waistHalf = computed(() => {
  // 80cm baseline maps to ~36px half-width at waist
  return 26 + (safeWaist.value - 55) * 0.35;
});

const shoulderHalf = computed(() => {
  // Shoulder width scales with Chest & Arm size for classic V-Taper deltoid caps
  return chestHalf.value + 16 + (safeArm.value - 25) * 0.28;
});

const armRadius = computed(() => {
  // Upper arm bicep/tricep thickness
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
const pecsLeftPlate = computed(() => {
  const ch = chestHalf.value;
  return `M 170 70 L ${170 - ch * 0.85} 75 Q ${170 - ch * 0.95} 105 ${170 - ch * 0.4} 118 L 170 118 Z`;
});

// Pectoral Plate Right
const pecsRightPlate = computed(() => {
  const ch = chestHalf.value;
  return `M 170 70 L ${170 + ch * 0.85} 75 Q ${170 + ch * 0.95} 105 ${170 + ch * 0.4} 118 L 170 118 Z`;
});

// Realistic Anatomical 8-Head Human Silhouette Vector Path
const anatomicalBodyPath = computed(() => {
  const sh = shoulderHalf.value;
  const ch = chestHalf.value;
  const wh = waistHalf.value;
  const ar = armRadius.value;
  const tc = thighCenter.value;
  const tr = thighRadius.value;
  const hip = wh + 5;

  return `
    M 170 18
    C 178 18 184 25 184 36
    C 184 46 179 54 175 58
    L 176 64
    C 186 65 ${170 + sh * 0.6} 67 ${170 + sh - 8} 72
    C ${170 + sh} 74 ${170 + sh + 4} 80 ${170 + sh + 4} 90
    C ${170 + sh + 4 + ar} 98 ${170 + sh + 4 + ar * 0.9} 125 ${170 + sh + 2 + ar * 0.6} 150
    C ${170 + sh + ar * 0.3} 165 ${170 + sh - 2} 185 ${170 + sh - 4} 205
    C ${170 + sh - 6} 220 ${170 + sh - 8} 235 ${170 + sh - 10} 245
    C ${170 + sh - 14} 250 ${170 + sh - 18} 248 ${170 + sh - 18} 240
    C ${170 + sh - 14} 225 ${170 + sh - 12} 205 ${170 + sh - 12} 180
    C ${170 + sh - 10} 160 ${170 + ch + 6} 130 ${170 + ch} 118
    C ${170 + ch - 2} 130 ${170 + wh + 6} 160 ${170 + wh} 175
    C ${170 + wh - 2} 188 ${170 + hip} 198 ${170 + hip} 210
    C ${170 + tc + tr + 2} 230 ${170 + tc + tr + 4} 265 ${170 + tc + tr} 295
    C ${170 + tc + tr * 0.5} 320 ${170 + tc + 6} 330 ${170 + tc + 6} 340
    C ${170 + tc + 10} 355 ${170 + tc + 10} 380 ${170 + tc + 4} 405
    C ${170 + tc + 3} 418 ${170 + tc + 4} 428 ${170 + tc + 4} 432
    L ${170 + tc - 8} 432
    C ${170 + tc - 6} 425 ${170 + tc - 4} 415 ${170 + tc - 4} 405
    C ${170 + tc - 6} 380 ${170 + tc - 6} 355 ${170 + tc - 4} 340
    C ${170 + tc - 4} 330 ${170 + tc - tr * 0.5} 320 ${170 + tc - tr * 0.8} 295
    C ${170 + tc - tr * 0.6} 265 ${170 + 8} 240 170 225
    C ${170 - 8} 240 ${170 - tc + tr * 0.6} 265 ${170 - tc + tr * 0.8} 295
    C ${170 - tc + tr * 0.5} 320 ${170 - tc + 4} 330 ${170 - tc + 4} 340
    C ${170 - tc + 6} 355 ${170 - tc + 6} 380 ${170 - tc + 4} 405
    C ${170 - tc + 4} 415 ${170 - tc + 6} 425 ${170 - tc + 8} 432
    L ${170 - tc - 4} 432
    C ${170 - tc - 4} 428 ${170 - tc - 3} 418 ${170 - tc - 4} 405
    C ${170 - tc - 10} 380 ${170 - tc - 10} 355 ${170 - tc - 6} 340
    C ${170 - tc - 6} 330 ${170 - tc - tr * 0.5} 320 ${170 - tc - tr} 295
    C ${170 - tc - tr - 4} 265 ${170 - tc - tr - 2} 230 ${170 - hip} 210
    C ${170 - hip} 198 ${170 - wh + 2} 188 ${170 - wh} 175
    C ${170 - wh - 6} 160 ${170 - ch + 2} 130 ${170 - ch} 118
    C ${170 - ch - 6} 130 ${170 - sh + 10} 160 ${170 - sh + 12} 180
    C ${170 - sh + 12} 205 ${170 - sh + 14} 225 ${170 - sh + 18} 240
    C ${170 - sh + 18} 248 ${170 - sh + 14} 250 ${170 - sh + 10} 245
    C ${170 - sh + 8} 235 ${170 - sh + 6} 220 ${170 - sh + 4} 205
    C ${170 - sh + 2} 185 ${170 - sh - ar * 0.3} 165 ${170 - sh - 2 - ar * 0.6} 150
    C ${170 - sh - 4 - ar * 0.9} 125 ${170 - sh - 4 - ar} 98 ${170 - sh - 4} 90
    C ${170 - sh - 4} 80 ${170 - sh} 74 ${170 - sh + 8} 72
    C ${170 - sh * 0.6} 67 154 65 164 64
    L 165 58
    C 161 54 156 46 156 36
    C 156 25 162 18 170 18
    Z
  `.replace(/\s+/g, " ");
});
</script>
