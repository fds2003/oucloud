import React from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { AppRouter } from './router'

export const App: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />
      {/* main 地标：屏幕阅读器/搜索引擎识别主内容区，全站唯一 */}
      <main className="flex-1">
        <AppRouter />
      </main>
      <Footer />
    </div>
  )
}
