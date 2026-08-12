import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Leaf, Sparkles, AlertCircle, Bot, User } from 'lucide-react';
import useStore from '../store/useStore';
import { clsx } from 'clsx';

const SUGGESTED_PROMPTS = [
  "How is my air quality today?",
  "Is today suitable for outdoor running?",
  "Explain PM2.5 in simple terms",
  "How can I reduce pollution exposure at home?"
];

export default function AiAssistant() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi! I'm your Environmental Intelligence Assistant. I can help you understand air quality, environmental risks, CleanTech, and weather conditions. How can I assist you today?",
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useStore((state) => state.location);
  const [contextData, setContextData] = useState(null);

  useEffect(() => {
    // Fetch context data if location exists
    if (location) {
      axios.get(`http://localhost:5000/api/data/current?lat=${location.lat}&lng=${location.lng}`)
        .then(res => setContextData(res.data))
        .catch(() => console.log('Failed to load context'));
    }
  }, [location]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/ask', {
        message: text,
        contextData: contextData ? {
          aqi: contextData.aqi,
          pm2_5: contextData.pm2_5,
          temperature: contextData.temperature,
          humidity: contextData.humidity
        } : null
      });

      const aiMessage = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to my environmental knowledge base right now. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Verdant AI</h1>
          <p className="text-muted-foreground text-sm">Environmental Intelligence Assistant</p>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col relative border border-border shadow-xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={clsx(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' 
                  ? "bg-gradient-to-tr from-primary to-accent text-white" 
                  : "bg-background border border-border text-primary"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className={clsx(
                  "p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-card text-card-foreground border border-border rounded-tl-sm",
                  msg.isError && "border-destructive/50 bg-destructive/10 text-destructive"
                )}>
                  {msg.isError && <AlertCircle className="inline-block w-4 h-4 mr-2 mb-1" />}
                  {msg.content}
                </div>
                <span className={clsx(
                  "text-xs text-muted-foreground px-1",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-background border border-border text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border rounded-tl-sm shadow-sm flex items-center gap-1 h-12">
                <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot"></div>
                <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (only show if few messages) */}
        {messages.length < 3 && (
          <div className="px-6 pb-2 pt-4 bg-gradient-to-t from-card to-transparent absolute bottom-24 left-0 right-0">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-4 py-2 rounded-full border border-border bg-background/80 hover:bg-muted text-sm font-medium transition-colors text-foreground flex items-center gap-2 shadow-sm"
                >
                  <Leaf className="w-4 h-4 text-primary" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-card/90 backdrop-blur-md border-t border-border mt-auto relative z-10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about air quality, environmental risks, or CleanTech..."
              className="w-full bg-background border border-border rounded-full pl-6 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              AI provides environmental guidance, not medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
