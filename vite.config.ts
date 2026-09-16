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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(), 
    previewDirectoryIndex(),
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
}));
