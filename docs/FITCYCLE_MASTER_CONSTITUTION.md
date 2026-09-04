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

7. 修改 AI 大模型网关/协议 (AI Gateway)  ├── 7.1 `src/ai/providerClient.js` (厂商 API 请求适配器与参数转换)
                                          ├── 7.2 `src/ai/aiSession.js` (全局会话状态、多模态 Token 管理与流式调度)
                                          ├── 7.3 `src/components/AISettingsPanel.vue` (厂商选择、宫格模型卡片与 Key 验证)
                                          └── 7.4 `tests/ai-core.test.js` (断言多厂商鉴权与多模态识图兼容性)

8. 移动端工学与滚动穿透 (Ergonomics)       ├── 8.1 `src/utils/scrollLock.js` (统一引用计数锁定与释放宿主滚动)
                                          ├── 8.2 `src/style.css` (注入 .scrollbar-none, .overscroll-contain, overscroll-behavior-y)
                                          ├── 8.3 `src/components/TabBar.vue` (实现双击/再次点击已激活 Tab 顺滑回顶)
                                          ├── 8.4 各主要弹窗组件 (注入顶部 Grabber 抓手条、背景遮罩速退并挂接 scrollLock)
                                          └── 8.5 `tests/ergonomics-and-scroll.test.js` (自动化人体工学与防穿透断言)
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

### 卷三：【运动科学、战力天梯与 METs 归一化宪法】（见 `docs/FITCYCLE_CORE_CONSTITUTION.md`）
*   **公理 3.1**：0~72h 科学休息受宪法免责保护，严禁扣分。
*   **公理 3.2**：断练 5 天以上回归强制触发 150% 破冰复苏。
*   **公理 3.3**：所有非力量运动（跑步机、划船机、徒手）一律通过 METs 公式归一化为等效做工吨位。
*   **公理 3.4**：形体测绘执行 7 天冷却期，杜绝单日频繁刷分。

### 卷四：【AI 智能体教练、模型网关与 Prompt 宪法】
*   **公理 4.1**：所有 AI 评价必须以严格运动生物力学与渐进超负荷为客观依据，严禁无效虚假夸奖。
*   **公理 4.2**：支持主流全厂商直连（DeepSeek, 通义千问, 智谱, 硅基流动, OpenAI, Gemini），API Key 仅存放于用户本地，严禁上传中转。

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