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
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function AIInterviewRoom() {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [timer, setTimer] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const savedQuestions =
      JSON.parse(localStorage.getItem("questions")) || [
        "Tell me about yourself and your experience with Frontend Development.",
        "How would you optimize a slow React application?",
        "Explain the difference between CSR and SSR.",
      ];

    setQuestions(savedQuestions);
  }, []);

  useEffect(() => {
    let interval;

    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  useEffect(() => {
    if (cameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [cameraOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const currentQuestion = questions[currentIndex] || "Loading question...";
  const progressValue = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  const handleRepeatQuestion = () => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(currentQuestion);
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [
      ...allAnswers,
      {
        question: currentQuestion,
        answer,
      },
    ];

    setAllAnswers(updatedAnswers);
    setAnswer("");
    setTimer(90);
    setIsRunning(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleEndInterview(updatedAnswers);
    }
  };

  const handleEndInterview = async (finalAnswers = allAnswers) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/analyze-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "Frontend Developer",
          interviewData: finalAnswers,
        }),
      });

      const feedback = await response.json();
      localStorage.setItem("feedback", JSON.stringify(feedback));
      window.location.href = "/feedback";
    } catch (error) {
      console.error(error);
      alert("Failed to generate feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { title: "Confidence Score", value: "82%" },
    { title: "Grammar Score", value: "88%" },
    { title: "Tone Analysis", value: "Professional" },
    { title: "Filler Words", value: "3 Detected" },
    { title: "Speaking Speed", value: "Good Pace" },
    { title: "Eye Contact", value: "Stable" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-3 sm:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        <Card className="bg-white/5 border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
              <h2 className="text-base sm:text-xl font-semibold">
                Question {currentIndex + 1} / {questions.length || 10}
              </h2>

              <p className="text-xs sm:text-sm text-gray-300">
                Frontend Developer Interview
              </p>
            </div>

            <Progress value={progressValue} className="h-2 sm:h-3 rounded-full" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
          <Card className="bg-white/5 border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto"
              >
                <Bot size={42} />
              </motion.div>

              <div className="text-center">
                <h1 className="text-xl sm:text-3xl font-bold">AI Interviewer</h1>
                <p className="text-gray-300 mt-2 text-sm sm:text-base">
                  Senior Technical Recruiter
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10">
                <p className="text-xs sm:text-sm text-violet-300 font-medium mb-2">
                  Current Question
                </p>
                <p className="text-sm sm:text-lg leading-relaxed">{currentQuestion}</p>
              </div>

              <Button
                onClick={handleRepeatQuestion}
                className="w-full rounded-2xl h-11 sm:h-12 bg-violet-600 hover:bg-violet-700"
              >
                <RotateCcw className="mr-2" size={18} />
                Repeat Question
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-lg sm:text-2xl font-semibold">Your Live Preview</h2>

                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-300">Answer Time Left</p>
                  <p className="text-2xl sm:text-3xl font-bold text-pink-400">{timer}s</p>
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-black h-[240px] sm:h-[360px] lg:h-[420px]">
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
                    Camera is turned off
                  </div>
                )}
              </div>

              <textarea
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm sm:text-base outline-none resize-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => setCameraOn(!cameraOn)}
                  variant="secondary"
                  className="rounded-2xl h-12 sm:h-14"
                >
                  {cameraOn ? <Video className="mr-2" /> : <VideoOff className="mr-2" />}
                  Camera {cameraOn ? "ON" : "OFF"}
                </Button>

                <Button
                  onClick={() => setMicOn(!micOn)}
                  variant="secondary"
                  className="rounded-2xl h-12 sm:h-14"
                >
                  {micOn ? <Mic className="mr-2" /> : <MicOff className="mr-2" />}
                  Mic {micOn ? "ON" : "MUTED"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={() => setIsRunning(true)}
                  className="rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Play className="mr-2" size={18} />
                  Start
                </Button>

                <Button
                  onClick={() => setIsRunning(false)}
                  className="rounded-2xl h-12 bg-amber-500 hover:bg-amber-600"
                >
                  <Pause className="mr-2" size={18} />
                  Pause
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  className="rounded-2xl h-12 bg-slate-800 hover:bg-slate-700"
                >
                  <SkipForward className="mr-2" size={18} />
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h2 className="text-lg sm:text-2xl font-semibold">Live AI Analysis</h2>

              {stats.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <p className="text-xs sm:text-sm text-gray-300">{item.title}</p>
                  <p className="text-sm sm:text-lg font-semibold mt-1">{item.value}</p>
                </div>
              ))}

              <Button
                onClick={() => handleEndInterview()}
                disabled={isSubmitting}
                className="w-full h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500"
              >
                <CheckCircle className="mr-2" size={18} />
                {isSubmitting ? "Generating Feedback..." : "End Interview"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
