// lib/vote.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";

export async function submitVote({ uid, vote }: { uid: string; vote: string }) {
  // 1. 중복 투표 방지
  const voteQuery = query(collection(db, "votes"), where("uid", "==", uid));
  const existingVotes = await getDocs(voteQuery);

  if (!existingVotes.empty) {
    throw new Error("Already voted");
  }

  // 2. 투표 저장
  await setDoc(doc(db, "votes", uid), {
    uid,
    vote,
    at: Timestamp.now(),
  });

  return true;
}

export async function getVotedInfo({ uid }: { uid: string }) {
  // 특정 유저의 투표 정보 조회

  try {
    const votesQuery = query(collection(db, "votes"), where("uid", "==", uid));
    const snapshot = await getDocs(votesQuery);
    if (snapshot.empty) return false;
    snapshot.forEach((doc) => console.log(doc.data()));
  } catch (error) {
    console.error("error", error);
  }

  // 특정 캐릭터에게 투표한 사람 목록
  //   const votesForChar = query(
  //     collection(db, "votes"),
  //     where("votedFor", "==", "character1")
  //   );
}
