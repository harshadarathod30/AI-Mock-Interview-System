import Link from "next/link";
import { Briefcase, Brain, BarChart3, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <nav className="flex items-center justify-between mb-20">
          <h1 className="text-2xl font-bold tracking-tight">
            AI Interview Pro
          </h1>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-gray-600 transition duration-300"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="bg-black text-white px-5 py-2 rounded-xl text-sm font-medium hover:scale-105 hover:shadow-lg transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div>
            <p className="inline-flex items-center gap-2 bg-white shadow-sm border border-gray-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              Smart AI-Powered Interview Practice
            </p>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Crack Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">
                Dream Job Faster
              </span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              Practice HR, Technical, and Behavioral interviews with
              real-time AI feedback, scoring, performance analytics,
              and personalized improvement suggestions.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="bg-black text-white px-7 py-4 rounded-2xl font-medium hover:scale-105 hover:shadow-xl transition duration-300"
              >
                Start Free
              </Link>

              <Link
                href="/login"
                className="border border-gray-300 bg-white px-7 py-4 rounded-2xl font-medium hover:bg-gray-50 transition duration-300"
              >
                Explore Demo
              </Link>
            </div>
          </div>

          {/* Right Feature Cards */}
          <div className="grid gap-5">
            <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Brain />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    AI Feedback Engine
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Instant detailed feedback after every interview.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <BarChart3 />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Performance Analytics
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Track your scores, strengths, and weak areas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Briefcase />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Real Interview Experience
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Simulate actual company interview rounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}