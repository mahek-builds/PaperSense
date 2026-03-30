import React, { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function PDFUpload({ onUploadSuccess }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [dragActive, setDragActive] = useState(false);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		validateAndSetFile(file);
	};

	const validateAndSetFile = (file) => {
		setError("");
		setSuccessMessage("");
		
		if (!file) {
			return;
		}

		if (file.type !== "application/pdf") {
			setError("Please select a PDF file");
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			setError("File size must be less than 10MB");
			return;
		}

		setSelectedFile(file);
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			validateAndSetFile(e.dataTransfer.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setError("Please select a file first");
			return;
		}

		setUploading(true);
		setError("");
		setSuccessMessage("");

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

			setSuccessMessage(result.message || "PDF uploaded successfully");
			onUploadSuccess(selectedFile, result);
		} catch (err) {
			const isNetworkError = err instanceof TypeError && err.message === "Failed to fetch";
			if (isNetworkError) {
				setError(`Could not connect to API at ${API_BASE_URL}. Start the backend server or set VITE_API_URL correctly.`);
			} else {
				setError(err.message || "Upload failed. Please try again.");
			}
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = () => {
		setSelectedFile(null);
		setError("");
		setSuccessMessage("");
	};

	return (
		<div className="pdf-upload-container">
			<h2 className="section-title">Upload PDF Document</h2>
			<p className="section-subtitle">Upload your research paper or document for analysis</p>

			<div
				className={`upload-area ${dragActive ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
			>
				{!selectedFile ? (
					<>
						<div className="upload-icon">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
						</div>
						<p className="upload-text">
							<strong>Click to upload</strong> or drag and drop
						</p>
						<p className="upload-hint">PDF files only (Max 10MB)</p>
						<input
							type="file"
							accept=".pdf,application/pdf"
							onChange={handleFileChange}
							className="file-input"
							id="pdf-upload"
						/>
						<label htmlFor="pdf-upload" className="upload-btn">
							Select PDF
						</label>
					</>
				) : (
					<div className="file-preview">
						<div className="file-icon">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<div className="file-info">
							<p className="file-name">{selectedFile.name}</p>
							<p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
						</div>
						<button onClick={handleRemove} className="remove-btn" type="button">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				)}
			</div>

			{error && <p className="upload-error">{error}</p>}
			{successMessage && <p className="upload-success">{successMessage}</p>}

			{selectedFile && (
				<button
					onClick={handleUpload}
					disabled={uploading}
					className="upload-submit-btn"
				>
					{uploading ? (
						<>
							<span className="spinner"></span>
							Uploading...
						</>
					) : (
						"Upload Document"
					)}
				</button>
			)}
		</div>
	);
}

export default PDFUpload;
