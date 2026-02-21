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
  }

  function showGoalView(goal) {
    noGoalView.classList.add('hidden');
    hasGoalView.classList.remove('hidden');
    currentGoalText.textContent = goal.text;
    
    const elapsed = Math.floor((Date.now() - goal.timestamp) / 60000);
    goalTime.textContent = `Started ${elapsed} minute${elapsed !== 1 ? 's' : ''} ago`;
  }

  function detectSpecificity(text) {
    // Simple heuristic: longer, more detailed goals are more specific
    const words = text.split(/\s+/).length;
    return words > 5 ? 'specific' : 'vague';
  }
});
