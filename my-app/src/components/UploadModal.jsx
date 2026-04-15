import React, { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function UploadModal({ onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const validateAndSetFile = (file) => {
    setError("");

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Choose a file before uploading.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok || result.error) {
        throw new Error(result.error || "Upload failed. Please try again.");
      }

      onUploadSuccess(selectedFile, result);
    } catch (requestError) {
      const isNetworkError = requestError instanceof TypeError && requestError.message === "Failed to fetch";
      setError(
        isNetworkError
          ? `Could not connect to API at ${API_BASE_URL}. Start the backend server or set VITE_API_URL correctly.`
          : requestError.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    }

    if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      validateAndSetFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="upload-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="surface-heading">
          <div>
            <p className="eyebrow">Upload</p>
            <h3>Add a new paper</h3>
          </div>
          <button type="button" className="icon-dismiss" onClick={onClose} aria-label="Close upload modal">
            x
          </button>
        </div>

        <div
          className={`upload-dropzone ${dragActive ? "active" : ""} ${selectedFile ? "selected" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="upload-file-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => validateAndSetFile(event.target.files[0])}
          />

          {!selectedFile ? (
            <>
              <strong>Drag and drop your PDF</strong>
              <p>or browse from your device to start indexing in PaperSense</p>
              <label htmlFor="upload-file-input" className="ghost-button">
                Browse PDF
              </label>
            </>
          ) : (
            <>
              <strong>{selectedFile.name}</strong>
              <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB ready to upload</p>
              <button type="button" className="text-button" onClick={() => setSelectedFile(null)}>
                Remove file
              </button>
            </>
          )}
        </div>

        {error ? <p className="error-banner">{error}</p> : null}

        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-button" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload and index"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default UploadModal;
