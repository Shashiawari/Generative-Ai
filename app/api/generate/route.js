// app/api/generate/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    // Get prompt from request body
    const { prompt } = await req.json();

    // Initialize Google Gemini client with API key
    const apiKey = process.env.NEXT_PUBLIC_API_KEY; // store in .env
    const aiClient = new GoogleGenAI({ apiKey });

    // Generate content using a valid Gemini model
    // Use "gemini-2.0-flash" or another model supported by the new API
    const response = await aiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt || "Write a story about AI and magic",
    });

    // Extract text from the response
    const text = response.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Generate content error:", error);

    // Send error response
    return NextResponse.json(
      { error: "An error occurred while generating content." },
      { status: 500 }
    );
  }
}
