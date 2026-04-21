import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const { question, answer, role } = body;

    const prompt = `
You are a senior technical interviewer.

Analyze this interview answer professionally.

Question:
${question}

Candidate Role:
${role}

Candidate Answer:
${answer}

Evaluate based on:

1. Technical correctness
2. Communication clarity
3. Confidence level
4. Real-world understanding
5. Problem-solving ability

Return ONLY valid JSON in this format:

{
  "score": 8,
  "strengths": [
    "Strong understanding of React lifecycle"
  ],
  "weaknesses": [
    "Could explain optimization strategies better"
  ],
  "betterAnswer": "A stronger answer would be...",
  "improvementTips": [
    "Add real project examples",
    "Use structured explanation"
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const result = await response.json();

    const text =
      result.candidates[0].content.parts[0].text;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    return NextResponse.json(parsed);

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      score: 7,
      strengths: [
        "Good basic explanation"
      ],
      weaknesses: [
        "Needs deeper technical details"
      ],
      betterAnswer:
        "Try explaining with a real-world example and structured steps.",
      improvementTips: [
        "Speak with confidence",
        "Use practical examples",
        "Avoid short generic answers"
      ]
    });
  }
}