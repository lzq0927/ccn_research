# Agent驱动的微损故障感知：技术演进与业界洞察

> 调研时间：2026年6月
> 定位：作为《微损故障感知业界洞察研究报告》的深度拓展篇，聚焦Agent技术如何驱动故障感知从"规则辅助"到"自主自治"的跨越
> 技术路径：小模型 → LLM辅助 → Agent自治

---

## 目录

1. [技术演进总览：从规则到自治](#一技术演进总览从规则到自治)
2. [四阶段技术路径详解](#二四阶段技术路径详解)
3. [关键Agent架构模式](#三关键agent架构模式)
4. [NVIDIA电信推理模型：Telco Reasoning Model](#四nvidia电信推理模型telco-reasoning-model)
5. [AN Agent参考架构（Sifakis/亚信/清华）](#五an-agent参考架构sifakis亚信清华)
6. [TM Forum Agent Catalyst项目全景](#六tm-forum-agent-catalyst项目全景)
7. [多Agent协同故障管理体系](#七多agent协同故障管理体系)
8. [全球厂商Agent技术实践全景](#八全球厂商agent技术实践全景)
9. [全球运营商Agent商用部署](#九全球运营商agent商用部署)
10. [标准化与行业倡议](#十标准化与行业倡议)
11. [Agent Skill/Tool框架设计](#十一agent-skilltool框架设计)
12. [对核心网微损故障感知的应用框架建议](#十二对核心网微损故障感知的应用框架建议)
13. [全部参考来源](#十三全部参考来源)

---

## 一、技术演进总览：从规则到自治

### 1.1 电信网络自治等级与Agent技术的映射

TM Forum定义的自治网络六层模型（L0-L5），正经历Agent技术的深刻重塑：

| AN等级 | 名称 | 传统实现方式 | Agent时代实现方式 | 代表实践 |
|--------|------|-------------|------------------|---------|
| **L0** | 手动运维 | 人工监控、手动排障 | — | 传统NMS |
| **L1** | 辅助运维 | 脚本化告警、预定义报表 | LLM Copilot辅助分析 | 知识库问答 |
| **L2** | 部分自动化 | 规则引擎、静态阈值告警 | 小模型（LSTM/RF）异常检测 | 华为动态阈值 |
| **L3** | 条件自治 | ML预测、自动化工作流 | LLM辅助RCA + 人工确认 | NVIDIA NOC Agent |
| **L4** | 高度自治 | — | **多Agent自主决策闭环** | TM Forum Catalyst、华为ICNMaster |
| **L5** | 完全自治 | — | 自进化Agent集群 | 6G原生AI目标 |

**关键判断**：当前业界正处于 **L3→L4 的跨越期**，Agent技术是实现这一跨越的核心使能器。

### 1.2 为什么是Agent？为什么是现在？

三个因素推动Agent技术成为网络自治的关键拐点：

1. **LLM推理能力突破**：2024-2025年推理模型（o1/o3、DeepSeek-R1、Qwen3）具备多步规划和工具调用能力，使Agent不再是概念而是工程现实
2. **工具使用范式成熟**：Function Calling、MCP（Model Context Protocol）等标准化协议，让Agent能安全地操作网络设备和管理系统
3. **电信场景数据积累**：多年运维数据（告警、KPI、信令、拓扑）构成训练推理模型的知识基础

来源：
- [TM Forum AN Levels](https://www.tmforum.org/autonomous-networks/)
- [NVIDIA State of AI in Telecom Report](https://developer.nvidia.com/blog/building-telco-reasoning-models-for-autonomous-networks-with-nvidia-nemo/)

---

## 二、四阶段技术路径详解

### 阶段一：规则引擎 + 小模型辅助（L0-L2）

**能力特征**：
- 基于预定义规则的告警过滤和关联
- 静态阈值监控
- 小模型（LSTM、Random Forest、Isolation Forest）做时序异常检测
- 人工定义的故障处理Runbook

**微损故障感知能力**：
- 仅能检测**已知模式**的异常（预定义阈值/规则）
- 对新型微损故障基本无感知能力
- 误报率高（静态阈值不适应网络动态变化）

**代表技术**：
| 技术 | 应用 | 局限 |
|------|------|------|
| LSTM-AE | 核心网元级KPI异常检测 | 仅时序维度，无跨域关联 |
| Isolation Forest | 多维指标异常检测 | 无语义理解，误报高 |
| 规则引擎 | 告警关联/抑制 | 规则维护成本高，无法适应新场景 |

**代表厂商**：传统NMS/EMS系统

---

### 阶段二：LLM辅助分析（L2-L3）

**能力特征**：
- LLM作为**Copilot**辅助人类运维工程师
- 日志分析、告警解释、根因建议
- RAG（检索增强生成）查询知识库和历史案例
- 人工确认后执行操作

**微损故障感知能力**：
- LLM能理解告警语义，发现人工容易忽略的关联
- 通过RAG检索历史案例，识别类似微损模式
- 但**无法自主感知和决策**，仍依赖人工触发

**代表实践**：
- **AWS Bedrock RCA**：LLM辅助根因分析
- **华为多模态运维大模型**：信令/时序/拓扑多模态融合，辅助故障诊断
- **BiAn（SIGCOMM'25）**：LLM辅助云网络故障定位（阿里云 + 南京大学）

**关键局限**：Copilot模式，人仍在闭环中，响应速度受限

---

### 阶段三：LLM Agent自主执行（L3-L4）

**能力特征**：
- Agent具备**自主规划、工具调用、反馈迭代**能力
- ReAct（Reasoning + Acting）模式：思考→行动→观察→再思考
- 多工具编排：调用拓扑查询、KPI分析、日志检索、配置修改等工具
- 自主完成从感知到诊断到恢复的全闭环

**微损故障感知能力**：
- Agent能**主动发起**多维度检测（不依赖预定义规则）
- 通过工具组合实现**差异可观测性检测**（如同时从服务端和客户端视角探测）
- 具备**异常归因**能力：能解释为什么某指标虽在阈值内但实际已异常

**代表实践**：

#### NVIDIA Telco Reasoning Model + NOC Agent（2026.03发布）
- 基于Qwen3-32B微调的电信推理模型
- ReAct风格Agent，可调用10+种NOC工具
- 从告警确认→状态检查→远程操作→恢复验证→工单关闭全自主
- 准确率从基线20%提升至60%
- Tech Mahindra合作，目标TM Forum L4级自治

来源：[NVIDIA NeMo Telco Reasoning Model](https://developer.nvidia.com/blog/building-telco-reasoning-models-for-autonomous-networks-with-nvidia-nemo/)

#### AWS Agentic AI for RAN Optimization
- Root Cause Explainer Agent：对识别的问题深入分析，每个问题类别分析多达20个子原因
- 目标：AN Level 5全自治

来源：[AWS Agentic AI for RAN](https://aws.amazon.com/blogs/industries/agentic-ai-for-ran-optimization-pathway-to-autonomous-network-level-5/)

---

### 阶段四：多Agent自主协同（L4-L5）

**能力特征**：
- 多个专业化Agent协同工作
- 感知Agent、诊断Agent、决策Agent、执行Agent各司其职
- Agent间通过标准化协议通信
- 自进化：Agent从执行结果中学习和优化策略

**微损故障感知能力**：
- 感知Agent专门负责微损检测，具备独立的目标函数
- 诊断Agent跨域关联分析，识别人类难以发现的隐蔽关联
- 决策Agent基于全局信息做出风险可控的干预决策
- 执行Agent实施最小影响面的操作验证

**代表实践**：

#### 华为ICNMaster多智能体系统
- AssurSpirit（告警处置智能体）+ CompSpirit（投诉处理智能体）
- MoM混合模型：快思考（实时告警）+ 慢思考（深度根因推理）
- 浙江移动：投诉处置效率提升64%

#### TM Forum BIND Catalyst
- 数字孪生 + Agentic AI
- 多个Agent协同实现网络韧性自治
- 目标：L4+自治等级

来源：
- [TM Forum BIND Catalyst](https://www.tmforum.org/catalysts/projects/C25.0.775/bind-bridging-intelligence-networks-and-digital-twin)
- [TM Forum Agentic Network Resilience](https://www.tmforum.org/catalysts/projects/C26.0.916/agentic-network-resilience-and-lead-to-quote-using-aidriven-digital-twin)

---

### 四阶段演进对比总结

| 维度 | 阶段一：规则+小模型 | 阶段二：LLM辅助 | 阶段三：Agent自主 | 阶段四：多Agent协同 |
|------|-------------------|----------------|-------------------|-------------------|
| **核心引擎** | 规则引擎/统计模型 | LLM + RAG | 推理模型 + Tool-use | 多智能体 + MCP |
| **感知方式** | 静态阈值告警 | LLM分析日志/告警 | Agent主动探测+多工具关联 | 专业化感知Agent持续监测 |
| **决策模式** | 预定义Runbook | LLM建议+人工确认 | Agent自主规划+执行 | Agent协商+集体决策 |
| **微损检测** | 基本无能力 | 可发现已知模式 | 主动发现新型微损 | 持续学习+预测性发现 |
| **响应速度** | 分钟级（告警触发） | 小时级（人工介入） | 秒级（自动闭环） | 毫秒-秒级（专业化Agent） |
| **AN等级** | L0-L2 | L2-L3 | L3-L4 | L4-L5 |

---

## 三、关键Agent架构模式

### 3.1 ReAct（Reasoning + Acting）

**核心思想**：Agent交替进行**推理（思考）**和**行动（工具调用）**，形成闭环。

```
思考：当前KPI异常，可能是用户面故障
→ 行动：调用工具查询UPF状态
→ 观察：UPF实例1延迟升高15%，但健康检查通过
→ 思考：这是典型的灰色故障，需检查客户端视角
→ 行动：调用工具执行端到端探测
→ 观察：探测显示5%的请求延迟超标
→ 思考：确认微损故障，影响面小但需干预
→ 行动：执行流量切换，将受损实例隔离
```

**对微损故障感知的价值**：
- ReAct模式天然适合处理**不确定性高**的微损场景
- Agent可以灵活组合工具，不受预定义流程限制
- 通过迭代观察，逐步缩小故障范围

**业界应用**：
- **NVIDIA NOC Agent**：ReAct风格，多工具协调处理电信告警
- **IBM Watson AIOps**：ReAct用于IT运维——检查日志、假设根因、运行诊断工具、执行修复
- **Itential Agentic Operations**：AI Agent推理 + 确定性编排

来源：
- [IBM: What is a ReAct Agent](https://www.ibm.com/think/topics/react-agent)
- [Itential: Agentic Operations for Infrastructure](https://www.itential.com/resource/guide/agentic-operations-for-infrastructure/)
- [Production-Ready AI Agents: 8 Patterns](https://pub.towardsai.net/production-ready-ai-agents-8-patterns-that-actually-work-with-real-examples-from-bank-of-america-12b7af5a9542)

### 3.2 Plan-and-Execute

**核心思想**：先将复杂任务分解为执行计划，再逐步执行并动态调整。

```
Plan:
  1. 收集异常时段全维度数据
  2. 关联分析KPI/告警/信令/拓扑
  3. 生成根因假设列表
  4. 逐个验证假设
  5. 确认根因并生成恢复方案
  6. 执行恢复并验证

Execute: 按计划逐步执行，根据中间结果动态调整计划
```

**对微损故障感知的价值**：
- 微损故障根因复杂，需要系统性的多步分析
- 计划可被人工审核后再执行（L3阶段的安全措施）

### 3.3 Reflexion（自我反思）

**核心思想**：Agent执行完任务后，对结果进行自我评估和反思，优化后续策略。

```
执行恢复 → 观察恢复效果 → 反思：恢复效果不理想
→ 分析原因：只恢复了控制面，用户面仍有残留问题
→ 修改策略：增加用户面探测验证步骤
→ 重新执行
```

**对微损故障感知的价值**：
- 微损故障恢复后可能复发，需要持续验证
- Agent从每次故障处理中学习，积累经验

### 3.4 MCP（Model Context Protocol）

**核心思想**：为AI模型和外部数据源/工具建立**统一的标准化通信接口**。

类比：**AI的USB接口**——Agent可以即插即用地连接网络设备、监控系统、配置管理系统等。

```
Agent → MCP Server → 网络设备API
                 → 监控系统（KPI/告警）
                 → 信令分析系统
                 → 配置管理系统
                 → 数字孪生引擎
```

**中兴通讯**已明确在核心网运维智能体中采用MCP协议，实现AI工具的即插即用。

来源：[中兴核心网运维智能体](https://www.zte.com.cn/content/zte-site/www-zte-com-cn/china/about/magazine/zte-technologies/2025/6/3/11.html)

### 3.5 MoM（Mixture of Models）混合模型架构

**华为创新**：将"快思考"与"慢思考"大模型进行混合。

```
              ┌─────────────────────┐
              │   任务路由器          │
              │ (智能分流)            │
              └───────┬─────┬───────┘
                      │     │
           ┌──────────┘     └──────────┐
           ▼                           ▼
  ┌─────────────────┐      ┌─────────────────┐
  │  快思考模型       │      │  慢思考模型       │
  │  (实时告警处理)   │      │  (深度根因推理)   │
  │  低延迟、高吞吐   │      │  高精度、可解释   │
  └─────────────────┘      └─────────────────┘
```

- 快思考模型：处理高频、实时性要求高的场景（如KPI异常实时检测、告警实时分类）
- 慢思考模型：处理复杂、需要深度推理的场景（如跨域故障根因分析、投诉根因挖掘）
- 2025年3月上海移动联合华为发布基于DeepSeek的核心网MoM运维智能体

来源：[上海移动联合华为DeepSeek试点](https://m.c114.com.cn/w126-1286544.html)

---

## 四、NVIDIA电信推理模型：Telco Reasoning Model

### 4.1 概述

2026年3月，NVIDIA联合Tech Mahindra发布了业界首个**电信专用推理模型训练流水线**，基于NVIDIA NeMo平台，目标是将NOC（网络运营中心）从人工驱动推进到**Agent驱动的自治网络**。

**核心理念**：不只是让LLM"理解"电信网络，而是训练它**像NOC工程师一样推理和操作**。

来源：[NVIDIA NeMo Telco Reasoning Model Blog](https://developer.nvidia.com/blog/building-telco-reasoning-models-for-autonomous-networks-with-nvidia-nemo/)

### 4.2 三阶段训练流水线

```
阶段1: 合成数据生成          阶段2: 推理链构建           阶段3: SFT微调 + 评估
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 历史故障案例       │    │ 专家操作流程       │    │ Qwen3-32B基座模型 │
│ +                 │ →  │ → 动作序列         │ →  │ + 课程学习        │
│ Teacher模型生成    │    │ → 逐步推理链       │    │ + 多轮工具调用     │
│ 合成故障场景       │    │ → 压缩优化         │    │ → 电信推理模型     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

#### 步骤1：生成结构化动作序列

使用Teacher模型（大型LLM），基于故障字段和操作指南模板，为每个故障生成标准化的动作序列。每个步骤记录：动作、参数、工具调用、即时结果。

#### 步骤2：附加逐步推理

第二步为每个动作附加**推理文本**：为什么执行这一步？使用了什么信号？如何影响下一步决策？

通过**压缩（Squashing）**阶段合并相关步骤，保留关键决策点，使序列更适合训练。

#### 步骤3：格式化为多轮工具调用格式

将推理链转换为Qwen兼容的多轮对话格式，模拟Agent交替进行推理、工具调用、解读工具响应的真实交互。

### 4.3 Agent可调用的NOC工具集

NVIDIA定义了完整的NOC Agent工具集：

| 工具类别 | 具体工具 |
|---------|---------|
| **告警管理** | 确认告警、跟踪告警状态、检查告警是否自动清除 |
| **状态检查** | 检查站点/设备状态、查询拓扑/电力/光纤 |
| **远程操作** | 设备复位、解锁、启用 |
| **监控验证** | 监控自动恢复、告警清除检查 |
| **配置修复** | 应用配置修改 |
| **持续告警处理** | 调查持续/反复告警 |
| **文档管理** | 记录操作和状态更新 |
| **现场协调** | 协调现场派遣或硬件更换 |
| **最终验证** | 确认站点健康并关闭工单 |

### 4.4 技术效果

| 指标 | 基线（Qwen3-32B原始） | 微调后 |
|------|---------------------|--------|
| **故障摘要准确率** | ~20% | **~60%** |
| **工具调用可靠性** | 低 | 课程学习显著提升 |
| **多步推理能力** | 弱 | 支持多轮工具调用 |

### 4.5 对核心网微损故障感知的启示

1. **推理链训练**是关键：不只是训练模型识别异常，而是训练它**像专家一样逐步推理**
2. **工具调用**是Agent区别于Copilot的核心：Agent能主动调用工具获取信息，而非被动接收
3. **合成数据**解决电信场景数据稀缺问题：通过Teacher模型生成真实感的故障场景
4. **课程学习**策略：从简单单步故障到复杂多步故障，循序渐进

---

## 五、AN Agent参考架构（Sifakis/亚信/清华）

### 5.1 论文背景

2025年，图灵奖得主**Joseph Sifakis**联合亚信科技、清华大学发表的重要论文——"Leveraging AI Agents for Autonomous Networks: A Reference Architecture and Empirical Studies"（[arXiv:2509.08312](https://arxiv.org/html/2509.08312v1)）。

这是**业界首个完整实现**的AN Agent参考架构，并通过RAN链路自适应Agent的实测验证。

### 5.2 核心架构：双驱动运行时

```
                    ┌──────────────────────────┐
                    │   工作流协调运行时          │
                    │ (Workflow Coordinator)    │
                    └────────┬────────┬────────┘
                             │        │
              ┌──────────────┘        └──────────────┐
              ▼                                      ▼
  ┌───────────────────────┐          ┌───────────────────────┐
  │  反应式行为运行时       │          │  主动式行为运行时       │
  │  (Reactive Runtime)   │          │  (Proactive Runtime)  │
  │                       │          │                       │
  │  快速响应外部事件       │          │  持续自监控+主动优化    │
  │  Kahneman System 1    │          │  Kahneman System 2    │
  └───────────┬───────────┘          └───────────┬───────────┘
              │                                  │
              └──────────────┬───────────────────┘
                             ▼
              ┌───────────────────────┐
              │    长期记忆 (LTM)      │
              │  图数据库(Neo4j) +     │
              │  向量数据库(FAISS)     │
              └───────────────────────┘
```

#### 反应式行为运行时（System 1 —— 快思考）

处理时间敏感的环境事件响应：

```
感知 → 语义丰富化 → 知识检索 → 预测建模 → 目标生成 → 约束规划 → 动作验证 → 执行
```

特点：
- **亚10ms级响应**：满足5G NR实时控制要求
- 基于LSTM的趋势预测
- 基于规则的约束满足

#### 主动式行为运行时（System 2 —— 慢思考）

处理主动优化和长期策略：

```
持续自监控 → 偏差检测 → 意图生成 → 元目标合成 → 可行性评估 → 技术目标转化 → 成本效益分析 → 管理与规划
```

特点：
- 基于LLM的意图理解和元目标生成
- 基于深度强化学习（DQN）的多目标权衡
- 基于蒙特卡洛树搜索（MCTS）的规划

### 5.3 关键功能模块

| 模块 | 技术 | 功能 |
|------|------|------|
| **长期记忆** | Neo4j（图数据库）+ FAISS（向量数据库） | 结构化知识（3GPP标准、实体关系）+ 动态操作嵌入 |
| **态势感知** | LSTM + Kalman滤波 + 滑动窗口 | 多模态时序数据处理、趋势预测 |
| **自知** | Few-shot LLM + 知识检索 | 意图生成、元目标合成 |
| **选择** | MLP + DRL | 候选目标概率排序 + 多目标优化 |
| **决策** | LLM + 规则引擎 + MCTS | 语义冲突消解 + 协议合规 + 随机规划 |

### 5.4 实测效果：RAN链路自适应Agent

| 指标 | 传统OLLA算法 | AN Agent | 提升 |
|------|-------------|----------|------|
| **下行吞吐量** | 476 Mbps | **504 Mbps** | +6% |
| **误块率（BLER）** | 0.7% | **0.2%** | -67% |
| **决策延迟** | 数十TB周期 | **<10ms** | 数量级提升 |

**关键验证**：Agent实现了亚10ms的实时闭环控制，满足5G NR sub-6GHz的严格时延要求。

### 5.5 对微损故障感知的启示

1. **双运行时架构**是微损故障感知的理想框架：
   - 反应式运行时：快速检测和响应微损事件（秒级）
   - 主动式运行时：持续分析隐患趋势、优化检测策略
2. **知识融合**（图数据库+向量数据库）是实现跨域关联分析的基础
3. **混合决策**（LLM推理 + DRL优化 + 规则约束）兼顾灵活性和安全性

---

## 六、TM Forum Agent Catalyst项目全景

### 6.1 概述

2025年TM Forum DTW Ignite大会展示了**5个月射（Moonshot）级Catalyst项目**，全部聚焦于用Agentic AI实现L4级自治网络。

来源：[TM Forum LinkedIn DTW Ignite](https://www.linkedin.com/posts/tm-forum_5-catalysts-are-addressing-the-an-level-4-activity-7325867292909592577-VcfF)

### 6.2 关键Catalyst项目

#### BIND — Bridging Intelligence, Networks, and Digital Twin (C25.0.775)

- **目标**：数字孪生 + Agentic AI → L4+自治网络
- **核心**：组合数据管理、AI和电信专业知识
- **关键能力**：预测性、意图驱动的网络管理

来源：[TM Forum BIND](https://www.tmforum.org/catalysts/projects/C25.0.775/bind-bridging-intelligence-networks-and-digital-twin)

#### Agentic Network Resilience and Lead-to-Quote (C26.0.916)

- **目标**：活的**认知网络孪生（Cognitive Network Twin）**+ Agentic AI
- **核心**：驱动自治网络韧性
- **关键能力**：利用实时、完整、准确的网络数据

来源：[TM Forum Agentic Network Resilience](https://www.tmforum.org/catalysts/projects/C26.0.916/agentic-network-resilience-and-lead-to-quote-using-aidriven-digital-twin)

#### Agentic AI for Customer-Centric O&M (M25.5.868)

- **目标**：通过AI Agent和数字孪生实现**AN Level 4自治**
- **核心**：主动的、以用户为中心的自动化运维
- **关键能力**：提升客户体验和运维效率

来源：[TM Forum Agentic AI O&M](https://www.tmforum.org/catalysts/projects/M25.5.868/agentic-ai-for-customercentric-om)

#### AI Agent Empowering Higher Autonomous Level (C24.0.672)

- **目标**：LLM-based AI Agent + 网络数字孪生
- **核心**：Agent自主执行复杂任务
- **关键能力**：融合现有系统洞察，自主执行

来源：[TM Forum AI Agent](https://www.tmforum.org/catalysts/projects/C24.0.672/ai-agent-empowering-higher-autonomous-level)

#### How Multi-Agent AI is Transforming Network Fault Repair

- **核心发现**：多Agent层协调整个过程——Agent间**报告故障、交换诊断结果、分工协作**
- **关键洞察**：编排（Orchestration）是多Agent系统成功的关键

来源：[TM Forum Multi-Agent Fault Repair](https://inform.tmforum.org/research-and-analysis/proofs-of-concept/how-multi-agent-ai-is-transforming-network-fault-repair)

### 6.3 TM Forum Agent技术趋势总结

| 趋势 | 说明 |
|------|------|
| **数字孪生 + Agent** | 几乎所有Catalyst都将数字孪生作为Agent的"虚拟环境" |
| **意图驱动** | 从"怎么做"到"要什么"，Agent自主确定执行路径 |
| **L4为当前目标** | 所有项目瞄准L4，部分（如BIND）探索L4+ |
| **标准化协作** | Agent间通过TM Forum标准接口互操作 |

---

## 七、多Agent协同故障管理体系

### 7.1 多Agent协同架构

```
                    ┌──────────────────────────────┐
                    │     编排协调层 (Orchestrator)   │
                    │  任务分解 | 冲突消解 | 优先级调度 │
                    └───────┬──────┬──────┬─────────┘
                            │      │      │
         ┌──────────────────┤      │      ├──────────────────┐
         ▼                  ▼      ▼      ▼                  ▼
  ┌──────────────┐  ┌──────────┐ ┌──────────┐  ┌──────────────┐
  │ 感知Agent     │  │ 诊断Agent │ │ 决策Agent │  │ 执行Agent     │
  │              │  │          │ │          │  │              │
  │ KPI监控      │  │ 根因分析  │ │ 恢复方案  │  │ 配置修改      │
  │ 异常检测      │  │ 跨域关联  │ │ 风险评估  │  │ 流量切换      │
  │ 主动探测      │  │ 历史案例  │ │ 优先排序  │  │ 告警抑制      │
  │ 用户面探针    │  │ 知识图谱  │ │ SLO预算  │  │ 恢复验证      │
  └──────────────┘  └──────────┘ └──────────┘  └──────────────┘
         │                  │      │      │                  │
         └──────────────────┤      │      ├──────────────────┘
                            ▼      ▼      ▼
                    ┌──────────────────────────────┐
                    │     共享知识层 (Knowledge)      │
                    │  知识图谱 | 向量数据库 | 案例库   │
                    └──────────────────────────────┘
```

### 7.2 多Agent协同模式

| 模式 | 描述 | 适用场景 |
|------|------|---------|
| **流水线协作** | Agent按感知→诊断→决策→执行顺序传递 | 标准故障处理流程 |
| **并行协作** | 多个Agent同时从不同维度分析 | 微损故障的多角度感知 |
| **层级协作** | 编排Agent分配任务，专业Agent执行 | 复杂故障处理 |
| **协商协作** | Agent间通过协商达成一致决策 | 多目标冲突场景 |

### 7.3 关键挑战与解法

| 挑战 | 解法 | 业界参考 |
|------|------|---------|
| **Agent间通信开销** | MCP标准化协议 | 中兴 |
| **决策冲突** | 编排层冲突消解 + 优先级调度 | TM Forum |
| **错误放大** | 确定性护栏 + 人工审核点（L3） | Kore.ai研究：编排不当会放大17倍错误 |
| **一致性保证** | 共享知识层 + 事务性操作 | 华为 |
| **可解释性** | 推理链记录 + LLM解释生成 | NVIDIA |

来源：
- [Kore.ai: Multi-Agent Systems Fault Line](https://kore.ai/blog/multi-agent-systems-fault-line)
- [Multi-Agent Orchestration for Intent-Based Network Operations](https://computerfraudsecurity.com/index.php/journal/article/view/1001)
- [Multi-Agent RL for Cooperative Fault Diagnosis](http://clausiuspress.com/assets/default/article/2025/07/08/article_1751963113.pdf)

---

## 八、全球厂商Agent技术实践全景

### 8.1 华为：从iMaster到ICNMaster的Agent演进

### 8.1 华为：从iMaster到ICNMaster的Agent演进

#### 架构演进

```
iMaster MAE-CN              ICNMaster (2024)
┌──────────────────┐        ┌──────────────────────────┐
│ 大数据分析        │        │ MoM混合模型架构            │
│ +                 │  →     │ + 多智能体协同              │
│ 智能决策          │        │ + 网络孪生技术              │
│ + 自动闭环控制    │        │ + 运维多模态大模型          │
└──────────────────┘        └──────────────────────────┘
```

#### 两大核心智能体

| 智能体 | 定位 | Agent能力 |
|--------|------|----------|
| **AssurSpirit** | 告警处置 | 实时分析→根因定位→处置流程自动执行 |
| **CompSpirit** | 投诉处理 | 意图理解→流程定界→分析处理闭环 |

#### 关键Agent技术

- **MoM快慢思考**：类似Sifakis架构的双运行时设计
- **多模态融合**：信令+时序+拓扑+告警+日志
- **RAG + 知识图谱**：Graph-RAG用于复杂查询和多跳推理
- **数字孪生1:1映射**：Agent的虚拟环境
- **MCP协议**：标准化Agent与网络设备的交互

#### 商用效果

- 浙江移动：投诉处置效率提升64%，相当于新增30+"数字员工"
- 山东移动：信令风暴预测预防系统（数字孪生+Agent），15分钟内恢复

### 8.2 中兴：AIR Core五层Agent架构

#### 核心网运维智能体架构（2025年6月发布）

```
┌─────────────────────────────────────────┐
│ Layer 5: 数字孪生体（业务模型+孪生应用）    │
├─────────────────────────────────────────┤
│ Layer 4: 应用层（智能编排多种运维能力）      │
├─────────────────────────────────────────┤
│ Layer 3: 模型层（大/小模型智能引擎）         │
├─────────────────────────────────────────┤
│ Layer 2: 数据层（高质量语料数据）            │
├─────────────────────────────────────────┤
│ Layer 1: 网络层（核心网原子网元）            │
└─────────────────────────────────────────┘
```

#### 五类专业化智能体

| 智能体 | 职责 | Agent技术 |
|--------|------|----------|
| **故障管理智能体** | 智能检测→诊断→自动恢复 | Graph-RAG + 多Agent协同 |
| **隐患管理智能体** | ML预测性分析网络潜在风险 | 时序异常检测 + 知识图谱 |
| **网络变更智能体** | 变更规划→执行→验证 | 数字孪生仿真 + 自动化编排 |
| **业务优化智能体** | 业务质量持续优化 | 闭环控制 + A/B测试 |
| **网络优化智能体** | 网络资源分配优化 | DRL + 多目标优化 |

#### 关键Agent技术

- **Graph-RAG**：知识图谱增强检索，解决复杂多跳推理
- **MCP协议**：AI工具即插即用
- **离散事件仿真**：数字孪生的底层仿真引擎
- **多Agent协同**：跨域1分钟内完成异常事件识别

#### 商用效果

- 河北试点：故障发现时长缩短50%，重大故障归零
- 星云通信大模型故障监控智能体：获AIIA优秀案例

---

### 8.6 Meta Confucius（SIGCOMM'25最佳论文）——生产级多Agent网络管理

- **业界验证最强的多Agent网络管理系统**：在Meta生产环境已运行**2年以上**
- 将网络管理任务建模为**DAG（有向无环图）工作流**，Agent按图编排
- 集成LLM与Meta现有管理工具，RAG增强长期记忆
- SIGCOMM 2025最佳论文奖

来源：[Confucius (ACM DL)](https://dl.acm.org/doi/10.1145/3718958.3750537)

### 8.7 Cisco AgenticOps——Deep Network Model

- 基于**Deep Network Model**（思科40余年网络经验微调的领域LLM）
- **Deep Network Troubleshooting**：Agentic AI + 深度研究方法，自主规划调查路径
- **AI Canvas**：全自动化监控/排障/运营框架
- 明确采用**MCP协议**

来源：[Cisco Deep Network Troubleshooting](https://blogs.cisco.com/sp/revolutionizing-network-troubleshooting-with-deep-research-ai-agents)

### 8.8 Nokia Autonomous Network Fabric

- 2025年6月发布，嵌入**Agentic AI能力**
- 与**Google Cloud**合作全球部署
- 结合**数字孪生、空间智能和AI Agent**
- **Telco LLM**：领域专用LLM解决通用LLM无法处理的电信特定问题

来源：[Nokia Agentic AI](https://www.nokia.com/blog/agentic-ai-powering-the-next-frontier-in-autonomous-operations/)

### 8.9 Ericsson Telco Agentic AI Studio

- 利用GenAI Agent自动化加速OSS/BSS AI应用开发
- **多Agent AI**变革电信产品配置和工作流自动化
- 2026年2月与**Mistral AI**合作开发网络运营AI Agent
- 发布《AI Agents and Network Architecture》白皮书

来源：[Ericsson AI Agents White Paper](https://www.ericsson.com/en/reports-and-papers/white-papers/ai-agents-and-network-architecture)

### 8.10 Microsoft NOA（Network Operations Agent）

- 面向电信运营商的**模块化、可扩展**自治网络框架
- Azure内部已使用AI Agent作为"数字协作者"
- 多Agent系统自动化**90%的事件调查和响应任务**

来源：[Microsoft NOA](https://techcommunity.microsoft.com/blog/telecommunications-industry-blog/introducing-microsoft%25E2%2580%2599s-network-operations-agent-%25E2%2580%2593-a-telco-framework-for-autonom/4471185)

### 8.11 IBM STRATUS（NeurIPS 2025）

- IBM Research的LLM驱动**多Agent SRE系统**
- 多个专业化Agent协作实现自主SRE
- 在AIOpsLab和ITBench两个SRE基准上**显著超越SOTA**

来源：[STRATUS (NeurIPS 2025)](https://neurips.cc/virtual/2025/poster/116834) | [PDF](https://yinfangchen.github.io/assets/pdf/stratus_paper.pdf)

### 8.12 Amdocs + AWS + NVIDIA——L4+自治运营

- Agentic AI + 数字孪生驱动自治网络运营
- AI Agent自主分析、仿真、推荐、实施网络变更
- 连续两年获**FutureNet World Network AI Award**

来源：[Amdocs Autonomous Network Ops](https://www.amdocs.com/products-services/aos/agentic-business-and-network-workflows/autonomous-network-operations)

---

## 九、全球运营商Agent商用部署

### 9.1 NTT DOCOMO——全球首个Agentic AI商用部署

2026年2月4日正式商用，**全球最早**的电信Agentic AI系统商用案例：

- 基于**AWS Amazon Bedrock AgentCore**构建
- 利用超过**100万台网络设备**的数据（全球最大规模之一）
- 编排多个AI Agent，利用图建模网络拓扑，实时分析流量和告警
- **复杂网络故障响应时间减少超过50%**

来源：[NTT DOCOMO Agentic AI商用](https://www.docomo.ne.jp/english/info/media_center/pr/2026/0225_01.html)

### 9.2 Deutsche Telekom（德国电信）——RAN Guardian Agent

与Google Cloud合作：

- **RAN Guardian Agent**：基于Google Gemini 2.0 / Vertex AI构建，持续实时分析RAN关键参数
- **MINDR多Agent系统**：跨所有技术层的主动诊断和问题解决
- 目标：实现自愈、自治网络的大规模部署

来源：[DT + Google Cloud](https://www.telekom.com/en/media/media-information/archive/deutsche-telekom-and-google-cloud-partner-on-agentic-ai-for-autonomous-networks-1088504)

### 9.3 BT（英国电信）——"Dark NOC"愿景

- 目标实现**L4自治网络**（TM Forum定义）
- 与AWS合作，整合AI/ML、GenAI和Agentic AI
- 被Appledore Research评为"全球电信现代化务实典范"

来源：[BT Case Study](https://www.zenml.io/llmops-database/autonomous-network-operations-using-agentic-ai)

### 9.4 AT&T——"Ask AT&T" GenAI工具

- 内部GenAI工具**"Ask AT&T"**：每日生成超过**20亿token**
- **Geo Modeler**：生成式AI系统，使用合成数据预测网络覆盖
- 与NVIDIA合作加速AI驱动的网络运营

来源：[AT&T Agentic AI](https://about.att.com/blogs/2025/agentic-ai.html)

---

## 十、标准化与行业倡议

### 10.1 TM Forum "L4 is ON"联合倡议

MWC Barcelona 2025，**华为、中兴、Cisco**等厂商联合启动"L4 is ON"倡议，推动L4自治网络首批商用部署。

### 10.2 NGMN Agentic AI五级采用模型

NGMN联盟发布《Cloud-Native Next Chapter -- Agentic AI-Based Operating Models》：

| 级别 | 描述 | 核心技术 |
|------|------|----------|
| Level 1 | 基础规则自动化 | 静态规则、脚本 |
| Level 2 | ML增强运维 | 异常检测、预测模型 |
| Level 3 | GenAI辅助运维 | LLM Copilot、知识问答 |
| Level 4 | Agentic AI驱动 | 多Agent协作、自主决策 |
| Level 5 | 全栈AI原生 | AI融入网络架构本身 |

来源：[NGMN Agentic AI](https://www.ngmn.org/publications/cloud-native-next-chapter-agentic-ai-based-operating-models.html)

### 10.3 IETF标准

- **draft-cui-nmrg-llm-nm-01**：LLM Agent辅助网络管理互操作框架
- **draft-zhao-nmop**：AI-based Network Management Agent标准

来源：[IETF LLM NM Draft](https://www.ietf.org/archive/id/draft-cui-nmrg-llm-nm-01.html)

---

## 十一、Agent Skill/Tool框架设计

### 9.1 核心概念

在Agent体系中，**Skill（技能）**是Agent可调用的原子化能力单元。类似于人类的职业技能，Agent通过组合不同的Skill来完成复杂任务。

```
Agent = LLM推理引擎 + Skills工具集 + Memory记忆系统

Skill = 工具定义 + 调用接口 + 输入/输出Schema + 安全约束
```

### 9.2 微损故障感知Agent的Skill框架

#### 感知类Skill

| Skill名称 | 功能 | 调用对象 | 响应时间 |
|-----------|------|---------|---------|
| `kpi_anomaly_detect` | KPI动态阈值异常检测 | 监控系统 | <1s |
| `signaling_analyze` | 信令流程异常检测 | 信令采集系统 | 1-5s |
| `end_to_end_probe` | 端到端探测（客户端视角） | 合成探针 | 1-10s |
| `user_experience_sample` | 用户体验采样分析 | QoE系统 | 5-30s |
| `topology_analyze` | 网络拓扑分析 | 拓扑管理系统 | 1-5s |
| `counter_exchange` | 网元计数器交换分析 | 网元管理系统 | <1s |

#### 诊断类Skill

| Skill名称 | 功能 | 调用对象 |
|-----------|------|---------|
| `root_cause_hypothesize` | 生成根因假设列表 | LLM推理 |
| `cross_domain_correlate` | 跨域关联分析 | 知识图谱 |
| `similar_case_retrieve` | 历史案例检索 | RAG系统 |
| `impact_scope_assess` | 影响范围评估 | 数字孪生 |
| `performance_rank` | 性能感知排序 | 推理模型 |

#### 决策类Skill

| Skill名称 | 功能 | 安全等级 |
|-----------|------|---------|
| `recovery_plan_generate` | 生成恢复方案 | 低风险 |
| `risk_assessment` | 风险评估 | 低风险 |
| `slo_budget_check` | SLO预算消耗检查 | 低风险 |
| `traffic_shift` | 流量切换 | 高风险（需审批） |
| `config_modify` | 配置修改 | 高风险（需审批） |

#### 验证类Skill

| Skill名称 | 功能 |
|-----------|------|
| `recovery_verify` | 恢复效果验证 |
| `regression_check` | 回归检查 |
| `user_impact_verify` | 用户影响确认 |

### 9.3 Skill编排示例：微损故障处理全流程

```
Agent收到微损告警信号:
  → kpi_anomaly_detect: 确认KPI异常（延迟上升12%，在阈值内）
  → end_to_end_probe: 从客户端视角探测，确认5%请求受影响
  → signaling_analyze: 分析信令，发现特定UPF实例处理异常
  → root_cause_hypothesize: 生成3个根因假设
  → cross_domain_correlate: 关联分析确认是UPF实例内存压力
  → similar_case_retrieve: 检索历史案例，找到3个相似案例
  → impact_scope_assess: 评估影响范围（约2000用户）
  → recovery_plan_generate: 生成恢复方案（流量切换+实例重启）
  → risk_assessment: 风险评估（低风险）
  → [人工审批]（L3阶段需要）
  → traffic_shift: 执行流量切换
  → recovery_verify: 验证恢复效果
  → regression_check: 回归检查
  → user_impact_verify: 确认用户影响消除
```

### 9.4 NVIDIA NeMo Skills Pipeline参考

NVIDIA的NeMo Skills流水线提供了构建Agent Skill的工程化方法：

1. **定义工具集**：将专家操作流程映射为可调用的工具
2. **生成推理链**：用Teacher模型生成工具调用的推理过程
3. **微调推理模型**：在推理链上微调基座模型
4. **评估与迭代**：评估工具调用准确率、推理质量、结论正确性

### 9.5 安全护栏设计

| 护栏类型 | 说明 | 实现方式 |
|---------|------|---------|
| **只读护栏** | 所有感知/诊断Skill只读，不修改网络 | 权限控制 |
| **审批护栏** | 高风险操作需人工审批 | 工作流引擎 |
| **速率护栏** | 限制操作频率，防止误操作风暴 | 限流器 |
| **范围护栏** | 限制操作影响范围 | 参数约束 |
| **回滚护栏** | 操作前保存快照，支持回滚 | 数字孪生 |

---

## 十二、对核心网微损故障感知的应用框架建议

### 10.1 推荐的Agent架构：双运行时 + 多Agent协同

结合Sifakis参考架构和华为/中兴实践，推荐以下架构：

```
┌──────────────────────────────────────────────────────────┐
│                    编排协调层                               │
│        任务分解 | 冲突消解 | 人机协同 | 审批流程             │
└────────────┬────────────────────────────┬────────────────┘
             │                            │
  ┌──────────▼──────────┐    ┌───────────▼──────────┐
  │  反应式Agent集群      │    │  主动式Agent集群       │
  │  (快思考/秒级响应)    │    │  (慢思考/分钟级分析)   │
  │                      │    │                      │
  │  ┌────────────────┐ │    │  ┌────────────────┐ │
  │  │ KPI监控Agent    │ │    │  │ 隐患分析Agent   │ │
  │  │ (动态阈值+ML)   │ │    │  │ (趋势预测+图谱)  │ │
  │  └────────────────┘ │    │  └────────────────┘ │
  │  ┌────────────────┐ │    │  ┌────────────────┐ │
  │  │ 信令分析Agent   │ │    │  │ 根因推理Agent   │ │
  │  │ (实时流分析)    │ │    │  │ (LLM+RAG推理)  │ │
  │  └────────────────┘ │    │  └────────────────┘ │
  │  ┌────────────────┐ │    │  ┌────────────────┐ │
  │  │ 探针Agent       │ │    │  │ 策略优化Agent   │ │
  │  │ (端到端探测)    │ │    │  │ (DRL+数字孪生)  │ │
  │  └────────────────┘ │    │  └────────────────┘ │
  └──────────┬──────────┘    └───────────┬──────────┘
             │                            │
             └────────────┬───────────────┘
                          ▼
           ┌──────────────────────────┐
           │    共享基础设施层          │
           │                          │
           │  知识图谱 + 向量数据库     │
           │  数字孪生引擎             │
           │  MCP协议接口              │
           │  安全护栏引擎             │
           └──────────────────────────┘
```

### 10.2 技术演进路线图

#### 近期（6-12个月）：L2-L3，LLM辅助阶段

| 目标 | 具体工作 |
|------|---------|
| 动态阈值部署 | 部署ML动态阈值替代静态阈值，减少误报 |
| LLM Copilot | 建设运维LLM Copilot，辅助告警分析和根因推荐 |
| RAG知识库 | 构建核心网运维知识库（案例+3GPP标准+设备手册） |
| 合成数据积累 | 开始积累故障案例数据，为推理模型训练做准备 |

#### 中期（12-24个月）：L3-L4，Agent自主阶段

| 目标 | 具体工作 |
|------|---------|
| 微损感知Agent | 建设专用的微损故障感知Agent（KPI+信令+探针融合） |
| Skill工具集 | 定义和实现Agent可调用的Skill工具集 |
| 推理模型微调 | 基于积累数据微调电信推理模型 |
| 数字孪生集成 | 将数字孪生作为Agent的虚拟环境 |
| 人机协同流程 | 建立Agent操作的人工审批和监控流程 |

#### 远期（24-36个月）：L4-L5，多Agent自治阶段

| 目标 | 具体工作 |
|------|---------|
| 多Agent协同 | 部署感知/诊断/决策/执行专业化Agent集群 |
| MoM混合模型 | 实现快思考+慢思考的双运行时架构 |
| 自进化能力 | Agent从执行结果中学习，持续优化策略 |
| 全面自治 | 微损故障从感知到恢复全自主闭环 |

### 10.3 关键技术选型建议

| 技术领域 | 推荐方案 | 理由 |
|---------|---------|------|
| **推理模型基座** | Qwen3-32B / DeepSeek-R1 | NVIDIA已验证Qwen3-32B在电信NOC场景有效性 |
| **Agent框架** | ReAct + Plan-and-Execute混合 | ReAct处理实时响应，Plan-and-Execute处理复杂故障 |
| **知识表示** | Neo4j（图）+ FAISS（向量） | Sifakis架构验证的双库方案 |
| **工具协议** | MCP（Model Context Protocol） | 业界标准化趋势，中兴已采用 |
| **实时感知** | LSTM + Kalman滤波 | Sifakis架构验证的时序处理方案 |
| **决策优化** | DRL + MCTS | 多目标优化 + 安全约束规划 |
| **数字孪生** | 离散事件仿真 | 中兴验证方案，适合核心网信令级仿真 |

---

## 十三、全部参考来源

### Agent架构与理论
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
- [IBM: What is a ReAct Agent](https://www.ibm.com/think/topics/react-agent)
- [AI Agent Systems: Architectures, Applications, and Evaluation (arXiv 2025)](https://arxiv.org/html/2601.01743v1)
- [MIT Sloan: Agentic AI Explained](https://mitsloan.mit.edu/ideas-made-to-matter/agentic-ai-explained)
- [IBM: What Are AI Agents](https://www.ibm.com/think/topics/ai-agents)
- [Building Autonomous AI Agents with Tool Use, Memory, and Planning](https://blog.whoisjsonapi.com/building-autonomous-ai-agents-with-tool-use-memory/)
- [MindStudio: What Is the ReAct Loop](https://www.mindstudio.ai/blog/what-is-react-loop-ai-agent-reasoning/)
- [Salesforce: What Are ReAct Agents](https://www.salesforce.com/agentforce/ai-agents/react-agents/)

### NVIDIA Telco Reasoning Model
- [Building Telco Reasoning Models for Autonomous Networks with NVIDIA NeMo](https://developer.nvidia.com/blog/building-telco-reasoning-models-for-autonomous-networks-with-nvidia-nemo/)
- [NVIDIA NeMo for Autonomous Networks (LinkedIn)](https://www.linkedin.com/posts/nvidia-ai_mwc26-activity-7434704156545671168-R3D4)
- [NVIDIA Pushes Telco Toward Autonomous Networks](https://www.storagereview.com/news/nvidia-pushes-telco-toward-autonomous-networks-with-open-nemotron-ltm-and-new-blueprints)
- [Tech Mahindra Advances AI-Driven Autonomous Network Operations](https://www.techmahindra.com/insights/press-releases/techm-advances-ai-driven-autonomous-network-operations-csps/)
- [Infosys: Autonomous Telco Operations Powered by NVIDIA](https://www.infosys.com/services/engineering-services/insights/autonomous-telco-operations.html)

### AN Agent参考架构（亚信/清华/Sifakis）
- [Leveraging AI Agents for Autonomous Networks (arXiv:2509.08312)](https://arxiv.org/html/2509.08312v1)
- [A Reference Architecture for Autonomous Networks: An Agent-Based Approach (Sifakis et al., arXiv:2503.12871)](https://arxiv.org/abs/2503.12871)

### TM Forum Catalyst
- [TM Forum BIND Catalyst (C25.0.775)](https://www.tmforum.org/catalysts/projects/C25.0.775/bind-bridging-intelligence-networks-and-digital-twin)
- [Agentic Network Resilience (C26.0.916)](https://www.tmforum.org/catalysts/projects/C26.0.916/agentic-network-resilience-and-lead-to-quote-using-aidriven-digital-twin)
- [Agentic AI for Customer-Centric O&M (M25.5.868)](https://www.tmforum.org/catalysts/projects/M25.5.868/agentic-ai-for-customercentric-om)
- [AI Agent Empowering Higher Autonomous Level (C24.0.672)](https://www.tmforum.org/catalysts/projects/C24.0.672/ai-agent-empowering-higher-autonomous-level)
- [TM Forum: How Multi-Agent AI is Transforming Network Fault Repair](https://inform.tmforum.org/research-and-analysis/proofs-of-concept/how-multi-agent-ai-is-transforming-network-fault-repair)
- [TM Forum: Using Digital Twins and Agentic AI to Enable L4+ Autonomous Network Operations](https://inform.tmforum.org/research-and-analysis/proofs-of-concept/using-digital-twins-and-agentic-ai-to-enable-level-4-autonomous-network-operations)
- [TM Forum Catalyst Awards](https://www.tmforum.org/about/awards-and-recognition/catalyst-team-awards/)
- [TM Forum LinkedIn: DTW Ignite Moonshot Projects](https://www.linkedin.com/posts/tm-forum_5-catalysts-are-addressing-the-an-level-4-activity-7325867292909592577-VcfF)

### 多Agent系统
- [Kore.ai: Multi-Agent Systems Fault Line](https://kore.ai/blog/multi-agent-systems-fault-line)
- [Multi-Agent RL for Cooperative Fault Diagnosis](http://clausiuspress.com/assets/default/article/2025/07/08/article_1751963113.pdf)
- [Multi-Agent Orchestration for Intent-Based Network Operations](https://computerfraudsecurity.com/index.php/journal/article/view/1001)
- [Galileo AI: Multi-Agent AI Failure Recovery](https://galileo.ai/blog/multi-agent-ai-system-failure-recovery)
- [Autonomous Network Monitoring Using LLMs and Multi-Agent Systems](https://www.researchgate.net/publication/393549772_Autonomous_network_monitoring_using_LLMs_and_multi-agent_systems)

### 基础设施Agent实践
- [AWS: Agentic AI for RAN Optimization](https://aws.amazon.com/blogs/industries/agentic-ai-for-ran-optimization-pathway-to-autonomous-network-level-5/)
- [Itential: Agentic Operations for Infrastructure](https://www.itential.com/resource/guide/agentic-operations-for-infrastructure/)
- [Production-Ready AI Agents: 8 Patterns That Actually Work](https://pub.towardsai.net/production-ready-ai-agents-8-patterns-that-actually-work-with-real-examples-from-bank-of-america-12b7af5a9542)

### 华为/中兴Agent实践
- [华为大模型使能核心网运维智能化](https://www.huawei.com/cn/huaweitech/techtalks/has24-highly-stable-core-network)
- [华为ADN自动驾驶网络](https://carrier.huawei.com/cn/adn)
- [华为MoM多智能体协同系统](https://www.prnewswire.com/in/news-releases/huaweis-mom-based-multi-agent-collaboration-system-empowers-core-networks-transitioning-to-l4-high-stability-302647884.html)
- [上海移动联合华为DeepSeek试点](https://m.c114.com.cn/w126-1286544.html)
- [中兴核心网运维智能体助力L4高阶自智](https://www.zte.com.cn/content/zte-site/www-zte-com-cn/china/about/magazine/zte-technologies/2025/6/3/11.html)
- [中兴聚焦四大智能构建全栈AI+核心网](https://www.zte.com.cn/content/zte-site/www-zte-com-cn/china/about/magazine/zte-technologies/2025/2/_-ai--_/4.html)
- [中兴AIR Core白皮书PDF](https://www.zte.com.cn/content/dam/zte-site/res-www-zte-com-cn/airdna/pdf/%E4%B8%AD%E5%85%B4%E9%80%9AAIR%20Core%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf)
- [中兴AI-Driven Autonomous Network Strategy at TM Forum](https://www.zte.com.cn/global/about/news/zte-unveils-ai-driven-autonomous-network-strategy-at-tm-forum-s-dtw-ignite.html)

### 全球厂商Agent实践
- [Meta Confucius (SIGCOMM'25)](https://dl.acm.org/doi/10.1145/3718958.3750537)
- [Cisco Deep Network Troubleshooting](https://blogs.cisco.com/sp/revolutionizing-network-troubleshooting-with-deep-research-ai-agents)
- [Nokia Agentic AI](https://www.nokia.com/blog/agentic-ai-powering-the-next-frontier-in-autonomous-operations/)
- [Nokia Telco LLM](https://www.nokia.com/blog/the-rise-of-the-telco-llm/)
- [Ericsson AI Agents White Paper](https://www.ericsson.com/en/reports-and-papers/white-papers/ai-agents-and-network-architecture)
- [Microsoft NOA Framework](https://techcommunity.microsoft.com/blog/telecommunications-industry-blog/introducing-microsoft%25E2%2580%2599s-network-operations-agent-%25E2%2580%2593-a-telco-framework-for-autonom/4471185)
- [IBM STRATUS (NeurIPS 2025)](https://yinfangchen.github.io/assets/pdf/stratus_paper.pdf)
- [Amdocs Autonomous Network Ops](https://www.amdocs.com/products-services/aos/agentic-business-and-network-workflows/autonomous-network-operations)

### 全球运营商商用部署
- [NTT DOCOMO Agentic AI商用](https://www.docomo.ne.jp/english/info/media_center/pr/2026/0225_01.html)
- [Deutsche Telekom + Google Cloud](https://www.telekom.com/en/media/media-information/archive/deutsche-telekom-and-google-cloud-partner-on-agentic-ai-for-autonomous-networks-1088504)
- [DT MINDR AI Agents](https://www.telekom.com/en/media/media-information/archive/mindr-ai-agents-in-the-network-1102724)
- [BT Dark NOC Case Study](https://www.zenml.io/llmops-database/autonomous-network-operations-using-agentic-ai)
- [AT&T Agentic AI](https://about.att.com/blogs/2025/agentic-ai.html)
- [中国移动TM Forum L4认证](https://inform.tmforum.org/research-and-analysis/case-studies/china-mobile-achieves-level-4-an-in-network-operation-center-with-intelligent-agents)
- [中国移动与中兴Coordinating Agentic AI (GSMA)](https://www.gsma.com/get-involved/gsma-foundry/gsma_study/coordinating-agentic-ai-for-autonomous-networks-china-mobile-zte/)

### 标准化与行业倡议
- [TM Forum IG1412 AI Agent规范模板](https://www.tmforum.org/resources/guidebook/ig1412-ai-agent-specification-template-v2-0-0/)
- [TM Forum AN L4 Blueprint PDF](https://d1a5bopfc3yb9e.cloudfront.net/reports/TM_Forum_Autonomous_networks_Level_4_industry_blueprint_.pdf)
- [NGMN Agentic AI Operating Models](https://www.ngmn.org/publications/cloud-native-next-chapter-agentic-ai-based-operating-models.html)
- [IETF LLM Agent NM Draft](https://www.ietf.org/archive/id/draft-cui-nmrg-llm-nm-01.html)
- [Anthropic Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [LLM4AIOps Survey (180+论文)](https://arxiv.org/abs/2507.12472)

### Agent框架与工具
- [IBM: What is a ReAct Agent](https://www.ibm.com/think/topics/react-agent)
- [Cisco MCP for AI Network Operations](https://gblogs.cisco.com/ch-tech/mcp-protocol-ai-network-operations/)
- [HPE MCP for AI Agents](https://developer.hpe.com/blog/model-context-protocol-mcp-the-penables-ai-agents/)
- [NetClaw Network Automation Agent (GitHub)](https://github.com/automateyournetwork/netclaw)
- [Microsoft Azure Agent Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
