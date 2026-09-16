import React, { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Sparkles,
  ArrowRight,
  Palette,
  Coins,
  Image as ImageIcon,
  Code2,
} from 'lucide-react'
import { ToolMeta } from '../../types/tool'
import { tools } from '../../data/tools'
import { categories } from '../../data/categories'
import { buildToolPath } from '../../lib/tools'
import { SeoHead } from '../../components/seo/SeoHead'
import { JsonLd } from '../../components/seo/JsonLd'
import { HOME_META } from '../../data/seo'
import { buildAbsoluteUrl } from '../../lib/tools'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-5 h-5" />,
  Coins: <Coins className="w-5 h-5" />,
  Image: <ImageIcon className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
}

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // 深链搜索：SearchAction 声明的 /?q=xxx 入口。
  // 首帧不读 URL（SSR 与客户端渲染同一空值，避免 hydration mismatch），
  // 挂载后同步 q 参数到输入框，实现「Google 站点搜索框 → 直接出结果」闭环。
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchQuery(q)
    }
  }, [searchParams])

  // 客户端实时智能搜索（按匹配度排序）
  const filteredTools = useMemo(() => {
    // 只暴露已发布工具：草稿不应出现在首页，否则会链向一个不在 sitemap 中的页面
    const published = tools.filter((t) => t.status === 'published')
    const q = searchQuery.trim().toLowerCase()
    if (!q) return published

    return [...published]
      .map((tool) => {
        let score = 0
        if (tool.name.toLowerCase() === q) score += 100
        else if (tool.name.toLowerCase().includes(q)) score += 50
        else if (tool.keywords.some((k) => k.toLowerCase().includes(q))) score += 30
        else if (tool.category.toLowerCase().includes(q)) score += 20
        else if (tool.seo.description.toLowerCase().includes(q)) score += 10
        return { tool, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.tool)
  }, [searchQuery])

  const featuredTools = tools.filter((t) => t.featured && t.status === 'published')

  return (
    <div>
      <SeoHead {...HOME_META} />

      {/* 全站站点级 Schema：WebSite + Organization，仅在首页输出一次 */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'OUCloud',
          url: buildAbsoluteUrl('/'),
          description: HOME_META.description,
          inLanguage: 'zh-CN',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: buildAbsoluteUrl('/?q={search_term_string}'),
            },
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'OUCloud',
          url: buildAbsoluteUrl('/'),
          logo: buildAbsoluteUrl('/pwa-icon-512.png'),
        }}
      />

      {/* Hero 区域 */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-3.5 py-1 text-xs font-medium text-primary-700 mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-600" />
            纯前端本地驱动 · 零数据上传 · 极速免费
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            极简、私密、开箱即用的 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              在线工具矩阵平台
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
            无需注册，无广告打扰。所有色彩计算、金额大写转换、图标生成与渐变设计完全在你的浏览器本地进行，为开发者与日常办公提供极致效率。
          </p>

          {/* 实时检索输入框 (Tool Search) */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative shadow-sm rounded-2xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索工具：颜色拾取、大写转换、Favicon、渐变..."
                className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600"
                >
                  清空
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* 工具搜索结果或推荐展示 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {searchQuery
                  ? `包含“${searchQuery}”的搜索结果 (${filteredTools.length})`
                  : '精选热门工具'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                高频使用、确定性高、体验极致的实用小工具
              </p>
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-sm text-slate-500">未找到匹配的工具，换个关键词试试？</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(searchQuery ? filteredTools : featuredTools).map((tool: ToolMeta) => (
                <Link
                  key={tool.id}
                  to={buildToolPath(tool)}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full">
                        {tool.category}
                      </span>
                      <span className="text-xs text-slate-400 group-hover:text-primary-600 transition-colors flex items-center gap-1 font-medium">
                        立即使用{' '}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-primary-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {tool.seo.intro}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {tool.keywords.slice(0, 3).map((kw: string) => (
                      <span
                        key={kw}
                        className="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 分类索引导航 (Topic Cluster Hub) */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">按分类浏览</h2>
            <p className="text-xs text-slate-500 mt-0.5">覆盖设计、开发、财务及日常办公核心场景</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const count = tools.filter((t) => t.category === cat.slug).length
              return (
                <Link
                  key={cat.id}
                  to={`/tools/${cat.slug}`}
                  className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 mb-3 group-hover:scale-110 transition-transform">
                    {cat.icon && CATEGORY_ICONS[cat.icon] ? (
                      CATEGORY_ICONS[cat.icon]
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                  <div className="mt-3 text-[11px] font-semibold text-primary-600">
                    收录 {count} 个工具 →
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
