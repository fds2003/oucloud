import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { categories } from '../../data/categories';
import { SITE } from '../../data/site';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      {/* 核心保障标识 */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">纯前端本地运行</h4>
                <p className="text-xs text-slate-500">数据与文件均在本地处理，绝不上传云端</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">毫秒级极速响应</h4>
                <p className="text-xs text-slate-500">零服务器往返开销，秒级完成转换导出</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">安全合规免注册</h4>
                <p className="text-xs text-slate-500">打开即用，无强制登录，无骚扰弹窗</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航区 */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <span className="text-base font-bold text-slate-900">
              OUCloud<span className="text-primary-600">.cn</span>
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              基于现代 Web 标准构建的高效、轻量、私密的在线工具箱矩阵平台。
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              工具分类
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/tools/${c.slug}`} className="hover:text-primary-600 transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              关于平台
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/about" className="hover:text-primary-600 transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-600 transition-colors">
                  隐私保护政策
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-600 transition-colors">
                  服务与免责条款
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              技术驱动
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              采用 React + TypeScript + Vite + Tailwind CSS 纯静态生成，托管于全球加速边缘网络。
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} OUCloud.cn. 保留所有权利。</span>
            {SITE.icpLicense && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:text-slate-600"
              >
                {SITE.icpLicense}
              </a>
            )}
          </div>
          <p>纯本地运算 · 隐私优先 · 极简体验</p>
        </div>
      </div>
    </footer>
  );
};
