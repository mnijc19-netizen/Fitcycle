<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 overflow-hidden touch-none select-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      
      <!-- Backdrop dismiss -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

    <!-- Modal Card / Bottom Sheet -->
    <div class="relative z-10 border rounded-t-3xl sm:rounded-3xl max-w-md w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden overflow-x-hidden animate-in slide-in-from-bottom duration-200"
         style="touch-action: pan-y; max-width: min(28rem, 100vw); box-sizing: border-box;"
         :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-700/80'">
      
      <!-- Top Ergonomic Grabber Pill for Bottom Sheet Gesture -->
      <div class="w-10 h-1 rounded-full mx-auto mt-2 -mb-1 flex-shrink-0"
           :class="store.settings.themeMode === 'light' ? 'bg-slate-300' : 'bg-zinc-700/80'"></div>

      <!-- Top Fixed Header Bar -->
      <div class="p-3.5 border-b flex items-center justify-between flex-shrink-0"
           :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border"
                :class="store.settings.themeMode === 'light' ? 'bg-amber-500/15 text-amber-800 border-amber-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            3D 动作指导
          </span>
          <span class="text-xs" :class="store.settings.themeMode === 'light' ? 'text-slate-700 font-bold' : 'text-zinc-400'">{{ exercise?.category }}</span>
        </div>

        <button @click="$emit('close')" 
                class="w-8 h-8 rounded-full active:scale-95 flex items-center justify-center text-sm font-bold transition-all"
                :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'">
          ✕
        </button>
      </div>

      <!-- Single Smooth Touch-Scrollable Body -->
      <div ref="scrollContainer"
           class="overflow-y-auto flex-1 p-4 space-y-4 overscroll-contain" 
           style="-webkit-overflow-scrolling: touch; touch-action: pan-y;">
        
        <!-- 3D Muscle Diagram / Animation Display Box -->
        <div class="w-full h-60 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex items-center justify-center relative p-2 shadow-2xl" data-theme-preserve="true">
          <img v-if="exercise?.gifUrl && !gifError" 
               :src="exercise.gifUrl" 
               :alt="exercise.name" 
               @error="gifError = true"
               class="w-full h-full object-contain mix-blend-screen transition-all" />
          
          <!-- Guaranteed 3D Muscle Diagram fallback -->
          <div v-show="!exercise?.gifUrl || gifError" class="w-full h-full flex items-center justify-center">
            <div v-html="muscleSvg" class="w-full h-full max-h-48 max-w-48 flex items-center justify-center"></div>
          </div>

          <!-- 3D Badges -->
          <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/40 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            3D 动作循环演示
          </span>
          <span class="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-zinc-300 border border-zinc-700/60">
            标准发力轨迹
          </span>
        </div>


        <!-- Title & Targets -->
        <div>
          <h2 class="text-xl font-black tracking-tight"
              :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-white'">
            {{ exercise?.name }}
          </h2>
          <p v-if="exercise?.englishName" class="text-xs font-mono mt-0.5"
             :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-bold' : 'text-zinc-400'">
            {{ exercise.englishName }}
          </p>

          <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span class="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border"
                  :class="store.settings.themeMode === 'light' ? 'bg-amber-500/15 border-amber-500/30 text-amber-800' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'">
              <span>🎯 主目标:</span> {{ exercise?.target }}
            </span>
            <span class="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border"
                  :class="store.settings.themeMode === 'light' ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-sky-950/80 text-sky-400 border-sky-500/40'">
              <span>📐 平面:</span> {{ movementPlaneInfo.name }}
            </span>
            <span v-for="sec in exercise?.secondaryMuscles || []" :key="sec"
                  class="px-2 py-1 rounded-xl text-xs border font-semibold"
                  :class="store.settings.themeMode === 'light' ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-zinc-800 text-zinc-300 border-zinc-700'">
              + {{ sec }}
            </span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center border-b gap-4 text-xs font-bold pt-1"
             :class="store.settings.themeMode === 'light' ? 'border-slate-200' : 'border-zinc-800'">
          <button @click="activeTab = 'tips'"
                  class="py-2 relative transition-colors"
                  :class="[activeTab === 'tips' ? (store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400 font-black') : (store.settings.themeMode === 'light' ? 'text-slate-600 hover:text-slate-900 font-bold' : 'text-zinc-400 hover:text-zinc-200')]">
            动作要点
            <span v-if="activeTab === 'tips'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
          </button>

          <button @click="activeTab = 'substitutes'"
                  class="py-2 relative transition-colors flex items-center gap-1"
                  :class="[activeTab === 'substitutes' ? (store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400 font-black') : (store.settings.themeMode === 'light' ? 'text-slate-600 hover:text-slate-900 font-bold' : 'text-zinc-400 hover:text-zinc-200')]">
            平替动作
            <span v-if="exercise?.substitutes?.length" class="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold"
                  :class="store.settings.themeMode === 'light' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-zinc-800 text-amber-400'">
              {{ exercise.substitutes.length }}
            </span>
            <span v-if="activeTab === 'substitutes'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
          </button>

          <button @click="activeTab = 'science'"
                  class="py-2 relative transition-colors"
                  :class="[activeTab === 'science' ? (store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400 font-black') : (store.settings.themeMode === 'light' ? 'text-slate-600 hover:text-slate-900 font-bold' : 'text-zinc-400 hover:text-zinc-200')]">
            科学解析
            <span v-if="activeTab === 'science'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
          </button>

          <button @click="activeTab = 'history'"
                  class="py-2 relative transition-colors"
                  :class="[activeTab === 'history' ? (store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400 font-black') : (store.settings.themeMode === 'light' ? 'text-slate-600 hover:text-slate-900 font-bold' : 'text-zinc-400 hover:text-zinc-200')]">
            历史记录
            <span v-if="activeTab === 'history'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
          </button>
        </div>

        <!-- TAB 1: 动作要点 (Tips) -->
        <div v-if="activeTab === 'tips'" class="space-y-2.5 text-xs">
          <div v-if="exercise?.tips" class="space-y-2">
            <div v-if="exercise.tips.prep" class="p-3 rounded-2xl space-y-1 border"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-300/90 shadow-xs' : 'bg-zinc-950/80 border-zinc-800/80'">
              <div class="font-bold flex items-center gap-1.5"
                   :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400'">
                <span>1️⃣</span> 准备姿态
              </div>
              <p class="leading-relaxed pl-5 font-medium"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">{{ exercise.tips.prep }}</p>
            </div>

            <div v-if="exercise.tips.execution" class="p-3 rounded-2xl space-y-1 border"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-300/90 shadow-xs' : 'bg-zinc-950/80 border-zinc-800/80'">
              <div class="font-bold flex items-center gap-1.5"
                   :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400'">
                <span>2️⃣</span> 发力轨迹
              </div>
              <p class="leading-relaxed pl-5 font-medium"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">{{ exercise.tips.execution }}</p>
            </div>

            <div v-if="exercise.tips.peak" class="p-3 rounded-2xl space-y-1 border"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-300/90 shadow-xs' : 'bg-zinc-950/80 border-zinc-800/80'">
              <div class="font-bold flex items-center gap-1.5"
                   :class="store.settings.themeMode === 'light' ? 'text-emerald-800 font-black' : 'text-emerald-400'">
                <span>3️⃣</span> 顶峰收缩 (Peak Contraction)
              </div>
              <p class="leading-relaxed pl-5 font-medium"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">{{ exercise.tips.peak }}</p>
            </div>

            <div v-if="exercise.tips.negative" class="p-3 rounded-2xl space-y-1 border"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-300/90 shadow-xs' : 'bg-zinc-950/80 border-zinc-800/80'">
              <div class="font-bold flex items-center gap-1.5"
                   :class="store.settings.themeMode === 'light' ? 'text-sky-800 font-black' : 'text-sky-400'">
                <span>4️⃣</span> 离心控制 (Negative / Stretch)
              </div>
              <p class="leading-relaxed pl-5 font-medium"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">{{ exercise.tips.negative }}</p>
            </div>

            <div v-if="exercise.tips.breathing" class="p-3 rounded-2xl space-y-1 border"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-300/90 shadow-xs' : 'bg-zinc-950/80 border-zinc-800/80'">
              <div class="font-bold flex items-center gap-1.5"
                   :class="store.settings.themeMode === 'light' ? 'text-purple-800 font-black' : 'text-purple-400'">
                <span>🫁</span> 呼吸节奏
              </div>
              <p class="leading-relaxed pl-5 font-medium"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">{{ exercise.tips.breathing }}</p>
            </div>
          </div>

          <!-- Force Vector Alignment Cue (力线避坑指南: 肌纤维走向与阻力方向同轴) -->
          <div class="p-3.5 rounded-2xl space-y-1.5 border"
               :class="store.settings.themeMode === 'light' ? 'bg-amber-50/90 border-amber-300/80 shadow-xs' : 'bg-amber-500/10 border-amber-500/30'">
            <div class="font-bold flex items-center justify-between"
                 :class="store.settings.themeMode === 'light' ? 'text-amber-900 font-black' : 'text-amber-300'">
              <span class="flex items-center gap-1.5">
                <span>🎯</span> 力线避坑指南 (肌纤维走向与阻力方向同轴)
              </span>
              <span class="text-[10px] font-mono opacity-80 font-bold px-1.5 py-0.2 rounded"
                    :class="store.settings.themeMode === 'light' ? 'bg-amber-200/80 text-amber-950' : 'bg-amber-500/20 text-amber-300'">
                {{ movementPlaneInfo.action }}
              </span>
            </div>
            <p class="leading-relaxed font-medium text-xs"
               :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">
              {{ forceVectorCue }}
            </p>
          </div>

          <!-- Common Mistakes -->
          <div v-if="exercise?.commonMistakes && exercise.commonMistakes.length" 
               class="p-3.5 rounded-2xl space-y-1.5 border"
               :class="store.settings.themeMode === 'light' ? 'bg-red-50/90 border-red-300/80 shadow-xs' : 'bg-red-950/20 border-red-500/30'">
            <div class="font-bold flex items-center gap-1.5"
                 :class="store.settings.themeMode === 'light' ? 'text-red-700 font-black' : 'text-red-400'">
              <span>⚠️</span> 常见错误与避坑指南
            </div>
            <ul class="space-y-1 pl-5 list-disc"
                :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-medium' : 'text-zinc-300'">
              <li v-for="(mistake, mIdx) in exercise.commonMistakes" :key="mIdx" class="leading-relaxed">
                {{ mistake }}
              </li>
            </ul>
          </div>

          <!-- Compensation Checklist (常见代偿警示排查表) -->
          <div class="p-3.5 rounded-2xl space-y-2 border"
               :class="store.settings.themeMode === 'light' ? 'bg-rose-50/80 border-rose-300/80 shadow-xs' : 'bg-rose-950/20 border-rose-500/30'">
            <div class="font-bold flex items-center justify-between"
                 :class="store.settings.themeMode === 'light' ? 'text-rose-900 font-black' : 'text-rose-300'">
              <span class="flex items-center gap-1.5">
                <span>🛡️</span> 常见代偿警示排查表 (Compensation Checklist)
              </span>
              <span class="text-[10px] font-mono opacity-80">防伤保护</span>
            </div>
            <ul class="space-y-1 text-xs"
                :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-medium' : 'text-zinc-300'">
              <li v-for="(comp, cIdx) in compensationList" :key="cIdx" class="leading-relaxed flex items-start gap-1.5">
                <span class="text-rose-500 font-bold">•</span>
                <span>{{ comp }}</span>
              </li>
            </ul>
          </div>

          <!-- Direct 1-Click AI Coach Query Pills -->
          <div class="p-3.5 rounded-2xl space-y-2 border"
               :class="store.settings.themeMode === 'light' ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/90 border-indigo-200 shadow-xs' : 'bg-gradient-to-br from-zinc-950 via-indigo-950/30 to-zinc-900 border-indigo-500/30'">
            <div class="flex items-center justify-between">
              <div class="font-bold text-xs flex items-center gap-1.5"
                   :class="store.settings.themeMode === 'light' ? 'text-indigo-950 font-black' : 'text-indigo-300'">
                <span>🤖</span> 随身 AI 运动生物力学教练
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="store.settings.themeMode === 'light' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'">
                1-Click 直达答疑
              </span>
            </div>
            <p class="text-[11px]" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
              点击快速向 AI 教练追问当前动作要领与生理调控：
            </p>
            <div class="flex flex-wrap gap-1.5 pt-0.5">
              <button v-for="pill in aiQueryPills" :key="pill"
                      @click="handleAskAICoach(pill)"
                      class="px-2.5 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer border flex items-center gap-1"
                      :class="store.settings.themeMode === 'light' 
                        ? 'bg-white hover:bg-indigo-50 text-indigo-950 border-indigo-300/80 shadow-xs' 
                        : 'bg-zinc-900 hover:bg-indigo-900/40 text-indigo-200 border-indigo-500/30'">
                <span>💬</span> {{ pill }}
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 2: 平替动作 (Substitutes) -->
        <div v-if="activeTab === 'substitutes'" class="space-y-2.5 text-xs">
          <p :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium text-[11px]' : 'text-zinc-400 text-[11px]'">
            💡 器械被占或想换刺激角度时，推荐以下高匹配平替：
          </p>

          <div v-if="exercise?.substitutes && exercise.substitutes.length" class="space-y-2">
            <div v-for="(sub, sIdx) in exercise.substitutes" :key="sIdx"
                 @click="handleSelectSubstitute(sub.name)"
                 class="p-3 border rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 shadow-xs' : 'bg-zinc-950/80 hover:bg-zinc-800 border-zinc-800 hover:border-amber-500/40'">
              <div>
                <div class="font-bold text-sm flex items-center gap-1.5"
                     :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">
                  <span>🔄</span> {{ sub.name }}
                </div>
                <p class="text-xs mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">{{ sub.reason }}</p>
              </div>
              <button class="px-2.5 py-1 text-xs font-bold rounded-lg border flex-shrink-0"
                      :class="store.settings.themeMode === 'light' ? 'bg-amber-500/15 text-amber-800 border-amber-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'">
                查看/替换
              </button>
            </div>
          </div>

          <div v-else class="p-6 text-center border border-dashed rounded-2xl"
               :class="store.settings.themeMode === 'light' ? 'text-slate-500 border-slate-300' : 'text-zinc-500 border-zinc-800'">
            暂无预设平替，可在动作库中选择同部位动作
          </div>
        </div>

        <!-- TAB 3: 科学解析 (Science) -->
        <div v-if="activeTab === 'science'" class="space-y-3 text-xs">
          <div class="p-3.5 rounded-2xl space-y-2 border"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-300 shadow-xs' : 'bg-zinc-950/80 border-zinc-800/80'">
            <div class="font-bold flex items-center gap-1.5"
                 :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400'">
              <span>🔬</span> 动作美学目的与科学细节
            </div>
            <p class="leading-relaxed text-xs font-medium"
               :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">
              {{ exercise?.scienceDetail || "注重动作规范与顶峰离心张力，避免代偿借力。" }}
            </p>
            <div v-if="exercise?.tags && exercise.tags.length" class="flex flex-wrap gap-1.5 pt-1">
              <span v-for="tag in exercise.tags" :key="tag" 
                    class="text-[10px] px-2.5 py-0.5 rounded-full border font-bold"
                    :class="store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-zinc-800 text-amber-300 border-zinc-700'">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- TAB 4: 历史记录 (History) -->
        <div v-if="activeTab === 'history'" class="space-y-2 text-xs">
          <div class="text-xs font-bold uppercase tracking-wider flex items-center justify-between pb-1"
               :class="store.settings.themeMode === 'light' ? 'text-slate-700 font-bold' : 'text-zinc-400'">
            <span>📈 个人历史打卡记录</span>
            <span class="text-[10px]" :class="store.settings.themeMode === 'light' ? 'text-slate-500 font-bold' : 'text-zinc-500'">最近 {{ exerciseHistory.length }} 次</span>
          </div>

          <div v-if="exerciseHistory.length" class="space-y-2">
            <div v-for="(hist, idx) in exerciseHistory" :key="idx"
                 class="p-3 border rounded-xl space-y-1"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-300 shadow-xs' : 'bg-zinc-950/70 border-zinc-800'">
              <div class="flex items-center justify-between font-mono"
                   :class="store.settings.themeMode === 'light' ? 'text-slate-700 font-semibold' : 'text-zinc-400'">
                <span :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-bold' : 'text-zinc-200 font-semibold'">{{ hist.date }}</span>
                <span>{{ hist.planName }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="(s, sIdx) in hist.sets" :key="sIdx"
                      class="px-2 py-0.5 border rounded-lg text-xs font-mono font-bold"
                      :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-300 text-emerald-800' : 'bg-zinc-900 border-zinc-700/80 text-emerald-400'">
                  {{ s.weight }}kg × {{ s.reps }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="p-8 text-center border border-dashed rounded-xl"
               :class="store.settings.themeMode === 'light' ? 'text-slate-500 border-slate-300' : 'text-zinc-500 border-zinc-800'">
            暂无历史打卡记录，完成该动作训练后将自动记录在此
          </div>
        </div>

        <!-- Bottom Spacing so content never gets covered by button -->
        <div class="h-6"></div>

      </div>

      <!-- Bottom Sticky CTA Button (Yellow / Amber prominent bar) -->
      <div class="p-3.5 border-t flex-shrink-0 safe-bottom-padding"
           :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800/80'">
        <button @click="handleActionStart" 
                class="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span>{{ store.activeWorkout ? '加入至当前训练' : '立即开练' }}</span>
        </button>
      </div>

    </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import { store, getExerciseDetails, addExerciseToActiveWorkout } from "../store/fitnessStore.js";
import { getMuscleDiagramSvg } from "../utils/muscleDiagrams.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { openAICoachWithContext } from "../ai/aiSession.js";

const props = defineProps({
  visible: Boolean,
  exercise: Object
});

const emit = defineEmits(["close", "selectSubstitute"]);
const scrollContainer = ref(null);

watch(() => props.visible, async (val) => {
  if (val) {
    lockBodyScroll();
    await nextTick();
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0;
    }
  } else {
    unlockBodyScroll();
  }
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const activeTab = ref("tips");
const gifError = ref(false);

const muscleSvg = computed(() => {
  return getMuscleDiagramSvg(props.exercise?.category || "胸部", props.exercise?.target || props.exercise?.name || "");
});

watch(() => props.exercise, async () => {
  gifError.value = false;
  activeTab.value = "tips";
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0;
  }
});

const exerciseHistory = computed(() => {
  if (!props.exercise?.name) return [];
  const history = [];
  const logs = [...store.workoutLogs].sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  
  for (const log of logs) {
    if (log.exercises) {
      const match = log.exercises.find(e => e.name === props.exercise.name || e.exerciseId === props.exercise.id);
      if (match && match.sets && match.sets.length > 0) {
        history.push({
          date: log.date,
          planName: log.shortName || log.planName,
          sets: match.sets.filter(s => s.completed)
        });
      }
    }
  }
  return history.slice(0, 5);
});

// 3D Biomechanics & Movement Plane Analysis
const movementPlaneInfo = computed(() => {
  const ex = props.exercise;
  if (!ex) return { name: "矢状面 (Sagittal)", badge: "矢状面", action: "前后屈伸主导" };
  const cat = ex.category || "";
  const name = ex.name || "";
  const target = ex.target || "";

  if (name.includes("夹胸") || name.includes("飞鸟") || name.includes("转体") || name.includes("蝴蝶") || target.includes("内收")) {
    return {
      name: "水平面 (Transverse Plane)",
      badge: "水平面 (Transverse)",
      action: "水平屈伸与内收"
    };
  }
  if (name.includes("侧平举") || name.includes("引体") || name.includes("下拉") || name.includes("外展") || name.includes("侧屈") || name.includes("推举") || target.includes("中束") || target.includes("背阔肌")) {
    return {
      name: "冠状面 (Coronal / Frontal Plane)",
      badge: "冠状面 (Coronal)",
      action: "冠状面外展与内收"
    };
  }
  return {
    name: "矢状面 (Sagittal Plane)",
    badge: "矢状面 (Sagittal)",
    action: "矢状面屈伸对齐"
  };
});

// Force Vector Alignment Cue
const forceVectorCue = computed(() => {
  const ex = props.exercise;
  if (!ex) return "肌纤维走向与阻力方向同轴，避免关节脱离力线受剪切力。";
  const cat = ex.category || "";
  const name = ex.name || "";

  if (cat === "胸部" || name.includes("推胸") || name.includes("卧推")) {
    return "【胸大肌力线同轴】前臂在全行程垂直于负重阻力垂线；推起时肘部与躯干呈 60°~75° 夹角，顺应胸肋束肌纤维排列走向，避免耸肩致使三角肌前束过度代偿。";
  }
  if (cat === "背部" || name.includes("拉背") || name.includes("划船") || name.includes("下拉")) {
    return "【背阔肌肌纤维力线】下拉时阻力线与大臂内收轨迹保持同轴；划船时手肘贴近躯干朝骨盆方向带动，离心过程保持肌张力拉伸，避免上斜方肌过早耸肩主导。";
  }
  if (cat === "肩部" || name.includes("侧平举") || name.includes("推肩")) {
    return "【肩胛冈力线对齐】侧平举时手臂沿肩胛骨平面（Scaption Plane，前斜 30°）抬起；顶峰时肘部微屈与肩平齐，避免手腕内旋引起肩峰下间隙撞击。";
  }
  if (cat === "腿部" || name.includes("深蹲") || name.includes("腿举") || name.includes("硬拉")) {
    return "【下肢动能链力线】负重重心垂线始终投射于足弓中点（Mid-foot）；膝关节屈伸轨迹与第 2~3 脚趾严格同轴，保持足底三点抓地，严防膝内扣与骨盆眨眼。";
  }
  if (cat === "手臂" || name.includes("弯举") || name.includes("臂屈伸")) {
    return "【肱二/三头肌力线孤立】大臂固定为力矩支点；手腕保持微扣中立，避免屈腕肌群抢走发力，向心阶段专注于目标肌群极限顶峰收缩。";
  }
  if (cat === "核心") {
    return "【核心抗伸展力线】盆底肌与腹横肌保持充气内收，骨盆处于微后倾中立位，避免腰椎过度超伸代偿。";
  }
  return "【生物力线同轴】负重阻力线与主动肌肌纤维收缩轨迹同轴对齐，全行程保持恒定肌张力。";
});

// Compensation Checklist
const compensationList = computed(() => {
  const ex = props.exercise;
  if (!ex) return ["耸肩代偿", "腰椎超伸", "手腕过度背屈", "惯性晃动"];
  const cat = ex.category || "";

  if (cat === "胸部") {
    return [
      "耸肩代偿 (斜方肌上束过度上提，胸大肌受力逃逸)",
      "手腕过度背屈折腕 (压迫正中神经并造成腕关节软骨剪切磨损)",
      "腰椎过度起桥超伸 (核心失稳导致下背竖脊肌异常受压)",
      "肘关节过度外展 (>90° 易引发肩袖肌腱与肩峰撞击)"
    ];
  }
  if (cat === "背部") {
    return [
      "耸肩代偿 (拉动前未先沉肩锁死，斜方肌上束借力)",
      "躯干过度后仰甩动 (惯性借力导致背阔肌离心张力骤降)",
      "过度扣腕用二头肌拉 (小臂充血酸胀但背阔肌零泵感)",
      "离心泄力过快 (放弃了增肌黄金离心超负荷刺激)"
    ];
  }
  if (cat === "肩部") {
    return [
      "斜方肌过度代偿耸肩 (颈部缩短紧绷，丢失三角肌孤立刺激)",
      "推举时腰椎超伸拱腰 (胸椎伸展不足导致腰部代偿借力)",
      "手腕内旋大拇指朝下 (导致冈上肌肌腱在肩峰下狭窄滑囊受卡压)",
      "手肘落于身体躯干后方 (造成肩关节囊前侧韧带被过度牵拉)"
    ];
  }
  if (cat === "腿部") {
    return [
      "膝内扣 (膝外翻代偿，增加前交叉韧带与半月板剪切力)",
      "骨盆过度后倾 / 屁股眨眼 (Butt Wink 导致腰椎瞬间失稳)",
      "脚跟离地重心前冲 (过度依赖髌韧带承受异常负荷)",
      "躯干过度折叠弯腰 (下背竖脊肌过度代偿股四头肌做工)"
    ];
  }
  if (cat === "手臂") {
    return [
      "大臂前后大幅甩动借力 (三角肌前束代偿肱二头肌弯举)",
      "手腕过度屈曲扣腕 (前臂内侧屈肌群过度抢力疲劳)",
      "耸肩下压借体重压 (斜方肌与胸小肌代偿肱三头肌伸肘)",
      "手肘过度向外翻张开 (肘关节副韧带承受异常扭转应力)"
    ];
  }
  return [
    "耸肩代偿：颈肩肌群紧张抢力",
    "腰椎与骨盆代偿失稳",
    "手腕未保持中立位",
    "末端动作惯性甩动借力"
  ];
});

// Direct 1-Click AI Coach Query Pills
const aiQueryPills = computed(() => {
  const pills = [
    "斜板角度多大最好？",
    "推胸手腕疼怎么调？",
    "怎样最大化孤立刺激？"
  ];
  const cat = props.exercise?.category;
  if (cat === "腿部") {
    pills[1] = "深蹲膝内扣怎么纠正？";
  } else if (cat === "背部") {
    pills[1] = "高位下拉找不到背部发力？";
  } else if (cat === "肩部") {
    pills[1] = "做侧平举脖子酸怎么调整？";
  } else if (cat === "手臂") {
    pills[1] = "弯举时手腕酸痛怎么解决？";
  }
  return pills;
});

function handleAskAICoach(prompt) {
  openAICoachWithContext({
    prompt,
    autoRun: true,
    exercise: props.exercise
  });
  emit("close");
}

function handleSelectSubstitute(subName) {
  const match = getExerciseDetails(subName) || { name: subName, category: props.exercise?.category || "训练", target: props.exercise?.target || "" };
  props.exercise.value = match;
  emit("selectSubstitute", match);
}

function handleActionStart() {
  if (store.activeWorkout) {
    addExerciseToActiveWorkout(props.exercise);
    alert(`已将【${props.exercise.name}】添加到本次训练！`);
    emit("close");
  } else {
    emit("close");
    store.activeTab = "today";
  }
}
</script>
