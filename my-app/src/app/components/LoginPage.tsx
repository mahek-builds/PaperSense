import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, FileText, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: loginError } = await logIn(email, password);
    if (loginError) {
      setError(loginError);
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

        {/* Login Form */}
        <div className="border-4 border-foreground bg-card p-8">
          <h2
            className="mb-2"
            style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
          >
            Welcome Back
          </h2>
          <p className="mb-8 opacity-70">Sign in to access your documents</p>

          <form onSubmit={handleLogin} className="space-y-6">
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
              disabled={isLoading}
              className="w-full px-6 py-4 bg-primary text-background border-2 border-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {isLoading ? "Logging in..." : "Log In"}
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

          {/* Sign Up Link */}
          <p className="text-center opacity-70">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
