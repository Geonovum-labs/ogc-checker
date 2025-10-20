import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from '@geonovum/standards-checker';
import specs from './specs';
import '@geonovum/standards-checker/ui/index.css';

const router = createRouter(specs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);