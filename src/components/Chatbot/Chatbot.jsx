import { useState } from "react";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

function Chatbot() {
  const [prompt, setPrompt] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a helpful movie assistant. Answers summerized. Format your answers using Markdown. Use headings, bullet points, bold text, and numbered lists when appropriate.",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function sendMessage(e) {
    e.preventDefault();

    if (!prompt.trim()) return;

    const userMessage = {
      role: "user",
      content: prompt,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setPrompt("");

    const response = await groq.chat.completions.create({
      messages: newMessages,
      model: "openai/gpt-oss-20b",
    });

    const aiMessage = {
      role: "assistant",
      content: response.choices[0]?.message?.content || "",
    };

    setMessages([...newMessages, aiMessage]);
  }

  return (
    <>
      {!isOpen && (
        <button
          className="chat-button"
          onClick={() => setIsOpen(true)}
        >
          FilmkAI
        </button>
      )}

      {isOpen && (
        <div className="chat-window">

          <div className="chat-header">
            
            <span>FilmkAI</span>

            <button onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-messages">

            {messages
              .filter((message) => message.role !== "system")
              .map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.role === "user"
                      ? "user-message"
                      : "ai-message"
                  }`}
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ))}

          </div>

          <form
            className="chat-input"
            onSubmit={sendMessage}
          >
            <input
              
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about movies..."
            />

            <button type="submit">
              ➤
            </button>
          </form>

        </div>
      )}
    </>
  );
}

export default Chatbot;