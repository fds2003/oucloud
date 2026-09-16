import { describe, it, expect } from 'vitest';
import {
  isValidHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  formatRgb,
  formatHsl,
} from '../../src/lib/color/conversion';

describe('Color Engine - 完整转换与边界测试', () => {
  describe('isValidHex', () => {
    it('should accept valid 3-char hex', () => {
      expect(isValidHex('#fff')).toBe(true);
      expect(isValidHex('#000')).toBe(true);
      expect(isValidHex('#abc')).toBe(true);
    });

    it('should accept valid 6-char hex', () => {
      expect(isValidHex('#ffffff')).toBe(true);
      expect(isValidHex('#000000')).toBe(true);
      expect(isValidHex('#0ea5e9')).toBe(true);
    });

    it('should reject invalid hex', () => {
      expect(isValidHex('0ea5e9')).toBe(false); // 缺少 #
      expect(isValidHex('#xyz123')).toBe(false);
      expect(isValidHex('#12345')).toBe(false); // 5位
      expect(isValidHex('#1234567')).toBe(false); // 7位
      expect(isValidHex('')).toBe(false);
      expect(isValidHex('red')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isValidHex('#abc')).toBe(true);
      expect(isValidHex('#ABC')).toBe(true);
      expect(isValidHex('#aBc')).toBe(true);
    });
  });

  describe('hexToRgb', () => {
    it('should convert basic colors', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle 3-char hex', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#xyz')).toBeNull();
      expect(hexToRgb('')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('should convert basic RGB values', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
      expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    });

    it('should clamp out-of-range values', () => {
      expect(rgbToHex({ r: -1, g: 0, b: 0 })).toBe('#000000');
      expect(rgbToHex({ r: 256, g: 0, b: 0 })).toBe('#ff0000');
      expect(rgbToHex({ r: 100, g: -50, b: 300 })).toBe('#6400ff');
    });
  });

  describe('rgbToHsl and hslToRgb roundtrip', () => {
    it('should roundtrip basic colors', () => {
      const testCases = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 14, g: 165, b: 233 },
        { r: 255, g: 255, b: 255 },
        { r: 0, g: 0, b: 0 },
      ];

      for (const rgb of testCases) {
        const hsl = rgbToHsl(rgb);
        const back = hslToRgb(hsl);
        // RGB↔HSL 转换存在 ±2 精度误差，允许误差范围内匹配
        expect(back.r).toBeCloseTo(rgb.r, -1);
        expect(back.g).toBeCloseTo(rgb.g, -1);
        expect(back.b).toBeCloseTo(rgb.b, -1);
      }
    });

    it('should handle gray colors (saturation = 0)', () => {
      const gray = { r: 128, g: 128, b: 128 };
      const hsl = rgbToHsl(gray);
      expect(hsl.s).toBe(0);
      expect(hslToRgb(hsl)).toEqual(gray);
    });
  });

  describe('formatRgb and formatHsl', () => {
    it('should format RGB correctly', () => {
      expect(formatRgb({ r: 14, g: 165, b: 233 })).toBe('rgb(14, 165, 233)');
    });

    it('should format HSL correctly', () => {
      expect(formatHsl({ h: 199, s: 89, l: 48 })).toBe('hsl(199, 89%, 48%)');
    });
  });
});
