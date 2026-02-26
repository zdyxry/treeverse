import { HierarchyPointNode } from 'd3-hierarchy'
import { FeedController } from './feed_controller'
import { TweetVisualization } from './tweet_visualization'
import { TweetNode, TweetTree } from './tweet_tree'
import { TweetServer } from './tweet_server'
import { Toolbar } from './toolbar'
import { ContentProxy } from './proxy'

export type PointNode = HierarchyPointNode<TweetNode>

const expandText = 'Expand All'
const cancelExpandText = 'Stop Expanding'

/**
 * The controller for the main tree visualization.
 */
export class VisualizationController {
  private tweetTree: TweetTree | null = null
  private vis: TweetVisualization
  private feed: FeedController
  private toolbar: Toolbar
  private server: TweetServer | null = null
  private expandingTimer: number | null = null
  private expandButton: HTMLButtonElement | null = null

  fetchTweets(tweetId: string) {
    this.server!.requestTweets(tweetId, null).then((tweetSet) => {
      let tweetTree = TweetTree.fromTweetSet(tweetSet)
      document.getElementsByTagName('title')[0].innerText =
        `${tweetTree.root.tweet.username} - "${tweetTree.root.tweet.bodyText}" in Treeverse`

      this.setInitialTweetData(tweetTree)
    })
  }

  setInitialTweetData(tree: TweetTree) {
    this.tweetTree = tree
    this.vis.setTreeData(tree)
    this.vis.zoomToFit()
  }

  private expandNode(node: TweetNode, retry: boolean = true) {
    const cursor = node.cursor
    this.server!
      .requestTweets(node.tweet.id, cursor)
      .then((tweetSet) => {
        let added = this.tweetTree!.addTweets(tweetSet)
        if (added > 0) {
          this.vis.setTreeData(this.tweetTree!)
          if (node === this.tweetTree!.root) {
            this.vis.zoomToFit()
          }
        } else if (retry) {
          this.expandNode(node, false)
        }
      })
  }

  expandOne() {
    for (let tweetNode of this.tweetTree!.index.values()) {
      if (tweetNode.hasMore()) {
        this.expandNode(tweetNode, true)
        return
      }
    }
    this.stopExpanding()
  }

  stopExpanding() {
    if (this.expandButton) {
      this.expandButton.textContent = expandText
    }
    if (this.expandingTimer !== null) {
      clearInterval(this.expandingTimer)
      this.expandingTimer = null
    }
  }

  expandAll() {
    if (this.expandingTimer === null) {
      if (this.expandButton) {
        this.expandButton.textContent = cancelExpandText
      }
      this.expandingTimer = window.setInterval(this.expandOne.bind(this), 1000)
    } else {
      this.stopExpanding()
    }
  }

  constructor(proxy: ContentProxy | null = null) {
    const offline = proxy === null
    this.server = offline ? null : new TweetServer(proxy)
    this.feed = new FeedController(document.getElementById('feedContainer')!)
    this.vis = new TweetVisualization(document.getElementById('tree')!)
    this.expandingTimer = null

    this.toolbar = new Toolbar(document.getElementById('toolbar')!)
    if (!offline) {
      this.expandButton = this.toolbar.addButton('Expand All', this.expandAll.bind(this))
    }

    this.vis.on('hover', (_event: Event, d: unknown) => {
      this.feed.setFeed(d as PointNode)
    })
    if (!offline) {
      this.vis.on('dblclick', (_event: Event, d: unknown) => {
        this.expandNode(d as TweetNode, true)
      })
    }
  }
}
