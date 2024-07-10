import { createHashRouter, Navigate } from 'react-router-dom';
import App from './App';
import specs from './specs';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to={`/${specs[0].slug}`} />,
  },
  ...specs.map(spec => ({
    path: `/${spec.slug}`,
    element: <App spec={spec} />,
  })),
]);

export default router;
