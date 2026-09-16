import { describe, it, expect } from 'vitest';
import { convertToRmbUppercase, parseRmbUppercase } from '../../src/lib/number/rmbUppercase';

describe('RMB Uppercase Engine - 完整边界与精度测试', () => {
  describe('基本整数转换', () => {
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

    it('handles leading zeros correctly', () => {
      expect(convertToRmbUppercase('00123').result).toBe('壹佰贰拾叁元整');
      expect(convertToRmbUppercase('0001').result).toBe('壹元整');
      expect(convertToRmbUppercase('0').result).toBe('零元整');
    });
  });

  describe('小数转换 (角分)', () => {
    it('converts decimals correctly', () => {
      expect(convertToRmbUppercase('0.01').result).toBe('壹分');
      expect(convertToRmbUppercase('0.1').result).toBe('壹角');
      expect(convertToRmbUppercase('1.01').result).toBe('壹元零壹分');
      expect(convertToRmbUppercase('10.10').result).toBe('壹拾元壹角整');
      expect(convertToRmbUppercase('100.01').result).toBe('壹佰元零壹分');
      expect(convertToRmbUppercase('123.45').result).toBe('壹佰贰拾叁元肆角伍分');
    });

    it('handles edge case .5 correctly', () => {
      const result = convertToRmbUppercase('.5');
      expect(result.success).toBe(true);
      expect(result.result).toBe('伍角');
    });

    it('handles decimal with leading zero correctly', () => {
      const result = convertToRmbUppercase('0.5');
      expect(result.success).toBe(true);
      expect(result.result).toBe('伍角');
    });
  });

  describe('大数与负数', () => {
    it('handles large numbers correctly', () => {
      expect(convertToRmbUppercase('100000000').result).toBe('壹亿元整');
      expect(convertToRmbUppercase('1000000000000').result).toBe('壹万亿元整');
    });

    it('handles negative amounts', () => {
      expect(convertToRmbUppercase('-50').result).toBe('负伍拾元整');
      expect(convertToRmbUppercase('-123.45').result).toBe('负壹佰贰拾叁元肆角伍分');
    });
  });

  describe('输入验证', () => {
    it('rejects empty and null inputs', () => {
      expect(convertToRmbUppercase('').success).toBe(false);
      expect(convertToRmbUppercase('abc').success).toBe(false);
      expect(convertToRmbUppercase('1.2.3').success).toBe(false);
      expect(convertToRmbUppercase('--1').success).toBe(false);
      expect(convertToRmbUppercase('..').success).toBe(false);
      expect(convertToRmbUppercase('.').success).toBe(false);
      expect(convertToRmbUppercase('-').success).toBe(false);
    });

    it('rejects excessively large numbers', () => {
      const largeNum = '1'.repeat(17); // 超过万亿
      expect(convertToRmbUppercase(largeNum).success).toBe(false);
    });

    it('handles whitespace and trailing zeros', () => {
      expect(convertToRmbUppercase(' 123 ').result).toBe('壹佰贰拾叁元整');
      expect(convertToRmbUppercase('100.00').result).toBe('壹佰元整');
      expect(convertToRmbUppercase('10.10').result).toBe('壹拾元壹角整');
    });

    it('handles commas and currency symbols gracefully', () => {
      expect(convertToRmbUppercase('¥12,345.67').result).toBe('壹万贰仟叁佰肆拾伍元陆角柒分');
      expect(convertToRmbUppercase('￥ 100,000.00').result).toBe('壹拾万元整');
      expect(convertToRmbUppercase('1,000.5').result).toBe('壹仟元伍角整');
      expect(convertToRmbUppercase('$ 50,000').result).toBe('伍万元整');
    });
  });

  describe('财务规范边界', () => {
    it('adds 整 correctly for yuan-only amounts', () => {
      expect(convertToRmbUppercase('100').result).toBe('壹佰元整');
      expect(convertToRmbUppercase('50000').result).toBe('伍万元整');
    });

    it('does not add 整 when fen exists', () => {
      expect(convertToRmbUppercase('1.01').result).toBe('壹元零壹分');
      expect(convertToRmbUppercase('100.01').result).toBe('壹佰元零壹分');
    });

    it('handles 角 without 整 correctly', () => {
      // 财务规范：有整数部分 + 只有角无分时，"角"后写"整"
      expect(convertToRmbUppercase('1.1').result).toBe('壹元壹角整');
      // 纯小数（无整数部分）不写"整"
      expect(convertToRmbUppercase('0.1').result).toBe('壹角');
    });
  });

  describe('大写金额逆向转换 (大写转小写数字)', () => {
    it('正确逆向解析常规大写金额', () => {
      expect(parseRmbUppercase('壹佰贰拾叁元肆角伍分').value).toBe('123.45');
      expect(parseRmbUppercase('壹佰贰拾叁元肆角伍分').formatted).toBe('¥ 123.45');

      expect(parseRmbUppercase('伍万元整').value).toBe('50000.00');
      expect(parseRmbUppercase('伍万元整').formatted).toBe('¥ 50,000.00');

      expect(parseRmbUppercase('壹仟零伍拾元零捌分').value).toBe('1050.08');
      expect(parseRmbUppercase('零元整').value).toBe('0.00');
    });

    it('兼容简繁体及前缀写法', () => {
      expect(parseRmbUppercase('人民币伍万圆整').value).toBe('50000.00');
      expect(parseRmbUppercase('两万三千五百元').value).toBe('23500.00');
      expect(parseRmbUppercase('壹角伍分').value).toBe('0.15');
      expect(parseRmbUppercase('负壹佰元整').value).toBe('-100.00');
    });

    it('处理无效与空输入', () => {
      expect(parseRmbUppercase('').success).toBe(false);
      expect(parseRmbUppercase('   ').success).toBe(false);
    });
  });
});
