import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, Trash2, User, Bot, AlertCircle, RefreshCw } from 'lucide-react';
import { aiService } from '../../services/api';
import useStore from '../../store/useStore';
import { environmentService, API_BASE_URL } from '../../services/api';
import { cn } from '../../utils/utils';

const QUICK_ACTIONS = [
  'Check my AQI',
  'How can I reduce my carbon footprint?',
  'What does PM2.5 mean?',
  'Give me eco-friendly tips',
];

export const ChatbotPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const location = useStore((state) => state.location);
  const [contextData, setContextData] = useState(null);

  // Fetch Context
  useEffect(() => {
    if (location) {
      environmentService
        .getCurrentByCoords(location.lat, location.lng)
        .then((res) => setContextData(res.data.data))
        .catch(() => console.log('Failed to fetch context for AI'));
    }
  }, [location]);

  // Fetch History
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await aiService.getHistory();
          if (res.data?.success && res.data.data.length > 0) {
            setMessages(res.data.data);
          } else {
            // Initial greeting
            setMessages([
              {
                role: 'assistant',
                content:
                  "Hi! I'm your Environmental Intelligence Assistant. I can help you understand air quality, environmental risks, CleanTech, and sustainability. How can I assist you today?",
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMessage = { role: 'user', content: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Setup SSE connection for streaming
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/ai/ask`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: text,
            stream: true,
            contextData: contextData
              ? {
                  city: contextData.city,
                  aqi: contextData.aqi,
                  pm25: contextData.pm25,
                  temperature: contextData.temperature,
                  humidity: contextData.humidity,
                }
              : null,
          }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // Add empty assistant message to append to
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '', createdAt: new Date().toISOString() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Pass stream: true to prevent splitting UTF-8 characters
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;

            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                // Use pure state updates to prevent duplication bug in React 18 StrictMode
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  const lastMsg = { ...newMsgs[newMsgs.length - 1] };
                  lastMsg.content += data.content;
                  newMsgs[newMsgs.length - 1] = lastMsg;
                  return newMsgs;
                });
              }
            } catch (e) {
              console.error('Error parsing SSE JSON', e, dataStr);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting to my knowledge base right now. Please try again later.",
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = async () => {
    try {
      await aiService.clearHistory();
      setMessages([
        {
          role: 'assistant',
          content: 'Chat history cleared. How can I assist you today?',
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-[80px] md:bottom-24 right-4 md:right-8 w-[calc(100vw-32px)] md:w-[400px] h-[calc(100dvh-160px)] md:h-[600px] max-h-[800px] glass rounded-3xl border border-border shadow-2xl flex flex-col z-[99] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-500 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-text-main">VerdantX</h3>
                <p className="text-xs text-text-muted font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="p-2 text-text-muted hover:text-red-500 transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-text-muted hover:text-text-main transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingHistory && (
              <div className="flex justify-center p-4">
                <RefreshCw className="animate-spin text-text-muted" size={20} />
              </div>
            )}

            {!loadingHistory &&
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-3 max-w-[85%]',
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm',
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-inner border border-border text-primary-500'
                    )}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        'p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap',
                        msg.role === 'user'
                          ? 'bg-primary-500 text-white rounded-tr-sm'
                          : 'bg-surface-inner text-text-main border border-border rounded-tl-sm',
                        msg.isError && 'border-red-500/50 bg-red-500/10 text-red-500'
                      )}
                    >
                      {msg.isError && <AlertCircle className="inline-block w-4 h-4 mr-1 mb-0.5" />}
                      {msg.content}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] text-text-muted px-1',
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      )}
                    >
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                </div>
              ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-surface-inner border border-border text-primary-500">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-2xl bg-surface-inner border border-border rounded-tl-sm shadow-sm flex items-center gap-1 h-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60 typing-dot"></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-primary-500/60 typing-dot"
                    style={{ animationDelay: '0.15s' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-primary-500/60 typing-dot"
                    style={{ animationDelay: '0.3s' }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && !loadingHistory && (
            <div className="px-4 pb-2 pt-2 bg-gradient-to-t from-surface to-transparent">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border bg-surface-inner hover:bg-surface-hover text-xs font-semibold transition-colors text-text-main shrink-0"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-surface border-t border-border mt-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="relative flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about air quality..."
                className="w-full bg-surface-inner border border-border rounded-2xl pl-4 pr-12 py-3 max-h-32 outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner transition-all text-sm resize-none scrollbar-hide text-text-main"
                rows={1}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 bottom-2 p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:hover:bg-primary-500 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
