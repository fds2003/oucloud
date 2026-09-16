import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AppRouter } from './router';

export const App: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />
      <div className="flex-1">
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
};
