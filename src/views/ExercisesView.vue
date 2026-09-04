<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-black text-white flex items-center gap-2">
          <span>动作库</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono font-bold">
            {{ store.exercises.length }}
          </span>
        </h2>
        <p class="text-xs text-zinc-400 mt-0.5">
          全套 3D 解剖动图、离心向心要点与平替矩阵
        </p>
      </div>
      <button @click="openCreateExercise" 
              class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        <span>新建动作</span>
      </button>
    </div>

    <!-- Reassurance Banner (Comprehensive Library) -->
    <div class="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2 text-zinc-300">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-medium">已全面收录 6 大黄金肌群黄金动作</span>
      </div>
      <span class="text-amber-400 font-mono font-bold">{{ store.exercises.length }} 款全覆盖</span>
    </div>

    <!-- Search & Filter Bar (Natural Scroll, Zero Viewport Obstruction) -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 space-y-2.5 shadow-md">
      <div class="relative">
        <div class="absolute left-3.5 top-2.5 text-zinc-500 text-xs">🔍</div>
        <input v-model="searchQuery" 
               type="text" 
               placeholder="搜索动作名称、英文、别名、目标肌群..." 
               class="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors" />
        <span v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-2 text-xs text-zinc-400 hover:text-white cursor-pointer">✕</span>
      </div>

      <!-- Categories Pills with Real-Time Counts -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar overscroll-x-contain touch-pan-x">
        <button v-for="cat in categoryOptions" :key="cat.name"
                @click="activeCategory = cat.name"
                class="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                :class="[
                  activeCategory === cat.name ? 
                  'bg-amber-500 text-zinc-950 font-bold shadow-sm shadow-amber-500/20' : 
                  'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                ]">
          <span>{{ cat.name }}</span>
          <span class="text-[10px] opacity-80 font-mono">({{ cat.count }})</span>
        </button>
      </div>
    </div>

    <!-- Search Query Result Counter -->
    <div v-if="searchQuery.trim()" class="flex items-center justify-between px-1 text-xs text-zinc-400">
      <span>搜索关键词: <span class="text-amber-400 font-bold">"{{ searchQuery }}"</span></span>
      <span class="font-mono">找到 {{ filteredExercises.length }} 个动作</span>
    </div>

    <!-- Exercises Inset List -->
    <div class="space-y-2">
      <div v-for="ex in filteredExercises" :key="ex.id"
           @click="openExerciseDetail(ex)"
           class="p-3 bg-zinc-900/80 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-800/90 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all shadow-sm flex items-center gap-3">
        
        <!-- 3D Animated Thumbnail with Zero-Broken fallback -->
        <ExerciseImage :src="ex.gifUrl" 
                       :name="ex.name" 
                       :category="ex.category" 
                       :target="ex.target" 
                       customClass="w-14 h-14 rounded-xl border border-zinc-800 flex-shrink-0" />

        <!-- Center Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <h3 class="font-bold text-xs text-zinc-100 truncate">{{ ex.name }}</h3>
            <span class="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-amber-400 border border-zinc-700/60 font-semibold flex-shrink-0">
              {{ ex.category }}
            </span>
          </div>
          <div class="text-[11px] text-zinc-400 mt-0.5 truncate">
            🎯 <span class="text-zinc-300">{{ ex.target }}</span>
          </div>

          <!-- Tags & Substitutes -->
          <div class="flex flex-wrap items-center gap-1 mt-1">
            <span v-if="ex.englishName" class="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-950 text-zinc-500 border border-zinc-800 truncate max-w-[120px]">
              {{ ex.englishName }}
            </span>
            <span v-for="tag in (ex.tags || []).slice(0, 1)" :key="tag" 
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

      <div v-if="filteredExercises.length === 0" class="py-12 text-center text-zinc-500 text-xs space-y-2">
        <div>未找到与关键词匹配的动作</div>
        <button @click="openCreateExercise" class="text-amber-400 font-bold hover:underline">
          立即添加自定义动作 ❯
        </button>
      </div>
    </div>

    <!-- Floating Back-to-Top Pill Button (Natural Thumb Zone Ergonomics) -->
    <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-4 scale-90"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-4 scale-90">
      <button v-show="showBackToTop" 
              @click="scrollToTop" 
              type="button"
              aria-label="返回顶部"
              class="fixed bottom-20 right-4 z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900/95 hover:bg-zinc-800 active:scale-95 text-amber-400 font-bold text-xs shadow-xl shadow-black/60 border border-amber-500/40 backdrop-blur-xl transition-all cursor-pointer">
        <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
        <span>回顶</span>
      </button>
    </Transition>

    <!-- Modals -->
    <ExerciseDetailModal 
      :visible="showDetailModal" 
      :exercise="selectedExercise" 
      @close="showDetailModal = false" 
    />

    <!-- Quick Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" 
           class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200"
           style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
        <!-- Backdrop dismiss -->
        <div class="absolute inset-0" @click="showCreateModal = false"></div>
        
        <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 space-y-3 animate-in slide-in-from-bottom duration-200 shadow-2xl">
          <!-- Top ergonomic drag pill -->
          <div class="w-10 h-1 rounded-full bg-zinc-700 mx-auto -mt-1 mb-2 flex-shrink-0"></div>

          <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 class="text-sm font-black text-zinc-100">添加自定义动作</h3>
            <button @click="showCreateModal = false" class="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs text-zinc-400 font-medium">动作名称 *</label>
              <input v-model="newEx.name" type="text" placeholder="例如：上斜绳索夹胸" 
                     class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
            </div>

            <div>
              <label class="text-xs text-zinc-400 font-medium">所属部位</label>
              <div class="grid grid-cols-4 gap-1.5 mt-1">
                <button v-for="c in categories.filter(x => x !== '全部')" :key="c"
                        type="button"
                        @click="newEx.category = c"
                        class="py-1.5 text-xs rounded-lg border text-center transition-colors cursor-pointer"
                        :class="[newEx.category === c ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-300']">
                  {{ c }}
                </button>
              </div>
            </div>

            <div>
              <label class="text-xs text-zinc-400 font-medium">目标肌群与发力点</label>
              <input v-model="newEx.target" type="text" placeholder="例如：胸大肌上部纤维、强调内收峰收缩" 
                     class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
            </div>

            <div>
              <label class="text-xs text-zinc-400 font-medium">动作美学目的与科学细节</label>
              <textarea v-model="newEx.scienceDetail" rows="3" placeholder="为什么做这个动作？刺激哪个位置？" 
                        class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"></textarea>
            </div>
          </div>

          <button @click="saveNewExercise" 
                  :disabled="!newEx.name.trim()"
                  class="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-black rounded-xl text-xs mt-2 transition-all cursor-pointer">
            确认添加至动作库
          </button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { store, uid } from "../store/fitnessStore.js";
import ExerciseDetailModal from "../components/ExerciseDetailModal.vue";
import ExerciseImage from "../components/ExerciseImage.vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { triggerHaptic } from "../utils/vibrate.js";

const searchQuery = ref("");
const activeCategory = ref("全部");
const categories = ["全部", "胸部", "背部", "肩部", "手臂", "腿部", "核心", "其它"];

const showBackToTop = ref(false);

function handleScroll() {
  if (typeof window !== "undefined") {
    showBackToTop.value = window.scrollY > 350;
  }
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
  }
  if (showCreateModal.value) {
    unlockBodyScroll();
  }
});

const categoryOptions = computed(() => {
  return categories.map(cat => {
    if (cat === "全部") {
      return { name: cat, count: store.exercises.length };
    }
    const count = store.exercises.filter(e => e.category === cat).length;
    return { name: cat, count };
  });
});

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

watch(showCreateModal, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
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
