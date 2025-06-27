import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { Message } from '../types/chat';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingId, setCurrentStreamingId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSend = async (userMessage: string) => {
    if (isStreaming) return;

    const userMessageObj: Message = {
      id: generateId(),
      sender: 'user',
      text: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessageObj]);
    setIsStreaming(true);

    // Add premium thinking message
    const thinkingId = generateId();
    const thinkingMessage: Message = {
      id: thinkingId,
      sender: 'bot',
      text: '💭 Thinking...',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    setCurrentStreamingId(thinkingId);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data:')) {
              const data = trimmedLine.slice(6);
              
              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.content || parsed.delta?.content || parsed.text || data;
                botMessage += content;
              } catch {
                botMessage += data;
              }

              setMessages(prev => prev.map(msg => 
                msg.id === thinkingId 
                  ? { ...msg, text: botMessage }
                  : msg
              ));
            } else if (trimmedLine && !trimmedLine.startsWith('event:') && !trimmedLine.startsWith('id:')) {
              botMessage += trimmedLine;
              setMessages(prev => prev.map(msg => 
                msg.id === thinkingId 
                  ? { ...msg, text: botMessage }
                  : msg
              ));
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Ensure we have some response
      if (!botMessage.trim()) {
        setMessages(prev => prev.map(msg =>
          msg.id === thinkingId
            ? { ...msg, text: "I received your message but couldn't generate a response." }
            : msg
        ));
      }

    } catch (error) {
      console.error('Error:', error);
      // Replace thinking message with error message
      setMessages(prev => prev.map(msg =>
        msg.id === thinkingId
          ? { 
              ...msg, 
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check if the server is running on http://localhost:5000`
            }
          : msg
      ));
    } finally {
      setIsStreaming(false);
      setCurrentStreamingId(undefined);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-white/20 p-4 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
            <p className="text-gray-600 text-xs">Your intelligent conversation partner</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex-1 p-4 space-y-6 max-w-4xl mx-auto w-full">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={isStreaming && message.id === currentStreamingId}
                />
              ))}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
        isStreaming={isStreaming}
      />
    </div>
  );
};