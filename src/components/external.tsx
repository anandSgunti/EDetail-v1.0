import React from 'react';

interface ExternalViewerProps {
  url?: string;
}

// Default external HTML URL - replace with your deployed HTML file URL
const DEFAULT_HTML_URL = "https://anandsgunti.github.io/EDV/";

export const ExternalViewer: React.FC<ExternalViewerProps> = ({ 
  url = DEFAULT_HTML_URL 
}) => {
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