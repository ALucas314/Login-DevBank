import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8ai2B1CVgl3tDvNzpnLqnMLST0mmMGzk",
  authDomain: "react-auth-a283c.firebaseapp.com",
  projectId: "react-auth-a283c",
  storageBucket: "react-auth-a283c.appspot.com",
  messagingSenderId: "661608556172",
  appId: "1:661608556172:web:2e34b677ce33ab6cce7da9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
