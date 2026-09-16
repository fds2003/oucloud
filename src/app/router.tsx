import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/Home/HomePage';
import { CategoryPage } from '../pages/Category/CategoryPage';
import { ToolPage } from '../pages/Tool/ToolPage';
import { AboutPage } from '../pages/Static/AboutPage';
import { PrivacyPage } from '../pages/Static/PrivacyPage';
import { TermsPage } from '../pages/Static/TermsPage';
import { NotFoundPage } from '../pages/Static/NotFoundPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tools/:categorySlug" element={<CategoryPage />} />
      <Route path="/tools/:category/:slug" element={<ToolPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
