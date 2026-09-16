import React, { useEffect } from 'react';
import { buildAbsoluteUrl } from '../../lib/tools';

export interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'article';
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath,
  ogType = 'website',
}) => {
  const canonicalUrl = buildAbsoluteUrl(canonicalPath);

  useEffect(() => {
    // 动态更新页面标题
    document.title = title;

    // 动态更新 Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', description);

    // 动态更新 Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // OpenGraph
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', title);
    setOgTag('og:description', description);
    setOgTag('og:url', canonicalUrl);
    setOgTag('og:type', ogType);
  }, [title, description, canonicalUrl, ogType]);

  return null;
};
