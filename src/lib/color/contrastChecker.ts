import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getContrastRatio,
  getRelativeLuminance,
  parseHexParam,
  RGB,
} from './conversion'

export interface WcagReport {
  ratio: number
  normalTextAa: boolean
  normalTextAaa: boolean
  largeTextAa: boolean
  largeTextAaa: boolean
  uiComponentAa: boolean
  fgRgb: RGB
  bgRgb: RGB
  fgHex: string
  bgHex: string
}

/**
 * 依据 WCAG 2.1 规范评估两色的对比度与各层级合规性
 */
export function evaluateWcagCompliance(
  fgHexInput: string,
  bgHexInput: string
): WcagReport | null {
  const fg = parseHexParam(fgHexInput)
  const bg = parseHexParam(bgHexInput)
  if (!fg || !bg) return null

  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)
  if (!fgRgb || !bgRgb) return null

  const rawRatio = getContrastRatio(fgRgb, bgRgb)
  const ratio = Number(rawRatio.toFixed(2))

  return {
    ratio,
    normalTextAa: ratio >= 4.5,
    normalTextAaa: ratio >= 7.0,
    largeTextAa: ratio >= 3.0,
    largeTextAaa: ratio >= 4.5,
    uiComponentAa: ratio >= 3.0,
    fgRgb,
    bgRgb,
    fgHex: fg,
    bgHex: bg,
  }
}

/**
 * 智能微调前景色亮度，使其在指定背景色上达到目标对比度 (默认 4.5:1 AA 标准)
 */
export function suggestAccessibleColor(
  fgHexInput: string,
  bgHexInput: string,
  targetRatio = 4.5
): string | null {
  const fg = parseHexParam(fgHexInput)
  const bg = parseHexParam(bgHexInput)
  if (!fg || !bg) return null

  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)
  if (!fgRgb || !bgRgb) return null

  const currentRatio = getContrastRatio(fgRgb, bgRgb)
  if (currentRatio >= targetRatio) {
    return fg
  }

  const bgLum = getRelativeLuminance(bgRgb)
  const fgHsl = rgbToHsl(fgRgb)

  // 背景较亮则调暗前景色；背景较暗则调亮前景色
  const step = bgLum > 0.5 ? -1 : 1
  let currentL = fgHsl.l

  for (let i = 0; i < 100; i++) {
    currentL += step
    if (currentL < 0 || currentL > 100) break

    const testRgb = hslToRgb({ ...fgHsl, l: currentL })
    const testRatio = getContrastRatio(testRgb, bgRgb)
    if (testRatio >= targetRatio) {
      return rgbToHex(testRgb)
    }
  }

  // 极限情况直接回退到纯黑或纯白
  return bgLum > 0.5 ? '#000000' : '#ffffff'
}
