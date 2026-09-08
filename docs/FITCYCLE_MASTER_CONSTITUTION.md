# 🏛️ FITCYCLE 项目全域架构母宪法与级联影响矩阵
# (Fitcycle Master Architecture Constitution & Cascading Impact Matrix)

> **母宪法宗旨：** 本文件是 Fitcycle 全栈项目的**最高元规则 (Meta-Rules & Axiomatic Architecture)**。定义了系统 5 层分层契约、全域单一事实源、以及**“改动任何模块必须强制联动修改哪些下游文件”的级联变更血缘矩阵 (Cascading Change Impact Matrix)**。任何人类工程师或 AI 代理在执行任何修改前，必须严格对照本宪法。

---

## 🧭 第零章：系统分层契约模型 (Layered Contract Model)

Fitcycle 采用严格单向依赖的 5 层洋葱架构，**严禁跨层反向污染与循环依赖**：

```
[Layer 4: Presentation / UI Views] (页面、模态弹窗、Tailwind 视觉)
                 │  (只读/触发 Action)
[Layer 3: Reactive State Store]    (Pinia/Vue 响应式 Store、localStorage 备份)
                 │  (调用纯函数)
[Layer 2: Domain Business Engines] (HonorEngine, WorkoutAnalyzer, METsCalc)
                 │  (导入配置/协议)
[Layer 1: Pure Schemas & Config]   (SkinHonorSchemas, ExercisesDB, PlanPresets)
                 │  (遵循公理)
[Layer 0: Master Axioms & Laws]    (数据不可丢失、生物学免责、零硬编码公理)
```

---

## ⚡ 第一章：全局级联变更影响矩阵 (Cascading Change Impact Matrix)

> **核心铁律：** 当您或 AI 需要修改某一模块时，**必须同时且强制联动检查与修改以下对应文件**，严禁孤立修改导致系统割裂！

```
========================================================================================================================
变更发起源 (Trigger Source)               必须强制联动更新的文件 (Mandatory Cascading Updates)
========================================================================================================================
1. 新增/修改 UI 主题皮肤 (Skin)           ├── 1.1 `src/engine/skinHonorSchemas.js` (添加新皮肤的 7 阶段位、勋章、术语字典)
                                          ├── 1.2 `src/style.css` (注入语义化 CSS 变量如 --accent, --glow)
                                          ├── 1.3 `src/components/TabBar.vue` (添加新皮肤对应的 5 大专属导航图标)
                                          └── 1.4 `tests/cs-theme.test.js` 或新建皮肤测试 (验证 DOM 注入与持久化)

2. 新增/调整 运动类型或动作库 (Exercise)  ├── 2.1 `src/store/fitnessStore.js` (`DEFAULT_EXERCISES` 库追加标准结构)
                                          ├── 2.2 `src/engine/honorEngine.js` (若是新运动大类，依《宪法第二章》配置 METs 折算比)
                                          ├── 2.3 `src/components/ExerciseDetailModal.vue` (补充动作发力要领与目标肌群)
                                          └── 2.4 `tests/compatibility.test.js` (断言动作导入导出与去重完整性)

3. 修改 训练结算与 AI 战力评分 (Finish)   ├── 3.1 `src/ai/workoutAnalyzer.js` (调整 S/A/B/C/D 评级、超负荷增量分析与恢复建议)
                                          ├── 3.2 `src/store/fitnessStore.js` (`finishWorkout` 中的 FPS 结算与防漏加练)
                                          ├── 3.3 `src/components/WorkoutSummaryModal.vue` (展示结算卡片、FPS 战力分与加练入口)
                                          └── 3.4 `tests/rest-and-ux-upgrades.test.js` (断言结算数据与手滑撤回逻辑)

4. 修改 战力天梯/勋章/扣分规则 (Honor)   ├── 4.1 `src/engine/honorEngine.js` (核心数学公式、72h免责、150%复苏、7天冷却)
                                          ├── 4.2 `src/engine/skinHonorSchemas.js` (同步更新各皮肤的称号映射)
                                          ├── 4.3 `src/components/HonorShowcaseModal.vue` (荣誉陈列馆与服役勋章展示)
                                          ├── 4.4 `docs/FITCYCLE_CORE_CONSTITUTION.md` (同步更新法律条款)
                                          └── 4.5 `tests/honor-system.test.js` (断言数学公式、扣分区间与防刷分测试)

5. 修改 战术免战盾牌/减载周期 (Deload Shield)├── 5.1 `src/engine/honorEngine.js` (16次打卡充能比、21天冷却与计算纯函数)
                                          ├── 5.2 `src/store/fitnessStore.js` (`toggleDeloadShield` 状态变更与校验)
                                          ├── 5.3 `src/components/HonorShowcaseModal.vue` (【唯一权威消耗与激活入口】)
                                          ├── 5.4 `src/views/StatsView.vue` (设置页仅提供只读状态跳转，严禁开设免费后门)
                                          ├── 5.5 `src/views/TodayView.vue` & `CalendarView.vue` (休整态看板联动)
                                          ├── 5.6 `docs/FITCYCLE_CORE_CONSTITUTION.md` (第4.4条生理学减载法典)
                                          └── 5.7 `tests/honor-system.test.js` (断言16次门槛、筑基期与21天冷却测试)

6. 修改 形体围度测量标准 (Body Metrics)   ├── 6.1 `src/store/fitnessStore.js` (`recordBodyMetric` 7天冷却与里程碑奖励)
                                          ├── 6.2 `src/components/BodyMetricsModal.vue` (测量表单、V身比与科学测量标准弹窗)
                                          ├── 6.3 `src/views/StatsView.vue` & `TodayView.vue` (入口胶囊与数据摘要)
                                          └── 6.4 `tests/honor-system.test.js` (断言冷却逻辑与数据持久化)

7. 修改 AI 大模型网关/协议与策略选型 (AI Gateway) ├── 7.1 `src/ai/providerClient.js` (Vercel AI Gateway 及各大厂商 API 适配与路由)
                                                  ├── 7.2 `src/ai/modelCapabilities.js` (四大模型策略分类器、跨厂商识图与思考识别)
                                                  ├── 7.3 `src/ai/aiSession.js` (全局会话状态、多模态 Token 管理、流式调度与预设矩阵)
                                                  ├── 7.4 `src/components/AISettingsPanel.vue` (策略分段器、宫格卡片与 Key 验证)
                                                  ├── 7.5 `src/components/AIAssistantDrawer.vue` (抽屉快捷弹窗、一键升级视觉识图)
                                                  └── 7.6 `tests/vercel-ai-gateway-and-strategy.test.js` & `ai-core.test.js` (全方位断言)

8. 移动端工学与滚动穿透 (Ergonomics)       ├── 8.1 `src/utils/scrollLock.js` (统一引用计数锁定与释放宿主滚动)
                                          ├── 8.2 `src/style.css` (注入 .scrollbar-none, .overscroll-contain, overscroll-behavior-y)
                                          ├── 8.3 `src/components/TabBar.vue` (实现双击/再次点击已激活 Tab 顺滑回顶)
                                          ├── 8.4 各主要弹窗组件 (注入顶部 Grabber 抓手条、背景遮罩速退并挂接 scrollLock)
                                          ├── 8.5 `src/utils/mobileFullscreen.js` (进页微量位移自动收拢顶底栏为极简胶囊，首触强化)
                                          └── 8.6 `tests/ergonomics-and-scroll.test.js` (自动化人体工学与防穿透断言)

9. 云端漫游与跨端同步 (Cloud Sync)         ├── 9.1 `src/engine/cloudSyncEngine.js` (导出验证、冲突裁决与 Gist/REST 同步)
                                          ├── 9.2 `src/store/fitnessStore.js` (`updateCloudSyncConfig` 与状态持久化)
                                          ├── 9.3 `src/components/CloudSyncModal.vue` (云同步配置、快照预览与手动导入导出)
                                          ├── 9.4 `src/views/StatsView.vue` (设置页云端同步管理入口)
                                          └── 9.5 `tests/cloud-sync-engine.test.js` (断言快照结构、时间戳冲突与端点通讯)

10. 离线 PWA 与视口防抖 (Offline & Viewport) ├── 10.1 `public/manifest.webmanifest` & `public/sw.js` (PWA 规范与离线缓存策略)
                                          ├── 10.2 `src/utils/networkStatus.js` (全局响应式网络状态监听)
                                          ├── 10.3 `src/components/Navbar.vue` (离线胶囊提示与状态展示)
                                          ├── 10.4 `index.html` & `src/style.css` (`interactive-widget=overlays-content` + `100lvh` 彻底消除滑动时视口抖动形变)
                                          └── 10.5 `tests/pwa-and-offline.test.js` (断言 SW、manifest、全屏胶囊与 100lvh 视口架构)

11. 经典分化与科学周期库 (Periodization)    ├── 11.1 `src/data/trainingTemplates.js` (5 大经典分化结构与动作编排)
                                          ├── 11.2 `src/store/fitnessStore.js` (`applyTrainingTemplate` 状态应用)
                                          ├── 11.3 `src/components/TrainingTemplatesModal.vue` (周期库弹窗与一键套用)
                                          ├── 11.4 `src/views/CycleView.vue` & `CycleEditorModal.vue` (周期库直达入口)
                                          └── 11.5 `tests/training-templates.test.js` (断言 5 大分化完整性与周期流转)

12. 生物力学防刷与天梯护盾 (Anti-Cheat)    ├── 12.1 `src/engine/antiCheatEngine.js` (人体生理极限纯函数、单组与单次封顶)
                                          ├── 12.2 `src/engine/honorEngine.js` (战力积分与自适应力量倍率钳制)
                                          ├── 12.3 `src/store/fitnessStore.js` (`finishWorkout` 生理极限校验)
                                          ├── 12.4 `src/views/TodayView.vue` (打卡界面生理极值平滑告警胶囊)
                                          └── 12.5 `tests/anti-cheat-and-boundary.test.js` (断言世界纪录阈值与防刷分保护)

13. 大模型 Token 与实时金额审计大盘 (Token & Cost Audit) ├── 13.1 `src/ai/tokenTracker.js` (物理Token累计/实时USD折算/持久化)
                                                          ├── 13.2 `src/ai/providerClient.js` (Stream usage物理抓取)
                                                          ├── 13.3 `src/components/AISettingsPanel.vue` (审计大盘/计费模式标识)
                                                          ├── 13.4 `src/components/AIAssistantDrawer.vue` (单条消息徽标/即时记录)
                                                          └── 13.5 `tests/token-and-cost-audit.test.js` (零虚构与精确算费断言)
========================================================================================================================
```

---

## 🏛️ 第二章：分领域宪法卷宗索引 (Domain-Specific Constitutions)

系统由以下 5 部独立但紧密联动的分卷法典构成：

### 卷一：【UI/UX 与多皮肤插槽宪法】
*   **公理 1.1**：任何皮肤仅能是纯数据字典，严禁在业务逻辑中包含 `if (skin === 'xxx')`。
*   **公理 1.2**：所有主题色必须通过 CSS Variable 注入，移动端触控目标严禁小于 44×44px。
*   **公理 1.3（拇指黄金热区与单手操控公理）**：
    * 屏幕下部 35%~45% 属于拇指天然黄金区（Natural Thumb Zone）。所有主要操作（CTA 开始按钮、底栏 TabBar、抽屉抓手、保存确认）必须就近布置在拇指区。
    * 底部 TabBar 必须支持“再次点击当前激活 Tab 即刻顺滑回顶（Tap-to-Top）”的 Apple 原生交互；切换 Tab 时瞬间瞬移回顶。
    * 长列表长页面（如动作库）必须在屏幕右下方单手热区提供浮动回顶胶囊（Floating Back-to-Top Pill）。
*   **公理 1.4（零游离滑块与滚动隔离防穿透公理）**：
    * 所有模态弹窗（Bottom Sheet / Modal）打开时，必须统一通过 `src/utils/scrollLock.js` 引用计数锁住 `document.body` 滚动，严禁手势穿透到背景页面。
    * 所有内部滚动容器必须配置 `.overscroll-contain` 隔离边界滚动；所有横向/纵向滑动条必须严格配置 `.no-scrollbar` / `.scrollbar-none`，杜绝系统浏览器滑块假弹而页面卡死不动的顽疾。
*   **公理 1.5（虚拟键盘与真实视口自适应公理 Visual Viewport Adaptation & Lifecycle Guard）**：
    * 移动端虚拟键盘弹起时，模态抽屉与输入框必须严格监听并适配 `window.visualViewport` 高度，严禁因 WebKit 误判上滚导致顶部标题栏丢失或底部露馅背景穿透；
    * **视口生命周期严格隔离与零滚动劫持**：模态抽屉在未激活或已关闭状态下，**严禁常驻挂载全局视口滚动监听**；仅在 `drawerOpen === true` 时动态挂载监听并在关闭时立即注销。同时 `updateVisualViewport` 必须设置硬性守卫，仅在虚拟键盘激活顶起时才重置视口，**页面日常向下滚动绝对不得调用 `window.scrollTo(0, 0)`**，彻底杜绝向下滚动被强行拽回顶部的缺陷；
    * 输入聚焦时空状态卡片必须自适应优雅折叠为单行紧凑横滑胶囊，彻底杜绝 2x2 大卡片在键盘弹起时突兀挤压视口；
    * 底部输入栏内边距在键盘开启时动态收紧（消除 safe-area 虚高留白），实现与软键盘顶沿零缝隙丝滑贴合。
*   **公理 1.6（浏览器与独立 WebApp 双模全场景自适应公理 Universal Standalone & WebApp Parity Axiom）**：
    * **触控反馈与 `:active` 全域穿透**：移动端（尤其 iOS WebKit Standalone 模式）默认抑制 `:active` 伪类，必须在顶层容器注入 `touchstart` 激活，保证全机型、全运行方式下按压微缩、触觉反馈一致生效；
    * **动态安全区与浮动交互吸附**：针对普通浏览器（0px safe-area）与独立 WebApp（通常 34px Home 条 safe-area）的动态突变，浮动操作胶囊必须基于 `calc(max(env(safe-area-inset-bottom, 0px), 8px) + [TabBarOffset])` 动态吸附，严禁硬编码固定 bottom 导致被底栏遮挡；
    * **跨容器宿主滚动三角适配**：多端/PWA 容器滚动宿主可能在 `window`、`documentElement` 或 `body` 漂移。回顶与位移必须通过 `src/utils/scrollUtils.js` 三角取值与多宿主同步 `scrollTo`，确保 100% 顺滑回顶；
    * **主导航粘性层级保护**：顶部 Navbar 必须为根级独立 `position: sticky top-0` 容器，严禁包裹在等高外层 div 中导致滚动逃逸，彻底保护手机系统状态栏（时间/电池）。
*   **公理 1.7（明暗光感与世界观解耦公理 Orthogonal Appearance & Lore Parity Axiom）**：
    * **身份与光感绝对正交**：系统的【外观明暗底色 (`data-mode="dark" | "light"`)】与【世界观称号系统 (`data-skin="default" | "chamber" | "cs" | "monochrome"`)】必须保持 100% 架构级解耦；
    * **段位称谓神圣不可篡改**：用户在白天强光或夜间暗光下切换明暗底色，当前所属的段位荣誉、特工称号、徽章称谓与做工吨位**绝对保持 100% 连贯不变**，严禁因切换底色而篡改用户段位；
    * **全场景 WCAG AA/AAA 对比度保障**：所有 8 大色谱矩阵（3 套暗夜、3 套白昼、2 套典藏黑白）在任何材质下均需满足主要文字 $\ge 4.5:1$（AA）甚至 $\ge 7:1$（AAA），按钮与控件在 Normal/Hover/Active 下严格达标，杜绝眩光、灰底灰字或反差不足；
    * **全域语义令牌与深色高反差文字安全保底**：Tailwind v4 的 `--color-zinc-*` 浅色模式重定向必须同步加固 `.text-zinc-950` 与 `.text-zinc-900` 为 `#09090B !important`，确保金色、翡翠色、天蓝色等高亮操作按钮上的文字永远呈现深邃黑炭色（15:1 对比度），彻底根治黄底白字、绿底白字等能见度死穴；
    * **3D 视口与媒体暗色视界保护**：动作库 3D GIF 动图与解剖矢量图视口通过 `data-theme-preserve="true"` 保留暗色演示幕布，保证 `mix-blend-screen` 滤色与白色骨骼肌肉高光轮廓在浅色模式下依旧 100% 饱满可见。



### 卷二：【训练分化、周期与动作库宪法】
*   **公理 2.1**：推拉腿 (PPL) 为出厂黄金模板，支持 N 天自由滚动与周固定循环。
*   **公理 2.2**：用户历史训练打卡记录与 PR 数据具有绝对神圣性，永久本地保存，严禁隐式清除。
*   **公理 2.3（黄金科学动作库规模与解剖力学完备性公理 Gold-Standard Exercise Completeness Axiom）**：
    * **全谱系完备规模**：系统预置科学动作库扩充至 148 款黄金规模，覆盖胸部 (20)、背部 (24)、肩部 (18)、手臂 (22)、腿部 (26)、核心 (14)、有氧体能 (6)、动态热身与关节灵活性 (10) 以及静态拉伸与肌筋膜松解 (20) 共 9 大完备分类，每一款均为高做工比王牌、经典抗阻利器或权威防伤基石；
    * **力学要领五维完备**：所有内置动作必须 100% 配齐中英双语与多维度别名搜索索引、主次目标肌群、5 步完整力学要点（准备、轨迹、顶峰、离心、呼吸）、真实常见错误避坑提示与精准科学平替动作链；
    * **人机工效学抗信息过载导航 (Anti-Overload Visual Hub)**：坚决废除 100+ 项动作无限下滑死平铺列表。动作库主视图在“全部”标签下采用【9 大部位视觉导航矩阵】、【6 大黄金复合王牌速选】与【NSCA / ACSM 运动医学与防伤专栏】三级结构，让用户 1 秒精准定位目标，拒绝信息拥堵；
    * **练前热身与练后拉伸双阶段流**：
        * **练前动态激活 (NSCA RAMP)**：严禁大重量抗阻前静态死拉伸导致肌力骤降 8%~15%，配备 3 分钟动态升温热身流，靶向激活关节滑液与肌群神经传导；
        * **练后筋膜重置 (ACSM 2024)**：配备 3 分钟练后静态拉伸流，于心率平复至 100bpm 后进行，单次保持 20~30 秒舒适牵拉，平抑皮质醇、唤醒副交感神经开启肌纤维超量重组；
    * **本地解剖动图 100% 物理存在**：148 款动作全部配备本地 360x360 高清 3D 动画 GIF，配套本地高亮解剖画板兜底，在断网、离线及浅色模式下永不破图、0 假图。
*   **公理 2.4（训练遗忘超时结算与最后完成组锚定公理 Workout Inactivity Auto-Settlement Axiom）**：
    * **超时自动归档**：若用户在训练进行中离开应用或遗忘点击完成训练，系统在检测到距离最后一组完成时间（`lastSetCompletedAt`）超过 40 分钟时，自动触发防忘结算；
    * **真实做工时间锚定**：结算时真实训练时长严格以 `lastSetCompletedAt - startTime` 截断重算（若未做任何组则以当前已过时间或舍弃处理），彻底消除用户离开后计时器无限空转至 100+ 分钟的虚假虚高做工；
    * **唤醒温馨提醒与复盘入口**：用户重新打开应用或切回前台时，自动弹出友好卡片告知已按最后一组完成时间安全归档，并提供“查看本次战绩复盘”直达入口。
*   **公理 2.5（分化肌群刺激诊断与零额度纯本地启发式引擎公理 Split Muscle Intelligence & Zero-Quota Deterministic Engine Axiom）**：
    * **零 Token 零额度消耗**：实时分化肌群刺激监控（如推日监测胸/肩/三头完成组数、容量饱和度与缺口动作推荐）严格基于确定性运动生物力学规则与 NSCA/ACSM 超量恢复容量标准（大肌群黄金容量 6~10 组，辅助肌群 4~8 组），100% 运行于前端本地内存（纯函数，0 外部 API 调用，0 Token 额度损耗，<1ms 响应，完全离线运行）；
    * **云端 AI 额度真正用在刀刃上**：用户的云端大模型 API Key（DeepSeek/Qwen/Gemini）仅在用户主动点击“AI 深度复盘”或在抽屉提问时才调用一次，绝对不在后台静默打卡时空转消耗用户余额；
    * **实时缺口感知与 1 键补充**：系统实时诊断当前分化未覆盖或刺激偏低的目标肌群，动态推送 2~3 款不重复的黄金动作胶囊，支持 1 键秒级加入今日训练。
*   **公理 2.6（未做动作自动脱水与自由起手式公理 Untouched Exercises Pruning & Blank Start Axiom）**：
    * **保存时自动脱水剔除**：完成训练保存结算时，系统强制自动过滤剔除任何 0 完成组的动作，仅保存实际打卡完成的动作，彻底杜绝未做动作存入日志，免去用户手动逐个删除之苦；
    * **界面一键清理与空白起步**：训练界面提供醒目的“一键清除未做动作”按钮，并支持从“自由空白计划”从零起步开练，赋予用户 100% 自由排布权；
    * **秒级生物力学同轨迹平替**：动作替换弹窗置顶呈现同部位器械/自由重量秒级科学平替，器械被占时 1 秒无缝换动作。

### 卷三：【运动科学、战力天梯与 METs 归一化宪法】（见 `docs/FITCYCLE_CORE_CONSTITUTION.md`）
*   **公理 3.1**：0~72h 科学休息受宪法免责保护，严禁扣分。
*   **公理 3.2**：断练 5 天以上回归强制触发 150% 破冰复苏。
*   **公理 3.3**：所有非力量运动（跑步机、划船机、徒手）一律通过 METs 公式归一化为等效做工吨位。
*   **公理 3.4**：形体测绘执行 7 天冷却期，杜绝单日频繁刷分。

### 卷四：【AI 智能体教练、模型网关与 Prompt 宪法】
*   **公理 4.1**：所有 AI 评价必须以严格运动生物力学与渐进超负荷为客观依据，严禁无效虚假夸奖。
*   **公理 4.2**：支持主流全厂商直连与全球路由网关（DeepSeek, 通义千问, 智谱, 硅基流动, 月之暗面, Vercel AI Gateway, OpenRouter），API Key 仅存放于用户本地，严禁上传中转。所有网关均基于统一标准化 OpenAI 适配器协议轻量接入，0 额外 SDK 引入，打包增量 < 0.5KB，未配置时内存开销为 0 字节，兼备全厂商自由度与极致性能。
*   **公理 4.3（AI 复盘卡片独立性与图文去扰公理 AI Review Clutter Isolation Axiom）**：
    * 训练结算复盘提示词（如“深度复盘”、“我刚刚完成了推日训练”）严禁误触发单体器械大图遮挡 AI 评价文本；
    * 所有自然匹配弹出的器械大图卡片必须具备右上角一键关闭收起按钮（✕），确保用户阅读 AI 训练报告视野零遮挡。
*   **公理 4.4（AI 连通性真实探测与毫秒延迟反馈公理 AI Real-Connectivity Probing & Latency Feedback Axiom）**：
    * **真实探测杜绝假阳性**：不仅通过 `/models` 端点验证鉴权，更支持在生效模型卡片内向选定大模型发送极简 `max_tokens: 5` 对话探测，提前暴露欠费、权限不足或协议不匹配风险；
    * **毫秒延迟与状态脱水反馈**：测试成功后实时展示往返延迟毫秒数与模型极简回复摘要，失败时以脱水中文直接说明核心故障根因（HTTP 401 密钥失效、HTTP 429 额度耗尽等），严禁卡死或吞错。
*   **公理 4.5（Key 指纹智能识别与单行极简工效学公理 Key Fingerprint Auto-Detection & Ergonomic Compactness Axiom）**：
    * **双层指纹快筛与探针发现**：用户粘贴或输入 Key 时，系统在 0ms 内通过正则指纹进行格式判别（`sk-or-` 命中 OpenRouter、`id.secret` 命中智谱 GLM、`v-gw-` 命中 Vercel Gateway），实现无需手动切换的自动命中；针对通用 `sk-` Key 遇到鉴权失败时，启动轻量多路候选探针并发自愈匹配；
    * **垂直空间极致瘦身**：严禁采用占用 4 行 200px+ 垂直空间的庞大卡片死平铺，统一采用 34px 极致轻量的单行横滑药丸胶囊栏，高度立减 75%，将首屏黄金空间全额释放给模型策略与对话交互。
*   **公理 4.6（Token 与资费权威真实审计公理 Authoritative Token & Cost Audit Axiom）**：
    * **零虚构原则（Zero-Hallucination Pricing）**：严禁在未接入官方动态单价查询接口的厂商（DeepSeek、智谱 GLM、阿里通义千问、硅基流动、月之暗面 Moonshot、Vercel AI Gateway 等）上凭空捏造或假想任何法币金额（USD/CNY），杜绝误导用户。
    * **物理真实 Token 审计**：所有厂商统一通过 API 标准 Stream Usage（`stream_options: { include_usage: true }`）如实提取并持久化累计物理 Token（prompt_tokens、completion_tokens、total_tokens），数据直接来源于官方底层计费回执。
    * **实时精准折算（OpenRouter）**：仅当厂商 API 具备权威 pricing 计费元数据（如 OpenRouter 的 `/api/v1/models` 物理回传的 `pricing: { prompt, completion }`）时，系统才动态计算精确到小数点后 4~5 位的实时美元消耗。
    * **全盘透明看板与用户自主权**：在设置面板提供 4 号审计大盘，清晰标注各服务商的审计模式（`Token + 实时金额` vs `精确 Token 审计`），并支持随时重置用量统计与查看各服务商调用分布。

### 卷五：【数据持久化、迁移与测试质量宪法】
*   **公理 5.1**：所有新功能必须包含自动化 Vitest 单元测试，测试通过率必须保持 100%。
*   **公理 5.2**：备份 JSON 文件采用自描述 Schema，保证向下兼容历史版本。

---

## 🧬 第三章：宪法动态自演进、层级定级与冲突仲裁机制 (Constitution Evolution & Conflict Protocol)

### 第 3.1 条【新需求自动层级定级流程 (Auto-Triage Flow)】
当用户提出新规则或想法时，AI 代理必须按以下顺序自动定级并写入对应宪法：
1. **Layer 0/1（母宪法公理/数据字典）** $\to$ 写入 `docs/FITCYCLE_MASTER_CONSTITUTION.md` 或 `src/engine/skinHonorSchemas.js`；
2. **Layer 2（领域计算引擎）** $\to$ 写入 `docs/FITCYCLE_CORE_CONSTITUTION.md` 与 `src/engine/honorEngine.js`；
3. **Layer 3（状态存储）** $\to$ 写入 `src/store/fitnessStore.js`；
4. **Layer 4（UI 视效）** $\to$ 仅修改 Vue 组件与 CSS，不触碰底层算式。

### 第 3.2 条【违宪冲突检测与即时阻断仲裁 (Conflict Arbitration)】
*   **冲突探测**：若用户提出的新需求与既有核心宪法（如：休息免责、零硬编码、防刷分公理）发生逻辑或生物学冲突，**AI 严禁私自盲目覆盖**。
*   **即刻上报**：AI 必须第一时间明确向用户指出：“您提出的规则与《底层宪法》第 X.X 条存在冲突（原因分析）”，并给出明确的选项：
    *   **选项 A**：确认正式修改宪法核心条款（修宪升级）；
    *   **选项 B**：采用符合宪法架构的无冲突替代方案（如：将硬编码改为配置字典扩展）。

### 第 3.3 条【源码持久化与上下文抗丢失机制 (Context Truncation Immunity)】
*   **对话上下文 vs 物理文件事实**：AI 对话窗口受 Token 长度限制，长久多轮对话后聊天记录会被截断压缩；
*   **绝对物理安全机制**：Fitcycle 的全部宪法条款、算法引擎、测试用例、血缘矩阵均**物理持久化存储于本地文件系统（`docs/`、`src/`、`tests/`）并同步提交至 GitHub Git 仓库**。
*   **零丢失保证**：任何新 AI 会话在启动的第一秒，均直接从物理磁盘全量读取完整宪法文件，**不受任何多轮对话上下文遗忘的影响，历史经验与规则 100% 永久继承！**

---

## 📜 附录：AI 自动化执行红线 (Zero-Tolerance Redlines)

在执行任何修改时，任何 AI 代理必须无条件遵守：
1. **测试红线**：修改完代码后，必须自动运行全部测试套件并确保 100% PASS。
2. **纯函数红线**：Store 的 Getter 函数严禁产生副作用修改状态（杜绝 Vue 递归死循环）。
3. **宪法同步红线**：只要修改了涉及上述矩阵的任何规则，必须同步更新宪法文件与测试用例！
4. **冲突预警红线**：发现逻辑违宪时必须第一时间向用户预警并提供裁决选项，严禁暗箱盲改！