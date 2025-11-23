import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDPVkcJ1jU3sSspDv2y4mfjevK0f16ahI",
  authDomain: "login-tutor-960af.firebaseapp.com",
  projectId: "login-tutor-960af",
  storageBucket: "login-tutor-960af.appspot.com",
  messagingSenderId: "537119981746",
  appId: "1:537119981746:web:d36d0f5ae9831bc7e509ab",
  measurementId: "G-ZF4HSQ76RQ",
  databaseURL: "https://login-tutor-960af-default-rtdb.firebaseio.com/",
};

// Gunakan inisialisasi tunggal agar instance Firebase tidak dobel di lingkungan Next.js
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const realtimeDb = getDatabase(app);
const firestoreDb = getFirestore(app);

export { realtimeDb, firestoreDb };
