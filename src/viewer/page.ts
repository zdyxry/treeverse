export function createPage(container: HTMLElement) {
    let pageHTML = `
        <div id="treeContainer">
            <svg id="tree"></svg>
        </div>
        <div id="sidebar" class="bg-base-200">
            <div id="infoBox" class="hidden">
                <div id="toolbar"></div>
            </div>
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
