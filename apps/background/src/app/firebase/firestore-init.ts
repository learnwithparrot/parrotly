// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  NX_FIREBASE_API_KEY, NX_FIREBASE_AUTH_DOMAIN,
  NX_FIREBASE_PROJECT_ID, NX_FIREBASE_STORAGE_BUCKET,
  NX_FIREBASE_MESSAGING_SENDER_ID, NX_FIREBASE_APP_ID,
  NX_FIREBASE_MEASUREMENT_ID,
} from '@parrotly.io/env'

const firebaseConfig = {
  apiKey: NX_FIREBASE_API_KEY, authDomain: NX_FIREBASE_AUTH_DOMAIN,
  projectId: NX_FIREBASE_PROJECT_ID, storageBucket: NX_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: NX_FIREBASE_MESSAGING_SENDER_ID, appId: NX_FIREBASE_APP_ID,
  measurementId: NX_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

