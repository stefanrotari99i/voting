// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBk9Rbzm9jIVur1iepYwxMIef4_mFhFko",
  authDomain: "eramus-831b8.firebaseapp.com",
  projectId: "eramus-831b8",
  storageBucket: "eramus-831b8.appspot.com",
  messagingSenderId: "818928050283",
  appId: "1:818928050283:web:fbc03503d1d03f3435512e",
  measurementId: "G-MT5B082RXS"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);