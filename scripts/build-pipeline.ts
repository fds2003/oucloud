#!/usr/bin/env node
/**
 * 构建管道脚本 - 按顺序执行所有构建步骤
 * 
 * 使用方式:
 *   pnpm build
 * 
 * 步骤:
 *   1. TypeScript 类型检查
 *   2. Vite 构建
 *   3. Sitemap 生成
 *   4. SSG 预渲染
 *   5. SEO 校验
 *   6. 工具元数据校验
 */

import { execSync } from 'child_process';
import { resolve } from 'path';

const ROOT_DIR = resolve(process.cwd());

function runScript(script: string, description: string): void {
  console.log(`\n🚀 ${description}`);
  try {
    execSync(script, { 
      cwd: ROOT_DIR, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log(`✅ ${description} 完成`);
  } catch (error) {
    console.error(`❌ ${description} 失败`);
    process.exit(1);
  }
}

// 1. TypeScript 类型检查
runScript('npx tsc --noEmit', 'TypeScript 类型检查');

// 2. Vite 构建
runScript('npx vite build', 'Vite 生产构建');

// 3. Sitemap 生成
runScript('npx tsx scripts/generate-sitemap.ts', '生成 Sitemap.xml');

// 4. SSG 预渲染
runScript('npx tsx scripts/prerender.tsx', 'SSG 静态页面预渲染');

// 5. SEO 校验
runScript('npx tsx scripts/validate-seo.ts', 'SEO 产物校验');

// 6. 工具元数据校验
runScript('npx tsx scripts/validate-tools.ts', '工具元数据校验');

console.log('\n🎉 构建管道完成！所有步骤已成功执行。');
