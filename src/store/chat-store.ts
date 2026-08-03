import { create } from "zustand";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  imageUrl?: string;
}

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  interactionId: string | null;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setTyping: (typing: boolean) => void;
  setInteractionId: (id: string | null) => void;
  clearMessages: () => void;
}

/**
 * Zustand store for AI chatbot session state.
 * Manages message history, typing indicator, and Gemini interaction ID
 * for stateful conversation (previous_interaction_id chaining).
 */
export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isTyping: false,
  interactionId: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  setInteractionId: (id) => set({ interactionId: id }),

  clearMessages: () =>
    set({ messages: [], interactionId: null, isTyping: false }),
}));
