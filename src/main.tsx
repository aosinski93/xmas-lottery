import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { isAdmin } from './utils';
import { LotteryDataProvider } from './contexts/lottery-data-context';

const Admin = React.lazy(() => import('./admin'));
const App = React.lazy(() => import('./app'));

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <LotteryDataProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-xl font-sans">
            Loading...
          </div>
        }
      >
        {isAdmin() ? <Admin /> : <App />}
      </Suspense>
    </LotteryDataProvider>
  </React.StrictMode>
);
