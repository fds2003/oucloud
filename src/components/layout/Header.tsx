import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { categories } from '../../data/categories'

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                OUCloud<span className="text-primary-600">.cn</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal mt-0.5">
                纯前端在线工具箱
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/tools/${cat.slug}`}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/about"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:inline-block"
          >
            关于平台
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* 移动端分类入口：桌面导航在 <768px 隐藏，此处补齐，否则移动端无法切换工具 */}
      <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/tools/${cat.slug}`}
            className="shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            {cat.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}
