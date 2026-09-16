import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  isValidHex,
} from '../../src/lib/color/conversion';

describe('Color Engine - Conversion & Validation', () => {
  it('validates hex codes correctly', () => {
    expect(isValidHex('#fff')).toBe(true);
    expect(isValidHex('#ffffff')).toBe(true);
    expect(isValidHex('#0ea5e9')).toBe(true);
    expect(isValidHex('0ea5e9')).toBe(false);
    expect(isValidHex('#xyz123')).toBe(false);
    expect(isValidHex('#12345')).toBe(false);
  });

  it('converts HEX to RGB correctly', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    expect(hexToRgb('#123456')).toEqual({ r: 18, g: 52, b: 86 });
  });

  it('converts RGB to HEX correctly', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    expect(rgbToHex({ r: 18, g: 52, b: 86 })).toBe('#123456');
  });

  it('converts RGB to HSL and back with minimal rounding deviation', () => {
    const originalRgb = { r: 255, g: 0, b: 0 };
    const hsl = rgbToHsl(originalRgb);
    expect(hsl).toEqual({ h: 0, s: 100, l: 50 });

    const backRgb = hslToRgb(hsl);
    expect(backRgb).toEqual(originalRgb);
  });
});
