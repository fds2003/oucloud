import { describe, it, expect } from 'vitest';
import {
  evaluateWcagCompliance,
  suggestAccessibleColor,
} from '../../src/lib/color/contrastChecker';

describe('WCAG Contrast Checker Engine (TDD)', () => {
  describe('evaluateWcagCompliance (合规性综合评估)', () => {
    it('纯黑文字与纯白背景达到 21:1 满分 AAA 标准', () => {
      const report = evaluateWcagCompliance('#000000', '#ffffff');
      expect(report).not.toBeNull();
      expect(report?.ratio).toBeCloseTo(21, 1);
      expect(report?.normalTextAa).toBe(true);
      expect(report?.normalTextAaa).toBe(true);
      expect(report?.largeTextAa).toBe(true);
      expect(report?.largeTextAaa).toBe(true);
      expect(report?.uiComponentAa).toBe(true);
    });

    it('同色对比度为 1:1，所有标准均不达标', () => {
      const report = evaluateWcagCompliance('#ffffff', '#ffffff');
      expect(report).not.toBeNull();
      expect(report?.ratio).toBeCloseTo(1, 1);
      expect(report?.normalTextAa).toBe(false);
      expect(report?.normalTextAaa).toBe(false);
      expect(report?.largeTextAa).toBe(false);
    });

    it('中等对比度正确区分普通正文与大字号标准', () => {
      // 选取一组对比度在 3.9:1 左右的颜色：例如 #808080 搭配 #ffffff
      const report = evaluateWcagCompliance('#808080', '#ffffff');
      expect(report).not.toBeNull();
      expect(report?.largeTextAa).toBe(true); // >= 3.0 通过
      expect(report?.normalTextAa).toBe(false); // < 4.5 未通过
    });
    it('非法 HEX 格式安全返回 null', () => {
      expect(evaluateWcagCompliance('invalid', '#ffffff')).toBeNull();
      expect(evaluateWcagCompliance('#000', 'not-a-color')).toBeNull();
    });
  });

  describe('suggestAccessibleColor (智能微调达标推荐)', () => {
    it('对于对比度不足 4.5 的颜色，自动微调亮度使其达到 4.5:1 AA 标准', () => {
      // #94a3b8 在纯白背景上对比度仅约 2.3:1
      const suggested = suggestAccessibleColor('#94a3b8', '#ffffff', 4.5);
      expect(suggested).not.toBeNull();
      expect(suggested).toMatch(/^#[0-9a-f]{6}$/i);

      // 验证调整后的颜色确实达到了目标对比度
      const verifyReport = evaluateWcagCompliance(suggested!, '#ffffff');
      expect(verifyReport?.ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
