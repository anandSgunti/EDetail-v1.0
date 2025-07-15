import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types/chat';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming = false }) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';
  const isThinking = message.text === '💭 Thinking...' || (isStreaming && message.text.trim() === '');

  return (
    <div className={`flex items-start gap-3 max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser 
          ? 'bg-[#DC4405]/80 text-white' 
          : 'bg-[#279989] text-white'
        }
      `}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className={`
        flex flex-col gap-1 max-w-[70%]
        ${isUser ? 'items-end' : 'items-start'}
      `}>
        {/* Sender Label user and assistant */}
        <span className="text-xs text-black  px-1">
          {isUser ? 'You' : 'Assistant'}
        </span>

        {/* Message Bubble or Thinking Indicator */}
        {isThinking ? (
          <ThinkingIndicator />
        ) : (
          <div className={`
            relative px-4 py-3 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-gray-200  text-[#DC4405]  rounded-br-md' 
              : 'bg-gray-200  border border-gray-200 text-[#279989] rounded-bl-md'
            }
            ${isStreaming && isBot ? 'animate-pulse' : ''}
          `}>
            <div className="whitespace-pre-wrap break-words">
              {message.text}
              {isStreaming && isBot && (
                <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse rounded-sm" />
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {!isThinking && (
          <span className="text-xs text-[#75787B] px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};
