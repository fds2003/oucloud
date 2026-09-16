import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { CopyButton } from '../../components/common/CopyButton'
import { CrossToolLinks } from '../../components/common/CrossToolLinks'
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  formatRgb,
  formatHsl,
  isValidHex,
  getContrastRatio,
  getColorHarmonies,
  parseHexParam,
  RGB,
  HSL,
} from '../../lib/color/conversion'
import { Pipette, CheckCircle, Sparkles, Camera } from 'lucide-react'
import { generateShareCardBlob, formatShareCardFilename } from '../../lib/image/shareCard'
import { downloadBlob } from '../../lib/browser'
const PRESET_COLORS = [
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#64748b',
  '#0f172a',
  '#ffffff',
  '#000000',
]

export const ColorPicker: React.FC = () => {
  const [hex, setHex] = useState('#0ea5e9')
  const [rgb, setRgb] = useState<RGB>({ r: 14, g: 165, b: 233 })
  const [hsl, setHsl] = useState<HSL>({ h: 199, s: 89, l: 48 })
  const updateFromHex = (newHex: string) => {
    setHex(newHex)
    if (isValidHex(newHex)) {
      const parsedRgb = hexToRgb(newHex)
      if (parsedRgb) {
        setRgb(parsedRgb)
        setHsl(rgbToHsl(parsedRgb))
      }
    }
  }

  const updateFromRgb = (newRgb: RGB) => {
    setRgb(newRgb)
    const newHex = rgbToHex(newRgb)
    setHex(newHex)
    setHsl(rgbToHsl(newRgb))
  }

  const updateFromHsl = (newHsl: HSL) => {
    setHsl(newHsl)
    const newRgb = hslToRgb(newHsl)
    setRgb(newRgb)
    setHex(rgbToHex(newRgb))
  }

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const paramHex = parseHexParam(searchParams.get('hex'))
    if (paramHex) {
      updateFromHex(paramHex)
    }
  }, [searchParams])

  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false)

  useEffect(() => {
    setIsEyeDropperSupported('EyeDropper' in window)
  }, [])
  const handleEyeDropper = async () => {
    try {
      const win = window as unknown as {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
      }
      if (win.EyeDropper) {
        const eyeDropper = new win.EyeDropper()
        const result = await eyeDropper.open()
        if (result && typeof result.sRGBHex === 'string') {
          updateFromHex(result.sRGBHex)
        }
      }
    } catch {
      // 用户取消吸色或平台不支持，安全忽略
    }
  }

  // WCAG 对比度计算
  const contrastData = useMemo(() => {
    const blackRgb: RGB = { r: 0, g: 0, b: 0 }
    const whiteRgb: RGB = { r: 255, g: 255, b: 255 }
    const ratioBlack = getContrastRatio(rgb, blackRgb)
    const ratioWhite = getContrastRatio(rgb, whiteRgb)

    const bestText = ratioBlack >= ratioWhite ? 'black' : 'white'
    const bestRatio = Math.max(ratioBlack, ratioWhite)

    return {
      ratioBlack: Number(ratioBlack.toFixed(2)),
      ratioWhite: Number(ratioWhite.toFixed(2)),
      bestText,
      bestRatio: Number(bestRatio.toFixed(2)),
      isNormalAa: bestRatio >= 4.5,
      isLargeAa: bestRatio >= 3.0,
      isAaa: bestRatio >= 7.0,
    }
  }, [rgb])

  // 配色方案推荐
  const harmonies = useMemo(() => {
    return getColorHarmonies(hsl)
  }, [hsl])


  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧：调色板与大预览 */}
          <div className="space-y-4">
            <div
              className="w-full h-44 rounded-xl border border-slate-200/80 shadow-inner transition-colors duration-150 flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: isValidHex(hex) ? hex : '#ffffff' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              <input
                type="color"
                value={isValidHex(hex) ? hex : '#0ea5e9'}
                onChange={(e) => updateFromHex(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="点击选择颜色"
              />
              <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow pointer-events-none">
                点击此处直接拾取颜色
              </span>
              {isEyeDropperSupported && (
                <button
                  type="button"
                  onClick={handleEyeDropper}
                  className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md backdrop-blur transition-all"
                  title="从屏幕任意位置直接吸取颜色"
                >
                  <Pipette className="w-3.5 h-3.5 text-sky-400" />
                  屏幕吸色
                </button>
              )}
            </div>

            {/* 常用预设色卡 */}
            <div>
              <span className="text-xs font-semibold text-slate-500 mb-2 block">
                常用设计预设色彩
              </span>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateFromHex(c)}
                    className="w-full aspect-square rounded-md border border-slate-200 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ backgroundColor: c }}
                    title={c}
                    aria-label={`选择颜色 ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：数值控制与一键复制 */}
          <div className="space-y-4">
            {/* HEX */}
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">HEX 色值</label>
                <CopyButton textToCopy={hex} size="sm" />
              </div>
              <input
                type="text"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                placeholder="#0ea5e9"
                aria-label="HEX 十六进制色值"
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* RGB */}
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">RGB 色值</label>
                <CopyButton textToCopy={formatRgb(rgb)} size="sm" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">R (红)</span>
                  <input
                    type="number"
                    aria-label="红色通道 R 数值 (0-255)"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => updateFromRgb({ ...rgb, r: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">G (绿)</span>
                  <input
                    type="number"
                    aria-label="绿色通道 G 数值 (0-255)"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => updateFromRgb({ ...rgb, g: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">B (蓝)</span>
                  <input
                    type="number"
                    aria-label="蓝色通道 B 数值 (0-255)"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => updateFromRgb({ ...rgb, b: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* HSL */}
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">HSL 色值</label>
                <CopyButton textToCopy={formatHsl(hsl)} size="sm" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">H (色相 °)</span>
                  <input
                    type="number"
                    aria-label="色相 H 数值 (0-360)"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => updateFromHsl({ ...hsl, h: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">S (饱和度 %)</span>
                  <input
                    type="number"
                    aria-label="饱和度 S 数值 (0-100)"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => updateFromHsl({ ...hsl, s: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">L (亮度 %)</span>
                  <input
                    type="number"
                    aria-label="亮度 L 数值 (0-100)"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => updateFromHsl({ ...hsl, l: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 跨工具协同跳转 */}
            <div className="pt-2">
              <CrossToolLinks
                links={[
                  { to: `/tools/css/gradient-generator?from=${hex.replace('#', '')}`, label: '以此色调配 CSS 渐变' },
                  { to: `/tools/css/box-shadow-generator?color=${hex.replace('#', '')}`, label: '以此色生成软阴影' },
                ]}
              />
            {/* 导出设计参数卡片 */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const blob = await generateShareCardBlob({
                    title: '色彩设计参数卡',
                    subtitle: `HEX: ${hex} · RGB: ${formatRgb(rgb)} · HSL: ${formatHsl(hsl)}`,
                    category: '在线颜色拾取器',
                    primaryColor: hex,
                    secondaryColor: harmonies.complementary,
                    codeSnippet: `--brand-primary: ${hex};\n--brand-complementary: ${harmonies.complementary};`,
                  })
                  downloadBlob(blob, formatShareCardFilename('color-picker'))
                }}
                className="w-full gap-2 text-xs border-slate-300"
              >
                <Camera className="w-3.5 h-3.5 text-primary-600" />
                导出色彩设计参数卡 (PNG)
              </Button>
            </div>
            </div>
          </div>
        </div>
      </Card>

      {/* WCAG 2.1 文本对比度与配色方案增强卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WCAG 对比度与可读性卡片 */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-primary-600" />
              WCAG 2.1 文本对比度与可读性
            </h3>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                contrastData.isNormalAa
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {contrastData.isAaa ? 'AAA 极致可读' : contrastData.isNormalAa ? 'AA 标准合规' : '对比度偏低'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <span className="text-xs text-slate-500 font-medium">搭配纯黑文字 (#000000)</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {contrastData.ratioBlack} : 1
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {contrastData.ratioBlack >= 4.5 ? '通过 AA' : contrastData.ratioBlack >= 3 ? '仅大字' : '未通过'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <span className="text-xs text-slate-500 font-medium">搭配纯白文字 (#FFFFFF)</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {contrastData.ratioWhite} : 1
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {contrastData.ratioWhite >= 4.5 ? '通过 AA' : contrastData.ratioWhite >= 3 ? '仅大字' : '未通过'}
                </span>
              </div>
            </div>
          </div>

          {/* 实时效果呈现 */}
          <div
            className="p-4 rounded-xl border border-slate-200 transition-colors flex items-center justify-between"
            style={{ backgroundColor: isValidHex(hex) ? hex : '#ffffff' }}
          >
            <div
              className="text-sm font-semibold transition-colors"
              style={{ color: contrastData.bestText === 'black' ? '#000000' : '#ffffff' }}
            >
              可读性预览：推荐搭配{contrastData.bestText === 'black' ? '深色/黑色' : '浅色/白色'}文字
            </div>
            <span
              className="text-xs px-2 py-1 rounded shadow-sm font-medium"
              style={{
                backgroundColor: contrastData.bestText === 'black' ? '#000000' : '#ffffff',
                color: contrastData.bestText === 'black' ? '#ffffff' : '#000000',
              }}
            >
              示例按钮
            </span>
          </div>
        </Card>

        {/* 智能配色方案推荐卡片 */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              智能配色推荐 (点击切换)
            </h3>
            <span className="text-xs text-slate-400">基于色彩空间自动计算</span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">
                互补色 (Complementary)
              </span>
              <button
                type="button"
                onClick={() => updateFromHex(harmonies.complementary)}
                className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-primary-400 bg-white shadow-sm transition-all w-full text-left group"
              >
                <div
                  className="w-6 h-6 rounded-md shrink-0 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: harmonies.complementary }}
                />
                <span className="text-xs font-mono font-medium text-slate-800">
                  {harmonies.complementary}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-primary-600 ml-auto">
                  应用此色 →
                </span>
              </button>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">
                类似色 (Analogous)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {harmonies.analogous.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateFromHex(c)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-primary-400 bg-white shadow-sm transition-all text-left group"
                  >
                    <div
                      className="w-5 h-5 rounded-md shrink-0 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                    <span className="text-xs font-mono font-medium text-slate-800 truncate">{c}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-600 mb-1.5 block">
                三角色 (Triadic)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {harmonies.triadic.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateFromHex(c)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-primary-400 bg-white shadow-sm transition-all text-left group"
                  >
                    <div
                      className="w-5 h-5 rounded-md shrink-0 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                    <span className="text-xs font-mono font-medium text-slate-800 truncate">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
