export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const CHAT_STORAGE_KEY = "cabanatuan-ordinance-chat-history";
const CHAT_SESSION_KEY = "cabanatuan-chat-session-id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "default-ssr-session";
  try {
    let sessionId = localStorage.getItem(CHAT_SESSION_KEY);
    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "session_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem(CHAT_SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "default-session";
  }
}

export function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CHAT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save chat history to localStorage", e);
  }
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear chat history", e);
  }
}
