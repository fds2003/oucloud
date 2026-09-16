import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Menu, X, ArrowRight, Search, Sun, Moon, Monitor } from 'lucide-react'
import { categories } from '../../data/categories'
import { tools } from '../../data/tools'
import { buildToolPath } from '../../lib/tools'
import { CommandPalette } from './CommandPalette'
import { getStoredTheme, setStoredTheme, applyThemeToDom, Theme } from '../../lib/theme'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('system')

  const closeMenu = () => setMobileMenuOpen(false)

  // 初始化并监听主题变化
  useEffect(() => {
    const initial = getStoredTheme()
    setTheme(initial)
    applyThemeToDom(initial)

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        const current = getStoredTheme()
        if (current === 'system') {
          applyThemeToDom('system')
        }
      }
      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    }
  }, [])
  const handleCycleTheme = () => {
    const next: Theme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'
    setTheme(next)
    setStoredTheme(next)
    applyThemeToDom(next)
  }

  // 全局快捷键 Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
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
          {/* 全局快捷搜索按钮 */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 text-xs font-medium transition-all shadow-sm group"
            title="按 Ctrl+K 或 ⌘K 搜索工具"
            aria-label="打开全局搜索 (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 transition-colors" />
            <span className="hidden sm:inline">搜索工具...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              ⌘K
            </kbd>
          </button>

          {/* 主题切换按钮 */}
          <button
            type="button"
            onClick={handleCycleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
            title={`当前主题：${theme === 'system' ? '跟随系统' : theme === 'dark' ? '暗色模式' : '浅色模式'} (点击切换)`}
            aria-label="切换色彩主题"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-400" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Monitor className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <Link
            to="/about"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors hidden sm:inline-block"
          >
            关于平台
          </Link>
          {/* 移动端汉堡切换按钮 */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* 移动端快速分类胶囊栏 */}
      <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/tools/${cat.slug}`}
            onClick={closeMenu}
            className="shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* 移动端抽屉折叠面板 */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                全部在线工具
              </div>
              <div className="grid grid-cols-1 gap-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={buildToolPath(tool)}
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-lg p-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <span>{tool.name}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                平台与服务
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                <Link to="/about" onClick={closeMenu} className="hover:text-primary-600">
                  关于平台
                </Link>
                <Link to="/privacy" onClick={closeMenu} className="hover:text-primary-600">
                  隐私政策
                </Link>
                <Link to="/terms" onClick={closeMenu} className="hover:text-primary-600">
                  服务条款
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 全局 Command Palette 模态框 */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </header>
  )
}
