// Popup UI logic

document.addEventListener('DOMContentLoaded', async () => {
  const noGoalView = document.getElementById('no-goal-view');
  const hasGoalView = document.getElementById('has-goal-view');
  const goalInput = document.getElementById('goal-input');
  const setGoalBtn = document.getElementById('set-goal-btn');
  const completeGoalBtn = document.getElementById('complete-goal-btn');
  const changeGoalBtn = document.getElementById('change-goal-btn');
  const currentGoalText = document.getElementById('current-goal-text');
  const goalTime = document.getElementById('goal-time');
  const enableTimerCheckbox = document.getElementById('enable-timer');
  const timerInputs = document.getElementById('timer-inputs');
  const hoursInput = document.getElementById('hours-input');
  const minutesInput = document.getElementById('minutes-input');
  const timerDisplay = document.getElementById('timer-display');
  const timeRemaining = document.getElementById('time-remaining');

  // Toggle timer inputs
  enableTimerCheckbox.addEventListener('change', () => {
    if (enableTimerCheckbox.checked) {
      timerInputs.classList.remove('hidden');
    } else {
      timerInputs.classList.add('hidden');
    }
  });

  // Load current goal
  const response = await chrome.runtime.sendMessage({ type: 'GET_GOAL' });
  
  if (response.goal) {
    showGoalView(response.goal);
  } else {
    showNoGoalView();
  }

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
      
      goal.timerDuration = totalMinutes * 60 * 1000; // Convert to milliseconds
      goal.timerEnd = Date.now() + goal.timerDuration;
    }

    await chrome.runtime.sendMessage({ type: 'SET_GOAL', goal });
    showGoalView(goal);
  });

  // Complete goal button
  completeGoalBtn.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'COMPLETE_GOAL' });
    showNoGoalView();
  });

  // Change goal button
  changeGoalBtn.addEventListener('click', () => {
    showNoGoalView();
  });

  // Settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('public/settings.html') });
  });

  function showNoGoalView() {
    noGoalView.classList.remove('hidden');
    hasGoalView.classList.add('hidden');
    goalInput.value = '';
    enableTimerCheckbox.checked = false;
    timerInputs.classList.add('hidden');
    hoursInput.value = '0';
    minutesInput.value = '30';
  }

  function showGoalView(goal) {
    noGoalView.classList.add('hidden');
    hasGoalView.classList.remove('hidden');
    currentGoalText.textContent = goal.text;
    
    const elapsed = Math.floor((Date.now() - goal.timestamp) / 60000);
    goalTime.textContent = `Started ${elapsed} minute${elapsed !== 1 ? 's' : ''} ago`;

    // Show timer if active
    if (goal.timerEnd) {
      updateTimerDisplay(goal.timerEnd);
      // Update every second
      setInterval(() => updateTimerDisplay(goal.timerEnd), 1000);
    } else {
      timerDisplay.classList.add('hidden');
    }
  }

  function updateTimerDisplay(timerEnd) {
    const remaining = timerEnd - Date.now();
    
    if (remaining <= 0) {
      timeRemaining.textContent = 'Expired';
      timerDisplay.style.background = '#f8d7da';
      timerDisplay.style.color = '#721c24';
      return;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    timeRemaining.textContent = `${hours}h ${minutes}m ${seconds}s`;
    timerDisplay.classList.remove('hidden');
  }

  function detectSpecificity(text) {
    // Simple heuristic: longer, more detailed goals are more specific
    const words = text.split(/\s+/).length;
    return words > 5 ? 'specific' : 'vague';
  }
});
