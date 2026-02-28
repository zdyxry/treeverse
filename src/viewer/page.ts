export function createPage(container: HTMLElement) {
  let pageHTML = `
        <div id="treeContainer">
            <svg id="tree"></svg>
        </div>
        <div id="sidebar" class="bg-base-200">
            <div id="toolbar" class="p-2 border-b border-base-300 flex gap-2"></div>
            <div id="feedContainer">
                <div id="feedInner">
                    <div id="feed" class="space-y-3">
                    </div>
                </div>
            </div>
        </div>
    `

  container.innerHTML = pageHTML
}
