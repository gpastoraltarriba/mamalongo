// src/components/CardItem.tsx
import React, { useState } from "react";
import type { Card } from "../lib/BoardData";
import { removeCard } from "../lib/BoardData";
import CardForm from "./CardForm";

export default function CardItem({ boardId, card }: { boardId: string; card: Card; }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div style={{ marginBottom: 10 }}>
        <CardForm
          boardId={boardId}
          initial={card}
          onClose={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ background: "white", borderRadius: 6, padding: 10, boxShadow: "0 1px 2px rgba(0,0,0,.1)", marginBottom: 10 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{card.title}</div>
      {card.description && <div style={{ color: "#374151", marginBottom: 6 }}>{card.description}</div>}
      {card.dueDate && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Fecha límite: {card.dueDate}</div>}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={() => setEditing(true)} style={{ border: "1px solid #ddd", borderRadius: 6, padding: "6px 10px" }}>
          Editar
        </button>
        <button
          onClick={() => removeCard(boardId, card.id)}
          style={{ color: "crimson", border: "1px solid #fca5a5", borderRadius: 6, padding: "6px 10px", background: "#fff5f5" }}
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
