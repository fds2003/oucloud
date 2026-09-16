import React, { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { CopyButton } from '../../components/common/CopyButton'
import {
  GradientConfig,
  formatCssGradient,
  formatGradientBorderClip,
  formatGradientBorderImage,
  PRESET_GRADIENTS,
} from '../../lib/css/gradient'
import { Plus, Trash2, RotateCw } from 'lucide-react'

type OutputMode = 'background' | 'border'

export const GradientGenerator: React.FC = () => {
  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    stops: [
      { id: '1', color: '#0ea5e9', position: 0 },
      { id: '2', color: '#6366f1', position: 100 },
    ],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [mode, setMode] = useState<OutputMode>('background')
  const [borderWidth, setBorderWidth] = useState(4)
  const [borderRadius, setBorderRadius] = useState(12)

  const gradientValue = formatCssGradient(config)
  const cssString = `background: ${gradientValue};`
  const borderClipCss = formatGradientBorderClip(config, {
    width: borderWidth,
    radius: borderRadius,
  })
  const borderImageCss = formatGradientBorderImage(config, { width: borderWidth })

  // 预览样式与导出的 CSS 保持同一套实现，避免预览与代码不一致
  const previewStyle: React.CSSProperties =
    mode === 'background'
      ? { background: gradientValue }
      : {
          border: `${borderWidth}px solid transparent`,
          background: `linear-gradient(#ffffff, #ffffff) padding-box, ${gradientValue} border-box`,
          borderRadius: borderRadius,
        }

  const addStop = () => {
    const newId = String(Date.now())
    setConfig({
      ...config,
      stops: [...config.stops, { id: newId, color: '#ec4899', position: 50 }],
    })
  }

  const removeStop = (id: string) => {
    if (config.stops.length <= 2) {
      setErrorMessage('渐变至少需要保留 2 个色标')
      return
    }
    setErrorMessage(null)
    setConfig({
      ...config,
      stops: config.stops.filter((s) => s.id !== id),
    })
  }

  const updateStop = (id: string, updates: Partial<{ color: string; position: number }>) => {
    setConfig({
      ...config,
      stops: config.stops.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* 输出模式切换：渐变背景 / 渐变边框 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50/80 p-1">
            {(
              [
                { key: 'background', label: '渐变背景' },
                { key: 'border', label: '渐变边框' },
              ] as { key: OutputMode; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`text-sm px-4 py-1.5 rounded-md font-medium transition-colors ${
                  mode === tab.key
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {mode === 'background'
              ? '生成渐变背景代码，适用于按钮、卡片与页面区块。'
              : '生成渐变边框代码，同时给出支持圆角与简短两种写法。'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：实时预览与预设推荐 */}
          <div className="space-y-5">
            <div
              className={`w-full h-56 rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center relative overflow-hidden ${
                mode === 'background' ? 'border border-slate-200/80' : ''
              }`}
              style={previewStyle}
            >
              <span
                className={`backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${
                  mode === 'background'
                    ? 'bg-slate-900/60 text-white'
                    : 'bg-slate-900/5 text-slate-700'
                }`}
              >
                {mode === 'background' ? '实时渐变背景预览' : '实时渐变边框预览'}
              </span>
            </div>

            {/* 渐变预设 */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 mb-2.5 block">
                精选高颜值渐变预设
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_GRADIENTS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setConfig(p.config)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-primary-400 bg-white shadow-sm transition-all text-left group"
                  >
                    <div
                      className="w-7 h-7 rounded-md shrink-0 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"
                      style={{ background: formatCssGradient(p.config) }}
                    />
                    <span className="text-xs font-medium text-slate-700 truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：参数控制与 CSS 代码导出 */}
          <div className="space-y-5">
            {/* 边框参数（仅渐变边框模式显示） */}
            {mode === 'border' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-600 block">
                  边框参数 (Border)
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-16 shrink-0">
                    宽度 {borderWidth}px
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(Number(e.target.value))}
                    className="w-full accent-primary-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-16 shrink-0">
                    圆角 {borderRadius}px
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full accent-primary-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  圆角仅方案 A 生效：border-image 与 border-radius 互斥，无法同时作用在同一元素上。
                </p>
              </div>
            )}

            {/* 角度与类型调节 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> 渐变角度控制 ({config.angle}°)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfig({ ...config, type: 'linear' })}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      config.type === 'linear'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-slate-600 border'
                    }`}
                  >
                    线性 (Linear)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, type: 'radial' })}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      config.type === 'radial'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-slate-600 border'
                    }`}
                  >
                    径向 (Radial)
                  </button>
                </div>
              </div>

              {config.type === 'linear' && (
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={config.angle}
                  onChange={(e) => setConfig({ ...config, angle: Number(e.target.value) })}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              )}
            </div>

            {/* 色标列表 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase text-slate-600">
                  色标调配 (Color Stops)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addStop}
                  className="gap-1 text-xs py-1 h-7"
                >
                  <Plus className="w-3.5 h-3.5" /> 添加色标
                </Button>
              </div>

              {/* 错误消息 */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {config.stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm"
                  >
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                      className="w-24 text-xs font-mono border border-slate-300 rounded px-2 py-1"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                        className="w-full accent-primary-600 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-500 w-9 text-right">
                        {stop.position}%
                      </span>
                    </div>
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="删除此色标"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS 输出与一键复制 */}
            {mode === 'background' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">CSS 样式代码</label>
                  <CopyButton textToCopy={cssString} label="复制 CSS" copiedLabel="已复制 CSS" />
                </div>
                <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto select-all">
                  {cssString}
                </pre>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">
                      方案 A · 支持圆角（推荐）
                    </label>
                    <CopyButton
                      textToCopy={borderClipCss}
                      label="复制 CSS"
                      copiedLabel="已复制 CSS"
                    />
                  </div>
                  <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto select-all">
                    {borderClipCss}
                  </pre>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500">
                      方案 B · 简短写法（不支持圆角）
                    </label>
                    <CopyButton
                      textToCopy={borderImageCss}
                      label="复制 CSS"
                      copiedLabel="已复制 CSS"
                    />
                  </div>
                  <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto select-all">
                    {borderImageCss}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
