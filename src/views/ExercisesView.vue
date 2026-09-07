<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-3.5">
    
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-black flex items-center gap-2" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
          <span>动作库</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                :class="store.settings.themeMode === 'light' ? 'bg-amber-500/25 text-amber-800 border border-amber-600/40 font-black' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'">
            {{ store.exercises.length }}
          </span>
        </h2>
        <p class="text-xs mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
          涵盖自由重量、固定器械、绳索与自重变式
        </p>
      </div>
      <button @click="openCreateExercise" 
              class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        <span>新建动作</span>
      </button>
    </div>

    <!-- Search & Multimodal Entry Bar -->
    <div class="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 space-y-2.5 shadow-md">
      <!-- Multimodal Gym Machine Finder Quick Entry -->
      <button @click="showMachineFinder = true"
              class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/35 border border-amber-500/40 text-xs font-black flex items-center justify-between transition-all active:scale-98 cursor-pointer shadow-xs"
              :class="store.settings.themeMode === 'light' ? 'text-amber-950' : 'text-amber-300'">
        <span class="flex items-center gap-2">
          <span class="text-sm">📸</span>
          <span>拍照 / 语音智能识器械</span>
        </span>
        <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500 text-zinc-950 flex items-center gap-1 shadow-sm">
          <span>智能识别</span>
          <span>→</span>
        </span>
      </button>

      <!-- Search Input Bar -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <div class="absolute left-3.5 top-2.5 text-zinc-500 text-xs">🔍</div>
          <input v-model="searchQuery" 
                 type="text" 
                 placeholder="搜索动作、部位、器械(杠铃/哑铃)、俗称(早安/剪刀机)..." 
                 class="w-full rounded-xl pl-9 pr-8 py-2 text-xs transition-colors focus:outline-none focus:border-amber-500"
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-zinc-950 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500'" />
          <span v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-2 text-xs text-zinc-400 hover:text-white cursor-pointer">✕</span>
        </div>

        <!-- Inline Camera/Voice trigger button -->
        <button @click="showMachineFinder = true" 
                title="拍照/语音智能识器械"
                class="px-2.5 py-2 rounded-xl text-xs font-black border transition-all active:scale-95 cursor-pointer flex items-center gap-1 flex-shrink-0"
                :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-zinc-950 hover:bg-zinc-800 text-amber-400 border-zinc-700/80'">
          <span>📸</span>
          <span class="hidden sm:inline">识器械</span>
        </button>
      </div>

      <!-- Level 1: Categories Horizontal Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar overscroll-x-contain touch-pan-x">
        <button v-for="cat in categoryOptions" :key="cat.name"
                @click="selectCategory(cat.name)"
                class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                :class="[
                  activeCategory === cat.name ? 
                  'bg-amber-500 text-zinc-950 font-black shadow-sm shadow-amber-500/20' : 
                  (store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300/80 shadow-xs' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80')
                ]">
          <span>{{ cat.displayLabel }}</span>
          <span class="text-xs font-mono" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-bold' : 'opacity-80'">({{ cat.count }})</span>
        </button>
      </div>

      <!-- Level 2: Equipment Filter Pills -->
      <div class="pt-1.5 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar"
           :class="store.settings.themeMode === 'light' ? 'border-slate-200' : 'border-zinc-800/80'">
        <button v-for="eq in equipmentOptionsWithCounts" :key="eq.key"
                @click="selectEquipment(eq.key)"
                class="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                :class="[
                  activeEquipment === eq.key
                    ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                    : (store.settings.themeMode === 'light' ? 'bg-white text-slate-700 border border-slate-300 hover:border-amber-400' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700')
                ]">
          <span>{{ eq.icon }}</span>
          <span>{{ eq.label }}</span>
          <span class="text-xs font-mono opacity-80">({{ eq.count }})</span>
        </button>
      </div>

      <!-- Level 3: Sub-Target Muscle Chips (Context-Aware) -->
      <div v-if="subTargetOptions.length > 1" class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar pt-0.5">
        <span class="text-xs font-bold flex-shrink-0 mr-1"
              :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">目标:</span>
        <button v-for="sub in subTargetOptions" :key="sub"
                @click="selectSubTarget(sub)"
                class="px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
                :class="[
                  activeSubTarget === sub
                    ? 'bg-amber-400/25 text-amber-500 border border-amber-400/50 font-black'
                    : (store.settings.themeMode === 'light' ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80')
                ]">
          {{ sub }}
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- VIEW A: VISUAL CATEGORY HUB & SCIENCE ACADEMY (全部默认模式) -->
    <!-- ======================================================== -->
    <div v-if="isDefaultHubView" class="space-y-4">
      
      <!-- 💡 运动科学与防伤指南 (首屏置顶可折叠，用户第一眼即可见，无需向下滑动) -->
      <div class="rounded-2xl border p-3.5 transition-all shadow-xs"
           :class="store.settings.themeMode === 'light' 
             ? 'bg-amber-50/70 border-amber-200/80 text-slate-900' 
             : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'">
        
        <div class="flex items-center justify-between cursor-pointer select-none"
             @click="showScienceGuide = !showScienceGuide">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-base font-bold text-amber-500">✦</span>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <h4 class="text-sm font-black truncate" :class="store.settings.themeMode === 'light' ? 'text-amber-950 font-black' : 'text-amber-400'">
                  运动科学指南
                </h4>
                <span class="text-xs font-mono px-2 py-0.5 rounded border font-bold"
                      :class="store.settings.themeMode === 'light' ? 'bg-white border-amber-300 text-amber-900' : 'bg-zinc-800 text-amber-400 border-zinc-700'">
                  {{ showScienceGuide ? '收起 ▲' : '展开阅读 3 篇 ▼' }}
                </span>
              </div>
              <p class="text-xs mt-0.5 truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
                练前动态激活 · 练后静态伸展 · 72h 超量恢复原理
              </p>
            </div>
          </div>

          <button type="button" 
                  class="text-xs font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 transition-all cursor-pointer"
                  :class="store.settings.themeMode === 'light' ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'">
            {{ showScienceGuide ? '收起' : '阅读' }}
          </button>
        </div>

        <!-- Expandable Content -->
        <div v-show="showScienceGuide" class="mt-3 pt-3 border-t space-y-2.5"
             :class="store.settings.themeMode === 'light' ? 'border-amber-200/70' : 'border-zinc-800'">
          
          <!-- Guide 1 -->
          <div class="p-2.5 rounded-xl border space-y-1.5"
               :class="store.settings.themeMode === 'light' ? 'bg-white/80 border-amber-200 text-slate-800' : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-600">
                为什么大重量抗阻前严禁静态拉伸？
              </span>
              <span class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold">练前激活</span>
            </div>
            <p class="text-xs leading-relaxed">
              抗阻训练前进行长时间（>30秒）静态拉伸，会钝化肌梭感受器并抑制中枢神经冲动，使肌肉刚度与瞬时爆发力下降 8%~15%，且破坏关节囊稳定性。正确的练前流程必须采用 RAMP 动态激活（关节绕环、胸椎灵活性、肩袖激活），通过主动做工提升体温与滑液分泌。
            </p>
          </div>

          <!-- Guide 2 -->
          <div class="p-2.5 rounded-xl border space-y-1.5"
               :class="store.settings.themeMode === 'light' ? 'bg-white/80 border-emerald-200 text-slate-800' : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-600">
                练后静态拉伸与副交感神经唤醒
              </span>
              <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">练后拉伸</span>
            </div>
            <p class="text-xs leading-relaxed">
              训练结束、心率平复至 100bpm 以下后，方可进行静态伸展。保持每个部位 20~30 秒，牵拉感维持在 6~7 级舒适酸胀，避免过度拉扯至剧烈疼痛。配合鼻吸口呼的慢速腹式呼吸，能快速平抑交感神经、降低皮质醇，开启肌糖原重组。
            </p>
          </div>

          <!-- Guide 3 -->
          <div class="p-2.5 rounded-xl border space-y-1.5"
               :class="store.settings.themeMode === 'light' ? 'bg-white/80 border-sky-200 text-slate-800' : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-sky-600">
                0~72 小时超量恢复生理常识
              </span>
              <span class="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">生理恢复</span>
            </div>
            <p class="text-xs leading-relaxed">
              力量训练本质上是骨骼肌微损伤过程，真正的肌肉增长发生在睡眠修复期。肌纤维在微撕裂后需要 24~72 小时完成修复与超量重组。系统在 72 小时内不会产生任何怠惰衰减，保障科学的休息周期，避免过度训练与焦虑。
            </p>
          </div>

        </div>
      </div>

      <!-- 1. 9 大部位与功能视觉导航矩阵 (清晰易懂的新手人话翻译) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
              :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>动作分类</span>
          </h3>
          <span class="text-xs text-zinc-500 font-mono">共 {{ store.exercises.length }} 款动作</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div v-for="hub in visualHubCards" :key="hub.name"
               @click="selectCategory(hub.name)"
               class="p-3 rounded-2xl border transition-all cursor-pointer active:scale-97 shadow-sm group relative overflow-hidden"
               :class="store.settings.themeMode === 'light' 
                 ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400' 
                 : 'bg-zinc-900/80 hover:bg-zinc-850 border-zinc-800/90 hover:border-amber-500/50'">
            
            <div class="flex items-start justify-between">
              <div class="text-xl">{{ hub.icon }}</div>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full border"
                    :class="store.settings.themeMode === 'light' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-800 text-amber-400 border-zinc-700'">
                {{ hub.count }} 款
              </span>
            </div>

            <div class="mt-2">
              <div class="font-black text-sm flex items-center gap-1"
                   :class="store.settings.themeMode === 'light' ? 'text-slate-900 group-hover:text-amber-700' : 'text-zinc-100 group-hover:text-amber-400'">
                <span>{{ hub.title }}</span>
                <span class="text-xs opacity-60">❯</span>
              </div>
              <p class="text-xs mt-0.5 line-clamp-1 leading-tight"
                 :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
                {{ hub.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 常用动作参考 (精选基石动作) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
              :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>常用动作参考</span>
          </h3>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div v-for="staple in stapleExercises" :key="staple.id"
               @click="openExerciseDetail(staple)"
               class="p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer active:scale-97 shadow-xs"
               :class="store.settings.themeMode === 'light' ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-zinc-900/80 hover:bg-zinc-850 border-zinc-800'">
            <ExerciseImage :src="staple.gifUrl" 
                           :name="staple.name" 
                           :category="staple.category" 
                           customClass="w-10 h-10 rounded-xl border border-zinc-800 flex-shrink-0" />
            <div class="min-w-0 flex-1">
              <div class="font-bold text-xs truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
                {{ staple.name }}
              </div>
              <div class="text-xs truncate" :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-medium' : 'text-amber-400'">
                {{ staple.target }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================== -->
    <!-- VIEW B: TARGETED EXERCISES LIST (多维筛选与动作呈现列表) -->
    <!-- ======================================================== -->
    <div v-else class="space-y-2.5">
      
      <!-- Top Context Banner (Active Category, Equipment & Sub-target Breadcrumbs) -->
      <div class="flex items-center justify-between px-1 text-xs">
        <div class="flex items-center gap-1.5 flex-wrap min-w-0">
          <span class="font-bold truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-200'">
            <span v-if="searchQuery.trim()">搜索："<span class="text-amber-500 font-black">{{ searchQuery }}</span>"</span>
            <span v-else>{{ activeCategory }} · {{ activeEquipment === '全部' ? '全部器械' : activeEquipment }}</span>
          </span>
          <span v-if="activeSubTarget !== '全部'" class="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30">
            {{ activeSubTarget }}
          </span>
          <span class="font-mono text-xs opacity-70">({{ filteredExercises.length }}款)</span>
        </div>

        <button @click="resetAllFilters" 
                class="px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
                :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'">
          <span>↩</span>
          <span>重置/返回分类</span>
        </button>
      </div>

      <!-- 热身分化智能筛选器 -->
      <div v-if="activeCategory === '热身' && !searchQuery.trim()" class="space-y-2">
        <div class="p-3 rounded-2xl border transition-all"
             :class="store.settings.themeMode === 'light' ? 'bg-amber-50/80 border-amber-200 text-slate-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'">
          <div class="flex items-center justify-between">
            <div class="font-bold text-xs flex items-center gap-1.5">
              <span>今天练什么？按部位匹配热身：</span>
            </div>
            <button @click="openSplitWarmupFlow" 
                    class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1">
              <span>▶ 3分钟跟练</span>
            </button>
          </div>

          <div class="grid grid-cols-4 gap-1.5 mt-2">
            <button v-for="sp in warmupSplits" :key="sp.key"
                    @click="activeWarmupSplit = sp.key"
                    class="py-1.5 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center"
                    :class="[
                      activeWarmupSplit === sp.key 
                        ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs' 
                        : (store.settings.themeMode === 'light' ? 'bg-white text-slate-700 border-amber-200 hover:border-amber-400' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700')
                    ]">
              {{ sp.label }}
            </button>
          </div>

          <p class="text-xs mt-2 leading-relaxed" :class="store.settings.themeMode === 'light' ? 'text-amber-900' : 'text-amber-300/90'">
            {{ currentWarmupTip }}
          </p>
        </div>
      </div>

      <!-- 拉伸分化智能筛选器 -->
      <div v-if="activeCategory === '拉伸' && !searchQuery.trim()" class="space-y-2">
        <div class="p-3 rounded-2xl border transition-all"
             :class="store.settings.themeMode === 'light' ? 'bg-emerald-50/80 border-emerald-200 text-slate-900' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'">
          <div class="flex items-center justify-between">
            <div class="font-bold text-xs flex items-center gap-1.5">
              <span>练后拉伸：按今日训练部位放松</span>
            </div>
            <button @click="openSplitStretchFlow" 
                    class="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 flex items-center gap-1">
              <span>▶ 3分钟跟练</span>
            </button>
          </div>

          <div class="grid grid-cols-4 gap-1.5 mt-2">
            <button v-for="sp in stretchSplits" :key="sp.key"
                    @click="activeStretchSplit = sp.key"
                    class="py-1.5 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center"
                    :class="[
                      activeStretchSplit === sp.key 
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-xs' 
                        : (store.settings.themeMode === 'light' ? 'bg-white text-slate-700 border-emerald-200 hover:border-emerald-400' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700')
                    ]">
              {{ sp.label }}
            </button>
          </div>

          <p class="text-xs mt-2 leading-relaxed" :class="store.settings.themeMode === 'light' ? 'text-emerald-900' : 'text-emerald-300/90'">
            {{ currentStretchTip }}
          </p>
        </div>
      </div>

      <!-- Inset List of Exercises -->
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
            <div class="flex items-center gap-1.5 flex-wrap">
              <span v-if="isStapleExercise(ex)" 
                    class="text-xs font-black px-2 py-0.5 rounded bg-amber-500 text-zinc-950 shadow-2xs">
                基石
              </span>
              <h3 class="font-bold text-sm sm:text-base truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">
                {{ ex.name }}
              </h3>
              <span class="text-xs px-2 py-0.5 rounded border flex-shrink-0"
                    :class="store.settings.themeMode === 'light' ? 'bg-amber-500/20 text-amber-800 border-amber-500/40 font-bold' : 'bg-zinc-800 text-amber-400 border-zinc-700/60 font-semibold'">
                {{ ex.category }}
              </span>
            </div>
            
            <div class="text-xs mt-0.5 truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
              <span :class="store.settings.themeMode === 'light' ? 'text-slate-800 font-medium' : 'text-zinc-300'">{{ ex.target }}</span>
            </div>

            <!-- Tags, Equipment & Substitutes -->
            <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span class="text-xs px-2 py-0.5 rounded border font-mono font-medium"
                    :class="store.settings.themeMode === 'light' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-950 text-zinc-400 border-zinc-800'">
                {{ getExerciseEquipment(ex) }}
              </span>
              <span v-if="getExerciseSubTarget(ex)" class="text-xs px-2 py-0.5 rounded border font-medium"
                    :class="store.settings.themeMode === 'light' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-zinc-950 text-amber-400/90 border-zinc-800'">
                #{{ getExerciseSubTarget(ex) }}
              </span>
              <span v-if="ex.substitutes?.length" class="text-xs px-2 py-0.5 rounded border"
                    :class="store.settings.themeMode === 'light' ? 'bg-amber-500/20 text-amber-800 border-amber-500/40 font-bold' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'">
                {{ ex.substitutes.length }}个平替
              </span>
            </div>
          </div>

          <!-- Right Action Chevron -->
          <div class="flex-shrink-0" :class="store.settings.themeMode === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-zinc-500 hover:text-amber-400'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

        </div>

        <div v-if="filteredExercises.length === 0" class="py-10 text-center text-xs space-y-3 px-4" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-500'">
          <div class="space-y-1">
            <div class="text-sm font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-800' : 'text-zinc-300'">
              未找到与当前筛选条件匹配的动作
            </div>
            <p class="text-xs max-w-xs mx-auto">
              遇到健身房的特定品牌、罕见器械或自创动作？支持 1 秒新建！
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
            <button @click="openCreateExercise" 
                    class="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs active:scale-95 transition-all cursor-pointer shadow-sm">
              1秒以「{{ searchQuery.trim() || '新动作' }}」新建自定义动作 ❯
            </button>
            <button @click="resetAllFilters" 
                    class="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer"
                    :class="store.settings.themeMode === 'light' ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700' : 'border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'">
              ↺ 清空全部筛选
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Floating Back-to-Top Pill Button -->
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
              class="fixed right-4 z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-full active:scale-95 text-xs backdrop-blur-xl transition-all cursor-pointer select-none"
              :class="store.settings.themeMode === 'light' ? 'bg-white/95 hover:bg-slate-100 text-amber-800 font-black border border-amber-500/50 shadow-xl shadow-black/10' : 'bg-zinc-900/95 hover:bg-zinc-800 text-amber-400 font-bold border border-amber-500/40 shadow-xl shadow-black/60'"
              :style="{ bottom: 'calc(max(env(safe-area-inset-bottom, 0px), 8px) + 3.85rem)' }">
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

    <GymMachineFinderModal
      :visible="showMachineFinder"
      @close="showMachineFinder = false"
      @select="handleMachineFinderSelect"
      @viewDetail="handleMachineFinderDetail"
    />

    <WarmupFlowModal
      :visible="showWarmupFlowModal"
      :plan="splitWarmupPlan"
      @close="showWarmupFlowModal = false"
    />

    <StretchFlowModal
      :visible="showStretchFlowModal"
      :plan="splitStretchPlan"
      @close="showStretchFlowModal = false"
    />

    <!-- Quick Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" 
           class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200"
           style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
        <div class="absolute inset-0" @click="showCreateModal = false"></div>
        
        <div class="relative z-10 bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-4 space-y-3 animate-in slide-in-from-bottom duration-200 shadow-2xl">
          <div class="w-10 h-1 rounded-full bg-zinc-700 mx-auto -mt-1 mb-2 flex-shrink-0"></div>

          <div class="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 class="text-sm font-black text-zinc-100">添加自定义动作</h3>
            <button @click="showCreateModal = false" class="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs text-zinc-400 font-medium">动作名称 *</label>
              <input v-model="newEx.name" type="text" placeholder="例如：上斜绳索夹胸" 
                     class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500" />
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
                     class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500" />
            </div>

            <div>
              <label class="text-xs text-zinc-400 font-medium">动作要领与科学细节</label>
              <textarea v-model="newEx.scienceDetail" rows="3" placeholder="为什么做这个动作？刺激哪个位置？" 
                        class="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"></textarea>
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
import GymMachineFinderModal from "../components/GymMachineFinderModal.vue";
import WarmupFlowModal from "../components/WarmupFlowModal.vue";
import StretchFlowModal from "../components/StretchFlowModal.vue";
import ExerciseImage from "../components/ExerciseImage.vue";
import { 
  EQUIPMENT_OPTIONS, 
  SUB_TARGET_MAP, 
  isStapleExercise, 
  getExerciseEquipment, 
  getExerciseSubTarget 
} from "../utils/exerciseFilterUtils.js";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { triggerHaptic } from "../utils/vibrate.js";
import { getUniversalScrollTop, universalScrollToTop } from "../utils/scrollUtils.js";

const showMachineFinder = ref(false);
const searchQuery = ref("");
const activeCategory = ref("全部");
const activeEquipment = ref("全部");
const activeSubTarget = ref("全部");
const showScienceGuide = ref(false);

const categories = ["全部", "胸部", "背部", "肩部", "手臂", "腿部", "核心", "有氧", "热身", "拉伸", "其它"];

const categoryDisplayNames = {
  "全部": "全部",
  "胸部": "胸部 (胸肌)",
  "背部": "背部 (后背)",
  "肩部": "肩部 (肩膀)",
  "手臂": "手臂 (二头/三头)",
  "腿部": "腿部 (臀腿/下肢)",
  "核心": "核心 (腹肌/腰腹)",
  "有氧": "有氧 (心肺/燃脂)",
  "热身": "动态热身 (练前激活)",
  "拉伸": "练后拉伸 (放松防酸)",
  "其它": "其它"
};

const isDefaultHubView = computed(() => {
  return activeCategory.value === "全部" && 
         activeEquipment.value === "全部" && 
         activeSubTarget.value === "全部" && 
         !searchQuery.value.trim();
});

// Warmup Split Filter state
const activeWarmupSplit = ref("push");
const warmupSplits = [
  { key: "push", label: "推日 (胸肩)" },
  { key: "pull", label: "拉日 (背部)" },
  { key: "legs", label: "腿日 (深蹲)" },
  { key: "all", label: "全部动作" }
];

const currentWarmupTip = computed(() => {
  if (activeWarmupSplit.value === "push") {
    return "💡 推胸推肩掌根承受垂直剪切力，肩峰下间隙较窄。重点润滑腕关节滑液、靠墙W滑动激活前锯肌与肩袖外旋，无需过多预热下肢。";
  }
  if (activeWarmupSplit.value === "pull") {
    return "💡 引体划船需要背阔肌主动下沉并锁死肩胛。重点在猫牛式松动胸椎、弹力带唤醒菱形肌、毛毛虫爬行激活后链，避免耸肩代偿。";
  }
  if (activeWarmupSplit.value === "legs") {
    return "💡 练腿无需过多预热上肢推举肩袖。久坐导致髂腰肌紧绷缩短引起骨盆前倾，重点跪姿拉伸打开髋屈肌、臀桥唤醒沉睡的臀大肌。";
  }
  return "💡 完整动态激活动作清单，可根据今日训练需要自由选择。";
});

// Stretch Split Filter state
const activeStretchSplit = ref("push");
const stretchSplits = [
  { key: "push", label: "推日 (胸肩)" },
  { key: "pull", label: "拉日 (背部)" },
  { key: "legs", label: "腿日 (臀腿)" },
  { key: "all", label: "全部动作" }
];

const currentStretchTip = computed(() => {
  if (activeStretchSplit.value === "push") {
    return "🌿 推胸推肩后胸大肌、前束与三头极度充血缩短。利用门框与颈后伸展释放胸小肌与肩峰压力，缓解次日紧绷。";
  }
  if (activeStretchSplit.value === "pull") {
    return "🌿 划船与下拉后背阔肌与前臂持续紧张。立柱侧屈能深度打开胸腰筋膜，抱胸伸展能松解菱形肌膏肓酸痛。";
  }
  if (activeStretchSplit.value === "legs") {
    return "🌿 深蹲硬拉后股四、腘绳与臀肌承受高张力。单腿站立屈膝牵拉股直肌，仰卧4字抱膝松解深层梨状肌，减轻坐骨压力。";
  }
  return "🌿 完整静态拉伸与肌筋膜滚压动作清单，心率平复后进行，保持20~30秒舒适牵拉。";
});

// Follow-along modals for warmup / stretch
const showWarmupFlowModal = ref(false);
const showStretchFlowModal = ref(false);

const splitWarmupPlan = computed(() => ({
  name: activeWarmupSplit.value === "push" ? "推日 (Push)" : (activeWarmupSplit.value === "pull" ? "拉日 (Pull)" : "腿日 (Legs)"),
  category: activeWarmupSplit.value === "push" ? "推" : (activeWarmupSplit.value === "pull" ? "拉" : "腿")
}));

const splitStretchPlan = computed(() => ({
  name: activeStretchSplit.value === "push" ? "推日 (Push)" : (activeStretchSplit.value === "pull" ? "拉日 (Pull)" : "腿日 (Legs)"),
  category: activeStretchSplit.value === "push" ? "推" : (activeStretchSplit.value === "pull" ? "拉" : "腿")
}));

function openSplitWarmupFlow() {
  showWarmupFlowModal.value = true;
}

function openSplitStretchFlow() {
  showStretchFlowModal.value = true;
}

const showBackToTop = ref(false);

function handleScroll() {
  showBackToTop.value = getUniversalScrollTop() > 280;
}

function scrollToTop() {
  universalScrollToTop(true);
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

function selectCategory(catName) {
  activeCategory.value = catName;
  activeSubTarget.value = "全部";
  if (store.settings.vibrationEnabled) triggerHaptic("selection");
}

function selectEquipment(equipKey) {
  activeEquipment.value = equipKey;
  if (store.settings.vibrationEnabled) triggerHaptic("selection");
}

function selectSubTarget(sub) {
  activeSubTarget.value = sub;
  if (store.settings.vibrationEnabled) triggerHaptic("selection");
}

function resetAllFilters() {
  activeCategory.value = "全部";
  activeEquipment.value = "全部";
  activeSubTarget.value = "全部";
  searchQuery.value = "";
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("scroll", handleScroll);
  }
  if (showCreateModal.value) {
    unlockBodyScroll();
  }
});

const categoryOptions = computed(() => {
  return categories.map(cat => {
    const displayLabel = categoryDisplayNames[cat] || cat;
    if (cat === "全部") {
      return { name: cat, displayLabel, count: store.exercises.length };
    }
    const count = store.exercises.filter(e => e.category === cat).length;
    return { name: cat, displayLabel, count };
  });
});

const equipmentOptionsWithCounts = computed(() => {
  return EQUIPMENT_OPTIONS.map(opt => {
    if (opt.key === "全部") {
      const pool = activeCategory.value === "全部" 
        ? store.exercises 
        : store.exercises.filter(e => e.category === activeCategory.value);
      return { ...opt, count: pool.length };
    }
    const pool = activeCategory.value === "全部" 
      ? store.exercises 
      : store.exercises.filter(e => e.category === activeCategory.value);
    const count = pool.filter(e => getExerciseEquipment(e) === opt.key).length;
    return { ...opt, count };
  });
});

const subTargetOptions = computed(() => {
  if (activeCategory.value === "全部") return [];
  return SUB_TARGET_MAP[activeCategory.value] || [];
});

const visualHubCards = computed(() => [
  { name: "胸部", title: "胸部 (胸肌)", icon: "🛡️", desc: "卧推、飞鸟、推胸机与双杠臂屈伸", count: store.exercises.filter(e => e.category === "胸部").length },
  { name: "背部", title: "背部 (后背)", icon: "🦅", desc: "硬拉、高位下拉、各式划船与引体", count: store.exercises.filter(e => e.category === "背部").length },
  { name: "肩部", title: "肩部 (肩膀/三角肌)", icon: "🏹", desc: "推肩、侧平举、面拉与肩袖防伤", count: store.exercises.filter(e => e.category === "肩部").length },
  { name: "手臂", title: "手臂 (二头/三头)", icon: "💪", desc: "各式弯举、三头下压与臂屈伸", count: store.exercises.filter(e => e.category === "手臂").length },
  { name: "腿部", title: "腿部 (臀腿/下肢)", icon: "🦵", desc: "深蹲、倒蹬、腿屈伸、臀推与小腿提踵", count: store.exercises.filter(e => e.category === "腿部").length },
  { name: "核心", title: "核心 (腹肌/腰腹)", icon: "🧱", desc: "举腿、卷腹、龙旗、雨刷与平板支撑", count: store.exercises.filter(e => e.category === "核心").length },
  { name: "有氧", title: "有氧 (心肺/燃脂)", icon: "🏃", desc: "单车、跑步机、椭圆机与跳绳", count: store.exercises.filter(e => e.category === "有氧").length },
  { name: "热身", title: "动态热身 (练前激活)", icon: "🔥", desc: "关节活动度与动态拉伸 · 升温滑液", count: store.exercises.filter(e => e.category === "热身").length },
  { name: "拉伸", title: "练后拉伸 (放松防酸)", icon: "🧘", desc: "肌群静态牵拉与肌筋膜松解", count: store.exercises.filter(e => e.category === "拉伸").length }
]);

const stapleExercises = computed(() => {
  const ids = [
    "ex-barbell-bench-press",
    "ex-barbell-back-squat",
    "ex-deadlift",
    "ex-diverging-lat-pulldown",
    "ex-warmup-wall-slide",
    "ex-stretch-doorway-pec"
  ];
  return ids.map(id => store.exercises.find(e => e.id === id)).filter(Boolean);
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
  const q = searchQuery.value.trim().toLowerCase();

  return store.exercises.filter(ex => {
    // 1. Category Filter
    if (activeCategory.value !== "全部" && ex.category !== activeCategory.value) {
      return false;
    }

    // 2. Equipment Filter
    if (activeEquipment.value !== "全部") {
      const eq = getExerciseEquipment(ex);
      if (eq !== activeEquipment.value) return false;
    }

    // 3. SubTarget Filter
    if (activeSubTarget.value !== "全部") {
      const sub = getExerciseSubTarget(ex);
      if (sub !== activeSubTarget.value) return false;
    }

    // 4. Split filter for warmup
    if (activeCategory.value === "热身" && !q && activeWarmupSplit.value !== "all") {
      if (activeWarmupSplit.value === "push") {
        const pushIds = ["ex-warmup-wrist-circles", "ex-warmup-arm-circles", "ex-warmup-wall-slide", "ex-warmup-band-pull-apart"];
        if (!pushIds.includes(ex.id)) return false;
      } else if (activeWarmupSplit.value === "pull") {
        const pullIds = ["ex-warmup-cat-cow", "ex-warmup-band-pull-apart", "ex-warmup-inchworm", "ex-warmup-wrist-circles"];
        if (!pullIds.includes(ex.id)) return false;
      } else if (activeWarmupSplit.value === "legs") {
        const legIds = ["ex-warmup-kneeling-hip-flexor", "ex-warmup-glute-bridge", "ex-warmup-walking-lunges", "ex-warmup-jumping-jacks"];
        if (!legIds.includes(ex.id)) return false;
      }
    }

    // 5. Split filter for stretch
    if (activeCategory.value === "拉伸" && !q && activeStretchSplit.value !== "all") {
      if (activeStretchSplit.value === "push") {
        const pushIds = ["ex-stretch-doorway-pec", "ex-stretch-across-chest-shoulder", "ex-stretch-standing-triceps", "ex-stretch-rotator-cuff"];
        if (!pushIds.includes(ex.id)) return false;
      } else if (activeStretchSplit.value === "pull") {
        const pullIds = ["ex-stretch-unilateral-lat", "ex-stretch-upper-back", "ex-stretch-foam-roller-back", "ex-stretch-reverse-wrist"];
        if (!pullIds.includes(ex.id)) return false;
      } else if (activeStretchSplit.value === "legs") {
        const legIds = ["ex-stretch-standing-quad", "ex-stretch-seated-hamstring", "ex-stretch-lying-glute", "ex-stretch-standing-wall-calf", "ex-stretch-90-90-hip"];
        if (!legIds.includes(ex.id)) return false;
      }
    }

    // 6. Search query match
    if (!q) return true;
    return ex.name.toLowerCase().includes(q) || 
           (ex.englishName && ex.englishName.toLowerCase().includes(q)) ||
           (ex.aliases && ex.aliases.some(a => a.toLowerCase().includes(q))) ||
           (ex.target && ex.target.toLowerCase().includes(q)) || 
           (ex.tags && ex.tags.some(t => t.toLowerCase().includes(q))) ||
           getExerciseEquipment(ex).includes(q) ||
           getExerciseSubTarget(ex).includes(q);
  }).sort((a, b) => {
    // Rank staples higher unless explicitly searching
    if (q) return 0;
    const aStaple = isStapleExercise(a) ? 1 : 0;
    const bStaple = isStapleExercise(b) ? 1 : 0;
    return bStaple - aStaple;
  });
});

function openExerciseDetail(ex) {
  selectedExercise.value = ex;
  showDetailModal.value = true;
}

function handleMachineFinderSelect(exercise) {
  showMachineFinder.value = false;
  openExerciseDetail(exercise);
}

function handleMachineFinderDetail(exercise) {
  showMachineFinder.value = false;
  openExerciseDetail(exercise);
}

function openCreateExercise() {
  const q = searchQuery.value.trim();
  let guessedCat = activeCategory.value !== "全部" ? activeCategory.value : "背部";
  if (q) {
    if (q.includes("背") || q.includes("拉") || q.includes("划船") || q.includes("引体") || q.includes("剪刀")) guessedCat = "背部";
    else if (q.includes("胸") || q.includes("卧推") || q.includes("俯卧撑") || q.includes("夹胸")) guessedCat = "胸部";
    else if (q.includes("肩") || q.includes("推举") || q.includes("侧平举") || q.includes("飞鸟")) guessedCat = "肩部";
    else if (q.includes("臂") || q.includes("弯举") || q.includes("下压") || q.includes("二头") || q.includes("三头")) guessedCat = "手臂";
    else if (q.includes("腿") || q.includes("蹲") || q.includes("倒蹬") || q.includes("硬拉") || q.includes("哈克")) guessedCat = "腿部";
    else if (q.includes("腹") || q.includes("核心") || q.includes("卷腹") || q.includes("平板") || q.includes("腰")) guessedCat = "核心";
    else if (q.includes("跑") || q.includes("车") || q.includes("有氧") || q.includes("绳")) guessedCat = "有氧";
    else if (q.includes("热身") || q.includes("激活") || q.includes("活动度")) guessedCat = "热身";
    else if (q.includes("拉伸") || q.includes("伸展") || q.includes("筋膜") || q.includes("滚压")) guessedCat = "拉伸";
  }
  newEx.value = { 
    name: q, 
    category: guessedCat, 
    target: "", 
    scienceDetail: "", 
    defaultSets: 3, 
    defaultReps: "10-12" 
  };
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
