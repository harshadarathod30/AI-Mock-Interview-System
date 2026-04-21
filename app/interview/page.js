"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  Bot,
} from "lucide-react";

export default function AIInterviewRoom() {
  const videoRef = useRef(null);

  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [timer, setTimer] = useState(90);
  const [isRunning, setIsRunning] = useState(false);

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [language, setLanguage] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  /*
    Load data from Dashboard page
    Saved using localStorage from dashboard
  */
  useEffect(() => {
    const savedData = JSON.parse(
      localStorage.getItem("interviewData")
    );

    if (savedData) {
      setRole(savedData.role);
      setExperience(savedData.experience);
      setLanguage(savedData.language);

      generateQuestions(savedData.role, savedData.experience);
    }
  }, []);

  /*
    Dynamic Questions based on selected role
    (Later replace this with Gemini API)
  */
  const generateQuestions = (selectedRole, selectedExperience) => {
    let generated = [];

    if (selectedRole === "Frontend Developer") {
      generated = [
        "Tell me about yourself and your frontend experience.",
        "Explain React lifecycle in real-world projects.",
        "How do you optimize performance in large React applications?",
        "Difference between useEffect and useMemo?",
        "How would you handle authentication in Next.js?",
      ];
    } else if (selectedRole === "Backend Developer") {
      generated = [
        "Explain REST API design best practices.",
        "How do you handle database optimization?",
        "What is JWT authentication?",
        "How do you scale backend systems?",
        "Difference between SQL and NoSQL?",
      ];
    } else {
      generated = [
        "Tell me about yourself.",
        "Explain your recent project.",
        "What challenges did you face?",
        "How do you solve production issues?",
        "Why should we hire you?",
      ];
    }

    setQuestions(generated);
  };

  /*
    Camera + Mic Permission
  */
  const startInterviewSetup = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
      setMicOn(true);
    } catch (error) {
      alert("Please allow Camera + Microphone access");
      console.log(error);
    }
  };

  useEffect(() => {
    startInterviewSetup();
  }, []);

  /*
    Live Timer
  */
  useEffect(() => {
    let interval;

    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      handleSkip();
    }

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  /*
    Controls
  */
  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleRepeat = () => {
    setTimer(90);
    setIsRunning(false);
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimer(90);
      setIsRunning(false);
    } else {
      alert("Interview Completed 🚀");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <div className="bg-white/5 rounded-3xl p-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center mx-auto">
            <Bot size={50} />
          </div>

          <h1 className="text-3xl font-bold text-center mt-6">
            AI HR Interviewer
          </h1>

          <p className="text-center text-gray-400 mt-2">
            {role || "Loading Role..."}
          </p>

          <p className="text-center text-sm text-gray-500">
            {experience} • {language}
          </p>

          <div className="bg-white/5 rounded-2xl p-5 mt-6">
            <p className="text-sm text-violet-300 mb-2">
              Current Question
            </p>

            <p className="text-lg leading-relaxed">
              {questions.length > 0
                ? questions[currentQuestion]
                : "Generating AI Questions..."}
            </p>
          </div>

          <button
            onClick={handleRepeat}
            className="w-full mt-6 bg-violet-600 py-3 rounded-2xl hover:bg-violet-700"
          >
            <div className="flex items-center justify-center gap-2">
              <RotateCcw size={18} />
              Repeat Question
            </div>
          </button>
        </div>

        {/* CENTER PANEL */}
        <div className="bg-white/5 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Your Live Preview
            </h2>

            <div className="text-right">
              <p className="text-sm text-gray-400">
                Answer Time Left
              </p>

              <h1 className="text-3xl font-bold text-pink-400">
                {timer}s
              </h1>
            </div>
          </div>

          <div className="h-[400px] rounded-3xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className="bg-gray-800 py-3 rounded-2xl"
            >
              <div className="flex items-center justify-center gap-2">
                {cameraOn ? <Video /> : <VideoOff />}
                {cameraOn ? "Camera ON" : "Camera OFF"}
              </div>
            </button>

            <button
              onClick={() => setMicOn(!micOn)}
              className="bg-gray-800 py-3 rounded-2xl"
            >
              <div className="flex items-center justify-center gap-2">
                {micOn ? <Mic /> : <MicOff />}
                {micOn ? "Mic ON" : "Mic OFF"}
              </div>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <button
              onClick={handleStart}
              className="bg-green-600 py-3 rounded-2xl hover:bg-green-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Play size={18} />
                Start
              </div>
            </button>

            <button
              onClick={handlePause}
              className="bg-yellow-500 py-3 rounded-2xl hover:bg-yellow-600"
            >
              <div className="flex items-center justify-center gap-2">
                <Pause size={18} />
                Pause
              </div>
            </button>

            <button
              onClick={handleSkip}
              className="bg-gray-800 py-3 rounded-2xl hover:bg-gray-700"
            >
              <div className="flex items-center justify-center gap-2">
                <SkipForward size={18} />
                Skip
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/5 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Live AI Analysis
          </h2>

          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-2xl">
              Confidence Score: Live Tracking...
            </div>

            <div className="bg-white/5 p-4 rounded-2xl">
              Grammar Score: AI Evaluating...
            </div>

            <div className="bg-white/5 p-4 rounded-2xl">
              Filler Words: Detecting...
            </div>

            <div className="bg-white/5 p-4 rounded-2xl">
              Tone Analysis: Listening...
            </div>

            <div className="bg-white/5 p-4 rounded-2xl">
              Speaking Speed: Monitoring...
            </div>
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-violet-600 to-pink-500 py-4 rounded-2xl hover:opacity-90">
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}