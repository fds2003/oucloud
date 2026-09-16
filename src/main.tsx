import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { preloadRoute } from './app/routes'
import './styles/globals.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  const tree = (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )

  // 预渲染产物中 #root 已含静态 HTML，必须 hydrate 复用，否则 React 会清空
  // 首屏 DOM 导致闪白并拉高 CLS；本地开发容器为空，走 createRoot。
  const mount = () => {
    if (rootElement.hasChildNodes()) {
      ReactDOM.hydrateRoot(rootElement, tree)
    } else {
      ReactDOM.createRoot(rootElement).render(tree)
    }
    // 供 e2e 精确等待挂载完成，避免测试在 hydrate 之前就断言而假绿
    document.documentElement.dataset.hydrated = 'true'
  }

  // 路由已代码分割：必须先预加载当前路由的 chunk 再挂载。
  // 否则组件未就绪会命中 Suspense 回退，把 SSR 出来的首屏 DOM 整块替换掉，
  // 预渲染的收益直接归零。
  preloadRoute(window.location.pathname)
    .catch(() => undefined)
    .then(mount)
}
