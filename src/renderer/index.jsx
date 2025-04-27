import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

// 确保DOM加载完成后再渲染React
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  // 添加调试信息
  if (!container) {
    console.error('找不到root元素!');
    return;
  }
  
  try {
    const root = createRoot(container);
    root.render(<App />);
    console.log('React应用已渲染');
  } catch (error) {
    console.error('React渲染错误:', error);
  }
});
