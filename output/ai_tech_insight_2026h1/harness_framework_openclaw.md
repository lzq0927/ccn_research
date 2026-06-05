# OpenClaw — 四层Hub-Spoke Agent架构原生框架深度分析

> 来源：https://docs.openclaw.ai/concepts/architecture | https://www.mintmcp.com/blog/openclaw-works-architecture-skills-security
> 分析日期：2026-06-05

---

## 一、基本概况

| 维度 | 内容 |
|------|------|
| **开发者** | Peter Steinberger（奥地利），2026年2月14日加入OpenAI |
| **GitHub Stars** | ~247,000（截至2026年3月3日） |
| **定位** | 开源、自托管的个人AI Agent，可自主操作计算机 |
| **象征** | 龙虾（Lobster） |
| **技术栈** | Node.js 22+、WebSocket、Docker可选 |

## 二、四层Hub-Spoke架构

OpenClaw采用**Hub-and-Spoke（中心辐射）**架构，Gateway作为中心Hub，各聊天平台作为Spoke。

### Layer 1: Channel Adapters（通道适配器）

- **功能**：将20+聊天平台的消息格式统一为内部标准格式
- **支持平台**：WhatsApp(Baileys)、Telegram(grammY)、Slack、Discord、Signal、iMessage(BlueBubbles)、Microsoft Teams、WebChat
- **职责**：
  - 平台特定认证（QR码、Bot Token、OAuth）
  - 访问控制（白名单allowlists、DM配对pairing、群组@触发mention-gating）
  - 入站消息格式转换、出站响应适配各平台

### Layer 2: Gateway Control Plane（网关控制面）

- **核心组件**：单WebSocket服务器（Node.js 22+）
- **默认绑定**：127.0.0.1:18789（仅本地访问）
- **职责**：
  - 消息路由：Access Control → Session Resolution → Agent Dispatch
  - 系统状态协调：sessions、cron jobs、webhooks、health monitoring
- **安全风险**：Censys发现21,639个互联网暴露实例（用户误配置绑定外部地址或反向代理错误）

### Layer 3: Agent Runtime（Agent运行时）

- **核心库**：Pi Agent Core
- **处理流程**：
  1. Session Resolution — 映射消息来源到会话ID（main/dm/group）
  2. Context Assembly — 加载会话历史、构建System Prompt、向量嵌入语义搜索
  3. Inference Loop — 流式发送到LLM → 拦截工具调用 → 执行工具 → 持久化结果
  4. Model Failover — 检测到速率限制时自动切换模型提供商

### Layer 4: Tools & Execution（工具执行层）

- **内置工具**：Shell执行、浏览器自动化（CDP-based）、文件操作、定时任务（cron）
- **插件系统**：通过扩展注册自定义工具
- **Skills系统**：Markdown + YAML frontmatter定义的工作流
- **沙箱**：可选Docker沙箱，可配置为per-session或per-agent隔离

## 三、数据流（8步）

```
消息接收(Ingestion)
    → 访问控制(Access Control)
    → 会话解析(Session Resolution)
    → 上下文组装(Context Assembly)
    → 模型调用(Model Invocation)
    → 工具执行(Tool Execution)
    → 响应投递(Response Delivery)
    → 状态持久化(State Persistence)
```

会话数据存储路径：`~/.openclaw/agents/<agentId>/sessions/`，格式为JSON。

## 四、Harness Engineering能力评估

| Harness维度 | OpenClaw实现 | 评价 |
|------------|-------------|------|
| **内存管理** | MEMORY.md + 向量嵌入语义搜索 + 每日笔记 | 基本可用，但缺少结构化技能存储 |
| **工具编排** | 20+平台 + 数十个内置工具 + ClawHub技能生态（~3,984技能） | 丰富，但供应链风险极高 |
| **安全护栏** | Gateway Token + 设备配对 + 白名单 + @触发 | 默认薄弱，大量CVE和攻击面 |
| **验证机制** | 可选工具确认提示 + JSONL会话日志 | 最小化，可被用户关闭 |
| **可观测性** | JSONL文件存储，无聚合能力 | 需要自建SIEM集成 |
| **自纠正** | 无内置机制 | **致命短板** |
| **自进化** | 无内置机制 | **致命短板** |

## 五、安全风险全面清单

| 风险 | 详情 |
|------|------|
| **CVE-2026-25253**（CVSS 8.8） | 一键远程代码执行。恶意网页通过WebSocket握手窃取Gateway Token，执行任意Shell命令。已于2026.1.29修补 |
| **ClawHavoc供应链攻击** | 审计2,857个技能发现341个恶意上传（~12%），包含凭据窃取恶意软件（Atomic Stealer on macOS）。技能删除后会以新名称重新出现 |
| **Prompt注入** | **行业性未解决难题**。Zenity研究通过Google Doc隐藏指令，让OpenClaw创建Telegram后门。零直接访问目标系统即成功 |
| **InfoStealer定向攻击** | RedLine/Lumma/Vidar恶意软件专门针对`~/.openclaw/credentials/`目录 |
| **互联网暴露** | 21,639个Gateway实例暴露在公网（Censys 2026.1.31数据） |

## 六、框架评价

### 优势
- **生态繁荣**：247K Stars + ~3,984技能 + 活跃社区
- **上手极快**：Docker一键启动，5分钟可运行
- **多模型支持**：灵活切换LLM提供商，自动Failover
- **多平台覆盖**：20+聊天平台统一接入

### 不足
- **安全模型薄弱**：CVE/ClawHavoc/Prompt注入，默认配置不足以支撑生产环境
- **无内置幻觉控制**：没有Hallucination Gate、没有输出验证、没有环检测
- **无自进化能力**：Agent性能不随使用时间提升
- **供应链风险**：ClawHub 12%恶意技能
- **无合规框架**：无原生IdP集成、无审计聚合、无细粒度权限控制

**结论**：OpenClaw适合个人开发者和快速原型验证，**不建议直接用于核心网等高可靠性生产环境**。如需使用，必须在Docker沙箱 + 最小权限 + 审计日志 + 凭据保管 + SIEM集成等方面做大量加固。
