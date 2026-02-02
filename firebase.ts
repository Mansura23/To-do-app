
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCataMTZ34AFhCaYMa2iG3iglSYwrQMGtI",
  authDomain: "lumina-5e921.firebaseapp.com",
  projectId: "lumina-5e921",
  storageBucket: "lumina-5e921.firebasestorage.app",
  messagingSenderId: "203883180771",
  appId: "1:203883180771:web:e586f672c2bf7a768b8bd6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
