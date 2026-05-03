import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useChatStore } from '../../store/chatStore';
import { useEditorStore } from '../../store/editorStore';
import { aiService } from '../../services/ai.service';

function detectLanguageFromCode(code: string): 'html' | 'css' | 'js' | null {
  const trimmed = code.trim();
  if (trimmed.startsWith('<') || /<\w+/.test(trimmed)) return 'html';
  if (/[{};]/.test(trimmed) && /[\w-]+\s*:/.test(trimmed) && !trimmed.includes('function')) return 'css';
  if (/\b(function|const|let|var|document|console|addEventListener|=>)\b/.test(trimmed)) return 'js';
  return null;
}

export default function SparkChatPanel() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    sessionId,
    isStreaming,
    streamingContent,
    buddyEmotion,
    hintLayer,
    addMessage,
    setStreaming,
    appendStreamContent,
    clearStreamContent,
    setBuddyEmotion,
    incrementHintLayer,
  } = useChatStore();

  const EMOTION_ICONS: Record<string, string> = {
    idle: '😊',
    thinking: '🤔',
    excited: '🤩',
    celebrating: '🎉',
    encouraging: '💪',
    curious: '🧐',
    proud: '😄',
    concerned: '😟',
  };
  const { files, activeTab } = useEditorStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, streamingContent]);

  const getCurrentCode = () => {
    return files[activeTab] || '';
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !sessionId || isStreaming) return;

    addMessage({ role: 'user', content: text });
    setStreaming(true);
    setBuddyEmotion('thinking');
    clearStreamContent();

    await aiService.chat(
      text,
      sessionId,
      { currentCode: getCurrentCode() },
      (chunk) => {
        appendStreamContent(chunk);
      },
      () => {
        const content = useChatStore.getState().streamingContent;
        addMessage({ role: 'assistant', content });
        clearStreamContent();
        setStreaming(false);
        setBuddyEmotion('proud');
        setTimeout(() => setBuddyEmotion('idle'), 3000);
      },
      (error) => {
        console.error('Chat error:', error);
        setStreaming(false);
        setBuddyEmotion('concerned');
      }
    );
  }, [sessionId, isStreaming, files, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const handleHint = () => {
    incrementHintLayer();
    const layer = hintLayer + 1;
    const hintText = layer === 1
      ? "Can you give me a hint? Just a nudge!"
      : layer === 2
        ? "I need more help — can you show me a small example?"
        : "I'm stuck. Can you show me how to do this?";
    sendMessage(hintText);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-surface)' }}>
      {/* Buddy Status Bar */}
      <div
        className="flex items-center justify-between px-4 py-1"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="text-base"
            key={buddyEmotion}
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {EMOTION_ICONS[buddyEmotion] || '😊'}
          </motion.span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Spark Buddy
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {buddyEmotion === 'thinking' ? 'is thinking...' : buddyEmotion === 'proud' ? 'is proud of you!' : buddyEmotion === 'concerned' ? 'is worried' : ''}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Ctrl+B
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        <AnimatePresence>
          {messages.slice(-5).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div
                  className="text-lg mr-2 flex-shrink-0"
                  style={{ lineHeight: '1.8' }}
                >
                  ⚡
                </div>
              )}
              <div
                className="max-w-md px-3 py-2 rounded-xl text-sm"
                style={{
                  backgroundColor: msg.role === 'user' ? 'rgba(8, 145, 178, 0.1)' : 'var(--bg-surface-2)',
                  color: 'var(--text-primary)',
                  border: msg.role === 'user' ? '1px solid var(--border-glow-cyan)' : '1px solid var(--border-subtle)',
                }}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      code: ({ children, className }) => {
                        const isInline = !className;
                        const codeText = String(children).replace(/\n$/, '');
                        if (isInline) {
                          return (
                            <code
                              style={{
                                backgroundColor: 'var(--bg-void)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85em',
                                color: 'var(--neon-green)',
                              }}
                            >
                              {children}
                            </code>
                          );
                        }
                        const detectedLang = detectLanguageFromCode(codeText);
                        return (
                          <div style={{ position: 'relative', margin: '8px 0' }}>
                            <pre
                              style={{
                                backgroundColor: 'var(--bg-void)',
                                padding: '12px',
                                paddingTop: detectedLang ? '32px' : '12px',
                                borderRadius: '8px',
                                overflow: 'auto',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85em',
                              }}
                            >
                              <code>{children}</code>
                            </pre>
                            {detectedLang && (
                              <button
                                onClick={() => {
                                  const { updateFile, setActiveTab } = useEditorStore.getState();
                                  setActiveTab(detectedLang);
                                  updateFile(detectedLang, codeText);
                                }}
                                style={{
                                  position: 'absolute',
                                  top: '6px',
                                  right: '6px',
                                  backgroundColor: 'rgba(8, 145, 178, 0.2)',
                                  color: 'var(--neon-cyan)',
                                  border: '1px solid rgba(8, 145, 178, 0.3)',
                                  borderRadius: '6px',
                                  padding: '2px 8px',
                                  fontSize: '0.7em',
                                  cursor: 'pointer',
                                  fontFamily: 'var(--font-sans)',
                                }}
                              >
                                Try it ▶
                              </button>
                            )}
                          </div>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming indicator with typewriter cursor */}
        {isStreaming && streamingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="text-lg mr-2">⚡</div>
            <div
              className="max-w-md px-3 py-2 rounded-xl text-sm"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <ReactMarkdown>{streamingContent}</ReactMarkdown>
              <motion.span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  backgroundColor: 'var(--neon-cyan)',
                  verticalAlign: 'text-bottom',
                  marginLeft: '2px',
                }}
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              />
            </div>
          </motion.div>
        )}

        {isStreaming && !streamingContent && (
          <motion.div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span>⚡</span>
            <span>Spark Buddy is thinking...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Action Buttons */}
      <div
        className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        {[
          { label: '💡 Hint', action: handleHint, color: 'rgba(217, 119, 6, 0.1)', textColor: 'var(--neon-amber)', borderColor: 'rgba(217, 119, 6, 0.2)' },
          { label: '🎯 Next step', action: () => sendMessage("What should I do next?"), color: 'rgba(8, 145, 178, 0.1)', textColor: 'var(--neon-cyan)', borderColor: 'rgba(8, 145, 178, 0.2)' },
          { label: '🌟 Example', action: () => sendMessage("Can you show me a related example without solving my problem?"), color: 'rgba(124, 58, 237, 0.1)', textColor: 'var(--neon-violet)', borderColor: 'rgba(124, 58, 237, 0.2)' },
          { label: '🔍 Explain error', action: () => sendMessage("I'm getting an error. Can you help me understand what went wrong?"), color: 'rgba(220, 38, 38, 0.1)', textColor: 'var(--neon-coral)', borderColor: 'rgba(220, 38, 38, 0.2)' },
        ].map((btn) => (
          <motion.button
            key={btn.label}
            onClick={btn.action}
            className="px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: btn.color,
              color: btn.textColor,
              border: `1px solid ${btn.borderColor}`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isStreaming}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      {/* Input Area */}
      <div className="px-4 py-2 flex items-center gap-2">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Spark Buddy anything about your code..."
            maxLength={500}
            className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: 'var(--bg-surface-2)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
            }}
            disabled={isStreaming}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <motion.button
            type="submit"
            className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
            style={{
              backgroundColor: 'var(--neon-cyan)',
              color: '#ffffff',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={isStreaming || !input.trim()}
          >
            Send
          </motion.button>
        </form>
      </div>
    </div>
  );
}
