import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useAvatar } from '@/hooks/useAvatar';
import { PLACE } from '@/types/place';
interface MessageInputProps {
  place: PLACE;
  token: string;
}

const Profile: React.FC<MessageInputProps> = ({ place, token }) => {
  const avatarUrl = useAvatar(place.id.toString(), '', token, 'place');

  return (
    <Box>
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
        <Typography
          variant="h5"
          className="text-primary-600"
          sx={{ marginBottom: 1 }}
          fontWeight="bold"
        >
          {place.name}
        </Typography>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        {place.address && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: 1 }}
          >
            Adresse : {place.address}
          </Typography>
        )}
        {place.phone && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: 1 }}
          >
            Téléphone : {place.phone}
          </Typography>
        )}
        {place.website && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: 1 }}
            onClick={() => window.open(place.website)}
          >
            Site web : {place.website}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default Profile;
