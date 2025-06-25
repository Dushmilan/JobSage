import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFPreviewProps {
  file: File;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ file }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          if (e.target?.result) {
            const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
            const loadingTask = pdfjsLib.getDocument({ data: typedArray });
            const pdf = await loadingTask.promise;
            
            // Only render first page
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            
            if (canvasRef.current) {
              canvasRef.current.width = viewport.width;
              canvasRef.current.height = viewport.height;
              const context = canvasRef.current.getContext('2d');
              if (context) {
                await page.render({
                  canvasContext: context,
                  viewport: viewport,
                }).promise;
              }
            }
          }
          setLoading(false);
        };
        fileReader.readAsArrayBuffer(file);
      } catch (err) {
        setError('Failed to load PDF. Please make sure it is a valid PDF file.');
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      // Cleanup
      setLoading(true);
      setError(null);
    };
  }, [file]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading PDF...</div>;
  }

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
