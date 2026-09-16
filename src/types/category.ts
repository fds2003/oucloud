export interface CategoryMeta {
  id: string
  slug: string
  name: string
  description: string
  /** 分类页正文长介绍：SEO 补充内容，展示在工具列表下方 */
  longDescription?: string
  icon?: string
}
