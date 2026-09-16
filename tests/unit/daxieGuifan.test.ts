import { describe, it, expect } from 'vitest';
import {
  validateDaxieRules,
  DAXIE_STANDARD_RULES,
} from '../../src/lib/number/daxieGuifan';

describe('RMB Daxie Specification Engine (TDD)', () => {
  describe('validateDaxieRules (大写合规性规则校验器)', () => {
    it('完全合规的标准写法通过校验', () => {
      const res1 = validateDaxieRules('壹万贰仟叁佰肆拾伍元陆角柒分');
      expect(res1.isValid).toBe(true);
      expect(res1.errors).toHaveLength(0);

      const res2 = validateDaxieRules('壹佰元整');
      expect(res2.isValid).toBe(true);
      expect(res2.errors).toHaveLength(0);
    });

    it('检测有“分”时不应书写“整”字违规', () => {
      // 央行规定：有“分”的，分后面不写“整”（或“正”）字
      const res = validateDaxieRules('壹佰元伍角叁分整');
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes('不写“整”'))).toBe(true);
    });

    it('检测到“元”为止未书写“整”字违规', () => {
      // 央行规定：中文大写金额数字到“元”为止的，在“元”之后应写“整”（或“正”）字
      const res = validateDaxieRules('壹佰元');
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes('应写“整”'))).toBe(true);
    });

    it('检测常见简写错别字（如将“贰”写成“两”或阿拉伯数字）', () => {
      const res1 = validateDaxieRules('两万元整');
      expect(res1.isValid).toBe(false);
      expect(res1.errors.some((e) => e.includes('错别字'))).toBe(true);

      const res2 = validateDaxieRules('100元整');
      expect(res2.isValid).toBe(false);
      expect(res2.errors.some((e) => e.includes('阿拉伯数字'))).toBe(true);
    });
  });

  describe('DAXIE_STANDARD_RULES 规范条文结构', () => {
    it('包含央行完整规范条款且每条均包含标题与要点', () => {
      expect(DAXIE_STANDARD_RULES.length).toBeGreaterThanOrEqual(4);
      for (const rule of DAXIE_STANDARD_RULES) {
        expect(rule.title).toBeTruthy();
        expect(rule.summary).toBeTruthy();
        expect(rule.examples.length).toBeGreaterThanOrEqual(1);
      }
    });
  });
});
