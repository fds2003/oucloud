import React from 'react';
import { useParams } from 'react-router-dom';
import { getToolBySlug, getRelatedTools } from '../../lib/tools';
import { getToolComponent } from '../../tools/registry';
import { ToolShell } from '../../components/tools/ToolShell';
import { NotFoundPage } from '../Static/NotFoundPage';

export const ToolPage: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  if (!category || !slug) {
    return <NotFoundPage />;
  }

  const tool = getToolBySlug(category, slug);
  // 直接渲染 404 组件而非 <Navigate>：后者会让不存在的 URL 仍返回 HTTP 200（soft 404）
  if (!tool || tool.status !== 'published') {
    return <NotFoundPage />;
  }

  const ToolComponent = getToolComponent(tool.component);
  if (!ToolComponent) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">工具组件加载失败</h2>
        <p className="text-sm text-slate-500 mt-2">未找到注册的组件：{tool.component}</p>
      </div>
    );
  }

  const relatedTools = getRelatedTools(tool, 3);

  return (
    <ToolShell tool={tool} relatedTools={relatedTools}>
      <ToolComponent />
    </ToolShell>
  );
};
