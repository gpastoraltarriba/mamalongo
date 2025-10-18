// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/login.module.css";
import { auth, db, provider } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const AFTER_LOGIN = "/"; // cambia a "/boards" o la que toque

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const btnLoginGoogle = async () => {
    if (loadingGoogle) return;
    setError(null); setLoadingGoogle(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const cred = await signInWithPopup(auth, provider);
      const u = cred.user;

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      const base = { uid: u.uid, username: u.displayName ?? "", email: u.email ?? "", foto: u.photoURL ?? "", updatedAt: serverTimestamp() };
      await setDoc(ref, snap.exists() ? base : { ...base, createdAt: serverTimestamp() }, { merge: true });

      navigate(AFTER_LOGIN, { replace: true });
    } catch (e: any) {
      console.error("popup error:", e?.code, e);
      if (e?.code === "auth/popup-blocked") setError("El navegador bloqueó el popup. Permite pop-ups para este sitio.");
      else if (e?.code === "auth/popup-closed-by-user") setError("Cerraste el popup antes de completar el login.");
      else setError(e?.message ?? "No se pudo iniciar sesión con Google.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const btnLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (loadingEmail) return;
    setError(null); setLoadingEmail(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const u = cred.user;

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      const base = { uid: u.uid, username: u.displayName ?? "", email: u.email ?? email, foto: u.photoURL ?? "", updatedAt: serverTimestamp() };
      await setDoc(ref, snap.exists() ? base : { ...base, createdAt: serverTimestamp() }, { merge: true });

      navigate(AFTER_LOGIN, { replace: true });
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Error de autenticación.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {error && <div className={styles.msgError}><span>{error}</span></div>}
      <h2 style={{ textAlign: "center", color: "#172b4d" }}>Iniciar Sesión</h2>

      <button type="button" onClick={btnLoginGoogle} className={styles.btnGoogle} disabled={loadingGoogle}>
        {loadingGoogle ? "Abriendo Google…" : "Continuar con Google"}
      </button>

      <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

      <form onSubmit={btnLogin}>
        <input className={styles.formInput} type="email" placeholder="Correo electrónico" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className={styles.formInput} type="password" placeholder="Contraseña" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit" className={styles.formBtn} disabled={loadingEmail}>
          {loadingEmail ? "Entrando…" : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
