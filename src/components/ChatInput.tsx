import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false, isStreaming = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="p-4 bg-white/20 backdrop-blur-sm border-t border-white/20 rounded-b-2xl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-white/30 backdrop-blur-sm rounded-2xl p-3 border border-white/30 focus-within:border-blue-300/50 focus-within:ring-2 focus-within:ring-blue-100/30 transition-all shadow-lg">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[24px] placeholder-gray-500 text-gray-800"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className={`
              flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
              transition-all duration-200 transform
              ${disabled || !input.trim()
                ? 'bg-white/30 text-gray-400 cursor-not-allowed backdrop-blur-sm'
                : 'bg-blue-500/90 text-white hover:bg-blue-600 active:scale-95 hover:shadow-lg backdrop-blur-sm'
              }
            `}
          >
            {isStreaming ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
                
        <div className="flex items-center justify-center mt-2 text-xs text-gray-600">
          <span>Press Enter to send • Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};