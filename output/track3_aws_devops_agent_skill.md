# AWS DevOps Agent深度分析：三层Skill架构与学习型Skill

## 一、AWS DevOps Agent是什么

AWS DevOps Agent是AWS于2026年3月31日GA的**生产级自主SRE Agent**，定位为"Frontier Agent"（前沿智能体）——能自主运行数小时甚至数天的AI Agent，充当始终在线的虚拟SRE。

**关键效果数据**（Preview阶段客户报告）：
- MTTR降低**75%**
- 调查加速**80%**
- 根因准确率**94%**
- 故障解决加速**3-5x**
- WGU案例：Lambda配置问题从2小时降至**28分钟**（77% MTTR改善）
- Zenchef案例：ECS部署回归从1-2小时降至**20-30分钟**

---

## 二、核心架构：Agent Spaces + 拓扑智能 + 三层Skill

```
┌──────────────────────────────────────────────────────────────────────┐
│                  AWS DevOps Agent 架构                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Agent Space（逻辑容器）                                     │   │
│  │  ├── 定义调查范围、跨账户访问、工具集成                      │   │
│  │  ├── IAM权限控制、数据隔离                                   │   │
│  │  └── 不可变审计日志（每步推理和操作都记录）                  │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                              │                                       │
│  ┌──────────────────────────▼───────────────────────────────────┐   │
│  │  Topology Intelligence Service（拓扑智能服务）               │   │
│  │  ├── 自动发现：CloudFormation/CDK/资源标签 → 资源拓扑        │   │
│  │  ├── 映射关系：容器/网络/日志组/告警/部署的互联              │   │
│  │  ├── 后台学习Agent：持续更新拓扑                              │   │
│  │  └── 多云支持：AWS/Azure/本地环境                            │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                              │                                       │
│  ┌──────────────────────────▼───────────────────────────────────┐   │
│  │  三层Skill层级                                               │   │
│  │                                                              │   │
│  │  Layer 1: AWS-provided Skills（AWS内置）                     │   │
│  │  ├── AWS工程师和科学家开发                                    │   │
│  │  ├── 反映经过验证的运维方法论                                │   │
│  │  └── 持续维护更新                                            │   │
│  │                                                              │   │
│  │  Layer 2: User-defined Skills（用户自定义）                  │   │
│  │  ├── Markdown格式（SKILL.md + 参考文档 + 资源文件）          │   │
│  │  ├── 可上传zip包（最大6MB）                                   │   │
│  │  ├── 针对特定Agent类型：Triage/RCA/Mitigation/Evaluation    │   │
│  │  └── 从Runbook自动迁移                                       │   │
│  │                                                              │   │
│  │  Layer 3: Learned Skills（学习型）← 核心创新                 │   │
│  │  ├── 后台学习Agent持续运行                                   │   │
│  │  ├── Skill 1: Agent Space Understanding（环境理解）          │   │
│  │  └── Skill 2: Tool Use Best Practices（工具使用最佳实践）   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Feed集成（数据源）                                                  │
│  ├── 遥测：CloudWatch/Datadog/Dynatrace/New Relic/Splunk/Grafana   │
│  ├── CI/CD：GitHub Actions/GitLab CI/Azure DevOps                   │
│  ├── 工单：ServiceNow（原生）/PagerDuty（Webhook）                  │
│  ├── 通信：Slack                                                    │
│  └── 扩展：BYO MCP Server                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 三、Skill技术规范深度解析

### 3.1 Skill的基本结构

Skill是**自包含的目录**，核心是一个`SKILL.md`文件：

```
my-skill/
├── SKILL.md              # 必须：核心指令（Markdown格式）
├── references/           # 可选：参考文档
│   ├── architecture.md
│   └── troubleshooting.md
└── assets/               # 可选：图片、图表、数据文件
    ├── topology.png
    └── metrics.csv
```

**SKILL.md的frontmatter格式**：

```yaml
---
name: rds-performance-investigation
description: Investigation procedures for RDS performance issues including
connection exhaustion, slow queries, replication lag, and storage capacity.
Use this skill when investigating database latency, connection errors, or
read/write performance degradation.
---

# RDS Performance Investigation

## Step 1: Check alarm status
Query CloudWatch for active alarms on the affected RDS instance. Look for:
- `DatabaseConnections` exceeding 80% of max_connections
- `ReadLatency` or `WriteLatency` above 20ms

## Step 2: Analyze connection metrics
Retrieve `DatabaseConnections` over the past hour...

## Step 3: Identify slow queries
Use Performance Insights to retrieve top SQL statements...

## Step 4: Summarize findings
Provide summary with root cause hypothesis and remediation steps.
```

**关键设计决策**：
- Skill是**纯文本**（Markdown + PDF + 图片），**不支持脚本执行**（安全考虑）
- Agent根据`description`字段**自动决定**何时激活Skill
- Skill可针对**6种Agent类型**定向：Generic/On-demand/Triage/RCA/Mitigation/Evaluation

### 3.2 与SkillOpt的对比

| 维度 | AWS DevOps Agent Skill | Microsoft SkillOpt |
|------|----------------------|-------------------|
| **Skill格式** | SKILL.md + references/ + assets/ | best_skill.md（单一紧凑文档） |
| **Skill来源** | 三层：AWS内置 + 用户编写 + Agent自动学习 | 单层：优化器模型从轨迹中训练 |
| **优化方式** | 学习Agent分析基础设施/遥测/代码 | 优化器分析rollout轨迹的有界编辑 |
| **评估机制** | 生产环境验证（实际调查结果反馈） | 留出集验证门（严格改善才接受） |
| **人类可审阅** | ✓（Markdown，几分钟可读完） | ✓（300-2000 tokens） |
| **部署成本** | 零（Skill是纯文本指令） | 零（Skill是纯文本） |
| **自动化程度** | 学习Agent全自动，用户可干预 | 优化器全自动，用户审阅最终输出 |
| **跨环境迁移** | 每个Agent Space独立学习 | 跨模型/跨框架正向迁移 |

---

## 四、学习型Skill深度解析

### 4.1 Learned Skill #1: Agent Space Understanding（环境理解）

**功能**：分析连接的云账户、代码仓库和遥测集成，构建Agent Space中资源和关系的地图。

**输出结构**：

```
Agent Space Understanding Skill/
├── SKILL.md                          # 主文件：系统概述
│   ├── 关键领域概念
│   ├── 部署环境（AWS账户+区域对，Azure订阅+区域）
│   ├── 容器级架构图（逻辑服务如何连接）
│   ├── 核心请求路径（请求经过哪些组件）
│   └── 代码仓库到容器的映射
│
├── references/
│   ├── container-api-gateway.md      # 每个逻辑容器一个参考文件
│   │   ├── 内部组件（计算/数据/消息/网络）
│   │   ├── 资源类型和物理标识符（ARN、表名、队列URL）
│   │   ├── 可观测性覆盖（告警/仪表板/监控器）
│   │   └── 代码仓库映射（源码→部署资源的完整追溯链）
│   │
│   ├── container-database.md
│   │
│   └── request-path-url-redirect.md  # 每个关键请求路径一个参考文件
│       ├── 端到端请求流（组件粒度）
│       ├── 排序流图（操作顺序和交互机制）
│       └── 可观测性信号
│           ├── 每跳的日志组模式
│           ├── 关键指标（延迟/错误率/节流/token配额）
│           └── 分布式trace span（跨服务跨账户关联）
```

**更新触发**：
- 添加/更新/移除Agent Space能力或集成时自动触发
- 也可手动点击"Regenerate"按钮触发

**对5GC的启示**：
- 这就是**5GC拓扑自动发现**——自动发现NF间的SBI调用关系、PFCP会话关联、NRF服务注册信息
- 映射到5GC：
  - 逻辑容器 = 网络切片
  - 内部组件 = NF实例（AMF/SMF/UPF/PCF/UDM）
  - 请求路径 = UE注册/PDU会话建立/切换等信令流程
  - 可观测性信号 = SBI调用链 + PFCP会话监控 + NF资源指标
- **从3GPP TS 23.501/23.502信令流程自动生成"请求路径参考文件"**

---

### 4.2 Learned Skill #2: Tool Use Best Practices（工具使用最佳实践）

**功能**：分析过去调查中的工具使用记录，提取有效使用模式、常见失败模式和参数指导。

**输出结构**：

```
Tool Use Best Practices Skill/
├── SKILL.md                          # 主文件：工具路由索引
│   └── 每个工具支持的调查场景 + 链接到对应参考文件
│
├── references/
│   ├── tool-cloudwatch-logs.md       # 每个工具一个参考文件
│   │   ├── Best Practices（最佳实践）
│   │   │   ├── CloudWatch Logs Insights查询模板
│   │   │   ├── 环境特定的指标命名空间和维度
│   │   │   └── CloudTrail事件源过滤器
│   │   │   每条实践基于具体调查场景，包含实际参数值和示例
│   │   │
│   │   ├── Common Errors（常见错误）
│   │   │   ├── 查询不可访问的账户
│   │   │   ├── 构造错误的聚合查询
│   │   │   └── 每条错误包含纠正动作
│   │   │
│   │   └── Output Management（输出管理）
│   │       ├── 大响应的处理策略
│   │       └── 减少输出大小的参数变更
│   │
│   ├── tool-cloudwatch-metrics.md
│   ├── tool-dynamodb.md
│   └── ...
```

**关键设计细节**：

1. **模式验证机制**：当有实时基础设施访问时，Skill在纳入模式前会**先验证**：
   - 确认的模式：高置信度陈述
   - 未确认的模式：使用谨慎语言
   - 被证伪的模式：**直接排除**
   
2. **更新频率**：每**30次调查**自动更新一次

3. **自我纠错**：Common Errors部分记录了Agent自己犯过的错误和修复方法，避免重复犯错

**对5GC的启示**：
- 这就是**5GC运维工具的经验积累**
- 每次故障调查后自动提取：
  - 什么查询对诊断AMF注册超时最有效？
  - 什么PromQL查询参数组合容易出错？
  - 什么查询会返回过多数据需要优化？
- **"30次调查更新一次"**的节奏适合5GC——不是每次都更新（避免过度拟合），而是积累足够的经验后批量优化
- **模式验证机制**对5GC尤其重要：确认的诊断模式高置信度使用，未确认的谨慎使用，被证伪的排除

---

### 4.3 学习型Skill的工作机制

```
学习型Skill的工作流程

┌──────────────────────────────────────────────────────┐
│  后台学习Agent（持续运行）                            │
│                                                      │
│  输入数据源：                                        │
│  ├── 云基础设施（CloudFormation/CDK/标签）           │
│  ├── 遥测数据（CloudWatch/Datadog/...）              │
│  ├── 代码仓库（GitHub/GitLab/Azure DevOps）          │
│  └── 历史调查记录（过去所有调查的完整轨迹）          │
│                                                      │
│  处理：                                              │
│  ├── Agent Space Understanding Skill                 │
│  │   ├── 扫描基础设施 → 构建资源拓扑图              │
│  │   ├── 分析代码仓库 → 映射代码到部署资源          │
│  │   ├── 分析请求流 → 构建端到端请求路径            │
│  │   └── 关联可观测性 → 映射告警/日志/trace到组件   │
│  │                                                  │
│  └── Tool Use Best Practices Skill                  │
│      ├── 分析成功调查 → 提取有效查询模式            │
│      ├── 分析失败调查 → 提取常见错误和修复方法      │
│      ├── 分析工具输出 → 优化输出管理策略            │
│      └── 验证模式 → 确认/谨慎/排除三级分类          │
│                                                      │
│  输出：                                              │
│  ├── SKILL.md（主文件）                              │
│  └── references/（每个容器/工具/请求路径的参考文件）│
│                                                      │
│  更新触发：                                          │
│  ├── Agent Space Understanding：集成变更时           │
│  ├── Tool Use Best Practices：每30次调查             │
│  └── 手动触发：点击"Regenerate"或聊天要求           │
│                                                      │
│  人类介入：                                          │
│  ├── 可查看所有Learned Skill内容                     │
│  ├── 可停用（Deactivate）任何Learned Skill          │
│  └── 可随时重新激活                                  │
└──────────────────────────────────────────────────────┘
```

---

## 五、与微软SkillOpt的对比分析

### 5.1 根本差异：工程产品 vs 学术方法

| 维度 | AWS DevOps Agent Skill | 微软 SkillOpt |
|------|----------------------|---------------|
| **本质** | 工程产品（GA，生产运行） | 学术方法（arXiv论文，基准评估） |
| **Skill定义** | 三层混合（内置+自定义+学习） | 单一优化流程（从轨迹训练） |
| **学习方式** | 从基础设施扫描+调查历史中学习 | 从评分rollout轨迹中有界编辑 |
| **评估** | 生产验证（94%根因准确率） | 留出集验证门（52/52全胜） |
| **可操作性** | 完整可操作（调查→诊断→修复建议） | 基准评估，未在生产AIOps中验证 |
| **人类审阅** | 可查看/停用/重新激活 | 可审阅（300-2000 tokens） |
| **安全机制** | 不可变审计日志+IAM权限+数据隔离 | 验证门+有界编辑+受保护区域 |

### 5.2 互补关系

AWS DevOps Agent和SkillOpt从不同角度解决了同一个问题——**如何让Agent的技能持续进化**：

- **AWS的解法**：工程化、产品化、多来源（内置+自定义+学习），强调**安全可控**和**可审计**
- **SkillOpt的解法**：学术化、系统化、纯数据驱动（从轨迹训练），强调**优化算法**的严谨性

**最佳实践**：将AWS的**三层Skill架构**与SkillOpt的**评估驱动优化**方法论结合：
1. AWS内置Skill → 提供5GC基础诊断能力
2. 用户自定义Skill → 编码5GC专家知识（3GPP信令流程）
3. 学习型Skill → 借鉴SkillOpt的验证门机制，确保学到的模式经过严格评估

---

## 六、对云核网络高稳的启示

### 6.1 三层Skill架构的直接映射

```
5GC版三层Skill架构

Layer 1: 供应商内置Skill
  ├── AMF注册故障诊断Skill
  ├── SMF会话管理故障诊断Skill
  ├── UPF数据面异常检测Skill
  ├── NRF服务发现级联故障Skill
  ├── 切片资源管理故障Skill
  └── 信令风暴应对Skill

Layer 2: 运营商自定义Skill
  ├── SKILL.md格式，Markdown可读
  ├── 编码运营商特定的运维流程
  │   ├── 应急处理手册 → Skill
  │   ├── 故障定位手册 → Skill
  │   └── 容灾切换SOP → Skill
  ├── 参考文档（references/）
  │   ├── 3GPP TS 23.501信令流程图
  │   ├── 5GC接口规范
  │   └── 告警-指标-日志关联表
  └── 针对特定Agent类型定向
      ├── 感知Agent → 异常检测Skill
      ├── 诊断Agent → 根因定位Skill
      ├── 修复Agent → 自愈策略Skill
      └── 评估Agent → SLA验证Skill

Layer 3: 学习型Skill
  ├── 5GC拓扑自动发现Skill（类比Agent Space Understanding）
  │   ├── 自动扫描：NRF服务注册信息 → NF拓扑
  │   ├── 请求路径：UE注册/PDU会话建立/切换等信令流
  │   ├── 可观测性映射：SBI调用链 + PFCP会话 + NF指标 → NF实例
  │   └── 触发更新：NF实例变更/接口配置变更时
  │
  └── 5GC工具使用最佳实践Skill（类比Tool Use Best Practices）
      ├── 有效的PromQL查询模板（从成功诊断中提取）
      ├── 常见查询错误和修复方法（从失败诊断中提取）
      ├── 每种5GC查询工具的参数优化策略
      ├── 模式验证：确认→谨慎→排除三级分类
      └── 每30次故障调查自动更新
```

### 6.2 关键借鉴

**1. Skill格式标准化**

AWS选择了**纯文本Skill（SKILL.md）**而非代码脚本，这是一个重要的安全决策——Skill只能指导Agent如何思考，不能直接执行代码。5GC等安全关键场景应采用同样的原则。

**2. 学习型Skill的"模式验证"机制**

AWS Learned Skill不是盲目学习——它在纳入模式前会验证：
- 确认的模式高置信度使用
- 未确认的谨慎使用
- 被证伪的直接排除

这对5GC至关重要：不能让Agent使用未经验证的诊断模式处理生产故障。

**3. "30次调查更新一次"的节奏**

不是每次都更新，而是积累30次经验后批量优化。这避免了"过度拟合最近一次故障"的问题，适合5GC的故障频率（不像互联网公司每天都有大量事件）。

**4. 人类可介入的"停用/重新激活"机制**

运维专家可以随时停用一个Learned Skill而不删除它。这给了人类"最终否决权"——如果Agent学到的一个模式在特定场景下不安全，可以立即停用。

**5. 多Agent类型定向**

Skill可以针对特定Agent类型（Triage/RCA/Mitigation/Evaluation）定向，减少上下文消耗、提高Agent聚焦度。5GC可类比为：感知Skill/诊断Skill/修复Skill/评估Skill各自独立。

### 6.3 实施建议

```
Phase 1：构建5GC版三层Skill框架
  ├── 定义5GC Skill规范（基于SKILL.md格式）
  ├── 编写Layer 1内置Skill（5-10个核心故障场景）
  ├── 迁移现有运维手册为Layer 2自定义Skill
  └── 不急于实施Layer 3（先积累调查数据）

Phase 2：实施学习型Skill
  ├── 构建拓扑自动发现Skill（从NRF/NF注册信息自动生成）
  ├── 构建5GC请求路径参考文件（从TS 23.502信令流程自动生成）
  └── 启动工具使用最佳实践Skill（从初始调查数据中学习）

Phase 3：优化学习循环
  ├── 借鉴SkillOpt的验证门机制：学到的模式必须经过仿真验证
  ├── 借鉴SkillOpt的有界编辑：每次学习最多修改N条规则
  └── 建立人类审阅流程：运维专家定期审阅Learned Skill
```

---

## 七、参考文献

- [AWS DevOps Agent产品页] https://aws.amazon.com/devops-agent/
- [Leverage Agentic AI for Autonomous Incident Response] https://aws.amazon.com/blogs/devops/leverage-agentic-ai-for-autonomous-incident-response-with-aws-devops-agent/
- [Building an End-to-End Agentic SRE] https://aws.amazon.com/blogs/devops/building-an-end-to-end-agentic-sre-using-aws-devops-agent/
- [DevOps Agent Skills文档] https://docs.aws.amazon.com/devopsagent/latest/userguide/about-aws-devops-agent-devops-agent-skills.html
- [Learned Skills文档] https://docs.aws.amazon.com/devopsagent/latest/userguide/about-aws-devops-agent-learned-skills.html
- [DevOps Agent Spaces文档] https://docs.aws.amazon.com/devopsagent/latest/userguide/about-aws-devops-agent-what-are-devops-agent-spaces.html
- [DevOps Agent Topology文档] https://docs.aws.amazon.com/devopsagent/latest/userguide/about-aws-devops-agent-what-is-a-devops-agent-topology.html
- [AWS Frontier Agents公告] https://aws.amazon.com/blogs/machine-learning/aws-launches-frontier-agents-for-security-testing-and-cloud-operations/
- [SkillOpt] Y. Yang et al., "SkillOpt: Executive Strategy for Self-Evolving Agent Skills," arXiv:2605.23904, 2026. https://arxiv.org/abs/2605.23904
