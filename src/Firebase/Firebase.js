// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKiPq_3HjsvA_9663UZWbVId8jnFhmLRk",
  authDomain: "klik-6deec.firebaseapp.com",
  projectId: "klik-6deec",
  storageBucket: "klik-6deec.appspot.com",
  messagingSenderId: "473736659469",
  appId: "1:473736659469:web:e5ee22240ac6e572d74b44",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase();
