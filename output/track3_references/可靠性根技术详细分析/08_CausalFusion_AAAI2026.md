# CausalFusion（AAAI 2026）：反证优先的学术形式化

> **一句话本质**：CausalFusion 把"因果发现"形式化为一个 **propose–falsify–refine** 循环——LLM 当"数据科学家"提候选因果图，形式化模块做**图证伪检验**淘汰不被数据支持的拓扑。它与 AWS DevOps Agent 的"假设生成→反证→淘汰"**完全同构**，从学术侧证明了 AWS 的"反证优先"不是工程 trick，而是因果推断主流范式（Popper + Pearl）的工程化。

本文件是 7 项根技术之外、母文档第五补专列的学术对应。它不是第 8 项根技术，而是**根技术 1（反证优先）+ 根技术 2（结构因果）的形式化、可量化、可复现版本**——用因果发现的标准度量（SHD）给出"这套范式为什么有效"的硬证据。

> **论文**：*CausalFusion: Integrating LLMs and Graph Falsification for Causal Discovery*，AAAI 2026（OpenReview submission 19725，primary area: causal reasoning，online 2025-10-08）。
> 关键词：Causal discovery, Causal reasoning, LLM, DAGs, Falsification methods, Structural causal models。
> 链接：[OpenReview](https://openreview.net/forum?id=tHKxko3j2m) | [PDF](https://cdn.amazon.science/a6/d6/253deb3f4d11a9b6e88fc2f9e945/causalfusion-copy.pdf)。

---

## 1. 论文定位：它填的什么空

### 1.1 因果发现的三角困境

因果发现（从观测数据学出因果图 DAG）长期面临三方张力：

| 路线 | 做法 | 长处 | 短板 |
|---|---|---|---|
| **纯统计法**（PC、LiNGAM） | 用条件独立性/非高斯性从数据推 DAG | 数据驱动、可规模化 | **忽略领域知识**；只给马尔可夫等价类，方向不定 |
| **专家设计 DAG** | 领域专家手画因果图 | 准确、含丰富先验 | **难规模化、耗时**；专家也有盲区 |
| **纯 LLM 法** | 让 LLM 直接生成 DAG | 快、含隐式领域知识 | **无统计校验**；幻觉、不保证与数据一致 |

论文开篇就点明这个困境：纯统计法"return structures that overlook domain knowledge"，专家 DAG "difficult to scale and time-consuming"。**CausalFusion 的定位是融合三者之长**——LLM 提供领域知识（快、可规模），统计证伪保证与数据一致（严），迭代 refine 平衡两者。

### 1.2 一句话概括（论文 TL;DR）

> "CausalFusion combines LLM-based domain knowledge with statistical falsification to generate more accurate and explainable causal DAGs."

三个关键词：

- **LLM-based domain knowledge**：LLM 不是数据拟合器，是"懂行的数据科学家"，把领域先验注入候选结构。
- **statistical falsification**：统计证伪检验——用数据淘汰不被支持的拓扑。
- **more accurate and explainable**：既更准（SHD 更低）又可解释（每轮推理可读）。

### 1.3 它为什么重要（超出因果发现本身）

CausalFusion 的真正价值，不在于又一个因果发现算法，而在于它**形式化了一个范式**——"神经生成 + 符号证伪 + 迭代精炼"。这个范式：

- 在因果发现里叫 propose–falsify–refine。
- 在 AWS DevOps Agent 里叫 hypothesis generation → counter-evidence → elimination。
- 在 [07 SMT](07_形式化验证兜底_SMT.md) 里叫 propose–verify(UNSAT/SAT)–refine。

**三者同构**。CausalFusion 用因果发现这个"有标准 ground truth、可量化评估"的领域，给这个范式做了受控实验验证——从而间接为 AWS 的工程实践提供了学术背书。这是母文档把它单列的根本原因。

---

## 2. 方法架构：propose–falsify–refine 循环

### 2.1 核心循环

```
         ┌──────────────────────────────────────────┐
         │                                          │
         ▼                                          │
  [LLM 数据科学家]                                    │
   读数据 + 领域知识                                   │
   提出/修订 候选 DAG G                               │
         │                                          │
         ▼                                          │
  [图证伪检验模块]   ← 形式化、统计                     │
   对 G 的每条边/每个方向：                            │
     - 这条边被数据支持吗？                            │
     - 这个方向被数据支持吗？                          │
   输出：哪些部分被证伪（falsified）                    │
         │                                          │
         ├── 全部通过 ──→ 输出 G（收敛）               │
         │                                          │
         └── 有证伪 ───→ 把证伪证据回传给 LLM ──→ refine（回到顶部）
         │
```

每一轮：

1. **Propose**：LLM 基于数据描述 + 领域知识，提出或修订一个候选因果图。
2. **Falsify**：形式化模块测量这个候选图**被数据支持的程度**——不支持的边/方向被标记为"被证伪"。
3. **Refine**：证伪证据回传 LLM，LLM 据此调整图，进入下一轮。

直到图通过所有可做的证伪检验（收敛），或达到轮数上限。

### 2.2 与 Popper 的精确对应

- **Propose = 猜想（conjecture）**：大胆提出候选理论。
- **Falsify = 反驳（refutation）**：用严峻检验尝试打倒它。
- **Refine = 修正后重新 conjecture**：幸存的部分保留，被证伪的部分调整。

这就是 Popper 的 *Conjectures and Refutations* 在因果发现上的落地。论文关键词里专门列了 "Falsification methods"——它自觉地把这套放在 Popper 谱系里。

### 2.3 与 [01 反证优先](01_反证优先_Falsification-First.md) 的逐项映射

| CausalFusion | AWS DevOps Agent | 共同的认识论 |
|---|---|---|
| LLM 提候选 DAG | 生成多个竞争假设 | 多元猜想（对抗单点确认） |
| 图证伪检验 | 反证检验（交叉验证矩阵） | 证伪优先于证实 |
| 不被支持 → 删除边/翻转方向 | 单条反证 → 淘汰假设 | modus tollens，逻辑闭合 |
| 通过所有检验 → 收敛为输出 DAG | 零反证 → 收敛为 root cause | corroboration，非"证明" |
| 每轮推理可解释 | 三档标签承认不确定 | 显式不确定性 |

**两套系统在算法骨架上同构**——这是母文档第五补的核心论点："AWS 的反证优先不是工程 trick，而是因果推断主流范式的工程化。"

---

## 3. 分工：LLM 做什么，形式化模块做什么

这是 CausalFusion 作为**神经符号架构**的精髓——两个模块各司其职，互补短板。

### 3.1 LLM 的角色：注入领域知识的"数据科学家"

LLM **不直接从数据拟合参数**，它的职责是：

- **读懂数据的语义**：理解"这个变量是什么意思""这俩变量在领域里谁更可能是因"。
- **注入领域先验**：基于训练语料里的领域知识，提出"合理的"候选结构（如"促销 → 销量"比"销量 → 促销"更合理）。
- **解释证伪信号**：当形式化模块说"这条边方向被数据反对"，LLM 结合领域知识判断"那是不是有混淆变量/选择偏差"。
- **生成可解释的推理链**：每一轮的图调整都附带自然语言理由（论文强调 "interpretable reasoning at each iteration"）。

这正对应论文的定位——LLM 是 "domain-specialized data scientists"，不是统计引擎。

### 3.2 形式化模块的角色：冷酷的证伪者

形式化模块**不理解领域，只认数据**，它的职责是：

- **条件独立性检验（CI tests）**：检验"给定 Z，X 与 Y 是否独立"——若独立，则 X、Y 之间不应有直接边。
- **方向检验**：判断边的方向（哪个方向更被数据支持）。
- **整体图拟合度**：测量候选图与数据的吻合程度（如 BIC 分数）。
- **permutation-based 证伪**：打乱数据破坏某条边，看拟合度变化——若变化不显著，该边被证伪。

这个模块**没有 confirmation bias**（它不是 LLM），是纯粹的统计/逻辑。它给 LLM 的"合理猜想"加一道**数据证伪闸门**。

### 3.3 两者如何互补

| 短板 | 谁补 | 怎么补 |
|---|---|---|
| 纯统计法忽略领域知识 | LLM | 注入"促销→销量"这类领域先验 |
| 纯 LLM 无统计校验（幻觉） | 形式化模块 | 用 CI test/BIC 淘汰不被数据支持的边 |
| 专家 DAG 难规模化 | LLM | LLM 快速生成候选，专家只审 ground truth |
| 统计法给等价类（方向不定） | LLM + 领域知识 | LLM 用领域先验破对称（与 [02 拓扑](02_结构因果先验_Topology-Graph.md)、[03 时间](03_时间因果约束_Temporal-Causality.md) 同理） |

这套分工与 [07 SMT](07_形式化验证兜底_SMT.md) 的"LLM 生成 + SMT 验证"是同一个范式——神经做软的部分，符号做硬的部分。

---

## 4. 图证伪的统计内核（可深读）

### 4.1 为什么需要"证伪"而不是"拟合"

因果发现不能只看"图拟合数据有多好"（会过拟合、会接受冗余边）。必须有**主动证伪**——专门去找"图的哪个部分不被数据支持"。这与 [01 反证优先](01_反证优先_Falsification-First.md) 完全一致：不堆支持证据，专门找反证。

### 4.2 条件独立性检验（CI test，PC 算法的核心）

PC 算法（Spirtes-Glymour-Scheines）的基本操作：

```
对候选图中的每条边 X—Y：
  对越来越大的条件集 Z（邻居的子集）：
    若存在 Z 使 X ⊥ Y | Z（给定 Z 时 X、Y 独立）：
      删除边 X—Y          ← 这条边被"证伪"：相关性可被 Z 解释
      记录 X—Y | Z 为分离集（后续定方向用）
```

CI test 就是"边的证伪探针"——能找到一个解释掉相关性的条件集，边就被证伪删除。这与 AWS 反证检验"找到一个反证就淘汰假设"逻辑相同。

### 4.3 方向判定与马尔可夫等价类

CI test 只能定骨架（哪些点连边），方向需要额外信息：

- **碰撞点（collider）**：X→Z←Y 的结构中，X、Y 本独立但给定 Z 相关——CI test 序列能识别碰撞点，定部分方向。
- **剩余方向**：马尔可夫等价类内的方向无法纯靠观察数据区分——需要领域先验（LLM）或时间先验（Granger，[03](03_时间因果约束_Temporal-Causality.md)）。

**这正是 CausalFusion 让 LLM 介入的关键点**——LLM 的领域知识用来破等价类内的方向对称性，补统计法的盲区。

### 4.4 LiNGAM：用非高斯性定方向

LiNGAM（线性非高斯无环因果模型）利用"非高斯性"能从数据直接定方向（基于 ICA）。它是 CausalFusion 的另一基线——纯统计、能定方向、但假设强（线性、非高斯）、对领域知识盲。

### 4.5 permutation-based 证伪（论文强调的 sibling 工作）

母文档列的 sibling 工作之一：*Toward falsifying causal graphs using a permutation-based test*。思路：

```
对图中某条边/某个机制：
  打乱（permute）相关数据，破坏该因果机制
  看模型拟合度/预测力是否显著下降
    若不下降 → 该机制对数据无贡献 → 被证伪
    若显著下降 → 该机制被数据需要 → 通过
```

这是 Granger 因果（[03](03_时间因果约束_Temporal-Causality.md)）在一般因果图上的推广——"破坏原因，看结果是否变化"。

### 4.6 评估度量：SHD（Structural Hamming Distance）

论文用 **SHD** 作为主指标：候选 DAG 与 ground-truth DAG 之间的"结构汉明距离"——

```
SHD = 缺失的边 + 多余的边 + 方向错的边   （越小越好）
```

SHD=0 表示完全复原 ground truth。CausalFusion 的 SHD 显著低于 PC、LiNGAM 和 LLM-only 基线——这是范式有效的**硬量化证据**。

---

## 5. 实验设计

### 5.1 两个实验（一合成一真实）

| 实验 | 数据 | ground truth |
|---|---|---|
| (i) **合成电商数据** | 合成生成 | 精确定义的 ground-truth DAG（可控、可调复杂度） |
| (ii) **Amazon 供应链真实数据** | 真实供应链 | 领域专家构建的 ground-truth DAG |

合成实验验证"在已知真相下能否复原"；真实实验验证"在真实复杂度下是否有效"。两者结合，既控内效度又验外效度。

### 5.2 基线

- **经典算法**：PC、LiNGAM（纯统计）。
- **LLM-only**：LLM 直接生成 DAG，**不做迭代证伪**（这是关键对照——证明"证伪循环"本身的贡献，而非"用 LLM"的贡献）。

### 5.3 额外分析：CoT 推理 vs 结构准确性 / 可复现性

论文额外做了有意思的分析：**不同基础模型的 chain-of-thought 推理深度，是否与结构准确性、可复现性相关？** 这探究的是"LLM 的推理质量"如何影响因果发现——这部分结果指向"挑战仍在"（见下）。

---

## 6. 关键结果与发现

### 6.1 主结论（正面）

> "CausalFusion produces DAGs more closely aligned with ground truth than both classical algorithms and LLM-only baselines, while offering interpretable reasoning at each iteration."

三点：

1. **比经典算法准**：LLM 注入的领域知识补了统计法盲区。
2. **比 LLM-only 准**：迭代证伪淘汰了 LLM 的幻觉边——**这是范式有效性的核心证据**（纯 LLM 不够，必须加证伪循环）。
3. **可解释**：每轮推理可读——这对运维场景（操作员要能理解 Agent 的因果判断）极重要。

### 6.2 挑战（论文诚实承认）

> "though challenges in reproducibility and generalizability remain."

两个挑战：

- **可复现性（reproducibility）**：LLM 输出非确定，同一输入不同运行可能给不同 DAG——这与 [04 Journal](04_不可篡改证据链_Investigation-Journal.md) 强调的"可复现"要求有张力。
- **泛化性（generalizability）**：在一个域调好的表现能否迁移到另一域（与 [06 ERRORPROBE](06_可验证情景记忆_ERRORPROBE.md) 的跨域迁移问题同源）。

CoT 分析的结果也指向：**更深的推理不一定线性提升结构准确性或可复现性**——LLM 推理质量与因果发现质量的关系复杂，不是"想得越多越对"。

### 6.3 结果的方法论意义

"比 LLM-only 准"这一条，是**对 [01 反证优先](01_反证优先_Falsification-First.md) 的量化背书**：它用受控实验证明，给 LLM 加一个证伪循环（而不是让 LLM 单独干），因果发现的准确性显著提升。这把"反证优先"从工程经验升级为有实验支撑的方法论。

---

## 7. 相关工作谱系（Amazon Science 的因果簇）

母文档列出 CausalFusion 同团队/同脉络的几项工作，构成一个"因果 + 证伪 + RCA"的研究簇：

| 工作 | 贡献 | 与本主题的关系 |
|---|---|---|
| **CausalFusion**（AAAI 2026） | LLM + 图证伪的因果发现 | 本文件主题 |
| *Toward falsifying causal graphs using a permutation-based test* | permutation 式因果图证伪 | CausalFusion 的证伪统计工具之一（§4.5） |
| *Causal structure-based root cause analysis of outliers* | 用因果结构做异常的 RCA | 直接对接故障定位（outlier = 故障信号） |
| *Explaining changes in real-world data* | 局部因果机制独立性 → 故障定位 | 解释"数据为什么变了"= 定位变化源 = 根因 |
| **DoWhy**（PyWhy 开源库） | 因果推断/反事实的开源工具 | 已用于微服务/service mesh RCA（见 AWS blog） |

这个研究簇的共同主线：**用因果结构（DAG）+ 证伪/反事实，把"相关"升成"因果"，把"异常"升成"根因"**。这与 AWS DevOps Agent 的工程实践是同一套思想在学术侧的展开。

### 7.1 DoWhy 在微服务 RCA 的落地（工程闭环）

AWS 开源博客有 *Root Cause Analysis with DoWhy*：把 DoWhy 的因果推断用到微服务/service mesh 的 RCA——用观测数据估计"如果干预某个服务，延迟会怎样变化"（L2 干预，Pearl 阶梯）。这是 CausalFusion 思路（因果结构 + 数据证伪）在生产 RCA 的开源实现，形成了"论文（CausalFusion）→ 工具（DoWhy）→ 产品（DevOps Agent）"的完整链路。

---

## 8. 局限与开放问题

### 8.1 LLM 非确定性 vs 可复现性

LLM 的采样非确定性与因果发现要求的可复现性直接冲突。同一数据集，CausalFusion 多次运行可能给不同 DAG。**对策方向**：低温采样 + 多数投票 + 证伪循环收敛准则（让不同 run 在足够多轮证伪后收敛到同一稳定图）。这也是论文列为"挑战"的点。

### 8.2 领域知识的正确性假设

CausalFusion 假设 LLM 的领域知识"大致正确"。若 LLM 对某领域的因果先验是错的（训练语料有偏差/过时），它会持续提错候选，证伪循环可能也救不回来（证伪只能删不支持边，不能凭空加对的边）。**对策**：领域知识需可被数据/专家校正；高 stakes 场景仍需 [06](06_可验证情景记忆_ERRORPROBE.md) 式的可执行验证或 [07](07_形式化验证兜底_SMT.md) 式的形式化兜底。

### 8.3 规模/复杂度瓶颈

大规模 DAG（成百上千节点）的证伪检验组合爆炸。CausalFusion 在供应链规模有效，但超大规模系统的因果发现仍难。**对策**：先用 [02 拓扑](02_结构因果先验_Topology-Graph.md) 把图分块（模块化因果），再在每个模块内做证伪——这正是 AWS DevOps Agent 的做法（拓扑给大结构，证伪在小范围内做）。

### 8.4 潜在混淆变量未观测

因果发现的基本限制：未观测的混淆变量会让边/方向判断出错。CausalFusion 不解决这个问题（需要敏感度分析或工具变量等额外手段）。**对策**：对关键因果结论，显式标注"假设无未观测混淆"，并保留为 hypothesis 而非确定结论（与 [01](01_反证优先_Falsification-First.md) 的三档标签一致）。

---

## 9. 对故障感知/恢复系统的工程启示

把 CausalFusion 的发现转成可操作的设计原则：

1. **诊断 = 因果发现**：把故障根因定位视为"在系统变量间发现因果图"——根因就是"被多模态证据支持、且对所有证伪免疫的那个节点"。
2. **必须加证伪循环**：不要让 LLM 单轮直接输出根因；强制 propose→falsify→refine，并用 SHD 类指标（命中率/误淘汰率）持续评估。
3. **LLM + 统计分工**：LLM 注入领域先验（"哪些更可能是因"），统计模块（条件独立性、时间因果 [03](03_时间因果约束_Temporal-Causality.md)）做冷酷证伪。两者不可互相替代。
4. **方向靠多源破对称**：因果方向单靠数据定不了，用 [02 拓扑](02_结构因果先验_Topology-Graph.md)（架构方向）+ [03 时间](03_时间因果约束_Temporal-Causality.md)（时序方向）+ LLM 领域知识三方投票。
5. **接受可复现性挑战**：用低温 + 多数投票 + 收敛准则缓解非确定性；并在 [04 Journal](04_不可篡改证据链_Investigation-Journal.md) 记录完整证伪链，让"不可复现"至少变成"可审计"。
6. **模块化降规模**：超大规模系统先按拓扑分块，再块内做因果证伪——避免组合爆炸。

---

## 10. 与 7 项根技术的整合定位

CausalFusion 不是孤立工作，它是**根技术栈学术侧的镜子**：

```
   CausalFusion (AAAI 2026)
        │
        ├── propose   ↔  根技术 1 反证优先（多元猜想 + 证伪）
        │              ↔  根技术 2 结构因果（DAG = 因果结构）
        │
        ├── falsify   ↔  根技术 1 反证检验（CI test / permutation = 反证探针）
        │              ↔  根技术 3 时间因果（方向判定的统计依据之一）
        │
        ├── refine    ↔  根技术 1 收敛规则（通过证伪 → 收敛）
        │
        ├── LLM 角色   ↔  DevOps Agent 的假设生成器
        │
        └── 统计模块   ↔  DevOps Agent 的交叉验证矩阵（非 LLM 的冷酷判决）
```

它的独特贡献是用 **SHD 量化**证明了这个范式有效——给 AWS 的工程实践补上了"为什么这么做是对的"的学术证据。

---

## 11. 一句话回到本质

> **CausalFusion 用因果发现这个有标准答案的受控领域证明：给 LLM 加一个"形式化证伪循环"，比纯 LLM 或纯统计都更准、更可解释。这与 AWS DevOps Agent 的"假设生成→反证检验→淘汰收敛"完全同构——证明后者不是工程取巧，而是 Popper 可证伪主义 + Pearl 因果图在产业系统上的正当落地。**

---

## 12. 参考文献

- **CausalFusion: Integrating LLMs and Graph Falsification for Causal Discovery**（AAAI 2026）—— [OpenReview tHKxko3j2m](https://openreview.net/forum?id=tHKxko3j2m) | [PDF](https://cdn.amazon.science/a6/d6/253deb3f4d11a9b6e88fc2f9e945/causalfusion-copy.pdf)。本文件主题。
- Spirtes, Glymour, Scheines, *Causation, Prediction, and Search*（PC 算法，§4.2）。
- Shimizu et al. (2006), "A Linear Non-Gaussian Acyclic Model for Causal Discovery"（LiNGAM，§4.4）。
- *Toward falsifying causal graphs using a permutation-based test*（Amazon Science，§4.5）。
- *Causal structure-based root cause analysis of outliers*（Amazon Science，§7）。
- *Explaining changes in real-world data*（Amazon Science，§7）。
- [Root Cause Analysis with DoWhy (AWS Open Source blog)](https://aws.amazon.com/blogs/opensource/root-cause-analysis-with-dowhy-an-open-source-python-library-for-causal-machine-learning/) —— DoWhy 用于微服务 RCA（§7.1）。
- Pearl, *Causality*（SCM、do-演算、马尔可夫等价类的理论基础）。
- 与本文件夹的交叉：[01 反证优先](01_反证优先_Falsification-First.md)、[02 结构因果先验](02_结构因果先验_Topology-Graph.md)、[03 时间因果](03_时间因果约束_Temporal-Causality.md)、[07 形式化验证兜底](07_形式化验证兜底_SMT.md)。
