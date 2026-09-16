import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ToolMeta } from '../../types/tool';
import { buildToolPath } from '../../lib/tools';

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      to={buildToolPath(tool)}
      className="group flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-primary-700">
        {tool.name}
      </h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
        {tool.seo.intro}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary-600">
        立即使用
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
