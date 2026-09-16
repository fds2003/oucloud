/**
 * 人民币大写规范条文与合规性校验引擎
 * 遵循中国人民银行《正确填写票据和结算凭证的基本规定》（银发〔1997〕393号）
 */

export interface DaxieValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  cleanText: string
}

export interface DaxieRuleItem {
  id: string
  title: string
  summary: string
  officialClause: string
  examples: Array<{ input: string; correct: string; note: string }>
}

const COMMON_TYPOS: Record<string, string> = {
  两: '贰',
  一: '壹',
  二: '贰',
  三: '叁',
  四: '肆',
  五: '伍',
  六: '陆',
  七: '柒',
  八: '捌',
  九: '玖',
  十: '拾',
  百: '佰',
  千: '仟',
  〇: '零',
}

export function validateDaxieRules(input: string): DaxieValidationResult {
  const cleanText = input.trim()
  const errors: string[] = []
  const warnings: string[] = []

  if (!cleanText) {
    return { isValid: false, errors: ['输入内容不能为空'], warnings: [], cleanText }
  }

  // 1. 检查是否存在阿拉伯数字
  if (/\d/.test(cleanText)) {
    errors.push('大写金额中不得夹杂阿拉伯数字，请转换为标准大写汉字。')
  }

  // 2. 检查常见错别字（如将“贰”写成“两”、“零”写成“〇”）
  for (const [typo, fix] of Object.entries(COMMON_TYPOS)) {
    if (cleanText.includes(typo)) {
      errors.push(`检测到错别字或非标准字“${typo}”，根据规范应书写为“${fix}”。`)
    }
  }

  // 3. 检查“整”或“正”的使用规范
  const hasZheng = cleanText.endsWith('整') || cleanText.endsWith('正')
  const hasFen = cleanText.includes('分')
  const hasJiao = cleanText.includes('角')
  const hasYuan = cleanText.includes('元') || cleanText.includes('圆')

  // 有“分”的，分后面不写“整”（或“正”）字
  if (hasFen && hasZheng) {
    errors.push('中文大写金额数字有“分”的，“分”后面不写“整”（或“正”）字。')
  }

  // 中文大写金额数字到“元”为止的，在“元”之后应写“整”（或“正”）字
  if (hasYuan && !hasJiao && !hasFen && !hasZheng) {
    errors.push('中文大写金额数字到“元”为止的，在“元”之后应写“整”（或“正”）字。')
  }

  // 到“角”为止的，在“角”之后可以不写“整”（或“正”）字，如果没写给提示但不是硬性错误
  if (hasJiao && !hasFen && !hasZheng) {
    warnings.push('大写金额到“角”为止的，“整”字可写可不写；商务合同中建议补写“整”以防篡改。')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    cleanText,
  }
}

export const DAXIE_STANDARD_RULES: DaxieRuleItem[] = [
  {
    id: 'rule-1',
    title: '标准汉字大写数字写法',
    summary: '大写数字必须使用正楷或行书标准规范字，严禁简化或错写。',
    officialClause:
      '中文大写金额数字应用正楷或行书填写，如壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿、元、角、分、零、整（正）等字样。',
    examples: [
      { input: '两万元整', correct: '贰万元整', note: '不得以“两”代“贰”' },
      { input: '〇元整', correct: '零元整', note: '不得以“〇”代“零”' },
    ],
  },
  {
    id: 'rule-2',
    title: '“整”或“正”字的使用规则',
    summary: '到“元”必写“整”，到“角”可选写，有“分”不得写。',
    officialClause:
      '中文大写金额数字到“元”为止的，在“元”之后应写“整”（或“正”）字；在“角”之后可以不写“整”（或“正”）字；大写金额数字有“分”的，“分”后面不写“整”（或“正”）字。',
    examples: [
      { input: '￥100.00', correct: '人民币壹佰元整', note: '到“元”必须有“整”' },
      { input: '￥10.50', correct: '人民币壹拾元伍角整 (或不带整)', note: '到“角”可选' },
      { input: '￥100.53', correct: '人民币壹佰元伍角叁分', note: '有“分”禁止写“整”' },
    ],
  },
  {
    id: 'rule-3',
    title: '大写“零”的连续与空位处理规则',
    summary: '阿拉伯数字中间有“0”时，中文大写金额需严谨补“零”。',
    officialClause:
      '阿拉伯数字中间有“0”时，中文大写金额要写“零”字；阿拉伯数字中间连续有几个“0”时，中文大写金额中只写一个“零”字。',
    examples: [
      { input: '￥10,005.00', correct: '人民币壹万零伍元整', note: '连续0只写一个零' },
      { input: '￥1,000,000.00', correct: '人民币壹佰万元整', note: '万位以上连续进位' },
    ],
  },
  {
    id: 'rule-4',
    title: '角分位为 0 时的书写规范',
    summary: '角位为零且分位非零时，元与分之间必须补“零”。',
    officialClause:
      '阿拉伯金额数字角位是“0”而分位不是“0”时，中文大写金额“元”后面应写“零”字。',
    examples: [
      { input: '￥100.03', correct: '人民币壹佰元零叁分', note: '角位为0需补零' },
      { input: '￥0.05', correct: '人民币伍分', note: '无整数时直接写分' },
    ],
  },
]
