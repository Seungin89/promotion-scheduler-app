import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCi0hqTaazEoGU4evp5Zioxsck-V9M8CZU",
  authDomain: "promotion-scheduler-app.firebaseapp.com",
  projectId: "promotion-scheduler-app",
  storageBucket: "promotion-scheduler-app.firebasestorage.app",
  messagingSenderId: "798654151030",
  appId: "1:798654151030:web:2213fb502a793a9cf26257",
  measurementId: "G-72WN28FTM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
