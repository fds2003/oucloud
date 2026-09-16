import { Link } from 'react-router-dom';
import { Lock, Zap, ShieldCheck } from 'lucide-react';
import { useSeo } from '../components/seo/useSeo';
import { ToolCard } from '../components/common/ToolCard';
import { Card } from '../components/common/Card';
import { categories } from '../data/categories';
import { tools } from '../data/tools';
import { SITE } from '../data/site';
import { buildCategoryPath } from '../lib/tools';

const GUARANTEES = [
  {
    icon: Lock,
    title: '纯前端本地运行',
    desc: '所有计算在你的浏览器内完成，数据与文件不上传服务器。'
  },
  {
    icon: Zap,
    title: '打开即用零等待',
    desc: '没有服务器往返开销，无需注册登录，打开页面就能开始。'
  },
  {
    icon: ShieldCheck,
    title: '干净无广告打扰',
    desc: '不放弹窗、不做诱导下载，只保留工具本身和必要说明。'
  }
];

export function HomePage() {
  useSeo({ title: SITE.title, description: SITE.description, path: '/' });

  const published = tools.filter((tool) => tool.status === 'published');
  const featured = published.filter((tool) => tool.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          免费在线工具箱，打开即用的纯前端工具
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          OUCloud 收录了颜色选取、人民币金额大写转换、Favicon
          图标生成、CSS 渐变设计等常用工具。每个工具都在浏览器本地完成运算，
          不需要注册、不上传文件，速度与隐私兼得。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">热门工具</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">按分类浏览</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={buildCategoryPath(category.slug)}
              className="group rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-700">
                {category.name}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">为什么选择 OUCloud</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {GUARANTEES.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <Icon className="h-5 w-5 text-primary-600" />
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
