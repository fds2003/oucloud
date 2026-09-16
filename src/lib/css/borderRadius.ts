/**
 * CSS 8-value 不规则平滑圆角计算引擎
 */

export interface BorderRadiusConfig {
  topLeftX: number
  topRightX: number
  bottomRightX: number
  bottomLeftX: number
  topLeftY: number
  topRightY: number
  bottomRightY: number
  bottomLeftY: number
}

export interface BorderRadiusPreset {
  name: string
  description: string
  config: BorderRadiusConfig
}

/**
 * 输出原生 CSS 8 值圆角代码声明
 */
export function formatCssBorderRadius(config: BorderRadiusConfig): string {
  const h = `${config.topLeftX}% ${config.topRightX}% ${config.bottomRightX}% ${config.bottomLeftX}%`
  const v = `${config.topLeftY}% ${config.topRightY}% ${config.bottomRightY}% ${config.bottomLeftY}%`
  return `border-radius: ${h} / ${v};`
}

/**
 * 输出适用于 Tailwind CSS 的任意值实用类
 */
export function formatTailwindBorderRadius(config: BorderRadiusConfig): string {
  const h = `${config.topLeftX}%_${config.topRightX}%_${config.bottomRightX}%_${config.bottomLeftX}%`
  const v = `${config.topLeftY}%_${config.topRightY}%_${config.bottomRightY}%_${config.bottomLeftY}%`
  // 规避 Tailwind JIT 静态扫描语法误判
  const prefix = 'rounded-['
  return `${prefix}${h}/_${v}]`
}

/**
 * 精选现代有机异形预设
 */
export const PRESET_BORDER_RADII: BorderRadiusPreset[] = [
  {
    name: '有机水滴 (Organic Blob)',
    description: '充满灵动生命力的非对称有机形态，适合展示头像与品牌标语背景',
    config: {
      topLeftX: 60,
      topRightX: 40,
      bottomRightX: 30,
      bottomLeftX: 70,
      topLeftY: 60,
      topRightY: 30,
      bottomRightY: 70,
      bottomLeftY: 40,
    },
  },
  {
    name: '科技徽章 (Tech Badge)',
    description: '四角略带内收的现代科技风徽章形态',
    config: {
      topLeftX: 70,
      topRightX: 30,
      bottomRightX: 70,
      bottomLeftX: 30,
      topLeftY: 30,
      topRightY: 70,
      bottomRightY: 30,
      bottomLeftY: 70,
    },
  },
  {
    name: '自然卵石 (Smooth Pebble)',
    description: '圆润平缓的天然鹅卵石形态，视觉亲和力极佳',
    config: {
      topLeftX: 45,
      topRightX: 55,
      bottomRightX: 40,
      bottomLeftX: 60,
      topLeftY: 55,
      topRightY: 45,
      bottomRightY: 60,
      bottomLeftY: 40,
    },
  },
  {
    name: '对角柔化 (Diagonal Soft)',
    description: '主对角线大圆角、次对角线微圆角，适合创意卡片封面',
    config: {
      topLeftX: 80,
      topRightX: 20,
      bottomRightX: 80,
      bottomLeftX: 20,
      topLeftY: 20,
      topRightY: 80,
      bottomRightY: 20,
      bottomLeftY: 80,
    },
  },
]
