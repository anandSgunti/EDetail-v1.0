
import React, { useEffect, useRef } from "react";

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    AdobeDC?: any;
    adobeDCView?: any;
  }
}

const ADOBE_CLIENT_ID = "2c960dfd8e7a4c3e8067f02ef1d6acc1";
// ← Your direct PDF URL goes here:
const PDF_URL = "https://pdfedetail.blob.core.windows.net/edetail/3569%20ELCC%20Roaming%20iPAD%20v4.0.pdf";

export const PDFViewer: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);

  // Load the Adobe View SDK once, then initialize
  useEffect(() => {
    const initViewer = () => {
      if (!viewerRef.current || !window.AdobeDC) return;

      // Tear down any previous instance
      window.adobeDCView = null;

      // Create the AdobeDC.View instance
      window.adobeDCView = new window.AdobeDC.View({
        clientId: ADOBE_CLIENT_ID,
        divId: "adobe-dc-view",
      });

      // Preview the PDF from your hard-coded URL
      window.adobeDCView.previewFile(
        {
          content: { location: { url: PDF_URL } },
          metaData: { fileName:  " " },
        },
        {
          defaultViewMode: "FIT_PAGE",
          showAnnotationTools: false,
          showFullScreenViewButton: false, 
          enableSearchAPIs: true, showThumbnails: false,
          showBookmarks: false, showZoomControl: false,embedMode: "FULL_WINDOW",
        }
      );
    };

    if (!window.AdobeDC) {
      const script = document.createElement("script");
      script.src = "https://acrobatservices.adobe.com/view-sdk/viewer.js";
      script.onload = initViewer;
      document.body.appendChild(script);
    } else {
      initViewer();
    }
  }, []); // empty deps → run once on mount

  return (
    <div
      id="adobe-dc-view"
      ref={viewerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
