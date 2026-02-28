![X-Treeverse Icon](public/icons/128.png) X-Treeverse
=========

> **Community Fork Notice**: This is a community-maintained fork of [paulgb/Treeverse](https://github.com/paulgb/treeverse), originally created by Paul Butler. While the original author has retired the project and moved to [Bluesky](https://bsky.app/) integration, this fork continues to maintain and support the **X (Twitter)** conversation visualization functionality for the community.
> 
> **🙏 Special Thanks**: Huge thanks to [Paul Butler](https://github.com/paulgb) for creating the original Treeverse and open-sourcing it under the MIT license. This project builds upon his excellent work and would not exist without his contribution to the community.

[![CI](https://github.com/zdyxry/x-treeverse/actions/workflows/ci.yml/badge.svg)](https://github.com/zdyxry/x-treeverse/actions/workflows/ci.yml)
[![Release](https://github.com/zdyxry/x-treeverse/actions/workflows/release.yml/badge.svg)](https://github.com/zdyxry/x-treeverse/releases)

**X-Treeverse** is a browser extension for visualizing and navigating **X (Twitter)** conversation threads as interactive trees.

⚠️ **Note**: X/Twitter has been making API access increasingly difficult. This fork is maintained on a best-effort basis as the platform evolves.

Installation
------------

### Installation (Developer Mode):

1. Download the latest release from [GitHub Releases](../../releases)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked" and select the extracted folder

Introduction
------------

After installing X-Treeverse, open [x.com](https://x.com) (formerly Twitter) and navigate to any tweet with replies.

The X-Treeverse icon should appear in your browser toolbar (it turns from grey to blue when on a supported page). Click it to launch the visualization.

Exploring the Conversation
--------------------------

Conversations are visualized as a tree structure where:
- **Each box** represents an individual tweet
- **Lines** between boxes indicate reply relationships (lower tweets reply to upper tweets)
- **Red dots** indicate tweets with more replies available to load

### Interaction:

- **Hover** over a node to see the reply chain in the right-side pane
- **Click** a node to freeze the selection and interact with the details pane
- **Click anywhere** in the tree area to unfreeze and return to hover mode
- **Double-click** a node with a red dot to load more replies

### More Replies Indicator:

Tweets with a **red circle containing white ellipses** have additional replies not yet loaded:

Keyboard Navigation
-------------------

When a node is selected (clicked), use these keyboard shortcuts:

| Key | Action |
|-----|--------|
| ↑ (Arrow Up) | Move to parent tweet |
| ↓ (Arrow Down) | Move to first child tweet |
| ← (Arrow Left) | Move to previous sibling |
| → (Arrow Right) | Move to next sibling |
| Space | Load more replies (same as double-click) |

Export Features
---------------

X-Treeverse supports exporting conversation trees to **Mermaid** flowchart format:

- Save conversation structures as diagrams
- Share visualizations on Markdown-compatible platforms (GitHub, Notion, etc.)
- Customize layouts using [Mermaid Live Editor](https://mermaid.live/)

Privacy
-------

X-Treeverse runs **entirely in your browser**:

- ✅ No data is collected or tracked by the extension
- ✅ No external servers or analytics
- ✅ API requests go directly to X/Twitter's servers

**Note**: Browser extension installs may be tracked by Google, and data requests are subject to X/Twitter's privacy policies.

Bugs & Feedback
---------------

- [Report issues on GitHub](../../issues)
- Original project: [paulgb/treeverse](https://github.com/paulgb/treeverse)

Credits
-------

- **Original Author**: [Paul Butler](https://paulbutler.org/) ([@paulgb](https://github.com/paulgb))
- **Icon**: Created by [Eli Schiff](http://www.elischiff.com/)
- **Visualization**: Powered by [D3.js](https://d3js.org/)

Development
-----------

### Tech Stack

- **Vite 5.x** - Build tool with HMR
- **TypeScript 5.x** - Type-safe JavaScript
- **@crxjs/vite-plugin** - Chrome extension support
- **D3 v7** - Data visualization (tree-shakable imports)
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **DaisyUI 4.x** - Tailwind component library
- **Manifest V3** - Chrome extension format

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/x-treeverse.git
cd x-treeverse

# Install dependencies
npm install

# Start development mode
npm run dev
```

Then:
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project's `dist/` directory

> 💡 **HMR**: Changes are automatically reflected without manual reload during development.

### Available Scripts

```bash
npm run dev        # Development mode (with HMR)
npm run build      # Production build
npm run build:dev  # Development build (with source map)
npm run lint       # ESLint check
npm run type-check # TypeScript type check
```

### Project Structure

```
x-treeverse/
├── manifest.json        # Extension manifest (MV3)
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── public/              # Static assets
│   ├── icons/           # Extension icons (16/32/48/128px)
│   └── resources/       # Viewer resources (HTML, CSS)
└── src/
    ├── background/      # Service worker (MV3)
    ├── content/         # Content script for x.com
    └── viewer/          # Tree visualization components
```

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
├─────────────────────────────────────────────────────────────┤
│  Background (Service Worker)                                 │
│  ├── Manages extension icon state (enable/disable)           │
│  ├── Handles icon click events                               │
│  └── Coordinates content script injection                    │
├─────────────────────────────────────────────────────────────┤
│  Content Script (runs on x.com)                              │
│  ├── Captures auth tokens from browser cookies               │
│  ├── Intercepts X's GraphQL API calls                        │
│  └── Proxies API requests for the viewer                     │
├─────────────────────────────────────────────────────────────┤
│  Viewer (replaces page when activated)                       │
│  ├── Renders interactive D3.js tree visualization           │
│  ├── Fetches tweet data through content script proxy        │
│  └── Supports Mermaid format export                          │
└─────────────────────────────────────────────────────────────┘
```

### Debugging

See [docs/debugging.md](docs/debugging.md) for detailed debugging instructions.

**Quick tips:**

```javascript
// Reload extension from Service Worker console
chrome.runtime.reload()

// Check content script state
await chrome.scripting.executeScript({
  target: { tabId: YOUR_TAB_ID },
  func: () => (window as any).Treeverse?.PROXY?.state
})
```

License
-------

MIT License - see [LICENSE](LICENSE) file.

This project is a fork of [paulgb/Treeverse](https://github.com/paulgb/treeverse), originally created by Paul Butler and licensed under MIT.
