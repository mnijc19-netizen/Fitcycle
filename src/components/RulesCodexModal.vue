<template>
  <Teleport to="body">
    <div v-if="visible" 
         class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
         style="padding-top: max(env(safe-area-inset-top, 0px), 12px); padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);">
      <!-- Backdrop blur -->
      <div class="absolute inset-0" @click="$emit('close')"></div>

      <!-- Rules Codex Container -->
      <div class="relative w-full max-w-lg bg-[var(--fc-modal-bg,#18181b)] border border-zinc-700/80 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 text-zinc-100">
        
        <!-- Top Ergonomic Grabber -->
        <div class="w-10 h-1 rounded-full bg-zinc-700/80 mx-auto -mt-1 mb-1 flex-shrink-0"></div>

        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-3 border-b border-zinc-800/80 flex-shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/20 flex-shrink-0">
              <svg class="w-5 h-5 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-black tracking-wide text-white">FitCycle 运动科学与排位规则法典</h3>
              <p class="text-[10px] text-zinc-400 font-mono tracking-wider">GAME RULES & SPORTS SCIENCE CODEX</p>
            </div>
          </div>
          <button @click="$emit('close')" 
                  class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition-all cursor-pointer flex-shrink-0">
            ✕
          </button>
        </div>

        <!-- Dynamic User Rank Status Card (Personalized Anchor) -->
        <div class="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-zinc-900/90 to-zinc-900/90 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner flex-shrink-0">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-zinc-950/80 border border-amber-500/40 p-1 flex items-center justify-center shadow-md flex-shrink-0">
              <img v-if="userHonor.presentation.tierSvg" :src="userHonor.presentation.tierSvg" alt="Current Rank" class="w-full h-full object-contain filter drop-shadow" />
              <span v-else class="text-xl">{{ userHonor.presentation.tierIcon }}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-black border border-amber-500/30">当前段位</span>
                <span class="text-xs font-black text-white truncate">{{ userHonor.presentation.tierName }}</span>
              </div>
              <div class="text-[11px] font-mono text-zinc-300 font-bold mt-0.5">
                {{ userHonor.score }} <span class="text-[9px] text-zinc-400 font-normal">FPS 综合战力</span>
              </div>
            </div>
          </div>

          <div class="text-right flex-shrink-0">
            <div v-if="!userHonor.tier.isApex" class="space-y-0.5">
              <span class="text-[10px] text-zinc-400 block">距下一阶还需</span>
              <span class="text-xs font-black font-mono text-amber-400">+{{ Math.max(0, userHonor.tier.nextTierScore - userHonor.score) }} <span class="text-[9px]">分</span></span>
            </div>
            <div v-else>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">👑 巅峰神话</span>
            </div>
          </div>
        </div>

        <!-- Category Filter Tabs (Horizontal Scrollable) -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 flex-shrink-0 scrollbar-none overscroll-x-contain touch-pan-x">
          <button v-for="tab in ruleCategories" :key="tab.id"
                  @click="activeCategory = tab.id"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  :class="[
                    activeCategory === tab.id 
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/20' 
                      : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  ]">
            <span>{{ tab.icon }}</span>
            <span>{{ tab.name }}</span>
          </button>
        </div>

        <!-- Tab Content Panel (Scrollable) -->
        <div class="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs text-zinc-300 leading-relaxed font-sans overscroll-contain"
             style="-webkit-overflow-scrolling: touch;">
          
          <!-- ============================================================== -->
          <!-- 1. FPS 战力天梯与排位加分                                      -->
          <!-- ============================================================== -->
          <div v-if="activeCategory === 'ranking'" class="space-y-3.5">
            
            <!-- Skin Localization Preview Selector -->
            <div class="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-black text-amber-400 flex items-center gap-1">
                  <span>🎨</span> 主题皮肤段位映射预览
                </span>
                <span class="text-[10px] text-zinc-400 font-mono">点击切换探索</span>
              </div>
              <div class="grid grid-cols-4 gap-1.5">
                <button v-for="skin in skinPreviewOptions" :key="skin.id"
                        @click="selectedSkinPreview = skin.id"
                        class="px-1.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center gap-0.5 border cursor-pointer"
                        :class="selectedSkinPreview === skin.id 
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm' 
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-zinc-200'">
                  <span class="text-sm">{{ skin.icon }}</span>
                  <span class="truncate w-full text-center">{{ skin.name }}</span>
                </button>
              </div>
            </div>

            <!-- 7-Tier Rank Ladder Cards -->
            <div class="space-y-2">
              <div class="flex items-center justify-between px-1">
                <span class="text-xs font-black text-zinc-100 flex items-center gap-1.5">
                  <span>🏆</span> 7 阶绝对天梯段位体系
                </span>
                <span class="text-[10px] font-mono text-zinc-400">0 ~ 3000+ 分</span>
              </div>

              <div class="space-y-2">
                <div v-for="tier in previewTiers" :key="tier.tier"
                     class="p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 relative overflow-hidden"
                     :class="[
                       tier.isCurrent
                         ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                         : tier.tier === 7
                           ? 'bg-gradient-to-r from-purple-950/40 via-zinc-900 to-amber-950/40 border-amber-500/40'
                           : 'bg-zinc-900/80 border-zinc-800/80'
                     ]">
                  
                  <!-- Rank Medal SVG and Tier Titles -->
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-11 h-11 rounded-2xl p-1 flex items-center justify-center flex-shrink-0 relative"
                         :class="tier.tier === 7 ? 'bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/50' : 'bg-zinc-950/90 border border-zinc-800'">
                      <img v-if="tier.svg" :src="tier.svg" :alt="tier.name" class="w-full h-full object-contain filter drop-shadow" />
                      <span v-else class="text-2xl">{{ tier.icon }}</span>
                    </div>

                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-black text-white truncate">{{ tier.name }}</span>
                        <span v-if="tier.isCurrent" class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-zinc-950 animate-pulse flex-shrink-0">
                          你在此
                        </span>
                      </div>
                      <p class="text-[10px] text-zinc-400 truncate mt-0.5">{{ tier.sub }}</p>
                    </div>
                  </div>

                  <!-- Score Pill -->
                  <div class="text-right flex-shrink-0">
                    <span class="px-2 py-1 rounded-xl text-[10px] font-black font-mono border"
                          :class="tier.tier === 7 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-950 text-zinc-300 border-zinc-800'">
                      {{ tier.rangeText }}
                    </span>
                  </div>

                </div>
              </div>
            </div>

            <!-- Single Workout Performance Rating & Formula -->
            <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <span>⚡</span> 单场特训做工与战力加分公式
                </span>
                <span class="text-[10px] font-mono text-zinc-400">单场结算</span>
              </div>

              <!-- Visual Math Formula Flow Card -->
              <div class="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 text-center space-y-1.5">
                <div class="text-[11px] font-mono font-black text-zinc-200 flex items-center justify-center gap-1.5 flex-wrap">
                  <span class="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">基础做工分 (+10~50)</span>
                  <span>+</span>
                  <span class="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">超负荷 PR (+15)</span>
                  <span>×</span>
                  <span class="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">复苏倍率 (1.5x)</span>
                  <span>=</span>
                  <span class="px-2.5 py-0.5 rounded-lg bg-amber-500 text-zinc-950 font-black">最终战力加分</span>
                </div>
                <p class="text-[10px] text-zinc-400">基于真实总吨位、动作强度与自律频次三维综合评定</p>
              </div>

              <!-- 4 Performance Grade Cards (S/A/B/C) -->
              <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div class="p-2 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="text-amber-400 font-bold">🏆 S 级满载特训</span>
                    <span class="text-amber-300 font-black">+50 PTS</span>
                  </div>
                  <p class="text-zinc-400 text-[9px]">≥14 组 且 总吨位 ≥6,500 kg</p>
                </div>

                <div class="p-2 rounded-xl bg-zinc-950 border border-sky-500/30 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="text-sky-400 font-bold">⭐ A 级深度做工</span>
                    <span class="text-sky-300 font-black">+35 PTS</span>
                  </div>
                  <p class="text-zinc-400 text-[9px]">≥10 组 且 总吨位 ≥3,000 kg</p>
                </div>

                <div class="p-2 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="text-emerald-400 font-bold">⚡ B 级标准打卡</span>
                    <span class="text-emerald-300 font-black">+20 PTS</span>
                  </div>
                  <p class="text-zinc-400 text-[9px]">≥6 组 或 基础吨位做工达成</p>
                </div>

                <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 space-y-0.5">
                  <div class="flex items-center justify-between">
                    <span class="text-zinc-400 font-bold">🌱 C 级轻量热身</span>
                    <span class="text-zinc-300 font-black">+10 PTS</span>
                  </div>
                  <p class="text-zinc-500 text-[9px]">&lt;6 组 或 轻量激活活动</p>
                </div>
              </div>

              <!-- Interactive Score Mini-Estimator -->
              <div class="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="font-bold text-zinc-300">🎮 战力加分即时速算：</span>
                  <span class="font-mono text-amber-300 font-black text-xs">
                    预计加分: +{{ estimatedScore }} PTS
                  </span>
                </div>
                
                <div class="flex items-center gap-1.5">
                  <button v-for="grade in ['S', 'A', 'B', 'C']" :key="grade"
                          @click="calcGrade = grade"
                          class="flex-1 py-1 rounded-lg font-mono font-bold text-[10px] border transition-all cursor-pointer"
                          :class="calcGrade === grade ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800'">
                    {{ grade }} 级
                  </button>
                </div>

                <div class="flex items-center gap-2 pt-0.5 text-[10px]">
                  <label class="flex items-center gap-1 cursor-pointer select-none">
                    <input type="checkbox" v-model="calcOverload" class="rounded accent-amber-500" />
                    <span :class="calcOverload ? 'text-amber-300 font-bold' : 'text-zinc-400'">超负荷 PR (+15)</span>
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer select-none">
                    <input type="checkbox" v-model="calcComeback" class="rounded accent-emerald-500" />
                    <span :class="calcComeback ? 'text-emerald-300 font-bold' : 'text-zinc-400'">停训5天回归 (1.5x)</span>
                  </label>
                </div>
              </div>

            </div>

            <!-- CS2 Official Style Annual Prestige Reset -->
            <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-purple-400 flex items-center gap-1.5">
                  <span>🎖️</span> CS2 同款：年度服役勋章与声望转生
                </span>
                <span class="text-[10px] font-mono text-zinc-400">2900+ 开启</span>
              </div>
              <p class="text-[11px] text-zinc-300">
                战力冲上 <strong class="text-amber-300">2900+ 分</strong> 巅峰后，可开启【年度声望转生】。战力回落至 2400 分重新冲榜，并永久点亮当年度服役勋章星级（可逐级转生至 6 阶至尊紫红星）！
              </p>
              
              <!-- Prestige Medals Row -->
              <div class="grid grid-cols-6 gap-1 pt-1">
                <div v-for="p in prestigeList" :key="p.level"
                     class="p-1.5 rounded-xl border text-center space-y-1 bg-zinc-950 flex flex-col items-center"
                     :style="{ borderColor: p.border }">
                  <img :src="p.svg" :alt="p.name" class="w-6 h-6 object-contain" />
                  <span class="text-[8px] font-mono block truncate w-full" :style="{ color: p.color }">{{ p.level }}阶</span>
                </div>
              </div>
            </div>

          </div>

          <!-- ============================================================== -->
          <!-- 2. 衰减机制与战术减载                                          -->
          <!-- ============================================================== -->
          <div v-else-if="activeCategory === 'decay'" class="space-y-3.5">
            
            <!-- 4-Stage Biological Decay Timeline -->
            <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-orange-400 flex items-center gap-1.5">
                  <span>⏳</span> 4 阶生物学生理衰减时间轴
                </span>
                <span class="text-[10px] font-mono text-emerald-400 font-bold">72h 绝对免责</span>
              </div>
              
              <p class="text-[11px] text-zinc-300">
                人体骨骼肌在停训后经历神经募集减弱与肌糖原消退。FitCycle 严格遵循运动生理学超量恢复曲线，绝不盲目扣分：
              </p>

              <!-- Vertical Stepped Timeline -->
              <div class="space-y-2.5 pt-1">
                
                <!-- Stage 1: 0 - 72h -->
                <div class="relative pl-6 pb-2 border-l-2 border-emerald-500/80">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-zinc-950 font-bold">
                    ✓
                  </div>
                  <div class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-emerald-300">0 ~ 72 小时 (0-3天)</span>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-zinc-950">100% 绝对保护 · 0 扣分</span>
                    </div>
                    <p class="text-[10px] text-zinc-300 leading-relaxed">
                      <strong>科学超量恢复黄金期：</strong> 肌肉微损伤修复与肌原纤维超量合成受宪法绝对保护，不练也是在涨肌！
                    </p>
                  </div>
                </div>

                <!-- Stage 2: 72 - 96h -->
                <div class="relative pl-6 pb-2 border-l-2 border-amber-500/60">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-zinc-950 font-bold">
                    !
                  </div>
                  <div class="p-2.5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-amber-300">72 ~ 96 小时 (第4天)</span>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">每日微扣 -5 FPS</span>
                    </div>
                    <p class="text-[10px] text-zinc-400 leading-relaxed">
                      <strong>轻微神经生锈预警：</strong> 神经募集效率开始微降，今日到健身房轻量活动即可迅速唤醒肌肉！
                    </p>
                  </div>
                </div>

                <!-- Stage 3: 96 - 168h -->
                <div class="relative pl-6 pb-2 border-l-2 border-orange-500/60">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-zinc-950 font-bold">
                    !
                  </div>
                  <div class="p-2.5 rounded-xl bg-zinc-950 border border-orange-500/30 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-orange-300">96 ~ 168 小时 (5-7天)</span>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">每日扣减 -15 FPS</span>
                    </div>
                    <p class="text-[10px] text-zinc-400 leading-relaxed">
                      <strong>肌糖原消退阶段：</strong> 充血泵感与肌细胞水分自然代谢，进入温和催练阶段，提醒及时归队。
                    </p>
                  </div>
                </div>

                <!-- Stage 4: > 168h -->
                <div class="relative pl-6">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-white font-bold">
                    ×
                  </div>
                  <div class="p-2.5 rounded-xl bg-zinc-950 border border-red-500/30 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-red-400">168 小时以上 (7天+)</span>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">每日扣减 -25 FPS (大段位保底)</span>
                    </div>
                    <p class="text-[10px] text-zinc-400 leading-relaxed">
                      <strong>深度休眠保底防线：</strong> 触发大段位锁死保护，绝不扣穿当前大段位底线，随时准备破冰复苏！
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <!-- 150% Comeback Boost Card -->
            <div class="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/40 space-y-2 shadow-sm">
              <div class="flex items-center gap-2 text-emerald-400 font-black text-xs">
                <span class="text-base">⚡</span>
                <span>150% 爆发复苏加成 (Comeback Boost)</span>
              </div>
              <p class="text-[11px] text-zinc-200 leading-relaxed">
                若因工作忙碌、出差或生病停训超过 <strong>5 天（≥ 120小时）</strong>，重新回归健身房完成首场打卡时，系统将自动触发 <span class="text-emerald-400 font-black font-mono">150% 爆发复苏加成</span>，帮助你一战极速补回掉落分数，彻底消解停训焦虑！
              </p>
            </div>

            <!-- Tactical Deload Shield Module -->
            <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-sky-400 flex items-center gap-1.5">
                  <span>🛡️</span> 战术减载盾牌：运动生理学原理与充能
                </span>
                <span class="text-[10px] font-mono text-zinc-400">CNS 疲劳消解</span>
              </div>
              
              <p class="text-[11px] text-zinc-300 leading-relaxed">
                在连续经历 4~6 周（16次+）高强度超负荷特训后，中枢神经系统 (CNS) 疲劳累积达到临界值。适时进入 7 天减载周可促发超量恢复，避免过度训练综合征。
              </p>

              <!-- 3 Modular Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] pt-1">
                <div class="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div class="text-amber-400 font-bold flex items-center gap-1">
                    <span>🔋</span> 16 次特训铸造
                  </div>
                  <p class="text-zinc-400 text-[9px] leading-tight">每打卡 16 次有效特训（约1个月推拉腿）铸造 1 枚，上限储备 2 枚。</p>
                </div>

                <div class="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div class="text-sky-400 font-bold flex items-center gap-1">
                    <span>🛡️</span> 7 天 0 衰减保护
                  </div>
                  <p class="text-zinc-400 text-[9px] leading-tight">激活开启 7 天战力绝对冻结期（0 扣分），全站日历看板同步休整。</p>
                </div>

                <div class="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <div class="text-emerald-400 font-bold flex items-center gap-1">
                    <span>⏳</span> 21 天科学自适应
                  </div>
                  <p class="text-zinc-400 text-[9px] leading-tight">使用后享有 21 天自适应冷却，确保有充足超负荷积累，杜绝连续躺平。</p>
                </div>
              </div>

            </div>

          </div>

          <!-- ============================================================== -->
          <!-- 3. 渐进超负荷与动作基准                                        -->
          <!-- ============================================================== -->
          <div v-else-if="activeCategory === 'overload'" class="space-y-3.5">
            <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2.5">
              <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
                <span>📈</span> 渐进超负荷比对法则
              </div>
              <p class="text-zinc-300 text-[11px]">
                增肌的核心在于施加超越以往的机械张力。系统在每次打卡时，会自动调取该动作最近一次的历史对应组：
              </p>
              <div class="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div class="p-2 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-0.5">
                  <span class="text-amber-400 font-bold flex items-center gap-1">🔥 重量 PR 突破</span>
                  <p class="text-zinc-400 text-[9px]">当前组重量超越上次历史，点亮金色火焰微标。</p>
                </div>
                <div class="p-2 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-0.5">
                  <span class="text-emerald-400 font-bold flex items-center gap-1">⚡ 次数超负荷</span>
                  <p class="text-zinc-400 text-[9px]">同重量下完成更多有效次数，点亮翡翠能量光环。</p>
                </div>
                <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 space-y-0.5">
                  <span class="text-zinc-300 font-bold flex items-center gap-1">✓ 达成基准</span>
                  <p class="text-zinc-400 text-[9px]">重量与次数与上次持平，巩固力量平台。</p>
                </div>
                <div class="p-2 rounded-xl bg-zinc-950 border border-sky-500/30 space-y-0.5">
                  <span class="text-sky-400 font-bold flex items-center gap-1">🌱 首训建档</span>
                  <p class="text-zinc-400 text-[9px]">首次完成动作自动沉淀为基准，供未来对比。</p>
                </div>
              </div>
            </div>

            <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
                <span>🌙</span> 跨午夜训练与单日多练公理
              </div>
              <p class="text-zinc-300 text-[11px] leading-relaxed">
                <strong>起练时间归属：</strong> 夜猫子训练（如 23:30 练到次日 00:30），训练归属于点击【开始训练】的起始日，杜绝日历错位；<br>
                <strong>单日多次训练：</strong> 早晨晨跑 + 晚上推胸，做工容量全额累加，出勤打卡精确计为当日 1 次全勤，杜绝重复刷天数。
              </p>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 4. 形体测绘与美学比例                                          -->
          <!-- ============================================================== -->
          <div v-else-if="activeCategory === 'body'" class="space-y-3.5">
            <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2.5">
              <div class="text-purple-400 font-black flex items-center gap-1.5 text-xs">
                <span>📐</span> 黄金 V-Taper 倒三角美学比例
              </div>
              <p class="text-zinc-300 text-[11px]">
                通过记录胸围、腰围、臂围与大腿围，系统基于人体解剖学标准自动计算视觉比例：
              </p>
              <div class="space-y-2 font-mono text-[10px] pt-1">
                <div class="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span>胸腰比 (Chest / Waist):</span>
                  <span class="text-purple-300 font-bold text-xs">黄金标准 1.25 ~ 1.35+</span>
                </div>
                <div class="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span>肩腰比 (Shoulder / Waist):</span>
                  <span class="text-purple-300 font-bold text-xs">健美大师 1.40 ~ 1.618</span>
                </div>
              </div>
            </div>

            <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <div class="text-purple-400 font-black flex items-center gap-1.5 text-xs">
                <span>⏱️</span> 7 天测绘防刷冷却与勋章
              </div>
              <p class="text-zinc-300 text-[11px] leading-relaxed">
                围度测绘每 7 天最多计入 1 次基础出勤积分（+20 FPS）；当真实形体改善达到 <strong>≥ 1.0 cm</strong> 时，将解锁专属形体蜕变勋章与丰厚声望加成！
              </p>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 5. AI 私教与隐私安全                                          -->
          <!-- ============================================================== -->
          <div v-else-if="activeCategory === 'ai'" class="space-y-3.5">
            <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <div class="text-emerald-400 font-black flex items-center gap-1.5 text-xs">
                <span>🔒</span> 100% 本地离线隐私沙箱
              </div>
              <p class="text-zinc-300 text-[11px] leading-relaxed">
                FitCycle 采用严格的离线优先架构。你的所有训练日志、形体围度以及配置的 AI API 密钥，全部<strong>仅保存在你当前手机浏览器的 LocalStorage 中</strong>，绝不上传至任何第三方服务器。
              </p>
            </div>

            <div class="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <div class="text-amber-400 font-black flex items-center gap-1.5 text-xs">
                <span>💾</span> 数据备份与无损迁移
              </div>
              <p class="text-zinc-300 text-[11px] leading-relaxed">
                支持在【统计设置】一键导出完整 JSON 备份文件。更换新手机或浏览器时，一键导入即可秒级恢复 100% 历史战绩与排位！
              </p>
            </div>
          </div>

        </div>

        <!-- Footer Action -->
        <div class="pt-2 border-t border-zinc-800/80 flex-shrink-0">
          <button @click="$emit('close')"
                  class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-zinc-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer">
            我已了解
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import { store, getFullHonorProfile } from "../store/fitnessStore.js";
import { 
  TIER_CONFIGS, 
  PRESTIGE_MEDAL_COLORS 
} from "../engine/honorEngine.js";
import { 
  SKIN_HONOR_SCHEMAS, 
  SKIN_TIER_MEDAL_SVGS, 
  TIER_MEDAL_SVGS, 
  PRESTIGE_MEDAL_SVGS 
} from "../engine/skinHonorSchemas.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close"]);

watch(() => props.visible, (val) => {
  if (val) lockBodyScroll();
  else unlockBodyScroll();
}, { immediate: true });

onUnmounted(() => {
  if (props.visible) unlockBodyScroll();
});

const activeCategory = ref("ranking");

const ruleCategories = [
  { id: "ranking", name: "战力天梯与排位", icon: "🏆" },
  { id: "decay", name: "衰减与减载盾牌", icon: "⏳" },
  { id: "overload", name: "超负荷与基准", icon: "⚡" },
  { id: "body", name: "形体测绘与比例", icon: "📐" },
  { id: "ai", name: "隐私与数据安全", icon: "🔒" }
];

// Current user profile
const userHonor = computed(() => getFullHonorProfile());

// Skin Preview Options
const skinPreviewOptions = [
  { id: "default", name: "科学力量", icon: "🏋️" },
  { id: "cs", name: "CS2 战术", icon: "🎯" },
  { id: "chamber", name: "无畏契约", icon: "⚜️" },
  { id: "monochrome", name: "典藏黑白", icon: "🔘" }
];

const selectedSkinPreview = ref(store.settings?.skin || "default");

// When modal opens or skin changes in store, sync preview
watch(() => props.visible, (val) => {
  if (val) {
    selectedSkinPreview.value = store.settings?.skin || "default";
  }
});

// Tiers with localized presentation for preview skin
const previewTiers = computed(() => {
  const currentSkin = selectedSkinPreview.value;
  const schema = SKIN_HONOR_SCHEMAS[currentSkin] || SKIN_HONOR_SCHEMAS.default;
  const skinMedalMap = SKIN_TIER_MEDAL_SVGS[currentSkin] || SKIN_TIER_MEDAL_SVGS.default;
  const userCurrentTierNum = userHonor.value.tier.tier;

  return TIER_CONFIGS.map((cfg) => {
    const locTier = schema.tiers[cfg.key] || schema.tiers.tier_1;
    const svg = skinMedalMap[cfg.key] || TIER_MEDAL_SVGS[cfg.key] || null;
    const rangeText = cfg.tier === 7 
      ? "2900+ 分 (支持转生)" 
      : `${cfg.minScore} ~ ${cfg.maxScore} 分`;

    return {
      tier: cfg.tier,
      key: cfg.key,
      name: locTier.name,
      sub: locTier.sub,
      icon: locTier.icon || cfg.badgeIcon,
      svg,
      rangeText,
      isCurrent: cfg.tier === userCurrentTierNum
    };
  });
});

// Mini Score Calculator
const calcGrade = ref("A");
const calcOverload = ref(true);
const calcComeback = ref(false);

const estimatedScore = computed(() => {
  let base = 20;
  if (calcGrade.value === "S") base = 50;
  else if (calcGrade.value === "A") base = 35;
  else if (calcGrade.value === "B") base = 20;
  else if (calcGrade.value === "C") base = 10;

  const overload = calcOverload.value ? 15 : 0;
  const multiplier = calcComeback.value ? 1.5 : 1.0;

  return Math.round((base + overload) * multiplier);
});

// Prestige Medals List
const prestigeList = computed(() => {
  return PRESTIGE_MEDAL_COLORS.map((item) => ({
    ...item,
    svg: PRESTIGE_MEDAL_SVGS[item.level] || "./themes/medals/prestige-1.svg"
  }));
});
</script>