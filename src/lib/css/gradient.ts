export interface GradientStop {
  id: string
  color: string
  position: number // 0 - 100
}

export type GradientType = 'linear' | 'radial'

export interface GradientConfig {
  type: GradientType
  angle: number // 0 - 360 (线性渐变生效)
  stops: GradientStop[]
}

/**
 * 格式化输出 CSS 渐变背景样式字符串
 */
export function formatCssGradient(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position)
  const stopsStr = sortedStops.map((s) => `${s.color} ${Math.round(s.position)}%`).join(', ')

  if (config.type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`
  }

  return `linear-gradient(${config.angle}deg, ${stopsStr})`
}

/**
 * 生成适用于 Tailwind CSS 的实用类（Utility Class）或任意值类（Arbitrary Value）
 */
export function formatTailwindGradient(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position)

  if (config.type === 'linear') {
    const angleMap: Record<number, string> = {
      0: 'bg-gradient-to-t',
      45: 'bg-gradient-to-tr',
      90: 'bg-gradient-to-r',
      135: 'bg-gradient-to-br',
      180: 'bg-gradient-to-b',
      225: 'bg-gradient-to-bl',
      270: 'bg-gradient-to-l',
      315: 'bg-gradient-to-tl',
      360: 'bg-gradient-to-t',
    }

    const dirClass = angleMap[config.angle]
    const pFrom = 'from-'
    const pVia = 'via-'
    const pTo = 'to-'

    if (
      dirClass &&
      sortedStops.length === 2 &&
      sortedStops[0].position === 0 &&
      sortedStops[1].position === 100
    ) {
      return `${dirClass} ${pFrom}[${sortedStops[0].color}] ${pTo}[${sortedStops[1].color}]`
    }

    if (
      dirClass &&
      sortedStops.length === 3 &&
      sortedStops[0].position === 0 &&
      sortedStops[1].position === 50 &&
      sortedStops[2].position === 100
    ) {
      return `${dirClass} ${pFrom}[${sortedStops[0].color}] ${pVia}[${sortedStops[1].color}] ${pTo}[${sortedStops[2].color}]`
    }
  }

  // JIT 任意值语法（全角度、径向渐变及自定义位置 100% 兼容）
  const css = formatCssGradient(config)
  const escaped = css.replace(/\s*,\s*/g, ',').replace(/\s+/g, '_')
  const pBg = 'bg-'
  return `${pBg}[${escaped}]`
}

export interface GradientBorderOptions {
  /** 边框宽度（px） */
  width: number
  /** 圆角半径（px），仅 background-clip 方案支持圆角 */
  radius: number
  /** 内层填充色，用于遮挡 border-box 背景，默认白色 */
  innerColor?: string
}

/**
 * 渐变边框方案 A：双层背景 + background-clip
 * 唯一支持 border-radius 的写法，现代浏览器均支持（推荐）。
 * 原理：两层背景中，padding-box 层填充纯色盖住内容区，border-box 层露出渐变作为边框。
 */
export function formatGradientBorderClip(
  config: GradientConfig,
  options: GradientBorderOptions
): string {
  const { width, radius, innerColor = '#ffffff' } = options
  const lines = [
    `border: ${width}px solid transparent;`,
    'background:',
    `  linear-gradient(${innerColor}, ${innerColor}) padding-box,`,
    `  ${formatCssGradient(config)} border-box;`,
  ]
  if (radius > 0) {
    lines.push(`border-radius: ${radius}px;`)
  }
  return lines.join('\n')
}

/**
 * 渐变边框方案 B：border-image
 * 语法最短，但 border-image 与 border-radius 互斥，无法做圆角边框。
 * slice 固定为 1，使整张渐变图按九宫格铺满边框区域。
 */
export function formatGradientBorderImage(
  config: GradientConfig,
  options: Pick<GradientBorderOptions, 'width'>
): string {
  return [
    `border: ${options.width}px solid transparent;`,
    `border-image: ${formatCssGradient(config)} 1;`,
  ].join('\n')
}

/**
 * 生成预设渐变推荐列表
 */
export const PRESET_GRADIENTS: { name: string; config: GradientConfig }[] = [
  {
    name: '极光青蓝 (Aurora)',
    config: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#00c6ff', position: 0 },
        { id: '2', color: '#0072ff', position: 100 },
      ],
    },
  },
  {
    name: '落日余晖 (Sunset)',
    config: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#ff7e5f', position: 0 },
        { id: '2', color: '#feb47b', position: 100 },
      ],
    },
  },
  {
    name: '赛博霓虹 (Cyberpunk)',
    config: {
      type: 'linear',
      angle: 45,
      stops: [
        { id: '1', color: '#f72585', position: 0 },
        { id: '2', color: '#7209b7', position: 50 },
        { id: '3', color: '#4cc9f0', position: 100 },
      ],
    },
  },
  {
    name: '薄荷清新 (Fresh Mint)',
    config: {
      type: 'linear',
      angle: 120,
      stops: [
        { id: '1', color: '#a8ff78', position: 0 },
        { id: '2', color: '#78ffd6', position: 100 },
      ],
    },
  },
]
