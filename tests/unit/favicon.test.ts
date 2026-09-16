import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  FAVICON_SIZES,
  generateHtmlSnippets,
  createFaviconZip,
  resizeImageToBlob,
} from '../../src/lib/image/favicon';

const { fileMock, generateAsyncMock } = vi.hoisted(() => ({
  fileMock: vi.fn(),
  generateAsyncMock: vi.fn(),
}));

vi.mock('jszip', () => {
  class MockJSZip {
    file = fileMock;
    generateAsync = generateAsyncMock;
  }
  return { default: MockJSZip };
});

describe('Favicon Engine - 配置与工具函数测试', () => {
  describe('FAVICON_SIZES 配置', () => {
    it('should contain all expected sizes', () => {
      const expectedSizes = [16, 32, 180, 192, 512];
      expect(FAVICON_SIZES.map(s => s.size)).toEqual(expectedSizes);
    });

    it('should have correct filenames', () => {
      expect(FAVICON_SIZES.find(s => s.size === 16)?.filename).toBe('favicon-16x16.png');
      expect(FAVICON_SIZES.find(s => s.size === 32)?.filename).toBe('favicon-32x32.png');
      expect(FAVICON_SIZES.find(s => s.size === 180)?.filename).toBe('apple-touch-icon.png');
      expect(FAVICON_SIZES.find(s => s.size === 192)?.filename).toBe('android-chrome-192x192.png');
      expect(FAVICON_SIZES.find(s => s.size === 512)?.filename).toBe('android-chrome-512x512.png');
    });

    it('should have rel attributes for standard icons', () => {
      expect(FAVICON_SIZES.find(s => s.size === 16)?.rel).toBe('icon');
      expect(FAVICON_SIZES.find(s => s.size === 32)?.rel).toBe('icon');
      expect(FAVICON_SIZES.find(s => s.size === 180)?.rel).toBe('apple-touch-icon');
    });
  });

  describe('generateHtmlSnippets', () => {
    it('should generate valid HTML link tags', () => {
      const html = generateHtmlSnippets();
      expect(html).toContain('rel="icon"');
      expect(html).toContain('favicon-32x32.png');
      expect(html).toContain('favicon-16x16.png');
      expect(html).toContain('apple-touch-icon');
      expect(html).toContain('android-chrome-192x192.png');
      expect(html).toContain('favicon.ico');
    });

    it('should contain 5 link tags', () => {
      const html = generateHtmlSnippets();
      const linkCount = (html.match(/<link/g) || []).length;
      expect(linkCount).toBe(5);
    });
  });
});

describe('Favicon Engine - Canvas 与 ZIP 打包测试', () => {
  let originalCreateElement: typeof document.createElement;
  let originalArrayBuffer: typeof Blob.prototype.arrayBuffer;
  let ctxMock: {
    imageSmoothingEnabled: boolean;
    imageSmoothingQuality: string;
    drawImage: ReturnType<typeof vi.fn>;
  };
  let canvasMock: {
    width: number;
    height: number;
    getContext: ReturnType<typeof vi.fn>;
    toBlob: ReturnType<typeof vi.fn>;
  };

  const mockImage = { width: 512, height: 512 } as HTMLImageElement;

  beforeEach(() => {
    fileMock.mockClear();
    generateAsyncMock.mockClear();
    generateAsyncMock.mockResolvedValue(new Blob(['zip'], { type: 'application/zip' }));

    ctxMock = {
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
      drawImage: vi.fn(),
    };
    canvasMock = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ctxMock),
      toBlob: vi.fn(),
    };
    canvasMock.toBlob.mockImplementation((cb: (blob: Blob | null) => void) => {
      cb(new Blob(['png'], { type: 'image/png' }));
    });
    // 模拟 Blob.arrayBuffer() 方法（ICO 生成需要）
    originalArrayBuffer = Blob.prototype.arrayBuffer;
    Blob.prototype.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(100));

    originalCreateElement = document.createElement;
    document.createElement = ((tag: string) => {
      if (tag === 'canvas') {
        return canvasMock as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tag);
    }) as typeof document.createElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    Blob.prototype.arrayBuffer = originalArrayBuffer;
  });

  describe('resizeImageToBlob', () => {
    it('should resolve with a Blob and set canvas dimensions', async () => {
      const blob = await resizeImageToBlob(mockImage, 32);
      expect(blob).toBeInstanceOf(Blob);
      expect(canvasMock.width).toBe(32);
      expect(canvasMock.height).toBe(32);
    });

    it('should enable high quality image smoothing', async () => {
      await resizeImageToBlob(mockImage, 32);
      expect(ctxMock.imageSmoothingEnabled).toBe(true);
      expect(ctxMock.imageSmoothingQuality).toBe('high');
    });

    it('should draw the centered square crop onto the canvas', async () => {
      await resizeImageToBlob(mockImage, 32);
      expect(ctxMock.drawImage).toHaveBeenCalledWith(mockImage, 0, 0, 512, 512, 0, 0, 32, 32);
    });

    it('should reject when 2d context is unavailable', async () => {
      canvasMock.getContext.mockReturnValue(null);
      await expect(resizeImageToBlob(mockImage, 32)).rejects.toThrow(
        'Canvas 2D context not supported'
      );
    });

    it('should reject when toBlob produces null', async () => {
      canvasMock.toBlob.mockImplementation((cb: (blob: Blob | null) => void) => cb(null));
      await expect(resizeImageToBlob(mockImage, 32)).rejects.toThrow(
        'Failed to generate image blob'
      );
    });
  });

  describe('createFaviconZip', () => {
    it('should return a Blob', async () => {
      const result = await createFaviconZip(mockImage);
      expect(result).toBeInstanceOf(Blob);
    });

    it('should add all standard favicon files to the zip', async () => {
      await createFaviconZip(mockImage);
      const filenames = fileMock.mock.calls.map((call) => call[0]);
      expect(filenames).toContain('favicon-16x16.png');
      expect(filenames).toContain('favicon-32x32.png');
      expect(filenames).toContain('apple-touch-icon.png');
      expect(filenames).toContain('android-chrome-192x192.png');
      expect(filenames).toContain('android-chrome-512x512.png');
      expect(filenames).toContain('favicon.ico');
      expect(filenames).toContain('README-FAVICON.html');
    });

    it('should generate the zip with blob type', async () => {
      await createFaviconZip(mockImage);
      expect(generateAsyncMock).toHaveBeenCalledWith({ type: 'blob' });
    });

    it('should embed HTML snippets in the README file', async () => {
      await createFaviconZip(mockImage);
      const readmeCall = fileMock.mock.calls.find((call) => call[0] === 'README-FAVICON.html');
      expect(readmeCall).toBeDefined();
      expect(readmeCall![1]).toContain('<link rel="icon"');
      expect(readmeCall![1]).toContain('favicon.ico');
    });
  });
});
