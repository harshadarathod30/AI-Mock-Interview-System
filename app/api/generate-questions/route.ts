// app/api/generate-questions/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface RequestBody {
  role?: string;
  experience?: string;
  techstack?: string;
  projectSummary?: string;
}

type RoleKey =
  | "frontend"
  | "backend"
  | "fullstack"
  | "dataanalyst"
  | "datascientist"
  | "devops"
  | "testing";

const fallbackQuestions: Record<RoleKey, string[]> = {
  frontend: [
    "Explain React lifecycle methods.",
    "What is the difference between let, var, and const?",
    "What is Virtual DOM in React?",
    "Explain useEffect() in React.",
    "Difference between == and === in JavaScript?",
    "What is event bubbling?",
    "What are closures in JavaScript?",
    "What is hoisting?",
    "Explain props vs state in React.",
    "How do you fetch API data in React?"
  ],

  backend: [
    "What is REST API?",
    "Difference between SQL and NoSQL?",
    "Explain middleware in Express.js.",
    "What is JWT authentication?",
    "What is the difference between PUT and PATCH?",
    "Explain database indexing.",
    "What is normalization in DBMS?",
    "How does Node.js handle asynchronous operations?",
    "What is API rate limiting?",
    "Difference between authentication and authorization?"
  ],

  fullstack: [
    "Explain MERN stack architecture.",
    "How does frontend communicate with backend?",
    "What is CORS?",
    "Explain JWT authentication flow.",
    "Difference between session and token authentication?",
    "How do you deploy a full stack app?",
    "What is state management?",
    "Difference between SQL and MongoDB?",
    "What is API integration?",
    "How do you optimize application performance?"
  ],

  dataanalyst: [
    "What is data cleaning?",
    "Difference between INNER JOIN and LEFT JOIN?",
    "Explain normalization in data analysis.",
    "What is data visualization?",
    "Difference between mean, median, and mode?",
    "What is SQL GROUP BY?",
    "Explain primary key and foreign key.",
    "What is Power BI used for?",
    "What is Excel VLOOKUP?",
    "Difference between structured and unstructured data?"
  ],

  datascientist: [
    "Difference between supervised and unsupervised learning?",
    "What is overfitting?",
    "Explain bias vs variance.",
    "What is feature engineering?",
    "Difference between classification and regression?",
    "What is cross-validation?",
    "Explain confusion matrix.",
    "What is precision vs recall?",
    "What is gradient descent?",
    "Difference between AI, ML, and Deep Learning?"
  ],

  devops: [
    "What is CI/CD?",
    "Explain Docker and its uses.",
    "What is Kubernetes?",
    "Difference between Docker and Virtual Machine?",
    "What is Jenkins?",
    "Explain Infrastructure as Code.",
    "What is load balancing?",
    "Difference between Git merge and rebase?",
    "What is monitoring in DevOps?",
    "Explain blue-green deployment."
  ],

  testing: [
    "Difference between manual and automation testing?",
    "What is regression testing?",
    "Explain test case and test scenario.",
    "What is Selenium?",
    "Difference between smoke and sanity testing?",
    "What is API testing?",
    "Explain bug life cycle.",
    "What is unit testing?",
    "Difference between severity and priority?",
    "What is black box testing?"
  ]
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    const {
      role = "frontend",
      experience = "",
      techstack = "",
      projectSummary = ""
    } = body;

    let questions: string[] = [];

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY || ""
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash"
      });

      const prompt = `
Generate exactly 10 professional interview questions.

Role: ${role}
Experience: ${experience}
Tech Stack: ${techstack}
Project Summary: ${projectSummary}

Rules:
- Questions must be role-specific
- Questions must be technical + HR mixed
- Return only questions
- No numbering
- No headings
- One question per line
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      questions = text
        .split("\n")
        .map((q: string) => q.trim())
        .filter((q: string) => q.length > 0)
        .slice(0, 10);

      if (questions.length < 5) {
        throw new Error("Weak Gemini response");
      }
    } catch (geminiError) {
      console.log("Gemini failed → Using fallback questions");

      const selectedRole = role
        .toLowerCase()
        .replace(/\s+/g, "") as RoleKey;

      questions =
        fallbackQuestions[selectedRole] ||
        fallbackQuestions.frontend;
    }

    return NextResponse.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to generate questions"
    });
  }
}