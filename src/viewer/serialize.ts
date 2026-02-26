import { Tweet, TweetSet } from './tweet_parser'
import { TweetTree, TweetNode } from './tweet_tree'

export class SerializableTweetTree {
  tweet: Tweet
  children: SerializableTweetTree[]

  constructor(tweetNode: TweetNode) {
    this.tweet = tweetNode.tweet
    this.children = Array.from(tweetNode.children.values()).map(child => new SerializableTweetTree(child))
  }

  static deserialize(obj: any): TweetTree {
    return TweetTree.fromRoot(this.deserializeNode(obj))
  }

  private static deserializeNode(obj: any): TweetNode {
    let node = new TweetNode(obj.tweet as Tweet)
    for (let child of obj.children || []) {
      let childNode = this.deserializeNode(child)
      node.children.set(childNode.getId(), childNode)
    }
    return node
  }
}
