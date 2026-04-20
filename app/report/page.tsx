import Link from "next/link";
import {
  FileText,
  Download,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function FinalReportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-6 py-10 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} />
              AI Generated Final Evaluation
            </p>

            <h1 className="text-5xl font-bold mb-3">
              Final Interview Report
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl">
              Complete performance analysis with score, feedback,
              strengths, weaknesses, and career improvement roadmap.
            </p>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <Link
              href="/dashboard"
              className="border border-gray-300 bg-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:shadow-md transition"
            >
              <ArrowLeft size={18} />
              Back
            </Link>

            <button className="bg-black text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:scale-[1.02] hover:shadow-xl transition">
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Overall Score Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center shadow-xl">
              <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Overall Score</p>
                <h2 className="text-4xl font-bold">8.7</h2>
                <p className="text-sm text-gray-400">/ 10</p>
              </div>
            </div>

            <p className="mt-6 text-center text-gray-600">
              Excellent technical clarity with strong communication
              and confident delivery.
            </p>
          </div>

          {/* Performance Breakdown */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6">
              Performance Breakdown
            </h2>

            <div className="space-y-5">
              {[
                ["Communication Skills", "90%"],
                ["Technical Knowledge", "88%"],
                ["Confidence Level", "84%"],
                ["Problem Solving", "86%"],
              ].map(([title, value]) => (
                <div key={title}>
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">{title}</p>
                    <p className="font-semibold">{value}</p>
                  </div>

                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feedback Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Strengths */}
          <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-7 shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle />
              <h3 className="text-2xl font-bold">Strengths</h3>
            </div>

            <ul className="space-y-3 text-gray-700">
              <li>✔ Strong project explanation</li>
              <li>✔ Excellent confidence during introduction</li>
              <li>✔ Clear communication structure</li>
              <li>✔ Good understanding of core CS concepts</li>
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-7 shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp />
              <h3 className="text-2xl font-bold">Improvement Areas</h3>
            </div>

            <ul className="space-y-3 text-gray-700">
              <li>• Need more concise answers</li>
              <li>• Improve behavioral interview responses</li>
              <li>• Add stronger real-world examples</li>
              <li>• Reduce hesitation in leadership questions</li>
            </ul>
          </div>
        </div>

        {/* Suggestions + Final Verdict */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Suggestions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <Star />
              <h3 className="text-2xl font-bold">
                Improvement Suggestions
              </h3>
            </div>

            <ul className="space-y-4 text-gray-700">
              <li>→ Practice STAR method for HR questions</li>
              <li>→ Prepare concise project case studies</li>
              <li>→ Improve leadership and teamwork answers</li>
              <li>→ Do 3 more technical mock interviews</li>
            </ul>
          </div>

          {/* Final Verdict */}
          <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <FileText />
              <h3 className="text-2xl font-bold">
                Final Verdict
              </h3>
            </div>

            <p className="leading-relaxed text-gray-200">
              You are interview-ready for most entry-level Software
              Developer roles. With a little improvement in behavioral
              answers and sharper project storytelling, you can perform
              strongly in top product-based company interviews.
            </p>

            <div className="mt-6 inline-block bg-white text-black px-5 py-2 rounded-full font-semibold">
              Recommended for SDE Interviews 🚀
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}