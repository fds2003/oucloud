import React, { useState, useRef, useMemo } from 'react'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { CopyButton } from '../../components/common/CopyButton'
import {
  TextFaviconConfig,
  FaviconShape,
  POPULAR_EMOJIS,
  PRESET_TEXT_FAVICONS,
  generateTextFaviconSvg,
  drawTextFaviconToCanvas,
} from '../../lib/image/textFavicon'
import { convertImageToIcoBlob } from '../../lib/image/favicon'
import { downloadBlob } from '../../lib/browser'
import { trackEvent } from '../../lib/analytics'
import { Download, Sparkles, Layers, FileCode2, Loader2, CheckCircle } from 'lucide-react'

const COLOR_PRESETS = [
  '#0ea5e9',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#10b981',
  '#0f172a',
  '#ffffff',
]

export const TextToFavicon: React.FC = () => {
  const [config, setConfig] = useState<TextFaviconConfig>({
    text: '🚀',
    textColor: '#ffffff',
    backgroundColor: '#0ea5e9',
    shape: 'rounded',
    borderRadiusPercent: 22,
    fontSizeRatio: 0.65,
    fontFamily: 'sans-serif',
  })

  const [isExportingIco, setIsExportingIco] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const svgString = useMemo(() => generateTextFaviconSvg(config, 64), [config])
  const svgDataUrl = useMemo(() => `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`, [svgString])

  // 渲染并导出真实 .ico 二进制文件
  const handleDownloadIco = async () => {
    try {
      setIsExportingIco(true)
      trackEvent('tool_start', { toolId: 'text-to-favicon' })

      const exportCanvas = document.createElement('canvas')
      drawTextFaviconToCanvas(exportCanvas, config, 256)

      const img = new Image()
      img.onload = async () => {
        try {
          const icoBlob = await convertImageToIcoBlob(img, [16, 32, 48])
          downloadBlob(icoBlob, 'favicon.ico')
          trackEvent('tool_download', { toolId: 'text-to-favicon' })
        } catch {
          // 导出异常保护
        } finally {
          setIsExportingIco(false)
        }
      }
      img.src = exportCanvas.toDataURL('image/png')
    } catch {
      setIsExportingIco(false)
    }
  }

  // 导出高清 512x512 PNG
  const handleDownloadPng = () => {
    const exportCanvas = document.createElement('canvas')
    drawTextFaviconToCanvas(exportCanvas, config, 512)
    exportCanvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, 'favicon-512x512.png')
        trackEvent('tool_download', { toolId: 'text-to-favicon' })
      }
    }, 'image/png')
  }

  // 导出矢量 SVG 文件
  const handleDownloadSvg = () => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    downloadBlob(blob, 'favicon.svg')
    trackEvent('tool_download', { toolId: 'text-to-favicon' })
  }

  const htmlLinkSnippet = `<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n<link rel="shortcut icon" href="/favicon.ico">`

  return (
    <div className="space-y-6">
      {/* 离屏隐藏 Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：实时拟真预览与各设备尺寸 */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 mb-3 block">
                Favicon 实时尺寸微缩效果
              </span>
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-around">
                {/* 64px */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
                    <img src={svgDataUrl} alt="64x64" className="w-16 h-16 object-contain" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">64x64 (标清)</span>
                </div>

                {/* 32px */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded overflow-hidden shadow-xs flex items-center justify-center">
                    <img src={svgDataUrl} alt="32x32" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">32x32 (书签)</span>
                </div>

                {/* 16px */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-4 h-4 rounded-xs overflow-hidden flex items-center justify-center">
                    <img src={svgDataUrl} alt="16x16" className="w-4 h-4 object-contain" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">16x16 (Tab)</span>
                </div>
              </div>
            </div>

            {/* 拟真浏览器标签栏预览 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                浏览器标签栏真实效果模拟
              </span>
              <div className="space-y-2">
                {/* 浅色标签页 */}
                <div className="flex items-center gap-2 bg-slate-200 p-2 rounded-t-xl">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-t-lg shadow-xs max-w-xs">
                    <img src={svgDataUrl} alt="Tab icon" className="w-4 h-4 object-contain" />
                    <span className="text-xs font-medium text-slate-800 truncate">我的新项目 - 浅色标签</span>
                  </div>
                </div>
                {/* 深色标签页 */}
                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-b-xl">
                  <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-t-lg shadow-xs max-w-xs border border-slate-700/60">
                    <img src={svgDataUrl} alt="Tab icon" className="w-4 h-4 object-contain" />
                    <span className="text-xs font-medium text-slate-200 truncate">我的新项目 - 暗色标签</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 高颜值预设方案 */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 mb-2.5 block">
                精选预设模板 (一键套用)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_TEXT_FAVICONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setConfig(preset.config)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-primary-400 bg-white shadow-2xs hover:shadow-xs text-left transition-all group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-inner shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: preset.config.backgroundColor, color: preset.config.textColor }}
                    >
                      {preset.config.text}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-primary-600">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：参数微调面板与导出 */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary-600" />
                图标参数配置
              </span>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 纯前端实时合成
              </span>
            </div>

            {/* 核心字符 / Emoji 输入 */}
            <div className="space-y-2">
              <label htmlFor="char-input" className="text-xs font-bold uppercase text-slate-600">
                图标核心文字或 Emoji
              </label>
              <div className="flex gap-3">
                <input
                  id="char-input"
                  type="text"
                  maxLength={2}
                  value={config.text}
                  onChange={(e) => setConfig({ ...config, text: e.target.value })}
                  placeholder="输入 1 个汉字或 Emoji"
                  className="w-28 text-center text-2xl font-bold py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs"
                />
                <div className="flex-1 flex flex-wrap gap-1.5 p-2 bg-slate-50/80 border border-slate-200 rounded-xl items-center">
                  <span className="text-[11px] text-slate-400 mr-1">快捷选择：</span>
                  {POPULAR_EMOJIS.slice(0, 10).map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setConfig({ ...config, text: emoji })}
                      className="text-base hover:scale-125 transition-transform p-1 rounded hover:bg-white shadow-2xs"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 容器形状选择 */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-600 block">图标容器形状</span>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { shape: 'rounded' as FaviconShape, label: '圆角矩形 (推荐)' },
                    { shape: 'circle' as FaviconShape, label: '正圆形 (Circle)' },
                    { shape: 'square' as FaviconShape, label: '正方形 (Square)' },
                  ]
                ).map((item) => (
                  <button
                    key={item.shape}
                    type="button"
                    onClick={() => setConfig({ ...config, shape: item.shape })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      config.shape === item.shape
                        ? 'border-primary-600 bg-primary-50/60 text-primary-800 ring-2 ring-primary-500/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 背景颜色与文字颜色 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">图标底色 (Background)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={config.backgroundColor}
                    onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                    className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono"
                  />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {COLOR_PRESETS.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setConfig({ ...config, backgroundColor: c })}
                      className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">文字颜色 (Text Color)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={config.textColor}
                    onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                    className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono"
                  />
                </div>
                <div className="flex gap-2 pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, textColor: '#ffffff' })}
                    className="px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-700"
                  >
                    纯白文本
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, textColor: '#0f172a' })}
                    className="px-2 py-0.5 rounded border border-slate-200 bg-slate-900 text-white"
                  >
                    暗黑文本
                  </button>
                </div>
              </div>
            </div>

            {/* 导出按钮操作区 */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase text-slate-500 block">一键导出图标产物</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Button
                  onClick={handleDownloadIco}
                  disabled={isExportingIco}
                  className="gap-1.5 shadow-sm"
                  size="md"
                >
                  {isExportingIco ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  下载 favicon.ico
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadPng}
                  className="gap-1.5 border-slate-300"
                  size="md"
                >
                  <Download className="w-4 h-4" />
                  下载 PNG (512x512)
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadSvg}
                  className="gap-1.5 border-slate-300"
                  size="md"
                >
                  <Download className="w-4 h-4" />
                  下载矢量 SVG
                </Button>
              </div>
            </div>

            {/* HTML 引入代码 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                  <FileCode2 className="w-3.5 h-3.5" />
                  HTML 头部标准引用代码
                </label>
                <CopyButton
                  textToCopy={htmlLinkSnippet}
                  label="复制代码"
                  copiedLabel="已复制"
                  toolId="text-to-favicon"
                />
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono overflow-x-auto select-all leading-relaxed">
                {htmlLinkSnippet}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
