import { initializeApp, getApp, getApps } from "firebase/app";
import { UserCredential } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential, getAuth, indexedDBLocalPersistence, setPersistence } from "firebase/auth/web-extension";


export function initializeFirebase() {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
  if (getApps().length == 0) {
    initializeApp(firebaseConfig);
  }
  return getApp()
}

export const loginWithGoogleLoginCredential = async (userCredential: UserCredential) => {
  const auth = getAuth()
  await setPersistence(auth, indexedDBLocalPersistence)
  const credential = GoogleAuthProvider.credentialFromResult(userCredential)
  if (!credential) {
    throw new Error('No credential')
  }
  const user = await signInWithCredential(auth, credential)
  return user
}