import React from "react";

function PDFViewer({ activeDocument }) {
  if (!activeDocument) {
    return (
      <section className="surface-card surface-viewer">
        <div className="empty-state">
          <strong>No document selected</strong>
          <p>Choose a paper from the sidebar or upload a new one to populate the viewer.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="surface-card surface-viewer">
      <div className="surface-heading">
        <div>
          <p className="eyebrow">Viewer</p>
          <h3>Document overview</h3>
        </div>
        <span className="status-pill neutral">{activeDocument.status}</span>
      </div>

      <div className="viewer-metadata">
        <article>
          <span>Topic</span>
          <strong>{activeDocument.topic}</strong>
        </article>
        <article>
          <span>Pages</span>
          <strong>{activeDocument.pages}</strong>
        </article>
        <article>
          <span>Confidence</span>
          <strong>{activeDocument.confidence}%</strong>
        </article>
      </div>

      <div className="viewer-panel">
        <h4>{activeDocument.title}</h4>
        <p>{activeDocument.summary}</p>
      </div>

      <div className="viewer-preview">
        <div className="viewer-page">
          <div className="viewer-page-header">
            <span />
            <span />
            <span />
          </div>
          <p>{activeDocument.previewText}</p>
        </div>
      </div>
    </section>
  );
}

export default PDFViewer;
