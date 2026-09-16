import { Link } from 'react-router-dom';
import { useSeo } from '../components/seo/useSeo';
import { SITE } from '../data/site';
import { tools } from '../data/tools';
import { buildToolPath } from '../lib/tools';

export function NotFoundPage() {
  const published = tools.filter((tool) => tool.status === 'published').slice(0, 6);

  useSeo({
    title: `页面不存在 | ${SITE.name}`,
    description: '你访问的页面不存在，可以从下方工具列表重新进入。',
    path: '/404',
    noindex: true
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:py-28">
      <p className="text-sm font-semibold text-primary-600">404</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        页面不存在
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        链接可能已失效或输入有误。以下是站内常用工具，或许能帮到你。
      </p>

      <ul className="mt-8 space-y-2">
        {published.map((tool) => (
          <li key={tool.id}>
            <Link to={buildToolPath(tool)} className="text-sm font-medium text-primary-600">
              {tool.name}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        返回首页
      </Link>
    </div>
  );
}
