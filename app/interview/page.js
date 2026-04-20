"use client";

import { useState } from "react";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Bot,
  Send,
  Sparkles,
} from "lucide-react";

export default function InterviewPage() {
  const [answer, setAnswer] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const handleSubmit = () => {
    if (!answer.trim()) {
      alert("Please enter your answer first");
      return;
    }

    alert("Answer submitted successfully!");
    setAnswer("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-6 py-10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            Live AI Interview Session
          </p>

          <h1 className="text-5xl font-bold mb-3">
            Professional Mock Interview
          </h1>

          <p className="text-gray-600 text-lg">
            Practice with your AI interviewer in a real interview-like
            environment.
          </p>
        </div>

        {/* Main Interview Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Interviewer Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">
              AI Interviewer
            </h2>

            {/* Bot Screen */}
            <div className="bg-gray-900 rounded-3xl h-[420px] flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div className="bg-white/10 p-8 rounded-full mb-4">
                <Bot size={80} />
              </div>

              <h3 className="text-2xl font-semibold mb-2">
                HR Interview Bot
              </h3>

              <p className="text-gray-300 text-center max-w-md px-6">
                Hello! I’ll be conducting your interview today.
                Please introduce yourself and tell me about your
                background.
              </p>

              {/* Live Label */}
              <div className="absolute top-4 right-4 bg-red-500 px-4 py-1 rounded-full text-sm font-medium">
                LIVE
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-4 rounded-2xl transition ${
                  micOn
                    ? "bg-black text-white"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {micOn ? <Mic size={22} /> : <MicOff size={22} />}
              </button>

              <button
                onClick={() => setCameraOn(!cameraOn)}
                className={`p-4 rounded-2xl transition ${
                  cameraOn
                    ? "bg-black text-white"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {cameraOn ? (
                  <Video size={22} />
                ) : (
                  <VideoOff size={22} />
                )}
              </button>
            </div>
          </div>

          {/* Candidate Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">
              Your Response
            </h2>

            {/* User Camera Preview */}
            <div className="bg-gray-100 rounded-3xl h-[220px] flex items-center justify-center mb-6 border">
              <div className="text-center">
                <Video size={50} className="mx-auto mb-3" />
                <p className="text-gray-500">
                  Your Camera Preview
                </p>
              </div>
            </div>

            {/* Question */}
            <div className="bg-gray-50 border rounded-2xl p-5 mb-5">
              <p className="font-medium text-lg">
                Question:
              </p>
              <p className="text-gray-700 mt-2">
                Tell me about yourself and explain your technical
                background.
              </p>
            </div>

            {/* Answer Box */}
            <textarea
              rows={7}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full mt-5 bg-black text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-xl transition"
            >
              Submit Answer
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}