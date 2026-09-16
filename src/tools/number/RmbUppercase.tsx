import React, { useState, useMemo } from 'react'
import { Card } from '../../components/common/Card'
import { CopyButton } from '../../components/common/CopyButton'
import { convertToRmbUppercase, parseRmbUppercase } from '../../lib/number/rmbUppercase'
import { CheckCircle, AlertCircle, ArrowDown, ArrowLeftRight } from 'lucide-react'

type Mode = 'num-to-chinese' | 'chinese-to-num'

const NUM_PRESETS = [
  { label: '壹佰元整', val: '100' },
  { label: '壹仟元整', val: '1000' },
  { label: '伍万元整', val: '50000' },
  { label: '发票常用小数', val: '12345.67' },
]

const CHINESE_PRESETS = [
  { label: '壹佰元整', val: '壹佰元整' },
  { label: '伍万元整', val: '伍万元整' },
  { label: '常用发票金额', val: '壹万贰仟叁佰肆拾伍元陆角柒分' },
  { label: '纯角分', val: '壹角伍分' },
]

export const RmbUppercase: React.FC = () => {
  const [mode, setMode] = useState<Mode>('num-to-chinese')
  const [numInput, setNumInput] = useState('12345.67')
  const [chineseInput, setChineseInput] = useState('壹万贰仟叁佰肆拾伍元陆角柒分')

  const toChineseResult = useMemo(() => {
    return convertToRmbUppercase(numInput)
  }, [numInput])

  const toNumResult = useMemo(() => {
    return parseRmbUppercase(chineseInput)
  }, [chineseInput])

  return (
    <div className="space-y-6">
      {/* 模式切换 Tab */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('num-to-chinese')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'num-to-chinese'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            数字转大写 (标准财务)
          </button>
          <button
            type="button"
            onClick={() => setMode('chinese-to-num')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'chinese-to-num'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            大写转数字 (逆向核对)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMode((m) => (m === 'num-to-chinese' ? 'chinese-to-num' : 'num-to-chinese'))}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          快捷双向切换
        </button>
      </div>

      <Card className="p-6">
        {mode === 'num-to-chinese' ? (
          <div className="space-y-5">
            {/* 输入框 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="rmb-input" className="text-sm font-semibold text-slate-800">
                  输入阿拉伯数字金额 (元)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {NUM_PRESETS.map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setNumInput(p.val)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-semibold text-base pointer-events-none">
                  ¥
                </span>
                <input
                  id="rmb-input"
                  type="text"
                  value={numInput}
                  onChange={(e) => setNumInput(e.target.value.trim())}
                  placeholder="例如：1234.56"
                  className="w-full pl-8 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                />
              </div>
            </div>

            {/* 转换流向指示 */}
            <div className="flex justify-center -my-1 text-slate-400">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* 转换结果输出区 */}
            <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-primary-700 flex items-center gap-1.5">
                  {toChineseResult.success ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      标准财务中文大写
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      输入提示
                    </>
                  )}
                </span>
                {toChineseResult.success && (
                  <CopyButton
                    textToCopy={toChineseResult.result}
                    label="复制大写"
                    copiedLabel="已复制大写"
                    variant="primary"
                    size="sm"
                  />
                )}
              </div>

              <div className="min-h-[3rem] flex items-center">
                {toChineseResult.success ? (
                  <span className="text-xl sm:text-2xl font-bold tracking-wide text-slate-900 select-all">
                    {toChineseResult.result}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-600">{toChineseResult.error}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* 中文大写逆向输入框 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="chinese-input" className="text-sm font-semibold text-slate-800">
                  输入中文大写金额
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CHINESE_PRESETS.map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setChineseInput(p.val)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  id="chinese-input"
                  type="text"
                  value={chineseInput}
                  onChange={(e) => setChineseInput(e.target.value.trim())}
                  placeholder="例如：壹万贰仟叁佰肆拾伍元陆角柒分"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                />
              </div>
            </div>

            {/* 转换流向指示 */}
            <div className="flex justify-center -my-1 text-slate-400">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* 逆向转换结果输出区 */}
            <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-primary-700 flex items-center gap-1.5">
                  {toNumResult.success ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      解析阿拉伯数字金额
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      输入提示
                    </>
                  )}
                </span>
                {toNumResult.success && (
                  <div className="flex gap-2">
                    <CopyButton
                      textToCopy={toNumResult.value}
                      label="复制纯数字"
                      copiedLabel="已复制数字"
                      variant="primary"
                      size="sm"
                    />
                  </div>
                )}
              </div>

              <div className="min-h-[3rem] flex items-center">
                {toNumResult.success ? (
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 select-all">
                      {toNumResult.formatted}
                    </span>
                    <span className="text-sm font-mono text-slate-500">
                      (数值: {toNumResult.value})
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-red-600">{toNumResult.error}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
