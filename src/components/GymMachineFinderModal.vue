<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 overflow-hidden touch-none select-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="handleClose"></div>

      <!-- Modal Card / Bottom Sheet -->
      <div class="relative z-10 border rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden overflow-x-hidden animate-in slide-in-from-bottom duration-200 fc-glass-card"
           style="touch-action: pan-y; max-width: min(32rem, 100vw); box-sizing: border-box;"
           :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-700/80'">
        
        <!-- Top Ergonomic Grabber Pill -->
        <div class="w-10 h-1 rounded-full mx-auto mt-2 -mb-1 flex-shrink-0"
             :class="store.settings.themeMode === 'light' ? 'bg-slate-300' : 'bg-zinc-700/80'"></div>

        <!-- Header -->
        <div class="p-3.5 border-b flex items-center justify-between flex-shrink-0"
             :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-xl flex items-center justify-center text-sm shadow-sm"
                  :class="store.settings.themeMode === 'light' ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'">
              📸
            </span>
            <div>
              <h3 class="text-sm font-black flex items-center gap-1.5"
                  :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
                <span>器械多模态智能识别</span>
                <span v-if="replaceIndex >= 0" 
                      class="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold"
                      :class="store.settings.themeMode === 'light' ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-sky-950/80 text-sky-400 border border-sky-500/30'">
                  替换第 {{ replaceIndex + 1 }} 项
                </span>
              </h3>
              <p class="text-[11px]" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                拍照、语音或口语描述，毫秒级定位 109 款黄金动作
              </p>
            </div>
          </div>

          <button @click="handleClose" 
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'">
            ✕
          </button>
        </div>

        <!-- Success Feedback Banner -->
        <div v-if="feedbackText" 
             class="p-2.5 bg-emerald-500 text-zinc-950 text-xs font-black flex items-center justify-center gap-1.5 animate-in slide-in-from-top-2 duration-150">
          <span>✓</span>
          <span>{{ feedbackText }}</span>
        </div>

        <!-- Multimodal Input Vector Controls -->
        <div class="p-3 border-b space-y-2.5 flex-shrink-0"
             :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/60 border-zinc-800/80'">
          
          <!-- Vector 1: Hidden Camera File Input -->
          <input ref="fileInputRef" 
                 type="file" 
                 accept="image/*" 
                 capture="environment" 
                 class="hidden" 
                 @change="handleFileChange" />

          <!-- Main Colloquial Search Bar with embedded mic & camera icons -->
          <div class="relative flex items-center">
            <input v-model="searchQuery" 
                   type="text" 
                   placeholder="口语描述，例如“坐着手往前推”、“黄色大器械”..." 
                   class="w-full rounded-2xl pl-3.5 pr-24 py-2.5 text-xs transition-all focus:outline-none focus:border-amber-500"
                   :class="store.settings.themeMode === 'light' ? 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs' : 'bg-zinc-900 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500'"
                   @input="onSearchInput" />

            <!-- Clear button -->
            <button v-if="searchQuery" 
                    @click="clearQuery" 
                    class="absolute right-16 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer p-1">
              ✕
            </button>

            <!-- Vector 2 & 3: Camera & Voice Action Icons inside search bar -->
            <div class="absolute right-2 flex items-center gap-1">
              <!-- Camera button -->
              <button @click="triggerCameraUpload" 
                      title="拍照/上传器械照片"
                      class="p-1.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                      :class="selectedImage ? 'bg-amber-500 text-zinc-950 font-black' : (store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300')">
                <span class="text-xs">📸</span>
              </button>

              <!-- Voice toggle button with audio pulse indicator -->
              <button @click="toggleVoiceListening" 
                      title="语音录音输入"
                      class="p-1.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center relative"
                      :class="isListening ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40' : (store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300')">
                <span class="text-xs">🎙️</span>
                <span v-if="isListening" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              </button>
            </div>
          </div>

          <!-- Active Listening Status Banner -->
          <div v-if="isListening" 
               class="p-2 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div class="flex items-center gap-2 text-red-400 font-bold">
              <span class="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              <span>正在聆听中... 请说出器械外观或动作特点</span>
            </div>
            <button @click="stopVoiceListening" class="px-2 py-0.5 rounded-lg bg-red-500 text-white font-black text-[10px]">
              停止录音
            </button>
          </div>

          <!-- Image Preview Strip if user picked an image -->
          <div v-if="selectedImage" 
               class="p-2 rounded-xl border flex items-center justify-between gap-2"
               :class="store.settings.themeMode === 'light' ? 'bg-amber-50/80 border-amber-300' : 'bg-amber-500/10 border-amber-500/30'">
            <div class="flex items-center gap-2 min-w-0">
              <img :src="selectedImage.dataUrl" alt="器械照片" class="w-8 h-8 rounded-lg object-cover border border-amber-500/40 flex-shrink-0" />
              <div class="min-w-0">
                <div class="text-xs font-bold truncate" :class="store.settings.themeMode === 'light' ? 'text-amber-900' : 'text-amber-300'">
                  已加载照片: {{ selectedImage.name }}
                </div>
                <div class="text-[10px] opacity-80" :class="store.settings.themeMode === 'light' ? 'text-amber-800' : 'text-amber-400'">
                  已提取视觉特征并联动语义索引
                </div>
              </div>
            </div>
            <button @click="clearImage" class="text-xs text-amber-500 hover:text-amber-400 font-bold px-1.5 py-0.5">
              移除
            </button>
          </div>

          <!-- 6 High-Frequency Colloquial Quick-Pills for 100% Fallback & Ergonomics -->
          <div class="space-y-1">
            <div class="text-[11px] font-bold flex items-center justify-between"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
              <span class="flex items-center gap-1">
                <span>💬</span> 常用口语快捷秒查:
              </span>
              <span class="text-[10px] opacity-70">点击立即识别</span>
            </div>
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar overscroll-x-contain touch-pan-x">
              <button v-for="pill in COLLOQUIAL_PILLS" :key="pill"
                      @click="selectPill(pill)"
                      class="px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 cursor-pointer border flex-shrink-0"
                      :class="searchQuery === pill 
                        ? 'bg-amber-500 text-zinc-950 font-black border-amber-500 shadow-sm shadow-amber-500/20' 
                        : (store.settings.themeMode === 'light' ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800')">
                {{ pill }}
              </button>
            </div>
          </div>

        </div>

        <!-- Matching Results List Container -->
        <div class="overflow-y-auto flex-1 p-3 space-y-2.5 overscroll-contain"
             style="-webkit-overflow-scrolling: touch; touch-action: pan-y;">

          <!-- Result Header -->
          <div v-if="searchQuery.trim() || selectedImage" class="flex items-center justify-between px-1 text-xs"
               :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
            <span>匹配识别结果</span>
            <span class="font-mono font-bold" :class="store.settings.themeMode === 'light' ? 'text-amber-800' : 'text-amber-400'">
              找到 {{ searchResults.length }} 项动作
            </span>
          </div>

          <!-- Matching Cards List -->
          <div v-if="searchResults.length > 0" class="space-y-2">
            <div v-for="match in searchResults" :key="match.exercise.id || match.exercise.name"
                 class="p-3 border rounded-2xl transition-all shadow-sm space-y-2.5"
                 :class="store.settings.themeMode === 'light' 
                   ? 'bg-white hover:bg-slate-50 border-slate-300/90 shadow-xs' 
                   : 'bg-zinc-950/80 hover:bg-zinc-900 border-zinc-800/80 hover:border-amber-500/40'">
              
              <!-- Card Top: 3D Thumbnail + Basic Information + Confidence Badge -->
              <div class="flex items-center gap-3">
                <ExerciseImage :src="match.exercise.gifUrl"
                               :name="match.exercise.name"
                               :category="match.exercise.category"
                               :target="match.exercise.target"
                               customClass="w-16 h-16 rounded-xl border border-zinc-800 flex-shrink-0" />

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-1.5">
                    <h4 class="font-black text-xs truncate"
                        :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
                      {{ match.exercise.name }}
                    </h4>
                    <!-- Confidence Badge -->
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-black flex items-center gap-1 border flex-shrink-0"
                          :class="getConfidenceBadgeClass(match.confidence)">
                      <span class="w-1.5 h-1.5 rounded-full" :class="match.confidence >= 0.85 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"></span>
                      {{ Math.round(match.confidence * 100) }}% {{ match.confidence >= 0.85 ? '精准匹配' : '高度匹配' }}
                    </span>
                  </div>

                  <div class="text-[11px] mt-0.5 truncate"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                    <span>{{ match.exercise.category }} · </span>
                    <span class="font-medium" :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">{{ match.exercise.target }}</span>
                  </div>

                  <!-- Matched features tags -->
                  <div v-if="match.matchedFeatures && match.matchedFeatures.length" class="flex flex-wrap gap-1 mt-1">
                    <span v-for="feat in match.matchedFeatures.slice(0, 3)" :key="feat"
                          class="text-[9px] px-1.5 py-0.2 rounded border truncate max-w-[150px]"
                          :class="store.settings.themeMode === 'light' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-zinc-900 text-amber-300/90 border-zinc-800'">
                      {{ feat }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Scientific Reasoning Text -->
              <div v-if="match.reasoning" class="p-2 rounded-xl text-[11px] leading-relaxed border"
                   :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-zinc-900/60 border-zinc-800/60 text-zinc-300'">
                <span class="font-bold text-amber-500">💡 识别依据: </span>
                {{ match.reasoning }}
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 pt-1 border-t"
                   :class="store.settings.themeMode === 'light' ? 'border-slate-100' : 'border-zinc-900'">
                
                <!-- Replace button if in replace mode -->
                <button v-if="replaceIndex >= 0"
                        @click="handleReplace(match.exercise)"
                        class="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-black text-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                  <span>🔄 替换当前动作</span>
                </button>

                <!-- Add to workout button -->
                <button @click="handleAddToWorkout(match.exercise)"
                        class="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                  <span>+ 一键加入今日训练</span>
                </button>

                <!-- Quick Detail View button -->
                <button @click="handleViewDetail(match.exercise)"
                        title="查看动作要领"
                        class="px-3 py-2 rounded-xl border text-xs font-bold active:scale-95 transition-all cursor-pointer"
                        :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'">
                  详情
                </button>
              </div>

            </div>
          </div>

          <!-- Empty State: When user hasn't typed anything -->
          <div v-else-if="!searchQuery.trim() && !selectedImage" 
               class="p-6 text-center space-y-3 border border-dashed rounded-3xl"
               :class="store.settings.themeMode === 'light' ? 'border-slate-300 bg-slate-50/50 text-slate-600' : 'border-zinc-800 bg-zinc-950/40 text-zinc-400'">
            <div class="text-3xl">🦾</div>
            <div class="space-y-1">
              <div class="text-xs font-black" :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">
                健身房遇到不认识的器械？
              </div>
              <p class="text-[11px] leading-relaxed max-w-xs mx-auto">
                点击上方 📸 拍摄器械，或点击 🎙️ 说出动作（例如“手往前推的黄色杠杆”），FitCycle 将在毫秒内为您识别出正确动作与力学要领。
              </p>
            </div>
          </div>

          <!-- No Results State: When query yielded no matches -->
          <div v-else 
               class="p-6 text-center space-y-2 border border-dashed rounded-2xl"
               :class="store.settings.themeMode === 'light' ? 'border-slate-300 bg-slate-50 text-slate-600' : 'border-zinc-800 bg-zinc-950 text-zinc-400'">
            <div class="text-2xl">🔍</div>
            <div class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">
              未检索到高匹配器械
            </div>
            <p class="text-[11px]">
              请尝试用更简单的口语描述（例如“坐着推”、“躺着蹬大腿”），或点击上方 6 大快捷胶囊。
            </p>
          </div>

        </div>

      </div>

    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { store, addExerciseToActiveWorkout, replaceExerciseInActiveWorkout, addExerciseToPlan, getTodayPlan } from "../store/fitnessStore.js";
import { recognizeMachineByQuery } from "../engine/machineRecognitionEngine.js";
import { processImageFile } from "../ai/imageProcessor.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { triggerHaptic } from "../utils/vibrate.js";
import ExerciseImage from "./ExerciseImage.vue";

const props = defineProps({
  visible: Boolean,
  replaceIndex: {
    type: Number,
    default: -1
  },
  initialQuery: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["close", "select", "viewDetail"]);

// 6 high-frequency colloquial quick pills for 100% guaranteed fallback
const COLLOQUIAL_PILLS = [
  "坐着手往前推的黄色杠杆器械",
  "躺着往上蹬大腿的斜面大器械",
  "坐着往下拉背的高位器械",
  "坐着两手往中间夹胸的蝴蝶机",
  "坐着把小腿向上踢直的腿屈伸",
  "趴着小腿往后勾的腿弯举"
];

// State
const searchQuery = ref(props.initialQuery || "");
const fileInputRef = ref(null);
const selectedImage = ref(null);
const isListening = ref(false);
const feedbackText = ref("");
let recognitionInstance = null;

// Modal Scroll Lock Lifecycle
watch(() => props.visible, (val) => {
  if (val) {
    lockBodyScroll();
    if (props.initialQuery && !searchQuery.value) {
      searchQuery.value = props.initialQuery;
    }
  } else {
    unlockBodyScroll();
    stopVoiceListening();
    feedbackText.value = "";
  }
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
  stopVoiceListening();
});

// Computed matched exercises
const searchResults = computed(() => {
  const query = searchQuery.value.trim();
  const allEx = store.exercises || [];

  if (!query && !selectedImage.value) {
    return [];
  }

  // If user selected an image, combine image hints with query
  let finalQuery = query;
  if (selectedImage.value && !finalQuery) {
    finalQuery = selectedImage.value.name.replace(/\.[^/.]+$/, "");
  }

  if (!finalQuery) return [];

  return recognizeMachineByQuery(finalQuery, allEx, { threshold: 0.15, limit: 12 });
});

function onSearchInput() {
  // Input handled reactively by computed searchResults
}

function clearQuery() {
  searchQuery.value = "";
}

function selectPill(pillText) {
  searchQuery.value = pillText;
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

// Multimodal Vector 1: Camera Photo Upload / Selection
function triggerCameraUpload() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

async function handleFileChange(event) {
  const file = event.target?.files?.[0];
  if (!file) return;

  try {
    const processed = await processImageFile(file);
    selectedImage.value = processed;

    // Use filename or tags to populate/enhance search query
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    if (!searchQuery.value) {
      searchQuery.value = cleanName;
    }

    if (store.settings.vibrationEnabled) triggerHaptic("success");
  } catch (err) {
    console.error("处理照片失败:", err);
    alert(err.message || "图片读取失败，请重新选择");
  } finally {
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
}

function clearImage() {
  selectedImage.value = null;
}

// Multimodal Vector 2: Microphone Web Speech API
function toggleVoiceListening() {
  if (isListening.value) {
    stopVoiceListening();
  } else {
    startVoiceListening();
  }
}

function startVoiceListening() {
  const SpeechRecognition = typeof window !== "undefined" && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!SpeechRecognition) {
    alert("当前浏览器环境未开放 Web Speech API 实时录音，请直接点击下方常用口语胶囊秒查！");
    return;
  }

  try {
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = "zh-CN";
    recognitionInstance.interimResults = true;
    recognitionInstance.continuous = false;

    recognitionInstance.onstart = () => {
      isListening.value = true;
      if (store.settings.vibrationEnabled) triggerHaptic("medium");
    };

    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join("");
      if (transcript) {
        searchQuery.value = transcript;
      }
    };

    recognitionInstance.onerror = (event) => {
      console.warn("语音识别提示:", event.error);
      isListening.value = false;
    };

    recognitionInstance.onend = () => {
      isListening.value = false;
    };

    recognitionInstance.start();
  } catch (e) {
    console.error("启动麦克风失败:", e);
    isListening.value = false;
  }
}

function stopVoiceListening() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (_) {}
    recognitionInstance = null;
  }
  isListening.value = false;
}

// Actions
function handleAddToWorkout(exercise) {
  if (store.activeWorkout) {
    addExerciseToActiveWorkout(exercise);
    feedbackText.value = `已将【${exercise.name}】加入今日训练！`;
  } else {
    const plan = getTodayPlan();
    if (plan) {
      addExerciseToPlan(plan.id, exercise);
      feedbackText.value = `已将【${exercise.name}】加入今日计划！`;
    } else {
      feedbackText.value = `已识别【${exercise.name}】！`;
    }
  }

  if (store.settings.vibrationEnabled) triggerHaptic("success");

  emit("select", exercise, { mode: "add" });

  setTimeout(() => {
    feedbackText.value = "";
    emit("close");
  }, 600);
}

function handleReplace(exercise) {
  if (props.replaceIndex >= 0 && store.activeWorkout) {
    replaceExerciseInActiveWorkout(props.replaceIndex, exercise);
    feedbackText.value = `已替换为【${exercise.name}】！`;
  } else {
    feedbackText.value = `已选定【${exercise.name}】！`;
  }

  if (store.settings.vibrationEnabled) triggerHaptic("success");

  emit("select", exercise, { mode: "replace", replaceIndex: props.replaceIndex });

  setTimeout(() => {
    feedbackText.value = "";
    emit("close");
  }, 600);
}

function handleViewDetail(exercise) {
  emit("viewDetail", exercise);
}

function handleClose() {
  stopVoiceListening();
  emit("close");
}

function getConfidenceBadgeClass(confidence) {
  if (confidence >= 0.85) {
    return store.settings.themeMode === 'light' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
      : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
  }
  return store.settings.themeMode === 'light' 
    ? 'bg-amber-100 text-amber-800 border-amber-300' 
    : 'bg-amber-950/80 text-amber-400 border-amber-500/40';
}
</script>
