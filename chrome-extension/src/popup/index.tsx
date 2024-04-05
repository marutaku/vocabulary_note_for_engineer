import '../global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './popup';
import { AuthContextProvider } from './auth';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className='w-96'>
      <AuthContextProvider>
        <Popup />
      </AuthContextProvider>
    </div>
  </React.StrictMode>
);
