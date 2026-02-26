# Treeverse 调试指南

## HMR 工作原理（重要！）

### 开发模式 vs 生产模式

| 模式 | 命令 | dist/ 内容 | 代码来源 |
|------|------|-----------|---------|
| **开发** | `npm run dev` | 入口文件 + 静态资源 | `http://localhost:5173` (Dev Server) |
| **生产** | `npm run build` | 完整的打包文件 | 本地文件 |

### 开发模式 HMR 机制

```
┌─────────────────────────────────────────────────────────────┐
│  Chrome Extension (加载自 dist/)                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  service-worker-loader.js                             │   │
│  │  ─────────────────────────────────────────────────   │   │
│  │  import 'http://localhost:5173/@vite/env';           │   │
│  │  import 'http://localhost:5173/@crx/client-worker';  │   │
│  │  import 'http://localhost:5173/src/background/...';   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP 请求
                    ┌─────────────────┐
                    │  Vite Dev Server │
                    │   localhost:5173 │
                    │  ─────────────── │
                    │  • 实时编译 TS    │
                    │  • WebSocket HMR  │
                    │  • 模块热替换     │
                    └─────────────────┘
```

**关键点：**
- `dist/` 只有入口文件，**实际代码从 localhost:5173 实时加载**
- 修改 `.ts` 文件 → Vite 实时编译 → 通过 WebSocket 推送更新
- **无需等待 `dist/` 重新生成**，浏览器直接获取最新代码

---

## 开发工作流

### 1. 启动开发服务器

```bash
npm run dev
```

输出：
```
  VITE v5.4.21  ready in 426 ms

  B R O W S E R
  E X T E N S I O N
  T O O L S
  
  ➜  CRXJS: Load dist as unpacked extension
```

### 2. 加载扩展到 Chrome

1. 打开 Chrome → `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. **选择 `dist/` 目录**（不是项目根目录！）

### 3. 验证 HMR 工作

1. 修改 `src/background/service-worker.ts`，添加一行：
   ```typescript
   console.log('[Treeverse] Service Worker started!')
   ```

2. 保存文件

3. 观察：
   - **终端**：Vite 显示 `[HMR]` 日志
   - **Chrome**：Service Worker 自动重启
   - **DevTools Console**：看到新日志

**不需要手动刷新扩展！**

---

## 调试技巧

### Service Worker 调试

1. 在 `chrome://extensions/` 找到 Treeverse
2. 点击「Service Worker」链接（会打开 DevTools）
3. 在 Console 查看日志
4. 在 Sources 面板设置断点

**注意：** 修改 Service Worker 代码后，它会自动重启，断点会失效，需要重新设置。

### Content Script 调试

1. 打开 X/Twitter 页面
2. 按 F12 打开 DevTools
3. 切换到 Console 面板
4. 在过滤器中选择「Verbose」级别

**Sources 面板定位源文件：**
- 按 Ctrl+P (Cmd+P)
- 输入 `content/main.ts` 或 `proxy.ts`
- **注意**：看到的是 Vite 编译后的版本，但有 Source Map

### Viewer 调试

Treeverse viewer 是注入到页面的：

```javascript
// 在页面 Console 中执行
Treeverse                    // 查看全局对象
Treeverse.PROXY.state        // 查看代理状态
```

---

## 常见问题

### Q: 修改代码后没有自动刷新？

**检查清单：**
1. `npm run dev` 是否在运行？（看终端）
2. 终端是否有红色错误信息？
3. 网络是否正常？（Dev Server 需要 localhost:5173 可访问）

**手动刷新方法：**
```javascript
// 在 Service Worker Console 执行
chrome.runtime.reload()
```

### Q: Content Script 更新后没有生效？

Content Script 注入到页面后，**需要刷新页面**才能加载新版本。

这是 Chrome 的限制，不是 HMR 的问题。

### Q: `dist/` 目录看起来不完整？

**开发模式下这是正常的！**

```
dist/                           # 开发模式
├── manifest.json              # 完整的 manifest
├── service-worker-loader.js   # 入口：从 localhost 加载
├── src/                       # 只有 loader 文件
│   └── viewer/
│       └── main.ts-loader.js  # 指向 localhost:5173
├── icons/                     # 静态资源（完整）
└── resources/                 # 静态资源（完整）
```

**生产构建后才会完整：**
```
dist/                           # 生产模式
├── manifest.json
├── service-worker-loader.js   # 打包后的独立文件
├── assets/                    # 所有代码打包在这里
│   ├── main.ts-xxx.js
│   └── service-worker.ts-xxx.js
├── icons/
└── resources/
```

### Q: 如何查看网络请求？

**Service Worker 的网络请求：**
1. 打开 Service Worker DevTools
2. Network 面板
3. 注意：看到的是 `localhost:5173` 的请求

**Content Script 的网络请求：**
1. 在 Twitter/X 页面打开 DevTools
2. Network 面板
3. 过滤 `i/api/graphql`（Twitter API）

### Q: HMR 太慢？

检查：
1. 电脑性能（Vite 通常很快）
2. 是否开启了 Source Map（开发模式默认开启）
3. 可以尝试：`npm run build:dev` 进行完整构建测试

---

## 生产构建测试

在发布前测试生产版本：

```bash
# 构建生产版本（无 source map，压缩）
npm run build

# 或开发版本（有 source map，未压缩）
npm run build:dev
```

然后：
1. 进入 `chrome://extensions/`
2. 找到 Treeverse，点击「刷新」图标
3. 或删除后重新加载 `dist/` 目录

---

## 推荐的开发环境

### 窗口布局

```
┌────────────────────────────────────────────────────────────┐
│  屏幕 1                      │  屏幕 2                      │
│  ───────────────────────────│  ─────────────────────────── │
│  │ 代码编辑器              │  │ Chrome                    │ │
│  │ (VS Code/Vim)           │  │ • Twitter/X 页面          │ │
│  │                         │  │ • chrome://extensions/    │ │
│  │                         │  │                           │ │
│  │                         │  │ Service Worker DevTools   │ │
│  │                         │  │ (分屏或副屏)               │ │
│  └─────────────────────────┘  └───────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### 终端布局

```bash
# 终端 1 - 保持运行
$ npm run dev
[Vite HMR logs...]

# 终端 2 - 按需使用
$ npm run type-check  # 类型检查
$ npm run lint        # ESLint
$ git status          # 版本控制
```

---

## 总结

| 你想做什么 | 怎么做 |
|-----------|-------|
| 开始开发 | `npm run dev` + 加载 `dist/` 到 Chrome |
| 修改代码 | 直接编辑 `.ts` 文件，保存即生效 |
| 调试 Service Worker | `chrome://extensions/` → 点击「Service Worker」 |
| 调试 Content Script | 在 Twitter/X 页面按 F12 |
| 强制刷新扩展 | Service Worker Console 执行 `chrome.runtime.reload()` |
| 测试生产版本 | `npm run build` → 刷新扩展 |
