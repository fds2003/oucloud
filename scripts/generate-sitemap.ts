/**
 * 生成 sitemap.xml
 *
 * 路由清单直接取自 src/data/seo.ts，保证与预渲染产物严格对齐；
 * 域名统一由 buildAbsoluteUrl 提供，不再硬编码。
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  getAllIndexableRoutes,
  STATIC_PAGE_META,
} from '../src/data/seo';
import { buildAbsoluteUrl, getToolBySlug } from '../src/lib/tools';

console.log('🗺️ 开始生成 Sitemap.xml...');

interface SitemapEntry {
  url: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

/**
 * lastmod 必须反映内容真实变更时间。
 * 用「最后一次代码提交日期」而非构建日期：后者每次发版都谎称全站更新，
 * 会导致搜索引擎降低对 lastmod 的信任度。取不到 git 信息时宁可不输出。
 */
function resolveLastmod(): string | null {
  try {
    const iso = execSync('git log -1 --format=%cI', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return iso ? iso.split('T')[0] : null;
  } catch {
    return null;
  }
}

function buildEntry(route: string): SitemapEntry {
  const normalized = route.length > 1 ? route.replace(/\/+$/, '') : route;

  if (normalized === '/') {
    return { url: buildAbsoluteUrl(normalized), changefreq: 'daily', priority: '1.0' };
  }

  if (STATIC_PAGE_META[normalized]) {
    return { url: buildAbsoluteUrl(normalized), changefreq: 'monthly', priority: '0.5' };
  }

  const parts = normalized.replace(/^\//, '').split('/');
  if (parts[0] === 'tools' && parts.length === 2) {
    return { url: buildAbsoluteUrl(normalized), changefreq: 'weekly', priority: '0.8' };
  }

  if (parts[0] === 'tools' && parts.length === 3) {
    const tool = getToolBySlug(parts[1], parts[2]);
    return {
      url: buildAbsoluteUrl(normalized),
      changefreq: 'weekly',
      priority: tool?.featured ? '0.9' : '0.8',
    };
  }

  return { url: buildAbsoluteUrl(normalized), changefreq: 'monthly', priority: '0.3' };
}

const entries: SitemapEntry[] = getAllIndexableRoutes().map(buildEntry);
const lastmod = resolveLastmod();

if (!lastmod) {
  console.warn('⚠️  未能获取 git 提交日期，sitemap 将省略 lastmod 字段。');
}

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

// 输出到 public/sitemap.xml (开发与 Vite 构建前置)
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlContent, 'utf-8');

// 如果 dist 目录已存在，同步一份到 dist/sitemap.xml
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xmlContent, 'utf-8');
}

console.log(`✅ Sitemap 生成完成！共包含 ${entries.length} 个规范 URL。`);
