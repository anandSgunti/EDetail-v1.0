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
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Create a new thread when component mounts
  useEffect(() => {
    const createThread = async () => {
      try {
        const response = await fetch('http://localhost:5000/create-thread', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setThreadId(data.thread_id);
        }
      } catch (error) {
        console.error('Failed to create thread:', error);
        // Continue without thread ID - backend will create one
      }
    };
    createThread();
  }, []);

  const handleSend = async (userMessage: string) => {
    if (isStreaming) return;
    setShowKeyboard(false);

    // append user message
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
      const requestBody = {
        message: userMessage,
        ...(threadId && { thread_id: threadId })
      };

      const res = await fetch('http://localhost:5000/chat-plain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6); // Remove 'data: ' prefix
            
            if (data === '[DONE]') {
              // Stream completed
              break;
            }

            // Try to parse as JSON first (for structured responses)
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content' && parsed.data) {
                botText += parsed.data;
              } else if (parsed.type === 'error') {
                throw new Error(parsed.data);
              } else if (parsed.type === 'done') {
                break;
              }
            } catch (parseError) {
              // If not JSON, treat as plain text
              botText += data;
            }

            // Update the message with current accumulated text
            setMessages(prev =>
              prev.map(m =>
                m.id === thinkingId ? { ...m, text: botText } : m
              )
            );
          }
        }
      }

      // Handle case where no content was streamed
      if (!botText.trim()) {
        setMessages(prev =>
          prev.map(m =>
            m.id === thinkingId
              ? { ...m, text: "I couldn't generate a response. Please try again." }
              : m
          )
        );
      }

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev =>
        prev.map(m =>
          m.id === thinkingId
            ? { 
                ...m,
                text: `Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}. Please try again.`
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
    
    // Create a new thread for fresh conversation
    const createNewThread = async () => {
      try {
        const response = await fetch('http://localhost:5000/create-thread', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setThreadId(data.thread_id);
        }
      } catch (error) {
        console.error('Failed to create new thread:', error);
      }
    };
    createNewThread();
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
              className="flex-shrink-0 p-2 rounded-lg bg-white/60 hover:bg-white/80 transition duration-200 group"
              title="Back to prompts"
            >
              <ArrowLeft size={18} className="text-gray-600 group-hover:text-gray-800" />
            </button>
          )}
          
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
            <p className="text-gray-600 text-xs">
              Your intelligent conversation partner
              {threadId && <span className="ml-2 opacity-50">({threadId.slice(0, 8)}...)</span>}
            </p>
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