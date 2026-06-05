# Martin Fowler -- Guide/Sensor 两轴分类 + 三类 Harness 框架

> 来源: https://martinfowler.com/articles/harness-engineering.html

## 一、框架概述

Martin Fowler (通过其网站贡献者) 提出的 Harness Engineering 框架以其精密的分类法和系统化的时间维度分析著称。不同于其他框架侧重于"什么是 Harness",本文聚焦于"如何构建 Harness"——具体来说,如何通过 **Guide(引导/前馈)** 和 **Sensor(传感器/反馈)** 两个轴,结合 **Computational(计算型)** 和 **Inferential(推断型)** 两个执行类型,构建一个系统化的 Harness。

## 二、核心定义:三层同心圆

文章提出了 Agent = Model + Harness 的基本等式,但更进一步将其细化为三层同心圆:

| 层级 | 含义 | 说明 |
|------|------|------|
| **内层: Model** | 核心推理引擎 | 最终被 Harness 的对象 |
| **中层: Builder Harness** | 编码 Agent 内建的 Harness | 通过系统提示、代码检索机制或编排系统构建 |
| **外层: User Harness** | 用户构建的外部 Harness | 针对特定用例和系统的定制化 Harness |

一个构建良好的外部 Harness 服务两个目标:提高 Agent 首次正确的概率,提供在问题到达人眼之前尽可能多自我纠正的反馈循环。

## 三、两轴分类法

这是该框架最具原创性的贡献——一个二维分类矩阵:

### 3.1 方向轴:Guide vs Sensor

- **Guide (前馈控制)**: 预判 Agent 行为并旨在**行动前**引导它。Guide 提高首次尝试正确结果的概率。例如:AGENTS.md、Skills、编码规范、LSP 集成。

- **Sensor (反馈控制)**: 在 Agent 行动**之后**观察并帮助它自我纠正。当 Sensor 产生针对 LLM 消费优化的信号时特别强大——例如,包含自我纠正指令的自定义 Linter 消息(一种正向的 Prompt Injection)。

如果只有反馈,Agent 会不断重复同样的错误。如果只有前馈,Agent 编码规则但永远不知道它们是否有效。**两者必须结合**。

### 3.2 执行轴:Computational vs Inferential

- **Computational (计算型)**: 确定性和快速的,由 CPU 运行。测试、Linter、类型检查器、结构分析。运行时间在毫秒到秒级;结果可靠。

- **Inferential (推断型)**: 语义分析、AI 代码审查、"LLM as judge"。通常由 GPU 或 NPU 运行。更慢更贵;结果更具非确定性。

### 3.3 组合矩阵示例

| 场景 | 方向 | 计算型/推断型 | 实现示例 |
|------|------|-------------|---------|
| 编码规范 | 前馈 | 推断型 | AGENTS.md, Skills |
| 项目初始化指令 | 前馈 | 两者兼有 | 带指令的 Skill + 启动脚本 |
| Code Mods | 前馈 | 计算型 | 访问 OpenRewrite 配方的工具 |
| 结构测试 | 反馈 | 计算型 | pre-commit 钩子运行 ArchUnit 测试 |
| 审查指令 | 反馈 | 推断型 | Skills |

**关键洞察**: Computational Sensor 足够便宜和快速,可以在每次变更时运行;Inferential Sensor 更昂贵但提供语义判断。两者互补,非替代。

## 四、7步发布生命周期

文章以时间维度为核心,将 Harness 中的 Guide 和 Sensor 分布在变更的完整生命周期中:

### 步骤 1: 集成前前馈 (Pre-integration Feedforward)

在 Agent 甚至创建 Commit 之前:
- **LSP (Language Server Protocol)**: 提供类型信息和代码补全
- **architecture.md**: 前馈架构约束
- **/how-to-test Skill**: 指导测试编写
- **AGENTS.md**: 核心工作规范
- **MCP Server**: 访问团队知识管理工具
- **/xyz-api-docs Skill**: API 文档引用

### 步骤 2: 第一次自纠正循环 (First Self-correction Loop)

Agent 生成代码后的第一轮反馈:
- **eslint**: 代码风格检查
- **semgrep**: 安全模式扫描
- **npm run coverage**: 覆盖率检查
- **npm run dep-cruiser**: 依赖关系验证

### 步骤 3: 人工审查作为额外反馈传感器

人工审查不位于流程顶端,而是作为一个额外的反馈传感器——它的位置在自动化传感器之后,表明人工审查应专注于自动化工具无法覆盖的语义和意图层面。

### 步骤 4: 集成

代码合并到主分支。

### 步骤 5: Pipeline 重跑所有传感器 + 昂贵传感器

集成后在 CI/CD Pipeline 中:
- 重新运行所有先前的传感器
- **架构审查 Skill**: 更广泛的架构一致性检查
- **详细审查 Skill**: 深入代码质量分析
- **Mutation Testing**: 测试质量的测试

### 步骤 6: 持续漂移传感器 (Continuous Drift Sensors)

在变更生命周期之外持续运行:
- **死代码检测**: `/find-dead-code`
- **测试覆盖质量分析**: `/code-coverage-quality`
- **依赖扫描**: Dependabot 等

### 步骤 7: 持续运行时反馈

Agent 持续监控生产环境:
- **SLO 监控**: 延迟、错误率或可用性 SLO 退化时,Agent 提出改进建议
- **响应质量采样**: AI Judge 持续采样响应质量
- **日志异常**: 标记日志异常

## 五、三类 Harness

### 5.1 Maintainability Harness (可维护性 Harness)

这是目前最容易构建的 Harness 类型,因为存在大量可用的预置工具:

- **Computational Sensor** 可靠地捕获结构问题:重复代码、圈复杂度、缺失测试覆盖、架构漂移、风格违规。这些便宜、成熟、确定性。
- **LLM** 可以部分处理需要语义判断的问题——语义重复代码、冗余测试、暴力修复、过度工程——但昂贵且概率性。不能在每个 Commit 运行。
- **两者都无法可靠捕获**高影响问题:误诊问题、过度工程和不必要功能、误解指令。

### 5.2 Architecture Fitness Harness (架构适配性 Harness)

将 Architecture Fitness Functions 概念引入 Harness:
- 前馈性能需求的 Skill,以及反馈 Agent 是否改进或退化了性能的性能测试
- 前馈可观测性编码规范(如日志标准)的 Skill,以及要求 Agent 反思可用日志质量的调试指令

### 5.3 Behaviour Harness (行为 Harness)

这是"房间里的大象"——如何引导和感知应用功能行为是否符合需求:
- **前馈**: 功能规格说明(从简短 Prompt 到多文件描述)
- **反馈**: 检查 AI 生成测试套件是否绿色、是否有合理的覆盖率、是否用 Mutation Testing 监控质量,然后结合手动测试

这种方法对 AI 生成测试有过多的信任。Approved Fixtures 模式在某些领域显示了好结果,但不是测试质量问题的全面答案。总体而言,对于功能行为的 Harness 仍有大量工作要做。

## 六、关键机制

### 6.1 Steering Loop (引导循环)

人的角色是**引导**(Steer) Agent,通过迭代 Harness。每当问题多次发生时,应改进前馈和反馈控制,使问题在未来更不可能发生,甚至被阻止。在引导循环中,也可以使用 AI 来改进 Harness——Agent 可以帮助编写结构测试、从观察模式生成草稿规则、搭建自定义 Linter 或创建操作指南。

### 6.2 Harnessability (可 Harness 性)

并非每个代码库都同样适合 Harness。用强类型语言编写的代码库天然具有类型检查作为 Sensor;明确定义的模块边界支持架构约束规则;像 Spring 这样的框架抽象了 Agent 甚至不需要担心的细节。

新项目(Greenfield)可以从第一天就把 Harnessability 烘焙进去——技术决策和架构选择决定了代码库的可治理性。遗留项目(Legacy),尤其是积累了大量技术债的应用,面临更困难的问题:Harness 最需要的地方恰恰最难构建。

### 6.3 Harness Templates (Harness 模板)

大多数企业有少数几种覆盖 80% 需求的常见服务拓扑——通过 API 暴露数据的业务服务、事件处理服务、数据仪表板。这些可能演变为 Harness 模板:一套将编码 Agent 束缚于拓扑结构、约定和技术栈的 Guide 和 Sensor。团队可能部分基于已有可用的 Harness 来选择技术栈和结构。

### 6.4 "Keep Quality Left"

传统 CI/CD 原则"将质量左移"在 Agent 时代获得了新意义。反馈传感器需要根据成本、速度和关键性分布在开发生命周期中。理想情况下,每个 Commit 状态都应该是可部署的。

## 七、开放问题

文章诚实地列出了尚未解决的问题:

- 如何在 Harness 增长过程中保持 Guide 和 Sensor 同步、不互相矛盾?
- 当指令和反馈信号指向不同方向时,Agent 能做出多好的权衡?
- 如果 Sensor 从未触发,是高质量的信号还是检测机制不足?
- 需要类似代码覆盖和 Mutation Testing 用于测试的方式来评估 Harness 覆盖率和质量
- 前馈和反馈控制目前分散在交付步骤中,有真正的工具化潜力来帮助配置、同步和推理它们作为一个系统

## 八、框架评价

### 优势

- **分类法最精密**: Guide/Sensor x Computational/Inferential 的两轴矩阵是目前最精细的 Harness 组件分类,为工程师提供了清晰的构建指南。
- **时间维度完整**: 7步生命周期 + 持续漂移/运行时传感器,从时间角度完整覆盖了 Harness 的部署位置。
- **三类 Harness 区分有用**: Maintainability / Architecture Fitness / Behaviour 的分类明确了不同维度的 Harness 具有不同的难度和成熟度。
- **Harnessability 概念重要**: 首次明确提出代码库本身的可治理性影响 Harness 效果,这是一个被低估的洞察。
- **诚实面对开放问题**: 明确承认 Behaviour Harness 仍未解决,列出了具体的未解问题。

### 不足

- **理论偏重,实践案例少**: 相比 Datadog 和 OpenAI 的框架,缺乏具体的生产数据和量化结果。
- **缺乏 Linter 错误消息设计指导**: 虽然多次提到"将自纠正指令嵌入 Linter 消息",但未给出具体的消息设计模式。
- **Harness Templates 概念过于前瞻**: 模板化仍处于概念阶段,未提供任何实际模板示例。
- **对多 Agent 场景讨论不足**: 框架主要聚焦单 Agent 场景,对 Multi-Agent Coordination 的 Harness 设计几乎没有涉及。
- **缺少成本效益分析**: 没有讨论构建完整 Harness 系统的成本与收益权衡,对企业决策支持有限。

---

*本文基于 Martin Fowler 网站公开文章整理分析,仅供参考。*
