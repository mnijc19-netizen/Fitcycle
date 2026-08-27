# 🤖 FITCYCLE AI 代理与开发者接入纲领 (Agent Entrypoint Protocol)

> **致所有接手本项目的 AI 代理 (Antigravity, Claude Code, Cursor, Windsurf, GPT, etc.)：**
> 在对本项目进行任何读取、修改、重构或回答前，**必须强制、无条件首先阅读以下三份核心宪法与作战地图**：
> 1. 🏛️ **项目全域架构母宪法与级联影响矩阵**：[`docs/FITCYCLE_MASTER_CONSTITUTION.md`](./docs/FITCYCLE_MASTER_CONSTITUTION.md)
> 2. 🎯 **极速开发与手术级调度指令指南**：[`docs/FITCYCLE_SURGICAL_DISPATCH_GUIDE.md`](./docs/FITCYCLE_SURGICAL_DISPATCH_GUIDE.md)
> 3. 📙 **运动科学、战力天梯与 METs 归一化法典**：[`docs/FITCYCLE_CORE_CONSTITUTION.md`](./docs/FITCYCLE_CORE_CONSTITUTION.md)

---

## ⚡ 动态修宪、层级评定与违宪冲突预警法则 (The Constitutional Evolution Law)

当用户提出任何**新想法、新规则或修改请求**时，AI 代理必须严格执行以下 **4 步闭环裁决**：

1. **自动层级定级 (Auto-Triage)**：
   * 属于【Layer 0/1 母宪法公理】（如底层战力模型、生理学免责、数据安全）？
   * 属于【Layer 2 领域计算引擎】（如新做工公式、衰减算法）？
   * 属于【Layer 3 状态管理】还是【Layer 4 纯 UI/视效】？
2. **违宪冲突探测 (Conflict Detection)**：
   * 对比现有宪法条款。若发现用户的需求与既有核心公理（如：0~72h 不扣分、零皮肤侵入）产生冲突，**严禁私自盲改！必须即刻向用户高亮指出冲突条款，并提供【合规替代方案】或【确认正式修宪】供用户决策**。
3. **即时同步入宪 (Instant Amendment)**：
   * 确定变更后，在修改业务代码的同时，**强制同步将新规则写入 `docs/` 对应宪法文件与 `tests/` 测试用例**，保证宪法永远与最新代码 100% 同步！
4. **Git 物理留痕 (Physical Permanence)**：
   * 所有历史规则与演变全部物理沉淀在代码库与 Git 提交历史中，杜绝任何因 AI 上下文重置导致的遗漏。

---

## ⚡ 极速外科手术式作业 3 步定律 (The 3-Step Law)

1. **查表定位**：接收到用户需求后，直接在 `docs/FITCYCLE_SURGICAL_DISPATCH_GUIDE.md` 查找 `[OP-XXX]` 指令代号，提取 2~3 个精准靶向文件；
2. **纯净作业**：
   * 业务规则 $\to$ 仅改 `src/engine/` 中的纯函数；
   * UI/视觉 $\to$ 仅改组件与样式，严禁侵入底层逻辑；
   * 状态持久 $\to$ 仅在 `src/store/fitnessStore.js` 调度，Getter 严禁产生副作用；
3. **秒级自愈与测试**：执行对应的 Vitest 单元测试，确保 **100% PASS** 后方可交付！

---

## 🚫 零容忍执行红线 (Zero-Tolerance Invariants)

- **严禁**在业务逻辑中编写特定皮肤的分支判断（如 `if (skin === 'cs')` 计算不同分数）；
- **严禁**在 0~72h 安全恢复期内扣减战力分；
- **严禁**在 Store 的 Getter 中直接修改响应式状态（防止 Vue 递归死循环）；
- **修改规则后**，必须同时更新 `tests/` 测试用例与 `docs/` 宪法文件。