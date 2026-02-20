# Task Driven Browsing

## Motivation
Computers combined with the internet are an incredibly powerful tool, helping humans unlock vast amounts of knowledge with very little effort and cost required. When used in an effective way, they can aid people in accomplishing impressive tasks that would have been unimaginable to previous eras’ society. As the spiderman comics once proclaimed, with great power comes great responsibility. Being able to search and find anything the human brain can imagine can lead to numerous distractions and trouble focusing. I have experienced trouble in much of my life with grappling for control with the freedom of the internet and accomplishing specific tasks that are conceptually alluring.

Some trouble that I found is that I have too much freedom in the way I used my computer. When I open it, my brain is open to access pretty much anything. Often, I open my computer with a vague intention to be “productive”, without having a specific goal. Other times, I have an idea, but my attention wanders off after some time spent working. My hypothesis is that having an explicitly stated goal to accomplish before actually attempting to achieve the goal would make it easier to lead a more intentional computer use life. Having an intentionally stated goal would also make it easier to mechanize a tool to keep me on the goal. Some kind of helper that makes sure that the use of my computer (usually the browser specifically) is aligned with the explicitly stated goal.

## Product Idea
To address the issue I’ve introduced above, my idea is to create a browser extension that will help facilitate a structured browsing experience driven by an explicit goal. 

### User experience
When opening the browser to start a new session, a page or pop-up shows up and prompts the user to enter their goal for the session. They will enter their goal, and it will be stored in the extension. Then, whenever the user surfs to a new web page, the extension checks whether the new web page is aligned with the session goal. If the page is aligned, the user is allowed to visit it and the extension remains dormant. If the page is not aligned, the page is blocked; the user is redirected to some simple page that reminds them of their overall goal. 

### Edge Cases
1. Multiple goals: my vision is that the user should only have a single goal at a time. Humans have trouble with multi-tasking, and once focus is derailed, it is difficult to rebuild.
2. Opening a different window/incognito mode: I often open a new window for a group of related searches, like math homework and keep these tabs open. I think this is not an issue, as long as the extension is able to keep the same goal across all windows. This way, you cannot bypass the extension. If you’d like to access a different group of tabs, you may change your goal. Additionally, there might be a large amount of tabs open, under various grouping. This is fine, only the active tab of the user should be relevant. 
3. Disabling of the extension: if the extension is easy to disable, the user might be tempted to bypass it, or quickly change the goals. A simple math challenge that requires some cognitive effort might be an effective way to prevent a human from doing this, such as double digit multiplication.

## Implementation ideas
A way to implement the verification of alignment that allows the user to describe their design in natural language would be to pass website contents to an LLM, and have the LLM verify it. There could be a pop-up for the user to enter their goal, which is saved to some global state. This goal would then be injected into an LLM along with perhaps the HTML contents of the web page, asking the LLM to output a boolean asking if the website aligns with the 
