import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { ToolCard } from '../components/common/ToolCard';
import { useSeo } from '../components/seo/useSeo';
import { getToolComponent } from '../components/tools/registry';
import { ToolPlaceholder } from '../components/tools/ToolPlaceholder';
import { getCategoryBySlug, getRelatedTools, getToolBySlug } from '../lib/tools';
import { SITE } from '../data/site';

export function ToolPage() {
  const { category = '', slug = '' } = useParams();
  const tool = getToolBySlug(category, slug);
  const categoryMeta = getCategoryBySlug(category);

  useSeo({
    title: tool ? tool.seo.title : `工具不存在 | ${SITE.name}`,
    description: tool?.seo.description ?? '',
    path: `/tools/${category}/${slug}`,
    noindex: !tool
  });

  if (!tool || !categoryMeta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">工具不存在或已下线</h1>
        <p className="mt-3 text-sm text-slate-600">
          请确认链接是否正确，或从工具列表重新查找。
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm font-medium">
          <Link to="/" className="text-primary-600">
            返回首页
          </Link>
          <Link to={`/tools/${category}`} className="text-slate-600">
            查看同类工具
          </Link>
        </div>
      </div>
    );
  }

  const ToolComponent = getToolComponent(tool.component);
  const related = getRelatedTools(tool, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav
        aria-label="面包屑导航"
        className="flex flex-wrap items-center gap-1 text-xs text-slate-500"
      >
        <Link to="/" className="hover:text-primary-600">
          首页
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/tools/${categoryMeta.slug}`} className="hover:text-primary-600">
          {categoryMeta.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-700">{tool.shortName ?? tool.name}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {tool.seo.h1}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{tool.seo.intro}</p>
      </header>

      <section className="mt-8">
        {ToolComponent ? <ToolComponent /> : <ToolPlaceholder name={tool.shortName ?? tool.name} />}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">使用步骤</h2>
        <ol className="mt-4 space-y-3">
          {tool.seo.howTo.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-600">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-semibold text-primary-700">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {tool.seo.explanation && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">说明</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{tool.seo.explanation}</p>
        </section>
      )}

      {tool.seo.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
          <div className="mt-4 space-y-3">
            {tool.seo.faq.map((item) => (
              <Card key={item.question}>
                <h3 className="text-sm font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">相关工具</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ToolCard key={item.id} tool={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
