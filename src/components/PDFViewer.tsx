import React, { useEffect, useRef } from "react";

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    AdobeDC?: any;
    adobeDCView?: any;
  }
}

const ADOBE_CLIENT_ID = "2c960dfd8e7a4c3e8067f02ef1d6acc1"; // Replace with your Adobe client ID

interface PDFViewerProps {
  file?: File;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  // Load the Adobe SDK script once
  useEffect(() => {
    if (!window.AdobeDC) {
      const script = document.createElement("script");
      script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
      script.onload = () => {
        // No-op; actual rendering handled in next effect
      };
      document.body.appendChild(script);
    }
  }, []);

  // Render the PDF when file changes
  useEffect(() => {
    if (!file) return;

    // Wait until SDK is loaded
    const interval = setInterval(() => {
      if (window.AdobeDC && viewerRef.current) {
        clearInterval(interval);

        // Clean up previous viewer instance if needed
        if (window.adobeDCView) {
          window.adobeDCView = null;
        }

        window.adobeDCView = new window.AdobeDC.View({
          clientId: ADOBE_CLIENT_ID,
          divId: "adobe-dc-view",
        });

        const reader = new FileReader();
        reader.onloadend = (e) => {
          const filePromise = Promise.resolve(e.target?.result);
          window.adobeDCView.previewFile(
            {
              content: { promise: filePromise },
              metaData: { fileName: file.name },
            },{embedMode: "FULL_WINDOW", showAnnotationTools: false, showFullScreenViewButton: true});
        
        };
        reader.readAsArrayBuffer(file);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [file]);

  return (
    <div
      id="adobe-dc-view"
      ref={viewerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
