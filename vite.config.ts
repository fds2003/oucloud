import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * 让 `vite preview` 的目录索引行为与真实静态托管 (Nginx / Netlify / Pages) 一致。
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

/**
 * 构建产物 sw.js 的缓存版本号自动化：
 * 以入口 chunk 的内容 hash 作为 CACHE_NAME——代码一变，SW 缓存即整体失效重建；
 * 未改动的构建 hash 相同，不会无谓地清空用户已缓存的离线资源。
 * （public/sw.js 中的 'oucloud-v1' 仅作为开发期兜底值。）
 */
function bumpSwCacheVersion(): Plugin {
  return {
    name: 'bump-sw-cache-version',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const swPath = path.join(distDir, 'sw.js');
      const assetsDir = path.join(distDir, 'assets');
      if (!fs.existsSync(swPath) || !fs.existsSync(assetsDir)) return;

      const entry = fs.readdirSync(assetsDir).find((f) => /^index-.+\.js$/.test(f));
      if (!entry) return;
      const hash = entry.replace(/^index-/, '').replace(/\.js$/, '');

      const original = fs.readFileSync(swPath, 'utf-8');
      const updated = original.replace(
        /const CACHE_NAME = '[^']*'/,
        `const CACHE_NAME = 'oucloud-${hash}'`
      );
      if (updated !== original) {
        fs.writeFileSync(swPath, updated);
        console.log(`  ♻️  sw.js CACHE_NAME 已随构建更新为 oucloud-${hash}`);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    previewDirectoryIndex(),
    bumpSwCacheVersion(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * 框架代码独立 vendor chunk：业务迭代频繁而 react/react-dom/router 几乎不变，
         * 拆分后用户发版间可继续命中浏览器长效缓存，不必重新下载框架代码。
         */
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
