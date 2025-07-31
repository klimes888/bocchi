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

export enum USER_ERROR_CODE {
  NONE = "0",
  SUCCESS = "1",
  USER_ALREADY = "2",
  USER_NOT_EXSIST = "3",
  USER_INFO_INCORRECT = "4",
}

export async function createUsers(id: string, pw: string) {
  try {
    const userGet = doc(db, "users", id);
    const existingUser = await getDoc(userGet);

    if (existingUser.exists()) {
      return { code: USER_ERROR_CODE.USER_ALREADY, data: null }; //
    }

    const userRef = doc(db, "users", id);

    await setDoc(userRef, {
      id,
      at: Timestamp.now(),
      name: "",
      img: "",
      pw,
    });

    return { code: USER_ERROR_CODE.SUCCESS, data: { id } };
  } catch (error) {
    console.error("Error users:", error);
    throw error;
  }
}

export async function getUsers(id: string, pw: string) {
  try {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { code: USER_ERROR_CODE.USER_NOT_EXSIST, data: null }; //
    }

    const userData = userSnap.data();

    if (userData.pw !== pw) {
      return { code: USER_ERROR_CODE.USER_INFO_INCORRECT, data: null }; //
    }

    return { code: USER_ERROR_CODE.SUCCESS, data: userData };
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
