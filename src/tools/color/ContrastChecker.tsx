import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { CrossToolLinks } from '../../components/common/CrossToolLinks'
import {
  evaluateWcagCompliance,
  suggestAccessibleColor,
} from '../../lib/color/contrastChecker'
import { parseHexParam } from '../../lib/color/conversion'
import {
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Type,
  Layout,
  Wand2,
  ShieldCheck,
} from 'lucide-react'

const QUICK_FG_PRESETS = ['#0f172a', '#1e293b', '#334155', '#ffffff', '#0ea5e9', '#ef4444']
const QUICK_BG_PRESETS = ['#ffffff', '#f8fafc', '#f1f5f9', '#0f172a', '#1e293b', '#0284c7']

export const ContrastChecker: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [fgColor, setFgColor] = useState('#0f172a')
  const [bgColor, setBgColor] = useState('#ffffff')

  // URL query 参数透传 (?fg=...&bg=...)
  useEffect(() => {
    const pFg = parseHexParam(searchParams.get('fg'))
    const pBg = parseHexParam(searchParams.get('bg'))
    if (pFg) setFgColor(pFg)
    if (pBg) setBgColor(pBg)
  }, [searchParams])

  const report = useMemo(() => {
    return evaluateWcagCompliance(fgColor, bgColor)
  }, [fgColor, bgColor])

  const suggestedFg = useMemo(() => {
    if (!report || report.normalTextAa) return null
    return suggestAccessibleColor(fgColor, bgColor, 4.5)
  }, [report, fgColor, bgColor])

  const handleSwap = () => {
    const temp = fgColor
    setFgColor(bgColor)
    setBgColor(temp)
  }

  const handleApplySuggested = () => {
    if (suggestedFg) {
      setFgColor(suggestedFg)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          {/* 色彩输入与互换控制 */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* 前景色 (文字) */}
            <div className="md:col-span-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-primary-600" />
                  前景色 / 文本色彩 (Foreground)
                </label>
                <span className="text-xs font-mono font-bold text-slate-900">{fgColor}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5 shadow-2xs"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-2xs"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_FG_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFgColor(c)}
                    className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* 颜色互换按钮 */}
            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-primary-600 shadow-xs transition-all hover:scale-105"
                title="对调前景色与背景色"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* 背景色 */}
            <div className="md:col-span-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-primary-600" />
                  背景色 (Background)
                </label>
                <span className="text-xs font-mono font-bold text-slate-900">{bgColor}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5 shadow-2xs"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-2xs"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_BG_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBgColor(c)}
                    className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 对比度分数与智能优化建议 */}
          {report ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-bold uppercase text-slate-400">对比度比率</span>
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900">
                    {report.ratio} : 1
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs ${
                      report.normalTextAaa
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : report.normalTextAa
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : report.largeTextAa
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {report.normalTextAaa
                      ? '符合 WCAG AAA 极致标准'
                      : report.normalTextAa
                        ? '符合 WCAG AA 标准'
                        : report.largeTextAa
                          ? '仅适用于大字号 (≥18pt)'
                          : '未达到无障碍合规底线'}
                  </span>
                </div>
              </div>

              {/* 智能微调达标修复条 (若不达标) */}
              {suggestedFg && (
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      当前普通正文对比度不足 4.5:1，建议将前景色微调为{' '}
                      <span className="font-mono font-bold">{suggestedFg}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplySuggested}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-2xs"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    一键应用合规建议
                  </button>
                </div>
              )}

              {/* WCAG 2.1 规范判定卡片网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 普通正文 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">普通正文 (Regular Text)</span>
                    <span className="text-[10px] text-slate-400 font-mono">&lt; 18pt</span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span>AA 级标准 (≥ 4.5:1)</span>
                      {report.normalTextAa ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 通过
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                          <XCircle className="w-3.5 h-3.5" /> 失败
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AAA 级标准 (≥ 7.0:1)</span>
                      {report.normalTextAaa ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 通过
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-0.5">
                          <XCircle className="w-3.5 h-3.5" /> 未达
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 大字号文本 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">大字号文本 (Large Text)</span>
                    <span className="text-[10px] text-slate-400 font-mono">≥ 18pt 或 14pt粗体</span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span>AA 级标准 (≥ 3.0:1)</span>
                      {report.largeTextAa ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 通过
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                          <XCircle className="w-3.5 h-3.5" /> 失败
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AAA 级标准 (≥ 4.5:1)</span>
                      {report.largeTextAaa ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 通过
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-0.5">
                          <XCircle className="w-3.5 h-3.5" /> 未达
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 图形与UI控件 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">UI 组件与图标 (UI / Icons)</span>
                    <span className="text-[10px] text-slate-400 font-mono">按钮/边框</span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span>AA 级标准 (≥ 3.0:1)</span>
                      {report.uiComponentAa ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 通过
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                          <XCircle className="w-3.5 h-3.5" /> 失败
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>行业推荐标准</span>
                      <span>3.0:1 推荐</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 真实排版效果直观预览区 */}
              <div
                className="p-6 rounded-2xl border border-slate-200 space-y-4 transition-colors duration-150"
                style={{ backgroundColor: bgColor, color: fgColor }}
              >
                <div className="flex items-center justify-between border-b pb-3 opacity-90" style={{ borderColor: fgColor }}>
                  <span className="text-xs uppercase tracking-wider font-bold">实际排版与组件实时效果</span>
                  <span className="text-xs font-mono">{fgColor} on {bgColor}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    大标题展示文字 (Large Heading 24px)
                  </h3>
                  <p className="text-sm leading-relaxed opacity-95">
                    这是普通正文段落文字示范。根据 WCAG 2.1 无障碍标准，正文字体在浅色或深色背景中必须满足足够的明度差，以确保低视力人群、强光环境下屏幕阅读者均能清晰识别。
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm"
                    style={{ backgroundColor: fgColor, color: bgColor }}
                  >
                    主行动按钮 (CTA Button)
                  </button>
                  <span
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                    style={{ borderColor: fgColor }}
                  >
                    次级幽灵标签 (Ghost Badge)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500">请输入合法的 HEX 十六进制色彩代码</p>
          )}

          {/* 底部协同通道 */}
          <CrossToolLinks
            className="pt-2"
            links={[
              { to: `/tools/color/color-picker?hex=${fgColor.replace('#', '')}`, label: '将前景色导入全能拾色器' },
              { to: `/tools/css/gradient-generator?from=${fgColor.replace('#', '')}&to=${bgColor.replace('#', '')}`, label: '以当前双色创建渐变' },
            ]}
          />
        </div>
      </Card>
    </div>
  )
}
