# Martin Fowler — Guide/Sensor两轴分类 + 三类Harness框架

**来源**: https://martinfowler.com/articles/harness-engineering.html
**日期**: 2026-06-05

---

## 一、核心定义

Martin Fowler将Agent定义为 **Model + Harness** 的组合体，并提出了三层同心圆模型：

| 层次 | 名称 | 职责 |
|------|------|------|
| 内层 | **Model** | 纯推理能力，无任何外部约束 |
| 中层 | **Builder Harness** | 开发者构建Agent时使用的Harness——linters、测试、CI pipeline |
| 外层 | **User Harness** | 最终用户与Agent交互时的Harness——UI约束、权限、审批流程 |

Fowler特别强调：Builder Harness和User Harness有不同的设计目标和评估标准。Builder Harness追求代码质量和架构健康，User Harness追求用户体验和业务安全。两者需要独立设计和演进。

---

## 二、两轴分类法

Fowler提出了一个优雅的两维分类框架，将所有Harness机制映射到一个二维空间：

### 方向轴：Guide vs. Sensor

- **Guide（前馈控制）**：在Agent行动之前就施加约束，预判并引导Agent的行为。Guide是主动的、预防性的——它通过提供规则、模板和流程定义来减少Agent犯错的可能性。
- **Sensor（反馈控制）**：在Agent行动之后观察结果，检测并纠正偏差。Sensor是被动的、反应性的——它通过测试、审查和监控来发现Agent已经犯的错误。

### 执行轴：Computational vs. Inferential

- **Computational（确定性计算）**：基于确定性算法的检查，执行快速（CPU级），结果确定。例如：语法检查、类型检查、依赖分析。Computational机制的优点是速度快、结果可靠、无假阴性。
- **Inferential（语义推理）**：基于语义理解的检查，需要AI/LLM参与（GPU级），速度较慢，结果有概率性。例如：代码审查Agent、架构符合性评估、安全漏洞语义分析。

这四个象限组合产生四种Harness机制类型：Computational Guide（如Linters）、Computational Sensor（如测试套件）、Inferential Guide（如AI编码规范建议）、Inferential Sensor（如AI代码审查）。

---

## 三、7步发布生命周期

Fowler将软件发布过程映射为一个7步生命周期，每一步都对应特定的Harness机制：

### 步骤1：集成前前馈（Pre-integration Feedforward）

在代码进入版本控制之前的Guide阶段：
- **Linters**：自动化的代码风格和静态分析检查。
- **快速测试**：单元测试的快速子集，几秒内完成。
- **基础代码审查Agent**：Inferential Guide，对代码质量提供即时反馈。

### 步骤2：第一次自纠正循环（First Self-correction Loop）

Agent根据步骤1的反馈自动修复问题，然后重新检查：
- **eslint/semgrep**：Computational Sensor，检测代码规范和安全问题。
- **coverage检查**：验证测试覆盖率是否达标。
- **dependency cruiser**：检查模块依赖是否符合架构规则。

### 步骤3：人工审查作为额外反馈传感器

人类审查者作为"Inferential Sensor"提供Agent无法自动生成的反馈：
- 业务逻辑正确性验证
- 代码可读性和意图清晰度评估
- 边界条件和异常处理审查

### 步骤4：集成（Integration）

代码合并到主分支，触发完整的CI pipeline。

### 步骤5：Pipeline重跑所有传感器 + 昂贵传感器

CI阶段运行所有Computational Sensor，加上步骤1-3中因成本原因跳过的"昂贵传感器"：
- **架构审查**：Inferential Sensor，评估变更对整体架构的影响。
- **变异测试**：通过注入变异来评估测试套件的有效性。
- **完整的端到端测试**：验证系统级行为。

### 步骤6：持续漂移传感器（Continuous Drift Sensors）

代码合并后持续运行的监控机制：
- **死代码检测**：识别不再被引用的代码。
- **依赖扫描**：检测过时或有安全漏洞的依赖。

### 步骤7：持续运行时反馈（Continuous Runtime Feedback）

生产环境中的Sensor反馈：
- **SLO监控**：服务级别目标的持续监控。
- **响应质量采样**：对Agent的输出进行持续的质量评估。

---

## 四、三类Harness框架

### 4.1 Maintainability Harness（可维护性Harness）

**目标**：确保代码的长期可维护性。
**特点**：最容易实现，工具生态最成熟。
**核心机制**：Linters、格式化工具、依赖分析、代码复杂度检查。
**关键洞察**：这是大多数团队应该首先部署的Harness类型，因为它投入产出比最高。

### 4.2 Architecture Fitness Harness（架构适配Harness）

**目标**：确保代码变更不违反架构约束。
**特点**：基于Fitness Functions——对架构特征的客观评估函数。
**核心机制**：依赖方向检查（如确保业务层不依赖UI层）、模块边界验证、循环依赖检测、部署独立性验证。
**关键洞察**：Fitness Functions将架构原则从文档中的"建议"转化为可自动执行的"法律"。

### 4.3 Behaviour Harness（行为正确性Harness）

**目标**：确保Agent的行为符合预期。
**特点**：最难实现，因为它不仅需要正确的行为规约，还需要处理Agent输出的不确定性。
**核心机制**：形式化规格（Specs）、AI测试套件、手动测试、用户反馈回路。
**关键洞察**：行为Harness是最重要的但也是最后成熟的。Fowler建议从简单的Acceptance Tests开始，逐步增加Inferential Sensor的比例。

---

## 五、关键机制

### Steering Loop（转向循环）

当同一个问题反复出现时，表明当前的Guide和Sensor不足以防止该问题。此时不应继续修补，而应启动Steering Loop——分析问题的根因，改进Guide（在事前预防）和Sensor（在事后检测），形成更强大的Harness层。

### "Keep Quality Left"原则

质量应该尽可能早地在开发流程中（"左侧"）被保证，而非依赖后期的审查和测试。每一步向右移动，修复成本呈指数增长。

### Harnessability

代码和架构的"可Harness性"——设计时应考虑Harness机制的接入能力。例如，结构化的日志比自由文本日志更容易被Sensor监控；显式的类型声明比动态类型更容易被Guide检查。

### Harness Templates

将成功的Harness配置封装为可复用的模板，降低团队间复制最佳实践成本。

---

## 六、开放问题

Fowler坦诚地指出Harness Engineering仍处于早期阶段，以下问题尚未解决：

- **Harness一致性**：不同团队的Harness标准如何统一？
- **Agent信任冲突**：当Guide和Sensor给出矛盾的建议时，Agent应该信任谁？
- **Harness Coverage度量**：如何量化Harness的覆盖率和有效性？

---

## 七、框架评价

### 优势

- **两轴分类法**为Harness机制提供了系统化的分类框架，帮助团队理解不同机制的定位和价值。
- **7步发布生命周期**将Harness无缝嵌入到现有的软件开发流程中，降低了采纳阻力。
- **三类Harness的分层**提供了清晰的实施路径——从最容易的Maintainability开始，逐步扩展到Architecture Fitness和Behaviour。
- **Steering Loop**概念将Harness从静态工具提升为动态进化的系统。

### 不足

- **两轴分类**虽然优雅，但某些Harness机制可能难以明确归类——例如HITL既可以是Guide也可以是Sensor。
- **对Inferential机制的讨论**偏概念性，缺少具体的实现指导和成本分析。
- **三类Harness的边界**在某些场景下模糊——Architecture Fitness和Maintainability有大量重叠。
