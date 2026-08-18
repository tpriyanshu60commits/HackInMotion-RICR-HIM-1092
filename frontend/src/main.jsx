import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.jsx';
import { initAdaptiveTextColor } from './utils/adaptiveTextColor.js';

// Initialize global observer for adaptive text contrast
initAdaptiveTextColor();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
