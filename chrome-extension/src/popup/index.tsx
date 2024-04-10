import '../global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './popup';
import { AuthContextProvider } from './auth';
import { Layout } from './layout';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <AuthContextProvider>
        <Popup />
      </AuthContextProvider>
    </Layout>
  </React.StrictMode>
);
