// Background service worker - manages state and navigation interception

import { API_ENDPOINT, API_KEY } from './config.js';

// State management
let currentGoal = null;
let uncertaintyStreak = 0;
let allowlist = [];
const MAX_UNCERTAINTY_STREAK = 5;
const REDIRECT_DELAY_MS = 3000;

// Default allowlist patterns for sensitive sites
const DEFAULT_ALLOWLIST = [
  'accounts.google.com',
  'login.',
  'auth.',
  'signin.',
  'signup.',
  'bank',
  'chase.com',
  'wellsfargo.com',
  'bankofamerica.com',
  'healthcare',
  'medical',
  'patient',
  'mychart',
  'chrome://newtab',
  'chrome-search://'
];

// Track pending checks
const pendingChecks = new Map();

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['currentGoal'], (result) => {
    if (!result.currentGoal) {
      // Open popup to set initial goal
      chrome.action.openPopup();
    }
  });
});

// Load state from storage
chrome.storage.local.get(['currentGoal', 'uncertaintyStreak', 'allowlist'], (result) => {
  currentGoal = result.currentGoal || null;
  uncertaintyStreak = result.uncertaintyStreak || 0;
  allowlist = result.allowlist || DEFAULT_ALLOWLIST;
});

// Track vetted tabs
const vettedTabs = new Set();

// Listen for navigation events
chrome.webNavigation.onCommitted.addListener(async (details) => {
  // Only check main frame navigations
  if (details.frameId !== 0) return;
  
  // Skip chrome://, extension pages, and empty URLs
  if (details.url.startsWith('chrome://') || 
      details.url.startsWith('chrome-extension://') ||
      details.url === '' ||
      details.url === 'about:blank') {
    return;
  }

  // Cancel any pending check for this tab
  if (pendingChecks.has(details.tabId)) {
    clearTimeout(pendingChecks.get(details.tabId));
  }

  // Mark as not vetted on navigation
  vettedTabs.delete(details.tabId);

  // Check if we have a goal
  if (!currentGoal) {
    chrome.action.openPopup();
    return;
  }

  // Check allowlist immediately
  if (isAllowlisted(details.url)) {
    vettedTabs.add(details.tabId);
    return;
  }

  // Schedule alignment check after delay
  const timeoutId = setTimeout(() => {
    pendingChecks.delete(details.tabId);
    checkAlignment(details.tabId, details.url);
  }, REDIRECT_DELAY_MS);
  
  pendingChecks.set(details.tabId, timeoutId);
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Skip if already vetted
  if (vettedTabs.has(activeInfo.tabId)) {
    return;
  }

  // Check if we have a goal
  if (!currentGoal) {
    return;
  }

  // Get tab info
  const tab = await chrome.tabs.get(activeInfo.tabId);
  
  // Skip chrome://, extension pages, and empty URLs
  if (tab.url.startsWith('chrome://') || 
      tab.url.startsWith('chrome-extension://') ||
      tab.url === '' ||
      tab.url === 'about:blank') {
    return;
  }

  // Check allowlist immediately
  if (isAllowlisted(tab.url)) {
    vettedTabs.add(activeInfo.tabId);
    return;
  }

  // Cancel any pending check for this tab
  if (pendingChecks.has(activeInfo.tabId)) {
    clearTimeout(pendingChecks.get(activeInfo.tabId));
  }

  // Schedule alignment check after delay
  const timeoutId = setTimeout(() => {
    pendingChecks.delete(activeInfo.tabId);
    checkAlignment(activeInfo.tabId, tab.url);
  }, REDIRECT_DELAY_MS);
  
  pendingChecks.set(activeInfo.tabId, timeoutId);
});

async function checkAlignment(tabId, url) {
  try {
    // Check if this tab is still active
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab || activeTab.id !== tabId) {
      // Tab is no longer active, don't check
      return;
    }

    // Check allowlist first
    if (isAllowlisted(url)) {
      vettedTabs.add(tabId);
      return;
    }

    // Get page content
    const pageData = await getPageData(tabId, url);
    
    // Call API
    const response = await fetch(`${API_ENDPOINT}/check-alignment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        goal: currentGoal.text,
        pageTitle: pageData.title,
        pageUrl: url,
        pageContent: pageData.content,
        goalSpecificity: currentGoal.specificity || 'vague'
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Alignment check result:', result);
    
    // Handle decision
    if (result.aligned === 'no') {
      blockPage(tabId);
      vettedTabs.delete(tabId);
    } else if (result.aligned === 'uncertain') {
      uncertaintyStreak++;
      chrome.storage.local.set({ uncertaintyStreak });
      
      if (uncertaintyStreak >= MAX_UNCERTAINTY_STREAK) {
        blockPage(tabId);
        vettedTabs.delete(tabId);
        uncertaintyStreak = 0;
        chrome.storage.local.set({ uncertaintyStreak: 0 });
      } else {
        vettedTabs.add(tabId);
      }
    } else {
      // Reset streak on clear alignment
      uncertaintyStreak = 0;
      chrome.storage.local.set({ uncertaintyStreak: 0 });
      vettedTabs.add(tabId);
    }
  } catch (error) {
    console.error('Alignment check failed:', error);
    // Fail open - allow browsing if API is down
    vettedTabs.add(tabId);
  }
}

async function getPageData(tabId, url) {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        return {
          title: document.title,
          content: document.body.innerText.substring(0, 1000)
        };
      }
    });
    return result.result;
  } catch (error) {
    return {
      title: '',
      content: ''
    };
  }
}

function isAllowlisted(url) {
  return allowlist.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()));
}

function blockPage(tabId) {
  const blockedUrl = chrome.runtime.getURL('public/blocked.html');
  chrome.tabs.update(tabId, { url: blockedUrl });
}

// Message handler for popup communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_GOAL') {
    currentGoal = message.goal;
    chrome.storage.local.set({ currentGoal });
    sendResponse({ success: true });
  } else if (message.type === 'GET_GOAL') {
    sendResponse({ goal: currentGoal });
  } else if (message.type === 'COMPLETE_GOAL') {
    // Store completed goal
    chrome.storage.local.get(['completedGoals'], (result) => {
      const completed = result.completedGoals || [];
      completed.push({
        ...currentGoal,
        endTime: Date.now()
      });
      chrome.storage.local.set({ completedGoals: completed });
    });
    
    currentGoal = null;
    chrome.storage.local.set({ currentGoal: null });
    chrome.action.openPopup();
    sendResponse({ success: true });
  } else if (message.type === 'RELOAD_ALLOWLIST') {
    chrome.storage.local.get(['allowlist'], (result) => {
      allowlist = result.allowlist || DEFAULT_ALLOWLIST;
    });
    sendResponse({ success: true });
  } else if (message.type === 'GET_DEFAULT_ALLOWLIST') {
    sendResponse({ allowlist: DEFAULT_ALLOWLIST });
  }
  return true; // Keep channel open for async response
});
