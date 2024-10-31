let reloadIntervalId;

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'startReload') {
    const { tabId, interval } = request;

    if (reloadIntervalId) clearInterval(reloadIntervalId);

    reloadIntervalId = setInterval(() => {
      chrome.tabs.reload(tabId);
    }, interval);

  } else if (request.action === 'stopReload') {
    clearInterval(reloadIntervalId);
    reloadIntervalId = null;
  }
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.reloadActive?.newValue === false && reloadIntervalId) {
    clearInterval(reloadIntervalId);
    reloadIntervalId = null;
  }
});
