"use client";

import { useEffect, useState } from "react";

export default function SessionPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const savedQuestions =
      JSON.parse(localStorage.getItem("questions")) || [];

    setQuestions(savedQuestions);

    if (savedQuestions.length > 0) {
      setCurrentQuestion(savedQuestions[0]);
    }
  }, []);

  const submitAnswer = async () => {
    const response = await fetch("/api/analyze-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: currentQuestion,
        answer,
        role: "Frontend Developer",
      }),
    });

    const data = await response.json();

    localStorage.setItem(
      "feedback",
      JSON.stringify(data)
    );

    window.location.href = "/feedback";
  };

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">
        Interview Session
      </h1>

      <div className="border p-6 rounded-xl shadow">
        <p className="mb-4 font-semibold">
          {currentQuestion}
        </p>

        <textarea
          rows="6"
          className="w-full border p-4 rounded"
          placeholder="Type your answer here..."
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button
          onClick={submitAnswer}
          className="mt-4 bg-black text-white px-6 py-3 rounded"
        >
          Submit Answer
        </button>
      </div>
    </main>
  );
}