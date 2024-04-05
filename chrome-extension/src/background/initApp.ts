// Import the functions you need from the SDKs you need
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "./auth";
import { initializeFirebase } from "../firebase";

type MessageType = { type: string }


function onSigninRequest(message: MessageType, _sender: chrome.runtime.MessageSender, _sendResponse: () => void) {
  const auth = getAuth();
  if (message.type == 'signin') {
    // ポップアップによるGoogle認証
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).catch(() => {
      console.log('サインインに失敗');
    })
    _sendResponse()
  } else if (message.type == 'signout') {
    if (auth.currentUser) {
      auth.signOut();
    }
    _sendResponse()
  }
}



export async function initApp() {
  initializeFirebase()
  await firebaseAuth()
  const auth = getAuth();


  auth.onAuthStateChanged(function (user) {
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
  chrome.runtime.onMessage.addListener(onSigninRequest)
}