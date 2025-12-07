import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { isAdmin } from './utils';

const Admin = React.lazy(() => import('./Admin'));
const App = React.lazy(() => import('./App'));

const content = isAdmin() ? <Admin /> : <App />;

ReactDOM.render(
  <React.StrictMode>
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-xl font-sans">
          Loading...
        </div>
      }
    >
      {content}
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
