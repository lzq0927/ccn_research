# 根技术 7：形式化验证兜底（Formal Verification Backstop via SMT）

> **一句话本质**：把 LLM 的"概率上对"升级成"数学上对"。当 Agent 涉及安全、隔离、合规时，结论必须能被 SMT 求解器证明，而不是被另一个模型"觉得对"。这是七层栈的保险层——决定最坏情况下的底线。

前 6 项根技术把诊断做到"尽量对、错了可逆、学了不歪"。本根技术处理**"绝对不能错"的那一类问题**——权限隔离、安全策略、合规约束——这里"大概率对"不够，需要**可证明的对**。

> **工程铁证**：AWS Automated Reasoning Group **每天 10 亿次 SMT 查询**，ZELKOVA 把 IAM 策略翻译成 SMT 公式做语义级验证。这不是实验室玩具，是产业级基础设施。

---

## 1. 理论谱系：形式化方法与神经符号

### 1.1 形式化验证（Formal Verification）

形式化验证用**数学证明**保证系统满足某性质，区别于测试（测试只能覆盖有限用例）。核心工具：

- **定理证明（Theorem Proving）**：Coq、Isabelle/HOL、Lean——人辅助、机器检查的严格证明。
- **模型检测（Model Checking）**：穷举状态空间验证时序性质（CTL/LTL）。
- **SMT 求解（Satisfiability Modulo Theories）**：自动判定一阶逻辑公式（带背景理论，如算术、数组、未解释函数）的可满足性——本根技术的主力。

SMT 适合验证"某个具体配置/策略是否满足某性质"，因为它能把问题编码成公式然后自动求解，不需要人写完整证明。

### 1.2 SAT/SMT 求解的原理

```
SAT（布尔可满足性）：给定布尔公式，是否存在变量赋值使其为真？
SMT（带理论的 SAT）：扩展到一阶逻辑 + 背景理论（线性算术、数组、位向量、字符串……）
```

SMT 求解器（Z3、CVC5、Boolector）的回答有三态：

- **SAT（可满足）**：存在赋值使公式为真 → 给出反例/模型。
- **UNSAT（不可满足）**：不存在 → 性质**被证明**成立。
- **UNKNOWN**：求解器在时限内无法判定。

关键：**UNSAT 是数学证明**。当 SMT 说"这条 IAM 策略不可能让外部主体访问该资源"（UNSAT），这不是"概率上不会"，而是"逻辑上不可能"——只要编码正确、求解器可信，结论就是绝对的。这是 LLM 的概率输出永远达不到的强度。

### 1.3 神经符号架构（Neuro-Symbolic）

把神经（LLM，擅长模式、生成、模糊匹配）和符号（SMT/逻辑，擅长严格推理、可证明）结合：

- **LLM 负责"软"部分**：理解自然语言、生成候选、解析多模态、与操作员交互。
- **SMT 负责"硬"部分**：验证 LLM 的输出是否违反硬约束（安全、隔离、合规）。

母文档指出，AWS 的这套是"神经符号架构的产业级实现，比学术界的 CausalTrace / MATMCD 走得更远"——因为 AWS 的 SMT 基础设施（每天 10 亿次调用）是现成的、摊薄了成本的，而学术界往往卡在 SMT 调用的规模与成本上。

### 1.4 为什么 Agent 特别需要形式化兜底

LLM 是概率系统，对"软"任务（生成假设、解析日志）足够好，但对"硬"任务（这条策略会不会泄露数据？这个配置变更会不会破坏租户隔离？）会**幻觉出错误的安全结论**——而这正是最不能错的地方。形式化验证作为兜底，意味着：

- LLM 可以大胆提建议（"我建议这样改 IAM"）。
- 但在执行前，SMT 强制验证（"这个改动数学上是否破坏隔离"）。
- SMT 说 UNSAT（安全）才放行；SAT（有反例，即存在泄露路径）就拒绝并给出反例。

这是 [05 写权限边界](05_写权限边界与强制回滚.md) 在安全敏感场景的"数学加强版"——不是人审，是数学审。

---

## 2. 它要解决的根本问题：概率结论在安全场景的不够用

### 2.1 "大概率安全"≠"安全"

一个 LLM 看了一条 IAM 策略，说"这条策略看起来没给外部访问权限，置信度 0.95"。问题：

- 0.95 不是 1.0——还有 5% 的概率它错了。
- 更糟：LLM 的置信度本身**不校准**（overconfident 是 LLM 通病），0.95 的实际正确率可能远低于 0.95。
- IAM 策略的语义很微妙（`NotResource`、`Condition`、`Principal: "*"` 的组合），LLM 经常在组合爆炸处出错——而正是这些组合处藏着安全漏洞。

安全场景的要求是"**证明不可能**"，不是"**看起来不会**"。这两者之间的鸿沟，SMT 来填。

### 2.2 ZELKOVA：IAM 策略到 SMT 的翻译（AWS 的代表作）

ZELKOVA（AWS，FMCAD 2018）把 IAM/资源策略翻译成 SMT 公式，然后用求解器回答"是否存在一个外部请求能访问该资源"：

```
策略文本（声明式） 
  → 翻译成一阶逻辑公式（principal/action/resource/condition 编码成谓词）
  → SMT 求解："∃ request. granted(request, resource) ∧ external(request) ?"
       UNSAT → 证明：没有任何外部请求能访问（隔离成立）
       SAT   → 反例：给出一个能访问的外部请求（隔离被破坏，附具体路径）
```

SAT 时给出的**反例**是 SMT 相比 LLM 的另一大优势——它不只说"不安全"，还给出**具体的攻击路径**（哪个 principal、用什么 action、在什么 condition 下能突破），直接可用于修复。

### 2.3 每天 10 亿次 SMT 查询（产业铁证）

AWS Automated Reasoning Group 公开数据：**每天 10 亿次 SMT 查询**（母文档引用 Amazon Science blog "A Billion SMT Queries a Day"）。这个数字的意义：

- SMT 不是"理论可行"，是"工程常态化"——AWS 把它做成了调用成本可忽略的基础设施。
- 规模摊薄了 SMT 的传统劣势（慢、贵）——每天 10 亿次意味着单次成本极低、求解极快（针对 IAM 这类受限理论，求解是毫秒级）。
- 这给"每次 LLM 输出都过一遍 SMT"提供了经济可行性——其它组织做不到，往往是因为没有这套规模化基础设施。

### 2.4 反模式：纯 LLM 合规检查

一个危险的做法：让 LLM 直接判断"这条配置合规吗"。问题同上——概率结论、组合爆炸处幻觉、不校准的置信度。AWS 在 Bedrock Guardrails 里明确拒绝这个方向，引入 **Automated Reasoning Checks** 作为 GenAI 合规的形式化兜底。

---

## 3. 机制内核：LLM 生成 + SMT 验证的回路

### 3.1 神经符号工作流

```
操作员/Agent 提出变更（自然语言或配置草案）
        │
        ▼
  [LLM] 理解意图、生成候选配置/策略、解析约束
        │
        ▼
  [编码器] 把候选 + 安全性质 翻译成 SMT 公式
        │   性质例如：∀ request. granted(request) → authorized(request)
        │             （任何被授予的访问都必须是经授权的）
        ▼
  [SMT 求解器] 判定
        │
        ├── UNSAT → 性质成立 → 放行（数学保证安全）
        │
        └── SAT   → 给反例 → 拒绝 + 回传反例给 LLM 
                    │
                    ▼
              [LLM] 基于反例修订候选 → 重新进回路（propose-verify-refine）
```

注意这个回路和 [08 CausalFusion](08_CausalFusion_AAAI2026.md) 的 propose-falsify-refine **同构**——都是"LLM 提案 + 形式化模块证伪 + 迭代精炼"。区别：CausalFusion 的证伪是统计的（图 vs 数据），这里的证伪是逻辑的（公式 vs 求解器）。

### 3.2 SMT 兜底的三个典型用例（AWS 实际部署）

| 用例 | 编码的性质 | 求解结果含义 |
|---|---|---|
| **IAM/资源策略审计** | "不存在外部主体的越权访问路径" | UNSAT=隔离成立；SAT=给出越权反例 |
| **网络隔离验证** | "租户 A 的流量不可能到达租户 B 的资源" | UNSAT=隔离；SAT=给出可达路径 |
| **Bedrock Guardrails 合规** | "GenAI 输出/配置不违反某合规规则" | UNSAT=合规；SAT=给出违规反例 |

### 3.3 编码：把工程问题翻成逻辑公式

SMT 兜底的有效性，90% 取决于**编码是否忠实**——编码错了一切皆错。IAM 的编码要点：

- 把 principal/action/resource/condition 编码成带约束的变量。
- 把策略语句的 Allow/Deny 语义编码成逻辑合取/析取。
- 显式编码"默认拒绝"（无显式 Allow 即拒绝）。
- 编码外部性（"外部"= 非账户内可信 principal 的集合）。

这是一门需要领域知识的工程，也是 ZELKOVA 这类工作的核心贡献——它给出了 IAM→SMT 的忠实编码方案。

### 3.4 UNSAT/SAT/UNKNOWN 三态的工程处理

- **UNSAT（性质成立）**：放行，记 [04 Journal](04_不可篡改证据链_Investigation-Journal.md)，附证明。
- **SAT（性质被违反）**：拒绝，回传反例给 LLM 修订；若反复修订仍 SAT，升级人审。
- **UNKNOWN（求解超时）**：**不放行**（保守），降级为人审 + 缩小问题规模重试。不能因为"求不出来"就默认放行。

---

## 4. 在 AWS 体系中的具体落地

| 产品/组件 | SMT 兜底的体现 |
|---|---|
| **ZELKOVA / Automated Reasoning Group** | IAM 与资源策略的语义级验证；每天 10 亿次调用。 |
| **AWS Provable Security** | 把形式化验证作为安全保证的产品化（多个服务的可证明安全属性）。 |
| **Bedrock Guardrails – Automated Reasoning Checks** | GenAI 合规的形式化兜底（把 SMT 用到 LLM 自己的输出/配置上）。 |
| **Agentic Automated Reasoning Group（2025 新设）** | 招聘信息证实 AWS 明确把 SMT 推向 Agent 场景——本根技术的产业化方向。 |
| **（与 DevOps Agent 的衔接）** | DevOps Agent 的 Mitigation 建议若涉及权限/隔离变更，可在执行前过 SMT 验证（母文档根技术 7 的描述）。 |

---

## 5. 工程实现清单

- [ ] **识别"硬约束"域**：明确哪些决策绝对不能错（权限、隔离、合规、资金、安全）——这些才值得 SMT 兜底；其余用概率手段即可（避免过度工程）。
- [ ] **忠实编码器**：为每个"硬约束"域构建工程问题→SMT 公式的编码器，并有测试集验证编码忠实性（编码错则一切错）。
- [ ] **性质规格**：把安全/合规要求写成形式化性质（∀/∃ 逻辑式），而非自然语言。
- [ ] **求解器选型与调优**：选合适的 SMT 求解器（Z3 通用、专用求解器更快）；针对受限理论调优（IAM 这类受限域可做到毫秒级）。
- [ ] **三态处理**：UNSAT 放行、SAT 拒绝并给反例、UNKNOWN 保守不放行；**绝不在 UNKNOWN 时默认放行**。
- [ ] **反例回路**：SAT 的反例回传给 LLM 修订（propose-verify-refine），迭代直到 UNSAT 或超限升级人审。
- [ ] **性能/成本预算**：把 SMT 调用做成低成本基础设施（缓存、增量求解、并行），支撑"每次都验证"的规模。
- [ ] **证明留痕**：UNSAT 的证明/求解日志写 [04 Journal](04_不可篡改证据链_Investigation-Journal.md)，形成"数学保证 + 推理链"双重记录。

---

## 6. 失效模式与边界

### 6.1 编码不忠实（最根本的失效）

SMT 只能证明"编码后的公式"满足性质，不能证明"原始工程问题"满足性质。若编码遗漏了某种访问路径（如某种 cross-account assume role 的边界情况），SMT 的 UNSAT 是**虚假保证**——它证明了错的东西。**对策**：编码器需严格测试（用已知漏洞回归）；编码变更需审查；对高风险性质，多编码器交叉验证。

### 6.2 求解器本身的信任根

SMT 结论依赖求解器正确。求解器有 bug → 结论错。**对策**：用成熟、广泛验证的求解器（Z3 经多年工业检验）；对极高安全要求，用独立求解器交叉验证关键结论。

### 6.3 UNKNOWN 与超时

复杂公式求解可能超时（SMT 是 NP-hard 及以上）。超时退化为 UNKNOWN，不能放行也不能确证。**对策**：限制编码复杂度（分而治之）、给超时降级路径（人审 + 缩小问题）、监控超时率（超时率高说明编码或求解器需优化）。

### 6.4 性质规格错误

性质写错了（要证明的根本不是真正想要的），SMT 证明一个错误性质毫无意义。"证明这条策略安全"——但"安全"的定义写漏了一条维度。**对策**：性质规格需领域专家审核；性质变更走变更管理流程。

### 6.5 适用域有限

SMT 适合**离散、可形式化、组合性**的问题（权限、隔离、协议）。不适合**连续、统计性、物理性**的问题（性能、容量、热力学）。强行用 SMT 验证不适合的问题，要么编码失真，要么求解爆炸。**对策**：明确 SMT 的适用边界，性能/容量类用统计因果（[02](02_结构因果先验_Topology-Graph.md)/[03](03_时间因果约束_Temporal-Causality.md)）而非 SMT。

### 6.6 与 LLM 的协作张力

LLM 生成的候选可能频繁被 SMT 打回（SAT），导致回路迭代多、成本高。**对策**：用 SMT 反例作为 LLM 的反馈训练信号（让 LLM 学会避免已知违反模式），减少迭代轮次；这正是 "Agentic Automated Reasoning" 方向的研究空间。

---

## 7. 可迁移性：网络 / 系统场景

- **网络隔离/分段验证**：把网络 ACL、安全组、路由策略编码成 SMT，验证"租户 A 流量不可达租户 B"——这是 SMT 在网络场景最直接的应用，与 IAM 验证同构。
- **路由策略冲突检测**：BGP/路由策略的组合是否产生黑洞/环路——可编码为可达性性质用 SMT/模型检测验证。
- **配置一致性**："声明态配置 vs 实际转发行为"是否一致——编码双语义用 SMT 判定等价性。
- **协议实现验证**：协议状态机的关键性质（无死锁、活锁自由）——模型检测的经典应用。

迁移成本高：核心难点是**忠实编码器**的构建（需要网络协议/设备的形式化建模能力）。但一旦编码器就位，验证本身可规模化（与 AWS 每天 10 亿次同理）。网络场景的离散性（拓扑、ACL、策略）使其天然适合 SMT，是本根技术的高价值迁移域。

---

## 8. 与其他根技术的耦合

| 关系 | 说明 |
|---|---|
| ← [01 反证优先](01_反证优先_Falsification-First.md) | SMT 是反证的极端形式——不是"概率上不太对"，而是"数学上可证伪/可证明"。SAT 反例就是最硬的反证。 |
| → [05 写边界](05_写权限边界与强制回滚.md) | SMT 是写边界在安全敏感场景的"数学审"——给人审加一道形式化前置过滤。 |
| → [06 ERRORPROBE](06_可验证情景记忆_ERRORPROBE.md) | SMT 的 UNSAT 是"可执行证据"的极端形式（数学证明是最强验证）；可作为记忆门控的最高级证据。 |
| ↔ [08 CausalFusion](08_CausalFusion_AAAI2026.md) | 两者都是"LLM 提案 + 形式化证伪 + 迭代"的神经符号回路；SMT 用逻辑证伪，CausalFusion 用统计证伪。 |

---

## 9. 一句话回到本质

> **LLM 是概率系统，永远会偶尔错；但安全、隔离、合规这类问题"偶尔错"等于灾难。SMT 兜底把这类问题的判定从"概率对"升级到"数学证明对（UNSAT）或给出确切反例（SAT）"。AWS 每天 10 亿次调用证明这不是奢侈品，而是可靠性栈里被学术界严重低估的产业级根技术。**

---

## 10. 文献

- de Moura & Bjørner (2008), "Z3: An Efficient SMT Solver" —— Z3（AWS 内部及业界主力 SMT 求解器）。
- **ZELKOVA: Semantic-based Automated Reasoning for AWS Access Policies**（FMCAD 2018）—— IAM→SMT 翻译的代表作。PDF: [UCL mirror](http://www0.cs.ucl.ac.uk/staff/b.cook/FMCAD18.pdf)。
- [A Billion SMT Queries a Day (Amazon Science)](https://www.amazon.science/blog/a-billion-smt-queries-a-day) —— 每天 10 亿次 SMT 调用的工程铁证。
- [Automated Reasoning Checks in Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/how-automated-reasoning-checks-in-amazon-bedrock-transform-generative-ai-compliance/) —— SMT 用到 GenAI 合规的产品化。
- [AWS Provable Security](https://aws.amazon.com/security/provable-security/) —— 形式化安全保证的产品集。
- [Applied Scientist, Agentic Automated Reasoning Group（招聘信息）](https://amazon.jobs/en/jobs/10433609/applied-scientist-agentic-automated-reasoning-group) —— 2025 年 AWS 把 SMT 明确推向 Agent 方向的证据。
