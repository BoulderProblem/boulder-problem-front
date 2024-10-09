import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/index.tsx";
import Page_404 from "./pages/Page_404.tsx";
import Login from "./pages/login.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./services/useAuth.tsx";
import { PlacesProvider } from "./services/usePlaces.tsx";
import { UnProtectedRoute } from "./components/UnProtectedRoute.tsx";
import Users from "./pages/users.tsx";
import Places from "./pages/places.tsx";
import PlaceId from "./pages/placeId.tsx";

const route = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/places",
        element: (
          <ProtectedRoute>
            <Places />
          </ProtectedRoute>
        ),
      },
      {
        path: "/places/:id",
        element: (
          <ProtectedRoute>
            <PlaceId />
          </ProtectedRoute>
        ),
      },

      {
        path: "*",
        element: <Page_404 />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <UnProtectedRoute>
        <Login />
      </UnProtectedRoute>
    ),
  },
];

const router = createBrowserRouter(route);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <PlacesProvider>
        <RouterProvider router={router} />
      </PlacesProvider>
    </AuthProvider>
  </React.StrictMode>
);
