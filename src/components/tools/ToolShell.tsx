import React from 'react'
import { ToolMeta } from '../../types/tool'
import {
  getCategoryBySlug,
  buildToolPath,
  buildAbsoluteUrl,
  buildCategoryPath,
  SITE_URL,
} from '../../lib/tools'
import { Breadcrumb } from '../layout/Breadcrumb'
import { SeoHead } from '../seo/SeoHead'
import { JsonLd } from '../seo/JsonLd'
import { buildToolMeta } from '../../data/seo'
import { RelatedTools } from './RelatedTools'
import { BookOpen, HelpCircle, ListOrdered, Search, Shield, Table2 } from 'lucide-react'

export interface ToolShellProps {
  tool: ToolMeta
  relatedTools: ToolMeta[]
  children: React.ReactNode
}

export const ToolShell: React.FC<ToolShellProps> = ({ tool, relatedTools, children }) => {
  const category = getCategoryBySlug(tool.category)
  const toolUrl = buildToolPath(tool)
  const absoluteUrl = buildAbsoluteUrl(toolUrl)

  const breadcrumbItems = [
    {
      label: category ? category.name : tool.category,
      path: `/tools/${tool.category}`,
    },
    {
      label: tool.shortName || tool.name,
    },
  ]

  // WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: absoluteUrl,
    description: tool.seo.description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category ? category.name : tool.category,
        item: buildAbsoluteUrl(buildCategoryPath(tool.category)),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: absoluteUrl,
      },
    ],
  }

  // FAQPage Schema (仅在存在真实 FAQ 时注入)
  const faqSchema =
    tool.seo.faq && tool.seo.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.seo.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <SeoHead {...buildToolMeta(tool)} />
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* 面包屑 */}
      <Breadcrumb items={breadcrumbItems} />

      {/* 头部标题区 */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            <Shield className="w-3 h-3" /> 本地安全处理
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            免费工具
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {tool.seo.h1}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          {tool.seo.intro}
        </p>
      </header>

      {/* 核心工具操作区 (Tool First) */}
      <main className="mb-14">{children}</main>

      {/* Position 0 速查表 (静态答案，供搜索引擎抓取精选摘要) */}
      {tool.seo.quickReference && (
        <section className="mt-12 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Table2 className="w-5 h-5 text-primary-600" />
            {tool.seo.quickReference.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  {tool.seo.quickReference.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="py-2 pr-4 text-left text-xs font-semibold tracking-wide text-slate-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tool.seo.quickReference.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-slate-100 last:border-0">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={`py-2 pr-4 align-top leading-relaxed ${
                          cellIdx === 0
                            ? 'font-mono text-slate-900'
                            : cellIdx === 1
                              ? 'font-semibold text-slate-900'
                              : 'text-slate-600'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tool.seo.quickReference.caption && (
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              {tool.seo.quickReference.caption}
            </p>
          )}
        </section>
      )}

      {/* 使用说明 (How to Use) */}
      {tool.seo.howTo && tool.seo.howTo.length > 0 && (
        <section className="mt-12 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <ListOrdered className="w-5 h-5 text-primary-600" />
            使用指南
          </h2>
          <ol className="space-y-3">
            {tool.seo.howTo.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 补充知识与原理解析 (Explanation) */}
      {tool.seo.explanation && (
        <section className="mt-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-primary-600" />
            原理解析与标准规范
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{tool.seo.explanation}</p>
        </section>
      )}

      {/* 常见问题 FAQ */}
      {tool.seo.faq && tool.seo.faq.length > 0 && (
        <section className="mt-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            常见问题解答 (FAQ)
          </h2>
          <div className="space-y-4">
            {tool.seo.faq.map((item, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <h3 className="text-sm font-semibold text-slate-800">{item.question}</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 相关工具推荐 (Topic Cluster) */}
      <RelatedTools tools={relatedTools} />

      {/* NavBoost 品牌回搜引导（沉淀「OUCloud + 工具名」品牌实体） */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span>
          随时在 Google 或百度搜索「OUCloud {tool.shortName || tool.name}」，快速找回本工具
        </span>
      </div>
    </div>
  )
}
