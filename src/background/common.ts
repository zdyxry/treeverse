export let matchTweetURL = 'https?://(?:mobile\\.)?(?:twitter|x)\\.com/(.+)/status/(\\d+)'
export let matchTweetURLRegex = new RegExp(matchTweetURL)

console.log('[Treeverse] common.ts loaded')

// MV3: Use chrome.storage.session for state that needs to persist across service worker restarts
// Note: chrome.storage.session is available in Chrome 102+
const STORAGE_KEY = 'tweetToLoad'

export function onMessageFromContentScript(request: any, sender: chrome.runtime.MessageSender, _sendResponse: any) {
  switch (request.message) {
  case 'ready':
    chrome.storage.session.get(STORAGE_KEY).then((result) => {
      if (result[STORAGE_KEY]) {
        launchTreeverse(sender.tab!.id!, result[STORAGE_KEY])
        chrome.storage.session.remove(STORAGE_KEY)
      }
    })
    break
  }
}

export function launchTreeverse(tabId: number, tweetId: string) {
  console.log('[Treeverse] sending launch message to tab', tabId)
  chrome.tabs.sendMessage(tabId, {
    'action': 'launch',
    'tweetId': tweetId
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Treeverse] sendMessage error:', chrome.runtime.lastError.message)
    } else {
      console.log('[Treeverse] sendMessage response:', response)
    }
  })
}

export function getTweetIdFromURL(url: string): string | undefined {
  let match = matchTweetURLRegex.exec(url)
  if (match) {
    return match[2]
  }
  return undefined
}

export async function injectScripts(tabId: number, tweetId: string) {
  console.log('[Treeverse] injectScripts called, tabId:', tabId, 'tweetId:', tweetId)
  // MV3: Use chrome.scripting.executeScript instead of chrome.tabs.executeScript
  let results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      return (typeof (window as any).Treeverse !== 'undefined') 
        ? (window as any).Treeverse.PROXY.state 
        : 'missing'
    }
  })
  
  const state = results[0]?.result
  console.log('[Treeverse] content script state:', state)

  switch (state) {
  case 'ready':
    console.log('[Treeverse] launching Treeverse...')
    launchTreeverse(tabId, tweetId)
    break
  case 'listening':
  case 'waiting':
  case 'missing':
  default:
    console.log('[Treeverse] content script not ready, reloading tab...')
    // Store tweetId in session storage for MV3 service worker persistence
    await chrome.storage.session.set({ [STORAGE_KEY]: tweetId })

    // Force the tab to reload.
    chrome.tabs.reload(tabId)
    console.log('[Treeverse] tab reload called')

    // Ensure the tab loads.
    setTimeout(() => {
      chrome.storage.session.get(STORAGE_KEY).then((result) => {
        if (result[STORAGE_KEY] !== null) {
          // Show notification instead of alert (alert not available in service worker)
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/128.png',
            title: 'Treeverse Error',
            message: `Treeverse was unable to access the tweet data needed to launch. If you report this error, please mention that the last proxy state was ${state}`
          })
        }
      })
    }, 2000)
  }
}

export function clickAction(tab: chrome.tabs.Tab) {
  console.log('[Treeverse] clickAction called, tab.url:', tab.url)
  const tweetId = getTweetIdFromURL(tab.url!)
  console.log('[Treeverse] tweetId:', tweetId)
  if (tweetId && tab.id) {
    injectScripts(tab.id, tweetId)
  } else {
    console.error('[Treeverse] Missing tweetId or tab.id')
  }
}
