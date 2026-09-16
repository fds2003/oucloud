import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('OUCloud 真实生产环境端到端 (E2E) 核心质量守门', () => {

  test('1. 首页静态预渲染、SEO 规范与即时搜索', async ({ page }) => {
    await page.goto('/');

    // SEO 核心三要素检查
    await expect(page).toHaveTitle(/OUCloud/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://oucloud.cn/');

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('在线工具');

    // 首页搜索联动测试
    const searchInput = page.getByPlaceholder('搜索工具：颜色拾取、大写转换、Favicon、渐变...');
    await searchInput.fill('大写');
    await expect(page.getByText('人民币金额大写转换器')).toBeVisible();

    // 清空搜索
    await page.getByText('清空').click();
    await expect(searchInput).toHaveValue('');
  });

  test('2. 颜色拾取器 (Color Picker): 模式互转与剪贴板联动', async ({ page, context }) => {
    // 授予剪贴板权限以避免浏览器弹窗拦截
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});

    await page.goto('/tools/color/color-picker');

    // 验证页面 SEO H1 与标题
    await expect(page.locator('h1')).toHaveText('在线颜色拾取器');
    await expect(page).toHaveTitle(/在线颜色拾取器/);

    // 输入 HEX #ff0000 纯红色
    const hexInput = page.getByPlaceholder('#0ea5e9');
    await hexInput.fill('#ff0000');

    // 验证 RGB 输入框自动同步联动为 255, 0, 0
    const rInput = page.locator('input[type="number"]').first();
    await expect(rInput).toHaveValue('255');

    // 点击 HEX 复制按钮
    const copyBtn = page.getByRole('button', { name: '复制' }).first();
    await copyBtn.click();
    await expect(page.getByText('已复制')).toBeVisible();
  });

  test('3. 人民币金额大写转换器 (RMB): 高精度计算与边界合规', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});

    await page.goto('/tools/number/rmb-uppercase');

    await expect(page.locator('h1')).toHaveText('人民币金额大写转换器');

    const input = page.locator('#rmb-input');
    await input.fill('123.45');

    // 断言大写金额计算结果
    const resultDisplay = page.getByText('壹佰贰拾叁元肆角伍分');
    await expect(resultDisplay).toBeVisible();

    // 测试预设快捷按钮
    await page.getByRole('button', { name: '伍万元整' }).click();
    await expect(page.locator('span.select-all')).toHaveText('伍万元整');
  });

  test('4. Favicon 网站图标生成器: 本地文件上传与真实 ZIP 下载拦截', async ({ page }) => {
    await page.goto('/tools/favicon/favicon-generator');

    await expect(page.locator('h1')).toHaveText('Favicon 网站图标生成器');

    // 准备本地测试图片夹具
    const fixturePath = path.resolve('tests', 'fixtures', 'sample-icon.png');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=点击选择图片 或 将图片拖拽至此处').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(fixturePath);

    // 上传后验证多尺寸预览区已渲染 (使用精确匹配)
    await expect(page.getByText('图片已加载完成')).toBeVisible();
    await expect(page.getByText('16x16', { exact: true })).toBeVisible();
    await expect(page.getByText('32x32', { exact: true })).toBeVisible();
    await expect(page.getByText('180x180', { exact: true })).toBeVisible();

    // 监听并拦截真实浏览器下载事件
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /一键下载 Favicon 图标包/ }).click();
    const download = await downloadPromise;

    // 验证下载产物文件名
    expect(download.suggestedFilename()).toBe('favicons-oucloud.zip');
  });

  test('5. CSS 渐变生成器 (Gradient Generator): 实时预览与样式导出', async ({ page }) => {
    await page.goto('/tools/css/gradient-generator');

    await expect(page.locator('h1')).toHaveText('CSS 渐变生成器');

    // 点击精选预设“落日余晖 (Sunset)”
    await page.getByText('落日余晖 (Sunset)').click();

    // 检查 CSS 输出框包含预设色彩值
    const cssPre = page.locator('pre');
    await expect(cssPre).toContainText('linear-gradient');
    await expect(cssPre).toContainText('#ff7e5f');

    // 切换为径向渐变
    await page.getByRole('button', { name: '径向 (Radial)' }).click();
    await expect(cssPre).toContainText('radial-gradient');
  });

  test('6. 移动端与跨端无横向滚动条溢出', async ({ page }) => {
    await page.goto('/tools/css/gradient-generator');

    // 检查页面 scrollWidth 是否小于等于 clientWidth (无水平破坏性溢出)
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(isOverflowing).toBe(false);
  });
});
