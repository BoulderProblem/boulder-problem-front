import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/frontSide/index.tsx';
import Home from './pages/home.tsx';
import Page_404 from './pages/Page_404.tsx';
import Login from './pages/frontSide/login.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AuthProvider } from './services/useAuth.tsx';
import { PlacesProvider } from './services/usePlaces.tsx';
import { UnProtectedRoute } from './components/UnProtectedRoute.tsx';
import Users from './pages/users.tsx';
import Places from './pages/places.tsx';
import PlaceId from './pages/placeId.tsx';
import UserId from './pages/userId.tsx';
import { UsersProvider } from './services/useUsers.tsx';
import useAuth from './services/useAuth.tsx';
import Confidentialité from './pages/frontSide/confidentialite.tsx';
import Conditions from './pages/frontSide/conditions.tsx';

const Main = () => {
  const { user } = useAuth();

  const route = [
    {
      path: '/',
      element: user ? <App /> : <Index />,
      children: [
        {
          path: '/',
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: '/users',
          element: (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          ),
        },
        {
          path: '/users/:id',
          element: (
            <ProtectedRoute>
              <UserId />
            </ProtectedRoute>
          ),
        },
        {
          path: '/places',
          element: (
            <ProtectedRoute>
              <Places />
            </ProtectedRoute>
          ),
        },
        {
          path: '/places/:id',
          element: (
            <ProtectedRoute>
              <PlaceId />
            </ProtectedRoute>
          ),
        },

        {
          path: '*',
          element: <Page_404 />,
        },
      ],
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
      path: '/privacy_policy',
      element: <Confidentialité />,
    },
    {
      path: '/terms_of_service',
      element: <Conditions />,
    },
  ];

  const router = createBrowserRouter(route);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UsersProvider>
        <PlacesProvider>
          <Main />
        </PlacesProvider>
      </UsersProvider>
    </AuthProvider>
  </React.StrictMode>
);
