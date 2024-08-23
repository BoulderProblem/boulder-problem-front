import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Page2 from './pages/page2.tsx';
import Page1 from './pages/page1.tsx';
import Index from './pages/index.tsx';
import Page_404 from './pages/Page_404.tsx';
import Login from './pages/login.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AuthProvider } from './services/useAuth.tsx';
import { UnProtectedRoute } from './components/UnProtectedRoute.tsx';
import Users from './pages/users.tsx';
import { UserProvider } from './services/useUser.tsx';

const route = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: (
          <UnProtectedRoute>
            <Login />
          </UnProtectedRoute>
        ),
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/page2',
        element: <Page2 />,
      },
      {
        path: '*',
        element: <Page_404 />,
      },
    ],
  },
];

const router = createBrowserRouter(route);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
