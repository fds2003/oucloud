import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getCategoryBySlug, buildToolPath } from '../../lib/tools';
import { tools } from '../../data/tools';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { SeoHead } from '../../components/seo/SeoHead';
import { ArrowRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  if (!categorySlug) {
    return <Navigate to="/404" replace />;
  }

  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return <Navigate to="/404" replace />;
  }

  const categoryTools = tools.filter((t) => t.category === categorySlug && t.status === 'published');

  const breadcrumbItems = [
    {
      label: category.name,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <SeoHead
        title={`${category.name}大全 - 免费在线${category.name} | OUCloud`}
        description={category.description}
        canonicalPath={`/tools/${category.slug}`}
      />

      <Breadcrumb items={breadcrumbItems} />

      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {category.name}
        </h1>
        <p className="mt-2 text-base text-slate-600 leading-relaxed max-w-2xl">
          {category.description}
        </p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {categoryTools.map((tool) => (
            <Link
              key={tool.id}
              to={buildToolPath(tool)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-primary-400 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
                    {tool.intent}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-primary-600 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {tool.seo.intro}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
