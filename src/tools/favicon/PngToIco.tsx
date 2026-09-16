import React, { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { CopyButton } from '../../components/common/CopyButton'
import { FileDropzone } from '../../components/common/FileDropzone'
import { downloadBlob, readFileAsDataURL } from '../../lib/browser'
import { trackEvent } from '../../lib/analytics'
import { convertImageToIcoBlob } from '../../lib/image/favicon'
import { Download, CheckCircle, FileCode2, Loader2, Sparkles, Layers } from 'lucide-react'

const AVAILABLE_FRAME_SIZES = [
  { size: 16, label: '16x16 (浏览器标签页)', defaultChecked: true },
  { size: 32, label: '32x32 (桌面高分屏/书签栏)', defaultChecked: true },
  { size: 48, label: '48x48 (Windows 桌面快捷方式)', defaultChecked: true },
  { size: 64, label: '64x64 (高分屏应用图标)', defaultChecked: false },
  { size: 128, label: '128x128 (超大图标)', defaultChecked: false },
  { size: 256, label: '256x256 (高清大图容器)', defaultChecked: false },
]

export const PngToIco: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48])

  const handleFileSelect = async (file: File) => {
    setErrorMessage(null)
    if (!file.type.startsWith('image/')) {
      setErrorMessage('请选择有效的图片文件 (推荐 PNG 或透明背景图片)')
      return
    }

    try {
      trackEvent('tool_start', { toolId: 'png-to-ico' })
      const src = await readFileAsDataURL(file)
      setImageSrc(src)

      const img = new Image()
      img.onload = () => {
        setImageElement(img)
      }
      img.src = src
    } catch {
      setErrorMessage('读取图片失败，请重试')
    }
  }

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        if (prev.length <= 1) return prev // 至少保留一个尺寸
        return prev.filter((s) => s !== size)
      }
      return [...prev, size].sort((a, b) => a - b)
    })
  }

  const handleDownloadIco = async () => {
    if (!imageElement) return

    try {
      setIsConverting(true)
      const icoBlob = await convertImageToIcoBlob(imageElement, selectedSizes)
      downloadBlob(icoBlob, 'favicon.ico')
      trackEvent('tool_download', { toolId: 'png-to-ico' })
    } catch {
      setErrorMessage('生成 ICO 图标失败，请换一张图片重试')
    } finally {
      setIsConverting(false)
    }
  }

  const htmlSnippet = `<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">`

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <FileDropzone
            onFileSelect={handleFileSelect}
            title="点击上传 PNG 图片 或 拖拽文件至此处"
            subtitle="纯前端本地转换，图片绝不上传服务器。推荐使用透明背景 PNG 图标"
          />

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {imageSrc && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={imageSrc}
                    alt="原图预览"
                    className="w-16 h-16 rounded-lg object-contain border border-slate-200 bg-slate-50 p-1"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">图片已就绪</h4>
                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" /> 纯浏览器本地处理，随时可导出
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleDownloadIco}
                  disabled={isConverting}
                  className="gap-2 w-full sm:w-auto shadow"
                  size="md"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      正在打包 ICO 容器...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      一键下载标准 favicon.ico
                    </>
                  )}
                </Button>
              </div>

              {/* 多帧尺寸选择 */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary-600" />
                  封装包含的 ICO 帧分辨率 (支持多选)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {AVAILABLE_FRAME_SIZES.map((item) => {
                    const checked = selectedSizes.includes(item.size)
                    return (
                      <button
                        key={item.size}
                        type="button"
                        onClick={() => toggleSize(item.size)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          checked
                            ? 'border-primary-500 bg-primary-50/60 text-primary-900 ring-1 ring-primary-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold">{item.size}x{item.size}</div>
                          <div className="text-xs text-slate-500">{item.label}</div>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            checked ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {checked ? '包含' : '忽略'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 拟真浏览器标签页预览 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  拟真浏览器标签页预览 (Favicon 真实效果)
                </span>
                <div className="space-y-2">
                  {/* 浅色标签页 */}
                  <div className="flex items-center gap-2 bg-slate-200/80 p-2 rounded-t-lg">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-t shadow-sm max-w-xs">
                      <img src={imageSrc} alt="Tab icon" className="w-4 h-4 object-contain" />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        我的网站标题 - 浅色模式
                      </span>
                    </div>
                  </div>
                  {/* 深色标签页 */}
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-b-lg">
                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-t shadow-sm max-w-xs border border-slate-700/50">
                      <img src={imageSrc} alt="Tab icon" className="w-4 h-4 object-contain" />
                      <span className="text-xs font-medium text-slate-200 truncate">
                        我的网站标题 - 深色模式
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HTML 引入代码 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4" />
                    标准 HTML 引入代码
                  </label>
                  <CopyButton
                    textToCopy={htmlSnippet}
                    label="复制代码"
                    copiedLabel="已复制代码"
                    toolId="png-to-ico"
                  />
                </div>
                <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs font-mono overflow-x-auto select-all">
                  {htmlSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
