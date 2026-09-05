<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200 overflow-hidden touch-none select-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden overflow-x-hidden animate-in slide-in-from-bottom duration-200"
           style="touch-action: pan-y; max-width: min(32rem, 100vw); box-sizing: border-box;">
        
        <!-- Top Ergonomic Grabber Pill -->
        <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0"></div>

        <!-- Header -->
        <div class="p-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 class="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{{ editPlan.id ? '编辑训练计划' : '创建新计划' }}</span>
            </h3>
            <p class="text-xs text-zinc-400 mt-0.5">
              自定义此计划下的动作、目标组数与次数建议
            </p>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer">
            ✕
          </button>
        </div>

      <!-- Body Content -->
      <div class="overflow-y-auto flex-1 p-4 space-y-4 overscroll-contain"
           style="-webkit-overflow-scrolling: touch; touch-action: pan-y;">
        
        <!-- Basic Info -->
        <div class="space-y-3">
          <div>
            <label class="text-xs font-bold text-zinc-400 uppercase">计划全称 *</label>
            <input v-model="editPlan.name" type="text" placeholder="例如：推日 (Push) —— 打造铠甲胸与加宽肩膀" 
                   class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs font-bold text-zinc-400 uppercase">简写名称 (1-3字)</label>
              <input v-model="editPlan.shortName" type="text" placeholder="例如：推日" 
                     class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white" />
            </div>
            <div>
              <label class="text-xs font-bold text-zinc-400 uppercase">主题标识色</label>
              <select v-model="editPlan.color" class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white">
                <option value="amber">🔥 琥珀金 (推/胸肩)</option>
                <option value="sky">💧 极光蓝 (拉/背部)</option>
                <option value="purple">⚡ 幻影紫 (腿部/核心)</option>
                <option value="emerald">🌿 翡翠绿 (休息/恢复)</option>
                <option value="rose">🌸 玫瑰红 (手臂/全身)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-zinc-400 uppercase">核心训练目标</label>
            <input v-model="editPlan.coreTarget" type="text" placeholder="例如：轰炸上胸、极限拓宽肩峰、围度化手臂" 
                   class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white" />
          </div>
        </div>

        <!-- Exercises List in Plan -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-zinc-400 uppercase">
              包含动作 ({{ (editPlan.exercises || []).length }} 个)
            </label>
            <button @click="showExercisePicker = true" 
                    class="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
              ➕ 添加动作
            </button>
          </div>

          <div class="space-y-2">
            <div v-for="(ex, idx) in editPlan.exercises" :key="ex.exerciseId || idx"
                 class="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
              
              <div class="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                {{ idx + 1 }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="font-bold text-xs text-zinc-100 truncate">{{ ex.name }}</div>
                <div class="flex items-center gap-3 mt-1.5 text-xs">
                  <div class="flex items-center gap-1 text-zinc-400">
                    <span>组数:</span>
                    <input v-model.number="ex.setsCount" type="number" min="1" max="10" 
                           class="w-10 bg-zinc-900 border border-zinc-700 rounded px-1 text-center text-zinc-200" />
                  </div>
                  <div class="flex items-center gap-1 text-zinc-400">
                    <span>建议次数:</span>
                    <input v-model="ex.targetReps" type="text" 
                           class="w-20 bg-zinc-900 border border-zinc-700 rounded px-1 text-center text-zinc-200" />
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1">
                <button v-if="idx > 0" @click="moveEx(idx, -1)" class="p-1 bg-zinc-800 text-zinc-400 rounded text-xs">↑</button>
                <button v-if="idx < editPlan.exercises.length - 1" @click="moveEx(idx, 1)" class="p-1 bg-zinc-800 text-zinc-400 rounded text-xs">↓</button>
                <button @click="removeEx(idx)" class="p-1 bg-zinc-800 hover:text-red-400 text-zinc-400 rounded text-xs">✕</button>
              </div>

            </div>

            <div v-if="!editPlan.exercises || editPlan.exercises.length === 0" 
                 class="p-6 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 text-xs">
              暂无动作，点击右上角“添加动作”添加
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
        <button @click="$emit('close')" class="w-1/3 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl text-xs">
          取消
        </button>
        <button @click="handleSave" :disabled="!editPlan.name.trim()"
                class="w-2/3 py-3 bg-amber-500 disabled:opacity-40 text-zinc-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 active:scale-98">
          保存计划模板
        </button>
      </div>

    </div>

    <!-- Exercise Picker Submodal -->
    <ExercisePickerModal 
      :visible="showExercisePicker" 
      title="添加动作到计划" 
      actionLabel="添加"
      @close="showExercisePicker = false" 
      @select="onExerciseSelected" 
    />

  </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import { savePlan, uid } from "../store/fitnessStore.js";
import ExercisePickerModal from "./ExercisePickerModal.vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";

const props = defineProps({
  visible: Boolean,
  plan: Object
});

const emit = defineEmits(["close", "saved"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const showExercisePicker = ref(false);
const editPlan = ref({
  id: "",
  name: "",
  shortName: "",
  color: "amber",
  coreTarget: "",
  isRest: false,
  exercises: []
});

watch(() => props.visible, (val) => {
  if (val) {
    if (props.plan) {
      editPlan.value = JSON.parse(JSON.stringify(props.plan));
    } else {
      editPlan.value = {
        id: uid("plan"),
        name: "",
        shortName: "新计划",
        color: "amber",
        coreTarget: "",
        isRest: false,
        exercises: []
      };
    }
  }
});

function onExerciseSelected(ex) {
  if (!editPlan.value.exercises) editPlan.value.exercises = [];
  editPlan.value.exercises.push({
    exerciseId: ex.id,
    name: ex.name,
    setsCount: ex.defaultSets || 3,
    targetReps: `${ex.defaultReps || "10-12"}次`,
    defaultWeight: 20
  });
}

function removeEx(idx) {
  editPlan.value.exercises.splice(idx, 1);
}

function moveEx(idx, delta) {
  const newIdx = idx + delta;
  if (newIdx < 0 || newIdx >= editPlan.value.exercises.length) return;
  const item = editPlan.value.exercises.splice(idx, 1)[0];
  editPlan.value.exercises.splice(newIdx, 0, item);
}

function handleSave() {
  if (!editPlan.value.name.trim()) return;
  if (!editPlan.value.shortName.trim()) {
    editPlan.value.shortName = editPlan.value.name.substring(0, 2);
  }
  savePlan(editPlan.value);
  emit("saved", editPlan.value);
  emit("close");
}
</script>
