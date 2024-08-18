"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { marked } from "marked";
import "./home.css";
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
          padding: "10px",
          borderRadius: "8px",

          wordWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: htmlText }} // Use dangerouslySetInnerHTML to render the formatted HTML
      />
    );
  };

  return (
    <div style={{ padding: "20px" }} className="mm">

      <h1 className="mainhead">Generative AI Chat</h1>
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
        <input
          type="text"
          className="input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your message"
          style={{ width: "300px", padding: "10px" }}
        />
        <button
          className="btn"
          type="submit"
          style={{ marginLeft: "10px", padding: "10px" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
