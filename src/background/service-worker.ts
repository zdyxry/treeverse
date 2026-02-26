import { matchTweetURL, clickAction, onMessageFromContentScript } from './common'

// MV3: Use chrome.action instead of chrome.pageAction
chrome.action.onClicked.addListener(clickAction)

// MV3: Use chrome.tabs.onUpdated to show/hide action button based on URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, _tab) => {
  if (changeInfo.url) {
    const matches = new RegExp(matchTweetURL).test(changeInfo.url)
    if (matches) {
      chrome.action.enable(tabId)
    } else {
      chrome.action.disable(tabId)
    }
  }
})

// Also check on tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId)
  if (tab.url) {
    const matches = new RegExp(matchTweetURL).test(tab.url)
    if (matches) {
      chrome.action.enable(activeInfo.tabId)
    } else {
      chrome.action.disable(activeInfo.tabId)
    }
  }
})

// Handle messages from content scripts
chrome.runtime.onMessage.addListener(onMessageFromContentScript)
