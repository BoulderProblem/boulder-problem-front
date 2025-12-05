// Dans ConversationSettings.tsx
import React from 'react';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import { CONVERSATION } from '@/types/conversation';
import { MESSAGE } from '@/types/message';
import { USER } from '@/types/user';
import { useAvatar } from '@/hooks/useAvatar';

interface ChatMessageProps {
  msg: MESSAGE;
  user: USER | undefined;
  selectedConv: CONVERSATION;
  firstLoad: boolean;
  index: number;
  messages: MESSAGE[];
  token: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  msg,
  user,
  selectedConv,
  firstLoad,
  index,
  messages,
  token,
}) => {
  const nextMsg = messages[index + 1];
  const previousMsg = messages[index - 1];
  const isNextSameSender = nextMsg?.senderId === msg.senderId;
  const isPreviousSameSender = previousMsg?.senderId === msg.senderId;
  const isMine = msg.senderId === user!.id;

  const msgDate = new Date(msg.createdAt).toDateString();
  let showDate = true;
  if (previousMsg) {
    showDate = new Date(previousMsg.createdAt).toDateString() !== msgDate;
  }

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
          justifyContent: msg.senderId === user!.id ? 'flex-end' : 'flex-start',
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
};
