export function createPage(container: HTMLElement) {
    let pageHTML = `
        <div id="treeContainer">
            <svg id="tree">
                <defs>
                    <symbol id="has_more">
                        <g transform="translate(20 20)">
                            <circle r="18" fill="#e11d48" stroke-width="2px" stroke="#fff" />
                            <circle r="3" cx="-9" fill="#fff" />
                            <circle r="3" cx="0" fill="#fff" />
                            <circle r="3" cx="9" fill="#fff" />
                        </g>
                    </symbol>
                </defs>
            </svg>
            <div class="legend">
                <span class="text-xs font-medium mb-1 block">Reply Times</span>
                <span class="legend-item"><span class="w-2 h-2 rounded-full bg-rose-500"></span>5m</span>
                <span class="legend-item"><span class="w-2 h-2 rounded-full bg-yellow-400"></span>10m</span>
                <span class="legend-item"><span class="w-2 h-2 rounded-full bg-amber-100"></span>1h</span>
                <span class="legend-item"><span class="w-2 h-2 rounded-full bg-cyan-400"></span>3h+</span>
            </div>
        </div>
        <div id="sidebar" class="bg-base-200">
            <div id="infoBox">
                <div class="prose prose-sm max-w-none">
                    <p class="text-base-content/80 mb-2">
                        Visualized by <a href="https://treeverse.app" class="link link-primary" target="_blank">Treeverse</a>. 
                        <a href="https://treeverse.app" class="link link-secondary" target="_blank">Read guide</a>
                    </p>
                    <p class="text-base-content/60 text-xs mb-3">
                        Double-click tweets with ellipsis to expand.
                        <a href="https://twitter.com/paulgb" class="link" target="_blank">@paulgb</a> · 
                        <a href="https://github.com/paulgb/Treeverse/issues" class="link" target="_blank">GitHub</a>
                    </p>
                </div>
                <div id="toolbar" class="flex flex-wrap gap-2 mt-3"></div>
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
