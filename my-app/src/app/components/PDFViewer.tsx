import { motion } from "motion/react";
import { FileText, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface PDFViewerProps {
  documentName: string;
  currentPage: number;
  totalPages: number;
  onClose: () => void;
}

export default function PDFViewer({
  documentName,
  currentPage,
  totalPages,
  onClose,
}: PDFViewerProps) {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-96 border-l-4 border-border bg-card flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b-4 border-border flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
          <span
            className="truncate"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
          >
            {documentName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-muted/30">
        <div className="border-4 border-border bg-white aspect-[8.5/11] relative overflow-hidden">
          {/* Mock PDF Content */}
          <div className="p-8 text-black">
            <div className="mb-6">
              <div className="h-8 bg-black w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 w-5/6"></div>
            </div>

            <div className="mb-6">
              <div className="h-6 bg-black w-2/3 mb-3"></div>
              <div className="h-4 bg-gray-300 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 w-4/5 mb-2"></div>
              <div className="h-4 bg-gray-300 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 w-3/4"></div>
            </div>

            {/* Highlighted section to show AI reference */}
            <div className="mb-6 p-3 bg-primary/20 border-l-4 border-primary">
              <div className="h-4 bg-gray-600 w-full mb-2"></div>
              <div className="h-4 bg-gray-600 w-full mb-2"></div>
              <div className="h-4 bg-gray-600 w-5/6"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-300 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 w-full mb-2"></div>
              <div className="h-4 bg-gray-300 w-4/5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t-4 border-border space-y-4">
        {/* Page Navigation */}
        <div className="flex items-center justify-between">
          <button className="p-2 border-2 border-border hover:border-primary transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
            Page {currentPage} / {totalPages}
          </span>
          <button className="p-2 border-2 border-border hover:border-primary transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 border-2 border-border hover:border-primary transition-colors flex items-center justify-center gap-2">
            <ZoomOut className="w-4 h-4" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
              Zoom Out
            </span>
          </button>
          <button className="flex-1 px-4 py-2 border-2 border-border hover:border-primary transition-colors flex items-center justify-center gap-2">
            <ZoomIn className="w-4 h-4" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
              Zoom In
            </span>
          </button>
        </div>

        {/* Current Highlight Info */}
        <div className="p-3 border-2 border-primary/30 bg-primary/5">
          <div
            className="mb-1 text-primary"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
          >
            HIGHLIGHTED CHUNK
          </div>
          <div className="text-sm opacity-70">
            This section was referenced in the AI's last response
          </div>
        </div>
      </div>
    </motion.div>
  );
}
