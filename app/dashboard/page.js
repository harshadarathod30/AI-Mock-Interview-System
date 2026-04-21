"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Code,
  Sparkles,
  User,
  ArrowRight,
  Brain,
  Mic,
  Video,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [language, setLanguage] = useState("");

  const handleStart = () => {
    if (!role || !experience || !language) {
      alert("Please fill all fields before starting interview 🚀");
      return;
    }

    // Save selected preferences (optional for next page use)
    localStorage.setItem(
      "interviewData",
      JSON.stringify({
        role,
        experience,
        language,
      })
    );

    console.log({
      role,
      experience,
      language,
    });

    // Redirect to interview page
    router.push("/interview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-50 to-cyan-100 p-6">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            AI Mock Interview
          </h1>
          <p className="text-gray-600">
            Practice smarter. Crack interviews faster 🚀
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl shadow-md flex items-center gap-2">
          <User className="text-indigo-600" size={20} />
          <span className="font-medium text-gray-700">
            Welcome Back!
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 shadow-lg hover:scale-105 transition">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="text-purple-600" />
            <h2 className="font-semibold text-lg">
              Total Interviews
            </h2>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">0</h1>
          <p className="text-gray-500 mt-2">
            Start your first mock today
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg hover:scale-105 transition">
          <div className="flex items-center gap-3 mb-3">
            <Mic className="text-pink-600" />
            <h2 className="font-semibold text-lg">
              Speaking Score
            </h2>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">0%</h1>
          <p className="text-gray-500 mt-2">
            AI will track your improvement
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg hover:scale-105 transition">
          <div className="flex items-center gap-3 mb-3">
            <Video className="text-cyan-600" />
            <h2 className="font-semibold text-lg">
              Confidence Level
            </h2>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">0%</h1>
          <p className="text-gray-500 mt-2">
            Grow with every interview
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Left Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Interview
            </h2>
          </div>

          <div className="space-y-5">
            {/* Role */}
            <div>
              <label className="font-medium text-gray-700">
                Select Job Role
              </label>
              <div className="flex items-center border rounded-2xl px-4 py-3 mt-2">
                <Briefcase className="text-indigo-500 mr-3" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="">Choose your role</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Software Engineer</option>
                  <option>Data Analyst</option>
                  <option>Machine Learning Engineer</option>
                </select>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="font-medium text-gray-700">
                Years of Experience
              </label>
              <div className="flex items-center border rounded-2xl px-4 py-3 mt-2">
                <User className="text-pink-500 mr-3" />
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="">Select experience</option>
                  <option>Fresher</option>
                  <option>0-1 Years</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="font-medium text-gray-700">
                Preferred Language
              </label>
              <div className="flex items-center border rounded-2xl px-4 py-3 mt-2">
                <Code className="text-cyan-500 mr-3" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full outline-none bg-transparent"
                >
                  <option value="">Choose language</option>
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>C++</option>
                  <option>TypeScript</option>
                  <option>SQL</option>
                </select>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-4 rounded-2xl font-semibold text-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              Start AI Interview
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Your Personal AI Interview Coach 🤖
          </h2>

          <p className="text-lg text-indigo-100 mb-8">
            Get role-based real interview questions, live feedback,
            speaking analysis, confidence score, and personalized
            improvement tips.
          </p>

          <div className="space-y-4">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-md">
              🎯 Real-world technical + HR questions
            </div>

            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-md">
              🎤 Voice + communication feedback
            </div>

            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-md">
              📈 Performance tracking dashboard
            </div>

            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-md">
              🚀 Personalized improvement roadmap
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}