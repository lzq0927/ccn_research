# deepset (Haystack) -- 四类失败分类法 + 改进循环框架

> 来源: https://www.deepset.ai/blog/harness-engineering

## 一、框架概述

deepset (Haystack 框架的开发者) 提出的 Harness Engineering 框架以其"四类失败分类法"和"改进循环"方法论为核心。该框架的独特价值在于它不仅描述了 Harness 的构成,更提供了一个系统化的诊断-修复流程,使团队能够将模糊的"Agent 搞砸了"对话转化为有针对性的 Harness 更新。deepset 的文章从 Haystack 开源框架的实际架构出发,将理论与实践紧密结合。

## 二、核心定义

deepset 的定义中有一个比其他框架更深刻的洞察:

> "Harness 不只是支持模型,它**根本性地改变了模型被要求解决的任务**。"

考虑一个无辅助的语言模型面临的挑战:
- 在有限的上下文窗口中保存所有相关历史
- 每次运行都从零开始重建正确的方法
- 通过自由格式生成来弄清如何与外部工具交互

一个设计良好的 Harness 将这些问题转化为模型能更可靠处理的形式。这是 Harness 设计的核心工程洞察。

## 三、三种认知工作的外部化

deepset 指出,生产级 Agent 在三个维度上一致性地失败,每一个都指向模型被要求在内部管理的、可以外部化到 Harness 中的认知工作:

### 3.1 State over Time (时间上的状态)

推理调用是无状态的,除非外部状态由周围系统持久化。每个会话从空白开始。没有外化记忆,Agent 没有之前运行中发生的事情的记录。

Harness 将**回忆问题转化为检索问题**:不再要求模型记住,你要求它阅读。这是一个更容易的任务,这就是为什么精心设计的记忆系统即使底层模型不变也能提高可靠性。

### 3.2 Procedural Expertise (程序性专长)

一个有能力的模型可能原则上知道如何做某事,但可靠执行需要一致地遵循正确的步骤、正确的顺序、正确的默认值和约束。

将这些专长拆分为显式技能(Skills)——描述一类任务应如何执行的可复用指令工件——将**即兴生成转化为引导执行**。模型停止发明工作流,开始遵循一个。

### 3.3 Interaction Structure (交互结构)

每当 Agent 需要调用工具、委派给另一个 Agent 或向用户展示结果时,它必须弄清如何操作——正确的格式、正确的 Schema、正确的生命周期语义。

在 Harness 中形式化这些合约,将**脆弱的即兴协调转化为结构化的、受治理的交换**。同时也使交互可审计:出了问题时,你可以确切看到调用了什么、用了什么参数、返回了什么。

## 四、Harness 作为统一层

关键洞察:Harness 不是与 Memory、Skills、Protocols 并列的第四个模块。它是**协调所有三个与模型协同工作的层**。

- **Memory** 积累经验但不决定当前什么相关
- **Skills** 编码任务如何完成但需要在正确时刻加载并绑定到实际工具
- **Protocols** 管理交互但需要在每个 Agent 动作中一致执行

Harness 运行 Agent 循环,管理 Memory 检索和 Skill 加载竞争的上下文预算,强制执行 Protocol 调用受制于的权限,浮现代理可调试和改进整个系统的追踪。没有它,你有有用的组件但不能组成可靠的 Agent。有了它,每个组件使其他组件更有效。

## 五、四类失败分类法

这是 deepset 框架的核心贡献——一个将 Agent 失败分类为四种类型的系统:

### 5.1 Context Failure (上下文失败)

**表现**: Agent 在需要时没有正确的信息。它幻觉了数据库 Schema 因为没有被提供,或者因为对话历史溢出上下文窗口而失去了目标追踪。

**修复方向**: Context Engineering 层——检索逻辑、内存管理、或如何构建模型在每一步看到的内容。

### 5.2 Constraint Failure (约束失败)

**表现**: Agent 有信息但做了不该做的事。它重写了范围外的文件、忽略了架构边界、或调用了不需要的工具。

**修复方向**: 护栏(Guardrails)——权限边界、Linter 规则、范围限制,使不良操作在结构上不可能再次发生。

### 5.3 Verification Failure (验证失败)

**表现**: Agent 产生了看似合理但实际错误的输出,而且没有东西捕获它。

**修复方向**: 反馈循环——测试套件、格式验证器、或一个作为审查者的第二模型(LLM-as-judge),在输出最终确定前运行。

### 5.4 Planning Failure (规划失败)

**表现**: Agent 完全采用了错误的方法。它试图一步解决需要五步的问题,或者走入死胡同路径并在同一损坏策略上循环。

**修复方向**: 编排逻辑(Orchestration)——将任务分解为更小步骤、添加子 Agent 委派、或引入环检测,在重复失败尝试后推动 Agent 重新考虑方法。

## 六、改进循环:Run -> Observe -> Classify -> Update -> Repeat

deepset 提出了一个持续改进循环:

```
Run (运行) -> Observe (观察) -> Classify (分类) -> Update (更新) -> Repeat (重复)
```

**Run**: 在真实任务上运行 Agent
**Observe**: 观察失败发生的位置(需要结构化追踪)
**Classify**: 使用四类分类法将失败归类
**Update**: 针对性地更新 Harness 的对应层
**Repeat**: 每个循环使环境更智能,即使模型保持不变

核心原则:**Harness 迭代比模型升级交付更大的可靠性提升,且成本只是其一小部分。**

## 七、Haystack 实现映射

deepset 将 Harness 的每个维度映射到 Haystack 框架的具体实现:

### 7.1 Progressive Tool Disclosure

`SearchableToolset` 实现渐进式披露——Agent 启动时只有一个 `search_tools` 函数,只加载实际需要的工具的完整定义。Jinja2 模板化的系统和用户提示使上下文构建显式且可跨运行复用。

### 7.2 ConfirmationStrategy

`ConfirmationStrategy` API 允许表达细粒度的审批策略:对特定工具询问一次后信任,对变更生产状态的操作始终要求审批,对只读操作从不中断。

### 7.3 OpenTelemetry + Langfuse

内置的 OpenTelemetry 和 Langfuse 集成自动检测每个管道组件,提供执行追踪以准确诊断哪一层断裂以及原因。Agent 断点将完整快照持久化到磁盘,使失败的运行成为可调试的工件而非丢失的对话。

### 7.4 Pipeline YAML

管道序列化为 YAML 用于可复现的配置。Harness 配置是版本控制中可审查的工件,可在 Pull Request 中 Diff,通过 CI 部署,由不读 Python 的人检查。

### 7.5 子 Agent 隔离

Haystack 支持将 Agent 用作其他 Agent 的工具。主编排器将子任务委派给在隔离上下文窗口中运行的专业子 Agent。父 Agent 只看到最终结果,而非中间噪声。

### 7.6 多模型路由

Haystack 与 OpenAI、Anthropic、Mistral、Cohere、Hugging Face、Azure、AWS Bedrock 和本地模型集成。可以为不同管道步骤分配不同模型,无需重写系统——高推理模型用于规划,较小模型用于验证,快速本地模型用于数据提取。

## 八、关键数据

**Terminal Bench 结果**: Harness-only changes (仅修改 Harness 不改变模型) 将 Agent 在排名上移动了 **20+ 个位置**。独立分析发现,同一模型在不同 Harness 内运行产生截然不同的性能——不是因为模型改变了,而是因为周围基础设施改变了。

## 九、Context Engineering vs Harness Engineering

deepset 明确了两者的关系:**嵌套的,而非竞争的**。

- **Context Engineering** 管理模型在任何给定时刻看到的内容:检索哪些文档、如何组装对话历史、哪些工具定义在范围内
- **Harness Engineering** 涵盖所有这些,再加上系统如何**随时间**运行——跨会话持久化的记忆、编码递归任务如何处理的技能、管理每个外部交互的协议,以及将所有内容联系在一起的循环逻辑

正确的上下文没有 Harness 给你一个孤立推理良好但在真实任务上漂移的模型。好的上下文没有 Harness 给你坚实基础设施但喂给模型错误信息。**两者都需要**。

## 十、框架评价

### 优势

- **四类失败分类法**: 是目前最实用的诊断工具。它将模糊的"Agent 出问题了"转化为有针对性的修复行动,直接指导工程投资方向。
- **改进循环方法论**: 提供了一个可持续运作的团队实践框架,强调 Harness 是"活系统"而非一次性配置。
- **Haystack 实现映射**: 为每个抽象概念提供了具体的开源实现参考,降低了采纳门槛。
- **Context/Harness 关系清晰**: 明确了两者的嵌套关系,避免了概念混淆。
- **Memory/Skills/Protocols 三维度**: 三种认知工作外部化的分析框架为 Harness 设计提供了清晰的架构指导。

### 不足

- **四类分类有重叠**: 在实践中,某些失败可能同时属于多个类别(如 Planning Failure 导致 Context Failure),分类边界有时模糊。
- **缺少定量指标**: 虽然引用了 Terminal Bench 数据,但框架本身没有提供衡量 Harness 质量的具体指标。
- **Haystack 偏向**: 文章后半部分实质上是 Haystack 产品文档,降低了分析的一般性。
- **对企业治理讨论不足**: 虽然提到了 Enterprise Platform 的 RBAC 和审计能力,但未深入讨论合规性场景下的 Harness 设计。
- **缺少多 Agent 协调的深度讨论**: 与 Firecrawl 框架的三种架构模式相比,deepset 在多 Agent 协调方面的讨论较为浅显。

---

*本文基于 deepset 公开博客内容整理分析,仅供参考。*
