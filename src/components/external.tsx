import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ExternalViewerProps {
  url?: string;
  arUrl?: string | null;
  onBackToPdf?: () => void;
}

// Default external HTML URL - replace with your deployed HTML file URL
const DEFAULT_HTML_URL = "https://anandsgunti.github.io/EDV/";

export const ExternalViewer: React.FC<ExternalViewerProps> = ({ 
  url = DEFAULT_HTML_URL,
  arUrl,
  onBackToPdf
}) => {
  const [showAr, setShowAr] = React.useState(false);

  React.useEffect(() => {
    if (arUrl) {
      setShowAr(true);
    }
  }, [arUrl]);

  const handleBackToPdf = () => {
    setShowAr(false);
    if (onBackToPdf) {
      onBackToPdf();
    }
  };

  if (showAr && arUrl) {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        {/* AR Header */}
        <div className="bg-[#DC4405] text-white p-4 flex items-center justify-between shadow-lg">
          <button
            onClick={handleBackToPdf}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Main View</span>
          </button>
          <h2 className="text-lg font-semibold">AR Integration</h2>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* AR Content */}
        <div className="flex-1">
          <iframe
            src={arUrl}
            className="w-full h-full border-0"
            title="AR Integration"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
            allow="camera; microphone; xr-spatial-tracking; accelerometer; gyroscope; magnetometer; fullscreen"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="External Content Viewer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        loading="lazy"
      />
    </div>
  );
};
