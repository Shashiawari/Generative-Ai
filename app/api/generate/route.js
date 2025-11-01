import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      console.error("API key missing in server environment!");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const aiClient = new GoogleGenAI({ apiKey });

    const response = await aiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt || "Write a story about an AI and magic",
    });

    const text = response.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Generate content error:", error);
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
