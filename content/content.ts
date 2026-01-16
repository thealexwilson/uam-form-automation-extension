import { fillForm, fillEditForm } from '../src/formAccessor';

console.log('[UAM Form Filler] Content script loaded');

function getPageType(): 'create' | 'edit' | 'unknown' {
  const url = window.location.href;
  if (url.includes('/uam/edit/')) {
    return 'edit';
  } else if (url.includes('/uam/') && document.querySelector('#create-modal')) {
    return 'create';
  }
  return 'unknown';
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[UAM Form Filler] Received message:', message);

  if (message.action === 'fillForm') {
    const pageType = getPageType();
    let result;
    
    if (pageType === 'edit') {
      result = fillEditForm(message.formData);
    } else {
      result = fillForm(message.formData);
    }
    
    sendResponse(result);
    return true;
  }

  if (message.action === 'checkForm') {
    const pageType = getPageType();
    const modal = document.querySelector('#create-modal');
    const isEditPage = pageType === 'edit';
    
    sendResponse({ 
      available: !!modal || isEditPage,
      pageType: pageType
    });
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
