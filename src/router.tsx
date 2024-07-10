import { createHashRouter, Navigate } from 'react-router-dom';
import App from './App';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/json-fg" />,
  },
  {
    path: '/json-fg',
    element: <App spec="json-fg" />,
  },
  {
    path: '/ogcapi-features',
    element: <App spec="ogcapi-features" />,
  },
]);

export default router;
