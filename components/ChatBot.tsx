
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "¡Hola! Soy el conserje de accesorios18. Puedo ayudarte a encontrar la combinación perfecta de dijes o el color de hilo ideal para tu historia. ¿Cómo puedo asistirte hoy?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(messages, input);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Tengo problemas para conectarme ahora mismo. ¡Por favor, inténtalo más tarde!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-surface-dark rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-100 dark:border-stone-800 animate-fade-in-up">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="auto_awesome" className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Concierge IA</h3>
                <p className="text-[10px] text-white/70">Tejiendo nuevas ideas</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-full transition-colors">
              <Icon name="close" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-stone-50 dark:bg-background-dark/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                    : 'bg-white dark:bg-surface-dark text-text-main dark:text-white shadow-sm border border-stone-100 dark:border-stone-800 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="size-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white dark:bg-surface-dark border-t border-stone-100 dark:border-stone-800">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunta sobre dijes o cuidados..."
                className="flex-1 bg-stone-100 dark:bg-stone-900 border-none rounded-full px-5 text-sm focus:ring-2 focus:ring-primary h-11"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="size-11 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 hover:scale-105 active:scale-95 shadow-lg"
              >
                <Icon name="send" className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="size-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative"
        >
          <Icon name="chat_bubble" className="text-2xl group-hover:opacity-0 transition-opacity" />
          <Icon name="auto_awesome" className="text-2xl absolute opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
        </button>
      )}
    </div>
  );
};
