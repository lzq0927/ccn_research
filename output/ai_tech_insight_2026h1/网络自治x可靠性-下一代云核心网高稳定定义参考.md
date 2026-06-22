# 网络自治 × 可靠性:下一代云核心网「高稳定」定义与规划参考

> 洞察日期:2026-06-22
> 范围:工业界( TM Forum / ETSI / ITU-T / 3GPP / IETF / 主流厂商)与学术界最新理论与优秀实践,聚焦 AI Agent 使能的网络自治,并突出可靠性领域的独特价值。
> 用途:为下一代云核心网「高稳定」定义与规划提供技术参考。

---

## 0. 先对齐两个框架(能力轴 × 价值轴)

网络自治是「能力轴」,可靠性是「价值轴」。业界权威模型恰好把它们编织在一起。

| 「网络自治五自」 | 对应业界权威术语 | 标准出处 |
|---|---|---|
| **自感知** | Observability / Awareness / Anomaly Detection / 实时数字孪生映射 | TMF AN「Awareness」轴;ITU-T Y.3090 [1];arXiv「Self-Awareness module」[2] |
| **自愈合** | Self-Healing / Auto-remediation / Fault Mgmt 闭环 | ETSI ZSM 闭环 [3];ETSI WP69 NDT [4];rApps 自愈 |
| **自验证** | Continuous Validation / IBN Assurance / 数字孪生「what-if」预演 | IETF RFC 9315 [5];TMF TR284G (DTCLA) [6];Forward Networks/IP Fabric |
| **自闭环** | Closed-Loop Automation | ETSI GS ZSM 009 系列 [3];CLARA [7];Ericsson 五阶段闭环 |
| **自演进** | Active Learning / 模型生命周期 / 联邦学习 / 在线 RL | 3GPP Rel-20 联邦 AI/ML [8];Phoenix Stack [9];Ericsson active learning |

「可靠性四段论」(不出故障 → 影响小 → 快速恢复业务 → 快速修复)几乎一比一对应业界 **Resilience Engineering** 的 Prevention → Containment → Recovery → Remediation 四象限,见第三节。

> **一句话定位**:业界共识是——自治网络的**最高价值、最成熟落地场景就是可靠性/运维域(fault management)**;而可靠性又是自治**最该上、也最难上**的场景,因为它对「可信、可验证、可回滚」要求最高。这正是「可靠性领域独特价值」的双面性。

---

## 一、权威理论框架

### 1.1 TM Forum 自治网络等级模型(AN Levels L0–L5)——业界事实标准

| 等级 | 名称 | 关键特征 | 闭环范式 |
|---|---|---|---|
| L0 | Manual | 全人工 | 无 |
| L1 | Assisted O&M | 工具辅助,人执行 | — |
| L2 | Partial Autonomous | 部分任务系统自闭环,人监督 | 规则驱动 |
| L3 | Conditional Autonomous | 系统处理多数任务,**intent 驱动**闭环,人处理异常 | **Intent-driven** |
| L4 | Highly Autonomous | **知识驱动**,跨域闭环,人极少介入 | **Knowledge-driven** |
| L5 | Fully Autonomous | 端到端自管理/自愈合/自优化,人只管意图与商业目标 | 全自治 |

- 现状:IBM IBV 调研,全球运营商网络域平均自治度仅 **1.9 级** [12];Nokia Bell Labs 评估多数 CSP 在 L1–L2 [13]。
- 目标:TMF 使命是推动产业达到 **L4 并超越**;最新蓝图是 **IG1401 v6.0.0「AN Level 4 Industry Blueprint」(2024-11)** [14],2025 Catalyst「Make AN Level 4 Real」[15]。
- **对标建议**:云核心网「高稳定」可直接把目标锚定在 **L3(2025–2026)→ L4(2027–2028)**,L5 作为长期愿景。

### 1.2 ETSI ZSM(Zero-touch Network & Service Management)——闭环架构骨架

把 **Assurance(保障/感知)↔ Fulfillment(执行/愈合)** 连成闭环 [3]。核心标准族:

- **ETSI GS ZSM 009 系列**:Closed-Loop Automation 解决方案(E2E 业务与网络管理)。
- **ETSI GR ZSM 011 V2.1.1(2024-09)** [16]:最新闭环自动化方案报告。
- **ETSI White Paper 69「AI in the Evolution of Autonomous Networks」** [4]:明确提出 **Network Digital Twin(NDT)是使能 self-healing / self-optimising / self-configuring、迈向更高可靠性的核心**。

### 1.3 ITU-T Y.3090 数字孪生网(DTN)+ IETF/TMF 协同

- **ITU-T Y.3090(2022-02)** 定义 DTN 为「虚实映射、构建网络闭环的可扩展仿真平台」[1]——这是「自验证」的理论基石:**先在孪生体里预演,再下发到物理网**。
- **TMF TR284G「Digital Twin & Closed-Loop Automation(DTCLA)」** [6]:把数字孪生 + 闭环组合成自治运维范式。
- **IETF NMRG draft-irtf-nmrg-network-digital-twin-arch** [17]:补充参考架构。

### 1.4 3GPP SA5(标准侧,直接影响 5GC/6GC)

- **Rel-19**:MDA(管理数据分析)+ **CCL(Closed Control Loop)** 与 MDAS、AI/ML 协同 [18];2025-07 ZSM/SA5 联合研讨会明确「**CCL 是自治代理(Autonomous Agents)的使能器**」[19]。
- **Rel-20 / 6G**:演进管理架构以全面承载 AI、提升「网络自治等级(Network Autonomous Level)」、intent 驱动管理智能;**联邦 AI/ML 生命周期**实现多网络协同训练/验证/再训练 [8][20]。
- **TMF / 3GPP SA5 Fault Management Harmonization(TR183)** [21]:故障管理标准化对齐——可靠性是标准化最先收敛的域。

### 1.5 IETF 意图网络(IBN)——「自验证」的语言学基础

- **RFC 9315「Intent-Based Networking: Concepts and Definitions」** [5]。
- 业界数据:IBN 通过对变更的**自动化验证**,可减少网络中断 **>50%** [22];NetBrain 明确「**没有验证,intent 就无法被可靠执行**」[23]。

---

## 二、AI Agent 如何使能网络自治(2026 最新)

### 2.1 从 AIOps → GenAI → Agentic AI 的三代演进

| 代际 | 范式 | 能力边界 |
|---|---|---|
| 1.0 | AIOps(规则/传统 ML) | 异常检测、告警归并 |
| 2.0 | GenAI/LLM+RAG | 知识问答、根因解释、配置生成 |
| **3.0** | **Agentic AI(智能体)** | **规划+推理+工具调用+闭环执行,可自主决策与协同** |

Appledore 预测:电信 Agentic AI 支出从 **2025 年 0.92 亿美元 → 2030 年 62 亿美元**,最强动能在**网络运维与保障(network operations & assurance)** [24]。

### 2.2 2026 最新工业实践

**① ZTE《Agentic Telecom LLM:A New Driving Force for L4 Autonomous Networks》(2026)** [25]
> 明确提出:Agentic Telecom LLM 将重塑自治网络能力边界,**驱动 L4 从试点验证走向规模化部署**。

**② Ericsson《Agentic AI: Pathway to Autonomous Network Level 5》** [26]——细节最完整的公开参考架构:
- **Supervisor Agent(策略大脑)+ 专业化 Agent 生态**:Cell Anomaly Detector(处理 6 万+ KPI、20 类问题)、Root Cause Explainer(每类 20 子因)、General/Specialized Optimizer(RET/AAS Cell Shaper、Uplink Interference Optimizer 等)。
- **五阶段闭环**:Measure → Assure → Purpose → Evaluate → **Actuate**(评估先行、按收益再执行)——这正是「自闭环 + 自验证」。
- **Intent Management Function(IMF)**:运营者只声明意图,系统做意图翻译、持续感知、收益评估、再执行,保留可选 **human-in-the-loop**。
- **「Talk to Network」**:自然语言接口(网络怎么了/该修什么/有哪些方案/最佳方案)。
- 量化收益:**分析决策时间下降 80%**。

**③ TM Forum DTW 2026 Catalysts(本年度风向标)** [27]:
- **ALE-X(C26.0.929)**:用 **Graph AI + 数字孪生**做预测性根因分析,目标 L4 自治——典型「自验证+自愈合」。
- **Agentic NOC(C26.0.924)**:AI 原生运维、**predictive resilience**、安全的 intent 管理。
- **Agent Fabric: A2A-T Runtime(C26.0.910)**:**Agent-to-Agent Telecom 运行时**,强调安全可信连接与合规。
- **Essential Framework for Telecom Agentic AI(C26.0.941)**:电信 Agentic AI 的全生命周期蓝图。
- 获奖项目「**L4 Autonomous Networks: Agent-powered zero-touch workflows**」:用 AI Agent 实现**零接触故障修复(zero-touch fault remediation)**。

**④ Deutsche Telekom / NVIDIA / NETSCOUT / STL** [28][29][30]:
- DT:LLM + 推理框架驱动的 AI Agent,自主检测并解决问题。
- NETSCOUT:用 CSP 专属领域数据微调 LLM 实现自愈。
- STL:多 Agent 系统 + 智能层 + 数字孪生的「自愈网络」演进路径。

**⑤ 标准侧 2026 动作**:
- **IETF draft-jadoon-nmrg-agentic-ai-autonomous-networks** [31]:为自治网络定义 Agentic AI 架构原则(规划/推理/工具调用/闭环/可治理)。
- **IEEE JAS 2026、Frontiers、arXiv** [32][33]:6G = **AI-native**,网络具备「感知-学习-推理-自适应」实时闭环。

### 2.3 多 Agent 编排是 L4/L5 的「最后一公里」

Ericsson 的实践点出关键结论:**单 Agent 不够,需要「Supervisor + 专业化 Agent + 数字孪生 + IMF」的层级化编排**。映射到「自演进」:每个 Agent 配 rApp、做 RAG、有评估-执行闭环,持续 active learning,这是从 L4 走向 L5 的必由路径。

---

## 三、可靠性领域的「独特价值」

可靠性/故障域是网络自治**价值最高、最成熟,但风险也最大**的场景——这种「双面性」正是其独特价值所在。

### 3.1 「四段论」↔ 业界工程实践对照表

| 可靠性四段论 | 业界术语 | 使能技术 / 架构要素 | 自治角色 |
|---|---|---|---|
| **① 不出故障** | Prevention / Fault Avoidance / Resilience-by-Design | **Stateless 无状态化**[34][35]、NF 解耦(PP5GS 过程级分解 [36])、冗余与 geo-redundancy active-active [37]、**混沌工程**主动注入故障发现隐患 [38][39]、**数字孪生预验证**变更 [1] | 自感知 + 自验证(预防式) |
| **② 出故障影响小** | Containment / Blast Radius 控制 | 微服务粒度隔离、**bulkhead 舱壁 / circuit breaker 熔断** [40]、故障域隔离、graceful degradation | 自感知 + 自闭环 |
| **③ 出故障快速恢复业务** | Recovery / 业务连续性(RTO↓) | 无状态秒级重启、K8s 自愈(自动重调度/重启)[40]、流量调度/灾备切换、geo-redundancy | 自愈合(应急回路) |
| **④ 出故障快速修复** | Remediation / Root-Cause Fix(MTTR↓) | Agent 驱动诊断+修复、根因分析(Ericsson RCA)、**zero-touch fault remediation** [27] | 自愈合 + 自验证(根治回路) |

> **关键洞察**:③ 和 ④ 要**分开定义 KPI 与机制**——③ 是「业务先通」(恢复时间),④ 是「根因先除」(修复时间)。很多架构把二者混为一谈,导致要么恢复慢,要么修了又坏。下一代云核心网应明确区分 **RTO(业务恢复)** 与 **MTTR(根因修复)** 两套指标。

### 3.2 可靠性域的独特性——为什么它「最该上 Agent,也最难上」

1. **闭环最清晰、数据最结构化**:故障 → 检测 → 诊断 → 修复 是天然闭环,告警/KPI/日志结构化程度高,**最适合** AI Agent 优先突破(这也是 2026 Catalysts 全部聚焦 fault remediation 的原因)。
2. **价值最高**:中断/SLA 违约成本极高,自治收益直接可量化。
3. **风险也最高**:**错误的自治动作可能直接制造中断**。因此可靠性域对自治的「可信」要求远高于其他场景,催生三个独有的「安全阀」:
   - **自验证(Self-verification)**:动作前先在数字孪生里预演、预检、canary [5][6][22]。
   - **可回滚/可逆(Reversibility)**:变更默认带回滚预案,blast radius 可控。
   - **Human-in-the-loop + 收益评估**:Ericsson「Evaluate→按收益再 Actuate」、IMF + 可选人工介入 [26]。

> **可靠性域的独特价值命题**:网络自治不是「替代人」,而是把人从「firefighting」里解放出来,**用 Agent 承担高频、低风险、强模式的修复,把人留在高风险、跨域、首次出现的异常决策上**。这正是「高稳定」的核心定义——稳定不只是 MTBF 高,而是 **「故障不可避免,但影响可控、恢复可期、修复可自动」** 的系统韧性。

### 3.3 量化锚点(供定义「高稳定」参考)

- **5 个 9(99.999%)= 年停机 ≤5.26 分钟** [41],但 Paessler 等指出「单看可用性不足」,应叠加**韧性指标**(MTTD、MTTR、RTO、变更故障率、自治覆盖率)。
- 业界从「reactive」走向「proactive/predictive resilience」:ALE-X、Agentic NOC 都以 **predictive** 为卖点 [27]。

---

## 四、技术特征总结(可直接喂给下一代云核心网定义)

提炼为 **12 条「高稳定 + 自治」技术特征**,每条给出「定义要点」与「使能技术」:

| # | 技术特征 | 定义要点 | 使能技术 |
|---|---|---|---|
| 1 | **意图驱动(Intent-Driven)** | 运营者声明目标,系统翻译并执行 | IBN(RFC 9315)、IMF、TMF L3+ |
| 2 | **自感知实时化** | 全栈可观测、亚秒级遥测、异常先于用户发现 | Observability、anomaly detection、DTN 实时映射 |
| 3 | **闭环自治(Closed-Loop)** | 感知→决策→执行→验证自动闭环 | ETSI ZSM 009、CCL、五阶段闭环 |
| 4 | **数字孪生预验证** | 变更/修复先在孪生体预演,降低二次故障 | ITU-T Y.3090、TMF TR284G、ALE-X Graph AI |
| 5 | **Agentic 多 Agent 编排** | Supervisor + 专业 Agent 协同 | Agentic AI、A2A-T、rApps |
| 6 | **可验证 / 可回滚(Trust & Safety)** | 每个自治动作可验证、可逆、blast radius 可控 | Canary、pre-check、回滚预案 |
| 7 | **无状态 + 弹性韧性** | 状态外置、秒级恢复、水平扩展 | Stateless NF、K8s、Network Data Layer |
| 8 | **故障域隔离 / 爆炸半径控制** | 单点故障不扩散 | 微服务、bulkhead、circuit breaker |
| 9 | **预测式韧性(Predictive)** | 从被动救火→主动预测预防 | ML 预测、proactive fault mgmt |
| 10 | **自演进 / 持续学习** | 模型与策略在线迭代、跨域协同 | Active learning、在线 RL、联邦学习(Rel-20) |
| 11 | **Telecom-LLM / 领域知识内化** | 用电信语料精调的 LLM 驱动 L4 | Agentic Telecom LLM、RAG、领域微调 |
| 12 | **AI 原生架构(AI-Native)** | AI 不是外挂,而是网内一等公民 | 6G AI-native、3GPP SA5 Rel-20 |

---

## 五、对「下一代云核心网高稳定定义与规划」的落地建议

1. **双指标体系**:同时定义 **可用性(5 个 9 / 年停机)** + **韧性指标(MTTD/MTTR/RTO/变更故障率/自治闭环覆盖率)**,并区分「业务恢复(RTO)」与「根因修复(MTTR)」。
2. **分级目标**:云核心网按 **L3(intent 闭环、人审异常)→ L4(知识驱动、跨域闭环)** 演进;故障修复域优先冲 L4(zero-touch remediation),跨域编排与首次故障保留人审。
3. **架构优先项**:无状态化 + 故障域隔离 + geo-redundancy(对应①②③);数字孪生预验证 + Agent 驱动自愈(对应③④)。
4. **Trust & Safety 先行**:任何 Agent 自治动作默认「预演→小范围→评估收益→执行→可回滚」,这既是 Ericsson 五阶段闭环的精华,也是可靠性域区别于其他域的护城河。
5. **风险红线**:Agent 误动作 = 新中断源。必须建 Agent 治理(权限/审计/回滚/human-in-the-loop),参考 IETF Agentic AI 架构原则 [31]、TMF A2A-T 安全可信运行时 [27]。
6. **演进抓手**:从「故障域」切入(价值高、闭环清晰),先做**告警降噪 + 根因解释 + 已知故障自动修复 + 变更预验证**,再扩到容量/性能/能耗优化。

---

## 六、可选深化方向

- **(a)** 把「可靠性四段论」展开成可落地的 KPI 体系与阈值。
- **(b)** 画一张「下一代云核心网 L3→L4 自治目标架构图」。
- **(c)** 针对「Agent 误动作风险」出一份治理与安全设计清单。
- **(d)** 把数字孪生预验证做成分阶段建设路线。

---

## Sources

[1] ITU-T Y.3090 Digital Twin Network — https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-Y.3090-202202-I!!PDF-E&type=items
[2] Leveraging AI Agents for Autonomous Networks (arXiv 2509.08312) — https://arxiv.org/html/2509.08312v2
[3] ETSI ISG ZSM — https://www.etsi.org/technical-groups/zsm/
[4] ETSI WP69 — AI in the Evolution of Autonomous Networks — https://www.etsi.org/images/files/ETSIWhitePapers/ETSI-WP-69-AI-in_the_evolution_of_Autonomous_Networks.pdf
[5] IETF RFC 9315 — Intent-Based Networking: Concepts and Definitions — https://datatracker.ietf.org/doc/html/rfc9315
[6] TMF TR284G — Digital Twin and Closed-Loop Automation — https://www.tmforum.org/resources/introductory-guide/tr284g-digital-twin-and-closed-loop-automation-for-autonomous-network-operations-v1-0-0/
[7] CLARA: Closed-Loop Zero-touch Network Management — https://www.researchgate.net/publication/357609482_CLARA_Closed_Loop-based_Zero-touch_Network_Management_Framework
[8] LENOVO view on SA5 Rel-20 6G Priorities(联邦 AI/ML 生命周期)— https://flecon6g.eu/wp-content/uploads/2025/06/LENOVO-view-on-SA5-Rel-20-6G-Priorities.pdf
[9] Phoenix Stack: Self-Healing Microservice Architecture — https://papers.ssrn.com/sol3/Delivery.cfm/5343101.pdf?abstractid=5343101
[10] TMF Autonomous Networks Mission — https://www.tmforum.org/missions/autonomous-networks
[11] TMF AN Resources(L0–L5)— https://www.tmforum.org/topics/an-resources/
[12] IBM IBV — Navigating Autonomous Networks — https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/autonomous-networks
[13] Nokia Bell Labs — Autonomous Networks: Current State — https://www.nokia.com/bell-labs/bell-labs-consulting/articles/autonomous-networks-what-is-the-current-state-and-how-to-move-forward/
[14] TMF IG1401 v6.0.0 — AN Level 4 Industry Blueprint — https://www.tmforum.org/resources/introductory-guide/ig1401-tm-forum-an-journey-guide-level-4-industry-blueprint-high-value-scenarios-v6-0-0/
[15] Catalyst「Make AN Level 4 Real」— https://www.tmforum.org/catalysts/projects/M25.5.862/make-an-level-4-real
[16] ETSI GR ZSM 011 V2.1.1 (2024-09) — https://www.etsi.org/deliver/etsi_gr/ZSM/001_099/011/02.01.01_60/gr_ZSM011v020101p.pdf
[17] IETF NMRG Network Digital Twin Architecture — https://datatracker.ietf.org/doc/draft-irtf-nmrg-network-digital-twin-arch/
[18] 3GPP SA5 Rel-19 Management & Orchestration — https://www.3gpp.org/technologies/sa5-rel19
[19] 3GPP SA5 CCL — Enabler for Autonomous Agents (2025-07) — https://www.3gpp.org/ftp/tsg_sa/wg5_tm/Joint_meetings/2025_07_ZSM_SA5_WS/3GPP%20SA5%20CCL%20an%20Enabler%20for%20Autonomous%20Agents.pdf
[20] 3GPP SA5 Rel-20 6G OAM Work Area Summary — https://www.3gpp.org/ftp/Email_Discussions/SA5/SA5_Workshop_on_6G_Rel20/
[21] TMF/3GPP SA5 Fault Management Harmonization TR183 — https://www.tmforum.org/resources/technical-report/tr183-3gpp-sa5-tm-forum-tip-fault-management-harmonizationtr183_tmf-3gpp_fmh_tr_v1-3/
[22] Forward Networks — Accelerating Network Verification with IBN — https://forwardnetworks.com/wp-content/uploads/2021/11/Forward-paper-FINAL.pdf
[23] NetBrain — What is Intent-Based Networking — https://www.netbrain.com/blog/what-is-intent-based-networking/
[24] Appledore Research — Agentic AI: Advancing Autonomous Networks — https://appledoreresearch.com/report/agentic-ai-advancing-autonomous-networks/
[25] ZTE Technologies (2026) — Agentic Telecom LLM: Driving Force for L4 — https://www.zte.com.cn/content/zte-site/www-zte-com-cn/global/about/magazine/zte-technologies/2026/special-topic--autonomous-networks/expert-views-/agentic-telecom-llm--a-new-driving-force-for-l4-autonomous-networks.html
[26] Ericsson — Agentic AI: Pathway to Autonomous Network Level 5 — https://www.ericsson.com/en/blog/2025/7/agentic-ai-pathway-to-autonomous-network-level-5
[27] TM Forum DTW 2026 Catalysts — https://www.tmforum.org/events/dtw/whats-on/catalysts-innovation/catalysts(ALE-X / Agentic NOC / Agent Fabric A2A-T / Essential Framework)
[28] Deutsche Telekom — AI Agents for Mobile Network — https://www.telekom.com/en/media/media-information/archive/ai-agents-for-mobile-network-1099054
[29] NETSCOUT — Telecom Networks Heal Thyself with AI — https://www.netscout.com/blog/telecom-networks-heal-thyselfwith-ai
[30] STL Partners — Autonomous Networks: Role of Multi-Agent Systems — https://stlpartners.com/research/autonomous-networks-the-role-of-multi-agent-systems/
[31] IETF draft-jadoon-nmrg-agentic-ai-autonomous-networks — https://datatracker.ietf.org/doc/draft-jadoon-nmrg-agentic-ai-autonomous-networks/
[32] arXiv — Toward Agentic AI-Native Networks for Autonomous Intelligence — https://arxiv.org/html/2605.01546v1
[33] Frontiers — A Comprehensive Review of AI-Native 6G — https://www.frontiersin.org/journals/communications-and-networks/articles/10.3389/frcmn.2025.1655410/full
[34] Enea — Benefits of Network Data Layer(stateless)— https://www.enea.com/wp-content/uploads/2022/12/5GDM-6-Benefits-of-Network-Data-Layer.pdf
[35] Nokia/AWS — Building a Cloud Native Core for 5G — https://pages.awscloud.com/rs/112-TZM-766/images/02%2520Nokia_cloud_native_core_White_Paper_EN.pdf
[36] TU Munich — PP5GS Stateless 5G Core Architecture — https://mediatum.ub.tum.de/doc/1695118/9z0h8svu330r8up1ejyajrw2s.tnsm-pp5g.pdf
[37] A10 Networks — 5G Network Reliability Explained — https://www.a10networks.com/blog/5g-network-reliability-explained/
[38] Google Cloud — Getting Started with Chaos Engineering — https://cloud.google.com/blog/products/devops-sre/getting-started-with-chaos-engineering
[39] Splunk — Chaos Testing Explained — https://www.splunk.com/en_us/blog/learn/chaos-testing.html
[40] Self-Healing Microservices Architecture(IJETCSIT)— https://ijetcsit.org/index.php/ijetcsit/article/view/381
[41] phoenixNAP — Five Nines Availability — https://phoenixnap.com/glossary/five-nines
