const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" x 7.5"
pres.title = "2026上半年AI技术趋势与云核心网高稳智能体启示";

// ── Color Palette (Deep Navy Professional) ──
const C = {
  bg:        "0D1B2A",  // deep navy background
  card:      "152238",  // card background
  cardLight: "1B2D45",  // slightly lighter card
  blue:      "1976D2",  // primary blue
  blueDark:  "0D47A1",  // dark blue accent
  cyan:      "00BCD4",  // teal/cyan accent
  orange:    "FF8F00",  // orange highlight
  green:     "43A047",  // green
  red:       "E53935",  // red/warning
  white:     "FFFFFF",
  gray:      "B0BEC5",  // muted text
  lightGray: "78909C",  // dimmer text
  headerBg:  "1565C0",  // section header bg
};

// ── Helper: fresh shadow object ──
const cardShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.25
});

// ── Helper: section card ──
function addCard(slide, x, y, w, h) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.card },
    shadow: cardShadow()
  });
}

// ── Helper: section header bar ──
function addHeader(slide, x, y, w, h, text, iconChar) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.headerBg }
  });
  slide.addText([
    { text: iconChar + "  ", options: { fontSize: 10, bold: true } },
    { text: text, options: { fontSize: 10.5, bold: true, fontFace: "Arial" } }
  ], {
    x: x + 0.15, y: y, w: w - 0.3, h: h,
    color: C.white, valign: "middle", margin: 0
  });
}

// ── Helper: compact bullet list ──
function addBullets(slide, x, y, w, h, items, fontSize = 8) {
  const texts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    return {
      text: item,
      options: {
        bullet: true,
        breakLine: !isLast,
        fontSize: fontSize,
        color: C.white,
        fontFace: "Arial"
      }
    };
  });
  slide.addText(texts, {
    x, y, w, h,
    valign: "top",
    paraSpaceAfter: 3,
    margin: [2, 4, 2, 4]
  });
}

// ── Helper: key-value row ──
function addKV(slide, x, y, w, h, pairs, fs = 7.5) {
  const texts = [];
  pairs.forEach((p, i) => {
    texts.push({
      text: p.label + " ",
      options: { fontSize: fs, bold: true, color: C.cyan, breakLine: true, fontFace: "Arial" }
    });
    texts.push({
      text: p.value,
      options: { fontSize: fs, color: C.white, breakLine: i < pairs.length - 1, fontFace: "Arial" }
    });
  });
  slide.addText(texts, { x, y, w, h, valign: "top", margin: [2, 4, 2, 4], paraSpaceAfter: 2 });
}

// ══════════════════════════════════════════════
// SLIDE 1 (only slide)
// ══════════════════════════════════════════════
const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── Title Bar ──
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 13.3, h: 0.85,
  fill: { color: C.blueDark }
});
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0.82, w: 13.3, h: 0.04,
  fill: { color: C.cyan }
});
slide.addText("2026上半年 AI技术趋势与云核心网高稳智能体启示", {
  x: 0.5, y: 0.1, w: 10, h: 0.45,
  fontSize: 20, bold: true, fontFace: "Arial Black",
  color: C.white, margin: 0
});
slide.addText("从“陪聊”到“干活”的Agent元年 | 幻觉消除技术突破 | 产业落地加速", {
  x: 0.5, y: 0.5, w: 10, h: 0.3,
  fontSize: 9.5, fontFace: "Arial",
  color: C.gray, margin: 0
});
// Date tag
slide.addShape(pres.shapes.RECTANGLE, {
  x: 11.3, y: 0.2, w: 1.6, h: 0.4,
  fill: { color: C.cyan, transparency: 20 },
  rectRadius: 0.05
});
slide.addText("2026.06", {
  x: 11.3, y: 0.2, w: 1.6, h: 0.4,
  fontSize: 11, bold: true, fontFace: "Arial",
  color: C.white, align: "center", valign: "middle", margin: 0
});

// ═══ LAYOUT GRID ═══
// Row1: y=1.0  h=2.8
// Row2: y=3.95 h=2.8  (gap 0.15)
// Col1: x=0.3  w=4.15
// Col2: x=4.6  w=4.15
// Col3: x=8.9  w=4.15

const R1Y = 0.95, R2Y = 3.8, RH = 3.0;
const C1X = 0.3, C2X = 4.6, C3X = 8.9, CW = 4.15;
const HH = 0.32; // header height

// ═══ SECTION 1: 2026 H1 AI趋势总览 ═══
addCard(slide, C1X, R1Y, CW, RH);
addHeader(slide, C1X, R1Y, CW, HH, "2026 H1 AI趋势总览", "◆");

addBullets(slide, C1X + 0.05, R1Y + HH + 0.05, CW - 0.1, 1.0, [
  "Agent元年：从对话式AI → 行动式Agent范式转移",
  "OpenClaw 247K★ 爆火，Hermes Agent 2240亿token/天",
  "华为MWC2026发布AgenticCore，核心网+Agent商用",
  "L4自智网络进入规模化部署阶段",
], 7.5);

// Mini trend table
const ty = R1Y + HH + 1.2;
slide.addText("趋势对比", {
  x: C1X + 0.15, y: ty, w: 1.5, h: 0.25,
  fontSize: 7, bold: true, color: C.cyan, fontFace: "Arial", margin: 0
});

const tableRows = [
  [
    { text: "维度", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 6.5, fontFace: "Arial" } },
    { text: "2025", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 6.5, fontFace: "Arial" } },
    { text: "2026", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 6.5, fontFace: "Arial" } }
  ],
  [
    { text: "交互", options: { fill: { color: C.cardLight }, color: C.white, fontSize: 6.5, fontFace: "Arial" } },
    { text: "问答对话", options: { fill: { color: C.cardLight }, color: C.gray, fontSize: 6.5, fontFace: "Arial" } },
    { text: "自主执行", options: { fill: { color: C.cardLight }, color: C.cyan, fontSize: 6.5, fontFace: "Arial", bold: true } }
  ],
  [
    { text: "部署", options: { fill: { color: C.card }, color: C.white, fontSize: 6.5, fontFace: "Arial" } },
    { text: "云端SaaS", options: { fill: { color: C.card }, color: C.gray, fontSize: 6.5, fontFace: "Arial" } },
    { text: "本地/私有化", options: { fill: { color: C.card }, color: C.cyan, fontSize: 6.5, fontFace: "Arial", bold: true } }
  ],
  [
    { text: "焦点", options: { fill: { color: C.cardLight }, color: C.white, fontSize: 6.5, fontFace: "Arial" } },
    { text: "模型能力", options: { fill: { color: C.cardLight }, color: C.gray, fontSize: 6.5, fontFace: "Arial" } },
    { text: "安全/可靠性", options: { fill: { color: C.cardLight }, color: C.cyan, fontSize: 6.5, fontFace: "Arial", bold: true } }
  ],
];
slide.addTable(tableRows, {
  x: C1X + 0.15, y: ty + 0.25, w: CW - 0.3,
  colW: [0.8, 1.3, 1.5],
  border: { pt: 0.5, color: "1B3A5C" },
  margin: [1, 3, 1, 3]
});

// ═══ SECTION 2: OpenClaw vs Hermes ═══
addCard(slide, C2X, R1Y, CW, RH);
addHeader(slide, C2X, R1Y, CW, HH, "OpenClaw vs Hermes 深度对比", "◆");

addKV(slide, C2X + 0.05, R1Y + HH + 0.05, CW - 0.1, 2.2, [
  { label: "OpenClaw", value: "247K★ | 奥地利 | 已加入OpenAI" },
  { label: "", value: "Hub-Spoke四层架构, 20+平台, 自托管" },
  { label: "安全:", value: "CVE-2026-25253 (CVSS 8.8)" },
  { label: "", value: "ClawHub 12%恶意技能 | Prompt注入未解决" },
  { label: "幻觉控制:", value: "无内置机制 ⚠" },
  { label: "─────────────", value: "" },
  { label: "Hermes Agent", value: "NousResearch | OpenRouter #1" },
  { label: "", value: "多模型协作 + 子Agent并行" },
  { label: "核心创新:", value: "幻觉门控(Hallucination Gate)" },
  { label: "", value: "子Agent隔离 + 目标锁定(/goal)" },
  { label: "自进化:", value: "Closed Learning Loop ✓" },
], 7);

// ═══ SECTION 3: 幻觉消除技术栈 ═══
addCard(slide, C3X, R1Y, CW, RH);
addHeader(slide, C3X, R1Y, CW, HH, "幻觉消除技术栈与基准数据", "◆");

// Vectara benchmark mini-table
slide.addText("Vectara HHEM 幻觉率基准 (2026中)", {
  x: C3X + 0.15, y: R1Y + HH + 0.05, w: CW - 0.3, h: 0.22,
  fontSize: 7, bold: true, color: C.cyan, fontFace: "Arial", margin: 0
});

const benchRows = [
  [
    { text: "模型", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 6, fontFace: "Arial" } },
    { text: "幻觉率", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 6, fontFace: "Arial" } },
    { text: "适用", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 6, fontFace: "Arial" } }
  ],
  [
    { text: "4个前沿模型", options: { fill: { color: C.cardLight }, color: C.green, fontSize: 6, fontFace: "Arial", bold: true } },
    { text: "<1%", options: { fill: { color: C.cardLight }, color: C.green, fontSize: 6, fontFace: "Arial", bold: true } },
    { text: "受限领域", options: { fill: { color: C.cardLight }, color: C.gray, fontSize: 6, fontFace: "Arial" } }
  ],
  [
    { text: "GPT-5.4 Mini", options: { fill: { color: C.card }, color: C.white, fontSize: 6, fontFace: "Arial" } },
    { text: "~5.5%", options: { fill: { color: C.card }, color: C.orange, fontSize: 6, fontFace: "Arial" } },
    { text: "高频巡检", options: { fill: { color: C.card }, color: C.gray, fontSize: 6, fontFace: "Arial" } }
  ],
  [
    { text: "GPT-5.5", options: { fill: { color: C.cardLight }, color: C.white, fontSize: 6, fontFace: "Arial" } },
    { text: "~9.3%", options: { fill: { color: C.cardLight }, color: C.orange, fontSize: 6, fontFace: "Arial" } },
    { text: "推理/编码", options: { fill: { color: C.cardLight }, color: C.gray, fontSize: 6, fontFace: "Arial" } }
  ],
  [
    { text: "Claude Opus 4.7", options: { fill: { color: C.card }, color: C.white, fontSize: 6, fontFace: "Arial" } },
    { text: "低*", options: { fill: { color: C.card }, color: C.green, fontSize: 6, fontFace: "Arial", bold: true } },
    { text: "事实查询★", options: { fill: { color: C.card }, color: C.gray, fontSize: 6, fontFace: "Arial" } }
  ],
];
slide.addTable(benchRows, {
  x: C3X + 0.15, y: R1Y + HH + 0.3, w: CW - 0.3,
  colW: [1.3, 0.7, 1.3],
  border: { pt: 0.5, color: "1B3A5C" },
  margin: [1, 2, 1, 2]
});

// 6-layer defense stack
const stackY = R1Y + HH + 1.35;
slide.addText("六层幻觉防御栈", {
  x: C3X + 0.15, y: stackY, w: CW - 0.3, h: 0.2,
  fontSize: 7, bold: true, color: C.cyan, fontFace: "Arial", margin: 0
});

const layers = [
  { text: "L6 人机确认", color: C.blueDark },
  { text: "L5 优雅拒绝", color: "1A5276" },
  { text: "L4 幻觉门控", color: "1F6F8B" },
  { text: "L3 多Agent分工", color: "21838E" },
  { text: "L2 RAG知识落地", color: "239B76" },
  { text: "L1 低幻觉模型", color: C.green },
];
const layerH = 0.14;
const layerGap = 0.015;
layers.forEach((layer, i) => {
  const ly = stackY + 0.25 + (layers.length - 1 - i) * (layerH + layerGap);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: C3X + 0.2, y: ly, w: CW - 0.5, h: layerH,
    fill: { color: layer.color }
  });
  slide.addText(layer.text, {
    x: C3X + 0.2, y: ly, w: CW - 0.5, h: layerH,
    fontSize: 5.5, bold: true, color: C.white, fontFace: "Arial",
    valign: "middle", margin: [0, 0, 0, 4]
  });
});

// ═══ SECTION 4: 云核心网高稳智能体推荐架构 ═══
addCard(slide, C1X, R2Y, CW * 2 + 0.15, RH);
addHeader(slide, C1X, R2Y, CW * 2 + 0.15, HH, "云核心网高稳智能体推荐架构", "★");

// Architecture flow diagram
const archX = C1X + 0.2;
const archY = R2Y + HH + 0.12;
const archW = CW * 2 + 0.15 - 0.4;
const boxH = 0.35;
const boxGap = 0.08;

// Row 1: 4 agent boxes
const agentBoxes = [
  { label: "感知Agent", sub: "告警/监控/拓扑", color: "1565C0" },
  { label: "分析Agent", sub: "根因/趋势/关联", color: "1976D2" },
  { label: "决策Agent", sub: "处置/变更/容量", color: "1E88E5" },
  { label: "执行Agent", sub: "安全沙箱执行", color: C.cyan },
];
const boxW = (archW - boxGap * 3) / 4;
agentBoxes.forEach((box, i) => {
  const bx = archX + i * (boxW + boxGap);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: bx, y: archY, w: boxW, h: boxH,
    fill: { color: box.color }
  });
  slide.addText([
    { text: box.label, options: { fontSize: 7, bold: true, color: C.white, fontFace: "Arial", breakLine: true } },
    { text: box.sub, options: { fontSize: 5.5, color: "E0E0E0", fontFace: "Arial" } }
  ], { x: bx, y: archY, w: boxW, h: boxH, valign: "middle", margin: [0, 3, 0, 3], align: "center" });

  // Arrow between boxes
  if (i < 3) {
    slide.addText("→", {
      x: bx + boxW - 0.05, y: archY, w: boxGap + 0.1, h: boxH,
      fontSize: 12, color: C.orange, fontFace: "Arial",
      valign: "middle", align: "center", margin: 0
    });
  }
});

// Gate layer
const gateY = archY + boxH + boxGap;
slide.addShape(pres.shapes.RECTANGLE, {
  x: archX, y: gateY, w: archW, h: 0.25,
  fill: { color: C.orange, transparency: 15 }
});
slide.addText("⚠ 幻觉门控层 (Hallucination Gate) — 每层输出验证后才传递，阻止错误级联传播", {
  x: archX, y: gateY, w: archW, h: 0.25,
  fontSize: 6.5, bold: true, color: C.orange, fontFace: "Arial",
  valign: "middle", margin: [0, 6, 0, 6]
});

// Bottom: RAG + Learning Loop
const botY = gateY + 0.3;
const botW = (archW - boxGap) / 2;

// RAG box
slide.addShape(pres.shapes.RECTANGLE, {
  x: archX, y: botY, w: botW, h: 0.55,
  fill: { color: "1A3A5C" }
});
slide.addText([
  { text: "RAG知识库", options: { fontSize: 7, bold: true, color: C.cyan, fontFace: "Arial", breakLine: true } },
  { text: "网络拓扑 | 告警库 | 历史工单 | 配置数据 | 运维规范", options: { fontSize: 5.5, color: C.gray, fontFace: "Arial" } }
], { x: archX, y: botY, w: botW, h: 0.55, valign: "middle", margin: [0, 6, 0, 6] });

// Learning Loop box
slide.addShape(pres.shapes.RECTANGLE, {
  x: archX + botW + boxGap, y: botY, w: botW, h: 0.55,
  fill: { color: "1A3A5C" }
});
slide.addText([
  { text: "自进化学习循环 (Closed Learning)", options: { fontSize: 7, bold: true, color: C.green, fontFace: "Arial", breakLine: true } },
  { text: "经验提取 → 技能创建 → [人工审核] → 技能复用 → 效率提升", options: { fontSize: 5.5, color: C.gray, fontFace: "Arial" } }
], { x: archX + botW + boxGap, y: botY, w: botW, h: 0.55, valign: "middle", margin: [0, 6, 0, 6] });

// 4 insights summary
const insY = botY + 0.65;
const insW = (archW - boxGap * 3) / 4;
const insights = [
  { icon: "确定性", text: "宁可拒绝\n不可幻觉", color: C.red },
  { icon: "自闭环", text: "多Agent分工\n+ 门控验证", color: C.cyan },
  { icon: "自优化", text: "经验学习\n+ 人工审核", color: C.green },
  { icon: "高稳定", text: "资源隔离\n+ 分层防御", color: C.blue },
];
insights.forEach((ins, i) => {
  const ix = archX + i * (insW + boxGap);
  // Icon circle
  slide.addShape(pres.shapes.RECTANGLE, {
    x: ix, y: insY, w: insW, h: 0.5,
    fill: { color: "0D2A4A" },
    line: { color: ins.color, width: 1.2 }
  });
  slide.addText([
    { text: ins.icon, options: { fontSize: 7, bold: true, color: ins.color, fontFace: "Arial", breakLine: true } },
    { text: ins.text, options: { fontSize: 5.5, color: C.white, fontFace: "Arial" } }
  ], { x: ix, y: insY, w: insW, h: 0.5, valign: "middle", align: "center", margin: 0 });
});

// ═══ SECTION 5: 四大启示 + 模型选择 ═══
addCard(slide, C3X, R2Y, CW, RH);
addHeader(slide, C3X, R2Y, CW, HH, "四大启示与行动建议", "★");

// 4 insight cards stacked
const s5y = R2Y + HH + 0.06;
const s5h = 0.38;
const s5gap = 0.05;
const insightCards = [
  {
    title: "① 确定性优先",
    body: "优雅拒绝 > 编造答案，3-8%拒绝率换0%幻觉",
    accent: C.red
  },
  {
    title: "② 自闭环控制",
    body: "感知→分析→决策→执行→反馈，每步门控验证",
    accent: C.cyan
  },
  {
    title: "③ 自优化进化",
    body: "Closed Learning Loop + 新技能人工审核后上线",
    accent: C.green
  },
  {
    title: "④ 高稳定防线",
    body: "子Agent隔离 + 多模型Failover + SIEM监控",
    accent: C.blue
  },
];
insightCards.forEach((card, i) => {
  const cy = s5y + i * (s5h + s5gap);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: C3X + 0.1, y: cy, w: CW - 0.2, h: s5h,
    fill: { color: "0D2A4A" }
  });
  // Accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: C3X + 0.1, y: cy, w: 0.06, h: s5h,
    fill: { color: card.accent }
  });
  slide.addText([
    { text: card.title, options: { fontSize: 7.5, bold: true, color: card.accent, fontFace: "Arial", breakLine: true } },
    { text: card.body, options: { fontSize: 6.5, color: C.white, fontFace: "Arial" } }
  ], { x: C3X + 0.25, y: cy, w: CW - 0.45, h: s5h, valign: "middle", margin: 0 });
});

// Model selection matrix
const msY = s5y + 4 * (s5h + s5gap) + 0.05;
slide.addText("模型选择矩阵", {
  x: C3X + 0.15, y: msY, w: CW - 0.3, h: 0.2,
  fontSize: 7, bold: true, color: C.cyan, fontFace: "Arial", margin: 0
});

const modelRows = [
  [
    { text: "场景", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 5.5, fontFace: "Arial" } },
    { text: "推荐模型", options: { fill: { color: C.blueDark }, color: C.white, bold: true, fontSize: 5.5, fontFace: "Arial" } }
  ],
  [
    { text: "事实查询", options: { fill: { color: C.cardLight }, color: C.white, fontSize: 5.5, fontFace: "Arial" } },
    { text: "Claude Opus 4.7", options: { fill: { color: C.cardLight }, color: C.green, fontSize: 5.5, fontFace: "Arial", bold: true } }
  ],
  [
    { text: "故障推理", options: { fill: { color: C.card }, color: C.white, fontSize: 5.5, fontFace: "Arial" } },
    { text: "GPT-5.5+门控", options: { fill: { color: C.card }, color: C.orange, fontSize: 5.5, fontFace: "Arial" } }
  ],
  [
    { text: "高频巡检", options: { fill: { color: C.cardLight }, color: C.white, fontSize: 5.5, fontFace: "Arial" } },
    { text: "GPT-5.4 Mini", options: { fill: { color: C.cardLight }, color: C.green, fontSize: 5.5, fontFace: "Arial", bold: true } }
  ],
];
slide.addTable(modelRows, {
  x: C3X + 0.15, y: msY + 0.22, w: CW - 0.3,
  colW: [1.2, 2.0],
  border: { pt: 0.5, color: "1B3A5C" },
  margin: [1, 2, 1, 2]
});

// ── Footer ──
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 7.1, w: 13.3, h: 0.4,
  fill: { color: C.blueDark }
});
slide.addText("数据来源: Vectara HHEM | arXiv:2603.07728 | 华为AgenticCore (MWC2026) | NousResearch Hermes Agent | GitHub OpenClaw | Towards AI | Suprmind", {
  x: 0.3, y: 7.1, w: 12.7, h: 0.4,
  fontSize: 6, color: C.lightGray, fontFace: "Arial",
  valign: "middle", margin: 0
});

// ── Write file ──
pres.writeFile({ fileName: "D:/code/ccn_research/ccn_research/output/ai_tech_insight_2026h1/ai_trend_vs_ccn_agent.pptx" })
  .then(() => console.log("PPTX created successfully!"))
  .catch(err => console.error("Error:", err));
