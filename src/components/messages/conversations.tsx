import React, { useEffect, useRef, useState } from 'react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import {
  Drawer,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  DialogActions,
} from '@mui/material';
import { useMessages } from '@/services/useMessages';
import { useUsers } from '@/services/useUsers';
import { useAuth } from '@/services/useAuth';
import { encryptGroupMessage } from '@/crypto';
import { CONVERSATION } from '@/types/conversation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { ConversationList } from './ConversationList';
import { ConversationHeader } from './ConversationHeader';
import { ChatMessage } from './ChatMessages';
import { MESSAGE } from '@/types/message';
import MessageInput from '../posts/MessageInput';
import { SearchPeopleOption, SearchPeopleTag } from '../searchPeople';
import { useLocation } from 'react-router';

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

export const Conversations = () => {
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

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md = >= 900px

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
          <h2 className="p-4 font-bold text-lg relative border-b border-gray-300">
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
            {sortedConversations.map((conv) => (
              <ConversationList
                key={conv.id}
                conv={conv}
                selectedConv={selectedConv}
                setSelectedConversation={setSelectedConversation}
                setFirstLoad={setFirstLoad}
                setIsAtBottom={setIsAtBottom}
                token={token}
                user={user!}
                name={selectName(conv)}
              />
            ))}
          </ul>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col h-full bg-base-200">
          {selectedConv ? (
            <>
              <ConversationHeader
                selectedConv={selectedConv}
                close={() => setSelectedConversation(null)}
              />
              <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-2"
              >
                {Array.isArray(messages) &&
                  sortedMessages.map((msg: MESSAGE, index: number) => (
                    <ChatMessage
                      key={msg.id}
                      msg={msg}
                      user={user}
                      selectedConv={selectedConv}
                      firstLoad={firstLoad}
                      index={index}
                      messages={sortedMessages}
                      token={token}
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
        <div className="flex-1 bg-base-300">
          <h2 className="p-4 font-bold relative text-lg">
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
            {sortedConversations.map((conv) => (
              <ConversationList
                key={conv.id}
                conv={conv}
                selectedConv={selectedConv}
                setSelectedConversation={setSelectedConversation}
                setFirstLoad={setFirstLoad}
                setIsAtBottom={setIsAtBottom}
                token={token}
                user={user!}
                name={selectName(conv)}
              />
            ))}
          </ul>
        </div>
        <Drawer
          anchor="right"
          open={selectedConv !== null && !isDesktop}
          onClose={() => setSelectedConversation(null)}
          sx={{
            '& .MuiDrawer-paper': {
              position: 'absolute',
              right: 0,
              width: { xs: '100%', sm: '400px' },
              height: useLocation().pathname.includes('iframe')
                ? '100%'
                : 'calc(100% - 64px)',
              mt: useLocation().pathname.includes('iframe') ? '0' : '64px',
              backgroundColor: 'background.default',
              boxShadow: 'none',
              '--Paper-overlay': 'none !important',
            },
            '& .MuiBackdrop-root': {
              display: 'none', // Désactive complètement le backdrop
            },
          }}
        >
          {selectedConv && (
            <Box style={{ height: 'inherit' }}>
              <ConversationHeader
                selectedConv={selectedConv}
                close={() => setSelectedConversation(null)}
              />

              <div
                ref={containerRefMobile}
                onScroll={handleScrollMobile}
                style={{
                  height: useLocation().pathname.includes('iframe')
                    ? 'calc(100% - 134px)'
                    : 'inherit',
                }}
                className="flex-1 overflow-y-auto p-4 space-y-2"
              >
                {Array.isArray(messages) &&
                  sortedMessages.map((msg: MESSAGE, index: number) => (
                    <ChatMessage
                      key={msg.id}
                      msg={msg}
                      user={user}
                      selectedConv={selectedConv}
                      firstLoad={firstLoad}
                      index={index}
                      messages={sortedMessages}
                      token={token}
                    />
                  ))}
                <div ref={endRefMobile} />
              </div>
              <MessageInput
                onSend={(message) => {
                  sendMessage(message);
                }}
              />
            </Box>
          )}
        </Drawer>
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
};
