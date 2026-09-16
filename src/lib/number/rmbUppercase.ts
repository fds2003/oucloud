const CN_NUMS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const CN_UNITS = ['', '拾', '佰', '仟'];
const CN_SECTION_UNITS = ['', '万', '亿', '万亿'];

export interface RmbConversionResult {
  success: boolean;
  result: string;
  error?: string;
}

/**
 * 将 4 位以内的整数段转换为中文大写（如 1234 -> 壹仟贰佰叁拾肆）
 */
function sectionToChinese(sectionStr: string): string {
  let res = '';
  let zeroFlag = false;
  const len = sectionStr.length;

  for (let i = 0; i < len; i++) {
    const n = parseInt(sectionStr[i], 10);
    const unitIndex = len - i - 1;

    if (n === 0) {
      zeroFlag = true;
    } else {
      if (zeroFlag) {
        res += '零';
        zeroFlag = false;
      }
      res += CN_NUMS[n] + CN_UNITS[unitIndex];
    }
  }

  return res;
}

/**
 * 人民币金额转大写（纯高精度字符串解析）
 */
export function convertToRmbUppercase(inputVal: string | number): RmbConversionResult {
  if (inputVal === null || inputVal === undefined) {
    return { success: false, result: '', error: '输入金额不能为空' };
  }

  const raw = String(inputVal).trim();
  if (!raw) {
    return { success: false, result: '', error: '输入金额不能为空' };
  }

  // 格式正则校验：支持可选前缀负号，整数或最多2位小数（支持多位输入但截断或提示）
  const match = raw.match(/^(-)?(\d*)(\.(\d+))?$/);
  if (!match || raw === '.' || raw === '-.' || raw === '-') {
    return { success: false, result: '', error: '请输入有效的合法数字金额' };
  }

  const isNegative = match[1] === '-';
  let integerPart = match[2].replace(/^0+/, ''); // 去除前置0
  const decimalPart = match[4] || '';

  if (!integerPart && (!decimalPart || decimalPart.replace(/0+$/, '') === '')) {
    return { success: true, result: '零元整' };
  }

  if (integerPart.length > 16) {
    return { success: false, result: '', error: '金额超出最大支持范围（上限为万亿级别）' };
  }

  let chineseStr = isNegative ? '负' : '';

  // 处理整数部分
  if (integerPart) {
    let intResult = '';
    // 从低位到高位，每 4 位切分一个 section
    const sections: string[] = [];
    while (integerPart.length > 0) {
      const start = Math.max(0, integerPart.length - 4);
      sections.unshift(integerPart.slice(start));
      integerPart = integerPart.slice(0, start);
    }

    let zeroSectionFlag = false;
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const secUnitIndex = sections.length - 1 - i;
      const secCh = sectionToChinese(sec);

      if (secCh) {
        if (zeroSectionFlag && !intResult.endsWith('零')) {
          intResult += '零';
        }
        intResult += secCh + CN_SECTION_UNITS[secUnitIndex];
        zeroSectionFlag = false;
      } else {
        if (intResult.length > 0) {
          zeroSectionFlag = true;
        }
      }
    }

    chineseStr += intResult + '元';
  }

  // 处理小数部分（角、分）
  const jiao = decimalPart.length > 0 ? parseInt(decimalPart[0], 10) : 0;
  const fen = decimalPart.length > 1 ? parseInt(decimalPart[1], 10) : 0;

  if (jiao === 0 && fen === 0) {
    if (integerPart || chineseStr) {
      chineseStr += '整';
    } else {
      chineseStr = '零元整';
    }
  } else {
    // 只有小数没有整数时
    if (!integerPart && !chineseStr.replace('负', '')) {
      if (jiao > 0) {
        chineseStr += CN_NUMS[jiao] + '角';
      }
      if (fen > 0) {
        chineseStr += CN_NUMS[fen] + '分';
      }
    } else {
      if (jiao > 0) {
        chineseStr += CN_NUMS[jiao] + '角';
      } else if (fen > 0) {
        chineseStr += '零';
      }

      if (fen > 0) {
        chineseStr += CN_NUMS[fen] + '分';
      } else {
        chineseStr += '整';
      }
    }
  }

  return {
    success: true,
    result: chineseStr,
  };
}
