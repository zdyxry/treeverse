**NOTE: Post-acquisition, Twitter started making life difficult for applications like Treeverse that access twitter data. Since I don't have time to play cat-and-mouse games with a hostile platform, I'm retiring Treeverse.** The codebase of Treeverse dates back to a bookmarklet I wrote in 2014. It's been a pleasure to see something started as a curiosity project picked up by the OSINT and archivist communities. Thanks to everyone who shared their enthusiasm over the years.

![NetflixOSS Lifecycle](https://img.shields.io/osslifecycle/paulgb/Treeverse.svg)

![Treeverse Icon](public/icons/32.png) Treeverse
=========

Treeverse is a tool for visualizing and navigating Twitter/X conversation threads.

It is available as a browser extension for Chrome (Manifest V3).

Installation
------------

### Chrome Users:

<a href="https://chrome.google.com/webstore/detail/treeverse/aahmjdadniahaicebomlagekkcnlcila?hl=en">
    <img src="images/download_chrome.png" alt="Download Treeverse for Chrome" style="width: 206px; height: 58px">
</a>

Introduction
------------

After installing Treeverse for your browser, open X (Twitter) and click on the tweet that you would like to visualize the conversation of.

The icon for Treeverse should turn from grey to blue in your browser. Click it to enter Treeverse.

<img src="images/chrome_treeverse.gif" alt="Opening Treeverse in Chrome" style="width: 320px; height: 180px;" />

Exploring the Conversation
--------------------------

![Screenshot of Treeverse.](images/treeverse640.gif)

Conversations are visualized as a tree. Each box is an individual tweet, and
an line between two boxes indicates that the lower one is a reply to the upper
one. The color of the line indicates the time duration between the two tweets
(red is faster, blue is slower.)

As you hover over nodes, the reply-chain preceeding that tweet appears on the right-side
pane. By clicking a node, you can freeze the UI on that tweet in order to interact with
the right-side pane. By clicking anywhere in the tree window, you can un-freeze the tweet
and return to the normal hover behavior.

![Right pane in action.](images/right_pane.png)

Some tweets will appear with a red circle with white ellipses inside them, either overlayed
on them or as a separate node. This means that
there are more replies to that tweet that haven't been loaded. Double-clicking a node will
load additional replies to that tweet.

![More tweets indicator.](images/red_circles.png)

Privacy
-------

Treeverse runs entirely in your browser. No data is collected or tracked by Treeverse directly
when you use or install it. Browser extension installs may be tracked by Google, and the data
requests made to X/Twitter may be tracked by X/Twitter.

Additionally, when Treeverse runs it loads a font hosted by Google Fonts (https://fonts.google.com/). Google may track this download.

Bugs & Contact
--------------

[Report on GitHub](https://github.com/paulgb/treeverse/issues).

Credits
-------

Icon created by [Eli Schiff](http://www.elischiff.com/).

Treeverse would not be possible without the excellent [d3.js](https://d3js.org/).
Styling is powered by [Semantic UI](http://semantic-ui.com/).

Development
-----------

### Tech Stack

- **Vite 6.x** - Build tool with HMR
- **TypeScript 5.x** - Type-safe JavaScript
- **@crxjs/vite-plugin** - Chrome extension support
- **D3 v7** - Data visualization (tree-shakable imports)
- **Manifest V3** - Chrome extension format

### Quick Start

```bash
npm install
npm run dev      # Development mode with HMR
```

Then:
1. 打开 Chrome，进入 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目的 `dist/` 目录

**HMR 自动更新**：修改代码后，扩展会自动刷新（无需手动重新加载）

> 💡 **注意**：开发模式下 `dist/` 只有入口文件，实际代码从 `localhost:5173` 实时加载。详见 [docs/debugging.md](docs/debugging.md#hmr-工作原理重要)

### Available Scripts

```bash
npm run dev        # 开发模式（带 HMR）
npm run build      # 生产构建
npm run build:dev  # 开发构建（带 source map）
npm run lint       # ESLint 检查
```

### Project Structure

```
treeverse/
├── public/              # Static assets
│   ├── icons/           # Extension icons
│   └── resources/       # Viewer resources (HTML, CSS)
├── src/
│   ├── background/      # Service worker (MV3)
│   ├── content/         # Content script injected to x.com
│   └── viewer/          # Tree visualization components
├── manifest.json        # Extension manifest (MV3)
├── vite.config.ts       # Vite configuration
└── docs/
    ├── modernization-plan.md  # 现代化升级方案
    └── debugging.md           # 调试指南
```

### Debugging

详见 [docs/debugging.md](docs/debugging.md)。

**快速调试技巧：**

1. **Service Worker 调试**：
   - 在 `chrome://extensions/` 点击「Service Worker」链接
   - 在 Console 查看日志，Sources 面板设置断点

2. **Content Script 调试**：
   - 在 Twitter/X 页面按 F12
   - Console 过滤器选择「Verbose」
   - 搜索 `[Treeverse]` 前缀的日志

3. **手动刷新扩展**：
   ```javascript
   // 在 Service Worker Console 执行
   chrome.runtime.reload()
   ```

### Migration Notes

This project has been modernized from the original 2020 codebase:

- **Build Tool**: webpack 4 → Vite 6
- **Manifest**: MV2 → MV3
- **TypeScript**: 3.8 → 5.x
- **D3**: v5 (full import) → v7 (tree-shakable imports)
- **Background**: Page script → Service Worker
