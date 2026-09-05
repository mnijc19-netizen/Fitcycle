<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
      
      <!-- Top Ergonomic Grabber Pill for Bottom Sheet Gesture -->
      <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0"></div>

      <!-- Modal Header -->
      <div class="p-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 class="text-base font-bold text-zinc-100">
            {{ title || "选择动作" }}
          </h3>
          <p class="text-xs text-zinc-400">
            点击动作即可{{ actionLabel || "添加至训练" }}
          </p>
        </div>
        <button @click="$emit('close')" class="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Search and Filter Tabs -->
      <div class="p-3 border-b border-zinc-800/60 space-y-2 flex-shrink-0">
        <div class="relative">
          <input v-model="searchQuery" 
                 type="text" 
                 placeholder="搜索动作名称、目标肌群..." 
                 class="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500" />
          <span v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-2 text-xs text-zinc-400 cursor-pointer">✕</span>
        </div>

        <!-- Muscle Categories -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar overscroll-x-contain touch-pan-x">
          <button v-for="cat in categories" :key="cat"
                  @click="activeCategory = cat"
                  class="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                  :class="[activeCategory === cat ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700']">
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Exercise List -->
      <div class="overflow-y-auto flex-1 p-3 space-y-2 overscroll-contain"
           style="-webkit-overflow-scrolling: touch; touch-action: pan-y;">
        <div v-for="ex in filteredExercises" :key="ex.id"
             @click="selectExercise(ex)"
             class="p-2.5 bg-zinc-950/60 hover:bg-zinc-800/70 active:bg-zinc-800 border border-zinc-800/80 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3">
          
          <!-- 3D Thumbnail with Zero-Broken fallback -->
          <ExerciseImage :src="ex.gifUrl" 
                         :name="ex.name" 
                         :category="ex.category" 
                         :target="ex.target" 
                         customClass="w-12 h-12 rounded-xl border border-zinc-800 flex-shrink-0" />


          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-zinc-100 truncate">{{ ex.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/50 flex-shrink-0">
                {{ ex.category }}
              </span>
            </div>
            <div class="text-xs text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
              <span class="text-zinc-500">目标:</span>
              <span class="text-zinc-300 truncate">{{ ex.target }}</span>
            </div>
            <div v-if="ex.substitutes?.length" class="text-[9px] text-amber-400/90 mt-0.5">
              含 {{ ex.substitutes.length }} 个平替推荐
            </div>
          </div>

          <button class="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 text-xs font-bold rounded-xl border border-amber-500/30 transition-colors flex-shrink-0">
            选择
          </button>
        </div>

        <div v-if="filteredExercises.length === 0" class="py-8 text-center text-zinc-500 text-xs">
          没有找到匹配的动作，你可以直接创建自定义动作 👇
        </div>
      </div>

      <!-- Footer: Quick Add Custom Exercise -->
      <div class="p-3 bg-zinc-950 border-t border-zinc-800">
        <button @click="showAddCustom = true" 
                class="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 active:scale-98 text-xs font-semibold text-zinc-200 rounded-xl border border-zinc-700/60 flex items-center justify-center gap-1.5">
          <span>➕</span> 创建并添加新自定义动作
        </button>
      </div>

      <!-- Sub-modal: Quick create custom exercise -->
      <div v-if="showAddCustom" class="absolute inset-0 bg-zinc-900 z-20 flex flex-col p-4">
        <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h4 class="font-bold text-sm text-zinc-100">创建新动作</h4>
          <button @click="showAddCustom = false" class="text-zinc-400 text-sm">取消</button>
        </div>
        <div class="space-y-3 mt-3 flex-1 overflow-y-auto">
          <div>
            <label class="text-xs text-zinc-400 font-medium">动作名称 *</label>
            <input v-model="newEx.name" type="text" placeholder="例如：哑铃上斜飞鸟" 
                   class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100" />
          </div>
          <div>
            <label class="text-xs text-zinc-400 font-medium">所属肌群</label>
            <div class="grid grid-cols-4 gap-1.5 mt-1">
              <button v-for="c in categories.filter(x => x !== '全部')" :key="c"
                      type="button"
                      @click="newEx.category = c"
                      class="py-1.5 text-xs rounded-lg border text-center"
                      :class="[newEx.category === c ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-300']">
                {{ c }}
              </button>
            </div>
          </div>
          <div>
            <label class="text-xs text-zinc-400 font-medium">目标部位与发力要点</label>
            <input v-model="newEx.target" type="text" placeholder="例如：上胸部外沿、注重底部拉伸" 
                   class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100" />
          </div>
          <div>
            <label class="text-xs text-zinc-400 font-medium">科学发力细节与注意事项（可选）</label>
            <textarea v-model="newEx.scienceDetail" rows="3" placeholder="填写动作细节、感受度提示..." 
                      class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100"></textarea>
          </div>
        </div>
        <button @click="saveAndSelectCustom" 
                :disabled="!newEx.name.trim()"
                class="w-full py-3 bg-amber-500 disabled:opacity-40 text-zinc-950 font-bold rounded-xl text-xs mt-3">
          保存并选择
        </button>
      </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { store, uid } from "../store/fitnessStore.js";
import ExerciseImage from "./ExerciseImage.vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";

const props = defineProps({
  visible: Boolean,
  title: String,
  actionLabel: String
});

const emit = defineEmits(["close", "select"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const searchQuery = ref("");
const activeCategory = ref("全部");
const categories = ["全部", "胸部", "背部", "肩部", "腿部", "手臂", "核心", "有氧", "其它"];

const showAddCustom = ref(false);
const newEx = ref({
  name: "",
  category: "胸部",
  target: "",
  scienceDetail: "",
  defaultSets: 3,
  defaultReps: "10-12"
});

const filteredExercises = computed(() => {
  return store.exercises.filter(ex => {
    const matchCat = activeCategory.value === "全部" || ex.category === activeCategory.value;
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return matchCat;
    const matchQuery = ex.name.toLowerCase().includes(q) || 
                       (ex.englishName && ex.englishName.toLowerCase().includes(q)) ||
                       (ex.aliases && ex.aliases.some(a => a.toLowerCase().includes(q))) ||
                       (ex.target && ex.target.toLowerCase().includes(q)) || 
                       (ex.tags && ex.tags.some(t => t.toLowerCase().includes(q)));
    return matchCat && matchQuery;
  });
});

function selectExercise(ex) {
  emit("select", ex);
  emit("close");
}

function saveAndSelectCustom() {
  if (!newEx.value.name.trim()) return;
  const created = {
    id: uid("ex-custom"),
    name: newEx.value.name.trim(),
    category: newEx.value.category,
    target: newEx.value.target || newEx.value.name,
    scienceDetail: newEx.value.scienceDetail || "自定义训练动作",
    defaultSets: 3,
    defaultReps: "10-12",
    tags: ["自定义"]
  };
  store.exercises.push(created);
  emit("select", created);
  showAddCustom.value = false;
  newEx.value = { name: "", category: "胸部", target: "", scienceDetail: "", defaultSets: 3, defaultReps: "10-12" };
  emit("close");
}
</script>
