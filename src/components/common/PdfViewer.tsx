import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useTranslation } from "react-i18next";
import { ArrowDownTrayIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Set workerSrc for PDF.js - use worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

type Coordinates = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  pageNumber?: number;
};

type PdfViewerProps = {
  fileName: string;
  coordinates?: Coordinates | Coordinates[];
  pageNumber?: number;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: () => void;
  onClose?: () => void;
};

const Overlay = ({ coordinates, scale }: { coordinates: Coordinates; scale: number }) => {
  const dynamicStyle = {
    left: `${coordinates.x0 * scale}px`,
    top: `${coordinates.y0 * scale}px`,
    width: `${(coordinates.x1 - coordinates.x0) * scale}px`,
    height: `${(coordinates.y1 - coordinates.y0) * scale}px`,
  };

  return (
    <div
      style={dynamicStyle}
      className="absolute p-1 bg-secondary border-secondary border-2 bg-opacity-30"
    />
  );
};

export default function PdfViewer({
  fileName,
  coordinates,
  pageNumber: initialPageNumber,
  onLoadSuccess,
  onLoadError,
  onClose,
}: PdfViewerProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  // Ensure coordinates is an array
  const coordsArray = Array.isArray(coordinates) ? coordinates : coordinates ? [coordinates] : [];

  // Determine initial page number based on coordinates
  const initialPage =
    initialPageNumber ||
    (coordsArray.length > 0
      ? coordsArray.reduce(
          (min, coord) => (coord.pageNumber && coord.pageNumber < min ? coord.pageNumber : min),
          coordsArray[0]?.pageNumber || 1
        )
      : 1);

  useEffect(() => {
    if (fileName.startsWith('blob:') || fileName.startsWith('http')) {
      setFile(fileName);
    } else {
      const pdfPath = `/${fileName}`;
      setFile(pdfPath);
    }
  }, [fileName]);

  // Responsive zoom level and page width based on screen size
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      
      // Set page width based on screen size (roughly 28% of viewport for modal content)
      if (screenWidth <= 768) {
        setPageWidth(screenWidth * 0.85); // Mobile: use most of screen
        setZoomLevel(0.5);
      } else if (screenWidth <= 1024) {
        setPageWidth(screenWidth * 0.28); // Tablet
        setZoomLevel(0.7);
      } else if (screenWidth <= 1366) {
        setPageWidth(screenWidth * 0.28); // Small desktop
        setZoomLevel(0.8);
      } else if (screenWidth < 1920) {
        setPageWidth(screenWidth * 0.28); // Desktop
        setZoomLevel(0.9);
      } else {
        setPageWidth(screenWidth * 0.28); // Large desktop
        setZoomLevel(1.0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDownload = () => {
    if (file) {
      const link = document.createElement("a");
      link.href = file;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const scrollToPage = (pageNum: number) => {
    setTimeout(() => {
      const pageElement = document.querySelector(
        `.react-pdf__Page[data-page-number="${pageNum}"]`
      );
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  useEffect(() => {
    if (isPdfLoaded && initialPage) {
      scrollToPage(initialPage);
    }
  }, [isPdfLoaded, initialPage]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsPdfLoaded(true);
    onLoadSuccess?.(numPages);
  };

  const handleDocumentLoadError = (error: any) => {
    setIsPdfLoaded(false);
    console.error("PDF failed to load:", error);
    console.error("Attempted to load file:", file);
    onLoadError?.();
  };

  const zoomIn = () => {
    setZoomLevel((prev) => prev + 0.1);
  };

  const zoomOut = () => {
    setZoomLevel((prev) => (prev - 0.1 <= 0.1 ? 0.1 : prev - 0.1));
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-white rounded-lg"
    >
      {/* Header */}
      <div className="p-4 shrink-0 bg-platinum rounded-t-lg border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            PDF Viewer
          </h3>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex">
              <button
                onClick={zoomOut}
                className="bg-gray-500 text-white p-2 rounded-l hover:bg-gray-600"
                title={t('general.zoom_out')}
              >
                <MagnifyingGlassMinusIcon className="h-5 w-5" />
              </button>
              <button
                onClick={zoomIn}
                className="bg-gray-500 text-white p-2 rounded-r hover:bg-gray-600"
                title={t('general.zoom_in')}
              >
                <MagnifyingGlassPlusIcon className="h-5 w-5" />
              </button>
            </div>
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-primary hover:bg-gradient-brand text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              title={t('general.download')}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>{t('general.download')}</span>
            </button>
            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-md border border-gray-300 bg-anti-flash-white text-charcoal hover:bg-gradient-brand hover:text-white transition-all"
                aria-label={t('general.close')}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Document */}
      {file && (
        <div
          className="flex-1 overflow-auto flex items-start justify-center py-4 px-2 bg-gray-100"
        >
          <div className="w-full">
            <Document
              file={file}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              className="shadow-lg"
              loading={
                <div className="flex items-center justify-center p-8 text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              }
            >
              {isPdfLoaded && numPages ? (
                Array.from(new Array(numPages), (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    style={{ position: "relative", marginBottom: "20px" }}
                    className="flex justify-center px-2"
                  >
                    <Page 
                      pageNumber={index + 1} 
                      scale={zoomLevel}
                      width={pageWidth}
                    />
                    {coordsArray.map((coordinate, coordIndex) => (
                      <div key={`overlay_${coordIndex}`}>
                        {index + 1 === (coordinate.pageNumber || initialPage) && (
                          <Overlay coordinates={coordinate} scale={zoomLevel} />
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-white p-8">PDF cannot be loaded</div>
              )}
            </Document>
          </div>
          <style>
            {`.react-pdf__Page__textContent, .react-pdf__Page__annotations { display: none !important; }`}
          </style>
        </div>
      )}

      {/* Page Info */}
      {isPdfLoaded && numPages && (
        <div className="mt-2 mb-2 text-white text-sm">
          Page {initialPage} of {numPages}
        </div>
      )}
    </div>
  );
}
