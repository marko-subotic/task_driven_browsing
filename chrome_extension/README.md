# Task Driven Browsing - Chrome Extension

A Chrome extension that helps you stay focused by aligning your browsing with explicit goals.

## Setup

1. **Configure API Endpoint**
   - After deploying the CDK stack, update `src/background.js`:
   - Set `API_ENDPOINT` to your API Gateway URL
   - Set `API_KEY` to your API key

2. **Load Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome_extension` directory

## Usage

1. Click the extension icon to set your goal
2. Browse normally - the extension will check alignment
3. Blocked pages will redirect to a reminder of your goal
4. Complete your goal when done

## Development

### File Structure
```
chrome_extension/
├── manifest.json          # Extension configuration
├── src/
│   ├── background.js      # Service worker (navigation interception)
│   ├── content.js         # Content script (page data extraction)
│   └── popup.js           # Popup UI logic
└── public/
    ├── popup.html         # Goal setting popup
    ├── blocked.html       # Blocked page redirect
    └── icon*.png          # Extension icons (TODO)
```

### TODO
- Add extension icons (16x16, 48x48, 128x128)
- Implement allowlist management UI
- Add settings panel
- Implement math challenge for goal changes
- Add redirect delay (3 seconds)
- Implement search engine detection
- Add completed goals history view
