import React, { useState } from "react";
import PDFUpload from "../components/PDFUpload";
import QuestionBox from "../components/QuestionBox";

function Dashboard({ onLogout }) {
	const [uploadedFile, setUploadedFile] = useState(null);
	const [uploadInfo, setUploadInfo] = useState(null);
	const [showQuestions, setShowQuestions] = useState(false);

	const handleUploadSuccess = (file, apiResult) => {
		setUploadedFile(file);
		setUploadInfo(apiResult || null);
		setShowQuestions(true);
	};

	const handleLogout = () => {
		if (onLogout) {
			onLogout();
		}
	};

	const handleReset = () => {
		setUploadedFile(null);
		setUploadInfo(null);
		setShowQuestions(false);
	};

	return (
		<div className="dashboard-page">
			<header className="dashboard-header">
				<div className="header-content">
					<div className="brand-row">
						<div className="brand-icon" aria-hidden="true"></div>
						<p className="brand-text">
							<span>AI </span> <strong>Research Analyst</strong>
						</p>
					</div>
					<div className="header-actions">
						{uploadedFile && (
							<button onClick={handleReset} className="reset-btn">
								<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								New Upload
							</button>
						)}
						<button onClick={handleLogout} className="logout-btn">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							Logout
						</button>
					</div>
				</div>
			</header>

			<main className="dashboard-main">
				<div className="dashboard-container">
					<section className={`dashboard-section ${!showQuestions ? 'full-width' : ''}`}>
						<PDFUpload onUploadSuccess={handleUploadSuccess} />
					</section>

					{showQuestions && (
						<section className="dashboard-section">
							<QuestionBox uploadedFile={uploadedFile} uploadInfo={uploadInfo} />
						</section>
					)}
				</div>
			</main>
		</div>
	);
}

export default Dashboard;
