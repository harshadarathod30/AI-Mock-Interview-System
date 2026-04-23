// Production-ready rewritten PrepAI homepage
// Clean structure + smooth interactions + better performance

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mic,
  Brain,
  BarChart2,
  Zap,
  Target,
  Star,
  Shield,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice Recognition",
    desc: "Real-time speech capture with fast transcription and answer tracking.",
  },
  {
    icon: Brain,
    title: "Gemini AI Analysis",
    desc: "AI evaluates confidence, filler words, clarity, and answer quality.",
  },
  {
    icon: BarChart2,
    title: "Performance Metrics",
    desc: "Track confidence, speaking speed, tone, and improvement over time.",
  },
  {
    icon: Target,
    title: "Role Specific Questions",
    desc: "Questions generated based on your selected role and experience level.",
  },
];

const stats = [
  ["10K+", "Practice Sessions"],
  ["94%", "Confidence Growth"],
  ["8", "Roles Supported"],
  ["5 min", "Average Session"],
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070B14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-400 shadow-lg">
              <Zap size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">PrepAI</h1>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-400 px-6 py-3 font-semibold shadow-lg transition hover:scale-105"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="mx-auto max-w-6xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-5 py-2 text-sm font-semibold text-indigo-300"
          >
            AI-Powered Interview Practice
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-4xl text-5xl font-black leading-tight md:text-7xl"
          >
            Crack Your Next
            <span className="block bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Tech Interview
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
          >
            Practice with Gemini AI, get real-time feedback, confidence scoring,
            and detailed improvement reports.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-400 px-8 py-4 text-lg font-semibold shadow-xl transition hover:scale-105"
            >
              Start Practicing
              <ArrowRight size={18} />
            </button>

            <button className="rounded-2xl border border-white/15 px-8 py-4 font-medium text-white/80 transition hover:bg-white/5">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
            >
              <h3 className="text-3xl font-bold text-emerald-300">{value}</h3>
              <p className="mt-2 text-sm text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Features
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Everything You Need
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  whileHover={{ y: -6 }}
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
                    <Icon className="text-indigo-300" size={24} />
                  </div>

                  <h3 className="mb-3 text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm leading-7 text-white/65">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-500/10 to-emerald-400/10 p-10 text-center backdrop-blur-xl md:p-16">
          <h2 className="text-4xl font-black md:text-6xl">
            Your Dream Job is
            <span className="block text-emerald-300">One Session Away</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-white/70">
            Start practicing today. No account required. No credit card needed.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-400 px-10 py-4 text-lg font-semibold shadow-xl transition hover:scale-105"
          >
            Start Free Now
          </button>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2"><Shield size={16} /> No signup</span>
            <span className="flex items-center gap-2"><Clock size={16} /> Ready in 30 sec</span>
            <span className="flex items-center gap-2"><Zap size={16} /> Gemini Powered</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/50">
        © 2026 PrepAI — Built with Next.js + Gemini AI
      </footer>
    </main>
  );
}

