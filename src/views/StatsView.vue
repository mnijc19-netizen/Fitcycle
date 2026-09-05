<template>
  <div class="pb-32 px-4 pt-2 max-w-md mx-auto space-y-4">

    <!-- Top Header (Clean Apple Minimalist) -->
    <div class="flex items-center justify-between pt-1">
      <div>
        <h2 class="text-xl font-bold tracking-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-white'">
          统计与设置
        </h2>
        <p class="text-xs text-zinc-400 mt-0.5">
          战力排位 · 训练容量 · 系统偏好
        </p>
      </div>
    </div>

    <!-- Honor Rank & Body Metrics Dual Cards (Clean Glassmorphic) -->
    <div class="grid grid-cols-2 gap-2.5">
      <!-- 1. Honor & Rank Card -->
      <div @click="showHonorModal = true" 
           class="p-3.5 rounded-2xl cursor-pointer shadow-sm transition-all active:scale-98 group flex flex-col justify-between"
           :class="store.settings.themeMode === 'light' 
             ? 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-500/40' 
             : 'bg-zinc-900/80 hover:bg-zinc-850/90 border border-zinc-800/80 hover:border-amber-500/40'">
        <div class="flex items-center justify-between">
          <div class="w-8 h-8 flex items-center justify-center">
            <img v-if="honorData.presentation.tierSvg" :src="honorData.presentation.tierSvg" alt="Rank Medal" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            <span v-else class="text-xl group-hover:scale-105 transition-transform">{{ honorData.presentation.tierIcon }}</span>
          </div>
          <span class="text-xs font-mono font-bold" :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400'">{{ honorData.score }} PTS</span>
        </div>
        <div class="mt-2.5">
          <div class="text-xs font-bold truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">{{ honorData.presentation.tierName.split('·')[0] }}</div>
          <div class="text-[11px] text-zinc-400 mt-0.5 flex items-center justify-between">
            <span :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : ''">天梯排位</span>
            <span class="text-xs transition-colors" :class="store.settings.themeMode === 'light' ? 'text-slate-400 group-hover:text-slate-700' : 'text-zinc-500 group-hover:text-zinc-300'">❯</span>
          </div>
        </div>
      </div>

      <!-- 2. Body Circumference Card -->
      <div @click="showBodyModal = true"
           class="p-3.5 rounded-2xl cursor-pointer shadow-sm transition-all active:scale-98 group flex flex-col justify-between"
           :class="store.settings.themeMode === 'light' 
             ? 'bg-white hover:bg-slate-50 border border-slate-200 hover:border-sky-500/40' 
             : 'bg-zinc-900/80 hover:bg-zinc-850/90 border border-zinc-800/80 hover:border-sky-500/40'">
        <div class="flex items-center justify-between">
          <div class="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center"
               :class="store.settings.themeMode === 'light' ? 'text-sky-700' : 'text-sky-400'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span class="text-xs font-mono font-bold" :class="store.settings.themeMode === 'light' ? 'text-sky-700 font-black' : 'text-sky-400'">
            {{ (store.bodyMetrics && store.bodyMetrics.length) ? `V ${vTaperRatio}` : '未记录' }}
          </span>
        </div>
        <div class="mt-2.5">
          <div class="text-xs font-bold truncate" :class="store.settings.themeMode === 'light' ? 'text-slate-900 font-black' : 'text-zinc-100'">形体围度追踪</div>
          <div class="text-[11px] text-zinc-400 mt-0.5 flex items-center justify-between">
            <span :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : ''">身体档案</span>
            <span class="text-xs transition-colors" :class="store.settings.themeMode === 'light' ? 'text-slate-400 group-hover:text-slate-700' : 'text-zinc-500 group-hover:text-zinc-300'">❯</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Unified Lifetime Metrics (Apple Health / Fitness Summary Style) -->
    <div class="rounded-2xl p-4 shadow-sm border"
         :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900/80 border-zinc-800/80'">
      <div class="text-xs font-bold text-zinc-400 mb-3 px-0.5">累计生涯数据</div>
      <div class="grid grid-cols-2 gap-y-3.5 gap-x-4">
        <div>
          <div class="text-[11px] text-zinc-400">累计做工总容量</div>
          <div class="text-lg font-black font-mono mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
            {{ totalVolumeMetric }} <span class="text-xs font-normal text-zinc-500">kg</span>
          </div>
        </div>
        <div>
          <div class="text-[11px] text-zinc-400">累计特训打卡</div>
          <div class="text-lg font-black font-mono mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
            {{ store.workoutLogs.length }} <span class="text-xs font-normal text-zinc-500">次</span>
          </div>
        </div>
        <div>
          <div class="text-[11px] text-zinc-400">累计训练用时</div>
          <div class="text-lg font-black font-mono mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
            {{ totalHoursMetric }} <span class="text-xs font-normal text-zinc-500">小时</span>
          </div>
        </div>
        <div>
          <div class="text-[11px] text-zinc-400">完成总组数</div>
          <div class="text-lg font-black font-mono mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">
            {{ totalSetsMetric }} <span class="text-xs font-normal text-zinc-500">组</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Volume Trend Chart (Refined Minimalist Pills) -->
    <div class="rounded-2xl p-4 shadow-sm space-y-3 border"
         :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900/80 border-zinc-800/80'">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-300'">近期容量走势 (kg)</span>
        <span class="text-[10px] text-zinc-500 font-mono">近 7 次特训</span>
      </div>

      <div v-if="recentVolumeStats.length" class="pt-2">
        <div class="flex items-end justify-between gap-2 h-28 px-1">
          <div v-for="(item, idx) in recentVolumeStats" :key="idx"
               class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span class="text-[9px] font-mono text-zinc-400">{{ item.volume > 0 ? `${Math.round(item.volume / 1000)}k` : '0' }}</span>
            <div class="w-full rounded-full overflow-hidden flex items-end p-0.5" 
                 :class="store.settings.themeMode === 'light' ? 'bg-slate-100' : 'bg-zinc-800/50'"
                 style="height: 72px">
              <div class="w-full transition-all duration-500 rounded-full bg-gradient-to-t from-amber-500 to-amber-400"
                   :style="{ height: `${Math.max(12, item.percent)}%` }">
              </div>
            </div>
            <span class="text-[9px] text-zinc-500 font-mono truncate w-full text-center">{{ item.shortDate }}</span>
          </div>
        </div>
      </div>

      <div v-else class="py-6 text-center text-xs text-zinc-500">
        记录特训后将在此生成容量走势
      </div>
    </div>

    <!-- Training Preferences (iOS Grouped Section) -->
    <div class="space-y-1.5">
      <div class="text-xs font-bold text-zinc-400 px-1">训练偏好</div>
      <div class="rounded-2xl p-3.5 space-y-3 shadow-sm border"
           :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900/80 border-zinc-800/80'">
        
        <!-- Rest Timer Duration Setting -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">默认组间休息</span>
            <span class="font-bold font-mono" :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400'">{{ store.settings.defaultRestSeconds }} 秒</span>
          </div>
          <div class="grid grid-cols-4 gap-1 p-1 rounded-xl border"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950/80 border-zinc-800/60'">
            <button v-for="item in [
                      { sec: 60, label: '泵感' },
                      { sec: 90, label: '标准推荐' },
                      { sec: 120, label: '大肌群' },
                      { sec: 180, label: '力量' }
                    ]" 
                    :key="item.sec"
                    @click="store.settings.defaultRestSeconds = item.sec"
                    class="py-1.5 rounded-lg text-center transition-all flex flex-col items-center justify-center cursor-pointer"
                    :class="[
                      store.settings.defaultRestSeconds === item.sec 
                        ? 'bg-amber-500 text-zinc-950 font-black shadow-sm' 
                        : (store.settings.themeMode === 'light' ? 'bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200/90 shadow-xs' : 'text-zinc-400 hover:text-zinc-200')
                    ]">
              <span class="text-xs font-mono font-bold leading-none">{{ item.sec }}s</span>
              <span class="text-[9px] leading-none mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'opacity-85'">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- Sound Toggle -->
        <div class="flex items-center justify-between pt-2.5 border-t border-zinc-800/60">
          <div>
            <div class="text-xs font-medium" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">打卡提示音与倒计时铃声</div>
            <div class="text-[10px] text-zinc-500">完成单组及休息结束时播放提示音</div>
          </div>
          <button @click="store.settings.soundEnabled = !store.settings.soundEnabled"
                  class="w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer"
                  :class="[store.settings.soundEnabled ? 'bg-amber-500' : (store.settings.themeMode === 'light' ? 'bg-slate-300' : 'bg-zinc-800')]">
            <div class="w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm"
                 :class="[store.settings.soundEnabled ? 'translate-x-5' : 'translate-x-0']"></div>
          </button>
        </div>

        <!-- Vibration Toggle -->
        <div class="flex items-center justify-between pt-2.5 border-t border-zinc-800/60">
          <div>
            <div class="text-xs font-medium" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">触感震动反馈 (Haptic)</div>
            <div class="text-[10px] text-zinc-500">休息结束与打卡时提供震动反馈</div>
          </div>
          <button @click="store.settings.vibrationEnabled = !store.settings.vibrationEnabled"
                  class="w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer"
                  :class="[store.settings.vibrationEnabled ? 'bg-amber-500' : (store.settings.themeMode === 'light' ? 'bg-slate-300' : 'bg-zinc-800')]">
            <div class="w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm"
                 :class="[store.settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-0']"></div>
          </button>
        </div>

        <!-- Tactical Deload Shield Status Entry -->
        <div class="flex items-center justify-between pt-2.5 border-t border-zinc-800/60 cursor-pointer hover:opacity-80 transition-opacity"
             @click="showHonorModal = true">
          <div>
            <div class="text-xs font-bold flex items-center gap-1" :class="store.settings.themeMode === 'light' ? 'text-sky-800 font-black' : 'text-sky-300'">
              <span>🛡️</span>
              <span>战术减载盾牌</span>
            </div>
            <div class="text-[10px] mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'">
              <span v-if="isDeloadActive" class="font-bold" :class="store.settings.themeMode === 'light' ? 'text-emerald-700' : 'text-emerald-400'">免战休整生效中 (剩余 {{ honorData.shieldDaysRemaining }} 天)</span>
              <span v-else-if="honorData.shieldInventory.available > 0" class="font-medium" :class="store.settings.themeMode === 'light' ? 'text-sky-800' : 'text-sky-300'">储备: {{ honorData.shieldInventory.available }}/2 枚 (点击查看)</span>
              <span v-else-if="honorData.shieldInventory.isNoviceProbation" class="font-medium" :class="store.settings.themeMode === 'light' ? 'text-amber-800' : 'text-amber-400'">新兵筑基中 ({{ honorData.shieldInventory.currentChargeWorkouts }}/16 天)</span>
              <span v-else class="text-zinc-500">充能: {{ honorData.shieldInventory.currentChargeWorkouts }}/16 天</span>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </div>

      </div>
    </div>

    <!-- Appearance & Themes (iOS Inset Group) -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between px-1">
        <span class="text-xs font-bold text-zinc-400">外观主题</span>
        <span v-if="store.settings.unlockedSkins.length > 1" 
              class="text-[10px] text-zinc-500 font-mono">
          已解锁 {{ store.settings.unlockedSkins.length }} 款
        </span>
      </div>

      <div class="rounded-2xl p-3.5 space-y-3 shadow-sm border"
           :class="store.settings.themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-900/80 border-zinc-800/80'">
        <!-- Day / Night Appearance Mode Segmented Controller -->
        <div class="space-y-1.5 pb-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">环境光感</span>
            <span class="text-[10px] font-mono" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
              {{ store.settings.themeMode === 'light' ? '白昼晨光高反差' : '深邃夜色护眼' }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 p-1 rounded-xl border"
               :class="store.settings.themeMode === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950/60 border-zinc-800/80'">
            <button @click="handleSelectThemeMode('dark')"
                    type="button"
                    class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    :class="store.settings.themeMode !== 'light' ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700' : (store.settings.themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200')">
              <span class="text-sm">🌙</span>
              <span>深邃夜色</span>
            </button>
            <button @click="handleSelectThemeMode('light')"
                    type="button"
                    class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    :class="store.settings.themeMode === 'light' ? 'bg-white text-zinc-900 shadow-sm border border-slate-200' : 'text-zinc-400 hover:text-zinc-200'">
              <span class="text-sm">☀️</span>
              <span>白昼晨光</span>
            </button>
          </div>
          <p class="text-[10px] text-zinc-500 leading-tight">
            💡 切换明暗底色不更改当前段位称号与世界观，仅在日光强光下提供更极致清晰的文字对比度。
          </p>
        </div>

        <!-- Horizontal Scrollable Skin Carousel -->
        <div v-if="store.settings.unlockedSkins.length > 1" class="space-y-2 border-t border-zinc-800/60 pt-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-200'">主题世界观</span>
            <span class="text-[10px] font-mono" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">
              {{ store.settings.unlockedSkins.length }} 款已就绪
            </span>
          </div>
          <div class="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
            <!-- Default Skin -->
            <button @click="handleSelectSkin('default')"
                    class="flex-shrink-0 w-[155px] snap-start p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[88px] cursor-pointer"
                    :class="[
                      store.settings.uiSkin === 'default' 
                        ? (store.settings.themeMode === 'light' ? 'bg-amber-50/90 border-amber-500 shadow-sm ring-1 ring-amber-500/40 text-slate-900' : 'bg-zinc-800/90 border-amber-500/80 shadow-sm ring-1 ring-amber-500/40 text-white') 
                        : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700' : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 opacity-80 text-zinc-300')
                    ]">
              <div class="flex items-center justify-between w-full">
                <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">默认外观</span>
                <span v-if="store.settings.uiSkin === 'default'" class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              </div>
              <div class="text-[10px] leading-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">科学力量 · 深空/陶瓷白</div>
              <div class="flex items-center gap-1 mt-1">
                <span class="w-2 h-2 rounded-full bg-zinc-950 border border-zinc-700"></span>
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span v-if="store.settings.uiSkin === 'default'" class="text-[9px] font-bold ml-auto font-mono"
                      :class="store.settings.themeMode === 'light' ? 'text-amber-700' : 'text-amber-400'">使用中</span>
              </div>
            </button>

            <!-- Chamber Skin -->
            <button v-if="store.settings.unlockedSkins.includes('chamber')"
                    @click="handleSelectSkin('chamber')"
                    class="flex-shrink-0 w-[155px] snap-start p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[88px] cursor-pointer"
                    :class="[
                      store.settings.uiSkin === 'chamber' 
                        ? (store.settings.themeMode === 'light' ? 'bg-[#F0ECE1] border-[#9A7228] shadow-sm ring-1 ring-[#9A7228]/50 text-[#141B26]' : 'bg-[#0D1627] border-[#E5C378] shadow-sm ring-1 ring-[#E5C378]/50 text-[#F7F6F2]') 
                        : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700' : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 opacity-80 text-zinc-300')
                    ]">
              <div class="flex items-center justify-between w-full">
                <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">尚博勒</span>
                <span v-if="store.settings.uiSkin === 'chamber'" class="w-1.5 h-1.5 rounded-full bg-[#E5C378]"></span>
              </div>
              <div class="text-[10px] leading-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">法式特工 · 深蓝/白西装</div>
              <div class="flex items-center gap-1 mt-1">
                <span class="w-2 h-2 rounded-full bg-[#070B14] border border-[#1E3052]"></span>
                <span class="w-2 h-2 rounded-full bg-[#E5C378]"></span>
                <span v-if="store.settings.uiSkin === 'chamber'" class="text-[9px] font-bold ml-auto font-mono"
                      :class="store.settings.themeMode === 'light' ? 'text-[#9A7228]' : 'text-[#E5C378]'">使用中</span>
              </div>
            </button>

            <!-- CS2 Skin -->
            <button v-if="store.settings.unlockedSkins.includes('cs')"
                    @click="handleSelectSkin('cs')"
                    class="flex-shrink-0 w-[155px] snap-start p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[88px] cursor-pointer"
                    :class="[
                      store.settings.uiSkin === 'cs' 
                        ? (store.settings.themeMode === 'light' ? 'bg-[#E2E8F0] border-[#E04E00] shadow-sm ring-1 ring-[#E04E00]/50 text-[#090D16]' : 'bg-[#0F172A] border-[#F97316] shadow-sm ring-1 ring-[#F97316]/50 text-[#F8FAFC]') 
                        : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700' : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 opacity-80 text-zinc-300')
                    ]">
              <div class="flex items-center justify-between w-full">
                <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">CS2 特训</span>
                <span v-if="store.settings.uiSkin === 'cs'" class="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
              </div>
              <div class="text-[10px] leading-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">战术竞技 · 枪铁/极地雪原</div>
              <div class="flex items-center gap-1 mt-1">
                <span class="w-2 h-2 rounded-full bg-[#080C14] border border-[#1E293B]"></span>
                <span class="w-2 h-2 rounded-full bg-[#F97316]"></span>
                <span v-if="store.settings.uiSkin === 'cs'" class="text-[9px] font-bold ml-auto font-mono"
                      :class="store.settings.themeMode === 'light' ? 'text-[#E04E00]' : 'text-[#F97316]'">使用中</span>
              </div>
            </button>

            <!-- Monochrome Skin (典藏黑白) -->
            <button v-if="store.settings.unlockedSkins.includes('monochrome')"
                    @click="handleSelectSkin('monochrome')"
                    class="flex-shrink-0 w-[155px] snap-start p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[88px] cursor-pointer"
                    :class="[
                      store.settings.uiSkin === 'monochrome' 
                        ? (store.settings.themeMode === 'light' ? 'bg-[#EFEFEF] border-black shadow-sm ring-1 ring-black/50 text-black' : 'bg-[#121212] border-white shadow-sm ring-1 ring-white/50 text-white') 
                        : (store.settings.themeMode === 'light' ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700' : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 opacity-80 text-zinc-300')
                    ]">
              <div class="flex items-center justify-between w-full">
                <span class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-slate-900' : 'text-zinc-100'">典藏黑白</span>
                <span v-if="store.settings.uiSkin === 'monochrome'" class="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              <div class="text-[10px] leading-tight" :class="store.settings.themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'">极简纯粹 · 刀锋秩序</div>
              <div class="flex items-center gap-1 mt-1">
                <span class="w-2 h-2 rounded-full bg-black border border-white/60"></span>
                <span class="w-2 h-2 rounded-full bg-white"></span>
                <span v-if="store.settings.uiSkin === 'monochrome'" class="text-[9px] font-bold ml-auto font-mono"
                      :class="store.settings.themeMode === 'light' ? 'text-black' : 'text-white'">使用中</span>
              </div>
            </button>
          </div>

          <!-- Restore Default Button (only if custom skin active) -->
          <div v-if="store.settings.uiSkin !== 'default'" class="pt-0.5">
            <button @click="handleRestoreDefaultSkin"
                    class="w-full py-1.5 text-xs rounded-xl border transition-colors cursor-pointer"
                    :class="store.settings.themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-zinc-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'">
              恢复默认外观
            </button>
          </div>
        </div>

        <!-- Inline Unlock Passcode Bar -->
        <div class="space-y-1.5" :class="[store.settings.unlockedSkins.length > 1 ? 'border-t border-zinc-800/60 pt-2.5' : '']">
          <div class="flex items-center gap-2">
            <input type="text"
                   name="skin_passcode"
                   v-model="passcodeInput"
                   maxlength="30"
                   autocomplete="off"
                   autocapitalize="off"
                   autocorrect="off"
                   spellcheck="false"
                   @keydown.enter.prevent="handlePasscodeSubmit"
                   placeholder="输入解锁暗号..."
                   class="flex-1 border text-xs rounded-xl px-3 py-2 focus:outline-none transition-colors"
                   :class="store.settings.themeMode === 'light'
                     ? (passcodeError ? 'bg-white border-red-400 text-slate-900 placeholder-slate-400' : 'bg-slate-50 border-slate-200 focus:border-amber-600 text-slate-900 placeholder-slate-400')
                     : (passcodeError ? 'bg-zinc-950/80 border-red-500/80 focus:border-red-500 text-zinc-100 placeholder-zinc-500' : 'bg-zinc-950/80 border-zinc-800 focus:border-amber-500/60 text-zinc-100 placeholder-zinc-500')" />
            <button @click="handlePasscodeSubmit"
                    class="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex-shrink-0">
              解锁
            </button>
          </div>
          <div v-if="passcodeError" class="text-[11px] text-red-500 pl-1 font-medium">
            暗号不正确
          </div>
        </div>

      </div>
    </div>

    <!-- AI Coach Entry (Clean Inset Group) -->
    <div class="space-y-1.5">
      <div class="text-xs font-bold text-zinc-400 px-1">智能教练</div>
      <div class="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-amber-500/40 active:scale-98 transition-all group shadow-sm"
           @click="showAISettingsModal = true"
           data-testid="open-ai-settings-modal">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            ✦
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-xs font-bold text-zinc-100">AI 智能教练</h3>
              <span class="text-[9px] px-1.5 py-0.2 rounded-full border font-mono font-medium"
                    :class="aiConnected ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 bg-zinc-950 text-zinc-500'">
                {{ aiConnected ? '已就绪' : '未连接' }}
              </span>
            </div>
            <p class="text-[11px] text-zinc-400 truncate mt-0.5">
              {{ aiConnected ? `${activeAIProvider.name} · ${activeAIModel?.name || getActiveModelId()}` : '点击配置 DeepSeek / 智谱 / 通义千问' }}
            </p>
          </div>
        </div>
        <div class="text-zinc-500 group-hover:text-zinc-300 text-xs transition-colors pl-2">
          ❯
        </div>
      </div>
    </div>

    <!-- Full AI Settings Modal Sheet -->
    <Teleport to="body">
      <div v-if="showAISettingsModal" 
           class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
           style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
        <!-- Backdrop -->
        <div class="absolute inset-0" @click="showAISettingsModal = false"></div>
        
        <!-- Modal Container with Fixed Header and Scrollable Body -->
        <section class="relative w-full max-w-lg h-[min(88dvh,720px)] bg-zinc-950 border border-zinc-700 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-6 duration-200">
          <!-- Top Ergonomic Grabber Pill -->
          <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0 z-20"></div>

          <!-- Fixed Header -->
          <header class="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-bold text-sm">✦</span>
              <h2 class="text-xs font-bold text-zinc-100 uppercase tracking-wider">AI 智能教练配置</h2>
            </div>
            <button type="button" @click="showAISettingsModal = false" class="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer">✕</button>
          </header>

          <!-- Scrollable Content Area with Generous Bottom Padding -->
          <div class="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4" style="padding-bottom: max(calc(env(safe-area-inset-bottom, 0px) + 6rem), 5rem);">
            <AISettingsPanel @open-chat="handleOpenChatFromSettings" />
          </div>
        </section>
      </div>
    </Teleport>

    <!-- Strength Placement & Calibration (力量能力基准定级) -->
    <div class="space-y-1.5">
      <div class="text-xs font-bold text-zinc-400 px-1">力量能力基准</div>
      <div class="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/60 shadow-sm">
        <div @click="showStrengthModal = true"
             class="p-3.5 hover:bg-zinc-850/60 active:bg-zinc-800 cursor-pointer flex items-center justify-between transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 text-xs">
              ⚡
            </div>
            <div>
              <div class="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <span>力量水平定级与初始重量</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {{ currentStrengthConfig.name }}
                </span>
              </div>
              <div class="text-[10px] text-zinc-400 mt-0.5">一键自适应全计划起步重量，老铁无需从空杆重调</div>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </div>
      </div>
    </div>

    <!-- Guides & Codex (Clean iOS Inset List) -->
    <div class="space-y-1.5">
      <div class="text-xs font-bold text-zinc-400 px-1">使用指南与规则</div>
      <div class="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/60 shadow-sm">
        <div @click="showRulesModal = true"
             class="p-3.5 hover:bg-zinc-850/60 active:bg-zinc-800 cursor-pointer flex items-center justify-between transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-400 text-xs">
              ⚖️
            </div>
            <div>
              <div class="text-xs font-bold text-zinc-100">天梯排位与做工规则</div>
              <div class="text-[10px] text-zinc-400 mt-0.5">段位体系、积分计算与衰减机制</div>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </div>

        <div @click="showOnboardingModal = true"
             class="p-3.5 hover:bg-zinc-850/60 active:bg-zinc-800 cursor-pointer flex items-center justify-between transition-colors">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-sky-400 text-xs">
              🧭
            </div>
            <div>
              <div class="text-xs font-bold text-zinc-100">新手功能向导</div>
              <div class="text-[10px] text-zinc-400 mt-0.5">浏览核心功能与操作流程</div>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </div>
      </div>
    </div>

    <!-- Data Backup & Reset (Clean iOS Inset List) -->
    <div class="space-y-1.5">
      <div class="text-xs font-bold text-zinc-400 px-1">数据管理</div>
      <div class="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/60 shadow-sm">
        <!-- Export -->
        <button @click="handleExport" 
                class="w-full p-3.5 hover:bg-zinc-850/60 active:bg-zinc-800 flex items-center justify-between transition-colors text-left cursor-pointer">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <div class="text-xs font-bold text-zinc-100">导出数据备份</div>
              <div class="text-[10px] text-zinc-500 mt-0.5">下载 JSON 备份文件至本地</div>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </button>

        <!-- Import -->
        <button @click="triggerFileInput" 
                class="w-full p-3.5 hover:bg-zinc-850/60 active:bg-zinc-800 flex items-center justify-between transition-colors text-left cursor-pointer">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <div class="text-xs font-bold text-zinc-100">导入恢复数据</div>
              <div class="text-[10px] text-zinc-500 mt-0.5">从 JSON 备份文件还原记录</div>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </button>
        <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleFileSelected" />

        <!-- Clear Logs -->
        <button @click="handleClearHistory" 
                class="w-full p-3.5 hover:bg-zinc-850/60 active:bg-zinc-800 flex items-center justify-between transition-colors text-left cursor-pointer">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                 :class="store.settings.themeMode === 'light' ? 'bg-amber-500/20 text-amber-800' : 'bg-amber-500/10 text-amber-400'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <div class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-amber-800 font-black' : 'text-amber-400'">清空历史打卡记录</div>
              <div class="text-[10px] mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-500'">清除打卡日志，保留自定义计划与皮肤</div>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </button>

        <!-- Factory Reset -->
        <button @click="handleResetDefaults" 
                class="w-full p-3.5 hover:bg-zinc-850/60 active:bg-zinc-800 flex items-center justify-between transition-colors text-left cursor-pointer">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                 :class="store.settings.themeMode === 'light' ? 'bg-red-500/15 text-red-600' : 'bg-red-500/10 text-red-400'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div class="text-xs font-bold" :class="store.settings.themeMode === 'light' ? 'text-red-700 font-black' : 'text-red-400/90'">恢复出厂默认设置</div>
              <div class="text-[10px] mt-0.5" :class="store.settings.themeMode === 'light' ? 'text-slate-600 font-medium' : 'text-zinc-500'">重置全部计划与数据为初始状态</div>
            </div>
          </div>
          <span class="text-zinc-500 text-xs">❯</span>
        </button>
      </div>

      <p class="text-[10px] text-zinc-500 px-1 pt-1 leading-relaxed">
        所有数据均保存在本地浏览器中，离线可用。建议定期导出备份。
      </p>
    </div>

    <!-- In-page Toast Notification -->
    <div v-if="toastText"
         class="fixed top-16 left-1/2 -translate-x-1/2 z-[150] px-4 py-2 bg-zinc-900/95 border border-amber-500/50 shadow-2xl rounded-full text-xs font-bold text-amber-400 flex items-center gap-2 backdrop-blur-md">
      <span class="animate-pulse text-sm">✦</span>
      <span>{{ toastText }}</span>
    </div>

    <!-- Honor Showcase Modal -->
    <HonorShowcaseModal 
      :visible="showHonorModal" 
      @close="showHonorModal = false" 
      @open-rules="showHonorModal = false; showRulesModal = true"
    />

    <!-- Body Metrics Modal -->
    <BodyMetricsModal 
      :visible="showBodyModal" 
      @close="showBodyModal = false" 
    />

    <!-- Rules Codex Modal -->
    <RulesCodexModal
      :visible="showRulesModal"
      @close="showRulesModal = false"
    />

    <!-- User Onboarding Guided Tour Modal -->
    <UserOnboardingModal
      :visible="showOnboardingModal"
      @close="showOnboardingModal = false"
    />

    <!-- Strength Placement & Calibration Modal -->
    <StrengthPlacementModal
      :visible="showStrengthModal"
      @close="showStrengthModal = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import AISettingsPanel from "../components/AISettingsPanel.vue";
import HonorShowcaseModal from "../components/HonorShowcaseModal.vue";
import BodyMetricsModal from "../components/BodyMetricsModal.vue";
import RulesCodexModal from "../components/RulesCodexModal.vue";
import UserOnboardingModal from "../components/UserOnboardingModal.vue";
import StrengthPlacementModal from "../components/StrengthPlacementModal.vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import {
  aiSession,
  getActiveApiKey,
  getActiveProvider,
  getActiveModelId,
  getActiveModels
} from "../ai/aiSession.js";
import { 
  store, 
  exportBackupJSON, 
  importBackupJSON, 
  clearWorkoutHistory,
  resetAllDataToDefault,
  unlockSkin,
  setUISkin,
  restoreDefaultSkin,
  getFullHonorProfile,
  toggleDeloadShield,
  setThemeMode,
  STRENGTH_LEVEL_CONFIGS
} from "../store/fitnessStore.js";

const showHonorModal = ref(false);
const showBodyModal = ref(false);
const showRulesModal = ref(false);
const showOnboardingModal = ref(false);
const showStrengthModal = ref(false);

const currentStrengthConfig = computed(() => {
  const lvl = store.settings.strengthLevel || "intermediate";
  return STRENGTH_LEVEL_CONFIGS[lvl] || STRENGTH_LEVEL_CONFIGS.intermediate;
});

const honorData = computed(() => getFullHonorProfile());
const isDeloadActive = computed(() => honorData.value.isDeloadActive);

const vTaperRatio = computed(() => {
  const history = store.bodyMetrics || [];
  if (!history.length) return "1.20";
  const latest = history[history.length - 1];
  if (!latest.waist || latest.waist === 0) return "1.20";
  const ratio = (latest.chest || 0) / latest.waist;
  return ratio > 0 ? ratio.toFixed(2) : "1.20";
});

const showAISettingsModal = ref(false);

watch(showAISettingsModal, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
});

onUnmounted(() => {
  if (showAISettingsModal.value) unlockBodyScroll();
});

const activeAIProvider = computed(getActiveProvider);
const activeAIModels = computed(getActiveModels);
const aiConnected = computed(() => Boolean(getActiveApiKey() && activeAIModels.value.length));
const activeAIModel = computed(() => activeAIModels.value.find((m) => m.id === getActiveModelId()));

function handleOpenChatFromSettings() {
  showAISettingsModal.value = false;
  aiSession.drawerOpen = true;
}

const fileInput = ref(null);
const passcodeInput = ref("");
const showPasscode = ref(false);
const passcodeError = ref(false);
const toastText = ref("");
let toastTimeout = null;

function showToast(msg) {
  toastText.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastText.value = "";
  }, 2500);
}

function handleSelectThemeMode(mode) {
  setThemeMode(mode);
  showToast(mode === "light" ? "☀️ 已切换为白昼晨光高反差模式" : "🌙 已切换为深邃夜色护眼模式");
}

function handlePasscodeSubmit() {
  passcodeError.value = false;
  const result = unlockSkin(passcodeInput.value);
  if (result.success) {
    passcodeInput.value = "";
    passcodeError.value = false;
    showToast(result.message);
  } else {
    passcodeError.value = true;
  }
}

function handleSelectSkin(skinName) {
  setUISkin(skinName);
  if (skinName === "chamber") {
    showToast("已启用尚博勒隐藏皮肤");
  } else if (skinName === "cs") {
    showToast("💥 已启用 CS2 完美特训战术皮肤");
  } else if (skinName === "monochrome") {
    showToast("已启用典藏黑白纯粹美学皮肤");
  } else {
    showToast("已切换至默认外观");
  }
}

function handleRestoreDefaultSkin() {
  const result = restoreDefaultSkin();
  showToast(result.message);
}

const totalVolumeMetric = computed(() => {
  const sum = store.workoutLogs.reduce((acc, l) => acc + (l.totalVolume || 0), 0);
  return sum.toLocaleString();
});

const totalHoursMetric = computed(() => {
  const totalSec = store.workoutLogs.reduce((acc, l) => acc + (l.durationSeconds || 0), 0);
  return (totalSec / 3600).toFixed(1);
});

const totalSetsMetric = computed(() => {
  return store.workoutLogs.reduce((acc, l) => acc + (l.totalSets || 0), 0);
});

const recentVolumeStats = computed(() => {
  const logs = [...store.workoutLogs]
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    .slice(-7);

  if (!logs.length) return [];
  const maxVol = Math.max(1, ...logs.map(l => l.totalVolume || 0));

  return logs.map(l => {
    const parts = (l.date || "").split("-");
    const shortDate = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : l.date;
    return {
      date: l.date,
      shortDate,
      volume: l.totalVolume || 0,
      color: l.color || "amber",
      percent: Math.round(((l.totalVolume || 0) / maxVol) * 100)
    };
  });
});

function handleExport() {
  const json = exportBackupJSON();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `FitCycle_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerFileInput() {
  if (fileInput.value) fileInput.value.click();
}

function handleFileSelected(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result;
    if (typeof content === "string") {
      const ok = importBackupJSON(content);
      if (ok) {
        showToast("🎉 备份数据已成功恢复！");
      } else {
        alert("❌ 备份文件格式错误，导入失败。");
      }
    }
  };
  reader.readAsText(file);
}

function handleClearHistory() {
  if (confirm("确定要清空所有历史打卡记录与形体测绘数据吗？\n\n此操作将清除打卡日志与做工历史，但会【保留您自定义的训练计划与已解锁的皮肤】。适合试用后重新开始正式记录。")) {
    clearWorkoutHistory();
    showToast("🗑️ 历史训练记录已全部清空！");
  }
}

function handleResetDefaults() {
  if (confirm("确定要恢复出厂默认设置吗？已有的自定义修改将被重置为推拉腿黄金模板。")) {
    resetAllDataToDefault();
    showToast("已恢复出厂默认设置！");
  }
}
</script>

