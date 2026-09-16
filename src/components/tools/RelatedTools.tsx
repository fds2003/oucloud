import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench } from 'lucide-react';
import { ToolMeta } from '../../types/tool';
import { buildToolPath } from '../../lib/tools';

export interface RelatedToolsProps {
  tools: ToolMeta[];
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ tools }) => {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="mt-14 border-t border-slate-200 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary-600" />
          推荐相关工具
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => (
          <Link
            key={t.id}
            to={buildToolPath(t)}
            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                  {t.category}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-base font-semibold text-slate-900 mt-2.5 group-hover:text-primary-600 transition-colors">
                {t.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {t.seo.intro}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
