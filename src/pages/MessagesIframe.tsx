import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/services/useAuth';
import { Conversations } from '@/components/messages/conversations';

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

  return <Conversations />;
};

export default MessagesIframe;
