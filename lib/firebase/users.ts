// lib/vote.ts
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function users({ id }: { id: string }) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      id,
      at: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error users:", error);
    throw error;
  }
}
