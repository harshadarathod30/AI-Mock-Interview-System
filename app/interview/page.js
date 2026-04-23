"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import {
  Play, Pause, SkipForward,
  Mic, MicOff, Eye, Brain, MessageSquare,
  ChevronRight, Volume2, CheckCircle,
  Zap, Timer, Activity, AlertTriangle
} from "lucide-react";

/* ─── Role-specific fallback questions ─── */
const FALLBACK_QUESTIONS = {
  "Frontend Developer": [
    "Explain the difference between let, const, and var in JavaScript.",
    "How does the Virtual DOM work in React and why is it beneficial?",
    "What strategies do you use to optimize a slow React application?",
    "Describe a challenging UI component you built and how you approached it.",
    "How do you ensure accessibility in your frontend projects?",
  ],
  "Backend Developer": [
    "Explain REST vs GraphQL — when would you choose one over the other?",
    "How do you design a scalable database schema for a social media app?",
    "Walk me through how JWT authentication works end to end.",
    "How do you handle race conditions in a Node.js backend?",
    "Describe the most complex backend system you've built.",
  ],
  "Full Stack Developer": [
    "How do you decide what logic belongs on the frontend vs backend?",
    "Walk me through deploying a full stack Next.js app to production.",
    "How do you handle authentication across frontend and backend securely?",
    "Describe a performance bottleneck you found and how you fixed it.",
    "How do you manage state in a large full stack application?",
  ],
  "Software Engineer": [
    "Explain the time complexity of your favourite sorting algorithm.",
    "How do you approach designing a system for millions of concurrent users?",
    "What is the difference between process and thread? Give a real example.",
    "Describe a time you refactored a large codebase — what was your approach?",
    "How do you write code that is easy for other engineers to maintain?",
  ],
  "Data Analyst": [
    "Walk me through how you'd clean a messy dataset with missing values.",
    "Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN.",
    "How would you detect outliers in a large dataset?",
    "Describe a data analysis project that led to a meaningful business decision.",
    "What visualization would you choose to show sales trends over 3 years, and why?",
  ],
  "Machine Learning Engineer": [
    "Explain the bias-variance tradeoff in your own words.",
    "How do you handle a highly imbalanced dataset in a classification problem?",
    "Walk me through how you would build and deploy an ML model end to end.",
    "What's the difference between bagging and boosting?",
    "Describe a real ML project — what went wrong and how did you fix it?",
  ],
  "DevOps Engineer": [
    "Explain the difference between Docker containers and virtual machines.",
    "How would you set up a CI/CD pipeline for a microservices application?",
    "What is Kubernetes and when would you use it over plain Docker?",
    "How do you monitor and alert on a production system?",
    "Describe the most complex infrastructure problem you've debugged.",
  ],
  "Product Manager": [
    "How do you prioritize features when you have 10 requests and time for 3?",
    "Walk me through how you'd define success metrics for a new feature.",
    "Describe a time you had to say no to a stakeholder — how did you handle it?",
    "How do you balance user needs against business goals?",
    "Tell me about a product you shipped that you're most proud of.",
  ],
};

const DEFAULT_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What is your greatest professional strength?",
  "Describe a challenging project you worked on recently.",
  "Where do you see yourself in 5 years?",
  "Why are you interested in this role?",
];

const TOTAL_TIME = 90;

export default function InterviewPage() {
  const router = useRouter();
  const webcamRef = useRef(null);

  /* ── Speech recognition refs — never in state to avoid stale closures ── */
  const recognitionRef   = useRef(null);
  const shouldListenRef  = useRef(false);  // master ON/OFF switch
  const isRecognizingRef = useRef(false);  // prevents double-start
  const transcriptRef    = useRef("");     // latest transcript for callbacks

  const timerRef     = useRef(null);
  const startTimeRef = useRef(null);

  /* ── UI state ── */
  const [questions, setQuestions]         = useState([]);
  const [interviewData, setInterviewData] = useState({});
  const [currentIdx, setCurrentIdx]       = useState(0);
  const [allAnswers, setAllAnswers]       = useState([]);
  const [phase, setPhase]                 = useState("ready");
  const [timer, setTimer]                 = useState(TOTAL_TIME);
  const [transcript, setTranscript]       = useState("");
  const [isListening, setIsListening]     = useState(false);
  const [micError, setMicError]           = useState("");

  /* ── Analysis state ── */
  const [confidenceScore, setConfidenceScore] = useState(82);
  const [fillerCount, setFillerCount]         = useState(0);
  const [speakingTone, setSpeakingTone]       = useState("Ready");
  const [wordCount, setWordCount]             = useState(0);
  const [wpm, setWpm]                         = useState(0);
  const [waveHeights, setWaveHeights]         = useState(Array(28).fill(3));

  /* ════════════════════════════════════════
     1. LOAD DATA
  ════════════════════════════════════════ */
  useEffect(() => {
    const savedQ    = localStorage.getItem("questions");
    const savedData = localStorage.getItem("interviewData");
    let parsedData  = {};
    if (savedData) { try { parsedData = JSON.parse(savedData); } catch {} }
    setInterviewData(parsedData);

    if (savedQ) {
      try {
        const parsed = JSON.parse(savedQ);
        if (parsed?.length > 0) { setQuestions(parsed); return; }
      } catch {}
    }
    setQuestions(FALLBACK_QUESTIONS[parsedData?.role] || DEFAULT_QUESTIONS);
  }, []);

  /* ════════════════════════════════════════
     2. SPEECH RECOGNITION — bulletproof
     • onend auto-restarts when shouldListenRef = true
     • onerror recovers from all non-fatal errors
     • startRecognition() is idempotent
  ════════════════════════════════════════ */
  useEffect(() => {
    setupRecognition();
    return () => {
      shouldListenRef.current = false;
      try { recognitionRef.current?.abort(); } catch {}
      window.speechSynthesis?.cancel();
      clearInterval(timerRef.current);
    };
  }, []);

  const setupRecognition = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicError("");
    } catch {
      setMicError("Microphone access denied. Please allow mic access in your browser and refresh the page.");
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicError("Speech recognition not supported. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    const r = new SR();
    r.continuous      = true;
    r.interimResults  = true;
    r.lang            = "en-US";
    r.maxAlternatives = 1;

    r.onresult = (e) => {
      let full = "";
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript;
      }
      transcriptRef.current = full;
      setTranscript(full);
      analyzeAnswer(full);
      setWaveHeights(Array(28).fill(0).map(() => 3 + Math.random() * 20));
    };

    /* KEY FIX: onend restarts automatically while shouldListenRef is true */
    r.onend = () => {
      isRecognizingRef.current = false;
      setWaveHeights(Array(28).fill(3));
      if (shouldListenRef.current) {
        setTimeout(() => startRecognition(), 150);
      } else {
        setIsListening(false);
      }
    };

    r.onerror = (e) => {
      isRecognizingRef.current = false;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        shouldListenRef.current = false;
        setIsListening(false);
        setMicError("Microphone blocked. Click the lock/mic icon in your browser address bar → Allow microphone → Refresh.");
        return;
      }
      /* no-speech / aborted / network — all recoverable */
      if (shouldListenRef.current) {
        setTimeout(() => startRecognition(), 200);
      }
    };

    recognitionRef.current = r;
  };

  const startRecognition = () => {
    if (!recognitionRef.current || isRecognizingRef.current || !shouldListenRef.current) return;
    try {
      recognitionRef.current.start();
      isRecognizingRef.current = true;
      setIsListening(true);
      setMicError("");
    } catch (e) {
      isRecognizingRef.current = false;
    }
  };

  const stopRecognition = () => {
    shouldListenRef.current  = false;
    isRecognizingRef.current = false;
    setIsListening(false);
    setWaveHeights(Array(28).fill(3));
    try { recognitionRef.current?.stop(); } catch {}
  };

  /* ════════════════════════════════════════
     3. ANALYZE SPEECH
  ════════════════════════════════════════ */
  const analyzeAnswer = useCallback((text) => {
    const fillers = ["um", "uh", "like", "basically", "actually", "you know", "so", "right"];
    let count = 0;
    fillers.forEach(w => {
      const m = text.match(new RegExp(`\\b${w}\\b`, "gi"));
      if (m) count += m.length;
    });
    setFillerCount(count);

    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    if (startTimeRef.current && words.length > 0) {
      const mins = (Date.now() - startTimeRef.current) / 60000;
      setWpm(Math.round(words.length / Math.max(mins, 0.1)));
    }

    let score = 88;
    if (count > 2)         score -= 10;
    if (count > 5)         score -= 15;
    if (words.length < 20) score -= 10;
    if (words.length > 80) score += 5;
    setConfidenceScore(Math.min(Math.max(score, 40), 98));

    if      (count === 0) setSpeakingTone("Excellent");
    else if (count < 3)   setSpeakingTone("Good");
    else if (count < 6)   setSpeakingTone("Average");
    else                  setSpeakingTone("Needs Work");
  }, []);

  /* ════════════════════════════════════════
     4. TTS
  ════════════════════════════════════════ */
  const speakQuestion = useCallback((idx, qList) => {
    const list = qList || questions;
    const q    = list[idx];
    if (!q) return;
    window.speechSynthesis.cancel();
    const u    = new SpeechSynthesisUtterance(q);
    u.rate     = 0.95;
    u.pitch    = 1;
    const go   = () => {
      const voices = window.speechSynthesis.getVoices();
      const pref   = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha")));
      if (pref) u.voice = pref;
      window.speechSynthesis.speak(u);
    };
    window.speechSynthesis.getVoices().length > 0
      ? go()
      : (window.speechSynthesis.onvoiceschanged = go);
  }, [questions]);

  /* ════════════════════════════════════════
     5. NEXT QUESTION / TIMER
  ════════════════════════════════════════ */
  const handleNextQuestion = useCallback(() => {
    const updated = [...allAnswers, {
      question:    questions[currentIdx],
      answer:      transcriptRef.current,
      score:       confidenceScore,
      fillerWords: fillerCount,
      wordCount,
      wpm,
    }];
    setAllAnswers(updated);

    transcriptRef.current = "";
    setTranscript(""); setFillerCount(0); setWordCount(0);
    setWpm(0); setTimer(TOTAL_TIME);
    setConfidenceScore(82); setSpeakingTone("Ready");
    startTimeRef.current = Date.now();

    if (currentIdx < questions.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setTimeout(() => speakQuestion(next), 800);
    } else {
      finishInterview(updated);
    }
  }, [allAnswers, questions, currentIdx, confidenceScore, fillerCount, wordCount, wpm, speakQuestion]);

  useEffect(() => {
    if (phase !== "active") { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleNextQuestion(); return TOTAL_TIME; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, currentIdx]);

  /* ════════════════════════════════════════
     6. CONTROLS
  ════════════════════════════════════════ */
  const handleStart = () => {
    setPhase("active");
    setTimer(TOTAL_TIME);
    startTimeRef.current = Date.now();
    speakQuestion(currentIdx, questions);
    shouldListenRef.current = true;
    startRecognition();
  };

  const handlePause = () => {
    setPhase("paused");
    clearInterval(timerRef.current);
    window.speechSynthesis.cancel();
    stopRecognition();
  };

  const handleResume = () => {
    setPhase("active");
    shouldListenRef.current = true;
    startRecognition();
  };

  const handleRepeat = () => speakQuestion(currentIdx, questions);

  /* ════════════════════════════════════════
     7. FINISH
  ════════════════════════════════════════ */
  const finishInterview = async (answers) => {
    setPhase("done");
    clearInterval(timerRef.current);
    window.speechSynthesis.cancel();
    stopRecognition();

    const base = {
      overallScore: Math.round(confidenceScore / 10),
      confidenceRating: confidenceScore,
      summary: "Interview complete! Analysing performance...",
      strengths: ["Completed all questions", "Demonstrated communication skills"],
      weaknesses: fillerCount > 4
        ? ["Too many filler words", "Work on speaking confidence"]
        : ["Add more specific examples", "Use STAR method more"],
      improvementTips: ["Use STAR method", "Prepare real project examples", "Practice concise answers"],
      answers, role: interviewData?.role, experience: interviewData?.experience,
    };
    localStorage.setItem("feedback", JSON.stringify(base));

    try {
      const res  = await fetch("/api/analyze-feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, confidenceScore, fillerWords: fillerCount, speakingTone, eyeContact: "Good" }),
      });
      const data = await res.json();
      if (data.feedback) {
        localStorage.setItem("feedback", JSON.stringify({ ...data.feedback, answers, role: interviewData?.role, experience: interviewData?.experience }));
      }
    } catch {}

    router.push("/feedback");
  };

  /* ════════════════════════════════════════
     8. DERIVED
  ════════════════════════════════════════ */
  const progress   = questions.length > 0 ? (currentIdx / questions.length) * 100 : 0;
  const timerPct   = (timer / TOTAL_TIME) * 100;
  const timerColor = timer > 30 ? "#00d4aa" : timer > 10 ? "#f59e0b" : "#ef4444";
  const currentQ   = questions[currentIdx] || "Loading question...";
  const isLastQ    = currentIdx === questions.length - 1;

  /* ════════════════════════════════════════
     9. RENDER
  ════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#060910;--s1:#0d1117;--s2:#111827;--s3:#1a2235;
          --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.1);
          --a1:#6366f1;--a2:#8b5cf6;--a3:#00d4aa;--a4:#f59e0b;
          --danger:#ef4444;--text:#f1f5f9;--muted:#64748b;--muted2:#94a3b8;
        }
        body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif}
        .iv-shell{min-height:100vh;display:flex;flex-direction:column}
        .iv-topbar{
          display:flex;align-items:center;justify-content:space-between;
          padding:14px 28px;background:rgba(13,17,23,0.97);
          border-bottom:1px solid var(--border);backdrop-filter:blur(20px);
          position:sticky;top:0;z-index:50;gap:16px;flex-wrap:wrap;
        }
        .iv-logo{display:flex;align-items:center;gap:8px}
        .iv-logo-dot{width:10px;height:10px;border-radius:50%;background:var(--a3);box-shadow:0 0 10px var(--a3);animation:pdot 2s ease-in-out infinite}
        @keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.85)}}
        .iv-logo span{font-size:14px;font-weight:600;color:var(--muted2)}
        .iv-logo strong{color:var(--text)}
        .iv-prog-wrap{flex:1;max-width:500px}
        .iv-prog-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:6px}
        .iv-prog-track{height:4px;background:var(--s3);border-radius:99px;overflow:hidden}
        .iv-prog-fill{height:100%;background:linear-gradient(90deg,var(--a1),var(--a3));border-radius:99px;transition:width .6s cubic-bezier(.34,1.56,.64,1)}
        .iv-role-badge{display:flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--border2);border-radius:100px;padding:6px 14px;font-size:13px;font-weight:500;white-space:nowrap}
        .iv-role-badge svg{color:var(--a1)}
        .iv-grid{display:grid;grid-template-columns:1fr 380px;gap:20px;padding:24px 28px;max-width:1400px;margin:0 auto;width:100%;flex:1}
        @media(max-width:1024px){.iv-grid{grid-template-columns:1fr}}
        .iv-left,.iv-right{display:flex;flex-direction:column;gap:16px}
        .iv-mic-error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:14px;padding:14px 18px;display:flex;align-items:flex-start;gap:12px;font-size:14px;color:#fca5a5;line-height:1.5}
        .iv-mic-error svg{color:var(--danger);flex-shrink:0;margin-top:1px}
        .iv-qcard{background:var(--s1);border:1px solid var(--border2);border-radius:20px;padding:32px;position:relative;overflow:hidden}
        .iv-qcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--a1),var(--a2),var(--a3))}
        .iv-q-meta{display:flex;align-items:center;gap:10px;margin-bottom:20px}
        .iv-q-num{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:var(--a1);letter-spacing:.1em;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);padding:4px 10px;border-radius:6px}
        .iv-q-tag{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
        .iv-q-text{font-size:clamp(18px,2.5vw,24px);font-weight:600;line-height:1.5;animation:fadeQ .4s ease}
        @keyframes fadeQ{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .iv-timer-wrap{position:absolute;top:28px;right:28px}
        .iv-timer-ring{position:relative;width:64px;height:64px}
        .iv-timer-svg{transform:rotate(-90deg)}
        .iv-timer-track{fill:none;stroke:var(--s3);stroke-width:5}
        .iv-timer-fill{fill:none;stroke-width:5;stroke-linecap:round;stroke-dasharray:163;transition:stroke-dashoffset 1s linear,stroke .3s}
        .iv-timer-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700}
        .iv-controls{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:18px 22px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .iv-btn{display:flex;align-items:center;gap:7px;padding:11px 18px;border-radius:12px;border:none;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .18s;white-space:nowrap}
        .iv-btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.1)}
        .iv-btn:active:not(:disabled){transform:translateY(0)}
        .iv-btn:disabled{opacity:.4;cursor:not-allowed}
        .btn-start{background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 4px 16px rgba(16,185,129,.3)}
        .btn-pause{background:var(--s3);color:var(--text);border:1px solid var(--border2)}
        .btn-repeat{background:var(--s3);color:var(--text);border:1px solid var(--border2)}
        .btn-next{background:linear-gradient(135deg,var(--a1),var(--a2));color:#fff;box-shadow:0 4px 16px rgba(99,102,241,.3);margin-left:auto}
        .btn-finish{background:linear-gradient(135deg,var(--a3),#059669);color:#fff;box-shadow:0 4px 16px rgba(0,212,170,.3);margin-left:auto}
        .iv-mic-pill{display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;background:var(--s2);font-size:13px;font-weight:500;transition:border .2s}
        .iv-mic-pill.on{border:1px solid rgba(0,212,170,.3)}
        .iv-mic-pill.off{border:1px solid rgba(239,68,68,.2)}
        .iv-mic-dot{width:8px;height:8px;border-radius:50%}
        .iv-mic-dot.on{background:var(--a3);box-shadow:0 0 8px var(--a3);animation:mp 1s ease-in-out infinite}
        .iv-mic-dot.off{background:var(--danger)}
        @keyframes mp{0%,100%{opacity:1}50%{opacity:.4}}
        .iv-transcript{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:24px;flex:1;min-height:160px}
        .iv-tr-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .iv-tr-title{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.1em}
        .iv-tr-title svg{color:var(--a1)}
        .iv-wc{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted)}
        .iv-tr-body{font-size:15px;line-height:1.7;color:var(--muted);min-height:80px}
        .iv-tr-body.live{color:var(--text)}
        .iv-cursor{display:inline-block;width:2px;height:16px;background:var(--a3);margin-left:2px;vertical-align:middle;animation:blink 1s step-end infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .iv-wave{display:flex;align-items:center;gap:2px;height:28px;margin-top:14px}
        .iv-wave-bar{width:3px;background:var(--a1);border-radius:99px;transition:height .08s ease;min-height:3px}
        .iv-cam-wrap{background:#000;border:1px solid var(--border);border-radius:20px;overflow:hidden;position:relative}
        .iv-cam-overlay{position:absolute;bottom:12px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:flex-end}
        .iv-cam-label{background:rgba(0,0,0,.65);backdrop-filter:blur(8px);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:500;display:flex;align-items:center;gap:6px}
        .iv-cam-label svg{color:var(--a3)}
        .iv-rec{background:rgba(239,68,68,.8);backdrop-filter:blur(8px);border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;color:#fff;display:flex;align-items:center;gap:5px;letter-spacing:.05em}
        .iv-rec-dot{width:6px;height:6px;border-radius:50%;background:#fff;animation:mp 1s infinite}
        .iv-metrics{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:20px}
        .iv-metrics-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .iv-metrics-title svg{color:var(--a1)}
        .iv-metric-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .iv-metric{background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:14px;transition:border-color .2s}
        .iv-metric:hover{border-color:rgba(99,102,241,.3)}
        .iv-metric-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px;display:flex;align-items:center;gap:5px}
        .iv-metric-value{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:700}
        .iv-metric-sub{font-size:11px;color:var(--muted);margin-top:2px}
        .iv-conf-track{height:4px;background:var(--s3);border-radius:99px;margin-top:8px;overflow:hidden}
        .iv-conf-fill{height:100%;background:linear-gradient(90deg,var(--a1),var(--a3));border-radius:99px;transition:width .5s ease}
        .iv-answered{background:var(--s1);border:1px solid var(--border);border-radius:20px;padding:20px}
        .iv-answered-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px}
        .iv-answered-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--muted2)}
        .iv-answered-item:last-child{border-bottom:none}
        .iv-answered-item svg{color:var(--a3);flex-shrink:0}
        .iv-answered-item span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .iv-done{position:fixed;inset:0;z-index:100;background:rgba(6,9,16,.97);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;text-align:center;padding:32px;animation:fadeIn .4s ease}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .iv-done-icon{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--a1),var(--a3));display:flex;align-items:center;justify-content:center;animation:pop .5s cubic-bezier(.34,1.56,.64,1)}
        @keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
        .iv-done h2{font-size:32px;font-weight:800;letter-spacing:-1px}
        .iv-done p{font-size:16px;color:var(--muted2)}
        .iv-done-btn{margin-top:8px;padding:14px 36px;background:linear-gradient(135deg,var(--a1),var(--a2));border:none;border-radius:14px;cursor:pointer;color:#fff;font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;box-shadow:0 8px 24px rgba(99,102,241,.4);animation:fadeUp .5s .3s ease both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {phase === "done" && (
        <div className="iv-done">
          <div className="iv-done-icon"><CheckCircle size={36} color="#fff" /></div>
          <h2>Interview Complete!</h2>
          <p>Generating your AI-powered feedback report...</p>
          <button className="iv-done-btn" onClick={() => router.push("/feedback")}>
            View Feedback <ChevronRight size={16} style={{ display: "inline" }} />
          </button>
        </div>
      )}

      <div className="iv-shell">

        {/* Top bar */}
        <header className="iv-topbar">
          <div className="iv-logo">
            <div className="iv-logo-dot" />
            <span><strong>PrepAI</strong> · Interview Room</span>
          </div>
          <div className="iv-prog-wrap">
            <div className="iv-prog-meta">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="iv-prog-track">
              <div className="iv-prog-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="iv-role-badge">
            <Zap size={14} />
            {interviewData?.role || "Interview"}
            {interviewData?.experience ? ` · ${interviewData.experience}` : ""}
          </div>
        </header>

        <div className="iv-grid">

          {/* LEFT */}
          <div className="iv-left">

            {micError && (
              <div className="iv-mic-error">
                <AlertTriangle size={18} />
                <span>{micError}</span>
              </div>
            )}

            {/* Question */}
            <div className="iv-qcard">
              <div className="iv-q-meta">
                <span className="iv-q-num">Q{String(currentIdx + 1).padStart(2, "0")}</span>
                <span className="iv-q-tag">{interviewData?.role || "Interview"} Question</span>
              </div>
              <p className="iv-q-text" key={currentIdx}>{currentQ}</p>
              <div className="iv-timer-wrap">
                <div className="iv-timer-ring">
                  <svg className="iv-timer-svg" width="64" height="64" viewBox="0 0 64 64">
                    <circle className="iv-timer-track" cx="32" cy="32" r="26" />
                    <circle className="iv-timer-fill" cx="32" cy="32" r="26"
                      stroke={timerColor}
                      strokeDashoffset={163 - (163 * timerPct) / 100}
                    />
                  </svg>
                  <div className="iv-timer-num" style={{ color: timerColor }}>{timer}s</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="iv-controls">
              {phase === "ready"  && <button className="iv-btn btn-start" onClick={handleStart}><Play size={16} /> Start Interview</button>}
              {phase === "active" && <button className="iv-btn btn-pause" onClick={handlePause}><Pause size={16} /> Pause</button>}
              {phase === "paused" && <button className="iv-btn btn-start" onClick={handleResume}><Play size={16} /> Resume</button>}

              <button className="iv-btn btn-repeat" onClick={handleRepeat} disabled={phase === "ready"}>
                <Volume2 size={16} /> Repeat
              </button>

              <div className={`iv-mic-pill ${isListening ? "on" : "off"}`}>
                <div className={`iv-mic-dot ${isListening ? "on" : "off"}`} />
                {isListening ? <Mic size={14} /> : <MicOff size={14} />}
                <span>{isListening ? "Listening" : "Mic off"}</span>
              </div>

              {isLastQ
                ? <button className="iv-btn btn-finish" onClick={handleNextQuestion} disabled={phase === "ready"}><CheckCircle size={16} /> Finish</button>
                : <button className="iv-btn btn-next"   onClick={handleNextQuestion} disabled={phase === "ready"}>Next <SkipForward size={16} /></button>
              }
            </div>

            {/* Transcript */}
            <div className="iv-transcript">
              <div className="iv-tr-header">
                <div className="iv-tr-title"><MessageSquare size={14} /> Live Transcript</div>
                <span className="iv-wc">{wordCount} words · {wpm} wpm</span>
              </div>
              <div className={`iv-tr-body ${transcript ? "live" : ""}`}>
                {transcript || "Start speaking — your answer will appear here in real time"}
                {isListening && <span className="iv-cursor" />}
              </div>
              <div className="iv-wave">
                {waveHeights.map((h, i) => (
                  <div key={i} className="iv-wave-bar" style={{ height: `${h}px` }} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="iv-right">

            <div className="iv-cam-wrap">
              <Webcam ref={webcamRef} mirrored audio={false} style={{ width: "100%", display: "block" }} />
              <div className="iv-cam-overlay">
                <div className="iv-cam-label"><Eye size={12} /> Camera On</div>
                {phase === "active" && <div className="iv-rec"><div className="iv-rec-dot" /> REC</div>}
              </div>
            </div>

            <div className="iv-metrics">
              <div className="iv-metrics-title"><Activity size={14} /> Live Analysis</div>
              <div className="iv-metric-row">
                <div className="iv-metric">
                  <div className="iv-metric-label"><Brain size={12} /> Confidence</div>
                  <div className="iv-metric-value" style={{ color: confidenceScore > 75 ? "var(--a3)" : confidenceScore > 55 ? "var(--a4)" : "var(--danger)" }}>{confidenceScore}%</div>
                  <div className="iv-conf-track"><div className="iv-conf-fill" style={{ width: `${confidenceScore}%` }} /></div>
                </div>
                <div className="iv-metric">
                  <div className="iv-metric-label"><Mic size={12} /> Tone</div>
                  <div className="iv-metric-value" style={{ fontSize: 14, paddingTop: 4, color: speakingTone === "Excellent" ? "var(--a3)" : speakingTone === "Good" ? "#60a5fa" : speakingTone === "Average" ? "var(--a4)" : "var(--danger)" }}>{speakingTone}</div>
                  <div className="iv-metric-sub">{fillerCount} filler words</div>
                </div>
                <div className="iv-metric">
                  <div className="iv-metric-label"><Timer size={12} /> Speed</div>
                  <div className="iv-metric-value" style={{ color: "var(--a1)" }}>{wpm}</div>
                  <div className="iv-metric-sub">words/min</div>
                </div>
                <div className="iv-metric">
                  <div className="iv-metric-label"><Eye size={12} /> Words</div>
                  <div className="iv-metric-value" style={{ color: "var(--muted2)" }}>{wordCount}</div>
                  <div className="iv-metric-sub">spoken so far</div>
                </div>
              </div>
            </div>

            {allAnswers.length > 0 && (
              <div className="iv-answered">
                <div className="iv-answered-title">Completed</div>
                {allAnswers.map((a, i) => (
                  <div className="iv-answered-item" key={i}>
                    <CheckCircle size={14} />
                    <span>Q{i + 1}: {a.question}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}