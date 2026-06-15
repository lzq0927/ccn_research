# 根技术 1：反证优先于证实（Falsification-First）

> **一句话本质**：诊断不是"找一个支持证据就停"，而是"穷尽反证，剩下的才是根因"。一条反证 ≫ 一堆证据。

这是七层根技术栈的**认识论基石**，也是 AWS DevOps Agent 博客开篇直接抨击 LLM 默认行为（confirmation bias）的落点。把它看懂，后面 6 项都是它在不同维度上的工程投影。

---

## 1. 理论谱系：从 Popper 到 SRE

### 1.1 Karl Popper 的可证伪主义

**核心命题**：一个理论是"科学的"，当且仅当存在能反驳它的可能观察。不是"能被多少证据支持"，而是"能被怎样的观察打倒"。

- **划界标准（demarcation criterion）**：可证伪性区分科学与非科学。"所有天鹅都是白的"是科学的，因为发现一只黑天鹅就能推翻它；"市场总会回归合理估值"不是，因为任何结果都能被事后解释。
- **归纳问题（Hume）**：观察到一万只白天鹅，也无法逻辑地推出"所有天鹅是白的"——归纳法无法产生必然真理。Popper 的回应是：放弃归纳，改用**演绎式反驳**。

### 1.2 证伪与证实的不对称性（这是根技术的数学根）

```
证实（confirmation）：观察 1000 个正例  ──┐
                                          ├──> 无法证明 H 成立（归纳不闭合）
                                          │
证伪（falsification）：观察到 1 个反例  ──┴──> 可以否证 H 成立（modus tollens，演绎闭合）
```

形式上：

- 证实走的是归纳（induction），永远不闭合：`P(H | E₁,...,Eₙ) < 1`，再多证据也到不了 1。
- 证伪走的是**否定后件（modus tollens）**，逻辑闭合：若 `H → e`，观察到 `¬e`，则 `¬H` 必然成立。

> **这就是为什么 AWS 的判决规则是"单条反证 → 直接淘汰"——它在用一条逻辑闭合的链，对抗一堆逻辑不闭合的链。** 这不是工程偏好，是逻辑结构决定的。

### 1.3 与"排除式归纳"的会合

Popper 并非孤鸣。科学方法论里早有同源的"排除式归纳"传统：

- **Francis Bacon**：真正的归纳不是数正例，而是排除竞争假设（"排除表 / 表征否定的事例"）。
- **John Stuart Mill 的求异法（Method of Difference）**：若 A 出现则 a 出现、A 不出现则 a 不出现，且其余条件相同 → A 是 a 的原因。求异法的本质就是**用反例排除**。

AWS 的反证检验，是把这条 19 世纪的逻辑线，重新装配到 21 世纪的 LLM Agent 上。

---

## 2. 它要解决的根本问题：LLM 的确认偏误

### 2.1 为什么 LLM 天然倾向"证实"

LLM 的训练目标是下一个 token 的概率最大化。这带来一个结构性的偏置：

- **生成方向**：模型擅长顺着给定上下文"接着编"，而不是"找茬打倒"。给定"假设是数据库连接池耗尽"，模型倾向于生成支持这个假设的证据描述，而不是去找反证。
- **检索方向**：RAG 系统常以"找支持证据"为目标构造查询，进一步放大这种偏置。
- **上下文惯性**：一旦某个假设进入 context，模型会不断"合理化"它（类似 anchoring bias）。

这正是认知心理学 **Wason 选择任务（1960）**揭示的人类同款偏误：人会自发地去**确认**自己的假设，而不是去**证伪**它。

### 2.2 AWS 博客的原话（值得逐字记）

> "Confirmation bias 是 incident 拖长的头号原因——on-call 找到一个支持证据就停了。"

并据此给出 DevOps Agent 的设计目标：

> "validates multiple hypotheses simultaneously, testing each against both supporting **and counter-evidence** before surfacing them to operators."

把"and counter-evidence"加粗——这是整套机制的眼。**LLM 默认只做前半句（supporting），后半句（counter-evidence）必须由体系强制注入。**

### 2.3 反模式：confirmation-biased RCA 长什么样

一个典型的、失败的 LLM RCA 流程：

```
告警（checkout 延迟） 
  → LLM："看起来像支付网关问题"（因为模式匹配） 
  → 检索："支付网关慢吗？" → "是的，慢了"（支持证据 ✓） 
  → 输出："根因：支付网关慢" ← 置信度 0.9，结束
```

这个流程的问题：它**从来没问过反方向的问题**——"支付网关是先慢的，还是 checkout 先慢的？" 一旦问出这个问题（根技术 3 时间因果），整个结论立刻被推翻。反证优先，就是强制体系在"找到支持证据"之后，**继续走**而不是"停止"。

---

## 3. 机制内核：把证伪做成流水线

### 3.1 AWS 的判决规则（必须看清的三条）

来自母文档的电商 checkout 案例：

| 规则 | 含义 | 逻辑依据 |
|---|---|---|
| **单条反证 → 直接淘汰** | asymmetric：反证权重 ≫ 支持证据 | modus tollens 闭合；归纳不闭合 |
| **多条支持 + 零反证 → 收敛为根因** | 不是"被证明"，而是"未被证伪且证据充分" | Popper 的"corroboration"（被严峻检验淬炼过） |
| **支持与反证并存 → 标记 hypothesis** | 显式承认不确定，交还给人 | 命题被部分证伪，降级而非淘汰 |

最后一条尤其重要：**输出标签分 `cause` / `root cause` / `hypothesis` 三档**，显式承认不确定性。这本身就是反证优先的副产品——因为承认"我没被证伪≠我被证明"，所以保守地贴标签。

### 3.2 checkout 案例的逐条证伪（理解本根技术最好的素材）

| 假设 | 反证探针 | 反证内容 | 判决 |
|---|---|---|---|
| H1: 20 分钟前的 config 变更 | 这个 config 影响什么？ | 只影响 **logging verbosity**，与延迟无因果路径（拓扑不可达，见 [02](02_结构因果先验_Topology-Graph.md)） | ❌ eliminated |
| H2: 支付网关响应慢 | 网关什么时候开始慢？ | 慢的开始时间 **晚于** checkout 延迟 onset（时间反向，见 [03](03_时间因果约束_Temporal-Causality.md)） | ❌ eliminated（它是症状） |
| H3: DB 连接池 94% | onset 对齐？有无反证？ | 与 onset 精确对齐 + 全模态零反证 | ✅ root cause |

注意每条假设被淘汰的原因都**不是"支持证据不够"**，而是"存在一条逻辑闭合的反证"：

- H1 死于**拓扑**（不在因果路径上 → 因果不可能）。
- H2 死于**时间**（因果方向反了 → 它是症状不是原因）。
- H3 活下来，**不是因为它被证明**，而是因为它**扛住了所有证伪尝试**。

> **根技术的精髓在这一句**：根因不是"找到的"，是"筛剩下的"。这与 LATS-RCA 把诊断当优化问题（找最优根因路径）有本质区别——详见母文档第四节。

### 3.3 强制证伪的工程骨架（伪代码）

```text
function diagnose(alert, topology, evidence_streams):
    hypotheses = generate_competing_hypotheses(alert, topology)   # 见根技术 2：拓扑先验
    for H in hypotheses:
        killer_probes = design_falsification_probes(H)            # 强制：为每个假设设计"如何被推翻"
        for probe in killer_probes:
            counter = collect_counter_evidence(probe, evidence_streams)
            if counter is_decisive:                               # 单条反证即可
                H.verdict = "eliminated"
                H.eliminated_by = counter
                break
        if H not eliminated and all_supporting(H) and zero_counter(H):
            H.verdict = "root cause"
        elif H not eliminated and has_supporting(H) and has_counter(H):
            H.verdict = "hypothesis"
    return ranked(hypotheses)     # root cause 优先，hypothesis 次之，eliminated 隐藏或附原因
```

关键的三处强制（缺一不可）：

1. **`design_falsification_probes`**：不生成支持探针，专生成反证探针——这是把 LLM 从"证实机"掰成"证伪机"的唯一杠杆。
2. **`is_decisive` 单条淘汰**：反证不是投票，是 veto。
3. **三档标签**：拒绝二元"根因/非根因"，保留 hypothesis 这一中间态。

---

## 4. 在 AWS DevOps Agent 中的具体落地

| 环节 | 反证优先的体现 |
|---|---|
| **Triage** | 不接受"最可能的"单一假设；要求生成**多个来自不同 lens 的竞争假设**（pattern / anomaly / temporal / dependency / resource）。 |
| **Investigation** | 对每个假设同时收集支持证据和反证；交叉验证矩阵中**任一模态反证即淘汰**（见母文档第三节）。 |
| **输出** | 三档标签 `cause` / `root cause` / `hypothesis`；被淘汰的假设保留 `eliminated_by` 证据，供事后复盘。 |
| **Operator steering** | 操作员可通过自然语言追加反证（"再查一下 X 的部署时间"），相当于人工注入新的证伪探针。 |

母文档里强调的"对抗生成（Adversarial Generation）"——刻意让假设互相竞争——本质就是**把假设两两配对互为反证**：若 H1 真，则 H2 的某些预测应不成立；反之亦然。这是 Popper 的"严峻检验"在多假设层面的实现。

---

## 5. 工程实现清单（复刻本根技术）

- [ ] **强制多假设**：禁止 LLM 单轮输出单一根因；prompt 必须要求"N 个来自不同 lens 的竞争假设"。
- [ ] **反证探针生成**：对每个假设，强制 prompt 输出"如果这个假设是错的，我会观察到什么"。
- [ ] **反证优先调度**：证据收集阶段，反证查询与支持查询**对等预算**（不要让 RAG 只跑支持查询）。
- [ ] **单条 veto 逻辑**：决策层用硬规则实现 `any(counter_evidence) → eliminate`，不让 LLM 自己"权衡"反证——它会倾向于弱化反证。
- [ ] **三档标签**：输出 schema 强制区分 `root cause`（零反证）/ `hypothesis`（有反证）/ `eliminated`（被证伪）。
- [ ] **淘汰理由留痕**：被淘汰的假设必须记录 `eliminated_by`，写入 [04 Journal](04_不可篡改证据链_Investigation-Journal.md)，供事后审计与 [06 记忆学习](06_可验证情景记忆_ERRORPROBE.md)。
- [ ] **反证预算监控**：监控"平均每个假设收集了几条反证"——如果趋近于 0，说明体系退化成了证实机。

---

## 6. 失效模式与边界

### 6.1 反证本身被污染（最危险的失效）

反证优先的前提是"反证可信"。如果反证也是 LLM 生成的（而不是从机器生成的证据里读的），那 LLM 可以**幻觉出一条反证**，把真根因误淘汰。**对策**：反证必须锚定在不可伪造的证据上——时间戳（[03](03_时间因果约束_Temporal-Causality.md)）、拓扑（[02](02_结构因果先验_Topology-Graph.md)）、可执行探针（[06](06_可验证情景记忆_ERRORPROBE.md)）。这是为什么时间因果是根技术 3——**时间戳是 LLM 唯一伪造不了的证据**。

### 6.2 "零反证"≠"被证明"

收敛规则是"多条支持 + 零反证 → root cause"。但"零反证"可能只是"还没找到反证"，尤其在证据稀疏的早期。AWS 的应对是贴 `root cause` 但保留 `hypothesis` 通道让人审，而不是声称确定。**这是 Popper 的 corroboration——"经受住了至今所有的检验"，而非"为真"。**

### 6.3 淘汰太激进：误杀真根因

如果反证判据设得太宽（把"相关但非因果"当反证），会误淘汰真根因。对策：反证必须满足**因果性**（拓扑不可达、时间反向、逻辑矛盾），而不是 mere 相关性偏离。H1 被淘汰是因为"因果不可能"，不是"指标不太吻合"。

### 6.4 无法处理"多因协同"

反证优先天然适合"单主因"场景。当故障是多个因素协同触发（DB 慢 + 重试风暴 + 配额）时，对"单一假设"逐个证伪会漏掉交互项。对策：在 hypothesis 层支持**复合假设**（H = H₃ ∧ H₅），并对复合体整体做反证检验。

### 6.5 与形式化验证的衔接缺口

反证优先能淘汰"逻辑不可能"的假设，但无法保证"剩下的"在**安全/合规**意义上正确（比如 H3 是根因，但修复动作本身可能破坏隔离）。这需要 [07 形式化验证](07_形式化验证兜底_SMT.md) 兜底——反证负责"对不对"，SMT 负责"改了安不安全"。

---

## 7. 可迁移性：网络 / 系统场景

本根技术**零场景依赖**，是 7 项里迁移成本最低的：

- **网络故障定位**：链路中断 → 生成竞争假设（光衰、配置变更、控制面异常、容量拥塞）→ 对每条设计反证探针（OTDR 是否反射？最近一次 commit 是否动过该接口？BGP 是否抽搐？端口计数器是否指向拥塞？）→ 单条反证淘汰。
- **数据库慢查询**：假设（锁等待、统计信息陈旧、执行计划漂移、IO 饱和）→ 反证（`pg_locks` 没有阻塞？`ANALYZE` 时间很新？plan hash 没变？iostat 不高？）。
- **微服务级联故障**：与 AWS 场景几乎同构，可直接套用。
- **物理 / 工业系统**：传感器异常定位同样适用——只要能为每个假设设计可观测的反证探针。

迁移时唯一要换的是**"反证探针"的物理含义**；逻辑骨架（多假设 → 设计反证 → 单条 veto → 三档标签）原样搬。

---

## 8. 与其他根技术的耦合

| 关系 | 说明 |
|---|---|
| ← [02 拓扑先验](02_结构因果先验_Topology-Graph.md) | 提供"因果不可能"这类最强反证的来源（拓扑不可达 → 直接淘汰，如案例 H1）。 |
| ← [03 时间因果](03_时间因果约束_Temporal-Causality.md) | 提供"时间反向"这类最廉价、最难伪造的反证（如案例 H2）。 |
| → [04 Journal](04_不可篡改证据链_Investigation-Journal.md) | 反证与淘汰理由必须写入 Journal，否则事后无法审计"为什么当时排除了它"。 |
| → [06 ERRORPROBE](06_可验证情景记忆_ERRORPROBE.md) | ERRORPROBE 的 Arbiter 角色就是反证优先的多 Agent 实现；其"可执行证据门控"是反证可信度的终极保证。 |
| → [07 SMT](07_形式化验证兜底_SMT.md) | SMT 是反证的极限形式：不是"概率上不太对"，而是"数学上可证伪"。 |
| ↔ [08 CausalFusion](08_CausalFusion_AAAI2026.md) | CausalFusion 的 propose–falsify–refine 循环就是本根技术在因果发现领域的形式化版，用 SHD 给了量化证据。 |

---

## 9. 一句话回到本质

> **把 LLM 从"概率生成器"变成"可靠推理器"，唯一已知范式就是强制它证伪而非证实。AWS 的整个可靠性工程，都是在把这条认识论原则，从口号变成流水线上一个个不可绕过的硬规则。**

---

## 10. 文献

- Karl Popper, *The Logic of Scientific Discovery*（1934/1959）——可证伪主义原典。
- Karl Popper, *Conjectures and Refutations*（1963）——corroboration 与"严峻检验"。
- Wason, P. C. (1960), "On the failure to eliminate hypotheses in a conceptual task" ——确认偏误的经典实证。
- John Stuart Mill, *A System of Logic*（1843）——求异法（排除式归纳）。
- [How AWS DevOps Agent uses multi-agent reasoning to find root causes (AWS DevOps Blog, 2026-05-27)](https://aws.amazon.com/blogs/devops/how-aws-devops-agent-uses-multi-agent-reasoning-to-find-root-causes/) —— "and counter-evidence" 原话出处。
- [CausalFusion: Integrating LLMs and Graph Falsification for Causal Discovery (AAAI 2026)](https://openreview.net/forum?id=tHKxko3j2m) —— propose–falsify–refine 的形式化版，见 [08](08_CausalFusion_AAAI2026.md)。
