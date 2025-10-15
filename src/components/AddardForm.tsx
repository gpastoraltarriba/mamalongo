// src/components/AddCardForm.tsx
import React, { useState } from "react";
import type { ListId } from "../lib/BoardData";
import { addCard } from "../lib/BoardData";

export default function AddCardForm({
  boardId,
  listId,
}: {
  boardId: string;
  listId: ListId; // 👈 antes era "status"
}) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = title.trim();
    if (!t) return;
    try {
      setBusy(true);
      await addCard(boardId, { title: t, listId, description: "", dueDate: null });
      setTitle("");
    } catch (err) {
      console.error("Error al crear tarjeta:", err);
      alert("No se pudo crear la tarjeta. Revisa reglas de Firestore/console.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 8, display: "flex", gap: 8 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Añadir otra tarjeta"
        style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 4 }}
      />
      <button
        type="submit"
        disabled={busy}
        style={{
          padding: "8px 10px",
          border: "none",
          borderRadius: 6,
          background: busy ? "#86c57a" : "#5aac44",
          color: "white",
          fontWeight: 600,
          cursor: busy ? "not-allowed" : "pointer",
        }}
        title="Crear tarjeta"
      >
        ➕
      </button>
    </form>
  );
}
