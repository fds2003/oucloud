import { describe, it, expect } from 'vitest';
import {
  formatCssGradient,
  formatTailwindGradient,
  formatGradientBorderClip,
  formatGradientBorderImage,
  GradientConfig,
  PRESET_GRADIENTS,
} from '../../src/lib/css/gradient';

describe('CSS Gradient Engine - 完整测试', () => {
  describe('linear-gradient 格式化', () => {
    it('formats linear gradient correctly', () => {
      const config: GradientConfig = {
        type: 'linear',
        angle: 90,
        stops: [
          { id: '1', color: '#ff0000', position: 0 },
          { id: '2', color: '#0000ff', position: 100 },
        ],
      };
      expect(formatCssGradient(config)).toBe('linear-gradient(90deg, #ff0000 0%, #0000ff 100%)');
    });

    it('handles multiple stops', () => {
      const config: GradientConfig = {
        type: 'linear',
        angle: 45,
        stops: [
          { id: '1', color: '#f72585', position: 0 },
          { id: '2', color: '#7209b7', position: 50 },
          { id: '3', color: '#4cc9f0', position: 100 },
        ],
      };
      expect(formatCssGradient(config)).toBe(
        'linear-gradient(45deg, #f72585 0%, #7209b7 50%, #4cc9f0 100%)'
      );
    });

    it('sorts stops by position', () => {
      const config: GradientConfig = {
        type: 'linear',
        angle: 0,
        stops: [
          { id: '2', color: '#0000ff', position: 100 },
          { id: '1', color: '#ff0000', position: 0 },
          { id: '3', color: '#00ff00', position: 50 },
        ],
      };
      expect(formatCssGradient(config)).toBe(
        'linear-gradient(0deg, #ff0000 0%, #00ff00 50%, #0000ff 100%)'
      );
    });
  });

  describe('Tailwind CSS 导出格式化', () => {
    it('生成标准双色标 Tailwind 类名', () => {
      const config: GradientConfig = {
        type: 'linear',
        angle: 90,
        stops: [
          { id: '1', color: '#0ea5e9', position: 0 },
          { id: '2', color: '#6366f1', position: 100 },
        ],
      };
      expect(formatTailwindGradient(config)).toBe('bg-gradient-to-r from-[#0ea5e9] to-[#6366f1]');
    });

    it('生成三色标 Tailwind 类名', () => {
      const config: GradientConfig = {
        type: 'linear',
        angle: 45,
        stops: [
          { id: '1', color: '#f72585', position: 0 },
          { id: '2', color: '#7209b7', position: 50 },
          { id: '3', color: '#4cc9f0', position: 100 },
        ],
      };
      expect(formatTailwindGradient(config)).toBe(
        'bg-gradient-to-tr from-[#f72585] via-[#7209b7] to-[#4cc9f0]'
      );
    });

    it('对非标准角度或径向渐变回退为 JIT 任意值类', () => {
      const config: GradientConfig = {
        type: 'linear',
        angle: 123,
        stops: [
          { id: '1', color: '#ff0000', position: 0 },
          { id: '2', color: '#0000ff', position: 100 },
        ],
      };
      expect(formatTailwindGradient(config)).toBe(
        'bg-[linear-gradient(123deg,#ff0000_0%,#0000ff_100%)]'
      );
    });
  });

  describe('radial-gradient 格式化', () => {
    it('formats radial gradient correctly', () => {
      const config: GradientConfig = {
        type: 'radial',
        angle: 0,
        stops: [
          { id: '1', color: '#ff0000', position: 0 },
          { id: '2', color: '#0000ff', position: 100 },
        ],
      };
      expect(formatCssGradient(config)).toBe('radial-gradient(circle, #ff0000 0%, #0000ff 100%)');
    });
  });

  describe('PRESET_GRADIENTS 预设', () => {
    it('should have 4 preset gradients', () => {
      expect(PRESET_GRADIENTS).toHaveLength(4);
    });

    it('should have valid preset names', () => {
      const names = PRESET_GRADIENTS.map((p: { name: string }) => p.name);
      expect(names).toContain('极光青蓝 (Aurora)');
      expect(names).toContain('落日余晖 (Sunset)');
      expect(names).toContain('赛博霓虹 (Cyberpunk)');
      expect(names).toContain('薄荷清新 (Fresh Mint)');
    });
  });

  describe('渐变边框 - background-clip 方案（支持圆角）', () => {
    const config: GradientConfig = {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#ff0000', position: 0 },
        { id: '2', color: '#0000ff', position: 100 },
      ],
    };

    it('outputs double background with padding-box and border-box', () => {
      expect(formatGradientBorderClip(config, { width: 4, radius: 12 })).toBe(
        [
          'border: 4px solid transparent;',
          'background:',
          '  linear-gradient(#ffffff, #ffffff) padding-box,',
          '  linear-gradient(90deg, #ff0000 0%, #0000ff 100%) border-box;',
          'border-radius: 12px;',
        ].join('\n')
      );
    });

    it('omits border-radius when radius is 0', () => {
      const css = formatGradientBorderClip(config, { width: 2, radius: 0 });
      expect(css).toContain('border: 2px solid transparent;');
      expect(css).not.toContain('border-radius');
    });

    it('supports custom inner color and radial gradient', () => {
      const radial: GradientConfig = { ...config, type: 'radial' };
      const css = formatGradientBorderClip(radial, {
        width: 6,
        radius: 8,
        innerColor: '#0f172a',
      });
      expect(css).toContain('linear-gradient(#0f172a, #0f172a) padding-box');
      expect(css).toContain('radial-gradient(circle, #ff0000 0%, #0000ff 100%) border-box');
    });
  });

  describe('渐变边框 - border-image 方案（简短写法）', () => {
    const config: GradientConfig = {
      type: 'linear',
      angle: 45,
      stops: [
        { id: '1', color: '#f72585', position: 0 },
        { id: '2', color: '#4cc9f0', position: 100 },
      ],
    };

    it('uses slice 1 regardless of border width', () => {
      expect(formatGradientBorderImage(config, { width: 8 })).toBe(
        [
          'border: 8px solid transparent;',
          'border-image: linear-gradient(45deg, #f72585 0%, #4cc9f0 100%) 1;',
        ].join('\n')
      );
    });

    it('never emits border-radius (incompatible with border-image)', () => {
      expect(formatGradientBorderImage(config, { width: 4 })).not.toContain('border-radius');
    });
  });
});
