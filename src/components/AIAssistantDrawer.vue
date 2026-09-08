<template>
  <!-- Non-intrusive AI button: hidden on mobile devices to never block close buttons or modal cards; users access AI from the top Navbar -->
  <button v-if="!aiSession.drawerOpen" type="button" aria-label="打开 AI 助手" data-testid="ai-fab"
          class="hidden sm:flex !fixed right-4 bottom-20 z-20 w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-xl shadow-black/80 border border-amber-300 font-black text-xs active:scale-95 transition-all items-center justify-center pointer-events-auto backdrop-blur-md"
          @click="aiSession.drawerOpen = true">
    <span class="animate-pulse text-sm leading-none">✦</span>
  </button>

  <!-- Fullscreen Modal Overlay with Visual Viewport Adaptation -->
  <Teleport to="body" :disabled="isTest">
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="aiSession.drawerOpen" 
           class="fixed inset-x-0 z-50 flex flex-col justify-end items-center" 
           data-testid="ai-drawer"
           :style="containerDynamicStyle"
           style="overscroll-behavior: none;">
        
        <!-- Backdrop with Light Dismiss -->
        <button type="button" 
                class="absolute inset-0 bg-black/75 backdrop-blur-sm" 
                aria-label="关闭 AI 助手" 
                @click="closeDrawer"></button>

        <!-- Main Bottom Sheet Section with Native iOS Slide-Up Animation -->
        <section class="relative w-full max-w-md bg-zinc-950 border border-zinc-700/80 shadow-2xl flex flex-col overflow-hidden z-10 transition-[height,border-radius] duration-200 ease-out animate-drawer-slide-up"
                 :style="drawerDynamicStyle"
                 aria-label="Fitcycle AI 助手">

          <!-- Top Ergonomic Grabber Pill for Bottom Sheet Gesture -->
          <div class="w-12 h-1.5 rounded-full bg-zinc-700/80 mx-auto mt-2 -mb-1 flex-shrink-0 z-20 cursor-pointer active:scale-95 transition-transform grabber-handle"
               @click="closeDrawer"
               @touchstart.passive="handleHeaderTouchStart"
               @touchmove.passive="handleHeaderTouchMove"></div>

      <!-- CS2 Tactical Background Backdrop -->
      <div v-if="store.settings.uiSkin === 'cs'" 
           class="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <img :src="csAiBg" alt="CS2 AI Backdrop" class="w-full h-full object-cover object-bottom filter contrast-125" />
        <div class="absolute inset-0"
             :class="store.settings.themeMode === 'light' ? 'bg-gradient-to-t from-white via-white/50 to-white/90' : 'bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/80'"></div>
      </div>

      <!-- Chamber Luxury Background Backdrop -->
      <div v-else-if="store.settings.uiSkin === 'chamber'" 
           class="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
        <img :src="chamberAiBg" alt="Chamber AI Backdrop" class="w-full h-full object-cover object-center" />
        <div class="absolute inset-0"
             :class="store.settings.themeMode === 'light' ? 'bg-gradient-to-t from-[#F9F8F5] via-[#F9F8F5]/50 to-[#F9F8F5]/90' : 'bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-[#070B14]/80'"></div>
      </div>

      <header class="relative z-10 flex items-center justify-between gap-2.5 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/95 flex-shrink-0">
        <div class="min-w-0 flex-1">
          <div class="text-base font-black text-zinc-100 flex items-center gap-2">
            <span class="text-amber-400 font-black">✦</span> Fitcycle AI
            <span v-if="activeApiKey" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <button type="button"
                  data-testid="toggle-quick-model-picker"
                  @click="showQuickModelPicker = !showQuickModelPicker"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-500/50 text-xs sm:text-sm text-zinc-200 hover:text-amber-300 transition-all font-mono max-w-full group text-left shadow-sm">
            <span class="text-[11px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 flex-shrink-0 leading-none">{{ activeProvider.name }}</span>
            <span class="truncate font-semibold tracking-tight text-zinc-100 group-hover:text-amber-200">{{ cleanModelTitle(selectedModel) }}</span>
            <span class="text-[10px] text-amber-400/80 group-hover:text-amber-300 ml-0.5 flex-shrink-0">▼</span>
          </button>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button type="button" class="px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border border-zinc-700 text-zinc-300 hover:text-white bg-zinc-900 active:scale-95 transition-all" title="清空当前对话" @click="handleClear">清空</button>
          <button type="button" class="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-sm transition-colors" 
                  :title="isFullScreen ? '退出全屏' : '全屏显示'" 
                  @click="isFullScreen = !isFullScreen">
            {{ isFullScreen ? '⊡' : '⛶' }}
          </button>
          <button type="button" class="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-sm transition-colors" aria-label="收起 AI 助手" @click="aiSession.drawerOpen = false">✕</button>
        </div>
      </header>

      <!-- ⚡ 快捷切换模型弹窗 (Quick Model Switcher Popover) -->
      <div v-if="showQuickModelPicker" 
           data-testid="quick-model-picker-modal"
           class="absolute top-14 left-3 right-3 z-40 bg-zinc-900/98 border border-zinc-700 rounded-2xl shadow-2xl p-3.5 space-y-3 backdrop-blur-xl">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div class="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
            <span class="text-amber-400 font-black">✦</span> 快捷切换模型
          </div>
          <button type="button" @click="showQuickModelPicker = false" class="text-zinc-400 hover:text-zinc-200 text-sm px-1.5">✕</button>
        </div>

        <!-- Provider Horizontal Tabs -->
        <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button v-for="prov in AI_PROVIDERS" :key="prov.id" type="button"
                  @click="quickSwitchProvider(prov.id)"
                  class="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border whitespace-nowrap transition-all"
                  :class="aiSession.activeProvider === prov.id ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-white'">
            {{ prov.name }}
          </button>
        </div>

        <!-- Strategy Filter Pills in Drawer Popover -->
        <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button v-for="strat in MODEL_STRATEGIES" :key="strat.id" type="button"
                  @click="quickDrawerStrategy = strat.id"
                  class="px-2.5 py-1 rounded-xl text-xs font-bold border whitespace-nowrap transition-all flex items-center gap-1"
                  :class="quickDrawerStrategy === strat.id ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-sm' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'">
            <span>{{ strat.name }}</span>
          </button>
        </div>

        <!-- Model List -->
        <div class="max-h-56 overflow-y-auto space-y-1.5 pr-1 font-mono">
          <button v-for="m in filteredQuickModels" :key="m.id" type="button"
                  @click="quickSelectModel(m.id)"
                  class="w-full px-3 py-2 rounded-xl text-left text-sm transition-all flex items-center justify-between group"
                  :class="selectedModelId === m.id ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold' : 'hover:bg-zinc-800 text-zinc-200 border border-transparent'">
            <div class="min-w-0 flex-1 pr-2">
              <div class="text-sm font-bold leading-snug break-words">{{ m.name }}</div>
              <div class="text-xs text-zinc-400 break-all mt-0.5">{{ m.id }}</div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="text-xs px-2 py-0.5 rounded border font-bold flex items-center gap-0.5"
                    :class="getModelStrategy(m, aiSession.activeProvider).badgeClass">
                <span>{{ getModelStrategy(m, aiSession.activeProvider).name }}</span>
              </span>
              <span v-if="selectedModelId === m.id" class="text-amber-400 text-sm font-bold">✓</span>
            </div>
          </button>
          <div v-if="!filteredQuickModels.length" class="text-sm text-zinc-400 py-4 text-center">
            当前分类暂无模型
          </div>
        </div>

        <div class="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs sm:text-sm">
          <div class="flex items-center gap-2">
            <span class="text-zinc-400">厂商: {{ activeProvider.name }}</span>
            <button v-if="activeApiKey" type="button" 
                    @click="refreshModelsInDrawer" :disabled="isRefreshingModels"
                    class="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-xs active:scale-95 transition-all cursor-pointer"
                    data-testid="drawer-refresh-models-btn"
                    title="从当前服务商重新获取最新模型">
              <span v-if="isRefreshingModels" class="w-3 h-3 rounded-full border border-amber-400 border-t-transparent animate-spin"></span>
              <svg v-else class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              <span>{{ isRefreshingModels ? '同步中…' : (refreshStatusMsg || '同步最新模型') }}</span>
            </button>
          </div>
          <button type="button" @click="goToSettingsTab" class="text-amber-400 hover:text-amber-300 underline font-medium">管理 API 密钥 ↗</button>
        </div>
      </div>

      <div ref="messageList" 
           @scroll.passive="handleScroll"
           class="relative z-10 flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-3" 
           data-testid="ai-messages">
        <!-- Empty State with Adaptive Typing/Resting Layout -->
        <div v-if="!aiSession.conversation.length" class="h-full flex flex-col justify-end px-2 py-1">
          <!-- When Keyboard is Open: Sleek, compact single-line horizontal chips (avoids cluttered 2x2 cards above keyboard) -->
          <div v-if="isKeyboardOpen" class="space-y-1.5 pb-2">
            <div class="text-xs sm:text-sm text-zinc-300 flex items-center gap-1.5 px-1 font-semibold">
              <span class="text-amber-400 font-bold">✦</span> 快捷提问
            </div>
            <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none overscroll-contain">
              <button v-for="(chip, idx) in defaultChips" :key="idx"
                      type="button"
                      @click="sendPrompt(chip.prompt)"
                      class="flex-shrink-0 px-3.5 py-2 rounded-xl bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs sm:text-sm text-zinc-200 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm font-medium">
                <span>{{ chip.icon }}</span>
                <span class="whitespace-nowrap">{{ chip.title }}</span>
              </button>
            </div>
          </div>

          <!-- When Keyboard is Closed: Full spacious coach introduction and 2x2 cards -->
          <div v-else class="h-full min-h-52 flex flex-col items-center justify-center text-center px-4 py-6 space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl shadow-lg shadow-amber-500/10">🤖</div>
            <div class="space-y-1.5">
              <p class="text-base sm:text-lg font-black text-zinc-100 tracking-tight">我是你的 FitCycle 智能教练</p>
              <p class="text-xs sm:text-sm text-zinc-300 max-w-xs mx-auto leading-relaxed">
                已接入你的训练计划、近期容量与动作库，随时为你提供科学复盘与指导。
              </p>
            </div>

            <!-- Quick Suggestion Cards Grid -->
            <div class="grid grid-cols-2 gap-2.5 w-full pt-1 text-left">
              <button v-for="(chip, idx) in defaultChips" :key="idx"
                      type="button"
                      @click="sendPrompt(chip.prompt)"
                      class="p-3 rounded-2xl bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-left transition-all space-y-1.5 group">
                <div class="text-amber-400 font-bold text-sm flex items-center gap-1.5 group-hover:text-amber-300">
                  <span class="text-base">{{ chip.icon }}</span> <span>{{ chip.title }}</span>
                </div>
                <div class="text-xs sm:text-[13px] text-zinc-300 leading-normal line-clamp-2">
                  {{ chip.desc }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Conversation Bubbles -->
        <article v-for="message in aiSession.conversation" :key="message.id" class="flex flex-col" :class="message.role === 'user' ? 'items-end' : 'items-start'">
          <!-- State-Modifying Tool Results (With Undo) -->
          <div v-if="message.role === 'tool'" class="w-full rounded-2xl border px-4 py-3 text-xs sm:text-sm shadow-sm"
               :class="message.success ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold">{{ message.success ? '操作已生效' : '操作未执行' }} · {{ message.tool || 'Fitcycle' }}</span>
              <button v-if="message.undoAvailable && !message.undone" type="button" class="px-2.5 py-1 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold transition-colors" @click="undoToolMessage(message)">撤销</button>
            </div>
            <p class="mt-1 leading-relaxed">{{ message.text }}</p>
          </div>

          <!-- User Message Bubble -->
          <div v-else-if="message.role === 'user'" class="max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-md bg-amber-500 text-zinc-950 font-medium rounded-tr-xs">
            <div v-if="message.images?.length" class="grid grid-cols-2 gap-1.5 mb-2">
              <img v-for="image in message.images" :key="image.name + image.size" :src="image.dataUrl" :alt="image.name" class="w-full max-h-36 rounded-xl object-cover" />
            </div>
            <p class="whitespace-pre-wrap break-words">{{ message.text }}</p>
          </div>

          <!-- AI Message Bubble with Thinking Box, Markdown Tables & Copy -->
          <div v-else class="max-w-[95%] rounded-2xl p-4 text-[15px] leading-relaxed shadow-xl bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-xs space-y-3 relative group">
            
            <!-- 🧠 深度思考过程展示框 (Collapsible Thinking Process Box) -->
            <div v-if="message.reasoning || (message.streaming && message.isThinking)"
                 class="rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden text-xs sm:text-sm transition-all">
              <!-- Header with Toggle Button -->
              <button type="button" 
                      data-testid="toggle-reasoning"
                      @click="message.reasoningCollapsed = !message.reasoningCollapsed"
                      class="w-full px-3.5 py-2.5 flex items-center justify-between text-zinc-300 hover:text-white bg-zinc-900/60 transition-colors select-none text-left cursor-pointer">
                <span class="flex items-center gap-1.5 font-medium">
                  <span class="text-amber-400 text-sm" :class="{ 'animate-spin': message.streaming && message.isThinking }">✦</span>
                  <span class="font-bold">
                    {{ (message.streaming && message.isThinking) ? 'AI 正在深度思考…' : '已完成深度思考' }}
                  </span>
                </span>
                <span class="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                  <span>{{ message.reasoningCollapsed ? '展开' : '收起' }}</span>
                  <span class="transform transition-transform duration-200" :class="{ 'rotate-180': !message.reasoningCollapsed }">▼</span>
                </span>
              </button>

              <!-- Thinking Text Body -->
              <div v-show="!message.reasoningCollapsed" 
                   class="px-3.5 py-3 text-zinc-300 font-mono text-xs sm:text-[13px] leading-relaxed border-t border-zinc-800/80 bg-zinc-950/60 whitespace-pre-wrap break-words max-h-56 overflow-y-auto">
                {{ message.reasoning }}
                <span v-if="message.streaming && message.isThinking" class="inline-block w-1.5 h-3.5 ml-0.5 bg-amber-400 animate-pulse align-middle"></span>
              </div>
            </div>

            <!-- Loading initial pulse if no text and no reasoning yet -->
            <div v-if="message.streaming && !message.text && !message.reasoning" class="flex items-center gap-2 text-zinc-300 font-mono text-xs sm:text-sm py-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>正在连接模型并准备生成…</span>
            </div>

            <!-- 📸 健身房真实器械实物大图与调节图谱 (100% 自动识别并呈现，支持全屏缩放与直达网址) -->
            <div v-if="message.matchedEquipment" 
                 class="rounded-2xl border border-amber-500/30 bg-zinc-950 p-3.5 space-y-3 shadow-lg relative"
                 data-testid="equipment-visual-card">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 text-sm font-bold text-amber-400 min-w-0">
                  <span>📸</span>
                  <span class="truncate">真实商用器械：{{ message.matchedEquipment.name }}</span>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono whitespace-nowrap">
                    {{ message.matchedEquipment.englishName }}
                  </span>
                  <span role="button" 
                        tabindex="0"
                        data-testid="dismiss-equipment-card"
                        @click="message.matchedEquipment = null" 
                        title="收起/关闭此器械图"
                        class="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs flex items-center justify-center cursor-pointer transition-colors select-none">
                    ✕
                  </span>
                </div>
              </div>

              <!-- High-Res Photo Thumbnail with Click-to-Zoom Indicator (Fixed aspect ratio to eliminate layout shifts) -->
              <div class="relative group/photo cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 aspect-[16/10] w-full"
                   @click="openLightbox(message.matchedEquipment)">
                <img :src="message.matchedEquipment.imageUrl" 
                     :alt="message.matchedEquipment.name"
                     loading="eager"
                     decoding="async"
                     class="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-105" />
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 flex flex-col justify-between p-3 pointer-events-none">
                  <span class="self-end text-xs px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-zinc-200 border border-white/15 flex items-center gap-1 font-medium">
                    <span>🔍</span> 点击放大全屏查看
                  </span>
                  <div>
                    <div class="text-sm font-bold text-white drop-shadow">{{ message.matchedEquipment.categoryName }}</div>
                    <div class="text-xs text-zinc-300 drop-shadow line-clamp-1 mt-0.5">{{ message.matchedEquipment.appearanceFeature }}</div>
                  </div>
                </div>
              </div>

              <!-- Action Bar: In-App Lightbox Viewer & Adjustments Guide (No broken external URLs) -->
              <div class="pt-0.5">
                <button type="button" 
                        @click="openLightbox(message.matchedEquipment)"
                        class="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-amber-500/10 cursor-pointer">
                  <span>🔍</span>
                  <span>查看大图与器械调节指南</span>
                </button>
              </div>
            </div>

            <!-- Rendered Clean Markdown (Deduplicated, no repeated image tags) -->
            <div v-if="formatAssistantMessageText(message)" 
                 class="ai-markdown-content leading-relaxed" 
                 @click="handleContentClick($event, message)"
                 v-html="renderMarkdown(formatAssistantMessageText(message))"></div>
            <span v-if="message.streaming && !message.isThinking && message.text" class="inline-block w-2 h-4 bg-amber-400 animate-pulse align-middle ml-1"></span>

            <!-- Footer: Brand tag, Token/Cost Audit Badge, and Animated Copy Button -->
            <div v-if="!message.streaming && (message.text || message.reasoning)" class="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs text-zinc-400 font-mono">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="flex items-center gap-1 text-zinc-300 font-medium">
                  <span>✦ Fitcycle AI</span>
                </span>
                <!-- Official Token & Cost Audit Badge -->
                <span v-if="message.usage" 
                      class="px-2 py-0.5 rounded border text-xs flex items-center gap-1 font-mono transition-colors"
                      :class="message.costUSD ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-zinc-850 text-zinc-300 border-zinc-700/60'"
                      :title="`输入: ${message.usage.prompt_tokens || 0} Tokens · 输出: ${message.usage.completion_tokens || 0} Tokens`"
                      data-testid="message-token-badge">
                  <span>{{ message.usage.total_tokens || 0 }} Tokens</span>
                  <span v-if="message.costUSD" class="text-emerald-400 font-bold">· ${{ formatCostUSD(message.costUSD) }}</span>
                </span>
              </div>
              <button type="button" 
                      @click="copyText(message)" 
                      class="copy-btn relative overflow-hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs transition-all duration-300 active:scale-95 cursor-pointer font-sans border font-medium"
                      :class="copiedMessageId === (message.id || message.text)
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/10 font-bold' 
                        : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700/70 hover:border-zinc-600 text-zinc-300 hover:text-white'"
                      :title="copiedMessageId === (message.id || message.text) ? '已复制到剪贴板' : '复制回答内容'"
                      data-testid="copy-ai-response-btn">
                <transition name="copy-morph" mode="out-in">
                  <span v-if="copiedMessageId === (message.id || message.text)" key="copied" class="flex items-center gap-1 leading-none">
                    <svg class="w-3.5 h-3.5 check-icon text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path class="check-path" d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>已复制</span>
                  </span>
                  <span v-else key="copy" class="flex items-center gap-1 leading-none">
                    <svg class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                    <span>复制</span>
                  </span>
                </transition>
              </button>
            </div>
          </div>
        </article>

        <!-- High-Impact Action Confirmation Modal -->
        <div v-if="pendingContext" class="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-zinc-200 space-y-2" data-testid="ai-confirmation">
          <div class="font-bold text-amber-400">执行前确认</div>
          <p class="leading-relaxed">{{ pendingContext.pending.preview }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold active:scale-95" :disabled="generating" @click="decidePending(true)">确认执行</button>
            <button type="button" class="py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold active:scale-95" :disabled="generating" @click="decidePending(false)">取消</button>
          </div>
        </div>
      </div>

      <!-- Floating Jump to bottom button when user scrolled up during generation -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2 scale-90"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-90"
      >
        <button v-if="generating && userScrolledUp" 
                type="button" 
                @click="jumpToBottom"
                class="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-zinc-900/95 border border-amber-500/70 shadow-2xl shadow-black text-amber-300 text-xs font-bold flex items-center gap-1.5 backdrop-blur-xl active:scale-95">
          <span class="animate-bounce text-sm">↓</span>
          <span>AI 正在输出 (点击回到底部)</span>
        </button>
      </transition>

      <footer class="relative z-10 flex-shrink-0 border-t border-zinc-800 bg-zinc-900/95 px-3 pt-2.5 transition-[padding] duration-150" :style="{ paddingBottom: footerPaddingBottom }">
        <!-- Attached Images Thumbnail Strip -->
        <div v-if="attachments.length" class="flex gap-2 overflow-x-auto pb-2">
          <div v-for="(image, index) in attachments" :key="image.name + image.size" class="relative flex-shrink-0">
            <img :src="image.dataUrl" :alt="image.name" class="w-14 h-14 rounded-xl object-cover border border-zinc-700" />
            <button type="button" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center" :aria-label="`移除 ${image.name}`" @click="attachments.splice(index, 1)">✕</button>
          </div>
        </div>

        <!-- Intelligent Vision Upgrade Banner when user uploads images but model is text-only -->
        <div v-if="attachments.length && !selectedModel?.capabilities.image"
             class="mb-2 p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-2 text-xs text-amber-300 animate-in fade-in duration-150">
          <div class="flex items-center gap-1.5 min-w-0">
            <span>📸</span>
            <span class="truncate">当前模型不支持图片识别</span>
          </div>
          <button v-if="recommendedVisionModel" 
                  type="button" 
                  @click="switchToVisionModel"
                  class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold whitespace-nowrap active:scale-95 transition-all flex-shrink-0 shadow-sm">
            一键切至 {{ recommendedVisionModel.name }} ↗
          </button>
        </div>

        <!-- Clean Input Hint (Only shown for real errors, never distracting placeholder text) -->
        <p v-if="inputHint && !(attachments.length && !selectedModel?.capabilities.image)" class="text-xs mb-2 leading-tight" :class="inputHintError ? 'text-red-400' : 'text-zinc-500'">{{ inputHint }}</p>

        <!-- Input Bar Row -->
        <div class="flex items-end gap-2">
          <div class="flex gap-1.5 pb-0.5">
            <button type="button" class="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-base flex items-center justify-center transition-colors active:scale-95" aria-label="拍照" @click="cameraInput?.click()">📷</button>
            <button type="button" class="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-base flex items-center justify-center transition-colors active:scale-95" aria-label="从相册选择" @click="galleryInput?.click()">🖼️</button>
            <input ref="cameraInput" class="hidden" type="file" accept="image/*" capture="environment" @change="handleFiles" />
            <input ref="galleryInput" class="hidden" type="file" accept="image/*" multiple @change="handleFiles" />
          </div>
          <textarea v-model="draft" rows="1" enterkeyhint="send" placeholder="询问训练，或让 AI 记录一组…"
                    class="flex-1 max-h-32 min-h-11 resize-none bg-zinc-950 border border-zinc-700 focus:border-amber-500/60 rounded-xl px-3.5 py-2.5 text-[15px] text-zinc-100 placeholder:text-zinc-500 outline-none leading-relaxed transition-colors"
                    @focus="handleInputFocus"
                    @blur="handleInputBlur"
                    @keydown.enter.exact.prevent="send"></textarea>
          <button v-if="generating" type="button" class="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center transition-colors active:scale-95 text-base" aria-label="停止生成" @click="stopGeneration">■</button>
          <button v-else type="button" class="w-11 h-11 rounded-xl bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black text-base flex items-center justify-center shadow-md active:scale-95 transition-all" :disabled="Boolean(sendDisabledReason)" aria-label="发送" @click="send">↑</button>
        </div>

        <!-- Footer Shortcuts -->
        <div class="flex items-center justify-between mt-1.5 min-h-5 text-xs sm:text-sm">
          <button v-if="retryAvailable && !generating" type="button" class="text-amber-400 hover:text-amber-300 font-medium" @click="retryGeneration">重试上次请求</button>
          <button v-if="!activeApiKey" type="button" class="ml-auto text-amber-400 hover:text-amber-300 underline font-medium" @click="goToSettings">前往设置连接</button>
        </div>
      </footer>
    </section>
  </div>
</transition>
</Teleport>

    <!-- Fullscreen Equipment Lightbox & Zoom Modal -->
    <Teleport to="body" :disabled="isTest">
      <transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="activeLightboxEquipment" 
             class="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4"
             data-testid="equipment-lightbox-modal">
          <!-- Dark Backdrop -->
          <div class="absolute inset-0 bg-black/85 backdrop-blur-md" @click="closeLightbox"></div>

          <!-- Modal Card -->
          <div class="relative w-full max-w-lg bg-zinc-950 border border-zinc-700/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] z-10 animate-in fade-in zoom-in-95 duration-200">
            <!-- Header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/95 flex-shrink-0">
              <div class="min-w-0 flex-1 pr-2">
                <div class="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-1.5 truncate">
                  <span class="text-amber-400 font-black">✦</span> {{ activeLightboxEquipment.name }}
                </div>
                <div class="text-xs text-zinc-400 font-mono truncate">{{ activeLightboxEquipment.englishName }}</div>
              </div>
              <button type="button" @click="closeLightbox"
                      class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer flex-shrink-0"
                      aria-label="关闭原图">
                ✕
              </button>
            </div>

            <!-- Scrollable Body -->
            <div class="overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              <!-- Full High-Res Photo -->
              <div class="rounded-2xl overflow-hidden border border-zinc-800 bg-black/60 relative shadow-inner">
                <img :src="activeLightboxEquipment.imageUrl" :alt="activeLightboxEquipment.name"
                     class="w-full h-auto max-h-[380px] object-contain mx-auto" />
              </div>

              <!-- Features & Adjustments -->
              <div class="space-y-2.5 text-xs">
                <div v-if="activeLightboxEquipment.appearanceFeature" class="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 space-y-1">
                  <div class="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <span>外观一眼识别特征</span>
                  </div>
                  <p class="text-zinc-300 leading-relaxed text-xs">{{ activeLightboxEquipment.appearanceFeature }}</p>
                </div>

                <div v-if="activeLightboxEquipment.adjustmentTips" class="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 space-y-1">
                  <div class="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span>座椅与插销调节指南</span>
                  </div>
                  <p class="text-zinc-300 leading-relaxed text-xs whitespace-pre-line">{{ activeLightboxEquipment.adjustmentTips }}</p>
                </div>

                <div v-if="activeLightboxEquipment.commonMistakes" class="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-1">
                  <div class="text-xs font-bold text-red-400 flex items-center gap-1">
                    <span>⚠️</span> 新手上机避坑提示
                  </div>
                  <p class="text-zinc-300 leading-relaxed text-xs">{{ activeLightboxEquipment.commonMistakes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>

<script setup>
import { computed, nextTick, reactive, ref, watch, onMounted, onUnmounted } from "vue";
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock.js";
import {
  AI_PROVIDERS,
  DEFAULT_PRESET_MODELS,
  aiSession,
  clearConversation,
  getActiveApiKey,
  getActiveModelId,
  getActiveModels,
  getActiveProvider,
  setActiveProvider,
  setProviderModels,
  setSelectedModel
} from "../ai/aiSession.js";
import { fetchProviderModels } from "../ai/providerClient.js";
import { buildUserMessage, resumeAssistantAfterDecision, runAssistantLoop } from "../ai/assistantRuntime.js";
import { createFitcycleToolRuntime } from "../ai/fitcycleTools.js";
import { processImageFile } from "../ai/imageProcessor.js";
import {
  formatModelDisplayName,
  getMessageBlockReason,
  MODEL_STRATEGIES,
  filterModelsByStrategy,
  findRecommendedVisionModel,
  getModelStrategy,
  normalizeProviderModel
} from "../ai/modelCapabilities.js";
import { store } from "../store/fitnessStore.js";
import { renderMarkdown, cleanAIMessage, extractReasoningAndContent } from "../utils/aiService.js";
import { findGymEquipmentVisual, GYM_EQUIPMENT_VISUALS } from "../data/gymEquipmentVisuals.js";
import { calculateCostUSD, formatCostUSD, recordTokenUsage } from "../ai/tokenTracker.js";

const isTest = typeof process !== "undefined" && (process.env?.NODE_ENV === "test" || Boolean(process.env?.VITEST));

const activeLightboxEquipment = ref(null);

function openLightbox(equipment) {
  if (!equipment) return;
  activeLightboxEquipment.value = equipment;
}

function closeLightbox() {
  activeLightboxEquipment.value = null;
}

/**
 * Sanitizes assistant text to prevent duplicate markdown images and unwanted links
 * when a structured visual card is already rendered
 */
function formatAssistantMessageText(message) {
  if (!message || !message.text) return "";
  let text = message.text;
  if (message.matchedEquipment) {
    // Strip inline markdown images to avoid duplicate photos
    text = text.replace(/!\[.*?\]\(.*?\)/g, "");
    // Strip machine links that may have been output
    text = text.replace(/\[(?:🔗|📷|查看|打开|点击).*?\]\(\.?\/?machines\/.*?\)/g, "");
    text = text.replace(/\[.*?\]\(\.?\/?machines\/.*?\)/g, "");
  } else {
    // Strip any raw machine image markdown that might slip through
    text = text.replace(/!\[.*?\]\(\.?\/?machines\/.*?\)/g, "");
  }
  return text.trim();
}

function handleContentClick(event, message) {
  const img = event.target.closest("img");
  if (img) {
    const src = img.getAttribute("src");
    const matched = message?.matchedEquipment || GYM_EQUIPMENT_VISUALS.find(eq => eq.imageUrl === src || src?.includes(eq.id.replace("eq-", "")));
    if (matched) {
      openLightbox(matched);
    } else {
      openLightbox({
        id: "custom-img",
        name: img.getAttribute("alt") || "器械实物照片",
        englishName: "Gym Equipment Visual",
        categoryName: "器械实物参考",
        imageUrl: src,
        appearanceFeature: "健身房真实器械实物展示",
        adjustmentTips: "请结合教练文字指导进行上机与调节。"
      });
    }
  }
}

const MAX_ATTACHMENTS = 3;
const toolRuntime = createFitcycleToolRuntime();
const draft = ref("");
const attachments = ref([]);
const generating = ref(false);
const retryAvailable = ref(false);
const pendingContext = ref(null);
const cameraInput = ref(null);
const galleryInput = ref(null);
const messageList = ref(null);
const inputError = ref("");
const showQuickModelPicker = ref(false);
let abortController = null;

const visualViewportHeight = ref(typeof window !== "undefined" && window.visualViewport ? window.visualViewport.height : 0);
const visualViewportTop = ref(typeof window !== "undefined" && window.visualViewport ? window.visualViewport.offsetTop : 0);
const isKeyboardOpen = ref(false);

let viewportListenersAttached = false;

function updateVisualViewport() {
  if (typeof window === "undefined" || !window.visualViewport || !aiSession.drawerOpen) return;
  visualViewportHeight.value = window.visualViewport.height;
  visualViewportTop.value = window.visualViewport.offsetTop;

  const diff = window.innerHeight - window.visualViewport.height;
  isKeyboardOpen.value = diff > 140;

  // STRICT GUARD: Only counteract WebKit keyboard scroll jumps when drawer is open AND keyboard is active
  if (isKeyboardOpen.value && window.scrollY > 0) {
    window.scrollTo(0, 0);
  }
}

function attachViewportListeners() {
  if (typeof window === "undefined" || !window.visualViewport || viewportListenersAttached) return;
  window.visualViewport.addEventListener("resize", updateVisualViewport);
  window.visualViewport.addEventListener("scroll", updateVisualViewport);
  viewportListenersAttached = true;
  updateVisualViewport();
}

function detachViewportListeners() {
  if (typeof window === "undefined" || !window.visualViewport || !viewportListenersAttached) return;
  window.visualViewport.removeEventListener("resize", updateVisualViewport);
  window.visualViewport.removeEventListener("scroll", updateVisualViewport);
  viewportListenersAttached = false;
}

const containerDynamicStyle = computed(() => {
  if (isTest || typeof window === "undefined" || !window.visualViewport) {
    return {
      top: "0px",
      bottom: "0px",
      left: "0px",
      right: "0px"
    };
  }
  return {
    position: "fixed",
    top: `${visualViewportTop.value}px`,
    height: `${visualViewportHeight.value}px`,
    left: "0px",
    right: "0px"
  };
});

const isFullScreen = ref(typeof window !== "undefined" && window.innerWidth < 640);

const drawerDynamicStyle = computed(() => {
  if (isTest) return {};

  if (isKeyboardOpen.value || isFullScreen.value) {
    return {
      height: "100%",
      maxHeight: "100%",
      borderTopLeftRadius: isFullScreen.value ? "0px" : "1rem",
      borderTopRightRadius: isFullScreen.value ? "0px" : "1rem"
    };
  }

  return {
    height: "min(90dvh, 800px)",
    maxHeight: "90dvh",
    borderTopLeftRadius: "1.5rem",
    borderTopRightRadius: "1.5rem"
  };
});

const footerPaddingBottom = computed(() => {
  if (isKeyboardOpen.value) {
    return "8px";
  }
  return "max(env(safe-area-inset-bottom, 0px), 10px)";
});

function handleInputFocus() {
  isKeyboardOpen.value = true;
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      updateVisualViewport();
      scrollToBottom(true);
    }, 60);
  }
}

function handleInputBlur() {
  setTimeout(() => {
    isKeyboardOpen.value = false;
    updateVisualViewport();
  }, 120);
}

let touchStartY = 0;
function handleHeaderTouchStart(e) {
  if (e.touches && e.touches[0]) {
    touchStartY = e.touches[0].clientY;
  }
}

function handleHeaderTouchMove(e) {
  if (e.touches && e.touches[0]) {
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 60) {
      closeDrawer();
    }
  }
}

function closeDrawer() {
  aiSession.drawerOpen = false;
}

onMounted(() => {
  // Never attach visualViewport listener globally on mount - isolated to drawerOpen lifecycle
  if (aiSession.drawerOpen) {
    attachViewportListeners();
  }
});

watch(() => aiSession.drawerOpen, (val) => {
  if (val) {
    lockBodyScroll();
    isKeyboardOpen.value = false;
    attachViewportListeners();
    nextTick(() => {
      updateVisualViewport();
    });
  } else {
    detachViewportListeners();
    unlockBodyScroll();
  }
}, { immediate: true });

onUnmounted(() => {
  if (copyResetTimeout) clearTimeout(copyResetTimeout);
  detachViewportListeners();
  if (aiSession.drawerOpen) unlockBodyScroll();
});

const activeModels = computed(getActiveModels);
const selectedModelId = computed({ get: getActiveModelId, set: (val) => setSelectedModel(val) });
const quickDrawerStrategy = ref("all");

const filteredQuickModels = computed(() => {
  return filterModelsByStrategy(activeModels.value, quickDrawerStrategy.value);
});

const recommendedVisionModel = computed(() => {
  return findRecommendedVisionModel(activeModels.value);
});

function switchToVisionModel() {
  if (recommendedVisionModel.value) {
    setSelectedModel(recommendedVisionModel.value.id);
  }
}

function quickSwitchProvider(providerId) {
  setActiveProvider(providerId);
  quickDrawerStrategy.value = "all";
}

function quickSelectModel(modelId) {
  setSelectedModel(modelId);
  showQuickModelPicker.value = false;
}

function goToSettingsTab() {
  showQuickModelPicker.value = false;
  aiSession.drawerOpen = false;
  store.activeTab = "stats";
}

const isRefreshingModels = ref(false);
const refreshStatusMsg = ref("");

async function refreshModelsInDrawer() {
  const key = activeApiKey.value;
  const prov = aiSession.activeProvider;
  if (!key || isRefreshingModels.value) return;

  isRefreshingModels.value = true;
  refreshStatusMsg.value = "";
  try {
    const models = await fetchProviderModels(prov, key);
    const existingIds = new Set(models.map((m) => m.id.toLowerCase()));
    const defaults = DEFAULT_PRESET_MODELS[prov] || [];
    const merged = [...models];
    for (const d of defaults) {
      if (!existingIds.has(d.id.toLowerCase())) {
        merged.push(d);
      }
    }
    const normalizedMerged = merged.map((m) => normalizeProviderModel(prov, m));
    setProviderModels(normalizedMerged, prov);

    refreshStatusMsg.value = `已同步 ${normalizedMerged.length} 个最新模型`;
    setTimeout(() => {
      refreshStatusMsg.value = "";
    }, 3000);
  } catch (err) {
    refreshStatusMsg.value = err.message || "同步失败";
    setTimeout(() => {
      refreshStatusMsg.value = "";
    }, 4000);
  } finally {
    isRefreshingModels.value = false;
  }
}

const csAiBg = "./themes/cs/background.jpg";
const chamberAiBg = "./themes/chamber/hero/chamber-hero.webp";

const defaultChips = [
  {
    icon: "📊",
    title: "分析昨天训练表现",
    desc: "复盘时长、组数、总容量与动作评价",
    prompt: "我昨天那个计划怎么样"
  },
  {
    icon: "📋",
    title: "评估今日分化计划",
    desc: "根据当前推拉腿循环指导今日动作要点",
    prompt: "根据我今天的训练计划，给出今日核心动作和发力注意事项"
  },
  {
    icon: "🔄",
    title: "推荐器械替代动作",
    desc: "器械被占或居家训练时的同力线替换",
    prompt: "健身房卧推架和深蹲架全满了，请给我推荐推胸和练腿的最佳替代动作"
  },
  {
    icon: "📈",
    title: "渐进超负荷加重建议",
    desc: "根据历史组数推荐下一周期的目标重量",
    prompt: "我现在的上斜卧推已经能做 26kg 8次，下一阶段该如何渐进式超负荷？"
  },
  {
    icon: "📸",
    title: "蝴蝶机长啥样？",
    desc: "查看商用器械实物大图与插销调节指南",
    prompt: "蝴蝶机长啥样？请详细告诉我它的外观特征、座椅与插销怎么调节，以及常见训练误区。"
  }
];

const activeProvider = computed(getActiveProvider);
const activeApiKey = computed(getActiveApiKey);
const selectedModel = computed(() => getActiveModels().find((model) => model.id === getActiveModelId()) || null);

function cleanModelTitle(model) {
  if (!model) {
    const fallbackId = getActiveModelId();
    if (fallbackId) {
      const fName = formatModelDisplayName(fallbackId);
      return fName.replace(/\s*\([^)]*\)$/, "").trim();
    }
    return "点击选择模型";
  }
  let name = String(model.name || model.id || "").trim();
  name = name.replace(/^[A-Za-z0-9_\-\.\s]+:\s*/, "").trim();
  name = name.replace(/\s*\([^)]*\)$/, "").trim();
  return name || model.id;
}
const sendDisabledReason = computed(() => getMessageBlockReason({
  apiKey: activeApiKey.value,
  model: selectedModel.value,
  text: draft.value,
  imageCount: attachments.value.length
}));

// Only show inputHint if there is an actual error, never distracting prompt text
const inputHint = computed(() => {
  if (inputError.value) return inputError.value;
  if (attachments.value.length && !selectedModel.value?.capabilities.image) {
    return `${selectedModel.value?.name || '当前模型'}不支持图片输入。`;
  }
  return "";
});
const inputHintError = computed(() => Boolean(inputError.value || (attachments.value.length && !selectedModel.value?.capabilities.image)));

watch(() => aiSession.conversation.length, () => scrollToBottom(true));
watch(
  () => [aiSession.drawerOpen, aiSession.pendingAutoRun],
  async ([isOpen, isAutoRun]) => {
    if (isOpen && isAutoRun && !generating.value) {
      aiSession.pendingAutoRun = false;
      if (activeApiKey.value) {
        await runCurrentHistory();
      } else {
        aiSession.conversation.push(makeMessage("assistant", "⚠️ **您尚未连接大模型 API Key**。\n\n请点击下方【前往设置连接】配置您的 DeepSeek、智谱 GLM 或通义千问 API Key，即可开启大模型实时在线深度分析！"));
      }
    }
  }
);
watch(() => aiSession.clearRevision, () => {
  abortController?.abort();
  attachments.value = [];
  draft.value = "";
  inputError.value = "";
  pendingContext.value = null;
  retryAvailable.value = false;
  toolRuntime.clear();
});

const userScrolledUp = ref(false);

function handleScroll() {
  if (!messageList.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messageList.value;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  // If user scrolled up more than 50px away from bottom, respect user's reading intent
  userScrolledUp.value = distanceFromBottom > 50;
}

let scrollRafId = null;

function scrollToBottom(force = false) {
  if (isTest) {
    if (!messageList.value) return;
    if (!force && userScrolledUp.value) return;
    messageList.value.scrollTop = messageList.value.scrollHeight;
    return;
  }

  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    scrollRafId = null;
    if (!messageList.value) return;
    if (!force && userScrolledUp.value) return;
    messageList.value.scrollTop = messageList.value.scrollHeight;
  });
}

function jumpToBottom() {
  userScrolledUp.value = false;
  scrollToBottom(true);
}

function makeMessage(role, text, extra = {}) {
  return reactive({ id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, role, text, ...extra });
}

const copiedMessageId = ref(null);
let copyResetTimeout = null;

async function copyText(target, maybeMsg) {
  const message = (typeof target === "object" && target !== null) ? target : maybeMsg;
  const rawText = typeof target === "string" ? target : (message?.text || "");
  if (!rawText) return;
  const clean = cleanAIMessage(rawText);

  try {
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(clean);
    } else if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = clean;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  } catch (_e) {
    try {
      if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = clean;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch (_err) {}
  }

  const msgKey = message?.id || (typeof target === "object" && target?.id) || rawText;
  if (msgKey) {
    copiedMessageId.value = msgKey;
    if (copyResetTimeout) clearTimeout(copyResetTimeout);
    copyResetTimeout = setTimeout(() => {
      copiedMessageId.value = null;
    }, 2000);
  }
}

// Only push state-changing mutations with undo support into conversation (hide read-only queries)
function addToolResult(result) {
  if (result.tool === "get_gym_machine_appearance" && result.data?.equipment) {
    const lastAssistant = [...aiSession.conversation].reverse().find(m => m.role === "assistant");
    if (lastAssistant) {
      lastAssistant.matchedEquipment = result.data.equipment;
    }
  }
  if (result.undoAvailable || !result.success) {
    aiSession.conversation.push(makeMessage("tool", result.message, {
      tool: result.tool,
      success: result.success,
      callId: result.callId,
      undoAvailable: result.undoAvailable,
      undone: false
    }));
  }
}

async function sendPrompt(promptText) {
  if (!promptText || generating.value) return;
  draft.value = promptText;
  await send();
}

async function runCurrentHistory(runOptions = {}) {
  // Check if last user message asked about an equipment (exclude workout review prompts)
  const lastUserMsg = [...aiSession.conversation].reverse().find(m => m.role === "user");
  const userText = lastUserMsg?.text || "";
  const isWorkoutReviewPrompt = /我刚刚完成了|深度复盘|本次训练客观数据|训练总评|各动作实测明细/i.test(userText);
  const isEquipmentIntent = /器械|长啥样|长什么样|外观|实物|调节|插销|座椅|照片/i.test(userText);
  const matchedEqFromUser = (!isWorkoutReviewPrompt && isEquipmentIntent) ? findGymEquipmentVisual(userText) : null;

  const assistantBubble = makeMessage("assistant", "", { 
    streaming: true, 
    reasoning: "", 
    isThinking: false, 
    reasoningCollapsed: false,
    matchedEquipment: matchedEqFromUser || null
  });
  aiSession.conversation.push(assistantBubble);
  generating.value = true;
  retryAvailable.value = false;
  userScrolledUp.value = false;
  scrollToBottom(true);
  abortController = new AbortController();
  
  let rawAccumulatedText = "";

  try {
    const baseOptions = {
      provider: aiSession.activeProvider,
      apiKey: activeApiKey.value,
      model: selectedModel.value?.id,
      capabilities: selectedModel.value?.capabilities || { text: true, tools: true, streaming: true },
      toolRuntime,
      signal: abortController.signal,
      onReasoning: (chunk) => {
        assistantBubble.isThinking = true;
        assistantBubble.reasoning += chunk;
        scrollToBottom(false);
      },
      onToken: (token) => {
        rawAccumulatedText += token;
        // Check if there are embedded <think> tags in the token stream
        const parsed = extractReasoningAndContent(rawAccumulatedText);
        if (parsed.reasoning) {
          assistantBubble.reasoning = parsed.reasoning;
          assistantBubble.isThinking = parsed.isThinking;
        } else if (assistantBubble.reasoning && !parsed.isThinking) {
          assistantBubble.isThinking = false;
        }
        assistantBubble.text = parsed.content;
        scrollToBottom(false);
      },
      onToolResult: addToolResult
    };
    const result = runOptions.pending
      ? await resumeAssistantAfterDecision({ ...baseOptions, ...runOptions })
      : await runAssistantLoop({ ...baseOptions, messages: aiSession.apiMessages });

    aiSession.apiMessages = result.history;
    assistantBubble.streaming = false;
    assistantBubble.isThinking = false;
    
    // Final clean up and parse
    const finalParsed = extractReasoningAndContent(result.content || rawAccumulatedText || assistantBubble.text);
    if (finalParsed.reasoning && !assistantBubble.reasoning) {
      assistantBubble.reasoning = finalParsed.reasoning;
    }
    assistantBubble.text = finalParsed.content || (result.status === "confirmation_required" ? "这个变更需要你确认后才会执行。" : "已为你处理完成。");
    
    // Process and record authoritative usage and cost
    if (result.usage && result.usage.total_tokens > 0) {
      assistantBubble.usage = result.usage;
      const provId = aiSession.activeProvider;
      const modelObj = selectedModel.value;
      const pricing = modelObj?.pricing || null;
      if (provId === "openrouter") {
        assistantBubble.costUSD = calculateCostUSD(result.usage, pricing);
      }
      recordTokenUsage({
        provider: provId,
        modelId: modelObj?.id || "",
        usage: result.usage,
        pricing
      });
    }

    // Auto-collapse reasoning after thinking finishes to keep answer prominent
    if (assistantBubble.reasoning) {
      assistantBubble.reasoningCollapsed = true;
    }
    
    // If not matched yet, check if assistant's own response discusses an equipment (exclude workout reviews)
    if (!isWorkoutReviewPrompt && !assistantBubble.matchedEquipment && assistantBubble.text) {
      const matchedFromContent = findGymEquipmentVisual(assistantBubble.text);
      if (matchedFromContent && /长啥样|长什么样|外观|照片|实物|调节|插销|座椅/i.test(assistantBubble.text)) {
        assistantBubble.matchedEquipment = matchedFromContent;
      }
    }
    
    if (result.status === "confirmation_required") pendingContext.value = result;
    if (result.status === "tool_limit") assistantBubble.text = result.content;
  } catch (error) {
    assistantBubble.streaming = false;
    assistantBubble.isThinking = false;
    if (error?.name === "AbortError") {
      assistantBubble.text = assistantBubble.text
        ? `${assistantBubble.text}\n\n（已停止生成）`
        : "已停止生成。";
      retryAvailable.value = true;
    } else {
      assistantBubble.text = error instanceof Error ? error.message : "AI 请求失败";
      retryAvailable.value = true;
    }
  } finally {
    generating.value = false;
    abortController = null;
    if (!userScrolledUp.value) {
      scrollToBottom(false);
    }
  }
}


async function send() {
  inputError.value = "";
  if (sendDisabledReason.value) return;
  const text = draft.value.trim();
  const images = attachments.value.map((image) => ({ ...image }));

  const matchedEq = findGymEquipmentVisual(text);
  let promptTextForApi = text;
  if (matchedEq && /长啥样|长什么样|长什么样子|外观|怎么认|怎么找|照片|图片|调座椅|调插销|怎么调/i.test(text)) {
    promptTextForApi = `${text}\n\n[教练系统提示：界面已为学员展示【${matchedEq.name}】的高清实物大图卡片与直接网址。请详细指导该器械的外观识别特征、座椅与插销调节规范、常见避坑要点]`;
  }

  const userMessage = buildUserMessage(promptTextForApi, images);
  aiSession.apiMessages.push(userMessage);
  aiSession.conversation.push(makeMessage("user", text || "请分析这张图片。", { images }));
  draft.value = "";
  attachments.value = [];
  pendingContext.value = null;
  userScrolledUp.value = false;
  scrollToBottom(true);
  await runCurrentHistory();
}

async function decidePending(confirm) {
  const current = pendingContext.value;
  if (!current) return;
  pendingContext.value = null;
  await runCurrentHistory({
    confirm,
    pending: current.pending,
    toolCall: current.toolCall,
    history: current.history,
    toolRounds: current.toolRounds
  });
}

function stopGeneration() {
  abortController?.abort();
}

function retryGeneration() {
  if (!generating.value && aiSession.apiMessages.length) runCurrentHistory();
}

function handleClear() {
  abortController?.abort();
  clearConversation();
  toolRuntime.clear();
  pendingContext.value = null;
  retryAvailable.value = false;
}

function undoToolMessage(message) {
  const result = toolRuntime.undo(message.callId);
  message.text = result.message;
  message.success = result.success;
  message.undone = result.success;
}

async function handleFiles(event) {
  inputError.value = "";
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  const remaining = MAX_ATTACHMENTS - attachments.value.length;
  if (remaining <= 0) {
    inputError.value = `每次最多添加 ${MAX_ATTACHMENTS} 张图片。`;
    return;
  }
  try {
    for (const file of files.slice(0, remaining)) attachments.value.push(await processImageFile(file));
    if (files.length > remaining) inputError.value = `每次最多添加 ${MAX_ATTACHMENTS} 张图片。`;
  } catch (error) {
    inputError.value = error instanceof Error ? error.message : "图片处理失败";
  }
}

function goToSettings() {
  store.activeTab = "stats";
  aiSession.drawerOpen = false;
}
</script>

<style scoped>
@keyframes drawerSlideUp {
  from {
    transform: translateY(100%);
    opacity: 0.85;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-drawer-slide-up {
  animation: drawerSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 丝滑复制打勾微动效 (Silky Smooth Copy-to-Check Morph Transition) */
.copy-morph-enter-active,
.copy-morph-leave-active {
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.copy-morph-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(2px);
}

.copy-morph-leave-to {
  opacity: 0;
  transform: scale(0.7) translateY(-2px);
}

/* 物理弹簧打勾徽标与笔画动态绘制 */
.check-icon {
  animation: checkSpringPop 0.36s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes checkSpringPop {
  0% {
    transform: scale(0.5) rotate(-12deg);
    opacity: 0;
  }
  65% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.check-path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: checkStrokeDraw 0.28s cubic-bezier(0.65, 0, 0.45, 1) 0.04s forwards;
}

@keyframes checkStrokeDraw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>

