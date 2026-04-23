"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Download, RotateCcw, CheckCircle, XCircle,
  Lightbulb, MessageSquare, Brain, Zap, Target,
  BarChart2, Award, Clock, TrendingUp, TrendingDown,
  ChevronDown, ChevronUp, Star, Loader2,
  BookOpen
} from "lucide-react";

function useCountUp(target, duration = 1200, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * (typeof target === "number" ? target : 0)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return val;
}

function ScoreRing({ score, max = 10, size = 140, stroke = 9, color, active, label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  const display = useCountUp(score, 1200, active);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setOffset(circ - (score / max) * circ), 250);
    return () => clearTimeout(t);
  }, [active, score, max, circ]);
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)", display:"block" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition:"stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:size>120?34:22, fontWeight:800, color, lineHeight:1 }}>{display}</span>
        {label && <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:3, letterSpacing:"0.05em" }}>{label}</span>}
      </div>
    </div>
  );
}

function Bar({ label, value, max = 100, color, delay = 0, active }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setW((value / max) * 100), delay);
    return () => clearTimeout(t);
  }, [active, value, max, delay]);
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:13 }}>
        <span style={{ color:"rgba(255,255,255,0.65)", fontWeight:500 }}>{label}</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color, fontWeight:600 }}>{value}%</span>
      </div>
      <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, borderRadius:99, background:`linear-gradient(90deg,${color}bb,${color})`, transition:`width 1s ${delay}ms cubic-bezier(0.34,1.56,0.64,1)`, boxShadow:`0 0 10px ${color}50` }}/>
      </div>
    </div>
  );
}

function QCard({ item, index, active }) {
  const [open, setOpen] = useState(index === 0);
  const s = item.score || item.rating || 7;
  const sc = s>=8?"#00d4aa":s>=6?"#818cf8":s>=4?"#fbbf24":"#f87171";
  return (
    <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, overflow:"hidden", marginBottom:10, animation:active?`slideUp 0.4s ${index*60}ms ease both`:"none", transition:"border-color 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(129,140,248,0.3)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", padding:"16px 20px", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
        <div style={{ width:34, height:34, borderRadius:9, flexShrink:0, background:`${sc}15`, border:`1px solid ${sc}35`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:sc }}>Q{index+1}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:14, fontWeight:600, color:"#f1f5f9", lineHeight:1.4, marginBottom:open?0:2 }}>{item.question}</p>
          {!open && item.answer && <p style={{ fontSize:12, color:"rgba(255,255,255,0.28)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.answer.slice(0,70)}…</p>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <span style={{ padding:"3px 10px", borderRadius:7, background:`${sc}12`, border:`1px solid ${sc}28`, fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:sc }}>{s}/10</span>
          {open?<ChevronUp size={15} color="rgba(255,255,255,0.3)"/>:<ChevronDown size={15} color="rgba(255,255,255,0.3)"/>}
        </div>
      </button>
      {open && (
        <div style={{ padding:"0 20px 20px", display:"flex", flexDirection:"column", gap:12 }}>
          {item.answer && <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:11, padding:14 }}><p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>YOUR ANSWER</p><p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.7 }}>{item.answer||"No answer recorded."}</p></div>}
          {item.feedback && <div style={{ background:"rgba(129,140,248,0.05)", border:"1px solid rgba(129,140,248,0.15)", borderRadius:11, padding:14 }}><p style={{ fontSize:11, fontWeight:700, color:"#818cf8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7, display:"flex", alignItems:"center", gap:5 }}><Brain size={11}/>AI FEEDBACK</p><p style={{ fontSize:14, color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>{item.feedback}</p></div>}
          {item.betterAnswer && <div style={{ background:"rgba(0,212,170,0.04)", border:"1px solid rgba(0,212,170,0.15)", borderRadius:11, padding:14 }}><p style={{ fontSize:11, fontWeight:700, color:"#00d4aa", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7, display:"flex", alignItems:"center", gap:5 }}><Lightbulb size={11}/>STRONGER ANSWER</p><p style={{ fontSize:14, color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>{item.betterAnswer}</p></div>}
          {(item.wordCount||item.fillerWords!==undefined) && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {item.wordCount>0 && <div style={{ background:"rgba(129,140,248,0.1)", border:"1px solid rgba(129,140,248,0.25)", borderRadius:7, padding:"5px 10px", display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:10, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.07em" }}>Words</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:"#818cf8" }}>{item.wordCount}</span></div>}
              {item.wpm>0 && <div style={{ background:"rgba(0,212,170,0.1)", border:"1px solid rgba(0,212,170,0.25)", borderRadius:7, padding:"5px 10px", display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:10, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.07em" }}>WPM</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:"#00d4aa" }}>{item.wpm}</span></div>}
              {item.fillerWords!==undefined && <div style={{ background:item.fillerWords>3?"rgba(248,113,113,0.1)":"rgba(251,191,36,0.1)", border:`1px solid ${item.fillerWords>3?"rgba(248,113,113,0.25)":"rgba(251,191,36,0.25)"}`, borderRadius:7, padding:"5px 10px", display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:10, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.07em" }}>Fillers</span><span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:item.fillerWords>3?"#f87171":"#fbbf24" }}>{item.fillerWords}</span></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PrintReport({ fb, merged }) {
  const score = fb.overallScore || Math.round((fb.confidenceRating||70)/10);
  const sc = score>=8?"#059669":score>=6?"#4f46e5":score>=4?"#d97706":"#dc2626";
  const grade = score>=9?"Excellent":score>=7?"Good":score>=5?"Average":"Needs Work";
  const date = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
  return (
    <div id="pdf-report" style={{ width:794, background:"#ffffff", fontFamily:"Georgia,serif", color:"#111827", padding:"60px 60px 40px", position:"absolute", left:"-9999px", top:0 }}>
      <div style={{ borderBottom:"3px solid #111827", paddingBottom:24, marginBottom:32, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>Interview Performance Report · PrepAI</div>
          <h1 style={{ fontSize:34, fontWeight:900, letterSpacing:"-1px", margin:0, lineHeight:1 }}>{fb.role||"Interview"} Assessment</h1>
          <p style={{ fontSize:14, color:"#6b7280", marginTop:8 }}>{fb.experience?`${fb.experience} · `:""}{date}</p>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, fontWeight:900, color:sc, lineHeight:1 }}>{score}</div>
          <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>out of 10</div>
          <div style={{ fontSize:13, fontWeight:700, color:sc, marginTop:4, padding:"3px 12px", background:`${sc}18`, borderRadius:4, display:"inline-block" }}>{grade}</div>
        </div>
      </div>
      {fb.summary && <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:16, marginBottom:28 }}><p style={{ fontSize:14, color:"#374151", lineHeight:1.7, margin:0 }}>{fb.summary}</p></div>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:28 }}>
        {[["Confidence",`${fb.confidenceRating||70}%`,sc],["Questions",`${(fb.answers||[]).length}`,"#4f46e5"],["Filler Words",`${fb.fillerWords??0}`,(fb.fillerWords||0)>4?"#dc2626":"#059669"],["Tone",fb.speakingTone||"Good","#d97706"]].map(([l,v,c],i)=>(
          <div key={i} style={{ border:"1px solid #e5e7eb", borderRadius:8, padding:"14px 16px", textAlign:"center" }}>
            <div style={{ fontSize:20, fontWeight:900, color:c, fontFamily:"Georgia,serif" }}>{v}</div>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:3, textTransform:"uppercase", letterSpacing:"0.07em" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
        <div>
          <h3 style={{ fontSize:13, fontWeight:700, color:"#059669", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12, borderBottom:"2px solid #d1fae5", paddingBottom:6 }}>Strengths</h3>
          {(fb.strengths||[]).map((s,i)=><div key={i} style={{ fontSize:13, color:"#374151", padding:"6px 0", borderBottom:"1px solid #f3f4f6", lineHeight:1.5 }}>• {s}</div>)}
        </div>
        <div>
          <h3 style={{ fontSize:13, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12, borderBottom:"2px solid #fee2e2", paddingBottom:6 }}>Areas to Improve</h3>
          {(fb.weaknesses||[]).map((w,i)=><div key={i} style={{ fontSize:13, color:"#374151", padding:"6px 0", borderBottom:"1px solid #f3f4f6", lineHeight:1.5 }}>• {w}</div>)}
        </div>
      </div>
      {(fb.improvementTips||[]).length>0 && (
        <div style={{ marginBottom:28 }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:"#4f46e5", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12, borderBottom:"2px solid #e0e7ff", paddingBottom:6 }}>Action Plan</h3>
          {(fb.improvementTips||[]).map((t,i)=><div key={i} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:"1px solid #f3f4f6", fontSize:13, color:"#374151", lineHeight:1.5 }}><span style={{ fontWeight:700, color:"#4f46e5", minWidth:20 }}>{i+1}.</span>{t}</div>)}
        </div>
      )}
      {merged.length>0 && (
        <div>
          <h3 style={{ fontSize:13, fontWeight:700, color:"#111827", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, borderBottom:"3px solid #111827", paddingBottom:6 }}>Question Breakdown</h3>
          {merged.map((q,i)=>{
            const qs=q.score||7; const qc=qs>=8?"#059669":qs>=6?"#4f46e5":qs>=4?"#d97706":"#dc2626";
            return (
              <div key={i} style={{ marginBottom:20, paddingBottom:20, borderBottom:i<merged.length-1?"1px solid #f3f4f6":"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#111827", flex:1, marginRight:16, lineHeight:1.4 }}>Q{i+1}. {q.question}</p>
                  <span style={{ fontSize:12, fontWeight:700, color:qc, background:`${qc}15`, padding:"2px 10px", borderRadius:4, whiteSpace:"nowrap" }}>{qs}/10</span>
                </div>
                {q.answer && <p style={{ fontSize:12, color:"#6b7280", lineHeight:1.6, marginBottom:q.feedback?6:0, fontStyle:"italic" }}>"{q.answer.slice(0,200)}{q.answer.length>200?"…":""}"</p>}
                {q.feedback && <p style={{ fontSize:12, color:"#374151", lineHeight:1.6, padding:"8px 12px", background:"#f9fafb", borderRadius:6, borderLeft:`3px solid ${qc}` }}>{q.feedback}</p>}
              </div>
            );
          })}
        </div>
      )}
      <div style={{ borderTop:"1px solid #e5e7eb", marginTop:32, paddingTop:16, display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, color:"#9ca3af" }}>Generated by PrepAI · {date}</span>
        <span style={{ fontSize:11, color:"#9ca3af" }}>Confidential Interview Report</span>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const [fb, setFb] = useState(null);
  const [active, setActive] = useState(false);
  const [tab, setTab] = useState("overview");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [merged, setMerged] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("feedback");
    if (!raw) { router.push("/dashboard"); return; }
    try {
      const data = JSON.parse(raw);
      setFb(data);
      const answers = data.answers || [];
      const qfb = data.questionFeedback || [];
      setMerged(answers.map((a,i) => ({
        ...a, ...(qfb[i]||{}),
        question: a.question || qfb[i]?.question || `Question ${i+1}`,
        answer: a.answer || "",
        score: a.score || qfb[i]?.rating || data.overallScore || 7,
        feedback: qfb[i]?.feedback || null,
        betterAnswer: qfb[i]?.betterAnswer || null,
      })));
      setTimeout(() => setActive(true), 120);
    } catch { router.push("/dashboard"); }
  }, []);

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const el = document.getElementById("pdf-report");
      if (!el) throw new Error("no element");
      el.style.left = "0"; el.style.position = "fixed"; el.style.zIndex = "9999"; el.style.top = "0";
      const canvas = await html2canvas(el, { scale:2, useCORS:true, backgroundColor:"#ffffff", logging:false, width:794 });
      el.style.left = "-9999px"; el.style.position = "absolute"; el.style.zIndex = "auto";
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation:"portrait", unit:"px", format:"a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = pdfW / canvas.width;
      const imgH = canvas.height * ratio;
      let heightLeft = imgH; let position = 0;
      pdf.addImage(imgData,"PNG",0,position,pdfW,imgH); heightLeft -= pdfH;
      while (heightLeft > 0) { position -= pdfH; pdf.addPage(); pdf.addImage(imgData,"PNG",0,position,pdfW,imgH); heightLeft -= pdfH; }
      const role = fb?.role?.replace(/\s+/g,"-").toLowerCase()||"interview";
      pdf.save(`prepai-report-${role}-${Date.now()}.pdf`);
    } catch(err) { console.error(err); alert("PDF failed. Try again."); }
    finally { setPdfLoading(false); }
  };

  if (!fb) return (
    <div style={{ minHeight:"100vh", background:"#060910", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ width:44, height:44, border:"3px solid rgba(129,140,248,0.2)", borderTopColor:"#818cf8", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <p style={{ color:"rgba(255,255,255,0.35)", fontFamily:"sans-serif", fontSize:14 }}>Loading report…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const score = fb.overallScore || Math.round((fb.confidenceRating||70)/10);
  const conf  = fb.confidenceRating || 70;
  const grade = score>=9?"Excellent":score>=7?"Good":score>=5?"Average":"Needs Work";
  const sc    = score>=8?"#00d4aa":score>=6?"#818cf8":score>=4?"#fbbf24":"#f87171";
  const avgQ  = merged.length>0 ? Math.round(merged.reduce((s,a)=>s+(a.score||score),0)/merged.length) : score;

  const TABS = [
    {id:"overview", label:"Overview",    icon:<BarChart2 size={14}/>},
    {id:"questions",label:"Questions",   icon:<MessageSquare size={14}/>},
    {id:"plan",     label:"Action Plan", icon:<Lightbulb size={14}/>},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=Instrument+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#060910;--s1:#0c1019;--s2:#111827;--b1:rgba(255,255,255,0.05);--b2:rgba(255,255,255,0.09);--text:#f0f4ff;--muted:rgba(255,255,255,0.38);--muted2:rgba(255,255,255,0.6);--a1:#818cf8;--a2:#6366f1;--a3:#00d4aa;--a4:#fbbf24;--danger:#f87171}
        html,body{background:var(--bg);color:var(--text);font-family:'Instrument Sans',sans-serif;min-height:100vh}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        .rp-top{display:flex;align-items:center;justify-content:space-between;padding:14px 28px;border-bottom:1px solid var(--b1);background:rgba(6,9,16,0.96);backdrop-filter:blur(20px);position:sticky;top:0;z-index:50;gap:12px;flex-wrap:wrap}
        .rp-tl{display:flex;align-items:center;gap:12px}
        .rp-tr{display:flex;align-items:center;gap:8px}
        .rp-back{display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b2);border-radius:9px;padding:8px 14px;cursor:pointer;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:500;color:var(--text);transition:all .2s}
        .rp-back:hover{border-color:rgba(129,140,248,.4);transform:translateX(-2px)}
        .rp-badge{padding:5px 12px;border-radius:100px;background:rgba(129,140,248,.1);border:1px solid rgba(129,140,248,.2);font-size:12px;font-weight:600;color:var(--a1);letter-spacing:.02em}
        .rp-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;border-radius:9px;border:1px solid var(--b2);background:var(--s2);cursor:pointer;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:500;color:var(--text);transition:all .2s;white-space:nowrap}
        .rp-btn:hover{border-color:rgba(129,140,248,.4);background:rgba(129,140,248,.06)}
        .rp-btn svg{color:var(--a1)}
        .rp-primary{background:linear-gradient(135deg,var(--a2),#8b5cf6)!important;border-color:transparent!important;color:#fff!important;box-shadow:0 4px 16px rgba(99,102,241,.3)}
        .rp-primary:hover{transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(99,102,241,.4)!important;border-color:transparent!important}
        .rp-primary svg{color:#fff!important}
        .rp-btn:disabled{opacity:.6;cursor:not-allowed;transform:none!important}
        .rp-hero{max-width:1280px;margin:0 auto;padding:48px 28px 36px;display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center}
        @media(max-width:768px){.rp-hero{grid-template-columns:1fr;text-align:center}.rp-ring{margin:0 auto!important}}
        .eyebrow{font-size:11px;font-weight:700;color:var(--a1);text-transform:uppercase;letter-spacing:.13em;margin-bottom:12px;display:flex;align-items:center;gap:8px}
        .eyebrow::before{content:'';display:block;width:20px;height:1px;background:var(--a1)}
        .rp-h1{font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:900;line-height:1.06;letter-spacing:-1.5px;margin-bottom:14px}
        .rp-h1 em{font-style:italic;background:linear-gradient(90deg,var(--a1),var(--a3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .rp-sub{font-size:15px;color:var(--muted2);line-height:1.7;max-width:500px}
        .rp-pills{display:flex;align-items:center;gap:10px;margin-top:18px;flex-wrap:wrap}
        .rp-pill{display:flex;align-items:center;gap:6px;background:var(--s2);border:1px solid var(--b2);border-radius:100px;padding:5px 13px;font-size:12px;font-weight:500;color:var(--muted2)}
        .rp-pill svg{color:var(--a1)}
        .rp-pill strong{color:var(--text)}
        .rp-tabs{max-width:1280px;margin:0 auto;padding:0 28px;display:flex;gap:2px;border-bottom:1px solid var(--b1)}
        .rp-tab{padding:11px 18px;border:none;background:none;cursor:pointer;font-family:'Instrument Sans',sans-serif;font-size:14px;font-weight:500;color:var(--muted);border-bottom:2px solid transparent;transition:all .2s;display:flex;align-items:center;gap:7px;margin-bottom:-1px}
        .rp-tab:hover{color:var(--text)}
        .rp-tab.on{color:var(--text);border-bottom-color:var(--a1)}
        .rp-tab svg{opacity:.5}
        .rp-tab.on svg{opacity:1;color:var(--a1)}
        .rp-body{max-width:1280px;margin:0 auto;padding:28px 28px 60px}
        @media(max-width:480px){.rp-body{padding:20px 16px 48px}.rp-top{padding:12px 16px}.rp-hero{padding:32px 16px 24px}.rp-tabs{padding:0 16px}}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
        .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        @media(max-width:900px){.g3{grid-template-columns:1fr 1fr}}
        @media(max-width:700px){.g2,.g3{grid-template-columns:1fr}.g4{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.g4{grid-template-columns:1fr 1fr}}
        .card{background:var(--s1);border:1px solid var(--b1);border-radius:18px;padding:22px 24px;transition:border-color .2s}
        .card:hover{border-color:rgba(129,140,248,.2)}
        .ct{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px;display:flex;align-items:center;gap:7px}
        .ct svg{opacity:.7}
        .ms{background:var(--s1);border:1px solid var(--b1);border-radius:14px;padding:18px;text-align:center;transition:all .2s}
        .ms:hover{border-color:rgba(129,140,248,.25);transform:translateY(-2px)}
        .ms-v{fontFamily:"'JetBrains Mono',monospace";font-size:24px;font-weight:700;margin-bottom:4px}
        .ms-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
        .si{display:flex;align-items:flex-start;gap:9px;padding:9px 0;border-bottom:1px solid var(--b1);font-size:13px;color:var(--muted2);line-height:1.5}
        .si:last-child{border-bottom:none;padding-bottom:0}
        .si svg{flex-shrink:0;margin-top:1px}
        .tip{display:flex;align-items:flex-start;gap:11px;padding:13px;background:rgba(255,255,255,.02);border:1px solid var(--b1);border-radius:11px;margin-bottom:9px;font-size:14px;color:var(--muted2);line-height:1.6;transition:all .2s}
        .tip:hover{border-color:rgba(129,140,248,.3);transform:translateX(4px)}
        .tipn{width:26px;height:26px;border-radius:7px;flex-shrink:0;background:rgba(129,140,248,.12);border:1px solid rgba(129,140,248,.2);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:var(--a1)}
        .sr{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--b1)}
        .sr:last-child{border-bottom:none}
        .sl{width:34px;height:34px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:800;font-size:15px}
        .cta-box{margin-top:32px;padding:28px;background:linear-gradient(135deg,rgba(99,102,241,.07),rgba(139,92,246,.04));border:1px solid rgba(129,140,248,.15);border-radius:18px;text-align:center}
        .cta-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;letter-spacing:-.5px;margin-bottom:8px}
        .cta-sub{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:20px}
        .cta-btn{padding:13px 30px;background:linear-gradient(135deg,var(--a2),#8b5cf6);border:none;border-radius:11px;cursor:pointer;color:#fff;font-family:'Instrument Sans',sans-serif;font-size:15px;font-weight:600;box-shadow:0 6px 20px rgba(99,102,241,.3);transition:all .2s}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(99,102,241,.45)}
      `}</style>

      {fb && <PrintReport fb={fb} merged={merged}/>}

      <header className="rp-top">
        <div className="rp-tl">
          <button className="rp-back" onClick={()=>router.push("/dashboard")}><ArrowLeft size={14}/>Dashboard</button>
          <span className="rp-badge">Report</span>
        </div>
        <div className="rp-tr">
          <button className="rp-btn" onClick={()=>{localStorage.removeItem("feedback");localStorage.removeItem("questions");router.push("/dashboard");}}>
            <RotateCcw size={14}/>New Interview
          </button>
          <button className="rp-btn rp-primary" onClick={downloadPDF} disabled={pdfLoading}>
            {pdfLoading
              ? <><Loader2 size={14} style={{animation:"spin .8s linear infinite"}}/>Generating…</>
              : <><Download size={14}/>Download PDF</>}
          </button>
        </div>
      </header>

      <div className="rp-hero" style={{animation:active?"slideUp 0.6s ease both":"none"}}>
        <div>
          <div className="eyebrow">Performance Report · PrepAI</div>
          <h1 className="rp-h1">Your session was<br/><em>{grade}.</em></h1>
          <p className="rp-sub">{fb.summary||`You completed ${merged.length} question${merged.length!==1?"s":""} for the ${fb.role||"interview"} role. Full AI breakdown below.`}</p>
          <div className="rp-pills">
            {fb.role&&<div className="rp-pill"><Target size={12}/><strong>{fb.role}</strong></div>}
            {fb.experience&&<div className="rp-pill"><Clock size={12}/><strong>{fb.experience}</strong></div>}
            {merged.length>0&&<div className="rp-pill"><MessageSquare size={12}/><strong>{merged.length} answered</strong></div>}
          </div>
        </div>
        <div className="rp-ring" style={{animation:active?"pop 0.7s 0.15s ease both":"none"}}>
          <ScoreRing score={score} max={10} size={160} stroke={11} color={sc} label="/ 10" active={active}/>
        </div>
      </div>

      <div className="rp-tabs">
        {TABS.map(t=>(
          <button key={t.id} className={`rp-tab${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab==="overview"&&(
        <div className="rp-body">
          <div className="g4" style={{marginBottom:20}}>
            {[
              {label:"Overall Score",val:`${score}/10`,c:sc},
              {label:"Confidence",val:`${conf}%`,c:conf>75?"#00d4aa":conf>50?"#fbbf24":"#f87171"},
              {label:"Avg Q Score",val:`${avgQ}/10`,c:"#818cf8"},
              {label:"Filler Words",val:`${fb.fillerWords??0}`,c:(fb.fillerWords||0)>4?"#f87171":"#00d4aa"},
            ].map((m,i)=>(
              <div className="ms" key={i} style={{animation:active?`slideUp 0.4s ${i*60}ms ease both`:"none"}}>
                <div className="ms-v" style={{color:m.c,fontFamily:"'JetBrains Mono',monospace"}}>{m.val}</div>
                <div className="ms-l">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="g2" style={{marginBottom:20}}>
            <div className="card" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,animation:active?"slideUp 0.5s 0.1s ease both":"none"}}>
              <ScoreRing score={score} max={10} size={140} stroke={10} color={sc} label="/ 10" active={active}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:sc}}>{grade}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Overall Rating</div>
              </div>
            </div>
            <div className="card" style={{animation:active?"slideUp 0.5s 0.18s ease both":"none"}}>
              <div className="ct"><BarChart2 size={13}/>Performance Breakdown</div>
              <Bar label="Confidence Score" value={conf} max={100} color={sc} delay={100} active={active}/>
              <Bar label="Answer Quality" value={Math.min(avgQ*10,100)} max={100} color="#818cf8" delay={180} active={active}/>
              <Bar label="Communication" value={Math.max(100-(fb.fillerWords||0)*8,10)} max={100} color="#00d4aa" delay={260} active={active}/>
              <Bar label="Coverage" value={merged.length>0?100:0} max={100} color="#fbbf24" delay={340} active={active}/>
            </div>
          </div>
          <div className="g3" style={{marginBottom:20}}>
            <div className="card" style={{animation:active?"slideUp 0.5s 0.12s ease both":"none"}}>
              <div className="ct" style={{color:"#00d4aa"}}><TrendingUp size={13} color="#00d4aa"/>Strengths</div>
              {(fb.strengths||[]).length>0?(fb.strengths||[]).map((s,i)=><div className="si" key={i}><CheckCircle size={14} color="#00d4aa"/>{s}</div>):<p style={{color:"var(--muted)",fontSize:13}}>No data.</p>}
            </div>
            <div className="card" style={{animation:active?"slideUp 0.5s 0.2s ease both":"none"}}>
              <div className="ct" style={{color:"#f87171"}}><TrendingDown size={13} color="#f87171"/>Areas to Improve</div>
              {(fb.weaknesses||[]).length>0?(fb.weaknesses||[]).map((w,i)=><div className="si" key={i}><XCircle size={14} color="#f87171"/>{w}</div>):<p style={{color:"var(--muted)",fontSize:13}}>No data.</p>}
            </div>
            <div className="card" style={{animation:active?"slideUp 0.5s 0.28s ease both":"none"}}>
              <div className="ct" style={{color:"#fbbf24"}}><Award size={13} color="#fbbf24"/>Session Stats</div>
              {[["Questions",merged.length],["Avg Score",`${avgQ}/10`],["Speaking Tone",fb.speakingTone||"Good"],["Eye Contact",fb.eyeContact||"Good"],["Total Fillers",fb.fillerWords??0]].map(([l,v],i)=>(
                <div className="si" key={i} style={{justifyContent:"space-between"}}>
                  <span style={{color:"var(--muted)",fontSize:12}}>{l}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:"rgba(255,255,255,.8)"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {fb.starMethodUsage&&<div className="card" style={{animation:active?"slideUp 0.5s 0.3s ease both":"none"}}><div className="ct" style={{color:"#fbbf24"}}><Star size={13} color="#fbbf24"/>STAR Assessment</div><p style={{fontSize:14,color:"rgba(255,255,255,.65)",lineHeight:1.7}}>{fb.starMethodUsage}</p></div>}
        </div>
      )}

      {tab==="questions"&&(
        <div className="rp-body">
          {merged.length>0?(
            <>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(merged.length,5)},1fr)`,gap:8,marginBottom:22}}>
                {merged.map((a,i)=>{
                  const qs=a.score||score; const qc=qs>=8?"#00d4aa":qs>=6?"#818cf8":qs>=4?"#fbbf24":"#f87171";
                  return <div key={i} style={{background:`${qc}08`,border:`1px solid ${qc}25`,borderRadius:11,padding:"12px 14px",textAlign:"center",transition:"all .2s",cursor:"pointer",animation:active?`slideUp 0.4s ${i*50}ms ease both`:"none"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=qc;e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`${qc}25`;e.currentTarget.style.transform="translateY(0)"}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.3)",fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>Q{i+1}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:700,color:qc}}>{qs}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,.2)",marginTop:1}}>/10</div>
                  </div>;
                })}
              </div>
              {merged.map((item,i)=><QCard key={i} item={item} index={i} active={active}/>)}
            </>
          ):(
            <div style={{textAlign:"center",padding:"80px 0",color:"var(--muted)"}}>
              <MessageSquare size={36} style={{margin:"0 auto 14px",display:"block",opacity:.2}}/>
              <p>No question data found.</p>
            </div>
          )}
        </div>
      )}

      {tab==="plan"&&(
        <div className="rp-body">
          <div style={{maxWidth:720}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:900,letterSpacing:"-.5px",marginBottom:6,animation:active?"slideUp .5s ease both":"none"}}>Your Action Plan</h2>
            <p style={{fontSize:14,color:"var(--muted)",marginBottom:28,lineHeight:1.7,animation:active?"slideUp .5s .05s ease both":"none"}}>Targeted steps to improve before your next interview.</p>
            {(fb.improvementTips||[]).length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Improvement Tips</div>
                {(fb.improvementTips||[]).map((tip,i)=><div className="tip" key={i} style={{animationDelay:`${i*60}ms`,animation:active?`slideUp 0.4s ${i*60}ms ease both`:"none"}}><div className="tipn">{String(i+1).padStart(2,"0")}</div><span>{tip}</span></div>)}
              </>
            )}
            <div style={{marginTop:28}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>STAR Method Framework</div>
              <div className="card">
                {[{l:"S",label:"Situation",desc:"Set the context — when, where, what was happening?",c:"#818cf8"},{l:"T",label:"Task",desc:"What was your specific responsibility or challenge?",c:"#a78bfa"},{l:"A",label:"Action",desc:"Exactly what steps did you take? Be specific.",c:"#00d4aa"},{l:"R",label:"Result",desc:"What happened? Quantify the outcome where possible.",c:"#fbbf24"}].map((s,i)=>(
                  <div className="sr" key={i}>
                    <div className="sl" style={{background:`${s.c}15`,border:`1px solid ${s.c}30`,color:s.c}}>{s.l}</div>
                    <div><div style={{fontWeight:600,fontSize:14,marginBottom:3,color:s.c}}>{s.label}</div><div style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.5}}>{s.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            {(fb.recommendedResources||[]).length>0&&(
              <div style={{marginTop:28}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Recommended Resources</div>
                {(fb.recommendedResources||[]).map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 15px",background:"rgba(255,255,255,.02)",border:"1px solid var(--b1)",borderRadius:11,marginBottom:8,fontSize:14,color:"rgba(255,255,255,.65)",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,212,170,.3)";e.currentTarget.style.color="#00d4aa"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.color="rgba(255,255,255,.65)"}}><BookOpen size={14} color="#00d4aa"/>{r}</div>)}
              </div>
            )}
            <div className="cta-box">
              <div className="cta-title">Ready to improve?</div>
              <p className="cta-sub">Apply these steps and run another session to track your progress.</p>
              <button className="cta-btn" onClick={()=>{localStorage.removeItem("feedback");localStorage.removeItem("questions");router.push("/dashboard");}}>Start New Interview</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}