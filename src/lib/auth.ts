// src/lib/auth.ts
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";


export async function loginWithGoogleRedirect() {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
}


export async function handleRedirectResult() {
  try {
   
    await getRedirectResult(auth);
  } catch (e) {
    console.error("Auth redirect error:", e);
  }
}


export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}


export async function logout() {
  await signOut(auth);
}
