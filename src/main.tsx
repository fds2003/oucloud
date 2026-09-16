import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const tree = (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  // 预渲染产物中 #root 已含静态 HTML，必须 hydrate 复用，否则 React 会清空
  // 首屏 DOM 导致闪白并拉高 CLS；本地开发容器为空，走 createRoot。
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, tree);
  } else {
    ReactDOM.createRoot(rootElement).render(tree);
  }
}
