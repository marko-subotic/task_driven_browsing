# No Goal Enforcement

## Current Behavior
When no goal is set, the extension opens the popup but allows browsing to continue. This is easy to ignore.

## Proposed Behavior
When no goal is set and user navigates to a page:
1. Create a new tab with a goal-setting page
2. Switch to that new tab
3. Leave the original navigation tab in the background

## Feedback & Considerations

### Pros
- **Harder to ignore**: Forces user to see the goal prompt
- **Preserves navigation**: Original page still loads in background
- **Clear intent**: User must explicitly set a goal or close the tab

### Cons
- **Tab proliferation**: Could create many tabs if user keeps navigating without setting a goal
- **Annoying for quick tasks**: If user just wants to check one thing quickly (weather, definition, etc.)
- **Multiple prompts**: If user opens multiple tabs quickly, could create multiple goal-setting tabs

### Alternative Approaches

**Option 1: Single persistent prompt tab**
- Only create one goal-setting tab
- If it already exists, just focus it instead of creating another
- Prevents tab spam

**Option 2: Block with inline prompt**
- Redirect to goal-setting page (replaces current page)
- Simpler, but loses the navigation (current behavior with popup)

**Option 3: Modal overlay**
- Show a full-screen modal over the page
- Can't interact with page until goal is set
- More intrusive but cleaner UX

**Option 4: Grace period**
- Allow 1-2 page navigations without a goal
- After that, enforce the prompt
- Balances convenience with enforcement

### Recommended Implementation

I recommend **Option 1** (single persistent prompt tab) because:
- Prevents tab spam
- Still enforces goal-setting
- User can't accidentally create dozens of prompt tabs
- Clear and predictable behavior

Implementation:
1. Track if a goal-setting tab is already open (store tab ID)
2. When navigation happens without goal:
   - If goal-setting tab exists, focus it
   - If not, create new goal-setting tab and store its ID
3. When goal is set, close the goal-setting tab
4. If goal-setting tab is closed manually, clear the stored ID

### Questions
1. Should the goal-setting page be a full page (not popup)?
- Yes, it should be a full page; a popup can be closed easily
2. Should we allow closing the prompt tab without setting a goal?
- No
3. What happens if user sets a goal in the popup while the prompt tab is open?
- This is fine, the goal should be set and when we go to another tab, it shouldn't reopen the prompt tab


### Chosen Implementation:
**Option 4 with proposed behavior**: there should be a 3 page grace period, but then we'll open a new tab each time. The tab clutter is ok, this should be a deterrent to try to play with the extension.
