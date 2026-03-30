import React from "react";
import AuthInput from "./AuthInput";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 1v.2l8 5.2 8-5.2V7H4Zm16 10V8.4l-7.5 4.9a1 1 0 0 1-1.1 0L4 8.4V17h16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2h1.2A1.8 1.8 0 0 1 20 11.8v8.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 20.2v-8.4A1.8 1.8 0 0 1 5.8 10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Zm-3.2 2v8h12.4v-8H5.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5c5.2 0 9.4 3.9 10.7 6.6a1 1 0 0 1 0 .8C21.4 15.1 17.2 19 12 19S2.6 15.1 1.3 12.4a1 1 0 0 1 0-.8C2.6 8.9 6.8 5 12 5Zm0 2C8 7 4.7 9.7 3.4 12 4.7 14.3 8 17 12 17s7.3-2.7 8.6-5C19.3 9.7 16 7 12 7Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m3.7 2.3 18 18-1.4 1.4-3.1-3.1A11.2 11.2 0 0 1 12 20c-5.2 0-9.4-3.9-10.7-6.6a1 1 0 0 1 0-.8A16.6 16.6 0 0 1 7 6.4L2.3 3.7 3.7 2.3ZM8.6 8a14 14 0 0 0-5.2 4c1.3 2.3 4.6 5 8.6 5 1.5 0 2.9-.4 4.1-1.1l-1.8-1.8a2.5 2.5 0 0 1-3.4-3.4L8.6 8Zm3.9-3c5.2.2 9.2 4 10.2 6.6a1 1 0 0 1 0 .8 16.5 16.5 0 0 1-4 4.9l-1.4-1.4a14 14 0 0 0 3.3-3.9c-1.3-2.3-4.6-5-8.6-5h-.7L9.8 5.5c.9-.3 1.8-.5 2.7-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AuthForm({
  email,
  password,
  showPassword,
  onTogglePassword,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <AuthInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Enter your email"
        autoComplete="email"
        required
        leftIcon={<MailIcon />}
      />

      <AuthInput
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={onPasswordChange}
        placeholder="Enter your password"
        autoComplete="current-password"
        required
        leftIcon={<LockIcon />}
        rightElement={
          <button
            type="button"
            className="icon-button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />

      <button type="submit" className="signin-btn" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default AuthForm;
