/**
 * 全站页面级 SEO 元数据的唯一真源 (Single Source of Truth)
 *
 * 设计约束：
 * 1. 页面组件 (SeoHead) 与构建脚本 (prerender / sitemap) 均从此处取 TDK，
 *    禁止任何一方硬编码标题、描述或域名，避免静态 HTML 与真实页面内容漂移。
 * 2. 路由清单 (getAllIndexableRoutes) 同样是唯一真源，保证 sitemap 与预渲染产物完全对齐。
 */

import { ToolMeta } from '../types/tool';
import { SITE } from './site';
import { categories } from './categories';
import { tools } from './tools';
import { buildToolPath, getToolBySlug } from '../lib/tools';

export type CategoryMeta = (typeof categories)[number];

export interface PageMeta {
  title: string;
  description: string;
  canonicalPath: string;
}

export const HOME_META: PageMeta = {
  title: 'OUCloud - 纯前端在线工具平台 | 极简高效 零后端传输',
  description:
    'OUCloud 汇聚颜色拾取器、人民币金额大写转换、Favicon 网站图标生成器、CSS 渐变设计等实用轻量工具，纯浏览器本地运算，保护隐私，开箱即用。',
  canonicalPath: '/',
};

/** 静态说明页 TDK（与路由一一对应，新增静态页时在此登记即可自动进入 sitemap 与预渲染） */
export const STATIC_PAGE_META: Record<string, PageMeta> = {
  '/about': {
    title: '关于 OUCloud - 纯前端在线工具平台',
    description: 'OUCloud 秉承 Tool First 理念，致力于提供安全、轻量、无需上传的纯前端工具生态。',
    canonicalPath: '/about',
  },
  '/privacy': {
    title: '隐私保护政策 - OUCloud',
    description: 'OUCloud 尊重并保护所有用户的个人隐私，我们不在服务器端收集或保存您的任何输入数据。',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: '服务条款与免责声明 - OUCloud',
    description: 'OUCloud 在线工具平台的服务协议与使用条款说明。',
    canonicalPath: '/terms',
  },
};

/** 404 页不参与索引，因此不做 canonical，仅在构建期用于生成 dist/404.html */
export const NOT_FOUND_META: Omit<PageMeta, 'canonicalPath'> = {
  title: '404 - 页面未找到 | OUCloud',
  description: '抱歉，您访问的页面不存在或已被移除。',
};

export function buildCategoryMeta(category: CategoryMeta): PageMeta {
  return {
    title: `${category.name}大全 - 免费在线${category.name} | ${SITE.name}`,
    description: category.description,
    canonicalPath: `/tools/${category.slug}`,
  };
}

export function buildToolMeta(tool: ToolMeta): PageMeta {
  return {
    title: tool.seo.title,
    description: tool.seo.description,
    canonicalPath: buildToolPath(tool),
  };
}

/**
 * 由路由反查 TDK。返回 null 表示该路由不属于任何已知页面（例如 /404）。
 */
export function resolvePageMeta(route: string): PageMeta | null {
  const normalized = route.length > 1 ? route.replace(/\/+$/, '') : route;

  if (normalized === '/') return HOME_META;

  const staticMeta = STATIC_PAGE_META[normalized];
  if (staticMeta) return staticMeta;

  const parts = normalized.replace(/^\//, '').split('/');
  if (parts[0] !== 'tools') return null;

  if (parts.length === 2) {
    const category = categories.find((c) => c.slug === parts[1]);
    return category ? buildCategoryMeta(category) : null;
  }

  if (parts.length === 3) {
    const tool = getToolBySlug(parts[1], parts[2]);
    return tool && tool.status === 'published' ? buildToolMeta(tool) : null;
  }

  return null;
}

/** 需要被 sitemap 收录、且需要预渲染的所有路由 */
export function getAllIndexableRoutes(): string[] {
  const routes: string[] = ['/', ...Object.keys(STATIC_PAGE_META)];

  for (const category of categories) {
    routes.push(`/tools/${category.slug}`);
  }
  for (const tool of tools) {
    if (tool.status === 'published') {
      routes.push(buildToolPath(tool));
    }
  }

  return routes;
}
