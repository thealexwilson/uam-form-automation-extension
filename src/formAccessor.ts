function findInputByName(name: string, searchInModal: boolean = true): HTMLElement | null {
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

  if (name === 'adName') {
    console.log(`[UAM Form Filler] Searching for adName alternatives...`);
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

  return null;
}

function setInputValue(element: HTMLElement, value: any): boolean {
  const tagName = element.tagName.toLowerCase();
  const inputType = (element as HTMLInputElement).type?.toLowerCase();

  console.log(`[UAM Form Filler] Setting value on element: tagName=${tagName}, type=${inputType}, name=${(element as any).name || element.getAttribute('name') || 'none'}, id=${element.id || 'none'}`);

  try {
    if (tagName === 'input') {
      const input = element as HTMLInputElement;
      
      if (inputType === 'hidden') {
        const valueToSet = typeof value === 'object' && value.value ? String(value.value) : String(value);
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
        
        if (input.name === 'objectiveType') {
          console.log(`[UAM Form Filler] Looking for visible dropdown component for objectiveType...`);
          
          const findAndClickDropdown = () => {
            const modal = input.closest('#create-modal') || document.querySelector('#create-modal');
            if (!modal) return;
            
            const parentContainer = input.parentElement?.parentElement || input.closest('div, form, section');
            const searchScope = parentContainer || modal;
            
            let visibleDropdown: HTMLElement | null = null;
            
            const reactSelectInput = searchScope.querySelector('.react-select__input[role="combobox"]') as HTMLInputElement;
            if (reactSelectInput) {
              const container = reactSelectInput.closest('.react-select__input-container');
              if (container) {
                visibleDropdown = container as HTMLElement;
                console.log(`[UAM Form Filler] Found react-select input container`);
              } else {
                visibleDropdown = reactSelectInput;
                console.log(`[UAM Form Filler] Found react-select input`);
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
              
              for (const selector of selectors) {
                const elements = searchScope.querySelectorAll(selector);
                for (const el of Array.from(elements)) {
                  const text = el.textContent?.toLowerCase() || '';
                  if (text.includes('objective') || text.includes('awareness') || text.includes('conversion') || text.includes('traffic') || el === input.nextElementSibling || el === input.previousElementSibling) {
                    visibleDropdown = el as HTMLElement;
                    console.log(`[UAM Form Filler] Found visible dropdown using selector: ${selector}`);
                    break;
                  }
                }
                if (visibleDropdown) break;
              }
            }
            
            if (!visibleDropdown) {
              const allButtons = searchScope.querySelectorAll('button, div[role="button"]');
              for (const btn of Array.from(allButtons)) {
                const btnText = btn.textContent?.toLowerCase() || '';
                if (btnText.includes('awareness') || btnText.includes('conversion') || btnText.includes('traffic') || btnText.includes('objective')) {
                  visibleDropdown = btn as HTMLElement;
                  console.log(`[UAM Form Filler] Found visible dropdown by text content`);
                  break;
                }
              }
            }
            
            if (visibleDropdown) {
              console.log(`[UAM Form Filler] Opening dropdown...`);
              
              const inputElement = visibleDropdown.querySelector('.react-select__input') as HTMLInputElement;
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
                  console.log(`[UAM Form Filler] Also clicking container`);
                  (container as HTMLElement).click();
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
                console.log(`[UAM Form Filler] No input element found, clicking container`);
                visibleDropdown.click();
              }
              
              const findAndClickOption = (attempt: number = 0) => {
                const labelToFind = typeof value === 'object' && value.label ? value.label.toLowerCase() : 'awareness';
                const valueToFind = typeof value === 'object' && value.value ? String(value.value).toLowerCase() : String(value).toLowerCase();
                
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
                
                if (modal) {
                  for (const selector of menuSelectors) {
                    menuContainer = modal.querySelector(selector);
                    if (menuContainer) {
                      console.log(`[UAM Form Filler] Found menu container in modal using selector: ${selector}`);
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
                    const optionsWithText = Array.from(found).filter(opt => {
                      const text = opt.textContent?.trim() || '';
                      return text.length > 0 && !opt.classList.toString().includes('input-container');
                    });
                    if (optionsWithText.length > 0) {
                      console.log(`[UAM Form Filler] Found ${optionsWithText.length} options with text using selector: ${selector}`);
                      options = optionsWithText;
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
                  for (const option of options) {
                    const optionText = (option.textContent?.toLowerCase() || '').trim();
                    const optionValue = (option.getAttribute('data-value') || option.getAttribute('value') || option.getAttribute('id') || '').toLowerCase();
                    
                    console.log(`[UAM Form Filler] Option: text="${optionText}", value="${optionValue}"`);
                    
                    if (optionText.includes(labelToFind) || 
                        optionValue === valueToFind ||
                        optionText.includes('awareness') ||
                        optionText.includes('brand awareness') ||
                        optionText.includes('aware') ||
                        optionValue.includes('awareness') ||
                        optionValue === 'awareness') {
                      console.log(`[UAM Form Filler] ✓ Match found! Clicking option: "${option.textContent}"`);
                      (option as HTMLElement).click();
                      
                      setTimeout(() => {
                        const hiddenInput = document.querySelector('input[name="objectiveType"]') as HTMLInputElement;
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
                        } else {
                          // Fallback: click outside the dropdown to close it
                          console.log(`[UAM Form Filler] Input element not found, clicking outside to close dropdown`);
                          if (visibleDropdown) {
                            const clickOutsideEvent = new MouseEvent('mousedown', {
                              bubbles: true,
                              cancelable: true,
                              view: window
                            });
                            document.body.dispatchEvent(clickOutsideEvent);
                          }
                        }
                      }, 150);
                      
                      return;
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
        input.checked = Boolean(value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
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

  Object.entries(filteredFormData).forEach(([key, value]) => {
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
  
  // Budget field defaults - check various formats including whitespace
  if (fieldName.includes('budget') || fieldName.includes('lifetime') || fieldName.includes('spend')) {
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

  // TODO: Add adgroup and ad edit logic when needed
  if (isAdgroupEdit) {
    console.log('[UAM Form Filler] Adgroup edit page - not yet implemented');
  }

  if (isAdEdit) {
    console.log('[UAM Form Filler] Ad edit page - not yet implemented');
  }

  if (errors.length > 0) {
    const errorMsg = `Failed to set fields: ${errors.join(', ')}. Successfully set: ${successes.join(', ')}. Skipped: ${skipped.join(', ')}`;
    return { success: false, error: errorMsg };
  }

  console.log('[UAM Form Filler] Edit form filled successfully');
  console.log(`[UAM Form Filler] Successfully set: ${successes.join(', ')}. Skipped: ${skipped.join(', ')}`);
  return { success: true };
}
