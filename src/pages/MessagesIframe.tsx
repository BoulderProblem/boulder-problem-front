import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/services/useAuth';
import { Conversations } from '@/components/messages/conversations';
import { Box } from '@mui/material';

const MessagesIframe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Override auth token with the one from URL
  const { SetToken } = useAuth();

  useEffect(() => {
    if (token) {
      SetToken(token);
    }
  }, [token, SetToken]);

  return (
    <Box sx={{ height: '100vh' }}>
      <Conversations />
    </Box>
  );
};

export default MessagesIframe;
