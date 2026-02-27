// Set goal page logic

document.addEventListener('DOMContentLoaded', () => {
  const goalInput = document.getElementById('goal-input');
  const setGoalBtn = document.getElementById('set-goal-btn');
  const enableTimerCheckbox = document.getElementById('enable-timer');
  const timerInputs = document.getElementById('timer-inputs');
  const hoursInput = document.getElementById('hours-input');
  const minutesInput = document.getElementById('minutes-input');

  // Toggle timer inputs
  enableTimerCheckbox.addEventListener('change', () => {
    if (enableTimerCheckbox.checked) {
      timerInputs.classList.remove('hidden');
    } else {
      timerInputs.classList.add('hidden');
    }
  });

  // Set goal button
  setGoalBtn.addEventListener('click', async () => {
    const goalText = goalInput.value.trim();
    if (!goalText) {
      alert('Please enter a goal');
      return;
    }

    const goal = {
      text: goalText,
      timestamp: Date.now(),
      specificity: detectSpecificity(goalText)
    };

    // Add timer if enabled
    if (enableTimerCheckbox.checked) {
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
      const totalMinutes = hours * 60 + minutes;
      
      if (totalMinutes === 0) {
        alert('Please set a timer duration');
        return;
      }
      
      goal.timerDuration = totalMinutes * 60 * 1000;
      goal.timerEnd = Date.now() + goal.timerDuration;
    }

    await chrome.runtime.sendMessage({ type: 'SET_GOAL', goal });
    
    // Close this tab
    const tab = await chrome.tabs.getCurrent();
    chrome.tabs.remove(tab.id);
  });

  // Focus on input
  goalInput.focus();
});

function detectSpecificity(text) {
  const words = text.split(/\s+/).length;
  return words > 5 ? 'specific' : 'vague';
}
