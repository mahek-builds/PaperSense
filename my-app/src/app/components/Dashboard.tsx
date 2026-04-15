import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  BookOpen,
  Search,
  Send,
  Mic,
  Sparkles,
  Copy,
  ChevronDown,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UploadModal from "./UploadModal";
import { queryDocument } from "../api";
import { logOut } from "../auth";
import { useAuth } from "../AuthContext";

interface Document {
  id: string;
  name: string;
  pages: number;
  chunks: number;
  uploadedAt: string;
}

interface SummaryCard {
  id: string;
  title: string;
  summary: string;
  pages: number;
  chunks: number;
  uploadedAt: string;
}

interface DashboardProps {
  autoSummaries: boolean;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  sources?: { page: number; chunk: number; text: string }[];
  confidence?: number;
}

export default function Dashboard({ autoSummaries }: DashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [activePanel, setActivePanel] = useState<"chat" | "summarize">("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm ready to help you understand your documents. Upload a PDF or ask me about an existing document.",
    },
  ]);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);

  const handleLogout = async () => {
    const { error } = await logOut();
    if (!error) {
      navigate("/");
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim() || isAsking) return;

    const question = query;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: question,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setQuery("");
    setIsAsking(true);

    try {
      const response = await queryDocument(question);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.answer,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const aiError: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: error instanceof Error ? error.message : "Failed to fetch answer from API.",
      };
      setMessages((prev) => [...prev, aiError]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleUploadSuccess = (doc: {
    name: string;
    pages: number;
    chunks: number;
    previewText?: string;
    message?: string;
  }) => {
    const uploadedDoc: Document = {
      id: Date.now().toString(),
      name: doc.name,
      pages: doc.pages,
      chunks: doc.chunks,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    setDocuments((prev) => [uploadedDoc, ...prev]);
    setSelectedDoc(uploadedDoc.id);

    if (autoSummaries) {
      const summaryText =
        doc.previewText?.trim() || doc.message?.trim() || "Freshly indexed and ready for analysis.";

      setSummaryCards((prev) => [
        {
          id: uploadedDoc.id,
          title: uploadedDoc.name,
          summary: summaryText,
          pages: uploadedDoc.pages,
          chunks: uploadedDoc.chunks,
          uploadedAt: uploadedDoc.uploadedAt,
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-16 border-b-4 border-border flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center">
              <FileText className="w-4 h-4 text-background" strokeWidth={2.5} />
            </div>
            <h1
              className="tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
            >
              PaperSense
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 border-2 border-border">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span
              className="text-sm opacity-70"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {user?.email}
            </span>
          </div>
          <Link to="/settings">
            <button className="p-2 hover:bg-muted border-2 border-transparent hover:border-border transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-muted border-2 border-transparent hover:border-destructive transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:text-destructive" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 border-r-4 border-border bg-sidebar flex flex-col absolute lg:relative z-10 h-full"
            >
              <div className="p-6 border-b-4 border-border">
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full px-6 py-4 bg-primary text-background border-2 border-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span style={{ fontFamily: "var(--font-mono)" }}>Upload PDF</span>
                </button>
              </div>

              <div className="p-6 border-b-4 border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-3 bg-input border-2 border-border focus:border-primary outline-none transition-colors"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-3 px-2 opacity-50" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                  YOUR DOCUMENTS
                </div>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <motion.button
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc.id)}
                      whileHover={{ x: 4 }}
                      className={`w-full p-4 border-2 text-left transition-all ${
                        selectedDoc === doc.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedDoc === doc.id
                              ? "border-primary bg-primary/20"
                              : "border-muted-foreground"
                          }`}
                        >
                          <FileText
                            className={`w-5 h-5 ${
                              selectedDoc === doc.id ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate mb-1" style={{ fontSize: "0.875rem" }}>
                            {doc.name}
                          </div>
                          <div
                            className="opacity-50 flex items-center gap-2"
                            style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                          >
                            <span>{doc.pages} pages</span>
                            <span>•</span>
                            <span>{doc.chunks} chunks</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                  {documents.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-border opacity-60 text-sm">
                      No uploaded documents yet.
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col">
          <div className="border-b-4 border-border px-6 pt-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto flex items-end gap-6">
              <button
                onClick={() => setActivePanel("chat")}
                className={`px-1 pb-3 border-b-4 transition-colors inline-flex items-center gap-2 ${
                  activePanel === "chat"
                    ? "border-primary text-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Sparkles className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => setActivePanel("summarize")}
                className={`px-1 pb-3 border-b-4 transition-colors inline-flex items-center gap-2 ${
                  activePanel === "summarize"
                    ? "border-primary text-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <BookOpen className="w-4 h-4" />
                Summarize
              </button>
            </div>
          </div>

          {activePanel === "summarize" ? (
            <section className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <p
                    className="text-xs uppercase tracking-[0.3em] opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Auto summaries
                  </p>
                  <h2 className="text-2xl mt-2" style={{ fontFamily: "var(--font-display)" }}>
                    Ready-to-skim overview
                  </h2>
                </div>

                {!autoSummaries && (
                  <div className="border-2 border-border bg-card p-6">
                    <p className="opacity-80">
                      Auto summaries are turned off. Enable them from Settings to generate summaries after upload.
                    </p>
                  </div>
                )}

                {autoSummaries && summaryCards.length === 0 && (
                  <div className="border-2 border-border bg-card p-6">
                    <p className="opacity-80">
                      No summary yet. Upload a PDF and a summary card will appear here.
                    </p>
                  </div>
                )}

                {autoSummaries && summaryCards.length > 0 && (
                  <div className="grid gap-3">
                    {summaryCards.map((card) => (
                      <div key={card.id} className="border-2 border-primary/25 bg-primary/5 p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-medium">{card.title}</h3>
                            <p
                              className="text-xs opacity-50"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {card.pages} pages • {card.chunks} chunks • {card.uploadedAt}
                            </p>
                          </div>
                          <span
                            className="text-xs uppercase tracking-[0.2em] text-secondary"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            Summary
                          </span>
                        </div>
                        <p className="leading-relaxed opacity-90">{card.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-3xl ${
                          message.type === "user" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {message.type === "ai" && (
                            <div className="w-10 h-10 bg-primary border-2 border-primary flex items-center justify-center flex-shrink-0 mt-1">
                              <Sparkles className="w-5 h-5 text-background" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div
                              className={`p-4 border-2 ${
                                message.type === "user"
                                  ? "border-border bg-muted"
                                  : "border-primary/30 bg-primary/5"
                              }`}
                            >
                              <p className="leading-relaxed">{message.content}</p>
                            </div>

                            {message.sources && (
                              <div className="mt-4 space-y-2">
                                <div
                                  className="px-2 opacity-50"
                                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                                >
                                  SOURCE CHUNKS ({message.sources.length})
                                </div>
                                {message.sources.map((source, idx) => (
                                  <details
                                    key={idx}
                                    className="border border-border bg-card group"
                                  >
                                    <summary className="px-4 py-3 cursor-pointer hover:bg-muted transition-colors flex items-center justify-between">
                                      <span
                                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
                                      >
                                        Page {source.page}, Chunk {source.chunk}
                                      </span>
                                      <ChevronDown className="w-4 h-4 opacity-50 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-4 py-3 border-t border-border opacity-70 text-sm">
                                      {source.text}
                                    </div>
                                  </details>
                                ))}
                              </div>
                            )}

                            {message.confidence && (
                              <div className="mt-3 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-1 w-32 bg-border"
                                    style={{
                                      background: `linear-gradient(to right, #4ecca3 ${
                                        message.confidence * 100
                                      }%, #2a2a2a ${message.confidence * 100}%)`,
                                    }}
                                  ></div>
                                  <span
                                    className="text-secondary"
                                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                                  >
                                    {(message.confidence * 100).toFixed(0)}% confidence
                                  </span>
                                </div>
                                <button className="p-2 hover:bg-muted border border-border transition-colors">
                                  <Copy className="w-4 h-4 opacity-50" />
                                </button>
                              </div>
                            )}
                          </div>
                          {message.type === "user" && (
                            <div className="w-10 h-10 border-2 border-muted-foreground flex items-center justify-center flex-shrink-0 mt-1">
                              <div className="w-2 h-2 bg-muted-foreground"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="border-t-4 border-border p-6 flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask something about your document..."
                        className="w-full px-6 py-4 bg-input border-2 border-border focus:border-primary outline-none transition-colors pr-14"
                        style={{ fontFamily: "var(--font-mono)" }}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-muted transition-colors">
                        <Mic className="w-5 h-5 opacity-50" />
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendMessage}
                      disabled={isAsking}
                      className="px-8 py-4 bg-primary text-background border-2 border-primary hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        {isAsking ? "Asking..." : "Send"}
                      </span>
                    </motion.button>
                  </div>
                  <p
                    className="mt-3 opacity-50 text-center"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                  >
                    AI responses may contain inaccuracies. Always verify important information.
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
