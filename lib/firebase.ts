// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const {
  NEXT_PUBLIC_API_KEY,
  NEXT_PUBLIC_FB_DOMAIN,
  NEXT_PUBLIC_PROJECT_ID,
  NEXT_PUBLIC_FB_BUCKET,
  NEXT_PUBLIC_SENDER_ID,
  NEXT_PUBLIC_APP_ID,
  NEXT_PUBLIC_MEASUREMENT,
} = process.env;

const firebaseConfig = {
  apiKey: NEXT_PUBLIC_API_KEY,
  authDomain: NEXT_PUBLIC_FB_DOMAIN,
  projectId: NEXT_PUBLIC_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_FB_BUCKET,
  messagingSenderId: NEXT_PUBLIC_SENDER_ID,
  appId: NEXT_PUBLIC_APP_ID,
  measurementId: NEXT_PUBLIC_MEASUREMENT,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
