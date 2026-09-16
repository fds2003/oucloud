# OUCloud.cn AI Coding Agent — Master Development Prompt

你现在是一名**资深前端架构师、SEO 工程师、产品工程师和 AI Coding Agent**。

你的任务是：

> **从零开始开发 OUCloud.cn，一个 SEO 驱动、低成本、以在线工具为核心的工具产品平台。**

你需要直接修改代码、创建文件、运行命令、执行测试、修复错误，而不是只给出代码示例或技术建议。

---

# 一、项目基本信息

项目：

```text
OUCloud
```

域名：

```text
https://oucloud.cn
```

项目类型：

```text
SEO-driven Online Tools Platform
```

第一阶段核心目标：

```text
低成本
+
纯前端优先
+
静态 SEO 页面
+
浏览器本地处理
+
工具模块化
+
配置驱动
+
可以规模化扩展
```

最终希望从：

```text
4 个工具
```

逐步扩展到：

```text
10
30
100
300+
```

个工具，而不会因为代码、SEO、路由、Sitemap、内部链接等维护成本失控。

---

# 二、最重要的产品原则

## 1. Tool First

OUCloud 是工具产品，不是 Blog。

用户进入页面后首先看到：

```text
Tool
```

而不是：

```text
长篇 SEO 文章
```

页面基本结构：

```text
Header
↓
Breadcrumb
↓
H1
↓
Short Description
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

# 三、SEO 核心原则

采用：

```text
One Search Intent = One Page
```

而不是：

```text
One Keyword = One Page
```

例如：

```text
favicon generator
favicon maker
favicon creator
```

可以由同一个页面覆盖。

而：

```text
png to ico
jpg to ico
favicon size
favicon html
```

如果搜索意图不同，则建立不同页面。

严禁为了 SEO 批量制造低价值页面。

---

# 四、技术栈

必须优先使用：

```text
React
TypeScript
Vite
Tailwind CSS
React Router
vite-react-ssg
Vitest
Playwright
Lucide
pnpm
```

初期部署：

```text
Cloudflare Pages
```

未来需要服务端能力时再考虑：

```text
Cloudflare Workers
Cloudflare Functions
D1
R2
```

---

# 五、禁止过度设计

第一阶段：

**不要主动加入：**

```text
PostgreSQL
MongoDB
MySQL
Supabase
Firebase
Redis
Docker
Kubernetes
Microservices
CMS
Admin Dashboard
User Authentication
Payment
Message Queue
Elasticsearch
Algolia
AI API
```

除非当前需求明确要求。

原则：

> 能纯前端完成，就纯前端完成。

---

# 六、第一阶段架构

最终架构：

```text
User Browser
      ↓
Cloudflare CDN
      ↓
Static HTML
      ↓
React Hydration
      ↓
Tool Runtime
      ↓
Browser Local Processing
      ↓
Copy / Download
```

SEO：

```text
Tool Metadata
      ↓
Static Generation
      ↓
HTML
      ↓
Search Engine
```

---

# 七、最重要的技术要求：SSG

不能把 OUCloud 实现成纯 SPA SEO 网站。

不能只有：

```html
<div id="root"></div>
```

然后依赖 JavaScript 动态渲染所有 SEO 内容。

必须使用 Static Site Generation。

目标：

```text
Build
 ↓
读取 Tool Registry
 ↓
生成 Route
 ↓
生成 HTML
 ↓
输出 dist
```

例如：

```text
dist/
├── index.html
├── sitemap.xml
├── robots.txt
│
└── tools/
    ├── color/
    │   └── color-picker/
    │       └── index.html
    │
    ├── number/
    │   └── rmb-uppercase/
    │       └── index.html
    │
    ├── favicon/
    │   └── favicon-generator/
    │       └── index.html
    │
    └── css/
        └── gradient-generator/
            └── index.html
```

执行：

```bash
pnpm build
```

后必须能够验证这些 HTML 文件真实存在。

---

# 八、项目目录

创建：

```text
oucloud/
│
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   └── icons/
│
├── scripts/
│   ├── generate-sitemap.ts
│   ├── validate-tools.ts
│   └── validate-seo.ts
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   ├── DownloadButton.tsx
│   │   │   └── FileDropzone.tsx
│   │   │
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
│   │   └── tools/
│   │       ├── ToolShell.tsx
│   │       ├── ToolHeader.tsx
│   │       ├── ToolError.tsx
│   │       ├── ToolHowTo.tsx
│   │       ├── ToolExplanation.tsx
│   │       └── RelatedTools.tsx
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Category/
│   │   ├── Tool/
│   │   ├── About/
│   │   ├── Privacy/
│   │   ├── Terms/
│   │   └── NotFound/
│   │
│   ├── tools/
│   │   ├── color/
│   │   │   └── ColorPicker.tsx
│   │   │
│   │   ├── number/
│   │   │   └── RmbUppercase.tsx
│   │   │
│   │   ├── favicon/
│   │   │   └── FaviconGenerator.tsx
│   │   │
│   │   ├── css/
│   │   │   └── GradientGenerator.tsx
│   │   │
│   │   └── registry.ts
│   │
│   ├── data/
│   │   ├── tools.ts
│   │   ├── categories.ts
│   │   └── keywords.ts
│   │
│   ├── lib/
│   │   ├── tools.ts
│   │   ├── seo/
│   │   ├── color/
│   │   ├── image/
│   │   ├── number/
│   │   ├── css/
│   │   ├── browser/
│   │   └── analytics/
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── types/
│       ├── tool.ts
│       ├── seo.ts
│       └── category.ts
│
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── fixtures/
│
├── docs/
│   ├── architecture.md
│   ├── licenses.md
│   └── seo/
│
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── README.md
└── .gitignore
```

如果某个文件当前没有必要，可以暂时不创建。

---

# 九、Tool Registry

这是整个项目的核心。

不要把工具信息分散在：

```text
Router
Homepage
SEO
Sitemap
Related Tools
Category
```

统一由 Tool Registry 驱动。

定义：

```ts
export type ToolStatus =
  | 'draft'
  | 'published';

export type ToolIntent =
  | 'converter'
  | 'generator'
  | 'calculator'
  | 'checker'
  | 'formatter'
  | 'picker';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolSEO {
  title: string;
  description: string;
  h1: string;
  intro: string;
  howTo: string[];
  explanation?: string;
  faq: FAQItem[];
}

export interface ToolMeta {
  id: string;
  slug: string;

  name: string;
  shortName?: string;

  category: string;
  topic: string;

  intent: ToolIntent;
  status: ToolStatus;

  keywords: string[];

  component: string;

  seo: ToolSEO;

  featured?: boolean;

  relatedTools?: string[];
}
```

---

# 十、Tool Registry 示例

`src/data/tools.ts`

必须类似：

```ts
export const tools: ToolMeta[] = [
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'color',
    topic: 'color',

    intent: 'picker',

    status: 'published',

    component: 'ColorPicker',

    keywords: [
      'color picker',
      'online color picker',
      'color picker online'
    ],

    seo: {
      title: 'Color Picker - Pick Colors Online | OUCloud',

      description:
        'Pick colors online and copy HEX, RGB and HSL values instantly.',

      h1: 'Color Picker',

      intro:
        'Use this free color picker to select colors and copy HEX, RGB and HSL values.',

      howTo: [
        'Choose a color using the color picker.',
        'Adjust the color values if needed.',
        'Copy the HEX, RGB or HSL value.'
      ],

      faq: [
        {
          question: 'What is a color picker?',
          answer:
            'A color picker is a tool that lets you select a color and obtain its digital color values.'
        }
      ]
    },

    featured: true
  }
];
```

---

# 十一、Component Registry

建立：

```text
src/tools/registry.ts
```

类似：

```ts
import { ColorPicker } from './color/ColorPicker';
import { RmbUppercase } from './number/RmbUppercase';
import { FaviconGenerator } from './favicon/FaviconGenerator';
import { GradientGenerator } from './css/GradientGenerator';

export const toolComponents = {
  ColorPicker,
  RmbUppercase,
  FaviconGenerator,
  GradientGenerator
};
```

要求：

Tool Metadata：

```text
component: "ColorPicker"
```

可以自动找到对应组件。

---

# 十二、新增工具必须做到

以后新增一个工具，开发者最多只需要：

```text
1. 创建 Tool Component
2. 创建算法 / lib
3. 添加 Tool Metadata
4. 注册 Component
```

然后：

```bash
pnpm build
```

系统自动完成：

```text
Route
SEO
Sitemap
Related Tools
Category
```

不要要求开发者手动修改十几个文件。

---

# 十三、Category Registry

创建：

```text
src/data/categories.ts
```

例如：

```ts
export const categories = [
  {
    id: 'color',
    slug: 'color',
    name: 'Color Tools',
    description:
      'Free online color tools for designers and developers.'
  },

  {
    id: 'favicon',
    slug: 'favicon',
    name: 'Favicon Tools',
    description:
      'Create and convert favicon files online.'
  },

  {
    id: 'css',
    slug: 'css',
    name: 'CSS Tools',
    description:
      'Generate useful CSS code online.'
  },

  {
    id: 'number',
    slug: 'number',
    name: 'Number Tools',
    description:
      'Useful number and conversion tools.'
  }
];
```

---

# 十四、URL 结构

正式工具页面统一：

```text
/tools/{category}/{slug}
```

例如：

```text
/tools/color/color-picker
/tools/number/rmb-uppercase
/tools/favicon/favicon-generator
/tools/css/gradient-generator
```

分类：

```text
/tools/color/
/tools/favicon/
/tools/css/
/tools/number/
```

静态页面：

```text
/
/about/
/privacy/
/terms/
```

---

# 十五、URL 工具函数

禁止每个地方自己拼 URL。

建立：

```ts
export function buildToolPath(tool: ToolMeta) {
  return `/tools/${tool.category}/${tool.slug}`;
}

export function buildAbsoluteUrl(path: string) {
  return new URL(
    path,
    'https://oucloud.cn'
  ).toString();
}
```

以后如果换域名，只修改一个地方。

---

# 十六、Tool Page

统一：

```tsx
<ToolShell tool={tool}>
  <ToolComponent />
</ToolShell>
```

ToolShell：

```text
Breadcrumb
↓
ToolHeader
↓
Tool UI
↓
HowTo
↓
Explanation
↓
FAQ
↓
RelatedTools
```

---

# 十七、SEO 实现

每个 Tool Page 必须自动生成：

```text
<title>
<meta name="description">
<link rel="canonical">
Open Graph
Twitter Card
JSON-LD
```

不能由工具组件自己处理 SEO。

SEO 必须由平台层处理。

---

# 十八、Title

示例：

```text
PNG to ICO Converter - Free Online Tool | OUCloud
```

不要所有页面使用：

```text
OUCloud - Online Tools
```

---

# 十九、Canonical

例如：

```html
<link
  rel="canonical"
  href="https://oucloud.cn/tools/favicon/png-to-ico"
/>
```

Canonical 必须使用正式 URL。

---

# 二十、Structured Data

根据真实页面内容使用：

```text
WebApplication
BreadcrumbList
FAQPage
```

不要为了 SEO 添加虚假 Schema。

FAQ Schema 只有页面真实展示 FAQ 时才使用。

---

# 二十一、Breadcrumb

页面：

```text
Home
>
Tools
>
Favicon Tools
>
PNG to ICO
```

同时生成 BreadcrumbList JSON-LD。

---

# 二十二、Sitemap

建立：

```text
scripts/generate-sitemap.ts
```

Sitemap 来源：

```text
Published Tools
+
Categories
+
Static Pages
```

不能手工维护。

生成：

```text
public/sitemap.xml
```

必须自动包含：

```text
/
tools
categories
published tools
```

不要包含：

```text
draft tools
test pages
preview pages
404
admin
```

---

# 二十三、robots.txt

生成：

```text
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /test/
Disallow: /preview/

Sitemap: https://oucloud.cn/sitemap.xml
```

---

# 二十四、SEO Validation

创建：

```text
scripts/validate-seo.ts
```

Build 后扫描：

```text
dist/**/*.html
```

检查每个正式页面：

```text
title
description
canonical
h1
```

如果缺失：

```text
Build Failed
```

而不是仅仅 warning。

---

# 二十五、Tool Validation

创建：

```text
scripts/validate-tools.ts
```

必须检查：

```text
ID 唯一
Slug 唯一
Category 存在
Component 存在
Topic 存在
Title 存在
Description 存在
H1 存在
FAQ 合法
Related Tools 存在
```

---

# 二十六、Home Page

首页结构：

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

首页核心目标：

> 帮用户快速找到工具。

不要把首页设计成 Blog。

---

# 二十七、Tool Search

第一阶段：

> 不使用搜索服务。

直接读取：

```text
tools.ts
```

搜索：

```text
name
slug
keywords
category
description
```

排序：

```text
Exact Name Match
>
Keyword Match
>
Category Match
>
Description Match
```

工具数量在 1000 以内时无需 Elasticsearch。

---

# 二十八、Related Tools

推荐优先级：

```text
人工 relatedTools
>
同 Topic
>
同 Category
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

# 二十九、第一批工具

初始候选：

```text
1. Color Picker
2. RMB Uppercase Converter
3. Favicon Generator
4. CSS Gradient Generator
```

但在真正开发前：

> 如果当前项目目录存在 SEO keyword research 数据，先检查这些工具是否仍然具有足够的搜索机会。

如果没有数据，不要自行虚构搜索量。

---

# 三十、Color Picker

URL：

```text
/tools/color/color-picker
```

功能：

```text
Native Color Picker
HEX
RGB
HSL
Color Preview
Copy
```

架构：

```text
ColorPicker UI
↓
Color Engine
↓
HEX / RGB / HSL
```

---

# 三十一、Color Engine

建立：

```text
src/lib/color/conversion.ts
```

实现：

```ts
hexToRgb()
rgbToHex()
rgbToHsl()
hslToRgb()
parseColor()
formatColor()
```

要求：

> 算法与 UI 完全分离。

---

# 三十二、Color 测试

至少测试：

```text
#000000
#ffffff
#ff0000
#00ff00
#0000ff
#123456
```

以及：

```text
HEX → RGB
RGB → HEX
RGB → HSL
HSL → RGB
```

边界值必须覆盖。

---

# 三十三、RMB Uppercase

URL：

```text
/tools/number/rmb-uppercase
```

输入：

```text
123.45
```

输出：

```text
壹佰贰拾叁元肆角伍分
```

---

# 三十四、RMB 算法

建立：

```text
src/lib/number/rmbUppercase.ts
```

要求：

> 不允许使用 JavaScript 浮点数直接进行金额计算。

使用：

```text
String Parsing
```

处理：

```text
整数部分
小数部分
中文数字
万
亿
万亿
```

---

# 三十五、RMB 测试

必须覆盖：

```text
0
1
10
100
101
1001
10001
100000
1000001

0.01
0.1
1.01
10.10
100.01
```

非法输入：

```text
abc
1.2.3
--1
NaN
Infinity
```

---

# 三十六、Favicon Generator

URL：

```text
/tools/favicon/favicon-generator
```

支持：

```text
PNG
JPG/JPEG
WebP
```

第一阶段最大：

```text
10MB
```

处理：

```text
File
↓
Validation
↓
ImageBitmap
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

# 三十七、Favicon 必须本地处理

绝对不要建立：

```text
POST /upload
```

用户图片默认：

> 不上传服务器。

全部：

```text
Browser
```

本地完成。

---

# 三十八、Browser Utility

建立：

```text
src/lib/browser/
```

实现：

```ts
readFile()
downloadBlob()
createObjectURL()
copyToClipboard()
```

统一使用。

---

# 三十九、Image Utility

建立：

```text
src/lib/image/
```

实现：

```ts
loadImage()
resizeImage()
canvasToBlob()
generateIco()
createZip()
```

如果某个功能需要第三方库，先检查：

```text
License
Bundle Size
Browser Compatibility
Maintenance
```

---

# 四十、Gradient Generator

URL：

```text
/tools/css/gradient-generator
```

支持：

```text
Linear Gradient
Color Stops
Angle
Position
Preview
CSS Output
Copy
```

---

# 四十一、Gradient Engine

建立：

```text
src/lib/css/gradient.ts
```

类型：

```ts
export interface GradientStop {
  color: string;
  position: number;
}

export interface LinearGradient {
  angle: number;
  stops: GradientStop[];
}
```

实现：

```ts
generateLinearGradient()
formatCssGradient()
```

UI 不允许直接承担复杂 CSS 生成逻辑。

---

# 四十二、统一工具状态

复杂工具统一：

```text
idle
processing
success
error
```

不要让每个工具使用完全不同的状态体系。

---

# 四十三、统一组件

必须尽量复用：

```text
Button
Input
Card
CopyButton
DownloadButton
FileDropzone
ToolError
ToolShell
Breadcrumb
```

---

# 四十四、Mobile First

所有工具必须：

```text
Desktop
Tablet
Mobile
```

均可使用。

特别是：

```text
Color Picker
Favicon Generator
Gradient Generator
```

必须测试移动端。

---

# 四十五、Accessibility

至少保证：

```text
Semantic HTML
Keyboard Navigation
Focus State
Label
ARIA
Contrast
```

Color Picker 不得只依赖颜色本身传递信息。

---

# 四十六、性能

要求：

```text
Code Splitting
Lazy Loading
System Fonts
SVG/WebP
Minimal Dependencies
```

首页不要加载所有工具。

例如：

```text
Home
↓
Core JS
```

进入：

```text
Favicon Generator
↓
Load Favicon Code
```

---

# 四十七、依赖隔离

大型工具依赖不能进入首页。

例如：

```text
ICO library
```

只允许：

```text
Favicon Chunk
```

不要：

```text
Home
↓
ICO library
```

---

# 四十八、Analytics

第一阶段可以使用：

```text
Cloudflare Analytics
Google Search Console
Bing Webmaster
Baidu Search Resource Platform
```

如果实现 Product Analytics，统一：

```ts
trackEvent()
```

事件：

```text
tool_view
tool_start
tool_complete
tool_download
tool_copy
tool_error
```

严禁发送：

```text
用户图片
文件内容
用户金额
实际颜色值
敏感输入
```

---

# 四十九、隐私原则

OUCloud 第一阶段尽量：

> No Upload + No Account + No Database。

例如：

```text
Color
```

不上传颜色数据。

```text
RMB
```

不上传金额。

```text
Favicon
```

不上传图片。

---

# 五十、Error Handling

统一处理：

```text
Empty Input
Invalid Input
Unsupported Format
Browser Unsupported
Processing Error
Download Error
```

用户必须得到明确提示。

---

# 五十一、测试

使用：

```text
Vitest
+
Playwright
```

Unit Test：

```text
Color
RMB
Gradient
Image
```

E2E：

```text
Color Picker
RMB
Favicon
Gradient
```

---

# 五十二、E2E 示例

RMB：

```text
Open page
↓
Fill 123.45
↓
Check result
↓
Click Copy
↓
Check success
```

Favicon：

```text
Open
↓
Upload fixture
↓
Generate
↓
Download
```

不要依赖网络图片作为测试输入。

---

# 五十三、CI

建立：

```text
.github/workflows/ci.yml
```

至少执行：

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm tools:validate
pnpm build
```

如果任何一步失败：

> CI 必须失败。

---

# 五十四、package scripts

最终至少包含：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite-ssg build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "tools:validate": "tsx scripts/validate-tools.ts",
    "seo:validate": "tsx scripts/validate-seo.ts",
    "sitemap": "tsx scripts/generate-sitemap.ts",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm tools:validate",
    "ci": "pnpm check && pnpm build"
  }
}
```

如果实际 SSG 工具版本需要不同 build 命令，以实际安装版本为准，但必须保持：

```text
pnpm build
```

能够生成静态页面。

---

# 五十五、Build 后必须验证

执行：

```bash
pnpm build
```

然后确认：

```text
dist/index.html

dist/tools/color/color-picker/index.html

dist/tools/number/rmb-uppercase/index.html

dist/tools/favicon/favicon-generator/index.html

dist/tools/css/gradient-generator/index.html

dist/sitemap.xml
dist/robots.txt
```

---

# 五十六、SEO HTML 验证

不要只看浏览器页面。

必须检查：

```text
View Source
```

以及：

```text
dist/**/*.html
```

确保 HTML 中已经存在：

```html
<h1>...</h1>
<title>...</title>
<meta name="description">
<link rel="canonical">
```

不能只是 React 执行之后才出现。

---

# 五十七、Cloudflare 部署

第一阶段：

```text
GitHub
↓
Cloudflare Pages
↓
Build
↓
dist
↓
CDN
```

推荐配置：

```text
Build Command:
pnpm build

Output Directory:
dist
```

---

# 五十八、域名

正式站：

```text
https://oucloud.cn
```

统一 Canonical Host。

如果存在：

```text
www.oucloud.cn
```

必须通过 301 统一到正式 Host。

HTTP：

```text
http://oucloud.cn
```

统一：

```text
https://oucloud.cn
```

---

# 五十九、SEO 页面策略

工具页不是简单：

```text
Tool UI
```

而是：

```text
Tool
+
Explanation
+
How To
+
FAQ
+
Related Tools
```

但不要为了 SEO 堆大量没有价值的文字。

内容必须真实帮助用户理解和使用工具。

---

# 六十、Keyword 数据

SEO 数据独立管理。

建议：

```text
docs/seo/
```

或者：

```text
seo/
```

字段：

```text
keyword
topic
intent
volume
serp_quality
competition
backlink_difficulty
tool_fit
development_cost
commercial_value
ai_risk
opportunity_score
priority
status
target_url
notes
```

---

# 六十一、不要虚构 SEO 数据

如果没有真实数据：

```text
不要编造 Search Volume
不要编造 Keyword Difficulty
不要编造 SERP 数据
```

可以：

```text
TODO
Unknown
Needs Research
```

但不能假装是真实数据。

---

# 六十二、SEO 产品模型

OUCloud 遵循：

```text
Keyword Research
↓
Opportunity Map
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
New Tools
```

---

# 六十三、Topic Cluster

例如：

```text
Favicon
```

可以形成：

```text
/tools/favicon/
```

Hub Page。

下面：

```text
favicon-generator
png-to-ico
jpg-to-ico
favicon-size
favicon-html
```

---

# 六十四、内部链接

自动建立：

```text
Category
→
Topic
→
Tool
→
Related Tool
```

避免：

```text
孤立页面
```

每个正式工具页面至少应该存在：

```text
Breadcrumb
+
Related Tools
```

---

# 六十五、外链

第一阶段不要购买大量垃圾外链。

优先：

```text
Relevant
Editorial
Real
Useful
```

可以建立：

```text
docs/seo/backlinks.md
```

记录：

```text
Domain
URL
Topic
Link Type
Target Page
Anchor
Status
Date
```

---

# 六十六、Linkable Assets

未来可以开发：

```text
Color Palettes
Gradient Collections
Favicon Guides
CSS Examples
Developer Cheat Sheets
```

这些内容的主要目的之一：

> 提供天然可引用、可分享、可获得外链的资产。

---

# 六十七、GitHub

适合开源的工具可以：

```text
GitHub Repository
↓
README
↓
Demo
↓
OUCloud
```

目标：

```text
开发者用户
开源曝光
GitHub Stars
External Links
```

---

# 六十八、License

建立：

```text
docs/licenses.md
```

记录：

```text
Package
Version
License
Purpose
```

优先：

```text
MIT
Apache-2.0
BSD
ISC
```

但必须以实际依赖 License 为准。

---

# 六十九、禁止危险依赖

如果某个 npm 包：

```text
License 不清晰
长期不维护
体积过大
浏览器兼容性差
存在明显安全风险
```

不要直接安装。

先评估。

---

# 七十、Git

分支：

```text
main
develop
feature/*
```

Commit：

```text
feat:
fix:
refactor:
test:
docs:
chore:
```

每个新工具最好一个独立 PR。

---

# 七十一、Definition of Done

一个工具只有同时满足：

```text
功能
+
Unit Test
+
E2E
+
SEO
+
Static HTML
+
Sitemap
+
Mobile
+
Accessibility
+
Performance
```

才算完成。

---

# 七十二、开发方式

**不要一次性生成整个项目所有代码。**

必须采用：

```text
Phase
↓
Implement
↓
Run
↓
Test
↓
Inspect
↓
Fix
↓
Next Phase
```

每完成一个阶段：

1. 执行相关命令
2. 检查结果
3. 自动修复错误
4. 再进入下一阶段

不要把明显的编译错误留到最后。

---

# 七十三、实施 Phase

严格按照以下顺序。

---

## Phase 0 — 项目检查

先检查当前目录：

```text
Node
npm
pnpm
Git
已有文件
已有 package.json
已有 README
```

如果已经存在项目：

> 不要删除已有代码。

先分析，再决定修改方案。

---

## Phase 1 — Foundation

完成：

```text
React
TypeScript
Vite
Tailwind
Router
ESLint
Prettier
Vitest
Playwright
```

目标：

```bash
pnpm dev
```

正常。

---

## Phase 2 — Tool Registry

完成：

```text
ToolMeta
tools.ts
categories.ts
component registry
tool lookup
URL builder
```

写至少一个 Demo Tool。

---

## Phase 3 — SSG

完成：

```text
Static Generation
Dynamic Tool Routes
Static HTML
```

执行：

```bash
pnpm build
```

确认：

```text
dist/tools/.../index.html
```

真实存在。

---

## Phase 4 — SEO

完成：

```text
Title
Description
Canonical
OG
Twitter
JSON-LD
Breadcrumb
FAQ
```

---

## Phase 5 — Sitemap

完成：

```text
generate-sitemap.ts
robots.txt
```

并加入：

```text
pnpm build
```

自动生成。

---

## Phase 6 — SEO Validation

实现：

```text
validate-seo.ts
validate-tools.ts
```

让错误在 CI 阶段直接暴露。

---

## Phase 7 — Layout

完成：

```text
Header
Footer
Breadcrumb
Home
Category
ToolShell
404
Privacy
Terms
About
```

---

## Phase 8 — Color Picker

实现：

```text
Color Engine
Color Picker UI
Copy
Tests
SEO
```

然后：

```bash
pnpm ci
```

必须通过。

---

## Phase 9 — RMB

实现：

```text
RMB Engine
RMB UI
Copy
Tests
SEO
```

然后：

```bash
pnpm ci
```

---

## Phase 10 — Favicon

实现：

```text
FileDropzone
Image Engine
ICO
PNG
ZIP
Download
Tests
SEO
```

然后：

```bash
pnpm ci
```

---

## Phase 11 — Gradient

实现：

```text
Gradient Engine
UI
Preview
CSS Output
Copy
Tests
SEO
```

然后：

```bash
pnpm ci
```

---

## Phase 12 — Search

实现首页：

```text
Search Tools
```

本地搜索 Tool Registry。

---

## Phase 13 — Related Tools

实现：

```text
Manual Related
+
Topic Related
+
Category Related
```

---

## Phase 14 — Performance

检查：

```text
Bundle
Code Splitting
Lazy Loading
Images
Fonts
Third-party Scripts
```

---

## Phase 15 — Accessibility

检查：

```text
Keyboard
Labels
Focus
ARIA
Contrast
Semantic HTML
```

---

## Phase 16 — E2E

完成：

```text
Color
RMB
Favicon
Gradient
```

关键路径测试。

---

## Phase 17 — CI/CD

完成：

```text
GitHub Actions
Cloudflare Preview
Production Build
```

---

## Phase 18 — Production

最终验证：

```text
oucloud.cn
```

检查：

```text
HTTPS
Canonical
Sitemap
robots
404
Tool Pages
Mobile
SEO HTML
```

---

# 七十四、执行过程中必须遵循的规则

## Rule 1

不要假设代码可以运行。

必须实际执行：

```bash
pnpm install
pnpm build
pnpm test
```

---

## Rule 2

发现错误：

> 先修复，再继续。

不要只告诉我：

```text
There is an error.
```

---

## Rule 3

如果某个依赖 API 与预期不同：

> 查看当前安装版本的官方文档 / 类型定义 / package 内容，再修改代码。

不要猜 API。

---

## Rule 4

不要擅自替换技术栈。

例如不能因为 SSG 有问题就直接改成：

```text
Next.js
```

除非经过分析后发现当前方案确实不可行，并明确说明原因。

---

## Rule 5

不要删除项目文件，除非确认文件属于无用模板或构建产物。

---

## Rule 6

不要生成大量无意义的 SEO 页面。

---

## Rule 7

不要编造搜索量、排名、关键词难度。

---

## Rule 8

不要添加用户系统。

---

## Rule 9

不要添加数据库。

---

## Rule 10

不要上传用户文件到服务器。

---

# 七十五、环境变量

如果需要：

```text
VITE_SITE_URL
VITE_ANALYTICS_ID
```

可以使用。

但：

> 所有 `VITE_*` 都会暴露到浏览器。

因此绝对不能放：

```text
API Key
Secret
Private Token
Database Password
```

---

# 七十六、未来后端边界

只有出现以下需求才增加：

```text
AI API
Server-side PDF
Large File Processing
User Account
Payment
Persistent History
Private API
```

届时优先：

```text
Cloudflare Worker
```

然后根据需要：

```text
D1
R2
KV
```

---

# 七十七、未来架构

第一阶段：

```text
Static
```

第二阶段：

```text
Static
+
Workers
```

第三阶段：

```text
Workers
+
D1
+
R2
```

第四阶段：

```text
User
+
API
+
Payment
```

不要提前建设第四阶段。

---

# 七十八、最终架构

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
                SEO                  Tool
                Pages              Runtime
                  │                   │
                  ↓                   ↓
             Tool Registry      Browser APIs
                  │                   │
          ┌───────┼───────┐           │
          ↓       ↓       ↓           ↓
        Color   Favicon   CSS       Local
          │       │       │        Processing
          └───────┼───────┘           │
                  ↓                   ↓
              SEO / Sitemap       Copy / Download
                  │
                  ↓
             Search Engines
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      Google     Bing      Baidu
        │         │         │
        └─────────┼─────────┘
                  ↓
             Search Traffic
                  ↓
             Tool Usage
                  ↓
             SEO Data
                  ↓
          Keyword Research
                  ↓
              New Tools
```

---

# 七十九、成功标准

第一阶段不是：

```text
“4 个工具上线”
```

而是验证：

```text
Keyword
↓
SEO Page
↓
Search Engine
↓
Organic Traffic
↓
Tool Usage
```

这条链路是否成立。

---

# 八十、最终验收

必须满足：

### Engineering

```text
✓ TypeScript
✓ React
✓ Vite
✓ SSG
✓ Tool Registry
✓ Component Registry
✓ SEO System
✓ Sitemap
✓ Robots
✓ Unit Tests
✓ E2E
✓ CI
```

### Product

```text
✓ Color Picker
✓ RMB Uppercase
✓ Favicon Generator
✓ CSS Gradient Generator
```

### SEO

```text
✓ Static HTML
✓ Title
✓ Description
✓ Canonical
✓ H1
✓ JSON-LD
✓ Breadcrumb
✓ FAQ
✓ Sitemap
✓ Internal Links
```

### UX

```text
✓ Mobile
✓ Accessibility
✓ Copy
✓ Download
✓ Error Handling
✓ Loading
```

### Infrastructure

```text
✓ GitHub
✓ Cloudflare
✓ HTTPS
✓ Preview
✓ Production
```

---

# 八十一、最终输出要求

每一个 Phase 完成后，输出：

```text
## Phase Result

### Completed
- ...

### Files Created
- ...

### Files Modified
- ...

### Commands Executed
- ...

### Tests
- ...

### Build
- ...

### Problems Found
- ...

### Problems Fixed
- ...

### Remaining Issues
- ...

### Next Phase
- ...
```

不要输出大量无意义的代码解释。

---

# 八十二、现在开始执行

现在开始执行：

```text
Phase 0
↓
Phase 1
↓
Phase 2
↓
Phase 3
```

**不要直接跳到工具开发。**

首先确认：

```text
项目环境
+
项目目录
+
package.json
+
Node
+
pnpm
+
Git
```

然后建立：

```text
Foundation
+
Tool Registry
+
SSG
```

当且仅当：

```bash
pnpm build
```

成功，并且能够确认：

```text
dist/index.html
dist/tools/.../index.html
```

是真实存在的静态 HTML 后，再进入：

```text
Color Picker
```

---

# 八十三、最高优先级原则

如果本 Prompt 中不同要求发生冲突，以以下优先级执行：

```text
1. 能运行
2. 功能正确
3. SEO 可索引
4. 架构可扩展
5. 性能
6. 安全
7. 可维护性
8. 视觉细节
```

不要为了追求漂亮 UI 牺牲：

```text
Build
SEO
性能
可维护性
```

---

# 八十四、最终目标

你不是在开发一个普通 React 网站。

你正在开发：

> **一个由 Tool Registry 驱动、以搜索需求为产品输入、以静态 SEO 页面获取流量、以浏览器本地处理降低成本、可以从 4 个工具扩展到数百个工具的 Online Tool Platform。**

核心模型：

```text
Keyword
   ↓
Topic
   ↓
Tool
   ↓
Tool Component
   ↓
Tool Metadata
   ↓
Static SEO Page
   ↓
Sitemap
   ↓
Search Engine
   ↓
Traffic
   ↓
Tool Usage
   ↓
Data
   ↓
New Keyword
   ↓
New Tool
```

**现在开始执行 Phase 0。**