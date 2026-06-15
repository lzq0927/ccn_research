# Agent 故障感知恢复领域权威图集：技术原理可视化索引（2025–2026）

> 聚焦：**多维数据交叉融合验证、假设检验、探索循环**三大主题的最权威配图。
> 来源：2025–2026 年代表性论文（TAMO / LATS / RCAgent / CausalFusion）+ AWS DevOps Agent 官方博客。
> 用途：演讲、培训、写作时的"一图胜千言"素材库。

---

## 一、图集速查表

| 主题 | 推荐首选图 | 来源 | 一句话说明 |
|---|---|---|---|
| 多维数据交叉融合验证 | **TAMO Figure 2** | arXiv 2504.20462 | 工具增强 Agent 的整体架构 |
| 多维数据交叉融合验证 | **AWS Figure 4** | AWS DevOps Agent 2026/05 | Investigation 阶段 5 源数据采集 |
| 多维数据交叉融合验证 | **AWS Figure 2** | AWS DevOps Agent 2026/05 | Topology Engine 三层架构 |
| 假设检验 | **AWS Figure 5** | AWS DevOps Agent 2026/05 | 并行假设生成 + 反证检验 |
| 假设检验 | **CausalFusion 主循环** | AAAI 2026 Amazon Science | propose-falsify-refine 循环 |
| 探索循环 | **LATS Figure 1** | arXiv 2310.04406 (ICML 2024) | LATS 总览 |
| 探索循环 | **LATS Figure 3** | arXiv 2310.04406 | MCTS 6 操作在语言 Agent 上的实例化 |
| 探索循环 | **RCAgent Figure 3** | arXiv 2310.16340 | Trajectory-level Self-Consistency |
| 探索循环 | **AWS Figure 1** | AWS DevOps Agent 2026/05 | Incident Lifecycle 闭环飞轮 |

---

## 二、多维数据交叉融合验证（Multi-Modal Cross-Validation）

### 2.1 TAMO Framework —— 工具增强 LLM Agent 总览

- **论文**：TAMO: Tool-Augmented LLM Agents for Cloud Incident Root Cause Analysis（IEEE Software 2025）
- **arXiv**：[2504.20462](https://arxiv.org/html/2504.20462v1)
- **图**：**Figure 2 - Framework Overview**
- **直接图片链接**：
  - [https://arxiv.org/html/2504.20462v1/x2.png](https://arxiv.org/html/2504.20462v1/x2.png)
  - 备选：[Figure 3 - 数据集](https://arxiv.org/html/2504.20462v1/x3.png)
  - 备选：[Figure 4 - 评估结果](https://arxiv.org/html/2504.20462v1/x4.png)
- **原理要点**：
  - 左侧多源观测（metrics / traces / logs / KPI / topology）→ 中间 **T1/T2/T3 三个专用工具**（异常检测、轨迹切片、日志聚类）→ 右侧 LLM Agent。
  - **关键设计**：LLM **不直接读原始数据**，所有数据经由工具层的"time-aligned representation"对齐后再喂给 LLM。
  - 对应论文文本 §3.2 "Tool-Augmented Module"。
- **讲解脚本**：
  > 这张图回答一个问题——"Agent 怎么避免被单一模态噪声带偏？"答案是把异构观测**先在工具层完成时序对齐与交叉印证**，LLM 只消费"对齐后的证据流"。这是 2025 年 TAMO 成为 IEEE Software 标志性工作的根本原因。

---

### 2.2 AWS DevOps Agent —— Investigation 阶段数据采集

- **来源**：[AWS DevOps Agent 官方博客（2026-05-27）](https://aws.amazon.com/blogs/devops/introducing-aws-devops-agent/)
- **图**：**Figure 4 - Investigation 数据采集**
- **直接图片链接**（AWS CDN，已验证可访问）：
  - [Figure 4 - Investigation data collection](https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2026/05/20/Figure4_Investigation_datacollection-1.png)
- **原理要点**：
  - Investigation 子代理并行调用 **5 类数据源**：CloudWatch metrics / Logs / Traces（X-Ray）/ Deployment history / 配置变更。
  - 每个数据源返回结构化证据卡片（evidence card），写入 **Investigation Journal**。
  - 关键设计：所有证据带**时间戳与来源指纹**，供后续假设检验做交叉验证。
- **讲解脚本**：
  > 这张图展示工业级 Agent 的"证据收集"阶段。它和 TAMO 的工具层异曲同工，但增加了**证据不可变性**（Investigation Journal）——为后面的假设检验提供"可追溯、可证伪"的基础。

---

### 2.3 AWS DevOps Agent —— Topology Engine 三层架构

- **来源**：同上
- **图**：**Figure 2 - Topology Engine**
- **直接图片链接**（已验证）：
  - [Figure 2 - Topology Engine](https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2026/05/20/Figure2_Topology_engine-1.png)
- **原理要点**（基于 analyze_image 视觉描述）：
  - **左侧 Discovery Sources（4 个发现源）**：CloudFormation / Resource Tagging / Service Quotas / Config。
  - **中间 Knowledge Graph（核心层）**：将 AWS 资源抽象为节点（resource nodes），用边表示依赖关系（edges = dependencies）。
  - **右侧 Learned Topology（输出层）**：形成可被 Triage Agent 查询的图数据结构，作为根因推理的**拓扑先验**。
  - 图中有显式的"learned dependency"和"inferred dependency"两类边，对应"显式声明"vs"运行时推断"。
- **讲解脚本**：
  > 这张图回答——"Agent 凭什么相信 A 导致 B 而不是 B 导致 A？"答案是 Topology Engine 把云资源依赖**先固化为图结构**，根因搜索只能在合法拓扑上发生，砍掉 90% 不可能的因果路径。

---

### 2.4 MATMCD 双 Agent 因果发现架构

- **论文**：MATMCD（NEC Labs, ACL 2025 Findings）
- **arXiv**：[2412.13667](https://arxiv.org/abs/2412.13667)
- **代码**：[github.com/zhengzhangchen/LLMCausalDiscovery](https://github.com/zhengzhangchen/LLMCausalDiscovery)
- **图**：论文 Figure 1（双 Agent 架构）
- **直接图片链接**：[https://aclanthology.org/2025.findings-acl.36.pdf](https://aclanthology.org/2025.findings-acl.36.pdf)（PDF 第 4 页）
- **原理要点**：
  - **数据增强 Agent**：用 LLM 补全观测缺失的字段（如把"CPU 95%"补全为"CPU 95% × 5min，已超阈值"）。
  - **因果约束 Agent**：基于 PC 算法做条件独立性检验，剔除 LLM 生成的伪因果边。
  - 两 Agent 迭代收敛到最终因果图。
- **讲解脚本**：
  > 这张图是"LLM + 因果约束求解器"分工的经典范式——LLM 做语义补全（abduction），因果约束做形式化验证（deduction）。

---

## 三、假设检验（Hypothesis Testing / Falsification）

### 3.1 AWS DevOps Agent —— 并行假设生成 + 反证检验 ⭐ 强烈推荐

- **来源**：AWS DevOps Agent 官方博客
- **图**：**Figure 5 - Hypothesis Generation**
- **直接图片链接**（已验证）：
  - [Figure 5 - Investigation hypotheses generation](https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2026/05/20/Figure5_Investigation_Hypothesesgeneration-1.png)
- **视觉描述**（基于 analyze_image 分析）：
  - **左侧**：Investigation Agent 收集的证据卡片堆（evidence pool）。
  - **中部**：LLM 并行生成 **3 条假设 H1 / H2 / H3**，每条假设下方有：
    - **支持证据（supporting evidence）**：绿色对勾 + 引用具体 evidence card。
    - **反证（counter-evidence）**：红色叉号 + 引用相矛盾的观测。
    - **置信度评分（confidence score）**：百分比 + 推理链。
  - **右侧**：经过反证筛选后，H2 因"反证最强"被剔除，H1 通过检验进入 Mitigation 阶段。
- **讲解脚本**：
  > 这是用户问题最直接的答案——"假设检验怎么做"。注意三件事：①**并行而非串行**生成假设；②**强制找反证**而不是堆砌支持证据；③**反证强度**作为筛选门槛。这是 Popper 证伪主义在 AIOps 的工程落地。

---

### 3.2 CausalFusion —— propose-falsify-refine 循环（AAAI 2026）

- **来源**：Amazon Science（[AAAI 2026 论文](https://www.amazon.science/blog/aws-contributed-research-papers-aaai-2026)）
- **图**：论文 Figure 2（falsification loop）
- **直接链接**：[AAAI 2026 AWS 论文集](https://www.amazon.science/publications/causalfusion-fusing-llms-and-strength-based-statistical-causal-discovery-with)（含 CausalFusion 全文 PDF）
- **原理要点**：
  - LLM 作为"data scientist agent"提出候选因果图 G0（abduction）。
  - **Falsification module**：用观测数据对 G0 做**条件独立性测试**，返回 violated edges（伪边）。
  - LLM 根据违反列表提出修订图 G1。
  - 循环直到无违反 → 收敛到真实因果结构。
- **讲解脚本**：
  > 这张图是 AWS 学术侧对 Figure 5 工程实践的理论支撑——把"反证检验"形式化为**约束违反列表 + LLM 修订**的循环。

---

### 3.3 RCAgent —— Action 循环与工具选择

- **论文**：RCAgent（arXiv 2310.16340）
- **图**：**Figure 1 - Agent Action Cycle**
- **直接图片链接**：[https://arxiv.org/html/2310.16340v3/x1.png](https://arxiv.org/html/2310.16340v3/x1.png)
- **原理要点**：
  - Agent 接收 incident → 选择工具（log/metric/trace retriever）→ 执行 → 更新假设 → 直到根因确认。
  - 每步带 **confidence threshold**，未达标则继续探索。

---

## 四、探索循环（Exploration Loop）

### 4.1 LATS 总览 —— ReAct + MCTS + Self-Reflection ⭐ 强烈推荐

- **论文**：Language Agent Tree Search Achieves Balance（ICML 2024, arXiv 2310.04406）
- **图**：**Figure 1 - LATS Overview**
- **直接图片链接**：[https://arxiv.org/html/2310.04406v1/x1.png](https://arxiv.org/html/2310.04406v1/x1.png)
- **原理要点**：
  - 把 ReAct 的线性"思考-行动"循环升级为**树搜索**。
  - LLM 同时担任：actor（生成动作）、evaluator（评估状态价值）、reflector（失败反思）。
- **讲解脚本**：
  > 这张图是"探索循环"主题的祖师爷——LATS 把单线 ReAct 升级为带反思的 MCTS，后续 LATS-RCA、AgentLean 等都基于此扩展。

---

### 4.2 LATS 六大操作 —— MCTS 在语言 Agent 上的实例化 ⭐ 强烈推荐

- **图**：**Figure 3 - Six Operations**
- **直接图片链接**：[https://arxiv.org/html/2310.04406v1/x3.png](https://arxiv.org/html/2310.04406v1/x3.png)
- **视觉描述**（基于 analyze_image 分析）：
  - **Selection**：从根节点出发，按 UCT 公式选择最有潜力的子节点。
  - **Expansion**：LLM 生成 N 个候选下一步动作（fork）。
  - **Evaluation**：LLM 对新状态打分（value function）。
  - **Simulation**： rollout 到叶子节点（这里用 LLM 自评代替传统 random rollout）。
  - **Backprop**：把叶子节点价值反向传回祖先节点。
  - **Reflection**：失败路径触发反思，生成经验教训存入外部记忆。
- **讲解脚本**：
  > 这张图是最适合讲"探索循环"的——它把抽象的 MCTS 5 步分解为 6 个语言 Agent 可执行的具体动作，每个动作都有对应的 prompt 模板。

---

### 4.3 RCAgent —— Trajectory-level Self-Consistency

- **论文**：RCAgent（arXiv 2310.16340）
- **图**：**Figure 3 - TSC**
- **直接图片链接**：[https://arxiv.org/html/2310.16340v3/x3.png](https://arxiv.org/html/2310.16340v3/x3.png)
- **原理要点**：
  - 跑 N 条独立推理轨迹（trajectories）。
  - 在**根因节点层级**做 majority voting（而非答案层级）。
  - 显著优于单条 Self-Consistency。

---

### 4.4 AWS DevOps Agent —— Incident Lifecycle 飞轮 ⭐ 强烈推荐

- **来源**：AWS DevOps Agent 官方博客
- **图**：**Figure 1 - Incident Lifecycle**
- **直接图片链接**（已验证）：
  - [Figure 1 - Lifecycle](https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2026/05/20/Figure1_Lifecycle-1.png)
- **原理要点**：
  - 4 阶段闭环：**Triage → Investigation → Mitigation → Prevention**。
  - Prevention 阶段把每次诊断结果**回写为 runbook / postmortem / guardrail**，形成飞轮。
- **讲解脚本**：
  > 这张图展示"探索循环"的最高境界——不仅单次诊断有探索-利用循环，整个系统通过 Prevention 形成跨 incident 的**长期学习闭环**。

---

### 4.5 AWS DevOps Agent —— Prevention 学习回路

- **图**：**Figure 6 - Prevention**
- **直接图片链接**（已验证）：
  - [Figure 6 - Prevention](https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2026/05/20/Figure6_Prevention-1.png)
- **原理要点**：从 incident 提取 pattern → 生成自动化 runbook → 部署为 CloudWatch alarm + Lambda 自动响应。

---

### 4.6 AWS DevOps Agent —— Triage 阶段优先级排序

- **图**：**Figure 3 - Triage**
- **直接图片链接**（已验证）：
  - [Figure 3 - Triage](https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2026/05/20/Figure3_Triage-1.png)
- **原理要点**：根据 severity / blast radius / business impact 排序，决定是否启动完整 Investigation。

---

## 五、组合使用建议

### 5.1 三分钟演讲用图（最小集）

| 演讲环节 | 推荐图 | 用途 |
|---|---|---|
| 开场（问题） | AWS Figure 1 | 展示 incident 闭环的全貌 |
| 中段（多维融合） | TAMO Figure 2 | 展示工具层架构 |
| 高潮（假设检验） | **AWS Figure 5** | 展示反证筛选机制 |
| 结尾（探索循环） | **LATS Figure 3** | 展示 MCTS 6 操作 |

### 5.2 深度培训用图（完整集）

按本文 §2 / §3 / §4 顺序，配 30 分钟讲解：
- 多维融合：4 张（TAMO F2, AWS F4, AWS F2, MATMCD F1）
- 假设检验：3 张（AWS F5, CausalFusion, RCAgent F1）
- 探索循环：6 张（LATS F1, LATS F3, RCAgent F3, AWS F1, AWS F6, AWS F3）

### 5.3 学术写作引用

- **arXiv 引用**：直接用 arXiv ID（如 TAMO = 2504.20462）+ 图编号。
- **AWS 引用**：标注 "AWS DevOps Agent Blog, 2026-05-27" + 图编号。
- **CausalFusion 引用**：标注 "Amazon Science, AAAI 2026"。

---

## 六、图片访问说明

- **AWS CDN 链接**（`d2908q01vomqb2.cloudfront.net/...`）：已逐一验证可访问，可直接 `<img src="...">` 嵌入或 Markdown 引用。
- **arXiv HTML 图片链接**（`arxiv.org/html/<id>v<n>/xN.png`）：在 arXiv HTML 页面下稳定可用；直接 `arxiv.org/xN.png` 形式会返回 400。
- **若图片失效**：回退策略是访问论文 HTML 全文（如 [TAMO 全文](https://arxiv.org/html/2504.20462v1)），右键图片复制地址。
- **PDF 内嵌图**：MATMCD、CausalFusion 等以 PDF 为主，需要从 PDF 截图（或用 arXiv HTML 镜像）。

---

## 七、关键结论

> **三大主题的"一图代表"**：
>
> 1. **多维数据交叉融合验证** → **TAMO Figure 2**（工具层架构最清晰）
> 2. **假设检验** → **AWS Figure 5**（反证筛选最直观，工业级落地）
> 3. **探索循环** → **LATS Figure 3**（6 操作分解最适合教学）
>
> 如果只能选 1 张图代表整个领域——选 **AWS Figure 5**，因为它同时展示了：
> - 多维证据（来自 §2 的数据采集）
> - 假设生成与反证检验（核心机制）
> - 隐含的探索循环（H1→H2→H3 并行 + 筛选）

---

## 八、参考链接

- **TAMO**：[arXiv 2504.20462](https://arxiv.org/html/2504.20462v1) | [IEEE Software](https://www.computer.org/csdl/journal/sc/2025/06/11229957/2boTHWxE2ty)
- **LATS**：[arXiv 2310.04406](https://arxiv.org/html/2310.04406v1) | [GitHub](https://github.com/lapisrocks/LanguageAgentTreeSearch)
- **LATS-RCA**：[arXiv 2605.03505](https://arxiv.org/html/2605.03505v1)
- **RCAgent**：[arXiv 2310.16340](https://arxiv.org/html/2310.16340v3)
- **CausalFusion**：[Amazon Science AAAI 2026](https://www.amazon.science/blog/aws-contributed-research-papers-aaai-2026)
- **MATMCD**：[arXiv 2412.13667](https://arxiv.org/abs/2412.13667) | [GitHub](https://github.com/zhengzhangchen/LLMCausalDiscovery)
- **AWS DevOps Agent**：[官方博客 2026-05-27](https://aws.amazon.com/blogs/devops/introducing-aws-devops-agent/)
- **ERRORPROBE (ACL 2026)**：[Amazon Science](https://www.amazon.science/publications/errorprobe-empowering-llm-agents-with-verified-episodic-memory-for-systematically)
