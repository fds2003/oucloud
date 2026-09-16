import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ToolMeta } from '../../src/types/tool';

const mocks = vi.hoisted(() => {
  const tools = [
    {
      id: 'a',
      slug: 'alpha',
      category: 'cat1',
      topic: 'topic1',
      status: 'published',
      relatedTools: ['b'],
    },
    { id: 'b', slug: 'beta', category: 'cat1', topic: 'topic1', status: 'published' },
    { id: 'c', slug: 'gamma', category: 'cat1', topic: 'topic2', status: 'published' },
    { id: 'd', slug: 'delta', category: 'cat2', topic: 'topic1', status: 'draft' },
    { id: 'e', slug: 'epsilon', category: 'cat2', topic: 'topic2', status: 'published' },
  ];
  const categories = [
    { id: 'cat1', slug: 'cat1', name: 'Category 1', description: '', icon: 'X' },
    { id: 'cat2', slug: 'cat2', name: 'Category 2', description: '', icon: 'Y' },
  ];
  return { tools, categories, siteUrl: 'https://oucloud.cn' };
});

vi.mock('../../src/data/tools', () => ({ tools: mocks.tools }));
vi.mock('../../src/data/categories', () => ({ categories: mocks.categories }));
vi.mock('../../src/data/site', () => ({ SITE_URL: mocks.siteUrl }));

import {
  buildToolPath,
  buildCategoryPath,
  buildAbsoluteUrl,
  getToolBySlug,
  getToolById,
  getRelatedTools,
  getCategoryBySlug,
  SITE_URL,
} from '../../src/lib/tools';

const toolA = mocks.tools[0] as unknown as ToolMeta;
const toolC = mocks.tools[2] as unknown as ToolMeta;
const toolE = mocks.tools[4] as unknown as ToolMeta;

describe('Tool Registry - 路径与查询函数测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildToolPath', () => {
    it('should build /tools/{category}/{slug} path', () => {
      const tool = { category: 'color', slug: 'color-picker' } as ToolMeta;
      expect(buildToolPath(tool)).toBe('/tools/color/color-picker');
    });

    it('should preserve category and slug exactly', () => {
      const tool = { category: 'css', slug: 'gradient-generator' } as ToolMeta;
      expect(buildToolPath(tool)).toBe('/tools/css/gradient-generator');
    });
  });

  describe('buildCategoryPath', () => {
    it('should build /tools/{category} path', () => {
      expect(buildCategoryPath('color')).toBe('/tools/color');
    });
  });

  describe('buildAbsoluteUrl', () => {
    it('should prepend SITE_URL to a leading-slash path', () => {
      expect(buildAbsoluteUrl('/tools/color')).toBe('https://oucloud.cn/tools/color');
    });

    it('should add a leading slash when missing', () => {
      expect(buildAbsoluteUrl('tools/color')).toBe('https://oucloud.cn/tools/color');
    });

    it('should handle root path', () => {
      expect(buildAbsoluteUrl('/')).toBe('https://oucloud.cn/');
    });
  });

  describe('getToolBySlug', () => {
    it('should find a published tool by category and slug', () => {
      const tool = getToolBySlug('cat1', 'alpha');
      expect(tool?.id).toBe('a');
    });

    it('should return undefined for a draft tool', () => {
      expect(getToolBySlug('cat2', 'delta')).toBeUndefined();
    });

    it('should return undefined when slug does not exist', () => {
      expect(getToolBySlug('cat1', 'nope')).toBeUndefined();
    });

    it('should return undefined when category does not match', () => {
      expect(getToolBySlug('cat2', 'alpha')).toBeUndefined();
    });
  });

  describe('getToolById', () => {
    it('should find a published tool by id', () => {
      expect(getToolById('b')?.slug).toBe('beta');
    });

    it('should return undefined for a draft tool', () => {
      expect(getToolById('d')).toBeUndefined();
    });

    it('should return undefined for an unknown id', () => {
      expect(getToolById('missing')).toBeUndefined();
    });
  });

  describe('getRelatedTools', () => {
    it('should prioritize manually related tools', () => {
      const related = getRelatedTools(toolA);
      expect(related[0]?.id).toBe('b');
    });

    it('should fall back to same-topic tools', () => {
      // toolC: topic2, no relatedTools -> same-topic toolE first
      const related = getRelatedTools(toolC);
      expect(related[0]?.id).toBe('e');
    });

    it('should fall back to same-category tools', () => {
      // toolE: cat2/topic2, no relatedTools -> same-topic toolC, then same-category (draft excluded)
      const related = getRelatedTools(toolE);
      expect(related.map((t) => t.id)).toEqual(['c']);
    });

    it('should respect the limit', () => {
      const related = getRelatedTools(toolA, 1);
      expect(related).toHaveLength(1);
      expect(related[0]?.id).toBe('b');
    });

    it('should never include the current tool', () => {
      const related = getRelatedTools(toolA);
      expect(related.some((t) => t.id === 'a')).toBe(false);
    });

    it('should exclude draft tools', () => {
      const related = getRelatedTools(toolA);
      expect(related.some((t) => t.id === 'd')).toBe(false);
    });

    it('should not duplicate tools across sources', () => {
      const related = getRelatedTools(toolA);
      const ids = related.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('getCategoryBySlug', () => {
    it('should find a category by slug', () => {
      const category = getCategoryBySlug('cat1');
      expect(category?.name).toBe('Category 1');
    });

    it('should return undefined for an unknown slug', () => {
      expect(getCategoryBySlug('missing')).toBeUndefined();
    });
  });

  describe('SITE_URL re-export', () => {
    it('should re-export the site URL', () => {
      expect(SITE_URL).toBe('https://oucloud.cn');
    });
  });
});