# 财献指南

感谢您对 OUCloud.cn 的关注！本文档将帮助您了解如何为项目做出贡献。

## 开发环境设置

### 前置要求
- Node.js >= 18
- pnpm >= 11.7

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/your-username/oucloud.cn.git
cd oucloud.cn

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 开发工作流

### 代码质量检查
```bash
# 运行所有检查（lint + 类型检查 + 测试 + 工具验证）
pnpm check

# 单独运行 lint
pnpm lint

# 自动修复 lint 问题
pnpm lint:fix

# 格式化代码
pnpm format
```

### 测试
```bash
# 运行单元测试
pnpm test

# 运行测试并监视文件变化
pnpm test:watch

# 运行 E2E 测试（需要先构建）
pnpm build
pnpm e2e
```

### 构建
```bash
# 生产构建（包含 SSG 预渲染和 Sitemap 生成）
pnpm build

# 预览构建结果
pnpm preview
```

## 添加新工具

添加新工具是 OUCloud 的核心开发任务。请按照以下步骤：

### 1. 定义工具元数据
在 `src/data/tools.ts` 中添加工具的元数据：

```typescript
{
  id: 'your-tool-id',
  slug: 'your-tool-slug',
  name: '工具名称',
  shortName: '简称',
  category: 'category-id', // 必须匹配 categories.ts 中的 id
  topic: 'topic-name',
  intent: 'generator', // converter | generator | calculator | checker | formatter | picker
  status: 'published',
  component: 'YourComponent', // 必须匹配 registry.ts 中的键名
  keywords: ['关键词1', '关键词2'],
  seo: {
    title: 'SEO 标题 | OUCloud',
    description: 'SEO 描述',
    h1: '页面 H1',
    intro: '工具简介',
    howTo: ['步骤1', '步骤2', '步骤3'],
    explanation: '原理解析',
    faq: [
      { question: '问题', answer: '答案' },
    ],
  },
  featured: true,
  relatedTools: ['other-tool-slug'],
}
```

### 2. 创建工具组件
在 `src/tools/your-category/` 目录下创建 React 组件：

```typescript
// src/tools/your-category/YourTool.tsx
import React from 'react';

export const YourTool: React.FC = () => {
  return (
    <div>
      {/* 工具 UI */}
    </div>
  );
};
```

### 3. 注册组件
在 `src/tools/registry.ts` 中注册组件：

```typescript
const importers = {
  // ... 现有组件
  YourComponent: () => import('./your-category/YourComponent').then((m) => ({ default: m.YourComponent })),
};
```

### 4. 创建逻辑引擎（可选但推荐）
如果工具有复杂逻辑，在 `src/lib/your-domain/` 中创建纯函数引擎：

```typescript
// src/lib/your-domain/engine.ts
export function yourLogic(input: string): string {
  // 纯函数实现
}
```

### 5. 添加单元测试
在 `tests/unit/` 中为逻辑引擎创建测试：

```typescript
// tests/unit/your-engine.test.ts
import { describe, it, expect } from 'vitest';
import { yourLogic } from '../../src/lib/your-domain/engine';

describe('Your Engine', () => {
  it('handles basic input', () => {
    expect(yourLogic('input')).toBe('expected');
  });
});
```

### 6. 验证
运行以下命令确保工具符合规范：

```bash
# 验证工具注册表完整性
pnpm tools:validate

# 验证 SEO 元数据
pnpm seo:validate

# 运行所有检查
pnpm check
```

## Git 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 类型 (type)
- `feat`: 新功能
- `fix`: 修复 bug
- `refactor`: 重构代码（不改变功能）
- `test`: 添加或修改测试
- `docs`: 文档更新
- `chore`: 构建过程或辅助工具的变动

### 示例
```
feat(color): 添加颜色对比度检查功能
fix(favicon): 修复大图片内存溢出问题
refactor(rmb): 优化人民币转换算法
test(tools): 添加工具注册表验证测试
docs: 更新 README 安装说明
chore: 升级依赖版本
```

## 分支策略

- `main`: 生产分支，保持稳定
- `develop`: 开发分支，最新功能
- `feature/*`: 功能分支，从 develop 创建
- `fix/*`: 修复分支，从 develop 或 main 创建

## Pull Request 流程

1. 从 `develop` 创建功能分支
2. 实现功能并添加测试
3. 运行 `pnpm check` 确保通过
4. 提交 PR 到 `develop` 分支
5. 等待 CI 检查通过
6. 请求代码审查
7. 合并后删除功能分支

## 代码风格

### TypeScript
- 启用严格模式 (`strict: true`)
- 避免使用 `any` 类型
- 使用接口而非类型别名（除非需要联合类型）
- 优先使用 `import type` 导入类型

### React
- 使用函数组件和 Hooks
- 避免使用类组件
- 使用 `React.FC` 或显式返回类型
- 组件文件使用 PascalCase 命名

### 样式
- 使用 Tailwind CSS
- 遵循项目现有的设计系统
- 响应式设计优先

## SEO 规范

OUCloud 是 SEO 驱动的平台，请确保：

1. **每个工具页面必须有完整的 SEO 元数据**
2. **使用语义化 HTML 标签**
3. **包含结构化数据 (JSON-LD)**
4. **确保移动端友好**
5. **页面加载速度优化**

## 性能要求

- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **INP (Interaction to Next Paint)**: < 200ms

## 安全注意事项

- **所有处理必须在客户端完成**（隐私优先）
- **避免使用 `eval()` 或 `new Function()`**
- **转义用户输入和动态内容**
- **不提交敏感信息到仓库**

## 问题反馈

- 使用 [GitHub Issues](https://github.com/your-username/oucloud.cn/issues) 报告问题
- 提供清晰的问题描述和重现步骤
- 包含环境信息（浏览器、操作系统等）

## 许可证

贡献的代码将遵循项目许可证。请确保您有权贡献这些代码。

---

感谢您的贡献！🎉
