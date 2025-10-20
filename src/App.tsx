import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Footer from './components/Footer.tsx';
import { Outlet, useLocation } from 'react-router-dom';
import { getFromLS } from './utils/storage.ts';
import { useEffect, useState } from 'react';
import Header from './components/Header.tsx';
import { Box } from '@mui/material';

function App() {
  const [isBlack, setIsBlack] = useState(
    JSON.parse(getFromLS('theme') ? getFromLS('theme') : false)
  );
  const [headerHeight, setHeaderHeight] = useState(0);

  const darkTheme = createTheme({
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

  useEffect(() => {
    const headerElement = document.querySelector('.navbar');
    if (headerElement) {
      const headerHeight = headerElement.offsetHeight;

      setHeaderHeight(headerHeight / 8);
    }
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider theme={darkTheme}>
        <Helmet>
          <title>Boulder problem</title>
          <meta name="description" content="page de la salle d'escalade" />
        </Helmet>
        <div className={'h-screen layout ' + (isBlack ? 'dark' : '')}>
          <Header stateChanger={setIsBlack} />
          <main className="h-[calc(100%-56px)]">
            <Box pt={headerHeight} className="h-full">
              <Outlet />
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
