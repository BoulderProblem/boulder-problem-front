import React from 'react';
import { Avatar, Box, Card, CardHeader, Typography } from '@mui/material';

import { COMMENT } from '@/types/comment';
import dayjs from 'dayjs';
import { useAvatar } from '@/hooks/useAvatar';
interface MessageInputProps {
  comment: COMMENT;
  token: string;
}

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const CommentCard: React.FC<MessageInputProps> = ({ comment, token }) => {
  const avatarUrl = useAvatar(
    comment.user.id,
    comment.user.avatar,
    token,
    'user'
  );

  const formatDateComment = (date: string) => {
    const diff = dayjs().diff(dayjs(date), 'minute');
    if (diff < 1) return 'À l’instant';
    if (diff < 60) return `${diff} min`;
    if (diff < 1440) return `${Math.floor(diff / 60)} h`;
    if (diff < 43200) return `${Math.floor(diff / (60 * 24))} j`;
    return dayjs(date).format('D MMM');
  };

  return (
    <Card className="w-full" key={'com-' + comment.id}>
      <CardHeader
        avatar={
          <Avatar
            src={avatarUrl}
            alt="Profile"
            sx={{
              width: 48,
              height: 48,
              border: '3px solid var(--primary-600)',
            }}
          />
        }
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <span
              onClick={() => {
                window.location.href = `/users/${comment.user.id}`;
              }}
            >
              {comment.user.firstname} {comment.user.lastname}
            </span>
            <Typography variant="caption" color="text.secondary">
              {formatDateComment(comment.createdAt)}
            </Typography>
          </Box>
        }
        subheader={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: 'pre-line' }}
          >
            {comment.text}
          </Typography>
        }
      />
    </Card>
  );
};
export default CommentCard;
