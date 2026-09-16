import { describe, it, expect } from 'vitest';
import {
  formatCssBorderRadius,
  formatTailwindBorderRadius,
  PRESET_BORDER_RADII,
  type BorderRadiusConfig,
} from '../../src/lib/css/borderRadius';

describe('CSS Border Radius Engine (TDD)', () => {
  const baseConfig: BorderRadiusConfig = {
    topLeftX: 60,
    topRightX: 40,
    bottomRightX: 30,
    bottomLeftX: 70,
    topLeftY: 60,
    topRightY: 30,
    bottomRightY: 70,
    bottomLeftY: 40,
  };

  describe('formatCssBorderRadius (原生 CSS 8 值圆角格式化)', () => {
    it('输出标准 8 值斜杠分隔的 border-radius CSS 声明', () => {
      const css = formatCssBorderRadius(baseConfig);
      expect(css).toBe('border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;');
    });

    it('均匀圆角时正确输出', () => {
      const uniformConfig: BorderRadiusConfig = {
        topLeftX: 50,
        topRightX: 50,
        bottomRightX: 50,
        bottomLeftX: 50,
        topLeftY: 50,
        topRightY: 50,
        bottomRightY: 50,
        bottomLeftY: 50,
      };
      const css = formatCssBorderRadius(uniformConfig);
      expect(css).toBe('border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;');
    });
  });

  describe('formatTailwindBorderRadius (Tailwind 任意值类名)', () => {
    it('生成合法的 Tailwind rounded-[...] 实用类', () => {
      const tailwindClass = formatTailwindBorderRadius(baseConfig);
      expect(tailwindClass).toMatch(/^rounded-\[.+\]$/);
      // 不能包含未转义的空格
      expect(tailwindClass).not.toContain(' ');
      expect(tailwindClass).toContain('/');
    });
  });

  describe('PRESET_BORDER_RADII 预设集', () => {
    it('包含常用的有机异形预设且每套均合法', () => {
      expect(PRESET_BORDER_RADII.length).toBeGreaterThanOrEqual(4);
      for (const preset of PRESET_BORDER_RADII) {
        expect(preset.name).toBeTruthy();
        const css = formatCssBorderRadius(preset.config);
        expect(css).toContain('border-radius:');
      }
    });
  });
});
