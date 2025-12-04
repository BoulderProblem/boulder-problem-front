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
import {
  decrypt,
  decryptGroupKeyFromServer,
  decryptGroupMessage,
} from '@/crypto';
import { useAuth } from './useAuth';
import { MESSAGE } from '@/types/message';
import { CONVERSATION } from '@/types/conversation';
import { io } from 'socket.io-client';

let baseUrl = import.meta.env.VITE_URL;

interface MessagesContextType {
  // We defined the Contest type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  messages: MESSAGE[];
  conversations: CONVERSATION[];
  selectedConv: CONVERSATION | null;
  createConversations: (name: string, userIds: string[]) => Promise<any>;
  getConversations: () => Promise<any>;
  setSelectedConversation: (conv: CONVERSATION | null) => Promise<any>;
  readConversation: (id: number) => Promise<any>;
  getMessages: (convId: number, loadOld?: boolean) => Promise<any>;
  sendMessages: (
    sender_id: string,
    ciphertext: string,
    nonce: string,
    conversationId: number,
    key_version: number
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
  const { user, priv, pubSrvKey, SetNbMessagesUnread } = useAuth();
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [conversations, setConversations] = useState<CONVERSATION[]>([]);
  const [selectedConv, setSelectedConv] = useState<CONVERSATION | null>(null);
  const selectedConvRef = useRef<CONVERSATION | null>(null);
  const dateRef = useRef<Date | null>(null);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const conversationsRef = useRef<CONVERSATION[]>([]);

  // We are using `react-router` for this example,
  // but feel free to omit this or use the
  // router of your choice.
  //   const location = useLocation();

  // ⚡️ Socket.IO client (init une fois)
  const socketRef = useRef<any>(null);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Reset the error state if we change page
  useEffect(() => {
    if (priv !== '') {
      getConversations();
    }

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
      const convs = conversationsRef.current;
      try {
        // get key
        let conv = convs.some((c) => c.id === msg.conversationId)
          ? convs.find((c) => c.id === msg.conversationId)
          : null;

        if (conv) {
          const privKey = conv.groupKeys.filter(async (group: any) => {
            group.version = msg.keyVersion;
          })[0].privKey;
          const text = await decryptGroupMessage(
            msg.ciphertext,
            msg.nonce,
            privKey
          );

          const decrypted = { ...msg, text };

          setMessages((prev) =>
            prev.some((m) => m.id === decrypted.id)
              ? prev
              : [...prev, decrypted]
          );

          if (
            selectedConvRef.current &&
            selectedConvRef.current.id === msg.conversationId
          ) {
            readConversation(selectedConvRef.current.id);
          } else {
            console.log('plop');

            SetNbMessagesUnread(1, false);
          }

          setConversations((prev) => {
            const exists = prev.some((conv) => conv.id === msg.conversationId);

            if (exists) {
              return prev.map((conv) =>
                conv.id === msg.conversationId
                  ? {
                      ...conv,
                      unreadMessages:
                        (!selectedConvRef.current ||
                          selectedConvRef.current.id !== conv.id) &&
                        msg.senderId !== user.id
                          ? conv.unreadMessages + 1
                          : 0,
                      latestMessage: decrypted, // on ajoute au lieu d'écraser
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
        }

        // add conv if not exist
      } catch (e) {
        console.error('Erreur de déchiffrement temps réel:', e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, priv]);

  async function createConversations(name: string, userIds: string[]) {
    await axiosClient
      .post(`${baseUrl}/conversations`, { name, userIds })
      .then(async (response) => {
        if (Array.isArray(response.data)) {
          for (let group of response.data[0].groupKeys) {
            group.privKey = await decryptGroupKeyFromServer(
              group.ciphertext,
              group.nonce,
              pubSrvKey,
              priv
            );
          }
          setConversations((prev) => {
            const newOnes = response.data.filter(
              ({ id }: any) => !prev.some((e) => e.id === id)
            );

            return [...prev, ...newOnes];
          });
        } else {
          setSelectedConversation(
            conversations.find((c) => c.id === response.data.convId) ?? null
          );
          return;
        }
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
            for (let group of conv.groupKeys) {
              group.privKey = await decryptGroupKeyFromServer(
                group.ciphertext,
                group.nonce,
                pubSrvKey,
                priv
              );
            }
            if (conv.latestMessage) {
              try {
                // get key
                const privKey = conv.groupKeys.filter(async (group: any) => {
                  group.version = conv.latestMessage.keyVersion;
                })[0].privKey;

                const text = await decryptGroupMessage(
                  conv.latestMessage.ciphertext,
                  conv.latestMessage.nonce,
                  privKey
                );

                conv.latestMessage.text = text;
                return conv; // conserve metadata + ajoute texte clair
              } catch (e) {
                console.error('Erreur de déchiffrement:', e);
                conv.latestMessage.text = '[Message illisible]';
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
        let unredMessages = 0;
        for (const conv of response.data) {
          unredMessages += conv.unreadMessages;
        }
        SetNbMessagesUnread(unredMessages, true);
      })
      .catch((errors) => {
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
                const text = await decrypt(conv.messages[0], priv);

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
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function setSelectedConversation(conv: CONVERSATION | null) {
    // Mettre à jour la référence sans déclencher de re-rendu
    selectedConvRef.current = conv;

    // Ne mettre à jour l'état que si la conversation a réellement changé
    if (selectedConv?.id !== conv?.id) {
      setSelectedConv(conv);
    }

    if (conv) {
      // Charger les messages de la conversation
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
        let selectedConv = conversations.find((c) => c.id === id);
        if (selectedConv && selectedConv.unreadMessages > 0) {
          console.log('a');
          console.log(selectedConv.unreadMessages);

          SetNbMessagesUnread(-selectedConv.unreadMessages, false);
        }
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
      const conversationMessages = messages.filter(
        (m) => m.conversationId === convId
      );
      if (conversationMessages.length > 0) {
        const oldestMessage = conversationMessages.reduce((oldest, msg) =>
          new Date(msg.createdAt) < new Date(oldest.createdAt) ? msg : oldest
        );
        url += `&before=${new Date(oldestMessage.createdAt).toISOString()}`;
      }
    }
    await axiosClient
      .get(url)
      .then(async (response) => {
        let decryptedMessages = await Promise.all(
          response.data.map(async (msg: any) => {
            try {
              // get key
              let conv = conversations.some((c) => c.id === msg.conversationId)
                ? conversations.find((c) => c.id === msg.conversationId)
                : null;
              if (conv) {
                const privKey = conv.groupKeys.filter(async (group: any) => {
                  group.version = msg.keyVersion;
                })[0].privKey;

                const text = await decryptGroupMessage(
                  msg.ciphertext,
                  msg.nonce,
                  privKey
                );
                return { ...msg, text }; // conserve metadata + ajoute texte clair
              }
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
    ciphertext: string,
    nonce: string,
    conversationId: number,
    key_version: number
  ) {
    socketRef.current.emit('message:send', {
      sender_id,
      ciphertext,
      nonce,
      conversationId,
      key_version,
    });
  }

  const memoedValue = useMemo(
    () => ({
      messages,
      conversations,
      selectedConv,
      createConversations,
      getConversations,
      setSelectedConversation,
      readConversation,
      getMessages,
      sendMessages,
    }),
    [loading, messages, conversations, selectedConv]
  );

  // Mettre à jour la référence lorsque selectedConv change
  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

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
