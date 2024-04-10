// Import the functions you need from the SDKs you need
import { getAuth, setPersistence, indexedDBLocalPersistence } from "firebase/auth/web-extension";
import { firebaseAuth } from "./auth";
import { initializeFirebase, loginWithGoogleLoginCredential } from "../firebase";

type MessageType = { type: string }


export async function initApp() {
  initializeFirebase()
  const auth = getAuth();

  await setPersistence(auth, indexedDBLocalPersistence)
  auth.onAuthStateChanged(async function (user) {
    if (!user) {
      const result = await firebaseAuth()
      await loginWithGoogleLoginCredential(result)
    }
    chrome.runtime.onMessage.addListener(function onReceiveAuthStateRequest(message: MessageType, _sender, _sendResponse) {
      if (message.type == 'signin-state') {
        if (user) {
          _sendResponse({ type: 'signin-state', user });
        } else {
          _sendResponse({ type: 'signin-state' });
        }
      }
      if (message.type === 'logout') {
        auth.signOut()
      }
    })
  })
}