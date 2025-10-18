// src/components/CardForm.tsx
import React from "react";
import type { ListId, Card } from "../lib/BoardData";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { STATUSES, LABEL } from "../lib/BoardData";

type Props = {
  boardId: string;
  defaultListId: ListId;
  editingCard?: Card;   // si viene => edición
  onClose: () => void;
};

type FormValues = {
  title: string;
  description: string;
  assigneeUid: string;
  dueDate: string;      // ISO o ""
  listId: ListId;
};

function validate(v: FormValues) {
  const e: Record<string, string> = {};
  if (!v.title?.trim()) e.title = "El título es obligatorio";
  if (v.title && v.title.length > 80) e.title = "Máximo 80 caracteres";
  if (v.dueDate) {
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(v.dueDate); d.setHours(0,0,0,0);
    if (d < today) e.dueDate = "La fecha no puede ser pasada";
  }
  return e;
}

export default function CardForm({ boardId, defaultListId, editingCard, onClose }: Props) {
  const isEdit = !!editingCard;
  const [values, setValues] = React.useState<FormValues>(() => ({
    title: editingCard?.title ?? "",
    description: editingCard?.description ?? "",
    assigneeUid: editingCard?.assigneeUid ?? "",
    dueDate: editingCard?.dueDate ?? "",
    listId: editingCard?.listId ?? defaultListId,
  }));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  const onChange =
    (k: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e1 = validate(values);
    setErrors(e1);
    if (Object.keys(e1).length) return;

    try {
      setSaving(true);
      const payload = {
        listId: values.listId,
        title: values.title.trim(),
        description: values.description.trim() || "",
        assigneeUid: values.assigneeUid.trim() || "",
        dueDate: values.dueDate || "",
        updatedAt: Date.now(),
      };

      if (isEdit && editingCard) {
        const ref = doc(db, "boards", boardId, "cards", editingCard.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          alert("La tarjeta que intentas editar ya no existe.");
          onClose();
          return;
        }
        await updateDoc(ref, payload);
      } else {
        await addDoc(collection(db, "boards", boardId, "cards"), {
          ...payload,
          createdAt: Date.now(),
          order: null,
        });
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la tarjeta. Revisa conexión/reglas de Firestore.");
    } finally {
      setSaving(false);
    }
  }

  const titleCount = values.title.length;
  const titleTooLong = titleCount > 80;

  return (
    <form onSubmit={onSubmit} style={{ background: "#fff", borderRadius: 8, border: "1px solid #cbd5e1", padding: 10 }}>
      {/* Título */}
      <label style={{ display: "block", fontSize: 12, color: "#475569", marginBottom: 4 }}>
        Título <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <input
        value={values.title}
        onChange={onChange("title")}
        placeholder="Ej. Configurar auth en Firebase"
        maxLength={120}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: `1px solid ${errors.title || titleTooLong ? "#ef4444" : "#94a3b8"}`,
          marginBottom: 4,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <small style={{ color: errors.title ? "#b91c1c" : "#64748b" }}>
          {errors.title ?? "Obligatorio. Máx. 80 caracteres."}
        </small>
        <small style={{ color: titleTooLong ? "#b91c1c" : "#64748b" }}>
          {titleCount}/80
        </small>
      </div>

      {/* Descripción */}
      <label style={{ display: "block", fontSize: 12, color: "#475569", marginBottom: 4 }}>Descripción</label>
      <textarea
        value={values.description}
        onChange={onChange("description")}
        placeholder="Detalles de la tarea…"
        rows={3}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #94a3b8",
          marginBottom: 8,
          resize: "vertical",
        }}
      />

      {/* Responsable */}
      <label style={{ display: "block", fontSize: 12, color: "#475569", marginBottom: 4 }}>
        Responsable (UID / nombre corto)
      </label>
      <input
        value={values.assigneeUid}
        onChange={onChange("assigneeUid")}
        placeholder="uid_gerard (opcional)"
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #94a3b8",
          marginBottom: 8,
        }}
      />

      {/* Fecha */}
      <label style={{ display: "block", fontSize: 12, color: "#475569", marginBottom: 4 }}>
        Fecha de vencimiento
      </label>
      <input
        type="date"
        value={values.dueDate}
        onChange={onChange("dueDate")}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: `1px solid ${errors.dueDate ? "#ef4444" : "#94a3b8"}`,
          marginBottom: 4,
        }}
      />
      <small style={{ display: "block", color: errors.dueDate ? "#b91c1c" : "#64748b", marginBottom: 8 }}>
        {errors.dueDate ?? "Opcional, no puede ser pasada."}
      </small>

      {/* Columna */}
      <label style={{ display: "block", fontSize: 12, color: "#475569", marginBottom: 4 }}>
        Columna
      </label>
      <select
        value={values.listId}
        onChange={onChange("listId")}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #94a3b8",
          marginBottom: 10,
          background: "white",
        }}
      >
        {STATUSES.map((st) => (
          <option key={st} value={st}>
            {LABEL[st]}
          </option>
        ))}
      </select>

      {/* Botones */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #94a3b8",
            background: "#f8fafc",
            cursor: "pointer",
          }}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: saving ? "#86c57a" : "#5aac44",
            color: "white",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear tarjeta"}
        </button>
      </div>
    </form>
  );
}
