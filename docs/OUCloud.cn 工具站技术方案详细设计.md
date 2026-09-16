# OUCloud.cn 工具站技术方案详细设计

> 项目名称：OUCloud  
> 域名：oucloud.cn  
> 项目类型：SEO 驱动的在线工具平台  
> 第一阶段：纯前端工具 + 静态 SEO 页面  
> 核心目标：低成本、低维护、可规模化扩张  
> 技术原则：**工具产品化、页面静态化、数据配置化、SEO 系统化、功能模块化**

---

# 1. 项目定位

OUCloud 不是传统内容网站，也不是简单的“在线工具大全”。

核心模型：

```text
搜索需求
   ↓
关键词研究
   ↓
工具设计
   ↓
SEO Landing Page
   ↓
Topic Cluster
   ↓
内部链接
   ↓
外部链接
   ↓
搜索排名
   ↓
自然流量
   ↓
工具使用
   ↓
数据反馈
   ↓
继续扩展
```

最终形成：

> **一个由搜索需求驱动的工具产品平台。**

---

# 2. 核心产品原则

## 2.1 Tool First

用户进入页面后首先看到：

> 工具。

而不是：

> 一篇 SEO 文章。

例如：

```text
PNG to ICO

[Upload PNG]

[Convert]

[Download ICO]
```

SEO 内容放在工具下面。

---

## 2.2 One Search Intent = One Page

不是：

```text
一个关键词 = 一个页面
```

而是：

```text
一个明确搜索意图 = 一个核心页面
```

例如：

```text
favicon generator
favicon maker
favicon creator
```

可以由一个页面覆盖。

而：

```text
png to ico
jpg to ico
favicon size
favicon html
```

如果搜索意图不同，则建立独立页面。

---

# 3. 技术架构总览

第一阶段采用：

```text
                 ┌────────────────────┐
                 │      用户浏览器      │
                 └─────────┬──────────┘
                           │
                           ↓
                 ┌────────────────────┐
                 │ Cloudflare CDN / DNS│
                 └─────────┬──────────┘
                           │
                           ↓
                 ┌────────────────────┐
                 │   Static HTML      │
                 │   CSS / JS / Assets│
                 └─────────┬──────────┘
                           │
                           ↓
                 ┌────────────────────┐
                 │ React Tool Runtime │
                 └─────────┬──────────┘
                           │
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
       Color Tools    Favicon Tools    CSS Tools
            │              │              │
            └──────────────┼──────────────┘
                           ↓
                  Browser Local Processing
```

第一阶段原则：

> **不需要后端就绝不增加后端。**

---

# 4. 推荐技术栈

## 4.1 前端

| 技术 | 选择 |
|---|---|
| Framework | React |
| Build | Vite |
| Language | TypeScript |
| CSS | Tailwind CSS |
| UI | 自建轻量组件 |
| Routing | React Router |
| State | React Hooks / Zustand（必要时） |
| Validation | Zod |
| Testing | Vitest |
| E2E | Playwright |
| Icons | Lucide |
| Package Manager | pnpm |

---

# 5. 为什么使用 TypeScript

不建议：

```text
React + JavaScript
```

而采用：

```text
React + TypeScript
```

原因：

OUCloud 后期可能拥有：

```text
50+
100+
200+
```

个工具。

如果全部使用 JavaScript：

- 工具参数容易混乱
- 公共组件难维护
- Tool Metadata 容易出错
- 重构成本越来越高

TypeScript 可以让工具平台保持结构化。

---

# 6. SEO 页面生成方案

这是整个项目最重要的技术决策之一。

## 不采用纯 SPA SEO

不要单纯：

```text
/
   ↓
React Router
   ↓
JS 动态加载页面
```

而应该：

```text
Build
 ↓
读取工具配置
 ↓
生成页面
 ↓
输出静态 HTML
```

例如：

```text
dist/
├── index.html
├── tools/
│   ├── favicon/
│   │   ├── index.html
│   │   ├── png-to-ico/
│   │   │   └── index.html
│   │   └── favicon-generator/
│   │       └── index.html
│   └── color/
│       ├── index.html
│       └── hex-to-rgb/
│           └── index.html
├── sitemap.xml
└── robots.txt
```

这样每个 SEO 页面都是独立 HTML。

---

# 7. 推荐采用 Static Site Generation 思路

虽然前端运行时仍然是 React，但生产环境页面应该尽可能：

> **Build Time Render**

而不是：

> Runtime Render。

这样可以同时获得：

- SEO
- 页面速度
- CDN 缓存
- 低服务器成本
- 稳定性

---

# 8. Cloudflare 部署

第一阶段可以使用：

> Cloudflare Pages

React/Vite 项目可以直接配置：

```text
Build command:
npm run build

Output:
dist
```

Cloudflare 官方当前文档也提供 React/Vite → Pages 的标准部署方式。

不过需要注意：

Cloudflare 当前文档已经说明 Workers 是其新项目更推荐的平台，因此未来如果 OUCloud 从纯静态站发展到 API、用户系统、动态处理，可以迁移到：

```text
Cloudflare Workers
```

而不需要推翻前端架构。

---

# 9. 域名架构

正式域名：

```text
https://oucloud.cn
```

统一：

```text
https://oucloud.cn
```

不建议同时长期运营：

```text
http://oucloud.cn
https://www.oucloud.cn
```

推荐：

```text
http://oucloud.cn
        ↓ 301
https://oucloud.cn
```

如果使用 www，则统一反向：

```text
www.oucloud.cn
        ↓ 301
oucloud.cn
```

整个网站只保留一个 Canonical Host。

---

# 10. URL 架构

推荐：

```text
/
├── tools/
│   ├── favicon/
│   │   ├──
│   │   ├── favicon-generator
│   │   ├── png-to-ico
│   │   ├── jpg-to-ico
│   │   └── favicon-size
│   │
│   ├── color/
│   │   ├── color-picker
│   │   ├── hex-to-rgb
│   │   ├── rgb-to-hex
│   │   └── color-converter
│   │
│   ├── css/
│   │   └── gradient-generator
│   │
│   └── number/
│       └── rmb-uppercase
│
├── categories/
│   ├── favicon
│   ├── color
│   └── css
│
├── about
├── privacy
├── terms
└── contact
```

---

# 11. URL 原则

URL 必须：

- 简洁
- 小写
- 英文
- 稳定
- 有语义
- 不包含无意义 ID

推荐：

```text
/tools/favicon/png-to-ico
```

不推荐：

```text
/tools?id=123
/tool/abc123
/page.php?id=123
```

---

# 12. 项目目录结构

推荐最终目录：

```text
oucloud/
│
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── robots.txt
│   ├── og-image.png
│   └── icons/
│
├── scripts/
│   ├── generate-pages.ts
│   ├── generate-sitemap.ts
│   ├── validate-tools.ts
│   └── validate-seo.ts
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── seo/
│   │   │   ├── SeoHead.tsx
│   │   │   ├── JsonLd.tsx
│   │   │   └── Canonical.tsx
│   │   │
│   │   ├── tools/
│   │   │   ├── ToolShell.tsx
│   │   │   ├── ToolHeader.tsx
│   │   │   ├── ToolActions.tsx
│   │   │   ├── ToolResult.tsx
│   │   │   └── ToolError.tsx
│   │   │
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── CopyButton.tsx
│   │       └── FileDropzone.tsx
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Category/
│   │   ├── Tool/
│   │   ├── About/
│   │   ├── Privacy/
│   │   └── Terms/
│   │
│   ├── tools/
│   │   ├── color/
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── HexToRgb.tsx
│   │   │   └── RgbToHex.tsx
│   │   │
│   │   ├── favicon/
│   │   │   ├── FaviconGenerator.tsx
│   │   │   └── PngToIco.tsx
│   │   │
│   │   ├── css/
│   │   │   └── GradientGenerator.tsx
│   │   │
│   │   └── number/
│   │       └── RmbUppercase.tsx
│   │
│   ├── data/
│   │   ├── tools.ts
│   │   ├── categories.ts
│   │   └── keywords.ts
│   │
│   ├── lib/
│   │   ├── seo/
│   │   ├── color/
│   │   ├── image/
│   │   ├── number/
│   │   └── browser/
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── typography.css
│   │
│   └── types/
│       ├── tool.ts
│       ├── seo.ts
│       └── category.ts
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

# 13. Tool Metadata 系统

这是整个项目最重要的设计之一。

不要让：

```text
首页
SEO
Sitemap
Related Tools
Category
```

分别维护工具信息。

统一使用：

```text
Tool Metadata
```

---

# 14. Tool Metadata 数据结构

例如：

```ts
export interface ToolMeta {
  id: string;
  slug: string;

  name: string;
  shortName?: string;

  category: string;

  title: string;
  description: string;

  keywords: string[];

  component: string;

  intent: ToolIntent;

  status: 'draft' | 'published';

  featured?: boolean;

  relatedTools?: string[];

  seo: {
    h1: string;
    intro: string;
    howTo: string[];
    faq: FAQItem[];
  };
}
```

---

# 15. 示例

```ts
{
  id: "favicon-generator",

  slug: "favicon-generator",

  name: "Favicon Generator",

  category: "favicon",

  title: "Favicon Generator - Create Favicon Online | OUCloud",

  description:
    "Create favicon files online from an image. Generate ICO, PNG and Apple Touch icons directly in your browser.",

  keywords: [
    "favicon generator",
    "favicon maker",
    "favicon creator"
  ],

  component: "FaviconGenerator",

  intent: "generator",

  status: "published",

  featured: true,

  relatedTools: [
    "png-to-ico",
    "favicon-size"
  ]
}
```

---

# 16. Tool Registry

建立：

```text
src/data/tools.ts
```

统一注册：

```ts
export const tools = [
  faviconGenerator,
  pngToIco,
  colorPicker,
  hexToRgb,
  rmbUppercase,
  cssGradientGenerator
];
```

系统自动生成：

```text
首页
分类页
工具页
相关推荐
Sitemap
内部链接
SEO Metadata
```

---

# 17. 新增工具流程

以后增加一个工具：

```text
1. 创建 Tool Component
       ↓
2. 添加 Tool Metadata
       ↓
3. 注册 Tool
       ↓
4. npm run build
       ↓
5. 自动生成页面
       ↓
6. 自动进入 Sitemap
       ↓
7. 自动进入 Related Tools
```

目标：

> **新增工具不修改 10 个地方。**

---

# 18. Category 数据结构

```ts
interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;

  seo: {
    title: string;
    description: string;
    h1: string;
  };

  tools: string[];
}
```

例如：

```text
favicon
color
css
number
```

---

# 19. Category Page

例如：

```text
/tools/favicon/
```

页面内容：

```text
Favicon Tools

介绍

[ Favicon Generator ]

[ PNG to ICO ]

[ JPG to ICO ]

[ Favicon Size ]

[ Favicon HTML ]
```

它既是：

> 用户导航页面

也是：

> Topic Hub Page。

---

# 20. Tool Page 标准结构

每个工具页面统一：

```text
Header
 ↓
Breadcrumb
 ↓
H1
 ↓
Tool Description
 ↓
Tool UI
 ↓
Result
 ↓
How to Use
 ↓
Explanation
 ↓
FAQ
 ↓
Related Tools
 ↓
Footer
```

---

# 21. ToolShell

所有工具使用统一壳：

```tsx
<ToolShell tool={tool}>
  <ToolHeader />

  <ToolContent>
    <ActualTool />
  </ToolContent>

  <ToolExplanation />

  <ToolFAQ />

  <RelatedTools />
</ToolShell>
```

这样：

> 工具开发者只负责工具逻辑。

SEO、布局、导航、FAQ、相关工具由平台统一管理。

---

# 22. 工具运行架构

第一阶段优先：

> Browser Local Processing。

例如：

```text
User File
    ↓
Browser
    ↓
File API
    ↓
Canvas / Web API
    ↓
Processing
    ↓
Blob
    ↓
Download
```

不上传服务器。

---

# 23. 为什么优先本地处理

优势：

- 无后端
- 无服务器费用
- 隐私更好
- 文件处理速度快
- 不需要数据库
- 不需要对象存储
- 更容易符合“免费工具”定位

例如 Favicon：

```text
用户图片
 ↓
Canvas
 ↓
Resize
 ↓
Generate
 ↓
ZIP
 ↓
Download
```

图片无需离开浏览器。

---

# 24. 浏览器能力层

建立：

```text
src/lib/browser/
```

统一封装：

```text
downloadBlob()
readFile()
createObjectURL()
copyToClipboard()
saveFile()
```

不要每个工具自己实现。

---

# 25. 文件处理层

建立：

```text
src/lib/image/
```

提供：

```text
loadImage()
resizeImage()
cropImage()
canvasToBlob()
generateIco()
generatePng()
createZip()
```

Favicon、Image Converter 等工具可以复用。

---

# 26. Color Engine

建立：

```text
src/lib/color/
```

统一提供：

```text
hexToRgb()
rgbToHex()
rgbToHsl()
hslToRgb()
parseColor()
formatColor()
```

Color Picker：

```text
UI
 ↓
Color Engine
 ↓
HEX / RGB / HSL
```

---

# 27. Number Engine

建立：

```text
src/lib/number/
```

例如：

```text
rmbUppercase()
formatNumber()
parseNumber()
```

金额大写必须有完整单元测试。

---

# 28. RMB Uppercase 测试

必须覆盖：

```text
0
1
10
100
101
1001
10001
10010
100000
1000001

0.01
0.1
1.01
10.10
100.01

负数

万
亿
万亿

最大安全范围
非法输入
```

---

# 29. CSS Gradient Engine

建立：

```text
src/lib/css/
```

统一：

```text
generateLinearGradient()
generateRadialGradient()
formatCssGradient()
parseGradient()
```

工具 UI：

```text
Color Stops
+
Angle
+
Position
+
Type
```

输出：

```css
background: linear-gradient(
  90deg,
  #ff0000 0%,
  #0000ff 100%
);
```

---

# 30. SEO 系统

建立：

```text
src/components/seo/
```

统一管理：

```text
Title
Description
Canonical
Open Graph
Twitter Card
JSON-LD
Robots
```

---

# 31. Title

每个页面独立：

```text
<title>
PNG to ICO Converter - Free Online Tool | OUCloud
</title>
```

不要所有页面：

```text
OUCloud - Online Tools
```

---

# 32. Meta Description

每个页面独立。

要求：

- 描述真实功能
- 包含主要搜索词
- 不堆关键词
- 突出核心价值

---

# 33. Canonical

每个页面：

```html
<link
  rel="canonical"
  href="https://oucloud.cn/tools/favicon/png-to-ico"
/>
```

避免：

```text
?utm=
?ref=
?source=
```

造成重复 URL。

---

# 34. Structured Data

根据页面类型使用适合的 Schema。

工具页面可以考虑：

```text
WebApplication
SoftwareApplication
BreadcrumbList
FAQPage
```

但不能为了 SEO 强行添加不符合页面实际内容的 Schema。

Google 官方建议结构化数据必须与页面内容一致，并应通过 Rich Results Test / URL Inspection 等方式验证。

---

# 35. Breadcrumb Schema

例如：

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Tools",
      "item": "https://oucloud.cn/tools/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Favicon Tools",
      "item": "https://oucloud.cn/tools/favicon/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "PNG to ICO"
    }
  ]
}
```

---

# 36. FAQ

FAQ 必须是真实用户问题。

例如：

```text
What is an ICO file?

What size should a favicon be?

Can I convert PNG to ICO without uploading my image?

Is the conversion performed locally?
```

不要批量生成几十个没有价值的问题。

---

# 37. Sitemap

自动生成：

```text
/sitemap.xml
```

来源：

```text
Tool Registry
+
Category Registry
+
Static Pages
```

例如：

```text
/
 /tools/
 /tools/favicon/
 /tools/favicon/favicon-generator
 /tools/favicon/png-to-ico
 /tools/color/
 /tools/color/color-picker
```

Google 官方建议通过 Sitemap 帮助搜索引擎发现后续页面；Google 也支持通过 Search Console Sitemap API 等方式自动化。

百度同样提供 Sitemap、抓取及索引等站长工具。

---

# 38. Robots.txt

```text
User-agent: *
Allow: /

Sitemap:
https://oucloud.cn/sitemap.xml
```

禁止：

```text
/node_modules/
/admin/
/test/
```

---

# 39. SEO 内容系统

每个工具可以配置：

```ts
seo: {
  intro,
  howTo,
  explanation,
  faq
}
```

但是：

> SEO 内容必须围绕工具真实功能。

不建立传统 Blog CMS。

---

# 40. 为什么不建立 Blog

因为 OUCloud 的产品战略不是：

> 内容生产。

而是：

> 工具生产。

因此第一阶段：

```text
Blog = 非核心
Tool Pages = 核心
```

如果未来某个 Topic 需要解释型内容，再增加：

```text
/guides/
```

而不是一开始就建设完整 CMS。

---

# 41. Internal Linking Engine

Related Tools 自动生成。

规则：

```text
同 Topic
>
同 Category
>
关键词相关度
>
人工指定
```

例如：

```text
PNG to ICO
```

推荐：

```text
Favicon Generator
JPG to ICO
Favicon Size
Favicon HTML
```

---

# 42. Related Tools 配置

默认自动：

```ts
relatedTools: [
  "favicon-generator",
  "favicon-size"
]
```

同时允许人工覆盖。

原因：

> 自动推荐保证规模化，人工推荐保证 SEO 质量。

---

# 43. Search 功能

第一阶段首页可以提供：

```text
Search Tools
```

搜索：

```text
favicon
color
json
gradient
```

使用本地工具数据：

```text
tools.ts
```

无需后端。

---

# 44. 首页架构

首页：

```text
Header
 ↓
Hero
 ↓
Tool Search
 ↓
Featured Tools
 ↓
Categories
 ↓
Popular Tools
 ↓
Recently Added
 ↓
Footer
```

---

# 45. 首页不要做成内容门户

避免：

```text
大量 Banner
大量文字
大量文章
新闻
博客列表
```

首页核心：

> **让用户快速找到工具。**

---

# 46. Tool Discovery

支持：

```text
搜索
分类
标签
相关推荐
Popular
New
```

后期可以增加：

```text
Most Used
Trending
```

但第一阶段不要为了“看起来丰富”制造虚假数据。

---

# 47. 数据分析

第一阶段建议接入：

```text
Google Search Console
Bing Webmaster Tools
百度搜索资源平台
```

产品分析可以使用：

```text
Cloudflare Web Analytics
```

或者其他隐私友好的 Analytics。

---

# 48. 核心数据指标

不要只看 PV。

重点：

```text
Indexed Pages
Organic Impressions
Organic Clicks
CTR
Average Position
Ranking Keywords
Top 10 Keywords
Referring Domains
Tool Usage
Tool Completion Rate
```

---

# 49. 工具使用指标

例如 Favicon：

```text
Page Visit
 ↓
File Selected
 ↓
Generate Click
 ↓
Download
```

可以定义：

```text
Tool Activation Rate
=
Generate Users / Page Users
```

以及：

```text
Tool Completion Rate
=
Download Users / Generate Users
```

---

# 50. 数据隐私

第一阶段原则：

> **尽量不采集用户输入内容。**

例如：

### Color Picker

不记录：

```text
用户输入的颜色
```

### Favicon

不上传：

```text
用户图片
```

### RMB

不发送：

```text
用户金额
```

工具完全可以本地执行。

---

# 51. 如果需要统计事件

只记录：

```text
tool_view
tool_start
tool_complete
tool_download
copy_result
```

不要记录用户实际文件或敏感输入。

---

# 52. 性能目标

第一阶段目标：

```text
HTML Size
尽可能小

JS
按工具拆分

Images
WebP / SVG

Fonts
尽量系统字体

LCP
< 2.5s

CLS
< 0.1

INP
< 200ms
```

---

# 53. Code Splitting

不要首页加载所有工具。

错误：

```text
Home
 ↓
Load 100 tools
```

应该：

```text
Home
 ↓
Load core UI
```

进入：

```text
Favicon Generator
 ↓
Load favicon code
```

进入：

```text
Color Picker
 ↓
Load color code
```

这样随着工具数量增加，首页性能不会明显下降。

---

# 54. 动态导入

例如：

```ts
const FaviconGenerator = lazy(
  () => import('./tools/favicon/FaviconGenerator')
);
```

生产构建自动拆包。

---

# 55. 图片策略

第一阶段尽量：

```text
SVG
CSS
WebP
```

工具站尽量减少：

```text
大型 PNG
大型 JPG
视频
动画
```

---

# 56. 字体策略

优先：

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

避免为了视觉效果加载大量 Web Font。

---

# 57. 缓存策略

Cloudflare Pages 对静态资源提供 CDN 缓存；官方文档也提醒通常不要额外增加复杂自定义缓存，以免产生旧资源问题。

因此第一阶段：

> **尽量使用 Cloudflare 默认缓存机制。**

---

# 58. 安全策略

纯前端工具天然降低攻击面。

不使用：

```text
Database
Server API
User Login
File Upload Server
```

因此第一阶段：

> 不暴露后端接口。

---

# 59. CSP

生产环境逐步增加：

```text
Content-Security-Policy
```

限制：

```text
script-src
style-src
img-src
connect-src
font-src
```

如果使用第三方 Analytics，需要明确加入白名单。

---

# 60. XSS 防护

所有动态内容：

> React 默认 escaping。

不要使用：

```text
dangerouslySetInnerHTML
```

除非：

> 内容经过严格处理。

尤其是：

```text
Markdown
HTML
用户输入
工具生成结果
```

---

# 61. 第三方依赖原则

遵循：

> 能自己写的小工具逻辑，不增加大型依赖。

例如：

```text
HEX ↔ RGB
```

不需要安装大型 color library。

但对于：

```text
ZIP
ICO
复杂图片处理
```

可以选择成熟的小型库。

---

# 62. 许可证管理

所有第三方 npm 包：

```text
package.json
```

需要审核：

- License
- Commercial use
- Redistribution
- Modification
- Attribution

建议：

```text
MIT
Apache-2.0
BSD
ISC
```

优先。

---

# 63. 第三方工具许可证清单

建立：

```text
docs/licenses.md
```

记录：

| Package | Version | License | Used For |
|---|---|---|---|
| React | x | MIT | Frontend |
| Vite | x | MIT | Build |
| Tailwind | x | MIT | CSS |
| JSZip | x | MIT | ZIP |

---

# 64. 测试体系

建立：

```text
Unit Test
Integration Test
E2E Test
SEO Test
Build Test
```

---

# 65. Unit Test

重点测试：

```text
Color conversion
RMB conversion
Gradient generation
Image resize
ICO generation
```

---

# 66. E2E Test

例如：

```text
打开 Favicon Generator
 ↓
上传 PNG
 ↓
生成
 ↓
下载
 ↓
检查文件
```

以及：

```text
打开 PNG to ICO
 ↓
上传
 ↓
转换
 ↓
下载
```

---

# 67. SEO 自动测试

每次 Build 自动检查：

```text
每个页面：
✓ title
✓ description
✓ canonical
✓ h1
✓ sitemap
✓ robots
✓ JSON-LD
✓ status
```

如果缺少：

> Build 直接失败。

---

# 68. Tool Metadata Validation

检查：

```text
slug 是否重复
id 是否重复
title 是否为空
description 是否为空
component 是否存在
category 是否存在
relatedTools 是否存在
```

---

# 69. Build Pipeline

推荐：

```text
Git Push
   ↓
GitHub
   ↓
CI
   ↓
Install
   ↓
Lint
   ↓
Typecheck
   ↓
Unit Test
   ↓
SEO Validation
   ↓
Build
   ↓
Deploy
```

---

# 70. Git 分支策略

简单采用：

```text
main
develop
feature/*
```

生产：

```text
main
```

新功能：

```text
feature/favicon-generator
```

---

# 71. Pull Request

每个新工具：

```text
PR
 ↓
Review
 ↓
CI
 ↓
Preview
 ↓
Merge
 ↓
Production
```

Cloudflare Pages 支持 Git 仓库部署和 Preview Deployments，可用于在合并前验证页面。

---

# 72. 环境

第一阶段：

```text
Development
Preview
Production
```

无需：

```text
Dev Server
Test Server
Staging Server
```

复杂环境。

---

# 73. 环境变量

如果纯前端：

> 尽量没有 Secret。

例如：

```text
VITE_SITE_URL
VITE_ANALYTICS_ID
```

但：

> **任何 VITE_* 都不能放真正的秘密。**

因为会被打包到浏览器。

---

# 74. 不应该放前端的内容

绝对不能：

```text
API Key
Secret
Private Token
Database Password
Admin Token
```

如果未来需要：

```text
AI API
Paid API
Private API
```

再增加 Cloudflare Worker / Pages Functions。

Cloudflare Pages Functions 可以为前端增加服务端 API，而无需单独维护传统服务器。

---

# 75. 第一阶段后端边界

明确：

```text
Browser
 ├── Color
 ├── Favicon
 ├── CSS
 ├── Number
 └── File Processing
```

全部：

> Client Side。

未来：

```text
Cloudflare Worker
 ├── AI API
 ├── Image API
 ├── PDF Processing
 ├── Rate Limit
 └── User API
```

才增加后端。

---

# 76. 第一批工具架构

## Color Picker

```text
ColorPicker UI
      ↓
Color Engine
      ↓
HEX / RGB / HSL
      ↓
Clipboard
```

---

# 77. RMB Uppercase

```text
Input
 ↓
Validation
 ↓
Number Parser
 ↓
RMB Algorithm
 ↓
Output
 ↓
Copy
```

---

# 78. Favicon Generator

```text
File Drop
 ↓
File Validation
 ↓
Image Decode
 ↓
Canvas
 ↓
Resize
 ↓
ICO / PNG
 ↓
ZIP
 ↓
Download
```

---

# 79. CSS Gradient Generator

```text
Gradient State
 ↓
Color Stops
 ↓
Angle
 ↓
Position
 ↓
Gradient Engine
 ↓
CSS String
 ↓
Preview
 ↓
Copy
```

---

# 80. 错误处理

所有工具统一：

```text
Empty Input
Invalid Input
Unsupported Format
Browser Unsupported
Processing Error
Download Error
```

统一组件：

```text
<ToolError />
```

不要每个工具自己设计错误提示。

---

# 81. 浏览器兼容

第一阶段目标：

```text
Chrome
Edge
Firefox
Safari
```

移动：

```text
iOS Safari
Android Chrome
```

---

# 82. Mobile First

工具必须：

> 手机可用。

特别是：

```text
Color Picker
Favicon Generator
Gradient Generator
```

不能只针对桌面。

---

# 83. PWA

第一阶段：

> 暂不做完整 PWA。

如果后期发现：

> 工具具有高频使用属性。

再增加：

```text
Manifest
Service Worker
Offline Cache
Install
```

---

# 84. 国际化

虽然域名是：

```text
oucloud.cn
```

但工具站非常适合国际化。

第一阶段：

```text
English
Chinese
```

不过：

> **不要第一天就做多语言。**

先验证英文或中文市场中的关键词机会。

---

# 85. 国际化 URL

未来：

```text
/en/tools/favicon/png-to-ico
/zh/tools/favicon/png-to-ico
```

或者：

```text
/tools/favicon/png-to-ico
/zh/tools/favicon/png-to-ico
```

但需要根据实际 SEO 市场决定。

第一阶段先统一一种语言。

---

# 86. SEO 数据模型

建议：

```text
Tool
 ├── Product Data
 ├── SEO Data
 ├── Keyword Data
 └── Analytics Data
```

例如：

```ts
{
  tool: {},
  seo: {},
  keywords: {},
  analytics: {}
}
```

---

# 87. Keyword 与 Tool 的关系

一个 Tool 可以覆盖：

```text
1 Primary Keyword
+
Multiple Secondary Keywords
```

例如：

```text
Tool:
PNG to ICO

Primary:
png to ico

Secondary:
png to ico converter
convert png to ico
png ico converter
online png to ico
```

---

# 88. Keyword 与 Page 的关系

如果多个关键词：

> 搜索意图相同。

合并。

如果：

> 搜索意图不同。

拆分。

---

# 89. 防止 SEO Cannibalization

建立：

```text
keywords.ts
```

记录：

```text
keyword
primaryPage
intent
status
```

例如：

```text
png to ico
→ /tools/favicon/png-to-ico

convert png to ico
→ /tools/favicon/png-to-ico

png ico converter
→ /tools/favicon/png-to-ico
```

这样避免多个页面争抢同一个关键词。

---

# 90. Topic Cluster 数据

```ts
interface Topic {
  id: string;
  slug: string;
  name: string;

  parent?: string;

  primaryKeyword: string;

  tools: string[];

  seo: {
    title: string;
    description: string;
  };
}
```

---

# 91. Topic 页面

例如：

```text
/tools/favicon/
```

它负责：

```text
Topic Introduction
+
Tool List
+
Internal Links
+
FAQ
```

成为整个 Favicon Topic 的 Hub。

---

# 92. Sitemap 优先级

不需要人为给所有页面：

```text
priority=1.0
```

重点是：

> URL 是否应该被索引。

Sitemap 核心职责：

> 告诉搜索引擎有哪些正式 URL。

---

# 93. 页面索引策略

以下页面：

```text
正式工具页
正式分类页
```

允许索引。

以下页面：

```text
404
内部测试页
Preview
参数页面
临时页面
```

禁止索引。

---

# 94. 404

建立：

```text
404.html
```

内容：

```text
Page Not Found

[Search Tools]

Popular Tools
```

Cloudflare Pages 支持通过 `404.html` 自定义 Not Found 行为；同时，如果没有顶层 `404.html`，Pages 会按 SPA 行为处理路由。

---

# 95. Redirect

如果以后 URL 修改：

```text
/old-tool
```

301：

```text
/new-tool
```

不要让旧页面直接 404。

---

# 96. Analytics 数据架构

第一阶段不建立数据库。

数据来源：

```text
Search Console
Bing Webmaster
Baidu
Cloudflare Analytics
```

以后如果需要：

```text
Worker
 ↓
Analytics Engine / Database
```

---

# 97. SEO Dashboard

后期可以建立内部：

```text
/oucloud-admin
```

但第一阶段不需要。

初期使用：

```text
Google Search Console
Bing Webmaster
Baidu
Excel / Google Sheets
```

即可。

---

# 98. Keyword Opportunity Map

建立独立：

```text
SEO/keyword-opportunity.xlsx
```

核心字段：

```text
Keyword
Topic
Intent
Search Volume
SERP Competition
Top10 Quality
Backlink Difficulty
Tool Fit
Development Cost
AI Risk
Commercial Value
Opportunity Score
Priority
Status
URL
```

---

# 99. 产品开发与关键词系统

流程：

```text
Keyword Research
      ↓
Opportunity Score
      ↓
S级关键词
      ↓
Product Design
      ↓
Tool Development
      ↓
SEO Page
      ↓
Publish
      ↓
Ranking
      ↓
Optimization
```

这样：

> SEO 不再是开发完成之后才做的事情。

而是：

> **产品需求输入。**

---

# 100. 外链系统

第一阶段不需要程序化管理外链。

建立：

```text
SEO/backlinks.md
```

记录：

```text
Domain
URL
Topic
Link Type
DR/Authority
Status
Date
Anchor
Target Page
```

---

# 101. 外链目标

优先：

```text
Relevant
Real
Editorial
Useful
```

而不是：

```text
Massive
Automated
Spam
```

---

# 102. 可链接资产

OUCloud 应主动设计：

```text
Gradient Collections
Color Palettes
Favicon Guides
CSS Examples
Developer Cheat Sheets
```

这些不是传统 Blog。

它们是：

> **Linkable Tools / Assets。**

---

# 103. GitHub 策略

如果某个工具适合开源：

```text
GitHub
 ↓
Open Source Utility
 ↓
README
 ↓
Demo
 ↓
OUCloud
```

这样可以同时获得：

- 开源曝光
- 开发者用户
- 外链
- GitHub Stars
- 工具传播

---

# 104. 性能预算

建议建立：

```text
Performance Budget
```

例如：

```text
首页 JS
< 150 KB gzip

核心 CSS
< 50 KB gzip

首屏图片
尽量 < 200 KB

第三方脚本
尽量少
```

实际数字可以根据 Lighthouse / Core Web Vitals 数据持续调整。

---

# 105. Build Budget

如果某个工具引入大型依赖：

```text
bundle +500KB
```

CI 应该报警。

避免：

> 一个工具把整个网站拖慢。

---

# 106. 工具依赖隔离

例如：

```text
Favicon
 ↓
ico library
```

不能导致：

```text
Home
 ↓
ico library
```

因此采用：

> Lazy Load / Code Splitting。

---

# 107. 版本管理

采用：

```text
Semantic Versioning
```

例如：

```text
0.1.0
0.2.0
1.0.0
```

第一阶段：

> 产品快速迭代。

---

# 108. Release Checklist

每个工具上线前：

```text
□ Tool 功能正常
□ Mobile 正常
□ Chrome 正常
□ Safari 正常
□ Error 状态正常
□ Title
□ Description
□ H1
□ Canonical
□ JSON-LD
□ Sitemap
□ Internal Links
□ Related Tools
□ Analytics
□ Performance
□ Accessibility
□ License
```

---

# 109. Accessibility

基础要求：

```text
Semantic HTML
Keyboard Navigation
Focus State
ARIA Label
Contrast
Alt Text
```

尤其：

> Color Picker

不能只依赖颜色本身传达信息。

---

# 110. SEO 与 Accessibility 共用结构

使用：

```text
h1
h2
nav
main
section
footer
button
label
```

不要全部：

```text
<div>
```

这同时帮助：

- 搜索引擎
- 屏幕阅读器
- 用户体验

---

# 111. 第一阶段开发顺序

## Phase 1：基础设施

```text
React
Vite
TypeScript
Tailwind
Router
Tool Registry
SEO System
SSG
Sitemap
```

---

## Phase 2：第一批工具

```text
Color Picker
RMB Uppercase
Favicon Generator
CSS Gradient Generator
```

---

## Phase 3：Topic Cluster

优先：

```text
Favicon
Color
CSS
```

---

## Phase 4：SEO

```text
Search Console
Bing
Baidu
Sitemap
Keyword Map
Internal Links
```

---

# 112. 第一阶段时间表

## Week 1

```text
Day 1
项目初始化

Day 2
Layout + Routing

Day 3
Tool Registry

Day 4
SEO System

Day 5
SSG + Sitemap

Day 6
Color Picker

Day 7
部署
```

---

## Week 2

```text
RMB Uppercase
Favicon Generator
Unit Tests
E2E
```

---

## Week 3

```text
CSS Gradient
Related Tools
Category Pages
SEO 内容
```

---

## Week 4

```text
Keyword Research
Indexing
Search Console
Bing
Baidu
性能优化
```

---

# 113. 第二阶段

如果第一阶段验证成功：

```text
Favicon
 ├── PNG → ICO
 ├── JPG → ICO
 ├── SVG → ICO
 ├── Favicon Size
 └── Favicon HTML

Color
 ├── HEX → RGB
 ├── RGB → HEX
 ├── HEX → HSL
 ├── Color Palette
 └── Contrast Checker

CSS
 ├── Gradient
 ├── Shadow
 ├── Border Radius
 └── CSS Formatter
```

---

# 114. 第三阶段

开始进入：

```text
Developer Tools
```

例如：

```text
JSON Formatter
JSON Validator
Base64 Encoder
Base64 Decoder
URL Encoder
URL Decoder
UUID Generator
Timestamp Converter
JWT Decoder
Regex Tester
```

但：

> 每一个工具都必须先通过 Keyword Opportunity Map。

---

# 115. 第四阶段

根据 SEO 数据进入：

```text
Image Tools
File Tools
PDF Tools
Text Tools
Number Tools
Date Tools
```

不提前决定。

---

# 116. 后端演进路线

第一阶段：

```text
Static
```

第二阶段：

```text
Static
+
Cloudflare Functions
```

第三阶段：

```text
Cloudflare Workers
+
KV / D1 / R2
```

第四阶段：

```text
User
+
API
+
Paid Features
```

---

# 117. 什么时候必须增加后端

满足以下任一情况：

```text
需要服务器端 API
需要保存用户数据
需要 AI API Key
需要大文件处理
需要 PDF Server Processing
需要用户账户
需要付费
需要历史记录
```

否则：

> 保持纯前端。

---

# 118. 数据库策略

第一阶段：

> 不需要数据库。

未来如果需要：

```text
Cloudflare D1
```

适合：

- 用户
- 工具使用记录
- 收藏
- 配置
- SEO 数据

---

# 119. 对象存储

如果未来需要：

```text
R2
```

用于：

- 大文件
- 临时文件
- 用户资源
- 图片处理结果

但第一阶段：

> 不需要。

---

# 120. API 层

未来：

```text
/api/*
```

由：

```text
Cloudflare Workers
```

处理。

例如：

```text
/api/ai
/api/pdf
/api/image
```

---

# 121. 最重要的技术原则

OUCloud 必须保持：

```text
简单
+
模块化
+
可静态化
+
可扩展
+
低成本
```

而不是：

```text
为了未来
 ↓
提前做后端
 ↓
数据库
 ↓
CMS
 ↓
用户系统
 ↓
复杂 DevOps
```

---

# 122. 成本模型

第一阶段目标：

```text
Domain
+
DNS
+
Static Hosting
+
GitHub
+
Analytics
```

尽可能：

> 接近零固定服务器成本。

工具本地处理可以进一步减少：

- CPU
- Storage
- Bandwidth
- API

成本。

---

# 123. 技术架构最终形态

```text
                         OUCloud
                            │
                     Cloudflare DNS
                            │
                     Cloudflare CDN
                            │
                    Static HTML / Assets
                            │
                  ┌─────────┴─────────┐
                  │                   │
             SEO Pages            Tool Runtime
                  │                   │
          ┌───────┼───────┐           │
          │       │       │           │
       Favicon  Color     CSS      Browser API
          │       │       │           │
          └───────┼───────┘           │
                  │                   │
             Tool Registry      Local Processing
                  │                   │
             SEO Metadata        File / Canvas
                  │                   │
             Sitemap / JSON-LD       Download
                  │
              Search Engines
                  │
       ┌──────────┼───────────┐
       ↓          ↓           ↓
    Google       Bing        Baidu
       │          │           │
       └──────────┼───────────┘
                  ↓
             Search Traffic
                  ↓
             Tool Usage
                  ↓
             Product Data
                  ↓
           Keyword Research
                  ↓
             New Tools
```

---

# 124. OUCloud 最终产品飞轮

```text
                   Keyword Research
                          ↓
                  Opportunity Map
                          ↓
                       Product
                          ↓
                        Tool
                          ↓
                     SEO Page
                          ↓
                    Topic Cluster
                          ↓
                   Internal Links
                          ↓
                     Backlinks
                          ↓
                       Ranking
                          ↓
                      Traffic
                          ↓
                    Tool Usage
                          ↓
                      Data
                          ↓
                 Keyword Discovery
                          ↓
                     New Tools
                          ↓
                         ...
```

---

# 125. 第一阶段验收标准

不是：

> “4 个工具上线。”

而是：

### 技术

```text
✓ Static HTML
✓ Build Success
✓ SEO Validation
✓ Unit Tests
✓ E2E Tests
✓ Mobile
✓ Performance
✓ Cloudflare Deploy
```

### SEO

```text
✓ Sitemap
✓ Robots
✓ Canonical
✓ Metadata
✓ Structured Data
✓ Internal Links
✓ Search Console
✓ Bing
✓ Baidu
```

### 产品

```text
✓ 4 个工具
✓ 工具正常工作
✓ 无需注册
✓ 尽量本地处理
✓ 移动端可用
✓ Download / Copy 正常
```

---

# 126. 第一阶段最重要的结果

最终必须证明三个假设：

## 假设一

> 用户愿意通过搜索进入工具。

---

## 假设二

> OUCloud 能够通过小而明确的 SERP 获得排名。

---

## 假设三

> 一个 Topic 可以通过多个工具页面持续扩张。

如果三个假设成立：

> OUCloud 可以进入规模化阶段。

---

# 127. 规模化后的开发模型

最终做到：

```text
Keyword
 ↓
Tool Metadata
 ↓
Tool Component
 ↓
Build
 ↓
SEO Page
 ↓
Sitemap
 ↓
Internal Links
 ↓
Deploy
```

新增一个工具的工程成本逐渐降低。

理想状态：

> **一个成熟工具的开发周期从 1～2 天降低到数小时。**

---

# 128. 最终技术决策

| 项目 | 决策 |
|---|---|
| Framework | React |
| Language | TypeScript |
| Build | Vite |
| CSS | Tailwind |
| Routing | React Router |
| SEO | Static Generation |
| Hosting | Cloudflare Pages / 后续 Workers |
| CDN | Cloudflare |
| Database | 第一阶段无 |
| Backend | 第一阶段无 |
| Storage | 第一阶段无 |
| Analytics | Cloudflare / Search Console / Bing / Baidu |
| Testing | Vitest + Playwright |
| CI | GitHub Actions / Cloudflare Preview |
| Sitemap | 自动生成 |
| Robots | 自动生成 |
| Schema | JSON-LD |
| Tool Metadata | TypeScript Registry |
| Keyword Data | 独立 SEO 数据表 |
| File Processing | Browser Local |
| AI API | 后续再增加 |
| Authentication | 后续再增加 |
| Payment | 后续再增加 |

---

# 129. 最终原则

OUCloud 技术架构必须遵循：

> **第一阶段不为未来过度设计。**

优先：

```text
静态
简单
快速
SEO
工具
低成本
```

而不是：

```text
复杂
后端
数据库
账号
支付
AI
```

等真实需求出现以后，再逐步增加。

最终目标不是打造一个“技术很复杂”的网站，而是打造一个：

> **可以从 4 个工具稳定扩展到 100+、甚至 1000+ 工具，同时不会因为 SEO、性能和代码维护失控的工具平台。**

---

# 130. 项目下一步执行顺序

建议正式进入开发前，再完成三个文件：

```text
01_OUCloud_Product_Strategy.md
02_OUCloud_SEO_Strategy.md
03_OUCloud_Technical_Design.md
```

其中：

```text
Product Strategy
        ↓
决定做什么

SEO Strategy
        ↓
决定为什么做、做哪个关键词

Technical Design
        ↓
决定怎么快速、低成本地做出来
```

然后进入：

```text
Keyword Opportunity Map
        ↓
筛选第一批关键词
        ↓
确定 URL
        ↓
确定 4～8 个第一批工具
        ↓
建立项目仓库
        ↓
搭建技术基础设施
        ↓
开发第一个工具
        ↓
上线
```

**不要先写大量代码，再想 SEO。**

OUCloud 的正确顺序应该是：

> **关键词 → 产品 → 页面 → 技术 → 上线 → 数据 → 下一轮产品。**
:::