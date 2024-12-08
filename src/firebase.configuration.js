// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection , where, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCenPT8WKaayBQhi3H6nmlWOuMAToL_Hiw",
  authDomain: "busy-buy-68a75.firebaseapp.com",
  projectId: "busy-buy-68a75",
  storageBucket: "busy-buy-68a75.firebasestorage.app",
  messagingSenderId: "1058359949615",
  appId: "1:1058359949615:web:8451a2b239f53d636409da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//getting db;
const db = getFirestore(app);

export  {db ,getDocs,where,collection};