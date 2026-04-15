import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [apiConnected, setApiConnected] = useState(true);
  const [selectedModel, setSelectedModel] = useState("llama-3.1-70b");
  const [darkMode, setDarkMode] = useState(true);

  const models = [
    { id: "llama-3.1-70b", name: "Llama 3.1 70B", description: "Best overall performance" },
    { id: "llama-3.1-8b", name: "Llama 3.1 8B", description: "Faster responses" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", description: "Balanced performance" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-4 border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
            <span style={{ fontFamily: "var(--font-mono)" }}>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
              <FileText className="w-5 h-5 text-background" strokeWidth={2.5} />
            </div>
            <h1
              className="tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}
            >
              Settings
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* API Status */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-4 border-border bg-card p-8"
        >
          <h2
            className="mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}
          >
            API Connection
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-border bg-background">
              <div className="flex items-center gap-3">
                {apiConnected ? (
                  <CheckCircle className="w-6 h-6 text-secondary" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <div className="font-medium">Groq API</div>
                  <div
                    className="opacity-50"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                  >
                    {apiConnected ? "Connected" : "Disconnected"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setApiConnected(!apiConnected)}
                className={`px-6 py-2 border-2 transition-colors ${
                  apiConnected
                    ? "border-destructive text-destructive hover:bg-destructive hover:text-background"
                    : "border-secondary text-secondary hover:bg-secondary hover:text-background"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {apiConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
            <p className="opacity-70 text-sm">
              Groq API provides fast LLM inference for answering your questions.
              Connect your API key to enable AI-powered responses.
            </p>
          </div>
        </motion.section>

        {/* Model Selection */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="border-4 border-border bg-card p-8"
        >
          <h2
            className="mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}
          >
            Model Selection
          </h2>
          <div className="space-y-3">
            {models.map((model) => (
              <motion.button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                whileHover={{ x: 4 }}
                className={`w-full p-4 border-2 text-left transition-all ${
                  selectedModel === model.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">{model.name}</div>
                    <div
                      className="opacity-50"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                    >
                      {model.description}
                    </div>
                  </div>
                  {selectedModel === model.id && (
                    <div className="w-4 h-4 bg-primary border-2 border-primary"></div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Appearance */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-4 border-border bg-card p-8"
        >
          <h2
            className="mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}
          >
            Appearance
          </h2>
          <div className="flex items-center justify-between p-4 border-2 border-border bg-background">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-6 h-6 text-primary" />
              ) : (
                <Sun className="w-6 h-6 text-primary" />
              )}
              <div>
                <div className="font-medium">Theme</div>
                <div
                  className="opacity-50"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                >
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-16 h-8 border-2 border-border transition-colors ${
                darkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-background border-2 border-foreground"
                animate={{ left: darkMode ? "calc(100% - 1.5rem)" : "0.25rem" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              ></motion.div>
            </button>
          </div>
        </motion.section>

        {/* Database Management */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-4 border-border bg-card p-8"
        >
          <h2
            className="mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}
          >
            Database Management
          </h2>
          <div className="space-y-4">
            <div className="p-4 border-2 border-border bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Vector Database</span>
                <span
                  className="text-secondary"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                >
                  FAISS
                </span>
              </div>
              <div
                className="opacity-50"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
              >
                3 documents • 1,092 chunks indexed
              </div>
            </div>
            <button className="w-full px-6 py-4 border-2 border-destructive text-destructive hover:bg-destructive hover:text-background transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-5 h-5" />
              <span style={{ fontFamily: "var(--font-mono)" }}>
                Clear Vector Database
              </span>
            </button>
            <p className="opacity-70 text-sm">
              This will permanently delete all indexed document chunks. You'll need
              to re-upload your PDFs to use them again.
            </p>
          </div>
        </motion.section>

        {/* Statistics */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-4 border-border bg-card p-8"
        >
          <h2
            className="mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem" }}
          >
            Usage Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-border bg-background">
              <div
                className="opacity-50 mb-1"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
              >
                TOTAL QUERIES
              </div>
              <div
                style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
              >
                247
              </div>
            </div>
            <div className="p-4 border-2 border-border bg-background">
              <div
                className="opacity-50 mb-1"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
              >
                DOCUMENTS
              </div>
              <div
                style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
              >
                3
              </div>
            </div>
            <div className="p-4 border-2 border-border bg-background">
              <div
                className="opacity-50 mb-1"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
              >
                AVG RESPONSE TIME
              </div>
              <div
                style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
              >
                1.2s
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
