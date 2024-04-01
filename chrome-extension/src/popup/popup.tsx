import { useRef } from 'react';

const _URL = 'https://example.com/signInWithPopupExample';

chrome.runtime.onMessage.addListener(function handleChromeMessages(message, sender, sendResponse) {
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
    } catch (e: unknown) {
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

  return true;
});

export const Popup = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  if (iframeRef.current !== null) {
    iframeRef.current.contentWindow?.postMessage('signInWithPopup', new URL(_URL).origin);
  }
  return (
    <div>
      <h1>Popup</h1>
      <iframe ref={iframeRef} src={_URL} />
    </div>
  );
};

export default Popup;
