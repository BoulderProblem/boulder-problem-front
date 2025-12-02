import { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/services/useMessages';
import { useAuth } from '@/services/useAuth';
import { encryptGroupMessage } from '@/crypto';
import { MESSAGE } from '@/types/message';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  TextField,
  Badge,
  Typography,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useUsers } from '@/services/useUsers';
import { CONVERSATION } from '@/types/conversation';
import MessageInput from '@/components/posts/MessageInput';
import { SearchPeopleOption, SearchPeopleTag } from '@/components/searchPeople';
import { USER } from '@/types/user';
import { useAvatar } from '@/hooks/useAvatar';

const Messages = () => {
  const {
    conversations,
    messages,
    selectedConv,
    setSelectedConversation,
    getMessages,
    sendMessages,
    createConversations,
  } = useMessages();
  const { users, getUsers } = useUsers();
  const { user, token } = useAuth();
  const [openConv, setOpenConv] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const containerRefMobile = useRef<HTMLDivElement | null>(null);
  const endRefMobile = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtBottomMobile, setIsAtBottomMobile] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [newConv, setNewConv] = useState<any[]>([]);
  let lastDate = null as string | null;

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [loadingOlder]);

  useEffect(() => {
    if (isAtBottom) {
      endRef.current?.scrollIntoView({ behavior: 'instant' });
      setFirstLoad(false);
    }

    if (isAtBottomMobile) {
      endRefMobile.current?.scrollIntoView({
        behavior: 'instant',
      });
      setFirstLoad(false);
    }
  }, [isAtBottom, isAtBottomMobile, messages]);

  async function sendMessage(newMessage: string) {
    encryptGroupMessage(
      newMessage,
      selectedConv!.groupKeys.filter(async (group: any) => {
        group.version = selectedConv!.keyVersion;
      })[0].privKey
    ).then((response) => {
      sendMessages(
        user!.id,
        response.ciphertext,
        response.nonce,
        selectedConv!.id,
        selectedConv!.keyVersion
      );
    });
  }

  const openModalConv = () => {
    setOpenConv(true);
    fetchPersons('');
    setNewConv([]);
  };

  // Fonction pour effectuer la recherche via l'API
  const fetchPersons = async (query: string) => {
    getUsers(query, 1);
  };

  const setOwner = (dest: any) => {
    setNewConv(dest);
  };

  const createConv = () => {
    createConversations('', [user!.id, ...newConv.map((user: any) => user.id)]);
    handleClose();
  };
  // close modals
  const handleClose = () => {
    setOpenConv(false);
  };

  function selectName(conv: CONVERSATION) {
    if (conv.name !== '') {
      return conv.name;
    } else {
      let title = '';
      conv.usersConversation.forEach((userConv) => {
        if (userConv.userId !== user!.id) {
          if (title !== '') {
            title += ', ';
          }
          title += userConv.user.firstname;
        }
      });
      return title;
    }
  }

  function displayHour(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return `${date.getHours()}h${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else if (isYesterday) {
      return `Hier à ${date.getHours()}h${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')} à ${date.getHours()}h${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    }
  }

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  /**
   * trie les conversations par date de mise à jour (la plus récente en premier)
   */
  const sortedConversations = conversations.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  /**
   * trie les messages par date de mise à jour (la plus ancienne en premier)
   */
  const sortedMessages = messages
    .filter((m) => m.conversationId === selectedConv?.id)
    .sort((a, b) => {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });

  /**
   * gestion du scroll pour le chargement des anciens messages
   * gestion du scroll au début pour scroller en bas
   * @returns
   */
  const handleScroll = async () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // bas
    const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(nearBottom);

    // haut
    if (scrollTop === 0 && !loadingOlder) {
      setLoadingOlder(true);

      const oldScrollHeight = containerRef.current.scrollHeight;

      await getMessages(selectedConv!.id, true);
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - oldScrollHeight;
        }
      });

      setLoadingOlder(false);
    }
  };

  /**
   * gestion du scroll pour le chargement des anciens messages
   * gestion du scroll au début pour scroller en bas
   * @returns
   */
  const handleScrollMobile = async () => {
    if (!containerRefMobile.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      containerRefMobile.current;

    // bas
    const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottomMobile(nearBottom);

    // haut
    if (scrollTop === 0 && !loadingOlder) {
      setLoadingOlder(true);

      const oldScrollHeight = containerRefMobile.current.scrollHeight;

      await getMessages(selectedConv!.id, true);
      requestAnimationFrame(() => {
        if (containerRefMobile.current) {
          const newScrollHeight = containerRefMobile.current.scrollHeight;
          containerRefMobile.current.scrollTop =
            newScrollHeight - oldScrollHeight;
        }
      });

      setLoadingOlder(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Desktop layout */}
      <div className="hidden md:flex w-full">
        {/* Conversations */}
        <div className="w-1/3 border-r">
          <h2 className="p-4 font-bold text-lg relative">
            Conversations
            <div className="absolute right-3 top-2">
              <LightTooltip title="Créer une conversation">
                <IconButton
                  onClick={() => openModalConv()}
                  color="primary"
                  component="span"
                >
                  <AddIcon />
                </IconButton>
              </LightTooltip>
            </div>
          </h2>
          <ul>
            {sortedConversations.map((c) => (
              <li
                key={c.id}
                onClick={() => {
                  if (!selectedConv || c.id !== selectedConv.id) {
                    setFirstLoad(true);
                    setIsAtBottom(true);
                    setSelectedConversation(c);
                  }
                }}
                className={`p-4 cursor-pointer hover:bg-primary-500 ${
                  selectedConv?.id === c.id ? 'bg-primary-400' : ''
                }`}
              >
                <div className="relative">
                  <p className="font-medium">{selectName(c)}</p>
                  <div className="flex justify-between items-center p-2">
                    <span className="text-left font-medium">
                      {c.latestMessage
                        ? c.latestMessage.text
                        : 'Pas de message'}
                    </span>
                    <span className="text-right ">
                      {displayHour(c.updatedAt)}
                    </span>
                  </div>
                  <div className="absolute -top-2 right-2">
                    <Badge
                      color="primary"
                      badgeContent={c.unreadMessages}
                    ></Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Messages */}
        <div className="relative flex-1 flex flex-col h-full bg-base-200">
          {selectedConv ? (
            <>
              <div className="p-4 border-b font-bold">
                {selectName(selectedConv)}
              </div>
              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-2"
              >
                {Array.isArray(messages) &&
                  sortedMessages.map((msg: MESSAGE, index: number) => (
                    <ChatMessages
                      key={msg.id}
                      msg={msg}
                      user={user}
                      selectedConv={selectedConv}
                      firstLoad={firstLoad}
                      index={index}
                      messages={sortedMessages}
                    />
                  ))}
                <div ref={endRef} />
              </div>
              <MessageInput
                onSend={(message) => {
                  sendMessage(message);
                }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Sélectionne une conversation →
            </div>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex w-full h-full md:hidden">
        {!selectedConv ? (
          // Conversations
          <div className="flex-1 bg-base-300">
            <h2 className="p-4 font-bold text-lg">Conversations</h2>
            <ul>
              {conversations.map((c) => (
                <li
                  key={c.id}
                  onClick={() => {
                    setFirstLoad(true);
                    setIsAtBottom(true);
                    setSelectedConversation(c);
                  }}
                  className="p-4 border-b border-gray-600 cursor-pointer hover:bg-base-300"
                >
                  <div className="relative">
                    <p className="font-medium">{selectName(c)}</p>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-left font-medium">
                        {c.latestMessage
                          ? c.latestMessage.text
                          : 'Pas de message'}
                      </span>
                      <span className="text-right text-gray-500">
                        {displayHour(c.updatedAt)}
                      </span>
                    </div>
                    <div className="absolute -top-2 right-2">
                      <Badge
                        color="primary"
                        badgeContent={c.unreadMessages}
                      ></Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Messages
          <div className="flex-1 flex flex-col h-full overflow-scroll">
            <div className="p-4 border-b flex items-center">
              <button
                onClick={() => {
                  setFirstLoad(true);
                  setIsAtBottom(true);
                  setSelectedConversation(null);
                }}
                className="mr-2 text-blue-500"
              >
                ←
              </button>
              <span className="font-bold">{selectName(selectedConv)}</span>
            </div>
            <div
              ref={containerRefMobile}
              onScroll={handleScrollMobile}
              className="flex-1 overflow-y-auto p-4 space-y-2"
            >
              {Array.isArray(messages) &&
                sortedMessages.map((msg: MESSAGE, index: number) => (
                  <ChatMessages
                    key={msg.id}
                    msg={msg}
                    user={user}
                    selectedConv={selectedConv}
                    firstLoad={firstLoad}
                    index={index}
                    messages={sortedMessages}
                  />
                ))}
              <div ref={endRefMobile} />
            </div>
            <MessageInput
              onSend={(message) => {
                sendMessage(message);
              }}
            />
          </div>
        )}
      </div>
      <Dialog
        open={openConv}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: '600px',
            maxWidth: '90%',
          },
          className: 'dark:bg-zinc-700 relative',
        }}
      >
        <DialogTitle>Ajoutez des destinataires</DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
            multiple
            onChange={(_event: any, newValue: any) => {
              setOwner(newValue);
            }}
            id="controllable-states-demo"
            options={
              users
                ? users.data.filter((dest: any) => dest.id !== user!.id)
                : []
            }
            getOptionLabel={(option: any) =>
              option.firstname + ' ' + option.lastname || ''
            }
            getOptionKey={(option: any) => option.id}
            onInputChange={(event, newInputValue) => {
              if (event && !event.cancelable) fetchPersons(newInputValue);
            }}
            disabled={user && user.roleId === 2}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <SearchPeopleOption
                  user={option}
                  token={token}
                  key={option.id}
                  mb={0}
                />
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option) => (
                <SearchPeopleTag
                  user={option}
                  token={token}
                  getTagProps={getTagProps}
                  key={option.id}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destinataire"
                variant="standard"
                className="p-2.5"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button className="btn" onClick={createConv}>
            Créer
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );

  function ChatMessages({
    msg,
    user,
    selectedConv,
    firstLoad,
    index,
    messages,
  }: {
    msg: MESSAGE;
    user: USER | undefined;
    selectedConv: CONVERSATION;
    firstLoad: boolean;
    index: number;
    messages: MESSAGE[];
  }) {
    const msgDate = new Date(msg.createdAt).toDateString();
    const showDate = lastDate !== msgDate;
    lastDate = msgDate;

    const nextMsg = messages[index + 1];
    const previousMsg = messages[index - 1];
    const isNextSameSender = nextMsg?.senderId === msg.senderId;
    const isPreviousSameSender = previousMsg?.senderId === msg.senderId;
    const isMine = msg.senderId === user!.id;

    let avatarUrl = '';

    if (selectedConv.usersConversation.length > 2) {
      avatarUrl = useAvatar(
        selectedConv.usersConversation.find((uc) => uc.userId === msg.senderId)
          ?.user.id as string,
        selectedConv.usersConversation.find((uc) => uc.userId === msg.senderId)
          ?.user.avatar as string,
        token,
        'user'
      );
    }

    return (
      <Box>
        {showDate && (
          <Divider>
            <Typography>
              {new Date(msg.createdAt).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Divider>
        )}
        <Box
          key={msg.id}
          sx={{
            display: 'flex',
            justifyContent:
              msg.senderId === user!.id ? 'flex-end' : 'flex-start',
            mb: 1,
          }}
        >
          {selectedConv.usersConversation.length > 2 &&
            msg.senderId !== user!.id && (
              <Avatar sx={{ width: 32, height: 32, mr: 1 }} src={avatarUrl} />
            )}
          <Box
            className={`p-2 rounded-2xl max-w-[70%] whitespace-pre-line ${
              firstLoad ? 'opacity-0' : 'opacity-100'
            } ${
              msg.senderId === user!.id
                ? 'bg-blue-500 text-white self-end ml-auto pl-4'
                : 'bg-gray-200 text-black pr-4'
            }
            ${isPreviousSameSender && !showDate && isMine && 'rounded-se-sm'}
            ${isNextSameSender && isMine && 'rounded-ee-sm'}
            ${isPreviousSameSender && !showDate && !isMine && 'rounded-ss-sm'}
            ${isNextSameSender && !isMine && 'rounded-es-sm'}`}
          >
            {selectedConv.usersConversation.length > 2 &&
              (!isPreviousSameSender || showDate) && (
                <Typography variant="body2" fontWeight="bold" mb={0.5}>
                  {
                    selectedConv.usersConversation.find(
                      (uc) => uc.userId === msg.senderId
                    )?.user.firstname
                  }
                </Typography>
              )}
            <Typography variant="body1">{msg.text}</Typography>
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}
            >
              {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
};

export default Messages;
