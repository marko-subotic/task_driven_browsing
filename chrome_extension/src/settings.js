// Load current allowlist
chrome.storage.local.get(['allowlist'], (result) => {
  const allowlist = result.allowlist || [];
  document.getElementById('allowlist').value = allowlist.join('\n');
});

// Save button
document.getElementById('save-btn').addEventListener('click', () => {
  const text = document.getElementById('allowlist').value;
  const allowlist = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  chrome.storage.local.set({ allowlist }, () => {
    showStatus('Settings saved successfully!');
    // Notify background script to reload allowlist
    chrome.runtime.sendMessage({ type: 'RELOAD_ALLOWLIST' });
  });
});

// Reset button
document.getElementById('reset-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'GET_DEFAULT_ALLOWLIST' }, (response) => {
    document.getElementById('allowlist').value = response.allowlist.join('\n');
  });
});

function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status success';
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}
