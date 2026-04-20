"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Mic,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight,
  User,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [interviews, setInterviews] = useState(0);
  const [score, setScore] = useState(0);
  const [reports, setReports] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUserName(
          parsedUser.fullName ||
            parsedUser.email?.split("@")[0] ||
            "User"
        );
      } catch {
        setUserName(storedUser);
      }
    }

    // Dynamic live stats (initially empty)
    const interviewCount =
      Number(localStorage.getItem("interviews")) || 0;

    const avgScore =
      Number(localStorage.getItem("avgScore")) || 0;

    const reportCount =
      Number(localStorage.getItem("reports")) || 0;

    setInterviews(interviewCount);
    setScore(avgScore);
    setReports(reportCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-6 py-10 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10">
          <div>
            <p className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} />
              AI Mock Interview Dashboard
            </p>

            <h1 className="text-5xl font-bold mb-3">
              Welcome Back, {userName} 👋
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl">
              Start your interview journey, improve your confidence,
              and track your progress with real-time AI feedback.
            </p>
          </div>

          {/* Profile + Logout */}
          <div className="flex gap-4 mt-6 md:mt-0">
            <div className="bg-white border border-gray-200 shadow-sm px-5 py-3 rounded-2xl flex items-center gap-3">
              <User size={20} />
              <span className="font-medium">{userName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <Mic size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {interviews} Interviews
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
                  {score}% Score
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
                  {reports} Reports
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
            href="/feedback"
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
              Check interview history, strengths, weak areas, and
              personalized AI improvement suggestions.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}