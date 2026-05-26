# 核安全级仪控(I&C)系统硬件异构化设计研究

## 1. 概述

核安全级仪表与控制系统（Instrumentation and Control, I&C）是核电站的"神经中枢"，负责反应堆安全停堆、专设安全设施驱动、事故后监测等关键安全功能。为应对数字化 I&C 系统中潜在的共因故障（Common Cause Failure, CCF），国际核安全监管机构要求采用纵深防御与多样性（Defense-in-Depth and Diversity, D3）策略，其中**硬件异构化设计**是实现设备多样性（Equipment Diversity）的核心手段。

本文系统梳理全球主要核安全级 I&C 硬件平台的技术特征，对比其 CPU 架构、I/O 设计和通信总线的差异，并分析国际标准与监管要求，给出典型三代核电机组的工程实践案例。

---

## 2. 全球主要核安全级 I&C 硬件平台

### 2.1 Common Q（Westinghouse/AECL，原 ABB-CE）

| 技术参数 | 规格说明 |
|----------|---------|
| **平台全称** | Common Qualified Platform (Common Q) |
| **开发商** | Westinghouse Electric Company（源自 ABB Combustion Engineering 核事业部） |
| **控制器核心** | Advant Controller 160 (AC160) |
| **处理器模块** | PM646A — 32-bit Motorola MC68360（ColdFire 前身，68k 系列） |
| **升级处理器** | PM646C — 多核处理器，向后兼容 PM646A（Common Q+ 方案） |
| **冗余架构** | 支持 CPU 冗余（主/备切换）、1oo2 / 2oo3 站级冗余 |
| **I/O 模块** | S600 系列 — AI（含差分、热电偶、RTD）、AO、DI、PI、DO；每模块 8/16/32 通道，光电隔离 |
| **通信总线** | Advant Field Bus 100 (AF100) — 最多 80 站、13,300 米距离，支持双绞线/光纤；High-Speed Data Link (HSL) — RS422 多点 |
| **安全等级** | Class 1E（IEEE 603） |
| **HMI** | Flat Panel Display System (FPDS) — SHMI + 触摸屏（6.5"/12"/15"/19"） |
| **接口模块** | Component Interface Module (CIM) — 非软件化、安全级模块，实现安全/非安全系统优先级控制 |
| **MTBF** | > 70 年（AC160） |
| **可用性** | 99.9999% |
| **NRC 审批文件** | WCAP-16097-NP（Topical Report），NRC 安全评估报告 |
| **全球装机** | 50+ 核电站，1300+ 机柜，4000+ AC160 处理器（截至 2023 年） |

**应用系统：**
- Reactor Protection System (RPS)
- Engineered Safety Features Actuation System (ESFAS)
- Post-Accident Monitoring System (PAMS)
- Diesel Load Sequencer and Controls
- Core Protection Calculator System (CPCS)
- Nuclear Instrumentation Systems

**标准合规：**
IEEE 603, IEEE 338, IEEE 379, IEEE 384, IEEE 323, IEEE 344, IEEE 7-4.3.2, EPRI NP-5652, EPRI TR-106439, RG 1.153, RG 1.180 等。

### 2.2 TELEPERM XS / TXS（Siemens → AREVA → Framatome）

| 技术参数 | 规格说明 |
|----------|---------|
| **平台全称** | TELEPERM XS (TXS) |
| **开发商** | Framatome（前身为 Siemens / AREVA NP） |
| **安全等级分类** | IEC 61226 Category A（最高安全级别） |
| **处理器模块** | SVE2 / SVE3 — 32-bit CPU 自动化计算机；SVE3 性能为 SVE2 的 5 倍 |
| **处理方式** | 周期性循环执行（Cyclic Processing），非事件驱动，确保确定性 |
| **系统组件** | PU (Processing Unit), SU (Server Unit), MI (Message Interface) |
| **安全数据网络** | TXS-Profibus L2 — 1.5 MBit/s（原设计 12 MBit/s） |
| **信息数据网络** | TXS-Ethernet H1 — 100 MBit/s |
| **处理器失效率** | 2.89 × 10⁻⁷ [1/h] |
| **PFD（英国 ONR 评估）** | PS 系统 PFD ≈ 10⁻⁵ |
| **软件架构** | 操作系统 + 通信软件 + 运行时环境；应用软件以安全功能图表示 |
| **NRC 审批文件** | ANP-10272（Software Program Manual） |
| **EPRI 合规** | EPRI TR-114017（对 EPRI TR-107330 的合规矩阵） |

**衍生平台：**
- **TXS Compact** — 基于 FPGA 技术的新型安全级 I&C 平台，面向新建核电站和第四代反应堆，与 CPU 版 TXS 形成技术多样性。

**典型应用：**
- 反应堆保护系统（Reactor Protection System, PS）
- 反应堆控制、监督与限制系统（RCSL）
- 专设安全设施驱动

**应用堆型：** EPR（Olkiluoto Unit 3, Flamanville 3, Taishan 1&2）、UK EPR、U.S. EPR 等。

### 2.3 Triconex（Schneider Electric / Schweitzer Engineering Laboratories）

| 技术参数 | 规格说明 |
|----------|---------|
| **平台全称** | EcoStruxure Triconex（原 Invensys Triconex） |
| **当前归属** | Schneider Electric（2024 年核电业务剥离至 Schweitzer Engineering Laboratories, SEL） |
| **核心架构** | Triple Modular Redundancy (TMR) — 三重模块冗余 |
| **处理器** | 三片完全相同的处理器模块并行运行 |
| **表决机制** | 2-out-of-3 (2oo3) 多数表决 |
| **故障容限** | 单模块故障不影响系统运行；硬件级故障容限 |
| **安全标准** | IEC 61508 / IEC 61511（SIL 认证） |
| **NRC 审批** | NRC Topical Report 安全评估（与 HFC-6000、TXS、Common Q 同批审查） |
| **主要应用** | 安全仪表系统（SIS）、紧急停车（ESD）、火焰与气体（F&G）、汽轮机保护 |
| **核电应用** | 核电站给水控制、安全系统、汽轮机控制 |

**TMR 架构关键特性：**
- 每个 I/O 信号经三条独立信号路径处理
- 处理器间高速通信实现状态同步
- 在线模块热插拔更换
- 无单点故障

### 2.4 AC160 / Advant Controller 160（ABB）

AC160 既是 Common Q 平台的控制器核心（见 2.1 节），也是 ABB Advant Master DCS 的标准控制器。其在核电领域的独立应用包括：

| 技术参数 | 规格说明 |
|----------|---------|
| **控制器类型** | 高性能模块化控制器，支持多处理器并行 |
| **单子系统处理器数** | 最多 6 个处理器模块 |
| **安装方式** | 19 英寸标准机架（Eurocard 标准） |
| **操作系统** | ABB Advant OCS / System 800xA 集成 |
| **应用领域** | 汽轮机控制与保护（燃气/蒸汽/水轮）、电厂自动化 |
| **核安全资质** | 通过 Common Q 平台获得 NRC Class 1E 认证 |

**特别说明：** AC160 原为 ABB 工业控制产品线，Westinghouse 收购 ABB-CE 核电事业部后将其纳入核安全级平台并完成 NRC 资质审查，形成了 Common Q 平台。

### 2.5 FirmSys / 和睦系统（CGN 中广核）

| 技术参数 | 规格说明 |
|----------|---------|
| **平台全称** | FirmSys（"和睦系统"），国产化版本为 FirmSys-6000 |
| **开发商** | 北京广利核系统工程有限公司（中广核全资子公司） |
| **技术路线** | 基于微处理器（CPU）的 DCS 平台 |
| **核心芯片** | FirmSys-6000 基于**国产核心芯片和国产操作系统** |
| **安全功能** | 反应堆安全停堆、专设安全设施驱动 |
| **关键技术突破** | 全生命周期可靠性设计与安全分析、安全级通信网络设计 |
| **资质认证** | 通过 IAEA IERICS 团队审查；国内最高等级功能安全认证 |
| **首次工程应用** | 阳江核电站 |
| **国际应用** | UK HPR1000（华龙一号英国版）GDA 审查 |
| **开发标准** | 中国核安全标准 + 国际核安全标准（IEC 61513 等） |

**在华龙一号中的角色：** FirmSys 作为中广核方案的核心安全级 DCS 平台，负责反应堆保护系统等 Category A 功能。它与中核集团的"龙鳞系统"（NASPIC）形成**硬件多样性互补**，构成华龙一号多样化纵深防御体系。

### 2.6 NASPIC / 龙鳞系统（CNNP 中核）

| 技术参数 | 规格说明 |
|----------|---------|
| **平台全称** | NASPIC (Nuclear Safety-grade Platform for Instrumentation and Control)，即"龙鳞系统" |
| **开发商** | 中国核动力研究设计院（NPIC，隶属中核集团 CNNC） |
| **发布时间** | 2018 年 12 月 6 日 |
| **技术路线** | 基于微处理器（CPU） |
| **系统组成** | 主控制站、安全显示站、网关站、工程师站、信号预处理模块 |
| **操作系统** | 自主安全操作系统，100% 自主编写（C 语言），未使用外国 Linux 类开源内核 |
| **软件国产化** | 软件和系统集成 100% 国产化 |
| **机械结构** | 高抗震性能，满足三代核电要求 |
| **功能安全认证** | 最高等级 SIL 认证 |
| **工程应用** | 国内首个在役商用核电厂安全级 DCS 数字化改造项目（KRG-P 系统改造） |

**与 FPGA 方案的对比：** 中核集团还开发了 **NuPAC / 龙核** 平台，采用 FPGA 技术路线（软件硬件化、分散式架构、点对点通信），与 NASPIC 的 CPU 技术路线形成**平台内技术多样性**。

| 特性 | NASPIC（龙鳞系统） | NuPAC（龙核） |
|------|-------------------|----------------|
| 技术路线 | 基于微处理器（CPU） | 基于 FPGA |
| 操作系统 | 自主安全操作系统 | 无需传统 OS（硬件化逻辑） |
| 通信方式 | 网络通信 | 分散式、点对点 |
| 开发单位 | 中国核动力研究设计院 | 中核控制 |

### 2.7 平台对比矩阵

| 平台 | 厂商 | CPU 架构 | 冗余架构 | 通信总线 | I/O 体系 | NRC 批准 |
|------|------|---------|---------|---------|---------|---------|
| **Common Q** | Westinghouse | Motorola MC68360 (32-bit, PM646A) → 多核 (PM646C) | 1oo2 / 2oo3 | AF100 + HSL (RS422) | S600 系列（8-32 通道/模块） | 是 (WCAP-16097) |
| **TELEPERM XS** | Framatome | SVE2/SVE3 (32-bit CPU) | 四重冗余（4 trains） | Profibus L2 (1.5 Mbps) + Ethernet H1 (100 Mbps) | 模块化 I/O | 是 (ANP-10272) |
| **Triconex** | Schneider/SEL | TMR 三处理器并行 | 2oo3 TMR | 专用高速总线 | 三重化 I/O | 是 (Topical Report) |
| **FirmSys** | CGN（广利核） | 国产 CPU 芯片 | 多重冗余 | 安全级通信网络 | — | IAEA 审查通过 |
| **NASPIC** | CNNP（核动力院） | CPU 路线 | 多重冗余 | — | 模块化 | 国内最高 SIL 认证 |

---

## 3. NRC D3（纵深防御与多样性）要求

### 3.1 BTP 7-19 核心要求

**BTP 7-19**（Branch Technical Position 7-19, Rev. 6, 2024 年 5 月最终修订）是美国 NRC 关于数字化 I&C 系统多样性评估的权威指导文件，其核心要求包括：

1. **D3 评估必须执行：** 对所有安全级数字化 I&C 系统，必须进行纵深防御与多样性评估
2. **共因故障假设：** 假设安全级数字化系统可能发生全系统范围的共因故障（CCF），需确认存在足够的多样化后备手段
3. **多样化后备系统要求：**
   - 必须能够独立于主保护系统执行关键安全功能（反应堆停堆、安全壳隔离、余热排出等）
   - 硬件平台必须与主保护系统存在**设备多样性（Equipment Diversity）**
   - 应使用**独立传感器**
4. **风险知情方法（RIA）：** 2023 年 NRC 委员会批准了风险知情 D3 评估方法，允许定量评估 CCF 风险
5. **手动操作与显示：** BTP 7-19 也评估了手动控制与显示设备的设计，确保操作员在 CCF 情景下有足够信息与操作能力

### 3.2 多样性属性分类（基于 NUREG/CR-6303）

BTP 7-19 的多样性评估框架源自 NUREG/CR-6303，定义了 **六大多样性属性**：

| 属性 | 英文名称 | 含义 |
|------|---------|------|
| **设计多样性** | Design Diversity | 不同设计方法、算法、逻辑实现 |
| **设备多样性** | Equipment Diversity | 不同制造商、不同硬件平台 |
| **功能多样性** | Functional Diversity | 不同功能响应同一安全需求 |
| **生命周期多样性** | Life-cycle Diversity | 不同开发团队、工具链、V&V 过程 |
| **信号多样性** | Signal Diversity | 不同传感器、测量原理、信号路径 |
| **软件多样性** | Software Diversity | 不同编程语言、操作系统、编译器 |

其中，**硬件异构化设计**直接对应**设备多样性**属性，是实现 D3 的最核心手段之一。

---

## 4. 典型三代核电机组硬件多样性工程实践

### 4.1 EPR 多样化保护系统（PS + SSS/SAS）

**EPR（European Pressurized Reactor）** 的 I&C 架构是硬件多样性设计的典型案例：

```
┌─────────────────────────────────────────────────────────────┐
│                    EPR I&C 架构                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────┐                        │
│  │  Protection System (PS)          │ ← 主保护系统            │
│  │  平台: TELEPERM XS (TXS)         │    CPU-based            │
│  │  冗余: 4 重冗余 (4 trains)       │    32-bit SVE处理器      │
│  │  功能: 反应堆停堆、ESF 驱动       │    Profibus L2 通信      │
│  │  PFD: ~10⁻⁵                     │                        │
│  └──────────────────────────────────┘                        │
│                    ↕ 多样性隔离                                │
│  ┌──────────────────────────────────┐                        │
│  │  Safety Automation System (SAS)  │ ← 多样化后备系统        │
│  │  平台: Siemens SSS               │    不同硬件平台          │
│  │  功能: 事故后管理I&C功能          │    PFD: ~10⁻⁴           │
│  │  (手动+自动)                     │                        │
│  └──────────────────────────────────┘                        │
│                                                               │
│  ┌──────────────────────────────────┐                        │
│  │  RCSL                            │ ← 反应堆控制、监督与限制 │
│  │  平台: TELEPERM XS (TXS)         │    (与 PS 同平台但独立)  │
│  └──────────────────────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**多样性分析：**

| 多样性维度 | PS (主保护) | SAS/SSS (多样化后备) |
|-----------|-------------|---------------------|
| **硬件平台** | TELEPERM XS (CPU) | Siemens SSS (不同平台) |
| **PFD** | ~10⁻⁵ | ~10⁻⁴ |
| **功能** | 自动停堆、ESF 驱动 | 事故后管理（手动+自动） |
| **跳闸器件** | Trip breakers | Trip contactors（多样化执行） |

**关键文档：**
- U.S. EPR D3 评估报告：NRC ML091671517
- AREVA D3 评估：NRC ML12157A120
- UK EPR ONR 监管观察：RI-UKEPR-0002

### 4.2 AP1000 PMS + DAS 多样化设计

**AP1000** 采用独特的被动安全系统设计，其 I&C 多样性架构如下：

```
┌─────────────────────────────────────────────────────────────┐
│                  AP1000 I&C 多样性架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────┐                        │
│  │  Protection & Monitoring System  │ ← 主保护系统            │
│  │  (PMS)                           │                        │
│  │  平台: Common Q (AC160)          │    Motorola MC68360     │
│  │  冗余: 4 重冗余 (A/B/C/D)        │    数字化平台           │
│  │  安全等级: Class 1E              │    AF100 通信总线       │
│  │  功能: 反应堆停堆、ESF 驱动       │                        │
│  └──────────────────────────────────┘                        │
│                    ↕ 硬件多样性                                │
│  ┌──────────────────────────────────┐                        │
│  │  Diverse Actuation System (DAS)  │ ← 多样化驱动系统        │
│  │  平台: Westinghouse 7300 系列    │    模拟/常规电子设备     │
│  │  安全等级: Non-safety related     │    (非软件化)           │
│  │  传感器: 独立于 PMS 和 PLS       │                        │
│  │  执行设备: 与 PMS 共享部分阀门等  │                        │
│  │  功能: 备用反应堆停堆、部分ESF驱动│                        │
│  └──────────────────────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**AP1000 硬件多样性关键特征：**

| 特征 | PMS | DAS |
|------|-----|-----|
| **平台类型** | 数字化（Common Q / AC160） | 模拟/常规电子（7300 系列） |
| **处理技术** | 微处理器 (Motorola MC68360) | 硬接线/模拟逻辑 |
| **软件** | 有（数字逻辑） | 无/极少（非软件化设计） |
| **传感器** | 独立传感器组 | 独立传感器组（不同于 PMS） |
| **安全分级** | Class 1E (Safety-related) | Non-safety related |
| **通信** | AF100 数字总线 | 硬接线 |
| **设计目标** | 缓解 PMS 中假定的 CCF | |

**NRC 审查文件：**
- AP1000 DCD Rev. 19: NRC ML11171A313
- DAS 规划与功能文件: NRC ML102170263
- UK ONR GI-AP1000-CI-01: DAS 评估报告

### 4.3 ABWR 多样化跳闸系统

**ABWR（Advanced Boiling Water Reactor）** 的 I&C 多样性架构：

```
┌─────────────────────────────────────────────────────────────┐
│                  ABWR I&C 多样性架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────┐                        │
│  │  Safety System Logic & Control   │ ← 安全系统逻辑与控制    │
│  │  (SSLC)                          │                        │
│  │  冗余: 4 重冗余 (4 divisions)    │    数字化系统           │
│  │  复用网络: 4 条冗余复用链路       │                        │
│  │  功能: RPS + ESF 逻辑控制        │                        │
│  └──────────────────────────────────┘                        │
│                    ↕ 设备多样性                                │
│  ┌──────────────────────────────────┐                        │
│  │  Diverse Trip / Backup System    │ ← 多样化跳闸/后备系统   │
│  │  方案1: 不同供应商设备            │    (Toshiba vs Hitachi) │
│  │  方案2: FPGA-based RPS           │    (替代数字化的后备)   │
│  │  功能: 独立于 SSLC 的停堆能力    │                        │
│  └──────────────────────────────────┘                        │
│                                                               │
│  RPS 设备组成:                                                │
│  - 4 重冗余传感器通道 (Sensor Channels)                      │
│  - 4 重冗余跳闸逻辑 (Trip Logics)                            │
│  - 跳闸执行器 (Trip Actuators)                               │
│  - 2 重手动停堆分部 (Manual Scram Divisions)                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**ABWR 硬件多样性策略（以龙门核电站 Lungmen 为例）：**

| 策略 | 实现方式 |
|------|---------|
| **设备多样性** | 不同 I&C 子系统由不同供应商提供（Toshiba、Hitachi 等） |
| **FPGA 后备** | 采用基于 FPGA 的 RPS 作为数字化 I&C 的多样化后备 |
| **功能多样性** | 不同功能响应同一安全需求 |
| **信号多样性** | 独立的传感器和信号路径 |

**关键文档：**
- NUREG/CR-7007: Diversity Strategies for Nuclear Power Plant I&C Systems
- ABWR RPS 技术规格: NRC ML103080338
- IAEA TECDOC 1848

### 4.4 华龙一号（HPR1000）多样化 I&C 设计

华龙一号采用了中广核和中核两个集团联合研发的方案，在安全级 I&C 方面形成了独特的"双重平台"多样化设计：

```
┌─────────────────────────────────────────────────────────────┐
│              华龙一号 HPR1000 I&C 多样性架构                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────┐                        │
│  │  安全级 DCS 方案 A               │                        │
│  │  平台: FirmSys ("和睦系统")       │ ← 中广核方案           │
│  │  开发商: 广利核公司 (CGN)         │    CPU 路线             │
│  │  技术: 国产核心芯片+国产操作系统  │    FirmSys-6000        │
│  │  功能: 反应堆停堆、ESF 驱动       │                        │
│  └──────────────────────────────────┘                        │
│                    ↕ 硬件多样性                                │
│  ┌──────────────────────────────────┐                        │
│  │  安全级 DCS 方案 B               │                        │
│  │  平台: NASPIC ("龙鳞系统")        │ ← 中核方案             │
│  │  开发商: 核动力设计院 (CNNP)       │    CPU 路线             │
│  │  技术: 自主 CPU + 自主安全OS      │    100% 国产化          │
│  │  功能: 多样化后备保护             │                        │
│  └──────────────────────────────────┘                        │
│                    ↕ 技术路线多样性                            │
│  ┌──────────────────────────────────┐                        │
│  │  FPGA 备选方案                    │                        │
│  │  平台: NuPAC ("龙核")             │ ← FPGA 技术路线        │
│  │  开发商: 中核控制                  │    无操作系统           │
│  │  技术: FPGA 硬件化逻辑            │    点对点通信           │
│  └──────────────────────────────────┘                        │
│                                                               │
│  非安全级 DCS: SH-N 分布式控制系统（自主研发）                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**华龙一号多样性特色：**
- FirmSys（和睦）与 NASPIC（龙鳞）为**两个完全独立开发的安全级 DCS 平台**，基于不同的硬件架构和软件体系
- 中核集团内部的 NASPIC（CPU 路线）与 NuPAC（FPGA 路线）进一步形成**平台内技术多样性**
- 安全级 DCS 网络采用**光电隔离**设计

---

## 5. 国际标准中硬件多样性要求

### 5.1 IEC 60880 — 核安全 I&C 软件方面

IEC 60880《Nuclear power plants — Instrumentation and control systems important to safety — Software aspects for computer-based I&C systems》主要规定核安全级数字化 I&C 系统的软件要求，与硬件多样性相关的要点包括：

- **IEC 61513 的框架下**，IEC 60880 适用于安全 Class 1 系统（支持 Category A 功能）
- 对于采用数字化系统执行安全功能的场景，要求分析软件 CCF 风险
- 建议通过**功能多样性**和**设备多样性**来缓解软件 CCF
- 要求在不同安全列（division）之间实现**充分的独立性**

### 5.2 IEC 61513 — 核安全 I&C 系统总体要求

IEC 61513《Nuclear power plants — Instrumentation and control systems important to safety — General requirements for systems》是核安全级 I&C 系统的顶层框架标准，关键要求包括：

**架构要求：**
- I&C 系统架构必须划分为**足够数量的独立系统和设备**以满足安全要求
- 系统间必须保持**独立性**（independence），通过实体隔离、电气隔离和通信隔离实现
- **纵深防御**原则：多层独立防护层，每层使用尽可能多样化的手段
- 明确要求在设计中考虑**多样性**以应对 CCF

**与硬件多样性直接相关的条款：**
- **Clause 5（系统架构要求）**：要求识别 CCF 潜在来源，通过架构多样性（包括硬件平台差异）来缓解
- **Clause 7（设计要求）**：要求对硬件设备进行多样性分析
- 引用 IEC 61226 进行安全功能分级（Category A/B/C）

**与其他 IEC 标准的关系：**
```
IEC 61513 (顶层框架)
    ├── IEC 61226 (安全分级)
    ├── IEC 60880 (软件, Category A)
    ├── IEC 62138 (软件, Category B/C)
    ├── IEC 60980 (抗地震鉴定)
    └── IEC 60780 (设备鉴定)
```

### 5.3 NUREG/CR-6303 多样性评估方法

NUREG/CR-6303《Method for Performing Diversity and Defense-in-Depth Analyses of Reactor Protection Systems》是美国 NRC 委托 ORNL（Oak Ridge National Laboratory）开发的 D3 评估方法论，核心内容如下：

**六大多样性属性与 25 项多样性准则：**

| 多样性属性 | 关联准则数量 | 典型准则示例 |
|-----------|------------|------------|
| **Design Diversity（设计多样性）** | 多项 | 不同设计方法、不同算法、不同逻辑结构 |
| **Equipment Diversity（设备多样性）** | 多项 | 不同制造商、不同 CPU 架构、不同 I/O 模块 |
| **Functional Diversity（功能多样性）** | 多项 | 不同功能响应同一过程参数、不同触发条件 |
| **Life-cycle Diversity（生命周期多样性）** | 多项 | 不同开发团队、不同工具链、不同 V&V 组织 |
| **Signal Diversity（信号多样性）** | 多项 | 不同传感器类型、不同测量原理、不同信号路径 |
| **Software Diversity（软件多样性）** | 多项 | 不同编程语言、不同操作系统、不同编译器 |

**"设备多样性"属性的详细准则（Section 2.6）：**
1. **不同制造商（Different manufacturers）** — 使用不同厂商的设备
2. **不同处理器架构（Different CPU/logic architectures）** — 如 Motorola 68k vs. Intel x86 vs. ARM vs. FPGA
3. **不同 I/O 设计（Different I/O architectures）** — 不同的模拟/数字通道设计
4. **不同通信机制（Different communication mechanisms）** — 不同的现场总线协议和数据传输方式

**评估流程：**
1. 识别安全级数字化系统
2. 对每个系统假设 CCF 发生
3. 评估多样化后备能力
4. 使用 6 大属性 × 25 项准则评估多样性充分性
5. 若多样性不足，提出弥补措施

**ORNL 扩展研究（NUREG/CR-7007）：** 在 NUREG/CR-6303 基础上，ORNL 进一步将多样性策略按**技术类型**（Technology Type）组织：
- 相同技术（Identical Technology）
- 不同技术类型（Different Technology Types）— 如 CPU vs. FPGA vs. 继电器
- 不同制造商同类技术（Same Technology, Different Manufacturer）

---

## 6. 硬件多样性实现策略总结

### 6.1 主要多样性策略对比

| 策略 | 实现方式 | 典型案例 | 多样性强度 |
|------|---------|---------|-----------|
| **不同技术路线** | 数字化 vs. 模拟/硬接线 | AP1000 (PMS + DAS) | 极高 |
| **不同处理器架构** | CPU vs. FPGA | NASPIC vs. NuPAC; TXS vs. TXS Compact | 高 |
| **不同制造商平台** | Common Q vs. Triconex vs. TXS | 龙门 ABWR (多供应商) | 高 |
| **同一平台不同配置** | 不同 I/O、不同通信 | EPR (PS 四列独立) | 中 |
| **功能+信号多样性** | 不同测量原理 | EPR/AP1000 (多样化传感器) | 中-高 |

### 6.2 选择策略的考量因素

1. **安全分级要求：** Class 1E / Category A 系统要求最高的多样性等级
2. **CCF 分析结果：** 根据具体系统 CCF 脆弱性分析选择针对性策略
3. **经济可行性：** 维护两个完全不同的硬件平台成本较高
4. **许可证经验：** 已被监管机构接受的方案更容易通过审查
5. **长期运维：** 需要考虑备件供应、人员培训、备品备件管理

---

## 7. 参考文献与关键文档索引

### NRC 文档
- BTP 7-19 Rev. 6: [NRC ML18145A014](https://www.nrc.gov/docs/ML1814/ML18145A014.pdf) — D3 评估指导
- NUREG/CR-6303: [NRC ML071790509](https://www.nrc.gov/docs/ML0717/ML071790509.pdf) — D3 分析方法
- NUREG/CR-7007: [NRC ML100541256](https://www.nrc.gov/docs/ML1005/ML100541256.pdf) — I&C 多样性策略
- Common Q Topical Report: WCAP-16097-NP, [NRC ML19177A146](https://www.nrc.gov/docs/ML1917/ML19177A146.pdf)
- TELEPERM XS Topical Report: ANP-10272, [NRC ML101390464](https://www.nrc.gov/docs/ML1013/ML101390464.pdf)
- Triconex 安全评估: [NRC ML11318A029](https://www.nrc.gov/docs/ML1131/ML11318A029.pdf)
- U.S. EPR D3 评估: [NRC ML091671517](https://www.nrc.gov/docs/ML0916/ML091671517.pdf)
- AP1000 DAS 规划: [NRC ML102170263](https://www.nrc.gov/docs/ML1021/ML102170263.pdf)
- ABWR RPS: [NRC ML103080338](https://www.nrc.gov/docs/ML1030/ML103080338.pdf)

### IEC 标准
- IEC 60880: Nuclear power plants — Software aspects for computer-based I&C systems important to safety
- IEC 61513: Nuclear power plants — General requirements for I&C systems important to safety
- IEC 61226: Nuclear power plants — I&C systems important to safety — Classification of I&C functions

### IAEA 文档
- IAEA TECDOC 1848: [IAEA PDF](https://www-pub.iaea.org/MTCD/Publications/PDF/TE1848-web.pdf)
- IAEA Safety Guide SSG-39 (Pub1694): [IAEA PDF](https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1694_web.pdf)

### 行业报告
- CORDEL D3 Report: [World Nuclear Association PDF](https://world-nuclear.org/images/articles/CORDEL-Defence-in-Depth-Report-10-April.pdf)
- CORDEL Safety Classification: [World Nuclear Association PDF](https://world-nuclear.org/images/articles/CORDEL-DICTF%2520Safety%2520Classification.pdf)
- ORNL Diversity Strategies: [ORNL Pub22473](https://info.ornl.gov/sites/publications/files/Pub22473.pdf)
- OECD/NEA I&C Platform Qualification: [NEA PDF](https://one.oecd.org/document/NEA/CNRA/R(2018)3/en/pdf)
- EPRI TR-114017: TELEPERM XS 对 EPRI TR-107330 合规报告

### 厂商文档
- Westinghouse Common Q Platform: [Westinghouse](https://westinghousenuclear.com/data-sheet-library/westinghouse-common-q-platform/)
- Westinghouse Common Q+ Processor: [Westinghouse](https://westinghousenuclear.com/data-sheet-library/common-qplus-safety-system-processor-module/)
- Framatome TELEPERM XS: [Framatome](https://www.framatome.com/solutions-portfolio/product/a0628/)
- Framatome TXS Brochure: [Framatome PDF](https://www.framatome.com/solutions-portfolio//app/uploads/2025/09/a0628-txs-brochure-a4114afc1928a94254a661d0839821d5d6.pdf)
- Siemens TXS Overview (NRC): [NRC ML003732662](https://www.nrc.gov/docs/ml0037/ML003732662.pdf)

### UK ONR 文档
- UK EPR Step 3 C&I Assessment: [ONR PDF](https://www.onr.org.uk/media/pqhhrykn/step3-uk-epr-ci-assessment.pdf)
- UK EPR Diverse Backup RI-UKEPR-0002: [ONR PDF](https://www.onr.org.uk/media/vm5dvkrr/ri-ukepr-0002.pdf)
- AP1000 GI-AP1000-CI-01 DAS Assessment: [ONR PDF](https://www.onr.org.uk/media/jbgasvit/onr-nr-ar-16-029.pdf)
- ONR Licensing Common Position 2024: [ONR PDF](https://www.onr.org.uk/media/i2anr3nd/24-09-common-position-2024-revision-1.pdf)

---

*本文档编制日期：2026-05-26*
*研究范围：核安全级 I&C 系统硬件异构化设计*
*语言：中文正文，英文技术术语保持原文*
