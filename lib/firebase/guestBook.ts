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

export async function getGuestBookList(take: number = 10) {
  try {
    const start = startAfter(lastVisible);
    console.log("start -->", start);
    const baseQuery = query(
      collection(db, "guestbook"),
      orderBy("at", "desc"), // 최신순
      ...(lastVisible ? [start] : []),
      limit(take)
    );

    const snap = await getDocs(baseQuery);
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // 다음 페이지를 위한 기준점 저장
    lastVisible = snap.docs[snap.docs.length - 1] ?? null;

    return { data, lastVisible };
  } catch (error) {
    console.error("Error getting guestbook list:", error);
    throw error;
  }
}
