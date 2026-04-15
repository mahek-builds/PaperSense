import React, { useMemo, useState } from "react";
import PDFViewer from "../components/PDFViewer";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function Dashboard({
  documents,
  activeDocument,
  onSelectDocument,
  onOpenUpload,
  onOpenSettings,
  onBackHome,
  compactMode = false,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState([]);

  const insightCards = useMemo(() => {
    const indexedDocuments = documents.filter((document) => document.status === "Indexed").length;
    const averageConfidence =
      documents.length > 0
        ? Math.round(
            documents.reduce((total, document) => total + (document.confidence || 0), 0) / documents.length
          )
        : 0;

    return [
      { label: "Library", value: `${documents.length} docs`, helper: "Across active workspace" },
      { label: "Indexed", value: `${indexedDocuments}`, helper: "Ready for semantic search" },
      { label: "Confidence", value: `${averageConfidence}%`, helper: "Average retrieval score" },
    ];
  }, [documents]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok || result.error) {
        throw new Error(result.error || "Could not get answer");
      }

      const answerText =
        typeof result.answer === "string"
          ? result.answer
          : typeof result.message === "string"
          ? result.message
          : JSON.stringify(result);

      setResponses((current) => [
        {
          id: Date.now(),
          question,
          answer: answerText,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...current,
      ]);
      setQuestion("");
    } catch (requestError) {
      const isNetworkError = requestError instanceof TypeError && requestError.message === "Failed to fetch";
      setError(
        isNetworkError
          ? `Could not connect to API at ${API_BASE_URL}. Start the backend server or set VITE_API_URL correctly.`
          : requestError.message || "Error processing question"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`workspace-shell ${compactMode ? "compact" : ""}`}>
      <aside className="workspace-sidebar">
        <div className="sidebar-brand">
          <div className="brand-chip">PS</div>
          <div>
            <p className="eyebrow">PaperSense</p>
            <h1>Research Workspace</h1>
          </div>
        </div>

        <div className="sidebar-actions">
          <button type="button" className="primary-button" onClick={onOpenUpload}>
            Upload paper
          </button>
          <button type="button" className="ghost-button" onClick={onOpenSettings}>
            Settings
          </button>
        </div>

        <section className="sidebar-block">
          <p className="sidebar-label">Documents</p>
          <div className="document-list">
            {documents.map((document) => (
              <button
                key={document.id}
                type="button"
                className={`document-card ${document.id === activeDocument?.id ? "active" : ""}`}
                onClick={() => onSelectDocument(document.id)}
              >
                <span className="document-topic">{document.topic}</span>
                <strong>{document.title}</strong>
                <span className="document-meta">
                  {document.pages} pages . {document.status}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="sidebar-block sidebar-footer">
          <p className="sidebar-label">Workspace note</p>
          <p className="muted-copy">
            This frontend is modeled from the Figma Make app structure, with landing, dashboard,
            upload, viewer, and settings flows adapted into your existing React app.
          </p>
          <button type="button" className="text-button" onClick={onBackHome}>
            Back to home
          </button>
        </section>
      </aside>

      <section className="workspace-main">
        <header className="workspace-hero">
          <div>
            <p className="eyebrow">Document intelligence</p>
            <h2>{activeDocument?.title || "Select a document"}</h2>
            <p className="hero-copy">
              Analyze research papers with upload, retrieval, and Q&A in one focused workspace.
            </p>
          </div>

          <div className="insight-grid">
            {insightCards.map((card) => (
              <article key={card.label} className="insight-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.helper}</small>
              </article>
            ))}
          </div>
        </header>

        <div className="workspace-grid">
          <section className="surface-card surface-analysis">
            <div className="surface-heading">
              <div>
                <p className="eyebrow">Analyzer</p>
                <h3>Ask the paper</h3>
              </div>
              <span className="status-pill">Live query</span>
            </div>

            <form className="analysis-form" onSubmit={handleSubmit}>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Summarize the contribution, list datasets, or compare the method to prior work..."
                className="analysis-input"
                rows={4}
                disabled={loading}
              />
              <div className="analysis-actions">
                <p className="muted-copy">Responses appear below and stay scoped to the current session.</p>
                <button type="submit" className="primary-button" disabled={loading || !question.trim()}>
                  {loading ? "Thinking..." : "Run analysis"}
                </button>
              </div>
            </form>

            {error ? <p className="error-banner">{error}</p> : null}

            <div className="response-feed">
              {responses.length === 0 ? (
                <div className="empty-state">
                  <strong>No questions yet</strong>
                  <p>Start with a high-level summary, then drill into methods, metrics, or citations.</p>
                </div>
              ) : (
                responses.map((entry) => (
                  <article key={entry.id} className="response-card">
                    <p className="response-question">{entry.question}</p>
                    <p className="response-answer">{entry.answer}</p>
                    <span className="response-time">{entry.timestamp}</span>
                  </article>
                ))
              )}
            </div>
          </section>

          <PDFViewer activeDocument={activeDocument} />
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
