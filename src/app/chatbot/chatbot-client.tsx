"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clsx } from "clsx";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Ano ang parusa sa pagsusunog ng basura sa Cabanatuan?",
  "Ano ang batas tungkol sa curfew ng mga menor de edad?",
  "Paano mag-report ng maingay na videoke tuwing gabi?",
  "Anong ordinansa ang nag-reregulate ng plastik sa merkado?",
];

export function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Mabuhay! Ako si **Batas Cabanatuan AI**, ang inyong kaagapay sa pag-intindi ng mga ordinansa at batas ng ating lungsod at barangay. Ano ang nais ninyong itanong ngayong araw?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend ?? input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "May aberya sa koneksyon sa server.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Paumanhin, hindi makakonekta sa system sa ngayon.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ **Error:** ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--bg-card)] shadow-md overflow-hidden min-h-[600px]">
      {/* Chat Messages Header */}
      <div className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)] text-white font-bold text-base shadow-sm">
            ⚖️
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-ink)]">
              Batas Cabanatuan AI
            </h2>
            <p className="text-xs text-[var(--text-mute)]">
              Powered by Google Gemini • LGU Law RAG Engine
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setMessages([
              {
                id: "welcome-reset",
                role: "assistant",
                content:
                  "Na-clear ang usapan. Ano ang bago ninyong katanungan tungkol sa ordinansa?",
              },
            ])
          }
        >
          Bagong Usapan
        </Button>
      </div>

      {/* Suggested Questions Pills */}
      <div className="border-b border-[var(--border-hairline)] bg-[var(--bg-card)] px-6 py-3">
        <p className="text-xs font-semibold text-[var(--text-mute)] mb-2 uppercase tracking-wider">
          Mga Halimbawang Tanong:
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className={clsx(
                "rounded-[var(--radius-pill)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5",
                "text-xs text-[var(--text-body)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]",
                "disabled:opacity-50 min-h-[36px]"
              )}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[450px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex flex-col max-w-[85%] rounded-[var(--radius-md)] p-4 text-sm leading-relaxed",
              msg.role === "user"
                ? "ml-auto bg-[var(--accent-primary)] text-white"
                : "mr-auto bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-ink)]"
            )}
          >
            <span
              className={clsx(
                "text-xs font-semibold mb-1",
                msg.role === "user"
                  ? "text-white/80"
                  : "text-[var(--accent-primary)]"
              )}
            >
              {msg.role === "user" ? "Ikaw" : "Batas Cabanatuan AI"}
            </span>
            <div className="whitespace-pre-line">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="mr-auto max-w-[70%] rounded-[var(--radius-md)] bg-[var(--bg-canvas)] border border-[var(--border-hairline)] p-4 text-sm text-[var(--text-mute)] flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-ping" />
            <span>Nagsusuri sa database ng mga ordinansa...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-4 flex items-center gap-2"
      >
        <div className="flex-1">
          <Input
            label="I-type ang inyong tanong dito"
            placeholder="Hal. Bawal ba magsunog ng tuyong dahon sa bakuran?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!input.trim() || isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? "..." : "Ipadala"}
        </Button>
      </form>
    </div>
  );
}
