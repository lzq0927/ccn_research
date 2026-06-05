const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" x 7.5"
pres.title = "2026上半年AI技术趋势与云核心网高稳智能体启示";

// ── Color Palette (Clean White) ──
const C = {
  bg:       "FFFFFF",
  card:     "F5F7FA",
  cardDark: "E8ECF1",
  blue:     "1A56DB",
  blueDark: "1E3A5F",
  cyan:     "0891B2",
  orange:   "D97706",
  green:    "059669",
  red:      "DC2626",
  black:    "1F2937",
  dark:     "374151",
  gray:     "6B7280",
  lightGray:"9CA3AF",
  line:     "D1D5DB",
  white:    "FFFFFF",
};

const cardShadow = () => ({
  type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.08
});

function addCard(slide, x, y, w, h) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: C.line, width: 0.5 },
    shadow: cardShadow()
  });
}

function addHeader(slide, x, y, w, h, text, num) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h: h,
    fill: { color: C.blue }
  });
  slide.addText(num + "  " + text, {
    x: x + 0.15, y: y, w: w - 0.2, h: h,
    fontSize: 10, bold: true, fontFace: "Arial",
    color: C.blueDark, valign: "middle", margin: 0
  });
}

// ═══════════════════════════════════════
// SLIDE
// ═══════════════════════════════════════
const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── Title ──
slide.addText("2026上半年 AI技术趋势与云核心网高稳智能体启示", {
  x: 0.5, y: 0.3, w: 10, h: 0.5,
  fontSize: 22, bold: true, fontFace: "Arial",
  color: C.black, margin: 0
});

slide.addShape(pres.shapes.LINE, {
  x: 0.5, y: 0.82, w: 12.3, h: 0,
  line: { color: C.blue, width: 2 }
});

slide.addText("从“陪聊”到“干活”的Agent元年  |  幻觉消除技术突破  |  产业落地加速", {
  x: 0.5, y: 0.88, w: 10, h: 0.3,
  fontSize: 9.5, fontFace: "Arial",
  color: C.gray, margin: 0
});

// Date
slide.addText("2026.06", {
  x: 11.8, y: 0.3, w: 1.0, h: 0.4,
  fontSize: 12, bold: true, fontFace: "Arial",
  color: C.blue, align: "right", valign: "middle", margin: 0
});

// ═══ LAYOUT ═══
// Row1: y=1.35  h=2.55
// Row2: y=4.05  h=2.8
// Col1: x=0.5   w=4.1
// Col2: x=4.8   w=4.1
// Col3: x=9.1   w=4.1
const R1Y = 1.35, R2Y = 4.05;
const RH1 = 2.55, RH2 = 2.8;
const C1X = 0.5, C2X = 4.8, C3X = 9.1, CW = 4.1;
const HH = 0.32;

// ═══ SECTION 1: AI Trend Overview ═══
addCard(slide, C1X, R1Y, CW, RH1);
addHeader(slide, C1X + 0.1, R1Y + 0.08, CW - 0.2, HH, "2026 H1 AI趋势总览", "①");

const t1y = R1Y + HH + 0.15;
const trendItems = [
  { text: "Agent元年：从对话式AI → 行动式Agent范式转移", options: { fontSize: 8, color: C.dark, fontFace: "Arial", bullet: true, breakLine: true } },
  { text: "OpenClaw 247K★爆火，Hermes 2240亿token/天", options: { fontSize: 8, color: C.dark, fontFace: "Arial", bullet: true, breakLine: true } },
  { text: "华为MWC2026发布AgenticCore，核心网+Agent商用", options: { fontSize: 8, color: C.dark, fontFace: "Arial", bullet: true, breakLine: true } },
  { text: "L4自智网络进入规模化部署阶段", options: { fontSize: 8, color: C.dark, fontFace: "Arial", bullet: true } },
];
slide.addText(trendItems, {
  x: C1X + 0.2, y: t1y, w: CW - 0.4, h: 0.8,
  valign: "top", paraSpaceAfter: 2, margin: 0
});

// Trend table
const tblY = t1y + 0.85;
slide.addText("趋势对比", {
  x: C1X + 0.2, y: tblY, w: 1.5, h: 0.2,
  fontSize: 7, bold: true, color: C.blue, fontFace: "Arial", margin: 0
});

const hdrOpts = { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 7, fontFace: "Arial" };
const cellA = { fill: { color: C.white }, color: C.dark, fontSize: 7, fontFace: "Arial" };
const cellB = { fill: { color: C.card }, color: C.dark, fontSize: 7, fontFace: "Arial" };
const hlNew = { fill: { color: C.white }, color: C.blue, fontSize: 7, fontFace: "Arial", bold: true };
const hlNewB = { fill: { color: C.card }, color: C.blue, fontSize: 7, fontFace: "Arial", bold: true };

slide.addTable([
  [{ text: "维度", options: hdrOpts }, { text: "2025", options: hdrOpts }, { text: "2026", options: hdrOpts }],
  [{ text: "交互", options: cellB }, { text: "问答对话", options: cellB }, { text: "自主执行", options: hlNewB }],
  [{ text: "部署", options: cellA }, { text: "云端SaaS", options: cellA }, { text: "本地/私有化", options: hlNew }],
  [{ text: "焦点", options: cellB }, { text: "模型能力", options: cellB }, { text: "安全/可靠性", options: hlNewB }],
], {
  x: C1X + 0.2, y: tblY + 0.22, w: CW - 0.4,
  colW: [0.8, 1.2, 1.4],
  border: { pt: 0.5, color: C.line },
  margin: [2, 4, 2, 4]
});

// ═══ SECTION 2: OpenClaw vs Hermes ═══
addCard(slide, C2X, R1Y, CW, RH1);
addHeader(slide, C2X + 0.1, R1Y + 0.08, CW - 0.2, HH, "OpenClaw vs Hermes", "②");

const t2y = R1Y + HH + 0.15;

// OpenClaw
slide.addText("OpenClaw", {
  x: C2X + 0.2, y: t2y, w: CW - 0.4, h: 0.2,
  fontSize: 8.5, bold: true, color: C.red, fontFace: "Arial", margin: 0
});
slide.addText([
  { text: "247K★ | 奥地利 | Hub-Spoke四层架构", options: { fontSize: 7, color: C.dark, fontFace: "Arial", breakLine: true } },
  { text: "安全：CVE-2026-25253 (CVSS 8.8)，ClawHub 12%恶意技能", options: { fontSize: 7, color: C.red, fontFace: "Arial", breakLine: true } },
  { text: "幻觉控制：无内置机制 ⚠", options: { fontSize: 7, color: C.red, fontFace: "Arial" } },
], { x: C2X + 0.2, y: t2y + 0.22, w: CW - 0.4, h: 0.6, valign: "top", paraSpaceAfter: 1, margin: 0 });

// Divider
slide.addShape(pres.shapes.LINE, {
  x: C2X + 0.2, y: t2y + 0.88, w: CW - 0.4, h: 0,
  line: { color: C.line, width: 0.5, dashType: "dash" }
});

// Hermes
slide.addText("Hermes Agent (NousResearch)", {
  x: C2X + 0.2, y: t2y + 0.95, w: CW - 0.4, h: 0.2,
  fontSize: 8.5, bold: true, color: C.green, fontFace: "Arial", margin: 0
});
slide.addText([
  { text: "OpenRouter #1 | 多模型协作 + 子Agent并行", options: { fontSize: 7, color: C.dark, fontFace: "Arial", breakLine: true } },
  { text: "核心：幻觉门控(Hallucination Gate)", options: { fontSize: 7, color: C.green, fontFace: "Arial", breakLine: true } },
  { text: "子Agent隔离 + 目标锁定 + 自进化学习循环 ✓", options: { fontSize: 7, color: C.green, fontFace: "Arial" } },
], { x: C2X + 0.2, y: t2y + 1.17, w: CW - 0.4, h: 0.6, valign: "top", paraSpaceAfter: 1, margin: 0 });

// ═══ SECTION 3: Hallucination Tech Stack ═══
addCard(slide, C3X, R1Y, CW, RH1);
addHeader(slide, C3X + 0.1, R1Y + 0.08, CW - 0.2, HH, "幻觉消除技术栈与基准数据", "③");

// Vectara table
const t3y = R1Y + HH + 0.15;
slide.addText("Vectara HHEM 幻觉率基准 (2026中)", {
  x: C3X + 0.2, y: t3y, w: CW - 0.4, h: 0.2,
  fontSize: 7, bold: true, color: C.blue, fontFace: "Arial", margin: 0
});

const grn = { fill: { color: C.card }, color: C.green, fontSize: 7, fontFace: "Arial", bold: true };
const org = { fill: { color: C.white }, color: C.orange, fontSize: 7, fontFace: "Arial" };
const orgB = { fill: { color: C.card }, color: C.orange, fontSize: 7, fontFace: "Arial" };

slide.addTable([
  [{ text: "模型", options: hdrOpts }, { text: "幻觉率", options: hdrOpts }, { text: "适用", options: hdrOpts }],
  [{ text: "4个前沿模型", options: { ...grn, fill: { color: C.white } } }, { text: "<1%", options: { ...grn, fill: { color: C.white } } }, { text: "受限领域", options: { ...cellA, color: C.gray } }],
  [{ text: "GPT-5.4 Mini", options: cellB }, { text: "~5.5%", options: orgB }, { text: "高频巡检", options: { ...cellB, color: C.gray } }],
  [{ text: "GPT-5.5", options: cellA }, { text: "~9.3%", options: org }, { text: "推理/编码", options: { ...cellA, color: C.gray } }],
  [{ text: "Claude Opus 4.7", options: cellB }, { text: "低*", options: { ...grn } }, { text: "事实查询★", options: { ...cellB, color: C.gray } }],
], {
  x: C3X + 0.2, y: t3y + 0.22, w: CW - 0.4,
  colW: [1.3, 0.7, 1.3],
  border: { pt: 0.5, color: C.line },
  margin: [2, 3, 2, 3]
});

// 6-layer stack
const stkY = t3y + 1.35;
slide.addText("六层幻觉防御栈", {
  x: C3X + 0.2, y: stkY, w: CW - 0.4, h: 0.18,
  fontSize: 7, bold: true, color: C.blue, fontFace: "Arial", margin: 0
});

const layers = [
  { text: "L6 人机确认", color: C.blueDark },
  { text: "L5 优雅拒绝", color: "2563EB" },
  { text: "L4 幻觉门控", color: C.blue },
  { text: "L3 多Agent分工", color: C.cyan },
  { text: "L2 RAG知识落地", color: "0D9488" },
  { text: "L1 低幻觉模型", color: C.green },
];
const lH = 0.12, lG = 0.015;
layers.forEach((l, i) => {
  const ly = stkY + 0.2 + (layers.length - 1 - i) * (lH + lG);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: C3X + 0.25, y: ly, w: CW - 0.6, h: lH,
    fill: { color: l.color }
  });
  slide.addText(l.text, {
    x: C3X + 0.25, y: ly, w: CW - 0.6, h: lH,
    fontSize: 5.5, bold: true, color: C.white, fontFace: "Arial",
    valign: "middle", margin: [0, 0, 0, 4]
  });
});

// ═══ SECTION 4: Recommended Architecture ═══
const s4w = CW * 2 + 0.3;
addCard(slide, C1X, R2Y, s4w, RH2);
addHeader(slide, C1X + 0.1, R2Y + 0.08, s4w - 0.2, HH, "云核心网高稳智能体推荐架构", "④");

const ax = C1X + 0.2;
const ay = R2Y + HH + 0.15;
const aw = s4w - 0.4;
const bH = 0.38, bG = 0.1;

// 4 Agent boxes
const agents = [
  { label: "感知Agent", sub: "告警/监控/拓扑", color: "1E40AF" },
  { label: "分析Agent", sub: "根因/趋势/关联", color: "1D4ED8" },
  { label: "决策Agent", sub: "处置/变更/容量", color: "2563EB" },
  { label: "执行Agent", sub: "安全沙箱执行", color: "3B82F6" },
];
const bW = (aw - bG * 3) / 4;
agents.forEach((a, i) => {
  const bx = ax + i * (bW + bG);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: bx, y: ay, w: bW, h: bH,
    fill: { color: a.color }
  });
  slide.addText([
    { text: a.label, options: { fontSize: 8, bold: true, color: C.white, fontFace: "Arial", breakLine: true } },
    { text: a.sub, options: { fontSize: 6, color: "DBEAFE", fontFace: "Arial" } }
  ], { x: bx, y: ay, w: bW, h: bH, valign: "middle", align: "center", margin: 0 });

  if (i < 3) {
    slide.addText("→", {
      x: bx + bW - 0.05, y: ay, w: bG + 0.1, h: bH,
      fontSize: 14, color: C.orange, fontFace: "Arial",
      valign: "middle", align: "center", margin: 0
    });
  }
});

// Gate layer
const gy = ay + bH + bG;
slide.addShape(pres.shapes.RECTANGLE, {
  x: ax, y: gy, w: aw, h: 0.25,
  fill: { color: "FEF3C7" },
  line: { color: C.orange, width: 0.75 }
});
slide.addText("⚠ 幻觉门控层 (Hallucination Gate) — 每层输出验证后才传递，阻止错误级联传播", {
  x: ax, y: gy, w: aw, h: 0.25,
  fontSize: 7, bold: true, color: "92400E", fontFace: "Arial",
  valign: "middle", margin: [0, 6, 0, 6]
});

// RAG + Learning
const by = gy + 0.35;
const halfW = (aw - bG) / 2;

slide.addShape(pres.shapes.RECTANGLE, {
  x: ax, y: by, w: halfW, h: 0.5,
  fill: { color: C.cardDark },
  line: { color: C.line, width: 0.5 }
});
slide.addText([
  { text: "RAG知识库", options: { fontSize: 7.5, bold: true, color: C.cyan, fontFace: "Arial", breakLine: true } },
  { text: "网络拓扑 | 告警库 | 历史工单 | 配置数据 | 运维规范", options: { fontSize: 6, color: C.gray, fontFace: "Arial" } }
], { x: ax, y: by, w: halfW, h: 0.5, valign: "middle", margin: [0, 8, 0, 8] });

slide.addShape(pres.shapes.RECTANGLE, {
  x: ax + halfW + bG, y: by, w: halfW, h: 0.5,
  fill: { color: C.cardDark },
  line: { color: C.line, width: 0.5 }
});
slide.addText([
  { text: "自进化学习循环 (Closed Learning)", options: { fontSize: 7.5, bold: true, color: C.green, fontFace: "Arial", breakLine: true } },
  { text: "经验提取 → 技能创建 → [人工审核] → 技能复用", options: { fontSize: 6, color: C.gray, fontFace: "Arial" } }
], { x: ax + halfW + bG, y: by, w: halfW, h: 0.5, valign: "middle", margin: [0, 8, 0, 8] });

// 4 insight badges
const iy = by + 0.6;
const iw = (aw - bG * 3) / 4;
const badges = [
  { icon: "确定性", text: "宁可拒绝\n不可幻觉", color: C.red },
  { icon: "自闭环", text: "多Agent分工\n+ 门控验证", color: C.cyan },
  { icon: "自优化", text: "经验学习\n+ 人工审核", color: C.green },
  { icon: "高稳定", text: "资源隔离\n+ 分层防御", color: C.blue },
];
badges.forEach((b, i) => {
  const ix = ax + i * (iw + bG);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: ix, y: iy, w: iw, h: 0.5,
    fill: { color: C.white },
    line: { color: b.color, width: 1 }
  });
  slide.addText([
    { text: b.icon, options: { fontSize: 7.5, bold: true, color: b.color, fontFace: "Arial", breakLine: true } },
    { text: b.text, options: { fontSize: 5.5, color: C.dark, fontFace: "Arial" } }
  ], { x: ix, y: iy, w: iw, h: 0.5, valign: "middle", align: "center", margin: 0 });
});

// ═══ SECTION 5: Insights + Model Selection ═══
addCard(slide, C3X, R2Y, CW, RH2);
addHeader(slide, C3X + 0.1, R2Y + 0.08, CW - 0.2, HH, "四大启示与行动建议", "⑤");

const s5y = R2Y + HH + 0.15;
const s5h = 0.38;
const s5g = 0.06;

const cards = [
  { title: "① 确定性优先", body: "优雅拒绝 > 编造答案，3-8%拒绝率换0%幻觉", color: C.red },
  { title: "② 自闭环控制", body: "感知→分析→决策→执行→反馈，每步门控验证", color: C.cyan },
  { title: "③ 自优化进化", body: "Closed Learning Loop + 新技能人工审核后上线", color: C.green },
  { title: "④ 高稳定防线", body: "子Agent隔离 + 多模型Failover + SIEM监控", color: C.blue },
];
cards.forEach((c, i) => {
  const cy = s5y + i * (s5h + s5g);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: C3X + 0.15, y: cy, w: CW - 0.3, h: s5h,
    fill: { color: C.white },
    line: { color: C.line, width: 0.5 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: C3X + 0.15, y: cy, w: 0.05, h: s5h,
    fill: { color: c.color }
  });
  slide.addText([
    { text: c.title, options: { fontSize: 7.5, bold: true, color: c.color, fontFace: "Arial", breakLine: true } },
    { text: c.body, options: { fontSize: 6.5, color: C.dark, fontFace: "Arial" } }
  ], { x: C3X + 0.3, y: cy, w: CW - 0.55, h: s5h, valign: "middle", margin: 0 });
});

// Model selection
const msY = s5y + 4 * (s5h + s5g) + 0.08;
slide.addText("模型选择矩阵", {
  x: C3X + 0.2, y: msY, w: CW - 0.4, h: 0.18,
  fontSize: 7, bold: true, color: C.blue, fontFace: "Arial", margin: 0
});

slide.addTable([
  [{ text: "场景", options: hdrOpts }, { text: "推荐模型", options: hdrOpts }],
  [{ text: "事实查询", options: cellB }, { text: "Claude Opus 4.7", options: { ...cellB, color: C.green, bold: true } }],
  [{ text: "故障推理", options: cellA }, { text: "GPT-5.5+门控", options: { ...cellA, color: C.orange } }],
  [{ text: "高频巡检", options: cellB }, { text: "GPT-5.4 Mini", options: { ...cellB, color: C.green, bold: true } }],
], {
  x: C3X + 0.2, y: msY + 0.2, w: CW - 0.4,
  colW: [1.2, 2.1],
  border: { pt: 0.5, color: C.line },
  margin: [2, 4, 2, 4]
});

// ── Footer ──
slide.addShape(pres.shapes.LINE, {
  x: 0.5, y: 7.15, w: 12.3, h: 0,
  line: { color: C.line, width: 0.5 }
});
slide.addText("数据来源: Vectara HHEM | arXiv:2603.07728 | 华为AgenticCore (MWC2026) | NousResearch Hermes Agent | GitHub OpenClaw | Towards AI | Suprmind", {
  x: 0.5, y: 7.2, w: 12.3, h: 0.25,
  fontSize: 5.5, color: C.lightGray, fontFace: "Arial",
  valign: "top", margin: 0
});

// ── Write ──
pres.writeFile({ fileName: "D:/code/ccn_research/ccn_research/output/ai_tech_insight_2026h1/ai_trend_vs_ccn_agent_white.pptx" })
  .then(() => console.log("White PPTX created!"))
  .catch(err => console.error("Error:", err));
