# Agent/LLM使能故障感知诊断恢复：最具代表性工作深度分析

## 选定工作：STRATUS — 自主可靠性工程多Agent系统

**论文：** STRATUS: A Multi-agent System for Autonomous Reliability Engineering of Modern Clouds
**作者：** Yinfang Chen, Jiaqi Pan, Jackson Clark, Yiming Su 等
**机构：** UIUC, IBM Research, 清华大学IIIS, Microsoft Research
**发表：** NeurIPS 2025 (Poster #116834)
**arXiv：** 2506.02009
**开源：** https://github.com/xlab-uiuc/stratus

---

## 一、为什么选择STRATUS作为最具代表性的工作

在2024-2026年Agent/LLM使能故障管理的所有工作中，STRATUS是唯一同时满足以下条件的系统：

1. **覆盖完整闭环**：故障检测 → 故障定位 → 根因分析 → 自动修复（Mitigation），覆盖故障管理全生命周期
2. **发表于顶会**：NeurIPS 2025，机器学习领域最高水平会议
3. **形式化安全保证**：首创Transactional No-Regression（TNR）安全规范，数学证明修复动作不会使系统状态恶化
4. **社区基准验证**：在AIOpsLab（13个问题）和ITBench（18个问题）两个社区标准基准上评估，大幅超越所有基线
5. **开源可复现**：完整代码开源，使用CrewAI框架 + GPT-4o/Llama等现成LLM，无需微调

对比其他候选工作：

| 候选工作 | 全闭环覆盖 | 安全保证 | 顶会发表 | 开源 | 生产部署 |
|---------|-----------|---------|---------|------|---------|
| **STRATUS (NeurIPS 2025)** | **完整** | **TNR形式化证明** | **NeurIPS** | **是** | 实验验证阶段 |
| AIOpsLab (MLSys 2025) | 评估框架 | N/A（非系统） | MLSys | 是 | 微软Azure基准 |
| Triangle (FSE 2025) | 仅分诊 | 否 | FSE | 否 | Azure生产 |
| NENYA (KDD 2022) | 仅修复 | 否 | KDD | 否 | M365生产 |
| Kataria多Agent框架 | 诊断为主 | 置信度评分 | IJIES | 否 | 原型验证 |

---

## 二、系统架构深度解析

### 2.1 核心设计哲学：确定性控制流 + 创造性数据流

STRATUS的架构设计体现了一个深刻的洞察：**SRE任务需要安全推理和时效性，而非多样性思维**。

因此，STRATUS明确拒绝了多Agent对话/辩论模式（如AutoGen的多轮对话），转而采用：
- **确定性状态机**控制Agent间的编排流程
- **LLM**负责每个Agent内部的智能推理

这种设计避免了多Agent对话的不确定性和冗余，显著提升了执行效率和可预测性。

### 2.2 四Agent架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Detection  │────▶│  Diagnosis  │────▶│ Mitigation  │────▶│    Undo     │
│   Agent     │     │   Agent     │     │   Agent     │     │   Agent     │
│  (α_D)      │     │  (α_G)      │     │  (α_M)      │     │  (α_U)      │
│  只读操作    │     │  只读操作    │     │  读写操作    │     │  写操作      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │                    │
     ▼                    ▼                    ▼                    ▼
  异常检测           根因定位+RCA          修复执行             回滚恢复
  建立初始           构建调用链图          kubectl命令          堆栈式回滚
  错误状态           定位故障区域          checkpoint+执行      状态恢复
```

**Detection Agent（α_D）**：
- 功能：观察系统环境，识别故障，建立初始错误状态
- 约束：仅允许只读命令，不能修改系统状态
- 方法：通过遥测工具（metrics、logs、alerts）发现异常

**Diagnosis Agent（α_G）**：
- 功能：处理故障定位和根因分析两个子任务
- 核心创新：基于分布式Trace的Bootstrap定位——从分布式追踪数据构建调用链图（Call Graph），快速缩小故障区域
- 约束：仅允许只读命令
- 方法：分析trace数据 → 构建调用拓扑 → 识别异常节点 → 推断根因

**Mitigation Agent（α_M）**：
- 功能：接收诊断结果，制定高层修复计划，分解为具体的kubectl命令并执行
- 这是**唯一能执行写操作**的Agent
- 安全机制：执行前checkpoint系统状态，执行后验证系统是否改善
- 支持命令：重启Pod、调整资源配置、修改配置项、流量切换等

**Undo Agent（α_U）**：
- 功能：当修复事务被中止时，执行回滚序列将系统恢复到事务前状态
- 机制：基于堆栈的细粒度回滚——逐个恢复Kubernetes状态对象，而非全系统快照
- 当前实现为确定性机制（非LLM驱动），但设计上预留了学习型回滚策略的接口

### 2.3 LLM工具链

STRATUS基于**CrewAI多Agent框架**实现，使用现成LLM无需微调：

| 组件 | 技术选型 |
|------|---------|
| Agent框架 | CrewAI |
| 主力LLM | GPT-4o (gpt-4o-2024-08-06) |
| 轻量LLM | GPT-4o-mini |
| 开源LLM | Llama 3.3 (70B) |
| 温度参数 | 0（确定性输出） |
| 自然语言→命令 | NL2Kubectl工具 |
| 命令验证 | LintingTool |
| 遥测采集 | OpenTelemetry + 自定义工具 |
| 终止判断 | 多Oracle组合（告警清除+吞吐量+集群健康） |

---

## 三、核心创新：TNR安全规范

### 3.1 问题定义

Agent执行修复动作的核心风险：**AI修复可能让系统变得更糟**。例如，错误地重启了错误的Pod，或者修改了错误的配置参数。在云基础设施中，这种风险是不可接受的。

### 3.2 TNR（Transactional No-Regression）形式化

STRATUS借鉴数据库事务语义，提出了TNR安全规范，基于三个假设：

- **A1（写入者排他性）**：读者-写者锁确保同一时刻最多只有一个写Agent（Mitigation或Undo）执行
- **A2（忠实回滚）**：Undo操作精确恢复checkpoint的事务前状态
- **A3（有界风险窗口）**：每个事务限制在K=20条命令以内

每个修复事务遵循三条规则：
- **R1**：执行前checkpoint系统状态
- **R2**：执行修复动作序列
- **R3**：如果严重性指标未增加则提交（commit），否则中止并回滚（abort + undo）

**定理（TNR安全性）**：在TNR规范下，可观测系统严重性永远不会超过初始基线。

这一证明将Agent修复的风险轮廓从"期望整个计划完美"转变为"验证小的、可管理步骤的安全性"——这是Agent在安全关键场景部署的理论基础。

### 3.3 实验验证

消融实验（AIOpsLab, GPT-4o）证明了TNR的关键作用：

| 配置 | 修复成功率 |
|------|-----------|
| STRATUS完整版（含TNR） | **69.2%** (9/13) |
| 无重试（单次尝试） | 15.4% (2/13) |
| 朴素重试（无Undo） | 23.1% |

关键发现：
- 80%+的问题中STRATUS至少重试一次
- 30%+的问题中重试5次以上
- 无TNR的朴素重试反而降低成功率——失败的修复恶化了系统状态，使后续尝试更困难

---

## 四、实验结果

### 4.1 修复成功率

| Agent | AIOpsLab (13题) | ITBench (18题) |
|-------|----------------|----------------|
| **STRATUS (GPT-4o)** | **69.2%** | **50.0%** |
| STRATUS (GPT-4o-mini) | 23.1% | 19.4% |
| STRATUS (Llama 3.3) | 23.1% | 28.0% |
| AOL-agent (GPT-4o) | 46.2% | — |
| ITB-agent (GPT-4o) | — | 9.2% |

- AIOpsLab上**1.5倍**于最佳基线
- ITBench上**5.4倍**于最佳基线

### 4.2 各阶段性能

| 任务 | STRATUS | 最佳基线 |
|------|---------|---------|
| 检测（Detection） | 90.6% | 87.5% (ReAct) |
| 定位（Localization） | 51.2% | 46.9% (AOL-agent) |
| 修复（Mitigation） | 69.2% | 46.2% (AOL-agent) |

### 4.3 效率权衡

STRATUS平均执行时间812秒 vs AOL-agent的223秒。时间增加来自重试机制——但对于SRE场景，修复成功率远比速度重要。

---

## 五、对5G核心网的适配性分析

### 5.1 直接映射

| STRATUS组件 | 5GC映射 |
|-------------|---------|
| Detection Agent | AMF/SMF/UPF信令指标异常检测 |
| Diagnosis Agent | NRF服务发现链路根因定位 |
| Mitigation Agent | NF实例重启/迁移/扩缩容 |
| Undo Agent | 配置回滚、实例恢复 |
| TNR安全规范 | 电信级99.999%可用性保障 |
| kubectl命令 | Helm/K8s operator for 5GC NF |

### 5.2 需要适配的方面

1. **命令空间扩展**：kubectl → 5GC OAM接口（3GPP TS 28.5xx系列）
2. **遥测源扩展**：OpenTelemetry → 5GC SBI接口监控 + PFCP会话监控
3. **安全约束增强**：TNR基础上增加电信级SLA约束（如"自愈动作不得中断正在进行的PDU会话"）
4. **实时性要求**：5GC自愈需要秒级响应，STRATUS当前平均812秒需要优化
5. **知识注入**：注入3GPP协议知识（TS 23.501/23.502信令流程），使Agent理解正常vs异常信令

### 5.3 实施建议

```
Phase 1：构建5GC版AIOpsLab
  - 仿真5GC信令面（free5GC/Open5GS）
  - 定义5GC故障注入场景（信令风暴、NF宕机、数据库连接超时等）
  - 建立评估指标（检测延迟、定位准确率、修复成功率、业务影响度）

Phase 2：适配STRATUS至5GC
  - 扩展Diagnosis Agent：理解SBI调用链和PFCP会话流程
  - 扩展Mitigation Agent：支持5GC特有的修复动作（AMF Pool切换、SMF迁移、UPF重定向）
  - 强化TNR：增加"会话保持性"约束

Phase 3：人机协同部署
  - 高置信度场景（如NF实例重启）：自动执行
  - 中等置信度场景（如跨NF迁移）：LLM生成修复建议，人工确认后执行
  - 低置信度场景（如切片级故障）：人工决策，AI辅助提供上下文

Phase 4：持续进化
  - 引入Hermes Agent的闭环学习机制，从每次故障诊断中自动优化策略
  - 结合张圣林团队的延迟感知因果推断，处理5GC长链路传播延迟
```

---

## 六、关联生态：AIOpsLab基准框架

STRATUS的评估基础——**AIOpsLab**（MLSys 2025，Microsoft Research）——本身也是该领域的重要基础设施：

- **Agent-Cloud Interface（ACI）**：定义Agent与云系统交互的标准化接口
- **故障注入器**：一键生成各类故障场景
- **工作负载生成器**：模拟真实用户流量
- **评估框架**：标准化检测/定位/修复各阶段的评估指标

AIOpsLab已开源（https://github.com/microsoft/AIOpsLab），支持ReAct、AutoGen、TaskWeaver等多种Agent实现，是目前AgentOps领域的事实标准基准。

---

## 七、总结

STRATUS代表了Agent/LLM使能故障感知诊断恢复领域的**最高水平实践**：

1. **理论贡献**：TNR安全规范是首个面向Agent SRE的形式化安全框架，为安全关键场景的Agent部署提供了数学基础
2. **系统贡献**：四Agent状态机架构平衡了确定性与智能性，工程上可落地
3. **实验贡献**：在社区标准基准上大幅超越所有基线，结果可复现
4. **生态贡献**：与AIOpsLab形成"基准+系统"的完整闭环，推动整个领域标准化

对于5G核心网等电信级关键基础设施，STRATUS + AIOpsLab的组合为构建"AI驱动的自主运维系统"提供了当前最成熟的技术路径，同时TNR安全规范为"安全优先"的电信场景提供了理论保障。

---

## 参考文献

- [STRATUS] Y. Chen, J. Pan et al., "STRATUS: A Multi-agent System for Autonomous Reliability Engineering of Modern Clouds," NeurIPS 2025. arXiv: 2506.02009
- [AIOpsLab] Y. Chen et al., "AIOpsLab: A Holistic Framework to Evaluate AI Agents for Enabling Autonomous Clouds," MLSys 2025. arXiv: 2501.06706
- [Triangle] Microsoft Azure, "Optimizing Incident Management with AIOps Using the Triangle System," FSE 2025
- [NENYA] L. Wang et al., "NENYA: Cascade Reinforcement Learning for Cost-Aware Failure Mitigation at Microsoft 365," KDD 2022
- [AIOps Survey] L. Zhang et al., "A Survey of AIOps in the Era of Large Language Models," ACM Computing Surveys, 2025. DOI: 10.1145/3703637
- [Kataria] V. Kataria, "Intelligent SRE: A Multi-agent LLM Framework for Automated Incident Analysis and Root Cause Determination," IJIES, 2025
