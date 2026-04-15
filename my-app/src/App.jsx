import React, { useMemo, useState } from "react";
import LandingPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import SettingsPanel from "./components/SettingsPanel";
import UploadModal from "./components/UploadModal";
import "./App.css";

const initialDocuments = [
  {
    id: "doc-vision-transformers",
    title: "Vision Transformers for Dense Prediction",
    topic: "Computer Vision",
    pages: 18,
    status: "Indexed",
    confidence: 94,
    uploadedAt: "Today, 09:20",
    summary:
      "Explores transformer backbones for segmentation tasks and compares dense prediction accuracy against convolutional baselines.",
    previewText:
      "This paper evaluates the transfer efficiency of transformer encoders for segmentation, detection, and dense visual reasoning tasks...",
  },
  {
    id: "doc-llm-eval",
    title: "Robust Evaluation of LLM Retrieval Pipelines",
    topic: "NLP Systems",
    pages: 12,
    status: "Ready",
    confidence: 88,
    uploadedAt: "Yesterday, 18:10",
    summary:
      "A benchmarking study of retrieval quality, citation grounding, and hallucination rates in enterprise question-answering systems.",
    previewText:
      "We propose a layered evaluation protocol combining retrieval recall, attribution precision, and expert adjudication for factuality...",
  },
];

const initialSettings = {
  notifications: true,
  compactMode: false,
  autoSummaries: true,
  citationHighlights: true,
};

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [documents, setDocuments] = useState(initialDocuments);
  const [activeDocumentId, setActiveDocumentId] = useState(initialDocuments[0]?.id ?? null);
  const [settings, setSettings] = useState(initialSettings);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeDocumentId) ?? null,
    [activeDocumentId, documents]
  );

  const handleUploadSuccess = (file, apiResult) => {
    const id = `doc-${Date.now()}`;
    const nextDocument = {
      id,
      title: file.name.replace(/\.pdf$/i, ""),
      topic: "Uploaded PDF",
      pages: apiResult?.pages_read || 0,
      status: "Indexed",
      confidence: Math.min(98, 75 + Math.round(Math.random() * 20)),
      uploadedAt: "Just now",
      summary: apiResult?.message || "Freshly indexed and ready for analysis.",
      previewText: apiResult?.preview_text || "Preview text unavailable for this document.",
    };

    setDocuments((current) => [nextDocument, ...current]);
    setActiveDocumentId(id);
    setCurrentView("dashboard");
    setIsUploadModalOpen(false);
  };

  return (
    <>
      {currentView === "landing" ? (
        <LandingPage
          onEnterWorkspace={() => setCurrentView("dashboard")}
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />
      ) : null}

      {currentView === "dashboard" ? (
        <Dashboard
          documents={documents}
          activeDocument={activeDocument}
          onSelectDocument={setActiveDocumentId}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenSettings={() => setCurrentView("settings")}
          onBackHome={() => setCurrentView("landing")}
          compactMode={settings.compactMode}
        />
      ) : null}

      {currentView === "settings" ? (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onBack={() => setCurrentView("dashboard")}
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />
      ) : null}

      {isUploadModalOpen ? (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      ) : null}
    </>
  );
}

export default App;
