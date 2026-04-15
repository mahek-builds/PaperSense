import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X, FileText, CheckCircle, Loader2 } from "lucide-react";
import { uploadPdf } from "../api";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (doc: { name: string; pages: number; chunks: number }) => void;
}

type UploadState = "idle" | "uploading" | "processing" | "embedding" | "success" | "error";

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [documentStats, setDocumentStats] = useState({
    pages: 0,
    chunks: 0,
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.includes("pdf")) {
      alert("Please upload a PDF file");
      return;
    }

    setFileName(file.name);
    setErrorMessage("");
    setUploadState("uploading");
    setUploadProgress(15);

    try {
      setUploadState("processing");
      setUploadProgress(45);

      const response = await uploadPdf(file);

      setUploadState("embedding");
      setUploadProgress(85);

      setDocumentStats({
        pages: response.pagesRead,
        chunks: response.chunksAdded,
      });

      onUploadSuccess({
        name: file.name,
        pages: response.pagesRead,
        chunks: response.chunksAdded,
      });

      setUploadProgress(100);
      setUploadState("success");
    } catch (error) {
      setUploadState("error");
      setUploadProgress(0);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  const reset = () => {
    setUploadState("idle");
    setUploadProgress(0);
    setFileName("");
    setErrorMessage("");
    setDocumentStats({ pages: 0, chunks: 0 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={reset}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl border-4 border-foreground bg-card"
        >
          {/* Header */}
          <div className="p-6 border-b-4 border-border flex items-center justify-between">
            <h2
              style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}
            >
              Upload Document
            </h2>
            <button
              onClick={reset}
              className="p-2 hover:bg-muted transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {uploadState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-4 border-dashed p-12 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-6 border-2 border-muted-foreground flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3
                  className="mb-3"
                  style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
                >
                  Drop your PDF here
                </h3>
                <p className="mb-6 opacity-70">or click to browse files</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleChange}
                />
                <label htmlFor="file-upload">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex px-8 py-4 bg-primary text-background border-2 border-primary cursor-pointer"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Choose File
                  </motion.div>
                </label>
              </motion.div>
            )}

            {uploadState === "uploading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border-2 border-primary flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate mb-1">{fileName}</div>
                    <div
                      className="text-primary"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                    >
                      Uploading...
                    </div>
                  </div>
                  <div
                    className="text-primary"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
                <div className="h-2 border-2 border-border bg-background overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  ></motion.div>
                </div>
              </motion.div>
            )}

            {uploadState === "processing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto border-2 border-primary flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3
                    className="mb-2"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
                  >
                    Processing PDF
                  </h3>
                  <p
                    className="text-primary"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                  >
                    Extracting text and analyzing structure...
                  </p>
                </div>
              </motion.div>
            )}

            {uploadState === "embedding" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto border-2 border-primary flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3
                    className="mb-2"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
                  >
                    Creating Embeddings
                  </h3>
                  <p
                    className="text-primary"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                  >
                    Generating vector embeddings for semantic search...
                  </p>
                </div>
              </motion.div>
            )}

            {uploadState === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto bg-secondary border-2 border-secondary flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-background" />
                </div>
                <div>
                  <h3
                    className="mb-2"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
                  >
                    Document Ready!
                  </h3>
                  <p className="mb-6 opacity-70">
                    Your PDF has been processed and is ready for questions
                  </p>
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="p-4 border-2 border-border bg-background flex items-center justify-between">
                      <span
                        className="opacity-50"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                      >
                        Pages Processed
                      </span>
                      <span
                        className="text-secondary"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {documentStats.pages}
                      </span>
                    </div>
                    <div className="p-4 border-2 border-border bg-background flex items-center justify-between">
                      <span
                        className="opacity-50"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                      >
                        Chunks Created
                      </span>
                      <span
                        className="text-secondary"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {documentStats.chunks}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="px-8 py-4 bg-primary text-background border-2 border-primary"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Start Asking Questions
                </motion.button>
              </motion.div>
            )}

            {uploadState === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto border-2 border-destructive flex items-center justify-center">
                  <X className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h3
                    className="mb-2"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
                  >
                    Upload Failed
                  </h3>
                  <p className="text-destructive text-sm">{errorMessage}</p>
                </div>
                <button
                  onClick={() => {
                    setUploadState("idle");
                    setUploadProgress(0);
                    setErrorMessage("");
                  }}
                  className="px-8 py-4 border-2 border-border hover:border-primary transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
