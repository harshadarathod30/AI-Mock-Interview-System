"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!fullName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Save user data temporarily in localStorage
    const userData = {
      fullName,
      email,
      password,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    alert("Account created successfully!");

    // Redirect to dashboard
    window.location.href = "/dashboard";
  };

  const handleGoogleSignup = () => {
    alert("Google Sign Up integration will be added with Firebase/Auth.js");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <p className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles size={16} />
            Start Your Journey
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-3xl p-8">
          <h2 className="text-4xl font-bold text-center mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Join the AI Mock Interview Platform
          </p>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full border border-gray-300 bg-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:shadow-md transition mb-6"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <p className="text-sm text-gray-400">or continue with email</p>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Full Name */}
          <div className="relative mb-5">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div className="relative mb-5">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >
            Create Account
            <ArrowRight size={18} />
          </button>

          {/* Bottom Text */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
