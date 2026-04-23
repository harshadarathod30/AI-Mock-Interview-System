"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Mic,
  Video,
  Zap,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Briefcase,
  Clock,
  Code2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

/* ─── tiny hook: count-up animation ─── */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/* ─── animated stat card ─── */
function StatCard({ icon, label, value, suffix = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const num = useCountUp(visible ? parseInt(value) || 0 : 0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-icon">{icon}</div>
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">
        {parseInt(value) > 0 ? `${num}${suffix}` : value}
      </h2>
    </div>
  );
}

/* ─── floating particle ─── */
function Particles() {
  return (
    <div className="particles" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 5}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.15 + Math.random() * 0.25,
          }}
        />
      ))}
    </div>
  );
}

/* ─── main ─── */
export default function DashboardPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [language, setLanguage] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFormVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* ─── start interview → call Gemini API ─── */
 const startInterview = async () => {
  if (!role || !experience || !language) {
    setError("Please fill in all required fields.");
    return;
  }
  setError("");

  try {
    setLoading(true);
    setLoadingStep("Connecting to Gemini AI...");

    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobRole: role,
        jobDescription: jobDesc,
        difficulty: experience,
        questionCount: 5,
      }),
    });

    const data = await res.json();

    // ← shows the REAL error from the API route
    if (!res.ok || data.error) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    if (!data.questions || data.questions.length === 0) {
      throw new Error("Gemini returned no questions.");
    }

    setLoadingStep("Almost ready...");
    await new Promise((r) => setTimeout(r, 400));

    localStorage.setItem("questions", JSON.stringify(data.questions));
    localStorage.setItem(
      "interviewData",
      JSON.stringify({ role, experience, language })
    );

    router.push("/interview");
  } catch (err) {
    console.error("Full error:", err);
    setError(err.message); // ← real message now shows on screen
  } finally {
    setLoading(false);
    setLoadingStep("");
  }
};

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "Data Analyst",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Product Manager",
  ];

  const features = [
    { icon: <Target size={18} />, text: "Gemini-generated questions per role" },
    { icon: <Mic size={18} />, text: "Live speech-to-text transcription" },
    { icon: <Brain size={18} />, text: "Real-time confidence analysis" },
    { icon: <TrendingUp size={18} />, text: "Detailed AI feedback & STAR tips" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080b12;
          --surface: #0f1520;
          --surface2: #161d2e;
          --border: rgba(255,255,255,0.07);
          --accent: #6c63ff;
          --accent2: #ff6b9d;
          --accent3: #00d4aa;
          --text: #e8eaf0;
          --muted: #6b7280;
          --radius: 20px;
          --glow: 0 0 40px rgba(108,99,255,0.15);
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        /* ── layout ── */
        .shell {
          min-height: 100vh;
          background: var(--bg);
          padding: 36px 24px 60px;
          position: relative;
          overflow: hidden;
        }

        .shell::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: nebula 8s ease-in-out infinite alternate;
        }
        .shell::after {
          content: '';
          position: fixed;
          bottom: -200px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%);
          pointer-events: none;
          animation: nebula 10s ease-in-out infinite alternate-reverse;
        }
        @keyframes nebula {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px, 30px) scale(1.1); }
        }

        .inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

        /* ── header ── */
        .header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 48px;
          animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-text { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
        .badge {
          font-size: 12px; font-weight: 500; color: var(--accent3);
          background: rgba(0,212,170,0.1); border: 1px solid rgba(0,212,170,0.2);
          padding: 6px 14px; border-radius: 100px; letter-spacing: 0.02em;
        }

        /* ── hero text ── */
        .hero { margin-bottom: 40px; animation: fadeUp 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -1.5px;
          margin-bottom: 14px;
        }
        .hero h1 span {
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero p { font-size: 16px; color: var(--muted); max-width: 480px; line-height: 1.7; }

        /* ── stats ── */
        .stats-row {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(108,99,255,0.3);
          transform: translateY(-3px);
          box-shadow: var(--glow);
        }
        .stat-icon {
          width: 38px; height: 38px;
          background: var(--surface2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; color: var(--accent);
        }
        .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -1px; }

        /* ── main grid ── */
        .main-grid {
          display: grid; grid-template-columns: 1fr 420px; gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }

        /* ── form card ── */
        .form-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 36px;
          animation: fadeUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        .form-title {
          font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700;
          margin-bottom: 28px; display: flex; align-items: center; gap: 10px;
        }
        .form-title svg { color: var(--accent2); }
        .field { margin-bottom: 18px; }
        .field label { display: block; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .field select, .field textarea {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          padding: 14px 16px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .field select:focus, .field textarea:focus {
          border-color: rgba(108,99,255,0.5);
          box-shadow: 0 0 0 3px rgba(108,99,255,0.08);
        }
        .field select option { background: #1a2035; }
        .field textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

        .error-msg {
          background: rgba(255,70,70,0.08); border: 1px solid rgba(255,70,70,0.2);
          border-radius: 10px; padding: 12px 16px;
          font-size: 13px; color: #ff7070; margin-bottom: 18px;
        }

        /* ── CTA button ── */
        .cta-btn {
          width: 100%; padding: 17px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border: none; border-radius: 14px; cursor: pointer;
          color: #fff; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
          letter-spacing: 0.02em;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(108,99,255,0.3);
          position: relative; overflow: hidden;
        }
        .cta-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .cta-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(108,99,255,0.4); }
        .cta-btn:hover:not(:disabled)::before { opacity: 1; }
        .cta-btn:active:not(:disabled) { transform: translateY(0); }
        .cta-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .loading-step {
          margin-top: 14px; font-size: 13px; color: var(--muted);
          text-align: center; min-height: 20px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

        /* ── info card ── */
        .info-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 32px;
          animation: fadeUp 0.7s 0.35s cubic-bezier(0.16,1,0.3,1) both;
          position: relative; overflow: hidden;
        }
        .info-card::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%);
          pointer-events: none;
        }
        .info-card-title {
          font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
          margin-bottom: 10px; letter-spacing: -0.5px; position: relative;
        }
        .info-card-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; line-height: 1.6; position: relative; }

        .feature-list { display: flex; flex-direction: column; gap: 12px; position: relative; }
        .feature-item {
          display: flex; align-items: center; gap: 12px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 14px 16px;
          font-size: 14px; font-weight: 500;
          transition: border-color 0.2s, transform 0.2s;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .feature-item:hover { border-color: rgba(108,99,255,0.3); transform: translateX(4px); }
        .feature-item svg { color: var(--accent); flex-shrink: 0; }

        .divider {
          border: none; border-top: 1px solid var(--border);
          margin: 24px 0;
        }

        .tip-box {
          background: rgba(0,212,170,0.06);
          border: 1px solid rgba(0,212,170,0.15);
          border-radius: 12px; padding: 16px;
          font-size: 13px; color: rgba(0,212,170,0.9); line-height: 1.6;
          position: relative;
        }
        .tip-box strong { color: var(--accent3); }

        /* ── particles ── */
        .particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .particle {
          position: absolute;
          background: var(--accent);
          border-radius: 50%;
          animation: float linear infinite;
        }
        @keyframes float {
          0%   { transform: translateY(0) scale(1); opacity: inherit; }
          50%  { transform: translateY(-30px) scale(1.2); }
          100% { transform: translateY(0) scale(1); opacity: inherit; }
        }

        /* ── spinner ── */
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .stats-row { grid-template-columns: 1fr; }
          .header { flex-wrap: wrap; gap: 12px; }
        }
      `}</style>

      <Particles />

      <div className="shell">
        <div className="inner">

          {/* Header */}
          <header className="header">
            <div className="logo">
              <div className="logo-icon">
                <Zap size={20} color="#fff" />
              </div>
              <span className="logo-text">PrepAI</span>
            </div>
            <span className="badge">✦ Powered by Gemini</span>
          </header>

          {/* Hero */}
          <div className="hero">
            <h1>
              Ace your next<br />
              <span>technical interview.</span>
            </h1>
            <p>
              AI-generated questions tailored to your role. Real-time speech
              analysis. Detailed feedback powered by Gemini 1.5 Flash.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <StatCard icon={<Brain size={18} />} label="Interviews Done" value="0" delay={200} />
            <StatCard icon={<Mic size={18} />} label="Avg Speaking Score" value="0" suffix="%" delay={320} />
            <StatCard icon={<Video size={18} />} label="Confidence Level" value="0" suffix="%" delay={440} />
          </div>

          {/* Main grid */}
          <div className="main-grid">

            {/* Form card */}
            <div className="form-card">
              <h2 className="form-title">
                <Sparkles size={20} />
                Create Interview Session
              </h2>

              {error && <div className="error-msg">⚠ {error}</div>}

              <div className="field">
                <label>Job Role *</label>
                <select value={role} onChange={(e) => { setRole(e.target.value); setError(""); }}>
                  <option value="">Select a role...</option>
                  {roles.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="field">
                <label>Experience Level *</label>
                <select value={experience} onChange={(e) => { setExperience(e.target.value); setError(""); }}>
                  <option value="">Select experience...</option>
                  <option value="Fresher">Fresher (0 years)</option>
                  <option value="Junior">Junior (0–2 years)</option>
                  <option value="Mid-level">Mid-level (2–5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>

              <div className="field">
                <label>Primary Language / Stack *</label>
                <select value={language} onChange={(e) => { setLanguage(e.target.value); setError(""); }}>
                  <option value="">Select language...</option>
                  {["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "SQL"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Job Description (optional — improves questions)</label>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here for hyper-relevant questions..."
                />
              </div>

              <button className="cta-btn" onClick={startInterview} disabled={loading}>
                {loading ? (
                  <><Loader2 size={18} className="spin" /> Generating...</>
                ) : (
                  <>Start Interview <ChevronRight size={18} /></>
                )}
              </button>

              {loadingStep && <p className="loading-step">{loadingStep}</p>}
            </div>

            {/* Info card */}
            <div className="info-card">
              <h2 className="info-card-title">What to expect</h2>
              <p className="info-card-sub">
                5 Gemini-crafted questions specific to your role, experience, and stack.
                90 seconds per question. Full AI feedback at the end.
              </p>

              <div className="feature-list">
                {features.map((f, i) => (
                  <div
                    className="feature-item"
                    key={i}
                    style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                  >
                    {f.icon}
                    {f.text}
                  </div>
                ))}
              </div>

              <hr className="divider" />

              <div className="tip-box">
                <strong>Pro tip:</strong> Paste a real job description above. Gemini will
                generate questions that match the exact skills and responsibilities listed,
                making your prep far more targeted.
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}