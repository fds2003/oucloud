import { describe, it, expect } from 'vitest';
import {
  cleanAndNormalizeSvg,
  DEMO_SVGS,
} from '../../src/lib/image/svgFavicon';

describe('SVG to Favicon Engine (TDD)', () => {
  const sampleValidSvg = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#0ea5e9" />
    </svg>
  `;

  describe('cleanAndNormalizeSvg (SVG 清洗与规范化)', () => {
    it('正确解析并补充缺失的尺寸与 xmlns 声明', () => {
      const result = cleanAndNormalizeSvg(sampleValidSvg, 64);
      expect(result).not.toBeNull();
      expect(result?.cleanSvg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(result?.cleanSvg).toContain('width="64"');
      expect(result?.cleanSvg).toContain('height="64"');
      expect(result?.dataUrl).toMatch(/^data:image\/svg\+xml;/);
    });

    it('剥离危险的 script 标签与内联事件属性 (安全过滤)', () => {
      const maliciousSvg = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" onload="alert(1)">
          <script>alert('xss')</script>
          <circle cx="50" cy="50" r="40" fill="#ff0000" onclick="evil()" />
        </svg>
      `;
      const result = cleanAndNormalizeSvg(maliciousSvg, 64);
      expect(result).not.toBeNull();
      expect(result?.cleanSvg).not.toContain('<script');
      expect(result?.cleanSvg).not.toContain('onload');
      expect(result?.cleanSvg).not.toContain('onclick');
      expect(result?.cleanSvg).toContain('fill="#ff0000"');
    });

    it('非法或非 SVG 内容安全返回 null', () => {
      expect(cleanAndNormalizeSvg('not-svg')).toBeNull();
      expect(cleanAndNormalizeSvg('')).toBeNull();
      expect(cleanAndNormalizeSvg('<div>HTML content</div>')).toBeNull();
    });
  });

  describe('DEMO_SVGS 预设合规性', () => {
    it('包含常用的高颜值矢量示例且均能正常解析', () => {
      expect(DEMO_SVGS.length).toBeGreaterThanOrEqual(2);
      for (const demo of DEMO_SVGS) {
        expect(demo.name).toBeTruthy();
        const res = cleanAndNormalizeSvg(demo.svg, 64);
        expect(res).not.toBeNull();
      }
    });
  });
});
