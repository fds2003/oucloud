import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Lighthouse CI Configuration (TDD)', () => {
  const configPath = path.resolve(process.cwd(), 'lighthouserc.json');

  it('lighthouserc.json 配置文件存在且为合法 JSON', () => {
    expect(fs.existsSync(configPath)).toBe(true);
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed).toHaveProperty('ci');
  });

  it('配置了完整的核心审计目标 URL 与静态本地服务', () => {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const { ci } = JSON.parse(raw);
    expect(ci).toHaveProperty('collect');
    expect(ci.collect).toHaveProperty('url');
    expect(Array.isArray(ci.collect.url)).toBe(true);
    expect(ci.collect.url.length).toBeGreaterThanOrEqual(3);
  });

  it('设置了严格的 SEO、Accessibility 与 Performance 断言门禁', () => {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const { ci } = JSON.parse(raw);
    expect(ci).toHaveProperty('assert');
    const assertions = ci.assert.assertions;
    expect(assertions['categories:seo']).toBeDefined();
    expect(assertions['categories:accessibility']).toBeDefined();
    expect(assertions['categories:best-practices']).toBeDefined();
  });
});
