function findInputByName(name: string): HTMLElement | null {
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

  const modal = document.querySelector('#create-modal');
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
        input.value = String(value);
      } else {
        input.value = String(value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
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
