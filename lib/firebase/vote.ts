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

export enum VOTE_ERROR_CODE {
  NONE,
  SUCCESS,
  VOTE_ALREADY,
  SOMETHING_WRONG,
}

export async function submitVote({ uid, vote }: { uid: string; vote: string }) {
  // 1. 중복 투표 방지
  const voteQuery = query(collection(db, "votes"), where("uid", "==", uid));
  const existingVotes = await getDocs(voteQuery);

  if (!existingVotes.empty) {
    return { code: VOTE_ERROR_CODE.VOTE_ALREADY, data: null };
  }

  // 2. 투표 저장
  await setDoc(doc(db, "votes", uid), {
    uid,
    vote,
    at: Timestamp.now(),
  });

  return { code: VOTE_ERROR_CODE.SUCCESS, data: true };
}

export async function getVotedInfo({ uid }: { uid: string }) {
  // 특정 유저의 투표 정보 조회

  try {
    const votesQuery = query(collection(db, "votes"), where("uid", "==", uid));
    const snapshot = await getDocs(votesQuery);
    if (snapshot.empty) return false;
    snapshot.forEach((doc) => console.log(doc.data()));
    return { code: VOTE_ERROR_CODE.SUCCESS, data: null };
  } catch (error) {
    return { code: VOTE_ERROR_CODE.SOMETHING_WRONG, data: null };
  }
}
