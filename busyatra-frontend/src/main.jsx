import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

console.log('🚀 Main.jsx is executing...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = ReactDOM.createRoot(rootElement);
  console.log('✅ Root created, rendering app...');

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('✅ Render called successfully');
} catch (error) {
  console.error('🔥 CRITICAL ERROR IN MAIN.JSX:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>Application Failed to Start</h1>
    <pre>${error.message}\n${error.stack}</pre>
  </div>`;
}