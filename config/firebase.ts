// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM9OQhsbQF5zN-OJ07nwL5zgL5Nj7nLlU",
  authDomain: "chat-96f7c.firebaseapp.com",
  projectId: "chat-96f7c",
  storageBucket: "chat-96f7c.appspot.com",
  messagingSenderId: "970604130544",
  appId: "1:970604130544:web:59e71b4febc34a8ab39235",
  measurementId: "G-2BEM5EECR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)