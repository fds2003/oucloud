# OUCloud.cn 在线工具平台

> 域名：https://oucloud.cn  
> 定位：SEO 驱动的纯前端在线工具平台，零后端成本，静态化托管。

## 项目原则
1. **Tool First**：打开页面第一眼即可使用工具，SEO 与说明内容位于工具下方。
2. **纯前端运行**：所有图片处理、算法计算完全在浏览器本地完成，保障用户数据隐私与高响应速度。
3. **配置化驱动**：所有工具由统一的 `Tool Registry` 驱动，自动生成路由、SEO、Sitemap 与关联推荐。
4. **真实静态化 (SSG)**：构建期产出独立静态 HTML，确保搜索引擎抓取完整语义内容。

## 常用命令

```bash
# 启动本地开发
pnpm dev

# 代码与类型检查
pnpm check

# 执行单元测试
pnpm test

# 生产构建（含 SSG 静态预渲染与 Sitemap 生成）
pnpm build

# 本地预览
pnpm preview
```
