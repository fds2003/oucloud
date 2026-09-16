/**
 * 浏览器端统一实用工具函数库 (符合 Prompt 第三十八节规范)
 */

/**
 * 复制文本到剪贴板 (带 Fallback 降级兼容)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    return successful
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

/**
 * 触发本地 Blob 文件下载 (无服务器中转)
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 将 File 读取为 Data URL 格式
 * @param file - 要读取的文件
 * @param maxSizeMB - 最大文件大小（MB），默认 10MB
 */
export function readFileAsDataURL(file: File, maxSizeMB: number = 10): Promise<string> {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return Promise.reject(
      new Error(
        `文件大小超过限制：${maxSizeMB}MB。当前文件大小：${(file.size / 1024 / 1024).toFixed(2)}MB`
      )
    )
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}
