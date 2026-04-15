import React from "react";

function LandingPage({ onEnterWorkspace, onOpenUpload }) {
  return (
    <main className="landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">PaperSense UI</p>
          <h1>Read faster, retrieve smarter, and turn dense PDFs into usable answers.</h1>
          <p className="hero-copy">
            A focused research cockpit for uploading papers, extracting signal, and interrogating
            documents without losing context.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={onEnterWorkspace}>
              Open workspace
            </button>
            <button type="button" className="ghost-button" onClick={onOpenUpload}>
              Upload first paper
            </button>
          </div>

          <div className="hero-stats">
            <article>
              <strong>FAISS + LLM</strong>
              <span>Semantic retrieval backed by your FastAPI pipeline</span>
            </article>
            <article>
              <strong>Research-first flow</strong>
              <span>Upload, inspect, summarize, and ask follow-up questions in one place</span>
            </article>
            <article>
              <strong>Settings-ready</strong>
              <span>Structured layout aligned with the Figma Make app architecture</span>
            </article>
          </div>
        </div>

        <div className="landing-preview">
          <div className="preview-panel">
            <div className="preview-header">
              <span className="preview-dot" />
              <span className="preview-dot" />
              <span className="preview-dot" />
            </div>

            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="preview-chip">Library</div>
                <div className="preview-stack">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="preview-main">
                <div className="preview-card large" />
                <div className="preview-row">
                  <div className="preview-card" />
                  <div className="preview-card" />
                </div>
                <div className="preview-card wide" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
