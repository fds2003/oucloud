# OUCloud.cn 详细任务执行清单与进度追踪

> **项目名称**：OUCloud 纯前端在线工具平台  
> **域名**：oucloud.cn  
> **更新机制**：每完成一项任务，必须在此文档中将 `[ ]` 标记为 `[x]`，并记录验收证据与验证结果。  
> **最后更新时间**：2026-09-16  

---

## 总体推进大盘 (Dashboard)

| 阶段 | 阶段目标 | 任务数 (已完成/总数) | 状态 |
| :--- | :--- | :---: | :---: |
| **Phase 1** | **基础设施、工程底座与种子工具** | 10 / 10 |  已完成 (100%) |
| **Phase 2** | **4 大主题集群横向裂变 (Topic Cluster)** | 9 / 9 |  已完成 (100%) |
| **Phase 3** | **自动化发布、SEO 引擎推送与生产部署** | 4 / 4 |  已完成 (100%) |
| **Phase 4** | **平台体验进阶 (Dark Mode / PWA 离线 / 社交传播)** | 3 / 3 |  已完成 (100%) |

---

## Phase 1：基础设施与第一批核心工具（已全部验收交付）

- [x] **任务 1.1：React 18 + Vite 5 + Tailwind CSS 3 基础框架搭建**
  - *验收记录*：配置路由、类型安全、零后端纯前端本地运算体系。
- [x] **任务 1.2：组件按需懒加载重构 (`src/tools/registry.ts`)**
  - *验收记录*：`asyncComponent` 按需导入，`jszip` 等重依赖剥离出首屏 bundle。
- [x] **任务 1.3：SSG 静态页面预渲染流水线 (`scripts/prerender.tsx`)**
  - *验收记录*：真实组件树 `renderToString`，输出独立纯静态 HTML 文件。
- [x] **任务 1.4：自动化 SEO 与工具元数据校验门禁 (`scripts/validate-*.ts`)**
  - *验收记录*：双重校验 TDK、Canonical、JSON-LD（WebApplication、Breadcrumb、FAQPage）。
- [x] **任务 1.5：在线颜色拾取器 (`/tools/color/color-picker`)**
  - *验收记录*：HEX/RGB/HSL 实时互转，接入原生 `EyeDropper` 屏幕吸色、WCAG 2.1 文本对比度检查、智能配色推荐。
- [x] **任务 1.6：人民币金额大写转换器 (`/tools/number/rmb-uppercase`)**
  - *验收记录*：自动清洗千分位 `,` 与货币符号 `¥`/`￥`，支持大写转数字双向逆向解析，17 项单元测试覆盖。
- [x] **任务 1.7：Favicon 网站图标生成器 (`/tools/favicon/favicon-generator`)**
  - *验收记录*：多尺寸批量裁剪与打包 ZIP，真实二进制 `ICONDIR` 打包。
- [x] **任务 1.8：CSS 渐变生成器 (`/tools/css/gradient-generator`)**
  - *验收记录*：多色标角度控制、渐变边框、原生 CSS 与 Tailwind CSS 实用类双导出。
- [x] **任务 1.9：PNG 转 ICO 在线转换器 (`/tools/favicon/png-to-ico`)**
  - *验收记录*：单文件直出免解压，自由勾选多帧分辨率（16/32/48/64/128/256），拟真标签页预览。
- [x] **任务 1.10：全局命令面板 (`Cmd+K` / `Ctrl+K`) 与 PWA 基础配置**
  - *验收记录*：Header 快捷搜索面板唤出，键盘上下导航直达；配置 `manifest.webmanifest` 与 theme-color。

---

## Phase 2：主题集群深度裂变（当前执行重点）

对照《SEO 产品增长战略》与《技术方案详细设计》，围绕 4 大主题集群扩建单意图高频工具：

### 1. Favicon 图标主题集群
- [x] **任务 2.1：SVG 转 Favicon 在线工具 (`/tools/favicon/svg-to-favicon`)**
  - *目标*：承接现代前端工程高频的 SVG 矢量图标转 ICO / PNG 需求。
  - *技术要点*：纯前端 Canvas 将 SVG 文本转为多分辨率位图，支持直接导出 `favicon.ico`。
  - *交付标准*：支持拖拽上传 `.svg`，实时矢量预览，支持导出 ICO 与 PNG，通过单元测试与 SEO 门禁。
  - *验收记录*：TDD 先行编写 `tests/unit/svgFavicon.test.ts`（4 项单测全绿），实现 SVG 结构安全消毒（过滤 script 与内联 on 事件）、viewBox 修复与规范化、双模式（上传 .svg 文件 / 粘贴 SVG 源码）、离线 Canvas 渲染光栅化与多帧二进制 ICO/PNG/SVG 三格式一键直出。
- [x] **任务 2.2：纯文本 / Emoji 生成 Favicon (`/tools/favicon/text-to-favicon`)**
  - *目标*：解决独立开发者无 Logo 时的痛点。
  - *技术要点*：输入单个字符或 Emoji，选择背景色、圆角（方/微圆/全圆）与字体，Canvas 导出。
  - *交付标准*：提供精选 Emoji 选择器与常用底色推荐，一键导出 ICO。
  - *验收记录*：TDD 先行编写 `tests/unit/textFavicon.test.ts`（6 项单测全绿），实现纯矢量 SVG 生成、Canvas 多尺寸光栅化、精选 Emoji 选择器、三种容器形状、拟真标签栏预览与标准二进制 ICO/PNG/SVG 三格式一键导出。

### 2. Color 色彩主题集群
- [x] **任务 2.3：图片在线取色器 (`/tools/color/image-color-picker`)**
  - *目标*：上传图片后，自动提取主色调并支持鼠标悬停十字吸色。
  - *技术要点*：纯前端 Canvas 像素分析，ColorThief 算法或 K-Means 聚类生成 6 色调色板。
  - *交付标准*：支持拖拽大图、放大镜吸色、主色卡一键复制。
  - *验收记录*：TDD 先行编写 `tests/unit/imageColor.test.ts`（7 项单测全绿），实现 Canvas 像素精准采样、色彩网格聚类、悬停放大镜吸色、核心 6 色调色板提取与全套色值一键复制，附带 2 组内置示例图。
- [x] **任务 2.4：独立色彩对比度检测器 (`/tools/color/contrast-checker`)**
  - *目标*：满足独立搜索词 `contrast checker` / `色彩对比度检测`。
  - *技术要点*：前景色与背景色独立拾取，大字号、正文字号真实排版样例展示，WCAG 2.1 AA/AAA 评级。
  - *验收记录*：TDD 先行编写 `tests/unit/contrastChecker.test.ts`（5 项单测全绿），实现双色对比度比率精准计算、WCAG 2.1 规范（普通文本/大字号/UI控件）AA/AAA 分级评定、一键反转颜色、智能微调前景色达标算法、真实多组件排版效果预览与色彩工具协同跳转。

- [x] **任务 2.9：HEX 转 RGB 独立在线转换器 (`/tools/color/hex-to-rgb`)**
  - *目标*：承接 KW-003 单意图核心高频词（8,100+ 月搜）。
  - *验收记录*：TDD 先行编写 `parseHexParam` 单测，实现 HEX 与 RGB 实时双向互转、R/G/B 通道数值拆解、URL `?hex=` 参数自动解析与跨工具协同跳转。
### 3. CSS 视觉主题集群
- [x] **任务 2.5：CSS 平滑软阴影生成器 (`/tools/css/box-shadow-generator`)**
  - *目标*：现代 UI 设计高频需求（类似 shadows.brumm.af）。
  - *技术要点*：多图层阴影（Smooth Multi-layer Shadow）计算，支持 Tailwind 类名导出与原生 CSS 导出。
  - *交付标准*：带拟真卡片预览、光源角度控制、扩散半径微调。
  - *验收记录*：TDD 先行编写 `tests/unit/shadow.test.ts`（7 项单测全绿），实现指数衰减平滑多层算法、原生 CSS 与 Tailwind 实用类双导出、4 套高颜值预设、三色背景切换。
- [x] **任务 2.6：CSS 不规则平滑圆角生成器 (`/tools/css/border-radius-generator`)**
  - *目标*：生成 Fancy 8 值圆角（`border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%`）。
  - *验收记录*：TDD 先行编写 `tests/unit/borderRadius.test.ts`（4 项单测全绿），实现 8 方向半轴独立参数调配、Tailwind 任意值类名输出、4 套有机几何预设与 4 色渐变底色切换。

### 4. 财务与通用数字集群
- [x] **任务 2.7：大写金额书写规范与发票对照速查指南页 (`/tools/number/daxie-guifan`)**
  - *目标*：吃下“发票大写怎么写”、“大写金额规范”等超大搜索意图。
  - *技术要点*：完整官方规范条文、易错字（如“零/整/正/角/分”）自检测试题。
  - *验收记录*：TDD 先行编写 `tests/unit/daxieGuifan.test.ts`（5 项单测全绿），实现央行银发〔1997〕393号官方票据凭证规范条文解析、常见错别字（如“两/贰”、“〇/零”）自动识别、整/正使用合规性实时校验、标准字形大览表与交互式自检测试台。
- [x] **任务 2.8：Unix 时间戳在线转换器 (`/tools/number/timestamp-converter`)**
  - *目标*：开发者高频秒级/毫秒级时间戳与北京时间、UTC 时间双向即时互转。
  - *验收记录*：TDD 先行编写 `tests/unit/timestamp.test.ts`（13 项单测全绿），实现秒级与毫秒级自适应解析、北京时间与 UTC 双时区输出、实时心跳时钟、相对时间计算与 6 种主流语言获取时间戳代码卡片。

---

## Phase 3：自动化发布与搜索引擎推送

- [x] **任务 3.1：自动化站长主动推送脚本 (`scripts/push-baidu.ts`)**
  - *目标*：新站快速收录，打破 1~3 个月爬虫冷启动沙盒期。
  - *技术要点*：读取 `dist/sitemap.xml` 中全部规范 URL，调用百度站长与神马平台 API 进行实时推送。
  - *验收记录*：TDD 先行编写 `tests/unit/pushBaidu.test.ts`（4 项单测全绿），实现从 `dist/sitemap.xml` 自动提取 22 个规范 URL、换行 Payload 组装、API 接口封装、带 Dry-Run 校验与 `pnpm seo:push` CLI 命令集成。
- [x] **任务 3.2：Cloudflare Pages 生产部署与域名接入**
  - *目标*：正式绑定 `oucloud.cn`，配置构建管道与全站 HTTPS + CDN 缓存。
  - *验收记录*：编写 `public/_headers` 固化边缘安全头与 1 年静态资产强缓存策略，输出 `docs/DEPLOYMENT_CLOUDFLARE.md` 完整生产部署手册与 `oucloud.cn` DNS 配置规范。
- [x] **任务 3.3：动态 Social Share Card (OG Image) 生成**
  - *目标*：为每个工具页自动产出 1200x630 的精美社交卡片，增强外链传播点击率。
  - *验收记录*：TDD 先行编写 `tests/unit/shareCard.test.ts`（3 项单测全绿），实现 1200x630 标准尺寸纯前端 Canvas 绘图、深色极客背景、代码预览块与品牌水印。
- [x] **任务 3.4：Lighthouse CI 自动化门禁集成**
  - *目标*：在 `.github/workflows/ci.yml` 增加 Lighthouse 审计，确保核心指标全绿。
  - *验收记录*：TDD 先行编写 `tests/unit/lighthouseConfig.test.ts`（3 项单测全绿），编写 `lighthouserc.json` 配置核心路径与最低指标断言（SEO ≥ 0.95，A11y ≥ 0.95，Best Practices ≥ 0.90），并在 `.github/workflows/ci.yml` 中成功集成审计步骤。

---

## Phase 4：平台极客体验深化

- [x] **任务 4.1：全站暗黑模式（Dark Mode）**
  - *目标*：适配开发者与设计师夜间办公，Header 增加浅色/深色/跟随系统切换，支持持久化记忆。
  - *验收记录*：TDD 先行编写 `tests/unit/theme.test.ts`（8 项单测全绿），实现三态切换（浅色/深色/跟随系统）、LocalStorage 本地持久化、系统配色偏好监听、`index.html` 首屏反闪烁（anti-FOUC）注入，以及 Header 交互按钮。
- [x] **任务 4.2：Service Worker 离线缓存支持 (PWA 完整态)**
  - *目标*：缓存核心静态资源，真正实现“断网离线即可使用全部工具”。
  - *验收记录*：编写 `public/sw.js` 实现 Cache-First 静态缓存与页面离线回退，并在 `main.tsx` 安全注册，真正兑现离线秒开桌面级心智。
- [x] **任务 4.3：精选色卡与渐变“生成分享海报”功能**
  - *目标*：利用 Canvas 一键生成带参数的水印小海报，自发形成社交媒体传播回流。
  - *验收记录*：在 `GradientGenerator` 与 `ColorPicker` 集成一键导出设计参数分享卡功能，纯前端 Canvas 瞬间生成 PNG 下载，助力社交媒体自发传播。

---

## 任务执行记录流水账 (Changelog)
| 变更日期 | 任务编号 | 操作内容 | 验证依据 |
| :--- | :---: | :--- | :--- |
| 2026-09-16 | 任务 3.4 | 交付 Lighthouse CI 质量门禁与 GitHub Actions 审计步骤 (TDD 模式驱动) | 166 项单测全绿，配置文件结构与断言规则通过校验 |
| 2026-09-16 | 任务 3.2 | 交付 Cloudflare Pages 边缘缓存策略与生产部署配置 | _headers 安全头固化完成，部署指南就绪 |
| 2026-09-16 | 任务 3.1 | 交付百度与搜索引擎主动推送引擎 (TDD 模式驱动) | 163 项单测全绿，22 个规范 URL 自动提取验证通过 |
| 2026-09-16 | 任务 3.3 & 4.3 | 交付 Canvas 社交参数分享卡生成引擎 (TDD 模式驱动) | 159 项单测全绿，23 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 4.1 | 交付全站 Dark Mode 主题引擎 (TDD 模式驱动) | 156 项单测全绿，23 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.7 | 交付人民币大写规范速查指南与互动自检台 (TDD 模式驱动) | 148 项单测全绿，23 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.6 | 交付 CSS 8 值不规则圆角生成器 (TDD 模式驱动) | 143 项单测全绿，22 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.4 | 交付独立色彩对比度检测器 (TDD 模式驱动) | 139 项单测全绿，21 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.1 | 交付 SVG 转 Favicon 在线转换器 (TDD 模式驱动) | 134 项单测全绿，20 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.2 | 交付纯文本 / Emoji 生成 Favicon (TDD 模式驱动) | 130 项单测全绿，19 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.8 | 交付 Unix 时间戳在线转换器 (TDD 模式驱动) | 124 项单测全绿，18 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.9 & 4.2 | 交付 HEX 转 RGB 转换器、跨工具参数协同路由与 PWA Service Worker 离线缓存 | 111 项单测全绿，17 个静态 HTML 预渲染全通过，浏览器实测完成 |
| 2026-09-16 | 任务 2.3 | 交付图片在线取色器 (TDD 模式驱动) | 108 项单元测试全绿，16 个静态 HTML 预渲染全通过 |
| 2026-09-16 | 任务 2.5 | 交付 CSS 阴影生成器 (TDD 模式驱动) | 101 项单元测试全绿，15 个静态 HTML 预渲染全通过 |
| 2026-09-16 | Phase 1 全量 | 交付基础 4 大工具 + PNG 转 ICO + 快捷搜索 + PWA Manifest | 94 项单元测试通过，14 个静态 HTML 校验全绿 |
