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
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold shadow-sm"
                 :class="store.settings.themeMode === 'light' ? 'bg-amber-500/15 text-amber-700' : 'bg-amber-500/20 text-amber-400'">
              ⚡
            </div>
            <div>
              <h2 class="text-base font-black tracking-tight"
                  :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
                力量水平与初始重量定级
              </h2>
              <p class="text-[11px] mt-0.5"
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

        <!-- Mode Segmented Control (极速定级 vs 精准深度) -->
        <div class="px-4 sm:px-5 pt-3.5 flex-shrink-0">
          <div class="p-1 rounded-2xl border flex items-center gap-1 text-xs font-bold"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'">
            <button type="button" @click="activeTab = 'quick'"
                    class="flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    :class="activeTab === 'quick'
                      ? (store.settings.themeMode === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'bg-zinc-800 text-amber-400 shadow-xs')
                      : (store.settings.themeMode === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200')">
              <span>⚡ 极速定级</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-full font-semibold"
                    :class="activeTab === 'quick' ? 'bg-amber-500/20 text-amber-400' : 'opacity-60'">3秒搞定</span>
            </button>
            <button type="button" @click="activeTab = 'detailed'"
                    class="flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    :class="activeTab === 'detailed'
                      ? (store.settings.themeMode === 'light' ? 'bg-white text-amber-600 shadow-xs' : 'bg-zinc-800 text-amber-400 shadow-xs')
                      : (store.settings.themeMode === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200')">
              <span>🧬 精准测算与代谢</span>
            </button>
          </div>
        </div>

        <!-- Scrollable Fluid Body Container -->
        <div class="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 no-scrollbar">
          
          <!-- TAB 1: 极速定级 (Zero Mental Friction - 推荐默认) -->
          <div v-show="activeTab === 'quick'" class="space-y-3.5">
            <!-- Quick Step 1: 性别与体重快速确认 -->
            <div class="p-3 rounded-2xl border flex items-center justify-between gap-3"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-50/80 border-slate-200' : 'bg-zinc-900/60 border-zinc-800/80'">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-700' : 'text-zinc-300'">基本生理</span>
                <!-- Gender toggle -->
                <div class="flex items-center bg-zinc-950 p-0.5 rounded-xl border border-zinc-800 text-[11px] font-bold">
                  <button type="button" @click="setGender('male')"
                          class="px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                          :class="form.gender === 'male' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-zinc-400'">
                    ♂ 男
                  </button>
                  <button type="button" @click="setGender('female')"
                          class="px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                          :class="form.gender === 'female' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-zinc-400'">
                    ♀ 女
                  </button>
                </div>
              </div>

              <!-- Quick weight chips / stepper -->
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-amber-400 font-mono">{{ form.userWeight }} kg</span>
                <div class="flex items-center gap-1">
                  <button type="button" @click="form.userWeight = Math.max(35, form.userWeight - 2.5)"
                          title="减少2.5kg"
                          class="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold active:scale-90 cursor-pointer">
                    −
                  </button>
                  <button type="button" @click="form.userWeight = Math.min(180, form.userWeight + 2.5)"
                          title="增加2.5kg"
                          class="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold active:scale-90 cursor-pointer">
                    +
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Step 2: 4 大力量段位卡片 (一键点选，生动直观) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">
                  选择最符合你现状的力量段位：
                </span>
                <span class="text-[10px] text-amber-500">点击卡片秒级匹配 ✨</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div v-for="archetype in archetypes" :key="archetype.id"
                     @click="selectArchetype(archetype)"
                     class="p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                     :class="[
                       selectedArchetypeId === archetype.id
                         ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/60'
                         : (store.settings.themeMode === 'light' ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200' : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-800')
                     ]">
                  <!-- Active Checkmark / Highlight -->
                  <div v-if="selectedArchetypeId === archetype.id" 
                       class="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-[10px] font-black">
                    ✓
                  </div>
                  <div v-else-if="archetype.isHot" 
                       class="absolute top-2 right-2 px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold">
                    推荐
                  </div>

                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-lg">{{ archetype.icon }}</span>
                      <div>
                        <span class="text-xs font-black block"
                              :class="selectedArchetypeId === archetype.id ? 'text-amber-300' : (store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white')">
                          {{ archetype.name }}
                        </span>
                        <span class="text-[10px] text-zinc-400 font-mono">{{ archetype.tag }}</span>
                      </div>
                    </div>

                    <p class="text-[11px] mt-2 leading-snug"
                       :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                      {{ archetype.desc }}
                    </p>
                  </div>

                  <!-- Suggested weight pill inside archetype -->
                  <div class="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px]">
                    <span class="text-zinc-500">典型起步：</span>
                    <span class="font-mono font-bold"
                          :class="selectedArchetypeId === archetype.id ? 'text-amber-400' : 'text-zinc-300'">
                      {{ archetype.sampleWeights }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Step 3: 即时推导出的计划重量成果展示 -->
            <div class="p-3.5 rounded-2xl border space-y-2"
                 :class="store.settings.themeMode === 'light'
                   ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                   : 'bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 border-amber-500/30'">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black flex items-center gap-1.5 text-amber-400">
                  <span>🎯</span>
                  <span>已为你自适应测算开练组重 (基于 {{ form.userWeight }}kg)</span>
                </span>
                <span class="text-[10px] text-zinc-400">开练直接套用</span>
              </div>

              <div class="grid grid-cols-3 gap-2 text-center font-mono">
                <div class="p-2 rounded-xl border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-zinc-800'">
                  <span class="text-[9px] block text-zinc-400">上斜哑铃推胸</span>
                  <span class="text-xs font-black text-amber-400">{{ adaptiveWeights.weightsMap['上斜哑铃卧推'] }} kg/只</span>
                </div>
                <div class="p-2 rounded-xl border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-zinc-800'">
                  <span class="text-[9px] block text-zinc-400">哈克腿举/深蹲</span>
                  <span class="text-xs font-black text-amber-400">{{ adaptiveWeights.weightsMap['哈克深蹲 / 倒蹬腿举'] }} kg</span>
                </div>
                <div class="p-2 rounded-xl border"
                     :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950/80 border-zinc-800'">
                  <span class="text-[9px] block text-zinc-400">高位下拉</span>
                  <span class="text-xs font-black text-amber-400">{{ adaptiveWeights.weightsMap['对握/宽握高位下拉'] }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: 精准自适应与生理代谢基线 (保留供深度用户调校与医学测试断言) -->
          <div v-show="activeTab === 'detailed'" class="space-y-4">
            <!-- SECTION 1: 生理指标与代谢基准 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black flex items-center gap-1.5"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">
                  <span>🧬</span>
                  <span>生理指标与代谢基准</span>
                </span>
                <span class="text-[10px]"
                      :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                  影响相对力量系数与打卡能耗
                </span>
              </div>

              <!-- Gender Buttons -->
              <div class="grid grid-cols-2 gap-2">
                <button type="button" @click="setGender('male')"
                        class="p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer"
                        :class="form.gender === 'male'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-500 shadow-sm ring-1 ring-amber-500/40'
                          : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400')">
                  <span class="text-sm">♂</span>
                  <span>男性 (Male)</span>
                </button>
                <button type="button" @click="setGender('female')"
                        class="p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer"
                        :class="form.gender === 'female'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-500 shadow-sm ring-1 ring-amber-500/40'
                          : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400')">
                  <span class="text-sm">♀</span>
                  <span>女性 (Female)</span>
                </button>
              </div>

              <!-- Height, Weight, Age Row -->
              <div class="grid grid-cols-3 gap-2">
                <!-- Height -->
                <div class="p-2 rounded-xl border text-center"
                     :class="store.settings.themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'">
                  <span class="text-[9px] block text-zinc-400">身高 (cm)</span>
                  <div class="flex items-center justify-center gap-1 mt-0.5">
                    <button type="button" @click="form.userHeight = Math.max(130, form.userHeight - 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer bg-zinc-800 text-zinc-300">−</button>
                    <span class="font-mono font-black text-xs">{{ form.userHeight }}</span>
                    <button type="button" @click="form.userHeight = Math.min(230, form.userHeight + 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer bg-zinc-800 text-zinc-300">+</button>
                  </div>
                </div>

                <!-- Weight -->
                <div class="p-2 rounded-xl border text-center ring-1 ring-amber-500/30 bg-amber-500/5 border-amber-500/40">
                  <span class="text-[9px] block font-bold text-amber-500">体重 (kg)</span>
                  <div class="flex items-center justify-center gap-1 mt-0.5">
                    <button type="button" @click="form.userWeight = Math.max(35, Number((form.userWeight - 1).toFixed(1)))"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer bg-zinc-800 text-amber-300">−</button>
                    <span class="font-mono font-black text-xs text-amber-400">{{ form.userWeight }}</span>
                    <button type="button" @click="form.userWeight = Math.min(200, Number((form.userWeight + 1).toFixed(1)))"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer bg-zinc-800 text-amber-300">+</button>
                  </div>
                </div>

                <!-- Age -->
                <div class="p-2 rounded-xl border text-center"
                     :class="store.settings.themeMode === 'light' ? 'bg-slate-50/90 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'">
                  <span class="text-[9px] block text-zinc-400">年龄 (岁)</span>
                  <div class="flex items-center justify-center gap-1 mt-0.5">
                    <button type="button" @click="form.userAge = Math.max(16, form.userAge - 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer bg-zinc-800 text-zinc-300">−</button>
                    <span class="font-mono font-black text-xs">{{ form.userAge }}</span>
                    <button type="button" @click="form.userAge = Math.min(90, form.userAge + 1)"
                            class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold active:scale-90 transition-transform cursor-pointer bg-zinc-800 text-zinc-300">+</button>
                  </div>
                </div>
              </div>

              <!-- Instant Metabolic & Nutrition Card -->
              <div class="p-3 rounded-2xl border space-y-2 shadow-sm bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-900 border-amber-500/30">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm">🔥</span>
                    <span class="text-xs font-black text-amber-300">
                      个人代谢基线 (Mifflin-St Jeor)
                    </span>
                  </div>
                  <div class="flex items-center gap-1 text-[10px] font-mono">
                    <span class="text-zinc-400">BMI {{ bmi }}</span>
                    <span class="px-1.5 py-0.2 rounded-full border text-[9px] font-bold"
                          :class="bmiCategory.badgeBg + ' ' + bmiCategory.color">{{ bmiCategory.label }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-1.5 font-mono text-center pt-0.5">
                  <div class="p-1.5 rounded-lg border bg-zinc-950/80 border-zinc-800">
                    <span class="text-[8px] block text-zinc-500">基础代谢 (BMR)</span>
                    <span class="text-xs font-black text-amber-400">{{ bmr }} <span class="text-[8px] font-normal">kcal</span></span>
                  </div>
                  <div class="p-1.5 rounded-lg border bg-zinc-950/80 border-zinc-800">
                    <span class="text-[8px] block text-zinc-500">每日总消耗(TDEE)</span>
                    <span class="text-xs font-black text-zinc-200">{{ tdee }} <span class="text-[8px] font-normal">kcal</span></span>
                  </div>
                  <div class="p-1.5 rounded-lg border bg-zinc-950/80 border-zinc-800">
                    <span class="text-[8px] block text-zinc-500">每日建议蛋白质</span>
                    <span class="text-xs font-black text-emerald-400">{{ macros.dailyProteinTargetGrams }} <span class="text-[8px] font-normal">g</span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Perception & Experience -->
            <div class="space-y-3 pt-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black flex items-center gap-1.5 text-zinc-200">
                  <span>⚡</span>
                  <span>体能直觉感知 (免记具体公斤数)</span>
                </span>
                <span class="text-[10px] text-amber-500">细化微调 💡</span>
              </div>

              <!-- Pushups -->
              <div class="space-y-1.5">
                <span class="text-[11px] font-bold block text-zinc-300">
                  连续标准俯卧撑的大致数量 (推力基准)
                </span>
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="p in pushupTiers" :key="p.id"
                       @click="form.pushupTier = p.id; checkArchetypeMatch()"
                       class="p-2 rounded-xl border cursor-pointer transition-all"
                       :class="form.pushupTier === p.id
                         ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                         : 'bg-zinc-900/80 border-zinc-800'">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black" :class="form.pushupTier === p.id ? 'text-amber-400' : 'text-zinc-200'">{{ p.name }}</span>
                      <span class="text-[9px] font-mono px-1.5 py-0.2 rounded border bg-zinc-800 text-zinc-400 border-zinc-700">{{ p.badge }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Squats -->
              <div class="space-y-1.5">
                <span class="text-[11px] font-bold block text-zinc-300">
                  徒手深蹲或爬楼感受 (下肢与核心基准)
                </span>
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="s in squatTiers" :key="s.id"
                       @click="form.squatTier = s.id; checkArchetypeMatch()"
                       class="p-2 rounded-xl border cursor-pointer transition-all text-center"
                       :class="form.squatTier === s.id ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-1 ring-amber-500/40' : 'bg-zinc-900/80 border-zinc-800'">
                    <div class="text-sm">{{ s.icon }}</div>
                    <div class="text-[11px] font-bold mt-0.5" :class="form.squatTier === s.id ? 'text-amber-400' : 'text-zinc-200'">{{ s.name }}</div>
                  </div>
                </div>
              </div>

              <!-- Experience level -->
              <div class="space-y-1.5">
                <span class="text-[11px] font-bold block text-zinc-300">
                  抗阻训练年限档位
                </span>
                <div class="grid grid-cols-3 gap-2">
                  <button type="button" v-for="lvl in experienceLevels" :key="lvl.id"
                          @click="form.experienceLevel = lvl.id; checkArchetypeMatch()"
                          class="p-2 rounded-xl border text-center transition-all cursor-pointer"
                          :class="form.experienceLevel === lvl.id ? 'bg-amber-500/15 border-amber-500 text-amber-400 ring-1 ring-amber-500/40' : 'bg-zinc-900/70 border-zinc-800 text-zinc-400'">
                    <div class="text-xs font-black">{{ lvl.name }}</div>
                    <div class="text-[9px] text-zinc-500">{{ lvl.badge }}</div>
                  </button>
                </div>
              </div>

              <!-- Direct Kg Input Option -->
              <div class="pt-2 border-t border-zinc-800">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">🛠️ 自定义我常做的核心重量</span>
                  <button type="button" @click="showCustomMode = !showCustomMode" class="text-[10px] text-amber-400 underline cursor-pointer">
                    {{ showCustomMode ? '‹ 切回自适应推算' : '展开直填' }}
                  </button>
                </div>
                <div v-if="showCustomMode" class="grid grid-cols-3 gap-2 pt-2">
                  <div>
                    <span class="text-[9px] block text-zinc-400 mb-1">日常卧推 (kg)</span>
                    <input v-model.number="customBases.bench" type="number" step="2.5" class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none bg-zinc-950 border-zinc-700 text-white focus:border-amber-500" />
                  </div>
                  <div>
                    <span class="text-[9px] block text-zinc-400 mb-1">日常深蹲 (kg)</span>
                    <input v-model.number="customBases.squat" type="number" step="5" class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none bg-zinc-950 border-zinc-700 text-white focus:border-amber-500" />
                  </div>
                  <div>
                    <span class="text-[9px] block text-zinc-400 mb-1">日常下拉 (kg)</span>
                    <input v-model.number="customBases.pull" type="number" step="2.5" class="w-full text-center font-mono font-bold text-xs p-1.5 rounded-lg border outline-none bg-zinc-950 border-zinc-700 text-white focus:border-amber-500" />
                  </div>
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

const activeTab = ref("quick"); // 'quick' | 'detailed'
const showCustomMode = ref(false);

const form = reactive({
  gender: store.settings.gender || "male",
  userAge: store.settings.userAge || 25,
  userHeight: store.settings.userHeight || 175,
  userWeight: store.settings.userWeight || 70,
  trainingGoal: store.settings.trainingGoal || "hypertrophy",
  pushupTier: store.settings.pushupTier || "basic",
  squatTier: store.settings.squatTier || "natural",
  experienceLevel: store.settings.strengthLevel === "custom" ? "intermediate" : (store.settings.strengthLevel || "intermediate")
});

const customBases = reactive({
  bench: store.settings.customBaseWeights?.bench || 50,
  squat: store.settings.customBaseWeights?.squat || 70,
  pull: store.settings.customBaseWeights?.pull || 45
});

// 4 大力量段位卡片 (直觉开荒到高阶，告别选择题负担)
const archetypes = [
  {
    id: "novice",
    name: "小白开荒",
    tag: "零基础 / 找发力感",
    icon: "🐣",
    desc: "较少去健身房或初次接触力量训练，以空杆或轻哑铃规范轨迹为先",
    sampleWeights: "哑铃 4~6kg · 腿举 25~35kg",
    pushupTier: "beginner",
    squatTier: "sedentary",
    experienceLevel: "beginner"
  },
  {
    id: "intermediate",
    name: "常规进阶",
    tag: "大众健身 · 推荐",
    icon: "🏃",
    desc: "有一定运动基础，能做10+个俯卧撑，追求高效塑形与增肌",
    sampleWeights: "哑铃 8~12kg · 腿举 50~65kg",
    pushupTier: "basic",
    squatTier: "natural",
    experienceLevel: "intermediate",
    isHot: true
  },
  {
    id: "advanced",
    name: "力量老铁",
    tag: "规律抗阻 1年+",
    icon: "🏋️",
    desc: "动作熟练自如，三大项轨迹稳定，追求渐进超负荷与强壮体魄",
    sampleWeights: "哑铃 14~20kg · 腿举 80~100kg",
    pushupTier: "moderate",
    squatTier: "strong",
    experienceLevel: "advanced"
  },
  {
    id: "elite",
    name: "硬核高阶",
    tag: "资深老炮 / 接近超自重",
    icon: "🦍",
    desc: "长期大负荷撸铁，推力接近或超越自身体重，追求极限做工",
    sampleWeights: "哑铃 20kg+ · 腿举 110kg+",
    pushupTier: "elite",
    squatTier: "strong",
    experienceLevel: "advanced"
  }
];

const selectedArchetypeId = ref("intermediate");

// Determine initial archetype based on store settings
if (store.settings.strengthLevel === "beginner" || store.settings.pushupTier === "beginner") {
  selectedArchetypeId.value = "novice";
} else if (store.settings.strengthLevel === "advanced" || store.settings.pushupTier === "elite") {
  selectedArchetypeId.value = store.settings.pushupTier === "elite" ? "elite" : "advanced";
} else {
  selectedArchetypeId.value = "intermediate";
}

function selectArchetype(archetype) {
  selectedArchetypeId.value = archetype.id;
  form.pushupTier = archetype.pushupTier;
  form.squatTier = archetype.squatTier;
  form.experienceLevel = archetype.experienceLevel;
}

function setGender(g) {
  form.gender = g;
  if (g === "female" && form.userWeight === 70) {
    form.userWeight = 55;
  } else if (g === "male" && form.userWeight === 55) {
    form.userWeight = 70;
  }
}

function checkArchetypeMatch() {
  if (form.pushupTier === "beginner" && form.experienceLevel === "beginner") {
    selectedArchetypeId.value = "novice";
  } else if (form.pushupTier === "elite") {
    selectedArchetypeId.value = "elite";
  } else if (form.experienceLevel === "advanced") {
    selectedArchetypeId.value = "advanced";
  } else {
    selectedArchetypeId.value = "intermediate";
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

// Update custom bases when adaptive weights update if not manually touched
watch(adaptiveWeights, (newVal) => {
  if (!showCustomMode.value && newVal && newVal.estimatedBases) {
    customBases.bench = newVal.estimatedBases.bench;
    customBases.squat = newVal.estimatedBases.squat;
    customBases.pull = newVal.estimatedBases.pull;
  }
}, { immediate: true });

const pushupTiers = [
  { id: "beginner", name: "刚起步", badge: "<5个", desc: "神经募集期，规范轨迹" },
  { id: "basic", name: "基础体能", badge: "5~15个", desc: "常运动，具推力储备" },
  { id: "moderate", name: "规律训练", badge: "15~30个", desc: "胸肩手臂发力稳健" },
  { id: "elite", name: "高阶强者", badge: ">30个", desc: "大负荷抗阻老铁" }
];

const squatTiers = [
  { id: "sedentary", icon: "🛋️", name: "久坐偏少", desc: "多蹲几次腿酸" },
  { id: "natural", icon: "🚶", name: "体态自如", desc: "连蹲30次无压力" },
  { id: "strong", icon: "🏃", name: "强韧有力", desc: "经常腿训或大球类" }
];

const experienceLevels = [
  { id: "beginner", name: "新手入门", badge: "0~3个月" },
  { id: "intermediate", name: "进阶中坚", badge: "3~12个月" },
  { id: "advanced", name: "资深老手", badge: "1年以上" }
];

function applyPlacement() {
  saveUserProfileAndRecalibrate({
    gender: form.gender,
    userAge: form.userAge,
    userHeight: form.userHeight,
    userWeight: form.userWeight,
    trainingGoal: form.trainingGoal,
    pushupTier: form.pushupTier,
    squatTier: form.squatTier,
    strengthLevel: showCustomMode.value ? "custom" : form.experienceLevel,
    useCustom: showCustomMode.value,
    customBases: showCustomMode.value ? customBases : null
  });

  emit("applied", showCustomMode.value ? "custom" : form.experienceLevel);
  emit("close");
}
</script>
