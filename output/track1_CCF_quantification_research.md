# 共因失效(CCF)量化与防御策略研究报告
## 核安全级数字化仪控系统专题

---

## 目录
1. CCF量化模型与数学公式体系
2. ICDE国际共因数据交换项目
3. NRC/IEC共因失效防御评估方法
4. 数字化系统CCF特殊性
5. 近期研究进展(2020-2025)
6. 参考文献

---

## 1. CCF量化模型与数学公式体系

### 1.1 Beta因子模型(Beta Factor Model)

#### 基本定义
Beta因子模型是最简单、使用最广泛的CCF参数模型,由Fleming于1975年提出。核心假设:所有组件的共因失效部分可以通过单一参数beta来表征。

#### 数学公式
设一个CCCG(Common Cause Component Group)包含m个相同组件:

**总失效概率:**
Q_T = Q_I + Q_C

其中:
- Q_I = 独立失效概率
- Q_C = 共因失效概率

**Beta因子定义:**
beta = Q_C / Q_T

即: beta是总失效中归因于共因失效的比例。

**各阶CCF概率:**
- 单个组件独立失效概率: Q_I = (1 - beta) * Q_T
- 所有m个组件同时失效的CCF概率: Q_m = beta * Q_T

**中间阶CCF的处理:**
对于k < m的情况,标准Beta因子模型将所有共因失效部分都分配给最高阶(m重),即:
Q_k^(CCF) = 0, 对于 1 < k < m
Q_m^(CCF) = beta * Q_T

这是一个保守假设——模型认为一旦共因冲击发生,所有冗余组件都会失效。

#### Beta参数估计方法

**方法1:运行经验数据估计**
从运行经验数据库(如ICDE、NRC EPIX)中收集失效事件,采用最大似然估计(MLE):

beta_MLE = n_ccf / (n_ccf + n_ind)

其中:
- n_ccf = 观测到的共因失效事件数
- n_ind = 观测到的独立失效事件数

**方法2:IEC 61508-6 Annex D检查表法**
基于37个诊断问题的评分确定beta值:
- 每个问题对应特定的评分值
- 总评分映射为beta值
- 典型范围: 0.5% - 10%

**方法3:UPM(统一部分方法)**
Humphreys于1987年提出的检查表方法,IEC 61508-6的检查表方法即源于此。

**典型Beta值范围(核工业):**
| 组件类型 | beta典型值 |
|----------|-----------|
| 离心泵 | 0.05 - 0.15 |
| 应急柴油发电机 | 0.05 - 0.10 |
| 电动阀 | 0.05 - 0.10 |
| 止回阀 | 0.05 - 0.10 |
| 断路器 | 0.05 - 0.10 |

---

### 1.2 多重希腊字母模型(MGL Model)

#### 基本定义
MGL模型是Beta因子模型的推广,由Fleming等人于1986年提出。它引入了额外的条件概率参数来区分不同阶数的CCF。

#### 数学公式(以4组件组为例,m=4)

**参数定义:**
- beta: 发生CCF(而非独立失效)的条件概率
- gamma: 给定CCF已发生,涉及3个或4个组件的条件概率
- delta: 给定CCF涉及3个或4个组件,涉及4个组件的条件概率

**各阶CCF概率:**
- Q_1 = (1 - beta) * Q_T (独立失效)
- Q_2 = beta * (1 - gamma) * Q_T (二重CCF)
- Q_3 = beta * gamma * (1 - delta) * Q_T (三重CCF)
- Q_4 = beta * gamma * delta * Q_T (四重CCF)

**一般形式(m组件):**
对于CCCG包含m个组件,需要m-1个参数:beta, gamma, delta, ..., 每个参数都是在前一个条件上的条件概率。

**验证条件:**
sum(Q_k, k=1 to m) = Q_T

#### MGL与Beta因子模型的关系
当 gamma = delta = 1 时,MGL模型退化为标准Beta因子模型(所有CCF都导致全部组件失效)。

#### 参数估计
MGL参数通常通过ICDE数据库中的失效事件数据,采用最大似然估计(MLE)方法进行估计。NUREG/CR-5497提供了详细的MGL参数估计值。

---

### 1.3 Alpha因子模型(Alpha Factor Model)

#### 基本定义
Alpha因子模型由Mosleh和Siu于1987年提出,被IAEA TECDOC 648推荐为首选CCF模型,也是NUREG/CR-5485推荐使用的模型。

#### 数学公式

**Alpha因子定义:**
alpha_k = n_k / N_total, k = 1, 2, ..., m

其中:
- n_k = 涉及恰好k个组件的失效事件数
- N_total = sum(n_k, k=1 to m) = 总失效事件数
- sum(alpha_k, k=1 to m) = 1

**各阶CCF基本事件概率:**

Q_k = (k / C(m,k)) * alpha_k * Q_T

其中C(m,k)是组合数。

或等价地:

Q_k = alpha_k * Q_T * k * m! / (k! * (m-k)! * m)

**更一般的形式:**
对于m个组件的CCCG,其中恰好k个组件失效的CCF基本事件概率为:

Q_k^(CCF) = alpha_k * (k / (m-1 choose k-1)) * Q_T

#### Alpha因子估计方法

**从ICDE数据库估计:**
1. 收集组件类型的所有失效事件
2. 按涉及的组件数量k进行分类
3. 统计n_k (k阶失效事件数)
4. 计算alpha_k = n_k / sum(n_j)

**数值示例(4组件应急柴油发电机):**
假设从ICDE数据库收集到:
- n_1 = 200 (独立失效事件)
- n_2 = 15 (二重CCF事件)
- n_3 = 3 (三重CCF事件)
- n_4 = 2 (四重CCF事件)

则:
- alpha_1 = 200/220 = 0.909
- alpha_2 = 15/220 = 0.068
- alpha_3 = 3/220 = 0.014
- alpha_4 = 2/220 = 0.009

---

### 1.4 二项失效速率模型(Binomial Failure Rate Model, BFR)

#### 历史背景
- Vesely于1977年提出原始BFR模型(冲击模型)
- Atwood于1980年发展了形式化的估计量方法(OSTI报告: DOE/DP/0015)
- Atwood于1986年在Technometrics期刊上发表了完整理论(Technometrics, Vol.28, No.4)

#### 基本假设
BFR模型假设CCF由"冲击"(shock)事件引起。系统受到两类冲击:

1. **致命冲击(Lethal Shock)**: 以速率omega发生,导致所有m个组件同时失效
2. **非致命冲击(Non-lethal Shock)**: 以速率mu发生,每个组件独立地以概率p失效

#### 数学公式

**系统参数:**
- lambda = 单个组件的独立失效速率
- mu = 非致命冲击发生速率(泊松过程)
- p = 非致命冲击下单个组件的条件失效概率
- omega = 致命冲击发生速率(泊松过程)
- m = 组件数量

**单个组件总失效概率:**
Q_t = Q_1 + p * Q_SH + Q_LS

其中:
- Q_1 = lambda * t (独立失效概率)
- Q_SH = mu * t (非致命冲击发生概率)
- Q_LS = omega * t (致命冲击发生概率)

**k个组件因非致命冲击而同时失效的概率:**
P(k | non-lethal shock) = C(m,k) * p^k * (1-p)^(m-k)

**总k阶失效速率:**
对于0 < k < m:
rate_k = C(m,k) * p^k * (1-p)^(m-k) * mu + delta_{k,m} * omega

其中delta_{k,m}是克罗内克delta函数。

**BFR模型参数估计(Atwood MLE):**
Atwood给出了参数的最大似然估计量:
- lambda_hat = N_1 / (m * T) (从单组件失效数据估计)
- mu_hat和p_hat: 从多重失效事件数据通过MLE迭代求解
- omega_hat: 从导致全部组件失效的事件数估计

#### 扩展BFR模型
扩展BFR模型引入了多种类型的非致命冲击:
- 不同类型的冲击可以有不同的条件失效概率p_i
- 允许更灵活地建模不同严重程度的共因冲击
- 数学表达式变得更为复杂,需要为每种冲击类型引入额外的参数对(mu_i, p_i)

---

### 1.5 映射模型与统一部分方法(UPM)

#### 统一部分方法(Unified Partial Method, UPM)

**历史与发展:**
- Humphreys于1987年提出原始检查表方法
- 后经EPSMA(工程设备与材料用户协会)发展为UPM
- IEC 61508-6 Annex D的检查表方法直接源于UPM

**基本原理:**
UPM通过评估影响CCF的8个关键因素来确定beta因子:

1. **设计/多样性(Design/Diversity)**: 设计的多样性程度
2. **物理分隔(Separation)**: 物理和电气分隔
3. **复杂性(Complexity)**: 系统设计和应用的复杂性
4. **分析/评估(Assessment)**: 系统分析深度
5. **程序/人为因素(Procedures)**: 操作和维护程序
6. **能力/培训(Competence)**: 人员培训和资质
7. **环境测试(Environmental Testing)**: 环境鉴定试验
8. **诊断覆盖率(Diagnostic Coverage)**: 在线诊断能力

**评分方法:**
- 每个因素根据实际措施获得评分(0-100%)
- 各因素权重不同
- 最终beta值通过综合评分计算

**IEC 61508-6 Annex D检查表:**
标准提供了37个诊断问题,每个问题有评分:
- 基础beta值: 对于可编程电子系统,最低约0.5%
- 无任何措施: 默认beta约10%
- 通过多样性等措施可获得显著降低

**beta计算公式(IEC 61508-6):**
beta = beta_min + sum(S_i * w_i)

其中S_i是第i个问题的评分,w_i是权重。

**Route 2_H 和 Route 3_H:**
- Route 2_H: 基于使用经验(proven-in-use)证据,结合概率分析
- Route 3_H: 通过详细的概率分析证明安全完整性

---

## 2. ICDE国际共因数据交换项目

### 2.1 项目概况

**项目全称:** International Common Cause Failure Data Exchange (ICDE) Project

**组织机构:** OECD核能署(NEA),核设施安全委员会(CSNI)

**参与国家:** 包括美国、法国、德国、瑞典、芬兰、韩国、日本、加拿大、西班牙、瑞士、英国等

**项目阶段:**
- Phase I-VII (至2019年)
- Phase VIII (2019-2023): 报告编号 NEA/CSNI/R(2023)9
- Phase IX (进行中)

### 2.2 数据收集方法论

**数据来源:**
- 各成员国核电厂运行事件报告(LER)
- 定期试验和维修记录
- EPIX(工程经验信息系统)数据
- NUREG/CR-5497中记录的CCF事件

**事件编码规则:**
ICDE采用标准化的事件编码体系:
1. **事件标识**: 唯一事件编号
2. **组件类型**: 泵、阀、柴油发电机等
3. **失效模式**: 启动失败、运行失败等
4. **耦合因子**: 确定共因失效的根本原因
5. **影响组件数**: k-of-m
6. **共享原因因子**: 设计、制造、环境、维护等

**CCF事件分级:**
- **完全CCF(Complete CCF)**: 所有冗余通道同时失效
- **部分CCF(Partial CCF)**: 部分冗余通道失效
- **CCF先兆(Incipient CCF)**: 在失效前被发现

### 2.3 最新发表结果与统计

**ICDE已发布的报告(截至2025年,共11份以上):**
1. 离心泵CCF分析报告
2. 应急柴油发电机CCF分析报告
3. 电动阀(MOV)CCF分析报告
4. 止回阀CCF分析报告
5. 断路器CCF分析报告
6. 水位测量组件CCF分析报告
7. 蓄电池CCF经验教训报告(最新)
8. 系统间CCF分析报告(Phase VII): NEA/CSNI/R(2020)1
9. Phase VIII总结报告: NEA/CSNI/R(2023)9
10. Phase VIII总结报告
11. 多份专题分析报告

**关键统计发现:**
- ICDE数据库包含超过1000个经过分析的CCF事件
- 完全CCF的概率随冗余组件数量增加而显著降低(证明了冗余的有效性)
- 主要耦合因子: 设计缺陷(约30%)、制造/安装错误(约25%)、维护错误(约20%)、环境因素(约15%)

### 2.4 ICDE数据用于CCF参数估计

**Alpha因子估计流程:**
1. 从ICDE数据库提取特定组件类型的所有事件
2. 按失效阶数k分类计数
3. 应用Alpha因子公式计算

**NUREG/CR-5497提供的参数估计:**
该报告使用Alpha因子和MGL两种模型,为以下组件提供了参数估计:
- 离心泵
- 应急柴油发电机
- 电动阀
- 止回阀
- 断路器

**2008年KAERI数据共享:**
韩国原子能研究院从ICDE获得了407个CCF事件,涵盖柴油发电机、离心泵、止回阀、电动阀和断路器。

---

## 3. NRC/IEC共因失效防御评估方法

### 3.1 NUREG/CR-5485方法论

**文件信息:**
- 标题: Guidelines on Modeling Common-Cause Failures in Probabilistic Risk Assessment
- 发布时间: 1998年11月
- 机构: 美国核管会(NRC)

**方法论核心要素:**

1. **CCF识别与筛选**
   - 确定PRA模型中的CCCF(共因组件组)
   - 基于定性筛选准则决定哪些组需要显式建模

2. **CCF建模**
   - 选择参数模型(Beta因子、MGL或Alpha因子)
   - 确定冲击向量(Impact Vector)

3. **参数量化**
   - 使用通用CCF参数或电厂特定数据
   - 考虑不确定性

4. **CCF基本事件集成**
   - 将CCF基本事件集成到故障树模型中
   - 确保正确处理CCF事件间的逻辑关系

**两种基本假设:**
NUREG/CR-5485指出CCF建模中有两种根本不同的假设:
- **假设1(映射方法)**: CCF事件对系统的最终影响取决于失效的组件数量
- **假设2(冲击模型)**: CCF事件的发生可以用冲击模型描述

### 3.2 NUREG/CR-5460因果防御方法

**标题:** Cause-Defense Approach to Understanding and Analysis of Common Cause Failures

该方法论采用"原因-防御"框架:
1. 识别CCF的原因类别
2. 为每个原因类别确定防御措施
3. 评估防御措施的有效性
4. 将防御措施效果映射到CCF参数

### 3.3 IEC 61508 CCF声明路径

#### Route 2_H (使用经验路线)
- 基于组件或子系统的运行经验数据
- 要求足够的使用时间和失效记录
- 结合概率分析进行CCF声明
- 适用于已有运行经验的预开发软件/硬件

#### Route 3_H (概率分析路线)
- 通过详细的概率安全分析
- 要求对CCF进行系统化建模
- 适用于新的安全相关系统
- 需要证明满足目标安全完整性等级

#### IEC 61508-6 Annex D检查表方法
提供37个诊断问题用于评估beta因子:
- 问题涵盖:物理分隔、电气隔离、多样性设计、诊断覆盖率、人员培训、程序等
- 评分后确定beta值范围(典型0.5%-10%)

### 3.4 多样性信用的量化

**概念:**
在PSA中"claiming credit for diversity"意味着承认采用了多样性设计可以降低CCF概率。

**量化方法:**

1. **NUREG/CR-6303多样性评估:**
   - 定义6个多样性属性:设计、设备、功能、人员/生命周期、信号、软件
   - 每个属性有具体标准

2. **NUREG/CR-7007多样性策略(2008):**
   - **策略A**: 不同技术(如模拟+数字)
   - **策略B**: 同一技术内不同方法(如不同制造商)
   - **策略C**: 同一技术内的变体(如不同软件版本)

3. **Beta因子缩减量化:**
   采用多样性措施后,beta因子可按以下方式缩减:
   
   beta_effective = beta_base * (1 - credit_diversity)
   
   其中credit_diversity取决于多样性措施的深度:
   - 策略A(不同技术): credit可达0.8-0.9(beta缩减至原来的10%-20%)
   - 策略B(不同方法): credit约0.5-0.7
   - 策略C(技术变体): credit约0.2-0.4

---

## 4. 数字化系统CCF特殊性

### 4.1 软件CCF量化挑战

**核心问题:**
1. **缺乏运行数据**: 软件CCF事件极少被记录,传统参数估计方法不适用
2. **系统性缺陷**: 软件缺陷是系统性的,不是随机的,传统概率模型可能不适用
3. **同源问题**: 使用相同软件的冗余通道必然共享相同的潜在缺陷
4. **验证困难**: 软件CCF的实际概率难以通过测试验证

**软件CCF发生条件:**
- 存在潜在的软件缺陷(必要条件)
- 缺陷被特定输入条件或运行状态激活
- 激活条件在多个冗余通道中同时或近似同时出现

**量化方法:**
1. **专家判断法**: 基于专家经验估计软件CCF概率
2. **多尺度方法**: 区分硬件和软件CCF分别建模
3. **PRADIC工具**: 用于识别数字化CCF并估计其概率

### 4.2 NUREG/CR-6303多样性评估方法论

**标题:** Method for Performing Diversity and Defense-in-Depth Analyses of Reactor Protection Systems

**核心方法论:**
1. **系统描述**: 详细描述数字化反应堆保护系统的硬件和软件架构
2. **多样性属性评估**: 评估系统在6个多样性维度上的表现:
   - 设计多样性(Design Diversity)
   - 设备多样性(Equipment Diversity)
   - 功能多样性(Functional Diversity)
   - 生命周期多样性(Life-cycle Diversity, NUREG/CR-7007中将"人员"改为"生命周期")
   - 信号多样性(Signal Diversity)
   - 软件多样性(Software Diversity)

3. **脆弱性分析**: 识别可能的软件CCF脆弱性
4. **缓解措施**: 确定需要采取的多样性缓解措施

### 4.3 D3分析方法论

**法规依据:**
- BTP 7-19 Revision 6 (Branch Technical Position 7-19): NRC关于D3评估的监管指导
- NUREG/CR-6303: 基础D3分析方法
- NUREG/CR-7007: 更新的多样性策略

**D3分析流程:**
1. **识别安全功能**: 确定数字化I&C系统执行的安全功能
2. **假设软件CCF**: 假设特定软件的CCF导致安全功能丧失
3. **评估缓解能力**: 确定是否有足够的多样化备将来完成安全功能
4. **风险评估**: 如果缓解能力不足,评估剩余风险
5. **确定需要采取的措施**: 包括增加多样性或提供额外防御

### 4.4 数字化CCF的PRA/PSA建模

**建模方法:**
1. **显式建模**: 在故障树中为每个可能的软件CCF创建基本事件
2. **参数建模**: 使用修正的beta因子模型,考虑软件特有的耦合因子
3. **多beta因子模型**: 对不同类型的CCF(硬件、软件)使用不同的beta值

**INL方法(Idaho国家实验室):**
INL提出了修改的beta因子方法:
- 区分"内部CCF"(硬件/软件缺陷)和"外部CCF"(环境、维护等)
- 为数字化I&C系统开发了专用的CCF参数估计方法

---

## 5. 近期研究进展(2020-2025)

### 5.1 贝叶斯方法用于CCF参数估计

**处理稀疏数据的方法:**
CCF参数估计面临的核心问题是数据稀疏——高阶CCF事件极少发生。

**贝叶斯推断方法:**
1. **先验分布选择**:
   - 使用共轭先验(如Dirichlet先验用于alpha因子)
   - 基于专家判断或通用数据建立信息先验
   
2. **后验分布计算:**
   P(alpha | data) proportional to P(data | alpha) * P(alpha)
   
3. **特定方法:**
   - alpha分解方法(alpha-Decomposition): 分解不确定性来源
   - 贝叶斯几何标度模型(Bayes Geometric Scaling Model)
   - 基于因果推理的贝叶斯推断(处理缺失数据)

**关键参考文献:**
- Kelly-CCF方法(2013): alpha分解用于CCF参数估计
- ResearchGate (2024): 处理数据库不确定性的贝叶斯方法
- INL报告: 开发CCF分析的通用先验分布

### 5.2 贝叶斯网络在CCF建模中的应用

**连续时间贝叶斯网络(CTBN):**
- 用于动态故障树中的CCF建模
- 支持区间不确定性处理
- 可结合蒙特卡洛模拟

**贝叶斯网络 + 蒙特卡洛:**
- 将CCF建模为贝叶斯网络中的条件概率关系
- 使用蒙特卡洛模拟估计系统可靠性

### 5.3 数字孪生应用于CCF监控

**核电厂数字孪生(2021-2025):**
- Springer (2025): 核电厂全生命周期安全管理和动态风险评估的数字孪生框架
- IEEE Access: 核电厂应用的数字孪生技术架构
- MDPI Energies (2021): 带不确定性的核应用数字孪生概念

**与CCF的结合:**
- 数字孪生可用于训练贝叶斯网络进行故障诊断
- 通过高保真仿真生成CCF情景数据
- 实时监控和早期预警CCF先兆

### 5.4 NEA/CSNI数字化I&C系统CCF共识立场(2025)

**文件:** NRC ML25163A258 (2025年发布)

**内容:**
- 建立了数字化I&C系统CCF评估框架
- 来自NEA CSNI正在进行的国际合作研究成果
- 为核安全级数字化系统CCF分析提供最新的国际共识

### 5.5 PRALINE项目(SAFER2028)

**Performing Computations for Digital I&C Related CCFs in PRA (2025)**

- 开发简化CCF建模的工作流程和工具支持
- 面向芬兰核安全研究计划
- 提供实用的数字化I&C系统CCF PRA建模方法

---

## 6. 参考文献

### 核心NRC/NEA文件
1. NUREG/CR-5485 (1998) - Guidelines on Modeling Common-Cause Failures in PRA
2. NUREG/CR-5497 - Common-Cause Failure Parameter Estimations
3. NUREG/CR-6303 - Method for Performing Diversity and Defense-in-Depth Analyses
4. NUREG/CR-7007 (2008) - Diversity Strategies for Nuclear Power Plant I&C Systems
5. NUREG/CR-5460 - Cause-Defense Approach to CCF Analysis
6. BTP 7-19 Rev.6 - Guidance for Evaluation of Diversity and Defense-in-Depth
7. NEA/CSNI/R(2023)9 - ICDE Phase VIII Summary Report
8. NEA/CSNI/R(2020)1 - Collection and Analysis of Intersystem CCF Events
9. NRC ML25163A258 (2025) - NEA Consensus Position on CCF for Digital I&C

### IAEA文件
10. IAEA TECDOC 648 - Procedures for Conducting Common Cause Failure Analysis
11. IAEA NP-T-1.5 - Preventing Common Cause Failures in Digital I&C Systems
12. IAEA NP-T-1.13 - Nuclear Energy Series on Digital I&C

### IEC标准
13. IEC 61508:2010 (所有部分) - Functional Safety of E/E/PE Systems
14. IEC 61508-6 Annex D - Beta Factor Methodology

### 学术论文与报告
15. Atwood, C.L. (1980) - Estimators for the Binomial Failure Rate Common-Cause Model (OSTI)
16. Atwood, C.L. (1986) - The Binomial Failure Rate Common Cause Model, Technometrics, 28(4)
17. Mosleh, A. and Siu, N.O. (1987) - Alpha Factor Model for CCF
18. Humphreys, P. (1987) - UPM Checklist Method
19. Kelly, D.L. et al. (2013) - alpha-Decomposition for CCF Parameter Estimation
20. Reliability Engineering & System Safety (2022) - Quantitative Evaluation of CCFs in Digital I&C

### 在线资源
- OECD NEA ICDE Project: https://www.oecd-nea.org/jcms/pl_25090/
- U.S. NRC ICDE: https://nrcoe.inl.gov/ICDE
- NRC NUREG/CR-5485 PDF: https://nrcoe.inl.gov/publicdocs/CCF/
- NUREG/CR-6303: https://www.nrc.gov/reading-rm/doc-collections/nuregs/contract/cr6303/
- NUREG/CR-7007: https://www.nrc.gov/docs/ML1005/ML100541256.pdf
- BTP 7-19 Rev.6: https://www.nrc.gov/docs/ML1814/ML18145A014.pdf
- ICDE Phase VIII: https://www.oecd-nea.org/jcms/pl_106920/
- NTNU CCF Chapter: https://www.ntnu.edu/documents/624876/1277591044/ccf.pdf
- INL Digital I&C CCF: https://inldigitallibrary.inl.gov/
- PSAM17 ICDE Paper (2024): https://iapsam.org/PSAM17/program/Papers/PSAM17&ASRAM2024-1014.pdf
