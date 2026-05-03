import api from './api';
import type { ChatMessage } from '../types';

export const aiService = {
  chat: async (
    message: string,
    sessionId: string,
    context: {
      currentCode?: string;
      currentMission?: string;
      currentStage?: string;
      lastError?: string;
    },
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (error: string) => void
  ) => {
    const token = localStorage.getItem('spark_access_token');

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, sessionId, ...context }),
    });

    if (!response.ok) {
      onError('Failed to get AI response');
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('No response stream');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const payload = line.slice(6);
          if (payload === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) onChunk(parsed.text);
            if (parsed.error) onError(parsed.error);
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    onDone();
  },

  getHint: async (
    sessionId: string,
    hintLayer: number,
    context: {
      currentCode?: string;
      currentMission?: string;
      currentStage?: string;
      lastError?: string;
    },
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (error: string) => void
  ) => {
    const token = localStorage.getItem('spark_access_token');

    const response = await fetch('/api/ai/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId, hintLayer, ...context }),
    });

    if (!response.ok) {
      onError('Failed to get hint');
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('No response stream');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const payload = line.slice(6);
          if (payload === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) onChunk(parsed.text);
            if (parsed.error) onError(parsed.error);
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    onDone();
  },

  getHistory: async (sessionId: string) => {
    const { data } = await api.get(`/ai/history/${sessionId}`);
    return data as ChatMessage[];
  },

  clearHistory: async (sessionId: string) => {
    await api.delete(`/ai/history/${sessionId}`);
  },
};
