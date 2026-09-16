import { hexToRgb } from '../color/conversion'

export interface ShadowConfig {
  layers: number
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export interface ShadowLayer {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export interface ShadowPreset {
  name: string
  description: string
  config: ShadowConfig
}

/**
 * 将十六进制颜色和透明度转换为 rgba(...) 字符串
 */
function toRgbaString(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex) ?? { r: 15, g: 23, b: 42 }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

/**
 * 依据平滑指数衰减算法生成多层柔和阴影参数
 */
export function generateShadowLayers(config: ShadowConfig): ShadowLayer[] {
  const layerCount = Math.max(1, Math.min(6, Math.round(config.layers)))
  if (layerCount === 1) {
    return [
      {
        offsetX: config.offsetX,
        offsetY: config.offsetY,
        blur: config.blur,
        spread: config.spread,
        color: config.color,
        opacity: config.opacity,
        inset: config.inset,
      },
    ]
  }

  const layers: ShadowLayer[] = []
  for (let i = 1; i <= layerCount; i++) {
    const progress = i / layerCount
    // 指数平滑曲线：近层微小聚焦，远层扩散淡化
    const ratio = Math.pow(progress, 1.5)
    const layerX = Math.round(config.offsetX * ratio * 10) / 10
    const layerY = Math.round(config.offsetY * ratio * 10) / 10
    const layerBlur = Math.round(config.blur * ratio * 10) / 10
    const layerSpread = Math.round(config.spread * ratio * 10) / 10
    const layerOpacity = Number((config.opacity / layerCount).toFixed(4))

    layers.push({
      offsetX: layerX,
      offsetY: layerY,
      blur: layerBlur,
      spread: layerSpread,
      color: config.color,
      opacity: layerOpacity,
      inset: config.inset,
    })
  }

  return layers
}

/**
 * 导出标准原生 CSS 阴影声明代码
 */
export function formatCssBoxShadow(config: ShadowConfig): string {
  const layers = generateShadowLayers(config)
  const layerParts = layers.map((layer) => {
    const insetPart = layer.inset ? 'inset ' : ''
    const rgba = toRgbaString(layer.color, layer.opacity)
    return `${insetPart}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${rgba}`
  })

  return `box-shadow: ${layerParts.join(', ')};`
}

/**
 * 导出适用于 Tailwind CSS 的任意值实用类 (Arbitrary Class)
 */
export function formatTailwindBoxShadow(config: ShadowConfig): string {
  const layers = generateShadowLayers(config)
  const layerParts = layers.map((layer) => {
    const rgb = hexToRgb(layer.color) ?? { r: 15, g: 23, b: 42 }
    const insetPart = layer.inset ? 'inset_' : ''
    return `${insetPart}${layer.offsetX}px_${layer.offsetY}px_${layer.blur}px_${layer.spread}px_rgba(${rgb.r},${rgb.g},${rgb.b},${layer.opacity})`
  })
  const prefix = 'shadow-['
  return `${prefix}${layerParts.join(',')}]`
}

/**
 * 精选现代高颜值阴影预设
 */
export const PRESET_SHADOWS: ShadowPreset[] = [
  {
    name: '极简微浮 (Subtle)',
    description: '极其克制细腻的边缘柔化，适合现代扁平卡片与次级按钮',
    config: {
      layers: 2,
      offsetX: 0,
      offsetY: 4,
      blur: 12,
      spread: 0,
      color: '#0f172a',
      opacity: 0.08,
      inset: false,
    },
  },
  {
    name: '立体浮层 (Elevated)',
    description: '层次分明的中距离阴影，适合弹窗、下拉菜单与悬浮导航栏',
    config: {
      layers: 3,
      offsetX: 0,
      offsetY: 12,
      blur: 24,
      spread: -2,
      color: '#0f172a',
      opacity: 0.12,
      inset: false,
    },
  },
  {
    name: '深邃弥散 (Soft Deep)',
    description: '四层平滑递进的高级弥散阴影，具备专业设计软件般的自然光晕',
    config: {
      layers: 4,
      offsetX: 0,
      offsetY: 20,
      blur: 40,
      spread: -4,
      color: '#0f172a',
      opacity: 0.15,
      inset: false,
    },
  },
  {
    name: '品牌光晕 (Brand Glow)',
    description: '带品牌主色相的彩光阴影，适合突出核心 CTA 行动按钮与亮点卡片',
    config: {
      layers: 3,
      offsetX: 0,
      offsetY: 10,
      blur: 25,
      spread: 0,
      color: '#0ea5e9',
      opacity: 0.35,
      inset: false,
    },
  },
]
