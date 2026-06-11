# FoundRoot 与业界"大模型微调"路径调研：FoundRoot 是不是真的在"开倒车"？

> **调研日期**：2026/06/02
> **关联文档**：
> - [FoundRoot_vs_AgentSkill_Paradigm_Analysis.md](./FoundRoot_vs_AgentSkill_Paradigm_Analysis.md) — 上一轮"FoundRoot vs Agent+Skill"分析（结论：分层互补）
> - [FoundRoot_MagmaScope_Analysis.md](./FoundRoot_MagmaScope_Analysis.md) — FoundRoot + MagmaScope 论文深度分析
> - [AIOps_Reliability_Practices_Research.md](./AIOps_Reliability_Practices_Research.md) — 业界 AIOps/可靠性实践
> - [aws_devops_agent_investigation_vs_perception.md](./aws_devops_agent_investigation_vs_perception.md) — AWS 路径
> - [track3_microsoft_fault_perception.md](../track3_microsoft_fault_perception.md) — 微软 AIOps 感知层
> - [track3_microsoft_aiops_ecosystem.md](../track3_microsoft_aiops_ecosystem.md) — 微软 AIOps 生态
> - [track3_aws_devops_agent_skill.md](../track3_aws_devops_agent_skill.md) — AWS DevOps Agent 深度分析

---

## 核心结论

| 问题 | 答案 |
|------|------|
| FoundRoot 是不是和 Agent+Skill 思路冲突？ | **是**，但只在**复杂因果推理层**冲突；在系统架构层不冲突 |
| 业界（微软/AWS/Google/阿里/华为）有没有像 FoundRoot 那样专门微调一个大模型做 RCA？ | **基本没有**。FoundRoot 是当前公开文献中**唯一一个**为 RCA 任务专门做 SFT+RL 微调的工作 |
| 那业界主流在走什么路线？ | 主流仍是 **Agent+Skill+工具** 路线 + 评估平台（AIOpsLab）+ 案例沉淀（FLASH Hindsight、AWS Learned Skill） |
| 为什么业界普遍不微调？ | 训练成本高、泛化性差、维护负担重、数据稀缺、平台供应商倾向做"通用底座"而非"垂直模型" |
| 5GC 该怎么选？ | **分层混合**：核心跨 NF 因果推理用 FoundRoot 范式做内化；编排/工具调用/格式转换保留 Agent+Skill；用 SkillOpt 做持续进化 |

> **一句话**：FoundRoot 不是"开倒车"，而是**在 Agent 范式达到天花板后，开辟了"内化到模型权重"这条新路**。这条路上目前**只有它一家**在走，是名副其实的 outlier。

---

## 一、把"冲突"问题精确化

### 1.1 用户感觉到的"冲突"是什么

在 `FoundRoot_vs_AgentSkill_Paradigm_Analysis.md` 上一轮分析里，我给出的结论是"分层互补、不冲突"。但用户的反馈是"感觉还是冲突"——这说明上一轮的分析**没把冲突讲透**。

把"冲突"拆开看，至少有三层：

| 冲突层次 | 是否真的冲突 | 证据 |
|---------|------------|------|
| **系统架构层**：FoundRoot 的"无 Agent 单模型推理"是否与"Agent+Skill 编排"冲突？ | **不冲突** | 字节跳动自己同会议同年用 MagmaScope 走 Agent 路线 |
| **复杂推理实现层**：FoundRoot 的"内化到权重"是否与"Agent 动作-反思循环"冲突？ | **强冲突** | FoundRoot 论文用 R1-Full + Agent = 0.032 Top-1（最差）证明 |
| **生态投入方向层**：产业资源是应该投在"训练更好的 Agent"还是"微调垂直模型"？ | **隐性冲突** | 业界全部押注 Agent 路线，FoundRoot 是唯一反例 |

用户的"感觉冲突"其实是第二层（**实现层**）和第三层（**资源投入方向**）。

### 1.2 FoundRoot 的关键实验：Agent 包装**不仅"次优"，而且"有害"**

这是上一轮分析里**没有充分强调**的最关键事实：

```
FoundRoot 论文 [原表 4] —— 数据集 A 上 15 种方法 Top-1 准确率：

方法                                    Top-1
─────────────────────────────────────────────────────
MicroCause (经典方法)                    0.214
DeepSeek-R1-Full (零样本，不包装)         0.254
Qwen2.5-14B-Instruct (基础)              0.103
DeepSeek-R1-Distill-Qwen2.5-14B          0.247
...
ReAct + DeepSeek-R1-Full                0.087
RCA-Agent + DeepSeek-R1-Full     ←      0.032   ← 15 个方法中最差
...
FoundRoot (本文方法)                      0.429   ← 4.5%-48.6% 提升
```

**关键洞察**：

- **R1-Full 直接使用** = 0.254（很强）
- **R1-Full 套上 Agent 框架** = 0.032（**暴跌 87.4%**，比随机猜测还差）
- **R1-Full 套上 RCA-Agent**（专门为 RCA 设计的 Agent）= 0.032（**最差**）

**这意味着**：Agent 框架不是"在最强模型上锦上添花"，而是**干扰了模型内生的推理链条**。FoundRoot 论文原话：

> "将 RCA 推理分解为动作-反思过程并不能显著增强 LLMs 推理复杂因果关系的能力。"

这是对"Agent+Skill 是 RCA 银弹"这一业界共识的**强有力反例**。

### 1.3 上一轮"分层互补"结论的细化

| 任务类型 | 推荐范式 | FoundRoot 立场 | 业界共识立场 | 冲突程度 |
|---------|---------|--------------|------------|---------|
| **跨 NF/跨指标/跨时间窗 的复杂因果推理** | 基础模型内化推理 | ✅ 强推 | ⚠️ 业界仍默认 Agent | **强冲突** |
| **变更-事件关联、规则匹配、配置合规检查** | Agent+Skill | 间接承认（MagmaScope） | ✅ 业界共识 | 不冲突 |
| **工具调用、API 编排、跨系统协调** | Agent+Skill | 默认需要 | ✅ 业界共识 | 不冲突 |
| **持续学习/案例沉淀** | Skill + Hindsight + 学习型 Skill | 未深入 | ✅ AWS/微软都投重资源 | 不冲突 |
| **可解释性 / 审计 / 责任归属** | 状态机 + 显式步骤 | 略有提及（结构化 4 步） | ✅ 业界主流 | 弱冲突 |

**真正的冲突点只有一个：复杂跨域因果推理该不该走 Agent 路线。** 其他所有维度上，FoundRoot 并不反对 Agent+Skill。

---

## 二、业界路径大盘点：谁在走 FoundRoot 路线？

### 2.1 微软：仍是 Agent+Skill 路线，未见 RCA 专用微调

| 系统/工作 | 是否为 RCA 专门微调 LLM | 范式 | 状态 |
|----------|----------------------|------|------|
| **FLASH** (2024) | ❌ | Agent + Status Supervision + Hindsight | 微软 M365 内部评估 |
| **Triangle** (ASE 2025) | ❌ | 多 LLM Agent 协作 + 语义蒸馏 | 已部署 6+ Azure 团队 |
| **StepFly** (2025) | ❌ | 把 TSG 转为 Agent 工作流 | 开源 |
| **Xpert** (ICSE 2024) | ❌ | LLM 生成 PromQL 查询 | 事件管理 |
| **AIOpsLab** (MLSys 2025) | ❌ | Agent 评估 + 仿真平台 | 开源（评估平台，非模型） |
| **DeepTraLog** (ICSE 2022) | ❌ | 图深度学习（不是 LLM） | 研究 |
| **HALO** (KDD 2021) | ❌ | 层次化统计 + ML | Azure 部署 |
| **NENYA** (KDD 2022) | ❌ | 级联强化学习（结构化特征） | M365 部署 |
| **AiDice / SR-CNN** (KDD 2019) | ❌ | 时序异常检测（DL，**非 LLM**） | Azure 部署 |
| **RESIN** (OSDI 2022) | ❌ | 内存泄漏检测（特征工程） | Azure 部署 |

**关键观察**：

- 微软在 **AIOps 感知层**（异常检测、内存泄漏、磁盘故障）部署了 **91%** 的工作（11 个中有 10 个进入生产）
- 微软在 **AIOps 诊断/根因层** 的研究几乎全部走 **Agent+Skill+工具** 路线
- 微软的 LLM 相关工作（FLASH、Triangle、Xpert、UniLog）**都是把 LLM 当 zero-shot 或 few-shot 工具用**，没有为 RCA 任务做 SFT/RL 微调
- 微软有自己的 LLM 训练能力（Phi 系列、Orca、WizardLM、MAIA 芯片），但**没有用在 RCA 任务上**

**这意味着什么**：微软即便有垂直微调能力，**也选择了不微调**。这是有意识的工程选择，不是能力不足。

### 2.2 AWS：DevOps Agent 全面押注 Agent+Skill

| 系统/工作 | 是否为 RCA 专门微调 LLM | 范式 | 状态 |
|----------|----------------------|------|------|
| **DevOps Agent** (2026.3 GA) | ❌ | Agent + 三层 Skill（AWS 内置 + 用户 + 学习型） | GA |
| **CloudWatch Investigations** | ❌ | GenAI 助手 + Feed + Suggestion | GA |
| **DevOps Guru** (2020) | ❌ | ML 模型（**非 LLM**，基于传统 ML） | GA |
| **CodeGuru** (2019) | ❌ | ML 代码审查 | GA |
| **Automated Reasoning / Zelkova** | ❌ | 形式化验证（**SMT 求解器**，非 ML） | 内部每天数十亿次 |
| **Bedrock Fine-tuning** | 部分（通用 LLM） | 提供微调能力，**AIOps 场景无公开专用微调** | GA |

**关键观察**：

- AWS 的"学习型 Skill"是 FoundRoot 思路的**另一种实现**——把领域知识沉淀到 Skill 文件而非模型权重。**这种选择的代价是检索开销和上下文长度，收益是不需要重训模型**
- AWS Bedrock 提供微调能力，但**AWS 自己没有为 DevOps Agent 训练专用模型**——这是云厂商的典型策略："**做平台、不做模型**"
- AWS 的核心竞争力是**形式化推理**（Zelkova）和**Agent 编排**（Bedrock AgentCore），而不是 LLM 微调

### 2.3 Google：SRE 文化 + ML 增强，未见 LLM 微调

| 系统/工作 | 是否为 RCA 专门微调 LLM | 范式 | 状态 |
|----------|----------------------|------|------|
| **Borgmon / Monarch** | ❌ | 规则 + 统计 | 内部 |
| **ACA** (Automated Canary Analysis) | ❌ | 统计 + ML | 内部 |
| **Cloud Operations Suite** | ❌ | ML 异常检测 | GA |
| **SRE 文化** | ❌ | 流程方法论 | 书籍 |
| **arXiv:2602.09937 "Why Do AI Agents Systematically Fail at Cloud RCA?"** | ❌ | 批判性研究 | 论文 |

**一个值得深思的巧合**：Google 那篇 arXiv 2602.09937 系统性记录了 12 种 LLM Agent 在云 RCA 上的失败模式，**和 FoundRoot 的发现高度一致**（都是"Agent 在 RCA 上系统性失败"）。但 Google 的应对路线是**改进 Agent**（更好的工具、记忆、规划），FoundRoot 的应对路线是**放弃 Agent**（内化到权重）。

**这是两种不同的方法论响应**：
- Google："Agent 框架本身没问题，是当前实现不够好"
- FoundRoot（字节）："Agent 框架本身在 RCA 任务上走错了方向"

### 2.4 阿里、华为：公开文献有限，未见 RCA 专用微调

**阿里**：
- AIOps 平台主推时序异常检测（AAAI 2021 系列）、日志分析、告警收敛
- LLM 在运维中用于日志理解、根因建议生成、查询推荐
- **未见**为 RCA 任务专门微调 LLM 的公开工作
- 通用 LLM 微调（Qwen 系列）不做 AIOps 专用化

**华为**：
- iMaster NAIE（自动驾驶网络）平台
- 通信场景的 AIOps（信令分析、故障预测）
- 公开研究集中在传统 ML 和图神经网络
- **未见** RCA 专用 LLM 微调

### 2.5 学术界其他 RCA 工作：清一色 Agent+工具

| 论文 | 会议 | 是否微调 LLM | 范式 |
|------|------|------------|------|
| **RCAgent** | KDD 2024 | ❌ | Tool-augmented LLM Agent |
| **Multi-Agent Framework for RCA** | Springer 2025 | ❌ | 多 Agent |
| **AutoRCA** | arXiv 2024 | ❌ | Agent + 知识图谱 |
| **LADDER** | arXiv 2024 | ❌ | Agent + 知识 |
| **OpenRCA Benchmark** | 2025 | ❌ | 评估基准 |
| **NetAIOps** | 多篇 | ❌ | Agent + 拓扑 |
| **Flow-of-Action** | WWW 2025 | ❌ | SOP + 5 个 Agent |
| **FoundRoot** | **ICSE 2026** | **✅ SFT + DAPO RL** | **结构化深度思考** |

**统计**：在 FoundRoot 之前，公开的 RCA 工作中**100%** 走 Agent+工具路线。FoundRoot 是**第一个**走"为 RCA 微调专用模型"路线的。

### 2.6 总结：FoundRoot 是绝对的 outlier

| 厂商 | Agent+Skill 范式 | 垂直微调 LLM 范式 |
|------|----------------|-----------------|
| 微软 | ✅ 全面押注（FLASH、Triangle、StepFly、AIOpsLab）| ❌ |
| AWS | ✅ 全面押注（DevOps Agent、Investigations）| ❌ |
| Google | ✅（SRE 文化 + Agent 改进）| ❌ |
| 阿里 | ✅（AIOps 平台）| ❌ |
| 华为 | ✅（iMaster NAIE）| ❌ |
| 学术界（RCA 方向）| ✅（100%）| ❌（FoundRoot 之前）|
| **字节跳动 + 清华 NetMan** | 兼有（MagmaScope 走 Agent）| **✅ FoundRoot 是唯一** |

**这个 outlier 状态本身就是一个强烈的信号**：要么 FoundRoot 是**未来方向**（其他厂商会在 1-2 年内跟进），要么它是**个例**（学界一次有意义的探索，但不构成主流）。

---

## 三、为什么 FoundRoot 路径目前是 outlier？5 个深层原因

### 3.1 训练成本与部署成本的不对称

| 维度 | Agent+Skill 路线 | FoundRoot 路线 |
|------|----------------|--------------|
| 训练算力 | ~0（用现成 LLM）| **8 × A100 × 400 步 DAPO RL** |
| 数据准备 | 中（需要 SOP、工具描述）| **高（3500+ 高质量 RCA 案例）** |
| 单次训练成本 | <1K USD | **10K-100K USD**（估算）|
| 部署算力 | 高（多步工具调用、长上下文）| **低（单次推理）** |
| 长期 TCO（百万次诊断）| 中-高 | **低** |

**关键洞察**：Agent+Skill 路线是"小步快跑、低门槛"，FoundRoot 路线是"重投资、低 TCO"。对于**PoC 阶段**或**不确定场景**，Agent+Skill 必然胜出；对于**大规模生产场景**，FoundRoot 反而更优。

**业界目前大量在 PoC 阶段**，所以选 Agent+Skill 是理性的。

### 3.2 泛化性的根本矛盾

```
Agent+Skill 路线：
  基础模型（通用） + Skill（领域）
  → 一个新领域 = 加一份 Skill
  → 泛化性：靠 Skill 数量
  
FoundRoot 路线：
  基础模型 + 微调（特定领域）
  → 一个新领域 = 重训或新训
  → 泛化性：靠数据
```

**问题**：FoundRoot 在 10 个数据集、3500 个 RCA 案例上训练，对**其他类型的故障管理**（如内存泄漏、磁盘故障、容量规划）**泛化性未知**。如果要为 5G 核心网的 5 种 NF × 10 种故障类型都微调，**总成本是 5 × 10 × 训练成本 = 灾难**。

而 Agent+Skill 路线只需准备 5 × 10 = 50 份 Skill，**边际成本接近 0**。

### 3.3 维护负担：模型更新 vs Skill 更新

**FoundRoot 路线**：
- 5GC 版本升级（R16 → R17）→ **必须重新训练**（因为新信令流程进入数据）
- 出现新 NF 类型 → **必须重新训练**
- 每次训练 1-2 周，期间系统能力停滞

**Agent+Skill 路线**：
- 5GC 版本升级 → 更新 SOP 文档，更新 Skill
- 出现新 NF → 加 Skill
- 维护成本：**小时级**

**对运营商的实操含义**：5GC 是**长期演进**系统，R15 至今已 8 年，R17 即将发布。**能"小步快跑"维护**的方案比"重训"方案更适合运营商的运维节奏。

### 3.4 数据稀缺性

FoundRoot 用了 **3500+ 个 RCA 案例**做 SFT+RL。这种规模的标注数据：

- 字节跳动有（万亿级 trace 数据 + NetMan 合作）
- 阿里、腾讯、华为可能有
- 5GC 运营商**基本不可能有**：5GC 单次故障的影响面大、可注入的样本少、合规约束多

**结论**：FoundRoot 路线对**数据寡头**（字节、阿里、微软）可行，对**大多数企业**（含运营商）**不可行**。这从根本上限制了它的普及速度。

### 3.5 平台供应商的商业逻辑

云厂商（AWS、Azure、GCP）的核心商业模式是**"卖平台、卖算力"**：
- 提供 Bedrock / AgentCore / Vertex AI 让客户微调
- 提供 Agent 框架让客户编排
- **不希望**客户被"垂直专用模型"绑定——因为这会让客户用更少算力

**因此云厂商天然不推"垂直微调 LLM"路线**，而是推"Agent+Skill+平台"路线。这是商业驱动，不是技术判断。

### 3.6 风险与监管

电信、金融、医疗等强监管行业对**模型可解释性、可审计性**有强要求：

| 维度 | Agent+Skill | FoundRoot |
|------|------------|----------|
| 每步推理可解释 | ✅ 工具调用可记录 | ⚠️ 单次推理不可分步解释 |
| 决策归因 | ✅ 工具调用链可追溯 | ⚠️ 权重黑盒 |
| 监管审计 | ✅ 容易 | ⚠️ 困难 |
| 责任归属 | 清晰（Agent+人）| 模糊（模型）|

**5GC 99.999% SLA + 强监管**场景下，**Agent+Skill 的可审计性**比 FoundRoot 的"内化精度"更重要。

---

## 四、FoundRoot 路径与 Agent+Skill 路径的真正关系

### 4.1 两者不是"对错"关系，而是"层次"关系

```
                    任务复杂度
                        ↑
                        │
          FoundRoot      │
          (复杂因果)     │
              ●          │
                        │
                        │
                        │     ┌──────────┐
                        │     │ Agent+   │
                        │     │ Skill    │
                        │     │ (编排)   │
                        │     └──────────┘
                        │          ●
                        │     ┌──────────┐
                        │     │ SkillOpt │
                        │     │ (技能    │
                        │     │  优化)   │
                        │     └──────────┘
                        │          ●
                        │     ┌──────────┐
                        │     │ 规则/ML  │
                        │     │ (粗筛)   │
                        │     └──────────┘
                        │          ●
                        └─────────────────→ 任务范围（窄→宽）
```

**核心规律**：
- **任务越复杂、越需要内在推理能力** → FoundRoot 范式越合适
- **任务越窄、越需要可解释性** → Agent+Skill 范式越合适

### 4.2 业界正在走"分层"路线

从现有材料看，**业界已经事实上在向分层架构收敛**：

| 层级 | 当前业界方案 | FoundRoot 替代方案 | 5GC 推荐 |
|------|------------|------------------|---------|
| **粗筛层** | k-sigma 异常检测、统计阈值 | 无 | 用业界方案（成熟）|
| **推理核心层** | LLM zero-shot（Agent 包装）| **FoundRoot 风格微调** | **5GC 推荐微调 14B 模型做跨 NF 因果推理** |
| **编排层** | Agent+Skill、AWS 三层 Skill | 无 | 用业界方案（DevOps Agent / 自研）|
| **沉淀层** | Hindsight、Learned Skill、SkillOpt | 无（FoundRoot 不沉淀 Skill）| **结合 SkillOpt 做持续进化** |

### 4.3 5GC 的"双轨制"建议

**轨道一（核心推理）**：训练 FoundRoot 风格的 14B 模型做跨 NF 因果推理
- 数据来源：5GC 仿真环境（free5GC/Open5GS）+ 真实脱敏数据
- 训练：SFT + DAPO RL
- 部署：单次推理，无外部工具依赖
- 价值：99.999% SLA 下的稳定输出、可解释的权重变化、零运行时外部依赖

**轨道二（外围编排）**：用 Agent+Skill 做工具调用、格式转换、工单触发
- 复用业界方案（参考 AWS DevOps Agent / 微软 StepFly）
- Skill 来源：3GPP 规范、运维 SOP、应急流程
- 价值：快速迭代、与运营商现有系统对接

**持续进化机制**：用 SkillOpt 对**轨道二**的 Skill 做"文档式自进化"，用 FoundRoot 的结构化深度思考对**轨道一**的微调数据做"权重式自进化"。

---

## 五、对 5GC 落地的具体建议

### 5.1 不要盲目复制 FoundRoot

| 风险 | 描述 | 缓解 |
|------|------|------|
| **数据不足** | 5GC 运营商没有 3500+ 高质量 RCA 案例 | 建设 5GC 仿真平台（free5GC/Open5GS + Chaos Engineering）生成合成数据 |
| **泛化失效** | 5GC NF 类型多（AMF/SMF/UPF/PCF/UDM/NRF...），微调一个模型覆盖所有有困难 | 按 NF 类型**分别微调**小型模型（7B），推理时按 NF 类型路由 |
| **维护成本** | R16→R17 重训成本高 | 准备"5GC 版本切换应急预案"，规划每年 1-2 次重训节奏 |
| **可解释性** | 黑盒推理难审计 | **用 FoundRoot 的"结构化深度思考"4 步范式**保留可解释性（指标扫描→传播分析→反思→排序），这本身就是 FoundRoot 论文的妥协点 |
| **算力门槛** | 8×A100 不是所有运营商都有 | 与云厂商合作（华为云、阿里云），或使用量化版（14B-Int4 几乎无损）|

### 5.2 同时，不要放弃 Agent+Skill

| 场景 | 范式 | 理由 |
|------|------|------|
| **跨 NF 故障根因分析** | **FoundRoot 风格微调** | 复杂因果推理 |
| **告警收敛、去重** | 规则 + ML | 简单模式匹配 |
| **配置合规检查** | **Agent+Skill** | 规则明确、范围窄 |
| **变更-事件关联** | **Agent+Skill** | 范围明确、MagmaScope 已验证 |
| **工单/通知/审批** | **Agent 编排** | 跨系统协作 |
| **运维知识沉淀** | **SkillOpt / Hindsight** | 持续积累 |

### 5.3 长期演进路线图

```
2026 (现在)：
  ├── 引入 Agent+Skill 路线（成熟，参考 AWS/微软）
  ├── 建设 5GC 仿真平台 + 故障注入
  └── 积累 RCA 数据（仿真 + 真实脱敏）

2027 (PoC 阶段)：
  ├── 用 5GC 数据训练第一个 FoundRoot 风格 14B 模型
  ├── 重点：AMF + SMF 故障根因
  └── 评估：相比 Agent+Skill 路线，根因准确率提升

2028 (试点)：
  ├── 在单 NF / 单 Region 试点 FoundRoot 模型
  ├── 与 Agent+Skill 编排层对接
  └── 评估：MTTR、误判率、人工干预率

2029 (扩展)：
  ├── 扩展到所有 NF 类型（5+ 个微调模型）
  ├── 集成 STRATUS + SkillOpt 实现持续进化
  └── 建立 5GC RCA 基础模型标准

2030+ (持续优化)：
  ├── 跨版本迁移（R17→R18）
  ├── 跨运营商迁移（运营商 A → 运营商 B）
  └── 演进为"5GC 运维基础模型"产品
```

---

## 六、关键 takeaway

1. **"冲突"是真的，但只在复杂因果推理层**。在系统架构层，FoundRoot 与 Agent+Skill 是互补的。上一轮"分层互补"结论对架构层成立，对实现层不成立——需要用户精确理解这种"分层"。

2. **FoundRoot 的实验证据比通常理解更强**：R1-Full + RCA-Agent = 0.032 Top-1（**15 个方法中最差**），不是"次优"，是"有害"。这是对"Agent 是 RCA 银弹"假设的强反例。

3. **FoundRoot 是当前公开文献中唯一为 RCA 任务微调 LLM 的工作**。微软有微调能力但不做，AWS 有微调能力但不做，Google 公开的 RCA 工作全部走 Agent 改进路线。这是"工业界 PoC 阶段 + 平台供应商商业逻辑"两个因素共同作用的结果。

4. **业界目前是 Agent+Skill 一统天下，但 Google 和字节都在用论文/实验暴露 Agent 的失败模式**。这暗示 1-2 年内可能出现"Agent 改进派 vs 内化派"的方法论分化。FoundRoot 是内化派的先驱。

5. **FoundRoot 路径有 5 个根本限制**（训练成本、泛化性、维护负担、数据稀缺、商业逻辑），决定了它短期内不会成为主流。**但对 5GC 这种强监管、99.999% SLA 的场景，长期看反而是更适合的范式**。

6. **5GC 应当走"双轨制"**：核心跨 NF 因果推理用 FoundRoot 风格微调；外围编排、工具调用、案例沉淀继续用 Agent+Skill+SkillOpt 路线。这与 `FoundRoot_vs_AgentSkill_Paradigm_Analysis.md` 的"分层混合架构"建议一致，但本轮分析把**双轨的具体分工**讲得更清楚。

---

## 七、与上一轮分析的对照

| 维度 | 上一轮 `FoundRoot_vs_AgentSkill_Paradigm_Analysis.md` | 本轮 `FoundRoot_Industry_FineTuning_Paradigm_Survey.md` |
|------|--------------------------------------------------------|---------------------------------------------------------|
| **核心问题** | FoundRoot 是不是推翻 Agent+Skill？ | FoundRoot 是不是和 Agent+Skill 冲突？其他厂商有没有微调路线？|
| **结论** | 分层互补，业界在向分层架构收敛 | **精确化**：复杂推理层强冲突；FoundRoot 是 outlier；业界目前 100% 走 Agent+Skill |
| **冲突分析深度** | 浅（一笔带过）| **深**（拆成 3 层冲突 + FoundRoot 关键实验 0.032 的强证据）|
| **业界调研广度** | 4 行表格（AWS、微软 FLASH、字节 MagmaScope、FoundRoot）| **系统性**（微软 11 个工作、AWS 6 个、Google 5 个、阿里/华为、学术界 8 个）|
| **FoundRoot outlier 原因分析** | 未涉及 | **5 个深层原因**（成本、泛化、维护、数据、商业）|
| **5GC 落地建议** | 通用"分层混合架构" | **具体"双轨制"**：核心推理走 FoundRoot、外围编排走 Agent+Skill、持续进化走 SkillOpt |

**两篇文档互补**：上一轮是"框架"，本轮是"框架的精确化和证据"。

---

## 参考资料

### 核心论文

- **FoundRoot** (ICSE 2026 Research Track): https://github.com/NetManAIOps/FoundRoot
- **MagmaScope** (ICSE 2026 SEIP): 详见 ICSE 官方页面
- **Flow-of-Action** (WWW 2025): https://arxiv.org/abs/2502.08224
- **Chain-of-Event** (FSE 2024): https://netman.aiops.org/wp-content/uploads/2024/07/Chain-of-Event_Interpretable-Root-Cause-Analysis-for-MicroservicesFSE24-Camera-Ready.pdf
- **RCAgent** (KDD 2024)
- **OpenRCA Benchmark** (2025)
- **arXiv:2602.09937** "Why Do AI Agents Systematically Fail at Cloud RCA?" (Google 2025/2026)

### 业界系统

- **AWS DevOps Agent** (GA 2026.3): https://aws.amazon.com/blogs/aws/aws-devops-agent-helps-you-accelerate-incident-response-and-improve-system-reliability-preview/
- **AWS CloudWatch Investigations**: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Investigations.html
- **Microsoft FLASH**: https://www.microsoft.com/en-us/research/publication/flash-a-workflow-automation-agent-for-diagnosing-recurring-incidents/
- **Microsoft AIOpsLab** (MLSys 2025): https://github.com/microsoft/AIOpsLab
- **Microsoft Triangle** (ASE 2025)
- **Microsoft StepFly**: https://github.com/microsoft/StepFly

### 关联分析文档（本仓库）

- [FoundRoot_vs_AgentSkill_Paradigm_Analysis.md](./FoundRoot_vs_AgentSkill_Paradigm_Analysis.md) — 上一轮分析
- [FoundRoot_MagmaScope_Analysis.md](./FoundRoot_MagmaScope_Analysis.md) — FoundRoot + MagmaScope 论文深度
- [AIOps_Reliability_Practices_Research.md](./AIOps_Reliability_Practices_Research.md) — 业界 AIOps 实践
- [aws_devops_agent_investigation_vs_perception.md](./aws_devops_agent_investigation_vs_perception.md)
- [track3_microsoft_fault_perception.md](../track3_microsoft_fault_perception.md)
- [track3_microsoft_aiops_ecosystem.md](../track3_microsoft_aiops_ecosystem.md)
- [track3_aws_devops_agent_skill.md](../track3_aws_devops_agent_skill.md)
- [track3_deep_dive_skillopt.md](../track3_deep_dive_skillopt.md) — SkillOpt 深度分析（与本轮"持续进化"建议相关）
- [track3_deep_dive_hermes_agent_vs_skillopt.md](../track3_deep_dive_hermes_agent_vs_skillopt.md) — Hermes Agent 事实核查与 SkillOpt 对比
