# 🎯 FITCYCLE 极速开发与外科手术级调度指令指南
# (Fitcycle Precision Surgical Dispatch & Development Codex)

> **指南定位：** 本指南是 Fitcycle 项目的**“指哪打哪”极速开发作战地图**。无论面临任何新增需求、规则微调或功能删减，直接根据本目录索引定位靶向文件，3 步内闭环秒级解决，0 犹豫、0 割裂、0 脏代码。

---

## 🗺️ 一、全系统 10 大核心领域外科手术式导航地图 (Surgical Dispatch Matrix)

```
=====================================================================================================================================
指令代号        业务场景 / 功能增减需求         🎯 靶向核心文件 (Target Files)                        🧪 秒级自动化验证指令
=====================================================================================================================================
[OP-SKIN]       新增/修改一套 UI 主题皮肤       ├── 1. `src/engine/skinHonorSchemas.js` (段位/勋章/字典)  npm run test tests/cs-theme.test.js
                (如赛博朋克、中世纪、动漫)      ├── 2. `src/styles/themes.css` (CSS 变量调色盘)
                                                └── 3. `src/components/TabBar.vue` (底部导航专属图标)

[OP-EXERCISE]   新增运动类型/动作库扩展         ├── 1. `src/store/fitnessStore.js` (DEFAULT_EXERCISES)   npm run test tests/compatibility.test.js
                (如跑步机、爬楼机、普拉提)      ├── 2. `src/engine/honorEngine.js` (METs 做工折算比)
                                                └── 3. `src/components/ExerciseDetailModal.vue` (发力图解)

[OP-RANK]       调整段位分、天梯排位加减分      ├── 1. `src/engine/honorEngine.js` (FPS 积分与衰减公式)   npm run test tests/honor-system.test.js
                (如衰减周期、150%复苏加成)      ├── 2. `src/engine/skinHonorSchemas.js` (全皮肤称号对齐)
                                                └── 3. `src/components/HonorShowcaseModal.vue` (天梯陈列馆)

[OP-BADGE]      新增/修改专精荣誉勋章           ├── 1. `src/engine/honorEngine.js` (BADGE_DEFINITIONS)   npm run test tests/honor-system.test.js
                (自律/形体/力量/战术彩蛋)       ├── 2. `src/engine/skinHonorSchemas.js` (本地化文案插槽)
                                                └── 3. `src/components/HonorShowcaseModal.vue` (勋章墙分类)

[OP-METRIC]     形体围度新增部位与防刷分        ├── 1. `src/store/fitnessStore.js` (recordBodyMetric)    npm run test tests/honor-system.test.js
                (如小腿围、颈围、7天冷却)       ├── 2. `src/components/BodyMetricsModal.vue` (输入表单与标准)
                                                └── 3. `src/views/StatsView.vue` (V 身比与摘要展示)

[OP-AI-MODELS]  接入新 AI 厂商/大模型           ├── 1. `src/ai/providerClient.js` (API Key 与参数转换)  npm run test tests/ai-core.test.js
                (如 DeepSeek-V3, Qwen-2.5)      ├── 2. `src/components/AISettingsPanel.vue` (2列宫格卡片)
                                                └── 3. `src/ai/aiSession.js` (会话上下文与流式调度)

[OP-AI-COACH]   调整训练结算 AI 战绩评价        ├── 1. `src/ai/workoutAnalyzer.js` (S~D 级评价与恢复池) npm run test tests/rest-and-ux-upgrades.test.js
                (如渐进超负荷、补给/恢复语录)   └── 2. `src/components/WorkoutSummaryModal.vue` (卡片排版)

[OP-CYCLE]      分化计划模板增减与排期          ├── 1. `src/store/fitnessStore.js` (DEFAULT_CYCLE, PLANS)npm run test tests/compatibility.test.js
                (如 5分化、上下肢分化、全身)    ├── 2. `src/components/CycleEditorModal.vue` (分化编辑器)
                                                └── 3. `src/views/TodayView.vue` (今日排期滚动轨道)

[OP-TIMER]      组间休息计时器视效/音效微调     ├── 1. `src/components/RestTimerFloat.vue` (悬浮窗与吸附)npm run test tests/rest-and-ux-upgrades.test.js
                (如 C4炸药包、边缘自适应避让)   ├── 2. `src/utils/sound.js` (蜂鸣/C4 滴答/拆弹音效)
                                                └── 3. `src/store/fitnessStore.js` (startRestTimer 默认时长)

[OP-BACKUP]     数据备份、恢复与向下兼容迁移    ├── 1. `src/store/fitnessStore.js` (export/importJSON)   npm run test tests/compatibility.test.js
                (如版本号迁移、防脏数据清洗)    └── 2. `src/views/StatsView.vue` (导入导出按钮与 Toast)
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
└── tests/                                # 🧪 质量防护网 (全套自动化 Vitest 52+ 用例)
    ├── honor-system.test.js              # 战力天梯、METs、衰减、150%复苏、7天冷却断言
    ├── compatibility.test.js             # 备份导入导出、数据向下兼容断言
    ├── ai-core.test.js                   # 多厂商大模型鉴权与多模态识图断言
    ├── ai-drawer.test.js                 # AI 教练抽屉对话与上下文管理断言
    ├── cs-theme.test.js                  # 皮肤切换、DOM 属性与持久化断言
    └── rest-and-ux-upgrades.test.js      # 休息计时器、边缘自适应、手滑撤回断言
```