import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');

const startApp = () => {
  const reactRoot = createRoot(root);
  reactRoot.render(<App />);
};

if (root) {
  startApp();
} else {
  document.addEventListener('DOMContentLoaded', startApp);
}
