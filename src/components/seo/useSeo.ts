import { useEffect } from 'react';
import { SITE_URL } from '../../data/site';

export interface SeoOptions {
  title: string;
  description: string;
  /** 站内路径，如 /tools/color/color-picker */
  path: string;
  noindex?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * 客户端站内跳转时同步 head。
 *
 * 首屏（爬虫看到的）静态 head 由 scripts/prerender.ts 直接写入 HTML，
 * 不依赖本 Hook；两者内容必须保持一致，唯一数据源是 data/tools.ts。
 */
export function useSeo({ title, description, path, noindex }: SeoOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, noindex]);
}
