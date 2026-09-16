import fs from 'fs';
import path from 'path';
import { tools } from '../src/data/tools';
import { categories } from '../src/data/categories';
import { buildToolPath, buildAbsoluteUrl } from '../src/lib/tools';

console.log('🗺️ 开始生成 Sitemap.xml...');

const BASE_URL = 'https://oucloud.cn';

interface SitemapEntry {
  url: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

const entries: SitemapEntry[] = [
  // 首页
  { url: BASE_URL, changefreq: 'daily', priority: '1.0' },
  // 静态说明页
  { url: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.5' },
  { url: `${BASE_URL}/privacy`, changefreq: 'monthly', priority: '0.3' },
  { url: `${BASE_URL}/terms`, changefreq: 'monthly', priority: '0.3' },
];

// 分类页面
for (const cat of categories) {
  entries.push({
    url: `${BASE_URL}/tools/${cat.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
  });
}

// 已发布工具页面
for (const tool of tools) {
  if (tool.status === 'published') {
    entries.push({
      url: buildAbsoluteUrl(buildToolPath(tool)),
      changefreq: 'weekly',
      priority: tool.featured ? '0.9' : '0.8',
    });
  }
}

const currentDate = new Date().toISOString().split('T')[0];

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${currentDate}</lastmod>
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
