import { describe, it, expect } from 'vitest';
import {
  generateShadowLayers,
  formatCssBoxShadow,
  formatTailwindBoxShadow,
  PRESET_SHADOWS,
  type ShadowConfig,
} from '../../src/lib/css/shadow';

describe('CSS Shadow Engine (TDD)', () => {
  const baseConfig: ShadowConfig = {
    layers: 3,
    offsetX: 0,
    offsetY: 10,
    blur: 20,
    spread: 0,
    color: '#0f172a',
    opacity: 0.1,
    inset: false,
  };

  describe('generateShadowLayers (多层平滑计算)', () => {
    it('单层阴影输出与配置相符', () => {
      const singleConfig: ShadowConfig = { ...baseConfig, layers: 1 };
      const layers = generateShadowLayers(singleConfig);
      expect(layers).toHaveLength(1);
      expect(layers[0].offsetY).toBe(10);
      expect(layers[0].blur).toBe(20);
      expect(layers[0].opacity).toBeCloseTo(0.1, 2);
    });

    it('多层阴影生成正确数量的层级且模糊递增', () => {
      const layers = generateShadowLayers(baseConfig);
      expect(layers).toHaveLength(3);
      // 第一层更近、更清晰；最后一层更远、更弥散
      expect(layers[0].offsetY).toBeLessThan(layers[2].offsetY);
      expect(layers[0].blur).toBeLessThan(layers[2].blur);
    });

    it('支持内阴影 (inset) 属性传递', () => {
      const insetConfig: ShadowConfig = { ...baseConfig, inset: true };
      const layers = generateShadowLayers(insetConfig);
      expect(layers.every((l) => l.inset)).toBe(true);
    });
  });

  describe('formatCssBoxShadow (原生 CSS 代码格式化)', () => {
    it('生成符合 CSS 语法的 box-shadow 声明', () => {
      const css = formatCssBoxShadow(baseConfig);
      expect(css).toMatch(/^box-shadow:\s*.+;$/);
      expect(css).toContain('rgba(');
      expect(css).toContain('px');
    });

    it('内阴影正确附加 inset 关键字', () => {
      const css = formatCssBoxShadow({ ...baseConfig, inset: true });
      expect(css).toContain('inset');
    });
  });

  describe('formatTailwindBoxShadow (Tailwind CSS 实用类导出)', () => {
    it('生成标准 Tailwind arbitrary shadow 类名', () => {
      const tailwindClass = formatTailwindBoxShadow(baseConfig);
      expect(tailwindClass).toMatch(/^shadow-\[.+\]$/);
      // Tailwind arbitrary class 中不能包含未转义的空格
      expect(tailwindClass).not.toContain(' ');
    });
  });

  describe('PRESET_SHADOWS 预设集', () => {
    it('包含常用的高颜值预设且每套均合法有效', () => {
      expect(PRESET_SHADOWS.length).toBeGreaterThanOrEqual(3);
      for (const preset of PRESET_SHADOWS) {
        expect(preset.name).toBeTruthy();
        expect(preset.config.layers).toBeGreaterThanOrEqual(1);
        const css = formatCssBoxShadow(preset.config);
        expect(css).toBeTruthy();
      }
    });
  });
});
