# 根技术 4：不可篡改证据链（Immutable Provenance via Investigation Journal）

> **一句话本质**：Agent 的每一个结论，都必须能回溯到原始证据和推理步骤。把决策从黑盒变成可审计、可回放、可追责的流程——这是自学习闭环不从错误中"学错"的前提。

前 3 项根技术（反证、拓扑、时间）解决"怎么得出正确结论"。本根技术解决**"结论得出之后，凭什么相信它、凭什么复盘它、凭什么拿它去训练"**。它是七层栈里唯一**贯穿全部其它层**的基础设施。

---

## 1. 理论谱系：Provenance、可复现性、审计

### 1.1 科学可复现性（Reproducibility）

科学的根基之一是：一个结论要被接受，他人必须能**复现**得出它的过程。复现的前提是**完整的 provenance（溯源链）**——用了什么数据、什么方法、什么参数、什么顺序。

机器学习领域尤其受此困扰：训练不可复现、数据漂移、随机性导致"同一模型不同输出"。对策演化出 ML metadata tracking（MLflow、W&B）、deterministic training、data versioning（DVC）。AWS 的 Investigation Journal 是这一谱系在**推理时（inference-time）**的应用——不是记录"模型怎么训练的"，而是记录"这一次推理是怎么走的"。

### 1.2 数据溯源（Data Provenance / Lineage）

数据库与数据工程里的 lineage：一条报表数字，可以追到上游表、上游 ETL、原始数据源。lineage 的核心价值是**信任传递**——只要源头可信且每一步变换可信，末端结论就可信。

Investigation Journal 是**推理 lineage**：一条根因结论，可以追到它依赖的假设、反证探针、原始证据、操作员干预。每一环不可篡改，末端结论的信任度才能传递。

### 1.3 审计日志的不可篡改原则（Tamper-Evidence）

安全工程里，审计日志的生命线是**不可篡改**（tamper-evidence / tamper-resistance）：

- **append-only**：只能追加，不能修改/删除。
- **链式完整性**：每条记录含前一条的哈希（hash chain），篡改任意一条会断裂链条（Merkle chain 的思路）。
- **外部锚定**：周期性把链头哈希写到一个本身不可篡改的地方（WORM 存储、外部公证），防止整条链被重写。

这是区块链/防篡改日志的公共原理。Investigation Journal 借用的就是这套。

### 1.4 为什么 LLM 推理特别需要这条

LLM 推理是**非确定**的（温度采样）且**不透明**的（注意力分布不可读）。一个 Agent 输出"根因是 DB 连接池"，你无法直接看到它**为什么**这么说——除非体系把它的每一步显式记录下来。没有 Journal：

- 事后无法判断"这次诊断对了还是蒙的"。
- 无法做 blame 分析（出了事故，谁/哪一步错了）。
- 无法做 [06 自学习](06_可验证情景记忆_ERRORPROBE.md)——学习需要干净的"对/错"样本，而样本的"对错"要靠回放 Journal 来判定。
- 无法满足合规审计（金融、医疗等强监管场景要求决策可解释、可追溯）。

---

## 2. 它要解决的根本问题：黑盒决策的不可追责

### 2.1 Agent 决策的三重黑盒

| 黑盒 | 内容 | 没有Journal的后果 |
|---|---|---|
| **推理黑盒** | Agent 内部想了什么、生成了哪些假设、为什么淘汰了某些 | 无法复盘"为什么排除了真因" |
| **证据黑盒** | 结论依赖哪些原始数据，数据从哪个源、哪个时刻来 | 结论无法验证，无法复现 |
| **干预黑盒** | 操作员在过程中做了什么自然语言 steering | 无法区分"Agent 的判断" vs "人的判断"，责任不清 |

Investigation Journal 把这三个黑盒都打开成 append-only 的记录流。

### 2.2 自学习闭环的"学错"风险（最严重的后果）

[06 ERRORPROBE](06_可验证情景记忆_ERRORPROBE.md) 解决"Agent 怎么从错误中学习"。但学习的前提是**能正确识别"什么是对的、什么是错的"**。如果推理过程不可回放：

- 一次错误诊断被错误地标记为"正确经验" → 记忆污染 → 越用越错。
- 一次正确诊断因为最终结果不好（操作员手抖回滚错了）被标记为"错误经验" → 同样污染。

**Journal 是"对/错"判定的 ground truth 来源**。没有可回放的推理过程，就无法可靠地构造训练/记忆样本。这正是 ERRORPROBE 强调"可执行证据确认"（[06](06_可验证情景记忆_ERRORPROBE.md)）的下游依赖——证据确认的前提是证据可追溯，而可追溯的前提是 Journal。

### 2.3 反模式：只存结论不存过程

很多系统只存"告警→根因→动作"三段式记录。问题：

- 无法回答"当时还考虑过哪些假设？为什么排除了？"
- 无法回答"这条结论依赖的数据，事后看是否完整/准确？"
- 无法回放做 A/B（"如果当时多查一个证据，结论会变吗？"）

Investigation Journal 要求**存过程不存结论**——结论只是过程的最后一行。

---

## 3. 机制内核：append-only 推理账本

### 3.1 Journal 记录什么（三类条目）

母文档定义的数据来源："Agent 每一步推理 + 操作员自然语言干预 + 工具调用记录"。展开成结构化条目：

```
Entry {
  seq:           单调递增序号（append-only 的基础）
  ts:            时间戳（逻辑时间优先，见 [03]）
  phase:         Triage / Investigation / Mitigation / Prevention
  type:          hypothesis_generated | probe_designed | evidence_collected
                 | counter_found | hypothesis_eliminated | verdict_assigned
                 | operator_intervention | tool_call | topology_lookup
  content:       结构化载荷（假设文本、证据引用、判决、工具入参出参）
  evidence_ref:  指向原始证据的不可变指针（日志行ID/指标快照hash/traceID）
  prev_hash:     前一条 entry 的哈希（链式完整性）
  self_hash:     本条内容的哈希（含 prev_hash，形成 hash chain）
}
```

三类来源的对应：

- **Agent 推理**：`hypothesis_generated` / `probe_designed` / `counter_found` / `verdict_assigned`。
- **工具调用**：`tool_call`（入参、出参、耗时、来源系统）。
- **操作员干预**：`operator_intervention`（自然语言原文 + Agent 对它的响应）。

### 3.2 不可篡改的工程实现（三层防御）

| 层 | 机制 | 防的攻击 |
|---|---|---|
| **存储层** | WORM（Write-Once-Read-Many）存储 / 对象锁 | 事后删改记录 |
| **链路层** | hash chain（每条含前一条 hash） | 单条篡改（链条断裂可检出） |
| **锚定层** | 周期性把链头 hash 写外部锚（独立账号/KMS 签名/甚至外部公证） | 整链重写 |

与区块链的区别：不需要去中心化共识（这是企业内部系统），但**链式完整 + 外部锚定**这两条直接可用。

### 3.3 证据引用的"指针化"

Journal 不存证据本身（太大、会变），存**不可变指针**：

- 日志行 → `(log_group, stream, timestamp, event_id, content_hash)`。
- 指标点 → `(metric, dims, timestamp, value, source_snapshot_id)`。
- trace → `traceID + spanID`。
- 配置 → `(resource, version, commit_hash, timestamp)`。

`content_hash` 是关键：即使源日志被轮转/删除，hash 仍可证明"Journal 引用的那条日志当时的内容是 X"。这是 provenance 的**内容绑定**——不只证明"我引用过它"，还证明"它当时长这样"。

### 3.4 回放与重判（Journal 的高阶用法）

Journal 不只是事后看，还能**重放**：

- **假设重判**：事后拿到新证据，把 Journal 里的假设重新跑一遍反证检验，看结论会不会变。这是事后 root cause review 的工程化。
- **What-if 分析**：把某个反证探针"假装没跑"，看 Agent 会不会得出不同结论——量化单条证据的边际贡献。
- **训练样本构造**：把 Journal 转成 (context, correct_verdict) 对，喂给 [06 记忆](06_可验证情景记忆_ERRORPROBE.md) 或微调。

---

## 4. 在 AWS DevOps Agent 中的具体落地

| 环节 | Journal 的角色 |
|---|---|
| **全程贯穿** | Triage→Investigation→Mitigation→Prevention 每一步都写 Journal（母文档架构图把 Journal 画在最顶层横贯）。 |
| **Investigation** | 每个假设的生成、反证探针、淘汰理由、判决都留痕；checkout 案例的 H1/H2/H3 淘汰/通过理由可完整回放。 |
| **Operator steering** | 操作员的自然语言干预原文 + Agent 响应都记录，区分人/Agent 责任。 |
| **Prevention** | 跨事件聚类（[06](06_可验证情景记忆_ERRORPROBE.md)）从 Journal 抽取历史调查，按共享根因聚类。 |
| **反馈** | 操作员对推荐项的接受/拒绝 + 自然语言反馈，写回 Journal，成为下一轮先验。 |

母文档架构图里 Journal 是**横在最顶层的横条**，跨所有阶段——这视觉上就说明了它的"贯穿"地位。

---

## 5. 工程实现清单

- [ ] **append-only 存储**：用支持 WORM/对象锁的存储；序号单调递增，禁止 update/delete API。
- [ ] **hash chain**：每条 entry 含 `prev_hash` + `self_hash`；定期校验链条完整性。
- [ ] **外部锚定**：周期（如每 N 条或每 X 分钟）把链头 hash 用 KMS 签名 / 写独立账号，防整链重写。
- [ ] **证据指针化 + content_hash**：不存证据原文，存不可变指针 + 内容哈希。
- [ ] **三类条目全覆盖**：推理 / 工具调用 / 操作员干预都不能漏；尤其操作员干预要存原文。
- [ ] **回放工具**：提供"给定 investigation ID，回放完整推理链"的查询接口，支持假设重判、what-if。
- [ ] **保留策略 + 合规**：按合规要求定保留期；超期归档但保证归档期内可验证完整性。
- [ ] **访问审计**：谁读过 Journal 也要记（Journal 自身被访问的元日志），防内部窥探/篡改。

---

## 6. 失效模式与边界

### 6.1 记录了过程，但过程本身是错的

Journal 保证"可追溯"，不保证"正确"。如果 Agent 基于错误证据得出错误结论，Journal 会**忠实地记录这个错误过程**——这恰恰是 Journal 的价值（事后能发现错在哪），但也意味着 Journal 不能当"正确性保证"，只能当"可审计性保证"。正确性靠 [01-03](01_反证优先_Falsification-First.md) 的反证机制。

### 6.2 工具调用记录不全（隐性黑盒）

如果 Agent 调了一个内部工具，但 Journal 只记"调了 X"没记入参出参，那这个工具调用就是隐性黑盒——回放时无法重现。**对策**：工具入参出参必须完整记录（含大对象的 hash 引用）。

### 6.3 LLM 内部推理仍不可读

Journal 记录的是 Agent **显式**的推理步骤（它说出来的假设、探针），但 LLM 注意力层面的"隐性推理"仍不可读。Journal 把黑盒从"完全黑"变成"半透明"——可审计但非完全可解释。要进一步，需要 reasoning trace 的结构化（这正是 [06 ERRORPROBE](06_可验证情景记忆_ERRORPROBE.md) 的 Arbiter 在做的事——把推理显式化到可被另一个 Agent 裁决）。

### 6.4 存储与隐私膨胀

Journal 全量记录会导致存储膨胀；且可能含敏感数据（日志里的 PII、密钥泄露）。**对策**：证据指针化（不存原文）+ 敏感字段脱敏 + 分级保留（近期全量、远期摘要）。

### 6.5 锚定层的信任根

外部锚定依赖一个可信根（KMS 密钥、独立账号）。如果根被攻破，整条链的可信度归零。**对策**：根的密钥轮转 + 多重锚定（KMS + 独立账号 + 可选的外部公证）。

---

## 7. 可迁移性：网络 / 系统场景

- **网络运维**：每次故障排查的"假设→验证→结论"链写入 Journal，可作为网络运维知识库；老专家退休后，其排查模式以 Journal 形式留存。
- **数据库 DBA**：慢查询诊断的假设链（锁？计划？IO？）留痕，新 DBA 可回放学习。
- **任何受监管系统**：金融交易异常定位、医疗设备故障——合规要求决策可追溯，Journal 是直接满足手段。
- **跨团队 blameless postmortem**：Journal 提供客观回放，把"谁错了"的争论变成"哪一步证据不全"的技术讨论。

迁移成本中等：append-only 存储、hash chain、证据指针化是通用工程，任何系统都能实现；难点在**把 Agent 推理充分显式化**到可记录（依赖 [01](01_反证优先_Falsification-First.md) 把推理结构化）。

---

## 8. 与其他根技术的耦合

| 关系 | 说明 |
|---|---|
| ← [01 反证优先](01_反证优先_Falsification-First.md) | 反证与淘汰理由必须写 Journal，否则无法审计"为什么排除了它"；反证把推理结构化，Journal 才有东西可记。 |
| ← [02 拓扑](02_结构因果先验_Topology-Graph.md) / [03 时间](03_时间因果约束_Temporal-Causality.md) | 拓扑查询、时间对齐都是工具调用，都要进 Journal；事后可重放。 |
| → [06 ERRORPROBE](06_可验证情景记忆_ERRORPROBE.md) | Journal 是"对/错"判定的 ground truth；记忆写入门槛（可执行证据确认）依赖 Journal 回放。 |
| → [07 SMT](07_形式化验证兜底_SMT.md) | SMT 验证的输入输出要进 Journal，形成"数学证明 + 推理链"的双重留痕。 |
| ↔ [05 写边界](05_写权限边界与强制回滚.md) | Journal 本身是只读基础设施（Agent 不能改它），是"写边界"原则在审计层的体现。 |

---

## 9. 一句话回到本质

> **不可篡改的 Journal 把 Agent 决策从一次性黑盒变成可回放、可审计、可追责的流程。它不保证正确，但保证"错了能查出来、能学对"。没有它，自学习闭环会从错误中"学错"，Agent 永远进不了强监管生产环境。**

---

## 10. 文献

- Brambilla et al., "Data Provenance—A Changelog" —— data lineage 综述。
- Schneider, "Self-stabilization / Tamper-evident logging" —— 防篡改日志原理。
- KMS / WORM 存储工程实践（AWS S3 Object Lock 等）。
- [How AWS DevOps Agent uses multi-agent reasoning to find root causes](https://aws.amazon.com/blogs/devops/how-aws-devops-agent-uses-multi-agent-reasoning-to-find-root-causes/) —— Investigation Journal 作为"不可篡改审计日志"的工程出处。
- [ERRORPROBE (ACL 2026 Findings)](https://arxiv.org/abs/2604.17658) —— verified episodic memory 依赖可回放的推理链，见 [06](06_可验证情景记忆_ERRORPROBE.md)。
