'use strict';
console.log("Hello, World!")

chrome.webNavigation.onCommitted.addListener(function (tab) {
  // Prevents script from running when other frames load
  if (tab.frameId == 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

          // Get the URL of the webpage
          let url = tabs[0].url;
          // Remove unnecessary protocol definitions and www subdomain from the URL
          let parsedUrl = url.replace("https://", "")
              .replace("http://", "")
              .replace("www.", "")

          // Remove path and queries e.g. linkedin.com/feed or linkedin.com?query=value
          // We only want the base domain
          let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
              .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

          try {
              if (domain.length < 1 || domain === null || domain === undefined) {
                  console.log("Did not match mail.google.com")
                  return;
              } else if (domain == "mail.google.com") {
                  console.log("mail.google.com matched")
                  runLinkedinScript();
                  return;
              }
          } catch (err) {
              throw err;
          }

      });
  }
});

function runLinkedinScript() {
  // Inject script from file into the webpage
  chrome.tabs.executeScript({
      file: 'linkedin.js'
  });
  return true;
}

/** ------------------------- */
// OLD CODE
/** ------------------------- */
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    // Set blocked in storage.sync if unset.
    chrome.storage.sync.get('blocked', function(data) {
      if (chrome.runtime.lastError) return;
      if (Array.isArray(data.blocked)) return;
      chrome.storage.sync.set({blocked: []}, function() {
        console.log("Reset the blocked list.");
      });
    });
  }
});

function block(details) {
  return {cancel: true}
};

function blockDomainsToFilters(blocked) {
  let filters = [];
  for (let b of blocked) {
    filters.push("*://" + b);
  }
  return filters;
}

let opt_extraInfoSpec = ["blocking"];

function getBlockedWebsites(blockedWithToggle) {
  let blockedUrls = []
  for (let [url, enabled] of blockedWithToggle) {
    if (enabled)
      blockedUrls.push(url);
  }
  return blockedUrls;
}

function addBlockingListeners(state) {
  let blockedUrls = getBlockedWebsites(state);
  // Empty filter.urls is interpreted as all URLs are allowed, so we don't set
  // the listener in that case.
  if (blockedUrls.length == 0) return;
  for (let urlToBlock of blockedUrls) {
    let filter = {urls: blockDomainsToFilters([urlToBlock])};
    chrome.webRequest.onBeforeRequest.addListener(
      block, filter, opt_extraInfoSpec);
  }
}

chrome.storage.sync.get('blocked', function(data) {
  if (chrome.runtime.lastError) return;
  if (!Array.isArray(data.blocked)) return;
  addBlockingListeners(data.blocked);
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName != "sync") return;
  if (!changes.blocked) return;

  chrome.webRequest.onBeforeRequest.removeListener(block);
  addBlockingListeners(changes.blocked.newValue);
});
