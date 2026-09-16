import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { CopyButton } from '../../components/common/CopyButton'
import {
  hexToRgb,
  rgbToHex,
  isValidHex,
  formatRgb,
  parseHexParam,
  RGB,
} from '../../lib/color/conversion'
import { ArrowLeftRight, CheckCircle, AlertCircle, Sparkles, ArrowRight } from 'lucide-react'
type Mode = 'hex-to-rgb' | 'rgb-to-hex'

type HexResult =
  | { success: true; rgb: RGB; formatted: string; normalizedHex: string }
  | { success: false; error: string }

const QUICK_PRESETS = [
  { name: '天空蓝', hex: '#0ea5e9' },
  { name: '靛青蓝', hex: '#6366f1' },
  { name: '翡翠绿', hex: '#10b981' },
  { name: '落日橙', hex: '#f97316' },
  { name: '玫瑰红', hex: '#f43f5e' },
  { name: '极客暗', hex: '#0f172a' },
]

export const HexToRgb: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<Mode>('hex-to-rgb')
  const [hexInput, setHexInput] = useState('#0ea5e9')
  const [rgbInput, setRgbInput] = useState<RGB>({ r: 14, g: 165, b: 233 })

  // 支持 URL Query 参数透传
  useEffect(() => {
    const paramHex = parseHexParam(searchParams.get('hex'))
    if (paramHex) {
      setHexInput(paramHex)
      const parsed = hexToRgb(paramHex)
      if (parsed) setRgbInput(parsed)
    }
  }, [searchParams])

  // HEX -> RGB 实时换算
  const hexResult = useMemo<HexResult>(() => {
    const clean = hexInput.trim()
    const normalized = clean.startsWith('#') ? clean : `#${clean}`
    if (!isValidHex(normalized)) {
      return { success: false, error: '请输入合法的 3 位或 6 位 HEX 颜色代码（如 #0ea5e9 或 0ea5e9）' }
    }
    const rgb = hexToRgb(normalized)
    if (!rgb) return { success: false, error: '颜色解析失败' }

    return {
      success: true,
      rgb,
      formatted: formatRgb(rgb),
      normalizedHex: normalized.toLowerCase(),
    }
  }, [hexInput])

  // RGB -> HEX 实时换算
  const rgbResult = useMemo(() => {
    const hex = rgbToHex(rgbInput)
    return {
      success: true,
      hex,
      formatted: formatRgb(rgbInput),
    }
  }, [rgbInput])

  const activeColorHex: string =
    (mode === 'hex-to-rgb' && hexResult.success ? hexResult.normalizedHex : rgbResult.hex) || '#0ea5e9'

  return (
    <div className="space-y-6">
      {/* 模式切换 */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('hex-to-rgb')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'hex-to-rgb'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HEX 转 RGB (十六进制 → 十进制)
          </button>
          <button
            type="button"
            onClick={() => setMode('rgb-to-hex')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'rgb-to-hex'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RGB 转 HEX (逆向转换)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMode((m) => (m === 'hex-to-rgb' ? 'rgb-to-hex' : 'hex-to-rgb'))}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          快捷双向切换
        </button>
      </div>

      <Card className="p-6">
        {mode === 'hex-to-rgb' ? (
          <div className="space-y-6">
            {/* 输入框 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="hex-input" className="text-sm font-semibold text-slate-800">
                  输入 HEX 十六进制颜色代码
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PRESETS.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => setHexInput(p.hex)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.hex }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  id="hex-input"
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="例如：#0ea5e9 或 0ea5e9"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs"
                />
              </div>
            </div>

            {/* 换算结果卡片 */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-primary-800 flex items-center gap-1.5">
                  {hexResult.success ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      RGB 换算输出
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      格式提示
                    </>
                  )}
                </span>
                {hexResult.success && (
                  <CopyButton
                    textToCopy={hexResult.formatted}
                    label="复制 RGB"
                    copiedLabel="已复制 RGB"
                    variant="primary"
                    size="sm"
                    toolId="hex-to-rgb"
                  />
                )}
              </div>

              {hexResult.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl border border-slate-300/80 shadow-inner shrink-0 transition-colors"
                      style={{ backgroundColor: hexResult.normalizedHex }}
                    />
                    <div>
                      <div className="text-2xl font-bold font-mono text-slate-900 select-all">
                        {hexResult.formatted}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-mono">
                        R: {hexResult.rgb.r} · G: {hexResult.rgb.g} · B: {hexResult.rgb.b}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary-100">
                    <div className="bg-white p-2.5 rounded-lg border border-primary-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">R (红色通道)</span>
                      <span className="text-lg font-bold font-mono text-slate-800">{hexResult.rgb.r}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-primary-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">G (绿色通道)</span>
                      <span className="text-lg font-bold font-mono text-slate-800">{hexResult.rgb.g}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-primary-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">B (蓝色通道)</span>
                      <span className="text-lg font-bold font-mono text-slate-800">{hexResult.rgb.b}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-red-600 py-2">{hexResult.error}</p>
              )}
            </div>
          </div>
        ) : (
          /* RGB -> HEX 逆向转换 */
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-800 mb-2 block">
                调节 RGB 三原色通道数值 (0 ~ 255)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">R (红)</span>
                    <span className="font-mono text-slate-500">{rgbInput.r}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbInput.r}
                    onChange={(e) => setRgbInput({ ...rgbInput, r: Number(e.target.value) })}
                    className="w-full accent-primary-600 cursor-pointer"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">G (绿)</span>
                    <span className="font-mono text-slate-500">{rgbInput.g}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbInput.g}
                    onChange={(e) => setRgbInput({ ...rgbInput, g: Number(e.target.value) })}
                    className="w-full accent-primary-600 cursor-pointer"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">B (蓝)</span>
                    <span className="font-mono text-slate-500">{rgbInput.b}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbInput.b}
                    onChange={(e) => setRgbInput({ ...rgbInput, b: Number(e.target.value) })}
                    className="w-full accent-primary-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl border border-slate-300/80 shadow-inner shrink-0"
                  style={{ backgroundColor: rgbResult.hex }}
                />
                <div>
                  <span className="text-xs font-bold uppercase text-primary-800 block">HEX 换算输出</span>
                  <span className="text-2xl font-bold font-mono text-slate-900 select-all">
                    {rgbResult.hex}
                  </span>
                </div>
              </div>

              <CopyButton
                textToCopy={rgbResult.hex}
                label="复制 HEX"
                copiedLabel="已复制 HEX"
                variant="primary"
                size="sm"
                toolId="hex-to-rgb"
              />
            </div>
          </div>
        )}

        {/* 跨工具一键流转协同面板 */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            已解析有效颜色：<span className="font-mono font-bold text-slate-800">{activeColorHex}</span>
          </span>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/tools/css/gradient-generator?from=${activeColorHex.replace('#', '')}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-800 font-medium transition-all group"
            >
              以此色调配渐变
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to={`/tools/css/box-shadow-generator?color=${activeColorHex.replace('#', '')}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-800 font-medium transition-all group"
            >
              以此色生成阴影
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to={`/tools/color/color-picker?hex=${activeColorHex.replace('#', '')}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 text-slate-700 hover:text-primary-800 font-medium transition-all group"
            >
              深度拾色与吸色器
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
