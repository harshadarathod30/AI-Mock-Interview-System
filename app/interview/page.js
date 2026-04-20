"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Bot,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";

const questions = [
  "Tell me about yourself.",
  "Explain your final year project in brief.",
  "What are your strengths and weaknesses?",
  "Why should we hire you for this role?",
  "Describe a challenging situation you faced and how you solved it.",
];

export default function InterviewPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [answer, setAnswer] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef(null);

  /* CAMERA PREVIEW */
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (cameraOn) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    startCamera();
  }, [cameraOn]);

  /* AI BOT SPEAKING QUESTION */
  useEffect(() => {
    speakQuestion(currentQuestion);
  }, [currentQuestion]);

  const speakQuestion = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const handleSubmit = () => {
    if (!answer.trim()) {
      alert("Please answer the question first");
      return;
    }

    // Save dynamic stats
    const prevInterviews =
      Number(localStorage.getItem("interviews")) || 0;
    const prevReports =
      Number(localStorage.getItem("reports")) || 0;

    localStorage.setItem(
      "interviews",
      String(prevInterviews + 1)
    );

    localStorage.setItem(
      "reports",
      String(prevReports + 1)
    );

    localStorage.setItem("avgScore", "85");

    // Next Question
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setAnswer("");
    } else {
      alert("Interview Completed Successfully!");
      window.location.href = "/feedback";
    }
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
            AI bot asks questions automatically with real camera preview.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI BOT */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">
              AI Interviewer
            </h2>

            <div className="bg-gray-900 rounded-3xl h-[430px] flex flex-col items-center justify-center text-white relative overflow-hidden">
              <div
                className={`p-8 rounded-full mb-4 ${
                  isSpeaking
                    ? "bg-green-500/20 animate-pulse"
                    : "bg-white/10"
                }`}
              >
                <Bot size={80} />
              </div>

              <h3 className="text-2xl font-semibold mb-2">
                HR Interview Bot
              </h3>

              <p className="text-center max-w-md px-6 text-gray-200">
                {currentQuestion}
              </p>

              <div className="absolute top-4 right-4 bg-red-500 px-4 py-1 rounded-full text-sm font-medium">
                LIVE
              </div>

              {isSpeaking && (
                <div className="mt-4 flex items-center gap-2 text-green-300">
                  <Volume2 size={18} />
                  AI is speaking...
                </div>
              )}
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

          {/* USER RESPONSE */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">
              Your Response
            </h2>

            {/* LIVE CAMERA */}
            <div className="rounded-3xl h-[240px] overflow-hidden border mb-6 bg-black">
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-white">
                  Camera Off
                </div>
              )}
            </div>

            {/* Current Question */}
            <div className="bg-gray-50 border rounded-2xl p-5 mb-5">
              <p className="font-medium text-lg mb-2">
                Current Question:
              </p>
              <p className="text-gray-700">
                {currentQuestion}
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