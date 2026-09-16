import React, { useState, useRef } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CopyButton } from '../../components/common/CopyButton';
import {
  FAVICON_SIZES,
  createFaviconZip,
  generateHtmlSnippets,
} from '../../lib/image/favicon';
import { Upload, Download, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

export const FaviconGenerator: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择有效的图片文件 (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setImageElement(img);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    if (!imageElement) return;

    try {
      setIsGenerating(true);
      const zipBlob = await createFaviconZip(imageElement);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicons-oucloud.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('生成 Favicon 失败，请检查图片');
    } finally {
      setIsGenerating(false);
    }
  };

  const htmlCode = generateHtmlSnippets();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          {/* 上传区域 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-primary-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-primary-50/20 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  点击选择图片 或 将图片拖拽至此处
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  支持 PNG, JPG, WebP 格式（推荐使用 512x512 纯透明背景方形图片）
                </p>
              </div>
            </div>
          </div>

          {/* 预览与生成操作 */}
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
                    <h4 className="text-sm font-semibold text-slate-900">
                      图片已加载完成
                    </h4>
                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" /> 本地安全就绪，随时可导出
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="gap-2 w-full sm:w-auto shadow"
                  size="md"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      正在打包图标...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      一键下载 Favicon 图标包 (.zip)
                    </>
                  )}
                </Button>
              </div>

              {/* 实时多尺寸效果预览 */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> 预设各设备尺寸预览
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {FAVICON_SIZES.map((item) => (
                    <div
                      key={item.size}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center flex flex-col items-center justify-center gap-2"
                    >
                      <div className="flex items-center justify-center bg-white rounded border border-slate-200 w-12 h-12">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          style={{ width: `${Math.min(item.size, 36)}px`, height: `${Math.min(item.size, 36)}px` }}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-600">
                        {item.size}x{item.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HTML 标签代码 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    HTML 引入代码 (粘贴至页面的 &lt;head&gt; 中)
                  </label>
                  <CopyButton textToCopy={htmlCode} label="复制代码" copiedLabel="已复制代码" />
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                  {htmlCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
