import { fillForm } from '../src/formAccessor';

console.log('[UAM Form Filler] Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[UAM Form Filler] Received message:', message);

  if (message.action === 'fillForm') {
    const result = fillForm(message.formData);
    sendResponse(result);
    return true;
  }

  if (message.action === 'checkForm') {
    const modal = document.querySelector('#create-modal');
    sendResponse({ available: !!modal });
    return true;
  }

  return false;
});

const observer = new MutationObserver((mutations) => {
  const modal = document.querySelector('#create-modal');
  if (modal) {
    console.log('[UAM Form Filler] CreateModal detected');
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
