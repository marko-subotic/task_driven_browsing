# Adding a timer

I'd like to have an option when setting a goal to have a timer

## Design Questions

1. Timer behavior when expired: Should it:
   - Block all pages and force setting a new goal?
   - Show a notification but allow continued browsing?
   - Auto-complete the goal and prompt for a new one?

2. Timer input: Should users enter:
   - Minutes only (e.g., "30")?
   - Hours and minutes (e.g., "1h 30m")?
   - Preset options (15min, 30min, 1hr, 2hr)?

3. Timer visibility: Should there be:
   - A countdown display in the popup?
   - A badge on the extension icon showing remaining time?

4. Timer persistence: If the browser closes and reopens, should the timer:
   - Continue counting down from where it left off?
   - Reset/cancel?

## Answers
1. It should function like selecting 'complete goal' from the settings when completing it. It should complete the goal, and the
state of the application should return to no goal.
2. Input should be two boxes: hour:minute with text input and arrows to increase or decrease each input
3. There doesn't have to be visibility on the icon, but the pop up should display the timer with the goal if it is active
4. I don't have a preference, whatever is simplest to implement. This should not be a frequent use case.