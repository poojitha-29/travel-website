import React, { useState } from "react";

const quickQuestions = [
  "Best destinations for honeymoon?",
  "Is Bali good for 7 days?",
  "Can you customize packages?",
  "How much does a Europe trip cost?",
  "Do you help with visas?"
];

const botReplies = {
  honeymoon:
    "Popular honeymoon destinations include Bali, Maldives, Switzerland, Dubai and Kerala. We can customise the itinerary based on your travel dates and budget.",

  bali:
    "Yes! Bali is perfect for a 7-day trip. A great itinerary is 4 nights in Ubud and 3 nights in Seminyak or Gili Islands.",

  customize:
    "Yes, all our trips are fully customised. We plan your itinerary based on your budget, travel style and number of days.",

  europe:
    "A comfortable Europe trip usually needs 10-14 days. Popular routes include Paris, Switzerland and Italy. We suggest fewer cities for a relaxed experience.",

  visa:
    "Yes, we assist with tourist visa processing for many destinations including Dubai, Europe, Singapore and Thailand."
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Hi! I'm your travel assistant. Ask about destinations, trip planning, visas or packages."
    }
  ]);
  const [input, setInput] = useState("");

  const addMessage = (text) => {
    if (!text.trim()) return;

    const lower = text.toLowerCase();

    let replyKey = Object.keys(botReplies).find((key) =>
      lower.includes(key)
    );

    let reply;

    if (replyKey) {
      reply = botReplies[replyKey];
    } else {
      reply =
        "I'm not fully sure about that. Our travel expert can help you better on WhatsApp.";

      const encoded = encodeURIComponent(text);

      setTimeout(() => {
        window.open(
          `https://wa.me/918106868686?text=${encoded}`,
          "_blank"
        );
      }, 1200);
    }

    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: reply }
    ]);

    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "1.25rem",
        bottom: "1.25rem",
        zIndex: 40
      }}
    >
      {open && (
        <div
          style={{
            width: "280px",
            maxHeight: "380px",
            borderRadius: "1.25rem",
            border: "1px solid rgba(148,163,184,0.6)",
            background: "rgba(15,23,42,0.97)",
            color: "#e5e7eb",
            boxShadow: "0 22px 45px rgba(15,23,42,0.7)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: "0.75rem"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.75rem 0.9rem",
              borderBottom: "1px solid rgba(148,163,184,0.5)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
              Travel Assistant
            </span>

            <button
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              padding: "0.75rem 0.9rem",
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
              fontSize: "0.8rem"
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%"
                }}
              >
                <div
                  style={{
                    padding: "0.5rem 0.7rem",
                    borderRadius:
                      m.from === "user"
                        ? "0.9rem 0.9rem 0.2rem 0.9rem"
                        : "0.9rem 0.9rem 0.9rem 0.2rem",
                    backgroundColor:
                      m.from === "user" ? "#38bdf8" : "#020617",
                    color:
                      m.from === "user" ? "#0f172a" : "#e5e7eb",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Quick Questions */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.3rem"
              }}
            >
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => addMessage(q)}
                  style={{
                    border: "none",
                    backgroundColor: "#0f172a",
                    color: "#e5e7eb",
                    borderRadius: "999px",
                    padding: "0.25rem 0.6rem",
                    fontSize: "0.7rem",
                    cursor: "pointer"
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMessage(input);
            }}
            style={{
              borderTop: "1px solid rgba(148,163,184,0.5)",
              padding: "0.55rem 0.6rem",
              display: "flex",
              gap: "0.4rem"
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about trips..."
              style={{
                flex: 1,
                borderRadius: "999px",
                border: "none",
                padding: "0.35rem 0.7rem",
                fontSize: "0.8rem"
              }}
            />

            <button
              type="submit"
              className="btn"
              style={{
                padding: "0.35rem 0.7rem",
                fontSize: "0.75rem"
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn"
        style={{
          borderRadius: "999px",
          padding: "0.8rem 1.2rem",
          boxShadow: "0 16px 40px rgba(15,23,42,0.45)"
        }}
      >
        {!open ? "Ask a travel question" : "Hide chat"}
      </button>
    </div>
  );
};

export default ChatBot;