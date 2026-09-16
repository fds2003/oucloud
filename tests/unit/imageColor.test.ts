import { describe, it, expect } from 'vitest';
import {
  samplePixelColor,
  extractPaletteFromPixels,
  getDominantColor,
} from '../../src/lib/color/imagePalette';

describe('Image Color Engine (TDD)', () => {
  describe('samplePixelColor (单点像素精确吸色)', () => {
    // 创建一个 2x2 的测试像素缓冲区 (RGBA)
    // 像素 0 (0,0): 纯红 [255, 0, 0, 255]
    // 像素 1 (1,0): 纯绿 [0, 255, 0, 255]
    // 像素 2 (0,1): 纯蓝 [0, 0, 255, 255]
    // 像素 3 (1,1): 纯白 [255, 255, 255, 255]
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255,    0, 255, 0, 255,
      0, 0, 255, 255,    255, 255, 255, 255,
    ]);
    const width = 2;
    const height = 2;

    it('准确采样指定坐标的颜色', () => {
      const redPixel = samplePixelColor(pixels, width, height, 0, 0);
      expect(redPixel).not.toBeNull();
      expect(redPixel?.hex.toLowerCase()).toBe('#ff0000');
      expect(redPixel?.rgb).toEqual({ r: 255, g: 0, b: 0 });

      const greenPixel = samplePixelColor(pixels, width, height, 1, 0);
      expect(greenPixel?.hex.toLowerCase()).toBe('#00ff00');

      const bluePixel = samplePixelColor(pixels, width, height, 0, 1);
      expect(bluePixel?.hex.toLowerCase()).toBe('#0000ff');
    });

    it('超出图片边界坐标时安全返回 null', () => {
      expect(samplePixelColor(pixels, width, height, -1, 0)).toBeNull();
      expect(samplePixelColor(pixels, width, height, 2, 1)).toBeNull();
      expect(samplePixelColor(pixels, width, height, 0, 5)).toBeNull();
    });
  });

  describe('extractPaletteFromPixels (调色板聚合提取)', () => {
    it('对于纯单色图像，返回该单一主色且占比为 100%', () => {
      // 10 个纯天蓝色像素 (#0ea5e9 -> 14, 165, 233, 255)
      const data: number[] = [];
      for (let i = 0; i < 10; i++) {
        data.push(14, 165, 233, 255);
      }
      const pixels = new Uint8ClampedArray(data);
      const palette = extractPaletteFromPixels(pixels, 10, 6);

      expect(palette).toHaveLength(1);
      expect(palette[0].hex.toLowerCase()).toBe('#0ea5e9');
      expect(palette[0].percentage).toBeCloseTo(100, 1);
    });

    it('多色图像按频次与对比聚类提取主色调', () => {
      // 构造图像：70% 红色，30% 蓝色
      const data: number[] = [];
      for (let i = 0; i < 70; i++) {
        data.push(255, 0, 0, 255); // 红色
      }
      for (let i = 0; i < 30; i++) {
        data.push(0, 0, 255, 255); // 蓝色
      }
      const pixels = new Uint8ClampedArray(data);
      const palette = extractPaletteFromPixels(pixels, 100, 2);

      expect(palette.length).toBeGreaterThanOrEqual(2);
      expect(palette[0].hex.toLowerCase()).toBe('#ff0000');
      expect(palette[0].percentage).toBeGreaterThan(50);
      expect(palette[1].hex.toLowerCase()).toBe('#0000ff');
    });

    it('自动忽略透明度低于阈值的像素 (Alpha < 128)', () => {
      // 50 个透明像素 + 50 个纯绿像素
      const data: number[] = [];
      for (let i = 0; i < 50; i++) {
        data.push(255, 0, 0, 0); // 完全透明
      }
      for (let i = 0; i < 50; i++) {
        data.push(0, 255, 0, 255); // 纯绿
      }
      const pixels = new Uint8ClampedArray(data);
      const palette = extractPaletteFromPixels(pixels, 100, 6);

      expect(palette).toHaveLength(1);
      expect(palette[0].hex.toLowerCase()).toBe('#00ff00');
    });
  });

  describe('getDominantColor (主色调提取)', () => {
    it('正确提取最占优势的第一主色', () => {
      const data: number[] = [];
      for (let i = 0; i < 80; i++) {
        data.push(99, 102, 241, 255); // #6366f1 靛蓝色
      }
      for (let i = 0; i < 20; i++) {
        data.push(236, 72, 153, 255); // #ec4899 粉色
      }
      const pixels = new Uint8ClampedArray(data);
      const dominant = getDominantColor(pixels, 100);

      expect(dominant).not.toBeNull();
      expect(dominant?.hex.toLowerCase()).toBe('#6366f1');
    });

    it('全透明图像返回 null', () => {
      const pixels = new Uint8ClampedArray([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(getDominantColor(pixels, 2)).toBeNull();
    });
  });
});
