import React from 'react'
import { getToolBySlug } from '../lib/tools'
import { preloadToolComponent } from '../tools/registry'
import { asyncComponent, type AsyncComponent } from './lazy'

/**
 * 路由级代码分割：每个页面独立 chunk，游客只为当前访问的页面付费。
 *
 * 这里集中声明「路由 → import」映射，是 router（消费端）、main.tsx（hydrate 前预热）
 * 和 prerender.tsx（renderToString 前预热）三者的唯一数据源，避免任一端漏预加载
 * 导致产物变骨架。
 */
const importers = {
  HomePage: () => import('../pages/Home/HomePage').then((m) => ({ default: m.HomePage })),
  CategoryPage: () =>
    import('../pages/Category/CategoryPage').then((m) => ({ default: m.CategoryPage })),
  ToolPage: () => import('../pages/Tool/ToolPage').then((m) => ({ default: m.ToolPage })),
  AboutPage: () => import('../pages/Static/AboutPage').then((m) => ({ default: m.AboutPage })),
  PrivacyPage: () =>
    import('../pages/Static/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
  TermsPage: () => import('../pages/Static/TermsPage').then((m) => ({ default: m.TermsPage })),
  NotFoundPage: () =>
    import('../pages/Static/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
}

export type RouteKey = keyof typeof importers

export const pages: Record<RouteKey, AsyncComponent> = {
  HomePage: asyncComponent(importers.HomePage),
  CategoryPage: asyncComponent(importers.CategoryPage),
  ToolPage: asyncComponent(importers.ToolPage),
  AboutPage: asyncComponent(importers.AboutPage),
  PrivacyPage: asyncComponent(importers.PrivacyPage),
  TermsPage: asyncComponent(importers.TermsPage),
  NotFoundPage: asyncComponent(importers.NotFoundPage),
}

const normalize = (pathname: string) => {
  const withoutQuery = pathname.split('?')[0]
  return withoutQuery.replace(/\/+$/, '') || '/'
}

/** 与 router.tsx 中的 <Route> 保持一致，务必两处同步修改 */
export function matchRouteKey(pathname: string): RouteKey {
  const segments = normalize(pathname).split('/').filter(Boolean)

  if (segments.length === 0) return 'HomePage'

  if (segments[0] === 'tools') {
    if (segments.length === 2) return 'CategoryPage'
    if (segments.length === 3) return 'ToolPage'
    return 'NotFoundPage'
  }

  if (segments.length === 1) {
    if (segments[0] === 'about') return 'AboutPage'
    if (segments[0] === 'privacy') return 'PrivacyPage'
    if (segments[0] === 'terms') return 'TermsPage'
  }

  return 'NotFoundPage'
}

/**
 * 预加载指定路径所需的全部 chunk（页面本体 + 该页用到的工具组件）。
 *
 * 必须在 renderToString / hydrateRoot 之前 await：两侧都是同步渲染，
 * 组件没就绪就只能吐出 fallback 骨架。
 */
export async function preloadRoute(pathname: string): Promise<void> {
  const key = matchRouteKey(pathname)
  await pages[key].preload()

  if (key === 'ToolPage') {
    const segments = normalize(pathname).split('/').filter(Boolean)
    const tool = getToolBySlug(segments[1], segments[2])
    if (tool) {
      await preloadToolComponent(tool.component)
    }
  }
}

/** 客户端路由切换时的占位骨架：固定高度，避免加载完成后的布局跳动 */
export const RouteFallback: React.FC = () => (
  <div className="mx-auto max-w-5xl px-4 py-16" role="status" aria-label="内容加载中">
    <div className="h-9 w-2/3 animate-pulse rounded bg-slate-200" />
    <div className="mt-4 h-5 w-full animate-pulse rounded bg-slate-200" />
    <div className="mt-2 h-5 w-5/6 animate-pulse rounded bg-slate-200" />
    <div className="mt-8 h-64 w-full animate-pulse rounded-xl bg-slate-200" />
  </div>
)
