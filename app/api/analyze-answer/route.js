// app/api/generate-questions/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  // ── Step 1: Check API key exists ──
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is missing. Add it to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  // ── Step 2: Parse request body ──
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { jobRole, jobDescription, difficulty, questionCount = 5 } = body;

  if (!jobRole) {
    return NextResponse.json({ error: "jobRole is required" }, { status: 400 });
  }

  // ── Step 3: Call Gemini REST API directly (no SDK needed) ──
  const prompt = `You are an expert technical interviewer. Generate exactly ${questionCount} interview questions.

Job Role: ${jobRole}
Job Description: ${jobDescription || "Not provided"}
Experience Level: ${difficulty || "Mid-level"}

Rules:
- Make questions specific to the role and experience level
- Mix behavioral, technical, and situational questions
- Keep each question concise and clear
- Return ONLY a valid JSON array of strings, no markdown, no explanation

Example: ["Question 1?", "Question 2?", "Question 3?"]`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    // ── Step 4: Check Gemini responded OK ──
    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errBody);
      return NextResponse.json(
        {
          error: `Gemini API returned ${geminiRes.status}. Check your API key is valid and has quota.`,
          detail: errBody,
        },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();

    // ── Step 5: Extract text from Gemini response ──
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 500 }
      );
    }

    // ── Step 6: Parse the JSON array ──
    // Strip markdown code fences if Gemini added them
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch {
      // Fallback: extract array with regex if JSON.parse fails
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        console.error("Could not parse questions from:", rawText);
        return NextResponse.json(
          {
            error: "Could not parse questions from Gemini response.",
            raw: rawText,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: `Unexpected error: ${err.message}` },
      { status: 500 }
    );
  }
}