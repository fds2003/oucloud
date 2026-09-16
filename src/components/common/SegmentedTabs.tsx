import React from 'react'

export interface SegmentedTabOption<T extends string> {
  value: T
  label: React.ReactNode
}

export interface SegmentedTabsProps<T extends string> {
  value: T
  options: SegmentedTabOption<T>[]
  onChange: (value: T) => void
  /** 追加类名，控制布局（如 flex-wrap、宽度等） */
  className?: string
  size?: 'sm' | 'md'
}

/**
 * 分段式切换 Tab（胶囊选中态）。
 *
 * 抽自 HexToRgb / TimestampConverter / SvgToFavicon 三处手写的同构按钮组：
 * 灰底容器 + 选中白底浮起。选中态样式必须与本组件保持单源，避免多处漂移。
 */
export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  className = '',
  size = 'md',
}: SegmentedTabsProps<T>) {
  const optionClass =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs font-semibold rounded-lg'
      : 'px-4 py-2 text-sm font-semibold rounded-lg'

  return (
    <div className={`flex bg-slate-100 p-1 rounded-xl ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`${optionClass} transition-all ${
            value === option.value
              ? 'bg-white text-primary-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
