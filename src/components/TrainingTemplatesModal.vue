<template>
  <Teleport to="body">
    <div v-if="visible"
         class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 overflow-hidden touch-none select-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 text-left"
           style="touch-action: pan-y; max-width: min(32rem, 100vw); box-sizing: border-box;">
        
        <!-- Grabber -->
        <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0"></div>

        <!-- Header -->
        <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 text-base">
              📚
            </div>
            <div>
              <h3 class="text-sm font-black text-zinc-100 flex items-center gap-2">
                <span>经典科学周期化模板库</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  5大体系
                </span>
              </h3>
              <p class="text-[10px] text-zinc-400 font-mono">一键切换推拉腿、PHUL、阿诺德、5/3/1等经典体系</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body Template Cards List -->
        <div class="overflow-y-auto flex-1 p-4 space-y-4 overscroll-contain">
          
          <div v-for="template in TRAINING_TEMPLATES" :key="template.id"
               class="p-4 rounded-2xl border transition-all space-y-3"
               :class="[
                 isTemplateActive(template) ?
                 'bg-zinc-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40' :
                 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
               ]">
            
            <!-- Top info -->
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="text-sm font-black text-zinc-100">{{ template.name }}</h4>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {{ template.badge }}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-[11px] text-zinc-400 mt-1 font-mono">
                  <span>{{ template.category }}</span>
                  <span>·</span>
                  <span class="text-zinc-300 font-bold">{{ template.frequency }}</span>
                </div>
              </div>

              <span v-if="isTemplateActive(template)" 
                    class="px-2 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex-shrink-0">
                ✓ 正在使用
              </span>
            </div>

            <!-- Description -->
            <p class="text-xs text-zinc-300 leading-relaxed">
              {{ template.description }}
            </p>

            <!-- Highlights -->
            <div class="space-y-1 py-1">
              <div v-for="(h, hIdx) in template.highlights" :key="hIdx"
                   class="text-[11px] text-zinc-400 flex items-start gap-1.5 leading-snug">
                <span class="text-amber-400 text-xs">✦</span>
                <span>{{ h }}</span>
              </div>
            </div>

            <!-- Segmented day capsules preview -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <div v-for="(day, dIdx) in template.cycle.days" :key="day.id || dIdx"
                   class="px-2 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1"
                   :class="[
                     day.color === 'amber' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' :
                     day.color === 'sky' ? 'bg-sky-500/15 border-sky-500/30 text-sky-300' :
                     day.color === 'purple' ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' :
                     'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                   ]">
                <span class="w-3.5 h-3.5 rounded-full bg-zinc-900/60 flex items-center justify-center text-[9px] font-mono">
                  {{ dIdx + 1 }}
                </span>
                <span>{{ day.shortName || (day.isRest ? '休' : '练') }}</span>
              </div>
            </div>

            <!-- Action Apply Button -->
            <div class="pt-2">
              <button @click="handleApply(template)"
                      :disabled="isTemplateActive(template)"
                      class="w-full py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                      :class="[
                        isTemplateActive(template) ?
                        'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-default' :
                        'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                      ]">
                <span>{{ isTemplateActive(template) ? '当前已加载此周期' : '⚡ 一键应用为此分化周期' }}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { store, applyTrainingTemplate } from "../store/fitnessStore.js";
import { TRAINING_TEMPLATES } from "../data/trainingTemplates.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close", "applied"]);

function isTemplateActive(template) {
  if (!store.activeCycle) return false;
  return store.activeCycle.id === template.cycle.id || store.activeCycle.name === template.cycle.name;
}

function handleApply(template) {
  const ok = applyTrainingTemplate(template.id);
  if (ok) {
    emit("applied", template);
    emit("close");
  }
}
</script>
