// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const goHome = () => navigate("/", { replace: true });


  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setError(null);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const ref = doc(db, "users", cred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || "",
          role: "user",
          createdAt: serverTimestamp(),
        });
      }
      goHome();
    } catch (err: any) {
      setError(err.message ?? "Error al iniciar sesión");
    }
  };

  const handleSignup = async () => {
    try {
      setError(null);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(cred.user, { displayName });
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName || cred.user.displayName || "",
        role: "user",
        createdAt: serverTimestamp(),
      });
      goHome();
    } catch (err: any) {
      setError(err.message ?? "Error al registrarte");
    }
  };


  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '400px', 
      margin: '100px auto', 
      backgroundColor: 'white',
      borderRadius: '8px', 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#172b4d' }}>Acceso al Tablero</h2>

      {/* Botón rápido de "Login" real */}
      <button 
        onClick={() => handleLogin()}
        style={{ 
          width: '100%', 
          padding: '12px', 
          cursor: 'pointer', 
          backgroundColor: '#0079bf',
          color: 'white', 
          border: 'none', 
          borderRadius: '3px', 
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 1px 0 rgba(0,0,0,0.4)',
          marginBottom: '10px'
        }}
      >
        Iniciar sesión
      </button>

      <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

      {/* Mismo formulario, ahora enlazado a estado y handlers reales */}
      <form onSubmit={handleLogin}>
        <input 
          type="text"
          placeholder="Nombre (solo para registro)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{ width: '95%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '95%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '95%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        {error && <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div>}
        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#5aac44', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
        >
          Iniciar sesión
        </button>
      </form>

      <button
        onClick={handleSignup}
        style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#172b4d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', marginTop: 10 }}
      >
        Crear cuenta
      </button>
    </div>
  );
};

export default Login;
