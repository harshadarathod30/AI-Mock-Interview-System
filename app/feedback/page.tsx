export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Premium Feedback Report Section */}
        <div className="mt-12 bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 md:p-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="inline-flex items-center gap-2 bg-gray-50 border px-4 py-2 rounded-full text-sm font-medium mb-4">
                ✨ AI Performance Analysis
              </p>

              <h2 className="text-4xl font-bold mb-2">
                Interview Feedback Report
              </h2>

              <p className="text-gray-500">
                Detailed evaluation of your mock interview performance
              </p>
            </div>

            {/* Score Circle */}
            <div className="mt-6 md:mt-0">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center shadow-xl">
                <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <h3 className="text-3xl font-bold">8.5</h3>
                  <p className="text-xs text-gray-400">/ 10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Cards */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Strengths */}
            <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6">
              <h3 className="text-2xl font-semibold mb-4">
                💪 Strengths
              </h3>

              <ul className="space-y-3 text-gray-700">
                <li>✔ Clear and confident self-introduction</li>
                <li>✔ Strong technical explanation of projects</li>
                <li>✔ Good communication and structured answers</li>
                <li>✔ Professional speaking style</li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-6">
              <h3 className="text-2xl font-semibold mb-4">
                ⚠️ Weaknesses
              </h3>

              <ul className="space-y-3 text-gray-700">
                <li>• Some answers became too lengthy</li>
                <li>• Missing project-specific real examples</li>
                <li>• Slight hesitation in HR-based questions</li>
                <li>• Need stronger closing statements</li>
              </ul>
            </div>

            {/* Suggestions */}
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
              <h3 className="text-2xl font-semibold mb-4">
                🚀 Suggestions
              </h3>

              <ul className="space-y-3 text-gray-700">
                <li>→ Keep answers concise and impactful</li>
                <li>→ Use STAR method for HR questions</li>
                <li>→ Add measurable achievements in projects</li>
                <li>→ Improve confidence with mock practice</li>
              </ul>
            </div>

            {/* Final Summary */}
            <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6">
              <h3 className="text-2xl font-semibold mb-4">
                📊 Final Summary
              </h3>

              <p className="text-gray-700 leading-relaxed">
                Your performance was strong overall with excellent
                technical understanding and communication.
                With better concise answers and stronger real-world
                examples, you can easily move toward a top-tier
                interview performance.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}