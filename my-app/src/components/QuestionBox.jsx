import React, { useEffect, useRef, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function QuestionBox({ uploadedFile, uploadInfo }) {
	const [question, setQuestion] = useState("");
	const [answers, setAnswers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const uploadSeedKeyRef = useRef(null);

	useEffect(() => {
		if (!uploadedFile || !uploadInfo) {
			return;
		}

		const seedKey = `${uploadedFile.name}-${uploadInfo.chunks_added || 0}-${uploadInfo.pages_read || 0}`;
		if (uploadSeedKeyRef.current === seedKey) {
			return;
		}

		uploadSeedKeyRef.current = seedKey;

		const preview = uploadInfo.preview_text
			? `Preview: ${uploadInfo.preview_text}`
			: "Preview not available.";

		const firstResponse = {
			id: Date.now(),
			question: `PDF uploaded: ${uploadedFile.name}`,
			answer: `Upload successful. Pages read: ${uploadInfo.pages_read || 0}, chunks indexed: ${uploadInfo.chunks_added || 0}. ${preview}`,
			timestamp: new Date().toLocaleTimeString(),
		};

		setAnswers([firstResponse]);
	}, [uploadedFile, uploadInfo]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		
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

			const newAnswer = {
				id: Date.now(),
				question: question,
				answer: answerText,
				timestamp: new Date().toLocaleTimeString(),
			};

			setAnswers((prev) => [newAnswer, ...prev]);
			setQuestion("");
		} catch (err) {
			const isNetworkError = err instanceof TypeError && err.message === "Failed to fetch";
			if (isNetworkError) {
				setError(`Could not connect to API at ${API_BASE_URL}. Start the backend server or set VITE_API_URL correctly.`);
			} else {
				setError(err.message || "Error processing question");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="question-box-container">
			<h2 className="section-title">Ask Questions</h2>
			<p className="section-subtitle">Get insights from your uploaded document</p>

			<form onSubmit={handleSubmit} className="question-form">
				<div className="question-input-wrapper">
					<textarea
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						placeholder="Ask a question about your document..."
						className="question-input"
						rows={3}
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={loading || !question.trim()}
						className="question-submit-btn"
					>
						{loading ? (
							<>
								<span className="spinner"></span>
								Processing...
							</>
						) : (
							<>
								<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
								Send
							</>
						)}
					</button>
				</div>
			</form>

			{error && <p className="upload-error">{error}</p>}

			{answers.length > 0 && (
				<div className="answers-list">
					<h3 className="answers-title">Responses</h3>
					{answers.map((item) => (
						<div key={item.id} className="answer-card">
							<div className="answer-question">
								<div className="answer-icon question-icon">Q</div>
								<p>{item.question}</p>
							</div>
							<div className="answer-response">
								<div className="answer-icon response-icon">A</div>
								<div>
									<p>{item.answer}</p>
									<span className="answer-timestamp">{item.timestamp}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default QuestionBox;
