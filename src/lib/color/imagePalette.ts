import { rgbToHex, rgbToHsl, RGB, HSL } from './conversion'

export interface PaletteColor {
  hex: string
  rgb: RGB
  hsl: HSL
  percentage: number
  isDark: boolean
}

export interface PixelSample {
  hex: string
  rgb: RGB
  hsl: HSL
}

/**
 * 采样图像中特定坐标点的颜色
 */
export function samplePixelColor(
  pixels: Uint8ClampedArray | number[],
  width: number,
  height: number,
  x: number,
  y: number
): PixelSample | null {
  const roundX = Math.floor(x)
  const roundY = Math.floor(y)

  if (roundX < 0 || roundX >= width || roundY < 0 || roundY >= height) {
    return null
  }

  const index = (roundY * width + roundX) * 4
  if (index + 3 >= pixels.length) {
    return null
  }

  const rgb: RGB = {
    r: pixels[index],
    g: pixels[index + 1],
    b: pixels[index + 2],
  }

  return {
    hex: rgbToHex(rgb),
    rgb,
    hsl: rgbToHsl(rgb),
  }
}

/**
 * 将 RGB 三通道数值按步长进行聚类量化，将相近的像素合并
 */
function quantizeChannel(val: number, step = 16): number {
  return Math.min(255, Math.floor(val / step) * step + Math.floor(step / 2))
}

/**
 * 从像素数据中聚合提取核心主色调（调色板）
 */
export function extractPaletteFromPixels(
  pixels: Uint8ClampedArray | number[],
  pixelCount: number,
  colorCount = 6
): PaletteColor[] {
  const colorBuckets = new Map<
    string,
    { count: number; sumR: number; sumG: number; sumB: number }
  >()
  let validPixelCount = 0

  const len = Math.min(pixels.length, pixelCount * 4)

  // 采样并分组聚类
  for (let i = 0; i < len; i += 4) {
    const a = pixels[i + 3]
    if (a < 128) {
      continue // 忽略高透明像素
    }

    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    validPixelCount++

    // 采用 16 步长量化网格快速合并相近色
    const qR = quantizeChannel(r, 16)
    const qG = quantizeChannel(g, 16)
    const qB = quantizeChannel(b, 16)
    const key = `${qR},${qG},${qB}`

    const existing = colorBuckets.get(key)
    if (existing) {
      existing.count++
      existing.sumR += r
      existing.sumG += g
      existing.sumB += b
    } else {
      colorBuckets.set(key, { count: 1, sumR: r, sumG: g, sumB: b })
    }
  }

  if (validPixelCount === 0) {
    return []
  }

  // 按出现频率降序排列
  const sortedBuckets = Array.from(colorBuckets.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, colorCount)

  return sortedBuckets.map(([, data]) => {
    const avgR = Math.round(data.sumR / data.count)
    const avgG = Math.round(data.sumG / data.count)
    const avgB = Math.round(data.sumB / data.count)
    const rgb: RGB = { r: avgR, g: avgG, b: avgB }
    const percentage = Number(((data.count / validPixelCount) * 100).toFixed(1))
    const isDark = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB < 128

    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: rgbToHsl(rgb),
      percentage,
      isDark,
    }
  })
}

/**
 * 提取图像的第一主色调
 */
export function getDominantColor(
  pixels: Uint8ClampedArray | number[],
  pixelCount: number
): PaletteColor | null {
  const palette = extractPaletteFromPixels(pixels, pixelCount, 1)
  return palette[0] ?? null
}
