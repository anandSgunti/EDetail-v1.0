import React from 'react';
import { FileText, HelpCircle, Lightbulb, Search, Settings } from 'lucide-react';

interface EmptyStateProps {
  onPromptSelect?: (prompt: string) => void;
  onArIntegration?: () => void;
}

const PRELOADED_PROMPTS = [
  {
    id: 1,
    icon: FileText,
    title: "Mechanisms of Action",
    prompt: "What are the mechanisms of action for Rybrevant?",
    color: "from-[#279989]/85 to-[#279989]/85"
  },
  {
    id: 2,
    icon: HelpCircle,
    title: "Primary Endpoint",
    prompt: "What is the primary endpoint of MARIPOSA-2?",
    color: "from-[#279989]/85 to-[#279989]/85"
  },
  {
    id: 3,
    icon: Lightbulb,
    title: "Dosing Regimen",
    prompt: "What is the dosing regimen for RYBREVANT® as a monotherapy for advanced NSCLC?",
    color: "from-[#279989]/85 to-[#279989]/85"
  },
  {
    id: 4,
    icon: Search,
    title: "Formulation and Efficacy",
    prompt: "How effective is RYBREVANT® combined with carboplatin and pemetrexed compared to carboplatin and pemetrexed alone?",
    color: "from-[#279989]/85 to-[#279989]/85"
  },
  {
    id: 5,
    icon: Settings,
    title: "Adverse Reactions",
    prompt: "What are the adverse reactions associated with RYBREVANT® when used in combination with LAZCLUZE™?",
    color: "from-[#279989]/85 to-[#279989]/85"
  },
  {
    id: 6,
    icon: Settings,
    title: "AR",
    prompt: "What are the adverse reactions associated with RYBREVANT® when used in combination with LAZCLUZE™?",
    color: "from-[#DC4405]/85 to-[#DC4405]/85"
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onPromptSelect, onArIntegration }) => {
  const handlePromptClick = (prompt: string) => {
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };


  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl w-full">
        {/* Animated Icon */}
        <div className="relative mb-8">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-20 w-20 h-20 mx-auto"></div> */}
          {/* <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-full w-20 h-20 mx-auto shadow-lg">
            <MessageCircle className="w-10 h-10 text-white mx-auto animate-pulse" />
          </div> */}
                     
          {/* Floating decorative elements */}
          {/* <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div> */}
          {/* <div className="absolute -bottom-2 -left-2">
            <Zap className="w-5 h-5 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div> */}
          {/* <div className="absolute top-1/2 -left-8">
            <Heart className="w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div> */}
        </div>

        {/* Preloaded Prompts */}
        <div className="mb-8">
          {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Start Prompts</h3> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRELOADED_PROMPTS.map((prompt) => {
              const isLast = prompt.id === 6;

              //const IconComponent = prompt.icon;
              return (
                <button
                  key={prompt.id}
                  onClick={() => {
                    if (isLast) {
                      // Open AR integration in PDF viewer
                      if (onArIntegration) {
                        onArIntegration();
                      }
                    } else {
                      handlePromptClick(prompt.prompt);
                    }
                  }}
                  className={`
                    group bg-gradient-to-r ${prompt.color}   
                    backdrop-blur-sm
                    p-4
                    rounded-xl
                    border border-white/30
                    shadow-lg
                    hover:shadow-xl
                    transition-all duration-300
                    hover:scale-105
                    hover:bg-gradient-to-r ${prompt.color}      /* 60% opacity on hover */
                    text-center `}
                >
                  {/* <div className={`bg-gradient-to-r ${prompt.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div> */}
                  <h4 className="font-semibold text-white text-sm mb-2 group-hover:text-gray-900">
                    {prompt.title}
                  </h4>
                  {/* <p className="text-gray-600 text-xs leading-relaxed group-hover:text-gray-700">
                    {prompt.prompt.length > 80 
                      ? `${prompt.prompt.substring(0, 80)}...` 
                      : prompt.prompt
                    }
                  </p> */}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Cards
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
            <h3 className="font-semibold text-gray-800 text-sm">Smart Analysis</h3>
            <p className="text-gray-600 text-xs mt-1">Intelligent document insights</p>
          </div>
        </div> */}

        {/* Call to Action */}
        <div className="text-sm text-gray-600">
          Click a prompt above or start typing below to begin our conversation
          <span className="inline-block ml-2 animate-bounce">👇</span>
        </div>
      </div>
    </div>
  );
};
