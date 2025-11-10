import './App.css';
import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getFromLS, setToLS } from './utils/storage';
import { Avatar, Box, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

// Toolpad Core
import { AppProvider, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

import Footer from './components/Footer';
import { useAuth } from './services/useAuth';
import { useAvatar } from './hooks/useAvatar';

const baseNavigation = [
  { segment: 'feed', title: "Fil d'actualité", icon: <DashboardIcon /> },
  { segment: 'users', title: 'Utilisateurs', icon: <PeopleIcon /> },
  { segment: 'places', title: 'Salles', icon: <MapIcon /> },
  { segment: 'contests', title: 'Contests', icon: <MapIcon /> },
  { segment: 'messages', title: 'Messages', icon: <MapIcon /> },
  { kind: 'divider' },
  { segment: 'settings', title: 'Paramètres', icon: <SettingsIcon /> },
];

const gerantNavigation = [
  { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'feed', title: "Fil d'actualité", icon: <DashboardIcon /> },
  { segment: 'users', title: 'Utilisateurs', icon: <PeopleIcon /> },
  { segment: 'places', title: 'Salles', icon: <MapIcon /> },
  { segment: 'contests', title: 'Contests', icon: <MapIcon /> },
  { segment: 'messages', title: 'Messages', icon: <MapIcon /> },
  { kind: 'divider' },
  { segment: 'settings', title: 'Paramètres', icon: <SettingsIcon /> },
];

const adminNavigation = [
  { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'feed', title: "Fil d'actualité", icon: <DashboardIcon /> },
  { segment: 'users', title: 'Utilisateurs', icon: <PeopleIcon /> },
  { segment: 'places', title: 'Salles', icon: <MapIcon /> },
  { segment: 'contests', title: 'Contests', icon: <MapIcon /> },
  { segment: 'messages', title: 'Messages', icon: <MapIcon /> },
  { kind: 'divider' },
  { segment: 'settings', title: 'Paramètres', icon: <SettingsIcon /> },
];

// Adapter React Router pour Toolpad
function useReactRouterAdapter(): Router {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path: string | URL) => navigate(String(path)),
  };
}

// Toggle dark/light theme
function ThemeToggle({
  isBlack,
  setIsBlack,
}: {
  isBlack: boolean;
  setIsBlack: Function;
}) {
  const handleToggle = () => {
    setIsBlack(!isBlack);
    setToLS('theme', JSON.stringify(!isBlack));
  };

  return (
    <label className="swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        className="theme-controller"
        checked={isBlack}
        onChange={handleToggle}
        value="night"
      />

      {/* sun icon */}
      <svg
        className="swap-off h-6 w-6 m-auto mr-3"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>

      {/* moon icon */}
      <svg
        className="swap-on h-6 w-6 fill-current m-auto mr-3"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
    </label>
  );
}

function User({ user, token, logout }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElProfile, setAnchorElProfile] =
    React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openProfile = Boolean(anchorElProfile);

  const avatarUrl = useAvatar(user.id, user.avatar, token, 'user');

  const handleClickProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProfile(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };
  return (
    <div className="contents">
      <Button
        className="text-inherit"
        aria-controls={openProfile ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openProfile ? 'true' : undefined}
        onClick={handleClickProfile}
      >
        <div className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Avatar
              src={avatarUrl}
              alt="Profile"
              sx={{
                width: 72,
                height: 72,
                border: '3px solid var(--primary-600)',
              }}
            />
          </div>
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorElProfile}
        open={openProfile}
        onClose={handleCloseProfile}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        className="pt-0"
      >
        <div className="p-5 bg-base-100">
          <p className="text-md">{user.firstname}</p>
          <p className="text-md">{user.lastname}</p>
        </div>
        <MenuItem
          component={Link}
          to={'/users/' + user.id}
          onClick={handleCloseProfile}
        >
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/places" onClick={handleCloseProfile}>
          Paramètres
        </MenuItem>
        <MenuItem component={Link} to="/" onClick={logout}>
          Déconnexion
        </MenuItem>
      </Menu>
    </div>
  );
}

export default function App() {
  const { user, token, logout } = useAuth();
  const [isBlack, setIsBlack] = React.useState(
    JSON.parse(getFromLS('theme') || 'false')
  );

  const NAVIGATION = React.useMemo(() => {
    if (user && user.roleId === 1) {
      return baseNavigation;
    }
    if (user && user.roleId === 2) {
      return gerantNavigation;
    }
    if (user && user.roleId === 3) {
      return baseNavigation;
    }
    return adminNavigation;
  }, [user]);

  const router = useReactRouterAdapter();

  const theme = createTheme({
    palette: {
      mode: isBlack ? 'dark' : 'light',
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& label.Mui-focused': {
              color: 'var(--primary-400)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: '2px solid var(--primary-300)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--primary-400)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--primary-400)',
            },
          },
        },
      },
    },
  });

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <Helmet>
          <title>Boulder Problem</title>
        </Helmet>

        <AppProvider
          navigation={NAVIGATION}
          router={router}
          theme={theme}
          branding={{
            title: 'Boulder Problem',
            logo: (
              <img
                src="./src/assets/home-background.webp"
                alt="Boulder Problem"
                style={{ width: 32, height: 32 }}
              />
            ),
          }}
        >
          <DashboardLayout
            slots={{
              toolbarActions: () => (
                <Box display="flex" alignItems="center" gap={2}>
                  <User user={user} token={token} logout={logout} />
                  <ThemeToggle isBlack={isBlack} setIsBlack={setIsBlack} />
                </Box>
              ),
            }}
          >
            {/* Contenu principal */}
            <Box
              sx={{ height: `calc(100vh - 64px)` }} // laisse la place pour le header
              display="flex"
              flexDirection="column"
              className={'' + (isBlack ? 'dark' : '')}
            >
              <Outlet height="100%" />
              {/* Footer */}
              <Footer />
            </Box>
          </DashboardLayout>
        </AppProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
