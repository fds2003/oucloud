import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export interface CrossToolLink {
  /** 跳转路径（含 query 参数），调用方负责拼接参数 */
  to: string
  label: string
}

export interface CrossToolLinksProps {
  links: CrossToolLink[]
  /** inline: 小胶囊行内排布（HexToRgb/ContrastChecker 风格）；grid: 卡片网格（ImageColorPicker 风格） */
  variant?: 'inline' | 'grid'
  /** 网格变体的面板标题 */
  title?: string
  className?: string
}

const inlineLinkClass =
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-800 font-medium transition-all group'
const gridLinkClass =
  'flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-primary-400 text-slate-800 font-medium shadow-2xs hover:shadow-xs transition-all group'
const arrowClass =
  'w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-transform'

/**
 * 跨工具一键流转链接组。
 *
 * 抽自 ColorPicker / HexToRgb / ContrastChecker / ImageColorPicker 四处手写的
 * 「以此色去其他工具」链接面板。链接文案与目标由调用方声明，样式单源维护。
 */
export const CrossToolLinks: React.FC<CrossToolLinksProps> = ({
  links,
  variant = 'inline',
  title = '一键协同流转至其他工具',
  className = '',
}) => {
  if (links.length === 0) return null

  if (variant === 'grid') {
    return (
      <div
        className={`rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50/50 to-indigo-50/30 p-4 space-y-2.5 ${className}`}
      >
        <span className="text-xs font-bold text-primary-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          {title}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {links.map((link) => (
            <Link key={link.to + link.label} to={link.to} className={gridLinkClass}>
              <span>{link.label}</span>
              <ArrowRight className={arrowClass} />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap gap-2 text-xs ${className}`}>
      {links.map((link) => (
        <Link key={link.to + link.label} to={link.to} className={inlineLinkClass}>
          {link.label}
          <ArrowRight className={arrowClass} />
        </Link>
      ))}
    </div>
  )
}
