// Account field names that should never be touched
const ACCOUNT_FIELD_NAMES = ['account', 'account_id', 'accountid', 'account-id', 'ad_account', 'adAccount', 'ad-account'];

function findInputByName(name: string, searchInModal: boolean = true): HTMLElement | null {
  // Never search for account-related fields - they're automatically filled
  if (ACCOUNT_FIELD_NAMES.some((accField: string) => name.toLowerCase().includes(accField.toLowerCase()))) {
    console.log(`[UAM Form Filler] Skipping search for account field: "${name}"`);
    return null;
  }
  
  const selectors = [
    `input[name="${name}"]`,
    `select[name="${name}"]`,
    `textarea[name="${name}"]`,
    `[name="${name}"]`,
    `#${name}`,
    `[id="${name}"]`,
    `[name*="${name}"]`,
    `[id*="${name}"]`,
  ];

  const modal = searchInModal ? document.querySelector('#create-modal') : null;
  const searchScope = modal || document;

  for (const selector of selectors) {
    const element = searchScope.querySelector(selector);
    if (element) {
      // Double-check: don't return account fields even if matched
      const elementName = (element as HTMLElement).getAttribute('name') || (element as HTMLElement).id || '';
      const elementNameLower = elementName.toLowerCase();
      if (ACCOUNT_FIELD_NAMES.some((accField: string) => elementNameLower.includes(accField.toLowerCase()))) {
        console.log(`[UAM Form Filler] Skipping account field match: "${elementName}"`);
        continue;
      }
      
      // Also check if the element's parent or nearby elements indicate it's an account field
      const parentText = element.parentElement?.textContent?.toLowerCase() || '';
      if (parentText.includes('ad account') && !parentText.includes('profile')) {
        console.log(`[UAM Form Filler] Skipping account field based on parent context: "${elementName}"`);
        continue;
      }
      
      console.log(`[UAM Form Filler] Found input for "${name}" using selector: ${selector}`);
      return element as HTMLElement;
    }
  }

  if (name === 'objectiveType') {
    console.log(`[UAM Form Filler] Searching for objectiveType alternatives...`);
    const alternatives = [
      'objective',
      'objective_type',
      'campaignObjective',
      'campaign_objective',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }

  if (name === 'adgroupName') {
    console.log(`[UAM Form Filler] Searching for adgroupName alternatives...`);
    const alternatives = [
      'adgroup',
      'adGroup',
      'ad_group',
      'adGroupName',
      'ad_group_name',
      'name', // For edit pages, the field might just be called "name"
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
    
    // Special case: on edit pages, check if we're on an adgroup edit page and look for just "name"
    if (!searchInModal) {
      const url = window.location.href;
      if (url.includes('/adgroups/') || url.includes('/ad-groups/')) {
        const nameInput = searchScope.querySelector('input[name="name"]');
        if (nameInput) {
          console.log(`[UAM Form Filler] Found input for "${name}" using "name" on adgroup edit page`);
          return nameInput as HTMLElement;
        }
      }
    }
  }

  if (name === 'adName') {
    console.log(`[UAM Form Filler] Searching for adName alternatives...`);
    // Direct search for "name" field first (most common on ad edit pages)
    const nameInput = searchScope.querySelector('input[name="name"]');
    if (nameInput) {
      console.log(`[UAM Form Filler] Found input for "${name}" using "name" field`);
      return nameInput as HTMLElement;
    }
    
    const alternatives = [
      'ad',
      'ad_name',
      'adName',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'postType') {
    console.log(`[UAM Form Filler] Searching for postType...`);
    // Direct search for creative.type field
    const creativeTypeInput = searchScope.querySelector('input[name="creative.type"]');
    if (creativeTypeInput) {
      console.log(`[UAM Form Filler] Found input for "${name}" using "creative.type" field`);
      return creativeTypeInput as HTMLElement;
    }
    
    const alternatives = [
      'post_type',
      'postType',
      'post-type',
      'type',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'profile') {
    console.log(`[UAM Form Filler] Searching for profile...`);
    // Direct search for profile_id field (but not account fields)
    const profileIdInput = searchScope.querySelector('input[name="profile_id"]');
    if (profileIdInput) {
      const elementName = profileIdInput.getAttribute('name')?.toLowerCase() || '';
      if (!ACCOUNT_FIELD_NAMES.some((accField: string) => elementName.includes(accField))) {
        console.log(`[UAM Form Filler] Found input for "${name}" using "profile_id" field`);
        return profileIdInput as HTMLElement;
      } else {
        console.log(`[UAM Form Filler] Skipping account field matched as profile_id`);
      }
    }
    
    const alternatives = [
      'profile_id',
      'profileId',
      'profile-id',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          // Double-check: don't return account fields
          const elementName = (element as HTMLElement).getAttribute('name')?.toLowerCase() || '';
          if (ACCOUNT_FIELD_NAMES.some((accField: string) => elementName.includes(accField))) {
            console.log(`[UAM Form Filler] Skipping account field matched as profile: "${elementName}"`);
            continue;
          }
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'headline') {
    console.log(`[UAM Form Filler] Searching for headline...`);
    // Direct search for creative.headline field
    const headlineInput = searchScope.querySelector('input[name="creative.headline"]');
    if (headlineInput) {
      console.log(`[UAM Form Filler] Found input for "${name}" using "creative.headline" field`);
      return headlineInput as HTMLElement;
    }
    
    const alternatives = [
      'headline_text',
      'headlineText',
      'headline-text',
      'title',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'callToAction') {
    console.log(`[UAM Form Filler] Searching for callToAction...`);
    // Direct search for creative.content.0.call_to_action field
    const ctaInput = searchScope.querySelector('input[name="creative.content.0.call_to_action"]');
    if (ctaInput) {
      console.log(`[UAM Form Filler] Found input for "${name}" using "creative.content.0.call_to_action" field`);
      return ctaInput as HTMLElement;
    }
    
    const alternatives = [
      'call_to_action',
      'callToAction',
      'call-to-action',
      'cta',
      'button_text',
      'buttonText',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'destinationUrl') {
    console.log(`[UAM Form Filler] Searching for destinationUrl...`);
    // Direct search for creative.content.0.destination_url field
    const destUrlInput = searchScope.querySelector('input[name="creative.content.0.destination_url"]');
    if (destUrlInput) {
      console.log(`[UAM Form Filler] Found input for "${name}" using "creative.content.0.destination_url" field`);
      return destUrlInput as HTMLElement;
    }
    
    const alternatives = [
      'destination_url',
      'destinationUrl',
      'destination-url',
      'destination',
      'url',
      'link_url',
      'linkUrl',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'displayUrl') {
    console.log(`[UAM Form Filler] Searching for displayUrl...`);
    // Direct search for creative.content.0.display_url field
    const displayUrlInput = searchScope.querySelector('input[name="creative.content.0.display_url"]');
    if (displayUrlInput) {
      console.log(`[UAM Form Filler] Found input for "${name}" using "creative.content.0.display_url" field`);
      return displayUrlInput as HTMLElement;
    }
    
    const alternatives = [
      'display_url',
      'displayUrl',
      'display-url',
      'display',
      'visible_url',
      'visibleUrl',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'postType') {
    console.log(`[UAM Form Filler] Searching for postType alternatives...`);
    const alternatives = [
      'post_type',
      'postType',
      'post-type',
      'type',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'profile') {
    console.log(`[UAM Form Filler] Searching for profile alternatives...`);
    const alternatives = [
      'profile_id',
      'profileId',
      'profile-id',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'headline') {
    console.log(`[UAM Form Filler] Searching for headline alternatives...`);
    const alternatives = [
      'headline_text',
      'headlineText',
      'headline-text',
      'title',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'callToAction') {
    console.log(`[UAM Form Filler] Searching for callToAction alternatives...`);
    const alternatives = [
      'call_to_action',
      'callToAction',
      'call-to-action',
      'cta',
      'button_text',
      'buttonText',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'destinationUrl') {
    console.log(`[UAM Form Filler] Searching for destinationUrl alternatives...`);
    const alternatives = [
      'destination_url',
      'destinationUrl',
      'destination-url',
      'destination',
      'url',
      'link_url',
      'linkUrl',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }
  
  if (name === 'displayUrl') {
    console.log(`[UAM Form Filler] Searching for displayUrl alternatives...`);
    const alternatives = [
      'display_url',
      'displayUrl',
      'display-url',
      'display',
      'visible_url',
      'visibleUrl',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }

  if (name === 'campaignOperationStatus') {
    console.log(`[UAM Form Filler] Searching for campaignOperationStatus alternatives...`);
    const alternatives = [
      'operationStatus',
      'operation_status',
      'status',
      'campaignStatus',
      'campaign_status',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }

  if (name === 'campaignLifetimeBudget') {
    console.log(`[UAM Form Filler] Searching for campaignLifetimeBudget alternatives...`);
    const alternatives = [
      'lifetimeBudget',
      'lifetime_budget',
      'budget',
      'campaignBudget',
      'campaign_budget',
      'lifetimeBudgetAmount',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }

  if (name === 'adgroupOperationStatus') {
    console.log(`[UAM Form Filler] Searching for adgroupOperationStatus alternatives...`);
    const alternatives = [
      'operationStatus',
      'operation_status',
      'status',
      'adgroupStatus',
      'adgroup_status',
      'adGroupStatus',
      'configured_status', // Actual field name on edit pages
    ];
    
    for (const altName of alternatives) {
      // For radio buttons, we need to find the group first
      const radioGroup = searchScope.querySelectorAll(`input[type="radio"][name="${altName}"]`);
      if (radioGroup.length > 0) {
        console.log(`[UAM Form Filler] Found radio button group for "${name}" using alternative name "${altName}"`);
        // Return the first radio button - setInputValue will handle finding the right one
        return radioGroup[0] as HTMLElement;
      }
      
      // Also try regular selectors
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }

  if (name === 'adgroupBudget') {
    console.log(`[UAM Form Filler] Searching for adgroupBudget alternatives...`);
    const alternatives = [
      'budget',
      'adgroup_budget',
      'adGroupBudget',
      'ad_group_budget',
      'spend',
      'spend_cap',
      'goal_value', // Actual field name on edit pages (for budget/goal)
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }

  if (name === 'scheduleStartDate') {
    console.log(`[UAM Form Filler] Searching for scheduleStartDate alternatives...`);
    // Direct search for the actual field name (most reliable)
    const directElement = searchScope.querySelector('input[name="_scheduleStartTime.date"], input[name="scheduleStartTime.date"]');
    if (directElement) {
      console.log(`[UAM Form Filler] Found input for "${name}" using direct search`);
      return directElement as HTMLElement;
    }
    
    const alternatives = [
      '_scheduleStartTime.date',
      'scheduleStartTime.date',
      'schedule_start_time.date',
      'startDate',
      'start_date',
      'scheduleDate',
      'schedule_date',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector}`);
          return element as HTMLElement;
        }
      }
    }
  }

  if (name === 'scheduleStartTime') {
    console.log(`[UAM Form Filler] Searching for scheduleStartTime (looking for _scheduleStartTime.time)...`);
    // Direct search for the actual field name (most reliable) - must end with .time, NOT .date
    const directElement = searchScope.querySelector('input[name="_scheduleStartTime.time"], input[name="scheduleStartTime.time"]');
    if (directElement) {
      const foundName = (directElement as HTMLInputElement).name || directElement.getAttribute('name') || 'unknown';
      // Double-check it's actually the time field
      if (foundName.includes('.time') && !foundName.includes('.date')) {
        console.log(`[UAM Form Filler] Found input for "${name}" using direct search - actual field name: "${foundName}"`);
        return directElement as HTMLElement;
      } else {
        console.log(`[UAM Form Filler] Found element but wrong field type: "${foundName}", continuing search...`);
      }
    }
    
    // Try exact match selectors that explicitly require .time
    const exactSelectors = [
      'input[name="_scheduleStartTime.time"]',
      'input[name="scheduleStartTime.time"]',
    ];
    
    for (const selector of exactSelectors) {
      const element = searchScope.querySelector(selector);
      if (element) {
        const foundName = (element as HTMLInputElement).name || element.getAttribute('name') || 'unknown';
        console.log(`[UAM Form Filler] Found input for "${name}" using exact selector "${selector}" - actual field name: "${foundName}"`);
        // Verify it's actually the time field
        if (foundName.includes('.time') && !foundName.includes('.date')) {
          return element as HTMLElement;
        }
      }
    }
    
    // Last resort: search all inputs and find the one that matches .time pattern
    const allInputs = searchScope.querySelectorAll('input[name*="scheduleStartTime"], input[name*="schedule_start_time"]');
    for (const input of Array.from(allInputs)) {
      const inputName = (input as HTMLInputElement).name || input.getAttribute('name') || '';
      if (inputName.includes('.time') && !inputName.includes('.date')) {
        console.log(`[UAM Form Filler] Found input for "${name}" by searching all inputs - actual field name: "${inputName}"`);
        return input as HTMLElement;
      }
    }
    
    console.log(`[UAM Form Filler] Could not find time field for "${name}"`);
  }

  if (name === 'bidValue') {
    console.log(`[UAM Form Filler] Searching for bidValue (looking for bid_value)...`);
    // Direct search for the actual field name
    const directElement = searchScope.querySelector('input[name="bid_value"], input[name="bidValue"], input[name="bid-value"]');
    if (directElement) {
      const foundName = (directElement as HTMLInputElement).name || directElement.getAttribute('name') || 'unknown';
      console.log(`[UAM Form Filler] Found input for "${name}" using direct search - actual field name: "${foundName}"`);
      return directElement as HTMLElement;
    }
    
    const alternatives = [
      'bid_value',
      'bidValue',
      'bid-value',
      'cpmBid',
      'cpm_bid',
      'cpm-bid',
    ];
    
    for (const altName of alternatives) {
      for (const selector of selectors) {
        const altSelector = selector.replace(name, altName);
        const element = searchScope.querySelector(altSelector);
        if (element) {
          const foundName = (element as HTMLInputElement).name || element.getAttribute('name') || 'unknown';
          console.log(`[UAM Form Filler] Found input for "${name}" using alternative name "${altName}" with selector: ${altSelector} - actual field name: "${foundName}"`);
          return element as HTMLElement;
        }
      }
    }
  }

  return null;
}

function findFileInputInModal(): HTMLInputElement | null {
  console.log('[UAM Form Filler] Searching for file input in modal...');
  
  // Strategy 1: Direct query for file inputs
  let fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    console.log('[UAM Form Filler] Found file input via direct query');
    return fileInput;
  }
  
  // Strategy 2: Find modal/dialog containers and search within them
  const modalSelectors = [
    '[role="dialog"]',
    '.modal',
    '[class*="Modal"]',
    '[class*="Dialog"]',
    '[class*="modal"]',
    '[class*="dialog"]',
  ];
  
  for (const selector of modalSelectors) {
    const modal = document.querySelector(selector);
    if (modal) {
      const inputInModal = modal.querySelector('input[type="file"]') as HTMLInputElement;
      if (inputInModal) {
        console.log(`[UAM Form Filler] Found file input in modal (${selector})`);
        return inputInModal;
      }
    }
  }
  
  // Strategy 3: Find "Select from your files" element and look for associated file input
  const selectFilesButton = Array.from(document.querySelectorAll('span, button, label, a')).find(el => {
    const text = el.textContent?.trim() || '';
    return text === 'Select from your files' || text.toLowerCase().includes('select from your files');
  });
  
  if (selectFilesButton) {
    // Check if it's a label with htmlFor pointing to file input
    if (selectFilesButton.tagName === 'LABEL' && (selectFilesButton as HTMLLabelElement).htmlFor) {
      const associatedInput = document.getElementById((selectFilesButton as HTMLLabelElement).htmlFor) as HTMLInputElement;
      if (associatedInput && associatedInput.type === 'file') {
        console.log('[UAM Form Filler] Found file input via label htmlFor');
        return associatedInput;
      }
    }
    
    // Check parent elements for file input
    let parent = selectFilesButton.parentElement;
    let attempts = 0;
    while (parent && attempts < 5) {
      const inputInParent = parent.querySelector('input[type="file"]') as HTMLInputElement;
      if (inputInParent) {
        console.log('[UAM Form Filler] Found file input in parent of "Select from your files"');
        return inputInParent;
      }
      parent = parent.parentElement;
      attempts++;
    }
    
    // Check if the button/label contains the file input
    const inputInButton = selectFilesButton.querySelector('input[type="file"]') as HTMLInputElement;
    if (inputInButton) {
      console.log('[UAM Form Filler] Found file input inside "Select from your files" element');
      return inputInButton;
    }
  }
  
  // Strategy 4: Search all file inputs, even if hidden
  const allFileInputs = Array.from(document.querySelectorAll('input[type="file"]')) as HTMLInputElement[];
  if (allFileInputs.length > 0) {
    console.log(`[UAM Form Filler] Found ${allFileInputs.length} file input(s), using first one`);
    return allFileInputs[0];
  }
  
  console.log('[UAM Form Filler] File input not found in modal');
  return null;
}

async function uploadImageIfNeeded(): Promise<boolean> {
  console.log('[UAM Form Filler] Checking if image upload is needed...');
  
  // First, try to find within the create modal (for create forms)
  let searchScope: Document | Element = document;
  const modal = document.querySelector('#create-modal');
  if (modal) {
    searchScope = modal;
    console.log('[UAM Form Filler] Searching for "Add Image" within create modal...');
  } else {
    console.log('[UAM Form Filler] No create modal found, searching entire document...');
  }
  
  // Look for the "Add Image" span or button element, but only for "Ad Image" (not "Thumbnail Image")
  // We need to check the context to ensure it's the Ad Image field, not the Thumbnail Image field
  const addImageElements = Array.from(searchScope.querySelectorAll('span, button')).filter(el => {
    const text = el.textContent?.trim() || '';
    return text === 'Add Image';
  });
  
  console.log(`[UAM Form Filler] Found ${addImageElements.length} "Add Image" elements`);
  
  // Find the one associated with "Ad Image" by checking parent/ancestor elements for "Ad Image" text
  let adImageElement: HTMLElement | null = null;
  for (const el of addImageElements) {
    // Check parent elements for "Ad Image" label/text (but not "Thumbnail Image")
    let current: Element | null = el.parentElement;
    let foundAdImage = false;
    let foundThumbnail = false;
    
    // Check up to 5 levels up the DOM tree
    for (let i = 0; i < 5 && current; i++) {
      const parentText = current.textContent?.toLowerCase() || '';
      if (parentText.includes('ad image') && !parentText.includes('thumbnail')) {
        foundAdImage = true;
        break;
      }
      if (parentText.includes('thumbnail image')) {
        foundThumbnail = true;
        break;
      }
      current = current.parentElement;
    }
    
    if (foundAdImage && !foundThumbnail) {
      adImageElement = el as HTMLElement;
      console.log('[UAM Form Filler] Found "Add Image" element for Ad Image');
      break;
    }
  }
  
  // If we didn't find one specifically for Ad Image, try to find one that's NOT near "Thumbnail"
  if (!adImageElement) {
    for (const el of addImageElements) {
      let current: Element | null = el.parentElement;
      let foundThumbnail = false;
      
      // Check up to 5 levels up for "Thumbnail" text
      for (let i = 0; i < 5 && current; i++) {
        const parentText = current.textContent?.toLowerCase() || '';
        if (parentText.includes('thumbnail')) {
          foundThumbnail = true;
          break;
        }
        current = current.parentElement;
      }
      
      // If this element is NOT near "Thumbnail", assume it's the Ad Image one
      if (!foundThumbnail) {
        adImageElement = el as HTMLElement;
        console.log('[UAM Form Filler] Found "Add Image" element (not near Thumbnail, assuming Ad Image)');
        break;
      }
    }
  }
  
  if (!adImageElement) {
    console.log('[UAM Form Filler] "Add Image" element for Ad Image not found - Ad Image already exists, skipping image upload');
    return false;
  }
  
  console.log('[UAM Form Filler] Found "Add Image" element for Ad Image (no image present), proceeding with upload...');
  adImageElement.click();
  
  // Wait for the upload dialog/modal to appear
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Try to find the file input BEFORE clicking "Select from your files" to bypass OS dialog
  let fileInput = findFileInputInModal();
  
  if (!fileInput) {
    // Fallback: If file input not found, use the original approach (click button, wait, then find)
    console.log('[UAM Form Filler] File input not found initially, falling back to button click approach...');
    
    // Find "Select from your files" element
    const selectFilesButton = Array.from(document.querySelectorAll('span, button, label, a')).find(el => {
      const text = el.textContent?.trim() || '';
      return text === 'Select from your files' || text.toLowerCase().includes('select from your files');
    });
    
    if (!selectFilesButton) {
      console.log('[UAM Form Filler] "Select from your files" button not found');
      return false;
    }
    
    console.log('[UAM Form Filler] Found "Select from your files" button, clicking it...');
    (selectFilesButton as HTMLElement).click();
    
    // Wait a bit for file input to appear after clicking
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Try to find the file input again
    fileInput = findFileInputInModal();
    
    if (!fileInput) {
      console.log('[UAM Form Filler] File input not found after clicking button');
      return false;
    }
  } else {
    console.log('[UAM Form Filler] Found file input without clicking button - bypassing OS dialog!');
  }
  
  console.log('[UAM Form Filler] Found file input, creating placeholder image...');
  
  // Create a placeholder image (minimum 140x140 pixels)
  const canvas = document.createElement('canvas');
  canvas.width = 140;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, 140, 140);
    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.fillText('Test Image', 30, 70);
  }
  
  canvas.toBlob((blob) => {
    if (!blob) {
      console.log('[UAM Form Filler] Failed to create image blob');
      return;
    }
    
    const file = new File([blob], 'test-image.png', { type: 'image/png' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    
    // Trigger change event
    const changeEvent = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    
    console.log('[UAM Form Filler] File set on input, waiting for upload button...');
    
    // Wait for "Start Upload" button to appear
    const checkUploadButton = setInterval(() => {
      const startUploadButton = Array.from(document.querySelectorAll('button')).find(btn => {
        const text = btn.textContent?.trim() || '';
        return text === 'Start Upload' || text.toLowerCase().includes('start upload');
      });
      
      if (startUploadButton) {
        clearInterval(checkUploadButton);
        console.log('[UAM Form Filler] Found "Start Upload" button, clicking it...');
        (startUploadButton as HTMLButtonElement).click();
        
        // Wait for upload to complete and "Apply" button to appear
        const checkApplyButton = setInterval(() => {
          const applyButton = Array.from(document.querySelectorAll('button')).find(btn => {
            const text = btn.textContent?.trim() || '';
            const classes = btn.className || '';
            return (text === 'Apply' || text.toLowerCase().includes('apply')) &&
                   classes.includes('primary');
          });
          
          if (applyButton) {
            clearInterval(checkApplyButton);
            console.log('[UAM Form Filler] Found "Apply" button, clicking it...');
            (applyButton as HTMLButtonElement).click();
            console.log('[UAM Form Filler] ✓ Image upload completed');
          }
        }, 500);
        
        // Timeout after 30 seconds
        setTimeout(() => {
          clearInterval(checkApplyButton);
          console.log('[UAM Form Filler] Timeout waiting for Apply button');
        }, 30000);
      }
    }, 500);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkUploadButton);
      console.log('[UAM Form Filler] Timeout waiting for Start Upload button');
    }, 10000);
  }, 'image/png');
  
  return true;
}

function setInputValue(element: HTMLElement, value: any): boolean {
  const tagName = element.tagName.toLowerCase();
  const inputType = (element as HTMLInputElement).type?.toLowerCase();

  console.log(`[UAM Form Filler] Setting value on element: tagName=${tagName}, type=${inputType}, name=${(element as any).name || element.getAttribute('name') || 'none'}, id=${element.id || 'none'}`);

  try {
    if (tagName === 'input') {
      const input = element as HTMLInputElement;
      
      if (inputType === 'hidden') {
        // For objectiveType, check visible dropdown state BEFORE attempting to set it
        if (input.name === 'objectiveType' || input.name === 'objective' || input.name === 'objective_type') {
          // First check hidden input
          const originalValue = input.value?.trim() || '';
          if (originalValue && originalValue !== '') {
            console.log(`[UAM Form Filler] ✗ Skipping objectiveType - hidden input already has value: "${originalValue}"`);
            return true; // Return true to indicate success (value already set)
          }
          
          // Then check visible dropdown state BEFORE setting hidden input
          const modal = input.closest('#create-modal') || document.querySelector('#create-modal');
          const searchScope = modal || document;
          
          // Look for objective-related react-select dropdowns
          const reactSelectInputs = searchScope.querySelectorAll('.react-select__input[role="combobox"]');
          for (const reactSelectInput of Array.from(reactSelectInputs)) {
            const parentText = reactSelectInput.parentElement?.textContent?.toLowerCase() || '';
            // Skip account fields
            if (ACCOUNT_FIELD_NAMES.some((accField: string) => parentText.includes('ad account') && !parentText.includes('profile'))) {
              continue;
            }
            
            // Check if this is the objective dropdown
            if (parentText.includes('objective') || parentText.includes('awareness') || parentText.includes('conversion') || parentText.includes('traffic')) {
              const container = reactSelectInput.closest('.react-select__control') || reactSelectInput.closest('.react-select__input-container');
              if (container) {
                // Check if it already has a selected value
                const singleValue = container.querySelector('.react-select__single-value');
                if (singleValue) {
                  const selectedText = singleValue.textContent?.trim() || '';
                  if (selectedText && 
                      selectedText !== '' && 
                      selectedText.toLowerCase() !== 'select a campaign objective' &&
                      selectedText.toLowerCase() !== 'select' &&
                      (selectedText.toLowerCase().includes('awareness') || 
                       selectedText.toLowerCase().includes('conversion') || 
                       selectedText.toLowerCase().includes('traffic'))) {
                    console.log(`[UAM Form Filler] ✗ Skipping objectiveType - dropdown already has selected value: "${selectedText}"`);
                    return true; // Return true to indicate success (value already set)
                  }
                }
                break; // Found the objective dropdown, no need to check others
              }
            }
          }
        }
        
        // Handle object values properly - check if value property exists (even if empty string)
        let valueToSet: string;
        if (typeof value === 'object' && value !== null && 'value' in value) {
          valueToSet = String(value.value);
        } else {
          valueToSet = String(value);
        }
        console.log(`[UAM Form Filler] Setting hidden input value to: ${valueToSet}`);
        
        input.value = valueToSet;
        
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        
        Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true });
        Object.defineProperty(changeEvent, 'target', { value: input, enumerable: true });
        
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
        
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, valueToSet);
          const nativeEvent = new Event('input', { bubbles: true });
          input.dispatchEvent(nativeEvent);
        }
        
        // Never handle account fields - they're automatically filled
        const inputName = input.name?.toLowerCase() || '';
        if (ACCOUNT_FIELD_NAMES.some(accField => inputName.includes(accField))) {
          console.log(`[UAM Form Filler] Skipping dropdown handling for account field: "${input.name}"`);
          return true; // Return true to indicate "success" (we're intentionally skipping it)
        }
        
        // For objectiveType, check visible dropdown state BEFORE we try to fill it
        // This prevents us from trying to fill if it already has a value
        if (input.name === 'objectiveType' || input.name === 'objective' || input.name === 'objective_type') {
          // Try to find the visible dropdown to check its current state
          const modal = input.closest('#create-modal') || document.querySelector('#create-modal');
          const searchScope = modal || document;
          
          // Look for objective-related react-select dropdowns
          const reactSelectInputs = searchScope.querySelectorAll('.react-select__input[role="combobox"]');
          for (const reactSelectInput of Array.from(reactSelectInputs)) {
            const parentText = reactSelectInput.parentElement?.textContent?.toLowerCase() || '';
            // Skip account fields
            if (ACCOUNT_FIELD_NAMES.some((accField: string) => parentText.includes('ad account') && !parentText.includes('profile'))) {
              continue;
            }
            
            // Check if this is the objective dropdown
            if (parentText.includes('objective') || parentText.includes('awareness') || parentText.includes('conversion') || parentText.includes('traffic')) {
              const container = reactSelectInput.closest('.react-select__control') || reactSelectInput.closest('.react-select__input-container');
              if (container) {
                // Check if it already has a selected value
                const singleValue = container.querySelector('.react-select__single-value');
                if (singleValue) {
                  const selectedText = singleValue.textContent?.trim() || '';
                  if (selectedText && 
                      selectedText !== '' && 
                      selectedText.toLowerCase() !== 'select a campaign objective' &&
                      selectedText.toLowerCase() !== 'select' &&
                      (selectedText.toLowerCase().includes('awareness') || 
                       selectedText.toLowerCase().includes('conversion') || 
                       selectedText.toLowerCase().includes('traffic'))) {
                    console.log(`[UAM Form Filler] ✗ Skipping objectiveType - dropdown already has selected value: "${selectedText}"`);
                    return true; // Return true to indicate success (value already set)
                  }
                }
                break; // Found the objective dropdown, no need to check others
              }
            }
          }
        }
        
        // Handle React Select dropdowns (objectiveType, postType, profile, callToAction, etc.)
        // Map actual field names to logical names for dropdown handling
        const dropdownFieldMap: Record<string, string> = {
          'objectiveType': 'objectiveType',
          'postType': 'postType',
          'profile': 'profile',
          'callToAction': 'callToAction',
          'creative.type': 'postType', // Actual field name for postType
          'profile_id': 'profile', // Actual field name for profile
          'creative.content.0.call_to_action': 'callToAction', // Actual field name for callToAction
        };
        
        const logicalFieldName = dropdownFieldMap[input.name];
        if (logicalFieldName) {
          // Double-check: never handle account fields
          const inputNameLower = input.name?.toLowerCase() || '';
          if (ACCOUNT_FIELD_NAMES.some(accField => inputNameLower.includes(accField))) {
            console.log(`[UAM Form Filler] Skipping dropdown handling for account field: "${input.name}"`);
            return true;
          }
          
          console.log(`[UAM Form Filler] Looking for visible dropdown component for ${input.name} (logical: ${logicalFieldName})...`);
          
          const findAndClickDropdown = () => {
            // For edit pages, there's no modal, so search in the document
            const modal = input.closest('#create-modal') || document.querySelector('#create-modal');
            const parentContainer = input.parentElement?.parentElement || input.closest('div, form, section');
            const searchScope = modal || parentContainer || document;
            
            let visibleDropdown: HTMLElement | null = null;
            
            // First, try to find the dropdown associated with the hidden input we're filling
            // Look for a react-select container near the hidden input
            const inputParent = input.closest('div, form, section, fieldset');
            if (inputParent) {
              // Find react-select containers within the same parent
              const nearbySelects = inputParent.querySelectorAll('.react-select__control, .react-select__input-container, [class*="react-select"]');
              for (const selectEl of Array.from(nearbySelects)) {
                const selectText = selectEl.textContent?.toLowerCase() || '';
                const selectId = (selectEl as HTMLElement).id?.toLowerCase() || '';
                
                // Skip account fields
                const isAccountField = ACCOUNT_FIELD_NAMES.some((accField: string) => 
                  selectId.includes(accField) ||
                  (selectText.includes('ad account') && !selectText.includes('profile'))
                );
                
                if (isAccountField) {
                  continue;
                }
                
                // Check if this dropdown is related to the field we're looking for
                const logicalNameLower = logicalFieldName.toLowerCase();
                if (logicalFieldName === 'objectiveType') {
                  // For objective, look for dropdowns that don't contain account-related text
                  if (!selectText.includes('account') && (selectText.includes('objective') || selectText.includes('awareness') || selectText.includes('conversion') || selectText.includes('traffic'))) {
                    visibleDropdown = selectEl as HTMLElement;
                    console.log(`[UAM Form Filler] Found objective dropdown near hidden input`);
                    break;
                  }
                } else if (selectText.includes(logicalNameLower) || selectEl === input.nextElementSibling || selectEl === input.previousElementSibling) {
                  visibleDropdown = selectEl as HTMLElement;
                  console.log(`[UAM Form Filler] Found dropdown near hidden input`);
                  break;
                }
              }
            }
            
            // If not found near input, search more broadly but exclude account fields
            if (!visibleDropdown) {
              const reactSelectInputs = searchScope.querySelectorAll('.react-select__input[role="combobox"]');
              for (const reactSelectInput of Array.from(reactSelectInputs)) {
                const inputEl = reactSelectInput as HTMLInputElement;
                // Check if this input is associated with an account field
                const inputId = inputEl.id?.toLowerCase() || '';
                const inputName = inputEl.getAttribute('name')?.toLowerCase() || '';
                const parentText = reactSelectInput.parentElement?.textContent?.toLowerCase() || '';
                const isAccountField = ACCOUNT_FIELD_NAMES.some((accField: string) => 
                  inputId.includes(accField) || 
                  inputName.includes(accField) ||
                  (parentText.includes('ad account') && !parentText.includes('profile'))
                );
                
                if (isAccountField) {
                  console.log(`[UAM Form Filler] Skipping account-related react-select input: id="${inputEl.id}", name="${inputName}"`);
                  continue;
                }
                
                // For objectiveType, check if this dropdown contains objective-related text
                if (logicalFieldName === 'objectiveType') {
                  if (!parentText.includes('objective') && !parentText.includes('awareness') && !parentText.includes('conversion') && !parentText.includes('traffic')) {
                    continue; // Skip non-objective dropdowns
                  }
                }
                
                const container = reactSelectInput.closest('.react-select__input-container');
                if (container) {
                  visibleDropdown = container as HTMLElement;
                  console.log(`[UAM Form Filler] Found react-select input container`);
                  break;
                } else {
                  visibleDropdown = reactSelectInput as HTMLElement;
                  console.log(`[UAM Form Filler] Found react-select input`);
                  break;
                }
              }
            }
            
            if (!visibleDropdown) {
              const selectors = [
                '[role="combobox"]',
                '[role="listbox"]',
                'button[aria-haspopup="listbox"]',
                '[class*="Select"]',
                '[class*="select"]',
                '[class*="Dropdown"]',
                '[class*="dropdown"]',
                'button:has(+ [role="listbox"])',
              ];
              
              // Try to find dropdown near the hidden input
              const inputParent = input.closest('div, form, section');
              if (inputParent) {
                for (const selector of selectors) {
                  const elements = inputParent.querySelectorAll(selector);
                  for (const el of Array.from(elements)) {
                    // Skip account-related dropdowns
                    const elText = el.textContent?.toLowerCase() || '';
                    const elId = (el as HTMLElement).id?.toLowerCase() || '';
                    const elName = (el as HTMLElement).getAttribute('name')?.toLowerCase() || '';
                    const isAccountField = ACCOUNT_FIELD_NAMES.some((accField: string) => 
                      elId.includes(accField) || 
                      elName.includes(accField) ||
                      (elText.includes('ad account') && !elText.includes('profile'))
                    );
                    
                    if (isAccountField) {
                      console.log(`[UAM Form Filler] Skipping account-related dropdown: id="${elId}", name="${elName}"`);
                      continue;
                    }
                    
                    visibleDropdown = el as HTMLElement;
                    console.log(`[UAM Form Filler] Found visible dropdown near hidden input using selector: ${selector}`);
                    break;
                  }
                  if (visibleDropdown) break;
                }
              }
              
              // If not found near input, search more broadly
              if (!visibleDropdown) {
                for (const selector of selectors) {
                  const elements = searchScope.querySelectorAll(selector);
                  for (const el of Array.from(elements)) {
                    const text = el.textContent?.toLowerCase() || '';
                    const elId = (el as HTMLElement).id?.toLowerCase() || '';
                    const elName = (el as HTMLElement).getAttribute('name')?.toLowerCase() || '';
                    const logicalNameLower = logicalFieldName.toLowerCase();
                    
                    // Skip account-related dropdowns
                    const isAccountField = ACCOUNT_FIELD_NAMES.some((accField: string) => 
                      elId.includes(accField) || 
                      elName.includes(accField) ||
                      (text.includes('ad account') && !text.includes('profile'))
                    );
                    
                    if (isAccountField) {
                      continue;
                    }
                    
                    // Check if element is near the input or contains logical field name keywords
                    if (text.includes(logicalNameLower) || 
                        el === input.nextElementSibling || 
                        el === input.previousElementSibling ||
                        (logicalFieldName === 'objectiveType' && (text.includes('objective') || text.includes('awareness') || text.includes('conversion') || text.includes('traffic')))) {
                      visibleDropdown = el as HTMLElement;
                      console.log(`[UAM Form Filler] Found visible dropdown using selector: ${selector}`);
                      break;
                    }
                  }
                  if (visibleDropdown) break;
                }
              }
            }
            
            if (!visibleDropdown) {
              const allButtons = searchScope.querySelectorAll('button, div[role="button"]');
              const logicalNameLower = logicalFieldName.toLowerCase();
              for (const btn of Array.from(allButtons)) {
                const btnText = btn.textContent?.toLowerCase() || '';
                const btnId = (btn as HTMLElement).id?.toLowerCase() || '';
                const btnName = (btn as HTMLElement).getAttribute('name')?.toLowerCase() || '';
                
                // Skip account-related buttons
                const isAccountField = ACCOUNT_FIELD_NAMES.some((accField: string) => 
                  btnId.includes(accField) || 
                  btnName.includes(accField) ||
                  (btnText.includes('ad account') && !btnText.includes('profile'))
                );
                
                if (isAccountField) {
                  continue;
                }
                
                // For objectiveType, check for specific keywords; for others, check if near the input or contains field name
                if ((logicalFieldName === 'objectiveType' && (btnText.includes('awareness') || btnText.includes('conversion') || btnText.includes('traffic') || btnText.includes('objective'))) ||
                    (logicalFieldName !== 'objectiveType' && (btnText.includes(logicalNameLower) || btn === input.nextElementSibling || btn === input.previousElementSibling))) {
                  visibleDropdown = btn as HTMLElement;
                  console.log(`[UAM Form Filler] Found visible dropdown by text content`);
                  break;
                }
              }
            }
            
            if (visibleDropdown) {
              // Final check: never open account dropdowns
              const dropdownText = visibleDropdown.textContent?.toLowerCase() || '';
              const dropdownId = visibleDropdown.id?.toLowerCase() || '';
              const dropdownName = visibleDropdown.getAttribute('name')?.toLowerCase() || '';
              const inputElement = visibleDropdown.querySelector('.react-select__input') as HTMLInputElement;
              const inputId = inputElement?.id?.toLowerCase() || '';
              const inputName = inputElement?.getAttribute('name')?.toLowerCase() || '';
              
              const isAccountField = ACCOUNT_FIELD_NAMES.some(accField => 
                dropdownId.includes(accField) || 
                dropdownName.includes(accField) ||
                inputId.includes(accField) ||
                inputName.includes(accField) ||
                (dropdownText.includes('ad account') && !dropdownText.includes('profile'))
              );
              
              if (isAccountField) {
                console.log(`[UAM Form Filler] ✗ Skipping account dropdown - id="${dropdownId}", name="${dropdownName}", text="${dropdownText.substring(0, 50)}"`);
                return false; // Return false to indicate we couldn't set the value
              }
              
              // Note: We already checked the visible dropdown state BEFORE setting the hidden input value
              // So we don't need to check again here - just proceed to open the dropdown
              console.log(`[UAM Form Filler] Opening dropdown...`);
              
              if (inputElement) {
                console.log(`[UAM Form Filler] Found react-select input element, attempting to open dropdown`);
                
                inputElement.focus();
                
                const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
                const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
                const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
                
                inputElement.dispatchEvent(mouseDownEvent);
                inputElement.dispatchEvent(mouseUpEvent);
                inputElement.dispatchEvent(clickEvent);
                
                const container = inputElement.closest('.react-select__input-container') || inputElement.parentElement;
                if (container) {
                  // Check if container is account-related before clicking
                  const containerText = (container as HTMLElement).textContent?.toLowerCase() || '';
                  const containerId = (container as HTMLElement).id?.toLowerCase() || '';
                  const isAccountContainer = ACCOUNT_FIELD_NAMES.some((accField: string) => 
                    containerId.includes(accField) ||
                    (containerText.includes('ad account') && !containerText.includes('profile'))
                  );
                  
                  if (!isAccountContainer) {
                    console.log(`[UAM Form Filler] Also clicking container`);
                    (container as HTMLElement).click();
                  } else {
                    console.log(`[UAM Form Filler] ✗ Skipping account container click`);
                    return false;
                  }
                }
                
                setTimeout(() => {
                  const keyDownEvent = new KeyboardEvent('keydown', { 
                    bubbles: true, 
                    cancelable: true, 
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                    keyCode: 40
                  });
                  inputElement.dispatchEvent(keyDownEvent);
                }, 50);
              } else {
                // Final check before clicking dropdown directly
                const finalCheckText = visibleDropdown.textContent?.toLowerCase() || '';
                const finalCheckId = visibleDropdown.id?.toLowerCase() || '';
                const finalCheckName = visibleDropdown.getAttribute('name')?.toLowerCase() || '';
                const isAccountFieldFinal = ACCOUNT_FIELD_NAMES.some((accField: string) => 
                  finalCheckId.includes(accField) || 
                  finalCheckName.includes(accField) ||
                  (finalCheckText.includes('ad account') && !finalCheckText.includes('profile'))
                );
                
                if (isAccountFieldFinal) {
                  console.log(`[UAM Form Filler] ✗ Skipping account dropdown click - id="${finalCheckId}", name="${finalCheckName}"`);
                  return false;
                }
                
                console.log(`[UAM Form Filler] No input element found, clicking container`);
                visibleDropdown.click();
              }
              
              const findAndClickOption = (attempt: number = 0) => {
                // Handle the value properly - if it's an object, extract label/value, otherwise convert to string
                let labelToFind = '';
                let valueToFind = '';
                if (typeof value === 'object' && value !== null) {
                  // Check if properties exist (even if empty string) - use 'in' operator or check for undefined/null
                  labelToFind = ('label' in value && value.label !== undefined && value.label !== null) ? String(value.label).toLowerCase() : '';
                  valueToFind = ('value' in value && value.value !== undefined && value.value !== null) ? String(value.value).toLowerCase() : '';
                } else {
                  labelToFind = String(value).toLowerCase();
                  valueToFind = String(value).toLowerCase();
                }
                // Fallback for empty values (shouldn't happen, but just in case)
                if (!labelToFind && !valueToFind) {
                  labelToFind = 'awareness';
                  valueToFind = 'awareness';
                }
                
                if (attempt === 0) {
                  console.log(`[UAM Form Filler] Searching for options with label="${labelToFind}", value="${valueToFind}"`);
                } else {
                  console.log(`[UAM Form Filler] Retry attempt ${attempt}: Searching for options...`);
                }
                
                const modal = input.closest('#create-modal') || document.querySelector('#create-modal');
                
                const menuSelectors = [
                  '[class*="react-select__menu"]',
                  '[class*="react-select__menu-list"]',
                  '[id*="react-select"]',
                  '[class*="Select-menu"]',
                  '.react-select__menu',
                ];
                
                let menuContainer: Element | null = null;
                
                // Search in modal first (for create pages), then in document (for edit pages)
                if (modal) {
                  for (const selector of menuSelectors) {
                    menuContainer = modal.querySelector(selector);
                    if (menuContainer) {
                      console.log(`[UAM Form Filler] Found menu container in modal using selector: ${selector}`);
                      break;
                    }
                  }
                }
                
                // Also search in document for edit pages
                if (!menuContainer) {
                  for (const selector of menuSelectors) {
                    menuContainer = document.querySelector(selector);
                    if (menuContainer) {
                      console.log(`[UAM Form Filler] Found menu container in document using selector: ${selector}`);
                      break;
                    }
                  }
                }
                
                if (!menuContainer) {
                  const dropdownParent = visibleDropdown.closest('div');
                  if (dropdownParent) {
                    for (const selector of menuSelectors) {
                      menuContainer = dropdownParent.querySelector(selector);
                      if (menuContainer) {
                        console.log(`[UAM Form Filler] Found menu container near dropdown using selector: ${selector}`);
                        break;
                      }
                    }
                  }
                }
                
                if (!menuContainer) {
                  for (const selector of menuSelectors) {
                    menuContainer = document.querySelector(selector);
                    if (menuContainer) {
                      const menuText = menuContainer.textContent?.toLowerCase() || '';
                      if (menuText.includes('awareness') || menuText.includes('conversion') || menuText.includes('traffic') || menuText.includes('objective')) {
                        console.log(`[UAM Form Filler] Found menu container using selector: ${selector} (verified by content)`);
                        break;
                      } else {
                        menuContainer = null;
                      }
                    }
                  }
                }
                
                if (!menuContainer) {
                  console.log(`[UAM Form Filler] No menu container found, searching for options directly...`);
                }
                
                const searchScope = menuContainer || (modal || document);
                
                let options: Element[] = [];
                
                const menuListSelectors = [
                  '.react-select__menu-list[role="listbox"]',
                  '[class*="react-select__menu-list"][role="listbox"]',
                  '[role="listbox"][class*="menu-list"]',
                  '[id*="react-select"][role="listbox"]',
                  '[id*="react-select-4-listbox"]',
                ];
                
                let menuList: Element | null = null;
                for (const selector of menuListSelectors) {
                  menuList = document.querySelector(selector);
                  if (menuList) {
                    console.log(`[UAM Form Filler] Found react-select menu-list using selector: ${selector}`);
                    break;
                  }
                }
                
                if (!menuList) {
                  console.log(`[UAM Form Filler] Searching entire document for any listbox...`);
                  const allListboxes = document.querySelectorAll('[role="listbox"]');
                  console.log(`[UAM Form Filler] Found ${allListboxes.length} listboxes in document`);
                  for (const lb of Array.from(allListboxes)) {
                    const classes = lb.classList.toString();
                    const id = lb.id || 'no-id';
                    console.log(`[UAM Form Filler] Listbox: id="${id}", classes="${classes.substring(0, 50)}"`);
                    if (classes.includes('react-select') || classes.includes('menu-list') || id.includes('react-select')) {
                      menuList = lb;
                      console.log(`[UAM Form Filler] Using this listbox`);
                      break;
                    }
                  }
                }
                
                if (menuList) {
                  const foundOptions = menuList.querySelectorAll('.react-select__option[role="option"]');
                  if (foundOptions.length > 0) {
                    console.log(`[UAM Form Filler] Found ${foundOptions.length} react-select options`);
                    options = Array.from(foundOptions);
                  } else {
                    console.log(`[UAM Form Filler] Menu list found but no options yet. Menu list content:`, menuList.innerHTML.substring(0, 200));
                  }
                } else {
                  console.log(`[UAM Form Filler] Menu list not found. Searching for options directly...`);
                  const directOptions = document.querySelectorAll('.react-select__option[role="option"]');
                  if (directOptions.length > 0) {
                    console.log(`[UAM Form Filler] Found ${directOptions.length} options directly in document`);
                    options = Array.from(directOptions);
                  }
                }
                
                if (options.length === 0) {
                  const optionSelectors = [
                    `div[class*="react-select__option"]`,
                    `div[role="option"]`,
                    `[class*="Option"]:not([class*="input-container"])`,
                    `[class*="option"]:not([class*="input-container"])`,
                  ];
                  
                  for (const selector of optionSelectors) {
                    const found = searchScope.querySelectorAll(selector);
                    const optionsWithText = Array.from(found).filter((opt: Element) => {
                      const text = opt.textContent?.trim() || '';
                      return text.length > 0 && !opt.classList.toString().includes('input-container');
                    });
                    if (optionsWithText.length > 0) {
                      console.log(`[UAM Form Filler] Found ${optionsWithText.length} options with text using selector: ${selector}`);
                      options = optionsWithText as Element[];
                      break;
                    }
                  }
                }
                
                if (options.length === 0) {
                  console.log(`[UAM Form Filler] No options found with standard selectors. Inspecting menu container...`);
                  if (menuContainer) {
                    const allElements = menuContainer.querySelectorAll('*');
                    console.log(`[UAM Form Filler] Menu container has ${allElements.length} child elements`);
                    for (let i = 0; i < Math.min(10, allElements.length); i++) {
                      const el = allElements[i];
                      const text = el.textContent?.trim() || '';
                      const classes = el.classList.toString();
                      const role = el.getAttribute('role') || 'none';
                      console.log(`[UAM Form Filler] Element ${i}: tag=${el.tagName}, role=${role}, classes=${classes.substring(0, 50)}, text="${text.substring(0, 30)}"`);
                    }
                  }
                  
                  console.log(`[UAM Form Filler] Searching in modal and document for options with text "awareness", "conversion", or "traffic"...`);
                  
                  const searchInDocument = () => {
                    const allElements = document.querySelectorAll('*');
                    for (const el of Array.from(allElements)) {
                      const text = (el.textContent?.toLowerCase() || '').trim();
                      if (text === 'awareness' || text === 'conversion' || text === 'traffic' || 
                          (text.length > 0 && text.length < 50 && (text.includes('awareness') || text.includes('conversion') || text.includes('traffic')))) {
                        const classes = el.classList.toString();
                        const isReactSelect = classes.includes('react-select') || classes.includes('Select') || classes.includes('option');
                        const isClickable = el.tagName === 'DIV' || el.tagName === 'SPAN' || el.tagName === 'LI' || el.getAttribute('role') === 'option';
                        const isInPortal = el.closest('[id*="react-select"]') || el.closest('[class*="react-select__menu"]');
                        
                        if ((isReactSelect || isClickable) && (modal?.contains(el) || isInPortal)) {
                          console.log(`[UAM Form Filler] Found potential option: "${el.textContent}", tag=${el.tagName}, classes=${classes.substring(0, 50)}`);
                          options.push(el);
                        }
                      }
                    }
                    console.log(`[UAM Form Filler] Found ${options.length} potential options by searching document`);
                  };
                  
                  searchInDocument();
                  
                  if (options.length === 0) {
                    console.log(`[UAM Form Filler] Waiting 200ms more for menu to appear...`);
                    setTimeout(() => {
                      searchInDocument();
                      if (options.length > 0) {
                        console.log(`[UAM Form Filler] Found ${options.length} options after waiting`);
                      }
                    }, 200);
                  }
                }
                
                if (options.length > 0) {
                  console.log(`[UAM Form Filler] Checking ${options.length} options...`);
                  console.log(`[UAM Form Filler] Looking for label="${labelToFind}", value="${valueToFind}"`);
                  
                  // Log all available options for debugging
                  console.log(`[UAM Form Filler] Available options:`);
                  options.forEach((opt, idx) => {
                    const optText = (opt.textContent?.toLowerCase() || '').trim();
                    const optValue = (opt.getAttribute('data-value') || opt.getAttribute('value') || opt.getAttribute('id') || '').toLowerCase();
                    console.log(`[UAM Form Filler]   Option ${idx + 1}: text="${opt.textContent?.trim()}", value="${optValue}"`);
                  });
                  
                  let matchedOption: Element | null = null;
                  
                  for (const option of options) {
                    const optionText = (option.textContent?.toLowerCase() || '').trim();
                    const optionValue = (option.getAttribute('data-value') || option.getAttribute('value') || option.getAttribute('id') || '').toLowerCase();
                    
                    // Match based on label or value from formData
                    // Try exact match first, then partial match
                    const matchesLabelExact = labelToFind && labelToFind.length > 0 && optionText === labelToFind;
                    const matchesValueExact = valueToFind && valueToFind.length > 0 && optionValue === valueToFind;
                    const matchesLabelPartial = labelToFind && labelToFind.length > 0 && optionText.includes(labelToFind);
                    const matchesValuePartial = valueToFind && valueToFind.length > 0 && (optionValue.includes(valueToFind) || optionValue.replace(/[_-]/g, '').includes(valueToFind.replace(/[_-]/g, '')));
                    // Also check if option text contains the value (for partial matches)
                    const matchesValueInText = valueToFind && valueToFind.length > 0 && optionText.includes(valueToFind);
                    // Handle underscore/camelCase variations (e.g., "LEARN_MORE" vs "learn more" vs "Learn More")
                    const normalizedValueToFind = valueToFind.replace(/[_-]/g, ' ').toLowerCase();
                    const normalizedOptionText = optionText.replace(/[_-]/g, ' ');
                    const normalizedOptionValue = optionValue.replace(/[_-]/g, ' ');
                    const matchesNormalized = normalizedValueToFind.length > 0 && (
                      normalizedOptionText.includes(normalizedValueToFind) || 
                      normalizedOptionValue.includes(normalizedValueToFind)
                    );
                    
                    if (matchesLabelExact || matchesValueExact || matchesLabelPartial || matchesValuePartial || matchesValueInText || matchesNormalized) {
                      matchedOption = option;
                      console.log(`[UAM Form Filler] ✓ Match found! Clicking option: "${option.textContent?.trim()}"`);
                      console.log(`[UAM Form Filler]   Match details: labelExact=${matchesLabelExact}, valueExact=${matchesValueExact}, labelPartial=${matchesLabelPartial}, valuePartial=${matchesValuePartial}, valueInText=${matchesValueInText}, normalized=${matchesNormalized}`);
                      break;
                    }
                  }
                  
                  if (matchedOption) {
                    (matchedOption as HTMLElement).click();
                      
                    setTimeout(() => {
                      const hiddenInput = document.querySelector(`input[name="${input.name}"]`) as HTMLInputElement;
                      if (hiddenInput) {
                        console.log(`[UAM Form Filler] Hidden input value after click: ${hiddenInput.value}`);
                      }
                      
                      // Close the dropdown by blurring the input element
                      // Try to use the inputElement from closure, or find it again
                      let elementToBlur = inputElement;
                      if (!elementToBlur && visibleDropdown) {
                        elementToBlur = visibleDropdown.querySelector('.react-select__input') as HTMLInputElement;
                      }
                      if (!elementToBlur) {
                        // Fallback: find by ID or other selectors
                        elementToBlur = document.querySelector('.react-select__input[id*="react-select"]') as HTMLInputElement;
                      }
                      
                      // Close the dropdown using multiple methods
                      if (elementToBlur) {
                        console.log(`[UAM Form Filler] Blurring dropdown input to close menu`);
                        elementToBlur.blur();
                        
                        // Also dispatch Escape key to ensure dropdown closes
                        const escapeEvent = new KeyboardEvent('keydown', {
                          bubbles: true,
                          cancelable: true,
                          key: 'Escape',
                          code: 'Escape',
                          keyCode: 27
                        });
                        elementToBlur.dispatchEvent(escapeEvent);
                        
                        // Blur any parent containers as well
                        const container = elementToBlur.closest('.react-select__control') || 
                                        elementToBlur.closest('[class*="react-select"]');
                        if (container) {
                          (container as HTMLElement).blur();
                        }
                      }
                      
                      // Always click outside to ensure dropdown closes (most reliable method)
                      setTimeout(() => {
                        console.log(`[UAM Form Filler] Clicking outside dropdown to ensure it closes`);
                        const modal = document.querySelector('#create-modal');
                        const backdrop = modal?.parentElement || document.body;
                        backdrop.click();
                        document.body.click();
                      }, 100);
                    }, 200);
                    
                    return;
                  } else {
                    console.log(`[UAM Form Filler] ✗ No matching option found for label="${labelToFind}", value="${valueToFind}"`);
                    console.log(`[UAM Form Filler] Available options were:`, options.map(opt => `"${opt.textContent?.trim()}"`).join(', '));
                    
                    // Special handling: if looking for "__FIRST_OPTION__" (profile field), select the first non-"None" option
                    if (valueToFind === '__first_option__' && options.length > 0) {
                      // Skip "None" option if it exists, otherwise use first option
                      let firstOption = options[0];
                      for (const opt of options) {
                        const optText = (opt.textContent?.toLowerCase() || '').trim();
                        if (optText !== 'none') {
                          firstOption = opt;
                          break;
                        }
                      }
                      console.log(`[UAM Form Filler] Selecting first available option (skipping "None"): "${firstOption.textContent?.trim()}"`);
                      (firstOption as HTMLElement).click();
                      
                      setTimeout(() => {
                        const hiddenInput = document.querySelector(`input[name="${input.name}"]`) as HTMLInputElement;
                        if (hiddenInput) {
                          console.log(`[UAM Form Filler] Hidden input value after click: ${hiddenInput.value}`);
                        }
                        
                        // Close the dropdown using multiple methods
                        let elementToBlur = inputElement;
                        if (!elementToBlur && visibleDropdown) {
                          elementToBlur = visibleDropdown.querySelector('.react-select__input') as HTMLInputElement;
                        }
                        if (!elementToBlur) {
                          elementToBlur = document.querySelector('.react-select__input[id*="react-select"]') as HTMLInputElement;
                        }
                        if (elementToBlur) {
                          elementToBlur.blur();
                          const escapeEvent = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            key: 'Escape',
                            code: 'Escape',
                            keyCode: 27
                          });
                          elementToBlur.dispatchEvent(escapeEvent);
                          const container = elementToBlur.closest('.react-select__control') || 
                                          elementToBlur.closest('[class*="react-select"]');
                          if (container) {
                            (container as HTMLElement).blur();
                          }
                        }
                        
                        // Also click outside to ensure dropdown closes
                        setTimeout(() => {
                          const modal = document.querySelector('#create-modal');
                          const backdrop = modal?.parentElement || document.body;
                          backdrop.click();
                          document.body.click();
                        }, 100);
                      }, 200);
                      
                      return;
                    }
                    
                    // Don't retry if we've already tried multiple times
                    if (attempt >= 3) {
                      console.log(`[UAM Form Filler] Giving up after ${attempt + 1} attempts - no match found`);
                    }
                  }
                } else {
                  console.log(`[UAM Form Filler] No options found. Available elements in menu:`, menuContainer?.querySelectorAll('*').length || 0);
                  
                  if (attempt < 5) {
                    const delay = (attempt + 1) * 200;
                    console.log(`[UAM Form Filler] Retrying in ${delay}ms...`);
                    setTimeout(() => findAndClickOption(attempt + 1), delay);
                  } else {
                    console.log(`[UAM Form Filler] Giving up after ${attempt} attempts`);
                  }
                }
              };
              
              setTimeout(() => findAndClickOption(0), 300);
            } else {
              console.log(`[UAM Form Filler] No visible dropdown found for objectiveType`);
            }
          };
          
          findAndClickDropdown();
        }
        
      } else if (inputType === 'checkbox' || inputType === 'radio') {
        // For radio buttons, we need to find the correct one in the group
        if (inputType === 'radio') {
          const radioName = input.name;
          const valueToSet = String(value).toUpperCase(); // Normalize to uppercase for status values
          console.log(`[UAM Form Filler] Looking for radio button with name="${radioName}" and value matching "${valueToSet}"`);
          
          // Find all radio buttons in the same group
          const radioGroup = document.querySelectorAll(`input[type="radio"][name="${radioName}"]`);
          let foundMatch = false;
          
          for (const radio of Array.from(radioGroup)) {
            const radioInput = radio as HTMLInputElement;
            const radioValue = radioInput.value?.toUpperCase() || '';
            console.log(`[UAM Form Filler] Checking radio button: value="${radioInput.value}", matches="${radioValue === valueToSet}"`);
            
            if (radioValue === valueToSet || radioInput.value === value) {
              console.log(`[UAM Form Filler] Found matching radio button, clicking it`);
              radioInput.checked = true;
              radioInput.dispatchEvent(new Event('input', { bubbles: true }));
              radioInput.dispatchEvent(new Event('change', { bubbles: true }));
              radioInput.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              foundMatch = true;
              break;
            }
          }
          
          if (!foundMatch) {
            console.log(`[UAM Form Filler] No matching radio button found for value "${valueToSet}", trying first unchecked approach`);
            // Fallback: just check the first one if no match found
            input.checked = Boolean(value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } else {
          // Checkbox handling
          input.checked = Boolean(value);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (inputType === 'number') {
        const valueToSet = String(value);
        // Use native setter to bypass React's controlled component
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, valueToSet);
        } else {
          input.value = valueToSet;
        }
        
        // Trigger React events
        input.focus();
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true });
        Object.defineProperty(changeEvent, 'target', { value: input, enumerable: true });
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
        input.blur();
      } else {
        // Text input - simulate typing character by character to trigger React handlers
        const valueToSet = String(value);
        console.log(`[UAM Form Filler] Setting text input value to: "${valueToSet}"`);
        
        // Focus and clear the input
        input.focus();
        input.select();
        
        // Try to find React Fiber using getOwnPropertyNames (non-enumerable keys)
        console.log(`[UAM Form Filler] Searching for React Fiber using getOwnPropertyNames...`);
        let elementToCheck: HTMLElement | null = input;
        for (let i = 0; i < 10 && elementToCheck; i++) {
          const allProps = Object.getOwnPropertyNames(elementToCheck);
          const reactKeys = allProps.filter(key => 
            key.startsWith('__reactFiber') || 
            key.startsWith('__reactInternalInstance') ||
            key.startsWith('__reactContainer')
          );
          
          if (reactKeys.length > 0) {
            console.log(`[UAM Form Filler] Found React keys at level ${i}:`, reactKeys);
            const reactKey = reactKeys[0];
            const fiber = (elementToCheck as any)[reactKey];
            
            if (fiber) {
              console.log(`[UAM Form Filler] Found React Fiber! Searching for onBlur...`);
              // Search for onBlur handler
              let node = fiber;
              for (let j = 0; j < 20 && node; j++) {
                if (node.memoizedProps && typeof node.memoizedProps.onBlur === 'function') {
                  console.log(`[UAM Form Filler] Found onBlur handler! Calling it...`);
                  // Create synthetic event
                  const syntheticEvent = {
                    target: input,
                    currentTarget: input,
                    type: 'blur',
                    bubbles: true,
                    cancelable: true,
                    nativeEvent: new FocusEvent('blur', { bubbles: true, cancelable: true }),
                    isDefaultPrevented: () => false,
                    isPropagationStopped: () => false,
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    persist: () => {}
                  };
                  // Ensure target.value is set
                  Object.defineProperty(syntheticEvent.target, 'value', { 
                    value: valueToSet, 
                    writable: true, 
                    configurable: true 
                  });
                  node.memoizedProps.onBlur(syntheticEvent);
                  console.log(`[UAM Form Filler] Called onBlur handler directly with value: "${valueToSet}"`);
                  break;
                }
                // Also check for setValues
                if (node.memoizedProps && typeof node.memoizedProps.setValues === 'function') {
                  console.log(`[UAM Form Filler] Found setValues! Calling it...`);
                  node.memoizedProps.setValues(() => ({ name: valueToSet }), { onDone: () => {} });
                  console.log(`[UAM Form Filler] Called setValues with value: "${valueToSet}"`);
                  break;
                }
                node = node.return;
              }
              break;
            }
          }
          
          elementToCheck = elementToCheck.parentElement;
        }
        
        if (!elementToCheck) {
          console.log(`[UAM Form Filler] No React Fiber found in parent chain`);
        }
        
        // The component uses react-hook-form, so we need to update the form state
        // Try to find react-hook-form's form instance via the input's name
        const inputName = input.name || input.getAttribute('name') || input.id;
        console.log(`[UAM Form Filler] Input name: "${inputName}"`);
        
        // react-hook-form stores form state - try to find FormProvider
        const formElement = input.closest('form');
        if (formElement) {
          console.log(`[UAM Form Filler] Found form element, searching for react-hook-form...`);
          const formProps = Object.getOwnPropertyNames(formElement);
          const formReactKey = formProps.find(key => key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance'));
          if (formReactKey) {
            console.log(`[UAM Form Filler] Found React on form`);
            const formFiber = (formElement as any)[formReactKey];
            // Search for react-hook-form's FormProvider
            let node = formFiber;
            for (let i = 0; i < 30 && node; i++) {
              if (node.memoizedProps) {
                const props = node.memoizedProps;
                // Check if this is a FormProvider (react-hook-form)
                if (props.value && typeof props.value.setValue === 'function') {
                  console.log(`[UAM Form Filler] Found react-hook-form setValue!`);
                  props.value.setValue(inputName, valueToSet, { shouldValidate: false, shouldDirty: true });
                  console.log(`[UAM Form Filler] Called react-hook-form setValue for "${inputName}"`);
                  break;
                }
              }
              node = node.return;
            }
          }
        }
        
        // Wait for focus, then set value using methods React recognizes
        setTimeout(() => {
          // Try using setRangeText which React might recognize better
          try {
            input.focus();
            input.setSelectionRange(0, input.value.length);
            input.setRangeText(valueToSet, 0, input.value.length, 'end');
            console.log(`[UAM Form Filler] Used setRangeText to set value`);
            
            // Trigger events
            const inputEvent = new InputEvent('input', {
              bubbles: true,
              cancelable: true,
              inputType: 'insertText',
              data: valueToSet
            });
            Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true });
            Object.defineProperty(inputEvent, 'currentTarget', { value: input, enumerable: true });
            input.dispatchEvent(inputEvent);
            
            // Wait for input to process
            setTimeout(() => {
              const changeEvent = new Event('change', { bubbles: true, cancelable: true });
              Object.defineProperty(changeEvent, 'target', { value: input, enumerable: true });
              Object.defineProperty(changeEvent, 'currentTarget', { value: input, enumerable: true });
              input.dispatchEvent(changeEvent);
              
              // Wait longer for React to process, then blur
              setTimeout(() => {
                // Ensure value is still set
                if (input.value !== valueToSet) {
                  input.setRangeText(valueToSet, 0, input.value.length, 'end');
                }
                
                console.log(`[UAM Form Filler] Value before blur: "${input.value}"`);
                
                // Try focusout first (sometimes React listens to this instead of blur)
                const focusoutEvent = new FocusEvent('focusout', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  relatedTarget: document.body
                });
                Object.defineProperty(focusoutEvent, 'target', { value: input, enumerable: true });
                Object.defineProperty(focusoutEvent, 'currentTarget', { value: input, enumerable: true });
                input.dispatchEvent(focusoutEvent);
                
                // Then blur
                input.blur();
                const blurEvent = new FocusEvent('blur', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  relatedTarget: document.body
                });
                Object.defineProperty(blurEvent, 'target', { value: input, enumerable: true });
                Object.defineProperty(blurEvent, 'currentTarget', { value: input, enumerable: true });
                input.dispatchEvent(blurEvent);
                
                // Also click outside to ensure blur happens naturally
                setTimeout(() => {
                  document.body.click();
                  console.log(`[UAM Form Filler] Dispatched blur after setRangeText. Final value: "${input.value}"`);
                }, 50);
              }, 300);
            }, 100);
            
            return; // Exit early if setRangeText worked
          } catch (e) {
            console.log(`[UAM Form Filler] setRangeText failed, falling back to typing: ${e}`);
          }
          
          // Fallback: Clear the input and type character by character
          input.value = '';
          
          // Type each character with proper events
          const typeCharacter = (index: number) => {
            if (index >= valueToSet.length) {
              // Finished typing, wait then blur
              setTimeout(() => {
                // Ensure value is set
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                if (nativeInputValueSetter) {
                  nativeInputValueSetter.call(input, valueToSet);
                } else {
                  input.value = valueToSet;
                }
                
                // Trigger change event before blur
                const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                Object.defineProperty(changeEvent, 'target', { value: input, enumerable: true });
                input.dispatchEvent(changeEvent);
                
                // Wait a bit for change to process
                setTimeout(() => {
                  // Click outside to trigger blur naturally
                  const clickOutside = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 0,
                    clientY: 0
                  });
                  document.body.dispatchEvent(clickOutside);
                  
                  // Also dispatch blur
                  input.blur();
                  const blurEvent = new FocusEvent('blur', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  Object.defineProperty(blurEvent, 'target', { value: input, enumerable: true });
                  input.dispatchEvent(blurEvent);
                  
                  console.log(`[UAM Form Filler] Finished typing and blurred. Final value: "${input.value}"`);
                }, 150);
              }, 100);
              return;
            }
            
            const char = valueToSet[index];
            const currentValue = valueToSet.substring(0, index + 1);
            
            // Set value
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(input, currentValue);
            } else {
              input.value = currentValue;
            }
            
            // Dispatch keyboard and input events for this character
            const keydownEvent = new KeyboardEvent('keydown', {
              bubbles: true,
              cancelable: true,
              key: char,
              code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
              keyCode: char.charCodeAt(0),
              which: char.charCodeAt(0)
            });
            
            const keypressEvent = new KeyboardEvent('keypress', {
              bubbles: true,
              cancelable: true,
              key: char,
              code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
              keyCode: char.charCodeAt(0),
              charCode: char.charCodeAt(0),
              which: char.charCodeAt(0)
            });
            
            const inputEvent = new InputEvent('input', {
              bubbles: true,
              cancelable: true,
              inputType: 'insertText',
              data: char
            });
            Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true });
            Object.defineProperty(inputEvent, 'currentTarget', { value: input, enumerable: true });
            
            const keyupEvent = new KeyboardEvent('keyup', {
              bubbles: true,
              cancelable: true,
              key: char,
              code: char === ' ' ? 'Space' : `Key${char.toUpperCase()}`,
              keyCode: char.charCodeAt(0),
              which: char.charCodeAt(0)
            });
            
            input.dispatchEvent(keydownEvent);
            input.dispatchEvent(keypressEvent);
            input.dispatchEvent(inputEvent);
            input.dispatchEvent(keyupEvent);
            
            // Continue with next character
            setTimeout(() => typeCharacter(index + 1), 20);
          };
          
          // Start typing
          typeCharacter(0);
        }, 50);
      }
      
    } else if (tagName === 'select') {
      const select = element as HTMLSelectElement;
      const valueToSet = typeof value === 'object' && value.value ? String(value.value) : String(value);
      
      console.log(`[UAM Form Filler] Setting select value to: ${valueToSet}`);
      console.log(`[UAM Form Filler] Current select value: ${select.value}`);
      console.log(`[UAM Form Filler] Available options:`, Array.from(select.options).map(opt => ({ value: opt.value, text: opt.text })));
      
      if (select.value !== valueToSet) {
        select.value = valueToSet;
        
        if (select.value !== valueToSet) {
          console.log(`[UAM Form Filler] Warning: Select value didn't change. Trying to find option by text...`);
          const option = Array.from(select.options).find(opt => 
            opt.value === valueToSet || 
            opt.text.toLowerCase().includes(String(value).toLowerCase()) ||
            (typeof value === 'object' && value.label && opt.text.toLowerCase().includes(value.label.toLowerCase()))
          );
          
          if (option) {
            select.value = option.value;
            console.log(`[UAM Form Filler] Found matching option: ${option.value} - ${option.text}`);
          } else {
            console.log(`[UAM Form Filler] No matching option found for value: ${valueToSet}`);
          }
        }
      }
      
      select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      select.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      
      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      Object.defineProperty(changeEvent, 'target', { value: select, enumerable: true });
      select.dispatchEvent(changeEvent);
      
    } else if (tagName === 'textarea') {
      const textarea = element as HTMLTextAreaElement;
      textarea.value = String(value);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      
    } else {
      element.textContent = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    return true;
  } catch (error) {
    console.error(`[UAM Form Filler] Error setting value on ${tagName}:`, error);
    return false;
  }
}

function findAndSetInput(name: string, value: any): boolean {
  console.log(`[UAM Form Filler] Looking for field: ${name}`);
  let element = findInputByName(name);
  
  if (!element && name === 'objectiveType') {
    console.log(`[UAM Form Filler] objectiveType not found as standard input, trying custom dropdown...`);
    const modal = document.querySelector('#create-modal');
    if (modal) {
      // First, try to find hidden input for objective
      const hiddenObjectiveInput = modal.querySelector('input[name="objective"], input[name="objective_type"], input[name="campaignObjective"], input[name="campaign_objective"]') as HTMLInputElement;
      if (hiddenObjectiveInput) {
        console.log(`[UAM Form Filler] Found hidden objective input: ${hiddenObjectiveInput.name}`);
        element = hiddenObjectiveInput;
      } else {
        // Try to find by label
        const labels = Array.from(modal.querySelectorAll('label, div, span')).filter(el => {
          const text = el.textContent?.toLowerCase() || '';
          return (text.includes('objective') || text.includes('goal')) && 
                 (el.tagName === 'LABEL' || el.classList.toString().includes('label'));
        });
        
        console.log(`[UAM Form Filler] Found ${labels.length} potential objective labels`);
        
        for (const label of labels) {
          console.log(`[UAM Form Filler] Checking label: ${label.textContent?.trim()}`);
          
          let associatedInput = label.querySelector('input, select, [role="combobox"], [role="listbox"]');
          if (!associatedInput && label.getAttribute('for')) {
            associatedInput = document.querySelector(`#${label.getAttribute('for')}`);
          }
          if (!associatedInput) {
            associatedInput = label.nextElementSibling as HTMLElement;
          }
          if (!associatedInput && label.parentElement) {
            associatedInput = label.parentElement.querySelector('input, select, [role="combobox"], [role="listbox"]') as HTMLElement;
          }
          
          if (associatedInput) {
            console.log(`[UAM Form Filler] Found objectiveType via label: ${label.textContent?.trim()}, element: ${associatedInput.tagName}`);
            element = associatedInput as HTMLElement;
            break;
          }
        }
        
        if (!element) {
          console.log(`[UAM Form Filler] Trying to find by text content...`);
          const allElements = modal.querySelectorAll('*');
          for (const el of Array.from(allElements)) {
            const text = el.textContent?.toLowerCase() || '';
            if (text.includes('awareness') || text.includes('conversion') || text.includes('traffic')) {
              const parent = el.closest('[role="combobox"], [role="listbox"], .select, [class*="select"], [class*="dropdown"]');
              if (parent) {
                console.log(`[UAM Form Filler] Found potential dropdown container`);
                element = parent as HTMLElement;
                break;
              }
            }
          }
        }
      }
    }
  }
  
  if (!element) {
    console.log(`[UAM Form Filler] Input not found for field: ${name}`);
    
    const modal = document.querySelector('#create-modal');
    if (modal) {
      const allInputs = modal.querySelectorAll('input, select, textarea, [role="combobox"], [role="listbox"]');
      console.log(`[UAM Form Filler] Available inputs in modal (${allInputs.length}):`);
      allInputs.forEach((input, index) => {
        const htmlInput = input as HTMLElement;
        const nameAttr = htmlInput.getAttribute('name') || htmlInput.id || 'no-name';
        const type = (htmlInput as HTMLInputElement).type || htmlInput.tagName.toLowerCase();
        const role = htmlInput.getAttribute('role') || 'none';
        console.log(`  ${index + 1}. name="${nameAttr}", type="${type}", id="${htmlInput.id}", role="${role}"`);
      });
    }
    
    return false;
  }

  return setInputValue(element, value);
}

function checkSkipCheckbox(skipType: 'adgroup' | 'ad'): boolean {
  const modal = document.querySelector('#create-modal');
  if (!modal) return false;

  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  
  for (const checkbox of Array.from(checkboxes)) {
    const label = checkbox.closest('label') || 
                  checkbox.parentElement?.querySelector('label') ||
                  document.querySelector(`label[for="${checkbox.id}"]`);
    
    const labelText = (label?.textContent?.toLowerCase() || '').trim();
    const checkboxId = checkbox.id?.toLowerCase() || '';
    const checkboxName = checkbox.getAttribute('name')?.toLowerCase() || '';
    
    const allText = `${labelText} ${checkboxId} ${checkboxName}`.toLowerCase();
    
    let matches = false;
    
    if (skipType === 'adgroup') {
      // For adgroup: must contain "skip" AND ("adgroup" OR "ad group") AND NOT just "ad" alone
      matches = allText.includes('skip') && 
                (allText.includes('adgroup') || allText.includes('ad group')) &&
                !(allText.includes('skip ad') && !allText.includes('group'));
    } else {
      // For ad: must contain "skip" AND "ad" BUT NOT "adgroup" or "ad group"
      matches = allText.includes('skip') && 
                allText.includes('ad') &&
                !allText.includes('adgroup') &&
                !allText.includes('ad group');
    }
    
    if (matches) {
      const isChecked = (checkbox as HTMLInputElement).checked;
      console.log(`[UAM Form Filler] Found "${skipType}" skip checkbox: checked=${isChecked}, label="${labelText}"`);
      return isChecked;
    }
  }

  console.log(`[UAM Form Filler] "${skipType}" skip checkbox not found, assuming not skipped`);
  return false;
}

function checkUseExisting(entityType: 'campaign' | 'adgroup' | 'ad'): boolean {
  const modal = document.querySelector('#create-modal');
  if (!modal) return false;

  // Check radio buttons first (common for "new" vs "existing" selection)
  const radioButtons = modal.querySelectorAll('input[type="radio"]');
  
  for (const radio of Array.from(radioButtons)) {
    const label = radio.closest('label') || 
                  radio.parentElement?.querySelector('label') ||
                  document.querySelector(`label[for="${radio.id}"]`);
    
    const labelText = (label?.textContent?.toLowerCase() || '').trim();
    const radioId = radio.id?.toLowerCase() || '';
    const radioName = radio.getAttribute('name')?.toLowerCase() || '';
    const radioValue = (radio as HTMLInputElement).value?.toLowerCase() || '';
    
    const allText = `${labelText} ${radioId} ${radioName} ${radioValue}`.toLowerCase();
    
    // Check if this radio button indicates "use existing" for the specific entity type
    let matchesEntity = false;
    if (entityType === 'campaign') {
      // For campaign: look for campaign-related "use existing" or check campaignUpsert field
      matchesEntity = (allText.includes('campaign') || radioName.includes('campaign') || radioName.includes('upsert')) &&
                      ((allText.includes('use') && allText.includes('existing')) ||
                       allText.includes('existing') ||
                       radioValue === 'existing' ||
                       radioValue === 'use-existing');
    } else if (entityType === 'adgroup') {
      // For adgroup: look for adgroup-related "use existing"
      matchesEntity = (allText.includes('adgroup') || allText.includes('ad group')) &&
                      ((allText.includes('use') && allText.includes('existing')) ||
                       allText.includes('existing'));
    } else if (entityType === 'ad') {
      // For ad: look for ad-related "use existing" (but not adgroup)
      matchesEntity = allText.includes('ad') &&
                      !allText.includes('adgroup') &&
                      !allText.includes('ad group') &&
                      ((allText.includes('use') && allText.includes('existing')) ||
                       allText.includes('existing'));
    }
    
    if (matchesEntity) {
      const isChecked = (radio as HTMLInputElement).checked;
      console.log(`[UAM Form Filler] Found "${entityType}" use existing radio: checked=${isChecked}, label="${labelText}", value="${radioValue}"`);
      return isChecked;
    }
  }

  // Also check checkboxes (in case it's a checkbox instead of radio)
  const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
  
  for (const checkbox of Array.from(checkboxes)) {
    const label = checkbox.closest('label') || 
                  checkbox.parentElement?.querySelector('label') ||
                  document.querySelector(`label[for="${checkbox.id}"]`);
    
    const labelText = (label?.textContent?.toLowerCase() || '').trim();
    const checkboxId = checkbox.id?.toLowerCase() || '';
    const checkboxName = checkbox.getAttribute('name')?.toLowerCase() || '';
    
    const allText = `${labelText} ${checkboxId} ${checkboxName}`.toLowerCase();
    
    let matchesEntity = false;
    if (entityType === 'campaign') {
      matchesEntity = (allText.includes('campaign') || checkboxName.includes('campaign')) &&
                      (allText.includes('use') && allText.includes('existing')) &&
                      !allText.includes('skip');
    } else if (entityType === 'adgroup') {
      matchesEntity = (allText.includes('adgroup') || allText.includes('ad group')) &&
                      (allText.includes('use') && allText.includes('existing')) &&
                      !allText.includes('skip');
    } else if (entityType === 'ad') {
      matchesEntity = allText.includes('ad') &&
                      !allText.includes('adgroup') &&
                      !allText.includes('ad group') &&
                      (allText.includes('use') && allText.includes('existing')) &&
                      !allText.includes('skip');
    }
    
    if (matchesEntity) {
      const isChecked = (checkbox as HTMLInputElement).checked;
      console.log(`[UAM Form Filler] Found "${entityType}" use existing checkbox: checked=${isChecked}, label="${labelText}"`);
      return isChecked;
    }
  }

  // Special check for campaignUpsert field value (only for campaign)
  if (entityType === 'campaign') {
    const campaignUpsertInput = modal.querySelector('input[name="campaignUpsert"], input[name="campaign_upsert"], input[id*="campaignUpsert"]') as HTMLInputElement;
    if (campaignUpsertInput) {
      const value = campaignUpsertInput.value?.toLowerCase() || '';
      if (value === 'existing' || value === 'use-existing' || value === 'use_existing') {
        console.log(`[UAM Form Filler] Found campaign "use existing" via campaignUpsert field: value="${value}"`);
        return true;
      }
    }
  }

  console.log(`[UAM Form Filler] "${entityType}" use existing not found, assuming creating new`);
  return false;
}

export function fillForm(formData: Record<string, any>): { success: boolean; error?: string } {
  const modal = document.querySelector('#create-modal');
  if (!modal) {
    const error = 'Create modal not found. Please open the create campaign modal first.';
    console.error(`[UAM Form Filler] ${error}`);
    return { success: false, error };
  }

  console.log('[UAM Form Filler] Filling form with data:', formData);

  // Check "use existing" for campaign and adgroup (no "use existing" for ads)
  const useExistingCampaign = checkUseExisting('campaign');
  const useExistingAdgroup = checkUseExisting('adgroup');
  
  // Check skip checkboxes
  const skipAdgroup = checkSkipCheckbox('adgroup');
  const skipAd = checkSkipCheckbox('ad');

  const filteredFormData: Record<string, any> = { ...formData };

  // Campaign section: if "use existing" is selected, skip campaign fields
  if (useExistingCampaign) {
    console.log('[UAM Form Filler] Campaign "use existing" is selected, skipping campaign fields');
    delete filteredFormData.campaignUpsert;
    delete filteredFormData.campaignName;
    delete filteredFormData.objectiveType;
  }

  // Adgroup section: skip if "use existing" OR "skip" is checked
  if (useExistingAdgroup || skipAdgroup) {
    if (useExistingAdgroup) {
      console.log('[UAM Form Filler] Adgroup "use existing" is selected, skipping adgroupName');
    }
    if (skipAdgroup) {
      console.log('[UAM Form Filler] Skip adgroup is checked, skipping adgroupName');
    }
    delete filteredFormData.adgroupName;
  }

  // Ad section: skip only if "skip" checkbox is checked (no "use existing" option for ads)
  if (skipAd) {
    console.log('[UAM Form Filler] Skip ad is checked, skipping adName');
    delete filteredFormData.adName;
  }

  const errors: string[] = [];
  const successes: string[] = [];
  const skippedFields: string[] = [];

  // Fields to skip - these are automatically filled and shouldn't be touched
  const skipFields = ['account', 'account_id', 'accountId', 'account-id'];
  
  Object.entries(filteredFormData).forEach(([key, value]) => {
    // Skip account-related fields - they're automatically filled
    if (skipFields.some(skipField => key.toLowerCase().includes(skipField.toLowerCase()))) {
      console.log(`[UAM Form Filler] Skipping field "${key}" - account fields are automatically filled`);
      skippedFields.push(key);
      return;
    }
    
    // Check if field already has a value before attempting to fill
    const element = findInputByName(key);
    if (element) {
      const currentValue = getFieldValue(element);
      console.log(`[UAM Form Filler] Field "${key}" current value: "${currentValue}"`);
      
      // Special handling for objectiveType - check visible dropdown state
      if (key === 'objectiveType' || key === 'objective' || key === 'objective_type') {
        const input = element as HTMLInputElement;
        if (input.type === 'hidden') {
          // Check hidden input value
          const hiddenValue = input.value?.trim() || '';
          if (hiddenValue && hiddenValue !== '') {
            console.log(`[UAM Form Filler] Field "${key}" already has value in hidden input: "${hiddenValue}", skipping`);
            skippedFields.push(key);
            return;
          }
          
          // Check visible dropdown state
          const modal = input.closest('#create-modal') || document.querySelector('#create-modal');
          const searchScope = modal || document;
          const reactSelectInputs = searchScope.querySelectorAll('.react-select__input[role="combobox"]');
          for (const reactSelectInput of Array.from(reactSelectInputs)) {
            const container = reactSelectInput.closest('.react-select__control');
            if (container) {
              const label = container.closest('div')?.querySelector('label');
              const labelText = label?.textContent?.toLowerCase() || '';
              if (labelText.includes('objective') || labelText.includes('goal')) {
                const singleValue = container.querySelector('.react-select__single-value');
                if (singleValue) {
                  const selectedText = singleValue.textContent?.trim() || '';
                  if (selectedText && selectedText !== '' && selectedText.toLowerCase() !== 'select' && selectedText.toLowerCase() !== 'choose') {
                    console.log(`[UAM Form Filler] Field "${key}" already has selected value in dropdown: "${selectedText}", skipping`);
                    skippedFields.push(key);
                    return;
                  }
                }
                break;
              }
            }
          }
        }
      }
      
      // For other fields, check if empty or default
      const isEmpty = isEmptyOrDefault(currentValue, key);
      console.log(`[UAM Form Filler] Field "${key}" isEmptyOrDefault: ${isEmpty}`);
      if (!isEmpty) {
        console.log(`[UAM Form Filler] Field "${key}" already has value: "${currentValue}", skipping`);
        skippedFields.push(key);
        return;
      }
    }
    
    // Field is empty or default, proceed to fill it
    const success = findAndSetInput(key, value);
    if (success) {
      successes.push(key);
      console.log(`[UAM Form Filler] ✓ Set ${key} to`, value);
    } else {
      errors.push(key);
      console.log(`[UAM Form Filler] ✗ Failed to set ${key}`);
    }
  });

  if (errors.length > 0) {
    const errorMsg = `Failed to set fields: ${errors.join(', ')}. Successfully set: ${successes.join(', ')}`;
    return { success: false, error: errorMsg };
  }

  // Handle image upload for ad forms (create modal)
  console.log('[UAM Form Filler] Checking if image upload is needed for ad...');
  uploadImageIfNeeded().catch(err => {
    console.error('[UAM Form Filler] Error uploading image:', err);
  });

  console.log('[UAM Form Filler] Form filled successfully');
  console.log('[UAM Form Filler] Final Form Data:', formData);
  return { success: true };
}

function isFieldEnabled(element: HTMLElement): boolean {
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const input = element as HTMLInputElement | HTMLTextAreaElement;
    return !input.disabled && !input.readOnly;
  }
  
  if (element.tagName === 'SELECT') {
    const select = element as HTMLSelectElement;
    return !select.disabled;
  }
  
  // For custom components, check if parent is disabled
  const parent = element.closest('[disabled], [aria-disabled="true"]');
  return !parent;
}

function getFieldValue(element: HTMLElement): string {
  if (element.tagName === 'INPUT') {
    const input = element as HTMLInputElement;
    if (input.type === 'checkbox' || input.type === 'radio') {
      return input.checked ? 'checked' : 'unchecked';
    }
    return input.value || '';
  }
  
  if (element.tagName === 'SELECT') {
    const select = element as HTMLSelectElement;
    return select.value || '';
  }
  
  if (element.tagName === 'TEXTAREA') {
    const textarea = element as HTMLTextAreaElement;
    return textarea.value || '';
  }
  
  // For custom components, try to get text content
  return element.textContent?.trim() || '';
}

function isEmptyOrDefault(value: string, fieldName: string): boolean {
  if (!value || value.trim() === '') {
    return true;
  }
  
  // Check for default values
  const trimmedValue = value.trim();
  const lowerValue = trimmedValue.toLowerCase();
  
  console.log(`[UAM Form Filler] isEmptyOrDefault check: value="${value}", fieldName="${fieldName}", lowerValue="${lowerValue}"`);
  
  // Budget field defaults - check various formats including whitespace
  if (fieldName.includes('budget') || fieldName.includes('lifetime') || fieldName.includes('spend') || fieldName.includes('goal')) {
    // Remove all whitespace and currency symbols for comparison
    const normalized = trimmedValue.replace(/\s/g, '').replace(/\$/g, '').replace(/,/g, '');
    const normalizedLower = normalized.toLowerCase();
    
    // Check normalized value (without $ and spaces)
    if (normalizedLower === '0.00' || normalizedLower === '0' || normalizedLower === '0.0') {
      return true;
    }
    
    // Check original value formats
    if (lowerValue === '$0.00' || 
        lowerValue === '0.00' || 
        lowerValue === '$0' || 
        lowerValue === '0' ||
        trimmedValue === '$0.00' ||
        trimmedValue === '$0' ||
        trimmedValue === '0.00' ||
        trimmedValue === '0') {
      return true;
    }
    
    return false;
  }
  
  // Adgroup name default
  if (fieldName.toLowerCase().includes('adgroup') && fieldName.toLowerCase().includes('name')) {
    const normalizedName = lowerValue.replace(/\s+/g, ' ').trim();
    // Check multiple variations of the default adgroup name
    const isDefault = normalizedName === 'ad group name' || 
                     normalizedName === 'adgroup name' || 
                     lowerValue === 'ad group name' ||
                     lowerValue === 'adgroup name' ||
                     lowerValue.includes('ad group name') || 
                     lowerValue.includes('adgroup name');
    console.log(`[UAM Form Filler] isEmptyOrDefault: Checking adgroup name - normalizedName="${normalizedName}", lowerValue="${lowerValue}", isDefault=${isDefault}`);
    if (isDefault) {
      console.log(`[UAM Form Filler] isEmptyOrDefault: Recognizing "${value}" as default adgroup name`);
      return true;
    }
  }
  
  // Ad name default
  if ((fieldName.toLowerCase().includes('ad') && fieldName.toLowerCase().includes('name')) && 
      !fieldName.toLowerCase().includes('adgroup') && !fieldName.toLowerCase().includes('ad group')) {
    const normalizedName = lowerValue.replace(/\s+/g, ' ').trim();
    // Check multiple variations of the default ad name
    const isDefault = normalizedName === 'ad name' || 
                     lowerValue === 'ad name' ||
                     lowerValue.includes('ad name');
    console.log(`[UAM Form Filler] isEmptyOrDefault: Checking ad name - normalizedName="${normalizedName}", lowerValue="${lowerValue}", isDefault=${isDefault}`);
    if (isDefault) {
      console.log(`[UAM Form Filler] isEmptyOrDefault: Recognizing "${value}" as default ad name`);
      return true;
    }
  }
  
  // Other common defaults
  return lowerValue === 'none' || lowerValue === 'select' || lowerValue === 'choose' || lowerValue === '--';
}

export function fillEditForm(formData: Record<string, any>): { success: boolean; error?: string } {
  console.log('[UAM Form Filler] Filling edit form with data:', formData);

  const errors: string[] = [];
  const successes: string[] = [];
  const skipped: string[] = [];

  // Determine entity type from URL
  const url = window.location.href;
  const isCampaignEdit = url.includes('/campaigns/');
  const isAdgroupEdit = url.includes('/adgroups/') || url.includes('/ad-groups/');
  const isAdEdit = url.includes('/ads/');

  console.log(`[UAM Form Filler] Edit page detected - Campaign: ${isCampaignEdit}, Adgroup: ${isAdgroupEdit}, Ad: ${isAdEdit}`);

  // Log all available inputs on the page for debugging
  const allInputs = document.querySelectorAll('input, select, textarea, [role="combobox"], [role="textbox"], [contenteditable="true"]');
  console.log(`[UAM Form Filler] Found ${allInputs.length} potential input elements on edit page`);
  allInputs.forEach((input, index) => {
    const htmlInput = input as HTMLElement;
    const nameAttr = htmlInput.getAttribute('name') || htmlInput.id || 'no-name';
    const type = (htmlInput as HTMLInputElement).type || htmlInput.tagName.toLowerCase();
    const value = getFieldValue(htmlInput);
    const role = htmlInput.getAttribute('role') || 'none';
    if (index < 30) { // Limit logging to first 30
      console.log(`  ${index + 1}. name="${nameAttr}", type="${type}", id="${htmlInput.id}", role="${role}", value="${value.substring(0, 50)}"`);
    }
  });

  // For campaign edit pages, fill campaign-specific fields
  if (isCampaignEdit) {
    const campaignFields = ['campaignName', 'campaignOperationStatus', 'campaignLifetimeBudget', 'objectiveType'];
    
    for (const fieldName of campaignFields) {
      if (!formData[fieldName]) {
        console.log(`[UAM Form Filler] Field "${fieldName}" not in form data, skipping`);
        continue; // Skip if not in form data
      }

      console.log(`[UAM Form Filler] Attempting to find field: "${fieldName}"`);
      const element = findInputByName(fieldName, false); // Edit pages don't have a modal
      
      if (!element) {
        console.log(`[UAM Form Filler] Field "${fieldName}" not found on edit page`);
        // Try searching by label text as fallback
        const labels = Array.from(document.querySelectorAll('label, [class*="label"], [class*="Label"]'));
        let foundViaLabel = false;
        
        for (const label of labels) {
          const labelText = label.textContent?.toLowerCase() || '';
          
          if (fieldName === 'campaignName' && (labelText.includes('campaign') && labelText.includes('name'))) {
            console.log(`[UAM Form Filler] Found potential label for campaignName: "${label.textContent}"`);
            const associatedInput = label.querySelector('input, textarea, [role="textbox"]') || 
                                   document.querySelector(`#${label.getAttribute('for')}`) ||
                                   label.nextElementSibling?.querySelector('input, textarea, [role="textbox"]');
            if (associatedInput) {
              console.log(`[UAM Form Filler] Found input via label:`, associatedInput);
              const currentValue = getFieldValue(associatedInput as HTMLElement);
              console.log(`[UAM Form Filler] Current value via label: "${currentValue}"`);
              if (isEmptyOrDefault(currentValue, fieldName)) {
                const success = setInputValue(associatedInput as HTMLElement, formData[fieldName]);
                if (success) {
                  successes.push(fieldName);
                  console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} via label`);
                  foundViaLabel = true;
                  break;
                } else {
                  console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} via label`);
                }
              } else {
                console.log(`[UAM Form Filler] Field "${fieldName}" already has value via label: "${currentValue}", skipping`);
                skipped.push(fieldName);
                foundViaLabel = true;
                break;
              }
            }
          }
          
          if (fieldName === 'campaignLifetimeBudget' && (labelText.includes('budget') || labelText.includes('lifetime'))) {
            console.log(`[UAM Form Filler] Found potential label for budget: "${label.textContent}"`);
            // Try multiple ways to find the associated input
            let associatedInput = label.querySelector('input, textarea, [role="textbox"], [contenteditable="true"]');
            if (!associatedInput && label.getAttribute('for')) {
              associatedInput = document.querySelector(`#${label.getAttribute('for')}`);
            }
            if (!associatedInput) {
              // Try next sibling
              associatedInput = label.nextElementSibling?.querySelector('input, textarea, [role="textbox"], [contenteditable="true"]') as HTMLElement;
            }
            if (!associatedInput) {
              // Try parent container
              const parent = label.closest('div, form, section');
              if (parent) {
                associatedInput = parent.querySelector('input, textarea, [role="textbox"], [contenteditable="true"]') as HTMLElement;
              }
            }
            
            if (associatedInput) {
              console.log(`[UAM Form Filler] Found input via label:`, associatedInput);
              const currentValue = getFieldValue(associatedInput as HTMLElement);
              console.log(`[UAM Form Filler] Budget current value via label: "${currentValue}"`);
              // Use the actual field name from the input (spend_cap) for isEmptyOrDefault check
              const inputName = (associatedInput as HTMLInputElement).name || associatedInput.getAttribute('name') || '';
              const checkFieldName = inputName || fieldName; // Use input name if available, otherwise use fieldName
              console.log(`[UAM Form Filler] Checking isEmptyOrDefault with fieldName: "${checkFieldName}"`);
              const isEmpty = isEmptyOrDefault(currentValue, checkFieldName);
              console.log(`[UAM Form Filler] Budget isEmptyOrDefault via label: ${isEmpty} (value: "${currentValue}", fieldName: "${checkFieldName}")`);
              
              if (isEmpty) {
                const budgetValue = '$100';
                console.log(`[UAM Form Filler] Setting budget to ${budgetValue} via label (was: "${currentValue}")`);
                const success = setInputValue(associatedInput as HTMLElement, budgetValue);
                if (success) {
                  successes.push(fieldName);
                  console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} via label`);
                  foundViaLabel = true;
                  break;
                } else {
                  console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} via label`);
                  errors.push(fieldName);
                  foundViaLabel = true;
                  break;
                }
              } else {
                console.log(`[UAM Form Filler] Budget already has value via label: "${currentValue}", skipping`);
                skipped.push(fieldName);
                foundViaLabel = true;
                break;
              }
            }
          }
        }
        
        if (foundViaLabel) {
          continue; // Skip to next field since we handled this one via label
        }
        
        // Field not found at all
        console.log(`[UAM Form Filler] Field "${fieldName}" not found by name or label`);
        continue;
      }

      console.log(`[UAM Form Filler] Found element for "${fieldName}":`, element);

      // Check if field is enabled
      const isEnabled = isFieldEnabled(element);
      console.log(`[UAM Form Filler] Field "${fieldName}" enabled: ${isEnabled}`);
      if (!isEnabled) {
        console.log(`[UAM Form Filler] Field "${fieldName}" is disabled, skipping`);
        skipped.push(fieldName);
        continue;
      }

      // Get current value
      const currentValue = getFieldValue(element);
      console.log(`[UAM Form Filler] Field "${fieldName}" current value: "${currentValue}"`);
      
      // Special handling for budget field
      if (fieldName === 'campaignLifetimeBudget') {
        const isEmpty = isEmptyOrDefault(currentValue, fieldName);
        console.log(`[UAM Form Filler] Budget field isEmptyOrDefault: ${isEmpty}`);
        if (!isEmpty) {
          console.log(`[UAM Form Filler] Budget field already has value: "${currentValue}", skipping`);
          skipped.push(fieldName);
          continue;
        }
        // Set to $5 if empty or $0.00
        const budgetValue = '$5';
        console.log(`[UAM Form Filler] Setting budget to ${budgetValue} (was: "${currentValue}")`);
        const success = setInputValue(element, budgetValue);
        if (success) {
          successes.push(fieldName);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName}`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName}`);
        }
        continue;
      }

      // For other fields, check if empty or default
      const isEmpty = isEmptyOrDefault(currentValue, fieldName);
      console.log(`[UAM Form Filler] Field "${fieldName}" isEmptyOrDefault: ${isEmpty}`);
      if (!isEmpty) {
        console.log(`[UAM Form Filler] Field "${fieldName}" already has value: "${currentValue}", skipping`);
        skipped.push(fieldName);
        continue;
      }

      // Fill the field
      const value = formData[fieldName];
      console.log(`[UAM Form Filler] Filling "${fieldName}" with value:`, value);
      const success = setInputValue(element, value);
      if (success) {
        successes.push(fieldName);
        console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName}`);
      } else {
        errors.push(fieldName);
        console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName}`);
      }
    }
  }

  // For adgroup edit pages, fill adgroup-specific fields
  if (isAdgroupEdit) {
    const adgroupFields = ['adgroupName', 'adgroupOperationStatus', 'adgroupBudget', 'scheduleStartDate', 'scheduleStartTime', 'bidValue'];
    const processedFields = new Set<string>(); // Track which actual HTML fields we've already processed
    
    for (const fieldName of adgroupFields) {
      if (!formData[fieldName]) {
        console.log(`[UAM Form Filler] Field "${fieldName}" not in form data, skipping`);
        continue; // Skip if not in form data
      }

      console.log(`[UAM Form Filler] Attempting to find field: "${fieldName}"`);
      const element = findInputByName(fieldName, false); // Edit pages don't have a modal
      
      if (element) {
        const actualFieldName = (element as HTMLInputElement).name || element.getAttribute('name') || '';
        // Check if we've already processed this actual HTML field (prevent setting same field twice)
        if (processedFields.has(actualFieldName)) {
          console.log(`[UAM Form Filler] Field "${actualFieldName}" already processed, skipping duplicate`);
          continue;
        }
        processedFields.add(actualFieldName);
      }
      
      if (!element) {
        console.log(`[UAM Form Filler] Field "${fieldName}" not found on edit page`);
        // Try searching by label text as fallback
        const labels = Array.from(document.querySelectorAll('label, [class*="label"], [class*="Label"]'));
        let foundViaLabel = false;
        
        for (const label of labels) {
          const labelText = label.textContent?.toLowerCase() || '';
          
          if (fieldName === 'adgroupName' && (labelText.includes('adgroup') || labelText.includes('ad group')) && labelText.includes('name')) {
            console.log(`[UAM Form Filler] Found potential label for adgroupName: "${label.textContent}"`);
            const associatedInput = label.querySelector('input, textarea, [role="textbox"]') || 
                                   document.querySelector(`#${label.getAttribute('for')}`) ||
                                   label.nextElementSibling?.querySelector('input, textarea, [role="textbox"]');
            if (associatedInput) {
              console.log(`[UAM Form Filler] Found input via label:`, associatedInput);
              const currentValue = getFieldValue(associatedInput as HTMLElement);
              console.log(`[UAM Form Filler] Current value via label: "${currentValue}"`);
              if (isEmptyOrDefault(currentValue, fieldName)) {
                const success = setInputValue(associatedInput as HTMLElement, formData[fieldName]);
                if (success) {
                  successes.push(fieldName);
                  console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} via label`);
                  foundViaLabel = true;
                  break;
                } else {
                  console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} via label`);
                }
              } else {
                console.log(`[UAM Form Filler] Field "${fieldName}" already has value via label: "${currentValue}", skipping`);
                skipped.push(fieldName);
                foundViaLabel = true;
                break;
              }
            }
          }
          
          if (fieldName === 'adgroupBudget' && (labelText.includes('budget') || labelText.includes('spend'))) {
            console.log(`[UAM Form Filler] Found potential label for budget: "${label.textContent}"`);
            // Try multiple ways to find the associated input
            let associatedInput = label.querySelector('input, textarea, [role="textbox"], [contenteditable="true"]');
            if (!associatedInput && label.getAttribute('for')) {
              associatedInput = document.querySelector(`#${label.getAttribute('for')}`);
            }
            if (!associatedInput) {
              // Try next sibling
              associatedInput = label.nextElementSibling?.querySelector('input, textarea, [role="textbox"], [contenteditable="true"]') as HTMLElement;
            }
            if (!associatedInput) {
              // Try parent container
              const parent = label.closest('div, form, section');
              if (parent) {
                associatedInput = parent.querySelector('input, textarea, [role="textbox"], [contenteditable="true"]') as HTMLElement;
              }
            }
            
            if (associatedInput) {
              console.log(`[UAM Form Filler] Found input via label:`, associatedInput);
              const currentValue = getFieldValue(associatedInput as HTMLElement);
              console.log(`[UAM Form Filler] Budget current value via label: "${currentValue}"`);
              // Use the actual field name from the input (spend_cap) for isEmptyOrDefault check
              const inputName = (associatedInput as HTMLInputElement).name || associatedInput.getAttribute('name') || '';
              const checkFieldName = inputName || fieldName; // Use input name if available, otherwise use fieldName
              console.log(`[UAM Form Filler] Checking isEmptyOrDefault with fieldName: "${checkFieldName}"`);
              const isEmpty = isEmptyOrDefault(currentValue, checkFieldName);
              console.log(`[UAM Form Filler] Budget isEmptyOrDefault via label: ${isEmpty} (value: "${currentValue}", fieldName: "${checkFieldName}")`);
              
              if (isEmpty) {
                const budgetValue = formData[fieldName];
                console.log(`[UAM Form Filler] Setting budget to ${budgetValue} via label (was: "${currentValue}")`);
                const success = setInputValue(associatedInput as HTMLElement, budgetValue);
                if (success) {
                  successes.push(fieldName);
                  console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} via label`);
                  foundViaLabel = true;
                  break;
                } else {
                  console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} via label`);
                  errors.push(fieldName);
                  foundViaLabel = true;
                  break;
                }
              } else {
                console.log(`[UAM Form Filler] Budget already has value via label: "${currentValue}", skipping`);
                skipped.push(fieldName);
                foundViaLabel = true;
                break;
              }
            }
          }
        }
        
        if (foundViaLabel) {
          continue; // Skip to next field since we handled this one via label
        }
        
        // Field not found at all
        console.log(`[UAM Form Filler] Field "${fieldName}" not found by name or label`);
        continue;
      }

      console.log(`[UAM Form Filler] Found element for "${fieldName}":`, element);

      // Check if field is enabled
      const isEnabled = isFieldEnabled(element);
      console.log(`[UAM Form Filler] Field "${fieldName}" enabled: ${isEnabled}`);
      if (!isEnabled) {
        console.log(`[UAM Form Filler] Field "${fieldName}" is disabled, skipping`);
        skipped.push(fieldName);
        continue;
      }

      // Special handling for radio buttons (operation status)
      if (fieldName === 'adgroupOperationStatus' && element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'radio') {
        const radioName = (element as HTMLInputElement).name;
        console.log(`[UAM Form Filler] Checking radio button group "${radioName}" for any selected value`);
        
        // Find all radio buttons in the group
        const radioGroup = document.querySelectorAll(`input[type="radio"][name="${radioName}"]`);
        let anyValueSelected = false;
        let selectedValue = '';
        
        for (const radio of Array.from(radioGroup)) {
          const radioInput = radio as HTMLInputElement;
          if (radioInput.checked) {
            anyValueSelected = true;
            selectedValue = radioInput.value || '';
            console.log(`[UAM Form Filler] Found selected radio button: value="${selectedValue}"`);
            break;
          }
        }
        
        // Only fill if no value is currently selected
        if (anyValueSelected) {
          console.log(`[UAM Form Filler] Field "${fieldName}" already has a value selected ("${selectedValue}"), skipping`);
          skipped.push(fieldName);
          continue;
        }
        
        // Fill the field with the desired value only if nothing is selected
        const value = formData[fieldName];
        console.log(`[UAM Form Filler] No value selected, filling "${fieldName}" with value:`, value);
        const success = setInputValue(element, value);
        if (success) {
          successes.push(fieldName);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName}`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName}`);
        }
        continue;
      }

      // Get current value
      const currentValue = getFieldValue(element);
      const actualFieldName = (element as HTMLInputElement).name || element.getAttribute('name') || 'unknown';
      console.log(`[UAM Form Filler] Field "${fieldName}" (actual HTML name: "${actualFieldName}") current value: "${currentValue}"`);
      
      // Special handling for date field - only set if empty
      if (fieldName === 'scheduleStartDate') {
        // Check if date field has a value (any non-empty value means it's already set)
        if (currentValue && currentValue.trim() !== '') {
          console.log(`[UAM Form Filler] Date field "${actualFieldName}" already has a value: "${currentValue}", skipping`);
          skipped.push(fieldName);
          continue;
        }
        // Only set if empty
        const dateValue = formData[fieldName];
        console.log(`[UAM Form Filler] Date field "${actualFieldName}" is empty, setting to: "${dateValue}"`);
        const success = setInputValue(element, dateValue);
        if (success) {
          successes.push(`${fieldName} (${actualFieldName})`);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} (${actualFieldName}) to "${dateValue}"`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} (${actualFieldName})`);
        }
        continue;
      }
      
      // Special handling for time field - only set if empty
      if (fieldName === 'scheduleStartTime') {
        // Check if time field has a value (any non-empty value is considered a default)
        if (currentValue && currentValue.trim() !== '') {
          console.log(`[UAM Form Filler] Time field "${actualFieldName}" already has a value: "${currentValue}", skipping`);
          skipped.push(fieldName);
          continue;
        }
        // Only set if empty
        const timeValue = formData[fieldName];
        console.log(`[UAM Form Filler] Time field "${actualFieldName}" is empty, setting to: "${timeValue}"`);
        const success = setInputValue(element, timeValue);
        if (success) {
          successes.push(`${fieldName} (${actualFieldName})`);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} (${actualFieldName}) to "${timeValue}"`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} (${actualFieldName})`);
        }
        continue;
      }
      
      // Special handling for bid value field - only set if empty
      if (fieldName === 'bidValue') {
        // Check if bid field has a value (any non-empty value means it's already set)
        if (currentValue && currentValue.trim() !== '') {
          console.log(`[UAM Form Filler] Bid field "${actualFieldName}" already has a value: "${currentValue}", skipping`);
          skipped.push(fieldName);
          continue;
        }
        // Only set if empty
        const bidValue = formData[fieldName];
        console.log(`[UAM Form Filler] Bid field "${actualFieldName}" is empty, setting to: "${bidValue}"`);
        const success = setInputValue(element, bidValue);
        if (success) {
          successes.push(`${fieldName} (${actualFieldName})`);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} (${actualFieldName}) to "${bidValue}"`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} (${actualFieldName})`);
        }
        continue;
      }
      
      // Special handling for budget field
      if (fieldName === 'adgroupBudget') {
        // Use the actual input name for isEmptyOrDefault check
        const inputName = (element as HTMLInputElement).name || element.getAttribute('name') || '';
        const checkFieldName = inputName || fieldName;
        const isEmpty = isEmptyOrDefault(currentValue, checkFieldName);
        console.log(`[UAM Form Filler] Budget field isEmptyOrDefault: ${isEmpty} (value: "${currentValue}", checkFieldName: "${checkFieldName}")`);
        if (!isEmpty) {
          console.log(`[UAM Form Filler] Budget field already has value: "${currentValue}", skipping`);
          skipped.push(fieldName);
          continue;
        }
        // Set to form data value if empty or $0.00
        const budgetValue = formData[fieldName];
        console.log(`[UAM Form Filler] Setting budget to ${budgetValue} (was: "${currentValue}")`);
        const success = setInputValue(element, budgetValue);
        if (success) {
          successes.push(fieldName);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName}`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName}`);
        }
        continue;
      }

      // For other fields, check if empty or default
      const isEmpty = isEmptyOrDefault(currentValue, fieldName);
      console.log(`[UAM Form Filler] Field "${fieldName}" isEmptyOrDefault: ${isEmpty}`);
      if (!isEmpty) {
        console.log(`[UAM Form Filler] Field "${fieldName}" already has value: "${currentValue}", skipping`);
        skipped.push(fieldName);
        continue;
      }

      // Fill the field
      const value = formData[fieldName];
      console.log(`[UAM Form Filler] Filling "${fieldName}" with value:`, value);
      const success = setInputValue(element, value);
      if (success) {
        successes.push(fieldName);
        console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName}`);
      } else {
        errors.push(fieldName);
        console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName}`);
      }
    }
  }

  // For ad edit pages, fill ad-specific fields
  if (isAdEdit) {
    const adFields = ['adName', 'postType', 'profile', 'headline', 'callToAction', 'destinationUrl', 'displayUrl'];
    const processedFields = new Set<string>(); // Track which actual HTML fields we've already processed
    
    for (const fieldName of adFields) {
      if (!formData[fieldName]) {
        console.log(`[UAM Form Filler] Field "${fieldName}" not in form data, skipping`);
        continue; // Skip if not in form data
      }

      console.log(`[UAM Form Filler] Attempting to find field: "${fieldName}"`);
      const element = findInputByName(fieldName, false); // Edit pages don't have a modal
      
      if (element) {
        const actualFieldName = (element as HTMLInputElement).name || element.getAttribute('name') || '';
        // Check if we've already processed this actual HTML field (prevent setting same field twice)
        if (processedFields.has(actualFieldName)) {
          console.log(`[UAM Form Filler] Field "${actualFieldName}" already processed, skipping duplicate`);
          continue;
        }
        processedFields.add(actualFieldName);
      }
      
      if (!element) {
        console.log(`[UAM Form Filler] Field "${fieldName}" not found on edit page`);
        continue;
      }

      console.log(`[UAM Form Filler] Found element for "${fieldName}":`, element);

      // Check if field is enabled
      const isEnabled = isFieldEnabled(element);
      console.log(`[UAM Form Filler] Field "${fieldName}" enabled: ${isEnabled}`);
      if (!isEnabled) {
        console.log(`[UAM Form Filler] Field "${fieldName}" is disabled, skipping`);
        skipped.push(fieldName);
        continue;
      }

      // Get current value
      const currentValue = getFieldValue(element);
      const actualFieldName = (element as HTMLInputElement).name || element.getAttribute('name') || 'unknown';
      console.log(`[UAM Form Filler] Field "${fieldName}" (actual HTML name: "${actualFieldName}") current value: "${currentValue}"`);
      
      // Special handling for ad name - check if it's "ad name" default
      if (fieldName === 'adName') {
        const isEmpty = isEmptyOrDefault(currentValue, fieldName);
        console.log(`[UAM Form Filler] Ad name field isEmptyOrDefault: ${isEmpty}`);
        if (!isEmpty) {
          console.log(`[UAM Form Filler] Ad name field already has value: "${currentValue}", skipping`);
          skipped.push(fieldName);
          continue;
        }
        const adNameValue = formData[fieldName];
        console.log(`[UAM Form Filler] Ad name field is empty or default, setting to: "${adNameValue}"`);
        const success = setInputValue(element, adNameValue);
        if (success) {
          successes.push(`${fieldName} (${actualFieldName})`);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} (${actualFieldName}) to "${adNameValue}"`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} (${actualFieldName})`);
        }
        continue;
      }
      
      // Special handling for dropdown fields (postType, profile, callToAction) - similar to objectiveType
      if (fieldName === 'postType' || fieldName === 'profile' || fieldName === 'callToAction') {
        // Check if field has a value (any non-empty value means it's already set)
        if (currentValue && currentValue.trim() !== '') {
          console.log(`[UAM Form Filler] Dropdown field "${actualFieldName}" already has a value: "${currentValue}", skipping`);
          skipped.push(fieldName);
          continue;
        }
        // For profile, if empty, we'll select the first available option
        let dropdownValue = formData[fieldName];
        if (fieldName === 'profile' && (!dropdownValue || (typeof dropdownValue === 'object' && (!dropdownValue.value || !dropdownValue.label)))) {
          console.log(`[UAM Form Filler] Profile field has no value/label provided, will select first available option`);
          // Set a placeholder value - the dropdown handler will select the first option if no match is found
          dropdownValue = { value: '__FIRST_OPTION__', label: '__FIRST_OPTION__' };
        }
        // Set dropdown value (will handle React Select dropdown similar to objectiveType)
        console.log(`[UAM Form Filler] Dropdown field "${actualFieldName}" is empty, setting to:`, dropdownValue);
        const success = setInputValue(element, dropdownValue);
        if (success) {
          successes.push(`${fieldName} (${actualFieldName})`);
          console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} (${actualFieldName})`);
        } else {
          errors.push(fieldName);
          console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} (${actualFieldName})`);
        }
        continue;
      }

      // For other text fields (headline, destinationUrl, displayUrl), check if empty
      const isEmpty = isEmptyOrDefault(currentValue, fieldName);
      console.log(`[UAM Form Filler] Field "${fieldName}" isEmptyOrDefault: ${isEmpty}`);
      if (!isEmpty) {
        console.log(`[UAM Form Filler] Field "${fieldName}" already has value: "${currentValue}", skipping`);
        skipped.push(fieldName);
        continue;
      }

      // Fill the field
      const value = formData[fieldName];
      console.log(`[UAM Form Filler] Filling "${fieldName}" with value:`, value);
      const success = setInputValue(element, value);
      if (success) {
        successes.push(`${fieldName} (${actualFieldName})`);
        console.log(`[UAM Form Filler] ✓ Successfully set ${fieldName} (${actualFieldName})`);
      } else {
        errors.push(fieldName);
        console.log(`[UAM Form Filler] ✗ Failed to set ${fieldName} (${actualFieldName})`);
      }
    }
    
    // Handle image upload for ad edit pages
    console.log('[UAM Form Filler] Checking if image upload is needed for ad...');
    uploadImageIfNeeded().catch(err => {
      console.error('[UAM Form Filler] Error uploading image:', err);
    });
  }

  if (errors.length > 0) {
    const errorMsg = `Failed to set fields: ${errors.join(', ')}. Successfully set: ${successes.join(', ')}. Skipped: ${skipped.join(', ')}`;
    return { success: false, error: errorMsg };
  }

  console.log('[UAM Form Filler] Edit form filled successfully');
  console.log(`[UAM Form Filler] Successfully set: ${successes.join(', ')}. Skipped: ${skipped.join(', ')}`);
  return { success: true };
}
