import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/**
 * 让 `vite preview` 的目录索引行为与真实静态托管 (Nginx / Netlify / Pages) 一致。
 *
 * 内置静态服务对 `/about` 这类无尾斜杠路径不会回退到 `/about/index.html`，
 * 而是命中 SPA fallback 返回首页 index.html。后果是 e2e 里访问任何路由拿到的
 * 都是首页 HTML，预渲染产物永远测不到，SSR 相关断言全部失真。
 */
function previewDirectoryIndex(): Plugin {
  return {
    name: 'preview-directory-index',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url ?? '';
        const pathname = raw.split('?')[0];
        if (pathname !== '/' && !pathname.endsWith('/') && !path.extname(pathname)) {
          if (fs.existsSync(path.join(process.cwd(), 'dist', pathname, 'index.html'))) {
            req.url = `${pathname}/index.html${raw.slice(pathname.length)}`;
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), previewDirectoryIndex()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // @ts-expect-error vitest options
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: []
  }
});
