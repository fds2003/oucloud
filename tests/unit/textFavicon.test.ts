import { describe, it, expect } from 'vitest';
import {
  generateTextFaviconSvg,
  POPULAR_EMOJIS,
  PRESET_TEXT_FAVICONS,
  type TextFaviconConfig,
} from '../../src/lib/image/textFavicon';

describe('Text / Emoji Favicon Engine (TDD)', () => {
  const baseConfig: TextFaviconConfig = {
    text: '🚀',
    textColor: '#ffffff',
    backgroundColor: '#0ea5e9',
    shape: 'rounded',
    borderRadiusPercent: 20,
    fontSizeRatio: 0.65,
    fontFamily: 'sans-serif',
  };

  describe('generateTextFaviconSvg (生成纯矢量 Favicon SVG)', () => {
    it('生成合法的 SVG 根元素与尺寸声明', () => {
      const svg = generateTextFaviconSvg(baseConfig, 64);
      expect(svg).toMatch(/^<svg[\s\S]+<\/svg>$/);
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('width="64"');
      expect(svg).toContain('height="64"');
    });

    it('包含指定的 Emoji 与背景色', () => {
      const svg = generateTextFaviconSvg(baseConfig, 64);
      expect(svg).toContain('🚀');
      expect(svg).toContain('fill="#0ea5e9"');
    });

    it('支持方形、圆角与圆形等不同底色容器', () => {
      const circleSvg = generateTextFaviconSvg({ ...baseConfig, shape: 'circle' }, 64);
      expect(circleSvg).toContain('<circle');

      const squareSvg = generateTextFaviconSvg({ ...baseConfig, shape: 'square' }, 64);
      expect(squareSvg).toContain('<rect');

      const roundedSvg = generateTextFaviconSvg({ ...baseConfig, shape: 'rounded' }, 64);
      expect(roundedSvg).toContain('rx="');
    });

    it('文字模式下正确应用 textColor 属性', () => {
      const textConfig: TextFaviconConfig = {
        ...baseConfig,
        text: '云',
        textColor: '#ff7e5f',
      };
      const svg = generateTextFaviconSvg(textConfig, 64);
      expect(svg).toContain('云');
      expect(svg).toContain('fill="#ff7e5f"');
    });
  });

  describe('预设数据集合规性', () => {
    it('包含精选 Popular Emojis 列表', () => {
      expect(POPULAR_EMOJIS.length).toBeGreaterThanOrEqual(8);
      expect(POPULAR_EMOJIS).toContain('🚀');
      expect(POPULAR_EMOJIS).toContain('⚡');
    });

    it('包含高颜值预设且每套均能生成合法 SVG', () => {
      expect(PRESET_TEXT_FAVICONS.length).toBeGreaterThanOrEqual(3);
      for (const preset of PRESET_TEXT_FAVICONS) {
        expect(preset.name).toBeTruthy();
        const svg = generateTextFaviconSvg(preset.config, 64);
        expect(svg).toBeTruthy();
      }
    });
  });
});
