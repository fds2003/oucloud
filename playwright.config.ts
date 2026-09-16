import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    /**
     * 本地全并发 (CPU 核数个 worker) 时重负载偶发动作超时。
     * 给每个自动等待动作放宽到 15s，导航类 45s，消除偶发抖动而不拖慢正常路径
     * (正常动作都在百毫秒级，超时只是兜底)。
     */
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* 生产静态服务器运行 (SSG dist 产物真实测试) */
  webServer: {
    command: 'pnpm preview --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
