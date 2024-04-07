const OFFSCREEN_DOCUMENT_PATH = '/offscreen/offscreen.html';

// Chrome only allows for a single offscreenDocument. This is a helper function
// that returns a boolean indicating if a document is already active.
async function hasDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const matchedClients = await clients.matchAll();
  return matchedClients.some(
    (c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)
  );
}

async function setupOffscreenDocument(path: string) {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  let creating: null | Promise<void> = null;
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) {
    return;
  }
  // create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: [chrome.offscreen.Reason.DOM_SCRAPING, chrome.offscreen.Reason.IFRAME_SCRIPTING, chrome.offscreen.Reason.DOM_PARSER],
      justification: 'reason for needing the document',
    });
    await creating;
    creating = null;
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

async function getAuth() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      target: 'offscreen',
      message: "initAuth"
    }, (response) => {
      console.log(`response: ${response}`)
      if (response && response.name === 'FirebaseError') {
        reject(response);
      }
      resolve(response);
    })
  })
}

export async function firebaseAuth() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
  const auth = await getAuth()
    .then((auth) => {
      console.log('User Authenticated', auth);
      return auth;
    })
    .catch(err => {
      if (err.code === 'auth/operation-not-allowed') {
        console.error('You must enable an OAuth provider in the Firebase' +
          ' console in order to use signInWithPopup. This sample' +
          ' uses Google by default.');
      } else {
        console.error(err);
        return err;
      }
    })
    .finally(closeOffscreenDocument)

  return auth;
}
