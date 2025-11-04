import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3TCacDrQnGVU6UGiSCse350aWou48f04",
  authDomain: "friend4evening.firebaseapp.com",
  projectId: "friend4evening",
  storageBucket: "friend4evening.firebasestorage.app",
  messagingSenderId: "553882980151",
  appId: "1:553882980151:web:b04b90cd76fe5aa54854b2",
  measurementId: "G-L0HN0E4YG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, analytics };