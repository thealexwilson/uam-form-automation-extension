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

const generateFormData = (namePrefix: string = '') => {
  const prefix = namePrefix.trim() ? `${namePrefix.trim()} ` : '';
  const datetime = getCurrentDateTimeString();
  
  return {
    campaignUpsert: 'new' as const,
    campaignName: `${prefix}Test Reddit Campaign ${datetime}`,
    adgroupName: `${prefix}Test Reddit Adgroup ${datetime}`,
    adName: `${prefix}Test Reddit Ad ${datetime}`,
    objectiveType: {
      value: 'AWARENESS',
      label: 'Awareness',
    },
  };
};

const REDDIT_CAMPAIGN_FORM_DATA = generateFormData();

const generateCampaignEditFormData = (namePrefix: string = '') => {
  const prefix = namePrefix.trim() ? `${namePrefix.trim()} ` : '';
  const datetime = getCurrentDateTimeString();
  
  return {
    campaignName: `${prefix}Test Reddit Campaign ${datetime}`,
    campaignOperationStatus: 'ACTIVE', // Default operation status
    campaignLifetimeBudget: '$100', // Will be set if empty or $0.00
    objectiveType: {
      value: 'AWARENESS',
      label: 'Awareness',
    },
  };
};

const REDDIT_CAMPAIGN_EDIT_FORM_DATA = generateCampaignEditFormData();

const generateAdgroupEditFormData = (namePrefix: string = '') => {
  const prefix = namePrefix.trim() ? `${namePrefix.trim()} ` : '';
  const datetime = getCurrentDateTimeString();
  
  return {
    adgroupName: `${prefix}Test Reddit Adgroup ${datetime}`,
    adgroupOperationStatus: 'ACTIVE', // Default operation status
    adgroupBudget: '$100', // Will be set if empty or $0.00
    scheduleStartDate: getCurrentDateString(), // Start date in MM/DD/YYYY format (one week from today)
    scheduleStartTime: getCurrentTimeString(), // Start time in HH:MM format (only set if empty)
    bidValue: '5', // CPM Bid value - will be set if empty
  };
};

const REDDIT_ADGROUP_EDIT_FORM_DATA = generateAdgroupEditFormData();

const generateAdEditFormData = (namePrefix: string = '') => {
  const prefix = namePrefix.trim() ? `${namePrefix.trim()} ` : '';
  const datetime = getCurrentDateTimeString();
  
  return {
    adName: `${prefix}Test Reddit Ad ${datetime}`,
    postType: {
      value: 'IMAGE', // Default post type - adjust as needed
      label: 'Image',
    },
    profile: {
      value: '', // Will need to be set based on available options
      label: '',
    },
    headline: `${prefix}Test Headline ${datetime}`,
    callToAction: {
      value: 'LEARN_MORE', // Default CTA - adjust as needed
      label: 'Learn More',
    },
    destinationUrl: 'https://example.com',
    displayUrl: 'example.com',
  };
};

const REDDIT_AD_EDIT_FORM_DATA = generateAdEditFormData();

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
        // Get the name prefix from the input field
        const namePrefixInput = document.getElementById('namePrefix') as HTMLInputElement;
        const namePrefix = namePrefixInput?.value?.trim() || '';
        
        if (url.includes('/ads/')) {
          formData = generateAdEditFormData(namePrefix);
        } else if (url.includes('/adgroups/') || url.includes('/ad-groups/')) {
          formData = generateAdgroupEditFormData(namePrefix);
        } else {
          // Default to campaign edit form data
          formData = generateCampaignEditFormData(namePrefix);
        }
      } else {
        // Get the name prefix from the input field
        const namePrefixInput = document.getElementById('namePrefix') as HTMLInputElement;
        const namePrefix = namePrefixInput?.value?.trim() || '';
        formData = generateFormData(namePrefix);
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

function getEntityTypeFromUrl(url: string): 'campaigns' | 'adgroups' | 'ads' | null {
  if (!url || !url.includes('localhost:3000/uam')) {
    return null;
  }
  
  if (url.includes('/ads/')) {
    return 'ads';
  } else if (url.includes('/adgroups/') || url.includes('/ad-groups/')) {
    return 'adgroups';
  } else if (url.includes('/campaigns/')) {
    return 'campaigns';
  }
  
  return null;
}

function getEntityDisplayName(entityType: 'campaigns' | 'adgroups' | 'ads' | null): string {
  switch (entityType) {
    case 'ads':
      return 'Reddit Ads';
    case 'adgroups':
      return 'Reddit Ad Groups';
    case 'campaigns':
      return 'Reddit Campaigns';
    default:
      return 'Reddit Form Filler';
  }
}

async function updateSubtitle() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab.url) {
      const entityType = getEntityTypeFromUrl(tab.url);
      const displayName = getEntityDisplayName(entityType);
      
      const subtitleEl = document.getElementById('entitySubtitle');
      if (subtitleEl) {
        subtitleEl.textContent = displayName;
      }
    }
  } catch (error) {
    console.error('[UAM Form Filler] Error updating subtitle:', error);
  }
}

  // Load saved name prefix from storage
  async function loadSavedNamePrefix() {
    try {
      const result = await chrome.storage.local.get(['namePrefix']);
      console.log('[UAM Form Filler] Loaded name prefix from storage:', result.namePrefix);
      const namePrefixInput = document.getElementById('namePrefix') as HTMLInputElement;
      if (namePrefixInput) {
        if (result.namePrefix) {
          namePrefixInput.value = result.namePrefix;
          console.log('[UAM Form Filler] Restored name prefix:', result.namePrefix);
        } else {
          console.log('[UAM Form Filler] No saved name prefix found');
        }
      } else {
        console.error('[UAM Form Filler] Name prefix input element not found');
      }
    } catch (error) {
      console.error('[UAM Form Filler] Error loading saved name prefix:', error);
    }
  }

  // Save name prefix to storage
  async function saveNamePrefix(prefix: string) {
    try {
      await chrome.storage.local.set({ namePrefix: prefix });
      console.log('[UAM Form Filler] Saved name prefix to storage:', prefix);
    } catch (error) {
      console.error('[UAM Form Filler] Error saving name prefix:', error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const fillButton = document.getElementById('fillForm');
    if (fillButton) {
      fillButton.addEventListener('click', fillForm);
    }
    
    // Load saved name prefix when popup opens
    loadSavedNamePrefix();
    
    // Save name prefix whenever user types in the input field
    const namePrefixInput = document.getElementById('namePrefix') as HTMLInputElement;
    if (namePrefixInput) {
      namePrefixInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        saveNamePrefix(value);
      });
      
      // Also save on blur (when user clicks away)
      namePrefixInput.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        saveNamePrefix(value);
      });
    }
    
    updateSubtitle();
  });
