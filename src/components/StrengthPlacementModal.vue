<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden touch-none"
         style="padding-top: max(env(safe-area-inset-top, 0px), 16px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 16px);"
         @click.self="$emit('close')">
      
      <!-- Modal Container: Fixed Max Height, Flex Col to ensure Header & Footer are always pinned and visible -->
      <div class="relative w-full max-w-lg max-h-[88vh] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 transition-all overflow-x-hidden"
           style="touch-action: pan-y; max-width: min(480px, calc(100vw - 24px)); box-sizing: border-box;"
           :class="store.settings.themeMode === 'light'
             ? 'bg-white/98 border-slate-200 text-slate-900 shadow-slate-300/50'
             : 'bg-[#0C0F17]/98 border-zinc-800 text-white shadow-black/80'">
        
        <!-- Pinned Header -->
        <div class="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b"
             :class="store.settings.themeMode === 'light' ? 'border-slate-100 bg-white/60' : 'border-zinc-800/80 bg-zinc-900/40'">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
                 :class="store.settings.themeMode === 'light' ? 'bg-amber-500/15 text-amber-700' : 'bg-amber-500/20 text-amber-400'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-black tracking-tight"
                  :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
                力量水平与初始重量定级
              </h2>
              <p class="text-xs mt-0.5"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                按生理指标与体能感知自适应测算，免记具体公斤数
              </p>
            </div>
          </div>

          <button @click="$emit('close')" 
                  title="关闭"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all active:scale-90 cursor-pointer"
                  :class="store.settings.themeMode === 'light' 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-500' 
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white'">
            ✕
          </button>
        </div>

        <!-- Mode Segmented Control (四大专业通道) -->
        <div class="px-4 sm:px-5 pt-3 flex-shrink-0">
          <div class="p-1 rounded-2xl border flex items-center gap-1 text-xs font-bold"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'">
            <button type="button" @click="activeMode = 'veteran'"
                    class="flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    :class="activeMode === 'veteran'
                      ? (store.settings.themeMode === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'bg-zinc-800 text-amber-400 shadow-xs')
                      : (store.settings.themeMode === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200')">
              <span>老铁报数</span>
            </button>
            <button type="button" @click="activeMode = 'blank'"
                    class="flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    :class="activeMode === 'blank'
                      ? (store.settings.themeMode === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'bg-zinc-800 text-amber-400 shadow-xs')
                      : (store.settings.themeMode === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200')">
              <span>纯白板</span>
            </button>
            <button type="button" @click="activeMode = 'novice'"
                    class="flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    :class="activeMode === 'novice'
                      ? (store.settings.themeMode === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'bg-zinc-800 text-amber-400 shadow-xs')
                      : (store.settings.themeMode === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200')">
              <span>新手自适应</span>
            </button>
            <button type="button" @click="activeMode = 'metabolic'"
                    class="flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    :class="activeMode === 'metabolic'
                      ? (store.settings.themeMode === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'bg-zinc-800 text-amber-400 shadow-xs')
                      : (store.settings.themeMode === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200')">
              <span>生理代谢</span>
            </button>
          </div>
        </div>

        <!-- Scrollable Fluid Body Container -->
        <div class="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5 no-scrollbar">
          
          <!-- System Impact Explainer Card (为什么要做这个定级？后续到底有啥用？) -->
          <div class="p-3 rounded-2xl border space-y-2"
               :class="store.settings.themeMode === 'light'
                 ? 'bg-amber-50/70 border-amber-200/90 text-slate-800'
                 : 'bg-amber-500/10 border-amber-500/30 text-zinc-200'">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>这个定级对你后续训练到底有啥用？</span>
              </span>
              <span class="text-xs text-zinc-400 font-bold">核心价值</span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs leading-relaxed">
              <div class="flex items-start gap-1.5">
                <span class="text-amber-400 font-bold">1.</span>
                <div>
                  <span class="font-bold block text-zinc-100">开练免试重：</span>
                  <span class="text-xs text-zinc-400">9大动作默认预填你的主力做工，告别每次试空杆</span>
                </div>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-amber-400 font-bold">2.</span>
                <div>
                  <span class="font-bold block text-zinc-100">段位免重爬：</span>
                  <span class="text-xs text-zinc-400">按真实水平直接授予黄金/钻石，老手不从青铜熬</span>
                </div>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-amber-400 font-bold">3.</span>
                <div>
                  <span class="font-bold block text-zinc-100">PR 突破基准：</span>
                  <span class="text-xs text-zinc-400">以此为锚点，只要加重 2.5kg 自动触发金色高光庆祝</span>
                </div>
              </div>
              <div class="flex items-start gap-1.5">
                <span class="text-amber-400 font-bold">4.</span>
                <div>
                  <span class="font-bold block text-zinc-100">超量恢复感知：</span>
                  <span class="text-xs text-zinc-400">AI 测算中枢神经负荷，精准把控 0~72h 恢复倒计时</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TRACK 1: 老铁直接报数 (Core Lifts Direct Input) -->
          <!-- ============================================== -->
          <div v-show="activeMode === 'veteran'" class="space-y-3.5">
            <!-- Gender & Bodyweight quick bar -->
            <div class="p-2.5 rounded-2xl border flex items-center justify-between gap-2"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50/80 border-slate-200' : 'bg-zinc-900/60 border-zinc-800/80'">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-zinc-300">生理基准</span>
                <div class="flex items-center bg-zinc-950 p-0.5 rounded-xl border border-zinc-800 text-xs font-bold">
                  <button type="button" @click="setGender('male')"
                          class="px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                          :class="form.gender === 'male' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-zinc-400'">
                    男
                  </button>
                  <button type="button" @click="setGender('female')"
                          class="px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                          :class="form.gender === 'female' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-zinc-400'">
                    女
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-1.5 font-mono">
                <span class="text-xs font-bold text-amber-400">{{ form.userWeight }} kg 体重</span>
                <div class="flex items-center gap-0.5">
                  <button type="button" @click="form.userWeight = Math.max(35, form.userWeight - 2.5)"
                          class="w-5 h-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs active:scale-90 cursor-pointer">−</button>
                  <button type="button" @click="form.userWeight = Math.min(180, form.userWeight + 2.5)"
                          class="w-5 h-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs active:scale-90 cursor-pointer">+</button>
                </div>
              </div>
            </div>

            <!-- 3 Core Exercises Direct Inputs -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-zinc-200">
                  平时主力做工重量 (非极限1RM，通常6~10次组重)：
                </span>
                <span class="text-xs text-amber-400 font-mono">点击刻度秒填</span>
              </div>

              <!-- Bench Press Input -->
              <div class="p-2.5 rounded-xl border bg-zinc-900/80 border-zinc-800 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <span>常用推胸 / 卧推做工</span>
                  </span>
                  <div class="flex items-center gap-1">
                    <input v-model.number="customBases.bench" type="number" step="2.5" 
                           class="w-16 text-center font-mono font-black text-sm p-1 rounded-lg border bg-zinc-950 border-zinc-700 text-amber-400 focus:border-amber-500 outline-none" />
                    <span class="text-xs font-bold text-zinc-400">kg</span>
                  </div>
                </div>
                <!-- Quick scale chips -->
                <div class="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
                  <span class="text-xs text-zinc-500 flex-shrink-0">常做刻度:</span>
                  <button v-for="w in [30, 50, 70, 90, 110, 130]" :key="w"
                          type="button" @click="customBases.bench = w"
                          class="px-2 py-0.5 rounded-md text-xs font-mono font-bold border transition-all cursor-pointer flex-shrink-0"
                          :class="customBases.bench === w ? 'bg-amber-500 text-zinc-950 border-amber-400' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-700'">
                    {{ w }}kg
                  </button>
                </div>
              </div>

              <!-- Squat / Leg Press Input -->
              <div class="p-2.5 rounded-xl border bg-zinc-900/80 border-zinc-800 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <span>常用深蹲 / 腿举做工</span>
                  </span>
                  <div class="flex items-center gap-1">
                    <input v-model.number="customBases.squat" type="number" step="5" 
                           class="w-16 text-center font-mono font-black text-sm p-1 rounded-lg border bg-zinc-950 border-zinc-700 text-amber-400 focus:border-amber-500 outline-none" />
                    <span class="text-xs font-bold text-zinc-400">kg</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
                  <span class="text-xs text-zinc-500 flex-shrink-0">常做刻度:</span>
                  <button v-for="w in [40, 70, 100, 130, 160, 200]" :key="w"
                          type="button" @click="customBases.squat = w"
                          class="px-2 py-0.5 rounded-md text-xs font-mono font-bold border transition-all cursor-pointer flex-shrink-0"
                          :class="customBases.squat === w ? 'bg-amber-500 text-zinc-950 border-amber-400' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-700'">
                    {{ w }}kg
                  </button>
                </div>
              </div>

              <!-- Lat Pulldown / Pull Input -->
              <div class="p-2.5 rounded-xl border bg-zinc-900/80 border-zinc-800 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <span>常用下拉 / 划船做工</span>
                  </span>
                  <div class="flex items-center gap-1">
                    <input v-model.number="customBases.pull" type="number" step="2.5" 
                           class="w-16 text-center font-mono font-black text-sm p-1 rounded-lg border bg-zinc-950 border-zinc-700 text-amber-400 focus:border-amber-500 outline-none" />
                    <span class="text-xs font-bold text-zinc-400">kg</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
                  <span class="text-xs text-zinc-500 flex-shrink-0">常做刻度:</span>
                  <button v-for="w in [30, 45, 60, 75, 90, 105]" :key="w"
                          type="button" @click="customBases.pull = w"
                          class="px-2 py-0.5 rounded-md text-xs font-mono font-bold border transition-all cursor-pointer flex-shrink-0"
                          :class="customBases.pull === w ? 'bg-amber-500 text-zinc-950 border-amber-400' : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-700'">
                    {{ w }}kg
                  </button>
                </div>
              </div>
            </div>

            <!-- Derived Plan Weights Output Grid -->
            <div class="p-3 rounded-2xl border space-y-2 bg-gradient-to-br from-amber-500/15 via-zinc-900/90 to-zinc-950 border-amber-500/40">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>按力学比例为你换算的计划起步组重</span>
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {{ veteranPredictedRank.badge }}
                </span>
              </div>

              <div class="grid grid-cols-3 gap-2 text-center font-mono">
                <div class="p-2 rounded-xl border bg-zinc-950/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">上斜哑铃推胸</span>
                  <span class="text-xs font-black text-amber-400">{{ derivedVeteranWeights.inclineDb }} kg/只</span>
                </div>
                <div class="p-2 rounded-xl border bg-zinc-950/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">哈克深蹲/腿举</span>
                  <span class="text-xs font-black text-amber-400">{{ derivedVeteranWeights.hackSquat }} kg</span>
                </div>
                <div class="p-2 rounded-xl border bg-zinc-950/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">高位下拉</span>
                  <span class="text-xs font-black text-amber-400">{{ derivedVeteranWeights.latPull }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TRACK 2: 纯白板开练 (Zero Guessing / Free Log) -->
          <!-- ============================================== -->
          <div v-show="activeMode === 'blank'" class="space-y-3">
            <div class="p-4 rounded-2xl border bg-zinc-900/90 border-zinc-800 space-y-3">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-amber-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-black text-white">纯白板模式 · 由我自主记录</h3>
                  <p class="text-xs text-zinc-400">适合对自己的训练动作与重量有绝对掌控的老铁</p>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs text-zinc-300 leading-relaxed">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>计划中所有动作的初始组重将<strong>全部留空 (0kg)</strong>，绝不主观猜测；</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>今天开练时你做多少就记多少，系统会自动存入<strong>常用动作记忆池</strong>；</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>下次再做该动作时，自动 100% 预填你上一次的最佳做工。</span>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border bg-amber-500/10 border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
                <span>战力天梯初始锚定：</span>
                <span class="font-mono font-bold">黄金筑基 (1000 PTS)</span>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TRACK 3: 新手自适应 (Novice Intuitive Safe Presets) -->
          <!-- ============================================== -->
          <div v-show="activeMode === 'novice'" class="space-y-3">
            <div class="space-y-2">
              <span class="text-xs font-black text-zinc-200 block">
                选择你的抗阻训练经验档位：
              </span>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" v-for="lvl in experienceLevels" :key="lvl.id"
                        @click="form.experienceLevel = lvl.id; syncNoviceTier(lvl.id)"
                        class="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
                        :class="form.experienceLevel === lvl.id ? 'bg-amber-500/15 border-amber-500 text-amber-400 ring-1 ring-amber-500/40' : 'bg-zinc-900/70 border-zinc-800 text-zinc-400'">
                  <div class="text-xs font-black">{{ lvl.name }}</div>
                  <div class="text-xs text-zinc-500 mt-0.5">{{ lvl.badge }}</div>
                </button>
              </div>
            </div>

            <!-- Intuitive pushup & squat perceptions -->
            <div class="grid grid-cols-2 gap-2">
              <div class="p-2.5 rounded-xl border bg-zinc-900/80 border-zinc-800 space-y-1.5">
                <span class="text-xs font-bold text-zinc-400 block">连续俯卧撑数量</span>
                <div class="grid grid-cols-2 gap-1">
                  <button v-for="p in pushupTiers" :key="p.id"
                          type="button" @click="form.pushupTier = p.id"
                          class="p-1.5 rounded text-xs border transition-all text-center"
                          :class="form.pushupTier === p.id ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'">
                    {{ p.name }}
                  </button>
                </div>
              </div>

              <div class="p-2.5 rounded-xl border bg-zinc-900/80 border-zinc-800 space-y-1.5">
                <span class="text-xs font-bold text-zinc-400 block">深蹲/爬楼腿力</span>
                <div class="grid grid-cols-3 gap-1">
                  <button v-for="s in squatTiers" :key="s.id"
                          type="button" @click="form.squatTier = s.id"
                          class="p-1.5 rounded text-xs border transition-all text-center"
                          :class="form.squatTier === s.id ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-950 text-zinc-400 border-zinc-800'">
                    {{ s.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Novice Calculated Weights -->
            <div class="p-3 rounded-2xl border space-y-2 bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 border-amber-500/30">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>为你推导的科学安全起步组重</span>
                </span>
                <span class="text-xs text-zinc-400">空杆与轻哑铃优先</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center font-mono">
                <div class="p-2 rounded-xl border bg-zinc-950/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">上斜哑铃推胸</span>
                  <span class="text-xs font-black text-amber-400">{{ adaptiveWeights.weightsMap['上斜哑铃卧推'] }} kg/只</span>
                </div>
                <div class="p-2 rounded-xl border bg-zinc-950/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">哈克腿举/深蹲</span>
                  <span class="text-xs font-black text-amber-400">{{ adaptiveWeights.weightsMap['哈克深蹲 / 倒蹬腿举'] }} kg</span>
                </div>
                <div class="p-2 rounded-xl border bg-zinc-950/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">高位下拉</span>
                  <span class="text-xs font-black text-amber-400">{{ adaptiveWeights.weightsMap['对握/宽握高位下拉'] }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- TRACK 4: 精准生理与代谢基准 (医学指标与测试断言) -->
          <!-- ============================================== -->
          <div v-show="activeMode === 'metabolic'" class="space-y-3.5">
            <!-- SECTION 1: 生理指标与代谢基准 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black flex items-center gap-1.5 text-zinc-200">
                  <svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span>生理指标与代谢基准</span>
                </span>
                <span class="text-xs text-zinc-400">影响相对力量系数与打卡能耗</span>
              </div>

              <!-- Height, Weight, Age Row -->
              <div class="grid grid-cols-3 gap-2">
                <div class="p-2 rounded-xl border text-center bg-zinc-900/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">身高 (cm)</span>
                  <div class="flex items-center justify-center gap-1 mt-0.5">
                    <button type="button" @click="form.userHeight = Math.max(130, form.userHeight - 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-zinc-800 text-zinc-300 cursor-pointer">−</button>
                    <span class="font-mono font-black text-xs">{{ form.userHeight }}</span>
                    <button type="button" @click="form.userHeight = Math.min(230, form.userHeight + 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-zinc-800 text-zinc-300 cursor-pointer">+</button>
                  </div>
                </div>

                <div class="p-2 rounded-xl border text-center ring-1 ring-amber-500/30 bg-amber-500/5 border-amber-500/40">
                  <span class="text-xs block font-bold text-amber-500">体重 (kg)</span>
                  <div class="flex items-center justify-center gap-1 mt-0.5">
                    <button type="button" @click="form.userWeight = Math.max(35, Number((form.userWeight - 1).toFixed(1)))"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-zinc-800 text-amber-300 cursor-pointer">−</button>
                    <span class="font-mono font-black text-xs text-amber-400">{{ form.userWeight }}</span>
                    <button type="button" @click="form.userWeight = Math.min(200, Number((form.userWeight + 1).toFixed(1)))"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-zinc-800 text-amber-300 cursor-pointer">+</button>
                  </div>
                </div>

                <div class="p-2 rounded-xl border text-center bg-zinc-900/80 border-zinc-800">
                  <span class="text-xs block text-zinc-400">年龄 (岁)</span>
                  <div class="flex items-center justify-center gap-1 mt-0.5">
                    <button type="button" @click="form.userAge = Math.max(16, form.userAge - 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-zinc-800 text-zinc-300 cursor-pointer">−</button>
                    <span class="font-mono font-black text-xs">{{ form.userAge }}</span>
                    <button type="button" @click="form.userAge = Math.min(90, form.userAge + 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-zinc-800 text-zinc-300 cursor-pointer">+</button>
                  </div>
                </div>
              </div>

              <!-- Core Training Goal Selector (增肌塑形 / 刷脂精修 / 力量进阶) -->
              <div class="space-y-1.5 pt-1">
                <div class="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>当前主修目标:</span>
                  <span class="text-amber-400 font-mono text-xs">{{ form.trainingGoal === 'fat_loss' ? '保肌减脂 / 肌肉精修' : (form.trainingGoal === 'strength' ? '力量举 / 突破极量' : '纯粹肌肥大增肌') }}</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5">
                  <button type="button" @click="form.trainingGoal = 'hypertrophy'"
                          class="py-2 px-1 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1"
                          :class="form.trainingGoal === 'hypertrophy' ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-md' : 'bg-zinc-900 border-zinc-800 text-zinc-400'">
                    <span>💪</span> 增肌塑形
                  </button>
                  <button type="button" @click="form.trainingGoal = 'fat_loss'"
                          class="py-2 px-1 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1"
                          :class="form.trainingGoal === 'fat_loss' ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-md' : 'bg-zinc-900 border-zinc-800 text-zinc-400'">
                    <span>🔥</span> 刷脂减重
                  </button>
                  <button type="button" @click="form.trainingGoal = 'strength'"
                          class="py-2 px-1 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1"
                          :class="form.trainingGoal === 'strength' ? 'bg-amber-500 text-zinc-950 border-amber-400 font-black shadow-md' : 'bg-zinc-900 border-zinc-800 text-zinc-400'">
                    <span>⚡</span> 力量进阶
                  </button>
                </div>
              </div>

              <!-- Instant Metabolic & Nutrition Card -->
              <div class="p-3 rounded-2xl border space-y-2 shadow-sm bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-900 border-amber-500/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span class="text-xs font-black text-amber-300">
                      个人代谢基线 (Mifflin-St Jeor)
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5 text-xs font-mono">
                    <span class="text-zinc-400">BMI {{ bmi }}</span>
                    <span class="px-2 py-0.5 rounded-full border text-xs font-bold"
                          :class="bmiCategory.badgeBg + ' ' + bmiCategory.color">{{ bmiCategory.label }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-1.5 font-mono text-center pt-0.5">
                  <div class="p-2 rounded-lg border bg-zinc-950/80 border-zinc-800">
                    <span class="text-xs block text-zinc-400">基础代谢 (BMR)</span>
                    <span class="text-xs font-black text-amber-400">{{ bmr }} <span class="text-xs font-normal">kcal</span></span>
                  </div>
                  <div class="p-2 rounded-lg border bg-zinc-950/80 border-zinc-800">
                    <span class="text-xs block text-zinc-400">每日总消耗(TDEE)</span>
                    <span class="text-xs font-black text-zinc-200">{{ tdee }} <span class="text-xs font-normal">kcal</span></span>
                  </div>
                  <div class="p-2 rounded-lg border bg-zinc-950/80 border-zinc-800">
                    <span class="text-xs block text-zinc-400">每日建议蛋白质</span>
                    <span class="text-xs font-black text-emerald-400">{{ macros.dailyProteinTargetGrams }} <span class="text-xs font-normal">g</span></span>
                  </div>
                </div>
              </div>

              <!-- Direct Kg Input Option (自定义我常做的核心重量) -->
              <div class="pt-2 border-t border-zinc-800">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-zinc-300">自定义我常做的核心重量</span>
                  <span class="text-xs text-amber-400 font-mono">老铁报数已自动同步</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Pinned Sticky Modal Footer with Action Buttons -->
        <div class="flex-shrink-0 p-4 sm:p-5 border-t flex items-center gap-2.5 relative z-10"
             :class="store.settings.themeMode === 'light' ? 'border-slate-100 bg-white/95' : 'border-zinc-800/80 bg-[#0C0F17]/95'">
          <button @click="$emit('close')" 
                  class="w-1/3 py-3 rounded-xl border text-xs font-bold active:scale-95 transition-all cursor-pointer text-center"
                  :class="store.settings.themeMode === 'light' 
                    ? 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700' 
                    : 'border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'">
            取消
          </button>
          <button @click="applyPlacement" 
                  class="flex-1 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer text-center select-none">
            确认并应用全计划起步重量
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted } from "vue";
import { store, saveUserProfileAndRecalibrate } from "../store/fitnessStore.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { 
  calculateBMI, 
  getBMICategory, 
  calculateBMR, 
  calculateTDEE, 
  calculateMacroTargets, 
  calculateAdaptiveWeights 
} from "../engine/bodyProfileEngine.js";

const props = defineProps({
  visible: { type: Boolean, default: false }
});

const emit = defineEmits(["close", "applied"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const activeMode = ref("veteran"); // 'veteran' | 'blank' | 'novice' | 'metabolic'
const showCustomMode = ref(true);

const form = reactive({
  gender: store.settings.gender || "male",
  userAge: store.settings.userAge || 25,
  userHeight: store.settings.userHeight || 175,
  userWeight: store.settings.userWeight || 75,
  trainingGoal: store.settings.trainingGoal || "hypertrophy",
  pushupTier: store.settings.pushupTier || "basic",
  squatTier: store.settings.squatTier || "natural",
  experienceLevel: store.settings.strengthLevel === "custom" ? "intermediate" : (store.settings.strengthLevel || "intermediate")
});

const customBases = reactive({
  bench: store.settings.customBaseWeights?.bench || 80,
  squat: store.settings.customBaseWeights?.squat || 110,
  pull: store.settings.customBaseWeights?.pull || 65
});

// Veteran derived weights calculation
const derivedVeteranWeights = computed(() => {
  const b = Number(customBases.bench) || 50;
  const s = Number(customBases.squat) || 70;
  const p = Number(customBases.pull) || 45;
  return {
    inclineDb: Math.max(5, Math.round(b * 0.35 / 2.5) * 2.5),
    chestMachine: Math.max(10, Math.round(b * 0.85 / 2.5) * 2.5),
    hackSquat: Math.max(20, Math.round(s * 0.9 / 5) * 5),
    latPull: Math.max(10, Math.round(p * 0.9 / 2.5) * 2.5)
  };
});

// Veteran predicted rank
const veteranPredictedRank = computed(() => {
  const b = Number(customBases.bench) || 50;
  const s = Number(customBases.squat) || 70;
  if (b >= 100 || s >= 140) {
    return { badge: "璀璨钻石 (战力 1400+)", tier: "diamond" };
  } else if (b >= 75 || s >= 100) {
    return { badge: "精锐黄金 (战力 1150+)", tier: "gold" };
  } else {
    return { badge: "坚韧白银 (战力 850+)", tier: "silver" };
  }
});

function setGender(g) {
  form.gender = g;
  if (g === "female" && form.userWeight === 75) {
    form.userWeight = 55;
    customBases.bench = 35;
    customBases.squat = 50;
    customBases.pull = 35;
  } else if (g === "male" && form.userWeight === 55) {
    form.userWeight = 75;
    customBases.bench = 80;
    customBases.squat = 110;
    customBases.pull = 65;
  }
}

function syncNoviceTier(lvlId) {
  if (lvlId === "beginner") {
    form.pushupTier = "beginner";
    form.squatTier = "sedentary";
  } else if (lvlId === "advanced") {
    form.pushupTier = "moderate";
    form.squatTier = "strong";
  } else {
    form.pushupTier = "basic";
    form.squatTier = "natural";
  }
}

// Realtime Metabolic Computeds
const bmi = computed(() => calculateBMI(form.userWeight, form.userHeight));
const bmiCategory = computed(() => getBMICategory(bmi.value));
const bmr = computed(() => calculateBMR(form.gender, form.userWeight, form.userHeight, form.userAge));
const tdee = computed(() => calculateTDEE(bmr.value, "moderate"));
const macros = computed(() => calculateMacroTargets(form.userWeight, form.trainingGoal));

// Realtime Adaptive Weights Computed
const adaptiveWeights = computed(() => {
  return calculateAdaptiveWeights({
    gender: form.gender,
    weightKg: form.userWeight,
    pushupTier: form.pushupTier,
    squatTier: form.squatTier,
    experienceLevel: form.experienceLevel
  });
});

const pushupTiers = [
  { id: "beginner", name: "刚起步", badge: "<5个", desc: "规范轨迹" },
  { id: "basic", name: "基础体能", badge: "5~15个", desc: "具备推力" },
  { id: "moderate", name: "规律训练", badge: "15~30个", desc: "发力稳健" },
  { id: "elite", name: "高阶强者", badge: ">30个", desc: "大负荷" }
];

const squatTiers = [
  { id: "sedentary", icon: "🛋️", name: "久坐偏少", desc: "轻微酸" },
  { id: "natural", icon: "🚶", name: "体态自如", desc: "连蹲自如" },
  { id: "strong", icon: "🏃", name: "强韧有力", desc: "常大负荷" }
];

const experienceLevels = [
  { id: "beginner", name: "新手入门", badge: "0~3个月" },
  { id: "intermediate", name: "进阶中坚", badge: "3~12个月" },
  { id: "advanced", name: "资深老手", badge: "1年以上" }
];

function applyPlacement() {
  if (activeMode.value === "blank") {
    saveUserProfileAndRecalibrate({
      gender: form.gender,
      userAge: form.userAge,
      userHeight: form.userHeight,
      userWeight: form.userWeight,
      trainingGoal: form.trainingGoal,
      isCleanSlate: true,
      strengthLevel: "clean_slate"
    });
    emit("applied", "clean_slate");
  } else if (activeMode.value === "veteran") {
    saveUserProfileAndRecalibrate({
      gender: form.gender,
      userAge: form.userAge,
      userHeight: form.userHeight,
      userWeight: form.userWeight,
      trainingGoal: form.trainingGoal,
      useCustom: true,
      customBases: customBases,
      strengthLevel: "custom"
    });
    emit("applied", "custom");
  } else {
    saveUserProfileAndRecalibrate({
      gender: form.gender,
      userAge: form.userAge,
      userHeight: form.userHeight,
      userWeight: form.userWeight,
      trainingGoal: form.trainingGoal,
      pushupTier: form.pushupTier,
      squatTier: form.squatTier,
      strengthLevel: form.experienceLevel,
      useCustom: false
    });
    emit("applied", form.experienceLevel);
  }

  emit("close");
}
</script>
