<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
    <div class="bg-zinc-900 border border-zinc-700/80 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100">
      
      <!-- Modal Header -->
      <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60 flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-xl">📐</span>
          <div>
            <h2 class="text-sm font-black text-white tracking-wide">身体形体围度追踪板</h2>
            <p class="text-[10px] text-zinc-400 font-mono">见证手臂、胸肌与V字腰身蜕变</p>
          </div>
        </div>
        <button @click="$emit('close')" 
                class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition-all">
          ✕
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="p-4 overflow-y-auto space-y-4 scrollbar-thin flex-1">
        
        <!-- V-Taper Golden Ratio & Progress Banner -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-zinc-950 to-zinc-900 border border-amber-500/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-300">🧬 黄金 V 身比例指数 (胸腰比)</span>
            <span class="text-sm font-black text-white font-mono">{{ vTaperRatio }}</span>
          </div>
          
          <div class="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div class="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span class="text-[9px] text-zinc-500 block">臂围增量</span>
              <span class="text-xs font-bold" :class="armDelta >= 0 ? 'text-emerald-400' : 'text-zinc-400'">
                {{ armDelta >= 0 ? `+${armDelta}` : armDelta }} cm
              </span>
            </div>

            <div class="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span class="text-[9px] text-zinc-500 block">胸围增量</span>
              <span class="text-xs font-bold" :class="chestDelta >= 0 ? 'text-emerald-400' : 'text-zinc-400'">
                {{ chestDelta >= 0 ? `+${chestDelta}` : chestDelta }} cm
              </span>
            </div>

            <div class="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span class="text-[9px] text-zinc-500 block">腰围收紧</span>
              <span class="text-xs font-bold" :class="waistDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'">
                {{ waistDelta <= 0 ? `${waistDelta}` : `+${waistDelta}` }} cm
              </span>
            </div>
          </div>
        </div>

        <!-- Add New Measurement Form -->
        <div class="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-zinc-200">
            <span>✍️ 录入最新身体围度 (cm)</span>
            <span class="text-[10px] text-amber-400 font-mono">每周基础打卡+20分 (7天冷却) | 围度蜕变额外加分</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <label class="text-[10px] text-zinc-400 block mb-1">💪 手臂围 (cm)</label>
              <input v-model.number="form.arm" type="number" step="0.5" placeholder="如 35.5"
                     class="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none" />
            </div>

            <div>
              <label class="text-[10px] text-zinc-400 block mb-1">🛡️ 胸围 (cm)</label>
              <input v-model.number="form.chest" type="number" step="0.5" placeholder="如 102"
                     class="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none" />
            </div>

            <div>
              <label class="text-[10px] text-zinc-400 block mb-1">🎯 腰围 (cm)</label>
              <input v-model.number="form.waist" type="number" step="0.5" placeholder="如 79"
                     class="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none" />
            </div>

            <div>
              <label class="text-[10px] text-zinc-400 block mb-1">🦵 大腿围 (cm)</label>
              <input v-model.number="form.thigh" type="number" step="0.5" placeholder="如 57"
                     class="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none" />
            </div>

            <div>
              <label class="text-[10px] text-zinc-400 block mb-1">⚖️ 体重 (kg)</label>
              <input v-model.number="form.weight" type="number" step="0.5" placeholder="如 72"
                     class="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none" />
            </div>

            <div class="flex items-end">
              <button @click="handleSave" :disabled="!isValidForm"
                      class="w-full py-2 bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-xl text-xs font-bold active:scale-95 shadow-md shadow-amber-500/10 transition-all">
                保存并加分
              </button>
            </div>
          </div>
        </div>

        <!-- History Records -->
        <div class="space-y-2">
          <h3 class="text-xs font-bold text-zinc-300">历史测量记录 (共 {{ history.length }} 次)</h3>
          
          <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            <div v-for="m in sortedHistory" :key="m.id"
                 class="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <div>
                <span class="text-amber-400 font-bold block text-[11px]">{{ m.date }}</span>
                <span class="text-[10px] text-zinc-400">
                  臂:{{ m.arm }}cm | 胸:{{ m.chest }}cm | 腰:{{ m.waist }}cm | 腿:{{ m.thigh }}cm | 重:{{ m.weight }}kg
                </span>
              </div>

              <button @click="handleDelete(m.id)" class="text-zinc-600 hover:text-red-400 p-1 text-xs transition-colors" title="删除记录">
                ✕
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-3 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-end text-xs flex-shrink-0">
        <button @click="$emit('close')" class="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all">
          关闭
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, recordBodyMetric, deleteBodyMetric } from "../store/fitnessStore.js";

defineProps({
  visible: Boolean
});

defineEmits(["close"]);

const form = ref({
  arm: null,
  chest: null,
  waist: null,
  thigh: null,
  weight: null
});

const history = computed(() => store.bodyMetrics || []);
const sortedHistory = computed(() => [...history.value].reverse());

const latestMetric = computed(() => history.value[history.value.length - 1] || null);
const firstMetric = computed(() => history.value[0] || null);

const vTaperRatio = computed(() => {
  if (!latestMetric.value || !latestMetric.value.waist || latestMetric.value.waist === 0) return "1.20";
  const ratio = (latestMetric.value.chest || 0) / latestMetric.value.waist;
  return ratio > 0 ? ratio.toFixed(2) : "1.20";
});

const armDelta = computed(() => {
  if (!firstMetric.value || !latestMetric.value) return 0;
  return Number(((latestMetric.value.arm || 0) - (firstMetric.value.arm || 0)).toFixed(1));
});

const chestDelta = computed(() => {
  if (!firstMetric.value || !latestMetric.value) return 0;
  return Number(((latestMetric.value.chest || 0) - (firstMetric.value.chest || 0)).toFixed(1));
});

const waistDelta = computed(() => {
  if (!firstMetric.value || !latestMetric.value) return 0;
  return Number(((latestMetric.value.waist || 0) - (firstMetric.value.waist || 0)).toFixed(1));
});

const isValidForm = computed(() => {
  return form.value.arm > 0 || form.value.chest > 0 || form.value.waist > 0 || form.value.weight > 0;
});

function handleSave() {
  if (!isValidForm.value) return;
  recordBodyMetric(form.value);
  form.value = { arm: null, chest: null, waist: null, thigh: null, weight: null };
}

function handleDelete(id) {
  if (confirm("确定要删除这条测量记录吗？")) {
    deleteBodyMetric(id);
  }
}
</script>