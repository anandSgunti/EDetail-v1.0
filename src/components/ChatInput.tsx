// src/components/ChatInput.tsx

import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Send, Loader2, Keyboard } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  showKeyboard: boolean;
  setShowKeyboard: Dispatch<SetStateAction<boolean>>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  isStreaming = false,
  showKeyboard,
  setShowKeyboard
}) => {
  const [input, setInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    setCursorPosition(0);
    setShowKeyboard(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // keep track of cursor
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart || 0);
    }
  };

  // refocus when keyboard opens
  useEffect(() => {
    if (textareaRef.current && showKeyboard) {
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      textareaRef.current.focus();
    }
  }, [cursorPosition, showKeyboard]);

  // virtual-keyboard handlers
  const handleVirtualKeyPress = (key: string) => {
    const before = input.slice(0, cursorPosition);
    const after = input.slice(cursorPosition);
    const next = before + key + after;
    setInput(next);
    setCursorPosition(cursorPosition + 1);
  };
  const handleVirtualBackspace = () => {
    if (cursorPosition > 0) {
      const before = input.slice(0, cursorPosition - 1);
      const after = input.slice(cursorPosition);
      const next = before + after;
      setInput(next);
      setCursorPosition(cursorPosition - 1);
    }
  };
  const handleVirtualSpace = () => handleVirtualKeyPress(' ');
  const handleVirtualEnter = () => handleSend();

  return (
    <div className="flex flex-col h-full">
      {/* — Input bar — */}
      <div className="p-4 bg-white/20 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 bg-white/30 backdrop-blur-sm rounded-2xl p-3 border border-white/30 focus-within:border-blue-300/50 focus-within:ring-2 focus-within:ring-blue-100/30 transition shadow-lg">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                setCursorPosition(e.target.selectionStart || 0);
              }}
              onSelect={handleSelectionChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Type your message…"
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 placeholder-gray-500 text-gray-800"
              rows={1}
            />

            {/* toggle keyboard */}
            <button
              onClick={() => setShowKeyboard(v => !v)}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition transform ${
                showKeyboard
                  ? 'bg-blue-500/90 text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white/80'
              } backdrop-blur-sm border border-white/30`}
              title="Toggle Virtual Keyboard"
            >
              <Keyboard size={20} />
            </button>

            {/* send */}
            <button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition transform ${
                disabled || !input.trim()
                  ? 'bg-white/30 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500/90 text-white hover:bg-blue-600 active:scale-95 hover:shadow-lg'
              } backdrop-blur-sm`}
            >
              {isStreaming
                ? <Loader2 size={20} className="animate-spin"/>
                : <Send size={20}/>
              }
            </button>
          </div>
          <div className="flex items-center justify-center mt-2 text-xs text-gray-600">
            Press Enter to send • Shift+Enter for new line • Tap keyboard icon
          </div>
        </div>
      </div>

      {/* — Virtual Keyboard (fills remaining 30%) — */}
      {showKeyboard && (
        <div className="flex-1 overflow-hidden">
        <VirtualKeyboard
          isVisible={showKeyboard}
          onKeyPress={handleVirtualKeyPress}
          onBackspace={handleVirtualBackspace}
          onSpace={handleVirtualSpace}
          onEnter={handleVirtualEnter}
          onClose={() => setShowKeyboard(false)}
        />
        </div>
      )}
    </div>
  );
};
