import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/services/useAuth';
import { Conversations } from '@/components/messages/conversations';
import { Box } from '@mui/material';
import { useMessages } from '@/services/useMessages';

const MessagesIframe = () => {
  const [searchParams] = useSearchParams();

  // Override auth token with the one from URL
  const { SetToken, SetPriv } = useAuth();
  const { getConversations } = useMessages();
  const initialized = useRef(false);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== 'https://app.example') return;
      if (event.data?.type !== 'ANDROID_INIT') return;
      if (initialized.current) return;

      initialized.current = true;

      const { token, secret } = event.data;

      // 1️⃣ Stocker le token en mémoire (pas localStorage)
      SetToken(token);

      // 2️⃣ Utiliser le secret pour déchiffrer
      SetPriv(secret);

      getConversations();
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [SetToken, SetPriv, getConversations]);

  return (
    <Box sx={{ height: '100vh' }}>
      <Conversations />
    </Box>
  );
};

export default MessagesIframe;
