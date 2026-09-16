/**
 * SVG 转 Favicon 处理引擎
 */

export interface NormalizedSvgResult {
  cleanSvg: string
  dataUrl: string
  width: number
  height: number
}

export interface DemoSvg {
  name: string
  svg: string
}

/**
 * 校验、清洗并规范化 SVG 字符串
 */
export function cleanAndNormalizeSvg(
  svgString: string,
  targetSize = 64
): NormalizedSvgResult | null {
  if (!svgString || typeof svgString !== 'string') return null
  const trimmed = svgString.trim()
  if (!trimmed.includes('<svg') || !trimmed.includes('</svg>')) {
    return null
  }

  // 提取从 <svg 到 </svg> 的内容
  const svgMatch = trimmed.match(/<svg[\s\S]*?<\/svg>/i)
  if (!svgMatch) return null

  let clean = svgMatch[0]

  // 安全清洗：移除 <script> 标签及 on* 事件属性
  clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '')
  clean = clean.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
  clean = clean.replace(/\son\w+\s*=\s*[^>\s]+/gi, '')

  // 确保包含 xmlns="http://www.w3.org/2000/svg"
  if (!clean.includes('xmlns=')) {
    clean = clean.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"')
  }

  // 提取或配置 viewBox
  if (!clean.includes('viewBox=')) {
    clean = clean.replace(/<svg/i, `<svg viewBox="0 0 ${targetSize} ${targetSize}"`)
  }

  // 设置 width 和 height 属性
  clean = clean.replace(/\s(width|height)=(['"])[^'"]*\2/gi, '')
  clean = clean.replace(/<svg/i, `<svg width="${targetSize}" height="${targetSize}"`)

  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(clean)}`

  return {
    cleanSvg: clean,
    dataUrl,
    width: targetSize,
    height: targetSize,
  }
}

export const DEMO_SVGS: DemoSvg[] = [
  {
    name: '极客代码 (Code)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#0f172a"/>
      <path d="M35 40 L25 50 L35 60 M65 40 L75 50 L65 60 M55 35 L45 65" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`,
  },
  {
    name: '品牌立方 (Cube)',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#6366f1"/>
      <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" fill="#4f46e5" stroke="#c7d2fe" stroke-width="4"/>
      <path d="M50 20 L50 80 M50 50 L80 35 M50 50 L20 35" stroke="#c7d2fe" stroke-width="4"/>
    </svg>`,
  },
]
