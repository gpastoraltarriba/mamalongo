import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type CardStatus = "todo" | "doing" | "done";

export type Card = {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  createdAt?: any; // Firestore Timestamp
};

const cardsCol = (boardId: string) => collection(db, "boards", boardId, "cards");

/** Suscripción en tiempo real a TODAS las tarjetas del tablero */
export function subscribeCards(
  boardId: string,
  handler: (cards: Card[]) => void
) {
  const q = query(cardsCol(boardId), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const list: Card[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Card, "id">) }));
    handler(list);
  });
}

/** Crear tarjeta */
export async function addCard(boardId: string, title: string, status: CardStatus = "todo") {
  if (!title.trim()) return;
  await addDoc(cardsCol(boardId), {
    title: title.trim(),
    status,
    createdAt: serverTimestamp(),
  });
}

/** Mover tarjeta a otro estado */
export async function moveCard(boardId: string, cardId: string, status: CardStatus) {
  await updateDoc(doc(db, "boards", boardId, "cards", cardId), { status });
}


