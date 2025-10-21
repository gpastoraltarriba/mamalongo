// src/lib/boardData.ts
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import {
  getFirestore,
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
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";

const app =
  getApps()[0] ??
  initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });

export const auth = getAuth(app);
export const db = getFirestore(app);

export async function loginWithGoogleRedirect() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithRedirect(auth, provider);
}

export async function handleRedirectResult(): Promise<UserCredential | null> {
  try {
    const res = await getRedirectResult(auth);
    return res ?? null;
  } catch {
    return null;
  }
}

export function observeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function logout() {
  await signOut(auth);
}

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

const cardConverter: FirestoreDataConverter<Omit<Card, "id" | "boardId">> = {
  toFirestore(data) {
    return data;
  },
  fromFirestore(snap: QueryDocumentSnapshot, options: SnapshotOptions) {
    return snap.data(options) as Omit<Card, "id" | "boardId">;
  },
};

export async function ensureBoard(boardId: string) {
  const ref = doc(db, "boards", boardId);
  const snap = await getDoc(ref);
  if (!snap.exists()) await setDoc(ref, { createdAt: serverTimestamp() });
}

export function listenCards(boardId: string, setCards: (rows: Card[]) => void) {
  const qRef = query(
    collection(db, "boards", boardId, "cards").withConverter(cardConverter),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(qRef, (snap) => {
    const rows: Card[] = snap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, boardId, ...data };
    });
    setCards(rows);
  });
}

export type CardInput = {
  title: string;
  description?: string;
  assigneeUid?: string;
  dueDate?: string | null;
  listId: ListId;
};

function normalizeCreate(data: Partial<CardInput>) {
  const now = Date.now();
  return {
    listId: data.listId!,
    title: (data.title ?? "").trim(),
    description: (data.description ?? "").trim(),
    assigneeUid: (data.assigneeUid ?? "").trim(),
    dueDate: data.dueDate ? String(data.dueDate) : "",
    createdAt: now,
    updatedAt: now,
    order: null as number | null,
  };
}

function normalizeUpdate(patch: Partial<CardInput>) {
  const out: Record<string, any> = { updatedAt: Date.now() };
  if (patch.title !== undefined) out.title = String(patch.title).trim();
  if (patch.description !== undefined) out.description = String(patch.description).trim();
  if (patch.assigneeUid !== undefined) out.assigneeUid = String(patch.assigneeUid).trim();
  if (patch.listId !== undefined) out.listId = patch.listId;
  if (patch.dueDate !== undefined) out.dueDate = patch.dueDate ? String(patch.dueDate) : "";
  return out;
}

export async function addCard(boardId: string, data: Partial<CardInput>) {
  const payload = normalizeCreate(data);
  if (!payload.title) throw new Error("El título es obligatorio");
  if (payload.title.length > 80) throw new Error("El título no puede superar 80 caracteres");
  await addDoc(collection(db, "boards", boardId, "cards"), payload);
}

export async function updateCard(boardId: string, id: string, data: Partial<CardInput>) {
  await updateDoc(doc(db, "boards", boardId, "cards", id), normalizeUpdate(data));
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
      updatedAt: Date.now(),
    });
  });
  await batch.commit();
}

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
