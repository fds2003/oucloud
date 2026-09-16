/**
 * SSG 静态页面预渲染
 *
 * 核心原则：静态 HTML 必须由「真实 React 组件树」渲染产出，而不是手写 HTML 片段。
 * 手写片段会与组件实现双向漂移（爬虫与用户看到两份内容），属于 cloaking 风险。
 * 页面 TDK 统一取自 src/data/seo.ts，构建脚本不持有任何标题/描述副本。
 */

import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from '../src/app/App';
import {
  getAllIndexableRoutes,
  resolvePageMeta,
  NOT_FOUND_META,
} from '../src/data/seo';
import { buildAbsoluteUrl } from '../src/lib/tools';
import { preloadRoute } from '../src/app/routes';

console.log('🚀 开始执行 SSG 静态页面预渲染 (真实组件树 renderToString)...');

const distDir = path.resolve(process.cwd(), 'dist');
const templateHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(templateHtmlPath)) {
  console.error('❌ dist/index.html 不存在，请先执行 vite build！');
  process.exit(1);
}

const template = fs.readFileSync(templateHtmlPath, 'utf-8');

/** HTML 转义：文案来自 data/*.ts，但仍需防止 & < > " 破坏静态 HTML 结构 */
const esc = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

interface RenderTarget {
  route: string;
  outputFile: string;
  title: string;
  description: string;
  canonicalUrl: string | null;
}

const targets: RenderTarget[] = getAllIndexableRoutes().map((route) => {
  const meta = resolvePageMeta(route);
  if (!meta) {
    // getAllIndexableRoutes 产出的路由必然可解析，此处仅做防御
    throw new Error(`路由 ${route} 在 seo.ts 中没有对应的 TDK 定义`);
  }
  return {
    route,
    outputFile: route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`,
    title: meta.title,
    description: meta.description,
    canonicalUrl: buildAbsoluteUrl(meta.canonicalPath),
  };
});

// 404 兜底页：供静态托管直接返回，不进 sitemap、不给 canonical
targets.push({
  route: '/404',
  outputFile: '404.html',
  title: NOT_FOUND_META.title,
  description: NOT_FOUND_META.description,
  canonicalUrl: null,
});

/**
 * #root 容器插槽：匹配 `<div id="root">` 到 `</body>` 前的整个区间。
 * 不能用 `<div id="root"></div>` 精确匹配——重复执行本脚本时模板里已残留上一次的
 * 首屏内容，精确匹配会静默失效，导致全站产出同一份 HTML（页面能打开，但对爬虫是
 * cloaking，且客户端 hydrate 必然 mismatch 而整树回退重渲染）。
 */
const ROOT_SLOT = /<div id="root">[\s\S]*?<\/div>(\s*)<\/body>/;

const h1Of = (html: string) =>
  html
    .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .trim() ?? '(无 H1)';

for (const target of targets) {
  // 0. 预加载本路由所需 chunk（页面 + 工具组件）。renderToString 是同步的，
  //    组件未就绪只会产出 Suspense fallback 骨架 —— 页面照样能打开，但对爬虫
  //    等于返回空内容。必须先 await。
  await preloadRoute(target.route);

  // 1. 用真实组件树渲染首屏：工具本体、HowTo、FAQ、Schema 全部自动包含
  const bodyHtml = renderToString(
    <StaticRouter location={target.route}>
      <App />
    </StaticRouter>
  );

  const renderedH1 = h1Of(bodyHtml);

  let html = template;

  // 2. 剥离模板中已有的 canonical / OG / meta-robots 标签，防止重复注入
  //    （vite build 产物本身不含这些，但如果上一轮 prerender 写回了
  //    dist/index.html，重复执行本脚本时模板会残留它们）
  html = html
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>\s*/gi, '');

  // 3. 替换 Title 与 Description（与运行时 SeoHead 同源）
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(target.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    `<meta name="description" content="${esc(target.description)}" />`
  );

  // 4. 注入 Canonical / OpenGraph（404 页改为 noindex）
  const headExtra = `
    ${
      target.canonicalUrl
        ? `<link rel="canonical" href="${esc(target.canonicalUrl)}" />`
        : '<meta name="robots" content="noindex, follow" />'
    }
    <meta property="og:title" content="${esc(target.title)}" />
    <meta property="og:description" content="${esc(target.description)}" />
    ${target.canonicalUrl ? `<meta property="og:url" content="${esc(target.canonicalUrl)}" />` : ''}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="OUCloud" />
  `;
  html = html.replace('</head>', `${headExtra}\n</head>`);

  // 5. 注入首屏 HTML（客户端必须用 hydrateRoot 复用，否则会被清空）
  if (!ROOT_SLOT.test(html)) {
    console.error('❌ 模板中找不到 #root 容器，无法注入首屏 HTML（dist/index.html 结构异常）');
    process.exit(1);
  }
  // 用函数形式替换：bodyHtml 里的 $& 等序列会被当成替换模式而破坏内容
  html = html.replace(
    ROOT_SLOT,
    (_match, tail: string) => `<div id="root">${bodyHtml}</div>${tail}</body>`
  );

  const outPath = path.join(distDir, target.outputFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf-8');

  // 6. 回读校验：落盘内容必须是本路由的渲染结果。
  //    这是最后一道闸门——模板替换失效时页面照样能打开，只有回读比对能发现
  //    「全站共用同一份首屏 HTML」这种对爬虫等同作弊、且必然导致 hydrate 失败的静默错误。
  const writtenH1 = h1Of(fs.readFileSync(outPath, 'utf-8'));
  if (writtenH1 !== renderedH1) {
    console.error(
      `❌ ${target.outputFile} 落盘内容与渲染结果不一致：期望「${renderedH1}」，实际「${writtenH1}」`
    );
    process.exit(1);
  }

  console.log(`  📄 已预渲染输出: ${target.outputFile}  [H1] ${renderedH1}`);
}

console.log(`\n🎉 SSG 预渲染完成！共生成 ${targets.length} 个独立静态 HTML 文件。`);
