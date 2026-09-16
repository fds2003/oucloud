import JSZip from 'jszip';

export interface IconSize {
  name: string;
  size: number;
  filename: string;
  rel?: string;
}

export const FAVICON_SIZES: IconSize[] = [
  { name: '标准小图标 (16x16)', size: 16, filename: 'favicon-16x16.png', rel: 'icon' },
  { name: '桌面标准图标 (32x32)', size: 32, filename: 'favicon-32x32.png', rel: 'icon' },
  { name: '苹果设备图标 (180x180)', size: 180, filename: 'apple-touch-icon.png', rel: 'apple-touch-icon' },
  { name: '安卓 PWA 图标 (192x192)', size: 192, filename: 'android-chrome-192x192.png', rel: 'icon' },
  { name: '高清展示图标 (512x512)', size: 512, filename: 'android-chrome-512x512.png', rel: 'icon' },
];

/**
 * 将图片缩放并转换为指定尺寸的 PNG Blob
 */
export function resizeImageToBlob(
  img: HTMLImageElement,
  targetSize: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context not supported'));
      return;
    }

    // 高质量缩放
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 居中按最小边缩放填充 (Cover / Fill)
    const minDim = Math.min(img.width, img.height);
    const sx = (img.width - minDim) / 2;
    const sy = (img.height - minDim) / 2;

    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate image blob'));
      }
    }, 'image/png');
  });
}

/**
 * 打包所有尺寸的图标为 ZIP 文件
 */
export async function createFaviconZip(img: HTMLImageElement): Promise<Blob> {
  const zip = new JSZip();

  for (const item of FAVICON_SIZES) {
    const blob = await resizeImageToBlob(img, item.size);
    zip.file(item.filename, blob);
  }

  // 同时将 32x32 另存一份为 favicon.ico 兼容旧浏览器
  const icoBlob = await resizeImageToBlob(img, 32);
  zip.file('favicon.ico', icoBlob);

  // 附带一个 HTML 引用示例文件
  const htmlSnippets = generateHtmlSnippets();
  zip.file('README-FAVICON.html', `<!-- OUCloud.cn 网站图标部署代码 -->\n${htmlSnippets}`);

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * 生成标准 HTML Link 标签代码
 */
export function generateHtmlSnippets(): string {
  return `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="shortcut icon" href="/favicon.ico">`;
}
