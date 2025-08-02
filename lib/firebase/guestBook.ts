// lib/vote.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  deleteDoc,
} from "firebase/firestore";

export async function guestBook({
  message,
  username,
  uid,
  key,
}: {
  message: string;
  username: string;
  uid: string;
  key: number | null;
}) {
  try {
    await addDoc(collection(db, "guestbook"), {
      key,
      message,
      username,
      uid,
      at: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error entry guestbook:", error);
    throw error;
  }
}

let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;

export async function getGuestBookList(
  take: number = 10,
  userId: string | null
) {
  try {
    const start = startAfter(lastVisible);
    const baseQuery = query(
      collection(db, "guestbook"),
      orderBy("at", "desc"), // 최신순
      ...(lastVisible ? [start] : []),
      limit(take)
    );

    const snap = await getDocs(baseQuery);
    const data = snap.docs.map((doc) => {
      const content = doc.data();
      return {
        ...content,
        id: doc.id,
        isMe: content.uid === userId,
      };
    });

    // 다음 페이지를 위한 기준점 저장
    lastVisible = snap.docs[snap.docs.length - 1] ?? null;

    return { data, islast: !!!lastVisible };
  } catch (error) {
    console.error("Error getting guestbook list:", error);
    throw error;
  }
}

export async function removeGuestBook(id: string) {
  try {
    const docRef = doc(db, "guestbook", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error: ", error);
  }
}
