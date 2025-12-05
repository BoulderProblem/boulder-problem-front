// Dans ConversationSettings.tsx
import React, { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CONVERSATION } from '@/types/conversation';
import { ConversationSettings } from './ConversationSettings';
import { useAuth } from '@/services/useAuth';
import { useAvatar } from '@/hooks/useAvatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ConversationHeaderProps {
  selectedConv: CONVERSATION;
  close: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  selectedConv,
  close,
}) => {
  const { user, token } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [anchorElDetails, setAnchorElDetails] =
    React.useState<null | HTMLElement>(null);
  const openDetails = Boolean(anchorElDetails);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md = >= 900px

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

  const handleClickDetails = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElDetails(event.currentTarget);
  };
  const handleCloseDetails = () => {
    setAnchorElDetails(null);
  };

  return (
    <div className="p-4 border-b flex justify-between font-bold ">
      {!isDesktop && (
        <IconButton onClick={close} color="primary" component="span">
          <ArrowBackIcon />
        </IconButton>
      )}
      <Box className="m-auto">{selectName(selectedConv)}</Box>
      <ConversationSettings
        isOpen={isSettingsOpen}
        selectedConv={selectedConv}
        token={token}
        user={user!}
        name={selectName(selectedConv)}
        onClose={() => setIsSettingsOpen(false)}
      />
      <Box className="flex items-center">
        {isDesktop && selectedConv.usersConversation.length > 2 && (
          <AvatarGroup max={4}>
            {selectedConv.usersConversation.map((user) => (
              <GroupAvatar key={user.id} user={user} token={token} />
            ))}
          </AvatarGroup>
        )}
        <IconButton
          onClick={handleClickDetails}
          aria-controls={openDetails ? 'details-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openDetails ? 'true' : undefined}
          className="w-9 h-9"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElDetails}
          id="details-menu"
          open={openDetails}
          onClose={handleCloseDetails}
          onClick={handleCloseDetails}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
              '& .MuiAvatar-root': {
                width: 28,
                height: 28,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 16,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => setIsSettingsOpen(true)}>
            Paramètres
          </MenuItem>

          <MenuItem onClick={() => console.log('quit')}>
            Quitter le groupe
          </MenuItem>
        </Menu>
      </Box>
    </div>
  );
};

function GroupAvatar({ user, token }: { user: any; token: string }) {
  let avatarUrl = useAvatar(
    user.user.id as string,
    user.user.avatar as string,
    token,
    'user'
  );
  return (
    <Avatar
      alt={user.user.firstname}
      src={avatarUrl}
      sx={{ width: 30, height: 30 }}
    />
  );
}
