import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDjV0yUy6M05DW5KBaRBz5hlQw6DsQU3xM",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-research-analyst-a5ca8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-research-analyst-a5ca8",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-research-analyst-a5ca8.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "609122516260",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:609122516260:web:ab4a0097041ff3058d87b1",
};

const hasRequiredFirebaseConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId;

if (!hasRequiredFirebaseConfig) {
  throw new Error("Firebase is not configured. Check your VITE_FIREBASE_* environment variables.");
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
