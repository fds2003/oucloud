import JSZip from 'jszip'

export interface IconSize {
  name: string
  size: number
  filename: string
  rel?: string
}

export const FAVICON_SIZES: IconSize[] = [
  { name: '标准小图标 (16x16)', size: 16, filename: 'favicon-16x16.png', rel: 'icon' },
  { name: '桌面标准图标 (32x32)', size: 32, filename: 'favicon-32x32.png', rel: 'icon' },
  {
    name: '苹果设备图标 (180x180)',
    size: 180,
    filename: 'apple-touch-icon.png',
    rel: 'apple-touch-icon',
  },
  {
    name: '安卓 PWA 图标 (192x192)',
    size: 192,
    filename: 'android-chrome-192x192.png',
    rel: 'icon',
  },
  {
    name: '高清展示图标 (512x512)',
    size: 512,
    filename: 'android-chrome-512x512.png',
    rel: 'icon',
  },
]

/**
 * 将图片缩放并转换为指定尺寸的 PNG Blob
 */
export function resizeImageToBlob(img: HTMLImageElement, targetSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = targetSize
    canvas.height = targetSize
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas 2D context not supported'))
      return
    }

    // 高质量缩放
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // 居中按最小边缩放填充 (Cover / Fill)
    const minDim = Math.min(img.width, img.height)
    const sx = (img.width - minDim) / 2
    const sy = (img.height - minDim) / 2

    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize)

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to generate image blob'))
      }
    }, 'image/png')
  })
}

/** ICO 容器内封装的帧尺寸（多帧可让不同 DPI 场景取到合适的一帧） */
const ICO_FRAME_SIZES = [16, 32, 48]

/**
 * 将多帧 PNG 封装为标准 ICO 容器（PNG-in-ICO，Vista+ 与主流浏览器均支持）。
 *
 * 注意：直接把 PNG 数据命名为 .ico 是不合法的，部分浏览器与 CDN 会拒绝解析，
 * 必须写出真实的 ICONDIR + ICONDIRENTRY 结构。
 */
async function pngFramesToIco(frames: { size: number; png: Blob }[]): Promise<Blob> {
  const buffers = await Promise.all(frames.map((frame) => frame.png.arrayBuffer()))

  const headerSize = 6 + frames.length * 16
  const totalSize = buffers.reduce((sum, buf) => sum + buf.byteLength, headerSize)

  const ico = new Uint8Array(totalSize)
  const view = new DataView(ico.buffer)

  // ICONDIR
  view.setUint16(0, 0, true) // reserved
  view.setUint16(2, 1, true) // type: 1 = icon
  view.setUint16(4, frames.length, true) // 帧数

  let offset = headerSize
  frames.forEach((frame, index) => {
    const base = 6 + index * 16
    const buffer = buffers[index]
    // 256px 在 ICO 中用 0 表示
    const dimension = frame.size >= 256 ? 0 : frame.size

    view.setUint8(base, dimension) // width
    view.setUint8(base + 1, dimension) // height
    view.setUint8(base + 2, 0) // palette colors (0 = 真彩色)
    view.setUint8(base + 3, 0) // reserved
    view.setUint16(base + 4, 1, true) // color planes
    view.setUint16(base + 6, 32, true) // bits per pixel
    view.setUint32(base + 8, buffer.byteLength, true) // 数据长度
    view.setUint32(base + 12, offset, true) // 数据偏移

    ico.set(new Uint8Array(buffer), offset)
    offset += buffer.byteLength
  })

  return new Blob([ico], { type: 'image/x-icon' })
}

/**
 * 打包所有尺寸的图标为 ZIP 文件
 */
export async function createFaviconZip(img: HTMLImageElement): Promise<Blob> {
  const zip = new JSZip()
  const pngBySize = new Map<number, Blob>()

  for (const item of FAVICON_SIZES) {
    const blob = await resizeImageToBlob(img, item.size)
    zip.file(item.filename, blob)
    pngBySize.set(item.size, blob)
  }

  // 生成真实 ICO 容器，而非把 PNG 直接改名
  const icoFrames: { size: number; png: Blob }[] = []
  for (const size of ICO_FRAME_SIZES) {
    let png = pngBySize.get(size)
    if (!png) {
      png = await resizeImageToBlob(img, size)
      pngBySize.set(size, png)
    }
    icoFrames.push({ size, png })
  }
  zip.file('favicon.ico', await pngFramesToIco(icoFrames))

  // 附带一个 HTML 引用示例文件
  const htmlSnippets = generateHtmlSnippets()
  zip.file('README-FAVICON.html', `<!-- OUCloud.cn 网站图标部署代码 -->\n${htmlSnippets}`)

  return await zip.generateAsync({ type: 'blob' })
}

/**
 * 将图片直接封装并导出为标准多帧 .ico 文件（内置 16x16, 32x32, 48x48 帧，适用于 Windows 图标与浏览器 favicon.ico）
 */
export async function convertImageToIcoBlob(
  img: HTMLImageElement,
  frameSizes: number[] = ICO_FRAME_SIZES
): Promise<Blob> {
  const icoFrames: { size: number; png: Blob }[] = []
  for (const size of frameSizes) {
    const png = await resizeImageToBlob(img, size)
    icoFrames.push({ size, png })
  }
  return pngFramesToIco(icoFrames)
}

/**
 * 生成标准 HTML Link 标签代码
 */
export function generateHtmlSnippets(): string {
  return `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="shortcut icon" href="/favicon.ico">`
}
