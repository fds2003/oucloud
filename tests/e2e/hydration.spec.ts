/**
 * SSG 预渲染产物与客户端 hydration 的一致性守门
 *
 * 背景：prerender 用真实组件树 renderToString 输出静态 HTML，客户端必须用
 * hydrateRoot 复用这份 DOM。一旦出现 mismatch，React 18 会静默回退为「清空
 * #root + 全量客户端重渲染」——页面看起来能正常用，但首屏白屏、CLS 变差、
 * SSR 的 SEO 收益全部作废，且开发环境以外极难察觉。
 *
 * 本文件用三个硬指标守住这条链路：
 * 1. 禁用 JS 时页面仍具备完整内容（爬虫视角的 SSR 有效性）
 * 2. hydrate 期间控制台无 React mismatch 报错
 * 3. #root 的直接子节点零增删（证明是复用而非重建）
 */

import fs from 'fs';
import path from 'path';
import { expect, test } from '@playwright/test';

const sitemapPath = path.resolve('dist', 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  throw new Error('dist/sitemap.xml 不存在，请先执行 pnpm build 生成产物');
}

/** 路由清单取自构建产物 sitemap，保证测的就是真实上线页面，不与源码清单漂移 */
const routes: string[] = [
  ...[...fs.readFileSync(sitemapPath, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname
  ),
];

/** React 18 hydration 失败的特征文本（含官方错误码 #418 / #423 / #425 等） */
const HYDRATION_ERROR_PATTERN = /hydrat|did not match|server html|#4[12]\d/i;

/**
 * 在页面任何脚本执行前埋点：统计 #root 直接子节点的增删次数。
 * hydrate 成功时应为 0；若 React 回退为客户端渲染，会先清空再插入，计数必然 > 0。
 */
async function trackRootMutations(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const scope = window as unknown as { __rootChildMutations?: number };
    scope.__rootChildMutations = 0;

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if ((record.target as HTMLElement).id === 'root') {
          scope.__rootChildMutations =
            (scope.__rootChildMutations ?? 0) + record.removedNodes.length + record.addedNodes.length;
        }
      }
    });

    const observe = () =>
      observer.observe(document.documentElement, { childList: true, subtree: true });

    if (document.documentElement) observe();
    else document.addEventListener('readystatechange', observe, { once: true });
  });
}

test.describe('SSG 预渲染内容的独立性 (禁用 JavaScript)', () => {
  for (const route of routes) {
    test(`${route} 无 JS 时仍返回完整可索引内容`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();

      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      // 静态 HTML 里必须已含真实渲染结果，而不是空壳容器等 JS 填充
      const rootHtml = await page.locator('#root').innerHTML();
      expect(rootHtml.length).toBeGreaterThan(500);

      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      expect((await heading.textContent())?.trim().length).toBeGreaterThan(0);

      await context.close();
    });
  }
});

test.describe('客户端 hydration 一致性 (真实浏览器复用 SSR DOM)', () => {
  for (const route of routes) {
    test(`${route} hydrate 无 mismatch 且不重建 DOM`, async ({ page, request }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));

      await trackRootMutations(page);

      // 预渲染阶段注入的 title，用于校验客户端 SeoHead 未与之漂移
      const rawHtml = await (await request.get(route)).text();
      const prerenderedTitle = rawHtml.match(/<title>(.*?)<\/title>/)?.[1];

      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const hydrationErrors = consoleErrors.filter((message) =>
        HYDRATION_ERROR_PATTERN.test(message)
      );
      expect(hydrationErrors, `hydrate 报错日志：${consoleErrors.join(' | ')}`).toEqual([]);

      const mutations = await page.evaluate(
        () => (window as unknown as { __rootChildMutations?: number }).__rootChildMutations ?? -1
      );
      expect(mutations, '#root 子节点被增删说明 hydrate 失败并回退为客户端渲染').toBe(0);

      // 运行时接管后标题必须与静态产物一致，否则说明 TDK 存在两份真源
      expect(await page.title()).toBe(prerenderedTitle);

      await expect(page.locator('h1')).toBeVisible();
    });
  }
});
