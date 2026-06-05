# Harness Engineering 深度对勘：OpenClaw vs Hermes 与云核心网高稳智能体启示

> 编制日期：2026-06-05
> 方法论：以 Harness Engineering 七阶段生命周期为框架，逐阶段对勘 OpenClaw 和 Hermes 的工业落地能力

---

## 一、Harness Engineering：2026年AI Agent的核心工程方法论

### 1.1 定义

**Harness Engineering** 是2026年AI Agent领域最重要的工程方法论，由 Mitchell Hashimoto（HashiCorp创始人）在2026年初正式提出，迅速被 OpenAI、Martin Fowler、Datadog、deepset 等权威来源采纳。

核心定义（六源共识）：

> **Harness = 模型之外的一切。**
> 工具编排、内存管理、护栏、验证、状态持久化、可观测性 —— 这些构成了Agent的"操作系统"。

类比理解：

| 概念 | 类比 | 说明 |
|------|------|------|
| Model | CPU | 推理能力 |
| Context Window | RAM | 一次能"看到"的信息量 |
| **Agent Harness** | **Operating System** | 管理一切执行基础设施 |
| Agent | Application | 在Harness上运行的具体应用 |

### 1.2 核心论点

1. **同一模型在不同Harness上性能差距巨大**：Terminal Bench 测试中，仅改变Harness就能让Agent排名变动20+位（deepset）
2. **Harness迭代比模型升级性价比更高**：同样的可靠性提升，Harness改进的成本远低于切换到更贵的模型
3. **Harness使系统模型无关**：业务逻辑、验证规则、护栏都在Harness中，模型成为可替换的"CPU"

### 1.3 六源权威出处

| 来源 | 核心贡献 |
|------|---------|
| [deepset](https://www.deepset.ai/blog/harness-engineering) | 四类失败分类法（Context/Constraint/Verification/Planning） |
| [Martin Fowler](https://martinfowler.com/articles/harness-engineering.html) | Guide/Sensor两轴分类 + 三类Harness（可维护性/架构适配/行为） |
| [OpenAI](https://openai.com/index/harness-engineering/) | 百万行代码零手写的实战经验 + Ralph Wiggum Loop |
| [Datadog](https://www.datadoghq.com/blog/ai/harness-first-agents/) | 五层验证金字塔 + DST确定性仿真测试 |
| [Firecrawl](https://www.firecrawl.dev/blog/what-is-an-agent-harness) | 三层记忆模型 + 拦截循环（Interception Loop） |
| [AIQuinta](https://aiquinta.ai/blog/agent-harness-5-core-pillars-and-how-to-build/) | 五大核心Pillar + NLAH自然语言Harness概念 |

---

## 二、Harness Engineering 七阶段生命周期

综合六个权威来源，归纳出统一的七阶段生命周期：

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Stage 1 │──▶│ Stage 2 │──▶│ Stage 3 │──▶│ Stage 4 │──▶│ Stage 5 │──▶│ Stage 6 │──▶│ Stage 7 │
│ 初始化   │   │ 前馈引导 │   │ 拦截执行 │   │ 自纠正   │   │ 验证门控 │   │ 状态持久 │   │ 持续演进 │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
     │                                                           │                    │
     └──────────────────── 闭环反馈 ◄─────────────────────────────┘                    │
     └──────────────────────────── 持续学习循环 ◄───────────────────────────────────────┘
```

### Stage 1: 初始化 Init

**做什么**：定义权限范围、环境隔离、任务分解

**关键机制**：
- Permissions Manifest — 显式声明Agent可以做什么
- Sandbox Setup — Docker容器/per-worktree隔离
- Task Decomposition — 将目标拆解为可执行的子任务

**工业标准**（AIQuinta部署清单）：
1. 定义范围（显式权限清单）
2. 设置隔离工作空间（每次运行一个Docker容器）
3. 建立执行循环

### Stage 2: 前馈引导 Feedforward

**做什么**：在Agent行动前提供引导信息

**关键机制**：
- AGENTS.md — Agent的"目录索引"（非百科全书，而是引导Agent去哪里找信息）
- Skills — 可复用的操作手册
- RAG — 基于知识库的检索增强
- Progressive Disclosure — 渐进式信息披露，Agent先看到入口，按需加载详情

**Martin Fowler 的 Guide/Sensor 两轴分类**：
- **Guide（前馈控制）**：预判行为，行动前引导 —— linters、specs、架构文档
- **Sensor（反馈控制）**：行动后观察，帮助自纠正 —— tests、LLM-as-judge

### Stage 3: 拦截执行 Execution

**做什么**：模型发出工具调用请求 → Harness拦截验证 → 沙箱执行 → 返回结果

**核心模式 —— Interception Loop（Firecrawl）**：
```
模型输出工具调用 → Harness拦截 → 验证参数 → 沙箱执行 → 清洗输出 → 注入回上下文
```

**关键机制**：
- Tool Gate — 工具调用审批层
- ConfirmationStrategy — 细粒度审批策略（读操作自动通过，写操作需确认）
- Sandboxed Execution — 隔离执行环境

### Stage 4: 自纠正循环 Self-Correction

**做什么**：反馈传感器检测问题 → 生成纠正信号 → Agent自修正

**deepset 四类失败分类法**：

| 失败类型 | 表现 | Harness修复方式 |
|---------|------|----------------|
| Context failure | Agent缺少关键信息 | 改进检索逻辑、内存管理 |
| Constraint failure | Agent做了不该做的事 | 加固护栏、权限边界、linters |
| Verification failure | 输出看似合理实际错误 | 测试套件、格式验证器、LLM-as-judge |
| Planning failure | Agent走错方向 | 改进编排逻辑、子Agent委派、环检测 |

**关键机制**：
- Ralph Loop（OpenAI）— Agent审查自己的变更，请求其他Agent审查，迭代直到满意
- Hallucination Gate（Hermes）— 在输出传播前检测和过滤幻觉
- Custom Linters with Remediation — 错误信息包含修复指南，让Agent自纠正

### Stage 5: 验证门控 Verification Gate

**做什么**：在输出到达用户/生产前进行最终验证

**Datadog 五层验证金字塔**：

| 层级 | 方法 | 耗时 | 置信度 |
|------|------|------|--------|
| 符号层 | TLA+规格 | 2分钟 | 理解级 |
| 主验证 | DST确定性仿真 | ~5秒 | 高 |
| 穷举层 | 模型检验（Stateright） | 30-60秒 | 证明级 |
| 有界层 | 有界验证（Kani） | ~60秒 | 有界证明 |
| 经验层 | 遥测+基准测试 | 秒-分钟 | 真实数据 |

**关键洞察（Datadog）**：
> "Harness的复利效应是代码审查无法比拟的。每增加一个不变量，就能在未来所有迭代中捕获整类Bug。"

### Stage 6: 状态持久化 Persistence

**做什么**：保存进度、状态和记忆供下次使用

**Firecrawl 三层记忆模型**：
1. **Working Context（工作上下文）**：临时的，会话内有效
2. **Session State（会话状态）**：持久的，当前任务日志
3. **Long-term Memory（长期记忆）**：向量存储/结构化文件

**Progress File**：跨会话的结构化进度记录（JSON优于Markdown，因为模型更不容易意外覆盖）

### Stage 7: 持续演进 Evolution

**做什么**：持续监控漂移、自进化学习、不变量维护

**关键机制**：
- GC Agent（OpenAI）— 定期扫描清理"AI垃圾"（死代码、过时文档、配置漂移）
- Closed Learning Loop（Hermes）— 从每次执行中学习，创建可复用技能
- Drift Detection — 不变量监控，发现偏离自动告警
- Harness Steering Loop（Martin Fowler）— 当某类问题反复出现时，改进Guide和Sensor

---

## 三、OpenClaw 逐阶段对勘

### Stage 1 初始化

| 维度 | OpenClaw |
|------|---------|
| **系统能力** | Gateway Token认证 + 设备配对 + 每通道白名单 + 群组@触发 |
| **实际效果** | 默认绑定127.0.0.1:18789，但Censys发现21,639个互联网暴露实例 —— **安全配置极易出错** |
| **使用体验** | 一键Docker启动，5分钟可跑起来，**上手体验极佳** |

**评价**：初始化体验优秀（快速上手），但安全默认值不足。对核心网场景需要大量加固。

### Stage 2 前馈引导

| 维度 | OpenClaw |
|------|---------|
| **系统能力** | MEMORY.md持久记忆 + ClawHub技能市场（~3,984个技能）+ 动态System Prompt + 向量嵌入语义搜索 |
| **实际效果** | ClawHub发生**ClawHavoc供应链攻击**，审计2,857个技能发现341个恶意（~12%），包含凭据窃取恶意软件 |
| **使用体验** | 技能生态丰富，但**供应链安全不可信**，需要逐个审查源码 |

**评价**：前馈机制在数量和多样性上领先，但供应链安全是致命弱点。核心网场景**不能使用社区技能**。

### Stage 3 拦截执行

| 维度 | OpenClaw |
|------|---------|
| **系统能力** | 四层Hub-Spoke架构：Channel Adapters → Gateway → Agent Runtime → Tools & Execution |
| **实际效果** | CVE-2026-25253（CVSS 8.8）— 一键远程代码执行，恶意网页可窃取Gateway Token执行任意命令 |
| **使用体验** | 工具调用流畅，支持Shell执行、浏览器自动化、文件操作、定时任务；可选Docker沙箱 |

**评价**：执行层功能强大且灵活，但**缺乏内置的拦截验证层**。工具调用直接执行，没有参数验证和输出清洗。CVE说明安全边界薄弱。

### Stage 4 自纠正

| 维度 | OpenClaw |
|------|---------|
| **系统能力** | **无内置自纠正机制**。无幻觉检测、无输出验证、无环检测 |
| **实际效果** | Prompt注入是**未解决的行业性难题**（Zenity研究通过Google Doc隐藏指令让OpenClaw创建Telegram后门） |
| **使用体验** | 出错后依赖用户手动发现和纠正 |

**评价**：这是OpenClaw最大的短板。在核心网场景中，**没有自纠正意味着错误会直接传播到生产环境**。

### Stage 5 验证门控

| 维度 | OpenClaw |
|------|---------|
| **系统能力** | 工具确认提示（可选，对破坏性操作）+ 基本会话日志（JSONL格式） |
| **实际效果** | 确认提示可被用户关闭；日志仅存储在本地文件系统，无聚合能力 |
| **使用体验** | 确认弹窗频繁时用户倾向于关闭，形成安全习惯劣化 |

**评价**：验证机制是最小化的。没有确定性测试、没有形式化验证、没有独立的验证Agent。对核心网场景**完全不充分**。

### Stage 6 状态持久化

| 维度 | OpenClaw |
|------|---------|
| **系统能力** | Session JSON文件 + MEMORY.md + 向量嵌入搜索 + 每日笔记 |
| **实际效果** | InfoStealer恶意软件（RedLine/Lumma/Vidar）专门针对`~/.openclaw/credentials/`目录 |
| **使用体验** | 记忆系统工作良好，但凭据以明文JSON存储 |

**评价**：持久化机制基本够用，但凭据管理是安全隐患。核心网场景需要企业级凭据保管（HashiCorp Vault等）。

### Stage 7 持续演进

| 维度 | OpenClaw |
|------|---------|
| **系统能力** | **无内置自进化机制**。无技能自动创建、无漂移检测、无不变量监控 |
| **实际效果** | Agent性能完全依赖模型能力，不随使用时间提升 |
| **使用体验** | 每次使用都是"从零开始"，经验无法积累 |

**评价**：没有自进化能力意味着Agent无法从运维经验中学习。对核心网场景，**缺少了关键的"越用越准"能力**。

---

## 四、Hermes Agent 逐阶段对勘

### Stage 1 初始化

| 维度 | Hermes Agent |
|------|-------------|
| **系统能力** | 子Agent通过`register_task_env_overrides()`请求独立沙箱；多模型协作推理 |
| **实际效果** | 864 commits、588 merged PRs、282 issues closed、295社区贡献者 —— 单个8周发布周期 |
| **使用体验** | 配置比OpenClaw复杂，但隔离模型更健壮 |

**评价**：初始化更注重**隔离性**而非便捷性。适合核心网场景的安全隔离要求。

### Stage 2 前馈引导

| 维度 | Hermes Agent |
|------|-------------|
| **系统能力** | `/goal`命令 — 目标锁定机制，防止长时间运行Agent偏离任务；聚焦上下文窗口 |
| **实际效果** | 解决"上下文漂移"问题 —— Agent在长时间运行中不会遗忘初始目标 |
| **使用体验** | 用户设定目标后，Agent持续对齐，减少无效输出 |

**评价**：`/goal`目标锁定是核心网长时间运维（故障巡检、容量规划）的关键能力。**防止Agent"跑偏"是确定性的基础**。

### Stage 3 拦截执行

| 维度 | Hermes Agent |
|------|-------------|
| **系统能力** | 子Agent隔离执行 — 每个子Agent使用独立的、聚焦的上下文窗口 |
| **实际效果** | 减少因上下文溢出（Context Overflow）导致的幻觉；并行执行多个子任务 |
| **使用体验** | 多Agent协作自然流畅，资源隔离正在完善（Issue #4271开发中） |

**评价**：子Agent隔离执行天然具备"拦截"语义 —— 每个子Agent的输入输出都是独立的。**比OpenClaw的"直通"架构更适合核心网**。

### Stage 4 自纠正

| 维度 | Hermes Agent |
|------|-------------|
| **系统能力** | **Hallucination Gate（幻觉门控）** + **Ralph Loop（韧性循环）** |
| **实际效果** | 幻觉门控阻止"静默腐败" —— 错误信息在多Agent管道中被检测和拦截，不会级联放大 |
| **使用体验** | Ralph Loop让Agent遇到困难时不放弃，持续尝试直到成功 |

**评价**：**这是Hermes最核心的差异化能力**。幻觉门控直接解决了核心网最担心的问题 —— 错误诊断的级联传播。Ralph Loop则确保Agent不因暂时困难而放弃任务。

### Stage 5 验证门控

| 维度 | Hermes Agent |
|------|-------------|
| **系统能力** | 幻觉门控作为内置验证层；子Agent输出的验证机制 |
| **实际效果** | 在输出传播到下游之前进行验证检查点 |
| **使用体验** | 验证过程对用户透明，不需要手动干预 |

**评价**：内置验证优于OpenClaw的"可选确认"。但尚缺少Datadog推荐的DST确定性仿真测试。核心网场景需要额外补充形式化验证层。

### Stage 6 状态持久化

| 维度 | Hermes Agent |
|------|-------------|
| **系统能力** | 技能存储 — Agent从经验中创建的可复用"技能"持久保存 |
| **实际效果** | 技能在后续任务中自动复用，提高效率和一致性 |
| **使用体验** | 使用时间越长，Agent在特定领域越准确 |

**评价**：技能持久化比OpenClaw的MEMORY.md更结构化。核心网场景中，**故障处理经验可被编码为技能供后续使用**。

### Stage 7 持续演进

| 维度 | Hermes Agent |
|------|-------------|
| **系统能力** | **Closed Learning Loop（自进化学习循环）** |
| **实际效果** | 2026年5月10日超越OpenClaw成为OpenRouter #1（2240亿token/天） |
| **使用体验** | Agent越用越准，在特定领域持续提升 |

**评价**：Closed Learning Loop是Agent从"工具"进化为"伙伴"的关键。核心网场景中，**运维经验是宝贵资产，自进化能力让这个资产不断增值**。

---

## 五、工业落地对比总表

### 5.1 七阶段评分（5分制）

| 阶段 | OpenClaw | Hermes | 关键差距 |
|------|----------|--------|---------|
| **S1 初始化** | ★★★★★ 快速上手 | ★★★☆☆ 隔离优先 | 体验 vs 安全的取舍 |
| **S2 前馈引导** | ★★★☆☆ 供应链风险 | ★★★★☆ 目标锁定 | 安全性差距 |
| **S3 拦截执行** | ★★★☆☆ CVE风险 | ★★★★☆ 子Agent隔离 | 安全架构差距 |
| **S4 自纠正** | ★☆☆☆☆ 无内置机制 | ★★★★★ 幻觉门控+Ralph | **决定性差距** |
| **S5 验证门控** | ★★☆☆☆ 可选确认 | ★★★★☆ 内置验证 | 可靠性差距 |
| **S6 状态持久** | ★★★☆☆ 明文凭据 | ★★★★☆ 技能存储 | 安全+结构差距 |
| **S7 持续演进** | ★☆☆☆☆ 无自进化 | ★★★★★ Closed Learning | **能力代差** |
| **总分** | **21/35** | **32/35** | |

### 5.2 三维工业落地评估

| 维度 | OpenClaw | Hermes |
|------|----------|--------|
| **系统能力** | 功能全面但安全薄弱 | 幻觉门控+自进化，核心网更友好 |
| **实际效果** | 247K Stars说明生态繁荣，但CVE和供应链攻击频发 | OpenRouter #1说明实际使用量领先 |
| **使用体验** | 上手极快（5分钟），但安全配置需要专业能力 | 上手稍慢，但运行时可靠性更高 |

---

## 六、对云核心网高稳智能体的五大启示

### 启示一：消除幻觉 — Harness的"免疫系统"

**对应阶段**：Stage 4（自纠正）+ Stage 5（验证门控）

**核心网映射**：故障诊断场景中，一个Agent的错误判断如果未经门控传递给执行Agent，可能导致错误的网络操作。

**Harness Engineering方法**：

| 层级 | 方法 | 核心网实现 |
|------|------|-----------|
| L1 | 幻觉门控（Hermes） | 每个Agent输出经过验证后才传递到下一层 |
| L2 | LLM-as-Judge | 用第二个模型交叉验证诊断结果 |
| L3 | 确定性仿真（Datadog DST） | 在数字孪生环境中预演操作结果 |
| L4 | 人机确认（HITL） | 高危操作必须经运维人员确认 |

**关键原则**：宁可3-8%优雅拒绝，也不可0.1%幻觉泄漏到生产网络。

### 启示二：确定性 — Harness的"操作系统内核"

**对应阶段**：Stage 3（拦截执行）+ Stage 5（验证门控）

**核心网映射**：核心网对确定性的要求极高 —— 同样的输入必须产生同样的输出，运维操作必须可预期。

**Harness Engineering方法**：

| 方法 | 来源 | 核心网实现 |
|------|------|-----------|
| Interception Loop | Firecrawl | 所有网络操作经过拦截→验证→沙箱预演→确认→执行 |
| ConfirmationStrategy | deepset | 只读操作自动通过，写操作（网络变更）必须确认 |
| DST确定性仿真 | Datadog | 10M种子级别的确定性测试覆盖故障场景 |
| TLA+规格 | Datadog | 核心网操作的形式化不变量定义 |

**关键原则**：Datadog的"Scalability Inversion"——Agent时代，形式化验证反而比代码审查更经济。核心网应大胆引入DST。

### 启示三：自闭环 — Harness的"七阶段循环"

**对应阶段**：全部7阶段

**核心网映射**：核心网运维的完整闭环是 感知→分析→决策→执行→反馈→学习→再感知。

```
感知Agent → [门控] → 分析Agent → [门控] → 决策Agent → [门控] → 执行Agent
    ↑                                                                    │
    └────────────── 反馈 + 学习 ←─── 验证 ←─── 人机确认 ←───────────────┘
```

**Harness Engineering方法**：

| 环节 | Harness机制 | 核心网映射 |
|------|------------|-----------|
| 感知 | Progressive Disclosure | 只注入与当前故障相关的网络数据 |
| 分析 | 子Agent隔离 | 不同网络域（无线/传输/核心）的独立分析 |
| 决策 | 幻觉门控 | 处置方案经过验证后才进入执行 |
| 执行 | Interception Loop | 网络操作经过拦截→沙箱→确认 |
| 验证 | DST + HITL | 数字孪生预演 + 人工确认 |
| 反馈 | Observability | 实时遥测验证操作效果 |
| 学习 | Closed Learning Loop | 经验编码为技能，持续积累 |

### 启示四：自演进 — Harness的"基因进化"

**对应阶段**：Stage 7（持续演进）

**核心网映射**：核心网运维经验是宝贵的"隐性知识"。传统的知识库是静态的，而自进化Agent可以将每次运维经验转化为可复用的"技能"。

**Harness Engineering方法**：

| 方法 | 来源 | 核心网实现 |
|------|------|-----------|
| Closed Learning Loop | Hermes | 故障处理经验→技能创建→人工审核→技能复用 |
| GC Agent | OpenAI | 定期扫描清理过时运维规则和文档 |
| Harness Steering Loop | Martin Fowler | 当某类故障反复出现时，自动改进前馈引导 |
| Drift Detection | AIQuinta | 不变量监控，发现网络行为偏离自动告警 |

**关键原则**（OpenAI经验）：
> "在一个Agent吞吐量远超人类注意力的系统中，纠正的成本很低，而等待的成本很高。"

自进化不意味着放任 —— **新技能必须经过人工审核才能用于生产**。这是Hermes的Closed Learning Loop在核心网场景的必要约束。

### 启示五：高稳定 — Harness的"纵深防御"

**对应阶段**：Stage 1（初始化）+ Stage 7（持续演进）

**核心网映射**：核心网99.999%可用性要求意味着，任何单点故障都不能影响整体。

**Harness Engineering方法**：

| 防线 | 方法 | 来源 |
|------|------|------|
| 模型层 | 多模型Failover | OpenClaw架构已支持 |
| Agent层 | 子Agent资源隔离 | Hermes Sub-Agent Isolation |
| 操作层 | 沙箱+人机确认 | deepset ConfirmationStrategy |
| 知识层 | RAG落地 | Firecrawl Context Engineering |
| 监控层 | 全链路可观测 | Datadog Observability + OpenTelemetry |
| 演进层 | 不变量监控+漂移检测 | Martin Fowler Fitness Functions |

---

## 七、结论

### 三句话总结

1. **Harness Engineering是Agent工业落地的关键方法论**：它定义了模型之外的"操作系统"，决定了Agent在生产环境中是否可靠
2. **Hermes在Harness核心能力（幻觉门控、自纠正、自进化）上显著领先OpenClaw**，更适合核心网等高可靠性场景
3. **核心网高稳智能体应借鉴Harness Engineering的七阶段生命周期**，构建 拦截执行→幻觉门控→确定性验证→人机确认→自进化学习 的完整闭环

### 行动路线

| 优先级 | 行动 | 对应Harness阶段 |
|--------|------|----------------|
| **P0** | 引入幻觉门控机制 | Stage 4 |
| **P0** | 建设核心网RAG知识库 | Stage 2 |
| **P1** | 实施子Agent隔离架构 | Stage 1+3 |
| **P1** | 建设确定性仿真测试环境 | Stage 5 |
| **P2** | 实施Closed Learning Loop | Stage 7 |
| **P2** | 构建全链路可观测体系 | Stage 5+7 |

---

## 完整出处索引

### Harness Engineering 框架
1. deepset — "Harness Engineering: How to Build Reliable AI Agents" — https://www.deepset.ai/blog/harness-engineering
2. Martin Fowler — "Harness Engineering for Coding Agent Users" — https://martinfowler.com/articles/harness-engineering.html
3. OpenAI — "Harness Engineering: Leveraging Codex in an Agent-First World" — https://openai.com/index/harness-engineering/
4. Datadog — "Closing the verification loop: Observability-driven harnesses" — https://www.datadoghq.com/blog/ai/harness-first-agents/
5. Firecrawl — "What Is an Agent Harness?" — https://www.firecrawl.dev/blog/what-is-an-agent-harness
6. AIQuinta — "What is an AI Agent Harness? 5 Core Pillars" — https://aiquinta.ai/blog/agent-harness-5-core-pillars-and-how-to-build/

### OpenClaw
7. OpenClaw官方架构文档 — https://docs.openclaw.ai/concepts/architecture
8. OpenClaw GitHub — https://github.com/openclaw/openclaw
9. OpenClaw安全深度解析（MintMCP）— https://www.mintmcp.com/blog/openclaw-works-architecture-skills-security
10. OpenClaw vs LangChain vs AutoGPT（腾讯云）— https://cloud.tencent.com/developer/article/2636970

### Hermes Agent
11. Hermes Agent GitHub（NousResearch）— https://github.com/nousresearch/hermes-agent
12. Hermes Agent官方文档 — https://hermes-agent.nousresearch.com/docs/
13. "3个真正改变工作流的Hermes特性"（Towards AI）— https://pub.towardsai.net/the-3-hermes-agent-features-that-actually-changed-my-workflow-and-the-one-everyone-else-wrote-ad8669f4f001
14. NVIDIA Hermes官方博客 — https://blogs.nvidia.com/blog/rtx-ai-garage-hermes-agent-dgx-spark/
15. Hermes自进化解析（Noqta）— https://noqta.tn/en/blog/hermes-agent-nous-research-openrouter-self-evolving-2026
16. Per-subagent隔离Issue #4271 — https://github.com/NousResearch/hermes-agent/issues/4271

### 其他参考
17. Awesome Harness Engineering（GitHub）— https://github.com/ai-boost/awesome-harness-engineering
18. arXiv:2603.07728 多Agent消除幻觉 — https://arxiv.org/abs/2603.07728
19. 华为AgenticCore（MWC2026）— https://www.huawei.com/cn/news/2026/3/mwc-agenticcore-summit
20. 华为核心网网络智能新方案 — https://www.huawei.com/cn/news/2026/3/mwc-core-network
