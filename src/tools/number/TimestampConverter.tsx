import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '../../components/common/Card'
import { CopyButton } from '../../components/common/CopyButton'
import { Button } from '../../components/common/Button'
import {
  parseTimestampToDate,
  formatDateToString,
  parseDateStringToTimestamp,
  formatRelativeTime,
  TimestampUnit,
} from '../../lib/number/timestamp'
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Code2,
  Globe,
} from 'lucide-react'

type Mode = 'ts-to-date' | 'date-to-ts'

const CODE_EXAMPLES = [
  { lang: 'JavaScript', code: 'Math.floor(Date.now() / 1000)' },
  { lang: 'Python', code: 'import time\nint(time.time())' },
  { lang: 'Go', code: 'time.Now().Unix()' },
  { lang: 'PHP', code: 'time()' },
  { lang: 'Java', code: 'System.currentTimeMillis() / 1000' },
  { lang: 'MySQL', code: 'SELECT UNIX_TIMESTAMP();' },
]

export const TimestampConverter: React.FC = () => {
  // 当前实时走字时间戳。
  // 初始值必须为 null：new Date() 在 SSG 预渲染 (Node) 与客户端 hydrate 两次执行结果
  // 必然不同，直接初始化会导致首帧 DOM 不一致，触发 React #418 整页回退。
  // 挂载后再注入真实时间，首帧两侧一致渲染占位符。
  const [now, setNow] = useState<Date | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // 模式与输入。tsInput/dateInput 同理不能在初始化时读时钟，
  // 用固定示例值保证 SSR 与 hydrate 首帧字节级一致，挂载后无缝替换为当前时间。
  const [mode, setMode] = useState<Mode>('ts-to-date')
  const [tsInput, setTsInput] = useState('1700000000')
  const [tsUnit, setTsUnit] = useState<TimestampUnit>('s')

  const [dateInput, setDateInput] = useState('')
  const [timezoneOffset, setTimezoneOffset] = useState<number>(8)

  // 挂载后注入时间相关真实值
  useEffect(() => {
    setNow(new Date())
    setTsInput(String(Math.floor(Date.now() / 1000)))
    setDateInput(formatDateToString(new Date(), 8))
  }, [])

  // 走字定时器
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  const currentSeconds = now ? Math.floor(now.getTime() / 1000) : '—'
  const currentMillis = now ? now.getTime() : '—'

  // 1. 时间戳转日期时间解析
  const parsedDate = useMemo(() => {
    return parseTimestampToDate(tsInput, tsUnit)
  }, [tsInput, tsUnit])

  const beijingTimeStr = useMemo(() => {
    return parsedDate ? formatDateToString(parsedDate, 8) : ''
  }, [parsedDate])

  const utcTimeStr = useMemo(() => {
    return parsedDate ? formatDateToString(parsedDate, 0) : ''
  }, [parsedDate])

  const isoTimeStr = useMemo(() => {
    return parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : ''
  }, [parsedDate])

  const relativeTimeStr = useMemo(() => {
    return parsedDate && now ? formatRelativeTime(parsedDate, now) : ''
  }, [parsedDate, now])

  // 2. 日期时间转时间戳解析
  const parsedTimestamp = useMemo(() => {
    return parseDateStringToTimestamp(dateInput, timezoneOffset)
  }, [dateInput, timezoneOffset])

  const handleFillCurrentTs = () => {
    setTsInput(String(Math.floor(Date.now() / 1000)))
    setTsUnit('s')
  }

  const handleFillCurrentDate = () => {
    setDateInput(formatDateToString(new Date(), timezoneOffset))
  }

  return (
    <div className="space-y-6">
      {/* 顶部：实时 Unix 时间戳心跳卡片 */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 border border-primary-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                当前实时 Unix 时间戳 (Live Timestamp)
              </span>
              <div className="flex flex-wrap items-baseline gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 select-all">
                    {currentSeconds}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">秒 (10位)</span>
                  <CopyButton
                    textToCopy={String(currentSeconds)}
                    label=""
                    copiedLabel="已复制"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-700 h-7 px-2"
                  />
                </div>

                <div className="flex items-center gap-2 border-l border-slate-700/80 pl-4">
                  <span className="text-lg font-bold font-mono text-sky-400 select-all">
                    {currentMillis}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">毫秒 (13位)</span>
                  <CopyButton
                    textToCopy={String(currentMillis)}
                    label=""
                    copiedLabel="已复制"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-700 h-7 px-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused((p) => !p)}
              className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? '恢复走字' : '暂停走字'}
            </Button>
          </div>
        </div>
      </Card>

      {/* 模式选择 Tab */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('ts-to-date')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'ts-to-date'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            时间戳转日期时间 (Timestamp → Date)
          </button>
          <button
            type="button"
            onClick={() => setMode('date-to-ts')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === 'date-to-ts'
                ? 'bg-white text-primary-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            日期时间转时间戳 (Date → Timestamp)
          </button>
        </div>
      </div>

      <Card className="p-6">
        {mode === 'ts-to-date' ? (
          /* 时间戳转日期时间 */
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="ts-input" className="text-sm font-semibold text-slate-800">
                  输入 Unix 时间戳 (秒或毫秒)
                </label>
                <button
                  type="button"
                  onClick={handleFillCurrentTs}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> 填入当前时间戳
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  id="ts-input"
                  type="text"
                  value={tsInput}
                  onChange={(e) => setTsInput(e.target.value.trim())}
                  placeholder="例如：1700000000"
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs"
                />

                <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setTsUnit('s')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      tsUnit === 's'
                        ? 'bg-white text-primary-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    秒 (10位)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTsUnit('ms')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      tsUnit === 'ms'
                        ? 'bg-white text-primary-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    毫秒 (13位)
                  </button>
                </div>
              </div>
            </div>

            {/* 转换结果输出区 */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-primary-100 pb-3">
                <span className="text-xs font-bold uppercase text-primary-800 flex items-center gap-1.5">
                  {parsedDate ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      转换输出成功
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      时间戳输入提示
                    </>
                  )}
                </span>
                {parsedDate && (
                  <span className="text-xs text-slate-500 font-medium">
                    相对时间：<span className="font-bold text-slate-800">{relativeTimeStr}</span>
                  </span>
                )}
              </div>

              {parsedDate ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-primary-100 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-primary-600" />
                        北京时间 (UTC+8)
                      </span>
                      <CopyButton textToCopy={beijingTimeStr} size="sm" toolId="timestamp-converter" />
                    </div>
                    <div className="text-xl font-bold font-mono text-slate-900 select-all">
                      {beijingTimeStr}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-primary-100 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        标准世界时 (UTC / GMT 0)
                      </span>
                      <CopyButton textToCopy={utcTimeStr} size="sm" toolId="timestamp-converter" />
                    </div>
                    <div className="text-xl font-bold font-mono text-slate-700 select-all">
                      {utcTimeStr}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-primary-100 shadow-2xs space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">ISO 8601 标准字符串</span>
                      <CopyButton textToCopy={isoTimeStr} size="sm" toolId="timestamp-converter" />
                    </div>
                    <div className="text-base font-mono text-slate-800 select-all">{isoTimeStr}</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-red-600 py-2">
                  请输入合法的数字时间戳（如 10 位秒或 13 位毫秒）
                </p>
              )}
            </div>
          </div>
        ) : (
          /* 日期时间转时间戳 */
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="date-input" className="text-sm font-semibold text-slate-800">
                  输入日期时间字符串 (格式如 YYYY-MM-DD HH:mm:ss)
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={timezoneOffset}
                    onChange={(e) => setTimezoneOffset(Number(e.target.value))}
                    className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:outline-none"
                  >
                    <option value={8}>输入为北京时间 (UTC+8)</option>
                    <option value={0}>输入为 UTC 时间 (GMT 0)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleFillCurrentDate}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> 填入当前时间
                  </button>
                </div>
              </div>

              <input
                id="date-input"
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="例如：2026-09-16 18:30:00"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs"
              />
            </div>

            {/* 转换时间戳输出 */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-primary-100 pb-3">
                <span className="text-xs font-bold uppercase text-primary-800 flex items-center gap-1.5">
                  {parsedTimestamp ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      时间戳计算成功
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      日期格式提示
                    </>
                  )}
                </span>
              </div>

              {parsedTimestamp ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-primary-100 shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">秒级时间戳 (10 位)</span>
                      <span className="text-2xl font-bold font-mono text-slate-900 select-all">
                        {parsedTimestamp.s}
                      </span>
                    </div>
                    <CopyButton
                      textToCopy={String(parsedTimestamp.s)}
                      label="复制秒"
                      copiedLabel="已复制"
                      variant="primary"
                      size="sm"
                      toolId="timestamp-converter"
                    />
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-primary-100 shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">毫秒级时间戳 (13 位)</span>
                      <span className="text-2xl font-bold font-mono text-slate-900 select-all">
                        {parsedTimestamp.ms}
                      </span>
                    </div>
                    <CopyButton
                      textToCopy={String(parsedTimestamp.ms)}
                      label="复制毫秒"
                      copiedLabel="已复制"
                      variant="primary"
                      size="sm"
                      toolId="timestamp-converter"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-red-600 py-2">
                  日期解析失败，请检查格式是否为标准 YYYY-MM-DD HH:mm:ss
                </p>
              )}
            </div>
          </div>
        )}

        {/* 底部代码范例与速查 */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-primary-600" />
            各编程语言获取当前时间戳 (秒) 常见写法
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CODE_EXAMPLES.map((item) => (
              <div
                key={item.lang}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{item.lang}</span>
                  <CopyButton textToCopy={item.code} size="sm" className="h-6 text-[10px] px-1.5" />
                </div>
                <pre className="text-[11px] font-mono text-slate-800 bg-white p-2 rounded border border-slate-200/80 overflow-x-auto">
                  {item.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
