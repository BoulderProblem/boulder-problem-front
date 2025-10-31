import { FormEvent, useState } from 'react';
import { useAuth } from '../../services/useAuth.tsx';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const { resetPassword, loading, error } = useAuth();

  const [email, setEmail] = useState(localStorage.getItem('login-email') || '');
  const [code, setCode] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    resetPassword(email, code as number, password).then(() => {
      window.location.href = '/login';
    });
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
              Nouveau mot de passe
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 1 }}
            >
              Saisis ton code reçu par mail ainsi que ton nouveau mot de passe
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
              label="Votre code de réinitialisation"
              type="number"
              fullWidth
              variant="outlined"
              value={code}
              onChange={(e) => setCode(parseInt(e.target.value))}
              required
            />
            <TextField
              label="Nouveau mot de passe"
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
                'Définir un nouveau mot de passe'
              )}
            </Button>
            {error && (
              <Typography color="error" textAlign="center" mt={1}>
                {error}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default ResetPassword;
