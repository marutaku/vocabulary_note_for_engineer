// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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


function initializeFirebase() {
  const firebaseConfig = {
    apiKey: import.meta.env.FIREBASE_API_KEY,
    authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.FIREBASE_APP_ID,
    measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID
  };

  initializeApp(firebaseConfig);
}


export function initApp() {
  initializeFirebase()
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