/**
 * 纯文本 / Emoji 生成 Favicon 渲染引擎
 */

export type FaviconShape = 'square' | 'rounded' | 'circle'

export interface TextFaviconConfig {
  text: string
  textColor: string
  backgroundColor: string
  shape: FaviconShape
  borderRadiusPercent: number
  fontSizeRatio: number
  fontFamily: string
}

export interface TextFaviconPreset {
  name: string
  description: string
  config: TextFaviconConfig
}

/**
 * 常用热门开发者与产品 Emoji 集合
 */
export const POPULAR_EMOJIS: string[] = [
  '🚀',
  '⚡',
  '💡',
  '🛠️',
  '✨',
  '🔥',
  '🎯',
  '🌐',
  '📊',
  '🛡️',
  '📦',
  '💻',
  '🎨',
  '🌟',
  '⚙️',
  '🤖',
]

/**
 * 将配置渲染为标准可缩放 SVG 字符串（可直接用于 SVG DataURL 或 <link> 标签）
 */
export function generateTextFaviconSvg(config: TextFaviconConfig, size = 64): string {
  const fontSize = Math.round(size * config.fontSizeRatio)
  let shapeMarkup = ''

  if (config.shape === 'circle') {
    const radius = size / 2
    shapeMarkup = `<circle cx="${radius}" cy="${radius}" r="${radius}" fill="${config.backgroundColor}" />`
  } else if (config.shape === 'rounded') {
    const rx = Math.round((size * config.borderRadiusPercent) / 100)
    shapeMarkup = `<rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="${config.backgroundColor}" />`
  } else {
    shapeMarkup = `<rect width="${size}" height="${size}" fill="${config.backgroundColor}" />`
  }

  // 为防止 XML 特殊字符破坏 SVG 结构做转义
  const safeText = config.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${shapeMarkup}
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="central" font-family="${config.fontFamily}" font-size="${fontSize}" fill="${config.textColor}">
    ${safeText}
  </text>
</svg>`
}

/**
 * 将文本/Emoji 绘制至 HTML5 Canvas
 */
export function drawTextFaviconToCanvas(
  canvas: HTMLCanvasElement,
  config: TextFaviconConfig,
  size: number
): void {
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, size, size)

  // 1. 绘制背景图形
  ctx.fillStyle = config.backgroundColor
  if (config.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  } else if (config.shape === 'rounded') {
    const radius = (size * config.borderRadiusPercent) / 100
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, radius)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.fillRect(0, 0, size, size)
  }

  // 2. 绘制居中文字或 Emoji
  const fontSize = Math.round(size * config.fontSizeRatio)
  ctx.font = `${fontSize}px ${config.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = config.textColor
  // 垂直微调 53% 以获得视觉平衡居中
  ctx.fillText(config.text, size / 2, size * 0.53)
}

/**
 * 精选热门预设方案
 */
export const PRESET_TEXT_FAVICONS: TextFaviconPreset[] = [
  {
    name: '极速火箭 (Rocket)',
    description: '科技创投、SaaS 启动产品经典代表',
    config: {
      text: '🚀',
      textColor: '#ffffff',
      backgroundColor: '#0ea5e9',
      shape: 'rounded',
      borderRadiusPercent: 22,
      fontSizeRatio: 0.65,
      fontFamily: 'sans-serif',
    },
  },
  {
    name: '极速闪电 (Speed)',
    description: '强调高效、快速、轻量化工具平台',
    config: {
      text: '⚡',
      textColor: '#ffffff',
      backgroundColor: '#f59e0b',
      shape: 'rounded',
      borderRadiusPercent: 22,
      fontSizeRatio: 0.65,
      fontFamily: 'sans-serif',
    },
  },
  {
    name: '极客终端 (Terminal)',
    description: '开发者工具、黑客与程序员风格',
    config: {
      text: '💻',
      textColor: '#ffffff',
      backgroundColor: '#0f172a',
      shape: 'rounded',
      borderRadiusPercent: 22,
      fontSizeRatio: 0.65,
      fontFamily: 'sans-serif',
    },
  },
  {
    name: '品牌字标 (Monogram)',
    description: '以核心字首作为极简品牌 Logo',
    config: {
      text: '云',
      textColor: '#ffffff',
      backgroundColor: '#6366f1',
      shape: 'rounded',
      borderRadiusPercent: 22,
      fontSizeRatio: 0.65,
      fontFamily: 'sans-serif',
    },
  },
]
