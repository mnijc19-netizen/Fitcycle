<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">

    
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
            <div v-for="(s, sIdx) in ex.sets" :key="s.id || sIdx"
                 class="grid grid-cols-12 gap-1.5 items-center p-1.5 rounded-xl transition-all"
                 :class="[s.completed ? 'bg-emerald-950/20 border border-emerald-500/30' : 'bg-zinc-950/70 border border-zinc-800/60']">
              
              <!-- Set index -->
              <div class="col-span-2 flex items-center gap-1">
                <span class="w-6 h-6 rounded-lg bg-zinc-800 text-xs font-mono font-bold text-zinc-300 flex items-center justify-center">
                  {{ sIdx + 1 }}
                </span>
                <button v-if="ex.sets.length > 1 && !s.completed" 
                        @click="removeSet(exIdx, sIdx)" 
                        class="text-zinc-600 hover:text-red-400 text-xs">
                  -
                </button>
              </div>

              <!-- Weight Input + Quick Adjust -->
              <div class="col-span-4 flex items-center bg-zinc-900 border border-zinc-700/70 rounded-lg overflow-hidden">
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
                        class="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
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
    <!-- MODE 2: OVERVIEW & START (未开始训练状态) -->
    <!-- ============================================== -->
    <div v-else class="space-y-4">
      
      <!-- Top Cycle Track / Timeline Pill -->
      <div class="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-xl">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <span>🔄</span> {{ store.activeCycle.name }}
          </div>
          <button @click="openCycleEditor" class="text-xs text-amber-400 hover:text-amber-300 font-medium">
            调整分化 ❯
          </button>
        </div>

        <!-- 4-day / N-day Cycle Timeline rail -->
        <div class="grid grid-cols-4 gap-2">
          <div v-for="(day, idx) in store.activeCycle.days" :key="idx"
               @click="setTodayAsIndex(idx)"
               class="p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative"
               :class="[
                 todayCycle.cycleIndex === idx ? 
                 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/25 font-bold ring-2 ring-amber-400/40' : 
                 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:border-zinc-700'
               ]">
            <div class="text-[10px] opacity-75 font-mono">Day {{ idx + 1 }}</div>
            <div class="text-sm font-black my-0.5">{{ day.shortName || (day.isRest ? '休' : '练') }}</div>
            <div class="text-[9px] truncate opacity-80">{{ day.name.split(' ')[0] }}</div>
            <div v-if="todayCycle.cycleIndex === idx" 
                 class="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-zinc-950 text-amber-400 rounded-full text-[8px] font-black border border-amber-400">
              今日
            </div>
          </div>
        </div>

        <!-- Shift forward / backward helper -->
        <div class="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <button @click="shiftCycle(-1)" class="hover:text-white flex items-center gap-1">
            ◀ 前移1天
          </button>
          <span class="text-zinc-500 text-[11px]">点击上方卡片可直接切换今日进度</span>
          <button @click="shiftCycle(1)" class="hover:text-white flex items-center gap-1">
            后推1天 ▶
          </button>
        </div>
      </div>

      <!-- Today's Workout Hero Card -->
      <div class="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border rounded-3xl p-5 shadow-2xl relative overflow-hidden"
           :class="[
             todayCycle.isRest ? 'border-emerald-500/40' : 'border-amber-500/40'
           ]">
        
        <!-- Background Ambient Glow -->
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
             :class="[todayCycle.isRest ? 'bg-emerald-400' : 'bg-amber-400']"></div>

        <!-- Badge -->
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide"
                :class="[
                  todayCycle.color === 'amber' ? 'bg-amber-500 text-zinc-950' :
                  todayCycle.color === 'sky' ? 'bg-sky-500 text-zinc-950' :
                  todayCycle.color === 'purple' ? 'bg-purple-500 text-white' :
                  'bg-emerald-500 text-zinc-950'
                ]">
            {{ todayCycle.name }}
          </span>

          <span class="text-xs text-zinc-400 font-mono">
            {{ todayFormatted }}
          </span>
        </div>

        <!-- Today Plan Title & Goal -->
        <div class="mt-4 mb-5">
          <h1 class="text-xl font-black text-white tracking-tight leading-snug">
            {{ currentPlan?.name }}
          </h1>
          <p class="text-xs text-zinc-300 mt-1.5 flex items-start gap-1 leading-relaxed">
            <span class="text-amber-400 flex-shrink-0 font-bold">目标:</span>
            <span>{{ currentPlan?.coreTarget || "按计划严格执行，注重动作质量与拉伸区肥大" }}</span>
          </p>
        </div>

        <!-- Preview of exercises in this plan -->
        <div v-if="!todayCycle.isRest && currentPlan?.exercises?.length" class="space-y-1.5 mb-5">
          <div class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>计划动作 ({{ currentPlan.exercises.length }} 个)</span>
            <span class="text-[10px] text-zinc-500">点击🔬查看发力细节</span>
          </div>

          <div v-for="(ex, idx) in currentPlan.exercises" :key="idx"
               @click="openExerciseDetailByName(ex.name)"
               class="p-2.5 bg-zinc-950/70 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <!-- Mini 3D Thumbnail -->
              <ExerciseImage :src="getExerciseGif(ex.name)" 
                             :name="ex.name" 
                             :category="ex.category" 
                             :target="ex.targetReps" 
                             customClass="w-9 h-9 rounded-lg border border-zinc-800 flex-shrink-0" />
              <span class="font-medium text-zinc-200 truncate">{{ ex.name }}</span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-[11px] text-amber-400/90 font-mono">{{ ex.setsCount }}组 × {{ ex.targetReps }}</span>
              <span class="text-amber-400 text-xs">🔬</span>
            </div>
          </div>


        </div>

        <!-- Rest Day Inspiration Card -->
        <div v-else-if="todayCycle.isRest" class="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl mb-5 space-y-2">
          <div class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span>🌿</span> 超量恢复日（肌肉生长在休息中）
          </div>
          <p class="text-xs text-zinc-300 leading-relaxed">
            今天为中枢神经系统和肌纤维提供充分修复时间。建议保证 7-8 小时高质量睡眠，摄入充足水分与优质蛋白质。
          </p>
        </div>

        <!-- Main Action CTA -->
        <div class="space-y-2">
          <button v-if="!todayCycle.isRest" 
                  @click="handleStartTodayWorkout"
                  class="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2">
            <span>🚀</span> 开始今日训练打卡
          </button>

          <button v-else 
                  @click="markRestDayCompleted"
                  class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2">
            <span>✅</span> 记录今日休息完成
          </button>

          <!-- Secondary Actions -->
          <div class="flex items-center gap-2 pt-1">
            <button @click="showPlanPicker = true" 
                    class="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold border border-zinc-700/60 active:scale-95 transition-all">
              选择其它计划训练
            </button>
            <button @click="startEmptyWorkout" 
                    class="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold border border-zinc-700/60 active:scale-95 transition-all">
              自由空白训练
            </button>
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
    <div v-if="showPlanPicker" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div class="bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 space-y-3 animate-in slide-in-from-bottom duration-200">
        <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h3 class="text-base font-bold text-zinc-100">选择计划开始训练</h3>
          <button @click="showPlanPicker = false" class="p-1.5 bg-zinc-800 rounded-full text-zinc-400">✕</button>
        </div>
        <div class="space-y-2 max-h-80 overflow-y-auto">
          <div v-for="p in store.plans" :key="p.id"
               @click="startCustomPlan(p.id)"
               class="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-2xl cursor-pointer flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-zinc-100">{{ p.name }}</div>
              <div class="text-[11px] text-zinc-400 mt-0.5">{{ p.coreTarget }}</div>
            </div>
            <button class="px-3 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs">
              开始
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Summary modal -->
    <WorkoutSummaryModal 
      :visible="showSummaryModal" 
      :summary="latestSummary" 
      @close="showSummaryModal = false" 
    />

    <!-- 7. Auto Workout Finish Celebration Modal (智能防漏结算与加练弹窗) -->
    <div v-if="showAutoFinishModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="showAutoFinishModal = false"></div>
      <div class="relative w-full max-w-sm bg-zinc-950 border border-amber-500/50 rounded-3xl p-5 shadow-2xl space-y-3.5 text-center animate-in zoom-in-95 duration-200">
        <div class="w-13 h-13 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
          🏆
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-black text-white">所有动作组已全部达成！</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">
            今日计划共 {{ completedSetsCount }} 组打卡完毕！已自动生成今日表现 AI 深度分析。
          </p>
        </div>

        <!-- Primary Action: Save & Review -->
        <button @click="showAutoFinishModal = false; handleFinishWorkout();"
                class="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5">
          <span>💾</span> 立即结算保存并查看 AI 战绩
        </button>

        <!-- Quick Add-On Workout Chips (小块加练选项) -->
        <div class="pt-1 space-y-2 text-left border-t border-zinc-800/80">
          <div class="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
            <span>💥</span> 还想再泵一会儿？快捷加练:
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <button @click="quickAddFinalSet"
                    class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5">
              <span>➕</span> 最后一项力竭1组
            </button>
            <button @click="quickAddCoreExercises"
                    class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5">
              <span>⚡</span> 核心强化 3组
            </button>
            <button @click="quickAddPumpExercises"
                    class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5">
              <span>💪</span> 臂肩力竭泵感 3组
            </button>
            <button @click="quickOpenPicker"
                    class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 rounded-xl text-[11px] text-zinc-300 font-medium active:scale-95 transition-all flex items-center gap-1.5">
              <span>📖</span> 打开动作库任选
            </button>
          </div>
        </div>

        <button @click="showAutoFinishModal = false"
                class="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 transition-colors">
          稍后再说 / 留在当前页
        </button>
      </div>
    </div>

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
  uid
} from "../store/fitnessStore.js";
import ExercisePickerModal from "../components/ExercisePickerModal.vue";
import ExerciseDetailModal from "../components/ExerciseDetailModal.vue";
import CycleEditorModal from "../components/CycleEditorModal.vue";
import WorkoutSummaryModal from "../components/WorkoutSummaryModal.vue";
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

const todayFormatted = computed(() => {
  const d = new Date();
  return `${d.getMonth() + 1}月${d.getDate()}日`;
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

function toggleSet(exIdx, sIdx) {
  toggleSetCompletion(exIdx, sIdx);
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
