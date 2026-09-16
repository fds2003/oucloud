import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  drawShareCardToCanvas,
  formatShareCardFilename,
  type ShareCardOptions,
} from '../../src/lib/image/shareCard';

describe('Share Card & Social OG Engine (TDD)', () => {
  const baseOptions: ShareCardOptions = {
    title: 'CSS 渐变生成器',
    subtitle: '直观的可视化渐变调色板，支持一键导出 CSS 与 Tailwind 类名',
    category: 'CSS 工具',
    primaryColor: '#0ea5e9',
    secondaryColor: '#6366f1',
    codeSnippet: 'background: linear-gradient(90deg, #0ea5e9, #6366f1);',
    width: 1200,
    height: 630,
  };

  describe('formatShareCardFilename', () => {
    it('生成标准规范的文件下载名称', () => {
      expect(formatShareCardFilename('gradient-generator')).toBe('oucloud-gradient-generator-card.png');
      expect(formatShareCardFilename('color-picker')).toBe('oucloud-color-picker-card.png');
    });
  });

  describe('drawShareCardToCanvas (Canvas 绘制合规性)', () => {
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
      canvas = document.createElement('canvas');
      HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
        fillRect: vi.fn(),
        createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        roundRect: vi.fn(),
        fillText: vi.fn(),
      });
    });
    it('正确设置 Canvas 宽度与高度尺寸为标准 1200x630', () => {
      drawShareCardToCanvas(canvas, baseOptions);
      expect(canvas.width).toBe(1200);
      expect(canvas.height).toBe(630);
    });

    it('支持默认缺省宽高并应用标准 1.91:1 比例', () => {
      const { width: _w, height: _h, ...noDimOptions } = baseOptions;
      drawShareCardToCanvas(canvas, noDimOptions);
      expect(canvas.width).toBe(1200);
      expect(canvas.height).toBe(630);
    });
  });
});
