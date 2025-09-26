import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from '@/app';
import { scan } from 'react-scan';
import Providers from './app/providers';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);

scan({
  enabled: true,
});
