// Dans ConversationSettings.tsx
import React from 'react';
import { Avatar, Badge, Box } from '@mui/material';
import { CONVERSATION } from '@/types/conversation';
import { USER } from '@/types/user';
import { useAvatar } from '@/hooks/useAvatar';
import GroupIcon from '@mui/icons-material/Group';

interface ConversationListProps {
  conv: CONVERSATION;
  selectedConv: CONVERSATION | null;
  setSelectedConversation: (conv: CONVERSATION | null) => void;
  setFirstLoad: (load: boolean) => void;
  setIsAtBottom: (bottom: boolean) => void;
  token: string;
  user: USER;
  name: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conv,
  selectedConv,
  setSelectedConversation,
  setFirstLoad,
  setIsAtBottom,
  token,
  user,
  name,
}) => {
  let avatar = '';
  if (conv.usersConversation.length <= 2) {
    let userAvatar = conv.usersConversation.find(
      (uc) => uc.userId !== user!.id
    )?.user;
    avatar = useAvatar(
      userAvatar?.id as string,
      userAvatar?.avatar as string,
      token,
      'user'
    );
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

  return (
    <Box
      key={conv.id}
      onClick={() => {
        if (!selectedConv || conv.id !== selectedConv.id) {
          setFirstLoad(true);
          setIsAtBottom(true);
          setSelectedConversation(conv);
        }
      }}
      sx={{
        display: 'flex',
      }}
      className={`p-4 cursor-pointer hover:bg-primary-500 ${
        selectedConv?.id === conv.id ? 'bg-primary-400' : ''
      }`}
    >
      <Avatar src={avatar}>
        {conv.usersConversation.length > 2 && <GroupIcon />}
      </Avatar>
      <div className="relative ml-4 w-full">
        <div className="flex justify-between items-center p-2">
          <p className="font-medium">{name}</p>
          <span className="text-right ">{displayHour(conv.updatedAt)}</span>
        </div>
        <span
          className="text-left font-medium"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {conv.latestMessage ? conv.latestMessage.text : 'Pas de message'}
        </span>
        <div className="absolute -top-2 right-2">
          <Badge color="primary" badgeContent={conv.unreadMessages}></Badge>
        </div>
      </div>
    </Box>
  );
};
