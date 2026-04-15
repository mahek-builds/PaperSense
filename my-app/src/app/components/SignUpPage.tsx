import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, FileText, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../auth";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Password does not meet all requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await signUp(email, password);
    if (signUpError) {
      setError(signUpError);
      setIsLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <Link to="/" className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
            <FileText className="w-5 h-5 text-background" strokeWidth={2.5} />
          </div>
          <h1
            className="tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
          >
            PaperSense
          </h1>
        </Link>

        {/* Sign Up Form */}
        <div className="border-4 border-foreground bg-card p-8">
          <h2
            className="mb-2"
            style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
          >
            Create Account
          </h2>
          <p className="mb-8 opacity-70">Join PaperSense to get started</p>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                className="block mb-2 opacity-70"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
              >
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-input border-2 border-border focus:border-primary outline-none transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                className="block mb-2 opacity-70"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-input border-2 border-border focus:border-primary outline-none transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 opacity-50" />
                  ) : (
                    <Eye className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-4 space-y-2">
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 border border-border flex items-center justify-center ${
                        req.met ? "bg-secondary border-secondary" : ""
                      }`}
                    >
                      {req.met && (
                        <Check className="w-3 h-3 text-background" strokeWidth={3} />
                      )}
                    </div>
                    <span
                      className={`text-sm ${req.met ? "opacity-70" : "opacity-40"}`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                className="block mb-2 opacity-70"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}
              >
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-input border-2 border-border focus:border-primary outline-none transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 opacity-50" />
                  ) : (
                    <Eye className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-2 text-sm text-destructive">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="mt-2 text-sm text-secondary">Passwords match</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 border-2 border-destructive bg-destructive/10">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !allRequirementsMet || !passwordsMatch}
              className="w-full px-6 py-4 bg-primary text-background border-2 border-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t-2 border-border"></div>
            <span className="opacity-50" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
              OR
            </span>
            <div className="flex-1 border-t-2 border-border"></div>
          </div>

          {/* Log In Link */}
          <p className="text-center opacity-70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
