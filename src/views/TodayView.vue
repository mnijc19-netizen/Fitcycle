<template>
  <div class="pb-44 px-4 pt-2 max-w-md mx-auto space-y-4 relative">

    <!-- Floating Dopamine Overload / PR Toast Overlay -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="-translate-y-8 opacity-0 scale-90"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="-translate-y-4 opacity-0 scale-95"
    >
      <div v-if="overloadCelebration.visible" 
           class="fixed top-14 left-4 right-4 z-50 max-w-sm mx-auto pointer-events-none">
        <div class="p-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3"
             :class="[
               overloadCelebration.isPr 
                 ? 'bg-gradient-to-r from-amber-950/95 via-orange-950/95 to-amber-950/95 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.5)] text-amber-200' 
                 : 'bg-gradient-to-r from-emerald-950/95 to-teal-950/95 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-emerald-200'
             ]">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
               :class="overloadCelebration.isPr ? 'bg-amber-500/30 border border-amber-400' : 'bg-emerald-500/30 border border-emerald-400'">
            {{ overloadCelebration.isPr ? '🔥' : '⚡' }}
          </div>
          <div class="flex-1 min-w-0 text-left">
            <div class="text-xs font-black truncate"
                 :class="overloadCelebration.isPr ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'text-emerald-300'">
              {{ overloadCelebration.text }}
            </div>
            <div class="text-[11px] text-zinc-300 font-mono mt-0.5 truncate">
              {{ overloadCelebration.subText }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============================================== -->
    <!-- WORKOUT MODE TRANSITION (开练动效与视图切换)     -->
    <!-- ============================================== -->
    <Transition
      enter-active-class="transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="opacity-0 translate-y-3 scale-[0.99]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-[0.99]"
      mode="out-in"
    >
      <!-- MODE 1: ACTIVE WORKOUT IN PROGRESS (打卡记录模式) -->
      <div v-if="store.activeWorkout" key="live-workout-mode" class="space-y-4">
      
      <!-- Workout Live Header -->
      <div class="bg-zinc-900/90 border border-zinc-700/80 rounded-3xl p-4 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                :class="[
                  store.activeWorkout.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  store.activeWorkout.color === 'sky' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                  store.activeWorkout.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                ]">
            <span class="w-2 h-2 rounded-full bg-current animate-ping"></span>
            {{ store.activeWorkout.shortName || '训练中' }}
          </span>

          <div class="flex items-center gap-2">
            <button @click="showStrengthPlacementModal = true"
                    title="点击随时重测或切换力量水平（自适应开局组重）"
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 border transition-all active:scale-95 cursor-pointer shadow-2xs"
                    :class="store.settings.themeMode === 'light'
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'">
              <span>⚡ {{ currentStrengthConfig.name }}</span>
              <span class="text-[10px] opacity-70">▾</span>
            </button>
            <div class="flex items-center gap-1 font-mono text-sm font-bold text-zinc-300">
              <span>⏱️ {{ elapsedFormatted }}</span>
            </div>
          </div>
        </div>

        <h2 class="text-base font-black text-white mt-2 leading-snug">
          {{ store.activeWorkout.planName }}
        </h2>
        <p v-if="store.activeWorkout.coreTarget" class="text-xs text-zinc-400 mt-0.5">
          🎯 {{ store.activeWorkout.coreTarget }}
        </p>

        <!-- Progress bar -->
        <div class="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>完成进度: {{ completedSetsCount }}/{{ totalSetsCount }} 组</span>
          <span class="font-mono text-emerald-400 font-bold">总容量: {{ currentVolume }} kg</span>
        </div>
        <div class="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div class="bg-emerald-400 h-full rounded-full transition-all duration-300"
               :style="{ width: `${totalSetsCount > 0 ? (completedSetsCount / totalSetsCount) * 100 : 0}%` }">
          </div>
        </div>
      </div>

      <!-- Exercises In Workout -->
      <div class="space-y-3">
        <div v-for="(ex, exIdx) in store.activeWorkout.exercises" :key="ex.id || exIdx"
             class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg transition-all">
          
          <!-- Exercise Header -->
          <div class="p-3.5 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 flex-1 min-w-0">
              <!-- Exercise 3D Thumbnail -->
              <div @click="openExerciseDetail(ex)" class="flex-shrink-0 cursor-pointer active:scale-95">
                <ExerciseImage :src="getExerciseGif(ex.name)" 
                               :name="ex.name" 
                               :category="ex.category" 
                               :target="ex.targetReps" 
                               customClass="w-12 h-12 rounded-xl border border-zinc-800" />
              </div>


              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h3 class="font-bold text-sm text-zinc-100 truncate cursor-pointer hover:text-amber-400" @click="openExerciseDetail(ex)">{{ ex.name }}</h3>
                  <span v-if="!getLastExercisePerformance(ex.name)" 
                        class="px-1.5 py-0.5 rounded text-[11px] font-bold border"
                        :class="store.settings.themeMode === 'light' 
                          ? 'bg-sky-50 text-sky-700 border-sky-200' 
                          : 'bg-sky-500/15 text-sky-400 border-sky-500/30'">
                    🌱 首次训练
                  </span>
                </div>
                <div class="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                  <span class="text-amber-400/90 font-medium">建议: {{ ex.targetReps }}</span>
                  <span v-if="getLastExercisePerformance(ex.name)" class="text-zinc-500 font-mono">
                    上次: {{ formatLastPerf(ex.name) }}
                  </span>
                </div>
              </div>
            </div>


            <!-- Action buttons: Pin, Reorder, Guide, Swap, Machine Finder, Delete -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <button @click="pinActiveWorkoutExercise(exIdx)" 
                      title="置顶动作"
                      class="p-1.5 bg-zinc-800 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer">
                📌
              </button>
              <button v-if="exIdx > 0" 
                      @click="moveActiveWorkoutExercise(exIdx, exIdx - 1)" 
                      title="上移"
                      class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer">
                ↑
              </button>
              <button v-if="exIdx < store.activeWorkout.exercises.length - 1" 
                      @click="moveActiveWorkoutExercise(exIdx, exIdx + 1)" 
                      title="下移"
                      class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer">
                ↓
              </button>
              <button @click="openExerciseDetail(ex)" 
                      title="查看动作要领与演示"
                      class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer">
                📖
              </button>
              <button @click="openSwapModal(exIdx)" 
                      title="替换动作"
                      class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-all active:scale-95 cursor-pointer">
                🔄
              </button>
              <button @click="openMachineFinder(exIdx)" 
                      title="器械拍照/语音识别替换"
                      class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer">
                📸
              </button>
              <button @click="removeExercise(exIdx)" 
                      title="移除动作"
                      class="p-1.5 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 rounded-lg text-xs transition-all active:scale-95 cursor-pointer">
                ✕
              </button>
            </div>
          </div>

          <!-- Science Detail Accordion (if user toggles or wants quick glance) -->
          <div v-if="ex.scienceDetail && ex.showDetails" class="px-3.5 py-2.5 bg-zinc-950/60 border-b border-zinc-800 text-xs text-zinc-300 leading-relaxed">
            <span class="text-amber-400 font-bold mr-1">发力要点:</span>{{ ex.scienceDetail }}
          </div>

          <!-- Sets Table (Clean, Apple/Hevy-Grade Ergonomic Layout) -->
          <div class="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            <!-- Table Header -->
            <div class="grid grid-cols-12 gap-1 sm:gap-1.5 text-[11px] font-bold px-1.5 sm:px-2 py-0.5 text-center select-none"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-500'">
              <span class="col-span-2 text-left">组号</span>
              <span class="col-span-4">重量 (kg)</span>
              <span class="col-span-4">次数</span>
              <span class="col-span-2">完成</span>
            </div>

            <!-- Set Rows -->
            <div v-for="(s, sIdx) in ex.sets" :key="s.id || sIdx" class="space-y-1">
              <div class="grid grid-cols-12 gap-1 sm:gap-1.5 items-center px-1.5 sm:px-2 py-1.5 rounded-xl transition-all relative overflow-hidden"
                   :class="[
                     s.completed 
                       ? (store.settings.themeMode === 'light' ? 'bg-emerald-50 border border-emerald-300/80 shadow-xs' : 'bg-emerald-950/25 border border-emerald-500/30 shadow-xs shadow-emerald-500/10')
                       : (store.settings.themeMode === 'light' ? 'bg-slate-50/80 border border-slate-200/80' : 'bg-zinc-900/50 border border-zinc-800/60')
                   ]">
                
                <!-- Set Index & Delete Button -->
                <div class="col-span-2 flex items-center gap-1 min-w-0">
                  <span class="w-5 sm:w-6 h-5 sm:h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-colors flex-shrink-0"
                        :class="s.completed 
                          ? (store.settings.themeMode === 'light' ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-500/20 text-emerald-300')
                          : (store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300')">
                    {{ sIdx + 1 }}
                  </span>
                  <button v-if="ex.sets.length > 1 && !s.completed" 
                          @click="removeSet(exIdx, sIdx)" 
                          title="删除此组"
                          class="w-4 h-4 rounded flex items-center justify-center text-[10px] text-zinc-400 hover:text-red-500 hover:bg-red-500/10 active:scale-90 transition-all cursor-pointer flex-shrink-0">
                    ✕
                  </button>
                </div>

                <!-- Sleek Streamlined Weight Pill with Integrated Micro-Steppers -->
                <div class="col-span-4 h-8.5 rounded-xl border flex items-center overflow-hidden transition-colors"
                     :class="store.settings.themeMode === 'light' 
                       ? 'bg-white border-slate-200 shadow-2xs focus-within:border-amber-500' 
                       : 'bg-zinc-950/90 border-zinc-800/90 shadow-inner focus-within:border-amber-500/80'">
                  <button @click="adjustSetWeight(exIdx, sIdx, -2.5)" 
                          type="button"
                          title="-2.5kg"
                          class="w-5.5 sm:w-6 h-full flex items-center justify-center text-xs font-black active:scale-90 transition-transform cursor-pointer select-none flex-shrink-0"
                          :class="store.settings.themeMode === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-400 hover:text-white'">
                    −
                  </button>
                  <input v-model.number="s.weight" 
                         @input="onWeightChange(exIdx, sIdx)"
                         @focus="$event.target.select()"
                         type="number" step="0.5" inputmode="decimal"
                         class="min-w-[36px] w-full h-full bg-transparent text-center text-xs sm:text-sm font-mono font-black focus:outline-none transition-colors"
                         :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'" />
                  <button @click="adjustSetWeight(exIdx, sIdx, 2.5)" 
                          type="button"
                          title="+2.5kg"
                          class="w-5.5 sm:w-6 h-full flex items-center justify-center text-xs font-black active:scale-90 transition-transform cursor-pointer select-none flex-shrink-0"
                          :class="store.settings.themeMode === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-400 hover:text-white'">
                    +
                  </button>
                </div>

                <!-- Sleek Streamlined Reps Pill with Integrated Micro-Steppers -->
                <div class="col-span-4 h-8.5 rounded-xl border flex items-center overflow-hidden transition-colors"
                     :class="store.settings.themeMode === 'light' 
                       ? 'bg-white border-slate-200 shadow-2xs focus-within:border-amber-500' 
                       : 'bg-zinc-950/90 border-zinc-800/90 shadow-inner focus-within:border-amber-500/80'">
                  <button @click="adjustSetReps(exIdx, sIdx, -1)" 
                          type="button"
                          title="-1次"
                          class="w-5.5 sm:w-6 h-full flex items-center justify-center text-xs font-black active:scale-90 transition-transform cursor-pointer select-none flex-shrink-0"
                          :class="store.settings.themeMode === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-400 hover:text-white'">
                    −
                  </button>
                  <input v-model.number="s.reps" 
                         @input="onRepsChange(exIdx, sIdx)"
                         @focus="$event.target.select()"
                         type="number" step="1" inputmode="numeric"
                         class="min-w-[36px] w-full h-full bg-transparent text-center text-xs sm:text-sm font-mono font-black focus:outline-none transition-colors"
                         :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'" />
                  <button @click="adjustSetReps(exIdx, sIdx, 1)" 
                          type="button"
                          title="+1次"
                          class="w-5.5 sm:w-6 h-full flex items-center justify-center text-xs font-black active:scale-90 transition-transform cursor-pointer select-none flex-shrink-0"
                          :class="store.settings.themeMode === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-400 hover:text-white'">
                    +
                  </button>
                </div>

                <!-- Sleek Checkbox Completion Button -->
                <div class="col-span-2 flex justify-center">
                  <button @click="toggleSet(exIdx, sIdx)"
                          class="w-7.5 sm:w-8 h-7.5 sm:h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 relative cursor-pointer"
                          :class="[
                            s.completed 
                              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30' 
                              : (store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-400 border border-slate-300/80' : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-500 border border-zinc-700/80')
                          ]">
                    <svg class="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                </div>

              </div>

              <!-- Micro Overload Dopamine Delta Badge Bar -->
              <div v-if="getSetOverloadDelta(ex.name, s, sIdx)" 
                   class="flex items-center justify-between px-2.5 text-[11px] font-mono leading-none pb-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <span :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-bold' : 'text-zinc-500'">{{ getSetOverloadDelta(ex.name, s, sIdx).prevText }}</span>
                
                <!-- Weight PR Badge -->
                <span v-if="getSetOverloadDelta(ex.name, s, sIdx).type === 'weight_pr'"
                      class="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-amber-500/20 border border-amber-500/70 text-amber-300 font-black shadow-[0_0_10px_rgba(245,158,11,0.5)] flex items-center gap-1 animate-pulse">
                  <span>🔥</span>
                  <span>{{ getSetOverloadDelta(ex.name, s, sIdx).label }}</span>
                </span>

                <!-- Reps Overload Badge -->
                <span v-else-if="getSetOverloadDelta(ex.name, s, sIdx).type === 'reps_pr'"
                      class="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/70 text-emerald-300 font-black shadow-[0_0_8px_rgba(16,185,129,0.4)] flex items-center gap-1">
                  <span>⚡</span>
                  <span>{{ getSetOverloadDelta(ex.name, s, sIdx).label }}</span>
                </span>
              </div>
            </div>

            <!-- Add set button -->
            <button @click="addSet(exIdx)" 
                    class="w-full py-2 border border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'">
              <span>➕</span> 添加一组
            </button>
          </div>

        </div>
      </div>

      <!-- Quick Recommended Add-ons for Active Workout (新手简易加动作) -->
      <div v-if="activeWorkoutRecommendedAddons.length > 0" class="p-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl space-y-2">
        <div class="flex items-center justify-between px-0.5">
          <span class="text-xs font-bold flex items-center gap-1.5"
                :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-bold' : 'text-zinc-200'">
            <span class="text-amber-400">💡</span>
            <span>新手简易加练 (点击一秒加入)</span>
          </span>
          <span class="text-[11px] text-zinc-500 font-mono">科学配比 · 3组</span>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
          <button v-for="addon in activeWorkoutRecommendedAddons" :key="addon.exerciseId"
                  @click="quickAddRecommendedExercise(addon)"
                  class="px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold flex-shrink-0 transition-all active:scale-95 cursor-pointer"
                  :class="store.settings.themeMode === 'light'
                    ? 'bg-white hover:bg-amber-50 border-amber-600/30 text-slate-800 hover:text-amber-800 shadow-xs'
                    : 'bg-zinc-950/90 hover:bg-zinc-800 border-zinc-800 hover:border-amber-500/50 text-zinc-200 hover:text-amber-400'">
            <ExerciseImage :src="getExerciseGif(addon.name)" 
                           :name="addon.name" 
                           :category="addon.category" 
                           customClass="w-6 h-6 rounded-lg border border-zinc-700/60" />
            <div class="text-left">
              <div class="leading-tight truncate max-w-[110px]">{{ addon.name }}</div>
              <div class="text-[11px] font-normal text-amber-500/90 font-mono">{{ addon.tag || addon.targetReps }}</div>
            </div>
            <span class="text-amber-500 font-bold text-sm ml-0.5">+</span>
          </button>
        </div>
      </div>

      <!-- Add Extra Exercise & Machine Finder Quick Entry -->
      <div class="grid grid-cols-2 gap-2">
        <button @click="showAddExerciseModal = true" 
                class="py-3 px-2 border rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
                :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80'">
          <span>➕</span> 临时添加动作
        </button>
        <button @click="openMachineFinder(-1)" 
                class="py-3 px-2 border rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer border-amber-500/40"
                :class="store.settings.themeMode === 'light' ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300' : 'bg-zinc-900 hover:bg-zinc-850 text-amber-400 border-zinc-700/80'">
          <span>📸</span> 拍照/语音识器械
        </button>
      </div>

      <!-- Bottom Sticky Finish / Discard Bar -->
      <div class="sticky bottom-20 z-20 backdrop-blur-md p-2 rounded-2xl border flex items-center gap-2"
           :class="store.settings.themeMode === 'light' ? 'bg-white/95 border-slate-300 shadow-xl' : 'bg-zinc-950/90 border-zinc-800/80'">
        <button @click="confirmDiscard" 
                class="w-1/3 py-3 border rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
                :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border-slate-300' : 'bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border-zinc-800'">
          放弃训练
        </button>
        <button @click="handleFinishWorkout" 
                class="w-2/3 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-1.5">
          <span>🏆</span> 完成并保存训练 ({{ completedSetsCount }}组)
        </button>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- MODE 2: UNIFIED TODAY COCKPIT (合一今日特训驾驶舱) -->
    <!-- ============================================== -->
    <div v-else key="cockpit-mode" class="space-y-3.5">
      
      <!-- Apple Fitness Hero Card -->
      <div class="rounded-3xl border p-5 shadow-2xl relative overflow-hidden transition-all"
           :class="todayHeroCardClasses">
        
        <!-- Ambient Top Glow -->
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
             :class="[
               honorData.isDeloadActive ? 'bg-sky-400' :
               todayCycle.isRest ? 'bg-emerald-400' :
               store.settings.uiSkin === 'cs' ? 'bg-orange-500' :
               store.settings.uiSkin === 'chamber' ? 'bg-[#E5C378]' : 'bg-amber-400'
             ]"></div>

        <!-- 1. Header Row: Date & Plan Target Badge -->
        <div class="flex items-center justify-between gap-2 relative z-10">
          <div class="flex items-center gap-2 min-w-0">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide"
                  :class="[
                    todayCycle.isRest ? 'bg-emerald-500 text-zinc-950' :
                    todayCycle.color === 'amber' ? 'bg-amber-500 text-zinc-950' :
                    todayCycle.color === 'sky' ? 'bg-sky-500 text-zinc-950' :
                    todayCycle.color === 'purple' ? 'bg-purple-500 text-white' :
                    'bg-amber-500 text-zinc-950'
                  ]">
              {{ todayCycle.name }}
            </span>
            <span class="text-xs font-mono" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">{{ todayFormatted }}</span>
          </div>

          <button @click="openCycleEditor" 
                  class="text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'text-amber-700 hover:text-amber-800' : 'text-amber-400 hover:text-amber-300'">
            <span>{{ store.activeCycle.name.split(' ')[0] }}</span>
            <span class="text-[11px]">❯</span>
          </button>
        </div>

        <!-- 2. Hero Title & Specs -->
        <div class="mt-3 mb-4 relative z-10">
          <h1 class="text-2xl font-black tracking-tight leading-tight"
              :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
            {{ currentPlan?.name || todayCycle.name }}
          </h1>
          
          <div v-if="!todayCycle.isRest && currentPlan?.exercises?.length" 
               class="flex items-center flex-wrap gap-2 mt-2 text-xs font-mono text-zinc-400">
            <span class="font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-200'">{{ currentPlan.exercises.length }} 动作</span>
            <span class="text-zinc-600">·</span>
            <span class="font-bold" :class="store.settings.themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400'">{{ todayTotalSets }} 组做工</span>
            <span class="text-zinc-600">·</span>
            <button @click="showStrengthPlacementModal = true"
                    title="点击随时重测或切换力量水平"
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold font-sans flex items-center gap-1 border transition-all active:scale-95 cursor-pointer shadow-2xs"
                    :class="store.settings.themeMode === 'light'
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'">
              <span>⚡ 力量: {{ currentStrengthConfig.name }}</span>
              <span class="text-[10px] opacity-70">▾</span>
            </button>
          </div>
          <div v-else class="text-xs mt-1" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
            充分享受休息，促进肌肉超量恢复与中枢神经修复
          </div>
        </div>

        <!-- 3. Primary CTA Capsule Button -->
        <div class="space-y-2 relative z-10">
          <button v-if="!todayCycle.isRest" 
                  @click="handleStartTodayWorkout"
                  class="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer select-none">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>立即开练</span>
          </button>

          <button v-else 
                  @click="markRestDayCompleted"
                  class="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>打卡今日休整</span>
          </button>

          <div class="flex items-center justify-center gap-3 pt-1 text-xs flex-wrap" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-bold' : 'text-zinc-400'">
            <button @click="showPlanPicker = true" class="hover:text-amber-600 transition-colors cursor-pointer">
              切换计划
            </button>
            <span :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-700'">|</span>
            <button @click="startEmptyWorkout" class="hover:text-amber-600 transition-colors cursor-pointer">
              自由空白训练
            </button>
            <span :class="store.settings.themeMode === 'light' ? 'text-slate-400' : 'text-zinc-700'">|</span>
            <button @click="openMachineFinder(-1)" class="hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1 text-amber-500 font-bold">
              <span>📸</span> 器械识别
            </button>
          </div>
        </div>

      </div>

      <!-- Friendly Strength Calibration Welcome Card (针对新用户/老铁的30秒定级通道) -->
      <div v-if="!store.settings.hasConfiguredStrength"
           class="p-3.5 rounded-2xl border flex items-center justify-between gap-2.5 shadow-md animate-in fade-in duration-300"
           :class="store.settings.themeMode === 'light' ? 'bg-amber-50/90 border-amber-300/80 text-amber-950' : 'bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border-amber-500/40 text-white'">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-black flex-shrink-0">
            ⚡
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-black">
              设定力量水平（新手/中坚/老手）
            </h4>
            <p class="text-[11px] mt-0.5 leading-snug" :class="store.settings.themeMode === 'light' ? 'text-amber-900/80' : 'text-zinc-400'">
              自适应推拉腿起步组重，老铁无需从空杆逐组重填
            </p>
          </div>
        </div>
        <button @click="showStrengthPlacementModal = true"
                class="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-black rounded-xl text-[11px] flex-shrink-0 shadow-sm cursor-pointer transition-all">
          30秒定级
        </button>
      </div>

      <!-- Tactical Readiness & Recovery Card -->
      <div class="p-3.5 rounded-2xl border text-xs space-y-2 shadow-md transition-colors"
           :class="store.settings.themeMode === 'light' ? 'bg-white/95 border-slate-200/90 shadow-sm' : 'bg-zinc-900/90 border-zinc-800'">
        <!-- Deload Shield Active Banner -->
        <div v-if="honorData.isDeloadActive" class="space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
              <span>🛡️</span> 战术免战休整期
            </span>
            <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">战力已冻结 (剩 {{ honorData.shieldDaysRemaining }} 天)</span>
            <button @click="toggleDeloadShield(false)" 
                    class="px-2 py-0.5 bg-sky-900/80 hover:bg-sky-800 text-sky-200 text-[11px] font-bold rounded-lg border border-sky-600/40 cursor-pointer">
              提前归队
            </button>
          </div>
          <p class="text-[11px] leading-snug" :class="store.settings.themeMode === 'light' ? 'text-sky-800 font-medium' : 'text-sky-200/80'">
            处于周期化减载期，战力怠惰衰减强制冻结（0扣分），中枢神经超量修复中。
          </p>
        </div>

        <!-- Normal Readiness State -->
        <div v-else class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full"
                    :class="[
                      timeSinceLastWorkout.urgencyLevel === 'danger' ? 'bg-red-500 animate-pulse' :
                      timeSinceLastWorkout.urgencyLevel === 'warn' ? 'bg-amber-400' : 'bg-emerald-400'
                    ]"></span>
              <span class="font-bold text-xs tracking-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">{{ timeSinceLastWorkout.title }}</span>
            </div>
            <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border"
                  :class="[
                    timeSinceLastWorkout.urgencyLevel === 'danger' ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                    timeSinceLastWorkout.urgencyLevel === 'warn' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                    'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  ]">
              {{ timeSinceLastWorkout.badge }}
            </span>
          </div>

          <!-- Dual Telemetry Pods (Ergonomic, High-Glanceability, Zero-Truncation) -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <!-- Pod 1: 怠惰计时 / 训练间隔 -->
            <div class="p-2.5 rounded-xl border flex flex-col justify-between gap-1 transition-all"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-100/90 border-slate-200/90 shadow-xs' : 'bg-zinc-950/70 border-zinc-800/80'">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-mono font-medium" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">怠惰计时</span>
                <span class="text-[11px] font-mono px-1 rounded" :class="store.settings.themeMode === 'light' ? 'bg-slate-200/80 text-slate-700' : 'bg-zinc-900 text-zinc-400'">时钟</span>
              </div>
              <div class="text-sm font-black font-mono tracking-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
                {{ timeSinceLastWorkout.timeStr || '刚刚' }}
              </div>
              <div class="text-[11px] font-medium leading-none"
                   :class="[
                     timeSinceLastWorkout.urgencyLevel === 'danger' ? 'text-red-400' :
                     timeSinceLastWorkout.urgencyLevel === 'warn' ? 'text-amber-400' :
                     (store.settings.themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400')
                   ]">
                {{ timeSinceLastWorkout.statusLabel }}
              </div>
            </div>

            <!-- Pod 2: 肌群状态 / 专项恢复 -->
            <div class="p-2.5 rounded-xl border flex flex-col justify-between gap-1 transition-all"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-100/90 border-slate-200/90 shadow-xs' : 'bg-zinc-950/70 border-zinc-800/80'">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-mono font-medium" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">肌群状态</span>
                <span class="text-[11px] font-mono px-1 rounded" :class="store.settings.themeMode === 'light' ? 'bg-slate-200/80 text-slate-700' : 'bg-zinc-900 text-zinc-400'">恢复</span>
              </div>
              <div class="text-sm font-black font-mono tracking-tight text-amber-500">
                {{ splitRecoveryInfo.status }}
              </div>
              <div class="text-[11px] font-medium leading-none" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                {{ splitRecoveryInfo.timeLabel }}
              </div>
            </div>
          </div>

          <!-- Full Scientific Telemetry Insight (Breathable, 100% Un-truncated) -->
          <div class="p-2 rounded-xl border flex items-start gap-1.5 text-[11px] leading-relaxed transition-all"
               :class="store.settings.themeMode === 'light'
                 ? 'bg-amber-50/70 border-amber-200/80 text-amber-950' 
                 : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-300'">
            <span class="text-amber-500 font-black text-xs leading-tight flex-shrink-0">✦</span>
            <p class="font-normal break-words leading-tight flex-1">
              {{ timeSinceLastWorkout.insight }}
            </p>
          </div>
        </div>

        <!-- Honor Rank & Body Metrics Launchers -->
        <div class="pt-1.5 border-t flex items-center justify-between gap-2"
             :class="store.settings.themeMode === 'light' ? 'border-slate-200/80' : 'border-zinc-800/80'">
          <button @click="showHonorModal = true" 
                  class="flex-1 py-1.5 px-2.5 rounded-xl border text-[11px] font-mono flex items-center justify-between transition-all cursor-pointer"
                  :class="store.settings.themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 border-amber-600/40 text-amber-800 font-bold shadow-xs'
                    : 'bg-zinc-950 hover:bg-zinc-800 border-amber-500/30 text-amber-400'">
            <span class="flex items-center gap-1.5">
              <img v-if="honorData.presentation.tierSvg" :src="honorData.presentation.tierSvg" alt="Tier" class="w-3.5 h-3.5 object-contain" />
              <span v-else>{{ honorData.presentation.tierIcon }}</span>
              <span class="font-bold font-sans" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">{{ honorData.presentation.tierName.split('·')[0] }}</span>
            </span>
            <span class="font-bold" :class="store.settings.themeMode === 'light' ? 'text-amber-800' : 'text-amber-400'">{{ honorData.score }} PTS ❯</span>
          </button>

          <button @click="showBodyModal = true"
                  class="py-1.5 px-3 rounded-xl border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                  :class="store.settings.themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 font-bold shadow-xs'
                    : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300'">
            <span>形体围度</span>
            <span class="text-[11px]" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-bold' : 'text-zinc-500'">❯</span>
          </button>
        </div>
      </div>

      <!-- Modern Segmented Cycle Stepper (Dynamic Flex Container) -->
      <div class="p-1 rounded-2xl border transition-colors"
           :class="store.settings.themeMode === 'light' ? 'bg-slate-200/70 border-slate-300/80 shadow-xs' : 'bg-zinc-900/90 border-zinc-800'">
        <div class="flex flex-wrap gap-1">
          <button v-for="(day, idx) in store.activeCycle.days" :key="idx"
                  @click="setTodayAsIndex(idx)"
                  class="flex-1 min-w-[62px] py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer"
                  :class="[
                    todayCycle.cycleIndex === idx ? 
                    'bg-amber-500 text-zinc-950 font-black shadow-sm' : 
                    (store.settings.themeMode === 'light' ? 'bg-slate-100/90 hover:bg-slate-200 text-slate-800 border border-slate-300/80 font-bold shadow-xs' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60')
                  ]">
            <div class="text-[11px] font-mono leading-none" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-bold' : 'opacity-80'">Day {{ idx + 1 }}</div>
            <div class="text-xs font-black mt-0.5 leading-tight truncate">
              {{ day.shortName || (day.isRest ? '休' : '练') }}
            </div>
          </button>
        </div>
      </div>

      <!-- 0~72h Rest-Day Recovery Card Celebrating Physiological Nourishment (0 decay penalty) -->
      <div v-if="todayCycle.isRest" 
           class="p-4 rounded-3xl border text-xs space-y-3 shadow-lg transition-all"
           :class="store.settings.themeMode === 'light' ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 border-emerald-500/40 text-emerald-100'">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-black flex-shrink-0">
              ⚡
            </div>
            <div>
              <div class="text-xs font-black" :class="store.settings.themeMode === 'light' ? 'text-emerald-950 font-black' : 'text-emerald-300'">
                生理超量恢复黄金滋养期
              </div>
              <div class="text-[11px] font-mono text-emerald-500">
                0~72h 宪法免责保护 · 0 怠惰扣分
              </div>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            {{ todayRestSupercomp.stage }}
          </span>
        </div>

        <p class="text-xs leading-relaxed break-words" :class="store.settings.themeMode === 'light' ? 'text-emerald-900 font-medium' : 'text-zinc-300'">
          {{ todayRestSupercomp.advice }}
        </p>

        <!-- Supercompensation Progress bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[11px] font-mono" :class="store.settings.themeMode === 'light' ? 'text-emerald-800' : 'text-emerald-400/80'">
            <span>{{ todayRestSupercomp.timerText }}</span>
            <span>{{ todayRestSupercomp.progressPercent }}%</span>
          </div>
          <div class="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                 :style="{ width: `${todayRestSupercomp.progressPercent}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Today's Exercise Inset-Grouped List -->
      <div v-if="!todayCycle.isRest && currentPlan?.exercises?.length" class="space-y-2 pt-1">
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-bold' : 'text-zinc-400'">
            <span class="w-1.5 h-1.5 rounded-full" :class="store.settings.themeMode === 'light' ? 'bg-amber-600' : 'bg-amber-400'"></span>
            <span>今日动作清单 ({{ currentPlan.exercises.length }})</span>
          </span>
          <span class="text-[11px]" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-500'">点击查看 3D 轨迹</span>
        </div>

        <div class="bg-zinc-900/80 border border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-800/70 shadow-lg">
          <div v-for="(ex, idx) in currentPlan.exercises" :key="idx"
               @click="openExerciseDetailByName(ex.name)"
               class="p-3 hover:bg-zinc-800/60 active:bg-zinc-800 flex items-center justify-between cursor-pointer transition-colors gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <ExerciseImage :src="getExerciseGif(ex.name)" 
                             :name="ex.name" 
                             :category="ex.category" 
                             :target="ex.targetReps" 
                             customClass="w-11 h-11 rounded-xl border border-zinc-800 flex-shrink-0" />
              <div class="min-w-0">
                <div class="font-bold text-xs truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">{{ ex.name }}</div>
                <div class="text-[11px] mt-0.5 flex items-center gap-2" :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-400'">
                  <span class="font-mono font-bold" :class="store.settings.themeMode === 'light' ? 'text-amber-800' : 'text-amber-400'">{{ ex.setsCount }}组 × {{ ex.targetReps }}</span>
                  <span v-if="getLastExercisePerformance(ex.name)" class="font-mono text-[11px]" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-500'">
                    前次: {{ formatLastPerf(ex.name) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="text-xs" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-500'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Beginner Quick-Add Golden Addons for Today's Plan (新手简易加动作) -->
      <div v-if="!todayCycle.isRest && todayRecommendedAddons.length > 0" class="space-y-2 pt-1">
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-bold' : 'text-zinc-400'">
            <span class="text-amber-400">💡</span>
            <span>新手简易加动作 (点击一秒加入今日计划)</span>
          </span>
          <span class="text-[11px] text-zinc-500 font-mono">科学配比 · 3组</span>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
          <button v-for="addon in todayRecommendedAddons" :key="addon.exerciseId"
                  @click="quickAddAddonToPlan(addon)"
                  class="px-3.5 py-2.5 rounded-2xl border flex items-center gap-2.5 text-xs font-bold flex-shrink-0 transition-all active:scale-95 cursor-pointer"
                  :class="store.settings.themeMode === 'light'
                    ? 'bg-white hover:bg-amber-50 border-amber-600/30 text-slate-800 hover:text-amber-800 shadow-xs'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 hover:border-amber-500/50 text-zinc-200 hover:text-amber-400'">
            <ExerciseImage :src="getExerciseGif(addon.name)" 
                           :name="addon.name" 
                           :category="addon.category" 
                           customClass="w-8 h-8 rounded-xl border border-zinc-800" />
            <div class="text-left">
              <div class="leading-tight">{{ addon.name }}</div>
              <div class="text-[11px] font-normal text-amber-500/90 font-mono mt-0.5">{{ addon.tag || addon.targetReps }}</div>
            </div>
            <span class="text-amber-500 font-black text-base ml-1">+</span>
          </button>
        </div>
      </div>

      <!-- Recent History Minimalist Inset List -->
      <div v-if="recentLogs.length" class="space-y-2 pt-1">
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold uppercase tracking-wider" :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-bold' : 'text-zinc-400'">最近打卡记录</span>
          <button @click="store.activeTab = 'calendar'" class="text-xs font-bold transition-colors cursor-pointer" :class="store.settings.themeMode === 'light' ? 'text-amber-800 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'">全部日历 ❯</button>
        </div>

        <div class="bg-zinc-900/80 border border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-800/70 shadow-lg">
          <div v-for="log in recentLogs" :key="log.id"
               class="p-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
                    :class="[
                      log.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      log.color === 'sky' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' :
                      log.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    ]">
                {{ log.shortName || '练' }}
              </span>
              <div>
                <div class="text-xs font-bold text-zinc-200">{{ log.planName }}</div>
                <div class="text-[11px] text-zinc-400 font-mono mt-0.5">
                  {{ log.date }} · {{ Math.round((log.durationSeconds || 60) / 60) }}分钟 · {{ log.totalSets }}组
                </div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono font-bold text-emerald-400">{{ log.totalVolume }} kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

    <!-- Modals -->
    <!-- Gym Machine Multimodal Finder Modal -->
    <GymMachineFinderModal
      :visible="showMachineFinder"
      :replace-index="machineFinderReplaceIndex"
      @close="showMachineFinder = false"
      @select="handleMachineFinderSelect"
      @view-detail="openExerciseDetail"
    />

    <!-- 1. Exercise Picker for adding to active workout -->
    <ExercisePickerModal 
      :visible="showAddExerciseModal" 
      title="添加动作到当前训练" 
      actionLabel="添加"
      @close="showAddExerciseModal = false" 
      @select="handleAddExerciseSelected" 
    />

    <!-- 2. Exercise Picker for swapping exercise -->
    <ExercisePickerModal 
      :visible="showSwapModal" 
      title="替换当前动作" 
      actionLabel="替换"
      @close="showSwapModal = false" 
      @select="handleSwapExerciseSelected" 
    />

    <!-- 3. Exercise Detail Modal -->
    <ExerciseDetailModal 
      :visible="showExerciseDetailModal" 
      :exercise="selectedExerciseDetail" 
      @close="showExerciseDetailModal = false" 
    />

    <!-- 4. Cycle Editor Modal -->
    <CycleEditorModal 
      :visible="showCycleEditorModal" 
      @close="showCycleEditorModal = false" 
    />

    <!-- 5. Choose Other Plan Modal -->
    <!-- 5. Choose Other Plan Modal -->
    <Teleport to="body">
      <div v-if="showPlanPicker" 
           class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200"
           style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
        <!-- Backdrop dismiss -->
        <div class="absolute inset-0" @click="showPlanPicker = false"></div>

        <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 space-y-3.5 animate-in slide-in-from-bottom duration-200 shadow-2xl">
          <!-- Top ergonomic grabber pill -->
          <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto -mt-1 mb-2 flex-shrink-0"></div>

          <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 class="text-sm font-black flex items-center gap-1.5" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
              <span>选择训练计划</span>
            </h3>
            <button @click="showPlanPicker = false" class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer" :class="store.settings.themeMode === 'light' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'">✕</button>
          </div>
          <div class="space-y-2 max-h-80 overflow-y-auto overscroll-contain no-scrollbar" style="-webkit-overflow-scrolling: touch; touch-action: pan-y;">
            <div v-for="p in store.plans" :key="p.id"
                 @click="startCustomPlan(p.id)"
                 class="p-3 border rounded-2xl cursor-pointer flex items-center justify-between transition-all gap-3 shadow-sm"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-100/90 hover:bg-slate-200 border-slate-300 text-slate-900' : 'bg-zinc-950/80 hover:bg-zinc-850 active:bg-zinc-800 border-zinc-800/80 hover:border-amber-500/40 text-zinc-100'">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      :class="[
                        p.color === 'amber' ? 'bg-amber-400 shadow-sm shadow-amber-400/50' :
                        p.color === 'sky' ? 'bg-sky-400 shadow-sm shadow-sky-400/50' :
                        p.color === 'purple' ? 'bg-purple-400 shadow-sm shadow-purple-400/50' :
                        'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                      ]"></span>
                <div class="min-w-0">
                  <div class="text-xs font-bold truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">{{ p.name }}</div>
                  <div class="text-[11px] mt-0.5 line-clamp-1" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-400'">{{ p.coreTarget }}</div>
                </div>
              </div>
              <button v-if="!p.isRest" 
                      class="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>开练</span>
              </button>
              <button v-else 
                      class="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
                <svg class="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <span>休整</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 6. Summary modal -->
    <WorkoutSummaryModal 
      :visible="showSummaryModal" 
      :summary="latestSummary" 
      @close="showSummaryModal = false" 
    />

    <!-- Honor & Rank Showcase Modal -->
    <HonorShowcaseModal
      :visible="showHonorModal"
      @close="showHonorModal = false"
      @open-rules="showHonorModal = false; showRulesModal = true"
    />

    <!-- Rules Codex Modal -->
    <RulesCodexModal
      :visible="showRulesModal"
      @close="showRulesModal = false"
    />

    <!-- Body Circumference & Transformation Modal -->
    <BodyMetricsModal
      :visible="showBodyModal"
      @close="showBodyModal = false"
    />

    <!-- Strength Placement & Level Calibration Modal -->
    <StrengthPlacementModal
      :visible="showStrengthPlacementModal"
      @close="showStrengthPlacementModal = false"
    />

    <!-- 7. Auto Workout Finish Celebration Modal (智能防漏结算与加练弹窗) -->
    <Teleport to="body">
      <div v-if="showAutoFinishModal" 
           class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
           style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
        <div class="absolute inset-0" @click="showAutoFinishModal = false"></div>
        <div class="relative w-full max-w-sm bg-zinc-950 border border-amber-500/50 rounded-3xl p-5 shadow-2xl space-y-3.5 text-center animate-in zoom-in-95 duration-200">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-black text-white">所有动作组已全部达成！</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              今日计划共 {{ completedSetsCount }} 组打卡完毕！已自动生成今日表现 AI 深度分析。
            </p>
          </div>

          <!-- Primary Action: Save & Review -->
          <button @click="showAutoFinishModal = false; handleFinishWorkout();"
                  class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            立即结算保存并查看 AI 战绩
          </button>

          <!-- Quick Add-On Workout Chips (小块加练选项) -->
          <div class="pt-1 space-y-2 text-left border-t border-zinc-800/80">
            <div class="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              还想再泵一会儿？快捷加练:
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <button @click="quickAddFinalSet"
                      class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="text-amber-400 font-bold">+</span> 最后一项力竭1组
              </button>
              <button @click="quickAddCoreExercises"
                      class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="text-sky-400 font-bold">✦</span> 核心强化 3组
              </button>
              <button @click="quickAddPumpExercises"
                      class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="text-purple-400 font-bold">▲</span> 臂肩力竭泵感 3组
              </button>
              <button @click="quickOpenPicker"
                      class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                <span class="text-emerald-400 font-bold">≡</span> 打开动作库任选
              </button>
            </div>
          </div>

          <button @click="showAutoFinishModal = false"
                  class="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 transition-colors cursor-pointer">
            稍后再说 / 留在当前页
          </button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { 
  store, 
  getCycleDayForDate, 
  getTodayPlan, 
  startWorkout, 
  finishWorkout, 
  discardActiveWorkout, 
  toggleSetCompletion, 
  addSetToExercise, 
  removeSetFromExercise, 
  addExerciseToActiveWorkout, 
  replaceExerciseInActiveWorkout, 
  removeExerciseFromActiveWorkout,
  moveActiveWorkoutExercise,
  pinActiveWorkoutExercise,
  setTodayAsCycleIndex,
  shiftCycleDays,
  getLastExercisePerformance,
  getExerciseDetails,
  getFullHonorProfile,
  toggleDeloadShield,
  syncSetDataToSubsequentSets,
  addExerciseToPlan,
  adjustExerciseAllSetsWeight,
  setExerciseAllSetsWeight,
  syncFirstSetToAllSets,
  STRENGTH_LEVEL_CONFIGS,
  uid
} from "../store/fitnessStore.js";
import { calculateSupercompensationStatus } from "../engine/dopamineFeedbackEngine.js";
import { SPLIT_RECOMMENDED_ADDONS } from "../data/defaultPlans.js";
import ExercisePickerModal from "../components/ExercisePickerModal.vue";
import GymMachineFinderModal from "../components/GymMachineFinderModal.vue";
import ExerciseDetailModal from "../components/ExerciseDetailModal.vue";
import CycleEditorModal from "../components/CycleEditorModal.vue";
import WorkoutSummaryModal from "../components/WorkoutSummaryModal.vue";
import HonorShowcaseModal from "../components/HonorShowcaseModal.vue";
import BodyMetricsModal from "../components/BodyMetricsModal.vue";
import StrengthPlacementModal from "../components/StrengthPlacementModal.vue";
import RulesCodexModal from "../components/RulesCodexModal.vue";
import ExerciseImage from "../components/ExerciseImage.vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { universalScrollToTop } from "../utils/scrollUtils.js";
import { triggerHaptic } from "../utils/vibrate.js";

// State
const showAddExerciseModal = ref(false);
const showSwapModal = ref(false);
const swapTargetIdx = ref(null);
const showMachineFinder = ref(false);
const machineFinderReplaceIndex = ref(-1);
const showExerciseDetailModal = ref(false);
const selectedExerciseDetail = ref(null);
const showCycleEditorModal = ref(false);
const showPlanPicker = ref(false);
const showSummaryModal = ref(false);
const latestSummary = ref(null);
const showAutoFinishModal = ref(false);
const showHonorModal = ref(false);
const showBodyModal = ref(false);
const showRulesModal = ref(false);
const showStrengthPlacementModal = ref(false);

const currentStrengthConfig = computed(() => {
  const lvl = store.settings.strengthLevel || "intermediate";
  return STRENGTH_LEVEL_CONFIGS[lvl] || STRENGTH_LEVEL_CONFIGS.intermediate;
});

const anyTodayModalOpen = computed(() => showPlanPicker.value || showAutoFinishModal.value || showStrengthPlacementModal.value);
watch(anyTodayModalOpen, (isOpen) => {
  if (isOpen) lockBodyScroll();
  else unlockBodyScroll();
});

const honorData = computed(() => getFullHonorProfile());

const todayHeroCardClasses = computed(() => {
  const isLight = store.settings.themeMode === "light";
  const skin = store.settings.uiSkin;

  if (honorData.value.isDeloadActive) {
    return isLight
      ? "bg-gradient-to-br from-sky-50 via-white to-sky-100/50 border-sky-300 shadow-md shadow-sky-100"
      : "bg-gradient-to-br from-sky-950/80 via-zinc-900 to-zinc-950 border-sky-500/40 shadow-sky-950/20";
  }

  if (isLight) {
    if (skin === "cs") {
      return "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-orange-500/30 shadow-md shadow-slate-200/60";
    }
    if (skin === "chamber") {
      return "bg-gradient-to-br from-[#FFFDF9] via-[#FAF6ED] to-[#F3EDE0] border-[#C5A059]/40 shadow-md shadow-stone-200/60";
    }
    if (skin === "monochrome") {
      return "bg-white border-neutral-300 shadow-md shadow-neutral-200/50";
    }
    return "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200 shadow-md shadow-slate-200/50";
  }

  // Dark Mode
  if (skin === "cs") {
    return "bg-gradient-to-br from-[#0c121e] via-[#080c14] to-zinc-950 border-orange-500/40 shadow-black";
  }
  if (skin === "chamber") {
    return "bg-gradient-to-br from-[#0b1224] via-[#070b14] to-zinc-950 border-[#E5C378]/35";
  }
  if (skin === "monochrome") {
    return "bg-black border-neutral-800 shadow-black";
  }
  return "bg-gradient-to-br from-zinc-900/95 via-zinc-900 to-zinc-950 border-zinc-800";
});

// Timer for elapsed workout time
const nowTimestamp = ref(Date.now());
let elapsedInterval = null;

onMounted(() => {
  elapsedInterval = setInterval(() => {
    nowTimestamp.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (elapsedInterval) clearInterval(elapsedInterval);
  if (anyTodayModalOpen.value) unlockBodyScroll();
});

const elapsedFormatted = computed(() => {
  if (!store.activeWorkout?.startTime) return "00:00";
  const sec = Math.max(0, Math.floor((nowTimestamp.value - store.activeWorkout.startTime) / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
});

const todayCycle = computed(() => {
  return getCycleDayForDate();
});

const todayRestSupercomp = computed(() => {
  const lastTimestamp = store.workoutLogs?.[0]?.completedAt || store.workoutLogs?.[0]?.date || Date.now();
  return calculateSupercompensationStatus(lastTimestamp);
});

const currentPlan = computed(() => {
  const tp = getTodayPlan();
  return tp.plan;
});

const todayTotalSets = computed(() => {
  if (!currentPlan.value?.exercises) return 0;
  return currentPlan.value.exercises.reduce((sum, ex) => sum + (Number(ex.setsCount) || 3), 0);
});

const todayRecommendedAddons = computed(() => {
  const planId = currentPlan.value?.id || "plan-push";
  const list = SPLIT_RECOMMENDED_ADDONS[planId] || SPLIT_RECOMMENDED_ADDONS["default"] || [];
  const existingNames = new Set((currentPlan.value?.exercises || []).map(e => e.name));
  return list.filter(addon => !existingNames.has(addon.name));
});

const activeWorkoutRecommendedAddons = computed(() => {
  if (!store.activeWorkout) return [];
  const planId = store.activeWorkout.planId || "plan-push";
  const list = SPLIT_RECOMMENDED_ADDONS[planId] || SPLIT_RECOMMENDED_ADDONS["default"] || [];
  const existingNames = new Set((store.activeWorkout.exercises || []).map(e => e.name));
  return list.filter(addon => !existingNames.has(addon.name));
});

const todayFormatted = computed(() => {
  const d = new Date();
  return `${d.getMonth() + 1}月${d.getDate()}日`;
});

const timeSinceLastWorkout = computed(() => {
  const logs = store.workoutLogs || [];
  if (!logs.length) {
    return {
      hasHistory: false,
      badge: "新兵报到",
      title: "首训档案待激活",
      urgencyLevel: "fresh",
      timeStr: "首训待开",
      statusLabel: "0~72h 安全期",
      insight: "尚未记录过训练，完成首场特训打卡即可激活战力排位与超量恢复时钟！",
      subText: "尚未记录过训练，立即开启你的第一场特训打卡！"
    };
  }

  const latestLog = logs[0];
  const lastTime = latestLog.completedAt || (new Date(latestLog.date).getTime()) || (Date.now() - 86400000);
  const diffMs = Math.max(0, nowTimestamp.value - lastTime);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remHours = diffHours % 24;
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let timeStr = "";
  if (diffDays > 0) {
    timeStr = `${diffDays}天${remHours}小时`;
  } else if (diffHours > 0) {
    timeStr = `${diffHours}小时${diffMins}分`;
  } else {
    timeStr = `${Math.max(1, diffMins)}分钟`;
  }

  if (diffHours < 24) {
    return {
      hasHistory: true,
      badge: "⚡ 刚刚练完",
      title: "超量恢复中",
      urgencyLevel: "fresh",
      timeStr: `${timeStr}`,
      statusLabel: "超量合成 · 0扣分",
      insight: `距上次打卡已过 ${timeStr}。肌原纤维与神经中枢正在超量合成重组中，请保证充沛睡眠与蛋白质摄入。`,
      subText: `距上次训练已过 ${timeStr} · 肌原纤维超量合成中`
    };
  } else if (diffHours < 48) {
    return {
      hasHistory: true,
      badge: "🔥 黄金战备",
      title: "精力已满血",
      urgencyLevel: "ready",
      timeStr: `${timeStr}`,
      statusLabel: "满血蓄势 · 适宜重载",
      insight: `距上次打卡已过 ${timeStr}。中枢神经疲劳已完全代谢，肌糖原重装充沛，正处于巅峰突破窗口！`,
      subText: `距上次训练已过 ${timeStr} · 神经与肌糖原已充沛，适宜重装开练！`
    };
  } else if (diffHours < 72) {
    return {
      hasHistory: true,
      badge: "⚠️ 催练警报",
      title: "神经募集下降中",
      urgencyLevel: "warn",
      timeStr: `${timeStr}`,
      statusLabel: "72h临界 · 建议开练",
      insight: `你已经 ${timeStr} 没练了！运动神经募集感正在衰减，建议今日内开练以保持渐进做工节律。`,
      subText: `你已经 ${timeStr} 没练了！募集感正在衰减，建议立即归队！`
    };
  } else {
    return {
      hasHistory: true,
      badge: "🚨 严重怠惰",
      title: "战力衰减中",
      urgencyLevel: "danger",
      timeStr: `${timeStr}`,
      statusLabel: "怠惰扣分 · 速速开练",
      insight: `已严重怠惰超 72 小时！战力分按天递减扣除中，立即开练可触发反弹保护，挽回荣誉！`,
      subText: `你已经 ${timeStr} 没练了！肌肉正在消退，枪膛已冷，速速开练！`
    };
  }
});

const splitRecoveryInfo = computed(() => {
  const plan = currentPlan.value;
  const cycle = todayCycle.value;
  const shortName = cycle?.shortName || plan?.shortName || "今日分化";
  
  if (cycle?.isRest) {
    return {
      status: "预设休息日",
      timeLabel: "中枢超量修复",
      desc: "今日为预设休息日 · 中枢神经与大肌群正在修复，可记录休息打卡",
      insight: "今日为预设休息日，给神经中枢和深层筋膜充分的超量恢复时间，避免过度训练疲劳累积。"
    };
  }

  const logs = store.workoutLogs || [];
  const matchLog = logs.find(l => 
    (plan && l.planId === plan.id) ||
    (plan && l.planName?.includes(plan.name)) ||
    (l.shortName && l.shortName === shortName)
  );

  if (!matchLog) {
    return {
      status: "首度开练",
      timeLabel: `【${shortName}】建立基准`,
      desc: `暂无上次【${shortName}】历史记录 · 立即开练建立首训力量基准！`,
      insight: `暂无上次【${shortName}】训练记录，今天开练将为你录入首笔动作做工基准，开启渐进过载轨迹。`
    };
  }

  const logTime = matchLog.completedAt || (new Date(matchLog.date).getTime()) || (Date.now() - 86400000 * 2);
  const diffMs = Math.max(0, nowTimestamp.value - logTime);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  let timeLabel = "";
  if (diffDays > 0) {
    timeLabel = `${diffDays}天前`;
  } else if (diffHours > 0) {
    timeLabel = `${diffHours}小时前`;
  } else {
    timeLabel = "刚刚练完";
  }
  const recoveryPercent = Math.min(100, Math.round((diffHours / 48) * 100));

  if (recoveryPercent >= 100) {
    return {
      status: "100% 满血",
      timeLabel: `上次【${shortName}】${timeLabel}`,
      desc: `上次【${shortName}】是 ${timeLabel} · 靶向肌群已 100% 超量重组完成，蓄势待发！`,
      insight: `上次【${shortName}】是 ${timeLabel}，靶向肌纤维已彻底重组完毕，状态绝佳，适宜冲击过载或加重！`
    };
  } else {
    return {
      status: `恢复 ${recoveryPercent}%`,
      timeLabel: `上次【${shortName}】${timeLabel}`,
      desc: `上次【${shortName}】是 ${timeLabel} · 恢复度 ${recoveryPercent}% (深层纤维修复中)`,
      insight: `上次【${shortName}】是 ${timeLabel}，靶向肌群恢复进度约 ${recoveryPercent}%，建议合理热身并注意动作幅度。`
    };
  }
});

const totalSetsCount = computed(() => {
  if (!store.activeWorkout) return 0;
  return store.activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
});

const completedSetsCount = computed(() => {
  if (!store.activeWorkout) return 0;
  return store.activeWorkout.exercises.reduce((acc, ex) => {
    return acc + ex.sets.filter(s => s.completed).length;
  }, 0);
});

const currentVolume = computed(() => {
  if (!store.activeWorkout) return 0;
  return store.activeWorkout.exercises.reduce((acc, ex) => {
    const vol = ex.sets.filter(s => s.completed).reduce((sAcc, s) => {
      return sAcc + (Number(s.weight) || 0) * (Number(s.reps) || 0);
    }, 0);
    return acc + vol;
  }, 0);
});

const recentLogs = computed(() => {
  return store.workoutLogs.slice(0, 3);
});

function formatLastPerf(name) {
  const last = getLastExercisePerformance(name);
  if (!last || !last.sets.length) return "";
  const first = last.sets[0];
  return `${first.weight}kg×${first.reps}`;
}

function getExerciseGif(name) {
  const ex = getExerciseDetails(name);
  return ex?.gifUrl || "";
}


function handleStartTodayWorkout() {
  if (currentPlan.value) {
    startWorkout(currentPlan.value.id);
    universalScrollToTop(true);
  }
}

function startCustomPlan(planId) {
  showPlanPicker.value = false;
  startWorkout(planId);
  universalScrollToTop(true);
}

function startEmptyWorkout() {
  const emptyPlan = {
    id: uid("plan-free"),
    name: "自由训练",
    shortName: "自由",
    color: "amber",
    coreTarget: "自主选择动作与强度",
    exercises: []
  };
  startWorkout(emptyPlan.id);
  universalScrollToTop(true);
}



function markRestDayCompleted() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${day}`;
  
  store.workoutLogs.unshift({
    id: uid("log-rest"),
    date: dateStr,
    timestamp: Date.now(),
    planId: "plan-rest",
    planName: "完全休息 (Rest) —— 超量恢复",
    shortName: "休息",
    color: "emerald",
    durationSeconds: 0,
    totalVolume: 0,
    totalSets: 0,
    completedAt: Date.now(),
    exercises: []
  });
  
  latestSummary.value = {
    planName: "完全休息日打卡",
    durationSeconds: 0,
    totalVolume: 0,
    totalSets: 0
  };
  showSummaryModal.value = true;
}

const overloadCelebration = ref({ visible: false, text: "", subText: "", isPr: false });
let overloadTimeout = null;

function showOverloadCelebration(text, subText, isPr = true) {
  overloadCelebration.value = { visible: true, text, subText, isPr };
  if (overloadTimeout) clearTimeout(overloadTimeout);
  overloadTimeout = setTimeout(() => {
    overloadCelebration.value.visible = false;
  }, 2200);
}

function getSetOverloadDelta(exerciseName, s, sIdx) {
  const lastPerf = getLastExercisePerformance(exerciseName);
  if (!lastPerf || !lastPerf.sets || !lastPerf.sets.length) {
    return null;
  }

  const prevSet = lastPerf.sets[sIdx] || lastPerf.sets[lastPerf.sets.length - 1];
  if (!prevSet) return null;

  const curW = Number(s.weight) || 0;
  const prevW = Number(prevSet.weight) || 0;
  const curR = Number(s.reps) || 0;
  const prevR = Number(prevSet.reps) || 0;

  if (curW > prevW) {
    const diff = (curW - prevW).toFixed(1).replace(/\.0$/, "");
    return {
      type: "weight_pr",
      label: `+${diff}kg PR`,
      prevText: `上次: ${prevW}kg × ${prevR}`,
      isPr: true,
      diffVal: diff
    };
  } else if (curW === prevW && curR > prevR) {
    const diff = curR - prevR;
    return {
      type: "reps_pr",
      label: `+${diff}次 突破`,
      prevText: `上次: ${prevW}kg × ${prevR}`,
      isOverload: true,
      diffVal: diff
    };
  }
  return null;
}

function toggleSet(exIdx, sIdx) {
  const ex = store.activeWorkout?.exercises?.[exIdx];
  const s = ex?.sets?.[sIdx];
  const wasCompleted = s?.completed;

  toggleSetCompletion(exIdx, sIdx);

  // If newly completed and is an overload PR, trigger dopamine celebration
  if (!wasCompleted && ex && s) {
    const delta = getSetOverloadDelta(ex.name, s, sIdx);
    if (delta && delta.isPr) {
      showOverloadCelebration(`🔥 ${ex.name} 破纪录！`, `重量突破 +${delta.diffVal}kg (超越上次基准)`, true);
    } else if (delta && delta.isOverload) {
      showOverloadCelebration(`⚡ 渐进超负荷达成！`, `${ex.name} 第 ${sIdx + 1} 组 次数突破 +${delta.diffVal}次`, false);
    }
  }

  // Auto-detect if all sets are now completed
  if (completedSetsCount.value > 0 && completedSetsCount.value === totalSetsCount.value) {
    setTimeout(() => {
      if (completedSetsCount.value === totalSetsCount.value && store.activeWorkout && !showSummaryModal.value) {
        showAutoFinishModal.value = true;
      }
    }, 600);
  }
}


function adjustSetWeight(exIdx, sIdx, delta) {
  const ex = store.activeWorkout?.exercises?.[exIdx];
  if (!ex || !ex.sets?.[sIdx]) return;
  const currentSet = ex.sets[sIdx];
  const oldVal = Number(currentSet.weight) || 0;
  const newVal = Math.max(0, Number((oldVal + delta).toFixed(1)));
  currentSet.weight = newVal;
  if (store.settings.vibrationEnabled) triggerHaptic("light");

  // 智能级联联动：后续未完成组若为同重或初始值，自动跟随联动
  for (let i = sIdx + 1; i < ex.sets.length; i++) {
    const nextSet = ex.sets[i];
    if (!nextSet.completed && (Number(nextSet.weight) === oldVal || Number(nextSet.weight) === 0)) {
      nextSet.weight = newVal;
    }
  }
}

function onWeightChange(exIdx, sIdx) {
  const ex = store.activeWorkout?.exercises?.[exIdx];
  if (!ex || !ex.sets?.[sIdx]) return;
  const currentSet = ex.sets[sIdx];
  const newVal = Number(currentSet.weight) || 0;
  // 修改第1组时，自动联动下填后续未完成组
  if (sIdx === 0) {
    for (let i = 1; i < ex.sets.length; i++) {
      if (!ex.sets[i].completed) {
        ex.sets[i].weight = newVal;
      }
    }
  }
}

function adjustSetReps(exIdx, sIdx, delta) {
  const ex = store.activeWorkout?.exercises?.[exIdx];
  if (!ex || !ex.sets?.[sIdx]) return;
  const currentSet = ex.sets[sIdx];
  const oldVal = Number(currentSet.reps) || 0;
  const newVal = Math.max(0, oldVal + delta);
  currentSet.reps = newVal;
  if (store.settings.vibrationEnabled) triggerHaptic("light");

  for (let i = sIdx + 1; i < ex.sets.length; i++) {
    const nextSet = ex.sets[i];
    if (!nextSet.completed && (Number(nextSet.reps) === oldVal || Number(nextSet.reps) === 0)) {
      nextSet.reps = newVal;
    }
  }
}

function onRepsChange(exIdx, sIdx) {
  const ex = store.activeWorkout?.exercises?.[exIdx];
  if (!ex || !ex.sets?.[sIdx]) return;
  const currentSet = ex.sets[sIdx];
  const newVal = Number(currentSet.reps) || 0;
  if (sIdx === 0) {
    for (let i = 1; i < ex.sets.length; i++) {
      if (!ex.sets[i].completed) {
        ex.sets[i].reps = newVal;
      }
    }
  }
}

function handleSyncSubsequent(exIdx, sIdx) {
  const count = syncSetDataToSubsequentSets(exIdx, sIdx, false);
  if (count > 0) {
    const w = store.activeWorkout?.exercises?.[exIdx]?.sets?.[sIdx]?.weight || 0;
    showOverloadCelebration(`⚡ 已同步至后续 ${count} 组`, `重量统一设为 ${w} kg`, false);
  }
}

function quickAddAddonToPlan(addon) {
  if (!currentPlan.value) return;
  const success = addExerciseToPlan(currentPlan.value.id, addon);
  if (success) {
    showOverloadCelebration(`已添加【${addon.name}】`, "已将动作加入今日计划 (3组)", false);
  }
}

function quickAddRecommendedExercise(addon) {
  addExerciseToActiveWorkout(addon);
  showOverloadCelebration(`已添加【${addon.name}】`, "已加入本次特训并生成 3 组做工", false);
}

function addSet(exIdx) {
  addSetToExercise(exIdx);
}

function removeSet(exIdx, sIdx) {
  removeSetFromExercise(exIdx, sIdx);
}

function removeExercise(exIdx) {
  removeExerciseFromActiveWorkout(exIdx);
}

function openSwapModal(exIdx) {
  swapTargetIdx.value = exIdx;
  showSwapModal.value = true;
}

function handleSwapExerciseSelected(newEx) {
  if (swapTargetIdx.value !== null) {
    replaceExerciseInActiveWorkout(swapTargetIdx.value, newEx);
    swapTargetIdx.value = null;
  }
}

function handleAddExerciseSelected(newEx) {
  addExerciseToActiveWorkout(newEx);
}

function openMachineFinder(replaceIdx = -1) {
  machineFinderReplaceIndex.value = replaceIdx;
  showMachineFinder.value = true;
}

function handleMachineFinderSelect(exercise) {
  if (machineFinderReplaceIndex.value >= 0 && store.activeWorkout) {
    replaceExerciseInActiveWorkout(machineFinderReplaceIndex.value, exercise);
    machineFinderReplaceIndex.value = -1;
  } else if (store.activeWorkout) {
    addExerciseToActiveWorkout(exercise);
  } else {
    const plan = getTodayPlan();
    if (plan) {
      addExerciseToPlan(plan.id, exercise);
    }
  }
}

function openExerciseDetail(ex) {
  const full = getExerciseDetails(ex.exerciseId) || getExerciseDetails(ex.name) || ex;
  selectedExerciseDetail.value = full;
  showExerciseDetailModal.value = true;
}

function openExerciseDetailByName(name) {
  const full = getExerciseDetails(name) || { name, category: "训练动作", target: "主要刺激目标肌群" };
  selectedExerciseDetail.value = full;
  showExerciseDetailModal.value = true;
}

function openCycleEditor() {
  showCycleEditorModal.value = true;
}

function setTodayAsIndex(idx) {
  setTodayAsCycleIndex(idx);
}

function shiftCycle(delta) {
  shiftCycleDays(delta);
}

function handleFinishWorkout() {
  const res = finishWorkout();
  if (res) {
    latestSummary.value = res;
    showSummaryModal.value = true;
  }
}

function quickAddFinalSet() {
  showAutoFinishModal.value = false;
  if (store.activeWorkout?.exercises.length > 0) {
    const lastExIdx = store.activeWorkout.exercises.length - 1;
    addSetToExercise(lastExIdx);
  }
}

function quickAddCoreExercises() {
  showAutoFinishModal.value = false;
  const coreEx = {
    id: "ex_core_plank",
    name: "悬垂举腿 / 卷腹平板 (核心强化)",
    targetReps: "3组 x 15-20次",
    defaultSets: 3,
    category: "核心"
  };
  addExerciseToActiveWorkout(coreEx);
}

function quickAddPumpExercises() {
  showAutoFinishModal.value = false;
  const pumpEx = {
    id: "ex_pump_arms",
    name: "哑铃侧平举 / 弯举 (臂肩力竭泵感)",
    targetReps: "3组 x 12-15次",
    defaultSets: 3,
    category: "肩臂"
  };
  addExerciseToActiveWorkout(pumpEx);
}

function quickOpenPicker() {
  showAutoFinishModal.value = false;
  showAddExerciseModal.value = true;
}

function confirmDiscard() {
  if (confirm("确定要放弃本次未完成的训练吗？")) {
    discardActiveWorkout();
  }
}
</script>
