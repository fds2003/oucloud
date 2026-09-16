import fs from 'fs';
import path from 'path';
import { tools } from '../src/data/tools';
import { categories } from '../src/data/categories';
import { buildToolPath, buildAbsoluteUrl } from '../src/lib/tools';

console.log('🚀 开始执行 SSG 静态页面预渲染...');

const distDir = path.resolve(process.cwd(), 'dist');
const templateHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(templateHtmlPath)) {
  console.error('❌ dist/index.html 不存在，请先执行 vite build！');
  process.exit(1);
}

const template = fs.readFileSync(templateHtmlPath, 'utf-8');

interface PageRenderConfig {
  route: string;
  title: string;
  description: string;
  h1: string;
  bodyContentHtml: string;
  jsonLd?: Record<string, unknown>;
}

const pagesToRender: PageRenderConfig[] = [
  // 首页
  {
    route: '/',
    title: 'OUCloud - 纯前端在线工具平台 | 极简高效 零后端传输',
    description: 'OUCloud 汇聚颜色拾取器、人民币金额大写转换、Favicon 网站图标生成器、CSS 渐变设计等实用轻量工具，纯浏览器本地运算，保护隐私，开箱即用。',
    h1: '极简、私密、开箱即用的在线工具矩阵平台',
    bodyContentHtml: `
      <header class="hero-section">
        <h1>极简、私密、开箱即用的在线工具矩阵平台</h1>
        <p>无需注册，无广告打扰。所有色彩计算、发票大写转换、图像尺寸裁剪完全在你的浏览器本地进行，为开发者与日常办公提供极致效率。</p>
      </header>
      <section class="tools-overview">
        <h2>精选工具列表</h2>
        <ul>
          ${tools.map((t) => `<li><a href="${buildToolPath(t)}">${t.name}</a> - ${t.seo.intro}</li>`).join('')}
        </ul>
      </section>
    `,
  },
  // 静态页
  {
    route: '/about',
    title: '关于 OUCloud - 纯前端在线工具平台',
    description: 'OUCloud 秉承 Tool First 理念，致力于提供安全、轻量、无需上传的纯前端工具生态。',
    h1: '关于 OUCloud',
    bodyContentHtml: `
      <h1>关于 OUCloud</h1>
      <p>OUCloud（oucloud.cn）是一个由搜索需求驱动、专注于轻量高效的现代化在线工具箱平台。</p>
    `,
  },
  {
    route: '/privacy',
    title: '隐私保护政策 - OUCloud',
    description: 'OUCloud 尊重并保护所有用户的个人隐私，我们不在服务器端收集或保存您的任何输入数据。',
    h1: '隐私保护政策',
    bodyContentHtml: `
      <h1>隐私保护政策</h1>
      <p>OUCloud 提供的各类工具均通过现代浏览器端技术在您的本地设备上执行，绝不上传您的文件与数据。</p>
    `,
  },
  {
    route: '/terms',
    title: '服务条款与免责声明 - OUCloud',
    description: 'OUCloud 在线工具平台的服务协议与使用条款说明。',
    h1: '服务条款与免责声明',
    bodyContentHtml: `
      <h1>服务条款与免责声明</h1>
      <p>OUCloud 致力于为公众提供免费、高效、便捷的纯前端计算与转换工具。</p>
    `,
  },
];

// 分类页面
for (const cat of categories) {
  const catTools = tools.filter((t) => t.category === cat.slug);
  pagesToRender.push({
    route: `/tools/${cat.slug}`,
    title: `${cat.name}大全 - 免费在线${cat.name} | OUCloud`,
    description: cat.description,
    h1: cat.name,
    bodyContentHtml: `
      <h1>${cat.name}</h1>
      <p>${cat.description}</p>
      <ul>
        ${catTools.map((t) => `<li><a href="${buildToolPath(t)}">${t.name}</a> - ${t.seo.intro}</li>`).join('')}
      </ul>
    `,
  });
}

// 各工具页面
for (const tool of tools) {
  if (tool.status === 'published') {
    const canonical = buildToolPath(tool);
    const howToHtml = tool.seo.howTo
      ? `<section class="how-to"><h2>使用指南</h2><ol>${tool.seo.howTo.map((step) => `<li>${step}</li>`).join('')}</ol></section>`
      : '';
    const explanationHtml = tool.seo.explanation
      ? `<section class="explanation"><h2>原理解析与标准规范</h2><p>${tool.seo.explanation}</p></section>`
      : '';
    const faqHtml = tool.seo.faq && tool.seo.faq.length > 0
      ? `<section class="faq"><h2>常见问题解答</h2>${tool.seo.faq.map((f) => `<div><h3>${f.question}</h3><p>${f.answer}</p></div>`).join('')}</section>`
      : '';

    pagesToRender.push({
      route: canonical,
      title: tool.seo.title,
      description: tool.seo.description,
      h1: tool.seo.h1,
      bodyContentHtml: `
        <header>
          <h1>${tool.seo.h1}</h1>
          <p>${tool.seo.intro}</p>
        </header>
        <div id="tool-container"></div>
        ${howToHtml}
        ${explanationHtml}
        ${faqHtml}
      `,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        url: buildAbsoluteUrl(canonical),
        description: tool.seo.description,
      },
    });
  }
}

// 开始执行渲染写入
for (const page of pagesToRender) {
  const canonicalUrl = buildAbsoluteUrl(page.route);

  let html = template;

  // 1. 替换 Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);

  // 2. 替换 Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    `<meta name="description" content="${page.description}" />`
  );

  // 3. 注入 Canonical & OpenGraph & JsonLd
  const headExtra = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    ${page.jsonLd ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>` : ''}
  `;
  html = html.replace('</head>', `${headExtra}\n</head>`);

  // 4. 将语义化 HTML 注入至 root，首屏爬虫即可直接抓取
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><main class="seo-prerender-content">${page.bodyContentHtml}</main></div>`
  );

  // 5. 确定目标输出路径
  let outPath: string;
  if (page.route === '/') {
    outPath = path.join(distDir, 'index.html');
  } else {
    const cleanRoute = page.route.replace(/^\//, '');
    const targetFolder = path.join(distDir, cleanRoute);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    outPath = path.join(targetFolder, 'index.html');
  }

  fs.writeFileSync(outPath, html, 'utf-8');
  console.log(`  📄 已预渲染输出: ${path.relative(distDir, outPath)}`);
}

console.log(`\n🎉 SSG 预渲染完成！共生成 ${pagesToRender.length} 个独立静态 HTML 文件。`);
