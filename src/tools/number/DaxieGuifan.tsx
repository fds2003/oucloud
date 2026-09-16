import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import {
  validateDaxieRules,
  DAXIE_STANDARD_RULES,
} from '../../lib/number/daxieGuifan'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Scale,
  FileCheck,
} from 'lucide-react'

const STANDARD_CHARS = [
  { digit: '0', char: '零', pinyin: 'líng', taboo: '不得写成 〇 或 0' },
  { digit: '1', char: '壹', pinyin: 'yī', taboo: '不得写成 一' },
  { digit: '2', char: '贰', pinyin: 'èr', taboo: '不得写成 二 或 两' },
  { digit: '3', char: '叁', pinyin: 'sān', taboo: '不得写成 三 或 参' },
  { digit: '4', char: '肆', pinyin: 'sì', taboo: '不得写成 四' },
  { digit: '5', char: '伍', pinyin: 'wǔ', taboo: '不得写成 五' },
  { digit: '6', char: '陆', pinyin: 'lù', taboo: '不得写成 六' },
  { digit: '7', char: '柒', pinyin: 'qī', taboo: '不得写成 七' },
  { digit: '8', char: '捌', pinyin: 'bā', taboo: '不得写成 八' },
  { digit: '9', char: '玖', pinyin: 'jiǔ', taboo: '不得写成 九' },
  { digit: '10', char: '拾', pinyin: 'shí', taboo: '不得写成 十' },
  { digit: '100', char: '佰', pinyin: 'bǎi', taboo: '不得写成 百' },
  { digit: '1000', char: '仟', pinyin: 'qiān', taboo: '不得写成 千' },
  { digit: '10000', char: '万', pinyin: 'wàn', taboo: '常用规范字' },
  { digit: '10^8', char: '亿', pinyin: 'yì', taboo: '常用规范字' },
  { digit: '元', char: '元 (圆)', pinyin: 'yuán', taboo: '元与圆通用' },
  { digit: '角', char: '角', pinyin: 'jiǎo', taboo: '十分之一元' },
  { digit: '分', char: '分', pinyin: 'fēn', taboo: '百分之一元' },
]

const DEMO_TEST_CASES = [
  { label: '合规标准范例', val: '壹万贰仟叁佰肆拾伍元陆角柒分' },
  { label: '错写两 (违规)', val: '两万元整' },
  { label: '有分写整 (违规)', val: '壹佰元伍角叁分整' },
  { label: '到元未写整 (违规)', val: '壹佰元' },
  { label: '到角未写整 (提示)', val: '壹拾元伍角' },
]

export const DaxieGuifan: React.FC = () => {
  const [testInput, setTestInput] = useState('壹万贰仟叁佰肆拾伍元陆角柒分')

  const validationResult = useMemo(() => {
    return validateDaxieRules(testInput)
  }, [testInput])

  return (
    <div className="space-y-8">
      {/* 顶部互动自测合规检测器 */}
      <Card className="p-6 border-primary-200 bg-gradient-to-b from-white to-primary-50/30">
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-primary-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary-600" />
                大写金额合规性实时自检台 (央行规定核验)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                依据中国人民银行银发〔1997〕393号规定实时自动核验语法与错别字
              </p>
            </div>

            <Link
              to="/tools/number/rmb-uppercase"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              直接打开自动转换器
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="daxie-check-input" className="text-xs font-bold uppercase text-slate-700">
                输入待核验的大写汉字金额
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_TEST_CASES.map((demo) => (
                  <button
                    key={demo.label}
                    type="button"
                    onClick={() => setTestInput(demo.val)}
                    className="text-[11px] bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded transition-all shadow-2xs"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            <input
              id="daxie-check-input"
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="例如：壹佰元整 或 壹万贰仟元整"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs"
            />
          </div>

          {/* 核验结果反馈 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              validationResult.isValid
                ? 'border-emerald-200 bg-emerald-50/60'
                : 'border-rose-200 bg-rose-50/60'
            }`}
          >
            <div className="flex items-start gap-3">
              {validationResult.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <div className="text-sm font-bold">
                  {validationResult.isValid ? (
                    <span className="text-emerald-900">
                      经法规核验：该大写书写完全符合中国人民银行凭证规范！
                    </span>
                  ) : (
                    <span className="text-rose-900">
                      发现 {validationResult.errors.length} 处不符合法规规定的书写问题：
                    </span>
                  )}
                </div>

                {!validationResult.isValid && (
                  <ul className="list-disc list-inside text-xs text-rose-800 space-y-1">
                    {validationResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 pt-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{validationResult.warnings.join(' ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 标准大写字形与防伪错字对照 */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-600" />
            数字 0 到 10 及单位标准大写字形全览表
          </h2>
          <span className="text-xs text-slate-400">标准正楷字样防伪要求</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {STANDARD_CHARS.map((item) => (
            <div
              key={item.digit}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-center space-y-1 hover:border-primary-400 hover:bg-white transition-all shadow-2xs"
            >
              <div className="text-2xl font-extrabold text-slate-900 font-serif">{item.char}</div>
              <div className="text-[11px] font-mono text-primary-700 font-bold">{item.pinyin}</div>
              <div className="text-[10px] text-slate-400 font-mono">阿拉伯: {item.digit}</div>
              <div className="text-[10px] text-rose-600 pt-0.5 border-t border-slate-200/80">
                {item.taboo}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 央行官方四条核心规程深度剖析 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            中国人民银行《票据和结算凭证规定》四大核心要点
          </h2>
          <span className="text-xs text-slate-500 font-mono">银发〔1997〕393号</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DAXIE_STANDARD_RULES.map((rule) => (
            <Card key={rule.id} className="p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                    {rule.id.replace('rule-', '')}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{rule.title}</h3>
                </div>

                <p className="text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {rule.summary}
                </p>

                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  “{rule.officialClause}”
                </p>
              </div>

              {/* 经典范例表 */}
              <div className="pt-2 border-t border-slate-100">
                <table className="w-full text-[11px] text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100">
                      <th className="pb-1">常见写法</th>
                      <th className="pb-1">法定规范标准</th>
                      <th className="pb-1 text-right">规则说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rule.examples.map((eg, i) => (
                      <tr key={i}>
                        <td className="py-1 text-rose-500 font-mono">{eg.input}</td>
                        <td className="py-1 text-emerald-700 font-bold font-mono">{eg.correct}</td>
                        <td className="py-1 text-slate-400 text-right">{eg.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
