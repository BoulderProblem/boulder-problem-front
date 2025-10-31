import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

import { useAvatar } from '@/hooks/useAvatar';
import { USER } from '@/types/user';
interface MessageInputProps {
  user: USER;
  token: string;
}

const Profile: React.FC<MessageInputProps> = ({ user, token }) => {
  const avatarUrl = useAvatar(user.id, user.avatar, token, 'user');

  return (
    <Box className="flex items-center space-x-4 mb-2">
      <Avatar
        src={avatarUrl}
        alt="Profile"
        sx={{
          width: 72,
          height: 72,
          border: '3px solid var(--primary-600)',
        }}
      />
      <Box>
        <Typography variant="h6" className="text-primary-600" fontWeight="bold">
          {user.firstname} {user.lastname}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.nbFollower || '0'} Followers - {user.nbFollowing || '0'}{' '}
          Following
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.nbPost || '0'} Posts
        </Typography>
      </Box>
    </Box>
  );
};
export default Profile;
