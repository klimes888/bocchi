// lib/vote.ts
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function guestBook({
  message,
  id,
  img,
}: {
  message: string;
  id: string;
  img: number;
}) {
  try {
    const docRef = await addDoc(collection(db, "guestbook"), {
      img,
      message,
      id,
      at: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error entry guestbook:", error);
    throw error;
  }
}
