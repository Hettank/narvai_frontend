import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Layout from '../layout/Layout';
import ProtectedRoutes from '../components/ProtectedRoutes';

const withLayout = (Component, requiresAuth = false) => ({
  element: requiresAuth ? (
    <ProtectedRoutes>
      <Layout>
        <Component />
      </Layout>
    </ProtectedRoutes>
  ) : (
    <Layout>
      <Component />
    </Layout>
  ),
});

const router = createBrowserRouter([
  {
    path: '/',
    ...withLayout(App, true),
  },
  {
    path: '/expenses',
    ...withLayout(App, true),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
