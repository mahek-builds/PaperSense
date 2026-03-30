import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import AuthForm from "../components/AuthForm";
import { auth } from "../firebase";

function formatFirebaseError(firebaseError) {
	const code = firebaseError?.code;

	switch (code) {
		case "auth/invalid-credential":
		case "auth/wrong-password":
		case "auth/user-not-found":
			return "Invalid email or password.";
		case "auth/invalid-email":
			return "Please enter a valid email address.";
		case "auth/too-many-requests":
			return "Too many attempts. Try again in a few minutes.";
		case "auth/network-request-failed":
			return "Network error. Check your internet and try again.";
		case "auth/configuration-not-found":
			return "Firebase Auth is not enabled. Enable Email/Password in Firebase Console.";
		case "auth/api-key-not-valid":
			return "Firebase API key is invalid. Check your Firebase configuration.";
		default:
			return firebaseError?.message || "Login failed. Please try again.";
	}
}

function Login({ onLoginSuccess }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			setSuccess(`Welcome, ${userCredential.user.email}`);
			setPassword("");
			setShowPassword(false);
			
			// Redirect to dashboard after successful login
			setTimeout(() => {
				if (onLoginSuccess) {
					onLoginSuccess();
				}
			}, 800); // Small delay to show success message
		} catch (firebaseError) {
			setError(formatFirebaseError(firebaseError));
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-page">
			<section className="auth-card">
				<div className="brand-row">
					<div className="brand-icon" aria-hidden="true">
					</div>
					<p className="brand-text">
						<span>AI </span> <strong>Research Analyst</strong>
					</p>
				</div>

				<h1>Welcome Back</h1>
				<p className="auth-subtitle">Sign in to access your dashboard</p>

				<AuthForm
					email={email}
					password={password}
					showPassword={showPassword}
					onTogglePassword={() => setShowPassword((current) => !current)}
					onEmailChange={(event) => setEmail(event.target.value)}
					onPasswordChange={(event) => setPassword(event.target.value)}
					onSubmit={handleSubmit}
					loading={loading}
				/>

				{error && <p className="auth-message error">{error}</p>}
				{success && <p className="auth-message success">{success}</p>}

				<p className="auth-footnote">
					Don&apos;t have an account? <a href="#">Sign up</a>
				</p>
			</section>
		</main>
	);
}

export default Login;
