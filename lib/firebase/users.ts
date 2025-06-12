import { db } from "../firebase";
import { setDoc, Timestamp, doc, getDoc } from "firebase/firestore";

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
  const userRef = doc(db, "users", id);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw Error("Not exsit user");
  }
}
