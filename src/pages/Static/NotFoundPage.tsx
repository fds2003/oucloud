import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { SeoHead } from '../../components/seo/SeoHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <SeoHead
        title="404 - 页面未找到 | OUCloud"
        description="抱歉，您访问的页面不存在或已被移除。"
        canonicalPath="/404"
      />
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 text-2xl font-black mb-6">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        页面未找到
      </h1>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
        您访问的工具页面可能已迁移或链接输入有误。您可以返回首页选择您需要的工具。
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-700 transition-colors"
        >
          <Home className="w-4 h-4" /> 返回工具首页
        </Link>
      </div>
    </div>
  );
};
