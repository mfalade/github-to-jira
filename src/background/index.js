const GITHUB_URL = 'https://github.com';

chrome.webNavigation.onHistoryStateUpdated.addListener(({ url }) => {
  if (url.includes(GITHUB_URL)) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'history_state_updated' });
    });
  }
});
