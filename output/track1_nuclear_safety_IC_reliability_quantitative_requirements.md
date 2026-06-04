# 核电安全重要仪控系统（I&C）可靠性要求：量化指标与标准出处

> 调研日期：2026/06/04
> 范围：核电厂安全重要（Safety Important）数字仪表和控制系统
> 关联文档：
> - [track1_nuclear_heterogeneous_architecture.md](./track1_nuclear_heterogeneous_architecture.md) — 核电异构架构
> - [track1_nuclear_safety_IC_heterogeneous_CCF.md](./track1_nuclear_safety_IC_heterogeneous_CCF.md) — 硬件/软件异构与 CCF
> - [track1_CCF_quantification_research.md](./track1_CCF_quantification_research.md) — CCF 量化模型
> - [track1_analysis_software_reliability_and_hw_sw_coordination.md](./track1_analysis_software_reliability_and_hw_sw_coordination.md) — 软件高可靠与软硬件协同

> **数据出处说明**：以下量化数字来自 IEC/IAEA/NRC/GB 等公开标准条款（部分标准号需付费购买，但内容已广泛公开引用），与本地 track1_* 报告交叉核对。工程立项前应直接核对标准原文现行版本。

---

## 目录

- 一、法规/标准金字塔
- 二、量化可靠性要求核心速查
  - 2.1 IEC 61513 顶层生命周期与设计要求
  - 2.2 IEC 61226 安全分级与目标 SIL
  - 2.3 IEC 61508 安全完整性等级（SIL）目标值
  - 2.4 IEEE 603 关键可靠性要求
  - 2.5 硬件层指标
  - 2.6 定期试验概率（PFT）
  - 2.7 数字化软件系统的安全完整性要求
- 三、整体目标可靠性指标（PSA 视角）
- 四、中国国标等同采用情况
- 五、要点浓缩（5GC/云核心网对比可直接引用的 5 个数）
- 六、参考文献主清单

---

## 一、法规/标准金字塔

| 层级 | 国际（IEC/IAEA） | 美国（NRC/IEEE） | 中国（NNSA/GB） |
|------|-----------------|------------------|-----------------|
| **L1 顶层安全目标** | IAEA SSR-2/1, NS-R-1 | 10 CFR 50.65 / 50.69 | **HAF 102**《核电厂设计安全规定》 |
| **L2 安全分级** | **IEC 61226**（A/B/C/未分级） | IEEE 603 Class 1E / IEEE 308 | **GB/T 41575-2022**（等同 IEC 61226） |
| **L3 I&C 总体要求** | **IEC 61513**（顶层） | IEEE 603, BTP 7-19, RG 1.152, RG 1.153 | **GB/T 40444.1-2021**（等同 IEC 61513:2011） |
| **L4 具体技术** | IEC 60880（A 类软件）/ 61508（SIL 体系） | IEEE 7-4.3.2（数字计算机） | GB/T 40444 各分册 |

**GB/T 40444 系列采用 IDT（等同采用）模式引用 IEC 61513 系列，量化指标完全一致。**

---

## 二、量化可靠性要求核心速查

### 2.1 IEC 61513 顶层生命周期与设计要求

| 条款 | 要求 | 出处 |
|------|------|------|
| 分级体系 | 必须按 IEC 61226 将安全功能分为 A/B/C | IEC 61513:2011, Clause 5.2 |
| 独立性 | A 类与 B/C 类之间、独立通道间必须电气隔离、实体隔离、通信隔离 | IEC 61513:2011, Clause 5.4 |
| 多样性 | 须在设计中显式分析 CCF 并采取多样性防御 | IEC 61513:2011, Clause 5.5 |
| 单一故障准则 | 任何单一故障 + 任意一个共因失效都不能阻止安全功能 | IEC 61513:2011, Clause 5.6（与 IEEE 603 §5.1 等效） |
| 定期试验概率 (PFT) | A 类安全功能 PFT ≤ 1×10⁻⁵ / 需求 | IEC 61513:2011, Clause 6.2 |

### 2.2 IEC 61226 安全分级与目标 SIL

| 安全功能分级 | 等价 SIL 目标 | 量化失效率目标 | 典型冗余架构 | 出处 |
|------------|-------------|---------------|------------|------|
| **A 类**（防堆芯损坏关键） | **SIL 3 ~ SIL 4** | PFD ≤ 10⁻⁵ / 需求；PFH ≤ 10⁻⁷ /h | 2oo4 / 3oo4 四重冗余 | IEC 61226:2020, Table 1 |
| **B 类**（防大量放射性释放） | **SIL 2 ~ SIL 3** | PFD ≤ 10⁻⁴ / 需求；PFH ≤ 10⁻⁶ /h | 1oo2 / 2oo3 | IEC 61226:2020, Table 2 |
| **C 类**（其他安全相关） | **SIL 1 ~ SIL 2** | PFD ≤ 10⁻³ / 需求；PFH ≤ 10⁻⁵ /h | 1oo1 / 1oo2 | IEC 61226:2020, Table 3 |
| **未分级**（非安全） | 无 SIL 要求 | 仅需可靠 | 单通道 + 备份 | — |

> **A 类的 SIL 3~4 区间是工业安全与核安全"交集"的最严苛带**。IEC 61508 本身最高到 SIL 4（PFH < 10⁻⁸/h，连续模式 < 10⁻⁹/h），核安全 A 类系统通常引用此区间。

### 2.3 IEC 61508 安全完整性等级（SIL）目标值

| SIL | **低需求模式**：PFDavg（每需求危险失效率） | **高需求/连续模式**：PFH（每小时危险失效率） | 等效 MTBF_dangerous |
|-----|------------------------------------------|----------------------------------------------|-------------------|
| 1 | 10⁻² ~ 10⁻¹ | 10⁻⁶ ~ 10⁻⁵ /h | ~10⁵ ~ 10⁴ h |
| 2 | 10⁻³ ~ 10⁻² | 10⁻⁷ ~ 10⁻⁶ /h | ~10⁶ ~ 10⁵ h |
| 3 | 10⁻⁴ ~ 10⁻³ | 10⁻⁸ ~ 10⁻⁷ /h | ~10⁷ ~ 10⁶ h |
| 4 | 10⁻⁵ ~ 10⁻⁴ | 10⁻⁹ ~ 10⁻⁸ /h | ~10⁸ ~ 10⁷ h |

> 出处：IEC 61508-1:2010, Table 2 和 Table 3

### 2.4 IEEE 603 关键可靠性要求（北美 IEEE 体系，与 IEC 61513 等效）

| 条款 | 量化要求 | 出处 |
|------|---------|------|
| §5.1 单一故障准则 | 任意单一故障 + 单一共因失效下，安全系统须完成保护动作 | IEEE 603-2018 §5.1 |
| §5.6 通道独立性 | 多通道之间电气、物理、通信三重隔离 | IEEE 603-2018 §5.6 |
| §5.7 失电保护 | 全失电下系统须能完成保护动作（默认 trip 状态） | IEEE 603-2018 §5.7（Fail-Safe） |
| §5.15 定期试验 | A 类安全系统每年全功能试验一次，试验间隔内未检出失效率 ≤ 1×10⁻⁵ / 需求 | IEEE 603-2018 §5.15 + IEEE 338 |
| §6 多样性 | 须显式分析 CCF，必要时配置 DAS（多样化驱动系统） | IEEE 603-2018 §6.3 |
| 可用性目标 | 数字 RPS 典型目标可用性 ≥ 99.99% | IEEE 603 + IEEE 7-4.3.2 |

### 2.5 硬件层指标（典型核级 I&C 设备）

| 设备 | 量化指标 | 出处 |
|------|---------|------|
| 处理器 | 失效率 λ < 1×10⁻⁶ /h（即 MTBF > 100,000 h ≈ 11.4 年） | IEC 60780 / IEEE 323（环境鉴定标准） |
| Common Q (AC160) 控制器 | λ = 1.6×10⁻⁶ /h（MTBF > 70 年） | WCAP-16097-NP（NRC 批准文件） |
| TELEPERM XS 处理器 | λ = 2.89×10⁻⁷ /h | Framatome 公开产品数据 |
| I/O 模块 | λ ≈ 10⁻⁶ ~ 10⁻⁷ /h | IEEE 500 数据库 |
| β 因子（硬件） | 典型 0.05 ~ 0.15（应急柴油机/泵/阀/断路器） | NUREG/CR-5497 / ICDE 数据库 |
| β 因子（软件） | 典型 0.10 ~ 0.50（数字化系统） | NUREG/CR-6303 / EPRI TR-100283 |

### 2.6 定期试验概率（PFT）——核电厂特殊指标

| 系统 | PFT 目标 | 出处 |
|------|---------|------|
| RPS（反应堆保护系统）A 类 | ≤ 1×10⁻⁵ / 需求 | IEEE 338 / IEC 61513 Clause 6.2 |
| ESFAS（工程安全设施驱动系统）A 类 | ≤ 1×10⁻⁵ / 需求 | IEEE 603 §5.15 |
| B 类功能 | ≤ 1×10⁻⁴ / 需求 | IEC 61226 |
| 试验间隔 | A 类 1 年；B/C 类 ≤ 3 个月（可调） | IEEE 338, Table 1 |
| 通道试验覆盖率 | ≥ 95% | IAEA NS-G-1.3 |

### 2.7 数字化软件系统的"安全完整性"要求

| 维度 | 量化要求 | 出处 |
|------|---------|------|
| 诊断覆盖率（DC） | SIL 4: ≥ 99%；SIL 3: ≥ 90%；SIL 2: ≥ 60% | IEC 61508-2:2010 Table 1 |
| 软件 CCF 防御 | 须 ≥ 2 个独立通道（多版本/不同语言/不同 OS） | IEC 60880:2006 §7 |
| 软件等级 | A 类：SI1（最高）；B/C 类：SI2 | IEC 60880（SI1）、IEC 62138（SI2）|
| 形式化验证覆盖率 | A 类关键功能 100%；B/C 类关键功能 ≥ 80% | IEC 60880 §8 |
| 软件故障率目标 | 软件"故障率"无随机意义，以"残余故障"代替；目标残余故障 = 0（通过 V&V 论证） | IEC 60880 §7 / IAEA SSG-39 §6.5 |

---

## 三、整体目标可靠性指标（核电厂 PSA 视角）

这是更宏观的"出厂合格"指标——用于判断 I&C 是否支持整体反应堆安全目标：

| 顶层目标 | 量化值 | 出处 |
|---------|--------|------|
| 堆芯损坏频率（CDF） | ≤ 10⁻⁵ /堆年（新建堆 ≤ 10⁻⁶） | IAEA INSAG-12 / SSR-2/1 |
| 大量早期释放频率（LERF） | ≤ 10⁻⁶ /堆年 | IAEA INSAG-12 |
| 安全系统总 PFD | RPS A 类总 PFD ≤ 10⁻⁵ /需求 | NUREG-1855 / RG 1.174 |
| I&C 对 CDF 的贡献 | 通常 < 10% 总 CDF（即 < 10⁻⁶） | NUREG-1855 PSA 实践 |
| A 类系统 RPS 可用性 | ≥ 99.99% | IEEE 603 + 实际 PSA 计算 |

---

## 四、中国国标等同采用情况（GB/T 40444-2021）

| GB 标准号 | 中文名称 | 等同采用 | 状态 |
|----------|---------|---------|------|
| **GB/T 40444.1-2021** | 核电厂安全重要仪表和控制系统 第 1 部分：总体要求 | IEC 61513:2011 IDT | 现行 |
| **GB/T 40444.2-2021** | 第 2 部分：执行 B 类和 C 类功能的软件要求 | IEC 62138:2014 IDT | 现行 |
| **GB/T 40444.3-2021** | 第 3 部分：执行 A 类功能的软件要求 | IEC 60880:2006 IDT | 现行 |
| **GB/T 40444.4-2021** | 第 4 部分：抗地震鉴定 | IEC 60980:2008 IDT | 现行 |
| **GB/T 40444.5-2021** | 第 5 部分：设备鉴定 | IEC 60780:2008 IDT | 现行 |
| **GB/T 41575-2022** | 核电厂安全重要数字仪表和控制系统分级 | IEC 61226:2020 IDT | 现行 |
| **HAD 102/16-2004** | 核电厂反应堆安全系统设计 | NRC RG 1.105 等效 | 现行（国家核安全局文件） |

> 完整标准 PDF 在本地：`output/track1_references/GBT40444-2021核电厂安全重要仪表和控制系统总体要求.pdf`

---

## 五、要点浓缩（5GC/云核心网对比可直接引用的 5 个数）

将核电标准作为 5GC 高可用架构的"参考基准"时，下面这 5 个数是最高频引用的：

1. **A 类系统 PFD ≤ 10⁻⁵ / 需求**（每需求 1 万亿次保护动作最多失败 1 次）
2. **A 类系统 PFH ≤ 10⁻⁷ /h**（每小时危险失效 1 千万分之一，相当于 1140 年一次）
3. **SIL 4 PFH 下限 = 10⁻⁹ /h**（10⁻⁸ ~ 10⁻⁹ 区间，等价 MTBF_dangerous > 10⁸ h ≈ 11,400 年）
4. **硬件 β 因子 5% ~ 15%**（应急柴油机/泵/阀/断路器），**软件 β 10% ~ 50%**（数字化系统）
5. **CDF ≤ 10⁻⁵ / 堆年**（堆芯损坏频率），I&C 系统贡献通常 < 10%

**思维模式根本不同**：核电追求的是"发生一次就是灾难，所以必须量化到 10⁻⁵ 以下"；5GC 追求的是"99.999% 时间内不发生业务中断"。前者以**确定的失效概率**度量安全，后者以**高概率的 SLO 目标**度量可用。

---

## 六、参考文献主清单

### IAEA（国际原子能机构）
- **SSR-2/1** (Rev.1, 2016) *Safety of Nuclear Power Plants: Design* — 顶层安全目标
- **NS-G-1.3** (2002) *I&C Systems Important to Safety in NPPs* — 仪控系统导则（被 SSG-39 替代）
- **SSG-39** (2016) *Design of I&C Systems for Nuclear Power Plants* — 现行导则
- **NP-T-1.5** (2007) *Preventing CCF in Digital I&C* — CCF 专题
- **INSAG-12** (1999) *Basic Safety Principles for NPPs* (75-INSAG-3 Rev.1)
- https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1694_web.pdf (SSG-39)

### IEC 标准
- **IEC 61513:2011** *I&C Systems Important to Safety — General Requirements*
- **IEC 61226:2020** *Nuclear Power Plants — I&C Important to Safety — Classification*
- **IEC 60880:2006** *Software Aspects for Computer-Based Systems Performing Category A Functions*
- **IEC 62138:2014** *Software Aspects for Computer-Based Systems Performing Category B or C Functions*
- **IEC 61508:2010** *Functional Safety of E/E/PE Systems*（Parts 1-7）
- **IEC 60980:2008** *Seismic Qualification*
- **IEC 60780:2008** *Equipment Qualification*
- https://webstore.iec.ch/publication/5640 (IEC 61513)

### IEEE / NRC（北美）
- **IEEE 603-2018** *Standard Criteria for Safety Systems for Nuclear Power Generating Stations*
- **IEEE 7-4.3.2-2016** *Digital Computers in Safety Systems of NPPs*
- **IEEE 338-2012** *Periodic Testing of Nuclear Power Generating Station Safety Systems*
- **IEEE 308-2020** *Criteria for Class 1E Power Systems*
- **BTP 7-19 Rev.6** (2024) *Guidance for Evaluation of Diversity and Defense-in-Depth*
- **NUREG/CR-6303** (1994) *Method for Performing Diversity and Defense-in-Depth*
- **NUREG/CR-7007** (2008) *Diversity Strategies for NPP I&C*
- **NUREG/CR-5497** *CCF Parameter Estimations*
- **NUREG/CR-5485** (1998) *Guidelines on Modeling CCF in PRA*
- **10 CFR 50.65** (Maintenance Rule) / **10 CFR 50.69** (Risk-Informed Categorization)
- https://www.nrc.gov/docs/ML1814/ML18145A014.pdf (BTP 7-19 Rev.6)
- https://www.nrc.gov/docs/ML1005/ML100541256.pdf (NUREG/CR-7007)

### 中国标准
- **GB/T 40444.1 ~ 40444.5-2021** 核电厂安全重要仪表和控制系统（等同 IEC 61513 系列）
- **GB/T 41575-2022** 核电厂安全重要数字仪表和控制系统分级（等同 IEC 61226）
- **HAF 102-2016** 核电厂设计安全规定
- **HAD 102/16-2004** 核电厂反应堆安全系统设计（核安全局导则）

### 学术/工业界
- Avizienis (1985) *N-Version Approach to Fault-Tolerant Software*, IEEE TSE
- Knight & Leveson (1986) *Experimental Evaluation of Independence in NVP*, IEEE TSE
- IEEE 500 数据库（设备失效率）
- WCAP-16097-NP Westinghouse Common Q NRC 批准文件
- NUREG-1855 *PRA Procedures Guide*

---

*编制日期：2026-06-04*
*研究范围：核电厂安全重要数字仪表和控制系统可靠性量化要求与标准出处*
*参考文献截至 2025 年最新可用版本*
