"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      localStorage.setItem("user", email);
      window.location.href = "/dashboard";
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <p className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles size={16} />
            Welcome Back
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition duration-300">
          <h2 className="text-4xl font-bold mb-2 text-center">
            Login
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Continue your AI Interview journey
          </p>

          {/* Email Input */}
          <div className="relative mb-5">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-4">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-black transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl transition duration-300"
          >
            Login
            <ArrowRight size={18} />
          </button>

          {/* Bottom Text */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-black hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}