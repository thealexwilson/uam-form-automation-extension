const getCurrentDateTimeString = (): string => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '-');
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  return `${dateStr} ${timeStr}`;
};

const getCurrentDateString = (): string => {
  const now = new Date();
  // Add 7 days (1 week) to the current date
  const oneWeekFromNow = new Date(now);
  oneWeekFromNow.setDate(now.getDate() + 7);
  
  const year = oneWeekFromNow.getFullYear();
  const month = String(oneWeekFromNow.getMonth() + 1).padStart(2, '0');
  const day = String(oneWeekFromNow.getDate()).padStart(2, '0');
  // Return in MM/DD/YYYY format
  return `${month}/${day}/${year}`;
};

const getCurrentTimeString = (): string => {
  // Default to noon (12:00) when time field is empty
  return '12:00';
};

const REDDIT_CAMPAIGN_FORM_DATA = {
  campaignUpsert: 'new' as const,
  campaignName: `Test Reddit Campaign ${getCurrentDateTimeString()}`,
  adgroupName: `Test Reddit Adgroup ${getCurrentDateTimeString()}`,
  adName: `Test Reddit Ad ${getCurrentDateTimeString()}`,
  objectiveType: {
    value: 'AWARENESS',
    label: 'Awareness',
  },
};

const REDDIT_CAMPAIGN_EDIT_FORM_DATA = {
  campaignName: `Test Reddit Campaign ${getCurrentDateTimeString()}`,
  campaignOperationStatus: 'ACTIVE', // Default operation status
  campaignLifetimeBudget: '$100', // Will be set if empty or $0.00
  objectiveType: {
    value: 'AWARENESS',
    label: 'Awareness',
  },
};

const REDDIT_ADGROUP_EDIT_FORM_DATA = {
  adgroupName: `Test Reddit Adgroup ${getCurrentDateTimeString()}`,
  adgroupOperationStatus: 'ACTIVE', // Default operation status
  adgroupBudget: '$100', // Will be set if empty or $0.00
  scheduleStartDate: getCurrentDateString(), // Start date in MM/DD/YYYY format (one week from today)
  scheduleStartTime: getCurrentTimeString(), // Start time in HH:MM format (only set if empty)
  bidValue: '5', // CPM Bid value - will be set if empty
};

async function fillForm() {
  const fillButton = document.getElementById('fillForm') as HTMLButtonElement;
  const statusEl = document.getElementById('status') as HTMLDivElement;

  if (!fillButton || !statusEl) {
    console.error('[UAM Form Filler] Popup elements not found');
    return;
  }

  fillButton.disabled = true;
  statusEl.textContent = 'Checking form...';
  statusEl.className = 'status info';

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) {
      throw new Error('No active tab found');
    }

    if (!tab.url || !tab.url.includes('localhost:3000/uam')) {
      statusEl.textContent = 'Error: Please navigate to a UAM page (localhost:3000/uam)';
      statusEl.className = 'status error';
      fillButton.disabled = false;
      return;
    }

    let checkResponse;
    try {
      checkResponse = await chrome.tabs.sendMessage(tab.id, {
        action: 'checkForm',
      });
    } catch (error) {
      statusEl.textContent = 'Error: Content script not loaded. Please refresh the page and try again.';
      statusEl.className = 'status error';
      fillButton.disabled = false;
      return;
    }

    if (!checkResponse?.available) {
      const pageType = checkResponse?.pageType || 'unknown';
      if (pageType === 'edit') {
        // Edit pages don't need a modal, continue
      } else {
        statusEl.textContent =
          'Error: Create modal not found. Please open the create campaign modal first.';
        statusEl.className = 'status error';
        fillButton.disabled = false;
        return;
      }
    }

    const pageType = checkResponse?.pageType || 'unknown';
    const isEditPage = pageType === 'edit';
    
    statusEl.textContent = isEditPage ? 'Filling edit form...' : 'Filling form...';
    statusEl.className = 'status info';

    let response;
    try {
      let formData;
      if (isEditPage) {
        // Determine entity type from URL
        const url = tab.url || '';
        if (url.includes('/adgroups/') || url.includes('/ad-groups/')) {
          formData = REDDIT_ADGROUP_EDIT_FORM_DATA;
        } else {
          // Default to campaign edit form data
          formData = REDDIT_CAMPAIGN_EDIT_FORM_DATA;
        }
      } else {
        formData = REDDIT_CAMPAIGN_FORM_DATA;
      }
      response = await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        formData: formData,
      });
    } catch (error) {
      statusEl.textContent = 'Error: Content script not loaded. Please refresh the page and try again.';
      statusEl.className = 'status error';
      fillButton.disabled = false;
      return;
    }

    if (response?.success) {
      statusEl.textContent = 'Form filled successfully!';
      statusEl.className = 'status success';
    } else {
      const errorMsg = response?.error || 'Failed to fill form. Make sure the create modal is open.';
      statusEl.textContent = `Error: ${errorMsg}`;
      statusEl.className = 'status error';
      console.error('[UAM Form Filler] Fill form error:', errorMsg);
    }
  } catch (error) {
    console.error('[UAM Form Filler] Error:', error);
    statusEl.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    statusEl.className = 'status error';
  } finally {
    fillButton.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const fillButton = document.getElementById('fillForm');
  if (fillButton) {
    fillButton.addEventListener('click', fillForm);
  }
});
