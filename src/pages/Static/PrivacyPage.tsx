import React from 'react';
import { SeoHead } from '../../components/seo/SeoHead';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { STATIC_PAGE_META } from '../../data/seo';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <SeoHead {...STATIC_PAGE_META['/privacy']} />
      <Breadcrumb items={[{ label: '隐私政策' }]} />

      <article className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">隐私保护政策</h1>
        {/* 预渲染时刻与客户端 hydrate 时刻可能跨 UTC 日界，显式抑制该节点的比对警告 */}
        <p className="text-xs text-slate-400" suppressHydrationWarning>
          更新时间：{new Date().toISOString().split('T')[0]}
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800">1. 本地处理原则 (No Upload)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            OUCloud 提供的各类工具（如颜色选取、Favicon 图片裁剪、人民币大写转换等）均通过现代浏览器端技术（Canvas / Web API / 本地 JavaScript）在您的本地设备上执行。我们不会将您的原始图片、财务金额或文本内容上传至任何远程服务器或第三方云端。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800">2. Cookie 与本地存储</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            OUCloud 仅可能使用浏览器本地 LocalStorage 存储必要的用户使用偏好设置（如深浅色模式切换、历史色板预设等），绝不用于跨站点追踪。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800">3. 基础访问日志</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            与绝大多数互联网网站一致，CDN 与托管边缘网络会自动记录常规的匿名 HTTP 请求日志（如 IP 地址、浏览器类型、请求时间等），仅用于防范恶意攻击和保障服务稳定。
          </p>
        </section>
      </article>
    </div>
  );
};
