const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Harness Engineering深度对勘";

const C = {
  bg:"FFFFFF", card:"F5F7FA", cardD:"E8ECF1", blue:"1A56DB", blueD:"1E3A5F",
  cyan:"0891B2", orange:"D97706", green:"059669", red:"DC2626",
  black:"1F2937", dark:"374151", gray:"6B7280", lgray:"9CA3AF", line:"D1D5DB", white:"FFFFFF"
};
const shd = () => ({type:"outer",color:"000000",blur:4,offset:1,angle:135,opacity:0.08});

const slide = pres.addSlide();
slide.background = {color:C.bg};

// Title
slide.addText("Harness Engineering 深度对勘", {
  x:0.5,y:0.25,w:10,h:0.5,fontSize:22,bold:true,fontFace:"Arial",color:C.black,margin:0
});
slide.addShape(pres.shapes.LINE,{x:0.5,y:0.78,w:12.3,h:0,line:{color:C.blue,width:2}});
slide.addText("OpenClaw vs Hermes 七阶段对勘 | 工业落地能力评估 | 云核心网高稳智能体五大启示", {
  x:0.5,y:0.85,w:12,h:0.28,fontSize:9,fontFace:"Arial",color:C.gray,margin:0
});
slide.addText("2026.06", {x:11.8,y:0.25,w:1,h:0.4,fontSize:12,bold:true,fontFace:"Arial",color:C.blue,align:"right",valign:"middle",margin:0});

// ── What is Harness ──
slide.addShape(pres.shapes.RECTANGLE,{x:0.5,y:1.25,w:12.3,h:0.45,fill:{color:C.card},line:{color:C.line,width:0.5},shadow:shd()});
slide.addText([
  {text:"Harness Engineering ",options:{fontSize:8.5,bold:true,color:C.blue,fontFace:"Arial"}},
  {text:"= 模型之外的一切（工具编排·内存·护栏·验证·状态·可观测性）。",options:{fontSize:8,color:C.dark,fontFace:"Arial"}},
  {text:"  Model=CPU, Harness=OS。仅改Harness可让Agent排名变动20+位（Terminal Bench）",options:{fontSize:7.5,color:C.gray,fontFace:"Arial"}},
],{x:0.7,y:1.25,w:11.9,h:0.45,valign:"middle",margin:0});

// ── 7-Stage Lifecycle Flow ──
const fy = 1.85, fh = 0.72;
slide.addShape(pres.shapes.RECTANGLE,{x:0.5,y:fy,w:12.3,h:fh+0.2,fill:{color:C.card},line:{color:C.line,width:0.5},shadow:shd()});
slide.addText("七阶段生命周期（Lifecycle）", {x:0.7,y:fy+0.02,w:5,h:0.22,fontSize:8,bold:true,color:C.blueD,fontFace:"Arial",margin:0});

const stages = [
  {n:"S1",l:"初始化",sub:"权限·沙箱·任务分解",c:C.blueD},
  {n:"S2",l:"前馈引导",sub:"AGENTS.md·RAG·目标锁定",c:"1D4ED8"},
  {n:"S3",l:"拦截执行",sub:"工具门控·沙箱执行",c:"2563EB"},
  {n:"S4",l:"自纠正",sub:"幻觉门控·Ralph Loop",c:C.orange},
  {n:"S5",l:"验证门控",sub:"DST·TLA+·人工确认",c:C.red},
  {n:"S6",l:"状态持久",sub:"Progress File·技能存储",c:C.green},
  {n:"S7",l:"持续演进",sub:"Closed Learning·漂移检测",c:C.cyan},
];
const sw = 1.58, sg = 0.12, sx = 0.7, sy = fy + 0.28;
stages.forEach((s,i)=>{
  const bx = sx + i*(sw+sg);
  slide.addShape(pres.shapes.RECTANGLE,{x:bx,y:sy,w:sw,h:fh-0.15,fill:{color:s.c}});
  slide.addText([
    {text:s.n+" "+s.l,options:{fontSize:7.5,bold:true,color:C.white,fontFace:"Arial",breakLine:true}},
    {text:s.sub,options:{fontSize:5.5,color:"E0E0E0",fontFace:"Arial"}},
  ],{x:bx,y:sy,w:sw,h:fh-0.15,valign:"middle",align:"center",margin:0});
  if(i<6) slide.addText("→",{x:bx+sw-0.02,y:sy,w:sg+0.04,h:fh-0.15,fontSize:10,color:C.orange,fontFace:"Arial",valign:"middle",align:"center",margin:0});
});

// Feedback arrow label
slide.addText("◄─────── 闭环反馈 ───────  持续学习循环 ◄────────────────", {
  x:0.7,y:sy+fh-0.1,w:11.8,h:0.2,fontSize:6,color:C.lgray,fontFace:"Arial",align:"center",margin:0
});

// ── Comparison Table ──
const ty = 2.95;
slide.addText("OpenClaw vs Hermes 逐阶段对勘（工业落地评估）", {
  x:0.5,y:ty,w:8,h:0.22,fontSize:8,bold:true,color:C.blueD,fontFace:"Arial",margin:0
});

const hdr = {fill:{color:C.blueD},color:C.white,bold:true,fontSize:6.5,fontFace:"Arial"};
const cA = {fill:{color:C.white},color:C.dark,fontSize:6.5,fontFace:"Arial"};
const cB = {fill:{color:C.card},color:C.dark,fontSize:6.5,fontFace:"Arial"};
const rA = {fill:{color:C.white},color:C.red,fontSize:6.5,fontFace:"Arial"};
const rB = {fill:{color:C.card},color:C.red,fontSize:6.5,fontFace:"Arial"};
const gA = {fill:{color:C.white},color:C.green,fontSize:6.5,fontFace:"Arial",bold:true};
const gB = {fill:{color:C.card},color:C.green,fontSize:6.5,fontFace:"Arial",bold:true};

const tbl = [
  [{text:"阶段",options:hdr},{text:"OpenClaw",options:hdr},{text:"评分",options:hdr},{text:"Hermes Agent",options:hdr},{text:"评分",options:hdr}],
  [{text:"S1 初始化",options:cB},{text:"5分钟上手,但CVE暴露21K实例",options:cB},{text:"★★★",options:cB},{text:"子Agent隔离沙箱,安全优先",options:cB},{text:"★★★",options:cB}],
  [{text:"S2 前馈",options:cA},{text:"ClawHub技能丰富但12%恶意",options:rA},{text:"★★★",options:cA},{text:"/goal目标锁定,防止漂移",options:gA},{text:"★★★★",options:cA}],
  [{text:"S3 执行",options:cB},{text:"CVE-2026-25253 CVSS 8.8",options:rB},{text:"★★★",options:cB},{text:"子Agent聚焦上下文,减少溢出幻觉",options:cB},{text:"★★★★",options:cB}],
  [{text:"S4 自纠正",options:cA},{text:"无内置机制 ⚠",options:rA},{text:"★",options:cA},{text:"幻觉门控+Ralph Loop",options:gA},{text:"★★★★★",options:cA}],
  [{text:"S5 验证",options:cB},{text:"可选确认,易被关闭",options:rB},{text:"★★",options:cB},{text:"内置验证检查点",options:cB},{text:"★★★★",options:cB}],
  [{text:"S6 持久",options:cA},{text:"MEMORY.md,明文凭据风险",options:cA},{text:"★★★",options:cA},{text:"技能存储,结构化持久",options:gA},{text:"★★★★",options:cA}],
  [{text:"S7 演进",options:cB},{text:"无自进化机制",options:rB},{text:"★",options:cB},{text:"Closed Learning Loop ★",options:gB},{text:"★★★★★",options:cB}],
  [{text:"总分",options:{...hdr,fontSize:7}},{text:"21/35 — 适合开发/个人",options:{...cA,color:C.red,bold:true,fontSize:6.5}},{text:"",options:cA},{text:"32/35 — 适合工业/核心网",options:{...cA,color:C.green,bold:true,fontSize:6.5}},{text:"",options:cA}],
];
slide.addTable(tbl,{
  x:0.5,y:ty+0.25,w:12.3,
  colW:[1.1,3.2,0.7,3.4,0.7],
  border:{pt:0.5,color:C.line},
  margin:[2,3,2,3]
});

// ── Key Findings ──
const ky = 5.55;
slide.addText("关键发现", {x:0.5,y:ky,w:2,h:0.2,fontSize:8,bold:true,color:C.blueD,fontFace:"Arial",margin:0});

const findings = [
  {text:"OpenClaw在S1-S3(初始化·前馈·执行)体验优秀，但S4-S7(自纠正·验证·持久·演进)是致命短板", color:C.red},
  {text:"Hermes的幻觉门控(Hallucination Gate)和Ralph Loop解决了多Agent管道中的\"静默腐败\"问题", color:C.green},
  {text:"Hermes的Closed Learning Loop让Agent越用越准 — 2026.5.10超OpenClaw成为OpenRouter #1", color:C.green},
];
findings.forEach((f,i)=>{
  const fy2 = ky + 0.25 + i*0.25;
  slide.addShape(pres.shapes.RECTANGLE,{x:0.5,y:fy2,w:0.05,h:0.2,fill:{color:f.color}});
  slide.addText(f.text,{x:0.65,y:fy2,w:11.8,h:0.2,fontSize:7,color:C.dark,fontFace:"Arial",valign:"middle",margin:0});
});

// ── 5 Insights for CCN ──
const iy = 6.35;
slide.addText("云核心网高稳智能体五大启示", {x:0.5,y:iy,w:5,h:0.2,fontSize:8,bold:true,color:C.blueD,fontFace:"Arial",margin:0});

const insights = [
  {title:"消除幻觉",body:"幻觉门控+S4→LLM-as-Judge→DST→人机确认,宁可3-8%拒绝也不0.1%泄漏",color:C.red},
  {title:"确定性",body:"Interception Loop+ConfirmationStrategy+DST确定性仿真,核心网操作形式化",color:C.orange},
  {title:"自闭环",body:"7阶段全闭环:感知→分析→决策→执行→验证→反馈→学习→再感知",color:C.blue},
  {title:"自演进",body:"Closed Learning+GC Agent+Steering Loop,新技能经人工审核后复用",color:C.green},
  {title:"高稳定",body:"多模型Failover+子Agent隔离+沙箱+RAG+全链路可观测+漂移检测",color:C.cyan},
];
const iw = 2.34, ig = 0.1;
insights.forEach((ins,i)=>{
  const ix = 0.5 + i*(iw+ig);
  slide.addShape(pres.shapes.RECTANGLE,{x:ix,y:iy+0.25,w:iw,h:0.65,fill:{color:C.white},line:{color:ins.color,width:1}});
  slide.addShape(pres.shapes.RECTANGLE,{x:ix,y:iy+0.25,w:iw,h:0.22,fill:{color:ins.color}});
  slide.addText(ins.title,{x:ix,y:iy+0.25,w:iw,h:0.22,fontSize:7,bold:true,color:C.white,fontFace:"Arial",align:"center",valign:"middle",margin:0});
  slide.addText(ins.body,{x:ix+0.05,y:iy+0.5,w:iw-0.1,h:0.38,fontSize:5.5,color:C.dark,fontFace:"Arial",valign:"top",margin:0});
});

// Footer
slide.addShape(pres.shapes.LINE,{x:0.5,y:7.25,w:12.3,h:0,line:{color:C.line,width:0.5}});
slide.addText("来源: deepset | Martin Fowler | OpenAI | Datadog | Firecrawl | AIQuinta | OpenClaw Docs | Hermes Agent(NousResearch) | NVIDIA | 华为AgenticCore(MWC2026)", {
  x:0.5,y:7.28,w:12.3,h:0.2,fontSize:5.5,color:C.lgray,fontFace:"Arial",margin:0
});

pres.writeFile({fileName:"D:/code/ccn_research/ccn_research/output/ai_tech_insight_2026h1/harness_engineering_vs_ccn.pptx"})
  .then(()=>console.log("PPTX created!"))
  .catch(e=>console.error("Error:",e));
