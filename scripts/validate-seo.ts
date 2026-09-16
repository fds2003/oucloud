/**
 * SEO 静态产物校验
 *
 * 校验原则：不能只做「标签是否存在」的正则检查——那样无法发现
 * 静态 HTML 与真实组件内容漂移（历史上正是它放过了手写的假首屏）。
 * 因此这里与 src/data/seo.ts 的单源 TDK 做精确比对，并检测首屏是否为真实渲染结果。
 */

import fs from 'fs';
import path from 'path';
import { resolvePageMeta } from '../src/data/seo';
import { tools } from '../src/data/tools';
import { categories } from '../src/data/categories';
import { buildAbsoluteUrl, buildToolPath, buildCategoryPath } from '../src/lib/tools';

console.log('🔍 开始执行 SEO 静态产物严格校验 (validate-seo)...');

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist 目录不存在，请先执行构建！');
  process.exit(1);
}

/** 首屏渲染内容的最小长度，低于此值说明 #root 里没有真实渲染出组件 */
const MIN_RENDERED_BODY_LENGTH = 1000;

function findHtmlFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

/** 由 dist 内相对路径还原站点路由；404.html 不参与索引，返回 null */
function routeFromRelPath(relPath: string): string | null {
  const normalized = relPath.split(path.sep).join('/');
  if (normalized === '404.html') return null;
  if (normalized === 'index.html') return '/';
  return `/${normalized.replace(/\/index\.html$/, '')}`;
}

/** 还原 prerender 阶段写入 HTML 属性时做的转义 */
function unescapeHtml(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * 搜索引擎所有权验证文件的白名单。
 *
 * 这类文件由各站长平台下发并强制要求「原样托管在站点根目录」，其形态本身就是
 * 一行哈希文本或极简 HTML——天然没有 h1 / TDK / 预渲染内容，也不应被索引。
 * 它们不是「可以被 SEO 优化的页面」，因此必须豁免全部 SEO 断言；
 * 但豁免面要收窄到各家平台固定的命名格式，避免把真正的兜底页面混进来。
 */
const VERIFICATION_FILE_PATTERNS: RegExp[] = [
  /^baidu_verify_codeva-[A-Za-z0-9]+\.html$/, // 百度站长平台
  /^google[0-9a-f]{16}\.html$/, // Google Search Console
  /^BingSiteAuth\.html$/, // Bing 站长工具
  /^yandex_[0-9a-f]+\.html$/, // Yandex.Webmaster
  /^sogou_verify_[A-Za-z0-9]+\.html$/, // 搜狗站长平台
];

/** 是否为搜索引擎验证文件（只按根目录下的固定命名格式判定） */
function isVerificationFile(relPath: string): boolean {
  if (relPath.includes('/') || relPath.includes('\\')) return false; // 仅根目录
  return VERIFICATION_FILE_PATTERNS.some((pattern) => pattern.test(relPath));
}

/** 粗略估算 <div id="root"> 内渲染内容的长度，用于识别空壳首屏 */
function measureRenderedBody(content: string): number {
  const rootStart = content.indexOf('<div id="root">');
  if (rootStart === -1) return 0;
  const bodyEnd = content.indexOf('</body>', rootStart);
  return (bodyEnd === -1 ? content.length : bodyEnd) - rootStart;
}

const htmlFiles = findHtmlFiles(distDir);
let hasErrors = false;
let verifiedCount = 0;
let skippedCount = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(distDir, filePath);

  // 0. 搜索引擎验证文件：形态由平台规定，不做 SEO 断言
  if (isVerificationFile(relPath)) {
    console.log(`⏭️  [${relPath}] 识别为搜索引擎所有权验证文件，跳过 SEO 断言`);
    skippedCount++;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const route = routeFromRelPath(relPath);

  // 1. 首屏必须是真实渲染结果，而不是空壳
  if (content.includes('<div id="root"></div>')) {
    console.error(`❌ [${relPath}] 首屏为空：#root 内没有任何预渲染内容`);
    hasErrors = true;
  } else if (measureRenderedBody(content) < MIN_RENDERED_BODY_LENGTH) {
    console.error(
      `❌ [${relPath}] 首屏渲染内容过少 (${measureRenderedBody(
        content
      )} 字符)，疑似退化为空壳页面`
    );
    hasErrors = true;
  }

  // 2. 检查 <h1>
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  if (!h1Match || !h1Match[1].trim()) {
    console.error(`❌ [${relPath}] 缺少语义化 <h1> 标签`);
    hasErrors = true;
  }

  // 3. 404 页：不要求 canonical，但必须是 noindex
  if (route === null) {
    if (!/<meta\s+name="robots"\s+content="noindex/.test(content)) {
      console.error(`❌ [${relPath}] 404 页面缺少 <meta name="robots" content="noindex">`);
      hasErrors = true;
    }
    verifiedCount++;
    continue;
  }

  // 4. 与 seo.ts 单源 TDK 精确比对，防止静态 HTML 与组件实现漂移
  const expected = resolvePageMeta(route);
  if (!expected) {
    console.error(`❌ [${relPath}] 路由 ${route} 在 seo.ts 中没有对应 TDK 定义`);
    hasErrors = true;
    verifiedCount++;
    continue;
  }

  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const actualTitle = titleMatch ? unescapeHtml(titleMatch[1]) : '';
  if (actualTitle !== expected.title) {
    console.error(`❌ [${relPath}] title 与 seo.ts 不一致\n    期望: ${expected.title}\n    实际: ${actualTitle}`);
    hasErrors = true;
  }

  const descMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/);
  const actualDesc = descMatch ? unescapeHtml(descMatch[1]) : '';
  if (actualDesc !== expected.description) {
    console.error(
      `❌ [${relPath}] description 与 seo.ts 不一致\n    期望: ${expected.description}\n    实际: ${actualDesc}`
    );
    hasErrors = true;
  }

  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="(.*?)"\s*\/?>/);
  const expectedCanonical = buildAbsoluteUrl(expected.canonicalPath);
  const actualCanonical = canonicalMatch ? unescapeHtml(canonicalMatch[1]) : '';
  if (actualCanonical !== expectedCanonical) {
    console.error(
      `❌ [${relPath}] canonical 与 seo.ts 不一致\n    期望: ${expectedCanonical}\n    实际: ${actualCanonical}`
    );
    hasErrors = true;
  }

  verifiedCount++;
}

// 5. llms.txt：给 AI 的站点说明必须由数据生成并保持完整
//    校验方向与前几项相反——这里不看标签，而是防止「静态文件长期不被更新」：
//    一旦有人新增工具却忘了重新生成，AI 拿到的导航图就是残缺的，且无人会察觉。
const llmsPath = path.join(distDir, 'llms.txt');
if (!fs.existsSync(llmsPath)) {
  console.error('❌ dist/llms.txt 不存在：AI 检索产品无法读取站点工具清单，请先执行 generate-llms');
  hasErrors = true;
} else {
  const llmsContent = fs.readFileSync(llmsPath, 'utf-8');
  const requiredUrls = [
    buildAbsoluteUrl('/'),
    ...categories.map((category) => buildAbsoluteUrl(buildCategoryPath(category.slug))),
    ...tools
      .filter((tool) => tool.status === 'published')
      .map((tool) => buildAbsoluteUrl(buildToolPath(tool))),
  ];

  for (const url of requiredUrls) {
    if (!llmsContent.includes(url)) {
      console.error(`❌ llms.txt 缺少必需链接：${url}（工具清单与 llms.txt 已漂移）`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error('\n🚨 SEO 校验失败：构建产物存在缺失或不一致的 SEO 标签！已阻断流水线。');
  process.exit(1);
} else {
  console.log(
    `\n✅ SEO 产物校验通过！成功验证 ${verifiedCount} 个 HTML 文件` +
      (skippedCount > 0 ? `（另有 ${skippedCount} 个搜索引擎验证文件豁免）` : '') +
      '，TDK/Canonical 均与 seo.ts 单源一致，首屏均为真实渲染结果。'
  );
}
