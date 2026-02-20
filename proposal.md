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

## Implementation ideas
A way to implement the verification of alignment that allows the user to describe their design in natural language would be to pass website contents to an LLM, and have the LLM verify it. There could be a pop-up for the user to enter their goal, which is saved to some global state. This goal would then be injected into an LLM along with perhaps the HTML contents of the web page, asking the LLM to output a boolean asking if the website aligns with the 


---

## Feedback

### Clarifying Questions

1. **Goal duration and completion**: How does a user signal that they've completed their goal? Is there a manual "end session" action, or does closing the browser end it? What happens if they reopen the browser later?

2. **Goal modification**: You mention preventing quick goal changes with a math challenge, but what about legitimate goal changes? If a user realizes they need to pivot to a different task, what's the intended flow?

3. **Alignment ambiguity**: What happens when the LLM is uncertain about alignment (e.g., 60% confidence)? Does the user get a choice, or is there a hard threshold?

4. **Initial setup**: Does the extension block all browsing until a goal is set, or can users browse freely without setting a goal?

5. **Goal specificity**: What level of detail is expected in goals? Is "be productive" acceptable, or should it be "research React hooks for my project"?

6. **Redirect page functionality**: When redirected to the goal reminder page, can users navigate back to allowed sites, or must they close the tab?

### Technological Concerns

1. **LLM latency**: Checking every page load with an LLM could introduce noticeable delays (500ms-2s per request). This could frustrate users and make browsing feel sluggish.

2. **Cost**: LLM API calls for every page visit could become expensive quickly. Heavy browsing sessions might generate hundreds of requests per day.

3. **Privacy**: Sending full HTML content to an external LLM raises privacy concerns. Users may visit pages with sensitive information (banking, health, personal emails).

4. **Offline functionality**: What happens when there's no internet connection or the LLM API is down? Does the extension fail open (allow everything) or fail closed (block everything)?

5. **Dynamic content**: Many modern websites load content dynamically via JavaScript. Checking only initial HTML might miss the actual content the user sees.

6. **Content size limits**: Some pages have massive HTML. LLMs have token limits that might be exceeded, requiring truncation or summarization.

### Product Concerns

1. **User friction**: Requiring a goal before every browsing session adds significant friction. Users might abandon the extension if it feels too restrictive.

2. **False positives**: LLMs can misclassify pages. Blocking a legitimately relevant page could be extremely frustrating and erode trust.

3. **Legitimate breaks**: Sometimes taking a mental break is productive. The extension doesn't account for intentional, healthy diversions.

4. **Learning curve**: Users need to learn what goal specificity works best. Too vague and everything passes; too specific and legitimate research gets blocked.

5. **Competitive landscape**: How does this differ from existing focus tools like Freedom, Cold Turkey, or browser-native focus modes?

6. **Value proposition**: Is the LLM-based alignment check significantly better than simpler URL blocklists or allowlists?

### Missing Edge Cases

1. **Redirects and pop-ups**: What happens with automatic redirects, OAuth flows, or payment gateways that navigate through multiple domains?

2. **Embedded content**: If an allowed page has embedded YouTube videos or social media widgets, are those checked separately?

3. **Search engines**: Are search result pages always allowed? What about clicking through results?

4. **Documentation and reference**: Programming documentation often links to tangentially related topics. Should all docs be allowed if the goal is "learn Python"?

5. **Multi-step workflows**: Some tasks require visiting seemingly unrelated sites (e.g., "book a flight" might require checking visa requirements, weather, hotel booking sites).

6. **Shared computers**: How does the extension handle multiple users or profiles on the same browser?

7. **Mobile browsing**: Does this extend to mobile browsers, or is it desktop-only?

8. **Background tabs**: If a tab loads in the background (e.g., from a link with target="_blank"), when is it checked?

9. **Browser extensions and internal pages**: Should chrome://extensions, browser settings, or other extension pages be checked?

10. **Emergency access**: What if a user urgently needs to access something unrelated to their goal (e.g., emergency contact information)?

