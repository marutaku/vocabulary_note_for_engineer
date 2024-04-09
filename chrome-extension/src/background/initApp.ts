import { UserCredential } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { getAuth, setPersistence, indexedDBLocalPersistence, signInWithCredential, GoogleAuthProvider } from "firebase/auth/web-extension";
import { firebaseAuth } from "./auth";
import { initializeFirebase } from "../firebase";

type MessageType = { type: string }


export async function initApp() {
  initializeFirebase()
  const auth = getAuth();

  await setPersistence(auth, indexedDBLocalPersistence)
  auth.onAuthStateChanged(async function (user) {
    if (!user) {
      const result = (await firebaseAuth()) as UserCredential
      const credential = GoogleAuthProvider.credentialFromResult(result)
      debugger
      if (!credential) throw new Error('credential is null')
      await signInWithCredential(auth, credential)
    }
    console.log(user)
    chrome.runtime.onMessage.addListener(function onReceiveAuthStateRequest(message: MessageType, _sender, _sendResponse) {
      if (message.type == 'signin-state') {
        if (user) {
          _sendResponse({ type: 'signin-state', user });
        } else {
          _sendResponse({ type: 'signin-state' });
        }
      }
    })
  })
}