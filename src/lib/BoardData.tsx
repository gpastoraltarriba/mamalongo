// src/lib/boardData.ts
import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  serverTimestamp, onSnapshot, getDoc, writeBatch, query, where, getDocs
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type ListId = "todo" | "doing" | "done";

export type Card = {
  id: string;
  boardId: string;
  listId: ListId;         
  title: string;
  description?: string;
  dueDate?: string | null;
  order?: number;         
  createdAt?: any;
  updatedAt?: any;
};

export const STATUSES: ListId[] = ["todo", "doing", "done"];
export const LABEL: Record<ListId, string> = {
  todo: "Por hacer",
  doing: "En curso",
  done: "Finalizado",
};

export async function ensureBoard(boardId: string) {
  const ref = doc(db, "boards", boardId);
  const snap = await getDoc(ref);
  if (!snap.exists()) await setDoc(ref, { createdAt: serverTimestamp() });
}


export function listenCards(boardId: string, cb: (cards: Card[]) => void) {
  const ref = collection(db, "boards", boardId, "cards");
  return onSnapshot(ref, (ss) => {
    const list: Card[] = ss.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    const rank: Record<ListId, number> = { todo: 0, doing: 1, done: 2 };
    list.sort((a, b) => {
      const ra = rank[a.listId], rb = rank[b.listId];
      if (ra !== rb) return ra - rb;
      const oa = a.order ?? Number.MAX_SAFE_INTEGER;
      const ob = b.order ?? Number.MAX_SAFE_INTEGER;
      if (oa !== ob) return oa - ob;

      const da = a.dueDate ?? "9999-12-31";
      const dbb = b.dueDate ?? "9999-12-31";
      return da.localeCompare(dbb);
    });
    cb(list);
  });
}


export async function addCard(
  boardId: string,
  data: { title: string; listId: ListId; description?: string; dueDate?: string | null }
) {
  const ref = collection(db, "boards", boardId, "cards");
  const nowOrder = Date.now();
  await addDoc(ref, {
    boardId,
    listId: data.listId,
    title: data.title,
    description: data.description ?? "",
    dueDate: data.dueDate ?? null,
    order: nowOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCard(
  boardId: string,
  id: string,
  data: Partial<Pick<Card, "title" | "description" | "listId" | "dueDate">>
) {
  await updateDoc(doc(db, "boards", boardId, "cards", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function removeCard(boardId: string, id: string) {
  await deleteDoc(doc(db, "boards", boardId, "cards", id));
}


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
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}


export async function normalizeOrders(boardId: string) {
  for (const listId of STATUSES) {
    const qRef = query(collection(db, "boards", boardId, "cards"), where("listId", "==", listId));
    const snap = await getDocs(qRef);
    const ids = snap.docs.map((d) => d.id);
    await saveColumnOrderForStatus(boardId, listId, ids);
  }
}
