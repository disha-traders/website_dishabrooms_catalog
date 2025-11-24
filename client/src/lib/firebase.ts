import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyDaV8pmNjT5efHIHN_u958XoTkrzMFzYec",
  authDomain: "disha-traders-catalog.firebaseapp.com",
  projectId: "disha-traders-catalog",
  storageBucket: "disha-traders-catalog.firebasestorage.app",
  messagingSenderId: "383575804332",
  appId: "1:383575804332:web:908ea6a501e3f63d4c5209",
  measurementId: "G-L059V2L73T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
