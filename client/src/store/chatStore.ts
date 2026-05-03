import { create } from 'zustand';
import type { ChatMessage } from '../types';

export type LocalMessage = Pick<ChatMessage, 'role' | 'content'> & Partial<ChatMessage>;

export type BuddyEmotion = 'idle' | 'thinking' | 'excited' | 'celebrating' | 'encouraging' | 'curious' | 'proud' | 'concerned';

interface ChatState {
  messages: LocalMessage[];
  sessionId: string | null;
  isStreaming: boolean;
  streamingContent: string;
  buddyEmotion: BuddyEmotion;
  hintLayer: number;

  setSessionId: (id: string) => void;
  addMessage: (message: LocalMessage) => void;
  setMessages: (messages: LocalMessage[]) => void;
  setStreaming: (streaming: boolean) => void;
  appendStreamContent: (text: string) => void;
  clearStreamContent: () => void;
  setBuddyEmotion: (emotion: BuddyEmotion) => void;
  incrementHintLayer: () => void;
  resetHintLayer: () => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: null,
  isStreaming: false,
  streamingContent: '',
  buddyEmotion: 'idle',
  hintLayer: 0,

  setSessionId: (id) => set({ sessionId: id }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (messages) => set({ messages }),

  setStreaming: (isStreaming) => set({ isStreaming }),

  appendStreamContent: (text) =>
    set((state) => ({ streamingContent: state.streamingContent + text })),

  clearStreamContent: () => set({ streamingContent: '' }),

  setBuddyEmotion: (buddyEmotion) => set({ buddyEmotion }),

  incrementHintLayer: () =>
    set((state) => ({ hintLayer: Math.min(state.hintLayer + 1, 3) })),

  resetHintLayer: () => set({ hintLayer: 0 }),

  clearChat: () =>
    set({
      messages: [],
      streamingContent: '',
      isStreaming: false,
      buddyEmotion: 'idle',
      hintLayer: 0,
    }),
}));
