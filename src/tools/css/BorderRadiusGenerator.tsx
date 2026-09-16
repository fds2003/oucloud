import React, { useState, useMemo } from 'react'
import { Card } from '../../components/common/Card'
import { CopyButton } from '../../components/common/CopyButton'
import {
  BorderRadiusConfig,
  formatCssBorderRadius,
  formatTailwindBorderRadius,
  PRESET_BORDER_RADII,
} from '../../lib/css/borderRadius'
import { Sliders, Sparkles, CheckCircle, RotateCcw } from 'lucide-react'

export const BorderRadiusGenerator: React.FC = () => {
  const [config, setConfig] = useState<BorderRadiusConfig>({
    topLeftX: 60,
    topRightX: 40,
    bottomRightX: 30,
    bottomLeftX: 70,
    topLeftY: 60,
    topRightY: 30,
    bottomRightY: 70,
    bottomLeftY: 40,
  })

  const [blobBg, setBlobBg] = useState<'gradient-indigo' | 'gradient-sunset' | 'emerald' | 'sky'>('gradient-indigo')

  const cssCode = useMemo(() => formatCssBorderRadius(config), [config])
  const tailwindCode = useMemo(() => formatTailwindBorderRadius(config), [config])
  const rawRadiusValue = useMemo(() => {
    const h = `${config.topLeftX}% ${config.topRightX}% ${config.bottomRightX}% ${config.bottomLeftX}%`
    const v = `${config.topLeftY}% ${config.topRightY}% ${config.bottomRightY}% ${config.bottomLeftY}%`
    return `${h} / ${v}`
  }, [config])

  const blobBgStyle =
    blobBg === 'gradient-indigo'
      ? { background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }
      : blobBg === 'gradient-sunset'
        ? { background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' }
        : blobBg === 'emerald'
          ? { background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }
          : { background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' }

  const handleReset = () => {
    setConfig({
      topLeftX: 50,
      topRightX: 50,
      bottomRightX: 50,
      bottomLeftX: 50,
      topLeftY: 50,
      topRightY: 50,
      bottomRightY: 50,
      bottomLeftY: 50,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：实时异形 Blob 拟真预览与预设 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-600" />
                8 值不规则圆角实时渲染
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setBlobBg('gradient-indigo')}
                  className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                  title="紫蓝渐变"
                />
                <button
                  type="button"
                  onClick={() => setBlobBg('gradient-sunset')}
                  className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}
                  title="落日渐变"
                />
                <button
                  type="button"
                  onClick={() => setBlobBg('emerald')}
                  className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                  title="翡翠绿"
                />
                <button
                  type="button"
                  onClick={() => setBlobBg('sky')}
                  className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}
                  title="天空蓝"
                />
              </div>
            </div>

            {/* 拟真画布 */}
            <div className="w-full h-64 rounded-2xl border border-slate-200 bg-slate-50/80 p-8 flex items-center justify-center relative overflow-hidden shadow-inner">
              <div
                className="w-48 h-48 shadow-xl transition-all duration-300 flex items-center justify-center text-white text-center p-4 select-none"
                style={{
                  ...blobBgStyle,
                  borderRadius: rawRadiusValue,
                }}
              >
                <div className="backdrop-blur-xs px-3 py-1.5 rounded-full bg-black/20 text-xs font-semibold">
                  8-Value Radius
                </div>
              </div>
            </div>

            {/* 精选预设集 */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase text-slate-500">
                  精选现代有机几何预设
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> 重置为正圆
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_BORDER_RADII.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setConfig(preset.config)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-primary-400 bg-white shadow-2xs hover:shadow-xs text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：8 个半轴滑块控制与代码导出 */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-primary-600" />
                八方向半轴微调控制 (Horizontal / Vertical)
              </span>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 纯前端实时合成
              </span>
            </div>

            {/* 4 个角的控制面板 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 左上角 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">左上角 (Top-Left)</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>水平半轴 (X)</span>
                    <span className="font-mono font-bold text-primary-600">{config.topLeftX}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.topLeftX}
                    onChange={(e) => setConfig({ ...config, topLeftX: Number(e.target.value) })}
                    className="w-full accent-primary-600 cursor-pointer h-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>垂直半轴 (Y)</span>
                    <span className="font-mono font-bold text-indigo-600">{config.topLeftY}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.topLeftY}
                    onChange={(e) => setConfig({ ...config, topLeftY: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* 右上角 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">右上角 (Top-Right)</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>水平半轴 (X)</span>
                    <span className="font-mono font-bold text-primary-600">{config.topRightX}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.topRightX}
                    onChange={(e) => setConfig({ ...config, topRightX: Number(e.target.value) })}
                    className="w-full accent-primary-600 cursor-pointer h-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>垂直半轴 (Y)</span>
                    <span className="font-mono font-bold text-indigo-600">{config.topRightY}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.topRightY}
                    onChange={(e) => setConfig({ ...config, topRightY: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* 右下角 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">右下角 (Bottom-Right)</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>水平半轴 (X)</span>
                    <span className="font-mono font-bold text-primary-600">{config.bottomRightX}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.bottomRightX}
                    onChange={(e) => setConfig({ ...config, bottomRightX: Number(e.target.value) })}
                    className="w-full accent-primary-600 cursor-pointer h-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>垂直半轴 (Y)</span>
                    <span className="font-mono font-bold text-indigo-600">{config.bottomRightY}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.bottomRightY}
                    onChange={(e) => setConfig({ ...config, bottomRightY: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* 左下角 */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">左下角 (Bottom-Left)</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>水平半轴 (X)</span>
                    <span className="font-mono font-bold text-primary-600">{config.bottomLeftX}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.bottomLeftX}
                    onChange={(e) => setConfig({ ...config, bottomLeftX: Number(e.target.value) })}
                    className="w-full accent-primary-600 cursor-pointer h-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>垂直半轴 (Y)</span>
                    <span className="font-mono font-bold text-indigo-600">{config.bottomLeftY}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.bottomLeftY}
                    onChange={(e) => setConfig({ ...config, bottomLeftY: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5"
                  />
                </div>
              </div>
            </div>

            {/* 代码导出区 */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    原生 CSS 代码 (border-radius 8 值标准声明)
                  </label>
                  <CopyButton
                    textToCopy={cssCode}
                    label="复制 CSS"
                    copiedLabel="已复制 CSS"
                    toolId="border-radius-generator"
                  />
                </div>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto select-all">
                  {cssCode}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Tailwind CSS 任意值实用类代码
                  </label>
                  <CopyButton
                    textToCopy={tailwindCode}
                    label="复制 Tailwind"
                    copiedLabel="已复制 Tailwind"
                    toolId="border-radius-generator"
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
