import React, { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../services/useAuth.tsx';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
} from '@mui/icons-material';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../firebase';

const Login = () => {
  const { login, loginFirebase, loading, error } = useAuth();

  const [email, setEmail] = useState(localStorage.getItem('login-email') || '');
  const [password, setPassword] = useState(
    localStorage.getItem('login-email') || ''
  );
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const googleProvider = new GoogleAuthProvider();
  const facebookrovider = new FacebookAuthProvider();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    login(email, password);
  }

  async function handleGoogle() {
    setLoadingGoogle(true);
    let result = await signInWithPopup(auth, googleProvider);
    const tokenResponse = (result as any)._tokenResponse;
    console.log(tokenResponse);
    loginFirebase(tokenResponse.idToken, tokenResponse.localId).then(() => {
      setLoadingGoogle(false);
    });
  }

  async function handleFacebook() {
    await signInWithPopup(auth, facebookrovider);
    // onIdTokenChanged gère la suite
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 400, width: '100%', boxShadow: 6, borderRadius: 3 }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Boulder Problem
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              Connectez-vous
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Votre email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="right">
              <Link to="/forgot_password">Mot de passe oublié ?</Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                backgroundColor: 'var(--primary-600)',
                color: 'white !important',
                '&:hover': { backgroundColor: 'var(--primary-700)' },
                textTransform: 'none',
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Connexion'
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
              onClick={handleGoogle}
            >
              {loadingGoogle ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Se connecter avec Google'
              )}
            </Button>

            <Button
              disabled
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
              onClick={handleFacebook}
            >
              Se connecter avec Facebook
            </Button>

            {error && (
              <Typography color="error" textAlign="center" mt={1}>
                {error}
              </Typography>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={1}
            >
              Vous n'avez pas de compte ?{' '}
              <Link to="/register">Créer un compte</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default Login;
