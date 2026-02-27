import { VisualizationController } from './visualization_controller'
import { createPage } from './page'
import { ContentProxy } from './proxy'

console.log('[Treeverse] main.ts loaded')

/**
 * Contains entry points for bootstrapping the visualization for
 * different modes.
 */
export namespace Treeverse {
  export const PROXY = new ContentProxy()
  PROXY.inject()

  chrome.runtime.onMessage.addListener(
    function(request, _sender, sendResponse) {
      console.log('[Treeverse] content script received message:', request)
      // MV3: Use chrome.runtime.getURL instead of chrome.extension.getURL
      var baseUrl = chrome.runtime.getURL('resources')

      if (request.action === 'launch') {
        console.log('[Treeverse] launching with tweetId:', request.tweetId)
        Treeverse.initialize(baseUrl, request.tweetId)
        sendResponse({success: true})
      }
      return true
    })

  export function initialize(baseUrl: string, tweetId: string) {
    fetch(baseUrl + '/index.html').then((response) => response.text()).then((html) => {
      let parser = new DOMParser()
      let doc = parser.parseFromString(html, 'text/html')

      let baseEl = doc.createElement('base')
      baseEl.setAttribute('href', baseUrl + '/')
      doc.head.prepend(baseEl)

      window.history.pushState('', '', '')

      window.addEventListener('popstate', function () {
        window.location.reload()
      })

      document.getElementsByTagName('head')[0].replaceWith(doc.head)
      document.getElementsByTagName('body')[0].replaceWith(doc.body)

      createPage(document.getElementById('root')!)

      let controller = new VisualizationController(Treeverse.PROXY)
      controller.fetchTweets(tweetId)
    })
  }
}

(window as any).Treeverse = Treeverse
