"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Minimize2 } from "lucide-react";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "What services do you offer?",
    a: "Quilonix builds three core things: high-performance web applications (React, Next.js, Laravel, Node.js), intelligent AI automation workflows (agents, LLMs, custom pipelines), and cross-platform mobile apps (Flutter, Android). Every project is engineered for scale.",
  },
  {
    q: "How much does it cost?",
    a: "Our packages start at $1,499/mo for the Starter tier — ideal for focused automation and web work. The Growth package is $2,999/mo for full-stack AI systems. For enterprise or custom builds, we quote based on scope. No hidden fees, ever.",
  },
  {
    q: "How fast can you deliver?",
    a: "Most projects ship an initial version in 2–4 weeks. Complex AI automation systems can take 4–8 weeks. We move fast without cutting corners — zero-latency is our standard, not a selling point.",
  },
  {
    q: "How do I get started?",
    a: "Scroll down to the Contact section and tell us what you're building. We'll respond within 24 hours with a clear plan and no fluff. Or click 'Initiate Sequence' in the nav — same place.",
  },
];

const GREETING: Message = {
  id: 0,
  role: "bot",
  text: "Hi — I'm the Quilonix assistant. Ask me anything about our services, pricing, or how to get started.",
};

let nextId = 1;

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulsing, setPulsing] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setPulsing(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [open, messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: nextId++, role: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const lower = text.toLowerCase();
    const match = FAQ.find(
      (f) =>
        lower.includes("serv") ||
        lower.includes("cost") ||
        lower.includes("price") ||
        lower.includes("deliver") ||
        lower.includes("fast") ||
        lower.includes("start") ||
        lower.includes("begin")
    );

    const answer = FAQ.find((f) => {
      if (lower.includes("serv") || lower.includes("do you")) return f.q.includes("services");
      if (lower.includes("cost") || lower.includes("price") || lower.includes("much")) return f.q.includes("cost");
      if (lower.includes("fast") || lower.includes("deliver") || lower.includes("time")) return f.q.includes("fast");
      if (lower.includes("start") || lower.includes("begin") || lower.includes("how")) return f.q.includes("started");
      return false;
    });

    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: nextId++,
          role: "bot",
          text:
            answer?.a ??
            "Great question. For a detailed answer tailored to your project, reach out through the Contact section below — we'll get back to you within 24 hours.",
        },
      ]);
    }, 900 + Math.random() * 400);
  };

  return (
    <>
      <button
        data-testid="btn-chatbot-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 9000,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: open ? "#0F1115" : "linear-gradient(135deg, #FFD000 0%, #FFB300 100%)",
          border: open ? "1.5px solid rgba(255,208,0,0.4)" : "none",
          cursor: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: open
            ? "0 0 0 0 transparent"
            : pulsing
            ? "0 0 0 0 rgba(255,208,0,0.5)"
            : "0 0 20px rgba(255,208,0,0.4)",
          animation: pulsing && !open ? "chatPulse 2s infinite" : "none",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        {open ? (
          <X size={22} color="#FFD000" />
        ) : (
          <MessageSquare size={24} color="#0F1115" />
        )}
      </button>

      <div
        style={{
          position: "fixed",
          bottom: 104,
          right: 32,
          zIndex: 8999,
          width: 360,
          maxHeight: 520,
          background: "rgba(15,17,21,0.97)",
          border: "1px solid rgba(255,208,0,0.15)",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,208,0,0.06)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255,208,0,0.04)",
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FFD00022, #FFB30022)",
            border: "1px solid rgba(255,208,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Bot size={16} color="#FFD000" />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Inter', sans-serif", letterSpacing: 1 }}>QUILONIX AI</div>
            <div style={{ color: "#FFD000", fontSize: 10, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD000", display: "inline-block", boxShadow: "0 0 6px #FFD000" }} />
              ONLINE
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "none", color: "rgba(255,255,255,0.3)", padding: 4 }} data-testid="btn-chatbot-minimize">
            <Minimize2 size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              animation: "msgIn 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <div style={{
                maxWidth: "82%",
                padding: "10px 13px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #FFD000, #FFB300)"
                  : "rgba(255,255,255,0.05)",
                color: msg.role === "user" ? "#0F1115" : "rgba(255,255,255,0.85)",
                fontSize: 13,
                lineHeight: 1.55,
                fontFamily: "'Inter', sans-serif",
                fontWeight: msg.role === "user" ? 600 : 400,
                borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                border: msg.role === "bot" ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start", animation: "msgIn 0.3s ease" }}>
              <div style={{
                padding: "10px 16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px 12px 12px 2px",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#FFD000",
                    display: "inline-block",
                    animation: `typingDot 1s ${d}s infinite`,
                    opacity: 0.5,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "8px 10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {FAQ.map((f) => (
              <button
                key={f.q}
                data-testid={`btn-faq-${f.q.slice(0, 10).replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => sendMessage(f.q)}
                style={{
                  background: "rgba(255,208,0,0.06)",
                  border: "1px solid rgba(255,208,0,0.15)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 10,
                  fontFamily: "'Inter', sans-serif",
                  padding: "4px 9px",
                  cursor: "none",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,208,0,0.15)";
                  (e.target as HTMLElement).style.color = "#FFD000";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,208,0,0.06)";
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {f.q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              data-testid="input-chat-message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 2,
                color: "#fff",
                fontSize: 13,
                fontFamily: "'Space Grotesk', sans-serif",
                padding: "9px 12px",
                outline: "none",
                cursor: "none",
              }}
              onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,208,0,0.4)"; }}
              onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
            <button
              type="submit"
              data-testid="btn-chat-send"
              style={{
                width: 38,
                height: 38,
                borderRadius: 2,
                background: "linear-gradient(135deg, #FFD000, #FFB300)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "none",
                flexShrink: 0,
              }}
            >
              <Send size={15} color="#0F1115" />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes chatPulse {
          0% { box-shadow: 0 0 0 0 rgba(255,208,0,0.5); }
          70% { box-shadow: 0 0 0 16px rgba(255,208,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,208,0,0); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </>
  );
}
