import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { CopyButton } from '../../components/common/CopyButton'
import {
  ShadowConfig,
  formatCssBoxShadow,
  formatTailwindBoxShadow,
  generateShadowLayers,
  PRESET_SHADOWS,
} from '../../lib/css/shadow'
import { parseHexParam } from '../../lib/color/conversion'
import { Layers, Sliders, Sparkles, CheckCircle } from 'lucide-react'

export const BoxShadowGenerator: React.FC = () => {
  const [config, setConfig] = useState<ShadowConfig>({
    layers: 3,
    offsetX: 0,
    offsetY: 12,
    blur: 24,
    spread: -2,
    color: '#0f172a',
    opacity: 0.12,
    inset: false,
  })

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const paramColor = parseHexParam(searchParams.get('color'))
    if (paramColor) {
      setConfig((prev) => ({ ...prev, color: paramColor }))
    }
  }, [searchParams])

  const [previewBg, setPreviewBg] = useState<'slate' | 'white' | 'dark'>('slate')

  const cssCode = useMemo(() => formatCssBoxShadow(config), [config])
  const tailwindCode = useMemo(() => formatTailwindBoxShadow(config), [config])
  const rawBoxShadowValue = useMemo(() => {
    const layers = generateShadowLayers(config)
    return layers
      .map((l) => {
        const insetStr = l.inset ? 'inset ' : ''
        return `${insetStr}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px rgba(15, 23, 42, ${l.opacity})`
      })
      .join(', ')
  }, [config])

  const previewContainerClass =
    previewBg === 'slate'
      ? 'bg-slate-100/80 border-slate-200'
      : previewBg === 'white'
        ? 'bg-white border-slate-200'
        : 'bg-slate-900 border-slate-800'

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：实时大卡片预览与精选预设 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-600" />
                多层平滑自然光晕实时预览
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewBg('slate')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    previewBg === 'slate' ? 'bg-white font-medium shadow-xs text-slate-900' : 'text-slate-500'
                  }`}
                >
                  浅灰背景
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg('white')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    previewBg === 'white' ? 'bg-white font-medium shadow-xs text-slate-900' : 'text-slate-500'
                  }`}
                >
                  纯白背景
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg('dark')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    previewBg === 'dark' ? 'bg-white font-medium shadow-xs text-slate-900' : 'text-slate-500'
                  }`}
                >
                  暗色背景
                </button>
              </div>
            </div>

            {/* 拟真阴影卡片 */}
            <div
              className={`w-full h-64 rounded-2xl border transition-all duration-200 flex items-center justify-center p-8 relative overflow-hidden ${previewContainerClass}`}
            >
              <div
                className="w-48 h-36 rounded-2xl bg-white flex flex-col items-center justify-center gap-2 border border-slate-100/50 transition-all duration-150 select-none"
                style={{ boxShadow: rawBoxShadowValue }}
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                  OU
                </div>
                <span className="text-xs font-semibold text-slate-700">平滑自然阴影</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {config.layers} 层平滑衰减
                </span>
              </div>
            </div>

            {/* 精选预设集 */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 mb-3 block">
                精选高颜值预设模板
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_SHADOWS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setConfig(p.config)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-primary-400 bg-white shadow-xs hover:shadow-sm text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {p.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：参数微调控制器与代码导出 */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-primary-600" />
                阴影参数调配
              </span>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 纯前端实时合成
              </span>
            </div>

            {/* 多层数量控制 */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  平滑层数 (Layers)
                </span>
                <span className="font-mono text-primary-600 font-bold">{config.layers} 层</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={config.layers}
                onChange={(e) => setConfig({ ...config, layers: Number(e.target.value) })}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 层 (常规经典)</span>
                <span>6 层 (极致弥散)</span>
              </div>
            </div>

            {/* 偏移与模糊控制 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">垂直偏移 (Y)</span>
                  <span className="font-mono text-slate-500">{config.offsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="60"
                  value={config.offsetY}
                  onChange={(e) => setConfig({ ...config, offsetY: Number(e.target.value) })}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">水平偏移 (X)</span>
                  <span className="font-mono text-slate-500">{config.offsetX}px</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={config.offsetX}
                  onChange={(e) => setConfig({ ...config, offsetX: Number(e.target.value) })}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">模糊半径 (Blur)</span>
                  <span className="font-mono text-slate-500">{config.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={config.blur}
                  onChange={(e) => setConfig({ ...config, blur: Number(e.target.value) })}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">扩散半径 (Spread)</span>
                  <span className="font-mono text-slate-500">{config.spread}px</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="30"
                  value={config.spread}
                  onChange={(e) => setConfig({ ...config, spread: Number(e.target.value) })}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>
            </div>

            {/* 色彩、透明度与内阴影 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
                <span className="text-xs font-medium text-slate-700 block">阴影基色</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.color}
                    onChange={(e) => setConfig({ ...config, color: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600 truncate">{config.color}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">总透明度</span>
                  <span className="font-mono text-slate-500">
                    {Math.round(config.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.8"
                  step="0.01"
                  value={config.opacity}
                  onChange={(e) => setConfig({ ...config, opacity: Number(e.target.value) })}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-700 block">阴影方向</span>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, inset: !config.inset })}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                    config.inset
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {config.inset ? '内阴影 (Inset)' : '外阴影 (Outset)'}
                </button>
              </div>
            </div>

            {/* 代码导出区 */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    原生 CSS 代码 (box-shadow)
                  </label>
                  <CopyButton
                    textToCopy={cssCode}
                    label="复制 CSS"
                    copiedLabel="已复制 CSS"
                    toolId="box-shadow-generator"
                  />
                </div>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto select-all">
                  {cssCode}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Tailwind CSS 实用类代码
                  </label>
                  <CopyButton
                    textToCopy={tailwindCode}
                    label="复制 Tailwind"
                    copiedLabel="已复制 Tailwind"
                    toolId="box-shadow-generator"
                  />
                </div>
                <pre className="bg-slate-900 text-sky-300 p-3 rounded-xl text-xs font-mono overflow-x-auto select-all">
                  {tailwindCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
