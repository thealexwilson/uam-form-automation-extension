# UAM Form Automation Extension

A Chrome extension that automates filling UAM Reddit forms for campaigns, ad groups, and ads.

## Current Status

This extension currently supports:
- ✅ Reddit publisher only
- ✅ Multiple entity types: Campaigns, Ad Groups, and Ads (create and edit forms)
- ✅ Form filling using CSS selectors and React internals (React Fiber, react-hook-form)
- ✅ Entity names with auto-generated timestamps (Campaign Name, Ad Group Name, Ad Name)
- ✅ Smart field detection (skips fields that already have values)

## Features

- **Automatic Form Filling**: Quickly fill campaign, ad group, and ad creation/edit forms with test data
- **Smart Field Detection**: Automatically detects and fills form fields, skipping fields that already have values
- **Custom Name Prefix**: Add a custom prefix to entity names (Campaign Name, Ad Group Name, Ad Name) that persists across sessions
- **Dynamic Page Detection**: Extension popup automatically updates to reflect the current page type (Campaigns, Ad Groups, or Ads)
- **Image Upload**: Automatically uploads a placeholder image for ad forms when needed
- **Field Status Display**: Shows which fields were successfully filled and which were skipped

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Usage

### Create Forms

1. Navigate to the campaigns page: `http://localhost:3000/uam/reddit/campaigns`
2. Click the "Create" button to open the campaign creation modal
3. Click the extension icon in Chrome toolbar
4. (Optional) Enter a custom name prefix in the "Name Prefix" field (e.g., "Alex")
5. Click "Fill Form" button in the popup
6. The form will be automatically filled with:
   - Campaign name: `[Prefix] Test Reddit Campaign [current date and time]`
   - Campaign Objective type: "Awareness"
   - Adgroup name: `[Prefix] Test Reddit Adgroup [current date and time]`
   - Ad name: `[Prefix] Test Reddit Ad [current date and time]`
   - Ad image: Placeholder image (140x140px) if no image is present

### Edit Forms

The extension also works on campaign, adgroup, and ad edit pages:

1. Navigate to an edit page (e.g., `http://localhost:3000/uam/reddit/campaigns/[id]/edit`)
2. Click the extension icon in Chrome toolbar
3. (Optional) Enter a custom name prefix
4. Click "Fill Form" button
5. The extension will:
   - Only fill fields that are blank or have default values
   - Skip fields that already have values
   - Update schedule start date/time if blank (date: 1 week from today, time: 12:00)
   - Upload an image if the Ad Image field is empty

### Name Prefix

The name prefix feature allows you to prepend custom text to entity names:
- Enter text in the "Name Prefix" field (max 20 characters)
- The prefix is automatically saved and persists even if you close the popup
- Example: With prefix "Alex", campaign name becomes "Alex Test Reddit Campaign 01/23/2026 12:00"

## How It Works

- **Content Script**: Injected into UAM pages to interact with form elements
- **Form Detection**: Automatically detects create modals and edit pages
- **Field Mapping**: Maps form data to DOM elements using name attributes, IDs, and labels
- **React Integration**: Handles React-based form components (react-select, react-hook-form)
- **Smart Skipping**: Checks if fields already have values before filling to avoid overwriting existing data

## Limitations

- Reddit entities only (other publishers coming soon)
- No templating system yet
- No validation error handling
- Hardcoded form values (campaign name includes timestamp)
- Requires manual extension reload after code changes

## Roadmap

- Template system for saving/loading different form values
- Support for other publishers (Facebook, TikTok, etc.)
- Better error handling and validation
- Background service worker for template storage
- React-based popup UI
- Field-by-field customization options

## Development

### Build

```bash
npm run build
```

### Project Structure

```
├── content/          # Content script entry point
├── popup/            # Extension popup UI (HTML, CSS, TypeScript)
├── src/              # Core form filling logic
├── icons/            # Extension icons
├── dist/             # Built extension files (generated)
└── manifest.json     # Extension manifest
```

## License

[Add your license here]
