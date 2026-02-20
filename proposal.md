# Task Driven Browsing

## Motivation
Computers combined with the internet are an incredibly powerful tool, helping humans unlock vast amounts of knowledge with very little effort and cost required. When used in an effective way, they can aid people in accomplishing impressive tasks that would have been unimaginable to previous eras’ society. As the spiderman comics once proclaimed, with great power comes great responsibility. Being able to search and find anything the human brain can imagine can lead to numerous distractions and trouble focusing. I have experienced trouble in much of my life with grappling for control with the freedom of the internet and accomplishing specific tasks that are conceptually alluring.

Some trouble that I found is that I have too much freedom in the way I used my computer. When I open it, my brain is open to access pretty much anything. Often, I open my computer with a vague intention to be “productive”, without having a specific goal. Other times, I have an idea, but my attention wanders off after some time spent working. My hypothesis is that having an explicitly stated goal to accomplish before actually attempting to achieve the goal would make it easier to lead a more intentional computer use life. Having an intentionally stated goal would also make it easier to mechanize a tool to keep me on the goal. Some kind of helper that makes sure that the use of my computer (usually the browser specifically) is aligned with the explicitly stated goal.

## Product Idea
To address the issue I’ve introduced above, my idea is to create a browser extension that will help facilitate a structured browsing experience driven by an explicit goal. 

### User experience
When opening the browser to start a new session, a page or pop-up shows up and prompts the user to enter their goal for the session. They will enter their goal, and it will be stored in the extension. This goal is defined by the user, and they are allowed to be as precise or vague as they would like. For example, they might specify "learn about electrical codes in washington for residential housing", or "watch sports". Then, whenever the user surfs to a new web page, the extension checks whether the new web page is aligned with the session goal. If the page is aligned, the user is allowed to visit it and the extension remains dormant. If the page is not aligned, the page is blocked; the user is redirected to some simple page that reminds them of their overall goal. Once the user has completed their goal, they'll go to the extension and signal that their goal is completed. The extension will store the finished goal and prompt the user for a new goal. 

### Edge Cases
1. Multiple goals: my vision is that the user should only have a single goal at a time. Humans have trouble with multi-tasking, and once focus is derailed, it is difficult to rebuild.
2. Opening a different window/incognito mode: I often open a new window for a group of related searches, like math homework and keep these tabs open. I think this is not an issue, as long as the extension is able to keep the same goal across all windows. This way, you cannot bypass the extension. If you’d like to access a different group of tabs, you may change your goal. Additionally, there might be a large amount of tabs open, under various grouping, or tabs running in the background. This is fine, only the active tab of the user should be relevant. 
3. Disabling of the extension: if the extension is easy to disable, the user might be tempted to bypass it, or quickly change the goals. A simple math challenge that requires some cognitive effort might be an effective way to prevent a human from doing this, such as double digit multiplication. Because changing goals should happen relatively rarely (more than half an hour between), even if the user wants to make a legitimate change, the small cognitive effort is acceptable.
4. Timed goals: Some goals might be intentionally vague and pleasure-oriented, or the user might just have an intention to time-box. It would be useful to provide a feature to allow the user to limit their goal to a certain period, then block all websites when the time limit expires and prompt the user to enter a new goal.
5. Redirects: For various auth workflows and other redirects, having the extension check might impact the user's browsing experience. To handle this, it would be helpful to set a timer, perhaps about 3 seconds before coming to a decision to allow for redirects from the webpage.
6. Search engine: In order to find sites where the user will spend the most of their time, they'll often need to use a search engine. The extension should be fairly tolerant, but it should check the search terms that are being used to make sure that the search is not clearly misaligned with the goal.
7. Alignment ambiguity: In case the LLM is unsure if the web page is aligned, it should err on the side of caution and allow the page. However, it might be good to keep track of previous uncertainty in order to prevent a rabbit-hole. For example, if the user has visited 1 site that was vaguely related, this is fine, but 5 in a row is not allowed. This logic should be simple, just by streak. If a page is clearly related, the logic should reset. Also, some goals are more vague, and as such should have more flexibility in what is allowed. Essentially, the more specific a goal, the more strictly enforced alignment should be.
8. Platforms: This extension should be simple, so it can only support a single profile on desktop. It should not have a mobile alternative, and does not need to sync across profiles.

### Concerns
1. **Increased browsing latency due to LLMs**: This may be frustrating, but I would like to experiment with the user experience. Additionally, running in the background means that web pages should load at regular speeds, and blocking may be delayed.
2. **Cost**: LLM API calls may be expensive, and this will factor into the extension. I'm curious as to how expensive this may be. Additionally, 
3. **Privacy**: This is a legitimate concern. I am firstly intending this for my own use. As far as general browsing history, I don't mind sharing with companies hosting LLMs, given that they already have access to the entire internet. For the websites containing sensitive information, it might be good to come up with an allowlist that bypasses the LLM filter. For example, bank websites or medical websites can be added to directly bypass. This can be a customizable setting in the extension.
4. **Offline funcitonality**: If the device is offline, the user will be unable to browse anyhow. If the LLM API is down, the extension should show a pop-up without blocking browsing.
5. **Dynamic Content**: Some pages might have content that loads in later, or massive HTML files. The extension is intended to roughly vet websites, so extreme precision should not be expected. The decision should be made with a relatively small amount of content. 
6. **Value proposition and competition**: I've tried other extensions, and thye're mainly related to blocking or allowing specific websites. This was not the exact user experience I'm looking for. Additionally, this is my own personal experiment, so I'm not too concerned about a failing product.

### Nice to haves
1. Completed goal recap: storing goals the user has set for themselves, and providing an interface for the user to look at what they've accomplished.
2. Productive breaks: similar to changing the goal or adding a timer, it might be helpful to add a mode to allow for a break that essentially disables the extension for a given timer. The user can initiate this by solving a challenge like above.
3. Rabbit-hole prevention: See alignment-ambiguity under **edge cases**.
4. False-positive override: Add an option to override a block if a page is blocked that should be allowed. Additionally, the link to the page should be logged as well as the goal. This will provide some data that will help fine tune the app on various failure cases.

## Implementation Details

### Architecture
The extension will consist of three main components:
1. **Background Service Worker**: Manages state (current goal, allowlist, history), intercepts navigation events, and communicates with the backend API
2. **Content Script**: Extracts page content and metadata from active tabs
3. **UI Components**: Goal input popup, blocked page redirect, settings panel

The backend infrastructure:
1. **API Gateway**: Public-facing REST API endpoint with authentication
2. **Lambda Function**: Processes requests and communicates with Bedrock
3. **AWS Bedrock**: LLM service (Claude or other models for cost efficiency)

### Technology Stack
- **Browser Extension**: Chrome Extension Manifest V3 (compatible with Chrome, Edge, Brave)
- **Backend**: AWS API Gateway + Lambda + Bedrock
- **LLM Provider**: AWS Bedrock (Claude Haiku or similar for cost efficiency)
- **Storage**: Chrome Storage API for goals, settings, and history
- **Language**: TypeScript for extension, Python/Node.js for Lambda

### Authentication Strategy

**Initial Implementation (Personal Use):**
- Generate a single API key in AWS API Gateway
- Store key privately in extension code (not committed to public repo)
- API Gateway validates key on each request
- Simple and sufficient for personal use

**Future Public Release Options:**

*Option 1: AWS Cognito + IAM (Recommended for public)*
- Users sign up/log in via Cognito
- JWT tokens issued and validated by API Gateway
- Rate limiting per user identity
- Track and revoke access per user
- No secrets in public extension code

*Option 2: User-Provided API Keys*
- Users generate their own AWS API key
- Store in extension settings (Chrome storage)
- Users control their own costs
- Simple to implement, easy to revoke

For now, the simpler single API key approach will be used. Migration to Cognito can happen before public release.

### Core Flow
1. User navigates to new URL → background worker intercepts
2. Check allowlist (banks, medical sites) → if match, allow immediately
3. Check if search engine → extract search terms, verify alignment with goal
4. Extract page content (title, meta description, first ~1000 chars of text)
5. Send to backend API (Lambda) with authentication header
6. Lambda invokes Bedrock with prompt: "Goal: {goal}. Page: {content}. Aligned? Return: yes/no/uncertain"
7. Lambda returns decision to extension
8. Apply decision logic based on response and uncertainty streak
9. Allow page or redirect to goal reminder

### Backend API Structure

**API Gateway Endpoint:**
```
POST /check-alignment
Headers:
  - x-api-key: {API_KEY}
  - Content-Type: application/json
Body:
  {
    "goal": "user's current goal",
    "pageTitle": "page title",
    "pageUrl": "https://example.com",
    "pageContent": "truncated content...",
    "goalSpecificity": "vague|specific"
  }
Response:
  {
    "aligned": "yes|no|uncertain",
    "confidence": 0.85
  }
```

**Lambda Function:**
- Validates request payload
- Constructs prompt for Bedrock
- Invokes Bedrock model (Claude Haiku)
- Parses response and returns decision
- Handles errors gracefully (fail open on API errors)

### LLM Prompt Structure
```
You are helping enforce focus. The user's goal is: "{goal}"

Page title: {title}
Page URL: {url}
Page content: {truncated_content}

Is this page aligned with the user's goal?
- Return "yes" if clearly aligned
- Return "no" if clearly not aligned  
- Return "uncertain" if ambiguous

Response format: {"aligned": "yes|no|uncertain", "confidence": 0.0-1.0}
```

### Infrastructure Costs Estimate
- **Bedrock (Claude Haiku)**: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens
- **API Gateway**: $3.50 per million requests + $0.09/GB data transfer
- **Lambda**: Minimal (within free tier for this use case)

**Monthly estimate for 100 pages/day:**
- 3,000 requests/month × ~2K tokens input = 6M tokens input = ~$1.50
- 3,000 requests × ~50 tokens output = 150K tokens output = ~$0.19
- API Gateway: 3,000 requests = ~$0.01
- **Total: ~$2/month**

### Data Storage
- `currentGoal`: {text: string, timestamp: number, specificity: "vague"|"specific"}
- `completedGoals`: Array of {text, startTime, endTime}
- `allowlist`: Array of URL patterns
- `uncertaintyStreak`: number
- `settings`: {mathChallengeEnabled, redirectDelay, maxUncertaintyStreak}

### Privacy Considerations
- Allowlist bypasses LLM entirely for sensitive sites
- No persistent logging of page content
- API calls include only truncated, sanitized content
- User can view/clear all stored data

## Implementation Plan

### Phase 1: Core MVP (Week 1-2)
1. Set up Chrome extension boilerplate with Manifest V3
2. Set up AWS infrastructure:
   - Create API Gateway with API key authentication
   - Create Lambda function for Bedrock integration
   - Configure Bedrock access (Claude Haiku model)
3. Implement goal input popup and storage
4. Create background worker to intercept navigation
5. Build API integration (extension → API Gateway → Lambda → Bedrock)
6. Implement simple allow/block logic
7. Create blocked page redirect UI

**Deliverable**: Basic extension that prompts for goal and blocks/allows pages based on LLM response via AWS backend

### Phase 2: Edge Cases & UX (Week 3)
1. Add allowlist functionality for sensitive sites
2. Implement redirect delay (3 second timer)
3. Add search engine detection and query checking
4. Build uncertainty streak tracking
5. Add math challenge for goal changes/disable
6. Implement goal completion flow

**Deliverable**: Functional extension handling major edge cases

### Phase 3: Polish & Features (Week 4)
1. Add timed goals feature
2. Build settings panel (including API key management for future)
3. Implement completed goals history view
4. Add specificity detection (vague vs specific goals)
5. Optimize content extraction and token usage
6. Error handling for API failures
7. Add CloudWatch monitoring for backend costs

**Deliverable**: Feature-complete extension ready for personal use

### Phase 4: Testing & Iteration (Ongoing)
1. Daily dogfooding and bug fixes
2. Monitor API costs via CloudWatch
3. Tune LLM prompts based on false positives/negatives
4. Adjust uncertainty thresholds
5. Add nice-to-have features as needed

**Success Metrics**:
- Extension used daily for 2+ weeks
- <5% false positive rate on blocked pages
- API costs under $5/month
- Subjective improvement in browsing focus

### Future: Public Release Preparation
1. Migrate to AWS Cognito authentication
2. Implement per-user rate limiting
3. Add user dashboard for usage tracking
4. Set up WAF rules for abuse prevention
5. Create user documentation and onboarding flow 

