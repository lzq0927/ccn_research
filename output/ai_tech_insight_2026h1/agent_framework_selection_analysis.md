# 云核高稳智能体框架选型分析

> 编制日期：2026-06-09
> 方法论：结合 Harness Engineering 七阶段生命周期评估 + 主流 Agent 框架横向对比
> 前置文档：`harness_engineering_deep_dive.md`、`harness_framework_hermes.md`、`harness_framework_openclaw.md`、`harness_framework_mapping.md`

---

## 一、主流 Agent 框架当前格局（2026H1）

| 框架 | 定位 | 星标 | 核心模式 | 适合场景 |
|------|------|------|---------|---------|
| **OpenClaw** | 个人 AI 助手平台 | ~280K | Hub-Spoke 四层架构 | 个人效率 / 快速搭建 |
| **Hermes Agent** | 自进化多 Agent | 活跃 (NousResearch) | 子 Agent 隔离 + 幻觉门控 + 闭环学习 | 高可靠性 / 自进化场景 |
| **LangGraph** | 图工作流编排 | LangChain 生态 | 有向图 (DAG) + 状态机 | 生产级多步 Agent 流程 |
| **CrewAI** | 角色驱动多 Agent | 活跃 | Role → Goal → Backstory | 快速原型验证 |
| **AutoGen (Microsoft)** | 企业级多 Agent | Microsoft 生态 | 多 Agent 对话协作 | Azure / 企业集成 |
| **Claude Agent SDK** | 工具优先 Agent | Anthropic 官方 | Tool-use-first | 生产级可靠性 Agent |

**关键认知**：这些框架分两类——**通用 Agent 框架**（OpenClaw、Hermes、CrewAI）和**编排 / 构建框架**（LangGraph、AutoGen、Claude Agent SDK）。前者是"开箱即用的 Agent 产品"，后者是"搭建 Agent 的工具"。

---

## 二、OpenClaw 能用吗？—— 不能

Harness 七阶段评分 **21/35**，云核高稳场景有三项致命缺陷：

| 致命缺陷 | 详情 |
|---------|------|
| **无自纠正机制** | S4 评分 ★☆☆☆☆——无幻觉检测、无输出验证、无环检测。错误直接传播到生产网络 |
| **无自进化能力** | S7 评分 ★☆☆☆☆——经验无法积累，每次使用从零开始 |
| **安全模型不达标** | CVE-2026-25253 (CVSS 8.8 RCE)、ClawHavoc 供应链攻击 (12% 恶意 skill)、凭据明文存储 |

**结论**：OpenClaw 是"上手最快的 Agent"，但也是"安全最弱的 Agent"。云核高稳场景**直接排除**。

---

## 三、Hermes Agent 能用吗？—— 可以作为重要参考，但需要大幅改造

Harness 七阶段评分 **32/35**，是通用 Agent 框架中最适合云核场景的：

### 3.1 核心优势

| 核心优势 | 云核场景适配 |
|---------|------------|
| **幻觉门控（Hallucination Gate）** | 在 Agent 间设置验证检查点，阻止错误级联传播——直接解决云核最担心的误诊级联问题 |
| **子 Agent 隔离** | 独立沙箱 + 聚焦上下文窗口，天然适配感知 / 诊断 / 恢复 / 评估的 Agent 分工 |
| **闭环学习（Closed Learning Loop）** | 每次故障诊断后自动优化策略——运维经验不断增值 |
| **目标锁定（/goal）** | 防止长时间运维任务中 Agent "跑偏" |

### 3.2 距离云核生产仍有关键差距

| 差距 | 说明 |
|------|------|
| **验证形式化不足** | 幻觉门控是启发式的，不是数学证明。云核需要 Datadog DST / TLA+ 级的形式化验证 |
| **可观测性基础** | 只有基础日志，缺少 OpenTelemetry 全链路可观测 |
| **库式自进化的膨胀风险** | 技能只增不减，长期运行后检索开销增大、审计困难——电信级场景需要 SkillOpt 式的有界编辑 + 验证门 |
| **无电信域适配** | 缺少 5GC 信令 (SBI/PFCP/NGAP) 知识、无 3GPP 协议层集成 |
| **子 Agent 资源限制仍在开发** | Issue #4271——per-subagent 资源限制尚未完成 |

---

## 四、核心决策：基于 Hermes 修改 vs 自研

### 方案 A：基于 Hermes 修改

**做法**：Fork Hermes Agent，在其幻觉门控 + 子 Agent 隔离 + 闭环学习的基础上，叠加云核专用层。

```
Hermes 原生能力（保留）
  ├── 幻觉门控 Hallucination Gate
  ├── 子 Agent 隔离 + 聚焦上下文
  ├── 闭环学习 Closed Learning Loop
  └── Ralph Loop 韧性循环
       +
云核专用改造（新增）
  ├── 感知 / 诊断 / 恢复 / 评估 / 优化 五 Agent 角色定义
  ├── 形式化验证层（DST / TLA+）
  ├── 5GC RAG 知识库（3GPP / SBI / PFCP）
  ├── SkillOpt 有界自进化（替换原生库式自进化）
  ├── OpenTelemetry 全链路可观测
  └── 人机协同三级模式（自动 / 建议 / 辅助）
```

**优势**：幻觉门控和子 Agent 隔离是已经实现的核心能力，不需要从零搭建。Hermes 的 Agent 运行时已经过 OpenRouter 大规模验证（2240 亿 token / 天）。

**风险**：Hermes 是通用 Agent 框架，其架构假设（如多平台通道适配、技能市场）与云核场景不完全匹配。Fork 后需要大量裁剪和替换核心模块（如用 SkillOpt 替换库式自进化），改造成本可能接近自研。

### 方案 B：自研，基于 LangGraph 编排 + ReACT 推理

**做法**：以 LangGraph 为编排底座，实现 ReACT（Reasoning-Acting-Observing）循环作为 Agent 推理机制，逐模块搭建云核专用 Agent 系统。

#### 4.1 ReACT 机制——是否够用？

ReACT（Yao et al., ICLR 2023）是当前最主流的 Agent 推理范式。核心循环是 `Thought → Action → Observation → Thought → ...`。它解决了"LLM 直接生成答案容易幻觉"的问题，通过**"先思考、再行动、观察结果、再思考"**的迭代循环提高准确性。

**ReACT 的优势**：
- 简单、透明、可审计——每一步推理过程可见
- 天然适配"感知→诊断→恢复→评估"的运维流程
- 与 LangGraph 的图编排完美契合——每个 ReACT 步骤是图中的一个节点

**ReACT 的局限**：
- 原生 ReACT**没有**幻觉门控——它提高了单 Agent 的推理质量，但不阻止 Agent 间错误传播
- 原生 ReACT**没有**自纠正——出错后依赖下一轮 Observation 自然修正，无显式纠正机制
- 原生 ReACT**没有**自进化——不会从历史经验中学习

**结论**：ReACT 是必要的推理机制，但**不充分**。需要在 ReACT 基础上叠加 Harness Engineering 的多层保障。

#### 4.2 方案 B 的具体技术栈

```
编排层：     LangGraph (DAG 图工作流，确定性路由)
推理机制：   ReACT (Thought → Action → Observation 循环)
安全层：     自研幻觉门控 (借鉴 Hermes) + DST 形式化验证 (借鉴 Datadog)
自进化层：   SkillOpt 有界编辑 + 验证门 (替换 Hermes 的库式自进化)
知识层：     5GC RAG 知识库 (3GPP 规范 / 故障案例 / SBI 接口)
可观测层：   OpenTelemetry + Langfuse
沙箱层：     Docker / gVisor 子 Agent 隔离
模型层：     可替换 (Claude / GPT / Qwen，按任务选型)
```

---

## 五、综合推荐

| 评估维度 | 方案 A: 基于 Hermes 修改 | 方案 B: LangGraph + ReACT 自研 |
|---------|------------------------|------------------------------|
| **初始开发量** | 中（已有 Agent 运行时） | 大（需搭建完整 Harness） |
| **架构适配度** | 中（需裁剪通用部分，替换核心模块） | 高（从第一天就为云核设计） |
| **核心技术获取** | 幻觉门控 / 子 Agent 隔离直接可用 | 需自研或移植 Hermes 的关键模块 |
| **长期维护** | 受上游 Hermes 版本影响 | 完全自主可控 |
| **电信级改造量** | 大（替换自进化、加形式化验证、加 RAG） | 大（但改造方向从第一天就明确） |
| **Harness 七阶段覆盖** | S4-S7 天然覆盖好，S1-S3 需改造 | 按需覆盖，无冗余 |

### 最终建议：方案 B——LangGraph + ReACT 自研，深度借鉴 Hermes 的架构设计

**理由**：

1. **云核高稳智能体的核心不是"Agent 运行时"，而是"Harness（管控系统）"**。Harness Engineering 六源共识明确：Harness = 模型之外的一切。核心工程投入应该在幻觉门控、形式化验证、自进化安全机制、5GC 知识库这些**云核专用层**，而不是在通用 Agent 框架的适配和裁剪上。

2. **Hermes 最有价值的不是代码，而是架构理念**。幻觉门控的思路（在 Agent 输出传播前设置验证检查点）、子 Agent 隔离（独立沙箱 + 聚焦上下文窗口）、闭环学习（执行→反思→技能→复用）——这些都可以在 LangGraph 的图编排中重新实现，且可以更好地与云核场景融合。

3. **LangGraph 的图编排天然适配"感知→诊断→恢复→评估→优化"五阶段流程**。每个阶段是图中的一个子图，阶段间通过边连接，每条边上可以插入幻觉门控。ReACT 在每个阶段内部驱动推理循环。这种架构既清晰又灵活。

4. **自研不等于从零开始**。技术栈中的每个组件都有成熟的参考实现：
   - 幻觉门控：借鉴 Hermes 架构 + deepset 四类失败分类
   - 形式化验证：Datadog DST / TLA+ 金字塔
   - 自进化：SkillOpt 有界编辑 + 验证门
   - 拦截执行：Firecrawl Interception Loop
   - 持久化：Firecrawl 三层记忆模型

---

## 六、建议架构总览

```
┌─────────────────────────────────────────────────────────────┐
│              云核高稳智能体 (LangGraph + ReACT)               │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────┐ │
│  │感知Agent │→│诊断Agent │→│恢复Agent │→│评估Agent │→│优化│ │
│  │(ReACT)   │ │(ReACT)   │ │(ReACT)   │ │(ReACT)   │ │    │ │
│  │只读      │ │只读      │ │读写(唯一)│ │只读      │ │    │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────┘ │
│       ↕            ↕            ↕            ↕         ↕    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  幻觉门控层（借鉴 Hermes，在每条 Agent 间边上设检查点）│   │
│  └──────────────────────────────────────────────────────┘   │
│       ↕            ↕            ↕            ↕         ↕    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Harness 管控层（Harness Engineering 七阶段方法论）    │   │
│  │  ├── 拦截循环 (Execution Interception)                │   │
│  │  ├── DST 形式化验证 (Datadog 验证金字塔)               │   │
│  │  ├── 四类失败自纠正 (deepset 分类法)                    │   │
│  │  └── 三层记忆持久化 (Firecrawl 模型)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│       ↕            ↕            ↕            ↕         ↕    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  自进化层（SkillOpt 有界编辑 + 验证门）                 │   │
│  │  + 5GC RAG 知识库 (3GPP / 故障案例 / SBI / PFCP / NGAP)│   │
│  │  + 人机协同三级模式                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Harness 七阶段映射

| 阶段 | 机制 | 参考来源 | 云核实现 |
|------|------|---------|---------|
| **S1 初始化** | 权限清单 + Docker 沙箱 | AIQuinta 部署清单 | 按 NF 角色定义 Agent 权限白名单 |
| **S2 前馈引导** | AGENTS.md + RAG + Progressive Disclosure | Fowler Guide/Sensor | 5GC RAG 知识库 + 3GPP 规范检索 |
| **S3 拦截执行** | Interception Loop + ConfirmationStrategy | Firecrawl + deepset | 所有网络操作经拦截 → 验证 → 沙箱预演 → 确认 → 执行 |
| **S4 自纠正** | 幻觉门控 + Ralph Loop + 四类失败分类 | Hermes + deepset + OpenAI | 每个 Agent 输出经门控验证后才传播 |
| **S5 验证门控** | DST + TLA+ + LLM-as-Judge | Datadog 验证金字塔 | 形式化不变量 + 数字孪生预演 |
| **S6 状态持久** | 三层记忆 + 结构化进度 | Firecrawl | 故障案例库 + 运维经验向量存储 |
| **S7 持续演进** | SkillOpt 有界编辑 + 验证门 | SkillOpt | 每次运维后优化策略，验证门保证不退化 |

### 人机协同三级模式

| 置信度 | 典型场景 | Agent 行为 |
|--------|---------|-----------|
| **高置信度** | NF 实例重启、日志轮转 | 自动执行，事后通知 |
| **中等置信度** | 跨 NF 迁移、SMF 重定向 | 生成修复建议，人工确认后执行 |
| **低置信度** | 切片级故障、全网影响操作 | 人工决策，AI 辅助提供上下文 |

---

## 七、分阶段实施路线

| 阶段 | 周期 | 目标 | 交付物 |
|------|------|------|--------|
| **P0 骨架搭建** | 0-3 月 | LangGraph 五 Agent 图编排 + ReACT 循环 + 幻觉门控 + 5GC RAG | 可运行的 Agent 骨架 |
| **P1 仿真验证** | 3-6 月 | 对接 free5GC / Open5GS 仿真环境，适配 SBI/PFCP/NGAP 场景 | AIOpsLab 式评估基准 |
| **P2 安全加固** | 6-12 月 | DST 形式化验证 + SkillOpt 闭环学习 + 人机协同三级模式 | 生产级安全机制 |
| **P3 持续演进** | 12-18 月 | 自进化能力上线 + 全链路可观测 + 跨版本策略迁移 | 持续优化的运维智能体 |

---

## 八、关键参考来源

### 框架与工具

- [LangGraph: Agent Orchestration Framework](https://www.langchain.com/langgraph) — 图编排底座
- [Hermes Agent (NousResearch)](https://github.com/nousresearch/hermes-agent) — 幻觉门控 + 闭环学习架构参考
- [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) — 工具优先 Agent 范式

### Harness Engineering 六源权威

- [deepset: Harness Engineering](https://www.deepset.ai/blog/harness-engineering) — 四类失败分类法
- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — Guide/Sensor 两轴分类
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/) — Ralph Wiggum Loop
- [Datadog: Harness-First Agents](https://www.datadoghq.com/blog/ai/harness-first-agents/) — 五层验证金字塔
- [Firecrawl: What is an Agent Harness](https://www.firecrawl.dev/blog/what-is-an-agent-harness) — 拦截循环 + 三层记忆
- [AIQuinta: Agent Harness 5 Pillars](https://aiquinta.ai/blog/agent-harness-5-core-pillars-and-how-to-build/) — 部署清单

### 学术论文

- [ReACT] Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models," ICLR 2023. arXiv:2210.03629
- [SkillOpt] Yang et al., "SkillOpt: Executive Strategy for Self-Evolving Agent Skills," arXiv:2605.23904, 2026
- [DSPy] Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines," ICLR 2024
- [Reflexion] Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning," NeurIPS 2023
- [GEPA] Agrawal et al., "GEPA: Reflective Prompt Evolution Can Outperform RL," arXiv:2507.19457, 2025

### 本仓库相关文档

- `output/ai_tech_insight_2026h1/harness_engineering_deep_dive.md` — Harness 七阶段 OpenClaw vs Hermes 对勘
- `output/ai_tech_insight_2026h1/harness_framework_hermes.md` — Hermes Agent 深度分析
- `output/ai_tech_insight_2026h1/harness_framework_openclaw.md` — OpenClaw 深度分析
- `output/ai_tech_insight_2026h1/harness_framework_mapping.md` — 八大框架交叉映射
- `output/ai_tech_insight_2026h1/ai_trend_vs_ccn_agent.md` — AI 技术趋势与云核智能体启示
- `output/track3_deep_dive_hermes_agent_vs_skillopt.md` — Hermes vs SkillOpt 对比分析
- `output/track3_ai_for_reliability.md` — AI for 可靠性全景调研
