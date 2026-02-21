# Task Driven Browsing

A Chrome extension that helps you stay focused by aligning your web browsing with explicitly stated goals.

## Overview

Task Driven Browsing addresses the challenge of maintaining focus while using the internet. By requiring users to set an explicit goal before browsing, the extension uses AI to check whether each page you visit aligns with your stated objective. Pages that don't align are blocked, helping you avoid distractions and maintain intentional computer use.

## How It Works

1. **Set Your Goal**: When you open your browser, you're prompted to enter a specific goal for your browsing session (e.g., "Research AWS Lambda best practices" or "Learn about electrical codes in Washington")

2. **Browse Intentionally**: As you navigate the web, the extension monitors your activity in the background

3. **AI Alignment Check**: After a 3-second delay (to allow for redirects), the extension sends page content to an AWS Lambda function that uses Amazon Bedrock to determine if the page aligns with your goal

4. **Stay on Track**: Pages that align with your goal load normally. Misaligned pages are blocked with a reminder of your current goal

5. **Complete Your Goal**: When finished, mark your goal as complete and set a new one for your next session

## Features

- **Goal-driven browsing**: Explicit goal setting before each session
- **AI-powered alignment checking**: Uses Amazon Bedrock (Claude) to evaluate page relevance
- **Allowlist for sensitive sites**: Banks, medical sites, and auth pages bypass checking for privacy
- **Uncertainty tracking**: Handles ambiguous pages gracefully with streak-based blocking
- **Customizable settings**: Manage your allowlist through the settings interface
- **Privacy-focused**: Only truncated page content is sent to the API, sensitive sites are bypassed entirely

## Architecture

### Chrome Extension
- **Background Service Worker**: Manages state, intercepts navigation, and communicates with the backend API
- **Content Script**: Extracts page content and metadata
- **UI Components**: Goal input popup, blocked page redirect, settings panel

### Backend (AWS)
- **API Gateway**: REST API with API key authentication
- **Lambda Function**: Processes alignment check requests (Python 3.12)
- **Amazon Bedrock**: LLM service for alignment evaluation (Claude Haiku)
- **Infrastructure as Code**: AWS CDK with TypeScript

## Project Structure

```
task_driven_browsing/
├── chrome_extension/          # Chrome extension source
│   ├── public/               # HTML pages
│   ├── src/                  # JavaScript source
│   └── manifest.json         # Extension manifest
├── cdk/                      # AWS CDK infrastructure
│   ├── lib/                  # CDK stack definitions
│   └── lambda/               # Lambda function code
└── proposal.md               # Detailed design document
```

## Setup

### Prerequisites
- Node.js and npm
- AWS CLI configured with credentials
- Chrome browser

### Backend Deployment

1. Navigate to the CDK directory:
```bash
cd cdk
npm install
```

2. Deploy the stack:
```bash
cdk deploy
```

3. Note the API endpoint and API key from the deployment output

### Extension Installation

1. Update the API configuration:
   - Edit `chrome_extension/src/config.js`
   - Add your API endpoint and API key

2. Load the extension in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome_extension` directory

## Usage

1. Click the extension icon to set your goal
2. Browse normally - the extension works in the background
3. If blocked, you'll see a reminder of your goal
4. Complete your goal when finished or change it as needed
5. Access settings to customize your allowlist

## Cost Estimate

For typical usage (100 pages/day):
- Bedrock (Claude Haiku): ~$1.70/month
- API Gateway: ~$0.01/month
- Lambda: Free tier
- **Total: ~$2/month**

## Privacy

- Allowlist bypasses LLM entirely for sensitive sites
- Only truncated, sanitized content sent to API
- No persistent logging of page content
- User controls allowlist through settings

## Future Enhancements

- Completed goal history and recap
- Timed goals with automatic expiration
- Math challenge for goal changes (prevent impulsive switching)
- False-positive override with logging
- Search engine query validation

## License

Personal project for experimental use.
