<template>
  <div class="inline-flex items-center justify-center select-none" :class="containerClass" :style="customStyle">
    <svg :width="size" :height="size" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="overflow-visible">
      <defs>
        <!-- Dynamic Theme Accent Gradients -->
        <linearGradient id="fitcycle-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="accentColorStart" />
          <stop offset="50%" :stop-color="accentColorMid" />
          <stop offset="100%" :stop-color="accentColorEnd" />
        </linearGradient>

        <linearGradient id="fitcycle-grad-dark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#27272a" />
        </linearGradient>

        <filter id="fitcycle-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" :flood-color="glowColor" flood-opacity="0.45" />
        </filter>
      </defs>

      <!-- Background Subtle Geometric Disc (Optional) -->
      <circle v-if="withBackground" cx="50" cy="50" r="46" fill="url(#fitcycle-grad-dark)" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />

      <!-- Kinetic FitCycle Dual-Loop Möbius / Interlocking Infinite Rings -->
      <!-- Left Loop: "F" Dynamic Biomechanical Curve -->
      <path 
        d="M 28 32 C 28 22, 42 16, 56 22 C 68 28, 74 42, 66 58 L 48 84 C 44 89, 36 90, 31 86 C 26 82, 26 74, 30 69 L 46 48 C 50 42, 48 34, 40 32 C 34 31, 28 36, 28 44 L 28 52" 
        stroke="url(#fitcycle-grad-primary)" 
        stroke-width="7.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        filter="url(#fitcycle-glow)" 
      />

      <!-- Right Loop: "C" Cycle Enclosure Curve -->
      <path 
        d="M 72 68 C 72 78, 58 84, 44 78 C 32 72, 26 58, 34 42 L 52 16 C 56 11, 64 10, 69 14 C 74 18, 74 26, 70 31 L 54 52 C 50 58, 52 66, 60 68 C 66 69, 72 64, 72 56 L 72 48" 
        stroke="url(#fitcycle-grad-primary)" 
        stroke-width="7.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        opacity="0.85"
      />

      <!-- Precision Central Apex Kinetic Chevron (Progressive Overload Spark) -->
      <circle cx="50" cy="50" r="4.5" :fill="accentColorStart" />
      <circle cx="50" cy="50" r="2" fill="#ffffff" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../store/fitnessStore.js";

const props = defineProps({
  size: {
    type: [Number, String],
    default: 36
  },
  withBackground: {
    type: Boolean,
    default: false
  },
  containerClass: {
    type: String,
    default: ""
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

// International Standard Adaptive Theme Accents
const accentColorStart = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "#f97316"; // CS2 Tactical Vibrant Orange
  if (skin === "chamber") return "#E5C378"; // Chamber 24K French Gold
  return "#f59e0b"; // FitCycle Amber Gold
});

const accentColorMid = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "#ea580c";
  if (skin === "chamber") return "#06B6D4"; // Radian Cyan Accent
  return "#d97706";
});

const accentColorEnd = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "#c2410c";
  if (skin === "chamber") return "#B38F46";
  return "#b45309";
});

const glowColor = computed(() => {
  const skin = store.settings.uiSkin;
  if (skin === "cs") return "#f97316";
  if (skin === "chamber") return "#E5C378";
  return "#f59e0b";
});
</script>
