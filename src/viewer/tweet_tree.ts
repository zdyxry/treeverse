import { hierarchy, HierarchyPointNode } from 'd3-hierarchy'
import { TweetSet, Tweet } from './tweet_parser'


export class TweetTree {
  root!: TweetNode
  index!: Map<string, TweetNode>

  private constructor() { }

  static fromTweetSet(tweetSet: TweetSet): TweetTree {
    let tree = new TweetTree()

    tree.index = new Map()
    let { tweets, rootTweet } = tweetSet

    for (let tweet of tweets) {
      if (tweet.id == rootTweet) {
        tree.root = new TweetNode(tweet)
        tree.index.set(tweet.id, tree.root)
        break
      }
    }

    tree.addTweets(tweetSet)

    return tree
  }

  static fromRoot(root: TweetNode) {
    let tree = new TweetTree()

    tree.root = root
    return tree
  }

  setCursor(tweetId: string, cursor: string) {
    this.index.get(tweetId)!.cursor = cursor
  }

  addTweets(tweetSet: TweetSet, expandedNodeId?: string) {
    let count = 0
    let { tweets, rootTweet, cursor } = tweetSet

    tweets.sort((a, b) => parseInt(a.id) - parseInt(b.id))

    for (let tweet of tweets) {
      if (!this.index.has(tweet.id)) {
        count += 1
        let node = new TweetNode(tweet)
        if (tweet.parent && this.index.has(tweet.parent)) {
          this.index.get(tweet.parent)!.children.set(tweet.id, node)
        }
        this.index.set(tweet.id, node)
      }
    }

    // Update the expanded node status
    const targetNodeId = expandedNodeId || rootTweet
    const targetNode = this.index.get(targetNodeId)
    if (targetNode) {
      targetNode.complete = true

      if (cursor) {
        targetNode.cursor = cursor
        targetNode.fullyLoaded = false
      } else {
        targetNode.fullyLoaded = true
        targetNode.cursor = null
      }
      
      // If no new tweets were added and we have cursor, mark as fully loaded
      // to prevent infinite loading when API returns empty results
      if (count === 0 && !targetNode.fullyLoaded) {
        targetNode.fullyLoaded = true
        targetNode.cursor = null
      }
    }
    return count
  }

  toHierarchy() {
    return hierarchy(this.root, (d: TweetNode) => Array.from(d.children.values()))
  }

  /**
   * Generate Mermaid flowchart markdown representation of the tree
   */
  toMermaidMarkdown(): string {
    const lines: string[] = []
    lines.push('```mermaid')
    lines.push('graph TD')
    
    // Helper to sanitize text for Mermaid
    const sanitize = (text: string): string => {
      return text
        .replace(/\[/g, '【')
        .replace(/\]/g, '】')
        .replace(/"/g, '"')
        .replace(/\n/g, '<br/>')
        .substring(0, 100) // Limit length
    }
    
    // Helper to create node ID
    const nodeId = (id: string): string => `N${id.substring(0, 12)}`
    
    // Traverse tree and generate nodes and edges
    const traverse = (node: TweetNode, depth: number = 0) => {
      const id = nodeId(node.getId())
      const text = sanitize(node.tweet.bodyText)
      const user = sanitize(node.tweet.username)
      
      // Define node with content
      lines.push(`    ${id}["${text}<br/><small>@${user}</small>"]`)
      
      // Create edges to children
      for (const child of node.children.values()) {
        const childId = nodeId(child.getId())
        lines.push(`    ${id} --> ${childId}`)
        traverse(child, depth + 1)
      }
    }
    
    traverse(this.root)
    lines.push('```')
    
    return lines.join('\n')
  }
}

/**
 * A tree node representing an individual tweet.
 */
export class TweetNode {
  children: Map<string, TweetNode>

  tweet: Tweet
  cursor: string | null = null
  fullyLoaded: boolean = false
  complete: boolean = false

  constructor(tweet: Tweet) {
    this.children = new Map<string, TweetNode>()
    this.tweet = tweet
  }

  getId() {
    return this.tweet.id
  }

  /**
   * Whether the red dot indicator should be shown.
   * Once a node has been expanded (complete=true), the dot disappears permanently.
   */
  showHasMoreIcon(): boolean {
    return !this.complete && this.tweet.replies > 0
  }

  /**
   * Whether there are more pages of replies to fetch from the API.
   */
  canLoadMorePages(): boolean {
    if (this.fullyLoaded) return false
    if (this.cursor) return true
    if (this.children.size >= this.tweet.replies) return false
    return true
  }
}
