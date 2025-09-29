import { useEffect, useState } from 'react';
import { useMessages } from '@/services/useMessages';
import { useAuth } from '@/services/useAuth';
import { encryptForRecipient } from '@/crypto';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useUsers } from '@/services/useUsers';
import { CONVERSATION } from '@/types/conversation';
import ImageWithToken from 'react-image-with-auth';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Messages = () => {
  const {
    conversations,
    messages,
    getMessages,
    sendMessages,
    createConversations,
    getConversations,
  } = useMessages();
  const { users, getUsers } = useUsers();
  const { user, priv } = useAuth();
  const [selectedConv, setSelectedConv] = useState<CONVERSATION | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [openConv, setOpenConv] = useState(false);

  useEffect(() => {
    getConversations(false);
  }, [selectedConv]);

  async function sendMessage() {
    if (newMessage.length > 0) {
      selectedConv?.usersConversation.forEach((userConv) => {
        if (userConv.userId !== user!.id) {
          setNewMessage('');
          encryptForRecipient(newMessage, priv, userConv.user.publicKey).then(
            (response) => {
              sendMessages(
                user?.id,
                userConv.userId,
                response.ciphertext,
                response.nonce,
                response.sender_pub,
                response.recipient_pub,
                selectedConv!.id
              );
            }
          );
        }
      });
    }
  }

  const openModalConv = () => {
    setOpenConv(true);
  };

  // Fonction pour effectuer la recherche via l'API
  const fetchPersons = async (query: string) => {
    getUsers(query, 1);
  };

  const setOwner = (dest: any) => {
    console.log(dest);
    // create conversation
    createConversations('', [user!.id, dest.id]);
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
      return `Aujourd'hui à ${date.getHours()}h${date
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
            {conversations.map((c) => (
              <li
                key={c.id}
                onClick={() => {
                  setSelectedConv(c), getMessages(c.id.toString());
                }}
                className={`p-4 cursor-pointer hover:bg-base-300 ${
                  selectedConv?.id === c.id ? 'hover:bg-base-300' : ''
                }`}
              >
                <p className="font-medium">{selectName(c)}</p>
                <div className="flex justify-between items-center p-2">
                  <span className="text-left font-medium">
                    {c.messages[0] ? c.messages[0].text : 'Pas de message'}
                  </span>
                  <span className="text-right text-gray-500">
                    {displayHour(c.updatedAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              <div className="p-4 border-b font-bold">
                {selectName(selectedConv)}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {Array.isArray(messages) &&
                  messages
                    .filter((m) => m.conversationId === selectedConv.id)
                    .map((m: MESSAGE) => (
                      <div
                        key={m.id}
                        className={`p-2 rounded-lg max-w-xs ${
                          m.senderPub === user!.publicKey
                            ? 'bg-blue-500 text-white self-end ml-auto'
                            : 'bg-gray-200 text-black'
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
              </div>
              <div className="p-4 border-t flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // évite le saut de ligne
                      sendMessage();
                    }
                  }}
                  className="flex-1 border rounded-lg px-3 py-2 mr-2"
                  placeholder="Écrire un message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Envoyer
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Sélectionne une conversation →
            </div>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex w-full md:hidden">
        {!selectedConv ? (
          // Conversations
          <div className="flex-1 bg-base-300">
            <h2 className="p-4 font-bold text-lg">Conversations</h2>
            <ul>
              {conversations.map((c) => (
                <li
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  className="p-4 border-b cursor-pointer hover:bg-base-300"
                >
                  <p className="font-medium">{selectName(c)}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {c.messages[0] ? c.messages[0].text : 'Pas de message'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Messages
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b flex items-center">
              <button
                onClick={() => setSelectedConv(null)}
                className="mr-2 text-blue-500"
              >
                ←
              </button>
              <span className="font-bold">{selectName(selectedConv)}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {Array.isArray(messages) &&
                messages.map((m: MESSAGE) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded-lg max-w-xs ${
                      m.senderPub === user!.publicKey
                        ? 'bg-blue-500 text-white self-end ml-auto'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 mr-2"
                placeholder="Écrire un message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Envoyer
              </button>
            </div>
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
        <DialogTitle>Choisissez un destinataire</DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Gérant"
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
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Messages;
