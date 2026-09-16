import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/App';

afterEach(cleanup);

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('路由骨架', () => {
  it('首页渲染 H1 与工具入口', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('免费在线工具箱');
    expect(screen.getAllByText('人民币金额大写转换器').length).toBeGreaterThan(0);
  });

  it('工具页渲染 H1 与工具本体', () => {
    renderAt('/tools/number/rmb-uppercase');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('人民币金额大写转换器');

    const input = screen.getByLabelText('输入金额（元）') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '123.45' } });
    expect(screen.getByText('壹佰贰拾叁元肆角伍分')).toBeTruthy();
  });

  it('未实现的工具渲染占位页而不是白屏', () => {
    renderAt('/tools/css/gradient-generator');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('CSS 渐变生成器');
    expect(screen.getByText(/正在开发中/)).toBeTruthy();
  });

  it('非法分类与非法 slug 不会崩溃', () => {
    renderAt('/tools/nope');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('工具分类不存在');

    cleanup();
    renderAt('/tools/number/nope');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('工具不存在或已下线');
  });

  it('未知路径渲染 404 页', () => {
    renderAt('/not-exist');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('页面不存在');
  });
});
