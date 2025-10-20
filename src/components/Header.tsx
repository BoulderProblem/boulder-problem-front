'use client';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { getFromLS, setToLS } from '@/utils/storage';
import { useAuth } from '@/services/useAuth';
import ImageWithToken from 'react-image-with-auth';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMessages } from '@/services/useMessages';
import { Badge, Box } from '@mui/material';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

function Header({ stateChanger }: any) {
  const { user, token, logout } = useAuth();
  const { nbMessagesUnread } = useMessages();
  const [isBlack, setIsBlack] = React.useState(
    JSON.parse(getFromLS('theme') ? getFromLS('theme') : false)
  );
  const checkHandler = () => {
    setIsBlack(!isBlack);
    stateChanger(!isBlack);
    setToLS('theme', JSON.stringify(!isBlack));
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElProfile, setAnchorElProfile] =
    React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openProfile = Boolean(anchorElProfile);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProfile(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  React.useEffect(() => {}, []);

  return (
    <Box position="fixed" top={0} left={0} right={0} zIndex={1001}>
      <div className="navbar bg-base-300">
        <div className="navbar-start">
          <div className="contents lg:hidden">
            <Button
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              aria-label="menu"
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {user && user.roleId !== 1 ? (
                <MenuItem component={Link} to="/feed" onClick={handleClose}>
                  Fil d'actu
                </MenuItem>
              ) : null}
              <MenuItem component={Link} to="/users" onClick={handleClose}>
                Utilisateurs
              </MenuItem>
              <MenuItem component={Link} to="/places" onClick={handleClose}>
                Salles d'escalade
              </MenuItem>
              <MenuItem component={Link} to="/contests" onClick={handleClose}>
                Contests
              </MenuItem>
              <MenuItem component={Link} to="/messages" onClick={handleClose}>
                Messages
              </MenuItem>
            </Menu>
          </div>
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link className="text-lg" to="/">
                Home
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {user && user.roleId !== 1 ? (
              <li>
                <Link className="text-lg" to="/feed">
                  Fil d'actu
                </Link>
              </li>
            ) : null}
            <li>
              <Link className="text-lg" to="/users">
                Utilisateurs
              </Link>
            </li>
            <li>
              <Link className="text-lg" to="/places">
                Salles d'escalade
              </Link>
            </li>
            <li>
              <Link className="text-lg" to="/contests">
                Contests
              </Link>
            </li>
            <li>
              <Badge color="primary" badgeContent={nbMessagesUnread}>
                <Link className="text-lg" to="/messages">
                  Messages
                </Link>
              </Badge>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="contents">
              <Button
                aria-controls={openProfile ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openProfile ? 'true' : undefined}
                onClick={handleClickProfile}
              >
                <div className="mr-5 text-primary-500">
                  <p className="text-sm">{user.firstname}</p>
                  <p className="text-sm">{user.lastname}</p>
                </div>
                <div className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <ImageWithToken
                      imageUrl={
                        baseUrl +
                        '/users/' +
                        user.id +
                        '/avatar/' +
                        user.avatar +
                        '?size=50'
                      }
                      token={token}
                      alt="avatar"
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
              >
                <MenuItem
                  component={Link}
                  to={'/users/' + user.id}
                  onClick={handleCloseProfile}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/places"
                  onClick={handleCloseProfile}
                >
                  Paramètres
                </MenuItem>
                <MenuItem component={Link} to="/" onClick={logout}>
                  Déconnexion
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div></div>
          )}

          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              checked={isBlack}
              onChange={checkHandler}
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
        </div>
      </div>
    </Box>
  );
}

export default Header; // Don’t forget to use export default!
