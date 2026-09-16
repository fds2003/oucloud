import { CategoryMeta } from '../types/category';

export const categories: CategoryMeta[] = [
  {
    id: 'color',
    slug: 'color',
    name: '颜色工具',
    description: '在线颜色拾取、色值格式互转及调色板设计工具。',
    icon: 'Palette'
  },
  {
    id: 'number',
    slug: 'number',
    name: '数字与财务',
    description: '人民币金额大写转换、数值计算等高效实用工具。',
    icon: 'Coins'
  },
  {
    id: 'favicon',
    slug: 'favicon',
    name: 'Favicon 工具',
    description: '浏览器网站图标生成器、ICO 转换及前端 HTML 代码生成。',
    icon: 'Image'
  },
  {
    id: 'css',
    slug: 'css',
    name: 'CSS 工具',
    description: '现代 CSS 渐变、布局代码可视化生成与一键复制。',
    icon: 'Code2'
  }
];
