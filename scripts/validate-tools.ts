import { tools } from '../src/data/tools';
import { categories } from '../src/data/categories';
import { toolComponents } from '../src/tools/registry';

console.log('🔍 开始校验 Tool Registry 元数据...');

const categorySlugs = new Set(categories.map((c) => c.slug));
const toolIds = new Set<string>();
const toolSlugs = new Set<string>();
let hasErrors = false;

for (const tool of tools) {
  // 1. ID 唯一性
  if (toolIds.has(tool.id)) {
    console.error(`❌ 工具 ID 重复: ${tool.id}`);
    hasErrors = true;
  }
  toolIds.add(tool.id);

  // 2. Slug 唯一性 (同分类内或全局)
  const fullSlug = `${tool.category}/${tool.slug}`;
  if (toolSlugs.has(fullSlug)) {
    console.error(`❌ 工具 Slug 重复: ${fullSlug}`);
    hasErrors = true;
  }
  toolSlugs.add(fullSlug);

  // 3. Category 存在
  if (!categorySlugs.has(tool.category)) {
    console.error(`❌ 工具 [${tool.id}] 引用了不存在的分类: ${tool.category}`);
    hasErrors = true;
  }

  // 4. Topic 存在
  if (!tool.topic) {
    console.error(`❌ 工具 [${tool.id}] 缺少 topic 定义`);
    hasErrors = true;
  }

  // 5. Component 在注册表存在
  if (!toolComponents[tool.component]) {
    console.error(`❌ 工具 [${tool.id}] 声明的组件 [${tool.component}] 未在 toolComponents 注册`);
    hasErrors = true;
  }

  // 6. SEO 必填字段
  if (!tool.seo) {
    console.error(`❌ 工具 [${tool.id}] 缺少 SEO 配置`);
    hasErrors = true;
  } else {
    if (!tool.seo.title || tool.seo.title.length < 5) {
      console.error(`❌ 工具 [${tool.id}] SEO title 缺失或过短`);
      hasErrors = true;
    }
    if (!tool.seo.description || tool.seo.description.length < 10) {
      console.error(`❌ 工具 [${tool.id}] SEO description 缺失或过短`);
      hasErrors = true;
    }
    if (!tool.seo.h1) {
      console.error(`❌ 工具 [${tool.id}] 缺少 SEO h1 标题`);
      hasErrors = true;
    }
    if (!tool.seo.intro) {
      console.error(`❌ 工具 [${tool.id}] 缺少 SEO intro 介绍`);
      hasErrors = true;
    }
    if (!tool.seo.howTo || tool.seo.howTo.length === 0) {
      console.error(`❌ 工具 [${tool.id}] 缺少 howTo 使用说明`);
      hasErrors = true;
    }
    // FAQ 格式校验
    if (tool.seo.faq) {
      for (const faq of tool.seo.faq) {
        if (!faq.question || !faq.answer) {
          console.error(`❌ 工具 [${tool.id}] FAQ 存在空字段:`, faq);
          hasErrors = true;
        }
      }
    }
  }

  // 7. 关联工具存在性校验
  if (tool.relatedTools) {
    for (const relId of tool.relatedTools) {
      const exists = tools.some((t) => t.id === relId);
      if (!exists) {
        console.error(`❌ 工具 [${tool.id}] 关联的工具 ID 不存在: ${relId}`);
        hasErrors = true;
      }
    }
  }
}

if (hasErrors) {
  console.error('\n🚨 工具元数据校验失败，请修复以上错误后再提交或构建！');
  process.exit(1);
} else {
  console.log(`\n✅ 工具元数据校验全部通过！共检查 ${tools.length} 个工具，${categories.length} 个分类。`);
}
