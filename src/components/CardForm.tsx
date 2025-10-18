// src/components/CardForm.tsx
import React, { useMemo, useState } from "react";
import type { Card, ListId } from "../lib/BoardData";
import { addCard, updateCard, LABEL, STATUSES } from "../lib/BoardData";

type Props = {
  boardId: string;
  initial?: Partial<Card>; 
  defaultListId?: ListId;  
  onClose?: () => void;
};

export default function CardForm({ boardId, initial, defaultListId = "todo", onClose }: Props) {
  const editing = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [listId, setListId] = useState<ListId>((initial?.listId as ListId) ?? defaultListId);
  const [dueDate, setDueDate] = useState<string | "">(initial?.dueDate ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => {
    const t = title.trim();
    if (t.length < 3 || t.length > 120) return false;
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return false;
    return true;
  }, [title, dueDate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError("Revisa los campos: título (3–120) y fecha (YYYY-MM-DD).");
      return;
    }
    try {
      setBusy(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        listId,
        dueDate: dueDate || null,
      };

      if (editing && initial?.id) {
        await updateCard(boardId, initial.id, payload);
      } else {
        await addCard(boardId, payload);
      }
      onClose?.();
    } catch (e: any) {
      console.error(e);
      setError("No se pudo guardar la tarjeta.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ background: "white", borderRadius: 8, padding: 12, boxShadow: "0 1px 3px rgba(0,0,0,.15)" }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        {editing ? "Editar tarjeta" : "Nueva tarjeta"}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título (3–120)"
          maxLength={120}
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          rows={3}
          style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, resize: "vertical" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={listId}
            onChange={(e) => setListId(e.target.value as ListId)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
            title="Columna"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{LABEL[s]}</option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}
            title="Fecha límite (opcional)"
          />
        </div>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {onClose && (
            <button type="button" onClick={onClose} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}>
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit || busy}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              background: busy ? "#86c57a" : "#5aac44",
              color: "white",
              fontWeight: 600,
              cursor: !canSubmit || busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "Guardando..." : editing ? "Guardar cambios" : "Crear tarjeta"}
          </button>
        </div>
      </div>
    </form>
  );
}
