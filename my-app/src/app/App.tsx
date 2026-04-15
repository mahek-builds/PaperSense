import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import { AuthProvider, useAuth } from "./AuthContext";

const AUTO_SUMMARIES_STORAGE_KEY = "papersense:auto-summaries";

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ fontFamily: "var(--font-mono)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

export default function App() {
  const [autoSummaries, setAutoSummaries] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const storedValue = window.localStorage.getItem(AUTO_SUMMARIES_STORAGE_KEY);
    return storedValue === null ? true : storedValue === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(AUTO_SUMMARIES_STORAGE_KEY, String(autoSummaries));
  }, [autoSummaries]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard autoSummaries={autoSummaries} />} />}
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute
                element={
                  <Settings
                    autoSummaries={autoSummaries}
                    onToggleAutoSummaries={setAutoSummaries}
                  />
                }
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}