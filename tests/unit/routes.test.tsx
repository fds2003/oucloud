import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/app/App';
import { preloadRoute } from '../../src/app/routes';

afterEach(cleanup);

/** 路由已代码分割：先预加载 chunk，否则渲染到的是 Suspense fallback 骨架 */
async function renderAt(path: string) {
  await preloadRoute(path);
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </MemoryRouter>
  );
}

describe('全站路由与端到端交互', () => {
  it('首页成功渲染 H1 与核心工具入口', async () => {
    await renderAt('/');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('在线工具');
    expect(screen.getAllByText('人民币金额大写转换器').length).toBeGreaterThan(0);
  });

  it('工具页正常渲染 H1、输入框与实时转换', async () => {
    await renderAt('/tools/number/rmb-uppercase');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('人民币金额大写转换器');

    const input = screen.getByLabelText(/输入阿拉伯数字金额/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '123.45' } });
    expect(screen.getByText('壹佰贰拾叁元肆角伍分')).toBeTruthy();
  });

  it('人民币金额工具支持切换至逆向转换并准确解析大写金额', async () => {
    await renderAt('/tools/number/rmb-uppercase');
    const switchBtn = screen.getByRole('button', { name: /大写转数字/ });
    fireEvent.click(switchBtn);

    const input = screen.getByLabelText(/输入中文大写金额/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '伍万元整' } });
    expect(screen.getByText('¥ 50,000.00')).toBeTruthy();
    expect(screen.getByText(/\(数值: 50000.00\)/)).toBeTruthy();
  });

  it('CSS 渐变生成器工具页真实可用且展示原生 CSS 与 Tailwind 导出', async () => {
    await renderAt('/tools/css/gradient-generator');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('CSS 渐变生成器');
    expect(screen.getByText(/实时渐变背景预览/)).toBeTruthy();
    expect(screen.getByText('原生 CSS 样式代码')).toBeTruthy();
    expect(screen.getByText('Tailwind CSS 实用类')).toBeTruthy();
  });

  it('访问未知路径正常导向 404 页面', async () => {
    await renderAt('/not-exist-route');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('页面未找到');
  });

  it('移动端汉堡按钮能正确展开和收起快捷菜单', async () => {
    await renderAt('/');
    const toggleBtn = screen.getByRole('button', { name: /打开导航菜单/ });
    expect(toggleBtn).toBeTruthy();
    expect(screen.queryByText('全部在线工具')).toBeNull();

    // 点击展开
    fireEvent.click(toggleBtn);
    expect(screen.getByText('全部在线工具')).toBeTruthy();
    expect(screen.getByRole('button', { name: /关闭导航菜单/ })).toBeTruthy();

    // 点击收起
    fireEvent.click(screen.getByRole('button', { name: /关闭导航菜单/ }));
    expect(screen.queryByText('全部在线工具')).toBeNull();
  });
});
