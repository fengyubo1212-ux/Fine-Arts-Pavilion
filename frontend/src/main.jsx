import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// GitHub Pages 刷新兜底：把 404.html 暂存的原始路径还原给路由
const redirect = sessionStorage.getItem('__redirect__');
if (redirect) {
  sessionStorage.removeItem('__redirect__');
  window.history.replaceState(null, '', redirect);
}

// 生产构建部署在 /Fine-Arts-Pavilion/ 子路径；本地开发仍在根路径
const basename = import.meta.env.PROD ? import.meta.env.BASE_URL.replace(/\/$/, '') : '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);
