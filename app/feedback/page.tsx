"use client";

import { useEffect, useState } from "react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const savedFeedback =
      JSON.parse(localStorage.getItem("feedback"));

    setFeedback(savedFeedback);
  }, []);

  if (!feedback) return <p>Loading...</p>;

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">
        AI Feedback Report
      </h1>

      <div className="space-y-6">

        <div className="p-6 border rounded-xl">
          <h2 className="text-2xl font-bold">
            Score: {feedback.score}/10
          </h2>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-bold mb-2">
            Strengths
          </h3>

          <ul>
            {feedback.strengths.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-bold mb-2">
            Weaknesses
          </h3>

          <ul>
            {feedback.weaknesses.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-bold mb-2">
            Better Answer
          </h3>

          <p>{feedback.betterAnswer}</p>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-bold mb-2">
            Improvement Tips
          </h3>

          <ul>
            {feedback.improvementTips.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}