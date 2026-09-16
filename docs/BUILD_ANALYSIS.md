# OUCloud.cn 构建产物分析配置

## Bundle 分析

当需要分析构建产物大小时，使用以下命令：

```bash
# 生成构建分析报告
pnpm build:analyze

# 报告将生成在 dist/stats.html
```

## 性能预算

根据项目设计文档，建议的构建产物体积预算：

| 资源类型 | 预算上限 (gzip) |
|---------|----------------|
| 首页 JS | < 150 KB |
| 核心 CSS | < 50 KB |
| 首屏图片 | < 200 KB |
| 第三方脚本 | 尽量少 |

当某个工具引入大型依赖导致 bundle 超过限制时，CI 应当报警。

## 构建优化建议

1. **Code Splitting**: 每个工具应通过 React.lazy 动态导入，避免首页加载所有工具
2. **Tree Shaking**: 确保未使用的工具代码不会被打包
3. **压缩**: 使用生产环境的 Gzip/Brotli 压缩
4. **预加载**: 为高频工具添加 `<link rel="prefetch">`

## 监控工具

- [Rollup Plugin Visualizer](https://github.com/btd/rollup-plugin-visualizer): 生成可视化构建分析报告
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci): 自动化性能审计
