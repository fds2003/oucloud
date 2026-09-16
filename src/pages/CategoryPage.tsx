import { Link, useParams } from 'react-router-dom';
import { useSeo } from '../components/seo/useSeo';
import { ToolCard } from '../components/common/ToolCard';
import { getCategoryBySlug } from '../lib/tools';
import { tools } from '../data/tools';
import { SITE } from '../data/site';

export function CategoryPage() {
  const { category = '' } = useParams();
  const meta = getCategoryBySlug(category);

  useSeo({
    title: meta ? `${meta.name} - 在线工具合集 | ${SITE.name}` : `页面不存在 | ${SITE.name}`,
    description: meta?.description ?? '',
    path: `/tools/${category}`,
    noindex: !meta
  });

  if (!meta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">工具分类不存在</h1>
        <p className="mt-3 text-sm text-slate-600">该分类可能已调整，请从首页重新进入。</p>
        <Link to="/" className="mt-6 inline-block text-sm font-medium text-primary-600">
          返回首页
        </Link>
      </div>
    );
  }

  const list = tools.filter(
    (tool) => tool.status === 'published' && tool.category === meta.slug
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <nav className="text-xs text-slate-500">
        <Link to="/" className="hover:text-primary-600">
          首页
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-700">{meta.name}</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {meta.name}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{meta.description}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">该分类下的工具正在整理中，敬请期待。</p>
      )}
    </div>
  );
}
