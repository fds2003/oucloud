import { describe, it, expect } from 'vitest';
import {
  extractUrlsFromSitemapXml,
  buildBaiduPushPayload,
  formatPushApiUrl,
} from '../../src/lib/seo/pushBaidu';

describe('Baidu & Search Engine Push Engine (TDD)', () => {
  const sampleSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://oucloud.cn/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://oucloud.cn/tools/color/color-picker</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://oucloud.cn/tools/number/rmb-uppercase</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  describe('extractUrlsFromSitemapXml (Sitemap URL 提取)', () => {
    it('正确解析所有 <loc> 节点中的合法 URL', () => {
      const urls = extractUrlsFromSitemapXml(sampleSitemapXml);
      expect(urls).toHaveLength(3);
      expect(urls).toContain('https://oucloud.cn/');
      expect(urls).toContain('https://oucloud.cn/tools/color/color-picker');
      expect(urls).toContain('https://oucloud.cn/tools/number/rmb-uppercase');
    });

    it('空或非法 XML 返回空数组', () => {
      expect(extractUrlsFromSitemapXml('')).toEqual([]);
      expect(extractUrlsFromSitemapXml('<invalid>no loc</invalid>')).toEqual([]);
    });
  });

  describe('buildBaiduPushPayload (API Payload 文本构建)', () => {
    it('将 URL 数组格式化为换行符分隔的标准字符串', () => {
      const urls = ['https://oucloud.cn/', 'https://oucloud.cn/about'];
      const payload = buildBaiduPushPayload(urls);
      expect(payload).toBe('https://oucloud.cn/\nhttps://oucloud.cn/about');
    });
  });

  describe('formatPushApiUrl (接口端点格式化)', () => {
    it('正确拼接 site 和 token', () => {
      const url = formatPushApiUrl('https://oucloud.cn', 'my_secret_token');
      expect(url).toBe('http://data.zz.baidu.com/urls?site=https://oucloud.cn&token=my_secret_token');
    });
  });
});
