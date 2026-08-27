# 🚀 FITCYCLE 新 AI 代理与开发者 0 秒上手白皮书 (Project Onboarding Guide)

> **目标：** 无论您是第一次打开本项目的全新 AI（GPT-4o, Claude 3.7, DeepSeek, Antigravity, Cursor），还是新加入的人类开发者，**阅读本文档 60 秒即可通透全盘架构、技术栈、核心脉络与开发禁区！**

---

## 🎯 一、Fitcycle 是什么？（一句话定位）
**Fitcycle（包皮健身）** 是一款专为手机端打造的、极简高颜值的**硬核运动科学打卡与电竞化战力排位 Web APP（PWA）**。
- **目标用户**：追求严谨渐进超负荷、形体比例与趣味游戏化激励的健身人群；
- **核心特色**：离线优先、推拉腿分化循环、FPS 战力天梯、多皮肤无缝切换（CS2/Chamber）、多模型 AI 私教抽屉。

---

## 🛠️ 二、技术栈全景图 (Technology Stack)

| 领域 | 选型 | 核心设计哲学 |
| :--- | :--- | :--- |
| **前端框架** | **Vue 3 (Composition API, `<script setup>`)** | 极致轻量、响应式精准渲染 |
| **构建工具** | **Vite 8** | 毫秒级冷启动与极速热重载 (HMR) |
| **样式系统** | **Tailwind CSS 3 + 语义化 CSS 变量** | 移动端原生质感、全皮肤色彩注入 |
| **状态管理** | **Pinia / Vue Reactive Store** | 单一事实源、Getter 纯函数无副作用 |
| **本地持久化** | **LocalStorage (自描述 Schema 自动迁移)** | 100% 离线可用、零服务端依赖 |
| **测试框架** | **Vitest** | 54 项自动化单元与集成测试守护 |
| **AI 大模型网关** | **原生 Fetch 直连主流 6 大厂商 API** | API Key 本地安全存放、流式输出 |

---

## 🧭 三、核心目录拓扑与文件职责 (Directory Topology)

```
健身计划小程序/
├── AGENTS.md                             # 🤖 AI 代理第一优先级接入协议 (必读)
├── CHANGELOG.md                          # 📜 全域版本变更演进编年史
├── docs/                                 # 🏛️ 宪法与治理中心
│   ├── FITCYCLE_MASTER_CONSTITUTION.md   # [母宪法与级联联动血缘矩阵]
│   ├── FITCYCLE_CORE_CONSTITUTION.md     # [卷三：运动科学与战力天梯法典]
│   ├── FITCYCLE_SURGICAL_DISPATCH_GUIDE.md# [10大领域指哪打哪手术地图]
│   └── PROJECT_ONBOARDING.md             # [本文档：0秒上手白皮书]
├── src/
│   ├── ai/                               # 🧠 卷四：AI 智能体教练与厂商网关 (providerClient, aiSession)
│   ├── engine/                           # ⚙️ 卷三：纯计算引擎 (honorEngine, skinHonorSchemas - 零业务侵入)
│   ├── store/                            # 📦 卷二/五：响应式状态中枢 (fitnessStore.js)
│   ├── components/                       # 🎨 卷一：UI 组件 (TabBar, RestTimerFloat, Modals)
│   ├── views/                            # 📱 页面视图 (Today, Cycle, Calendar, Exercises, Stats)
│   └── styles/                           # 💅 主题调色盘 (themes.css)
└── tests/                                # 🧪 54 项自动化 Vitest 测试套件 (100% PASS 守护网)
```

---

## 🚫 四、开发者三大绝对红线 (Zero-Tolerance Invariants)

1. **红线 1【零皮肤分支侵入】**：严禁在 `engine/` 或 `store/` 编写 `if (skin === 'cs')` 计算不同的分数，所有皮肤必须是纯视觉与文本映射字典！
2. **红线 2【Getter 绝对纯净】**：Store 的 Getter/Computed 严禁修改响应式状态（防止 Vue 递归死循环）！
3. **红线 3【改动必跑测试】**：任何代码交付前必须运行 `npm run test` 并确保 **100% PASS**！

---

## ⚡ 五、常用开发与自检命令

```bash
npm run dev        # 启动本地极速开发服务器
npm run test       # 运行全部 54 项自动化单元测试
npm run build      # 生产环境打包构建校验
```