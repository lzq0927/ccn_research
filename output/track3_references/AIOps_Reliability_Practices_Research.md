# 业界AIOps/可靠性实践调研报告

> 调研日期：2026/05/26（初版），2026/05/28 更新Agent+Skill方法专题

---

## 搜索任务1：Amazon/AWS的AIOps和可靠性实践

### 1.1 Amazon DevOps Guru

| 项目 | 详情 |
|------|------|
| **公司/团队** | Amazon Web Services (AWS) |
| **技术/工具名称** | Amazon DevOps Guru |
| **核心方法** | 基于ML的云运维服务，利用Amazon多年运营经验训练的ML模型。自动分析应用指标、日志和事件，检测异常行为；提供insight（洞察）和可操作的修复建议；使用ML模型限制告警噪声；支持Serverless应用和RDS数据库的场景化分析 |
| **效果数据** | 客户案例：Thomson Reuters减少运营停机时间；HCL Technologies节省问题解决时间；605公司管理数万资源告警 |
| **链接** | https://aws.amazon.com/devops-guru/ |
| **发表年份** | 2020年发布（re:Invent 2020） |

### 1.2 Amazon Automated Reasoning（自动化推理）

| 项目 | 详情 |
|------|------|
| **公司/团队** | AWS Automated Reasoning团队 |
| **技术/工具名称** | Automated Reasoning at Amazon |
| **核心方法** | 将形式化验证（formal verification）和自动化推理应用于云基础设施可靠性。用于验证AWS基础设施配置的正确性（如IAM策略、网络ACL、S3 bucket策略等）；使用SMT求解器（Satisfiability Modulo Theories）进行数学证明；Zelkova工具对AWS IAM策略进行自动化推理分析；在AWS内部每天执行数十亿次推理检查 |
| **效果数据** | 每天处理数十亿次推理检查；发现大量潜在安全配置问题 |
| **链接** | https://www.amazon.science/tag/automated-reasoning |
| **发表年份** | 2017年至今（持续更新） |

### 1.3 AWS CloudWatch Anomaly Detection

| 项目 | 详情 |
|------|------|
| **公司/团队** | AWS |
| **技术/工具名称** | Amazon CloudWatch Anomaly Detection |
| **核心方法** | 利用ML算法为CloudWatch指标自动创建基线模型；基于历史数据预测正常行为范围，生成预期值带（expected band）；实时检测偏离预期的异常行为；可自动适应趋势变化和季节性模式 |
| **效果数据** | 与静态阈值告警相比，显著减少误报 |
| **链接** | https://aws.amazon.com/cloudwatch/ |
| **发表年份** | 2018年 |

### 1.4 Amazon CodeGuru

| 项目 | 详情 |
|------|------|
| **公司/团队** | AWS |
| **技术/工具名称** | Amazon CodeGuru (Profiler + Reviewer) |
| **核心方法** | CodeGuru Profiler：使用ML分析应用运行时性能，识别最昂贵的代码行；CodeGuru Reviewer：利用ML自动进行代码审查，提供智能建议；帮助发现性能瓶颈、资源浪费和代码质量问题 |
| **链接** | https://aws.amazon.com/codeguru/ |
| **发表年份** | 2019年 |

---

## 搜索任务2：Microsoft的AIOps实践

### 2.1 微软研究院AIOps项目（总览）

| 项目 | 详情 |
|------|------|
| **公司/团队** | Microsoft Research Asia (MSRA) - Cloud Intelligence/AIOps团队 |
| **核心人物** | Dongmei Zhang（张冬梅，Distinguished Scientist, Deputy Managing Director）、Qingwei Lin（林庆维，Partner Research Manager）、Si Qin（Principal Research Manager）、Yu Kang（康昱，Principal Research Manager）|
| **项目框架** | AIOps三大支柱：(1) AI for Systems -- 让智能成为内置能力，实现高质量、高效率、自控制、自适配；(2) AI for Customers -- 利用AI/ML创造卓越用户体验；(3) AI for DevOps -- 将AI/ML注入整个软件开发生命周期 |
| **链接** | https://www.microsoft.com/en-us/research/project/aiops/ |
| **发表年份** | 2018年至今（持续） |

### 2.2 核心论文与系统一览表

| 序号 | 论文/系统 | 会议/期刊 | 年份 | 核心方法 |
|------|-----------|-----------|------|----------|
| 1 | **HALO**: Hierarchy-aware Fault Localization for Cloud Systems | KDD 2021 | 2021 | 针对云系统的大规模层次化故障定位，考虑云系统的层次结构（服务、集群、实例等），结合监控指标和拓扑信息进行故障根因定位 |
| 2 | **Fighting the Fog of War**: Automated Incident Detection for Cloud Systems | USENIX ATC 2021 | 2021 | 自动检测云系统中的运维事件（incidents），结合多源信号进行实时事件检测 |
| 3 | **NENYA**: Cascade Reinforcement Learning for Cost-Aware Failure Mitigation at Microsoft 365 | KDD 2022 | 2022 | 使用级联强化学习（Cascade RL），成本感知的故障缓解策略，在Microsoft 365生产环境中部署 |
| 4 | **RESIN**: A Holistic Service for Dealing with Memory Leaks in Production Cloud Infrastructure | OSDI 2022 | 2022 | 全方位处理云基础设施中内存泄漏的整体服务，自动检测、诊断和缓解内存泄漏 |
| 5 | **Predictive and Adaptive Failure Mitigation** to Avert Production Cloud VM Interruptions | OSDI 2020 | 2020 | 预测性和自适应的故障缓解，避免生产云VM中断，在Azure生产环境中部署 |
| 6 | **DeepTraLog**: Trace-Log Combined Microservice Anomaly Detection through Graph-based Deep Learning | ICSE 2022 | 2022 | 结合分布式追踪（Trace）和日志（Log）数据，基于图深度学习的微服务异常检测 |
| 7 | **Xpert**: Empowering Incident Management with Query Recommendations via Large Language Models | ICSE 2024 | 2024 | 利用LLM为事件管理提供查询推荐，帮助运维人员更快速定位和理解事件 |
| 8 | **UniLog**: Automatic Logging via LLM and In-Context Learning | ICSE 2024 | 2024 | 通过LLM和上下文学习实现自动日志记录 |
| 9 | **SPINE**: A Scalable Log Parser with Feedback Guidance | FSE 2022 | 2022 | 可扩展的日志解析器（**SIGSOFT Distinguished Paper Award**） |
| 10 | **UniParser**: A Unified Log Parser for Heterogeneous Log Data | TheWebConf 2022 | 2022 | 统一的异构日志解析器 |
| 11 | **Assess and Summarize**: Improve Outage Understanding with Large Language Models | ESEC/FSE 2023 | 2023 | 用LLM改进故障理解 |
| 12 | **Incident-aware Duplicate Ticket Aggregation** for Cloud Systems | ICSE 2023 | 2023 | 事件感知的重复工单聚合 |
| 13 | **CONAN**: Diagnosing Batch Failures for Cloud Systems | ICSE 2023 SEIP | 2023 | 批量故障诊断 |
| 14 | **Aegis**: Attribution of Control Plane Change Impact across Layers and Components | ICSE 2023 SEIP | 2023 | 控制平面变更影响的跨层跨组件归因 |
| 15 | **An Intelligent Framework for Timely, Accurate, and Comprehensive Cloud Incident Detection** | ACM SIGOPS OSR 2022 | 2022 | 云事件智能检测框架 |
| 16 | **TraceArk**: Towards Actionable Performance Anomaly Alerting | ICSE 2023 SEIP | 2023 | 面向可操作的性能异常告警 |
| 17 | **How Long Will it Take to Mitigate this Incident** for Online Service Systems? | ISSRE 2021 | 2021 | 事件缓解时间预测模型（**Best Research Paper**） |
| 18 | **Fast Outage Analysis** of Large-scale Production Clouds with Service Correlation Mining | ICSE 2021 | 2021 | 服务关联挖掘的大规模生产云快速故障分析 |
| 19 | **NTAM**: Neighborhood-Temporal Attention Model for Disk Failure Prediction | WWW 2021 | 2021 | 磁盘故障预测的邻域-时间注意力模型 |
| 20 | **NetPanel**: Traffic Measurement of Exchange Online Service | NSDI 2023 | 2023 | Exchange在线服务的流量测量 |
| 21 | **STEAM**: Observability-Preserving Trace Sampling | ESEC/FSE 2023 | 2023 | 保持可观测性的追踪采样 |
| 22 | **An Empirical Study of Log Analysis at Microsoft** | FSE 2022 | 2022 | 微软日志分析实证研究 |
| 23 | **Multi-task Hierarchical Classification for Disk Failure Prediction** | KDD 2022 | 2022 | 磁盘故障预测的多任务层次分类 |
| 24 | **Predictive Job Scheduling under Uncertain Constraints** in Cloud Computing | IJCAI 2021 | 2021 | 不确定约束下的预测性作业调度 |
| 25 | **Correlation-Aware Heuristic Search** for Intelligent VM Provisioning | AAAI 2021 | 2021 | 关联感知的智能VM供应 |

---

## 搜索任务3：字节跳动的AIOps实践

### 3.1 字节跳动智能运维体系

| 项目 | 详情 |
|------|------|
| **公司/团队** | 字节跳动（ByteDance）基础架构部 |
| **技术/工具名称** | 字节跳动AIOps平台 |
| **核心方法** | 微服务可观测性：基于分布式追踪的调用链分析；智能告警：基于ML的异常检测和告警收敛；根因分析：基于知识图谱和因果推断的故障根因定位；容量规划：基于预测模型的资源容量管理；日志智能分析：基于NLP的日志模式提取和异常日志检测；服务依赖分析：微服务调用链路自动发现和拓扑构建 |
| **效果数据** | 管理数万个微服务；日均处理万亿级调用链数据 |
| **发表年份** | 2019年至今 |

### 3.2 字节跳动微服务可靠性

| 项目 | 详情 |
|------|------|
| **公司/团队** | 字节跳动基础架构部 |
| **核心方法** | Service Mesh架构实现流量治理和服务可靠性保障；基于自适应限流的过载保护；全链路灰度发布和流量回放测试；混沌工程实践（Chaos Mesh等工具）；智能熔断降级策略 |
| **发表年份** | 2019年至今 |

### 3.3 字节跳动日志分析实践

| 项目 | 详情 |
|------|------|
| **公司/团队** | 字节跳动 |
| **核心方法** | 大规模日志采集和实时处理；基于深度学习的日志异常检测；日志模板提取和日志模式挖掘；结合指标和日志的多模态异常检测 |
| **发表年份** | 2020年至今 |

---

## 搜索任务4：Google的SRE + AI实践

### 4.1 Google SRE与AI整合

| 项目 | 详情 |
|------|------|
| **公司/团队** | Google SRE团队 |
| **技术/工具名称** | Google SRE AI辅助系统 |
| **核心方法** | 基于SLO（Service Level Objectives）的自动化监控；Error Budget驱动运维决策：结合AI预测error budget消耗速率；基于ML的自动化容量规划：流量预测和资源规划；Incident自动化管理：自动化事件分类、路由和缓解建议；基于ML的延迟异常检测 |
| **参考书籍** | 《SRE: Google运维解密》(Site Reliability Engineering, O'Reilly, 2016)；《The Site Reliability Workbook》(O'Reilly, 2018) |
| **发表年份** | 2016年至今 |

### 4.2 Google内部自动化运维工具

| 项目 | 详情 |
|------|------|
| **公司/团队** | Google |
| **技术/工具名称** | Borgmon / Outalator / Automated Canary Analysis (ACA) |
| **核心方法** | Borgmon使用基于规则的告警，结合统计分析检测异常；Outalator自动关联多个告警为单一事件；ACA利用统计方法自动化判断新版本是否安全发布 |
| **发表年份** | 2016年（随SRE书籍公开） |

### 4.3 Google Cloud Operations Suite

| 项目 | 详情 |
|------|------|
| **公司/团队** | Google Cloud |
| **技术/工具名称** | Google Cloud Operations Suite（原Stackdriver） |
| **核心方法** | Cloud Monitoring：指标监控和异常检测；Cloud Logging：智能日志分析；Cloud Trace：分布式追踪；Error Reporting：自动错误分组和报告；基于ML的日志异常检测 |
| **发表年份** | 持续更新 |

### 4.4 Google在AIOps方面的研究

| 项目 | 详情 |
|------|------|
| **公司/团队** | Google Research |
| **核心方向** | 微服务根因分析：基于因果推断的故障定位；日志异常检测：基于深度学习的日志分析；服务级指标预测：基于时序模型的SLO预测；自动化变更影响分析 |
| **发表年份** | 2018年至今 |

---

## 搜索任务5：Netflix/Uber/Lyft的AIOps实践

### 5.1 Netflix -- 混沌工程与可靠性

#### 5.1.1 Chaos Monkey及混沌工程工具族

| 项目 | 详情 |
|------|------|
| **公司/团队** | Netflix |
| **技术/工具名称** | Chaos Monkey (2012) / Chaos Kong (2015) / ChAP: Chaos Automation Platform (2017) / Flux: 流量直觉系统 (2017) |
| **核心方法** | Chaos Monkey：随机终止生产环境实例，验证系统弹性；Chaos Kong：模拟整个AWS可用区故障；ChAP：自动化混沌实验平台，可自动设计、执行和分析混沌实验；Flux：全链路流量分析，提供系统直觉（system intuition）；利用ML分析混沌实验结果，自动发现系统弱点 |
| **效果数据** | Netflix系统在AWS大规模故障中保持高可用性 |
| **链接** | https://netflixtechblog.com/tagged/chaos-engineering |
| **发表年份** | 2012年至今 |

#### 5.1.2 Netflix优先级负载卸载

| 项目 | 详情 |
|------|------|
| **公司/团队** | Netflix |
| **技术/工具名称** | Service-Level Prioritized Load Shedding |
| **核心方法** | 应用层QoS（Quality of Service）技术；在服务层面实现优先级负载卸载；在基础设施自恢复期间保障核心观看体验；基于AI的流量模式分析和优先级决策 |
| **链接** | "Keeping Netflix Reliable Using Prioritized Load Shedding" (2020)；"Enhancing Netflix Reliability with Service-Level Prioritized Load Shedding" (2024) |
| **发表年份** | 2020年、2024年 |

#### 5.1.3 Netflix Atlas指标平台

| 项目 | 详情 |
|------|------|
| **公司/团队** | Netflix |
| **技术/工具名称** | Atlas |
| **核心方法** | Netflix内部大规模指标收集和查询系统；支持实时异常检测；基于统计方法的自动告警 |
| **发表年份** | 2014年至今 |

### 5.2 Uber -- 微服务可靠性

#### 5.2.1 Jaeger分布式追踪系统

| 项目 | 详情 |
|------|------|
| **公司/团队** | Uber Engineering -- Observability团队（NYC） |
| **技术/工具名称** | Jaeger |
| **核心方法** | 开源分布式追踪系统，用于微服务调用链分析。基于OpenTracing标准；后端组件用Go实现，客户端库支持Go/Java/Python/Node.js四种语言；支持动态采样策略（概率采样、限速采样等）；使用Cassandra作为存储后端；包含基于React的Web UI |
| **效果数据** | 2017年集成到数百个微服务，每秒记录数千条trace；2017年9月加入CNCF孵化；2019年10月成为CNCF毕业项目（Graduated）；3,066名贡献者，747个贡献组织 |
| **链接** | https://eng.uber.com/distributed-tracing/ ； https://www.cncf.io/projects/jaeger/ |
| **发表年份** | 2015年开发，2017年开源 |

#### 5.2.2 Uber微服务可靠性平台

| 项目 | 详情 |
|------|------|
| **公司/团队** | Uber Engineering |
| **技术/工具名称** | Uber自适应限流系统 / 分布式追踪 / Cerberus可靠性评估框架 |
| **核心方法** | 自适应限流：基于实时负载和服务健康状态的自适应流量控制；变更影响分析：自动化检测部署变更对服务的影响；告警智能：基于ML的告警聚合和降噪 |
| **效果数据** | 管理数千个微服务 |
| **发表年份** | 2017年至今 |

### 5.3 Lyft -- AIOps实践

#### 5.3.1 Envoy Proxy与微服务可靠性

| 项目 | 详情 |
|------|------|
| **公司/团队** | Lyft Engineering |
| **技术/工具名称** | Envoy Proxy（开源，现CNCF毕业项目） |
| **核心方法** | 服务网格数据面代理，提供可观测性、流量管理和服务弹性；自动重试、熔断、超时管理；分布式追踪集成；基于统计阈值的自动告警；基于历史数据的自动容量推荐 |
| **效果数据** | Envoy成为行业标准，被众多公司广泛采用 |
| **发表年份** | 2016年至今 |

---

## 综合总结

### 技术趋势

1. **AI/ML在运维中的深度整合** -- 从简单的阈值告警到基于ML的异常检测、根因分析和自动化修复
2. **LLM在运维中的新兴应用** -- 微软的Xpert、UniLog、Assess and Summarize等展示了LLM在事件管理和日志分析中的潜力
3. **多源数据融合** -- Trace + Log + Metric的组合分析成为趋势（如DeepTraLog）
4. **自动化推理** -- Amazon在形式化验证和自动化推理方面的应用独树一帜
5. **混沌工程+AI** -- Netflix等公司将混沌实验与AI分析结合，主动发现系统弱点
6. **强化学习用于运维决策** -- 微软的NENYA系统将级联强化学习用于生产环境的故障缓解
7. **端到端系统化方案** -- 从单一工具向完整的AIOps平台演进

### 各公司实践特点对比

| 公司 | 核心特色 | 代表性工具/系统 | 发表论文数量 |
|------|----------|----------------|-------------|
| Amazon/AWS | 自动化推理、商业化AIOps服务 | DevOps Guru, Automated Reasoning | 少量（以产品为导向） |
| Microsoft | 学术研究最丰富、覆盖面广 | HALO, NENYA, RESIN, Xpert等 | 25+（2020-2024） |
| Google | SRE方法论、工程文化 | Borgmon, Outalator, ACA | 以书籍为主 |
| Netflix | 混沌工程开创者 | Chaos Monkey, ChAP, Atlas | 以博客为主 |
| Uber | 分布式追踪开源贡献 | Jaeger | 以博客为主 |
| 字节跳动 | 大规模微服务运维 | 自研AIOps平台 | 少量公开 |

---

## Agent+Skill方法专题调研（2026/05/28更新）

> 本节聚焦业界最新Agent+Skill范式在故障诊断/根因分析领域的应用，覆盖AWS、微软、字节跳动三家代表性厂商。

### A. AWS：从CloudWatch Investigations到DevOps Agent（Frontier Agent）

#### A.1 CloudWatch Investigations — Feed模块 + Suggestion模块

| 项目 | 详情 |
|------|------|
| **产品名称** | Amazon CloudWatch Investigations |
| **架构** | GenAI驱动的辅助分析系统，内嵌于CloudWatch |
| **Feed模块（10类原子洞察能力）** | ① 根因假设（LLM生成，含因果可视化图）；② CloudWatch Alarms（指标告警+复合告警）；③ CloudWatch Metrics（异常检测）；④ AWS Health Events（服务健康事件）；⑤ CloudTrail Change Events（部署/配置变更）；⑥ X-Ray Trace Data（分布式追踪+拓扑依赖）；⑦ CloudWatch Logs Insights Queries（AI自动生成日志查询）；⑧ Contributor Insights Data（高基数据分析）；⑨ Application Signals Data（服务级健康+依赖）；⑩ Database Insights Data（数据库性能分析） |
| **Suggestion模块机制** | 利用遥测数据配置、服务配置和观测到的关联关系确定依赖关系，规划分析路径；当Application Signals + X-Ray可用时拓扑精确映射，否则通过**共现遥测异常推断依赖**；迭代推理模型允许操作人员接受/拒绝建议，逐步精化至根因 |
| **配置层级** | 无配置模式：单次运行，无持久化；Investigation Group模式：支持迭代推理、跨账户、更多数据源、注释、Runbook执行、团队共享、归档/重开、5 Whys事件报告（限制：2个并发活跃调查，每月150次增强调查） |
| **关键文档** | [Investigations文档](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Investigations.html)；[SuggestionTypes](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Investigations-SuggestionTypes.html)；[Data Usage](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/data-usage-considerations.html) |

#### A.2 AWS DevOps Agent — 自主Frontier Agent（2026年3月GA）

| 项目 | 详情 |
|------|------|
| **产品名称** | AWS DevOps Agent |
| **架构基础** | Amazon Bedrock AgentCore（非简单LLM聊天界面，具备专用的记忆、策略、评估和可观测性基础设施） |
| **时间线** | 2025年12月 re:Invent 2025 公开Preview → 2026年3月31日 GA → 2026年4月6日正式发布 |
| **定义** | "Frontier Agent"（前沿智能体）—— AWS术语，指大规模可扩展、可自主运行数小时甚至数天的AI Agent，充当始终在线的虚拟SRE |
| **核心架构组件** | ① **Agent Spaces**：逻辑容器，定义调查范围、跨账户访问、工具集成、IAM权限和数据隔离；② **Topology Intelligence Service**：通过CloudFormation/CDK/资源标签自动发现资源，映射容器/网络/日志组/告警/部署的互联关系，后台学习Agent持续更新拓扑；③ **三层Skill层级**：AWS提供Skill + 用户自定义Skill + 学习型Skill（后台学习子Agent扫描基础设施/遥测/代码，从过去调查中识别模式加速未来调查） |
| **"6C"设计框架** | Context（拓扑上下文）、Control（IAM/治理）、Convenience（零配置团队访问）、Collaboration（Slack/工单集成）、Continuous Learning（三层Skill）、Cost Effective（按秒计费） |
| **Feed集成能力** | 遥测：CloudWatch/Datadog/Dynatrace/New Relic/Splunk/Grafana/Prometheus；CI/CD：GitHub Actions/GitLab CI/Azure DevOps；工单：ServiceNow（原生）/PagerDuty（Webhook）；通信：Slack；扩展：BYO MCP Server；云：AWS（原生）/Azure/本地（GA新增） |
| **调查工作流** | ① 告警/PagerDuty/Dynatrax Problem/ServiceNow工单触发 → ② Agent自主开始调查（无需人工触发） → ③ 生成假设、查询遥测和代码数据验证 → ④ 关联部署时间戳与指标异常 → ⑤ Slack发布时间线、更新工单 → ⑥ 提供含详细实施规格的缓解计划 → ⑦ 周预防分析：建议可观测性/基础设施/代码改进 |
| **效果数据** | Preview阶段：MTTR降低75%，调查加速80%，根因准确率94%，故障解决加速3-5x |
| **案例** | WGU（西部州长大学）：Lambda配置问题从预估2小时降至28分钟（77% MTTR改善）；Zenchef：ECS部署回归调查从1-2小时降至20-30分钟（75%改善） |
| **关键参考** | [Preview Blog](https://aws.amazon.com/blogs/aws/aws-devops-agent-helps-you-accelerate-incident-response-and-improve-system-reliability-preview/)；[Agentic AI Blog](https://aws.amazon.com/blogs/devops/leverage-agentic-ai-for-autonomous-incident-response-with-aws-devops-agent/)；[InfoQ GA报道](https://www.infoq.com/news/2026/04/aws-devops-agent-ga/)；[End-to-End Agentic SRE](https://aws.amazon.com/blogs/devops/building-an-end-to-end-agentic-sre-using-aws-devops-agent/)；re:Invent 2025 COP362 |

#### A.3 CloudWatch Investigations vs. DevOps Agent对比

| 维度 | CloudWatch Investigations | AWS DevOps Agent |
|------|--------------------------|------------------|
| 范围 | CloudWatch原生（仅AWS） | 多云、多工具 |
| 架构 | CloudWatch内GenAI助手 | Bedrock AgentCore上的自主Frontier Agent |
| 自主性 | 人工触发，向人建议 | 自动触发，自动调查，自动报告 |
| 拓扑 | 从遥测+Application Signals推断 | 通过Agent Spaces自动发现（CFN/标签） |
| 学习能力 | 无跨调查学习 | 三层Skill层级+持续学习 |
| 协作 | 与团队共享结果 | 自主Slack/工单更新 |
| 定价 | CloudWatch内含（150次增强/月） | 按秒使用量计费 |
| GA状态 | 已GA | 2026年3月31日GA |

#### A.4 相关学术研究

| 论文 | 会议/来源 | 核心内容 |
|------|-----------|----------|
| "Why Do AI Agents Systematically Fail at Cloud Root Cause Analysis?" | arXiv:2602.09937 | 在5个LLM模型上执行完整OpenRCA基准测试，1675次Agent运行，识别出12种系统性陷阱类型 |
| RCAgent | ACM SIGKDD 2024 | 工具增强的LLM自主Agent，用于隐私感知的工业RCA |
| Multi-Agent Framework for RCA | Springer 2025 | 面向云原生平台的多Agent RCA方法 |

---

### B. 微软：FLASH Agent + AIOpsLab + Triangle + StepFly

#### B.1 FLASH — 故障诊断案例库沉淀反思Agent

| 项目 | 详情 |
|------|------|
| **论文** | FLASH: A Workflow Automation Agent for Diagnosing Recurring Incidents |
| **作者** | Xuchao Zhang, Tanish Mittal, Chetan Bansal, Rujia Wang, Minghua Ma, Zhixin Ren, Hao Huang, Saravan Rajmohan |
| **机构** | Microsoft Research (M365 Research, Systems Innovation) |
| **时间** | 2024年10月 |
| **名称含义** | workFLow Automation agent with Status supervision and Hindsight integration |
| **核心问题** | LLM Agent在多步骤任务中存在错误传播——即使单步准确率85%，5步任务的整体准确率仅44% |
| **两大核心机制** | ① **Status Supervision（状态监督）**：访问工作流执行的当前状态，触发状态依赖的指令，将复杂指令分解为与当前状态对齐的更简单片段，防止错误级联；② **Hindsight Integration（后见之明/案例库沉淀反思）**：用LLM从过去的故障经验中自动生成"后见之明"（hindsight），集成到Agent的反思步骤中，防止已遇到的问题再次发生。随着处理案例增多，系统逐步构建案例库，持续提升后续事件的诊断可靠性 |
| **评估** | 在Microsoft 250个生产事件上测试，5种不同工作流自动化场景，FLASH准确率平均超过SOTA Agent模型13.2% |
| **实际部署** | Microsoft Ignite 2024主题演讲展示，基于MAIA芯片的产品支持Agent；正在与各产品组合作构建更强大可靠的Agent |
| **论文链接** | [PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2024/10/FLASH_Paper.pdf)；[Publication](https://www.microsoft.com/en-us/research/publication/flash-a-workflow-automation-agent-for-diagnosing-recurring-incidents/)；[Project](https://www.microsoft.com/en-us/research/project/flash-a-reliable-workflow-automation-agent/) |

#### B.2 AIOpsLab — 仿真评估验证平台

| 项目 | 详情 |
|------|------|
| **论文** | AIOpsLab: A Holistic Framework to Evaluate AI Agents for Enabling Autonomous Cloud |
| **作者** | Yinfang Chen, Manish Shetty, Gagan Somashekar, Minghua Ma, Yogesh Simmhan, Jonathan Mace, Chetan Bansal, Rujia Wang, Saravan Rajmohan |
| **发表** | Vision paper: SoCC 2024；Full paper: **MLSys 2025**（2025年5月） |
| **GitHub** | https://github.com/microsoft/AIOpsLab （MIT许可，开源） |
| **文档** | https://microsoft.github.io/AIOpsLab/ |
| **四大架构组件** | ① **Agent-Cloud Interface (ACI)**：通过编排器严格分离Agent与应用服务，提供API（get logs/get metrics/exec shell），支持ReAct/AutoGen/TaskWeaver框架；② **Service Layer**：部署微服务/Serverless/单体环境，使用DeathStarBench等开源套件（SocialNetwork/HotelReservation/E-Commerce）；③ **Workload Generator**：创建正常和故障场景的真实模拟，可使用基于真实生产Trace训练的模型；④ **Fault Generator**：一键式故障生成器，细粒度故障注入，在多个系统层级注入故障同时保持语义完整性（如VirtualizationFaultInjector），灵感来源于真实生产事件 |
| **四大评估任务** | 事件检测 → 故障定位 → 根因诊断 → 缓解 |
| **可观测性层** | 追踪（Jaeger）、应用日志（Filebeat/Logstash）、系统指标（Prometheus）、系统调用日志、集群信息 |
| **愿景** | 标准化、可复现的AIOps Agent基准测试，同时作为Agent学习和改进的训练环境（"gym"） |
| **论文链接** | [arXiv](https://arxiv.org/pdf/2501.06706)；[Blog](https://www.microsoft.com/en-us/research/blog/aiopslab-building-ai-agents-for-autonomous-clouds/)；[InfoQ报道](https://www.infoq.com/news/2025/01/microsoft-reasearch-aiopslab/) |

#### B.3 微软AIOps Agent生态全景

| 系统 | 层级 | 会议/年份 | 核心方法 |
|------|------|-----------|----------|
| **FLASH** | 诊断执行层 | 2024 | Status Supervision + Hindsight案例库反思，解决Agent多步骤可靠性 |
| **AIOpsLab** | 评估/仿真层 | MLSys 2025 | 标准化Agent基准测试平台+故障注入+工作负载生成 |
| **Triangle** | 事件分诊层 | ASE 2025 | 多LLM Agent系统，每个Agent代表一个工程团队，语义蒸馏处理异质事件数据，部署6+ Azure团队，MTTR降低40% |
| **StepFly** | 排障指南执行层 | 2025 | 将静态TSG（Troubleshooting Guide）转化为自动化Agent工作流，[开源](https://github.com/microsoft/StepFly) |
| Exploring LLM-based Agents for RCA | RCA评估 | FSE 2024 | ReAct Agent + 检索工具在生产事件上的实证评估 |

---

### C. 字节跳动：Flow-of-Action → FoundRoot 技术演进

#### C.1 Flow-of-Action — 基于行动集的多Agent故障诊断（WWW 2025）

| 项目 | 详情 |
|------|------|
| **论文** | Flow-of-Action: SOP Enhanced LLM-Based Multi-Agent System for Root Cause Analysis |
| **作者** | Changhua Pei（中科院）, Zexin Wang（中科院）, Fengrui Liu, Zeyan Li, Xiao He, Rong Kang, Tieying Zhang, Jianjun Chen（字节跳动）, Yang Liu, Jianhui Li, Gaogang Xie（中科院）, Dan Pei（清华大学） |
| **会议** | WWW Companion '25, 2025年4月28日-5月2日, 悉尼, pp.422-431 |
| **DOI/ArXiv** | 10.1145/3701716.3715225 / https://arxiv.org/abs/2502.08224 |
| **核心问题** | ReAct范式LLM Agent进行微服务RCA时存在幻觉导致不相关动作选择，复杂多变观测导致模型崩溃 |
| **三大创新** | ① **SOP Flow（标准操作流程）**：将SRE诊断步骤显式编码为知识库，通过软约束（非硬工作流）约束LLM推理，无匹配SOP时自动生成新SOP，SOP可转为可执行代码减少Token消耗；② **Action Set（行动集）**：提出`thought-actionset-action-observation`范式（而非ReAct的`thought-action-observation`），先生成多个合理动作的候选集（最优大小=5），附文本解释，再选择最终执行动作。候选来源：ActionAgent生成 + SOP规则生成；③ **多Agent系统（5个协作Agent）**：MainAgent（协调）、ActionAgent（生成合理动作集）、CodeAgent（SOP转可执行代码）、ObAgent（海量观测数据提取故障类型和关键信息）、JudgeAgent（判断是否已识别根因） |
| **效果** | 准确率（位置+类型组合）**64.01%** vs. ReAct **35.50%**（提升80%） |
| **评估设置** | Kubernetes上GoogleOnlineBoutique微服务，ChaosMesh注入9种故障类型，90个事件，多模态数据（Prometheus指标+Elastic日志+DeepFlow流量+Jaeger追踪） |

#### C.2 FoundRoot — 基于结构化深度思考的基础模型（ICSE 2026）

| 项目 | 详情 |
|------|------|
| **论文** | FoundRoot: Towards Foundation Model for Root Cause Analysis via Structured Deep Thinking |
| **作者** | Zhe Xie（清华）, Zeyan Li, Xiao He, Tieying Zhang, Jianjun Chen, Rui Shi（字节跳动）, Shenglin Zhang（南开）, Longlong Xu, Yuzhuo Yang（清华）, Dan Pei（清华） |
| **会议** | ICSE 2026 Research Track, 2026年4月, 巴西里约热内卢 |
| **DOI/代码** | 10.1145/3744916.3787814 / https://github.com/NetManAIOps/FoundRoot |
| **基础模型** | DeepSeek-R1-Distill-Qwen2.5-14B |
| **关键转变** | **从Agent方法转向基础模型方法**——FoundRoot论文明确指出："将RCA推理分解为动作-反思过程并不能显著增强LLMs推理复杂因果关系的能力"，基于工作流的方法"仍然落后于直接应用深度思考的模型" |
| **结构化深度思考范式（4子步骤）** | ① 指标扫描：迭代遍历所有组件和指标识别异常；② 传播分析：基于异常指标分析故障传播路径；③ 反思：自我纠正防止推理崩溃；④ 排序：综合分析生成排序的根因列表 |
| **训练流程** | ① Warm-up SFT：通过结构化约束的持续生成产生结构化思考痕迹；② RL with DAPO：动态采样策略优化，多组件奖励函数（格式+JSON+RCA准确率+结构化思考） |
| **效果** | 4个零样本基准上MRR比第二名提升4.5%-48.6%；数据集A和B上Top-1提升68.9%-116.5% |
| **数据集** | 10个数据集（银行服务/Oracle DB/TicketMonster/TrainTicket/HipsterShop等），415个原始案例扩展至3502个增强样本——现有RCA研究最大集合 |

#### C.3 MagmaScope — 云事件根因变更识别（ICSE 2026 SEIP）

| 项目 | 详情 |
|------|------|
| **论文** | MagmaScope: Identifying Root-Cause Changes for Emergency Incident in Large-Scale Cloud Infrastructure |
| **作者** | Zongyang Li（北大）, Ning Wang, Jiliang Liu, Yaping Zhang等（9位字节跳动作者） |
| **会议** | ICSE 2026 SE In Practice (SEIP) track |
| **重点** | 识别导致紧急事件的**确切代码/配置变更**（根因变更），与根因分析范式互补 |

#### C.4 字节跳动RCA研究演进路线

| 年份 | 工作 | 会议 | 方法 | 关键洞察 |
|------|------|------|------|----------|
| 2024 | Chain-of-Event (CoE) | FSE 2024 | 加权事件因果图 | 前身工作 |
| **2025** | **Flow-of-Action** | **WWW 2025** | **SOP+行动集多Agent** | Agent+Skill范式的RCA探索，准确率64% |
| 2026 | FoundRoot | ICSE 2026 | 结构化深度思考基础模型 | **发现Agent方法局限性，转向端到端基础模型推理** |
| 2026 | MagmaScope | ICSE 2026 SEIP | 根因变更识别 | 补充RCA——定位到具体代码/配置变更 |

**关键洞察**：Flow-of-Action → FoundRoot的演进表明，字节跳动团队在实践Agent+Skill范式后发现其局限性——"Agent缺乏内在推理能力"、"动作-反思过程不能显著增强LLMs推理复杂因果关系的能力"——转而探索端到端基础模型方案。这对于核电厂DCS等安全关键场景有重要参考价值。

---

### D. Agent+Skill方法总结与对核电厂DCS的启示

#### D.1 三种Agent+Skill范式对比

| 维度 | AWS DevOps Agent | 微软 FLASH | 字节跳动 Flow-of-Action |
|------|------------------|------------|------------------------|
| **Skill定义** | 三层Skill：AWS内置+用户自定义+学习型 | Hindsight案例库（从过去故障中自动沉淀） | SOP Flow（SRE诊断步骤显式编码） |
| **Skill获取** | 后台学习Agent扫描基础设施/遥测/代码 | LLM自动从故障经验生成hindsight | 人工编码+自动生成新SOP |
| **动作选择** | Agent自主规划调查路径 | 状态监督+后见之明指导 | 行动集范式（先候选后选择） |
| **多Agent协作** | 单Agent+多层Skill | 单Agent+反思机制 | 5个协作Agent |
| **评估方式** | 生产案例（MTTR降低75%） | 250个生产事件（准确率+13.2%） | 90个ChaosMesh注入事件（准确率64%） |
| **局限性认知** | 依赖拓扑自动发现质量 | 仅限重复性事件 | **论文后继者FoundRoot指出Agent方法有根本局限** |
| **自主程度** | 全自主（可独立运行数天） | 半自主（辅助SRE） | 半自主（辅助SRE） |

#### D.2 对核电厂DCS可靠性的启示

1. **Skill原子化是关键**：AWS的Feed模块（10类原子洞察能力）和三层Skill层级、微软的Hindsight案例库沉淀、字节的SOP编码，都体现了将领域专家知识原子化、可积累的趋势。核电厂DCS有大量成熟的运行规程（如EOP/SAMG），天然适合作为SOP/知识库的来源。

2. **Agent方法的局限性需警惕**：字节跳动从Flow-of-Action（Agent+Skill）到FoundRoot（端到端基础模型）的演进，明确指出Agent方法在复杂因果推理中存在局限。对于核电厂DCS这种安全关键场景，需要更强的可解释性和可靠性保障，可能需要结合两种范式的优势。

3. **仿真评估平台的必要性**：微软AIOpsLab提供了一个标准化Agent基准测试平台的范例。核电厂DCS领域同样需要建立类似的可信仿真评估环境，用于验证AI辅助诊断的可靠性和安全性。

4. **持续学习与案例沉淀**：微软FLASH的Hindsight机制（从每次故障中自动沉淀教训）对核电厂运行经验反馈（OEF）有直接参考价值——可以将核电厂的运行事件经验自动转化为Agent的知识积累。
