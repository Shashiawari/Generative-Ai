"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { marked } from "marked";
import "./home.css";
import Link from "next/link";
// Custom renderer for marked to handle code blocks with syntax highlighting
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  return `<pre><code class="language-${language}">${code}</code></pre>`;
};

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessages = [...messages, { sender: "user", text: prompt }];
    setMessages(newMessages);
    setPrompt("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: "ai", text: data.text }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "An error occurred." },
      ]);
    }
  };

  const renderMessage = (message) => {
    const text = message.text || ""; // Default to an empty string if text is undefined or null

    // Use the 'marked' library to convert Markdown to HTML with custom renderer
    const htmlText = marked(text, { renderer });

    // If the message contains code, highlight it
    if (message.text.includes("```")) {
      return (
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {message.text.replace(/```/g, "")}{" "}
          {/* Removing the ``` for proper syntax highlighting */}
        </SyntaxHighlighter>
      );
    }

    return (
      <div
        className="textss"
        style={{
          padding: "0px",
          borderRadius: "5px",
          wordWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: htmlText }} // Use dangerouslySetInnerHTML to render the formatted HTML
      />
    );
  };

  return (
    <div style={{ padding: "20px" }} className="mm">
      <div className="s">
        <h1 className="mainhead">Generative AI Chat</h1>
        <Link href={"https://www.npmjs.com/package/@google/generative-ai"}><h2> Docs </h2></Link>
      </div>
      <div className="maintext">
        {messages.map((message, index) => (
          <div
            key={index}
            className="texts"
            style={{
              marginBottom: "10px",
              textAlign: message.sender === "user" ? "right" : "left",
              marginLeft: message.sender === "user" ? "40%" : "0",
            }}
          >
            <strong className="character">
              {message.sender === "user" ? "You" : "AI"}:
            </strong>{" "}
            <div className={message.sender === "user" ? "you" : "ai"}>
              {" "}
              {renderMessage(message)}{" "}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "20px" }}
        className="frm"
      >
        <div className="messageBox">
          <input
            required=""
            placeholder="Message..."
            type="text"
            id="messageInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button id="sendButton" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 664 663"
            >
              <path
                fill="none"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              />
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="33.67"
                stroke="#6c6c6c"
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
