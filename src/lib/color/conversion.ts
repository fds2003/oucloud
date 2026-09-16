export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

/**
 * 校验是否为合法 HEX 颜色 (#RGB, #RRGGBB)
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim())
}

/**
 * 解析并规范化 URL Query 参数中的 HEX 颜色（支持带或不带 # 前缀，如 "ff7e5f" 或 "#ff7e5f"）
 */
export function parseHexParam(param: string | null | undefined): string | null {
  if (!param) return null
  const trimmed = param.trim()
  const normalized = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return isValidHex(normalized) ? normalized.toLowerCase() : null
}

/**
 * HEX 转换为 RGB
 */
export function hexToRgb(hex: string): RGB | null {
  let cleanHex = hex.trim().replace(/^#/, '')
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (cleanHex.length !== 6) return null

  const num = parseInt(cleanHex, 16)
  if (isNaN(num)) return null

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

/**
 * RGB 转换为标准 HEX (#rrggbb)
 */
export function rgbToHex(rgb: RGB): string {
  const r = clamp(Math.round(rgb.r), 0, 255)
  const g = clamp(Math.round(rgb.g), 0, 255)
  const b = clamp(Math.round(rgb.b), 0, 255)

  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * RGB 转换为 HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = clamp(rgb.r, 0, 255) / 255
  const g = clamp(rgb.g, 0, 255) / 255
  const b = clamp(rgb.b, 0, 255) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * HSL 转换为 RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = (((hsl.h % 360) + 360) % 360) / 360
  const s = clamp(hsl.s, 0, 100) / 100
  const l = clamp(hsl.l, 0, 100) / 100

  if (s === 0) {
    const val = Math.round(l * 255)
    return { r: val, g: val, b: val }
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

export function formatRgb(rgb: RGB): string {
  return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`
}

export function formatHsl(hsl: HSL): string {
  return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
}

/**
 * 计算颜色的相对亮度 (Relative Luminance, WCAG 2.1)
 * 标准公式：L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function getRelativeLuminance(rgb: RGB): number {
  const srgb = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((val) =>
    val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  )
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

/**
 * 计算两个 RGB 颜色的对比度比率 (1:1 到 21:1)
 * WCAG 2.1 规范要求：普通文本至少 4.5:1 (AA) 或 7:1 (AAA)；大文本/UI组件至少 3:1 (AA)
 */
export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getRelativeLuminance(rgb1)
  const l2 = getRelativeLuminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export interface ColorHarmonies {
  complementary: string
  analogous: [string, string]
  triadic: [string, string]
}

/**
 * 基于 HSL 动态计算配色方案（互补色、类似色、三角色）
 */
export function getColorHarmonies(hsl: HSL): ColorHarmonies {
  const modHue = (h: number) => ((h % 360) + 360) % 360

  const compHsl: HSL = { ...hsl, h: modHue(hsl.h + 180) }
  const ana1Hsl: HSL = { ...hsl, h: modHue(hsl.h + 30) }
  const ana2Hsl: HSL = { ...hsl, h: modHue(hsl.h - 30) }
  const tri1Hsl: HSL = { ...hsl, h: modHue(hsl.h + 120) }
  const tri2Hsl: HSL = { ...hsl, h: modHue(hsl.h + 240) }

  return {
    complementary: rgbToHex(hslToRgb(compHsl)),
    analogous: [rgbToHex(hslToRgb(ana1Hsl)), rgbToHex(hslToRgb(ana2Hsl))],
    triadic: [rgbToHex(hslToRgb(tri1Hsl)), rgbToHex(hslToRgb(tri2Hsl))],
  }
}
