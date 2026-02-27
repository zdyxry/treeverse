import { select, Selection } from 'd3-selection'
import { interpolateNumber } from 'd3-interpolate'
// Import d3-transition to enable transition method on selections
import 'd3-transition'
import { PointNode } from './visualization_controller'
import { TweetNode } from './tweet_tree'
import { HierarchyPointNode } from 'd3-hierarchy'

/**
 * Controller for the "feed" display that shows the conversation
 * leading up to the selected tweet.
 */
export class FeedController {
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  async exitComments(comments: Selection<Element, unknown, null, undefined>): Promise<void> {
    return new Promise<void>((resolve) => {
      if (comments.exit().size() == 0) {
        resolve()
        return
      }
      comments
        .exit()
        .transition().duration(100)
        .on('end', () => resolve())
        .style('opacity', 0)
        .remove()
    })
  }

  async enterComments(comments: Selection<Element, unknown, null, undefined>): Promise<void> {
    console.log('[Treeverse] enterComments called, enter size:', comments.enter().size())
    return new Promise<void>((resolve) => {
      if (comments.enter().size() == 0) {
        resolve()
        return
      }
      console.log('[Treeverse] creating comment elements...')
      comments
        .enter()
        .append('div')
        .classed('comment', true)
        .each(function (this: Element, datum: unknown) {
          const d = datum as PointNode
          let tweet = d.data.tweet
          let div = select(this)

          div
            .append('a')
            .classed('avatar', true)
            .append('img')
            .attr('src', tweet.avatar)
            .style('height', 'auto')
            .style('max-width', '35px')
            .style('width', 'auto')
            .style('max-height', '35px')

          let content = div
            .append('div')
            .classed('content', true)

          content
            .append('span')
            .classed('author', true)
            .html(`${tweet.name} (<a href="${tweet.getUserUrl()}">@${tweet.username}</a>)`)

          let body = content
            .append('div')
            .classed('text', true)
            .classed('rtl', tweet.rtl)
            .html(tweet.bodyHtml)

          body.append('a')
            .html(' &rarr;')
            .attr('href', tweet.getUrl())

          if (tweet.images) {
            let imgWidth = 100 / tweet.images.length
            content.append('div')
              .classed('extra images', true)
              .selectAll('img')
              .data(tweet.images)
              .enter()
              .append('img')
              .attr('width', () => `${imgWidth}%`)
              .attr('src', (d: string) => d)
          }
        })
        .style('opacity', 0)
        .style('display', 'none')
        .transition().duration(100)
        .style('display', 'block')
        .style('opacity', 1)
        .on('start', () => resolve())
    })
  }

  async setFeed(node: PointNode) {
    console.log('[Treeverse] setFeed called, ancestors count:', node.ancestors().length)
    let ancestors = node.ancestors()
    ancestors.reverse()
    
    const commentsContainer = this.container.getElementsByClassName('comments')[0]
    console.log('[Treeverse] comments container:', commentsContainer)
    
    let comments = select(commentsContainer)
      .selectAll('div.comment')
      .data(ancestors, (d: unknown) => (d as HierarchyPointNode<TweetNode>).data.getId())
    
    console.log('[Treeverse] comments selection size:', comments.size(), 'enter size:', comments.enter().size(), 'exit size:', comments.exit().size())

    await this.exitComments(comments as unknown as Selection<Element, unknown, null, undefined>)
    await this.enterComments(comments as unknown as Selection<Element, unknown, null, undefined>)

    // D3 v7: Use selection.transition() instead of d3.transition(null)
    select(this.container).transition().tween('scroll',
      () => {
        let interp = interpolateNumber(this.container.scrollTop, this.container.scrollHeight)
        return (t: number) => this.container.scrollTop = interp(t)
      }
    )
  }
}
