// lib/vote.ts
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function submitVote({ name, id }: { name: string; id: string }) {
  try {
    const docRef = await addDoc(collection(db, "votes"), {
      name,
      id,
      at: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting vote:", error);
    throw error;
  }
}
