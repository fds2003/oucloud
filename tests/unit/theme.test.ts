import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  resolveIsDark,
  getStoredTheme,
  setStoredTheme,
  applyThemeToDom,
} from '../../src/lib/theme';

describe('Theme Engine (TDD)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('resolveIsDark (主题策略解析)', () => {
    it('显式指定 dark 返回 true', () => {
      expect(resolveIsDark('dark', false)).toBe(true);
      expect(resolveIsDark('dark', true)).toBe(true);
    });

    it('显式指定 light 返回 false', () => {
      expect(resolveIsDark('light', false)).toBe(false);
      expect(resolveIsDark('light', true)).toBe(false);
    });

    it('跟随系统模式 (system) 时正确依据系统偏好解析', () => {
      expect(resolveIsDark('system', true)).toBe(true);
      expect(resolveIsDark('system', false)).toBe(false);
    });
  });

  describe('Storage 存储与持久化', () => {
    it('默认初始值为 system', () => {
      expect(getStoredTheme()).toBe('system');
    });

    it('写入主题值后可正确持久化读取', () => {
      setStoredTheme('dark');
      expect(getStoredTheme()).toBe('dark');

      setStoredTheme('light');
      expect(getStoredTheme()).toBe('light');
    });

    it('存储非法值时安全回退至 system', () => {
      localStorage.setItem('oucloud_theme', 'invalid_theme');
      expect(getStoredTheme()).toBe('system');
    });
  });

  describe('applyThemeToDom (DOM 节点 class 注入)', () => {
    it('暗黑生效时向 documentElement 注入 dark 类', () => {
      const isDark = applyThemeToDom('dark', false);
      expect(isDark).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('浅色生效时从 documentElement 移除 dark 类', () => {
      document.documentElement.classList.add('dark');
      const isDark = applyThemeToDom('light', false);
      expect(isDark).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
