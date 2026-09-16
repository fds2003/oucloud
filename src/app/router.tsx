import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { pages, RouteFallback } from './routes'

export const AppRouter: React.FC = () => {
  return (
    // Suspense 只在「客户端点击切换路由」时才会真正显示 fallback：
    // 首屏两端（prerender 的 renderToString 与 main.tsx 的 hydrateRoot）都已预加载
    // 过当前路由的 chunk，组件同步就绪。
    <React.Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<pages.HomePage />} />
        <Route path="/tools/:categorySlug" element={<pages.CategoryPage />} />
        <Route path="/tools/:category/:slug" element={<pages.ToolPage />} />
        <Route path="/about" element={<pages.AboutPage />} />
        <Route path="/privacy" element={<pages.PrivacyPage />} />
        <Route path="/terms" element={<pages.TermsPage />} />
        <Route path="*" element={<pages.NotFoundPage />} />
      </Routes>
    </React.Suspense>
  )
}
