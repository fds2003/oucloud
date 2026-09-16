# OUCloud.cn Cloudflare Pages 生产环境部署手册

> **更新时间**：2026-09-16  
> **目标域名**：`oucloud.cn`  
> **托管平台**：Cloudflare Pages (全球 Anycast 边缘网络)  

---

## 一、平台配置参数一览

在 Cloudflare 控制台新建或配置 Pages 项目时，请严格录入以下参数：

| 配置项 | 推荐配置值 | 说明 |
| :--- | :--- | :--- |
| **Project Name** | `oucloud` | 项目名称 |
| **Production Branch** | `main` | 主分支触发自动构建部署 |
| **Framework Preset** | `Vite` | 预设选择 Vite |
| **Build Command** | `pnpm build` | 执行完整 TypeScript + SSG 预渲染流水线 |
| **Build Output Directory** | `dist` | 产出 23+ 个静态 HTML、资源 Chunk 及 Sitemap |
| **Node.js Version** | `22.x` | 现代 LTS 运行时（与 GitHub Actions CI 保持一致） |

---

## 二、环境变量配置 (Environment Variables)

在 Cloudflare Pages 项目后台 **Settings > Environment variables** 中配置：

```text
NODE_VERSION = 22.12.0
PNPM_VERSION = 9.15.0
```

*可选配置（用于构建后自动推送百度）：*
```text
BAIDU_PUSH_TOKEN = <你的百度站长平台Token>
```

---

## 三、自定义域名接入与 DNS 解析 (`oucloud.cn`)

1. **登录 Cloudflare 控制台**：进入当前项目 > **Custom domains**。
2. **绑定主域名**：
   * 输入 `oucloud.cn` 并点击 Continue。
   * 输入 `www.oucloud.cn` 并开启自动重定向至主域名。
3. **DNS 记录自动配置**：
   * Cloudflare 会自动配置一条指向 `oucloud.pages.dev` 的 CNAME 记录。
4. **SSL/TLS 加密模式**：
   * 前往 SSL/TLS 选项卡，确保模式设置为 **Full** 或 **Full (strict)**。
   * 开启 **Always Use HTTPS**（全站强制 HTTPS 加密）。

---

## 四、边缘缓存与 HTTP 响应头验证

本项目已在 `public/_headers` 中固化了企业级边缘缓存规则，部署后生效：

* **静态 JS/CSS 资源 (`/assets/*`)**：
  * 响应头：`Cache-Control: public, max-age=31536000, immutable`
  * 效果：Vite 构建文件名携带哈希指纹，在 Cloudflare 全球 300+ 边缘节点永久强缓存，实现极速毫秒级回访。
* **HTML 页面 (`/*.html`) 与 `sw.js`**：
  * 响应头：`Cache-Control: public, max-age=0, must-revalidate`
  * 效果：新版本部署后访客立即拉取最新 HTML，绝无版本陈旧延迟。
* **现代安全响应头**：
  * 包含 `X-Frame-Options: DENY`、`X-Content-Type-Options: nosniff`，确保安全合规。
