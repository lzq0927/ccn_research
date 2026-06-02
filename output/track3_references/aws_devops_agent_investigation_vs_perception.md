# 术语澄清："Investigation"不是故障感知/检测

## 核心结论

AWS DevOps Agent文档中大量出现的**"Investigation"（调查）不是故障感知/检测，而是告警触发之后的诊断调查**。

---

## 具体工作流

```
告警触发（由外部监控系统完成）         Investigation（DevOps Agent执行）
─────────────────────          ──────────────────────────────
CloudWatch Alarm →              Agent自主开始调查
PagerDuty Alert →     ────→    生成假设 → 查询遥测 → 关联部署 → RCA
Dynatrace Problem →            发布到Slack → 更新工单 → 缓解建议
ServiceNow Ticket →
                    ↑                      ↑
               感知/检测层              诊断/调查层
            （DevOps Agent              （DevOps Agent
            不负责这部分）               的核心能力）
```

**感知/检测**：由CloudWatch、Datadog、New Relic等第三方监控系统负责——它们是DevOps Agent的**数据源（Feed）**，不是Agent自身的能力。

**Investigation**：Agent收到告警后自动启动的诊断过程——生成假设、查询多源数据、关联部署时间戳、定位根因。

**Learned Skill "Tool Use Best Practices"** 中分析的"past investigations"是**过去的诊断调查记录**，从中提取有效的查询模式和常见错误。

---

## AWS vs 微软：感知层策略的根本区别

| 阶段 | 微软 | AWS |
|------|------|-----|
| **感知/检测** | AiDice、LogRobust、TraceArk、Narya等（**自研**，91%生产部署率） | CloudWatch、Datadog等第三方（**集成，不自研**） |
| **分诊** | Triangle（多Agent协商分诊） | DevOps Agent自动触发调查 |
| **诊断** | FLASH/GraphMind、StepFly | Investigation（DevOps Agent核心能力） |
| **修复** | Azure SRE Agent | 缓解建议（人工确认后执行） |
| **技能进化** | SkillOpt（学术阶段，未集成AIOps） | Learned Skill（**生产GA**） |

**AWS的策略**："不做感知层，只做诊断层以上的智能"——感知交给成熟的第三方监控工具（作为Feed接入），DevOps Agent专注从告警到根因的自动化调查。

**微软的策略**："从感知到诊断全栈自研"——自研异常检测（AiDice）、日志分析（LogRobust/SPINE）、调用链检测（TraceArk）、预测性感知（Narya/RESIN），再到诊断（FLASH/StepFly）和生产集成（Azure SRE Agent）。

---

## 对云核网络高稳的启示

**两种策略对5GC都有参考价值**：

1. **AWS路径适合快速落地**：5GC已有大量监控基础设施（Prometheus、各供应商NMS），不需要自研感知层。直接接入现有告警，聚焦Agent诊断能力。

2. **微软路径适合长期深耕**：如果要在5GC领域建立技术壁垒，需要从感知层开始构建完整的技术栈。

**建议**：**先用AWS路径快速验证价值（接入现有告警→Agent诊断→Learned Skill积累经验），再用微软路径逐步补齐感知层**。

---

## 补充：AWS DevOps Agent完整工作流的7个步骤

1. 告警/PagerDuty/Dynatrace Problem/ServiceNow工单触发
2. Agent自主开始调查（无需人工触发）
3. 生成假设、查询遥测和代码数据验证
4. 关联部署时间戳与指标异常
5. Slack发布时间线、更新工单
6. 提供含详细实施规格的缓解计划
7. 周预防分析：建议可观测性/基础设施/代码改进

步骤1是**外部触发（感知层）**，步骤2-7是**Investigation（诊断+修复建议层）**。Agent不参与故障的发现/检测，只参与故障的理解/诊断/修复。
