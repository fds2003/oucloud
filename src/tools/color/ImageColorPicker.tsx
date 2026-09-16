import React, { useState, useRef, useEffect } from 'react'
import { Card } from '../../components/common/Card'
import { CopyButton } from '../../components/common/CopyButton'
import { FileDropzone } from '../../components/common/FileDropzone'
import { CrossToolLinks } from '../../components/common/CrossToolLinks'
import { readFileAsDataURL } from '../../lib/browser'
import { trackEvent } from '../../lib/analytics'
import {
  extractPaletteFromPixels,
  samplePixelColor,
  PaletteColor,
  PixelSample,
} from '../../lib/color/imagePalette'
import { Pipette, Sparkles, CheckCircle, Palette, MousePointer, Copy } from 'lucide-react'
import { copyToClipboard } from '../../lib/browser'

// 内置两张精美的极简纯前端示例位图 (纯 SVG DataURL，无需外部网络请求)
const DEMO_IMAGES = [
  {
    name: '落日晚霞 (Sunset Gradient)',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff7e5f"/><stop offset="50%" stop-color="%23feb47b"/><stop offset="100%" stop-color="%236a11cb"/></linearGradient></defs><rect width="600" height="360" fill="url(%23g)"/><circle cx="480" cy="100" r="50" fill="%23ffffff" opacity="0.8"/></svg>',
  },
  {
    name: '深邃极光 (Aurora Teal)',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360"><defs><linearGradient id="a" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%230ea5e9"/><stop offset="100%" stop-color="%2310b981"/></linearGradient></defs><rect width="600" height="360" fill="url(%23a)"/><polygon points="100,300 250,150 400,320" fill="%23064e3b" opacity="0.6"/></svg>',
  },
]

export const ImageColorPicker: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [palette, setPalette] = useState<PaletteColor[]>([])
  const [hoveredColor, setHoveredColor] = useState<PixelSample | null>(null)
  const [selectedColor, setSelectedColor] = useState<PixelSample>({
    hex: '#0ea5e9',
    rgb: { r: 14, g: 165, b: 233 },
    hsl: { h: 199, s: 89, l: 48 },
  })
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const pixelDataRef = useRef<{
    pixels: Uint8ClampedArray
    width: number
    height: number
  } | null>(null)

  const processImageSrc = (src: string) => {
    setErrorMessage(null)
    setImageSrc(src)
    trackEvent('tool_start', { toolId: 'image-color-picker' })

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      // 限制最大计算尺寸以兼顾极致流畅度与提取精度
      const maxDim = 800
      let w = img.width
      let h = img.height
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w)
          w = maxDim
        } else {
          w = Math.round((w * maxDim) / h)
          h = maxDim
        }
      }

      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      ctx.drawImage(img, 0, 0, w, h)
      const imgData = ctx.getImageData(0, 0, w, h)
      pixelDataRef.current = {
        pixels: imgData.data,
        width: w,
        height: h,
      }

      // 提取核心 6 色调色板
      const extracted = extractPaletteFromPixels(imgData.data, w * h, 6)
      setPalette(extracted)
      if (extracted[0]) {
        setSelectedColor({
          hex: extracted[0].hex,
          rgb: extracted[0].rgb,
          hsl: extracted[0].hsl,
        })
      }
    }
    img.src = src
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('请选择有效的图片文件 (PNG, JPG, WebP, SVG)')
      return
    }

    try {
      const src = await readFileAsDataURL(file)
      processImageSrc(src)
    } catch {
      setErrorMessage('读取图片失败，请重试')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current
    const data = pixelDataRef.current
    if (!container || !data) return

    const rect = container.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    // 换算到 canvas 原始像素坐标
    const scaleX = data.width / rect.width
    const scaleY = data.height / rect.height
    const canvasX = Math.floor(clientX * scaleX)
    const canvasY = Math.floor(clientY * scaleY)

    const sample = samplePixelColor(data.pixels, data.width, data.height, canvasX, canvasY)
    if (sample) {
      setHoveredColor(sample)
      setMousePos({ x: clientX, y: clientY })
    }
  }

  const handleMouseLeave = () => {
    setMousePos(null)
    setHoveredColor(null)
  }

  const handleClickImage = () => {
    if (hoveredColor) {
      setSelectedColor(hoveredColor)
      trackEvent('tool_complete', { toolId: 'image-color-picker' })
    }
  }

  const handleCopyAllPalette = async () => {
    if (palette.length === 0) return
    const hexList = palette.map((p) => p.hex).join(', ')
    // 统一走 copyToClipboard：自带 execCommand 降级，非 HTTPS/权限拒绝场景仍可复制；
    // 直接调 navigator.clipboard 在无权限时静默失败且报错到控制台。
    const success = await copyToClipboard(hexList)
    if (success) {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    }
  }

  // 默认加载第一张示例图，保证即刻有交互演示
  // 默认首次挂载时加载第一张示例图，提供即刻交互演示
  useEffect(() => {
    processImageSrc(DEMO_IMAGES[0].dataUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="space-y-6">
      {/* 离屏用于高频像素读取的 Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <Card className="p-6">
        <div className="space-y-6">
          {/* 上传拖拽区与预设试用 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex-1">
              <FileDropzone
                onFileSelect={handleFileSelect}
                title="点击上传图片 或 拖拽文件至此处"
                subtitle="支持 PNG, JPG, WebP, SVG。纯浏览器内存解析，绝不上传到服务器"
              />
            </div>
          </div>

          {/* 示例预设快速体验 */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">或者试用预设样例：</span>
            {DEMO_IMAGES.map((demo) => (
              <button
                key={demo.name}
                type="button"
                onClick={() => processImageSrc(demo.dataUrl)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-medium transition-all shadow-2xs"
              >
                {demo.name}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* 主工作区：左侧图片十字吸色，右侧色彩与调色板 */}
          {imageSrc && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              {/* 图片取色画布交互容器 (7列) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <MousePointer className="w-4 h-4 text-primary-600" />
                    移动鼠标吸色，点击选定颜色
                  </span>
                  {hoveredColor && (
                    <span className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300"
                        style={{ backgroundColor: hoveredColor.hex }}
                      />
                      当前悬停：{hoveredColor.hex}
                    </span>
                  )}
                </div>

                <div
                  ref={imageContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClickImage}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center cursor-crosshair select-none shadow-inner max-h-[460px]"
                >
                  <img
                    src={imageSrc}
                    alt="待取色图片"
                    className="w-full h-auto max-h-[460px] object-contain block"
                  />

                  {/* 悬停微型放大镜 (Loupe) */}
                  {mousePos && hoveredColor && (
                    <div
                      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xl flex items-center justify-center overflow-hidden"
                      style={{
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                        width: '56px',
                        height: '56px',
                        backgroundColor: hoveredColor.hex,
                      }}
                    >
                      <div className="w-2 h-2 rounded-full border border-white/80 bg-black/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧：当前选定颜色与 6 色调色板 (5列) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 选定颜色卡片 */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                      <Pipette className="w-4 h-4 text-primary-600" />
                      当前选定色彩
                    </span>
                    <CopyButton
                      textToCopy={selectedColor.hex}
                      label="复制 HEX"
                      copiedLabel="已复制 HEX"
                      toolId="image-color-picker"
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl border border-slate-300/80 shadow-md shrink-0 transition-colors"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                    <div className="space-y-1 text-xs font-mono">
                      <div className="text-base font-bold text-slate-900">{selectedColor.hex}</div>
                      <div className="text-slate-600">
                        rgb({selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b})
                      </div>
                      <div className="text-slate-500">
                        hsl({selectedColor.hsl.h}, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 智能提取调色板 (6色) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-primary-600" />
                        图片核心调色板 (Top 6)
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">点击任一色卡直接选定</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAllPalette}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-primary-600 transition-colors px-2 py-1 rounded bg-slate-100 hover:bg-slate-200/80"
                      title="一键复制全部色值"
                    >
                      {copiedAll ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          已复制全套
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          复制全套
                        </>
                      )}
                    </button>
                  </div>

                  {palette.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      上传图片后自动提取核心色调
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {palette.map((item) => (
                        <button
                          key={item.hex}
                          type="button"
                          onClick={() => setSelectedColor(item)}
                          className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-all group ${
                            selectedColor.hex === item.hex
                              ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div
                            className="w-full aspect-square rounded-lg border border-slate-200 shadow-inner group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="text-[11px] font-mono font-semibold text-slate-800 mt-1.5 truncate">
                            {item.hex}
                          </span>
                          <span className="text-[9px] text-slate-400">{item.percentage}%</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      色彩聚类智能算法支持
                    </span>
                    <span>100% 纯本地隐私安全</span>
                  </div>

                {/* 跨工具一键流转协同面板 */}
                <CrossToolLinks
                  variant="grid"
                  links={[
                    ...(palette.length >= 2
                      ? [{ to: `/tools/css/gradient-generator?from=${palette[0].hex.replace('#', '')}&to=${palette[1].hex.replace('#', '')}`, label: '以提取双色生成渐变' }]
                      : []),
                    { to: `/tools/css/box-shadow-generator?color=${selectedColor.hex.replace('#', '')}`, label: '以选定色调配软阴影' },
                    { to: `/tools/color/color-picker?hex=${selectedColor.hex.replace('#', '')}`, label: '以此色深入微调与 WCAG 文本对比度检测' },
                  ]}
                />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
