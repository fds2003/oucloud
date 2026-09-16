import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react'
import { tools } from '../../data/tools'
import { buildToolPath } from '../../lib/tools'
import { ToolMeta } from '../../types/tool'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const publishedTools = useMemo(() => {
    return tools.filter((t) => t.status === 'published')
  }, [])

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return publishedTools

    return publishedTools
      .map((tool) => {
        let score = 0
        if (tool.name.toLowerCase().includes(q)) score += 10
        if (tool.shortName?.toLowerCase().includes(q)) score += 8
        if (tool.slug.toLowerCase().includes(q)) score += 6
        if (tool.keywords.some((k) => k.toLowerCase().includes(q))) score += 4
        if (tool.category.toLowerCase().includes(q)) score += 2
        return { tool, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.tool)
  }, [query, publishedTools])

  // 打开时自动聚焦并清空输入
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // 键盘导航
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          filteredTools.length > 0 ? (prev - 1 + filteredTools.length) % filteredTools.length : 0
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredTools[selectedIndex]) {
          navigate(buildToolPath(filteredTools[selectedIndex]))
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredTools, selectedIndex, navigate, onClose])

  if (!isOpen) return null

  const handleSelect = (tool: ToolMeta) => {
    navigate(buildToolPath(tool))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* 顶部搜索栏 */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="搜索全部工具（输入名称、拼音或关键词）..."
            className="w-full text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* 结果列表 */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              未找到与“{query}”相关的工具
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-50 text-primary-900 ring-1 ring-primary-500/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{tool.name}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{tool.seo.intro}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-400">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-primary-600 font-medium">
                        回车打开 <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* 底部提示 */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ 切换选中</span>
            <span>↵ 确认跳转</span>
          </div>
          <span>共 {publishedTools.length} 款纯前端本地工具</span>
        </div>
      </div>
    </div>
  )
}
