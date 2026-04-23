"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Download, RotateCcw, TrendingUp, TrendingDown,
  CheckCircle, XCircle, Lightbulb, MessageSquare, Star,
  ChevronDown, ChevronUp, Mic, Brain, Zap, Target,
  BarChart2, Award, BookOpen, Clock
} from "lucide-react";

/* ─── animated count-up ─── */
function useCountUp(target, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return val;
}

/* ─── circular progress ring ─── */
function ScoreRing({ score, max = 10, size = 160, stroke = 10, color, label, sublabel, animate }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = score / max;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setOffset(circ - pct * circ), 200);
    return () => clearTimeout(t);
  }, [animate, pct, circ]);

  const displayScore = useCountUp(score, 1200, animate);

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2
      }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 36, fontWeight: 800, color, lineHeight: 1 }}>
          {displayScore}
        </span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{label}</span>
        {sublabel && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{sublabel}</span>}
      </div>
    </div>
  );
}

/* ─── horizontal bar ─── */
function Bar({ label, value, max = 100, color, delay = 0, animate }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setW((value / max) * 100), delay);
    return () => clearTimeout(t);
  }, [animate, value, max, delay]);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", color, fontSize: 12 }}>{value}{max === 100 ? "%" : `/${max}`}</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${w}%`, background: color,
          borderRadius: 99, transition: `width 1s ${delay}ms cubic-bezier(0.34,1.56,0.64,1)`
        }} />
      </div>
    </div>
  );
}

/* ─── question accordion ─── */
function QuestionCard({ item, index, animate }) {
  const [open, setOpen] = useState(index === 0);
  const score = item.score || item.rating || 7;
  const scoreColor = score >= 8 ? "#00d4aa" : score >= 6 ? "#6366f1" : score >= 4 ? "#f59e0b" : "#ef4444";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, overflow: "hidden", marginBottom: 12,
        animation: animate ? `fadeUp 0.5s ${index * 80}ms ease both` : "none",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
    >
      {/* header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "18px 22px", background: "none", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left",
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${scoreColor}18`, border: `1px solid ${scoreColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: scoreColor,
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.4, marginBottom: 3 }}>
            {item.question}
          </p>
          {!open && item.answer && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.answer.slice(0, 80)}...
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            padding: "4px 10px", borderRadius: 8,
            background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: scoreColor
          }}>
            {score}/10
          </div>
          {open ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
        </div>
      </button>

      {/* expanded body */}
      {open && (
        <div style={{ padding: "0 22px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Your answer */}
          {item.answer && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                YOUR ANSWER
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                {item.answer || "No answer recorded."}
              </p>
            </div>
          )}

          {/* AI Feedback */}
          {item.feedback && (
            <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Brain size={12} /> AI FEEDBACK
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{item.feedback}</p>
            </div>
          )}

          {/* Better answer */}
          {item.betterAnswer && (
            <div style={{ background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.15)", borderRadius: 12, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#00d4aa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Lightbulb size={12} /> STRONGER ANSWER
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{item.betterAnswer}</p>
            </div>
          )}

          {/* Per-answer stats */}
          {(item.wordCount || item.fillerWords !== undefined || item.wpm) && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {item.wordCount > 0 && <Chip label="Words" value={item.wordCount} color="#6366f1" />}
              {item.wpm > 0 && <Chip label="WPM" value={item.wpm} color="#00d4aa" />}
              {item.fillerWords !== undefined && <Chip label="Fillers" value={item.fillerWords} color={item.fillerWords > 3 ? "#ef4444" : "#f59e0b"} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{
      background: `${color}10`, border: `1px solid ${color}25`,
      borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6
    }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function FeedbackPage() {
  const router = useRouter();
  const [fb, setFb] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const headerRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem("feedback");
    if (!raw) { router.push("/dashboard"); return; }
    try {
      const data = JSON.parse(raw);
      setFb(data);
      setTimeout(() => setAnimate(true), 100);
    } catch {
      router.push("/dashboard");
    }
  }, []);

  if (!fb) {
    return (
      <div style={{ minHeight: "100vh", background: "#060910", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>Loading your report...</p>
        </div>
      </div>
    );
  }

  /* ── derived values ── */
  const overallScore     = fb.overallScore || Math.round((fb.confidenceRating || 70) / 10);
  const confidence       = fb.confidenceRating || fb.localConfidence || 70;
  const answers          = fb.answers || [];
  const strengths        = fb.strengths || [];
  const weaknesses       = fb.weaknesses || [];
  const tips             = fb.improvementTips || [];
  const starUsage        = fb.starMethodUsage || null;
  const resources        = fb.recommendedResources || [];
  const questionFeedback = fb.questionFeedback || [];
  const role             = fb.role || "Interview";
  const experience       = fb.experience || "";

  // merge answers array with questionFeedback from Gemini if available
  const mergedAnswers = answers.map((a, i) => ({
    ...a,
    ...(questionFeedback[i] || {}),
    question: a.question || questionFeedback[i]?.question || `Question ${i + 1}`,
    answer:   a.answer   || "",
    score:    a.score    || questionFeedback[i]?.rating || overallScore,
    feedback: questionFeedback[i]?.feedback || null,
    betterAnswer: questionFeedback[i]?.betterAnswer || null,
  }));

  // compute avg score from per-question scores
  const avgScore = mergedAnswers.length > 0
    ? Math.round(mergedAnswers.reduce((s, a) => s + (a.score || overallScore), 0) / mergedAnswers.length)
    : overallScore * 10;

  const scoreGrade =
    overallScore >= 9 ? "Excellent" :
    overallScore >= 7 ? "Good" :
    overallScore >= 5 ? "Average" : "Needs Work";

  const scoreColor =
    overallScore >= 8 ? "#00d4aa" :
    overallScore >= 6 ? "#6366f1" :
    overallScore >= 4 ? "#f59e0b" : "#ef4444";

  const tabs = ["overview", "questions", "tips"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #060910; --s1: #0d1117; --s2: #111827;
          --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.1);
          --text: #f1f5f9; --muted: rgba(255,255,255,0.4);
          --a1: #6366f1; --a2: #8b5cf6; --a3: #00d4aa; --a4: #f59e0b; --danger: #ef4444;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pop      { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .fb-shell { min-height:100vh; }

        /* ── topbar ── */
        .fb-topbar {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 32px; border-bottom:1px solid var(--border);
          background:rgba(6,9,16,0.95); backdrop-filter:blur(20px);
          position:sticky; top:0; z-index:50; gap:16px; flex-wrap:wrap;
        }
        .fb-nav-left  { display:flex; align-items:center; gap:16px; }
        .fb-nav-right { display:flex; align-items:center; gap:10px; }
        .fb-back {
          display:flex; align-items:center; gap:8px;
          background:var(--s2); border:1px solid var(--border2);
          border-radius:10px; padding:8px 14px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--text);
          transition:all .2s;
        }
        .fb-back:hover { border-color:rgba(99,102,241,.4); transform:translateX(-2px); }
        .fb-tag {
          padding:5px 12px; border-radius:100px;
          background:rgba(99,102,241,.1); border:1px solid rgba(99,102,241,.2);
          font-size:12px; font-weight:600; color:var(--a1); letter-spacing:.03em;
        }
        .fb-action-btn {
          display:flex; align-items:center; gap:7px;
          padding:9px 16px; border-radius:10px; border:1px solid var(--border2);
          background:var(--s2); cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--text);
          transition:all .2s;
        }
        .fb-action-btn:hover { border-color:rgba(99,102,241,.4); background:rgba(99,102,241,.06); }
        .fb-action-btn svg { color:var(--a1); }
        .fb-retry-btn {
          background:linear-gradient(135deg,var(--a1),var(--a2));
          border:none; color:#fff; box-shadow:0 4px 16px rgba(99,102,241,.3);
        }
        .fb-retry-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,.4); border-color:transparent; }

        /* ── hero ── */
        .fb-hero {
          padding:56px 32px 48px;
          max-width:1200px; margin:0 auto;
          display:grid; grid-template-columns:1fr auto;
          gap:40px; align-items:center;
          animation: ${animate ? "fadeUp 0.7s ease both" : "none"};
        }
        @media(max-width:768px){ .fb-hero{grid-template-columns:1fr; text-align:center} }
        .fb-hero-eyebrow {
          font-size:12px; font-weight:600; color:var(--a1);
          text-transform:uppercase; letter-spacing:.12em; margin-bottom:14px;
          display:flex; align-items:center; gap:8px;
        }
        .fb-hero-eyebrow::before { content:''; display:block; width:24px; height:1px; background:var(--a1); }
        .fb-hero-title {
          font-family:'Fraunces',serif; font-size:clamp(2.4rem,5vw,4rem);
          font-weight:900; line-height:1.05; letter-spacing:-1.5px; margin-bottom:16px;
        }
        .fb-hero-title .grade {
          font-style:italic; background:linear-gradient(90deg,var(--a1),var(--a3));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .fb-hero-sub { font-size:16px; color:var(--muted); line-height:1.7; max-width:520px; }
        .fb-hero-meta { display:flex; align-items:center; gap:16px; margin-top:20px; flex-wrap:wrap; }
        .fb-meta-pill {
          display:flex; align-items:center; gap:7px;
          background:var(--s2); border:1px solid var(--border2);
          border-radius:100px; padding:6px 14px; font-size:13px; font-weight:500; color:var(--muted);
        }
        .fb-meta-pill svg { color:var(--a1); }
        .fb-meta-pill strong { color:var(--text); }

        /* ── tabs ── */
        .fb-tabs {
          max-width:1200px; margin:0 auto;
          padding:0 32px 0;
          display:flex; gap:4px; border-bottom:1px solid var(--border);
        }
        .fb-tab {
          padding:12px 20px; border:none; background:none; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
          color:var(--muted); border-bottom:2px solid transparent;
          transition:all .2s; display:flex; align-items:center; gap:8px;
          margin-bottom:-1px;
        }
        .fb-tab:hover  { color:var(--text); }
        .fb-tab.active { color:var(--text); border-bottom-color:var(--a1); }
        .fb-tab svg    { opacity:.6; }
        .fb-tab.active svg { opacity:1; color:var(--a1); }

        /* ── main content ── */
        .fb-content { max-width:1200px; margin:0 auto; padding:32px; }

        /* ── score grid ── */
        .fb-score-grid {
          display:grid; grid-template-columns:auto 1fr;
          gap:32px; align-items:start; margin-bottom:32px;
        }
        @media(max-width:768px){ .fb-score-grid{grid-template-columns:1fr; text-align:center} }
        .fb-score-card {
          background:var(--s1); border:1px solid var(--border2);
          border-radius:24px; padding:36px 40px;
          text-align:center; position:relative; overflow:hidden;
          animation:${animate ? "pop 0.6s 0.1s ease both" : "none"};
        }
        .fb-score-card::before {
          content:''; position:absolute; top:-60px; left:50%; transform:translateX(-50%);
          width:200px; height:200px;
          background:radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%);
        }
        .fb-score-label { font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; margin-top:16px; }

        .fb-bars-card {
          background:var(--s1); border:1px solid var(--border);
          border-radius:24px; padding:28px 32px;
          animation:${animate ? "fadeUp 0.6s 0.2s ease both" : "none"};
        }
        .fb-bars-title { font-size:13px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.1em; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
        .fb-bars-title svg { color:var(--a1); }

        /* ── 3-col grid ── */
        .fb-three-grid {
          display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:32px;
        }
        @media(max-width:900px){ .fb-three-grid{grid-template-columns:1fr 1fr} }
        @media(max-width:600px){ .fb-three-grid{grid-template-columns:1fr} }

        .fb-card {
          background:var(--s1); border:1px solid var(--border);
          border-radius:20px; padding:24px;
          animation:${animate ? "fadeUp 0.5s ease both" : "none"};
        }
        .fb-card-title {
          font-size:12px; font-weight:700; color:var(--muted);
          text-transform:uppercase; letter-spacing:.1em; margin-bottom:18px;
          display:flex; align-items:center; gap:8px;
        }
        .fb-card-title svg { opacity:.8; }

        /* strength/weakness list */
        .fb-sw-item {
          display:flex; align-items:flex-start; gap:10px;
          padding:10px 0; border-bottom:1px solid var(--border);
          font-size:14px; line-height:1.5; color:rgba(255,255,255,.7);
        }
        .fb-sw-item:last-child { border-bottom:none; padding-bottom:0; }
        .fb-sw-item svg { flex-shrink:0; margin-top:1px; }

        /* tip cards */
        .fb-tip {
          display:flex; align-items:flex-start; gap:12px;
          padding:14px; background:rgba(255,255,255,.02);
          border:1px solid var(--border); border-radius:12px; margin-bottom:10px;
          font-size:14px; color:rgba(255,255,255,.7); line-height:1.5;
          transition:border-color .2s, transform .2s;
          animation:${animate ? "fadeUp 0.4s ease both" : "none"};
        }
        .fb-tip:hover { border-color:rgba(99,102,241,.3); transform:translateX(4px); }
        .fb-tip-num {
          width:26px; height:26px; border-radius:8px; flex-shrink:0;
          background:rgba(99,102,241,.12); border:1px solid rgba(99,102,241,.2);
          display:flex; align-items:center; justify-content:center;
          font-family:'DM Mono',monospace; font-size:12px; font-weight:700; color:var(--a1);
        }

        /* star section */
        .fb-star-box {
          background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(0,212,170,.04));
          border:1px solid rgba(99,102,241,.15); border-radius:16px; padding:20px;
          font-size:14px; color:rgba(255,255,255,.7); line-height:1.7; margin-top:16px;
        }
        .fb-star-box-title {
          font-size:12px; font-weight:700; color:var(--a1);
          text-transform:uppercase; letter-spacing:.1em; margin-bottom:10px;
          display:flex; align-items:center; gap:6px;
        }

        /* resources */
        .fb-resource {
          display:flex; align-items:center; gap:10px;
          padding:12px 16px; background:rgba(255,255,255,.02);
          border:1px solid var(--border); border-radius:12px; margin-bottom:8px;
          font-size:14px; color:rgba(255,255,255,.7);
          transition:all .2s;
        }
        .fb-resource:hover { border-color:rgba(0,212,170,.3); color:var(--a3); }
        .fb-resource svg { color:var(--a3); flex-shrink:0; }

        /* mini score badge */
        .fb-mini-scores {
          display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px;
        }
        .fb-mini-score {
          background:var(--s1); border:1px solid var(--border);
          border-radius:16px; padding:18px 20px; text-align:center;
          animation:${animate ? "fadeUp 0.5s ease both" : "none"};
          transition:border-color .2s, transform .2s;
        }
        .fb-mini-score:hover { border-color:rgba(99,102,241,.3); transform:translateY(-3px); }
        .fb-mini-score-val { font-family:'DM Mono',monospace; font-size:26px; font-weight:700; margin-bottom:4px; }
        .fb-mini-score-label { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.07em; }

        /* empty state */
        .fb-empty { text-align:center; padding:48px; color:var(--muted); font-size:15px; }

        @media(max-width:480px){
          .fb-topbar{ padding:12px 16px }
          .fb-hero{ padding:32px 16px }
          .fb-tabs{ padding:0 16px }
          .fb-content{ padding:24px 16px }
        }
      `}</style>

      <div className="fb-shell">

        {/* ── Top bar ── */}
        <header className="fb-topbar">
          <div className="fb-nav-left">
            <button className="fb-back" onClick={() => router.push("/dashboard")}>
              <ArrowLeft size={15} /> Dashboard
            </button>
            <div className="fb-tag">Interview Report</div>
          </div>
          <div className="fb-nav-right">
            <button className="fb-action-btn" onClick={() => window.print()}>
              <Download size={14} /> Export
            </button>
            <button className="fb-action-btn fb-retry-btn" onClick={() => {
              localStorage.removeItem("feedback");
              localStorage.removeItem("questions");
              router.push("/dashboard");
            }}>
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        </header>

        {/* ── Hero ── */}
        <div className="fb-hero" style={{ animation: animate ? "fadeUp 0.7s ease both" : "none" }}>
          <div>
            <div className="fb-hero-eyebrow">Performance Report</div>
            <h1 className="fb-hero-title">
              Your interview was{" "}
              <span className="grade">{scoreGrade}.</span>
            </h1>
            <p className="fb-hero-sub">
              {fb.summary || `You completed ${answers.length} question${answers.length !== 1 ? "s" : ""} for the ${role} role. Here's your detailed AI analysis.`}
            </p>
            <div className="fb-hero-meta">
              {role && (
                <div className="fb-meta-pill">
                  <Target size={13} />
                  <strong>{role}</strong>
                </div>
              )}
              {experience && (
                <div className="fb-meta-pill">
                  <Clock size={13} />
                  <strong>{experience}</strong>
                </div>
              )}
              {answers.length > 0 && (
                <div className="fb-meta-pill">
                  <MessageSquare size={13} />
                  <strong>{answers.length} questions answered</strong>
                </div>
              )}
            </div>
          </div>

          {/* Big score ring */}
          <div style={{ animation: animate ? "pop 0.7s 0.2s ease both" : "none" }}>
            <ScoreRing
              score={overallScore} max={10} size={180} stroke={12}
              color={scoreColor} label="/ 10" sublabel="Overall Score"
              animate={animate}
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="fb-tabs">
          {[
            { id: "overview",   label: "Overview",   icon: <BarChart2 size={14} /> },
            { id: "questions",  label: "Questions",  icon: <MessageSquare size={14} /> },
            { id: "tips",       label: "Action Plan", icon: <Lightbulb size={14} /> },
          ].map(t => (
            <button
              key={t.id}
              className={`fb-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════ TAB: OVERVIEW ════════════════ */}
        {activeTab === "overview" && (
          <div className="fb-content">

            {/* Mini score row */}
            <div className="fb-mini-scores">
              {[
                { label: "Confidence",   value: `${confidence}%`, color: scoreColor },
                { label: "Filler Words", value: fb.fillerWords ?? "—", color: fb.fillerWords > 4 ? "#ef4444" : "#00d4aa" },
                { label: "Speaking Tone", value: fb.speakingTone || "Good", color: "#6366f1" },
              ].map((m, i) => (
                <div className="fb-mini-score" key={i} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="fb-mini-score-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="fb-mini-score-label">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Score ring + bars */}
            <div className="fb-score-grid" style={{ marginBottom: 32 }}>
              <div className="fb-score-card" style={{ minWidth: 220 }}>
                <ScoreRing
                  score={overallScore} max={10} size={150} stroke={10}
                  color={scoreColor} label="/ 10" animate={animate}
                />
                <div className="fb-score-label">Overall Score</div>
                <div style={{
                  marginTop: 16, padding: "8px 16px", borderRadius: 100,
                  background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`,
                  display: "inline-block", fontSize: 14, fontWeight: 700, color: scoreColor
                }}>
                  {scoreGrade}
                </div>
              </div>

              <div className="fb-bars-card">
                <div className="fb-bars-title"><BarChart2 size={14} /> Performance Breakdown</div>
                <Bar label="Confidence Score" value={confidence} max={100} color={scoreColor} delay={100} animate={animate} />
                <Bar label="Answer Quality" value={Math.min(avgScore * 10, 100)} max={100} color="#6366f1" delay={200} animate={animate} />
                <Bar label="Communication Clarity" value={Math.max(100 - (fb.fillerWords || 0) * 8, 20)} max={100} color="#00d4aa" delay={300} animate={animate} />
                <Bar label="Question Coverage" value={answers.length > 0 ? 100 : 0} max={100} color="#f59e0b" delay={400} animate={animate} />
              </div>
            </div>

            {/* Strengths + Weaknesses */}
            <div className="fb-three-grid">
              <div className="fb-card" style={{ animationDelay: "0.1s" }}>
                <div className="fb-card-title" style={{ color: "#00d4aa" }}>
                  <TrendingUp size={14} color="#00d4aa" /> Strengths
                </div>
                {strengths.length > 0 ? strengths.map((s, i) => (
                  <div className="fb-sw-item" key={i}>
                    <CheckCircle size={15} color="#00d4aa" />
                    {s}
                  </div>
                )) : <div className="fb-empty">No strengths recorded.</div>}
              </div>

              <div className="fb-card" style={{ animationDelay: "0.18s" }}>
                <div className="fb-card-title" style={{ color: "#ef4444" }}>
                  <TrendingDown size={14} color="#ef4444" /> Areas to Improve
                </div>
                {weaknesses.length > 0 ? weaknesses.map((w, i) => (
                  <div className="fb-sw-item" key={i}>
                    <XCircle size={15} color="#ef4444" />
                    {w}
                  </div>
                )) : <div className="fb-empty">No weaknesses recorded.</div>}
              </div>

              <div className="fb-card" style={{ animationDelay: "0.26s" }}>
                <div className="fb-card-title" style={{ color: "#f59e0b" }}>
                  <Award size={14} color="#f59e0b" /> Quick Stats
                </div>
                {[
                  { label: "Questions",    value: answers.length },
                  { label: "Avg Answer Score", value: `${avgScore}/10` },
                  { label: "Total Fillers",    value: fb.fillerWords ?? 0 },
                  { label: "Eye Contact",      value: fb.eyeContact || "Good" },
                ].map((s, i) => (
                  <div className="fb-sw-item" key={i} style={{ justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,.45)", fontSize: 13 }}>{s.label}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STAR method + resources */}
            {(starUsage || resources.length > 0) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {starUsage && (
                  <div className="fb-card">
                    <div className="fb-card-title"><Star size={14} color="#f59e0b" style={{ color: "#f59e0b" }} /> STAR Method Usage</div>
                    <div className="fb-star-box">
                      <div className="fb-star-box-title"><Zap size={12} /> AI Assessment</div>
                      {starUsage}
                    </div>
                  </div>
                )}
                {resources.length > 0 && (
                  <div className="fb-card">
                    <div className="fb-card-title"><BookOpen size={14} color="#00d4aa" style={{ color: "#00d4aa" }} /> Recommended Resources</div>
                    {resources.map((r, i) => (
                      <div className="fb-resource" key={i}><Zap size={13} />{r}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ TAB: QUESTIONS ════════════════ */}
        {activeTab === "questions" && (
          <div className="fb-content">
            {mergedAnswers.length > 0 ? (
              <>
                {/* Per-question score summary */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.min(mergedAnswers.length, 5)}, 1fr)`,
                  gap: 10, marginBottom: 28
                }}>
                  {mergedAnswers.map((a, i) => {
                    const s = a.score || overallScore;
                    const c = s >= 8 ? "#00d4aa" : s >= 6 ? "#6366f1" : s >= 4 ? "#f59e0b" : "#ef4444";
                    return (
                      <div
                        key={i}
                        style={{
                          background: "rgba(255,255,255,.03)", border: `1px solid ${c}30`,
                          borderRadius: 12, padding: "14px 16px", textAlign: "center",
                          cursor: "pointer", transition: "all .2s",
                          animation: animate ? `fadeUp 0.4s ${i * 60}ms ease both` : "none",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = `${c}30`; e.currentTarget.style.transform = "translateY(0)"; }}
                      >
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "rgba(255,255,255,.3)", marginBottom: 4 }}>Q{i + 1}</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 700, color: c }}>{s}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)", marginTop: 2 }}>/10</div>
                      </div>
                    );
                  })}
                </div>

                {/* Accordion */}
                {mergedAnswers.map((item, i) => (
                  <QuestionCard key={i} item={item} index={i} animate={animate} />
                ))}
              </>
            ) : (
              <div className="fb-empty" style={{ padding: 80 }}>
                <MessageSquare size={32} style={{ color: "rgba(255,255,255,.15)", margin: "0 auto 16px", display: "block" }} />
                <p>No question data recorded.</p>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ TAB: ACTION PLAN ════════════════ */}
        {activeTab === "tips" && (
          <div className="fb-content">

            <div style={{ maxWidth: 720 }}>
              <h2 style={{
                fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 800,
                letterSpacing: "-0.5px", marginBottom: 8,
                animation: animate ? "fadeUp .5s ease both" : "none"
              }}>
                Your Action Plan
              </h2>
              <p style={{
                fontSize: 15, color: "rgba(255,255,255,.45)", marginBottom: 32, lineHeight: 1.7,
                animation: animate ? "fadeUp .5s .05s ease both" : "none"
              }}>
                Personalised steps to level up before your next interview.
              </p>

              {/* Improvement tips */}
              {tips.length > 0 ? (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
                    IMPROVEMENT TIPS
                  </div>
                  {tips.map((tip, i) => (
                    <div className="fb-tip" key={i} style={{ animationDelay: `${i * 70}ms` }}>
                      <div className="fb-tip-num">{String(i + 1).padStart(2, "0")}</div>
                      <span>{tip}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="fb-empty">No improvement tips available.</div>
              )}

              {/* STAR box */}
              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
                  STAR METHOD GUIDE
                </div>
                <div className="fb-card" style={{ background: "linear-gradient(135deg,rgba(99,102,241,.06),rgba(0,212,170,.04))" }}>
                  {[
                    { letter: "S", label: "Situation", desc: "Set the scene — what was the context?", color: "#6366f1" },
                    { letter: "T", label: "Task",      desc: "What was your specific responsibility?", color: "#8b5cf6" },
                    { letter: "A", label: "Action",    desc: "What actions did you take? Be specific.", color: "#00d4aa" },
                    { letter: "R", label: "Result",    desc: "What was the outcome? Use numbers if possible.", color: "#f59e0b" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "14px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none"
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: `${s.color}15`, border: `1px solid ${s.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'DM Mono',monospace", fontWeight: 800, fontSize: 16, color: s.color
                      }}>{s.letter}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, color: s.color }}>{s.label}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {resources.length > 0 && (
                <div style={{ marginTop: 32 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>
                    RECOMMENDED RESOURCES
                  </div>
                  {resources.map((r, i) => (
                    <div className="fb-resource" key={i}><BookOpen size={14} />{r}</div>
                  ))}
                </div>
              )}

              {/* Retry CTA */}
              <div style={{
                marginTop: 40, padding: 28,
                background: "linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.05))",
                border: "1px solid rgba(99,102,241,.15)", borderRadius: 20, textAlign: "center"
              }}>
                <div style={{ fontSize: 22, fontFamily: "'Fraunces',serif", fontWeight: 700, marginBottom: 8 }}>
                  Ready to improve?
                </div>
                <p style={{ color: "rgba(255,255,255,.45)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                  Apply these tips and try another practice session to track your progress.
                </p>
                <button
                  onClick={() => { localStorage.removeItem("feedback"); localStorage.removeItem("questions"); router.push("/dashboard"); }}
                  style={{
                    padding: "13px 32px",
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    border: "none", borderRadius: 12, cursor: "pointer",
                    color: "#fff", fontFamily: "'DM Sans',sans-serif",
                    fontSize: 15, fontWeight: 700,
                    boxShadow: "0 6px 24px rgba(99,102,241,.35)",
                    transition: "all .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(99,102,241,.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,.35)"; }}
                >
                  Start New Interview
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}