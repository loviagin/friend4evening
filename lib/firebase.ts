import { initializeApp } from "firebase/app";
import { Analytics } from "firebase/analytics";
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
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics only on client side
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {
      // Analytics initialization failed, keep analytics as null
    });
  }).catch(() => {
    // Analytics module not available, keep analytics as null
  });
}

export { app, db, auth, analytics };