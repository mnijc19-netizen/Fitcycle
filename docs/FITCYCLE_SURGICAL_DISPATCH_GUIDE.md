# 🎯 FITCYCLE 极速开发与外科手术级调度指令指南
# (Fitcycle Precision Surgical Dispatch & Development Codex)

> **指南定位：** 本指南是 Fitcycle 项目的**“指哪打哪”极速开发作战地图**。无论面临任何新增需求、规则微调或功能删减，直接根据本目录索引定位靶向文件，3 步内闭环秒级解决，0 犹豫、0 割裂、0 脏代码。

---

## 🗺️ 一、全系统 10 大核心领域外科手术式导航地图 (Surgical Dispatch Matrix)

```
=====================================================================================================================================
指令代号        业务场景 / 功能增减需求         🎯 靶向核心文件 (Target Files)                        🧪 秒级自动化验证指令
=====================================================================================================================================
[OP-SKIN]       UI 主题皮肤与白昼/暗夜正交系统  ├── 1. `src/engine/skinHonorSchemas.js` (段位/勋章/字典)  npm run test tests/cs-theme.test.js
                (深空黑/枪铁灰/白西装/典藏黑白) ├── 2. `src/style.css` (8大调色盘与 WCAG 对比度)
                                                ├── 3. `src/utils/themeManager.js` (DOM 与 Theme-color 同步)
                                                └── 4. `src/components/Navbar.vue` & `StatsView.vue` (模式切换)

[OP-BRAND]       FitCycle 品牌重塑与矢量 Logo   ├── 1. `src/components/FitCycleLogo.vue` (莫比乌斯环)   npm test -- tests/fitcycle-exercises-and-brand.test.js
                (Apple/Linear大厂级无衬线字标)   ├── 2. `src/components/Navbar.vue` (顶栏无遮挡排版)
                                                └── 3. `public/favicon.svg` & `index.html` (品牌标识)

[OP-EXERCISE]   动作库 1-to-1 纠偏与扩充 (79款)  ├── 1. `src/data/exercises*.js` (姿态纠偏/别名/动图)     npm test -- tests/fitcycle-exercises-and-brand.test.js
                (彻底杜绝卧姿放坐姿/全向别名)   ├── 2. `src/store/fitnessStore.js` (79款权威动作库)      npm test -- tests/compatibility.test.js
                                                └── 3. `src/views/ExercisesView.vue` (别名与英文搜索)

[OP-RANK]       调整段位分、天梯排位加减分      ├── 1. `src/engine/honorEngine.js` (FPS 积分与衰减公式)   npm run test tests/honor-system.test.js
                (如衰减周期、150%复苏加成)      ├── 2. `src/engine/skinHonorSchemas.js` (全皮肤称号对齐)
                                                └── 3. `src/components/HonorShowcaseModal.vue` (天梯陈列馆)

[OP-DELOAD]     战术免战盾牌与周期化减载        ├── 1. `src/engine/honorEngine.js` (16次充能比、21天冷却)npm run test tests/honor-system.test.js
                (做工充能/筑基期/唯一权威消耗)  ├── 2. `src/components/HonorShowcaseModal.vue` (权威消耗弹窗)
                                                ├── 3. `src/views/StatsView.vue` (只读状态跳转，严禁侧门开关)
                                                └── 4. `src/views/TodayView.vue` & `CalendarView.vue` (休整联动)

[OP-BADGE]      新增/修改专精荣誉勋章           ├── 1. `src/engine/honorEngine.js` (BADGE_DEFINITIONS)   npm run test tests/honor-system.test.js
                (自律/形体/力量/战术彩蛋)       ├── 2. `src/engine/skinHonorSchemas.js` (本地化文案插槽)
                                                └── 3. `src/components/HonorShowcaseModal.vue` (勋章墙分类)

[OP-METRIC]     形体围度新增部位与防刷分        ├── 1. `src/store/fitnessStore.js` (recordBodyMetric)    npm run test tests/honor-system.test.js
                (如小腿围、颈围、7天冷却)       ├── 2. `src/components/BodyMetricsModal.vue` (输入表单与标准)
                                                └── 3. `src/views/StatsView.vue` (V 身比与摘要展示)

[OP-AI-MODELS]  官方 API 动态识别/Key自动识别/策略分级 ├── 1. `src/ai/providerClient.js` (API 动态识别/Key指纹识别/多路探针) npm test -- tests/openrouter-provider.test.js
                (彻底告别硬编码滞后/自动匹配服务商/ ├── 2. `src/ai/modelCapabilities.js` (识图/思考/工具阻断/友好名) npm test -- tests/vercel-ai-gateway-and-strategy.test.js
                 单行极简横滑胶囊/双重连通测试/       ├── 3. `src/ai/aiSession.js` (API 模型一等公民权威缓存)
                 DeepSeek/GLM/OpenRouter/Vercel)      ├── 4. `src/components/AISettingsPanel.vue` (实时识别/紧凑单行/模型测速)
                                                      └── 5. `src/components/AIAssistantDrawer.vue` (抽屉内快捷同步/一键识图)

[OP-AI-COACH]   调整训练结算 AI 战绩评价        ├── 1. `src/ai/workoutAnalyzer.js` (S~D 级评价与恢复池) npm run test tests/rest-and-ux-upgrades.test.js
                (如渐进超负荷、补给/恢复语录)   └── 2. `src/components/WorkoutSummaryModal.vue` (卡片排版)

[OP-AI-AUDIT]   AI Token 用量审计与双币种转换  ├── 1. `src/ai/tokenTracker.js` (Token/USD/CNY 权威换算) npm test -- tests/token-and-cost-audit.test.js
                (OpenRouter 真实物理计费/全局汇率├── 2. `src/components/AITokenAuditPanel.vue` (用量审计大盘)
                 切换/免虚假计费/外层设置直显)  ├── 3. `src/views/StatsView.vue` (外层用量条与全局币种切换)
                                                └── 4. `src/utils/themeManager.js` & `store/fitnessStore.js`

[OP-CYCLE]      分化计划模板增减与排期          ├── 1. `src/store/fitnessStore.js` (DEFAULT_CYCLE, PLANS)npm run test tests/compatibility.test.js
                (如 5分化、上下肢分化、全身)    ├── 2. `src/components/CycleEditorModal.vue` (分化编辑器)
                                                └── 3. `src/views/TodayView.vue` (今日排期滚动轨道)

[OP-TIMER]      组间休息计时器视效/音效微调     ├── 1. `src/components/RestTimerFloat.vue` (悬浮窗与吸附)npm run test tests/rest-and-ux-upgrades.test.js
                (如 C4炸药包、边缘自适应避让)   ├── 2. `src/utils/sound.js` (蜂鸣/C4 滴答/拆弹音效)
                                                └── 3. `src/store/fitnessStore.js` (startRestTimer 默认时长)

[OP-BACKUP]     数据备份、恢复与向下兼容迁移    ├── 1. `src/store/fitnessStore.js` (export/importJSON)   npm run test tests/compatibility.test.js
                (如版本号迁移、防脏数据清洗)    └── 2. `src/views/StatsView.vue` (导入导出按钮与 Toast)

[OP-PRESET-UX]  新手轻量预设与智能重量联动      ├── 1. `src/data/defaultPlans.js` (精简3动作/加练推荐池)  npm run test tests/rest-and-ux-upgrades.test.js
                (3动作黄金容量/级联下填/简易加练)├── 2. `src/store/fitnessStore.js` (syncSetDataToSubsequentSets)
                                                └── 3. `src/views/TodayView.vue` (一键加练药丸/行内同步按钮)

[OP-ERGO]       移动端人体工学与双模全机型适配  ├── 1. `src/utils/scrollUtils.js` (多容器三角回顶纯函数) npm run test tests/ergonomics-and-scroll.test.js
                (单手热区、WebApp动效穿透、动态底栏)├── 2. `src/utils/scrollLock.js` (引用计数宿主锁)
                                                ├── 3. `src/components/TabBar.vue` (通用双击回顶)
                                                └── 4. `src/views/ExercisesView.vue` (动态 safe-area 浮动回顶)

[OP-CLOUD-SYNC] 多端漫游云端快照与差异合并同步  ├── 1. `src/engine/cloudSyncEngine.js` (快照校验/Gist/REST)  npm test -- tests/cloud-sync-engine.test.js
                (GitHub Gist/自定义 Webhook/冲突解决)├── 2. `src/components/CloudSyncModal.vue` (云同步面板)
                                                └── 3. `src/views/StatsView.vue` (设置页管理入口)

[OP-OFFLINE-PWA]PWA 离线打卡与地下室弱网通信    ├── 1. `public/manifest.webmanifest` & `public/sw.js`    npm test -- tests/pwa-and-offline.test.js
                (桌面独立窗口/SW缓存/离线微胶囊)├── 2. `src/utils/networkStatus.js` (网络状态感知)
                                                └── 3. `src/components/Navbar.vue` (离线打卡胶囊提示)

[OP-SPLIT]      五大经典科学训练分化周期库      ├── 1. `src/data/trainingTemplates.js` (5大周期预设)     npm test -- tests/training-templates.test.js
                (PPL/PHUL/Arnold/531/新手循环)  ├── 2. `src/components/TrainingTemplatesModal.vue` (周期弹窗)
                                                └── 3. `src/views/CycleView.vue` & `CycleEditorModal.vue`

[OP-ANTI-CHEAT] 人体生理极值防刷与排位天梯护盾  ├── 1. `src/engine/antiCheatEngine.js` (纯函数极值钳制)  npm test -- tests/anti-cheat-and-boundary.test.js
                (单组极值/单次100分封顶/倍率护盾)├── 2. `src/engine/honorEngine.js` (战力防爆整合)
                                                └── 3. `src/views/TodayView.vue` (UI 极值黄色警告胶囊)

[OP-WARMUP-STRETCH]分化热身与拉伸跟练系统       ├── 1. `src/data/exercisesWarmup.js` & `exercisesStretches.js` npm test -- tests/fitcycle-warmup-flow.test.js
                (推拉腿专属激活/ACSM松解/智能匹配)├── 2. `src/components/WarmupFlowModal.vue` & `StretchFlowModal.vue`
                                                └── 3. `src/views/TodayView.vue` & `ExercisesView.vue` (分化选择器与首屏科学指南)

[OP-GYM-VISUAL] 健身房商用器械实物图谱与AI图文 ├── 1. `src/data/gymEquipmentVisuals.js` (器械大图/调节说明) npm test -- tests/gym-machine-visuals-and-ai.test.js
                (孤立演播室大图/防重复图文/平滑流式)├── 2. `public/machines/*.jpg` (高清单体器械实物摄影)
                                                ├── 3. `src/components/AIAssistantDrawer.vue` (内嵌卡片与去抖滚动)
                                                └── 4. `src/ai/assistantRuntime.js` & `fitcycleTools.js` (防重复指令)

[OP-AUTO-SETTLE] 训练未关超时自动结算与防呆提醒 ├── 1. `src/store/fitnessStore.js` (lastSetCompletedAt/结算 pure logic) npm test -- tests/auto-settle-and-exercise-ux.test.js
                (40分钟超时/锚定尾组时间/重开温馨弹窗)├── 2. `src/views/TodayView.vue` (挂载与切台可见性探针/提醒弹窗)
                                                └── 3. `src/components/AIAssistantDrawer.vue` (复盘卡片独立性与关闭按钮)

[OP-SPLIT-INTEL] 实时分化刺激诊断与零额度动作推荐 ├── 1. `src/engine/splitIntelligenceEngine.js` (实时肌群覆盖纯函数) npm test -- tests/split-intelligence-and-zero-quota.test.js
                (0额度损耗/肌群缺口/未做动作自动脱水)├── 2. `src/views/TodayView.vue` (刺激看板/空白起手/一键清空)
                                                ├── 3. `src/components/ExercisePickerModal.vue` (同部位平替卡片)
                                                └── 4. `src/store/fitnessStore.js` (pruneUntouched/blank模式)

[OP-TOKEN-AUDIT] 大模型 Token 与实时金额审计大盘  ├── 1. `src/ai/tokenTracker.js` (物理Token累计/实时USD折算/持久化) npm test -- tests/token-and-cost-audit.test.js
                (零虚构/OpenRouter实时算费/全厂商Token ├── 2. `src/ai/providerClient.js` (Stream usage物理抓取)
                 大盘审计看板/单条消息徽标/一键重置)   ├── 3. `src/components/AISettingsPanel.vue` (审计大盘/计费模式标识)
                                                ├── 4. `src/components/AIAssistantDrawer.vue` (单条消息徽标/即时记录)
                                                └── 5. `src/ai/aiSession.js` (厂商计费元数据/模型定价结构)
=====================================================================================================================================
```

---

## ⚡ 二、“指哪打哪”极速 3 步闭环作业法 (3-Step Precision Protocol)

当您发出任何增减功能指令时，严格执行以下 3 步极速闭环：

### 📌 第 1 步：查表定位靶向文件（Targeting）
*   对照上表直接锁定 2 ~ 3 个关联文件，严禁漫无目的地盲目全仓搜索。

### 📌 第 2 步：纯数据配置与纯函数接入（Atomic Execution）
*   **若改规则**：只改 `src/engine/` 中的纯函数与字典，业务层自动生效；
*   **若改 UI**：只改 Vue 组件视图与 Tailwind 样式，严禁在 UI 里写分数计算逻辑；
*   **若改状态**：在 `src/store/fitnessStore.js` 统一调度，严禁在 Getter 里触发副作用。

### 📌 第 3 步：秒级单元测试与自愈验证（Instant Verification）
*   运行对应领域的测试指令（如 `npm run test tests/honor-system.test.js`），确保 **100% 通过**后自动构建推送到 GitHub！

---

## 📂 三、项目全域代码拓扑与职责档案 (Full Architecture Code Topology)

```
c:\Users\17479\Desktop\健身计划小程序\
├── docs/                                 # 🏛️ 宪法与作战指引层
│   ├── FITCYCLE_MASTER_CONSTITUTION.md   # [全局母宪法与级联联动血缘矩阵] (最高权威)
│   ├── FITCYCLE_CORE_CONSTITUTION.md     # [卷三：运动科学、战力天梯与做工归一化法典]
│   └── FITCYCLE_SURGICAL_DISPATCH_GUIDE.md# [指哪打哪：极速开发与手术级调度指令指南]
│
├── src/
│   ├── ai/                               # 🧠 卷四：AI 智能体教练与大模型网关
│   │   ├── aiSession.js                  # 全局会话状态、Token 调度与流式通信
│   │   ├── providerClient.js             # 6 大厂商 API 请求适配器与鉴权网关
│   │   └── workoutAnalyzer.js            # 5 阶客观运动科学打分与恢复轮播池
│   │
│   ├── engine/                           # ⚙️ 卷三：领域纯计算引擎 (零业务侵入)
│   │   ├── honorEngine.js                # FPS 战力、4 阶生物衰减、150%复苏与 METs 归一化
│   │   └── skinHonorSchemas.js           # 全皮肤零侵入纯映射字典 (Tiers, Badges, Slots)
│   │
│   ├── store/                            # 📦 卷二/五：响应式状态与持久化中枢
│   │   └── fitnessStore.js               # 动作库、分化周期、打卡日志、形体围度单一事实源
│   │
│   ├── components/                       # 🎨 卷一：UI 组件与战术 HUD 模态窗
│   │   ├── FitCycleLogo.vue              # 黄金比例双环莫比乌斯矢量 Logo
│   │   ├── Navbar.vue                    # 国际标准无遮挡顶部导航与战术 HUD
│   │   ├── TabBar.vue                    # 底部 5 大导航与主题自适应高亮
│   │   ├── RestTimerFloat.vue            # C4 / 极简组间休息智能悬浮窗 (带边缘防遮挡)
│   │   ├── HonorShowcaseModal.vue        # 荣誉殿堂、天梯排位与 6 阶服役勋章展馆
│   │   ├── BodyMetricsModal.vue          # 形体围度追踪板与科学取样标准指南
│   │   ├── WorkoutSummaryModal.vue       # 训练结算弹窗、FPS 加分与手滑撤回
│   │   ├── AISettingsPanel.vue           # 2 列响应式宫格模型选择器与 Key 管理
│   │   ├── CycleEditorModal.vue          # 推拉腿 N 天分化周期编辑器
│   │   └── ExerciseDetailModal.vue       # 动作科学发力细节与肌群图解
│   │
│   ├── views/                            # 📱 核心主视图
│   │   ├── TodayView.vue                 # 首页：战备催练看板、即刻开练与排期滚动
│   │   ├── CycleView.vue                 # 分化周期总览与动作编排
│   │   ├── CalendarView.vue              # 历史打卡日历热力图
│   │   ├── ExercisesView.vue             # 动作库大全与搜索分类
│   │   └── StatsView.vue                 # 综合战力天梯大卡、围度追踪与偏好设置
│   │
│   └── styles/
│       └── themes.css                    # Tailwind 语义化主题调色盘与 HUD 动画
│
└── tests/                                # 🧪 质量防护网 (全套自动化 Vitest 65+ 用例)
    ├── fitcycle-exercises-and-brand.test.js # 品牌 Logo、63 款动作 1-to-1 物理对齐与别名断言
    ├── honor-system.test.js              # 战力天梯、METs、衰减、150%复苏、7天冷却断言
    ├── compatibility.test.js             # 备份导入导出、数据向下兼容断言
    ├── ai-core.test.js                   # 多厂商大模型鉴权与多模态识图断言
    ├── ai-drawer.test.js                 # AI 教练抽屉对话与上下文管理断言
    ├── cs-theme.test.js                  # 皮肤切换、DOM 属性与持久化断言
    ├── rest-and-ux-upgrades.test.js      # 休息计时器、边缘自适应、手滑撤回断言
    └── ergonomics-and-scroll.test.js     # 移动端人体工学、滚动隔离与零假弹滑块断言
```