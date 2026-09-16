import { describe, it, expect, vi } from 'vitest';
import { copyToClipboard, downloadBlob } from '../../src/lib/browser';

describe('Browser Utils - 剪贴板与文件下载', () => {
  describe('copyToClipboard', () => {
    it('should successfully copy to clipboard', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
      });

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith('test text');
    });

    it('should fallback to execCommand when clipboard API unavailable', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      const originalExecCommand = document.execCommand;
      document.execCommand = execCommandMock;

      try {
        const result = await copyToClipboard('fallback text');
        expect(result).toBe(true);
        expect(execCommandMock).toHaveBeenCalledWith('copy');
      } finally {
        document.execCommand = originalExecCommand;
      }
    });
  });

  describe('downloadBlob', () => {
    it('should create and trigger a download', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const createObjectURLMock = vi.fn().mockReturnValue('blob:http://test');
      const revokeObjectURLMock = vi.fn();
      
      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: createObjectURLMock,
          revokeObjectURL: revokeObjectURLMock,
        },
        writable: true,
      });

      const clickMock = vi.fn();
      const originalCreateElement = document.createElement;
      document.createElement = (tag: string) => {
        const el = originalCreateElement.call(document, tag);
        if (tag === 'a') {
          el.click = clickMock;
          (el as HTMLAnchorElement).download = 'test.zip';
        }
        return el;
      };

      try {
        downloadBlob(blob, 'test.zip');
        expect(createObjectURLMock).toHaveBeenCalledWith(blob);
        expect(clickMock).toHaveBeenCalled();
        expect(revokeObjectURLMock).toHaveBeenCalled();
      } finally {
        document.createElement = originalCreateElement;
      }
    });
  });
});
