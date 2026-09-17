import React from 'react'
import { SeoHead } from '../../components/seo/SeoHead'
import { Breadcrumb } from '../../components/layout/Breadcrumb'
import { STATIC_PAGE_META } from '../../data/seo'
import { SITE, SITE_URL } from '../../data/site'

export const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <SeoHead {...STATIC_PAGE_META['/about']} />
      <Breadcrumb items={[{ label: '关于平台' }]} />

      <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">关于 OUCloud</h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          OUCloud（
          <a href={SITE_URL} className="text-primary-600">
            oucloud.cn
          </a>
          ）是一个由搜索需求驱动、专注于轻量高效的现代化在线工具箱平台。
        </p>

        <h2 className="text-xl font-bold text-slate-800">我们的原则</h2>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>
            <strong>Tool First</strong>
            ：无需在漫长的文字中翻找按钮，打开页面第一屏直接就是可操作的工具。
          </li>
          <li>
            <strong>绝对隐私与安全</strong>
            ：我们坚持纯前端架构，不设后端文件收集系统，您的图片、财务数字和色彩数据仅在您的浏览器内存中运算。
          </li>
          <li>
            <strong>免除繁琐</strong>：无广告弹窗、无诱导关注、无需注册登录，即用即走。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800">技术架构</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          OUCloud 基于 React 18、TypeScript、Tailwind CSS 和 Vite
          构建，全面采用预渲染静态化技术，保证全网极速的秒开加载速度与高可用性。
        </p>

        {SITE.email && (
          <>
            <h2 className="text-xl font-bold text-slate-800">联系我们</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              若您在使用过程中发现结果有误、有功能建议，或希望就商务合作进行沟通，欢迎随时发送邮件至{' '}
              <a href={`mailto:${SITE.email}`} className="text-primary-600">
                {SITE.email}
              </a>
              ，我们将在工作日内尽快回复。
            </p>
          </>
        )}
      </article>
    </div>
  )
}
