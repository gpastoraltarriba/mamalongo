// src/pages/Boards.tsx
// src/pages/Boards.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../components/AuthGate";
import Header from "../components/Header";

type Board = { id: string; name: string; ownerId: string; createdAt?: any };

export default function Boards() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
  if (!user) return;
  const ref = collection(db, "boards");
  const q = query(ref, where("ownerId", "==", user.uid));

  const unsub = onSnapshot(q, (ss) => {
    const items = ss.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    // ordenamos en cliente por createdAt (si no existe, 0)
    items.sort((a, b) =>
      (b?.createdAt?.seconds ?? 0) - (a?.createdAt?.seconds ?? 0)
    );
    setBoards(items);
  });

  return () => unsub();
}, [user?.uid]);

  const createBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;
    const ref = collection(db, "boards");
    const docRef = await addDoc(ref, {
      name: name.trim(),
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });
    setName("");
    navigate(`/board/${docRef.id}`);
  };

  const card: React.CSSProperties = { background: "white", padding: 16, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,.15)" };

  return (
    <>
      <Header />
      <div style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ color: "#172b4d", marginBottom: 12 }}>Tus tableros</h2>

        {/* Crear tablero */}
        <form onSubmit={createBoard} style={{ ...card, marginBottom: 16, display: "flex", gap: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del tablero"
            style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 6 }}
          />
          <button
            type="submit"
            style={{ padding: "10px 14px", border: "none", borderRadius: 6, background: "#5aac44", color: "white", fontWeight: 600 }}
          >
            Crear tablero
          </button>
        </form>

        {/* Lista de tableros */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
          {boards.map(b => (
            <div key={b.id} style={card}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{b.name}</div>
              <button
                onClick={() => navigate(`/board/${b.id}`)}
                style={{ padding: "8px 10px", border: "none", borderRadius: 6, background: "#0079bf", color: "white" }}
              >
                Abrir tablero
              </button>
            </div>
          ))}
          {boards.length === 0 && <div style={{ ...card, opacity: .8 }}>*Aún no tienes tableros*</div>}
        </div>
      </div>
    </>
  );
}
