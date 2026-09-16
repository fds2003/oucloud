const CN_NUMS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const CN_UNITS = ['', '拾', '佰', '仟']
const CN_SECTION_UNITS = ['', '万', '亿', '万亿']

export interface RmbConversionResult {
  success: boolean
  result: string
  error?: string
}

/**
 * 将 4 位以内的整数段转换为中文大写（如 1234 -> 壹仟贰佰叁拾肆）
 */
function sectionToChinese(sectionStr: string): string {
  let res = ''
  let zeroFlag = false
  const len = sectionStr.length

  for (let i = 0; i < len; i++) {
    const n = parseInt(sectionStr[i], 10)
    const unitIndex = len - i - 1

    if (n === 0) {
      zeroFlag = true
    } else {
      if (zeroFlag) {
        res += '零'
        zeroFlag = false
      }
      res += CN_NUMS[n] + CN_UNITS[unitIndex]
    }
  }

  return res
}

/**
 * 人民币金额转大写（纯高精度字符串解析）
 */
export function convertToRmbUppercase(inputVal: string | number): RmbConversionResult {
  if (inputVal === null || inputVal === undefined) {
    return { success: false, result: '', error: '输入金额不能为空' }
  }

  let raw = String(inputVal).trim()
  if (!raw) {
    return { success: false, result: '', error: '输入金额不能为空' }
  }

  // 自动清洗常见前缀与千分位分隔符：例如 "¥", "￥", "$", "RMB", "，", ",", 内部空格
  raw = raw.replace(/[¥￥$RMBrmb\s,，]/g, '')
  if (!raw) {
    return { success: false, result: '', error: '输入金额不能为空' }
  }

  // 格式正则校验：支持可选前缀负号，整数或最多2位小数（支持多位输入但截断或提示）
  const match = raw.match(/^(-)?(\d*)(\.(\d+))?$/)
  if (!match || raw === '.' || raw === '-.' || raw === '-') {
    return { success: false, result: '', error: '请输入有效的合法数字金额' }
  }

  const isNegative = match[1] === '-'
  let integerPart = match[2].replace(/^0+/, '') // 去除前置0
  const decimalPart = match[4] || ''

  // 人民币最小单位为“分”：第三位（厘）非零时必须显式报错，禁止静默丢值；
  // 仅允许 1.230 这类第三位起全为尾随零的等值写法
  if (
    decimalPart.length > 2 &&
    decimalPart
      .slice(2)
      .split('')
      .some((ch) => ch !== '0')
  ) {
    return { success: false, result: '', error: '金额最多支持两位小数（精确到分），请检查输入' }
  }

  if (!integerPart && (!decimalPart || decimalPart.replace(/0+$/, '') === '')) {
    return { success: true, result: '零元整' }
  }

  if (integerPart.length > 16) {
    return { success: false, result: '', error: '金额超出最大支持范围（上限为万亿级别）' }
  }

  let chineseStr = isNegative ? '负' : ''

  // 处理整数部分
  if (integerPart) {
    let intResult = ''
    // 从低位到高位，每 4 位切分一个 section
    const sections: string[] = []
    while (integerPart.length > 0) {
      const start = Math.max(0, integerPart.length - 4)
      sections.unshift(integerPart.slice(start))
      integerPart = integerPart.slice(0, start)
    }

    let zeroSectionFlag = false
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i]
      const secUnitIndex = sections.length - 1 - i
      const secCh = sectionToChinese(sec)

      if (secCh) {
        // 跨空段需补“零”，但当前段自身以“零”开头（段内前导零）时不得重复补零，
        // 否则 1,0000,0001 会被误写成“壹亿零零壹元整”
        if (zeroSectionFlag && !intResult.endsWith('零') && !secCh.startsWith('零')) {
          intResult += '零'
        }
        intResult += secCh + CN_SECTION_UNITS[secUnitIndex]
        zeroSectionFlag = false
      } else {
        if (intResult.length > 0) {
          zeroSectionFlag = true
        }
      }
    }

    chineseStr += intResult + '元'
  }

  // 处理小数部分（角、分）
  const jiao = decimalPart.length > 0 ? parseInt(decimalPart[0], 10) : 0
  const fen = decimalPart.length > 1 ? parseInt(decimalPart[1], 10) : 0

  if (jiao === 0 && fen === 0) {
    if (integerPart || chineseStr) {
      chineseStr += '整'
    } else {
      chineseStr = '零元整'
    }
  } else {
    // 只有小数没有整数时
    if (!integerPart && !chineseStr.replace('负', '')) {
      if (jiao > 0) {
        chineseStr += CN_NUMS[jiao] + '角'
      }
      if (fen > 0) {
        chineseStr += CN_NUMS[fen] + '分'
      }
    } else {
      if (jiao > 0) {
        chineseStr += CN_NUMS[jiao] + '角'
      } else if (fen > 0) {
        chineseStr += '零'
      }

      if (fen > 0) {
        chineseStr += CN_NUMS[fen] + '分'
      } else {
        chineseStr += '整'
      }
    }
  }

  return {
    success: true,
    result: chineseStr,
  }
}

export interface RmbParseResult {
  success: boolean
  value: string // 纯数字，如 "12345.67"
  formatted: string // 带千分位与货币符号，如 "¥ 12,345.67"
  error?: string
}

const DIGIT_MAP: Record<string, number> = {
  零: 0,
  〇: 0,
  壹: 1,
  一: 1,
  贰: 2,
  两: 2,
  二: 2,
  叁: 3,
  三: 3,
  肆: 4,
  四: 4,
  伍: 5,
  五: 5,
  陆: 6,
  六: 6,
  柒: 7,
  七: 7,
  捌: 8,
  八: 8,
  玖: 9,
  九: 9,
}

/**
 * 解析一万以内的中文数字段（如“壹仟贰佰叁拾肆” -> 1234n）
 */
function parseSmallSection(sectionStr: string): bigint {
  let sectionVal = 0n
  let currentDigit: bigint | null = null

  for (let i = 0; i < sectionStr.length; i++) {
    const ch = sectionStr[i]

    if (ch in DIGIT_MAP) {
      currentDigit = BigInt(DIGIT_MAP[ch])
    } else if (ch === '仟' || ch === '千') {
      const d = currentDigit ?? 1n
      sectionVal += d * 1000n
      currentDigit = null
    } else if (ch === '佰' || ch === '百') {
      const d = currentDigit ?? 1n
      sectionVal += d * 100n
      currentDigit = null
    } else if (ch === '拾' || ch === '十') {
      const d = currentDigit ?? 1n
      sectionVal += d * 10n
      currentDigit = null
    }
  }

  if (currentDigit !== null) {
    sectionVal += currentDigit
  }

  return sectionVal
}

/**
 * 解析任意万级/亿级中文大写整数字符串
 */
function parseChineseInteger(chineseStr: string): bigint {
  if (!chineseStr || chineseStr === '零') return 0n

  let remaining = chineseStr

  // 先处理“亿”或“億”
  let total = 0n
  const yiParts = remaining.split(/[亿億]/)
  if (yiParts.length > 1) {
    const high = parseChineseInteger(yiParts[0])
    total += high * 100000000n
    remaining = yiParts.slice(1).join('')
  }

  // 再处理“万”或“萬”
  const wanParts = remaining.split(/[万萬]/)
  if (wanParts.length > 1) {
    const wan = parseSmallSection(wanParts[0])
    total += wan * 10000n
    remaining = wanParts.slice(1).join('')
  }

  // 剩余千/百/十/个位
  total += parseSmallSection(remaining)
  return total
}

/**
 * 将中文大写金额逆向转换为阿拉伯数字
 */
export function parseRmbUppercase(input: string): RmbParseResult {
  if (!input || typeof input !== 'string') {
    return { success: false, value: '', formatted: '', error: '输入内容不能为空' }
  }

  let text = input.trim().replace(/^人民币[:：\s]*/, '')
  if (!text) {
    return { success: false, value: '', formatted: '', error: '输入内容不能为空' }
  }

  const isNegative = text.startsWith('负')
  if (isNegative) {
    text = text.slice(1).trim()
  }

  // 去除末尾的“整”或“正”
  text = text.replace(/[整正]$/, '').trim()

  if (text === '零元' || text === '零' || text === '') {
    return {
      success: true,
      value: '0.00',
      formatted: '¥ 0.00',
    }
  }

  // 拆分元角分
  let intPartStr = ''
  let decimalPartStr = ''

  const yuanIndex = text.search(/[元圆]/)
  if (yuanIndex !== -1) {
    intPartStr = text.slice(0, yuanIndex)
    decimalPartStr = text.slice(yuanIndex + 1)
  } else {
    // 检查是否纯角分（例如：伍角、捌分）
    const hasJiao = text.includes('角')
    const hasFen = text.includes('分')
    if (hasJiao || hasFen) {
      intPartStr = ''
      decimalPartStr = text
    } else {
      // 默认全为整数
      intPartStr = text
      decimalPartStr = ''
    }
  }

  let integerVal = 0n
  if (intPartStr) {
    try {
      integerVal = parseChineseInteger(intPartStr)
    } catch {
      return { success: false, value: '', formatted: '', error: '无法解析大写金额的整数部分' }
    }
  }

  // 解析角与分
  let jiao = 0
  let fen = 0

  if (decimalPartStr) {
    const jiaoMatch = decimalPartStr.match(/([零〇壹一贰两二叁三肆四伍五陆六柒七捌八玖九])角/)
    if (jiaoMatch) {
      jiao = DIGIT_MAP[jiaoMatch[1]] ?? 0
    }
    const fenMatch = decimalPartStr.match(/([零〇壹一贰两二叁三肆四伍五陆六柒七捌八玖九])分/)
    if (fenMatch) {
      fen = DIGIT_MAP[fenMatch[1]] ?? 0
    }
  }

  const sign = isNegative ? '-' : ''
  const intStr = integerVal.toString()
  const centsStr = `${jiao}${fen}`
  const value = `${sign}${intStr}.${centsStr}`

  // 格式化千分位
  const formattedInt = intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = `${sign ? '- ' : ''}¥ ${formattedInt}.${centsStr}`

  return {
    success: true,
    value,
    formatted,
  }
}
