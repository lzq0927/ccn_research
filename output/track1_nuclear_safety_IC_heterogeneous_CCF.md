# 核电安全级仪控系统：硬件异构、软件异构与共因失效量化防御深度研究报告

---

## 目录

- 第一部分：硬件异构设计
- 第二部分：软件异构设计
- 第三部分：共因失效量化与防御

---

# 第一部分：硬件异构设计

## 1. 硬件异构设计的必要性与标准框架

### 1.1 共因失效对冗余系统的威胁

核安全级仪控（I&C）系统传统上通过冗余（redundancy）来提高可靠性。然而，当冗余通道共享相同的硬件设计、制造工艺和运行环境时，单一缺陷可能同时影响所有通道——即共因失效（CCF）。硬件异构设计通过在冗余通道中引入技术差异，从根本上消除或削弱CCF的耦合机制。

NRC BTP 7-19（Rev.6, 2024）明确要求：对所有安全级数字化I&C系统，必须假设全系统范围的CCF可能发生，并确认存在足够多样化的后备手段 [R1]。这构成了硬件异构设计的法规基础。

### 1.2 NUREG/CR-6303 六大多样性属性

NUREG/CR-6303建立的六大多样性属性中，硬件异构直接对应**设备多样性（Equipment Diversity）**和**设计多样性（Design Diversity）**两个核心属性 [R2]：

| 多样性属性 | 硬件异构对应的准则 | 有效性等级 |
|-----------|-------------------|-----------|
| 设备多样性 | 不同制造商、不同CPU架构、不同I/O模块、不同通信机制 | 最高 |
| 设计多样性 | 不同设计方法、不同算法、不同逻辑结构 | 高 |
| 信号多样性 | 不同传感器类型、不同测量原理 | 中-高 |
| 功能多样性 | 不同功能响应同一安全需求 | 中-高 |
| 软件多样性 | 不同编程语言、不同操作系统 | 高（软件层面） |
| 生命周期多样性 | 不同开发团队、不同工具链 | 中 |

NUREG/CR-7007（ORNL, 2008）进一步将多样性策略按技术类型分为三层 [R3]：
- **策略A**：不同技术类型（如数字化 vs. 模拟/硬接线、CPU vs. FPGA）——多样性最强
- **策略B**：同一技术类型内不同方法（如不同制造商的CPU平台）——多样性次之
- **策略C**：同一技术类型内的变体（如同一平台不同软件版本）——多样性最弱

### 1.3 IEC标准中的硬件多样性要求

**IEC 61513**（核安全级I&C系统总体要求）在Clause 5（系统架构要求）中规定 [R4]：
- I&C系统架构必须划分为**足够数量的独立系统和设备**
- 系统间必须通过实体隔离、电气隔离和通信隔离实现**独立性**
- 明确要求在设计中考虑**多样性**以应对CCF
- 对硬件设备进行多样性分析（Clause 7）

**IEC 60880**（核安全Category A系统软件方面）要求 [R5]：
- 当采用数字化系统执行安全功能时，必须分析软件CCF风险
- 建议通过功能多样性和设备多样性来缓解软件CCF
- 在不同安全列（division）之间实现充分的独立性

IEC标准体系关系：
```
IEC 61513 (顶层框架)
    ├── IEC 61226 (安全分级: Category A/B/C)
    ├── IEC 60880 (软件, Category A)
    ├── IEC 62138 (软件, Category B/C)
    ├── IEC 60980 (抗地震鉴定)
    └── IEC 60780 (设备鉴定)
```

---

## 2. 全球主要核安全级I&C硬件平台对比

现代核安全级I&C系统形成了多平台并存的格局，各平台在CPU架构、I/O设计和通信总线方面存在显著差异，这为硬件异构设计提供了技术基础。

### 2.1 平台技术规格对比

| 技术参数 | Common Q | TELEPERM XS | Triconex | FirmSys | NASPIC |
|---------|----------|-------------|----------|---------|--------|
| **厂商** | Westinghouse | Framatome | Schneider/SEL | CGN广利核 | CNNP核动力院 |
| **CPU架构** | Motorola MC68360 (32-bit) → 多核PM646C | SVE2/SVE3 (32-bit) | TMR三处理器并行 | 国产CPU芯片 | 自主CPU |
| **技术路线** | 微处理器 | 微处理器 | TMR微处理器 | 微处理器 | 微处理器 |
| **冗余架构** | 1oo2 / 2oo3 | 四重冗余(4 trains) | 2oo3 TMR | 多重冗余 | 多重冗余 |
| **通信总线** | AF100 + HSL(RS422) | Profibus L2(1.5Mbps) + Ethernet H1(100Mbps) | 专用高速总线 | 安全级通信网络 | 模块化通信 |
| **I/O体系** | S600系列(8-32通道/模块) | 模块化I/O | 三重化I/O | — | 模块化I/O |
| **处理器失效率** | MTBF > 70年 | 2.89×10⁻⁷/h | — | — | — |
| **安全等级** | Class 1E (IEEE 603) | Category A (IEC 61226) | SIL认证(IEC 61508) | IAEA审查通过 | 国内最高SIL认证 |
| **NRC批准** | WCAP-16097-NP | ANP-10272 | Topical Report | — | — |
| **全球装机** | 50+核电站, 1300+机柜 | EPR系列 | 全球工业安全 | 阳江/UK HPR1000 | 国内商用核电厂 |

### 2.2 关键平台详述

**Common Q（Westinghouse/AECL）**：
- 控制器核心为Advant Controller 160 (AC160)，处理器模块PM646A采用32-bit Motorola MC68360
- 升级方案Common Q+采用PM646C多核处理器，向后兼容
- Component Interface Module (CIM)实现安全/非安全系统优先级控制——非软件化设计
- 全球装机1300+机柜、4000+ AC160处理器 [R6]

**TELEPERM XS（Framatome）**：
- 采用周期性循环执行（Cyclic Processing），非事件驱动，确保确定性
- 处理器失效率2.89×10⁻⁷/h，PS系统PFD约10⁻⁵（ONR评估）
- 衍生平台TXS Compact采用**FPGA技术**，与CPU版本TXS形成平台内技术多样性 [R7]

**FirmSys（CGN中广核）**：
- FirmSys-6000基于**国产核心芯片和国产操作系统**
- 首次应用于阳江核电站，后通过UK HPR1000的GDA审查
- 全生命周期可靠性设计与安全分析 [R8]

**NASPIC / 龙鳞系统（CNNP中核）**：
- 100%自主编写软件（C语言），未使用外国Linux类开源内核
- 中核集团还开发了**NuPAC / 龙核**平台（FPGA技术路线），与NASPIC形成平台内技术多样性 [R9]

| 特性 | NASPIC（龙鳞） | NuPAC（龙核） |
|------|---------------|---------------|
| 技术路线 | 基于CPU | 基于FPGA |
| 操作系统 | 自主安全OS | 无需传统OS（硬件化逻辑） |
| 通信方式 | 网络通信 | 分散式、点对点 |
| 开发单位 | 中国核动力研究设计院 | 中核控制 |

---

## 3. 典型三代核电机组硬件异构工程实践

### 3.1 AP1000：数字化+模拟异构（策略A范例）

AP1000是策略A（不同技术类型）的典型范例，其核心是**Protection and Monitoring System (PMS) + Diverse Actuation System (DAS)**双系统架构 [R10]：

```
┌──────────────────────────────────────────────────────────────┐
│                  AP1000 I&C 硬件多样性架构                      │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────┐                          │
│  │  PMS (主保护系统)                │  Common Q / AC160        │
│  │  处理技术: Motorola MC68360     │  数字化平台               │
│  │  安全等级: Class 1E             │  AF100 数字总线           │
│  │  冗余: 4重(A/B/C/D)            │  有软件                    │
│  │  功能: 反应堆停堆、ESF驱动      │                           │
│  └─────────────────────────────────┘                          │
│                    ↕  硬件多样性（策略A）                        │
│  ┌─────────────────────────────────┐                          │
│  │  DAS (多样化驱动系统)            │  Westinghouse 7300系列   │
│  │  处理技术: 硬接线/模拟逻辑      │  模拟/常规电子设备         │
│  │  安全等级: Non-safety related   │  无/极少软件               │
│  │  传感器: 独立于PMS              │  硬接线通信               │
│  │  功能: 备用停堆、部分ESF驱动    │                           │
│  └─────────────────────────────────┘                          │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

**AP1000硬件多样性关键特征**：

| 特征 | PMS | DAS |
|------|-----|-----|
| 平台类型 | 数字化（Common Q） | 模拟/常规电子（7300系列） |
| 处理技术 | 微处理器(MC68360) | 硬接线/模拟逻辑 |
| 软件依赖 | 有（数字逻辑） | **无/极少（非软件化设计）** |
| 传感器 | 独立传感器组 | **独立于PMS的传感器组** |
| 通信方式 | AF100数字总线 | 硬接线 |
| 设计目标 | 主安全功能 | **缓解PMS中假定的CCF** |

AP1000的设计哲学是：当主数字化保护系统PMS因软件CCF完全失效时，DAS作为**非软件化的模拟后备**，能够独立完成反应堆停堆和关键安全功能驱动。这是策略A的最高级别多样性实现。

### 3.2 EPR：双平台异构（策略B范例）

EPR的I&C架构采用**TELEPERM XS + 多样化后备**的双平台方案 [R11]：

```
┌──────────────────────────────────────────────────────────────┐
│                    EPR I&C 硬件多样性架构                       │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────┐                          │
│  │  Protection System (PS)         │  TELEPERM XS (TXS)      │
│  │  处理器: SVE2/SVE3 (32-bit)    │  Profibus L2 通信        │
│  │  冗余: 4重冗余(4 trains)       │  PFD: ~10⁻⁵             │
│  │  功能: 反应堆停堆、ESF驱动      │                           │
│  └─────────────────────────────────┘                          │
│                    ↕  平台多样性                                │
│  ┌─────────────────────────────────┐                          │
│  │  Safety Automation System (SAS) │  不同Siemens平台         │
│  │  功能: 事故后管理I&C(手动+自动) │  PFD: ~10⁻⁴             │
│  │  跳闸器件: Trip contactors      │  (多样化执行器)           │
│  └─────────────────────────────────┘                          │
│                                                                │
│  ┌─────────────────────────────────┐                          │
│  │  RCSL (控制监督限制)             │  TELEPERM XS             │
│  │  (与PS同平台但独立)              │                           │
│  └─────────────────────────────────┘                          │
│                                                                │
│  注: EPR还配备硬接线优先级模块和多样化跳闸断路器/接触器        │
└──────────────────────────────────────────────────────────────┘
```

**EPR多样性特征**：
- PS采用TXS平台（CPU-based），SAS采用**不同的Siemens平台**
- 跳闸执行层采用**多样化的断路器（breakers）和接触器（contactors）**
- 配备**硬接线优先级模块**作为底层保护
- EPR设计还包含Diverse Actuation System用于缓解数字化CCF

### 3.3 ABWR：多供应商+FPGA后备

ABWR的安全系统逻辑与控制（SSLC）采用4重冗余数字化架构，其多样化后备采用两种策略 [R12]：

| 策略 | 实现方式 |
|------|---------|
| 设备多样性 | 不同I&C子系统由不同供应商提供（Toshiba、Hitachi等） |
| FPGA后备 | 基于FPGA的RPS作为数字化I&C的多样化后备 |
| 功能多样性 | 不同功能响应同一安全需求 |
| 信号多样性 | 独立的传感器和信号路径 |

ABWR的RPS由4重冗余传感器通道、4重冗余跳闸逻辑、跳闸执行器和2重手动停堆分部组成。关键创新在于将**FPGA技术**引入作为CPU-based系统的多样化后备。

### 3.4 华龙一号（HPR1000）：三重技术路线异构

华龙一号的I&C设计体现了中国核电的独特思路，形成了**三重技术路线**的异构体系 [R13]：

```
┌──────────────────────────────────────────────────────────────┐
│            华龙一号 HPR1000 三重技术路线异构                     │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  方案A: FirmSys（和睦系统）—— 中广核                           │
│    国产CPU + 国产OS（CPU技术路线）                              │
│                    ↕  硬件多样性                                │
│  方案B: NASPIC（龙鳞系统）—— 中核                              │
│    自主CPU + 自主安全OS（CPU技术路线，不同平台）                │
│                    ↕  技术路线多样性                            │
│  方案C: NuPAC（龙核）—— 中核控制                               │
│    FPGA硬件化逻辑（FPGA技术路线，无操作系统）                   │
│                                                                │
│  非安全级: SH-N 分布式控制系统                                  │
│                                                                │
│  特色: 能动+非能动安全系统设计                                  │
│       FirmSys(能动) + 非能动安全系统(重力/自然循环)             │
└──────────────────────────────────────────────────────────────┘
```

华龙一号的独特之处在于：
1. **FirmSys与NASPIC**为两个完全独立开发的安全级DCS平台，基于不同的硬件架构和软件体系
2. 中核集团内部**NASPIC（CPU）与NuPAC（FPGA）**进一步形成平台内技术多样性
3. "能动+非能动"安全系统设计——能动系统依赖电力驱动，非能动系统利用重力、自然循环等自然力，两种机制完全异构
4. 安全级DCS网络采用**光电隔离**设计

### 3.5 Sizewell B：西方首个数字保护系统先驱

英国Sizewell B（1995年投运）是西方首个采用软件化反应堆保护系统的核电站 [R14]：

| 方面 | 主保护系统(PPS) | 次保护系统(SPS) |
|------|----------------|----------------|
| 通道数 | 4个guardlines（2oo4表决） | 2个trains |
| 处理器 | 微处理器类型A | **不同微处理器类型B** |
| 软件 | ~100,000行源代码 | **多样化软件实现** |
| 电源 | 主电源系统 | 次级(多样化)电源系统 |
| 安全等级 | 等效SIL 4 | 等效SIL 4 |

Sizewell B的经验证明：即使在同一时期的技术条件下，通过选择不同类型的微处理器和独立开发软件，也能在硬件和软件层面实现有效的多样性。

---

## 4. 硬件多样性策略综合比较

| 策略 | 实现方式 | 典型案例 | 多样性强度 | β因子降低效果 |
|------|---------|---------|-----------|-------------|
| 不同技术路线 | 数字化 vs. 模拟/硬接线 | AP1000 (PMS+DAS) | 极高 | 降低80%-90% |
| 不同处理器架构 | CPU vs. FPGA | NASPIC vs. NuPAC; TXS vs. TXS Compact | 高 | 降低50%-70% |
| 不同制造商平台 | Common Q vs. TXS vs. Triconex | 龙门ABWR(多供应商) | 高 | 降低30%-50% |
| 同一平台不同配置 | 不同I/O、不同通信 | EPR (PS四列独立) | 中 | 降低10%-30% |
| 功能+信号多样性 | 不同测量原理 | EPR/AP1000(多样化传感器) | 中-高 | 降低20%-40% |

**选择策略的考量因素**：
1. **安全分级要求**：Class 1E / Category A系统要求最高多样性等级
2. **CCF分析结果**：根据具体系统CCF脆弱性分析选择针对性策略
3. **经济可行性**：维护两个完全不同的硬件平台成本较高（2-3倍运维成本）
4. **许可证经验**：已被监管机构接受的方案更容易通过审查
5. **长期运维**：需考虑备件供应（40-60年）、人员培训、备品备件管理

---

# 第二部分：软件异构设计

## 5. 软件异构设计的基本策略

### 5.1 三大软件容错技术

核安全级I&C系统中的软件异构主要通过以下三种技术实现：

**N版本编程（N-Version Programming, NVP）**：
- 由Avizienis（1985）提出，是软件容错的经典技术 [R15]
- 多个独立开发团队根据同一规格说明独立开发N个版本
- 所有版本并行执行，通过表决机制（通常多数表决）确定正确输出
- 在核电I&C中通常采用2或3个多样化版本，配合2oo3或2oo4表决逻辑

**恢复块（Recovery Blocks）**：
- 由Randell（1975）提出 [R16]
- 主模块执行关键功能，验收测试检查输出的合理性
- 若测试失败，按序执行一个或多个多样化替代模块
- 在核安全中作为多样化后备策略使用

**多样化后备系统（Diverse Backup Systems）**：
- 核电I&C中最主要的实际应用方式
- 主保护系统（PPS）+ 多样化驱动系统（DAS）/ 次保护系统（SPS）
- 后备系统使用不同的软件、硬件，通常还有不同的技术路线
- 设计目标是缓解主数字化系统中的CCF

### 5.2 NUREG/CR-6303软件多样性准则

NUREG/CR-6303在"软件多样性（Software Diversity）"属性下定义了以下准则 [R2]：

| 准则 | 说明 | 有效性 |
|------|------|--------|
| 不同算法/逻辑 | 使用不同的数学算法或逻辑实现相同功能 | 高 |
| 不同编程语言 | 使用不同的编程语言（如C vs. Ada vs. Lua） | 高 |
| 不同程序架构 | 不同的软件模块化、分层和调用结构 | 中-高 |
| 不同操作系统 | 运行在不同的操作系统上 | 高 |
| 不同执行时序 | 不同的任务调度和执行时序 | 中 |

NUREG/CR-7007（2008）将"软件多样性"扩展为"**逻辑多样性（Logic Diversity）**"以覆盖所有可编程设备（包括FPGA），同时将"人员多样性"扩展为"**生命周期多样性（Life-cycle Diversity）**" [R3]。

**CORDEL多样性属性对照（NUREG/CR-6303 vs NUREG/CR-7007）**：

| NUREG/CR-6303 | NUREG/CR-7007 | 变化 |
|---------------|---------------|------|
| Human Diversity | Life-cycle Diversity | 扩展至覆盖整个生命周期 |
| Software Diversity | Logic Diversity | 扩展至覆盖所有可编程设备 |
| Equipment Diversity | Equipment Manufacturer + Logic Processing Equipment | 拆分为两个子属性 |
| Design/Functional/Signal | 不变 | — |

---

## 6. 软件多样性有效性的实证研究

### 6.1 Knight & Leveson（1986）实验——对NVP独立性的质疑

这是软件工程领域最有影响力的实证研究之一 [R17]：

**实验设计**：
- 27个独立开发的程序，来自同一规格说明
- 由Virginia大学不同程序员/团队独立开发
- 所有版本实现同一功能（反导弹选择算法）

**关键发现**：
- NVP的核心假设——独立开发的版本**独立地失败**——**不被支持**
- 在独立开发的版本中发现了**相关性故障**
- 程序员在面对相同的"困难"问题区域时倾向于犯**相似的错误**
- 某些输入本质上是"困难的"，会导致多个版本同时失败
- 最大故障跨度为4/27个程序，不相似/无故障的概率约85%

**意义**：证明了软件多样性**不能保证统计独立性**，但85%的不相似概率仍然显著降低了CCF风险。

### 6.2 Eckhardt & Lee（1985）理论分析——EL模型

**论文**：A Theoretical Basis for the Analysis of Multiversion Software Subject to Coincident Errors [R18]

**核心贡献——EL模型**：
- 引入概率模型解释为什么独立开发的软件版本会出现**相关性故障**
- 核心洞察：某些输入本质上是"困难的"，不同版本在面对这些"困难"输入时都会失败
- 失效概率在输入空间上按照"**难度函数（Difficulty Function）**"分布
- 不同团队开发的版本倾向于在相同的"困难"输入上失败
- 这创造了不同版本失效之间的**正相关**——即CCF的理论根源

**影响**：EL模型为理解软件多样性的局限性提供了理论框架，被核电安全多样性评估广泛引用。

### 6.3 Hatton（1997）——N版本 vs. 一个好版本

**论文**：N-Version Design Versus One Good Version [R19]

**关键结论**：
- 研究了是开发**一个高可靠版本**还是**N个独立开发的平均质量版本**更优
- Hatton的结论：证据表明**N版本开发技术更可靠且更具成本效益**
- 组件质量的改善对整体N版本系统质量具有**非线性效应**
- 该分析支持在安全关键系统中使用设计多样性

### 6.4 Littlewood & Strigini（2000）——多样性的 nuanced 分析

**关键发现** [R20]：
- 多样性可以提供**显著的可靠性改善**，但**不能消除**CCF风险
- 多样性的有效性在很大程度上取决于所达到的**独立性程度**
- 其收益是微妙的——多样性有帮助但不是保证
- 其工作建立了理解软件设计多样性如何（以及如何不能）提高安全关键系统可靠性的关键框架

### 6.5 软件多样性有效性综合评估

| 研究 | 年份 | 核心结论 | 对核电的启示 |
|------|------|---------|-------------|
| Knight & Leveson | 1986 | NVP不能保证独立性，但85%无相似故障 | 多样性有效但非万能 |
| Eckhardt & Lee | 1985 | "困难"输入导致相关故障（EL模型） | 理论上解释了软件CCF机理 |
| Hatton | 1997 | N版本比一个好版本更可靠 | 支持使用多样性策略 |
| Littlewood & Strigini | 2000 | 多样性有帮助但不能消除CCF | 需结合其他防御手段 |

**综合结论**：软件多样性是应对软件CCF的有效手段，但必须认识到其局限性。多样性应与其他防御措施（形式化方法、充分V&V、功能多样性等）结合使用。

---

## 7. 软件异构工程实践案例

### 7.1 Sizewell B（英国）——先驱实践

Sizewell B是西方首个采用软件化反应堆保护系统的核电站 [R14]：

| 方面 | PPS（主保护系统） | SPS（次保护系统） |
|------|------------------|------------------|
| 通道 | 4个guardlines（2oo4） | 2个trains |
| 处理器 | 微处理器类型A | **不同微处理器类型** |
| 软件 | ~100,000行源代码 | **多样化软件实现** |
| V&V | 独立V&V + 回溯性静态分析 | 独立V&V |
| 安全评估 | UK Nuclear Installations Inspectorate | 同等严格标准 |

Sizewell B的关键经验：
- PPS和SPS使用**不同处理器和不同软件实现**
- 软件按最高完整性标准（等效SIL 4）生产
- 对PPS软件进行了**严格的回溯性静态分析**（Rigorous Retrospective Static Analysis）
- 软件安全性由UK核设施监察局（NII）评估

### 7.2 AP1000——多样化驱动系统（DAS）

AP1000的软件异构体现在PMS（数字化）与DAS（非软件化）之间的根本差异 [R10]：

| 方面 | PMS | DAS |
|------|-----|-----|
| 软件依赖 | 数字化软件逻辑 | **非软件化/极少软件** |
| 编程语言 | C等高级语言 | 硬接线逻辑 |
| 操作系统 | 实时操作系统 | 无（模拟电路） |
| 可编程性 | 可编程 | 固定逻辑 |

AP1000的DAS策略：通过**消除软件**来实现软件多样性——这是最极端也是最有效的软件CCF防御。

### 7.3 韩国APR-1400 / KNICS计划

韩国通过KNICS（Korea Nuclear Instrumentation & Control System）R&D计划开发了自主平台 [R21]：

- **POSIAQ/POSIVA-Q**：安全级（Class 1E）数字化I&C平台
- **POSIVA-S**：非安全级平台
- APR-1400的Diverse Protection System（DPS）作为主RPS的后备
- 采用**功能多样性**和**软件多样性**策略
- D3分析满足韩国监管要求（KINS）

### 7.4 中国核电DCS软件异构

中国核电DCS的软件异构体现在多个层面 [R8][R9]：

**FirmSys（和睦系统）**：
- 自主开发的安全级操作系统
- 应用于阳江核电站、UK HPR1000

**NASPIC（龙鳞系统）**：
- 100%自主编写软件（C语言）
- 未使用外国Linux类开源内核
- 自主安全操作系统

**NuPAC（龙核）**：
- 基于FPGA，**无传统操作系统**——从根本上消除了软件CCF风险
- 软件硬件化设计，点对点通信

**三者构成的软件异构层次**：
1. FirmSys的自主OS vs. NASPIC的自主OS → **软件层多样性**
2. NASPIC（有OS）vs. NuPAC（无OS）→ **架构层多样性**
3. C语言（CPU编程）vs. HDL（FPGA编程）→ **语言层多样性**

---

## 8. 软件异构的实践挑战

### 8.1 成本与V&V负担

- 开发多个多样化软件版本可以**翻倍或三倍**开发成本
- 每个多样化版本需要**独立V&V（IV&V）**
- V&V工作量随多样化版本数量线性增长
- IEC 60880、IEC 61513要求对每个版本进行**广泛V&V**

### 8.2 维护负担

- 多个多样化软件版本必须在电站全寿命期（40-60+年）内独立维护
- 修改/更新必须对每个版本分别应用和验证
- 配置管理复杂度显著增加
- CORDEL DICTF报告指出："缺乏定义充分多样性的明确标准导致了更复杂的I&C架构" [R22]

### 8.3 监管不一致性

- 不同国家对允许基于软件的多样化后备系统的规则不同
- 缺乏"充分多样性"的**统一国际标准**
- 主观评估标准导致不一致的监管结果
- CORDEL报告确认："趋势是对数字化CCF脆弱性处理进行冗长且更困难的审查" [R22]

---

## 9. 现代替代/补充方法：形式化方法

### 9.1 形式化方法概述

随着软件多样性局限性的认识深入，形式化方法作为**替代或补充**手段日益受到重视：

| 方法 | 描述 | 核电应用 |
|------|------|---------|
| B方法 | 基于逐步精化的形式化规格说明 | SACEM列车信号系统；影响核电验证 |
| 静态分析 | 代码属性的自动化数学分析 | 应用于Sizewell B PPS软件 |
| SPARK Ada | 具有形式化证明能力的Ada子集 | 来自UK形式化方法社区（Praxis） |
| 模型检验 | 穷尽状态空间探索 | 越来越多地用于核电安全验证 |
| 定理证明 | 机器辅助数学证明 | 应用于安全关键属性 |

### 9.2 形式化方法与多样性的关系

IEC 60880通过规定软件开发目标而非指定特定技术来间接支持形式化方法。形式化方法被认可为实现这些目标的强大方法 [R5]。

**关键洞察**：与其（或额外于）开发多样化软件，形式化方法可以提供软件正确性的**数学证明**，可能减少对多样性的依赖。静态分析工具（如QA-MISRA、Cantata、Trust-in-Soft）可帮助实现IEC 60880合规 [R23]。

---

## 10. D3分析框架

### 10.1 法规基础

D3（Diversity and Defense-in-Depth）概念源自 [R24]：
- **NRC SRM-SECY-93-087**：关于数字化I&C纵深防御与多样性的政策声明
- **BTP 7-19**（Branch Technical Position）：评估D3以解决数字化安全系统中潜在设计缺陷导致的CCF

### 10.2 D3分析流程

```
1. 识别安全功能
   └── 确定数字化I&C系统执行的安全功能
2. 识别CCF脆弱性
   └── 潜在软件缺陷可能击败冗余的点
3. 评估现有多样性
   └── 使用NUREG/CR-6303属性评估
4. 确定是否需要多样化后备
   └── 每个安全功能逐一评估
5. 验证多样化后备能力
   └── 主系统失效时能否执行安全功能？
6. 文档化分析
   └── 获得监管批准
```

### 10.3 MDEP共同立场

**MDEP DICWG-01**（2013年6月）建立了处理数字化安全系统中软件CCF的多国共识 [R25]：
- 确认软件CCF是数字化I&C系统的合理关注点
- 建议通过多样化后备来缓解
- 被CORDEL多样性属性报告引用

---

# 第三部分：共因失效量化与防御

## 11. CCF量化模型体系

### 11.1 Beta因子模型

**基本定义**：Beta因子模型是最简单、使用最广泛的CCF参数模型，由Fleming于1975年提出 [R26]。

设一个CCCG（Common Cause Component Group）包含m个相同组件：

**总失效概率**：$Q_T = Q_I + Q_C$

其中$Q_I$为独立失效概率，$Q_C$为共因失效概率。

**Beta因子定义**：$\beta = Q_C / Q_T$

**各阶CCF概率**：
- 单个组件独立失效概率：$Q_I = (1 - \beta) \cdot Q_T$
- 所有m个组件同时失效的CCF概率：$Q_m = \beta \cdot Q_T$

**保守假设**：标准Beta因子模型将所有共因失效部分都分配给最高阶（m重），即 $Q_k = 0$（对于 $1 < k < m$）。

**Beta参数估计方法**：

| 方法 | 说明 | 数据需求 |
|------|------|---------|
| MLE（最大似然估计） | $\beta_{MLE} = n_{ccf} / (n_{ccf} + n_{ind})$ | 运行经验数据 |
| IEC 61508-6 Annex D | 37个诊断问题评分 | 定性评估 |
| UPM检查表法 | Humphreys（1987）提出，IEC 61508-6的前身 | 定性评估 |

**核工业典型Beta值**：

| 组件类型 | β典型值 |
|----------|--------|
| 离心泵 | 0.05 - 0.15 |
| 应急柴油发电机 | 0.05 - 0.10 |
| 电动阀 | 0.05 - 0.10 |
| 止回阀 | 0.05 - 0.10 |
| 断路器 | 0.05 - 0.10 |
| 软件/数字系统 | 0.10 - 0.50 |

### 11.2 多重希腊字母模型（MGL）

MGL模型由Fleming等人于1986年提出，是Beta因子模型的推广，通过引入额外的条件概率参数来区分不同阶数的CCF [R27]。

**参数定义（以4组件组为例，m=4）**：
- $\beta$：发生CCF（而非独立失效）的条件概率
- $\gamma$：给定CCF已发生，涉及3个或4个组件的条件概率
- $\delta$：给定CCF涉及3个或4个组件，涉及4个组件的条件概率

**各阶CCF概率**：
- $Q_1 = (1 - \beta) \cdot Q_T$ （独立失效）
- $Q_2 = \beta \cdot (1 - \gamma) \cdot Q_T$ （二重CCF）
- $Q_3 = \beta \cdot \gamma \cdot (1 - \delta) \cdot Q_T$ （三重CCF）
- $Q_4 = \beta \cdot \gamma \cdot \delta \cdot Q_T$ （四重CCF）

**验证条件**：$Q_1 + Q_2 + Q_3 + Q_4 = Q_T$

**与Beta因子模型的关系**：当 $\gamma = \delta = 1$ 时，MGL退化为标准Beta因子模型。

MGL参数通常通过ICDE数据库中的失效事件数据，采用MLE方法估计。NUREG/CR-5497提供了详细的MGL参数估计值 [R28]。

### 11.3 Alpha因子模型

Alpha因子模型由Mosleh和Siu于1987年提出，被IAEA TECDOC 648推荐为首选CCF模型 [R29]。

**Alpha因子定义**：
$$\alpha_k = n_k / N_{total}, \quad k = 1, 2, ..., m$$

其中$n_k$为涉及恰好k个组件的失效事件数，$N_{total} = \sum_{k=1}^{m} n_k$。

**各阶CCF基本事件概率**：
$$Q_k = \frac{k}{\binom{m}{k}} \cdot \alpha_k \cdot Q_T$$

**约束条件**：$\sum_{k=1}^{m} \alpha_k = 1$

**数值示例**（4组件应急柴油发电机）：
假设从ICDE数据库收集到：
- $n_1 = 200$（独立失效事件）
- $n_2 = 15$（二重CCF事件）
- $n_3 = 3$（三重CCF事件）
- $n_4 = 2$（四重CCF事件）

计算结果：
- $\alpha_1 = 200/220 = 0.909$
- $\alpha_2 = 15/220 = 0.068$
- $\alpha_3 = 3/220 = 0.014$
- $\alpha_4 = 2/220 = 0.009$

### 11.4 二项失效速率模型（BFR）

BFR模型由Vesely（1977）提出原始概念，Atwood（1980，1986）发展了形式化的估计方法 [R30]。

**基本假设**：CCF由"冲击"事件引起，系统受到两类冲击：

1. **致命冲击（Lethal Shock）**：以速率$\omega$发生，导致所有m个组件同时失效
2. **非致命冲击（Non-lethal Shock）**：以速率$\mu$发生，每个组件独立地以概率p失效

**k个组件因非致命冲击同时失效的概率**：
$$P(k | \text{non-lethal shock}) = \binom{m}{k} \cdot p^k \cdot (1-p)^{m-k}$$

**总k阶失效速率**：
$$\text{rate}_k = \binom{m}{k} \cdot p^k \cdot (1-p)^{m-k} \cdot \mu + \delta_{k,m} \cdot \omega$$

其中$\delta_{k,m}$是Kronecker delta函数。

**扩展BFR模型**引入了多种类型的非致命冲击，每种冲击类型可以有不同的条件失效概率$p_i$，允许更灵活地建模不同严重程度的共因冲击。

### 11.5 统一部分方法（UPM）/ IEC 61508-6 Annex D

UPM由Humphreys于1987年提出，后经EPSMA发展，是IEC 61508-6 Annex D检查表方法的直接前身 [R31]。

**8个关键评分因素**：

| 因素 | 说明 | 权重 |
|------|------|------|
| 设计/多样性 | 设计的多样性程度 | 高 |
| 物理分隔 | 物理和电气分隔程度 | 高 |
| 复杂性 | 系统设计和应用的复杂性 | 中 |
| 分析/评估 | 系统分析的深度 | 中 |
| 程序/人为因素 | 操作和维护程序 | 中 |
| 能力/培训 | 人员培训和资质 | 低-中 |
| 环境测试 | 环境鉴定试验 | 中 |
| 诊断覆盖率 | 在线诊断能力 | 高 |

**IEC 61508-6 Annex D检查表方法**：
- 提供37个诊断问题，每个问题有评分
- 基础β值：可编程电子系统最低约0.5%
- 无任何措施时默认β约10%
- 通过多样性等措施可获得显著降低

**β计算公式**：
$$\beta = \beta_{min} + \sum(S_i \cdot w_i)$$

**IEC 61508 CCF声明路径**：
- **Route 2_H**：基于使用经验（proven-in-use）证据，结合概率分析
- **Route 3_H**：通过详细的概率分析证明安全完整性

### 11.6 模型选择指南

| 模型 | 参数数量 | 适用场景 | 优点 | 局限性 |
|------|---------|---------|------|--------|
| Beta因子 | 1 | 简单冗余系统、初步评估 | 简洁、数据需求少 | 过于保守，不区分故障规模 |
| MGL | m-1 | 高冗余系统精细分析 | 区分不同故障规模 | 参数估计困难 |
| Alpha因子 | m | 数据充足的场景 | 直观、易于从数据估计 | 需要较多数据 |
| BFR | 3+ | 需区分冲击类型 | 物理意义明确 | 参数估计复杂 |
| UPM/检查表 | — | 设计阶段评估 | 定性→定量桥梁 | 主观性较强 |

---

## 12. ICDE国际共因数据交换项目

### 12.1 项目概况

**ICDE（International Common Cause Failure Data Exchange）** 是OECD核能署（NEA）下属核设施安全委员会（CSNI）组织的国际合作项目 [R32]。

**参与国家**：美国、法国、德国、瑞典、芬兰、韩国、日本、加拿大、西班牙、瑞士、英国等。

**项目阶段**：
- Phase I-VII（至2019年）
- Phase VIII（2019-2023）：报告编号NEA/CSNI/R(2023)9
- Phase IX（进行中）

### 12.2 数据收集方法论

**事件编码规则**：
1. **事件标识**：唯一事件编号
2. **组件类型**：泵、阀、柴油发电机等
3. **失效模式**：启动失败、运行失败等
4. **耦合因子**：确定CCF的根本原因
5. **影响组件数**：k-of-m
6. **共享原因因子**：设计、制造、环境、维护等

**CCF事件分级**：
- **完全CCF（Complete CCF）**：所有冗余通道同时失效
- **部分CCF（Partial CCF）**：部分冗余通道失效
- **CCF先兆（Incipient CCF）**：在失效前被发现

### 12.3 关键统计发现

**ICDE已发布的报告（截至2025年）**：
1. 离心泵CCF分析报告
2. 应急柴油发电机CCF分析报告
3. 电动阀（MOV）CCF分析报告
4. 止回阀CCF分析报告
5. 断路器CCF分析报告
6. 水位测量组件CCF分析报告
7. 蓄电池CCF经验教训报告
8. 系统间CCF分析报告：NEA/CSNI/R(2020)1

**关键统计**：
- ICDE数据库包含**超过1000个**经过分析的CCF事件
- 完全CCF的概率随冗余组件数量增加而**显著降低**
- 主要耦合因子分布：
  - 设计缺陷：约30%
  - 制造/安装错误：约25%
  - 维护错误：约20%
  - 环境因素：约15%
  - 其他：约10%

**2008年KAERI数据共享**：韩国原子能研究院从ICDE获得了407个CCF事件，涵盖柴油发电机、离心泵、止回阀、电动阀和断路器 [R33]。

---

## 13. CCF防控策略的量化评估

### 13.1 多样性信用（Diversity Credit）的量化

在PSA中"claiming credit for diversity"意味着承认采用了多样性设计可以降低CCF概率 [R3]：

$$\beta_{effective} = \beta_{base} \cdot (1 - \text{credit}_{diversity})$$

**多样性信用与策略对应**：

| 多样性策略 | 信用范围 | β缩减效果 |
|-----------|---------|----------|
| 策略A（不同技术：如数字化+模拟） | credit = 0.8-0.9 | β缩减至原来的10%-20% |
| 策略B（同一技术不同方法：如不同制造商） | credit = 0.5-0.7 | β缩减至原来的30%-50% |
| 策略C（技术变体：如不同软件版本） | credit = 0.2-0.4 | β缩减至原来的60%-80% |

### 13.2 各防控措施的β因子降低效果

| 防控措施 | β因子降低效果 | 对应策略 |
|---------|-------------|---------|
| 不同技术路线（数字化vs模拟） | 降低80%-90% | 策略A |
| 不同处理器架构（CPU vs FPGA） | 降低50%-70% | 策略A/B |
| 设备多样性（不同制造商） | 降低30%-50% | 策略B |
| 功能多样性 | 降低40%-60% | 策略B |
| 软件多样性（N版本编程） | 降低50%-70% | 策略B/C |
| 物理隔离 | 降低20%-40% | 辅助措施 |
| 人员/程序多样性 | 降低10%-30% | 策略C/辅助 |

### 13.3 量化计算示例

**场景**：3冗余2oo3表决系统，单通道故障率$\lambda = 10^{-3}$

| 配置 | β因子 | 共因故障概率 | 系统危险故障概率 |
|------|-------|-------------|----------------|
| 无多样性措施 | 0.30 | $0.30 \times 10^{-3} = 3 \times 10^{-4}$ | $\approx 3 \times 10^{-4}$（CCF主导） |
| 引入镜像多样性 | 0.15 | $1.5 \times 10^{-4}$ | $\approx 1.5 \times 10^{-4}$ |
| 引入技术栈异构 | 0.05 | $5 \times 10^{-5}$ | $\approx 5 \times 10^{-5}$ |
| 引入不同技术路线 | 0.01 | $1 \times 10^{-5}$ | $\approx 1 \times 10^{-5}$ |

**关键洞察**：在存在CCF的情况下，2oo3表决系统的危险故障概率主要由CCF贡献（$3\beta\lambda^2$远小于$\beta\lambda$），因此**降低β因子是提高系统可靠性最有效的手段**。

---

## 14. 数字化系统CCF的特殊性与量化挑战

### 14.1 软件CCF的独特特征

软件CCF与硬件CCF有根本性差异 [R34]：

| 特征 | 硬件CCF | 软件CCF |
|------|---------|---------|
| 故障性质 | 随机退化 | 系统性（确定性） |
| 数据来源 | 运行经验丰富 | 极少被记录 |
| 建模方法 | 概率模型适用 | 传统概率模型面临挑战 |
| 根本原因 | 环境、维护、制造缺陷 | 设计错误、规格说明歧义 |
| 消除途径 | 冗余+多样性 | 多样性+形式化验证 |

**软件CCF发生的三个必要条件**：
1. 存在潜在的软件缺陷（必要条件）
2. 缺陷被特定输入条件或运行状态激活
3. 激活条件在多个冗余通道中同时或近似同时出现

### 14.2 数字化CCF的PRA/PSA建模方法

**建模方法**：

| 方法 | 描述 | 适用场景 |
|------|------|---------|
| 显式建模 | 在故障树中为每个可能的软件CCF创建基本事件 | 详细PRA |
| 参数建模 | 使用修正的β因子模型，考虑软件特有的耦合因子 | 简化分析 |
| 多β因子模型 | 对不同类型的CCF（硬件、软件）使用不同的β值 | 综合分析 |
| PRADIC工具 | INL开发的数字化CCF识别和概率估计工具 | 数字化I&C专项 |

**INL方法（Idaho国家实验室）**：
- 区分"内部CCF"（硬件/软件缺陷）和"外部CCF"（环境、维护等）
- 为数字化I&C系统开发了专用的CCF参数估计方法

### 14.3 D3分析方法论

**法规依据**：BTP 7-19 Revision 6（2024年5月最终修订）[R24]

**D3分析流程**：
```
1. 识别安全功能
   └── 确定数字化I&C系统执行的安全功能
2. 假设软件CCF
   └── 特定软件的CCF导致安全功能丧失
3. 评估缓解能力
   └── 是否有足够的多样化备将来完成安全功能
4. 风险评估
   └── 如果缓解能力不足，评估剩余风险
5. 确定措施
   └── 包括增加多样性或提供额外防御
```

**2023年NRC风险知情方法（RIA）**：NRC委员会批准了风险知情D3评估方法，允许**定量评估**CCF风险，而非仅依赖定性分析 [R24]。

---

## 15. 近期研究进展（2020-2025）

### 15.1 贝叶斯方法用于CCF参数估计

CCF参数估计面临的核心问题是**数据稀疏**——高阶CCF事件极少发生。贝叶斯方法提供了解决方案 [R35]：

**方法**：
1. **先验分布选择**：使用Dirichlet先验用于Alpha因子
2. **后验分布计算**：$P(\alpha | \text{data}) \propto P(\text{data} | \alpha) \cdot P(\alpha)$
3. **特定方法**：
   - Alpha分解方法（Kelly, 2013）：分解不确定性来源
   - 贝叶斯几何标度模型
   - 基于因果推理的贝叶斯推断（处理缺失数据）

### 15.2 数字孪生应用于CCF监控

2021-2025年出现了将数字孪生技术应用于核电厂CCF监控的研究 [R36]：

- Springer（2025）：核电厂全生命周期安全管理和动态风险评估的数字孪生框架
- 数字孪生可用于**训练贝叶斯网络**进行故障诊断
- 通过**高保真仿真生成CCF情景数据**
- **实时监控和早期预警**CCF先兆

### 15.3 NEA共识立场（2025）

**NRC ML25163A258**（2025年发布）建立了数字化I&C系统CCF评估的最新国际共识框架 [R37]，来自NEA CSNI正在进行的国际合作研究成果。

### 15.4 PRALINE项目（SAFER2028, 2025）

**Performing Computations for Digital I&C Related CCFs in PRA**项目 [R38]：
- 开发简化CCF建模的工作流程和工具支持
- 面向芬兰核安全研究计划
- 提供实用的数字化I&C系统CCF PRA建模方法

---

## 16. 综合讨论：从核电到云核心网的映射

### 16.1 硬件异构设计的映射

| 核电硬件异构 | 云核心网映射 |
|-------------|------------|
| 不同技术路线（数字化vs模拟） | 异构计算（CPU+GPU/DPU/SmartNIC） |
| 不同处理器架构（CPU vs FPGA） | x86实例 vs. ARM实例异构部署 |
| 不同制造商平台 | 多云/多厂商异构（AWS EC2 vs. Azure VM） |
| 4重冗余+2oo4表决 | Raft/Paxos多节点投票 |
| 独立传感器 | 多维度健康检查（心跳+业务探针+拨测） |

### 16.2 软件异构设计的映射

| 核电软件异构 | 云核心网映射 |
|-------------|------------|
| N版本编程 | 多版本容器镜像并行部署 |
| 不同编程语言 | 不同语言实现（Go vs. Rust微服务） |
| 不同操作系统 | 不同基础镜像（Alpine vs. Ubuntu） |
| 形式化方法 | 模型检验、契约测试、属性测试 |
| 非软件化后备（DAS） | 硬编码/静态配置的后备路由 |

### 16.3 CCF防控的映射

| 核电CCF防控 | 云核心网映射 |
|------------|------------|
| Beta因子量化 | SLO/SLI误差预算建模 |
| 策略A（不同技术） | 多云部署 |
| 策略B（不同方法） | 多AZ+多集群部署 |
| ICDE数据驱动 | 混沌工程+故障注入数据积累 |
| D3分析 | 容灾架构设计审查 |
| 物理隔离 | 网络隔离（VPC+安全组+Network Policy） |
| 错时维护 | 滚动更新+金丝雀发布 |

---

## 参考文献

### 核心法规与标准

[R1] US NRC, BTP 7-19 Rev. 6, Guidance for Evaluation of Diversity and Defense-in-Depth, 2024. https://www.nrc.gov/docs/ML1814/ML18145A014.pdf

[R2] US NRC, NUREG/CR-6303, Diversity Strategies for Nuclear Power Plant I&C Systems, 1994. https://www.nrc.gov/docs/ML0717/ML071790509.pdf

[R3] US NRC, NUREG/CR-7007, Diversity Strategies for Nuclear Power Plant I&C Systems, 2008. https://www.nrc.gov/docs/ML1005/ML100541256.pdf

[R4] IEC 61513:2011, Nuclear Power Plants – I&C Systems Important to Safety – General Requirements, 2011. https://webstore.iec.ch/publication/5640

[R5] IEC 60880:2006, Nuclear Power Plants – Software Aspects for Computer-Based Systems Performing Category A Functions, 2006.

[R6] Westinghouse, Common Q Platform, WCAP-16097-NP. https://westinghousenuclear.com/data-sheet-library/westinghouse-common-q-platform/

[R7] Framatome, TELEPERM XS Brochure. https://www.framatome.com/solutions-portfolio/product/a0628/

[R8] CGN, FirmSys Nuclear Safety DCS. http://en.cgnp.com.cn/encgnp/c100866/2018-05/22/content_4b074fdfad2c4cfda9c15948967ed0eb.shtml

[R9] CNNP, NASPIC/龙鳞系统 DCS Platform. https://inis.iaea.org/records/xknhy-9vr81

[R10] US NRC, AP1000 DAS Planning, ML102170263. https://www.nrc.gov/docs/ML1021/ML102170263.pdf

[R11] UK ONR, EPR Step 3 C&I Assessment. https://www.onr.org.uk/media/pqhhrykn/step3-uk-epr-ci-assessment.pdf

[R12] US NRC, ABWR RPS Technical Specifications, ML103080338. https://www.nrc.gov/docs/ML1030/ML103080338.pdf

[R13] IFNEC, Hualong One Safety Approach. https://www.ifnec.org/ifnec/upload/docs/application/pdf/2018-06/2.t_xin_safety_approach_and_safety_assessment_of_hualong_one_2018-06-08_11-13-28_805.pdf

[R14] IEEE, Software Safety Assessment and the Sizewell B Applications. https://ieeexplore.ieee.org/document/172006/

[R15] A. Avizienis, "The N-Version Approach to Fault-Tolerant Software," IEEE Transactions on Software Engineering, Vol. SE-11, No. 12, 1985.

[R16] B. Randell, "System Structure for Software Fault Tolerance," IEEE Transactions on Software Engineering, Vol. SE-1, No. 2, 1975.

[R17] J. C. Knight, N. G. Leveson, "An Experimental Evaluation of the Assumption of Independence in Multi-Version Programming," IEEE TSE, 1986. http://sunnyday.mit.edu/papers/nver-tse.pdf

[R18] D. E. Eckhardt, L. D. Lee, "A Theoretical Basis for the Analysis of Multiversion Software Subject to Coincident Errors," IEEE TSE, Vol. SE-11, No. 12, 1985.

[R19] L. Hatton, "N-Version Design Versus One Good Version," IEEE Software, Vol. 14, No. 6, 1997. https://kar.kent.ac.uk/21442/1/N-version_Design_vs._One_Good_Version.pdf

[R20] B. Littlewood, P. Popov, L. Strigini, N. Shryane, "Modeling the Effects of Combining Diverse Software Fault Detection Techniques," IEEE TSE, 2000. https://impact.ref.ac.uk/casestudies/CaseStudy.aspx?Id=44358

[R21] KNS, APR-1400 Regulatory Positions. https://www.kns.org/files/pre_paper/41/19S-712-%EC%8B%A0%EC%8A%B9%EA%B8%B0.pdf

[R22] CORDEL, Defence-in-Depth Report. https://world-nuclear.org/images/articles/CORDEL-Defence-in-Depth-Report-10-April.pdf

[R23] QA Systems, IEC 60880 Compliance. https://www.qa-systems.com/blog/iec-60880-compliance-in-nuclear-systems/

[R24] US NRC, BTP 7-19 Rev. 5/6. https://www.nrc.gov/docs/ML1814/ML18145A016.pdf

[R25] MDEP DICWG-01, Common Position on Treatment of CCF in Digital Safety Systems, 2013. https://www.oecd-nea.org/mdep/common-positions/dicwg-01.pdf

[R26] A. Mosleh, et al., Procedures for Treating Common Cause Failures, NUREG/CR-4780, 1988/1989. https://www.nrc.gov/reading-rm/doc-collections/nuregs/contract/cr4780/

[R27] K. N. Fleming, A. Mosleh, A. P. Kelley Jr., On the Analysis of Dependent Failures, NUREG/CR-2621, 1983.

[R28] US NRC, NUREG/CR-5497, Common-Cause Failure Parameter Estimations.

[R29] A. Mosleh, D. M. Rasmuson, F. M. Marshall, Guidelines on Modeling CCF in PRA, NUREG/CR-5485, 1998. https://www.nrc.gov/reading-rm/doc-collections/nuregs/contract/cr5485/

[R30] C. L. Atwood, "The Binomial Failure Rate Common Cause Model," Technometrics, Vol. 28, No. 4, 1986.

[R31] P. Humphreys, UPM Checklist Method, 1987. Referenced in IEC 61508-6 Annex D.

[R32] OECD NEA, ICDE Project. https://www.oecd-nea.org/jcms/pl_25090/

[R33] OECD NEA, ICDE Phase VIII Summary Report, NEA/CSNI/R(2023)9. https://www.oecd-nea.org/jcms/pl_106920/

[R34] N. G. Leveson, Safeware: System Safety and Computers, Addison-Wesley, 1995.

[R35] D. L. Kelly, et al., Alpha-Decomposition for CCF Parameter Estimation, 2013.

[R36] Springer, Digital Twin Framework for Nuclear Plant Safety Management, 2025.

[R37] US NRC, ML25163A258, NEA Consensus Position on CCF for Digital I&C, 2025.

[R38] PRALINE Project (SAFER2028), Performing Computations for Digital I&C Related CCFs in PRA, 2025.

[R39] IAEA, NP-T-1.5, Preventing Common Cause Failures in Digital I&C Systems. https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1410_web.pdf

[R40] IAEA, SSG-39, Design of I&C Systems for Nuclear Power Plants. https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1694_web.pdf

[R41] IAEA, TECDOC 1848. https://www-pub.iaea.org/MTCD/Publications/PDF/TE1848-web.pdf

[R42] US NRC, NUREG/CR-5460, Cause-Defense Approach to CCF Analysis.

[R43] IEC 61508:2010, Functional Safety of E/E/PE Safety-related Systems, Parts 1-7.

[R44] ScienceDirect, Quantitative Evaluation of CCFs in DI&C Systems, 2022. https://www.sciencedirect.com/science/article/abs/pii/S0951832022005889

---

*本报告编制日期：2026-05-26*
*研究范围：核安全级仪控系统硬件异构设计、软件异构设计、共因失效量化与防御*
*参考文献截至2025年最新可用版本*
