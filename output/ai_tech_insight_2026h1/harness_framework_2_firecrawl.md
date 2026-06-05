# Firecrawl -- Agent Harness 两阶段生命周期 + 四组件架构

> 来源: https://www.firecrawl.dev/blog/what-is-an-agent-harness

## 一、框架概述

Firecrawl 的 Agent Harness 框架以其工程实践性和对失败模式的系统性分析著称。文章作者 Ninad Pathak 从 Mitchell Hashimoto 2026年2月的博文出发,结合 OpenAI 的百万行代码实践,构建了一个以"两阶段生命周期"和"四组件架构"为核心的 Harness 框架。该框架的独特之处在于它不仅描述了 Harness 应该是什么,更深入分析了没有 Harness 时 Agent 会如何失败,并提供了三种可选的架构模式。

## 二、核心定义

### 2.1 基础定义

Agent Harness 是围绕 AI 模型的软件基础设施,管理模型实际推理之外的一切事务。它充当 LLM 与外部世界之间的中介,处理工具执行、内存存储、状态持久化和错误恢复。

### 2.2 Anthony Alcaraz 的定义

Anthony Alcaraz,《Agentic Graph RAG》(O'Reilly)作者,给出了一个更为学术化的定义:

> "管理上下文生命周期的完整架构系统:从意图捕获到规范、编译、执行、验证和持久化"——覆盖除 LLM 本身之外的一切。

### 2.3 Anthropic 工程团队的描述

Anthropic 自身工程团队将 Claude Agent SDK 描述为:

> "一个强大的、通用的 Agent Harness,擅长编码以及其他需要模型使用工具来收集上下文、规划和执行的任务。"

SDK 处理上下文压缩(Context Compaction)、工具分派(Tool Dispatch)、会话管理(Session Management)和进度追踪(Progress Tracking)。Claude 提供推理,SDK 提供其他一切。

## 三、为什么需要 Harness:六种失败模式

Firecrawl 文章系统性地归纳了没有 Harness 时 Agent 的六种失败模式:

### 3.1 状态丢失 (State Loss)

LLM 天生是无状态的。每次新会话从零开始,没有之前运行的记忆。这好比一个软件项目中每个工程师对之前完成的工作一无所知。

### 3.2 一次性尝试 (One-shot Failure)

Agent 试图一次性完成所有工作,在实现过程中耗尽上下文,留下半成品代码库,下一次会话浪费 Token 猜测之前做了什么。

### 3.3 假成功 (False Success)

后续会话在看到部分进度后,不验证任何东西是否真正工作,就宣布任务完成。

### 3.4 上下文腐烂 (Context Rot)

上下文窗口充满了工具输出、历史记录和先前的推理。随着填充,模型失去对原始指令的跟踪。即使有 200K+ Token 窗口,密集的上下文中部内容也会被忽略。Stanford 的 Liu et al. (2023) "Lost in the Middle" 研究证实了这一现象。

### 3.5 幻觉工具调用 (Hallucinated Tool Calls)

没有验证时,Agent 会以错误的参数类型调用函数或引用不存在的 API。没有 Harness 拦截调用,它会浪费 Token 反复尝试同样损坏的调用。

### 3.6 失败时状态丢失 (Lost State on Failure)

任何网络超时或服务器重启都会清除内存中的进度。下一次会话从零开始。

## 四、两阶段生命周期

Firecrawl 框架的核心是"两阶段生命周期"模型:

### 4.1 初始化阶段(运行一次)

在项目启动时运行一次,完成以下工作:
- **环境搭建**: 创建文件夹结构、配置开发环境
- **结构化任务列表**: 将项目分解为有序的、可追踪的任务
- **版本控制初始化**: 建立初始 Git 提交
- **Progress File**: 编写一个进度文件,供未来会话读取

### 4.2 执行阶段(循环运行)

每次会话重复执行以下循环:
- **加载状态**: 读取 Progress File 和 Git 历史
- **选择下一个未完成任务**: 从结构化任务列表中选取
- **增量工作**: 对选定任务进行增量开发
- **保存进度**: 更新 Progress File,提交 Git,记录完成状态

关键洞察:没有会话需要知道之前发生了什么,因为 Harness 将知识外化到文件和提交历史中。

### 4.3 Interception Loop (拦截循环)

当模型输出工具调用时(如 `search("competitive pricing")` 或 `bash("npm test")`),Harness:
1. **拦截**该调用
2. **验证**参数
3. 在沙箱中**执行**
4. **清洗**输出
5. 将结果**注入**回上下文

模型永远不直接触碰外部系统。

## 五、四大核心组件

### 5.1 Tool Integration Layer (工具集成层)

定义 Agent 在世界中的能力:文件读写、代码执行、数据库查询、API 调用和 Web 访问。Harness 暴露可调用函数,在执行前验证调用,返回清洗后的结果。

### 5.2 Memory + State Management (内存与状态管理)

Harness 管理三种内存类型:
- **Working Context** (工作上下文): 即时提示,临时的
- **Session State** (会话状态): 当前任务的持久日志
- **Long-term Memory** (长期记忆): 跨任务的知识,可以是向量存储、结构化文件或内存层

Anthropic 团队发现 **JSON 比 Markdown 更适合**特性追踪文件——模型不太可能意外覆盖或重新格式化 JSON。

Sarah Wooders (Letta 联合创始人) 的观点:记忆不是插件,它就是 Harness。关键设计问题是:记忆存放在哪里,谁拥有它,会话之间持久化什么,Agent 如何检索它?这些不是模型问题,而是 Harness 必须回答的工程问题。

### 5.3 Context Engineering + Compression (上下文工程与压缩)

在每次模型调用时,Harness 决定包含什么、压缩什么:
- **Compaction**: 将旧对话历史总结为精简笔记
- **Context Retrieval (RAG)**: 仅拉取当前步骤相关的文档,而非预先加载所有内容
- **边界优先定位**: 基于"Lost in the Middle"研究,将最重要的上下文放在提示边界

### 5.4 Verification + Guardrails (验证与护栏)

生产级 Agent Harness 在将工作视为完成之前先验证输出:
- **测试套件**: 编码 Agent 在每个特性后运行测试,只有通过才标记完成
- **Human-in-the-Loop**: 对于写入生产数据库或发送外部通信等敏感操作,实施人工中断
- **浏览器测试**: 使用 Puppeteer 等工具进行基于浏览器的测试,捕获代码无法察觉的 Bug

## 六、三种架构模式

### 6.1 单 Agent Supervisor

一个模型在循环中使用工具、内存和验证。Harness 管理初始化、上下文注入、工具分派、状态持久化和清理。适用于有界任务,如带有知识库和工单系统的客户支持 Agent。

### 6.2 Initializer-Executor Split

Anthropic 记录的长时间编码任务方法:
- **Initializer** 运行一次,设置持久项目环境(文件夹结构、特性列表、init.sh、初始 Git 提交)
- **Executor** 会话读取环境,对一个特性增量工作,运行测试,提交,更新进度文件,干净退出
- 项目环境是所有会话的共享内存

### 6.3 Multi-Agent Coordination

对于复杂项目,Harness 分派专家 Agent(研究员、编写者、审查者),管理交接,使每个 Agent 获得上一步的相关上下文而不含不相关历史。

**关键数据:ICML 2025 论文** "General Modular Harness for LLM Agents in Multi-Turn Gaming Environments" 用可分离的感知、记忆和推理模块在 GPT-4 级模型上测试了这一模式。**有 Harness 的模型在所有测试游戏中一致优于无 Harness 的同一模型**。

## 七、Harness vs Framework vs Orchestrator

| 概念 | 核心职责 |
|------|---------|
| Agent Framework | 构建 Agent 的库和抽象 (LangChain, LlamaIndex) |
| Agent Harness | 用工具、内存和状态管理执行 Agent 的运行时系统 |
| Orchestrator | 决定何时以及如何调用模型的控制流 |

**关键关系**: Framework 提供组件;Harness 将它们组装成具有默认值和集成的运行系统;Orchestrator 决定模型调用的序列。Harness 提供这些调用使用的能力:工具、内存、上下文。

## 八、关键数据点

- **Claude Code SDK**: 超过 512,000 行代码,是一个随模型能力增强而持续增长的 Harness,而非缩小。Harrison Chase (LangChain 创始人) 认为:更好的模型扩展了 Harness 需要做的事情,而非取代对它们的需求。
- **ICML 2025 游戏研究**: 在所有测试游戏中,Harness 启用 vs 禁用时,同一 GPT-4 级模型的一致性能提升,无需更改模型权重或提示。
- **OpenAI 实践**: 3人团队使用 Harness Engineering 产出百万行代码,每天 3.5 PRs/engineer,零手写代码。

## 九、框架评价

### 优势

- **失败模式分析最全面**: 六种失败模式的归纳是各框架中最系统的,为诊断现有系统问题提供了清晰检查清单。
- **两阶段生命周期模型**: 简洁而实用,直接可操作,特别适合长周期编码任务。
- **架构模式分级**: 三种模式的渐进复杂度为不同规模团队提供了明确选择。
- **实证数据支撑**: 引用 ICML 2025 论文和 Anthropic 实验数据,增强了说服力。

### 不足

- **工具层偏向**: 作为 Firecrawl (Web 抓取工具) 的文章,对 Tool Integration Layer 的讨论有明显的自我推广倾向。
- **缺少形式化验证层**: 与 Datadog 框架相比,缺乏 DST、TLA+ 等深层验证方法的讨论。
- **对 Context Engineering 的讨论偏浅**: 虽然提到了 Compaction 和 RAG,但未深入探讨具体的 Token 预算分配策略。
- **Memory 移植性问题**: 虽然提出了 Memory portability 的担忧,但未给出具体解决方案。

---

*本文基于 Firecrawl 公开博客内容整理分析,仅供参考。*
