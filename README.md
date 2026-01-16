# UAM Form Automation Extension

Chrome extension to automate filling UAM Reddit campaign creation forms.

## Current Status: MVP

This extension currently supports:
- ✅ Reddit publisher only
- ✅ Campaigns entity type only
- ✅ Form filling using CSS selectors (no React internals required)
- ✅ Campaign name with auto-generated timestamp
- ✅ Objective type selection (Brand Awareness and Reach)
- ✅ React Select dropdown handling

## Installation

### Recommended: Load Unpacked Extension

This is the most reliable method for local/internal extensions:

1. Clone or download the repository:
   ```bash
   git clone https://github.com/thealexwilson/uam-form-automation-extension.git
   cd uam-form-automation-extension
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Load the extension in Chrome:
   - Open Chrome → Extensions (`chrome://extensions/`)
   - **Enable "Developer mode"** (toggle in top-right - this is required!)
   - Click **"Load unpacked"**
   - Navigate to and select the `dist` directory in the project folder
   - The extension should now appear in your extensions list

**Note:** With Developer mode enabled, Chrome will allow unpacked extensions without any "unknown source" warnings.

## Configuration

### Update Domain

Edit `manifest.json` and replace `http://localhost:3000/*` with your actual UAM domain in both `host_permissions` and `content_scripts.matches`.

### Update Form Values

Edit `popup/popup.ts` and modify the `REDDIT_CAMPAIGN_FORM_DATA` constant.

## Usage

1. Navigate to UAM Reddit campaigns page: `http://localhost:3000/uam/reddit/campaigns`
2. Click the "Create" button to open the campaign creation modal
3. Click the extension icon in Chrome toolbar
4. Click "Fill Form" button in the popup
5. The form will be automatically filled with:
   - Campaign name: "Test Reddit Campaign [current date and time]"
   - Adgroup name: "Test Reddit Adgroup [current date and time]"
   - Ad name: "Test Reddit Ad [current date and time]"
   - Objective type: "Brand Awareness and Reach"

## Development & Debugging

### Development Setup

If something isn't working or you want to make changes to the extension yourself.

1. Clone the repository:
   ```bash
   git clone https://github.com/thealexwilson/uam-form-automation-extension.git
   cd uam-form-automation-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate icons (if needed):
   ```bash
   node scripts/generate-icons.js
   ```

4. Build the extension:
   ```bash
   npm run build
   ```

5. Load unpacked extension:
   - Open Chrome → Extensions (`chrome://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

6. For development with auto-rebuild:
   ```bash
   npm run dev
   ```
   Then reload the extension in Chrome after making changes.

### Debugging Content Script

1. Open UAM page with CreateModal open
2. Right-click → Inspect
3. Go to "Console" tab
4. Content script logs appear here with `[UAM Form Filler]` prefix
5. Can set breakpoints in Sources tab → Content scripts

### Debugging Popup

1. Click extension icon to open popup
2. Right-click inside popup → Inspect
3. Popup DevTools opens in separate window
4. Console/logs appear here

### Making Changes

1. Edit source files in `popup/`, `content/`, `src/`
2. Run `npm run build` (or `npm run dev` for watch mode)
3. Click "Reload" button on extension card in Chrome Extensions page
4. Refresh UAM page to test changes

## Limitations

- Reddit campaigns only (other publishers coming soon)
- Campaigns only (adgroups/ads coming soon)
- Only fills campaign name and objective type (other fields coming soon)
- No template system yet
- No validation error handling
- Hardcoded form values (campaign name includes timestamp)

## Roadmap

- [ ] Template system for saving/loading form values
- [ ] Support for other publishers (Facebook, TikTok, etc.)
- [ ] Support for adgroups and ads
- [ ] Better error handling and validation
- [ ] Background service worker for template storage
- [ ] React-based popup UI

## Troubleshooting

**Form not filling:**
- Make sure the CreateModal is open before clicking "Fill Form"
- Check browser console for error messages
- Verify you're on the Reddit campaigns page (`/uam/reddit/campaigns`)

**Extension not loading / "Chrome doesn't know where it comes from":**
- **Make sure Developer mode is enabled** (this is required!)
- Check that all files are in the `dist` directory
- Verify `manifest.json` is valid JSON
- Try removing and re-adding the extension
- Make sure you're selecting the `dist` directory (not the project root) when loading unpacked

## License

MIT
