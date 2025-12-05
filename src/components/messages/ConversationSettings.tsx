import React from 'react';
import { Drawer, Box, IconButton, Avatar, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import { CONVERSATION } from '@/types/conversation';
import { USER } from '@/types/user';
import { useAvatar } from '@/hooks/useAvatar';
import { useLocation } from 'react-router';

interface ConversationSettingsProps {
  isOpen: boolean;
  selectedConv: CONVERSATION | null;
  token: string;
  user: USER | null;
  name: string;
  onClose: () => void;
}

// Composant séparé pour l'avatar
const UserAvatar = React.memo(
  ({ user, token }: { user: any; token: string }) => {
    const avatarUrl = useAvatar(
      user?.user?.id || '',
      user?.user?.avatar || '',
      token,
      'user'
    );
    return <Avatar alt={user?.user?.firstname} src={avatarUrl} />;
  }
);

export const ConversationSettings: React.FC<ConversationSettingsProps> = ({
  isOpen,
  selectedConv,
  token,
  user,
  name,
  onClose,
}) => {
  if (!user || !selectedConv) {
    return null;
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '400px' },
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          mt: useLocation().pathname.includes('iframe') ? '0' : '64px',
          height: useLocation().pathname.includes('iframe')
            ? '100%'
            : 'calc(100% - 64px)',
        },
      }}
    >
      <Box sx={{ p: 2, position: 'relative' }}>
        <Box className="flex justify-between">
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', left: 8, top: 8 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className="m-auto text-lg">Paramètres</Box>
        </Box>

        <Box className="flex flex-col items-center mt-10">
          {selectedConv.usersConversation.length <= 2 ? (
            <UserAvatar
              user={selectedConv.usersConversation.find(
                (uc) => uc.userId !== user.id
              )}
              token={token}
            />
          ) : (
            <Avatar sx={{ width: 100, height: 100 }}>
              <GroupIcon fontSize="large" />
            </Avatar>
          )}

          <Box sx={{ mt: 4, mb: 2 }}>{name}</Box>
          <Divider className="w-full" />

          {selectedConv.usersConversation.length > 2 && (
            <Box className="w-full mt-4">
              <Box className="w-full text-lg text-center mb-4">Membres</Box>
              {selectedConv.usersConversation.map((member) => (
                <Box key={member.id} className="flex items-center mb-4 px-4">
                  <UserAvatar user={member} token={token} />
                  <Box className="ml-4">
                    <Box>
                      {member.user.firstname} {member.user.lastname}
                    </Box>
                    <Box className="text-sm text-gray-500">{member.role}</Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
