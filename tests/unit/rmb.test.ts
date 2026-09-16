import { describe, it, expect } from 'vitest';
import { convertToRmbUppercase } from '../../src/lib/number/rmbUppercase';

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
});
