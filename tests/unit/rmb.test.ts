import { describe, it, expect } from 'vitest';
import { convertToRmbUppercase } from '../../src/lib/number/rmbUppercase';

describe('RMB Uppercase Engine - Precision & Boundary Tests', () => {
  it('converts basic integers correctly', () => {
    expect(convertToRmbUppercase('0').result).toBe('零元整');
    expect(convertToRmbUppercase('1').result).toBe('壹元整');
    expect(convertToRmbUppercase('10').result).toBe('壹拾元整');
    expect(convertToRmbUppercase('100').result).toBe('壹佰元整');
    expect(convertToRmbUppercase('101').result).toBe('壹佰零壹元整');
    expect(convertToRmbUppercase('1001').result).toBe('壹仟零壹元整');
    expect(convertToRmbUppercase('10001').result).toBe('壹万零壹元整');
    expect(convertToRmbUppercase('100000').result).toBe('壹拾万元整');
    expect(convertToRmbUppercase('1000001').result).toBe('壹佰万零壹元整');
  });

  it('converts decimals (jiao and fen) correctly', () => {
    expect(convertToRmbUppercase('0.01').result).toBe('壹分');
    expect(convertToRmbUppercase('0.1').result).toBe('壹角');
    expect(convertToRmbUppercase('1.01').result).toBe('壹元零壹分');
    expect(convertToRmbUppercase('10.10').result).toBe('壹拾元壹角整');
    expect(convertToRmbUppercase('100.01').result).toBe('壹佰元零壹分');
    expect(convertToRmbUppercase('123.45').result).toBe('壹佰贰拾叁元肆角伍分');
  });

  it('handles negative amounts and large numbers correctly', () => {
    expect(convertToRmbUppercase('-50').result).toBe('负伍拾元整');
    expect(convertToRmbUppercase('100000000').result).toBe('壹亿元整');
    expect(convertToRmbUppercase('1000000000000').result).toBe('壹万亿元整');
  });

  it('renders exactly one 零 across empty 4-digit sections (cross-rank zeros)', () => {
    // 文档 §28 点名用例：亿位与个位之间跨空段，不得出现“零零”
    expect(convertToRmbUppercase('100000001').result).toBe('壹亿零壹元整');
    // 跨两个空段（亿 → 万 → 个）同样只保留一个“零”
    expect(convertToRmbUppercase('100000000001').result).toBe('壹仟亿零壹元整');
    // 空段后的非零开头段仍需补“零”，防止修复过度
    expect(convertToRmbUppercase('100001000').result).toBe('壹亿零壹仟元整');
    expect(convertToRmbUppercase('100010000').result).toBe('壹亿零壹万元整');
    expect(convertToRmbUppercase('1000000000001').result).toBe('壹万亿零壹元整');
  });

  it('rejects inputs with more than two decimal places instead of silently truncating', () => {
    // 财务零容错：第三位“厘”必须显式报错，禁止静默丢弃
    expect(convertToRmbUppercase('1.239').success).toBe(false);
    expect(convertToRmbUppercase('1.239').error).toContain('两位小数');
    expect(convertToRmbUppercase('100.999').success).toBe(false);
    // 两位及以内仍正常；多位尾随零（与两位小数等值）也应容忍
    expect(convertToRmbUppercase('1.230').result).toBe('壹元贰角叁分');
    expect(convertToRmbUppercase('1.200').result).toBe('壹元贰角整');
    expect(convertToRmbUppercase('0.01').result).toBe('壹分');
  });

  it('rejects amounts beyond the supported range', () => {
    // 整数超过 16 位（万亿级别上限）应报错
    expect(convertToRmbUppercase('10000000000000000').success).toBe(false);
  });

  it('rejects invalid inputs gracefully', () => {
    expect(convertToRmbUppercase('').success).toBe(false);
    expect(convertToRmbUppercase('abc').success).toBe(false);
    expect(convertToRmbUppercase('1.2.3').success).toBe(false);
    expect(convertToRmbUppercase('--1').success).toBe(false);
    expect(convertToRmbUppercase('1e3').success).toBe(false);
    expect(convertToRmbUppercase('NaN').success).toBe(false);
    expect(convertToRmbUppercase('Infinity').success).toBe(false);
  });
});
