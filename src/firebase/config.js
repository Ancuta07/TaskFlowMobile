/* import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
*/

// src/firebase/config.js - PENTRU EXPO
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUD0AAyI_Wm7dI7ewL_XwSlk7r0Dkmf_E",
  authDomain: "taskflow-dcbf6.firebaseapp.com",
  projectId: "taskflow-dcbf6",
  storageBucket: "taskflow-dcbf6.firebasestorage.app",
  messagingSenderId: "839384376302",
  appId: "1:839384376302:web:da02de6ceb2f51103664ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth cu AsyncStorage pentru React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;