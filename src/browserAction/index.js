const appUrl = chrome.extension.getURL('src/browserAction/main.js');
import(appUrl).then((app) => {
  app.default.initialize();
});
