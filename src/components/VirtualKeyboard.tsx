import React from 'react';
import { Delete, CornerDownLeft, Space, X } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  onSpace,
  isVisible,
  onClose
}) => {
  const qwertyRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];
  const numbers = ['1','2','3','4','5','6','7','8','9','0'];
  const [isShift, setIsShift] = React.useState(false);

  const handleKey = (key: string) => {
    const out = isShift ? key.toUpperCase() : key.toLowerCase();
    onKeyPress(out);
    if (isShift) setIsShift(false);
  };
  const toggleShift = () => setIsShift(s => !s);

  if (!isVisible) return null;

  // Key style for both numbers and QWERTY
  const keyClass =
    "w-8 h-8 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg " +
    "hover:bg-white/40 active:scale-95 transition text-gray-800 font-medium " +
    "flex items-center justify-center text-base";

  return (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-xl border-t border-white/30 p-4 overflow-hidden">
      {/* Close Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onClose}
          title="Close Keyboard"
          className="p-1 bg-white/30 backdrop-blur-sm rounded-lg hover:bg-white/40 transition"
        >
          <X size={12} className="text-gray-600"/>
        </button>
      </div>

      {/* Keys Container */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Numbers Row (Consistent with QWERTY) */}
        <div className="flex justify-center space-x-2 flex-wrap mb-2">
          {numbers.map(n => (
            <button
              key={n}
              onClick={() => onKeyPress(n)}
              className={keyClass}
            >
              {n}
            </button>
          ))}
          {/* Optional: Backspace at end of numbers row for symmetry */}
          
        </div>

        {/* QWERTY Rows */}
        <div className="space-y-2">
          {qwertyRows.map((row, ri) => (
            <div key={ri} className="flex justify-center space-x-2 flex-wrap">
              {/* Shift button at start of last row */}
              {ri === 2 && (
                <button
                  onClick={toggleShift}
                  className={`w-8 h-8 flex items-center justify-center backdrop-blur-sm border border-white/40 rounded-lg text-base font-medium transition ${
                    isShift
                      ? 'bg-blue-500/70 text-white border-blue-400/50'
                      : 'bg-white/30 text-gray-800 hover:bg-white/40'
                  }`}
                >
                  ⇧
                </button>
              )}
              {row.map(k => (
                <button
                  key={k}
                  onClick={() => handleKey(k)}
                  className={keyClass}
                >
                  {isShift ? k.toUpperCase() : k.toLowerCase()}
                </button>
              ))}
              {/* Backspace at end of top row for symmetry */}
              
            </div>
          ))}
        </div>

        {/* Bottom Row: Space & Enter */}
        <div className="space-y-2 mt-2">
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={onSpace}
              className="flex-1 h-8 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg 
                        hover:bg-white/40 active:scale-95 transition text-gray-800 font-medium 
                        flex items-center justify-center max-w-[180px] text-base"
            >
              <Space size={14} className="mr-1"/> Space
            </button>
            <button
              onClick={onEnter}
              className="px-5 h-8 bg-green-500/70 backdrop-blur-sm border border-green-400/50 rounded-lg 
                        hover:bg-green-600 active:scale-95 transition text-white font-medium 
                        flex items-center justify-center text-base"
            >
              <CornerDownLeft size={14} className="mr-1"/> Send
            </button>
            <button
    onClick={onBackspace}
    title="Backspace"
    className="w-8 h-8 bg-red-500/70 backdrop-blur-sm border border-red-400/50 rounded-lg 
               hover:bg-red-600 active:scale-95 transition text-white font-medium 
               flex items-center justify-center"
  >
    <Delete size={14}/>
  </button>
          </div>
        </div>
      </div>
    </div>
  );
};
