// src/pages/BoardView.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Card, ListId } from "../lib/BoardData";
import {
  LABEL, STATUSES, listenCards,
  saveColumnOrderForStatus,
} from "../lib/BoardData";
import Header from "../components/Header";
import CardItem from "../components/CardItems";
import CardForm from "../components/CardForm";

// (Sin DnD) Cambio de columna se hace en el formulario de edición/creación.

export default function BoardView() {
  const { boardId = "demo-123" } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [openCreator, setOpenCreator] = useState<Record<ListId, boolean>>({
    todo: false, doing: false, done: false,
  });

  useEffect(() => {
    const unsub = listenCards(boardId, setCards);
    return () => unsub();
  }, [boardId]);

  const grouped = useMemo(() => {
    const g: Record<ListId, Card[]> = { todo: [], doing: [], done: [] };
    for (const c of cards) g[c.listId].push(c);
    // opcional: orden estable dentro de cada columna por 'order'
    (Object.keys(g) as ListId[]).forEach((k) => {
      g[k].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
    });
    return g;
  }, [cards]);

  const idsByCol = {
    todo: grouped.todo.map((c) => c.id),
    doing: grouped.doing.map((c) => c.id),
    done: grouped.done.map((c) => c.id),
  };

  const saveAll = async () => {
    setSavedAt(null);
    try {
      setSaving(true);
      await saveColumnOrderForStatus(boardId, "todo", idsByCol.todo);
      await saveColumnOrderForStatus(boardId, "doing", idsByCol.doing);
      await saveColumnOrderForStatus(boardId, "done", idsByCol.done);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar. Revisa reglas de Firestore.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h2 style={{ color: "#172b4d", margin: 0 }}>Tablero: {boardId}</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {savedAt && <span style={{ color: "#16a34a" }}>Guardado ✓ {savedAt}</span>}
            <button
              onClick={saveAll}
              disabled={saving}
              style={{
                padding: "8px 12px",
                border: "none",
                borderRadius: 6,
                background: saving ? "#86c57a" : "#5aac44",
                color: "white",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {STATUSES.map((st, i) => (
            <div key={st} style={{ background: "#e6f4ff", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                {i + 1}. {LABEL[st]}
              </div>

              {/* Estado vacío */}
              {grouped[st].length === 0 && !openCreator[st] && (
                <div style={{
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: 6,
                  padding: 10,
                  color: "#6b7280",
                  fontStyle: "italic",
                  marginBottom: 8
                }}>
                  *Lista vacía*
                </div>
              )}

              {/* Tarjetas */}
              {grouped[st].map((card) => (
                <CardItem key={card.id} boardId={boardId} card={card} />
              ))}

              {/* Crear tarjeta */}
              {openCreator[st] ? (
                <div style={{ marginTop: 8 }}>
                  <CardForm
                    boardId={boardId}
                    defaultListId={st}
                    onClose={() => setOpenCreator((p) => ({ ...p, [st]: false }))}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setOpenCreator((p) => ({ ...p, [st]: true }))}
                  style={{
                    marginTop: 8,
                    width: "100%",
                    padding: 8,
                    border: "1px dashed #94a3b8",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                  }}
                >
                  + Añadir otra tarjeta
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
