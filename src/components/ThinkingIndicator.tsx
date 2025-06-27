import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 shadow-sm">
      {/* Animated Brain Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20"></div>
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
          <Brain className="w-4 h-4 text-white animate-pulse" />
        </div>
      </div>

      {/* Thinking Text with Animated Dots */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-700 font-medium">Thinking</span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Sparkle Animation */}
      <div className="relative">
        <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute top-0 left-0 w-4 h-4">
          <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Breathing Progress Bar */}
      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse transform origin-left scale-x-0 animate-[scale-x_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};