# AWS故障管理图片资源：原子能力→Agent+Skill整合趋势

## PPT推荐方案：三阶段演进图

### 第一阶段：CloudWatch Investigations — Feed（原子能力层）

**推荐图片**: `aws_cloudwatch_investigations/cw-feed-suggestions-topology.png`

Feed面板展示10类原子洞察能力：
- CloudWatch Alarms（告警）、CloudWatch Metrics（指标）
- AWS Health Events（健康事件）、CloudTrail Change Events（变更事件）
- X-Ray Traces（调用链）、Logs Insights Queries（日志查询）
- Contributor Insights（贡献者洞察）、Application Signals（应用信号）
- Database Insights（数据库洞察）、Root Cause Hypotheses（根因假设）

**PPT标注要点**:
- Feed是**被动的数据聚合面板**——将多维遥测数据原子化收集
- 拓扑图自动发现资源关系（右上角可看到微服务拓扑）
- 每类洞察是独立的原子能力，需要人工逐项查看

**备选图片**:
- `cw-accept-hypothesis.png` — 展示将假设纳入Feed的操作
- `cw-alarm-threshold.png` — 展示CloudWatch告警触发起点

---

### 第二阶段：CloudWatch Investigations — Suggestions（AI辅助建议层）

**推荐图片**: `aws_cloudwatch_investigations/cw-suggested-runbooks.png`

Suggestions面板展示AI自动生成的诊断建议和修复方案：
- AI生成根因假设 + "Show reasoning"可查看推理过程
- Suggested Actions推荐400+ AWS-authored SSM Runbook
- 支持一键执行Runbook实现半自动修复

**PPT标注要点**:
- 从Feed的"被动聚合"升级为"主动推荐"——AI分析多维数据后生成假设
- Suggestion包含诊断建议 + 修复建议，但仍需人工确认
- 这是**原子能力的AI编排**，但仍是辅助工具，非自主Agent

**备选图片**:
- `cw-hypothesis-reasoning.png` — 展示AI假设及推理过程
- `cw-view-actions.png` — 展示"View actions"查看修复建议

---

### 第三阶段：AWS DevOps Agent（Agent+Skill自主整合层）

**推荐图片（二选一）**:

#### 选项A（推荐）: `aws_devops_agent/da-blog-e2e-architecture.png`
来自"Building an end-to-end agentic SRE"博客，展示完整的端到端架构：
- 3个AWS Account（Demo App / Splunk / DevOps Agent）
- CloudWatch Alarm → EventBridge → Lambda → Webhook → Agent自动触发
- Agent集成CloudWatch + Splunk + GitHub + Slack
- 自动调查 → 根因分析 → 缓解计划 → Agent-Ready Spec → Kiro编码Agent执行

#### 选项B: `aws_devops_agent/da-featured-architecture.png`
来自DevOps Agent产品页，展示Agent核心架构：
- Agent Spaces（拓扑智能 + 技能体系）
- Built-in Skills / Custom Skills / Learned Skills三层Skill
- MCP工具集成 + 多云/混合环境支持

**PPT标注要点**:
- **完全自主的Agent**：告警触发后自动调查，无需人工介入
- **三层Skill架构**:
  - Built-in Skills：AWS预置的通用诊断能力
  - Custom Skills：用户定义的领域特定工作流（SKILL.md）
  - Learned Skills：Agent从环境中自动学习的结构化知识
    - Agent Space Understanding：自动构建拓扑+资源映射
    - Tool Use Best Practices：从过去30次调查中提取最佳实践
- **多Agent架构**：Lead Agent（事件指挥官）+ Sub-Agent（专家执行器）
- **闭环修复**：Root Cause → Mitigation Plan → Agent-Ready Spec → 编码Agent执行

**补充图片**（可选）:
- `aws_devops_agent/da-blog-skills-page.png` — Skills管理界面截图
- `aws_devops_agent/da-fig3-investigation-workflow.png` — 调查工作流步骤图
- `aws_devops_agent/da-blog-mitigation.png` — 缓解计划生成截图
- `aws_devops_agent/da-blog-agent-ready-spec.png` — Agent-Ready Spec截图

---

## 演进趋势总结（适合PPT用文字）

```
原子能力（Feed）           AI辅助编排（Suggestions）         Agent+Skill自主整合
─────────────          ─────────────────           ──────────────────
10类原子洞察           AI生成假设+推理              自主Agent驱动
  告警/指标/日志          Suggested Runbooks           三层Skill体系
  调用链/变更事件         半自动修复                   Learned Skill自学习
  健康事件/DB洞察        仍需人工确认                 多Agent协作
                                                 闭环修复（诊断→修复→验证）

人工逐项查看    →      AI推荐，人工确认      →      Agent自主，人工审批
```

---

## 图片文件索引

### CloudWatch Investigations（11张）
| 文件 | 内容 | 大小 |
|------|------|------|
| cw-feed-suggestions-topology.png | Feed+Suggestions+拓扑主界面 | 692KB |
| cw-hypothesis-reasoning.png | AI假设及推理展示 | 777KB |
| cw-accept-hypothesis.png | 接受假设加入Feed | 653KB |
| cw-suggested-runbooks.png | 建议的Runbook列表 | 819KB |
| cw-view-actions.png | 查看修复建议 | 725KB |
| cw-execute-runbook.png | 执行Runbook界面 | 629KB |
| cw-runbook-result.png | Runbook执行结果 | 255KB |
| cw-alarm-threshold.png | CloudWatch告警阈值 | 628KB |
| cw-investigation-banner.png | 调查横幅 | 562KB |
| cw-new-investigation.png | 创建新调查 | 683KB |
| cw-overview.png | 整体概览 | 399KB |

### DevOps Agent（14张）
| 文件 | 内容 | 大小 |
|------|------|------|
| da-blog-e2e-architecture.png | 端到端SRE架构图 ★ | 89KB |
| da-featured-architecture.png | DevOps Agent架构图 ★ | 262KB |
| da-blog-skills-page.png | Skills管理界面 ★ | 64KB |
| da-fig3-investigation-workflow.png | 调查工作流步骤 | 118KB |
| da-blog-mitigation.png | 缓解计划生成 | 51KB |
| da-blog-agent-ready-spec.png | Agent-Ready Spec | 97KB |
| da-blog-agentic-sre.png | Agentic SRE博客封面 | 182KB |
| da-blog-featured.png | 原型到产品博客封面 | 190KB |
| da-fig2-investigation-flow.png | 调查流程图 | 1096KB |
| da-fig4-mcp-integrations.png | MCP集成图 | 103KB |
| da-fig5-telemetry-integrations.png | 遥测集成图 | 112KB |
| da-fig6-multicloud-cicd.png | 多云CI/CD图 | 142KB |
| da-fig7-slack-notifications.png | Slack通知截图 | 287KB |
| da-fig8-prevention-recommendations.png | 预防建议截图 | 227KB |

★ = PPT重点推荐
