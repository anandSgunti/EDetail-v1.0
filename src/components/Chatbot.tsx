// src/components/Chatbot.tsx

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { Message } from '../types/chat';
import { ArrowLeft } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingId, setCurrentStreamingId] = useState<string>();
  const [showKeyboard, setShowKeyboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSend = async (userMessage: string) => {
    if (isStreaming) return;
    setShowKeyboard(false);

    // append user
    const userMsg: Message = {
      id: generateId(),
      sender: 'user',
      text: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    // thinking placeholder
    const thinkingId = generateId();
    setMessages(prev => [
      ...prev,
      { id: thinkingId, sender: 'bot', text: '💭 Thinking...', timestamp: new Date() }
    ]);
    setCurrentStreamingId(thinkingId);

    try {
      const res = await fetch('https://edetail.azurewebsites.net/chat-plain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error('ReadableStream not supported');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          const t = line.trim();
          if (!t) continue;
          if (t.startsWith('data:')) {
            const data = t.slice(6);
            if (data === '[DONE]') break;
            try {
              const p = JSON.parse(data);
              botText += p.content ?? p.delta?.content ?? p.text ?? data;
            } catch {
              botText += data;
            }
          } else if (!t.startsWith('event:') && !t.startsWith('id:')) {
            botText += t;
          }
          setMessages(prev =>
            prev.map(m =>
              m.id === thinkingId ? { ...m, text: botText } : m
            )
          );
        }
      }

      if (!botText.trim()) {
        setMessages(prev =>
          prev.map(m =>
            m.id === thinkingId
              ? { ...m, text: "I couldn't generate a response." }
              : m
          )
        );
      }
    } catch (err) {
      console.error(err);
      setMessages(prev =>
        prev.map(m =>
          m.id === currentStreamingId
            ? { 
                ...m,
                text: `Error: ${err instanceof Error ? err.message : 'Unknown'}.`
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      setCurrentStreamingId(undefined);
    }
  };

  // Handle prompt selection from EmptyState
  const handlePromptSelect = (prompt: string) => {
    handleSend(prompt);
  };

  // Clear messages and return to empty state
  const handleBackToPrompts = () => {
    setMessages([]);
    setIsStreaming(false);
    setCurrentStreamingId(undefined);
    setShowKeyboard(false);
  };

  // hide keyboard if you click the message area
  const handleChatAreaClick = () => {
    if (showKeyboard) setShowKeyboard(false);
  };

  return (
    <div className="flex flex-col h-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
      {/* — Header — */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-white/20 p-4 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          {/* Back Arrow Button - only show when there are messages */}
          {messages.length > 0 && (
            <button
              onClick={handleBackToPrompts}
              className="flex-shrink-0 p-2 rounded-lg bg-white/60 hover:bg-[#FF7F41] transition duration-200 group"
              title="Back to prompts"
            >
              <ArrowLeft size={18} className="text-[#FF7F41] group-hover:text-gray-800" />
            </button>
          )}
          
          <div className="w-8 h-8  rounded-lg flex items-center justify-center shadow-lg">
           <img src="Logo.png" alt="AI" className="w-8 h-8 object-contain" />
        </div>

          <div>
            <h1 className="text-xl font-bold text-[#DC4405]">AI Assistant</h1>
            <p className="text-[#279989] font-bold text-xs">Your intelligent conversation partner</p>
          </div>
        </div>
      </div>

      {/* — Messages (70% if keyboard is open, else flex-1) — */}
      <div
        className={`
          transition-all duration-300
          ${showKeyboard ? 'h-[70%]' : 'flex-1'}
          overflow-y-auto
        `}
        onClick={handleChatAreaClick}
      >
        {messages.length === 0 ? (
          <EmptyState onPromptSelect={handlePromptSelect} />
        ) : (
          <div className="p-4 space-y-6 max-w-4xl mx-auto">
            {messages.map(msg => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isStreaming={isStreaming && msg.id === currentStreamingId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* — Input + Keyboard panel (30% tall when open) — */}
      <div
        className={`
          transition-all duration-300
          ${showKeyboard ? 'h-[45%] flex flex-col': ''}
        `}
      >
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming}
          isStreaming={isStreaming}
          showKeyboard={showKeyboard}
          setShowKeyboard={setShowKeyboard}
        />
      </div>
    </div>
  );
};
