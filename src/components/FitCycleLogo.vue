<template>
  <div class="inline-flex items-center justify-center select-none" :class="containerClass" :style="customStyle">
    <svg :width="size" :height="size" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="overflow-visible">
      <defs>
        <!-- Authoritative Brand Master Gradients with Unique Instance Scope -->
        <linearGradient :id="`fitcycle-grad-primary-${instanceId}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="50%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>

        <linearGradient :id="`fitcycle-grad-secondary-${instanceId}`" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>

        <linearGradient :id="`fitcycle-grad-dark-${instanceId}`" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#27272a" />
        </linearGradient>

        <filter :id="`fitcycle-glow-${instanceId}`" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#f59e0b" flood-opacity="0.35" />
        </filter>
      </defs>

      <!-- Optional Background Shield Plate -->
      <path v-if="withBackground"
            d="M 50 6 L 88 26 L 88 74 L 50 94 L 12 74 L 12 26 Z" 
            :fill="`url(#fitcycle-grad-dark-${instanceId})`" 
            stroke="rgba(255,255,255,0.08)" 
            stroke-width="1.5" />

      <!-- Left Flow Ribbon: Athletic 'F' Kinetic Surge (Ascending Overload) -->
      <path 
        d="M 22 72 
           C 16 62, 16 38, 26 28 
           C 36 18, 52 16, 68 18 
           C 74 19, 78 24, 76 29 
           C 74 34, 69 36, 62 36 
           C 50 36, 38 40, 36 50 
           C 35 55, 38 58, 44 58 
           L 58 58 
           C 63 58, 67 62, 66 67 
           C 65 72, 60 76, 54 76 
           L 38 76 
           C 32 76, 26 80, 24 84 
           C 22 88, 18 86, 17 82 
           C 16 78, 18 74, 22 72 Z"
        :fill="`url(#fitcycle-grad-primary-${instanceId})`"
        :filter="`url(#fitcycle-glow-${instanceId})`"
      />

      <!-- Right Flow Ribbon: Continuity 'C' Recovery Orbital (Hypertrophy Loop) -->
      <path 
        d="M 52 38 
           C 60 38, 70 34, 78 40 
           C 86 47, 88 62, 82 72 
           C 76 82, 62 86, 48 86 
           C 40 86, 36 82, 38 78 
           C 40 74, 44 74, 50 74 
           C 60 74, 70 70, 72 62 
           C 74 54, 68 48, 58 48 
           L 46 48 
           C 41 48, 38 44, 39 39 
           C 40 34, 44 32, 50 32 
           L 52 38 Z"
        :fill="`url(#fitcycle-grad-secondary-${instanceId})`"
        opacity="0.92"
      />

      <!-- Central Kinetic Barbell Core / Overload Spark -->
      <polygon points="50,38 59,50 50,62 41,50" :fill="`url(#fitcycle-grad-primary-${instanceId})`" />
      <polygon points="50,42 56,50 50,58 44,50" fill="#ffffff" opacity="0.95" />
      <circle cx="50" cy="50" r="2.5" fill="#f59e0b" />
    </svg>
  </div>
</template>

<script setup>
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

// Generate unique scope ID to strictly prevent SVG gradient & filter ID collisions across multiple logo instances
const instanceId = Math.random().toString(36).substring(2, 8);
</script>
