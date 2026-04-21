"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportPage() {
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const savedFeedback =
      JSON.parse(localStorage.getItem("feedback")) || {
        score: 8,
        strengths: [
          "Strong React knowledge",
          "Good communication clarity"
        ],
        weaknesses: [
          "Need better optimization explanation"
        ],
        betterAnswer:
          "Use structured answers with project examples.",
        improvementTips: [
          "Add real-world examples",
          "Improve confidence",
          "Use STAR method"
        ]
      };

    setFeedback(savedFeedback);
  }, []);

  if (!feedback) return <p>Loading...</p>;

  const barData = {
    labels: [
      "Technical",
      "Confidence",
      "Communication",
      "Grammar",
      "Problem Solving"
    ],
    datasets: [
      {
        label: "Performance Score",
        data: [85, 78, 88, 84, 80],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ["Strengths", "Weaknesses"],
    datasets: [
      {
        data: [75, 25],
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold">
          Final Interview Report
        </h1>

        {/* Score Card */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-2xl font-bold">
            Overall Score: {feedback.score}/10
          </h2>

          <p className="text-gray-300 mt-2">
            Recommended for Junior Frontend Developer Role
          </p>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">
              Performance Analytics
            </h2>

            <Bar data={barData} />
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">
              Strength vs Weakness
            </h2>

            <Doughnut data={doughnutData} />
          </div>

        </div>

        {/* Strengths */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-bold mb-4">
            Key Strengths
          </h2>

          <ul className="space-y-2">
            {feedback.strengths.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-bold mb-4">
            Areas of Improvement
          </h2>

          <ul className="space-y-2">
            {feedback.weaknesses.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* Final Suggestions */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-bold mb-4">
            Final Suggestions
          </h2>

          <ul className="space-y-2">
            {feedback.improvementTips.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}