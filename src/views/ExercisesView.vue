<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l3 3m0 0l-3 3m3-3h8m0 0l-3-3m3 3l-3 3M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"/>
          </svg>
          <span>动作库与 3D 轨迹</span>
        </h2>
        <p class="text-xs text-zinc-400 mt-0.5">
          全套 3D 解剖动图、离心向心发力要点与平替矩阵
        </p>
      </div>
      <button @click="openCreateExercise" 
              class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        <span>新建动作</span>
      </button>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 space-y-2.5 shadow-lg">
      <div class="relative">
        <input v-model="searchQuery" 
               type="text" 
               placeholder="搜索动作名称、目标肌群、标签..." 
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

    <!-- Exercises List with 3D Animated Thumbnails -->
    <div class="space-y-2.5">
      <div v-for="ex in filteredExercises" :key="ex.id"
           @click="openExerciseDetail(ex)"
           class="p-3 bg-zinc-900/80 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all shadow-md flex items-center gap-3">
        
        <!-- Left 3D Animated Thumbnail with Zero-Broken fallback -->
        <ExerciseImage :src="ex.gifUrl" 
                       :name="ex.name" 
                       :category="ex.category" 
                       :target="ex.target" 
                       customClass="w-16 h-16 rounded-xl border border-zinc-800 flex-shrink-0" />


        <!-- Center Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-sm text-zinc-100 truncate">{{ ex.name }}</h3>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700/60 font-semibold flex-shrink-0">
              {{ ex.category }}
            </span>
          </div>
          <div class="text-xs text-zinc-400 mt-0.5 truncate">
            🎯 <span class="text-zinc-300">{{ ex.target }}</span>
          </div>

          <!-- Tags -->
          <div v-if="ex.tags && ex.tags.length" class="flex flex-wrap gap-1 mt-1">
            <span v-for="tag in ex.tags.slice(0, 2)" :key="tag" 
                  class="text-[9px] px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
              #{{ tag }}
            </span>
            <span v-if="ex.substitutes?.length" class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {{ ex.substitutes.length }}个平替
            </span>
          </div>
        </div>

        <!-- Right action icon -->
        <div class="flex-shrink-0 text-zinc-500 hover:text-amber-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>

      </div>

      <div v-if="filteredExercises.length === 0" class="py-12 text-center text-zinc-500 text-xs">
        没有找到相关动作，可点击右上角创建自定义动作
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
import ExerciseImage from "../components/ExerciseImage.vue";


const searchQuery = ref("");
const activeCategory = ref("全部");
const categories = ["全部", "胸部", "背部", "肩部", "手臂", "腿部", "核心", "其它"];

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

function getCategoryEmoji(cat) {
  switch (cat) {
    case "胸部": return "🥋";
    case "背部": return "🦅";
    case "肩部": return "🛡️";
    case "手臂": return "💪";
    case "腿部": return "🦵";
    case "核心": return "⚡";
    default: return "🏋️";
  }
}

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
