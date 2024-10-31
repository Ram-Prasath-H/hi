const intervalInput = document.getElementById('interval');
const toggleSwitch = document.getElementById('toggleSwitch');
const statusText = document.getElementById('status');

// Initialize the toggle state when the popup opens
chrome.storage.local.get(['reloadActive'], (result) => {
  if (result.reloadActive) {
    toggleSwitch.classList.add('active');
    statusText.textContent = 'Reload is On';
  } else {
    toggleSwitch.classList.remove('active');
    statusText.textContent = 'Reload is Off';
  }
});

// Toggle the reload function when the switch is clicked
toggleSwitch.addEventListener('click', async () => {
  const interval = parseInt(intervalInput.value, 10) * 1000;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.local.get(['reloadActive'], (result) => {
    if (result.reloadActive) {
      // Stop reloading
      chrome.storage.local.set({ reloadActive: false });
      chrome.runtime.sendMessage({ action: 'stopReload', tabId: tab.id });
      toggleSwitch.classList.remove('active');
      statusText.textContent = 'Reload is Off';
    } else {
      // Start reloading
      chrome.storage.local.set({ reloadActive: true, interval, tabId: tab.id });
      chrome.runtime.sendMessage({ action: 'startReload', tabId: tab.id, interval });
      toggleSwitch.classList.add('active');
      statusText.textContent = 'Reload is On';
    }
  });
});
