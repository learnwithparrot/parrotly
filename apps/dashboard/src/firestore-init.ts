import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "%NX_FIREBASE_API_KEY%",
  authDomain: "%NX_FIREBASE_AUTH_DOMAIN%",
  projectId: "%NX_FIREBASE_PROJECT_ID%",
  storageBucket: "%NX_FIREBASE_STORAGE_BUCKET%",
  messagingSenderId: "%NX_FIREBASE_MESSAGING_SENDER_ID%",
  appId: "%NX_FIREBASE_APP_ID%",
  measurementId:" %NX_FIREBASE_MEASUREMENT_ID%"
};

export const initFirebase = () => {
  const app = initializeApp(firebaseConfig);
}
