import React from "react";
import type { Card } from "../lib/BoardData";
import CardForm from "./CardForm";
import { updateCard, removeCard } from "../lib/BoardData";

type Props = {
  boardId: string;
  card: Card;
};

function getDueBadge(dueDate?: string | null) {
  if (!dueDate) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  if (isNaN(+due)) return null;
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return { text: `Vencida (${Math.abs(diffDays)}d)`, bg: "#fee2e2", fg: "#b91c1c", title: "La fecha ya pasó" };
  }
  if (diffDays <= 2) {
    return { text: `⚠︎ Quedan ${diffDays}d`, bg: "#fef3c7", fg: "#b45309", title: "Quedan menos de 3 días" };
  }
  if (diffDays <= 7) {
    return { text: `En ${diffDays}d`, bg: "#fffbeb", fg: "#92400e", title: "Vence en menos de 1 semana" };
  }
  return null;
}

export default function CardItem({ boardId, card }: Props) {
  const [editing, setEditing] = React.useState(false);

  const toggleDone = async () => {
    const next = card.listId === "done" ? "doing" : "done";
    await updateCard(boardId, card.id, { listId: next });
  };

  const onDelete = async () => {
    if (!confirm("¿Eliminar tarjeta?")) return;
    await removeCard(boardId, card.id);
  };

  const dueBadge = getDueBadge(card.dueDate ?? undefined);

  if (editing) {
    return (
      <div style={{ marginBottom: 8 }}>
        <CardForm
          boardId={boardId}
          defaultListId={card.listId}
          editingCard={card}
          onClose={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: 8,
        border: "1px solid #cbd5e1",
        padding: 10,
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <strong>{card.title}</strong>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setEditing(true)} style={btnGhost}>Editar</button>
          <button onClick={onDelete} style={btnGhostDanger}>Borrar</button>
        </div>
      </div>

      {card.description && (
        <p style={{ color: "#334155", marginTop: 6, marginBottom: 6 }}>
          {card.description}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {card.assigneeUid && (
          <span style={{ fontSize: 12, color: "#64748b" }}>👤 {card.assigneeUid}</span>
        )}
        {card.dueDate && (
          <span style={{ fontSize: 12, color: "#64748b" }}>⏰ {card.dueDate}</span>
        )}
        {dueBadge && (
          <span
            title={dueBadge.title}
            style={{
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 999,
              background: dueBadge.bg,
              color: dueBadge.fg,
              fontWeight: 600,
              border: `1px solid ${dueBadge.fg}22`,
            }}
          >
            {dueBadge.text}
          </span>
        )}
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={toggleDone} style={btnPrimary}>
          {card.listId === "done" ? "Marcar como En progreso" : "Marcar como Hecho"}
        </button>
      </div>
    </div>
  );
}

const btnGhost: React.CSSProperties = {
  padding: "4px 8px",
  border: "1px solid #94a3b8",
  background: "#f8fafc",
  borderRadius: 6,
  cursor: "pointer",
};

const btnGhostDanger: React.CSSProperties = {
  ...btnGhost,
  borderColor: "#ef4444",
  color: "#ef4444",
};

const btnPrimary: React.CSSProperties = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 6,
  background: "#2563eb",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};
