// src/components/SplitLayout.tsx

import React, { useState } from 'react';
import { PDFViewer } from './PDFViewer';
import { Chatbot } from './Chatbot';
import { MessageCircle, ChevronLeft, X } from 'lucide-react';

export const SplitLayout: React.FC = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const toggleChatbot = () => {
    setChatbotVisible(v => !v);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 relative">
      {/* ——— PDF Panel ——— */}
      <div className="flex flex-col h-full">
        <div className="p-4 bg-white border-b border-gray-300 z-10">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <PDFViewer file={pdfFile ?? undefined} />
        </div>
      </div>

      {/* ——— Chatbot Overlay ——— */}
      {chatbotVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={toggleChatbot}
          />

          {/* Chatbot Container */}
          <div className="relative w-full max-w-md h-[90vh] transition duration-300">
            <Chatbot />
            <button
              onClick={toggleChatbot}
              className="absolute top-4 right-4 p-2 bg-white/60 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl border border-white/30 transition duration-200 hover:bg-white/80 z-10"
              title="Close Chatbot"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* ——— Floating Open Button ——— */}
      {!chatbotVisible && (
        <div className="fixed right-0 bottom-0 transform -translate-y-1/2 z-20">
          <div className="flex items-center">
            <button
              onClick={toggleChatbot}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-l-xl shadow-lg hover:shadow-xl transition duration-300 hover:scale-105 flex items-center space-x-2"
              title="Open AI Assistant"
            >
              <MessageCircle size={20} className="animate-pulse" />
              <span className="text-sm font-medium hidden md:block">AI Chat</span>
              <ChevronLeft size={16} className="animate-bounce" />
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="absolute -top-2 -left-2 flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-ping"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-ping"
              style={{ animationDelay: '1s' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
