# Track2 深度洞察：AWS Cell 是否跨 AZ？—— Cell 边界与故障域的关系

> 撰写日期：2026年6月2日
> 关键词：AWS Cell、Multi-AZ Cell、Single-AZ Cell、爆炸半径、故障域对齐、Physalia、DynamoDB、EBS
> 续写：[track2_cloud_grid_architecture.md](./track2_cloud_grid_architecture.md)、[track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md)

---

## 摘要

**结论先行**：AWS 的 Cell **没有统一的跨 AZ 策略**，是否跨 AZ 由**单个服务的故障语义**决定，分为两类：

- **Multi-AZ Cell（跨 AZ）**：DynamoDB、S3、Aurora Storage、Lambda、Route 53 等**对客户屏蔽 AZ**的服务。Cell 本身吸收 AZ 故障。
- **Single-AZ Cell（不跨 AZ）**：EC2、EBS（含 Physalia）、ELB Zonal 等**向客户暴露 AZ**的服务。Cell 边界 ≤ AZ 边界，跨 AZ 由客户自己做。

这一选择不是工程优劣问题，而是**API 语义**问题——Cell 的边界必须与服务承诺的故障域**完全对齐**，否则爆炸半径控制就失效了。

---

## 一、问题的本质：Cell 边界 = 故障语义的物理化

### 1.1 为什么"是否跨 AZ"是一个被反复追问的设计题

[track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md) 给出了一个简化表格：

| 策略 | 适用场景 |
|------|---------|
| Multi-AZ Cell | 不暴露 AZ 给客户的服务（DynamoDB、S3） |
| Single-AZ Cell | 暴露 AZ 给客户的服务（EC2） |

但这只是结论，没有展开**为什么必须这样设计**。我们用反例来说明：

**反例 1：如果 EC2 用 Multi-AZ Cell 会发生什么？**

假设 EC2 把多个 AZ 当作一个 Cell。客户调用 `RunInstances` 时指定了 `us-east-1a`，但实例真实被调度到 `us-east-1b`（同 Cell 内的另一个 AZ）。客户的 SG（Security Group）规则、子网、NACL、跨 AZ 流量计费全部错位。**Cell 的物理边界与客户认知的 AZ 边界不一致，所有依赖 AZ 语义的下游约定都崩塌。**

**反例 2：如果 DynamoDB 用 Single-AZ Cell 会发生什么？**

DynamoDB 不向客户暴露 AZ，客户只指定 region 和表名。如果一个分区只在一个 AZ 内，那么这个 AZ 故障时该分区的所有数据立即不可用——但客户从没承诺过会做"跨 AZ 部署"，他认为 DynamoDB 表是 region 级可用的。**Cell 边界小于服务承诺的故障域，承诺被违反。**

**核心命题**：Cell 边界必须 ≥ 客户能感知的最小故障域。否则爆炸半径会**穿透 Cell 边界**，传导到客户的可用性 SLA 上。

### 1.2 AWS 三层故障域的层级关系

```
全球           ──── Route 53、IAM、CloudFront、Global Accelerator
                      ↑ cell 跨 region
Region         ──── DynamoDB、S3、Lambda、Aurora、API Gateway
                      ↑ cell 跨 AZ（在 region 内）
Availability   ──── EC2、EBS、Instance Store、ELB Zonal、Local Zone
Zone                  ↑ cell 在 AZ 内（每 AZ 一个或多个 cell）
                      ↑ shuffle sharding 在 cell 内
Rack / Power   ──── Physalia replica placement、host placement groups
Domain
                      ↑ cell 内拓扑感知放置
Host / Server  ──── 单实例/单进程
```

**关键规则**：Cell 是这条故障域层级中**某一层的局部化包装**。服务把 cell 锚定在哪一层，取决于该服务对外承诺哪一层的可用性。

---

## 二、Multi-AZ Cell：服务自身吸收 AZ 故障

### 2.1 DynamoDB —— 跨 3 AZ 的 Paxos 分区

DynamoDB 是 Multi-AZ Cell 最教科书式的实现：

```
DynamoDB Table (Region 级)
├── Partition-1 (Cell-A 内的一个分区)
│   ├── Replica-1 in AZ-a  ┐
│   ├── Replica-2 in AZ-b  ├── 3 副本 Paxos，多数派写入
│   └── Replica-3 in AZ-c  ┘
├── Partition-2 (Cell-A 内的另一个分区)
│   └── ... (同样 3 AZ)
├── Partition-N (可能属于 Cell-B)
│   └── ...
```

**关键点**：

1. **每个分区的 3 个副本必须分布在不同 AZ**——这是 DynamoDB 的核心承诺。任意单 AZ 故障，多数派仍可写。
2. **Cell 包含多个分区**，分区是 cell 内部的负载单元，cell 是分区调度/故障隔离的边界。Cell 整体跨多 AZ。
3. **Request Router 也跨 AZ**：Router 自身就是无状态的多 AZ 服务，2015 年 us-east-1 大故障的根因之一就是元数据请求量暴涨导致 Router 集群过载，2018 年后 AWS 把 Router 与元数据全面 cell 化。
4. **AZ 故障对客户透明**：客户读写 DynamoDB 表时不需要知道哪个 AZ 出问题，Paxos 自动多数派切换。

**与华为云对比**：GaussDB 的"集中式模式（一主两备跨 AZ）"在结构上和 DynamoDB 的分区副本非常相似——3 AZ、同步复制、Paxos 共识、RPO=0。区别是 GaussDB 还做了**Super AZ**（[track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md) §1.2.1）这一物理层抽象，将多个物理 DC 融合成一个逻辑 AZ，使得 RTT<0.5ms 的"伪同 AZ"成为可能；AWS 没有这一层，跨 AZ 同步复制直接承受 AZ 间真实物理延迟（约 1-2ms）。

### 2.2 S3 —— 跨 3+ AZ 的 11 个 9 持久性

S3 Standard 存储类对每个对象提供 **99.999999999%（11 个 9）持久性**和 **99.99% 可用性**，靠的是对象级的跨 AZ 复制：

```
S3 Object (PUT 请求成功后)
├── Replica in AZ-a (data + redundancy)
├── Replica in AZ-b (data + redundancy)
└── Replica in AZ-c (data + redundancy)

         实际是 erasure coding + 多 AZ 分布
         读取时只要任意多数 AZ 可用即可
```

**Cell 的边界**：S3 内部的存储 cell（按 bucket 哈希或前缀分片）每个 cell 跨多个 AZ。Cell Router（S3 frontend）也是 region 级的跨 AZ 部署。

**特例 S3 One Zone-IA**：这是 S3 故意提供的 **Single-AZ 变体**，价格更低但单 AZ 故障数据就丢了。这恰好说明：**Multi-AZ vs Single-AZ 是 API 语义选择**——同一个 S3 服务的不同存储类，选择了不同的故障域承诺，对应不同的 cell 拓扑。

### 2.3 Aurora —— 6 副本跨 3 AZ 的存储层

Aurora 的存储层是 cell 化的极致样本：

```
Aurora Volume (单个数据库实例)
├── AZ-a: 2 个存储节点 (Storage Node 1, 2)
├── AZ-b: 2 个存储节点 (Storage Node 3, 4)
└── AZ-c: 2 个存储节点 (Storage Node 5, 6)

写入: 6 副本中 4 副本 ACK 即返回 (Quorum-based)
读取: 6 副本中 3 副本一致即返回
容忍: 单 AZ + 一个额外副本同时故障，仍可读写
```

**Cell 的物理化**：每个 Aurora 卷的 6 个存储段就构成一个紧密耦合的"micro-cell"，整体跨 3 AZ。Aurora 的故事和 Physalia 形成了有趣对比——同样是 AWS 的存储服务，**Aurora 跨 AZ，Physalia 不跨 AZ**，原因在 §3.2 详述。

### 2.4 Lambda —— region 级 cell，跨多 AZ 调度

Lambda 用户调用 `Invoke` API 时只指定函数名（region 级 ARN），不指定 AZ。Lambda 的执行环境（Firecracker microVM）自动调度到 region 内的某个 AZ 的可用 Worker。

```
Lambda Service in Region
├── Cell-1 (跨 AZ-a, AZ-b, AZ-c)
│   ├── Frontend Invoke API (跨 AZ)
│   ├── Worker Fleet in AZ-a
│   ├── Worker Fleet in AZ-b
│   └── Worker Fleet in AZ-c
├── Cell-2 (同样跨 3 AZ)
└── ...
```

**2023 年 Lambda 事件的教训**：[track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md) §2.4 提到的"The one that worked"——某次故障被限制在单个 Lambda Cell 内，其他 cells 继续工作。这说明 cell 之间的隔离（cell-1 vs cell-2）发挥了作用，但每个 cell 内部仍然是跨 AZ 部署的。这是**cell 隔离 ≠ AZ 隔离**的一个直接证据。

### 2.5 Route 53 —— 跨 region 的全球 cell

Route 53 是少数 cells 跨 region 的服务，因为 DNS 本质是全球服务。Route 53 把数据面（实际响应 DNS 查询的 nameserver）部署在全球 200+ 站点，每个 nameserver pool 是一个 cell。即便整个 region 不可达，DNS 查询仍能由其他站点的 cell 响应。

---

## 三、Single-AZ Cell：cell 边界 ≤ AZ 边界

### 3.1 EC2 —— 每 AZ 独立 cell，符合实例的 AZ 绑定语义

EC2 实例创建时必须指定 AZ（直接或间接通过子网指定），实例的生命周期内**永远绑定在那个 AZ**。一旦 AZ 故障，那批实例不可用，AWS 不会自动迁移到另一个 AZ（因为 EBS 卷、本地 IP、安全组规则都是 AZ 绑定的）。

所以 EC2 的 cell 必须 ≤ AZ：

```
EC2 in Region us-east-1
├── us-east-1a
│   ├── Cell-1a-1 (placement group, capacity pool)
│   ├── Cell-1a-2
│   └── ...
├── us-east-1b
│   ├── Cell-1b-1
│   └── ...
└── us-east-1c (同样)
```

**为什么不能跨 AZ**：如果 cell 跨 AZ，那么 cell 内部的实例调度就会跨 AZ；客户期望"我把实例放在 us-east-1a"这个承诺就会被破坏。AZ 故障时也无法精确告诉客户"是哪个 AZ 出问题"。

**跨 AZ 由客户自己做**：客户用 Auto Scaling Group + 跨 AZ 子网组合，自己实现跨 AZ 容灾。AWS 不替客户做这件事。

### 3.2 Physalia —— 7 副本 Paxos，**但不跨 AZ**！

这是本洞察最有反直觉、最值得深挖的一点。

[track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md) §2.3 简略提到 Physalia 的"拓扑感知放置"：
> 节点根据数据中心拓扑（网络拓扑、电力域）智能放置：足够近以减少网络分区风险，不在同一机架/电源。

这句话没说透的关键事实：**Physalia 的 7 个副本是放在同一个 AZ 内的不同机架/电源域，而不是跨 AZ。**

**为什么 Physalia 不跨 AZ？三个根因**：

**根因一：Physalia 服务的对象是 EBS 卷，而 EBS 卷本身是 AZ 绑定的**

Physalia 是 EBS 控制面的"配置主数据库"——它存储每个 EBS 卷的元数据（哪些 storage 节点持有哪些数据块、master/slave 关系等）。一个 EBS 卷只能挂载到同 AZ 的 EC2 实例。**卷本身就不跨 AZ，给它做跨 AZ 的元数据存储毫无意义**，反而增加跨 AZ 网络延迟（1-2ms vs 同 AZ 内的 <100us）。

**根因二：AZ 故障时 EBS 卷本来就不可用，Physalia 跨 AZ 也救不了**

假设 AZ-a 故障：
- AZ-a 内所有 EC2 实例不可达
- AZ-a 内所有 EBS 卷不可挂载（因为依附的 EC2 不在了）
- 即便 Physalia 跨 AZ 把元数据保住了，**也没有可用的 storage 节点和 EC2 实例配对**

所以 Physalia 跨 AZ 是无效冗余。正确的策略是：**让 Physalia 与它服务的 EBS 卷共生死**——同 AZ 故障同时不可用、同 AZ 恢复同时可用。这就是论文里 "co-location" 的真实含义。

**根因三：CAP 视角下的关键洞察**

Physalia 论文标题就是 *"Millions of Tiny Databases"*——核心思想是**不去解决全局一致性问题，而是让每个 EBS 卷只看到自己那一份小一致性**。每个 cell 只服务一个 EBS 卷的元数据，cell 内部 7 副本 Paxos，cell 之间完全独立。

这意味着：
- Cell 不需要跨 AZ，因为它服务的卷就在同 AZ
- Cell 需要拓扑感知放置，因为机架级/电源级故障比 AZ 级故障频率高得多
- 通过让每个 cell **更紧凑**（同 AZ 内的 7 个紧邻节点），共识协议的延迟反而比传统跨 AZ 部署低

**Physalia 真实拓扑**：

```
EBS in us-east-1a (Single AZ)
├── Volume vol-0001 (Cell-1)
│   ├── Replica-1 in Rack-A, Power-Domain-1
│   ├── Replica-2 in Rack-B, Power-Domain-1
│   ├── Replica-3 in Rack-C, Power-Domain-2
│   ├── Replica-4 in Rack-D, Power-Domain-2
│   ├── Replica-5 in Rack-E, Power-Domain-3
│   ├── Replica-6 in Rack-F, Power-Domain-3
│   └── Replica-7 in Rack-G, Power-Domain-3
│   (7 副本分散在多机架/电源域，但都在 us-east-1a 内)
├── Volume vol-0002 (Cell-2, 独立的 7 副本组合)
│   └── ...
└── Millions of cells, each pinned to a single AZ
```

**对比 DynamoDB**：DynamoDB 的 3 副本跨 3 AZ，因为 DynamoDB 服务的对象（表）是 region 级的；Physalia 的 7 副本同 AZ，因为它服务的对象（EBS 卷）是 AZ 级的。**Cell 拓扑跟随 API 语义**，这是 AWS 最深刻的设计哲学之一。

### 3.3 ELB Zonal、Local Zone、Outposts —— 同样的 AZ 锚定逻辑

- **ELB Zonal Load Balancer**：客户指定 AZ，cell 只在该 AZ 内
- **Local Zone**（在大城市的小型扩展点）：本质就是一个独立的 AZ，cell 不跨出该 Local Zone
- **AWS Outposts**：客户机房内的 AWS 硬件，逻辑上等同于一个 AZ；cell 不跨 Outpost

这些都印证了同一条规则：**当 API 承诺在某层故障域，cell 边界就锚定到那层。**

---

## 四、决策框架：什么时候用 Multi-AZ Cell vs Single-AZ Cell？

四个判断维度，按优先级排序：

### 维度 1（决定性）：API 是否暴露 AZ 给客户？

| 暴露 | 不暴露 |
|------|--------|
| Single-AZ Cell | Multi-AZ Cell |
| 例：EC2、EBS、Local Zone | 例：DynamoDB、S3、Lambda |

这是最关键的判断。如果 API 暴露 AZ，那么 cell 必须 ≤ AZ；否则客户的故障预期会被破坏。

### 维度 2：服务承诺的故障域

```
若服务承诺 "region 级可用"        → Multi-AZ Cell (cell 跨 AZ)
若服务承诺 "AZ 级可用"             → Single-AZ Cell (cell 在 AZ 内)
若服务承诺 "全球级可用"            → Cross-Region Cell (cell 跨 region，如 Route 53)
```

### 维度 3：服务对象的"绑定层级"

服务存储的数据/状态本身依附于哪一层故障域？

```
EBS 卷依附于 AZ                    → Physalia (Single-AZ Cell)
DynamoDB 表依附于 region           → DynamoDB partition (Multi-AZ Cell)
DNS 记录依附于全球                  → Route 53 (Multi-Region Cell)
```

让 cell 与对象**共生死**，避免无效冗余。

### 维度 4：延迟敏感度

跨 AZ 同步复制大约引入 1-2ms 延迟，跨 region 复制引入 50-200ms。如果服务延迟预算很紧（如 Physalia 的元数据查询、DynamoDB 单分区写入），跨故障域复制的代价就显得很大；此时倾向于**故障域内**做共识。

---

## 五、Cell 与 Region 边界：为什么 Cells 几乎不跨 Region？

[track2_cloud_grid_architecture.md](./track2_cloud_grid_architecture.md) §3.2 已经说明 AWS 的跨 Region 多活是**应用层**的事——Aurora Global Database、DynamoDB Global Tables、S3 Cross-Region Replication 都是跨 region 复制服务，但**底层的 cell 仍然在单个 region 内**。

**为什么 cells 通常不跨 region**：

1. **Region 是合规域**：数据主权、GDPR、等保等要求数据不出 region。Cell 跨 region 会违反合规。
2. **Region 是计费/服务可见性域**：客户看到的 region 列表、计费汇总、IAM 策略都按 region 组织。Cell 跨 region 会破坏这些抽象。
3. **Region 间延迟太大**：50-200ms 的 RTT 让跨 region 强一致性共识变得低效，更适合异步复制。
4. **Region 是 AWS 自身的运维边界**：每个 region 有独立的服务团队、独立的部署管道、独立的故障响应。Cell 跨 region 会增加运维耦合。

**例外**：Route 53、IAM、CloudFront、Global Accelerator、S3 Multi-Region Access Points 等"全球服务"的 cells 才会跨 region。这些服务故意把全球作为故障域，因为 DNS 解析、身份认证、CDN 这些场景需要"任何 region 故障都不影响"。

**与华为云对比**：华为云 KooVerse 的 Regionless 架构（[track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md) §1.2.6）和 UniformLive 是少数尝试**让常规 cell 跨 region** 的实践——这是华为云相对 AWS 的一个**架构差异化点**，也是为什么华为云在电信级（5GC 跨省灾备）场景更适配的根本原因。

---

## 六、Cell 化的实际采纳率与有效性：可佐证的官方数据

### 6.1 为什么 AWS 官方从不公布"Cell 化覆盖率"

中文技术圈流传过若干具体数字（如"37 个服务采用 Cell 化"、"在 12% 重大事件中发挥关键作用"），但**这些数字在 AWS 官方公开材料中找不到一手出处**。三个原因：

1. **Cell 化是渐进改造，没有清晰的"已 Cell 化/未 Cell 化"二分法**。同一服务的控制面 vs 数据面、不同子系统、不同 region 的 cell 化程度可能不同，统一计数失去意义。

2. **Cell 化成功拦截的故障不会被记录为"重大事件"**——故障被 cell 边界拦住、没传导到客户感知层面，按 AWS 的事件分级标准不会进入"重大事件"分子。"X% 重大事件中 cell 发挥作用"这个指标**在定义上自相矛盾**：拦截成功的反而消失在分子里。

3. **AWS 的传播策略偏好"讲哲学、讲案例"**。Peter Vosshall (Distinguished Engineer)、Werner Vogels (CTO)、Colm MacCarthaigh (VP) 在 re:Invent 与 Builder's Library 讲 cell 化都是定性论述加单点案例，从未给覆盖率统计。

### 6.2 可佐证的官方数据点

替代"覆盖率"叙事，下表列出从 AWS 官方公开渠道（白皮书、Builder's Library、NSDI/USENIX 学术论文、re:Invent 演讲、SLA 文档）可以佐证的具体数据：

| 数据点 | 来源 | 含义 |
|--------|------|------|
| Physalia 管理**数百万个 micro-cell** | Brooker et al., NSDI 2020 | 每个 EBS 卷一个 cell，AWS 最大规模 cell 化案例 |
| Physalia 单 cell 由 **7 个 Paxos 副本**构成 | Brooker et al., NSDI 2020 | 单 cell 内副本拓扑 |
| DynamoDB 单表可水平扩展到**数千个分区** | Elhemali et al., USENIX ATC 2022 | 分区是 cell 内隔离单元 |
| **2015 年 DynamoDB us-east-1 故障**触发 cell 化大规模改造 | AWS 公开 post-mortem + 后续 re:Invent 复盘 | 历史事件驱动的架构升级 |
| **2023 年 Lambda 事件**："cell 架构成功将故障限制在单 cell 内" | AWS 事后分析（多次 re:Invent 演讲复述） | 唯一被 AWS 官方明确表述为"cell 化救场"的标志性事件 |
| Shuffle Sharding 隔离强度数学下界 **C(N,S) = N!/(S!·(N-S)!)** | AWS Builder's Library | 可数学证明的隔离强度 |
| S3 跨 AZ 复制实现 **99.999999999%（11 个 9）数据耐久性** | AWS S3 文档 | 跨 AZ cell 复制的设计耐久性 |
| Aurora 卷 **6 副本跨 3 AZ**，写入仲裁 4 副本、读取仲裁 3 副本 | Verbitski et al., SIGMOD 2017 | 单卷 cell 化拓扑 |
| AWS Well-Architected 将 Cell 化列为可靠性支柱**正式实践模式** | AWS WAF 可靠性支柱白皮书 | 已上升为 AWS 标准化实践 |

### 6.3 可引用的定性表述

如果研究报告需要表述"Cell 化在 AWS 的覆盖范围与效果"，建议引用以下定性表述（皆可在 AWS 公开材料中找到出处）：

> AWS 未公开 Cell 化的精确服务覆盖率，但公开材料可见：核心数据服务（DynamoDB、S3、Aurora、EBS）、核心计算服务（Lambda、EC2）、核心网络服务（Route 53、ELB、API Gateway）均已 Cell 化；AWS 在 2024 re:Invent ARC335 演讲中明确表示 cell 化已是新服务的默认架构选择。最大规模的 cell 化实例为 EBS Physalia，单系统管理数百万个 micro-cell（Brooker et al., NSDI 2020）。

> 关于"Cell 化阻止了多少重大事件"，AWS 官方未公开统计数据，且该指标在定义上自相矛盾——Cell 化成功拦截的故障不会升级为重大事件。最具说服力的标志性案例为 2023 年 Lambda 事件，被 AWS 公开表述为"the one that worked"（Cell 架构成功将故障限制在单 cell 内，其他 cell 持续正常工作）。

**警示**：避免引用未经证实的"37 个服务采用 Cell 化"、"12% 重大事件中 Cell 化发挥关键作用"等具体数字——这些数字在 AWS 官方材料中找不到一手出处，可能来自第三方分析报告、技术博客或会议演讲的二手转述，引用前必须找到原始出处。

---

## 七、对 5G 核心网 Grid 化的具体启示

### 7.1 网元 Cell 的故障域锚定

借用 §4 的决策框架反推 5GC 各 NF：

| 网元 | API 是否暴露 AZ/位置 | 服务对象绑定层级 | 推荐 Cell 锚定 |
|------|---------------------|----------------|---------------|
| **UPF** | 部分暴露（数据面有地理亲和） | PDU Session 通常区域绑定 | **Single-AZ 或区域级 Cell** |
| **AMF** | 不暴露（GUAMI 是逻辑标识） | UE 上下文可全国漫游 | **Multi-AZ Cell（区域级）** |
| **SMF** | 不暴露 | Session 与 UPF 配对 | **Multi-AZ Cell** |
| **UDM/AUSF/NRF** | 不暴露 | 全国级订阅数据 | **Multi-AZ Cell（甚至跨 Region）** |
| **PCF** | 不暴露 | 区域策略 | **Multi-AZ Cell（区域级）** |
| **Edge UPF (MEC)** | 暴露（用户侧明确感知位置） | 业务延迟 <5ms | **Single-AZ / 边缘 Cell** |

**关键洞察**：UPF 不应该简单地用一种 cell 策略，应该**区分中心 UPF 与边缘 UPF**：
- **中心 UPF**（数据中心内）：用 Multi-AZ Cell，吸收 AZ 故障
- **边缘 UPF**（基站侧/MEC）：必然是 Single-AZ Cell（边缘节点本身就是一个独立故障域），跨节点容灾由 SMF 协调

### 7.2 UDM/AUSF 是否需要"Physalia 模式"？

3GPP 标准的 UDSF（Unstructured Data Storage Function）有点像 Physalia 的对手——它要存大量的 UE 状态。是否可以借鉴 Physalia 的"数百万个微型数据库"思路？

**适配场景**：
- 每个 UE 一个微型 cell：UE 上下文、安全密钥、注册状态独立存储
- 微型 cell 的 7 副本同区域部署（不跨省），多机房/多机架放置
- 跨省漫游时通过另一种机制（如 SBI 接口的 NF 间调用）解决

**收益**：
- 单个 cell 故障只影响一个 UE，爆炸半径达到极致
- 内部强一致性靠 Paxos/Raft，延迟可控（区域内 <100us）
- 与 5GC 的"按用户 ID 分区"天然契合（IMSI/SUPI 作为分区键）

**挑战**：
- "数百万 cell" 的元数据管理开销（参考 Physalia 的两层路由设计：逻辑桶→物理 cell）
- 跨网元的事务一致性（如 AMF+SMF 联合更新）需要额外协调

### 7.3 静态稳定性的本地化适配

AWS 的"数据面在控制面不可用时继续运行"原则在 5GC 中尤其重要：

| 5GC 场景 | 静态稳定性应用 |
|---------|---------------|
| SMF 故障 | UPF 继续转发已建立 PDU Session 的数据包，只是新会话建立失败 |
| AMF 故障 | (g)NB 通过 SCTP Multi-homing 切换备用 AMF，但**已注册的 UE 维持连接** |
| UDM 故障 | AMF 使用本地缓存的订阅数据继续服务**已注册 UE**，但新用户首次注册失败 |
| NRF 故障 | NF 间通过缓存的服务发现结果继续通信，新 NF 实例无法注册 |

这一原则将 5GC 的可用性从"端到端串联"转为"分层隔离"——上层故障不击穿下层，与 AWS Cell 化的核心精神高度一致。

---

## 八、核心结论的提炼

把这一深度洞察压缩为五条可外推的设计原则：

1. **Cell 不是"跨不跨 AZ"的二选一，而是"边界与 API 语义对齐"的设计选择**——服务承诺什么故障域，cell 就锚定在那一层。

2. **Multi-AZ Cell 适用于服务屏蔽 AZ 的场景**（DynamoDB、S3、Lambda、Aurora），由服务自身吸收 AZ 故障，对客户透明。

3. **Single-AZ Cell 适用于服务暴露 AZ 的场景**（EC2、EBS、Physalia），跨 AZ 容灾留给客户/上层服务。

4. **Physalia 的反直觉设计揭示了一条深层规律**：**Cell 与它服务的对象应当共生死**——EBS 卷不跨 AZ，Physalia cell 就不跨 AZ；DynamoDB 表跨 region，DynamoDB cell 就跨 AZ。无效冗余既无收益还会增加延迟。

5. **跨 Region 几乎不是 Cell 的事**——AWS 用应用层复制服务（Global Tables、Aurora Global、S3 CRR）解决跨 Region，而非把 cell 拉伸跨 Region；华为云 UniformLive 与 KooVerse Regionless 是少数尝试在 Cell 层做跨 Region 的实践，这也是其面向电信级场景的差异化所在。

---

## 参考资料

补充于 [track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md) 的参考文献之外：

- AWS Well-Architected Framework, "Reducing the Scope of Impact with Cell-Based Architecture"（讨论 Multi-AZ vs Single-AZ Cell 选择）
- Marc Brooker, Tao Chen, Fan Ping, "Millions of Tiny Databases," NSDI 2020（Physalia 论文，重点是 §4 colocation 部分）
- AWS re:Invent 2019 ARC411-R "Reducing Blast Radius with Cell-Based Architectures"（Peter Vosshall 关于 cell 拓扑的演讲）
- AWS re:Invent 2024 ARC335 "Learn to Create a Robust, Easy-to-Scale Architecture with Cells"（cell 化已成新服务默认架构的明确表述）
- AWS Builders Library, "Static Stability Using Availability Zones"（静态稳定性原则）
- AWS Builders Library, "Workload Isolation Using Shuffle-Sharding"（Shuffle Sharding 隔离强度数学下界）
- Mostafa Elhemali et al., "Amazon DynamoDB: A Scalable, Predictably Performant, and Fully Managed NoSQL Database Service," USENIX ATC 2022（DynamoDB 分区机制）
- Alexandre Verbitski et al., "Amazon Aurora: Design Considerations for High Throughput Cloud-Native Relational Databases," SIGMOD 2017（Aurora 6 副本跨 3 AZ 仲裁机制）
- 3GPP TS 23.501 v19.0.0（UDSF、NF Set、AMF Set 定义）

**关于本洞察 §六 中提到的未经证实数字**：经查询，"37 个服务采用 Cell 化"、"在 12% 重大事件中 Cell 化发挥关键作用"等具体数字在 AWS 官方公开材料（白皮书、Builder's Library、re:Invent 演讲、SLA 文档、学术论文）中**均未找到一手出处**。这类数字可能来自第三方分析报告、技术博客或会议演讲的二手转述，引用前应核实原始出处。

---

*本洞察是对 [track2_cloud_grid_architecture.md](./track2_cloud_grid_architecture.md) 第 3 章与 [track2_deep_dive_grid_vs_cell.md](./track2_deep_dive_grid_vs_cell.md) 第二章的延伸分析，聚焦回答"AWS Cell 是否跨 AZ"这一具体设计问题，并提炼可外推到 5GC 设计的原则。撰写日期：2026年6月2日，§六（采纳率与有效性）于 2026年6月3日补充。*
