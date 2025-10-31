import { FormEvent, useState } from 'react';
import { useAuth } from '../../services/useAuth.tsx';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';

const ForgotPassword = () => {
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState(localStorage.getItem('login-email') || '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    forgotPassword(email).then(() => {
      window.location.href = '/reset_password';
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
              Réinitialiser le mot de passe
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 1 }}
            >
              Saisis ton adresse email et nous t’enverrons un mail pour
              réinitialiser ton mot de passe
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
                'Réinitialiser le mot de passe'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default ForgotPassword;
