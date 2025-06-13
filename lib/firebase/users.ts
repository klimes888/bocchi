import { db } from "../firebase";
import {
  setDoc,
  Timestamp,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";

export async function createUsers(id: string) {
  try {
    await setDoc(doc(db, "users", id), {
      id,
      at: Timestamp.now(),
    });
    return id;
  } catch (error) {
    console.error("Error users:", error);
    throw error;
  }
}

export async function fetchUserDocument(id: string) {
  // 1. 유저 정보 가져오기
  const userRef = doc(db, "users", id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User does not exist");
  }

  const userData = userSnap.data();

  // 2. 해당 유저의 투표 정보 가져오기 (votes 컬렉션에서 uid로 조회)
  const voteQuery = query(collection(db, "votes"), where("uid", "==", id));
  const voteSnap = await getDocs(voteQuery);

  const voteData = voteSnap.docs.map((doc) => doc.data());

  return {
    user: userData,
    votes: voteData,
  };
}

export async function getVoteCounts() {
  const counts: Record<number, number> = {};

  for (let i = 1; i <= 4; i++) {
    const q = query(collection(db, "votes"), where("vote", "==", i.toString()));
    const snapshot = await getCountFromServer(q); // 서버에서 정확한 카운트
    counts[i] = snapshot.data().count;
  }

  return counts;
}
