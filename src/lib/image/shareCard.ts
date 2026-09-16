/**
 * 纯前端 Canvas 社交分享卡片 (OG Social Card / 海报) 生成引擎
 */

export interface ShareCardOptions {
  title: string
  subtitle?: string
  category: string
  primaryColor?: string
  secondaryColor?: string
  codeSnippet?: string
  width?: number
  height?: number
}

export function formatShareCardFilename(toolSlug: string): string {
  const clean = toolSlug.replace(/[^a-z0-9_-]/gi, '').toLowerCase()
  return `oucloud-${clean || 'tool'}-card.png`
}

/**
 * 绘制高颜值设计参数卡片至 HTML5 Canvas
 */
export function drawShareCardToCanvas(
  canvas: HTMLCanvasElement,
  options: ShareCardOptions
): void {
  const width = options.width || 1200
  const height = options.height || 630
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const primary = options.primaryColor || '#0ea5e9'
  const secondary = options.secondaryColor || '#6366f1'

  // 1. 深色极客背景
  ctx.fillStyle = '#0b0f19'
  ctx.fillRect(0, 0, width, height)

  // 2. 顶部与角落环境光晕 (Ambient Glow)
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, primary)
  grad.addColorStop(1, secondary)

  // 3. 绘制上方装饰光斑
  ctx.save()
  ctx.globalAlpha = 0.25
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(width * 0.8, height * 0.2, 220, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 4. 左侧内容排版
  // 分类胶囊标签
  ctx.save()
  ctx.fillStyle = primary
  ctx.globalAlpha = 0.15
  ctx.beginPath()
  ctx.roundRect(80, 80, 160, 36, 18)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = primary
  ctx.font = 'bold 16px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(options.category, 160, 98)

  // 主标题
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 52px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(options.title, 80, 140)

  // 副标题
  if (options.subtitle) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = '22px sans-serif'
    ctx.fillText(options.subtitle, 80, 210)
  }

  // 5. 核心参数代码展示容器
  if (options.codeSnippet) {
    ctx.save()
    ctx.fillStyle = '#161e2e'
    ctx.strokeStyle = '#2d3748'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(80, 270, width - 160, 160, 20)
    ctx.fill()
    ctx.stroke()

    // 终端红黄绿三圆点
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(115, 305, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#eab308'
    ctx.beginPath()
    ctx.arc(135, 305, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(155, 305, 6, 0, Math.PI * 2)
    ctx.fill()

    // 代码文本
    ctx.fillStyle = '#38bdf8'
    ctx.font = '22px monospace'
    ctx.fillText(options.codeSnippet, 115, 345)
    ctx.restore()
  }

  // 6. 底部品牌标签与水印
  ctx.fillStyle = '#475569'
  ctx.font = 'bold 18px sans-serif'
  ctx.fillText('OUCloud.cn · 极简高效 零后端传输在线工具平台', 80, height - 70)

  // 右下角彩色品牌徽标
  ctx.save()
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.roundRect(width - 240, height - 85, 160, 32, 16)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('⚡ 纯前端本地驱动', width - 160, height - 69)
  ctx.restore()
}

/**
 * 导出 Canvas 为图像 Blob
 */
export function generateShareCardBlob(options: ShareCardOptions): Promise<Blob> {
  const canvas = document.createElement('canvas')
  drawShareCardToCanvas(canvas, options)

  // 运行时特性探测：老内核走传统 new Promise 兜底。TS 的 lib 目标较低，
  // 用映射类型绕开类型层缺失声明，但保留运行时真实签名。
  const withResolvers = (
    Promise as PromiseConstructor & { withResolvers?: <T>() => { promise: Promise<T>; resolve: (v: T) => void; reject: (e: unknown) => void } }
  ).withResolvers?.bind(Promise)

  if (withResolvers) {
    const { promise, resolve, reject } = withResolvers<Blob>()
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export to blob failed'))
    }, 'image/png')
    return promise
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export to blob failed'))
    }, 'image/png')
  })
}
