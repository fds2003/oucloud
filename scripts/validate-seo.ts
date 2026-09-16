import fs from 'fs';
import path from 'path';

console.log('🔍 开始执行 SEO 静态产物严格校验 (validate-seo)...');

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist 目录不存在，请先执行构建！');
  process.exit(1);
}

function findHtmlFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(distDir);
let hasErrors = false;
let verifiedCount = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(distDir, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  // 1. 检查 <title>
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`❌ [${relPath}] 缺少有效 <title> 标签`);
    hasErrors = true;
  }

  // 2. 检查 <meta name="description">
  const descMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/);
  if (!descMatch || !descMatch[1].trim()) {
    console.error(`❌ [${relPath}] 缺少有效 <meta name="description">`);
    hasErrors = true;
  }

  // 3. 检查 <link rel="canonical">
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="(.*?)"\s*\/?>/);
  if (!canonicalMatch || !canonicalMatch[1].trim()) {
    console.error(`❌ [${relPath}] 缺少有效 <link rel="canonical">`);
    hasErrors = true;
  }

  // 4. 检查 <h1>
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  if (!h1Match || !h1Match[1].trim()) {
    console.error(`❌ [${relPath}] 缺少语义化 <h1> 标签`);
    hasErrors = true;
  }

  verifiedCount++;
}

if (hasErrors) {
  console.error('\n🚨 SEO 校验失败：构建产物存在缺失 SEO 核心标签的页面！已阻断流水线。');
  process.exit(1);
} else {
  console.log(`\n✅ SEO 产物校验通过！成功验证 ${verifiedCount} 个 HTML 文件，所有正式页面均包含完整 TDK、Canonical 与 H1。`);
}
