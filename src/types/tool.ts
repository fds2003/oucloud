export type ToolStatus = 'draft' | 'published'

export type ToolIntent =
  'converter' | 'generator' | 'calculator' | 'checker' | 'formatter' | 'picker'

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Position 0 速查表：以静态 HTML 表格直接回答用户的高频查询，
 * 无需交互即可被搜索引擎作为精选摘要抓取。
 * 注意：rows 内容必须与工具算法的真实输出逐字一致，否则会自相矛盾。
 */
export interface QuickReference {
  title: string
  caption?: string
  columns: string[]
  rows: string[][]
}

export interface ToolSEO {
  title: string
  description: string
  h1: string
  intro: string
  howTo: string[]
  explanation?: string
  faq: FAQItem[]
  quickReference?: QuickReference
}

export interface ToolMeta {
  id: string
  slug: string

  name: string
  shortName?: string

  category: string
  topic: string

  intent: ToolIntent
  status: ToolStatus

  keywords: string[]

  component: import('../tools/registry').ToolComponentName

  seo: ToolSEO

  featured?: boolean

  relatedTools?: string[]
}
