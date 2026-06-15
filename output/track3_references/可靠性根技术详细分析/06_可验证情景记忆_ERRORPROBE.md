# 根技术 6：可验证情景记忆（Verified Episodic Memory）—— ERRORPROBE（ACL 2026 Findings）

> **一句话本质**：Agent 从错误中学习的前提是"记忆不被污染"。ERRORPROBE 的解法——情景记忆**只在错误模式被可执行证据确认时**才写入——是已知最严格的记忆门控版本。

前 5 项根技术都让单次诊断更可靠。本根技术回答**"怎么让 Agent 越用越准"**——这是从"单次可靠"跨到"持续自改进"的最后一公里，也是最容易被做反的一环。

> **来源论文**：ErrorProbe, *Towards Self-Improving Error Diagnosis in Multi-Agent Systems*，Jiazheng Li, Emine Yilmaz, Bei Chen, Dieu-Thu Le（Amazon），**ACL 2026 Findings**，15 页 3 图。arXiv: [2604.17658](https://arxiv.org/abs/2604.17658)。

---

## 1. 理论谱系：情景记忆与"学习反模式"

### 1.1 情景记忆（Episodic Memory）

认知科学里，情景记忆是对**具体事件**（何时、何地、发生了什么）的记忆，区别于语义记忆（一般知识）。映射到 Agent：

- **情景记忆** = 过去每次诊断/故障的具体记录（"那次 DB 连接池耗尽，表现是 X，根因是 Y，修复是 Z"）。
- **语义记忆** = 从多次情景里抽象出的规则（"连接池 > 90% 往往是延迟根因"）。

Agent 的"从经验中学习"，本质是把情景记忆沉淀成语义先验，再用于下次诊断。**这条链路的可靠性强弱，完全取决于情景记忆写入时的质量门槛。**

### 1.2 记忆污染：自学习闭环的核心反模式

一个 naive 的自学习 Agent：每次诊断后，把"症状→根因"对存进记忆，下次遇到类似症状就直接复用。问题：

- **诊断错时，错误被固化成"经验"**——下次遇到同样症状，会再次输出错误根因，且更自信（因为"记忆里有过"）。
- **幻觉被沉淀**——LLM 偶发幻觉的结论，若没经验证就写入，成为永久错误知识。
- **相关被当成因果**——把"同时出现"的两次事件记成因果，下次据此误判。

这就是 ERRORPROBE 论文开篇点出的核心困难：现有 MAS 诊断方法依赖**昂贵的人工标注**或 **LLM-as-a-judge**，而这两者都难以可靠地定位"决定性的错误步骤"，导致写入记忆的"对/错"标签本身就不可靠。

### 1.3 "LLM-as-a-judge" 为什么不够

让一个 LLM 去评判另一个 LLM 的诊断对错（LLM-as-a-judge），是当下流行的自评估范式。但在错误诊断里它有两个硬伤：

- **同源偏置**：评判 LLM 和被评 LLM 有相似的失败模式（同样的幻觉倾向、同样的 confirmation bias，见 [01](01_反证优先_Falsification-First.md)），会"看不见"被评者的错误。
- **无 grounded truth**：评判 LLM 没有去**实际执行验证**，只是基于文本"看起来对不对"判断——这恰恰是反证优先（[01](01_反证优先_Falsification-First.md)）要打破的"证实倾向"。

ERRORPROBE 的回答：**用可执行证据（executable evidence）替代 LLM 判断**——记忆写入的门槛，是"这个错误模式能被实际运行验证复现"，而不是"LLM 觉得它是错的"。

---

## 2. 论文要解决的根本问题：MAS 错误诊断的三难

### 2.1 多 Agent 系统调试的固有困难（论文原文三点）

论文 abstract 明确列出 LLM-based MAS 调试的三个结构性困难：

| 困难 | 含义 | 对诊断的挑战 |
|---|---|---|
| **long interaction traces** | 交互轨迹很长 | 错误藏在长上下文里，难以定位 |
| **inter-agent dependencies** | Agent 间相互依赖 | 错误可能由上游 Agent 传递而来，非当前 Agent 的锅 |
| **delayed error manifestation** | 错误延迟显现 | 出错的地方和报错的地方相隔很远 |

这三个困难合在一起，使得"哪个 Agent 在哪一步出的错"（semantic failure attribution）极其困难——它不是单点 bug，而是**分布式、延迟、跨 Agent** 的归因问题。

### 2.2 现有方法的不足（论文批评的两类）

- **专家标注**：准确但**极其昂贵**，无法规模化（每次 MAS 失败都要专家逐行审 trace）。
- **LLM-as-a-judge**：廉价但**难以 pinpoint 决定性错误步骤**——尤其面对 extended context 时，评判模型同样会迷失在长 trace 里。

ERRORPROBE 要同时做到"不依赖人工标注"+"能定位到决定性步骤"——这两个目标的张力，正是它要突破的核心。

### 2.3 与 AWS DevOps Agent 的连接

ERRORPROBE 解决的是"MAS 自身的错误诊断"（哪个 Agent 错了），AWS DevOps Agent 解决的是"被管系统的故障诊断"（哪个服务坏了）。两者层次不同，但**记忆机制同构**：

- AWS 的 Prevention 阶段（跨事件按共享根因聚类）需要一个可靠的"过去发生了什么"的记忆库。
- ERRORPROBE 的 verified episodic memory 恰好提供了"如何让这个记忆库不被污染"的范式。

母文档把 ERRORPROBE 列为根技术 6，正是看中它的**记忆门控机制可迁移**到任何自学习诊断系统。

---

## 3. 机制内核：三阶段流水线 + 三角色团队

### 3.1 三阶段流水线（论文的核心架构）

```
MAS 失败 trace（长、跨 Agent、延迟显现）
        │
        ▼
[阶段 1] Operationalizing failure taxonomy → detect local anomalies
        │  把 MAS 失败分类法"操作化"，在每个 Agent 局部检测异常
        ▼
[阶段 2] Symptom-driven backward tracing → prune irrelevant context
        │  从症状（最终报错）反向追溯，剪掉无关上下文
        ▼
[阶段 3] Multi-agent team (Strategist/Investigator/Arbiter) 
         validate error hypotheses via tool-grounded execution
        │  用工具接地的执行来验证错误假设
        ▼
   定位：哪个 Agent + 哪一步（originating error step）
```

三个阶段的设计逻辑是一条**逐步聚焦**的漏斗：

- **阶段 1（粗筛）**：先用失败分类法做局部异常检测，把"可能有问题的步骤"从海量正常步骤里捞出来。这步是**宽召回**。
- **阶段 2（剪枝）**：从症状反向追溯，砍掉与报错无因果关联的上下文——这是 [03 时间因果](03_时间因果约束_Temporal-Causality.md) 的反向应用（沿着"谁影响了症状"的因果链回溯），解决 long traces 的"迷失"问题。
- **阶段 3（精确定位）**：对剩下的候选步骤，用三角色团队做严格验证——这是 [01 反证优先](01_反证优先_Falsification-First.md) 的多 Agent 实现。

### 3.2 三角色团队：分工而非辩论（关键区别！）

母文档第七节修订第 2 条特别强调：**这不是"多 Agent 辩论"，是"分工"**——Strategist/Investigator/Arbiter 是**角色**，不是观点对抗。这避开了 arXiv 2605.00914 警告的"群体压力"（debate 会收敛到错误共识）。

| 角色 | 职责 | 对应的认识论功能 |
|---|---|---|
| **Strategist（战略家）** | 规划探针——"要验证这个错误假设，我该执行什么探测？" | 设计反证探针（[01](01_反证优先_Falsification-First.md) 的 `design_falsification_probes`） |
| **Investigator（调查员）** | 执行探针——实际运行工具，收集可执行证据 | 收集反证（`collect_counter_evidence`），tool-grounded |
| **Arbiter（裁决者）** | 裁决——基于可执行证据，判定错误假设成立与否 | 下判决（`is_decisive` → verdict） |

三个角色**串行协作、各司其职**，而不是三个 Agent 各自表态然后投票。这保证了：

- **没有群体压力**：Strategist 不和 Investigator "辩论"，它只规划；Investigator 只执行不评判；Arbiter 只裁决不规划。职责隔离消除了"互相说服导致错误收敛"的风险。
- **可执行证据贯穿**：Investigator 的输出是**实际运行结果**（tool-grounded），不是 LLM 的文字断言。Arbiter 基于这些 grounded evidence 裁决，而非基于文本"看起来对不对"。

> **这与 [01 反证优先](01_反证优先_Falsification-First.md) 的伪代码逐行对应**：Strategist = `design_falsification_probes`，Investigator = `collect_counter_evidence`，Arbiter = `is_decisive` + verdict。ERRORPROBE 是反证优先的多 Agent 工程实例。

### 3.3 Verified Episodic Memory 的写入门控（本根技术的心脏）

论文原话（abstract 最关键的一句）：

> "ErrorProbe maintains a verified episodic memory that updates **only when error patterns are confirmed by executable evidence**, without the need for annotation."

把这句话拆成机制：

```
function maybe_write_memory(diagnosis_result):
    if diagnosis_result.confirmed_by_executable_evidence:   # 可执行证据确认
        pattern = extract_error_pattern(diagnosis_result)   # 抽象成错误模式
        memory.write(pattern)                               # 才写入
    else:
        # 即使 Arbiter 觉得对了，没有可执行证据 → 不写入
        log_to_journal(diagnosis_result, status="unverified")  # 只进 [04 Journal]，不进记忆
```

**核心门控**：写入记忆的必要条件是"可执行证据确认"，而不是"Arbiter 裁决对"。这两个条件的区别是本根技术的全部价值：

- "Arbiter 裁决对"仍是**判断**（即使是 Arbiter，仍是 LLM 的判断）。
- "可执行证据确认"是**事实**（实际运行验证了错误模式）。

只有后者才足以支撑"固化成经验"——因为后者是反证优先（[01](01_反证优先_Falsification-First.md)）意义上的"未被证伪且被严峻检验过"，而不是"看起来对"。

### 3.4 跨域迁移（论文的 bonus 收益）

论文报告：verified memory 使 ERRORPROBE 能**无需重训**就跨域迁移（在 TracerTraj 和 Who&When 两个 benchmark 间）。这是因为记忆里存的是"经过验证的错误模式"，这些模式比原始 trace 更抽象、更可迁移——干净的语义记忆天然跨域。

---

## 4. 实验与结果（论文实测）

| 维度 | 内容 |
|---|---|
| **Benchmark** | TracerTraj、Who&When（两个 MAS 错误诊断 benchmark） |
| **任务** | semantic failure attribution：定位 responsible agent + originating error step |
| **强项** | **step-level localization** 显著优于 baseline（最难的细粒度定位） |
| **迁移** | verified memory 支持跨 benchmark 迁移，无需重训 |
| **对比对象** | 专家标注 / LLM-as-a-judge 类基线 |

结论：ERRORPROBE 在最难的"步骤级定位"上拉开差距，证明三阶段漏斗 + 三角色 + 可执行证据门控的组合是有效的。跨域迁移证明记忆是"干净的"（若记忆被污染，跨域会退化）。

---

## 5. 在 AWS DevOps Agent 中的对应落地

| AWS 环节 | ERRORPROBE 机制的映射 |
|---|---|
| **Investigation** | AWS 的"多假设并行 + 反证检验"对应 ERRORPROBE 的三角色（Strategist 规划探针 / Investigator 收集证据 / Arbiter 裁决）。母文档确认 AWS 是"多 agent 分工"而非辩论。 |
| **Prevention（跨事件聚类）** | AWS 把多次 incident 按共享根因聚类——这需要一个可靠的"历史根因"记忆库。ERRORPROBE 的 verified memory 给出了"这个记忆库怎么不被污染"的范式：只存经可执行证据确认的模式。 |
| **反馈循环** | AWS 操作员对推荐项的接受/拒绝 + 自然语言反馈，是另一类"证据"；结合可执行验证，决定是否沉淀进 Prevention 的先验。 |

---

## 6. 工程实现清单（把 verified memory 落到任何自学习诊断系统）

- [ ] **双库分离**：未验证的诊断只进 [04 Journal](04_不可篡改证据链_Investigation-Journal.md)（可回放），**不进**记忆库；只有 verified 的才进记忆。两库物理隔离。
- [ ] **可执行证据作为写入门槛**：记忆写入的 CI 是"存在一个实际运行验证了该错误模式"，写成硬规则，不让 LLM 自己决定。
- [ ] **三角色分工实现反证**：用 Strategist/Investigator/Arbiter 模式实现 [01](01_反证优先_Falsification-First.md) 的反证检验，避免单 Agent 自证。
- [ ] **失败分类法操作化**：把领域失败模式做成可机器检测的分类法（阶段 1 的局部异常检测依赖它）。
- [ ] **症状驱动反向剪枝**：长 trace 调试时，从症状反向沿因果链剪枝（[03](03_时间因果约束_Temporal-Causality.md)），避免在长上下文里迷失。
- [ ] **记忆老化与复核**：即使 verified 的记忆，也要定期复核（环境变化后旧模式可能失效）；过期模式降级或剔除。
- [ ] **跨域迁移评估**：定期测记忆在新域的表现；退化说明记忆域特异性过强，需重新门控。

---

## 7. 失效模式与边界

### 7.1 "可执行证据"本身的覆盖盲区

可执行证据门控很严，但**有些错误模式无法被可执行验证**（如偶发性、环境依赖性、需长时间才显现的错误）。这些会被挡在记忆门外——保守但可能漏掉真模式。**对策**：对不可执行验证的模式，走"人审确认"作为补充门控，但人审的也只进"低置信记忆区"，与 verified 区分。

### 7.2 探针不充分导致漏确认

Investigator 执行的探针是 Strategist 设计的。若 Strategist 设计的探针不够（没覆盖到能确认错误的关键验证），一个本该被确认的真模式会被判为"未确认"而不写入。**对策**：探针设计要遵循 [01](01_反证优先_Falsification-First.md) 的反证原则——专门设计"如何证伪/证实"，且要求多角度探针（[02](02_结构因果先验_Topology-Graph.md) 拓扑探针 + [03](03_时间因果约束_Temporal-Causality.md) 时间探针 + 执行探针）。

### 7.3 三角色串行的延迟代价

Strategist→Investigator→Arbiter 串行，比单 Agent 慢。对实时性要求高的场景（在线故障定位）可能太慢。**对策**：分级——快速场景用单 Agent + 轻量反证，慢速/高价值场景（如事后深度诊断、记忆写入）才用完整三角色。

### 7.4 记忆抽象层次

存"具体事件"还是"抽象模式"？太具体（每次事件一条）→ 记忆膨胀、难复用；太抽象 → 丢失关键细节、误迁移。**对策**：分层存储——原始 verified 事件进 Journal，抽象模式进记忆，保留双向链接（模式 ↔ 验证它的原始事件）。

### 7.5 环境漂移使 verified 记忆过时

一个模式在旧环境被可执行验证为真，但环境变化后失效（库升级、架构重构）。若不复核，会持续误导。**对策**：记忆带"验证环境指纹"，环境差异大时降级；定期重验证。

---

## 8. 可迁移性：网络 / 系统场景

- **网络故障记忆**：verified 模式如"BGP hold-time 超时类故障 → 常源于底层链路抖动而非邻居配置"——这种模式只有在可执行验证（如复现链路抖动触发 BGP 翻动）后才写入运维记忆库。
- **数据库慢查询记忆**：verified 模式如"统计信息陈旧导致 plan 漂移"——需可执行验证（刷新统计信息后 plan 恢复）才沉淀。
- **任何自学习运维 Agent**：双库分离（Journal vs memory）+ 可执行证据门控 + 三角色反证，这套范式可直接套用。

迁移成本中等偏高：难点不在记忆存储，而在**"可执行证据"在目标域如何定义和获取**——网络/数据库场景的"执行验证"往往需要可控的复现环境，这本身是工程投入。

---

## 9. 与其他根技术的耦合

| 关系 | 说明 |
|---|---|
| ← [01 反证优先](01_反证优先_Falsification-First.md) | 三角色（Strategist/Investigator/Arbiter）是反证优先的多 Agent 实现；可执行证据门控是"反证可信度"的终极保证。 |
| ← [02 拓扑](02_结构因果先验_Topology-Graph.md) / [03 时间](03_时间因果约束_Temporal-Causality.md) | 阶段 2 的反向剪枝沿因果链走，依赖拓扑和时间结构；探针设计也用拓扑/时间维度。 |
| ← [04 Journal](04_不可篡改证据链_Investigation-Journal.md) | 双库分离：未验证进 Journal，verified 进记忆；Journal 是"对/错"判定的回放来源。 |
| → [07 SMT](07_形式化验证兜底_SMT.md) | SMT 是"可执行证据"的极端形式——数学证明是最强的"验证"。两者都把记忆/结论的信任度从"判断"升到"事实"。 |

---

## 10. 一句话回到本质

> **从错误中学习的最大敌人不是"学得慢"，而是"学错"——把幻觉、巧合、相关错记成因果经验。ERRORPROBE 的可执行证据门控，是已知最严格的"记忆不被污染"机制：记忆只接纳被实际运行验证过的模式，而非被某个 LLM 判断为对的模式。这是 Agent 从"单次可靠"走向"持续自改进"的安全阀。**

---

## 11. 文献

- **ErrorProbe: Towards Self-Improving Error Diagnosis in Multi-Agent Systems**（Li, Yilmaz, Chen, Le; ACL 2026 Findings）—— arXiv: [2604.17658](https://arxiv.org/abs/2604.17658)（15 页 3 图）。本根技术的直接来源。
- Tulving (1972), "Episodic and Semantic Memory" —— 情景记忆 vs 语义记忆的认知科学原典。
- LLM-as-a-judge 相关工作（Zheng et al., 2023 等）—— 被 ERRORPROBE 批评为不足以定位决定性错误步骤。
- [How AWS DevOps Agent uses multi-agent reasoning to find root causes](https://aws.amazon.com/blogs/devops/how-aws-devops-agent-uses-multi-agent-reasoning-to-find-root-causes/) —— AWS 的多 Agent 分工（非辩论）+ Prevention 跨事件聚类。
