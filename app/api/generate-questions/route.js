import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const { role, experience, techstack } = body;

  const prompt = `
Generate 10 deep, realistic technical interview questions.

Candidate Role: ${role}
Experience Level: ${experience}
Tech Stack: ${techstack}

Rules:
- Questions must be practical and real-world
- Questions should be interviewer-level strong
- Avoid basic textbook questions
- Include scenario-based questions
- Include problem-solving questions
- Include debugging/system design where possible

Return only JSON format like:
{
  "questions": [
    "question 1",
    "question 2"
  ]
}
`;

  const response = await fetch(
    "YOUR_GEMINI_API_URL",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const result = await response.json();

  const text =
    result.candidates[0].content.parts[0].text;

  const parsed = JSON.parse(text);

  return NextResponse.json(parsed);
}