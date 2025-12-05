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
import { useAuth } from './services/useAuth.tsx';
import Confidentialité from './pages/frontSide/confidentialite.tsx';
import Conditions from './pages/frontSide/conditions.tsx';
import { ContestsProvider } from './services/useContests.tsx';
import ContestId from './pages/contestId.tsx';
import Contests from './pages/contests.tsx';
import Messages from './pages/message.tsx';
import { MessagesProvider } from './services/useMessages.tsx';
import Feed from './pages/feed.tsx';
import PlaceIdUpdate from './pages/placeIdUpdate.tsx';
import ForgotPassword from './pages/frontSide/forgotPassword.tsx';
import ResetPassword from './pages/frontSide/resetPassword.tsx';
import MessagesIframe from './pages/MessagesIframe.tsx';

const Main = () => {
  const { user } = useAuth();

  const route = [
    {
      path: '/',
      element: user ? <App /> : <Index />,
      children: [
        {
          path: '/',
          element:
            user && user.roleId === 1 ? (
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            ) : (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ),
        },
        {
          path: '/feed',
          element: (
            <ProtectedRoute>
              <Feed />
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
          path: '/places/:id/update',
          element: (
            <ProtectedRoute>
              <PlaceIdUpdate />
            </ProtectedRoute>
          ),
        },
        {
          path: '/contests/',
          element: (
            <ProtectedRoute>
              <Contests />
            </ProtectedRoute>
          ),
        },
        {
          path: '/contests/:id',
          element: (
            <ProtectedRoute>
              <ContestId />
            </ProtectedRoute>
          ),
        },
        {
          path: '/messages/',
          element: (
            <ProtectedRoute>
              <Messages />
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
      path: '/forgot_password',
      element: (
        <UnProtectedRoute>
          <ForgotPassword />
        </UnProtectedRoute>
      ),
    },
    {
      path: '/reset_password',
      element: (
        <UnProtectedRoute>
          <ResetPassword />
        </UnProtectedRoute>
      ),
    },
    {
      path: '/privacy',
      element: <Confidentialité />,
    },
    {
      path: '/terms_of_service',
      element: <Conditions />,
    },
    {
      path: '/iframe/messages',
      element: <MessagesIframe />,
    },
  ];

  const router = createBrowserRouter(route);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <AuthProvider>
    <UsersProvider>
      <PlacesProvider>
        <ContestsProvider>
          <MessagesProvider>
            <Main />
          </MessagesProvider>
        </ContestsProvider>
      </PlacesProvider>
    </UsersProvider>
  </AuthProvider>
  // </React.StrictMode>
);
