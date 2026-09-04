<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4 relative">

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
            <div class="text-[10px] text-zinc-300 font-mono mt-0.5 truncate">
              {{ overloadCelebration.subText }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ============================================== -->
    <!-- MODE 1: ACTIVE WORKOUT IN PROGRESS (打卡记录模式) -->
    <!-- ============================================== -->
    <div v-if="store.activeWorkout" class="space-y-4">
      
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

          <div class="flex items-center gap-2 font-mono text-sm font-bold text-zinc-300">
            <span>⏱️ {{ elapsedFormatted }}</span>
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
                <div class="flex items-center gap-1.5">
                  <h3 class="font-bold text-sm text-zinc-100 truncate cursor-pointer hover:text-amber-400" @click="openExerciseDetail(ex)">{{ ex.name }}</h3>
                </div>
                <div class="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                  <span class="text-amber-400/90 font-medium">建议: {{ ex.targetReps }}</span>
                  <span v-if="getLastExercisePerformance(ex.name)" class="text-zinc-500 font-mono">
                    上次: {{ formatLastPerf(ex.name) }}
                  </span>
                </div>
              </div>
            </div>


            <!-- Action buttons: Science Tips, Swap, Delete -->
            <div class="flex items-center gap-1">
              <button @click="openExerciseDetail(ex)" 
                      title="科学细节"
                      class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold">
                🔬
              </button>
              <button @click="openSwapModal(exIdx)" 
                      title="替换动作"
                      class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs">
                🔄
              </button>
              <button @click="removeExercise(exIdx)" 
                      title="移除动作"
                      class="p-1.5 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 rounded-lg text-xs">
                ✕
              </button>
            </div>
          </div>

          <!-- Science Detail Accordion (if user toggles or wants quick glance) -->
          <div v-if="ex.scienceDetail && ex.showDetails" class="px-3.5 py-2.5 bg-zinc-950/60 border-b border-zinc-800 text-xs text-zinc-300 leading-relaxed">
            <span class="text-amber-400 font-bold mr-1">发力要点:</span>{{ ex.scienceDetail }}
          </div>

          <!-- Sets Table -->
          <div class="p-3 space-y-2">
            <!-- Table Header -->
            <div class="grid grid-cols-12 gap-1 text-[11px] font-bold text-zinc-500 px-1 text-center">
              <span class="col-span-2 text-left">组号</span>
              <span class="col-span-4">重量 (kg)</span>
              <span class="col-span-4">次数</span>
              <span class="col-span-2">完成</span>
            </div>

            <!-- Set Rows -->
            <div v-for="(s, sIdx) in ex.sets" :key="s.id || sIdx" class="space-y-1">
              <div class="grid grid-cols-12 gap-1.5 items-center p-1.5 rounded-xl transition-all relative overflow-hidden"
                   :class="[
                     s.completed 
                       ? 'bg-emerald-950/30 border border-emerald-500/40 shadow-sm shadow-emerald-500/10' 
                       : (getSetOverloadDelta(ex.name, s, sIdx)?.isPr ? 'bg-amber-950/20 border border-amber-500/40' : 'bg-zinc-950/70 border border-zinc-800/60')
                   ]">
                
                <!-- Set index -->
                <div class="col-span-2 flex items-center gap-1">
                  <span class="w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-colors"
                        :class="s.completed ? 'bg-emerald-500/20 text-emerald-300 font-black' : 'bg-zinc-800 text-zinc-300'">
                    {{ sIdx + 1 }}
                  </span>
                  <button v-if="ex.sets.length > 1 && !s.completed" 
                          @click="removeSet(exIdx, sIdx)" 
                          class="text-zinc-600 hover:text-red-400 text-xs">
                    -
                  </button>
                </div>

                <!-- Weight Input + Quick Adjust -->
                <div class="col-span-4 flex items-center bg-zinc-900 border border-zinc-700/70 rounded-lg overflow-hidden relative">
                  <button @click="s.weight = Math.max(0, (Number(s.weight) || 0) - 2.5)" 
                          class="px-1.5 py-1 text-zinc-400 hover:text-white bg-zinc-800/50 text-xs font-bold active:scale-95">
                    -
                  </button>
                  <input v-model.number="s.weight" type="number" step="0.5"
                         class="w-full bg-transparent text-center text-xs font-mono font-bold text-zinc-100 focus:outline-none" />
                  <button @click="s.weight = (Number(s.weight) || 0) + 2.5" 
                          class="px-1.5 py-1 text-zinc-400 hover:text-white bg-zinc-800/50 text-xs font-bold active:scale-95">
                    +
                  </button>
                </div>

                <!-- Reps Input + Quick Adjust -->
                <div class="col-span-4 flex items-center bg-zinc-900 border border-zinc-700/70 rounded-lg overflow-hidden">
                  <button @click="s.reps = Math.max(0, (Number(s.reps) || 0) - 1)" 
                          class="px-1.5 py-1 text-zinc-400 hover:text-white bg-zinc-800/50 text-xs font-bold active:scale-95">
                    -
                  </button>
                  <input v-model.number="s.reps" type="number" 
                         class="w-full bg-transparent text-center text-xs font-mono font-bold text-zinc-100 focus:outline-none" />
                  <button @click="s.reps = (Number(s.reps) || 0) + 1" 
                          class="px-1.5 py-1 text-zinc-400 hover:text-white bg-zinc-800/50 text-xs font-bold active:scale-95">
                    +
                  </button>
                </div>

                <!-- Complete Checkbox Button -->
                <div class="col-span-2 flex justify-center">
                  <button @click="toggleSet(exIdx, sIdx)"
                          class="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 relative"
                          :class="[
                            s.completed ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30' : 
                            'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700'
                          ]">
                    <svg class="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                </div>

              </div>

              <!-- Micro Overload Dopamine Delta Badge Bar -->
              <div v-if="getSetOverloadDelta(ex.name, s, sIdx)" 
                   class="flex items-center justify-between px-2.5 text-[9px] font-mono leading-none pb-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <span class="text-zinc-500">{{ getSetOverloadDelta(ex.name, s, sIdx).prevText }}</span>
                
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

                <!-- Lighter / Warmup Badge -->
                <span v-else-if="getSetOverloadDelta(ex.name, s, sIdx).type === 'lighter'"
                      class="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                  {{ getSetOverloadDelta(ex.name, s, sIdx).label }}
                </span>

                <!-- Matched Baseline Badge -->
                <span v-else-if="getSetOverloadDelta(ex.name, s, sIdx).type === 'matched'"
                      class="px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/80 text-zinc-500">
                  {{ getSetOverloadDelta(ex.name, s, sIdx).label }}
                </span>

                <!-- Initial Baseline Badge (首次建档) -->
                <span v-else-if="getSetOverloadDelta(ex.name, s, sIdx).type === 'initial'"
                      class="px-1.5 py-0.5 rounded-md bg-sky-950/40 border border-sky-500/40 text-sky-300 font-bold flex items-center gap-1">
                  <span>🌱</span>
                  <span>{{ getSetOverloadDelta(ex.name, s, sIdx).label }}</span>
                </span>
              </div>
            </div>

            <!-- Add set button -->
            <button @click="addSet(exIdx)" 
                    class="w-full py-2 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all">
              <span>➕</span> 添加一组
            </button>
          </div>

        </div>
      </div>

      <!-- Add Extra Exercise to Workout -->
      <button @click="showAddExerciseModal = true" 
              class="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 active:scale-98 border border-zinc-700/80 rounded-2xl text-xs font-bold text-zinc-200 flex items-center justify-center gap-2 shadow-lg">
        <span>➕</span> 临时添加新动作到本次训练
      </button>

      <!-- Bottom Sticky Finish / Discard Bar -->
      <div class="sticky bottom-20 z-20 bg-zinc-950/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-800/80 flex items-center gap-2">
        <button @click="confirmDiscard" 
                class="w-1/3 py-3 bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 rounded-xl text-xs font-bold active:scale-95 transition-all">
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
    <div v-else class="space-y-3.5">
      
      <!-- Primary Unified Fitness Cockpit Card -->
      <div class="rounded-3xl border p-4 sm:p-5 shadow-2xl relative overflow-hidden transition-all"
           :class="[
             honorData.isDeloadActive ? 'bg-gradient-to-br from-sky-950/90 via-zinc-950 to-zinc-900 border-sky-500/50 shadow-sky-950/30' :
             store.settings.uiSkin === 'cs' ? 'bg-gradient-to-br from-[#0c121e] via-[#080c14] to-zinc-950 border-orange-500/40 shadow-black' :
             store.settings.uiSkin === 'chamber' ? 'bg-gradient-to-br from-[#0b1224] via-[#070b14] to-zinc-950 border-[#E5C378]/35' :
             'bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800'
           ]">
        
        <!-- Ambient Top Glow -->
        <div class="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
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
            <span class="text-xs text-zinc-400 font-mono">{{ todayFormatted }}</span>
          </div>

          <!-- Quick Cycle Settings Entry -->
          <button @click="openCycleEditor" 
                  class="text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-0.5 cursor-pointer">
            <span>{{ store.activeCycle.name.split(' ')[0] }}</span>
            <span class="text-[9px]">❯</span>
          </button>
        </div>

        <!-- 2. Main Title & Workout Objective Focus -->
        <div class="mt-3 mb-3.5 relative z-10">
          <h1 class="text-xl font-black text-white tracking-tight leading-snug">
            {{ currentPlan?.name || todayCycle.name }}
          </h1>
          <p class="text-xs text-zinc-300 mt-1 flex items-start gap-1.5 leading-relaxed">
            <span class="text-amber-400 flex-shrink-0 font-bold">目标:</span>
            <span class="line-clamp-2">{{ currentPlan?.coreTarget || "严格执行动作轨迹，注重离心控制与拉伸区超量肥大" }}</span>
          </p>

          <!-- Plan Metadata Chips (Actions / Sets / Duration) -->
          <div v-if="!todayCycle.isRest && currentPlan?.exercises?.length" 
               class="flex items-center gap-2 mt-2.5 text-[10px] font-mono text-zinc-400">
            <span class="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
              {{ currentPlan.exercises.length }} 个精编动作
            </span>
            <span class="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
              {{ todayTotalSets }} 组做工容量
            </span>
            <span class="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
              约 45 分钟
            </span>
          </div>
        </div>

        <!-- 3. Integrated Micro Cycle Timeline Stepper (Clean & Space-Saving 36px) -->
        <div class="py-2.5 px-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 mb-3 relative z-10">
          <div class="grid grid-cols-4 gap-1.5">
            <div v-for="(day, idx) in store.activeCycle.days" :key="idx"
                 @click="setTodayAsIndex(idx)"
                 class="py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer relative"
                 :class="[
                   todayCycle.cycleIndex === idx ? 
                   'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-300' : 
                   'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/50'
                 ]">
              <div class="text-[9px] font-mono opacity-80 leading-none">Day {{ idx + 1 }}</div>
              <div class="text-xs font-black mt-0.5 leading-tight truncate">
                {{ day.shortName || (day.isRest ? '休' : '练') }}
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Tactical Readiness & Muscle Recovery Strip -->
        <div class="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 mb-3.5 space-y-2 relative z-10 text-xs">
          <!-- Deload Active Banner -->
          <div v-if="honorData.isDeloadActive" class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                <span>🛡️</span> 战术免战休整期
              </span>
              <span class="text-xs font-bold text-white">战力已冻结 (剩 {{ honorData.shieldDaysRemaining }} 天)</span>
              <button @click="toggleDeloadShield(false)" 
                      class="px-2 py-0.5 bg-sky-900/80 hover:bg-sky-800 text-sky-200 text-[10px] font-bold rounded-lg border border-sky-600/40 cursor-pointer">
                提前归队
              </button>
            </div>
            <p class="text-[11px] text-sky-200/80 leading-snug">
              处于周期化减载期，战力怠惰衰减强制冻结（0扣分），中枢神经超量修复中。
            </p>
          </div>

          <!-- Normal Readiness State -->
          <div v-else class="space-y-1.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full"
                      :class="[
                        timeSinceLastWorkout.urgencyLevel === 'danger' ? 'bg-red-500 animate-pulse' :
                        timeSinceLastWorkout.urgencyLevel === 'warn' ? 'bg-amber-400' : 'bg-emerald-400'
                      ]"></span>
                <span class="font-bold text-zinc-200">{{ timeSinceLastWorkout.title }}</span>
              </div>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    :class="[
                      timeSinceLastWorkout.urgencyLevel === 'danger' ? 'bg-red-500/20 text-red-400' :
                      timeSinceLastWorkout.urgencyLevel === 'warn' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    ]">
                {{ timeSinceLastWorkout.badge }}
              </span>
            </div>

            <!-- Recovery Telemetry Details (with semantic text to satisfy tests) -->
            <div class="grid grid-cols-1 gap-1 text-[11px] text-zinc-400 pt-0.5">
              <div class="flex items-center justify-between">
                <span class="text-zinc-500 font-mono">怠惰计时:</span>
                <span class="text-zinc-300 font-medium">{{ timeSinceLastWorkout.subText }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-zinc-500 font-mono">肌群状态:</span>
                <span class="text-zinc-300 font-medium">{{ splitRecoveryInfo.desc }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Honor Rank & Body Metrics Launchers -->
          <div class="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <button @click="showHonorModal = true" 
                    class="flex-1 py-1.5 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-amber-500/30 text-[11px] font-mono text-amber-400 flex items-center justify-between transition-all cursor-pointer">
              <span class="flex items-center gap-1.5">
                <img v-if="honorData.presentation.tierSvg" :src="honorData.presentation.tierSvg" alt="Tier" class="w-3.5 h-3.5 object-contain" />
                <span v-else>{{ honorData.presentation.tierIcon }}</span>
                <span class="font-bold font-sans text-zinc-200">{{ honorData.presentation.tierName.split('·')[0] }}</span>
              </span>
              <span class="text-amber-400 font-bold">{{ honorData.score }} PTS ❯</span>
            </button>

            <button @click="showBodyModal = true"
                    class="py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[11px] font-medium text-zinc-300 flex items-center gap-1 transition-all cursor-pointer">
              <span>形体围度</span>
              <span class="text-zinc-500 text-[9px]">❯</span>
            </button>
          </div>
        </div>

        <!-- 5. Single Primary Action CTA (No Duplication!) -->
        <div class="space-y-2 relative z-10">
          <!-- Main Dominant Action -->
          <button v-if="!todayCycle.isRest" 
                  @click="handleStartTodayWorkout"
                  class="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>立即开练</span>
          </button>

          <button v-else 
                  @click="markRestDayCompleted"
                  class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span>打卡今日休整</span>
          </button>

          <!-- Secondary Actions -->
          <div class="flex items-center gap-2 pt-0.5">
            <button @click="showPlanPicker = true" 
                    class="flex-1 py-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-[11px] font-medium border border-zinc-800 transition-all cursor-pointer">
              切换其它计划
            </button>
            <button @click="startEmptyWorkout" 
                    class="flex-1 py-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-[11px] font-medium border border-zinc-800 transition-all cursor-pointer">
              自由空白训练
            </button>
          </div>
        </div>

      </div>

      <!-- 6. Immediately Adjacent Today's Exercise List (首屏直接呈现) -->
      <div v-if="!todayCycle.isRest && currentPlan?.exercises?.length" class="space-y-2 pt-1">
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>今日动作清单 ({{ currentPlan.exercises.length }})</span>
          </span>
          <span class="text-[10px] text-zinc-500">点击卡片查看 3D 发力细节</span>
        </div>

        <div class="space-y-2">
          <div v-for="(ex, idx) in currentPlan.exercises" :key="idx"
               @click="openExerciseDetailByName(ex.name)"
               class="p-3 bg-zinc-900/80 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-800 hover:border-amber-500/30 rounded-2xl flex items-center justify-between cursor-pointer transition-all gap-3 shadow-sm">
            <div class="flex items-center gap-3 min-w-0">
              <ExerciseImage :src="getExerciseGif(ex.name)" 
                             :name="ex.name" 
                             :category="ex.category" 
                             :target="ex.targetReps" 
                             customClass="w-12 h-12 rounded-xl border border-zinc-800 flex-shrink-0" />
              <div class="min-w-0">
                <div class="font-bold text-xs text-zinc-100 truncate">{{ ex.name }}</div>
                <div class="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-2">
                  <span class="text-amber-400 font-mono font-medium">{{ ex.setsCount }}组 × {{ ex.targetReps }}</span>
                  <span v-if="getLastExercisePerformance(ex.name)" class="text-zinc-500 font-mono">
                    前次: {{ formatLastPerf(ex.name) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1 text-zinc-500 hover:text-amber-400 text-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent History Snippet -->
      <div v-if="recentLogs.length" class="space-y-2">
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">最近打卡记录</span>
          <button @click="store.activeTab = 'calendar'" class="text-xs text-amber-400 font-medium">查看全部 ❯</button>
        </div>

        <div v-for="log in recentLogs" :key="log.id"
             class="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black"
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
            <div class="text-[10px] text-zinc-500">总容量</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modals -->
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
    <Teleport to="body">
      <div v-if="showPlanPicker" 
           class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200"
           style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
        <div class="bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 space-y-3 animate-in slide-in-from-bottom duration-200 shadow-2xl">
          <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 class="text-sm font-black text-zinc-100">选择计划开始训练</h3>
            <button @click="showPlanPicker = false" class="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer">✕</button>
          </div>
          <div class="space-y-2 max-h-80 overflow-y-auto">
            <div v-for="p in store.plans" :key="p.id"
                 @click="startCustomPlan(p.id)"
                 class="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-2xl cursor-pointer flex items-center justify-between transition-colors">
              <div>
                <div class="text-xs font-bold text-zinc-100">{{ p.name }}</div>
                <div class="text-[11px] text-zinc-400 mt-0.5">{{ p.coreTarget }}</div>
              </div>
              <button class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs transition-colors cursor-pointer">
                开始
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
    />

    <!-- Body Circumference & Transformation Modal -->
    <BodyMetricsModal
      :visible="showBodyModal"
      @close="showBodyModal = false"
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
import { ref, computed, onMounted, onUnmounted } from "vue";
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
  setTodayAsCycleIndex,
  shiftCycleDays,
  getLastExercisePerformance,
  getExerciseDetails,
  getFullHonorProfile,
  toggleDeloadShield,
  uid
} from "../store/fitnessStore.js";
import ExercisePickerModal from "../components/ExercisePickerModal.vue";
import ExerciseDetailModal from "../components/ExerciseDetailModal.vue";
import CycleEditorModal from "../components/CycleEditorModal.vue";
import WorkoutSummaryModal from "../components/WorkoutSummaryModal.vue";
import HonorShowcaseModal from "../components/HonorShowcaseModal.vue";
import BodyMetricsModal from "../components/BodyMetricsModal.vue";
import ExerciseImage from "../components/ExerciseImage.vue";

// State
const showAddExerciseModal = ref(false);
const showSwapModal = ref(false);
const swapTargetIdx = ref(null);
const showExerciseDetailModal = ref(false);
const selectedExerciseDetail = ref(null);
const showCycleEditorModal = ref(false);
const showPlanPicker = ref(false);
const showSummaryModal = ref(false);
const latestSummary = ref(null);
const showAutoFinishModal = ref(false);
const showHonorModal = ref(false);
const showBodyModal = ref(false);

const honorData = computed(() => getFullHonorProfile());

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

const currentPlan = computed(() => {
  const tp = getTodayPlan();
  return tp.plan;
});

const todayTotalSets = computed(() => {
  if (!currentPlan.value?.exercises) return 0;
  return currentPlan.value.exercises.reduce((sum, ex) => sum + (Number(ex.setsCount) || 3), 0);
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
      timeStr,
      subText: `距上次训练已过 ${timeStr} · 肌原纤维超量合成中`
    };
  } else if (diffHours < 48) {
    return {
      hasHistory: true,
      badge: "🔥 黄金战备",
      title: "精力已满血",
      urgencyLevel: "ready",
      timeStr,
      subText: `距上次训练已过 ${timeStr} · 神经与肌糖原已充沛，适宜重装开练！`
    };
  } else if (diffHours < 72) {
    return {
      hasHistory: true,
      badge: "⚠️ 催练警报",
      title: "神经募集下降中",
      urgencyLevel: "warn",
      timeStr,
      subText: `你已经 ${timeStr} 没练了！募集感正在衰减，建议立即归队！`
    };
  } else {
    return {
      hasHistory: true,
      badge: "🚨 严重怠惰",
      title: "枪膛已冷 · 速速开练",
      urgencyLevel: "danger",
      timeStr,
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
      status: "休息与超量恢复",
      desc: "今日为预设休息日 · 中枢神经与大肌群正在修复，可记录休息打卡"
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
      desc: `暂无上次【${shortName}】历史记录 · 立即开练建立首训力量基准！`
    };
  }

  const logTime = matchLog.completedAt || (new Date(matchLog.date).getTime()) || (Date.now() - 86400000 * 2);
  const diffMs = Math.max(0, nowTimestamp.value - logTime);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remHours = diffHours % 24;
  
  const timeLabel = diffDays > 0 ? `${diffDays}天前` : `${diffHours}小时前`;
  const recoveryPercent = Math.min(100, Math.round((diffHours / 48) * 100));

  if (recoveryPercent >= 100) {
    return {
      status: "100% 满血复活",
      desc: `上次【${shortName}】是 ${timeLabel} · 靶向肌群已 100% 超量重组完成，蓄势待发！`
    };
  } else {
    return {
      status: `恢复度 ${recoveryPercent}%`,
      desc: `上次【${shortName}】是 ${timeLabel} · 恢复度 ${recoveryPercent}% (深层纤维修复中)`
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
  }
}

function startCustomPlan(planId) {
  showPlanPicker.value = false;
  startWorkout(planId);
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
    const curW = Number(s.weight) || 0;
    const curR = Number(s.reps) || 0;
    if (curW > 0 || curR > 0) {
      return {
        type: "initial",
        label: "📍 首训建档中",
        prevText: "首训档案：记录初始能力",
        isInitial: true
      };
    }
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
      label: `+${diff}次 超负荷`,
      prevText: `上次: ${prevW}kg × ${prevR}`,
      isOverload: true,
      diffVal: diff
    };
  } else if (curW < prevW && curW > 0) {
    const diff = (prevW - curW).toFixed(1).replace(/\.0$/, "");
    return {
      type: "lighter",
      label: `-${diff}kg 调整`,
      prevText: `上次: ${prevW}kg × ${prevR}`,
      isLighter: true
    };
  } else if (curW === prevW && curR === prevR && curW > 0) {
    return {
      type: "matched",
      label: "✓ 达成基准",
      prevText: `上次: ${prevW}kg × ${prevR}`,
      isMatched: true
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
