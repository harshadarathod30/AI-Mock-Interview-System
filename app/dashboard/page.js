import Link from "next/link";
import {
  Mic,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-6 py-10 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="mb-10">
          <p className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            AI Mock Interview Dashboard
          </p>

          <h1 className="text-5xl font-bold mb-3">
            Welcome Back 👋
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl">
            Practice interviews, track your performance, and improve
            your confidence with AI-powered feedback and analytics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <Mic size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  12 Interviews
                </h3>
                <p className="text-sm text-gray-500">
                  Completed sessions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  85% Score
                </h3>
                <p className="text-sm text-gray-500">
                  Average performance
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  5 Reports
                </h3>
                <p className="text-sm text-gray-500">
                  Feedback generated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Interview */}
          <Link
            href="/interview"
            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="bg-black text-white p-4 rounded-2xl">
                <Mic size={28} />
              </div>

              <ArrowRight className="group-hover:translate-x-1 transition duration-300" />
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Start Mock Interview
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Practice HR, Technical, and Behavioral interviews with
              real-time AI feedback and scoring.
            </p>
          </Link>

          {/* Final Report */}
          <Link
            href="/report"
            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="bg-black text-white p-4 rounded-2xl">
                <FileText size={28} />
              </div>

              <ArrowRight className="group-hover:translate-x-1 transition duration-300" />
            </div>

            <h2 className="text-2xl font-bold mb-3">
              View Final Report
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Check your interview history, strengths, weak areas,
              and personalized improvement suggestions.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}