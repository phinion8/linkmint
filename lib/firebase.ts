import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2KXTg3-gEMeY-m7CElOQGaJsVvrFjCqI",
  authDomain: "linkmint-94cab.firebaseapp.com",
  projectId: "linkmint-94cab",
  storageBucket: "linkmint-94cab.firebasestorage.app",
  messagingSenderId: "787706720088",
  appId: "1:787706720088:web:2343d2ed70e8018f963f2d",
  measurementId: "G-03D2SNGCZ4",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, googleProvider, signInWithPopup };
