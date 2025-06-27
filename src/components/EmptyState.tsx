import React from 'react';
import { MessageCircle, Sparkles, Zap, Heart } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20 w-20 h-20 mx-auto"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-full w-20 h-20 mx-auto shadow-lg">
            <MessageCircle className="w-10 h-10 text-white mx-auto animate-pulse" />
          </div>
                     
          {/* Floating decorative elements */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Zap className="w-5 h-5 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute top-1/2 -left-8">
            <Heart className="w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Welcome Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Edetail AI Assistant!
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          I'm here to help you with questions related to the Brand NAME and engaging conversations. 
          
          What would you like to explore today?
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-lg">
            <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Quick Responses</h3>
            <p className="text-gray-600 text-xs mt-1">Get instant, intelligent answers</p>
          </div>
                     
          <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-lg">
            <div className="bg-purple-500 w-8 h-8 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">PlaceHolder</h3>
            <p className="text-gray-600 text-xs mt-1">p l a c e</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-sm text-gray-600">
          Start typing below to begin our conversation
          <span className="inline-block ml-2 animate-bounce">👇</span>
        </div>
      </div>
    </div>
  );
};