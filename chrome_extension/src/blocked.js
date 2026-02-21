// Load and display current goal
console.log('Blocked page loaded, fetching goal...');
chrome.storage.local.get(['currentGoal'], (result) => {
  console.log('Storage result:', result);
  const goalText = document.getElementById('goal-text');
  if (result.currentGoal && result.currentGoal.text) {
    goalText.textContent = result.currentGoal.text;
  } else {
    goalText.textContent = 'No goal set';
  }
});
