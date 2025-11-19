import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPt3fdES0hRN8Qmt-4naWavpK-p2QW3Xc",
  authDomain: "mobilehousewebsite.firebaseapp.com",
  databaseURL: "https://mobilehousewebsite-default-rtdb.firebaseio.com",
  projectId: "mobilehousewebsite",
  storageBucket: "mobilehousewebsite.firebasestorage.app",
  messagingSenderId: "27265006915",
  appId: "1:27265006915:web:e3c6adb5a9ea20d832c3f6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
