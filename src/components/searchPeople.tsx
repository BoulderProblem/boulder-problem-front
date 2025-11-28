import React from 'react';
import { Avatar, Box, Chip } from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';
import { USER } from '@/types/user';
interface SearchPeopleOptionProps {
  user: USER;
  token: string;
  mb?: number;
}

export const SearchPeopleOption: React.FC<SearchPeopleOptionProps> = ({
  user,
  token,
  mb,
}) => {
  const avatarUrl = useAvatar(user.id, user.avatar, token, 'user');

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={0.5}
      marginRight={2}
      marginBottom={mb}
    >
      <Avatar src={avatarUrl} sx={{ width: 24, height: 24 }} />
      {user.firstname} {user.lastname}
    </Box>
  );
};

interface SearchPeopleTagsProps {
  user: USER;
  token: string;
  getTagProps?: any;
}

export const SearchPeopleTag: React.FC<SearchPeopleTagsProps> = ({
  user,
  token,
  getTagProps,
}) => {
  const avatarUrl = useAvatar(user.id, user.avatar, token, 'user');

  return (
    <Chip
      {...getTagProps({ user })}
      key={user.id}
      avatar={<Avatar src={avatarUrl} />}
      label={`${user.firstname} ${user.lastname}`}
    />
  );
};
