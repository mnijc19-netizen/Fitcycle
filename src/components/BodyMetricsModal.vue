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
        <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-zinc-950 to-zinc-900 border border-amber-500/40 space-y-3 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-amber-300 block">🧬 黄金 V 身比例指数 (胸腰比)</span>
              <span class="text-[10px] text-zinc-400 font-mono mt-0.5 block">自然健身理想区间: 1.25 ~ 1.40</span>
            </div>
            <div class="text-right">
              <span class="text-xl font-black text-white font-mono tracking-tight">{{ vTaperRatio }}</span>
              <span class="text-[9px] px-2 py-0.5 rounded-full border font-bold ml-1.5 align-middle"
                    :class="vTaperGradeClass">
                {{ vTaperGradeText }}
              </span>
            </div>
          </div>
          
          <!-- Delta Progress Counters -->
          <div class="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div class="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span class="text-[9px] text-zinc-500 block">臂围净增</span>
              <span class="text-xs font-bold" :class="armDelta >= 0 ? 'text-emerald-400' : 'text-zinc-400'">
                {{ armDelta >= 0 ? `+${armDelta}` : armDelta }} cm
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span class="text-[9px] text-zinc-500 block">胸围净增</span>
              <span class="text-xs font-bold" :class="chestDelta >= 0 ? 'text-emerald-400' : 'text-zinc-400'">
                {{ chestDelta >= 0 ? `+${chestDelta}` : chestDelta }} cm
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
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
            <div class="flex items-center gap-1.5">
              <span>✍️ 录入最新身体围度 (cm)</span>
              <!-- Circular Exclamation Standards Button -->
              <button @click="showStandardsModal = true" 
                      type="button"
                      class="w-4 h-4 rounded-full bg-zinc-800 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 border border-zinc-700 hover:border-amber-500/50 flex items-center justify-center text-[10px] font-black transition-all active:scale-95 cursor-pointer shadow-sm" 
                      title="点击查看各部位科学测量标准">
                !
              </button>
            </div>
            <span class="text-[10px] text-amber-400 font-mono">每周打卡+20分 (7天冷却)</span>
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
                      class="w-full py-2 bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 rounded-xl text-xs font-bold active:scale-95 shadow-md shadow-amber-500/10 transition-all cursor-pointer">
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
    </div>

    <!-- Nested Scientific Measurement Standards Modal -->
    <div v-if="showStandardsModal" 
         class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
      <div class="bg-zinc-900 border border-amber-500/50 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-zinc-100">
        
        <!-- Header -->
        <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-lg">📏</span>
            <div>
              <h3 class="text-sm font-black text-amber-400">身体围度科学测量标准指南</h3>
              <p class="text-[10px] text-zinc-400">统一测量基准，确保肌肉蜕变数据真实有效</p>
            </div>
          </div>
          <button @click="showStandardsModal = false" 
                  class="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-all">
            ✕
          </button>
        </div>

        <!-- Body Content -->
        <div class="p-4 overflow-y-auto space-y-3.5 text-xs text-zinc-300 flex-1 scrollbar-thin leading-relaxed text-left">
          
          <!-- 1. Arm -->
          <div class="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
            <div class="font-bold text-amber-300 flex items-center gap-1.5">
              <span>💪 手臂围 (Upper Arm)</span>
            </div>
            <p class="text-zinc-300 text-[11px]">
              <strong class="text-white">测量标准：</strong>曲臂充分充血或自然曲臂90度紧绷，皮尺绕大臂二头肌与三头肌<strong class="text-amber-400">最饱满突出的肌峰最高点</strong>水平测量一周。
            </p>
          </div>

          <!-- 2. Chest -->
          <div class="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
            <div class="font-bold text-sky-400 flex items-center gap-1.5">
              <span>🛡️ 胸围 (Chest)</span>
            </div>
            <p class="text-zinc-300 text-[11px]">
              <strong class="text-white">测量标准：</strong>自然站立，双臂自然下垂放松，皮尺经过<strong class="text-sky-400">双侧乳头点（乳中穴）及背阔肌下方</strong>，在正常呼气末测量水平周长（切勿刻意过度吸气挺胸）。
            </p>
          </div>

          <!-- 3. Waist -->
          <div class="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
            <div class="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>🎯 腰围 (Waist)</span>
            </div>
            <p class="text-zinc-300 text-[11px]">
              <strong class="text-white">测量标准：</strong>晨起空腹状态，身体直立放松，皮尺经过<strong class="text-emerald-400">肚脐上方最窄处或肚脐平齐处</strong>，正常呼气后测量水平周长（切勿刻意过度吸腹憋气）。
            </p>
          </div>

          <!-- 4. Thigh -->
          <div class="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
            <div class="font-bold text-purple-400 flex items-center gap-1.5">
              <span>🦵 大腿围 (Thigh)</span>
            </div>
            <p class="text-zinc-300 text-[11px]">
              <strong class="text-white">测量标准：</strong>双腿微微分开与肩同宽，重心平均分布，皮尺绕单侧大腿<strong class="text-purple-400">臀褶线下方约1~2厘米处（股四头肌根部最粗处）</strong>水平环绕测量。
            </p>
          </div>

          <!-- 5. Weight -->
          <div class="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1">
            <div class="font-bold text-pink-400 flex items-center gap-1.5">
              <span>⚖️ 晨起净体重 (Weight)</span>
            </div>
            <p class="text-zinc-300 text-[11px]">
              <strong class="text-white">测量标准：</strong>早晨起床上完厕所后、空腹状态下，着轻薄衣物使用同一台电子秤称量。
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-end flex-shrink-0">
          <button @click="showStandardsModal = false" 
                  class="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-black transition-all">
            我已知晓标准
          </button>
        </div>

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

const showStandardsModal = ref(false);

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

const vTaperGradeText = computed(() => {
  const r = parseFloat(vTaperRatio.value);
  if (r >= 1.35) return "👑 卓越倒三角";
  if (r >= 1.26) return "🔥 战术倒三角";
  if (r >= 1.18) return "⚡ 匀称精壮";
  if (r >= 1.10) return "🌱 健康力量";
  return "🛡️ 稳固体魄";
});

const vTaperGradeClass = computed(() => {
  const r = parseFloat(vTaperRatio.value);
  if (r >= 1.35) return "bg-amber-500/20 border-amber-500/60 text-amber-300";
  if (r >= 1.26) return "bg-sky-500/20 border-sky-500/60 text-sky-300";
  if (r >= 1.18) return "bg-emerald-500/20 border-emerald-500/60 text-emerald-300";
  if (r >= 1.10) return "bg-indigo-500/20 border-indigo-500/60 text-indigo-300";
  return "bg-zinc-800 border-zinc-700 text-zinc-400";
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