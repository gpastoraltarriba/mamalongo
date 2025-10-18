// src/lib/boardData.ts
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  getDoc,
  writeBatch,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type ListId = "todo" | "doing" | "done";

export interface Card {
  id: string;
  boardId: string;            
  listId: ListId;
  title: string;
  description?: string;
  assigneeUid?: string;
  dueDate?: string | null;
  order?: number | null;
  createdAt?: number;
  updatedAt?: number;
}

export const STATUSES: ListId[] = ["todo", "doing", "done"];
export const LABEL: Record<ListId, string> = {
  todo: "Por hacer",
  doing: "En curso",
  done: "Finalizado",
};

/** Crea el doc del board si no existe (útil para primeras veces) */
export async function ensureBoard(boardId: string) {
  const ref = doc(db, "boards", boardId);
  const snap = await getDoc(ref);
  if (!snap.exists()) await setDoc(ref, { createdAt: serverTimestamp() });
}

/** Escucha TODAS las tarjetas del tablero (subcolección) ordenadas por createdAt desc */
export function listenCards(boardId: string, setCards: (rows: Card[]) => void) {
  const qRef = query(
    collection(db, "boards", boardId, "cards"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(qRef, (snap) => {
    const rows: Card[] = snap.docs.map((d) => {
      const data = d.data() as Omit<Card, "id" | "boardId"> & Partial<Card>;
      return { id: d.id, boardId, ...data };
    });
    setCards(rows);
  });
}
/** Crear tarjeta en el tablero */
export async function addCard(
  boardId: string,
  data: { title: string; listId: ListId; description?: string; dueDate?: string | null; assigneeUid?: string }
) {
  const ref = collection(db, "boards", boardId, "cards");
  const now = Date.now();
  await addDoc(ref, {
    // ¡sin boardId!
    listId: data.listId,
    title: data.title.trim(),
    description: data.description?.trim() ?? "",
    assigneeUid: data.assigneeUid?.trim() ?? "",
    dueDate: data.dueDate ?? null,
    order: now,
    createdAt: now,
    updatedAt: now,
  });
}
/** Actualizar tarjeta */
export async function updateCard(
  boardId: string,
  id: string,
  data: Partial<Pick<Card, "title" | "description" | "listId" | "dueDate" | "assigneeUid">>
) {
  await updateDoc(doc(db, "boards", boardId, "cards", id), {
    ...(data.title !== undefined ? { title: data.title.trim() } : {}),
    ...(data.description !== undefined ? { description: data.description.trim() } : {}),
    ...(data.assigneeUid !== undefined ? { assigneeUid: data.assigneeUid.trim() } : {}),
    ...(data.listId !== undefined ? { listId: data.listId } : {}),
    ...(data.dueDate !== undefined ? { dueDate: data.dueDate ?? null } : {}),
    updatedAt: Date.now(),
  });
}

/** Borrar tarjeta */
export async function removeCard(boardId: string, id: string) {
  await deleteDoc(doc(db, "boards", boardId, "cards", id));
}

/** Guardar orden de una columna */
export async function saveColumnOrderForStatus(
  boardId: string,
  listId: ListId,
  orderedIds: string[]
) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "boards", boardId, "cards", id), {
      listId,
      order: index,
      updatedAt: Date.now(),
    });
  });
  await batch.commit();
}

/** Normaliza 'order' dentro de cada columna a 0..n-1 (útil tras migraciones) */
export async function normalizeOrders(boardId: string) {
  for (const listId of STATUSES) {
    const qRef = query(
      collection(db, "boards", boardId, "cards"),
      where("listId", "==", listId),
      orderBy("order", "asc")
    );
    const snap = await getDocs(qRef);
    const ids = snap.docs.map((d) => d.id);
    await saveColumnOrderForStatus(boardId, listId, ids);
  }
}
