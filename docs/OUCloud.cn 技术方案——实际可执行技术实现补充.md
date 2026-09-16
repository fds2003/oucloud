# 131. 实际可执行技术实现

> 本章节不是架构说明，而是直接面向开发执行。
>
> 目标：
>
> **开发者或 AI Coding Agent 按照本章节即可初始化项目、开发第一个工具、执行构建、生成 SEO 页面并部署。**

---

# 132. 第一阶段技术实现调整

上一版采用：

```text
React
+
Vite
+
React Router
+
静态生成
```

这里进一步明确：

> **不要自己从零实现一个复杂 SSG 框架。**

第一阶段推荐使用：

```text
React
+
Vite
+
vite-react-ssg
+
React Router
+
TypeScript
+
Tailwind CSS
```

原因：

如果自己实现：

```text
React renderToString
+
路由遍历
+
HTML Template
+
Hydration
+
Asset Path
+
Code Splitting
```

会把大量精力浪费在基础设施上。

OUCloud 的核心竞争力应该放在：

```text
Keyword
+
Tool
+
SEO
+
Distribution
```

而不是自己造 SSG。

---

# 133. 项目初始化

推荐使用 Node.js LTS。

检查环境：

```bash
node -v
npm -v
```

然后：

```bash
corepack enable
```

使用 pnpm：

```bash
corepack prepare pnpm@latest --activate
```

创建项目：

```bash
pnpm create vite oucloud --template react-ts
```

进入项目：

```bash
cd oucloud
```

安装依赖：

```bash
pnpm install
```

---

# 134. 安装核心依赖

```bash
pnpm add react-router-dom
pnpm add vite-react-ssg
pnpm add lucide-react
pnpm add clsx
```

开发依赖：

```bash
pnpm add -D tailwindcss
pnpm add -D @tailwindcss/vite
pnpm add -D vitest
pnpm add -D @playwright/test
pnpm add -D eslint
pnpm add -D prettier
```

如果使用 ZIP：

```bash
pnpm add jszip
```

如果需要更复杂的 ICO 编码：

```bash
pnpm add icojs
```

具体库最终以实际 License 审核结果为准。

---

# 135. package.json

建议最终：

```json
{
  "name": "oucloud",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite-ssg build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "seo:validate": "tsx scripts/validate-seo.ts",
    "tools:validate": "tsx scripts/validate-tools.ts",
    "sitemap": "tsx scripts/generate-sitemap.ts",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm tools:validate && pnpm seo:validate",
    "ci": "pnpm check && pnpm build"
  }
}
```

---

# 136. TypeScript 路径别名

不要大量出现：

```ts
../../../../components
```

使用：

```text
@
```

例如：

```ts
import { Button } from '@/components/common/Button';
```

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Vite 同时配置：

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

---

# 137. Vite 配置

最终：

```ts
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteSSG } from 'vite-react-ssg';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  build: {
    target: 'es2020',

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
```

实际使用 `vite-react-ssg` 时，以当前版本 API 为准进行初始化。

---

# 138. 应用入口

建立：

```text
src/main.tsx
```

采用 SSG 入口：

```tsx
import { ViteSSG } from 'vite-react-ssg';
import App from './App';
import { routes } from './app/router';

export const createApp = ViteSSG(
  App,
  {
    routes
  }
);
```

具体 API 需要与安装版本保持一致。

核心思想只有一个：

```text
Build
 ↓
Routes
 ↓
Render
 ↓
Static HTML
```

---

# 139. Router

建立：

```text
src/app/router.tsx
```

推荐：

```tsx
import type { RouteRecordRaw } from 'vue-router';
```

不要照搬 Vue 类型。

React Router 本身建议使用 React Router 的路由对象类型。

实际项目可以定义自己的：

```ts
export interface AppRoute {
  path: string;
  element: React.ReactNode;
}
```

然后统一从 Tool Registry 生成工具路由。

---

# 140. Tool Registry 是核心

不要这样：

```tsx
<Route path="/tools/color/color-picker" element={<ColorPicker />} />
<Route path="/tools/favicon/png-to-ico" element={<PngToIco />} />
<Route path="/tools/number/rmb-uppercase" element={<RmbUppercase />} />
```

随着工具增加会越来越难维护。

应该：

```text
Tool Registry
       ↓
Routes
       ↓
Pages
       ↓
Sitemap
       ↓
SEO
       ↓
Related Tools
```

---

# 141. Tool 类型

建立：

```text
src/types/tool.ts
```

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

# 142. Tool Component Registry

建立：

```text
src/tools/registry.ts
```

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

类型：

```ts
export type ToolComponentName =
  keyof typeof toolComponents;
```

这样 Tool Metadata：

```ts
component: 'ColorPicker'
```

就可以找到真正的 React Component。

---

# 143. tools.ts

建立：

```text
src/data/tools.ts
```

例如：

```ts
import type { ToolMeta } from '@/types/tool';

export const tools: ToolMeta[] = [
  {
    id: 'color-picker',
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'color',
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
            'A color picker is a tool that allows you to select a color and obtain its digital color values.'
        }
      ]
    },

    featured: true
  }
];
```

---

# 144. 工具查找 API

建立：

```text
src/lib/tools.ts
```

```ts
import { tools } from '@/data/tools';

export function getPublishedTools() {
  return tools.filter(
    tool => tool.status === 'published'
  );
}

export function getToolBySlug(slug: string) {
  return tools.find(
    tool => tool.slug === slug
  );
}

export function getToolById(id: string) {
  return tools.find(
    tool => tool.id === id
  );
}
```

---

# 145. Category 数据

```text
src/data/categories.ts
```

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

# 146. 动态工具页面

建立：

```text
src/pages/Tool/ToolPage.tsx
```

核心逻辑：

```tsx
export function ToolPage({
  tool
}: {
  tool: ToolMeta;
}) {
  const Component =
    toolComponents[
      tool.component as ToolComponentName
    ];

  if (!Component) {
    return <NotFound />;
  }

  return (
    <ToolShell tool={tool}>
      <Component />
    </ToolShell>
  );
}
```

---

# 147. ToolShell

建立：

```text
src/components/tools/ToolShell.tsx
```

```tsx
export function ToolShell({
  tool,
  children
}: {
  tool: ToolMeta;
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb tool={tool} />

      <ToolHeader tool={tool} />

      <main>
        <section>
          {children}
        </section>

        <ToolHowTo tool={tool} />

        <ToolExplanation tool={tool} />

        <ToolFAQ tool={tool} />

        <RelatedTools tool={tool} />
      </main>
    </>
  );
}
```

---

# 148. SEO Metadata 不要散落在组件里

建立：

```text
src/lib/seo/buildSeo.ts
```

```ts
export function buildToolSEO(tool: ToolMeta) {
  return {
    title: tool.seo.title,

    description:
      tool.seo.description,

    canonical:
      `https://oucloud.cn/tools/${tool.category}/${tool.slug}`
  };
}
```

---

# 149. Canonical URL 统一生成

不要开发者自己写：

```ts
'https://oucloud.cn/tools/color/color-picker'
```

应该：

```ts
buildToolUrl(tool)
```

统一：

```ts
export function buildToolUrl(tool: ToolMeta) {
  return `/tools/${tool.category}/${tool.slug}`;
}
```

完整 URL：

```ts
export function buildAbsoluteUrl(path: string) {
  return new URL(
    path,
    'https://oucloud.cn'
  ).toString();
}
```

这样以后换域名：

```text
oucloud.cn
→
oucloud.com
```

只需要修改一处。

---

# 150. Sitemap 自动生成

建立：

```text
scripts/generate-sitemap.ts
```

逻辑：

```text
Static Pages
+
Categories
+
Published Tools
```

生成：

```text
public/sitemap.xml
```

例如：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <url>
    <loc>https://oucloud.cn/</loc>
  </url>

  <url>
    <loc>
      https://oucloud.cn/tools/color/color-picker
    </loc>
  </url>
</urlset>
```

---

# 151. Sitemap 不允许手工维护

禁止：

```text
每增加一个工具
 ↓
手动修改 sitemap.xml
```

应该：

```text
tools.ts
 ↓
pnpm sitemap
 ↓
sitemap.xml
```

最终：

```bash
pnpm build
```

自动执行 Sitemap 生成。

---

# 152. robots.txt

建立：

```text
public/robots.txt
```

```text
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /test/
Disallow: /preview/

Sitemap: https://oucloud.cn/sitemap.xml
```

---

# 153. 404 页面

建立：

```text
src/pages/NotFound.tsx
```

内容：

```text
404

Page not found.

[Search Tools]

Popular Tools
```

不要让 404 页面变成空白页。

---

# 154. Tool 搜索

第一阶段不需要 Algolia、Elasticsearch。

直接：

```ts
const result = tools.filter(tool => {
  const text = [
    tool.name,
    tool.slug,
    ...tool.keywords
  ]
    .join(' ')
    .toLowerCase();

  return text.includes(query.toLowerCase());
});
```

工具数量：

```text
< 1000
```

完全够用。

---

# 155. 搜索排序

可以：

```text
Name Match
>
Keyword Match
>
Category Match
>
Description Match
```

例如：

```ts
score(tool, query)
```

简单计算即可。

第一阶段不需要 AI 搜索。

---

# 156. Color Engine 实现

建立：

```text
src/lib/color/conversion.ts
```

实现：

```ts
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(
  hex: string
): RGB | null {
  // normalize
  // validate
  // parse
}

export function rgbToHex(
  rgb: RGB
): string {
  // clamp
  // convert
}
```

核心原则：

> UI 不负责算法。

---

# 157. Color Picker UI

组件：

```text
ColorPicker
 ├── NativeColorInput
 ├── HexInput
 ├── RgbInput
 ├── HslInput
 ├── ColorPreview
 └── CopyButton
```

状态：

```ts
const [color, setColor] = useState({
  hex: '#000000',
  rgb: {
    r: 0,
    g: 0,
    b: 0
  },
  hsl: {
    h: 0,
    s: 0,
    l: 0
  }
});
```

修改任意一个值：

```text
HEX
 ↓
Color Engine
 ↓
RGB
 ↓
HSL
```

而不是各自维护一套状态。

---

# 158. RMB 算法实现

建立：

```text
src/lib/number/rmbUppercase.ts
```

输入：

```ts
string
```

不要直接：

```ts
Number(input)
```

因为：

```text
0.1
0.01
大数字
```

存在精度问题。

建议：

```text
字符串解析
 ↓
整数部分
 ↓
小数部分
 ↓
金额单位
 ↓
中文数字
```

---

# 159. RMB 输入规则

允许：

```text
123
123.45
0.01
100000000
```

禁止：

```text
abc
1.2.3
--1
NaN
Infinity
```

输出：

```text
壹佰贰拾叁元肆角伍分
```

---

# 160. RMB 算法必须测试

测试文件：

```text
tests/unit/rmbUppercase.test.ts
```

例如：

```ts
expect(
  rmbUppercase('123.45')
).toBe('壹佰贰拾叁元肆角伍分');
```

还必须测试：

```text
0
0.01
0.10
1.01
10.05
100.01
1001
10001
100000001
```

以及：

```text
非法输入
```

---

# 161. Favicon Generator 实现

处理流程：

```text
File
 ↓
validateImageFile()
 ↓
createImageBitmap()
 ↓
Canvas
 ↓
Resize
 ↓
Export
 ↓
Blob
 ↓
Download
```

---

# 162. 文件验证

```ts
const allowedTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml'
];
```

同时检查：

```text
file.type
file.size
```

例如第一阶段限制：

```text
最大 10MB
```

避免用户上传超大图片造成浏览器卡死。

---

# 163. Image Processing API

建立：

```text
src/lib/image/image.ts
```

统一：

```ts
export async function loadImage(
  file: File
): Promise<ImageBitmap> {}

export async function resizeImage(
  image: ImageBitmap,
  width: number,
  height: number
): Promise<Blob> {}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string
): Promise<Blob> {}
```

---

# 164. Favicon 尺寸

默认生成：

```text
16x16
32x32
48x48
64x64
128x128
256x256
```

实际输出集合可以根据 favicon 标准及浏览器兼容需求调整。

---

# 165. ZIP 下载

如果一次产生多个文件：

```text
favicon.ico
favicon-16.png
favicon-32.png
favicon-48.png
apple-touch-icon.png
```

使用：

```text
JSZip
```

最终：

```text
favicon-pack.zip
```

浏览器直接下载。

---

# 166. CSS Gradient Engine

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

生成：

```ts
export function generateLinearGradient(
  gradient: LinearGradient
) {
  return `linear-gradient(${gradient.angle}deg, ${...})`;
}
```

---

# 167. Gradient UI

```text
GradientGenerator
 ├── GradientPreview
 ├── ColorStopList
 ├── AngleControl
 ├── AddStop
 ├── RemoveStop
 ├── CssOutput
 └── CopyButton
```

所有修改实时：

```text
State
 ↓
Gradient Engine
 ↓
CSS
 ↓
Preview
```

---

# 168. Tool Component 开发规范

任何工具必须分成：

```text
UI
Logic
Utility
SEO
```

例如：

```text
RmbUppercase.tsx
        ↓
rmbUppercase.ts
```

不要：

```text
1000 行 JSX
+
1000 行算法
```

全部写在一个文件。

---

# 169. 推荐工具目录

例如：

```text
src/tools/favicon/
├── FaviconGenerator.tsx
├── FaviconPreview.tsx
├── FaviconOptions.tsx
├── favicon.types.ts
└── favicon.constants.ts
```

算法：

```text
src/lib/image/
```

这样多个图片工具可以复用。

---

# 170. 通用 CopyButton

建立：

```text
src/components/common/CopyButton.tsx
```

统一处理：

```text
Copy
Copied
Error
```

例如：

```tsx
<button onClick={handleCopy}>
  {copied ? 'Copied' : 'Copy'}
</button>
```

不要每个工具自己实现。

---

# 171. 通用 DownloadButton

建立：

```text
src/components/common/DownloadButton.tsx
```

使用：

```ts
downloadBlob(blob, filename);
```

统一处理浏览器下载。

---

# 172. FileDropzone

建立：

```text
src/components/common/FileDropzone.tsx
```

支持：

```text
Click Upload
+
Drag & Drop
```

统一：

```text
dragenter
dragover
drop
```

这样以后：

```text
PNG → ICO
JPG → PNG
Image Compressor
Image Resizer
```

全部复用。

---

# 173. Tool 状态机

对于复杂工具，不要出现大量：

```ts
if (...)
if (...)
if (...)
```

建议定义：

```text
idle
processing
success
error
```

例如：

```ts
type ToolStatus =
  | 'idle'
  | 'processing'
  | 'success'
  | 'error';
```

UI：

```text
idle
 ↓
processing
 ↓
success
```

错误：

```text
processing
 ↓
error
```

---

# 174. Loading

处理大文件时必须：

```text
Processing...
```

而不是让用户以为：

> 网站卡死。

---

# 175. Browser Worker

如果未来图片处理变重：

```text
UI
 ↓
Web Worker
 ↓
Image Processing
 ↓
Result
```

第一阶段可以先不使用。

当出现：

```text
> 5MB
```

或：

```text
复杂图片处理
```

再引入 Worker。

---

# 176. SEO 页面内容不要硬编码

Tool Metadata：

```ts
seo: {
  intro,
  howTo,
  faq
}
```

页面自动：

```tsx
<ToolIntro />
<HowTo />
<FAQ />
```

这样：

```text
新增工具
```

只需要添加 Metadata。

---

# 177. SEO Validation Script

建立：

```text
scripts/validate-seo.ts
```

检查最终：

```text
dist/
```

每个 HTML：

```text
<title>
<meta name="description">
<link rel="canonical">
<h1>
```

例如：

```ts
if (!title) {
  throw new Error(
    `${file}: missing title`
  );
}
```

---

# 178. SEO 验收规则

每个正式工具页面必须：

```text
1 个 H1
1 个 Title
1 个 Description
1 个 Canonical
```

Title：

```text
长度合理
```

Description：

```text
有意义
```

不能：

```text
undefined
OUCloud
Tool
```

---

# 179. Tool Validation

建立：

```text
scripts/validate-tools.ts
```

检查：

```text
ID 唯一
Slug 唯一
Category 存在
Component 存在
Title 存在
Description 存在
H1 存在
FAQ 合法
Related Tools 存在
```

---

# 180. Duplicate Slug

例如：

```text
color-picker
color-picker
```

直接：

```text
Build Failed
```

而不是部署后才发现。

---

# 181. Related Tools 自动算法

第一阶段：

```text
same category
```

优先。

然后：

```text
relatedTools
```

人工覆盖。

最终：

```text
人工 > 同 Topic > 同 Category
```

---

# 182. Tool Metadata 增加 topic

建议直接增加：

```ts
topic: string;
```

例如：

```ts
topic: 'favicon'
```

这样：

```text
PNG to ICO
Favicon Generator
Favicon Size
Favicon HTML
```

可以形成 Topic Cluster。

---

# 183. Keyword 数据结构

建立：

```text
src/data/keywords.ts
```

但建议：

> 真正的 Keyword Research 数据不要全部塞进前端 Bundle。

可以放：

```text
seo/keywords.csv
```

或：

```text
docs/seo/keyword-opportunity.csv
```

前端只需要：

```text
primary keyword
secondary keywords
```

---

# 184. Keyword Opportunity 表

正式字段：

| 字段 | 说明 |
|---|---|
| keyword | 关键词 |
| topic | Topic |
| intent | 搜索意图 |
| volume | 搜索量 |
| serp_quality | SERP 质量 |
| competition | 竞争程度 |
| backlink_difficulty | 外链难度 |
| tool_fit | 工具匹配度 |
| development_cost | 开发成本 |
| commercial_value | 商业价值 |
| ai_risk | AI 搜索风险 |
| opportunity_score | 机会评分 |
| priority | 优先级 |
| status | 状态 |
| target_url | 页面 |
| notes | 备注 |

---

# 185. Opportunity Score

第一阶段可以采用简单评分：

```text
Opportunity Score
=
Search Demand
×
Tool Fit
×
SERP Weakness
×
Business Value
÷
Development Cost
```

不要一开始追求复杂数学模型。

真正重要的是：

> 统一评价标准。

---

# 186. SERP 人工判断

例如：

```text
Top 10

官方产品
大型网站
UGC
低质量页面
过时页面
纯文章
真正工具
```

可以给：

```text
5 = 极强
4 = 强
3 = 中
2 = 弱
1 = 极弱
```

然后判断：

> OUCloud 是否值得进入。

---

# 187. 第一批工具不要完全固定

原计划：

```text
Color Picker
RMB Uppercase
Favicon Generator
CSS Gradient
```

技术上可以直接开发。

但产品层面建议：

> **最终上线前，再用真实 SERP 重新验证一次。**

尤其：

```text
Color Picker
CSS Gradient
```

竞争可能明显高于：

```text
RMB Uppercase
Favicon 某些细分转换
```

因此：

```text
Keyword Opportunity
 ↓
重新排序
 ↓
确定最终 MVP
```

---

# 188. 页面模板

每个 Tool Page：

```text
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ Breadcrumb                  │
│                             │
│ H1                          │
│ Description                 │
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │       TOOL UI           │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ How to Use                  │
│                             │
│ Explanation                 │
│                             │
│ FAQ                         │
│                             │
│ Related Tools               │
├─────────────────────────────┤
│ Footer                      │
└─────────────────────────────┘
```

---

# 189. Tool UI 视觉原则

不要追求：

```text
复杂 SaaS Dashboard
```

应该：

```text
简单
清晰
快速
```

用户搜索：

```text
png to ico
```

进入页面后：

> 第一眼就应该知道在哪里上传 PNG。

---

# 190. 首屏原则

Tool Page 首屏必须包含：

```text
H1
核心说明
工具操作区域
```

不要把工具放到：

```text
10 屏之后
```

---

# 191. Mobile Tool UI

例如 Favicon：

桌面：

```text
Upload
       Preview
       Options
```

手机：

```text
Upload

Preview

Options

Generate

Download
```

使用：

```text
flex-col
md:flex-row
```

响应式设计。

---

# 192. Analytics 事件

统一：

```ts
trackEvent(
  'tool_start',
  {
    toolId: tool.id
  }
);
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

不要发送：

```text
file content
filename
actual amount
actual color
```

---

# 193. Analytics Adapter

不要让业务代码直接依赖某个 Analytics。

建立：

```text
src/lib/analytics/index.ts
```

```ts
export function trackEvent(
  name: string,
  properties?: Record<string, string>
) {
  // adapter
}
```

未来：

```text
Cloudflare Analytics
→
GA
→
PostHog
```

可以更换。

---

# 194. 第一阶段 Analytics 原则

如果没有明确数据需求：

> 可以暂时不开复杂 Product Analytics。

先依靠：

```text
Search Console
Bing Webmaster
Cloudflare Analytics
```

验证：

```text
有没有搜索流量
```

之后再增加：

```text
tool_start
tool_download
```

---

# 195. GitHub Actions

建立：

```text
.github/workflows/ci.yml
```

流程：

```yaml
name: CI

on:
  push:
    branches:
      - main
      - develop

  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint

      - run: pnpm typecheck

      - run: pnpm test

      - run: pnpm tools:validate

      - run: pnpm build
```

Node / pnpm 版本最终固定到项目实际验证通过的 LTS 版本。

---

# 196. Cloudflare 部署

第一阶段：

```text
GitHub
 ↓
Cloudflare
 ↓
Build
 ↓
dist
 ↓
CDN
```

配置：

```text
Framework:
Vite

Build command:
pnpm build

Output directory:
dist
```

---

# 197. Preview 环境

每一个 Pull Request：

```text
PR
 ↓
Cloudflare Preview
 ↓
检查
 ↓
Merge
```

重点检查：

```text
首页
工具页面
移动端
Canonical
Sitemap
404
```

---

# 198. Production 发布前自动检查

必须：

```bash
pnpm ci
```

如果：

```text
TypeScript Error
```

或者：

```text
SEO Error
```

则：

```text
Build Failed
```

不允许上线。

---

# 199. Lighthouse

第一阶段每个核心页面至少检查：

```text
Performance
Accessibility
Best Practices
SEO
```

重点：

```text
Home
Color Picker
Favicon Generator
RMB
Gradient
```

---

# 200. Performance Budget

先建立报警机制，而不是硬性阻断。

例如：

```text
Initial JS > 300KB
→ warning

Page > 1MB
→ warning
```

经过真实数据验证后再逐渐收紧。

---

# 201. E2E

Playwright：

```text
tests/e2e/
```

例如：

```ts
test(
  'RMB uppercase',
  async ({ page }) => {
    await page.goto(
      '/tools/number/rmb-uppercase'
    );

    await page
      .getByLabel('Amount')
      .fill('123.45');

    await expect(
      page.getByText(
        '壹佰贰拾叁元肆角伍分'
      )
    ).toBeVisible();
  }
);
```

---

# 202. Favicon E2E

测试：

```text
Upload
 ↓
Generate
 ↓
Download
```

但测试文件应该放在：

```text
tests/fixtures/
```

例如：

```text
sample.png
```

不能依赖网络图片。

---

# 203. Build 后检查 HTML

非常重要。

执行：

```bash
pnpm build
```

然后检查：

```text
dist/tools/favicon/png-to-ico/index.html
```

必须能直接看到：

```html
<h1>PNG to ICO</h1>
```

以及：

```html
<title>...</title>
<meta name="description" ...>
```

这一步实际上是在验证：

> SEO 页面到底有没有真正静态化。

---

# 204. React Hydration

静态 HTML：

```text
Search Engine
 ↓
HTML
```

浏览器：

```text
HTML
 ↓
React Hydration
 ↓
Interactive Tool
```

所以：

```text
SEO
+
Interactive Tool
```

可以同时存在。

---

# 205. 一个非常重要的原则

不要为了 SEO 做：

```text
完全静态 HTML
+
没有 React
```

因为：

> OUCloud 本质上是工具平台。

最合理的是：

```text
Static HTML
+
React Hydration
```

即：

> **静态 SEO + 动态交互。**

---

# 206. SSR / SSG / SPA 的最终选择

| 模式 | OUCloud |
|---|---|
| SPA | ❌ |
| SSR | 第一阶段不需要 |
| SSG | ✅ |
| Browser Processing | ✅ |
| Backend API | 后续 |
| Edge Functions | 后续 |

核心：

```text
SSG + CSR
```

---

# 207. 什么时候升级 SSR

如果未来出现：

```text
用户账户
动态 Dashboard
个性化内容
实时数据
动态 AI 工具
```

再考虑：

```text
SSR
```

目前：

> 没必要。

---

# 208. 第一阶段真正的技术 MVP

不要把 MVP 定义成：

```text
React 项目搭好
```

而应该：

```text
用户搜索
 ↓
进入静态 Tool Page
 ↓
Google/Bing/Baidu 能读取页面
 ↓
工具可以直接使用
 ↓
浏览器本地完成处理
 ↓
复制/下载
```

这才是完整 MVP。

---

# 209. 第一条完整链路

第一个建议实现：

```text
Color Picker
```

完整流程：

```text
Keyword
    ↓
/tools/color/color-picker
    ↓
Static HTML
    ↓
Google Crawl
    ↓
User Search
    ↓
Page
    ↓
Pick Color
    ↓
HEX / RGB / HSL
    ↓
Copy
```

先把这一条跑通。

---

# 210. 第二条链路

然后：

```text
RMB Uppercase
```

验证：

```text
纯算法工具
+
SEO
+
Copy
```

---

# 211. 第三条链路

然后：

```text
Favicon Generator
```

验证：

```text
文件上传
+
浏览器处理
+
文件下载
```

---

# 212. 第四条链路

最后：

```text
CSS Gradient Generator
```

验证：

```text
复杂交互
+
实时 Preview
+
代码生成
```

---

# 213. 四个工具实际上是在验证四种技术模型

| 工具 | 验证能力 |
|---|---|
| Color Picker | 基础交互 |
| RMB | 算法 |
| Favicon | 文件处理 |
| Gradient | 实时生成 |

所以这四个工具从技术验证角度是合理的。

---

# 214. 开发任务拆分

建议不要直接让 AI：

> “帮我开发 OUCloud。”

而拆成：

```text
Task 01
初始化项目

Task 02
Layout

Task 03
Tool Registry

Task 04
SSG

Task 05
SEO

Task 06
Sitemap

Task 07
Color Engine

Task 08
Color Picker

Task 09
RMB Engine

Task 10
RMB UI

Task 11
Image Engine

Task 12
Favicon

Task 13
Gradient Engine

Task 14
Gradient UI

Task 15
Testing

Task 16
CI/CD
```

---

# 215. AI Coding Agent 第一条指令

可以直接给 Claude Code / Codex：

```text
请根据 docs/technical-design.md
实现 OUCloud 第一阶段基础工程。

要求：

1. React + TypeScript + Vite
2. pnpm
3. Tailwind CSS
4. React Router
5. Static Site Generation
6. Tool Registry
7. Category Registry
8. SEO Metadata
9. Sitemap
10. robots.txt
11. 404
12. Vitest
13. Playwright
14. ESLint
15. TypeScript strict mode

暂时不要实现具体工具。

先完成：

- 项目初始化
- Layout
- Router
- Tool Registry
- Category Registry
- SEO 系统
- SSG
- Sitemap
- robots.txt
- 404
- SEO validation
- Tool validation
- 测试框架

要求：

pnpm build 必须成功。

同时要求 build 后可以在 dist 中找到静态 HTML 页面。

完成后输出：

1. 修改的文件
2. 新增的文件
3. 执行过的命令
4. 测试结果
5. build 结果
6. 当前剩余问题
```

---

# 216. 第二条 AI 指令：Color Picker

```text
现在实现 Color Picker。

要求：

1. 页面：
/tools/color/color-picker

2. Tool Metadata 注册到 Tool Registry。

3. 实现：
- HEX
- RGB
- HSL
- Native Color Picker
- Preview
- Copy

4. Color conversion 必须独立在：
src/lib/color/

5. UI 不允许直接实现转换算法。

6. 增加 Unit Tests。

7. 增加 E2E Test。

8. 增加 SEO Metadata。

9. Build 后必须生成：
dist/tools/color/color-picker/index.html

10. Sitemap 必须自动包含该页面。

11. Related Tools 暂时支持配置。

完成后执行：

pnpm lint
pnpm typecheck
pnpm test
pnpm tools:validate
pnpm build

如果任何一步失败，继续修复，不要只报告错误。
```

---

# 217. 第三条 AI 指令：RMB

```text
实现 RMB Uppercase Tool。

URL：

/tools/number/rmb-uppercase

要求：

1. 支持整数和两位小数。
2. 输入必须采用字符串解析。
3. 不允许直接使用浮点数完成金额转换。
4. 算法独立于 React UI。
5. 完整 Unit Test。
6. 处理非法输入。
7. 支持复制结果。
8. 增加 SEO。
9. 加入 Sitemap。
10. 加入 Related Tools。

重点测试：

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

以及非法输入。
```

---

# 218. 第四条 AI 指令：Favicon

```text
实现 Favicon Generator。

URL：

/tools/favicon/favicon-generator

要求：

1. 支持 PNG/JPG/WebP。
2. 最大文件 10MB。
3. 浏览器本地处理。
4. 不上传服务器。
5. Canvas / ImageBitmap。
6. 生成常见 favicon 尺寸。
7. 支持 ICO。
8. 支持 PNG。
9. 多文件使用 ZIP 下载。
10. 统一使用 FileDropzone。
11. 统一使用 DownloadButton。
12. 增加错误状态。
13. 增加 processing 状态。
14. Unit Test。
15. E2E Test。

不要建立后端 API。
```

---

# 219. 第五条 AI 指令：Gradient

```text
实现 CSS Gradient Generator。

URL：

/tools/css/gradient-generator

支持：

- Linear Gradient
- Color Stops
- Angle
- Position
- Preview
- CSS Output
- Copy

Gradient 算法独立：

src/lib/css/gradient.ts

React UI 不直接拼接复杂 CSS。

增加：

- Unit Test
- E2E Test
- SEO Metadata
- Sitemap
- Related Tools
```

---

# 220. AI Coding 的禁止事项

明确告诉 AI：

```text
禁止：
```

### 1

不要自行增加：

```text
Supabase
Firebase
MongoDB
PostgreSQL
```

---

### 2

不要自行增加：

```text
NextAuth
Clerk
Auth0
```

---

### 3

不要增加：

```text
CMS
Admin
Dashboard
```

---

### 4

不要为了 SEO 引入：

```text
WordPress
Headless CMS
大型 SEO Plugin
```

---

### 5

不要为了未来增加：

```text
Microservices
Docker
Kubernetes
Redis
Message Queue
```

---

# 221. AI Coding 的核心原则

每次开发前问：

```text
这个需求：
是否可以纯前端完成？
```

如果：

```text
Yes
```

就：

> 不增加后端。

如果：

```text
No
```

再讨论：

```text
Cloudflare Worker
```

---

# 222. Git Commit 规范

推荐：

```text
feat:
fix:
refactor:
test:
docs:
chore:
```

例如：

```text
feat: add color picker
feat: add favicon generator
fix: improve rgb conversion
test: add rmb uppercase cases
refactor: simplify tool registry
docs: update seo strategy
```

---

# 223. 每个工具一个独立 PR

例如：

```text
PR #1
Foundation

PR #2
Color Picker

PR #3
RMB Uppercase

PR #4
Favicon Generator

PR #5
Gradient Generator
```

这样出了问题非常容易定位。

---

# 224. Definition of Done

一个工具只有同时满足：

```text
功能完成
+
测试完成
+
SEO 完成
+
静态页面生成
+
Sitemap
+
Mobile
+
Accessibility
+
Performance
```

才算：

> Done。

而不是：

> “页面能用了”。

---

# 225. 上线前真实检查

部署之前：

```text
pnpm ci
```

然后：

```bash
pnpm build
```

检查：

```text
dist/
```

必须看到：

```text
index.html

tools/
  color/
    color-picker/
      index.html

  number/
    rmb-uppercase/
      index.html

  favicon/
    favicon-generator/
      index.html

  css/
    gradient-generator/
      index.html

sitemap.xml
robots.txt
```

---

# 226. 本地验证

启动：

```bash
pnpm preview
```

然后检查：

```text
/
 /tools/color/color-picker
 /tools/number/rmb-uppercase
 /tools/favicon/favicon-generator
 /tools/css/gradient-generator
 /404
```

---

# 227. SEO 源码验证

浏览器：

```text
View Source
```

必须能看到：

```html
<h1>Color Picker</h1>
```

以及：

```html
<title>...</title>
<meta name="description" ...>
<link rel="canonical" ...>
```

而不是：

```html
<div id="root"></div>
```

里面完全没有内容。

---

# 228. Search Engine 验证

上线以后：

```text
Google Search Console
Bing Webmaster
百度搜索资源平台
```

提交：

```text
sitemap.xml
```

然后观察：

```text
Discovered
Crawled
Indexed
Impressions
Clicks
```

---

# 229. 第一阶段不追求大量页面

第一阶段：

```text
4～10 个高质量工具页
```

比：

```text
100 个低质量工具页
```

更重要。

---

# 230. 工具扩张机制

当一个 Topic 验证成功：

```text
Favicon
```

继续：

```text
PNG to ICO
JPG to ICO
SVG to ICO
Favicon Size
Favicon HTML
Apple Touch Icon Generator
```

形成：

```text
Topic Hub
+
Tool Pages
```

而不是：

```text
随机增加工具
```

---

# 231. 自动化扩张后的最终模型

最终可以做到：

```text
SEO Spreadsheet
       ↓
Keyword Approved
       ↓
Tool Metadata
       ↓
Tool Component
       ↓
Automatic Route
       ↓
Automatic SEO
       ↓
Automatic Sitemap
       ↓
Automatic Related Tools
       ↓
CI
       ↓
Cloudflare
```

---

# 232. 以后新增工具的理想成本

成熟后：

```text
1. Keyword Research
       ↓
2. 写 Tool Metadata
       ↓
3. 写 Tool Component
       ↓
4. 写 Algorithm
       ↓
5. Tests
       ↓
6. Build
       ↓
7. Deploy
```

而不需要：

```text
修改首页
修改 Sitemap
修改导航
修改 SEO
修改 Related Tools
修改 Router
```

这些全部由系统完成。

---

# 233. 最终工程目标

OUCloud 最终不是：

> 一个 React 网站。

而应该是：

> **一个 Tool Engine。**

其核心抽象：

```text
Tool
Category
Topic
Keyword
SEO
Component
Algorithm
Analytics
```

其中：

```text
Tool Metadata
```

是整个系统的中心。

---

# 234. 最终系统关系

```text
                    Keyword
                       │
                       ↓
                     Topic
                       │
                       ↓
                      Tool
                       │
             ┌─────────┼─────────┐
             ↓         ↓         ↓
          Metadata  Component  Algorithm
             │         │         │
             └─────────┼─────────┘
                       ↓
                    Tool Page
                       │
             ┌─────────┼─────────┐
             ↓         ↓         ↓
            SEO      Internal   Analytics
             │         Links       │
             ↓                     ↓
          Sitemap                Data
             │                     │
             └──────────┬──────────┘
                        ↓
                     Search
                        ↓
                     Traffic
                        ↓
                     Usage
                        ↓
                   New Keyword
```

---

# 235. 现在真正应该开始做什么

不要继续完善架构文档。

直接进入：

```text
Step 1
创建 GitHub Repository

        ↓

Step 2
初始化 React + Vite + TypeScript

        ↓

Step 3
完成 SSG

        ↓

Step 4
完成 Tool Registry

        ↓

Step 5
完成 SEO System

        ↓

Step 6
完成 Sitemap

        ↓

Step 7
实现 Color Picker

        ↓

Step 8
Cloudflare Preview

        ↓

Step 9
真实浏览器测试

        ↓

Step 10
上线 oucloud.cn

        ↓

Step 11
提交 Google / Bing / Baidu

        ↓

Step 12
开始收集真实 SEO 数据
```

---

# 236. 第一阶段代码完成标准

最终 GitHub Repository 应至少具备：

```text
src/
scripts/
tests/
public/

package.json
pnpm-lock.yaml
tsconfig.json
vite.config.ts

README.md
docs/
```

其中：

```text
pnpm dev
```

可以开发。

```text
pnpm test
```

可以测试。

```text
pnpm build
```

可以生成静态网站。

```text
pnpm ci
```

可以完成上线前检查。

---

# 237. 第一阶段最关键的验收命令

最终只要能够稳定执行：

```bash
pnpm install
pnpm ci
pnpm build
pnpm preview
```

并且：

```text
首页正常
工具页面正常
SEO HTML 正常
Sitemap 正常
robots 正常
工具功能正常
Mobile 正常
```

就已经完成了真正意义上的：

> **OUCloud 技术 MVP。**

---

# 238. 技术路线最终确定

```text
                   GitHub
                      │
                      ↓
              GitHub Actions
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
     Lint          Typecheck       Tests
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                 SEO Validate
                      ↓
                    Build
                      ↓
                 Static HTML
                      ↓
              Cloudflare Pages
                      ↓
                    CDN
                      ↓
                  OUCloud
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
     Google          Bing           Baidu
       │              │              │
       └──────────────┼──────────────┘
                      ↓
                 Search Traffic
                      ↓
                 Tool Usage
                      ↓
                Keyword Data
                      ↓
                 New Tools
```

---

# 239. 最终开发原则

整个项目开发过程中始终遵循：

### 原则 1

> **先验证搜索需求，再开发工具。**

### 原则 2

> **能纯前端解决，就不增加后端。**

### 原则 3

> **能配置解决，就不要硬编码。**

### 原则 4

> **能自动生成，就不要人工维护。**

### 原则 5

> **一个工具必须同时具备产品价值和 SEO 价值。**

### 原则 6

> **新增工具不能显著增加平台维护成本。**

### 原则 7

> **先做 4 个真正可用的工具，再考虑 100 个工具。**

---

# 240. OUCloud 第一阶段的真正目标

最终不是完成：

```text
一个漂亮的网站
```

而是验证：

```text
Keyword
   ↓
Tool
   ↓
Static SEO Page
   ↓
Search Engine
   ↓
Organic Traffic
   ↓
Tool Usage
```

这条链路是否成立。

如果成立：

```text
4 tools
 ↓
10 tools
 ↓
30 tools
 ↓
100 tools
 ↓
300 tools
```

技术架构可以继续承载。

如果不成立：

```text
1000 个工具
```

也没有意义。

因此第一阶段真正需要优化的不是：

> **代码量。**

而是：

> **从关键词到用户使用的完整闭环。**