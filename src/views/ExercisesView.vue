<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">

    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black text-white flex items-center gap-2">
          <span>🏋️</span> 动作库与科学细节
        </h2>
        <p class="text-xs text-zinc-400">
          每个动作的力学拉伸原理、目标肌群与发力技巧
        </p>
      </div>
      <button @click="openCreateExercise" 
              class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20">
        ➕ 新建动作
      </button>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 space-y-2.5 shadow-lg">
      <div class="relative">
        <input v-model="searchQuery" 
               type="text" 
               placeholder="搜索动作名称、目标部位、标签..." 
               class="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500" />
        <span v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-2 text-xs text-zinc-400 cursor-pointer">✕</span>
      </div>

      <!-- Categories Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button v-for="cat in categories" :key="cat"
                @click="activeCategory = cat"
                class="px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                :class="[activeCategory === cat ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700']">
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Exercises List -->
    <div class="space-y-2.5">
      <div v-for="ex in filteredExercises" :key="ex.id"
           @click="openExerciseDetail(ex)"
           class="p-4 bg-zinc-900/80 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-800 rounded-2xl cursor-pointer transition-all shadow-md space-y-2">
        
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-sm text-zinc-100">{{ ex.name }}</h3>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/60 font-semibold">
                {{ ex.category }}
              </span>
            </div>
            <div class="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <span class="text-zinc-500">主要目标:</span>
              <span class="text-zinc-300 font-medium">{{ ex.target }}</span>
            </div>
          </div>

          <button class="p-1.5 bg-zinc-800 text-amber-400 rounded-lg text-xs font-bold flex-shrink-0">
            🔬 详情
          </button>
        </div>

        <!-- Science Note excerpt -->
        <p v-if="ex.scienceDetail" class="text-xs text-zinc-400 line-clamp-2 leading-relaxed bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/80">
          {{ ex.scienceDetail }}
        </p>

        <!-- Tags -->
        <div v-if="ex.tags && ex.tags.length" class="flex flex-wrap gap-1 pt-0.5">
          <span v-for="tag in ex.tags" :key="tag" 
                class="text-[9px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
            #{{ tag }}
          </span>
        </div>

      </div>

      <div v-if="filteredExercises.length === 0" class="py-12 text-center text-zinc-500 text-xs">
        没有找到相关动作
      </div>
    </div>

    <!-- Modals -->
    <ExerciseDetailModal 
      :visible="showDetailModal" 
      :exercise="selectedExercise" 
      @close="showDetailModal = false" 
    />

    <!-- Quick Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div class="bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 space-y-3 animate-in slide-in-from-bottom duration-200">
        <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h3 class="text-base font-bold text-zinc-100">添加自定义动作</h3>
          <button @click="showCreateModal = false" class="p-1.5 bg-zinc-800 rounded-full text-zinc-400">✕</button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-xs text-zinc-400 font-medium">动作名称 *</label>
            <input v-model="newEx.name" type="text" placeholder="例如：上斜绳索夹胸" 
                   class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white" />
          </div>

          <div>
            <label class="text-xs text-zinc-400 font-medium">所属部位</label>
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
            <label class="text-xs text-zinc-400 font-medium">目标肌群与发力点</label>
            <input v-model="newEx.target" type="text" placeholder="例如：胸大肌上部纤维、强调内收峰收缩" 
                   class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white" />
          </div>

          <div>
            <label class="text-xs text-zinc-400 font-medium">动作美学目的与科学细节</label>
            <textarea v-model="newEx.scienceDetail" rows="3" placeholder="为什么做这个动作？刺激哪个位置？" 
                      class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"></textarea>
          </div>
        </div>

        <button @click="saveNewExercise" 
                :disabled="!newEx.name.trim()"
                class="w-full py-3 bg-amber-500 disabled:opacity-40 text-zinc-950 font-bold rounded-xl text-xs mt-2">
          确认添加至动作库
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { store, uid } from "../store/fitnessStore.js";
import ExerciseDetailModal from "../components/ExerciseDetailModal.vue";

const searchQuery = ref("");
const activeCategory = ref("全部");
const categories = ["全部", "胸部", "背部", "肩部", "腿部", "手臂", "核心", "其它"];

const showDetailModal = ref(false);
const selectedExercise = ref(null);

const showCreateModal = ref(false);
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
                       (ex.target && ex.target.toLowerCase().includes(q)) || 
                       (ex.tags && ex.tags.some(t => t.toLowerCase().includes(q)));
    return matchCat && matchQuery;
  });
});

function openExerciseDetail(ex) {
  selectedExercise.value = ex;
  showDetailModal.value = true;
}

function openCreateExercise() {
  newEx.value = { name: "", category: "胸部", target: "", scienceDetail: "", defaultSets: 3, defaultReps: "10-12" };
  showCreateModal.value = true;
}

function saveNewExercise() {
  if (!newEx.value.name.trim()) return;
  store.exercises.unshift({
    id: uid("ex-custom"),
    name: newEx.value.name.trim(),
    category: newEx.value.category,
    target: newEx.value.target || newEx.value.name,
    scienceDetail: newEx.value.scienceDetail || "自定义训练动作",
    defaultSets: 3,
    defaultReps: "10-12",
    tags: ["自定义"]
  });
  showCreateModal.value = false;
}
</script>
