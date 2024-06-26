const _URL = 'https://vocabulary-note-for-engineer.web.app/authSite/index.html';
const iframe = document.createElement('iframe');
iframe.src = _URL;
document.documentElement.appendChild(iframe);
chrome.runtime.onMessage.addListener(handleChromeMessages);
console.log("offscreen.ts");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleChromeMessages(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
  // Extensions may have an number of other reasons to send messages, so you
  // should filter out any that are not meant for the offscreen document.
  if (message.target !== 'offscreen') {
    return false;
  }

  function handleIframeMessage({ data }: { data: string }) {
    try {
      if (data.startsWith('!_{')) {
        // Other parts of the Firebase library send messages using postMessage.
        // You don't care about them in this context, so return early.
        return;
      }
      data = JSON.parse(data);
      self.removeEventListener('message', handleIframeMessage);

      sendResponse(data);
    } catch (e) {
      if (!(e instanceof Error)) {
        return;
      }
      console.log(`json parse failed - ${e.message}`);
    }
  }

  globalThis.addEventListener('message', handleIframeMessage, false);

  // Initialize the authentication flow in the iframed document. You must set the
  // second argument (targetOrigin) of the message in order for it to be successfully
  // delivered.
  iframe.contentWindow?.postMessage({ "initAuth": true }, new URL(_URL).origin);
  return true;
}

export { }