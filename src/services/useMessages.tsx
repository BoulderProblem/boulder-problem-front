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
  selectedConv: CONVERSATION | null;
  nbMessagesUnread: number;
  createConversations: (name: string, userIds: string[]) => Promise<any>;
  getConversations: () => Promise<any>;
  setSelectedConversation: (conv: CONVERSATION | null) => Promise<any>;
  readConversation: (id: number) => Promise<any>;
  getMessages: (convId: number, loadOld?: boolean) => Promise<any>;
  sendMessages: (
    sender_id: string,
    receiver_id: string,
    ciphertext: string,
    nonce: string,
    sender_pub: string,
    recipient_pub: string,
    conversationId: number
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
  const [nbMessagesUnread, setNbMessagesUnread] = useState<number>(0);
  const [conversations, setConversations] = useState<CONVERSATION[]>([]);
  const [selectedConv, setSelectedConv] = useState<CONVERSATION | null>(null);
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
    getConversations();

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

    // quand le socket se connecte (ou se reconnecte)
    socket.on('connect', () => {
      socket.emit('join:user', user.id);
    });

    socket.on('reconnect', () => {
      socket.emit('join:user', user.id);
    });
    // écouter seulement les messages qui me concernent
    socket.on('message:new', async (msg: any) => {
      try {
        const text = await decryptMessageForParticipant(msg, priv);
        const decrypted = { ...msg, text };

        setMessages((prev) =>
          prev.some((m) => m.id === decrypted.id) ? prev : [...prev, decrypted]
        );

        if (
          msg.receiverId === user.id &&
          selectedConv &&
          selectedConv.id === msg.conversationId
        ) {
          readConversation(selectedConv.id);
        } else {
          setNbMessagesUnread((prev) => prev + 1);
        }

        setConversations((prev) => {
          const exists = prev.some((conv) => conv.id === msg.conversationId);

          if (exists) {
            return prev.map((conv) =>
              conv.id === msg.conversationId
                ? {
                    ...conv,
                    unreadMessages:
                      (!selectedConv || selectedConv.id !== conv.id) &&
                      msg.senderId !== user.id
                        ? conv.unreadMessages + 1
                        : 0,
                    latestMessage: [decrypted], // on ajoute au lieu d'écraser
                    updatedAt: new Date().toISOString(),
                  }
                : conv
            );
          } else {
            // si la conv n’existe pas → on la crée avec ce message
            getConversationId(msg.conversationId);
            return prev;
          }
        });

        // add conv if not exist
      } catch (e) {
        console.error('Erreur de déchiffrement temps réel:', e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, selectedConv, priv]);

  async function createConversations(name: string, userIds: string[]) {
    await axiosClient
      .post(`${baseUrl}/conversations`, { name, userIds })
      .then(async (response) => {
        setConversations((prev) => {
          const newOnes = response.data.filter(
            ({ id }: any) => !prev.some((e) => e.id === id)
          );

          return [...prev, ...newOnes];
        });
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
            if (conv.latestMessage.length === 1) {
              try {
                const text = await decryptMessageForParticipant(
                  conv.latestMessage[0],
                  priv
                );

                conv.latestMessage[0].text = text;
                return conv; // conserve metadata + ajoute texte clair
              } catch (e) {
                console.error('Erreur de déchiffrement:', e);
                conv.latestMessage[0].text = '[Message illisible]';
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

        response.data.forEach((conv: CONVERSATION) => {
          setNbMessagesUnread(
            (prev) => prev + (conv.unreadMessages ? conv.unreadMessages : 0)
          );
        });
      })
      .catch((errors) => {
        console.log(error);

        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function getConversationId(id: string) {
    let url = `${baseUrl}/conversations/${id}`;

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

  async function setSelectedConversation(conv: CONVERSATION | null) {
    setSelectedConv(conv);
    if (conv) {
      // load messages of the conversation
      getMessages(conv.id);
    }
    return;
  }

  async function readConversation(id: number) {
    await axiosClient
      .post(`${baseUrl}/conversations/${id}/read`)
      .then(async () => {
        setConversations((prev) => {
          return prev.map((conv) =>
            conv.id === id
              ? {
                  ...conv,
                  unreadMessages: 0,
                }
              : conv
          );
        });
        setNbMessagesUnread(
          nbMessagesUnread -
            (conversations.find((c) => c.id === id)?.unreadMessages || 0)
        );
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return;
  }

  /**
   * get messages of a conversation
   * @param convId // id de la conversation
   * @returns
   */
  async function getMessages(convId: number, loadOld?: boolean) {
    setLoading(true);
    let url = `${baseUrl}/messages?convId=${convId}`;

    // si on charge les anciens messages, on ajoute le param before avec la date du plus ancien message déjà chargé
    if (loadOld && messages.length > 0) {
      const oldestMessage = messages
        .filter((m) => m.conversationId === convId)
        .reduce((oldest, msg) =>
          new Date(msg.createdAt) < new Date(oldest.createdAt) ? msg : oldest
        );
      url += `&before=${new Date(oldestMessage.createdAt).toISOString()}`;
    }
    await axiosClient
      .get(url)
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
        readConversation(convId);
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
    conversationId: number
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

  const memoedValue = useMemo(
    () => ({
      messages,
      conversations,
      selectedConv,
      nbMessagesUnread,
      createConversations,
      getConversations,
      setSelectedConversation,
      readConversation,
      getMessages,
      sendMessages,
    }),
    [loading, messages, conversations, selectedConv, nbMessagesUnread]
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
