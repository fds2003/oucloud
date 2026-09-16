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

  it('rejects invalid inputs gracefully', () => {
    expect(convertToRmbUppercase('').success).toBe(false);
    expect(convertToRmbUppercase('abc').success).toBe(false);
    expect(convertToRmbUppercase('1.2.3').success).toBe(false);
    expect(convertToRmbUppercase('--1').success).toBe(false);
  });
});
