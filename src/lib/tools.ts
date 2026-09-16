import { ToolMeta } from '../types/tool'
import { tools } from '../data/tools'
import { categories } from '../data/categories'
import { SITE_URL } from '../data/site'

export { SITE_URL }

/**
 * 构造工具页相对路径: /tools/{category}/{slug}
 */
export function buildToolPath(tool: ToolMeta): string {
  return `/tools/${tool.category}/${tool.slug}`
}

/**
 * 构造分类页相对路径: /tools/{category}
 */
export function buildCategoryPath(categorySlug: string): string {
  return `/tools/${categorySlug}`
}

/**
 * 构造全站绝对 URL
 */
export function buildAbsoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

/**
 * 根据 category 和 slug 查询已发布的工具
 */
export function getToolBySlug(category: string, slug: string): ToolMeta | undefined {
  return tools.find((t) => t.category === category && t.slug === slug && t.status === 'published')
}

/**
 * 根据 ID 查询工具
 */
export function getToolById(id: string): ToolMeta | undefined {
  return tools.find((t) => t.id === id && t.status === 'published')
}

/**
 * 获取相关推荐工具 (优先级：人工 relatedTools > 同 Topic > 同 Category)
 */
export function getRelatedTools(currentTool: ToolMeta, limit: number = 4): ToolMeta[] {
  const relatedList: ToolMeta[] = []
  const addedIds = new Set<string>([currentTool.id])

  // 1. 人工指定相关工具
  if (currentTool.relatedTools && currentTool.relatedTools.length > 0) {
    for (const relatedId of currentTool.relatedTools) {
      const tool = getToolById(relatedId)
      if (tool && !addedIds.has(tool.id)) {
        relatedList.push(tool)
        addedIds.add(tool.id)
      }
    }
  }

  // 2. 同 Topic 相关工具
  if (relatedList.length < limit) {
    for (const tool of tools) {
      if (
        tool.status === 'published' &&
        tool.topic === currentTool.topic &&
        !addedIds.has(tool.id)
      ) {
        relatedList.push(tool)
        addedIds.add(tool.id)
        if (relatedList.length >= limit) break
      }
    }
  }

  // 3. 同 Category 相关工具
  if (relatedList.length < limit) {
    for (const tool of tools) {
      if (
        tool.status === 'published' &&
        tool.category === currentTool.category &&
        !addedIds.has(tool.id)
      ) {
        relatedList.push(tool)
        addedIds.add(tool.id)
        if (relatedList.length >= limit) break
      }
    }
  }

  return relatedList.slice(0, limit)
}

/**
 * 获取分类元信息
 */
export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}
