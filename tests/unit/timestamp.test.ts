import { describe, it, expect } from 'vitest';
import {
  parseTimestampToDate,
  formatDateToTimestamp,
  formatDateToString,
  parseDateStringToTimestamp,
  formatRelativeTime,
} from '../../src/lib/number/timestamp';

describe('Timestamp Engine (TDD)', () => {
  describe('parseTimestampToDate (时间戳转 Date 对象)', () => {
    it('智能识别 10 位秒级时间戳', () => {
      // 1700000000 -> 2023-11-14 22:13:20 UTC
      const date = parseTimestampToDate(1700000000);
      expect(date).not.toBeNull();
      expect(date?.getTime()).toBe(1700000000000);
    });

    it('智能识别 13 位毫秒级时间戳', () => {
      const date = parseTimestampToDate(1700000000123);
      expect(date).not.toBeNull();
      expect(date?.getTime()).toBe(1700000000123);
    });

    it('支持字符串格式数字及首尾空格清理', () => {
      const date = parseTimestampToDate(' 1700000000 ');
      expect(date).not.toBeNull();
      expect(date?.getTime()).toBe(1700000000000);
    });

    it('显式指定秒级单位 (s)', () => {
      const date = parseTimestampToDate('1700000000', 's');
      expect(date?.getTime()).toBe(1700000000000);
    });

    it('显式指定毫秒级单位 (ms)', () => {
      const date = parseTimestampToDate('1700000000000', 'ms');
      expect(date?.getTime()).toBe(1700000000000);
    });

    it('非法非数字输入返回 null', () => {
      expect(parseTimestampToDate('invalid-ts')).toBeNull();
      expect(parseTimestampToDate('')).toBeNull();
    });
  });

  describe('formatDateToString (日期对象格式化为可读时间)', () => {
    it('标准北京时间 (+8) 格式化输出 YYYY-MM-DD HH:mm:ss', () => {
      // 1700000000000 对应 UTC 2023-11-14 22:13:20，北京时间为 2023-11-15 06:13:20
      const date = new Date(1700000000000);
      const str = formatDateToString(date, 8);
      expect(str).toBe('2023-11-15 06:13:20');
    });

    it('标准 UTC 时间 (0时区) 格式化输出', () => {
      const date = new Date(1700000000000);
      const str = formatDateToString(date, 0);
      expect(str).toBe('2023-11-14 22:13:20');
    });
  });

  describe('parseDateStringToTimestamp (日期字符串转时间戳)', () => {
    it('将 YYYY-MM-DD HH:mm:ss 北京时间转为秒级与毫秒级时间戳', () => {
      const res = parseDateStringToTimestamp('2023-11-15 06:13:20', 8);
      expect(res).not.toBeNull();
      expect(res?.s).toBe(1700000000);
      expect(res?.ms).toBe(1700000000000);
    });

    it('支持包含 T 的 ISO 格式字符串', () => {
      const res = parseDateStringToTimestamp('2023-11-14T22:13:20.000Z');
      expect(res).not.toBeNull();
      expect(res?.s).toBe(1700000000);
    });

    it('非法日期字符串安全返回 null', () => {
      expect(parseDateStringToTimestamp('not-a-date')).toBeNull();
      expect(parseDateStringToTimestamp('')).toBeNull();
    });
  });

  describe('formatDateToTimestamp', () => {
    it('正确输出秒级或毫秒级数值', () => {
      const date = new Date(1700000000123);
      expect(formatDateToTimestamp(date, 's')).toBe(1700000000);
      expect(formatDateToTimestamp(date, 'ms')).toBe(1700000000123);
    });
  });

  describe('formatRelativeTime (相对人性化时间显示)', () => {
    it('正确计算过去相对时间', () => {
      const now = new Date('2026-09-16T12:00:00Z');
      const justNow = new Date('2026-09-16T11:59:40Z'); // 20 秒前
      const minsAgo = new Date('2026-09-16T11:45:00Z'); // 15 分钟前
      const hoursAgo = new Date('2026-09-16T08:00:00Z'); // 4 小时前
      const daysAgo = new Date('2026-09-13T12:00:00Z'); // 3 天前

      expect(formatRelativeTime(justNow, now)).toBe('刚刚');
      expect(formatRelativeTime(minsAgo, now)).toBe('15 分钟前');
      expect(formatRelativeTime(hoursAgo, now)).toBe('4 小时前');
      expect(formatRelativeTime(daysAgo, now)).toBe('3 天前');
    });
  });
});
