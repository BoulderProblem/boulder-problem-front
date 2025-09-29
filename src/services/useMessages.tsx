import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import axiosClient from '../axios-client';
import { decryptMessageForParticipant } from '@/crypto';
import { useAuth } from './useAuth';
import { MESSAGE } from '@/types/message';
import { CONVERSATION } from '@/types/conversation';
import { io } from 'socket.io-client';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

interface MessagesContextType {
  // We defined the Contest type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  messages: MESSAGE[];
  conversations: CONVERSATION[];
  createConversations: (name: string, userIds: string[]) => Promise<any>;
  getConversations: (last?: boolean) => Promise<any>;
  getMessages: (convId: string) => Promise<any>;
  sendMessages: (
    sender_id: string,
    receiver_id: string,
    ciphertext: string,
    nonce: string,
    sender_pub: string,
    recipient_pub: string,
    conversationId: string
  ) => Promise<any>;
}

const MessagesContext = createContext<MessagesContextType>(
  {} as MessagesContextType
);

// Export the provider as we need to wrap the entire app with it
export function MessagesProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [conversations, setConversations] = useState<CONVERSATION[]>([]);
  const dateRef = useRef<Date | null>(null);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { priv } = useAuth();

  // We are using `react-router` for this example,
  // but feel free to omit this or use the
  // router of your choice.
  //   const location = useLocation();

  // ⚡️ Socket.IO client (init une fois)
  const socketRef = useRef<any>(null);

  // Reset the error state if we change page
  useEffect(() => {
    if (!user?.id) return;
    const socket = io(
      process.env.NODE_ENV === 'production'
        ? 'https://boulder-problem.chabs.fr' // pas /api ici
        : 'http://localhost:3333',
      {
        transports: ['websocket'],
        path:
          process.env.NODE_ENV === 'production'
            ? '/api/socket.io'
            : '/socket.io',
      }
    );
    socketRef.current = socket;

    // rejoindre room perso
    socket.emit('join:user', user.id);

    // écouter seulement les messages qui me concernent
    socket.on('message:new', async (msg: any) => {
      console.log(msg);

      try {
        const text = await decryptMessageForParticipant(msg, priv);
        const decrypted = { ...msg, text };

        setMessages((prev) =>
          prev.some((m) => m.id === decrypted.id) ? prev : [...prev, decrypted]
        );

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === msg.conversationId
              ? {
                  ...conv,
                  messages: [decrypted],
                  updatedAt: new Date().toISOString(),
                }
              : conv
          )
        );
      } catch (e) {
        console.error('Erreur de déchiffrement temps réel:', e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, priv]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    // set color and difficulty
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  async function createConversations(name: string, userIds: string[]) {
    await axiosClient
      .post(`${baseUrl}/conversations`, { name, userIds })
      .then(async (response) => {
        await getConversations();
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  /**
   * get conversations of the user
   */
  async function getConversations() {
    let url = `${baseUrl}/conversations`;

    await axiosClient
      .get(url)
      .then(async (response) => {
        const now = new Date();
        dateRef.current = now;

        let decryptedMessages = await Promise.all(
          response.data.map(async (conv: any) => {
            if (conv.messages.length === 1) {
              try {
                const text = await decryptMessageForParticipant(
                  conv.messages[0],
                  priv
                );

                conv.messages[0].text = text;
                return conv; // conserve metadata + ajoute texte clair
              } catch (e) {
                console.error('Erreur de déchiffrement:', e);
                conv.messages[0].text = '[Message illisible]';
                return conv;
              }
            } else {
              return conv;
            }
          })
        );

        setConversations((prev) => {
          const newOnes = decryptedMessages.filter(
            ({ id }) => !prev.some((e) => e.id === id)
          );

          return [...prev, ...newOnes];
        });
      })
      .catch((errors) => {
        console.log(error);

        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  /**
   * get messages of a conversation
   * @param convId // id de la conversation
   * @returns
   */
  async function getMessages(convId: string) {
    setLoading(true);
    await axiosClient
      .get(`${baseUrl}/messages?convId=${convId}`)
      .then(async (response) => {
        let decryptedMessages = await Promise.all(
          response.data.map(async (msg: any) => {
            try {
              const text = await decryptMessageForParticipant(msg, priv);
              return { ...msg, text }; // conserve metadata + ajoute texte clair
            } catch (e) {
              console.error('Erreur de déchiffrement:', e);
              return { ...msg, text: '[Message illisible]' };
            }
          })
        );

        setMessages((prev) => {
          const newOnes = decryptedMessages.filter(
            ({ id }) => !prev.some((e) => e.id === id)
          );
          return [...prev, ...newOnes];
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return;
  }

  /**
   * send message via websocket
   * @param sender_id // id de l'expéditeur
   * @param receiver_id // id du destinataire
   * @param ciphertext // message chiffré
   * @param nonce // nonce utilisé pour le chiffrement
   * @param sender_pub // clé publique de l'expéditeur
   * @param recipient_pub // clé publique du destinataire
   * @param conversationId // id de la conversation
   */
  async function sendMessages(
    sender_id: string,
    receiver_id: string,
    ciphertext: string,
    nonce: string,
    sender_pub: string,
    recipient_pub: string,
    conversationId: string
  ) {
    socketRef.current.emit('message:send', {
      sender_id,
      receiver_id,
      ciphertext,
      nonce,
      sender_pub,
      recipient_pub,
      conversationId,
    });
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the Contest,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      messages,
      conversations,
      createConversations,
      getConversations,
      getMessages,
      sendMessages,
    }),
    [messages, conversations]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current Contest.
  return (
    <MessagesContext.Provider value={memoedValue}>
      {children}
    </MessagesContext.Provider>
  );
}

// Let's only export the `usePlaces` hook instead of the context.
// We only want to use the hook directly and never the context component.
export function useMessages() {
  return useContext(MessagesContext);
}
