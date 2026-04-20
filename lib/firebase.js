import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpQlKOPijswESoBH79n0Xj726UKzDK1Yc",
  authDomain: "ai-mock-interview-4102f.firebaseapp.com",
  projectId: "ai-mock-interview-4102f",
  storageBucket: "ai-mock-interview-4102f.appspot.com",
  messagingSenderId: "678500607029",
  appId: "1:678500607029:web:5d5d93f5bfd73e9d923d7c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();