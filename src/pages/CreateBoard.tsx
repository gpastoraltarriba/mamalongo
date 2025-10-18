 src/pages/CreateBoard.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";


 import { db } from "../services/firebase";
 import { doc, setDoc, serverTimestamp } from "firebase/firestore";
 import { useAuth } from "../services/AuthContext";

export default function CreateBoard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const run = async () => {
      const id = nanoid(12);

      
       try {
         await setDoc(doc(db, "boards", id), {
           ownerUid: user?.uid ?? null,
           createdAt: serverTimestamp(),
           title: "Nuevo tablero",
           columns: [],
         });
       } catch (e) {
      
       }

      navigate(`/tablero/${id}`, { replace: true });
    };
    run();
  }, [navigate]);

  return null; // No renderiza nada, no altera la UI
}
