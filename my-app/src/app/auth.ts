import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signUp(email: string, password: string) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return {
      user: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.",
    };
  }
}

export async function logIn(email: string, password: string) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return {
      user: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to log in. Please check your email and password.",
    };
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to log out. Please try again.",
    };
  }
}
