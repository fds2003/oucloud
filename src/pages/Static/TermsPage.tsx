import React from 'react';
import { SeoHead } from '../../components/seo/SeoHead';
import { Breadcrumb } from '../../components/layout/Breadcrumb';

export const TermsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <SeoHead
        title="服务条款与免责声明 - OUCloud"
        description="OUCloud 在线工具平台的服务协议与使用条款说明。"
        canonicalPath="/terms"
      />
      <Breadcrumb items={[{ label: '服务条款' }]} />

      <article className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">服务条款与免责声明</h1>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800">1. 服务准则</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            OUCloud 致力于为公众提供免费、高效、便捷的纯前端计算与转换工具。用户在使用本网站服务时，应遵守中华人民共和国及所在地相关法律法规。
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800">2. 免责声明</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            本站所有工具计算（包括但不限于金额大写转换、色彩转换等）均经过严密测试与校验，但仅供参考与工作辅助使用。在涉及巨额财务往来、正式法律合同签署时，建议您进行必要的人工复核。对于因使用本站工具产生之任何直接或间接损失，OUCloud 不承担法律责任。
          </p>
        </section>
      </article>
    </div>
  );
};
