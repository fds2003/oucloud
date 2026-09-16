import React, { useState, useRef, useMemo } from 'react'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { CopyButton } from '../../components/common/CopyButton'
import { SegmentedTabs } from '../../components/common/SegmentedTabs'
import { FileDropzone } from '../../components/common/FileDropzone'
import { cleanAndNormalizeSvg, DEMO_SVGS } from '../../lib/image/svgFavicon'
import { convertImageToIcoBlob } from '../../lib/image/favicon'
import { downloadBlob } from '../../lib/browser'
import { trackEvent } from '../../lib/analytics'
import {
  Download,
  Sparkles,
  FileCode2,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileUp,
  Code2,
} from 'lucide-react'

type InputTab = 'upload' | 'paste'

export const SvgToFavicon: React.FC = () => {
  const [inputTab, setInputTab] = useState<InputTab>('upload')
  const [svgInputText, setSvgInputText] = useState(DEMO_SVGS[0].svg)
  const [activeSvg, setActiveSvg] = useState(DEMO_SVGS[0].svg)
  const [isExportingIco, setIsExportingIco] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const normalized = useMemo(() => {
    return cleanAndNormalizeSvg(activeSvg, 64)
  }, [activeSvg])

  const handleFileSelect = async (file: File) => {
    setErrorMessage(null)
    if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
      setErrorMessage('请选择有效的 .svg 矢量文件')
      return
    }

    try {
      trackEvent('tool_start', { toolId: 'svg-to-favicon' })
      const text = await file.text()
      const check = cleanAndNormalizeSvg(text, 64)
      if (!check) {
        setErrorMessage('SVG 文件结构解析失败，请检查是否包含合法的 <svg> 根标签')
        return
      }
      setActiveSvg(text)
      setSvgInputText(text)
    } catch {
      setErrorMessage('读取 SVG 文件失败，请重试')
    }
  }

  const handlePasteChange = (val: string) => {
    setSvgInputText(val)
    setErrorMessage(null)
    const check = cleanAndNormalizeSvg(val, 64)
    if (check) {
      setActiveSvg(val)
    }
  }

  // 离线 Canvas 渲染 SVG 并导出 ICO
  const handleDownloadIco = async () => {
    if (!normalized) return

    try {
      setIsExportingIco(true)
      trackEvent('tool_start', { toolId: 'svg-to-favicon' })

      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.onload = async () => {
        try {
          ctx.drawImage(img, 0, 0, 256, 256)
          const icoBlob = await convertImageToIcoBlob(img, [16, 32, 48])
          downloadBlob(icoBlob, 'favicon.ico')
          trackEvent('tool_download', { toolId: 'svg-to-favicon' })
        } catch {
          setErrorMessage('打包 ICO 失败，请换一张 SVG 重试')
        } finally {
          setIsExportingIco(false)
        }
      }
      img.src = normalized.dataUrl
    } catch {
      setIsExportingIco(false)
    }
  }

  // 导出 512x512 高清 PNG
  const handleDownloadPng = () => {
    if (!normalized) return
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 512, 512)
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, 'favicon-512x512.png')
          trackEvent('tool_download', { toolId: 'svg-to-favicon' })
        }
      }, 'image/png')
    }
    img.src = normalized.dataUrl
  }

  // 导出规范化后的 SVG
  const handleDownloadSvg = () => {
    if (!normalized) return
    const blob = new Blob([normalized.cleanSvg], { type: 'image/svg+xml' })
    downloadBlob(blob, 'favicon.svg')
    trackEvent('tool_download', { toolId: 'svg-to-favicon' })
  }

  const htmlLinkSnippet = `<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n<link rel="shortcut icon" href="/favicon.ico">`

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：输入与上传控制 */}
          <div className="lg:col-span-6 space-y-5">
            {/* 上传 / 粘贴 切换 Tab */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <SegmentedTabs
                size="sm"
                value={inputTab}
                onChange={setInputTab}
                options={[
                  { value: 'upload', label: <span className="flex items-center gap-1.5"><FileUp className="w-3.5 h-3.5" /> 上传 SVG 文件</span> },
                  { value: 'paste', label: <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> 粘贴 SVG 代码</span> },
                ]}
              />

              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 本地矢量解析
              </span>
            </div>

            {inputTab === 'upload' ? (
              <FileDropzone
                onFileSelect={handleFileSelect}
                title="点击上传 .svg 文件 或 拖拽至此处"
                subtitle="纯前端本地解析，矢量文件绝不上载至任何服务器"
              />
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-600 block">
                  直接粘贴 SVG 源代码 (&lt;svg ...&gt;)
                </label>
                <textarea
                  value={svgInputText}
                  onChange={(e) => handlePasteChange(e.target.value)}
                  rows={7}
                  placeholder="<svg viewBox='0 0 100 100' ...> ... </svg>"
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-inner"
                />
              </div>
            )}

            {/* 快速体验内置示例 */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">快速试用示例：</span>
              {DEMO_SVGS.map((demo) => (
                <button
                  key={demo.name}
                  type="button"
                  onClick={() => {
                    setActiveSvg(demo.svg)
                    setSvgInputText(demo.svg)
                    setErrorMessage(null)
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-medium transition-all shadow-2xs"
                >
                  {demo.name}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* 右侧：实时预览与多格式导出 */}
          <div className="lg:col-span-6 space-y-6">
            {normalized ? (
              <>
                {/* 实时多尺寸微缩效果 */}
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500 mb-2.5 block">
                    SVG 渲染各设备尺寸效果
                  </span>
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-around">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xs flex items-center justify-center bg-white border border-slate-200">
                        <img src={normalized.dataUrl} alt="64x64" className="w-16 h-16 object-contain" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">64x64</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shadow-2xs flex items-center justify-center bg-white border border-slate-200">
                        <img src={normalized.dataUrl} alt="32x32" className="w-8 h-8 object-contain" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">32x32</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="w-4 h-4 rounded-xs overflow-hidden flex items-center justify-center bg-white">
                        <img src={normalized.dataUrl} alt="16x16" className="w-4 h-4 object-contain" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">16x16</span>
                    </div>
                  </div>
                </div>

                {/* 拟真标签页预览 */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                  <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    浏览器标签栏真实效果模拟
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-slate-200 p-2 rounded-t-xl">
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-t-lg shadow-xs max-w-xs">
                        <img src={normalized.dataUrl} alt="Tab" className="w-4 h-4 object-contain" />
                        <span className="text-xs font-medium text-slate-800 truncate">SVG Favicon - 浅色模式</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-b-xl">
                      <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-t-lg shadow-xs max-w-xs border border-slate-700/60">
                        <img src={normalized.dataUrl} alt="Tab" className="w-4 h-4 object-contain" />
                        <span className="text-xs font-medium text-slate-200 truncate">SVG Favicon - 暗色模式</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 导出操作区 */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase text-slate-500 block">一键导出图标格式</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button
                      onClick={handleDownloadIco}
                      disabled={isExportingIco}
                      className="gap-1.5 shadow-sm text-xs py-2"
                      size="md"
                    >
                      {isExportingIco ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      下载 favicon.ico
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleDownloadPng}
                      className="gap-1.5 border-slate-300 text-xs py-2"
                      size="md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      下载 PNG (512px)
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleDownloadSvg}
                      className="gap-1.5 border-slate-300 text-xs py-2"
                      size="md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      下载规范 SVG
                    </Button>
                  </div>
                </div>

                {/* 引入代码 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                      <FileCode2 className="w-3.5 h-3.5" />
                      HTML 头部最佳实践引入代码
                    </label>
                    <CopyButton
                      textToCopy={htmlLinkSnippet}
                      label="复制代码"
                      copiedLabel="已复制"
                      toolId="svg-to-favicon"
                    />
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono overflow-x-auto select-all leading-relaxed">
                    {htmlLinkSnippet}
                  </pre>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                请先在左侧上传或粘贴合法的 SVG 矢量内容
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
