/**
 * Unix 时间戳运算与格式化引擎
 */

export type TimestampUnit = 's' | 'ms'

/**
 * 将时间戳解析为标准 Date 对象（支持 10 位秒级与 13 位毫秒级自适应识别）
 */
export function parseTimestampToDate(
  input: string | number | null | undefined,
  unit?: TimestampUnit
): Date | null {
  if (input === null || input === undefined) return null

  const str = String(input).trim()
  if (!str) return null

  // 纯数字时间戳
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    const num = Number(str)
    if (isNaN(num)) return null

    // 显式指定单位
    if (unit === 's') {
      const d = new Date(num * 1000)
      return isNaN(d.getTime()) ? null : d
    }
    if (unit === 'ms') {
      const d = new Date(num)
      return isNaN(d.getTime()) ? null : d
    }

    // 自适应识别：以 100 亿（10位秒级最大范围）为阈值
    if (Math.abs(num) < 10000000000) {
      const d = new Date(num * 1000)
      return isNaN(d.getTime()) ? null : d
    } else {
      const d = new Date(num)
      return isNaN(d.getTime()) ? null : d
    }
  }

  // 尝试按标准日期字符串解析
  const parsed = new Date(str)
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * 双位补零格式化
 */
function padZero(num: number): string {
  return num < 10 ? `0${num}` : String(num)
}

/**
 * 将 Date 对象格式化为指定时区的 YYYY-MM-DD HH:mm:ss 字符串
 * @param timezoneOffset 时区偏移小时数（例如 +8 代表北京时间，0 代表 UTC）
 */
export function formatDateToString(date: Date, timezoneOffset?: number): string {
  if (isNaN(date.getTime())) return ''

  if (timezoneOffset !== undefined) {
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60000
    const targetDate = new Date(utcMs + timezoneOffset * 3600000)
    const y = targetDate.getFullYear()
    const m = padZero(targetDate.getMonth() + 1)
    const d = padZero(targetDate.getDate())
    const h = padZero(targetDate.getHours())
    const min = padZero(targetDate.getMinutes())
    const s = padZero(targetDate.getSeconds())
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }

  const y = date.getFullYear()
  const m = padZero(date.getMonth() + 1)
  const d = padZero(date.getDate())
  const h = padZero(date.getHours())
  const min = padZero(date.getMinutes())
  const s = padZero(date.getSeconds())
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

/**
 * 将可读日期时间字符串解析为秒级与毫秒级时间戳
 */
export function parseDateStringToTimestamp(
  dateStr: string,
  timezoneOffset?: number
): { s: number; ms: number } | null {
  const clean = dateStr.trim()
  if (!clean) return null

  // 匹配常见的 YYYY-MM-DD HH:mm:ss 格式
  const match = clean.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2}):(\d{1,2}))?/
  )

  if (match && timezoneOffset !== undefined) {
    const y = parseInt(match[1], 10)
    const m = parseInt(match[2], 10) - 1
    const d = parseInt(match[3], 10)
    const h = match[4] ? parseInt(match[4], 10) : 0
    const min = match[5] ? parseInt(match[5], 10) : 0
    const s = match[6] ? parseInt(match[6], 10) : 0

    // 将指定时区的时间转换为对应时刻的 UTC 毫秒数
    const utcMs = Date.UTC(y, m, d, h - timezoneOffset, min, s)
    if (isNaN(utcMs)) return null
    return {
      s: Math.floor(utcMs / 1000),
      ms: utcMs,
    }
  }

  const d = new Date(clean)
  if (isNaN(d.getTime())) return null
  const ms = d.getTime()
  return {
    s: Math.floor(ms / 1000),
    ms,
  }
}

/**
 * 将 Date 对象提取为时间戳数值
 */
export function formatDateToTimestamp(date: Date | string, unit: TimestampUnit): number | null {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return null
  return unit === 's' ? Math.floor(d.getTime() / 1000) : d.getTime()
}

/**
 * 计算相对人性化时间描述
 */
export function formatRelativeTime(date: Date, baseDate: Date = new Date()): string {
  const diffSec = Math.floor((baseDate.getTime() - date.getTime()) / 1000)

  if (diffSec < 30) return '刚刚'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} 分钟前`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} 小时前`
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} 天前`
  if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)} 个月前`
  return `${Math.floor(diffSec / 31536000)} 年前`
}
