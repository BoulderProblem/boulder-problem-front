import React, { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardHeader, Typography } from '@mui/material';

import { COMMENT } from '@/types/comment';
import dayjs from 'dayjs';
interface MessageInputProps {
  comment: COMMENT;
  token: string;
}

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const CommentCard: React.FC<MessageInputProps> = ({ comment, token }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const loadAvatar = async () => {
      if (comment && comment.user.avatar) {
        try {
          const res = await fetch(
            `${baseUrl}/users/${comment.user.id}/avatar/${comment.user.avatar}?size=100`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!res.ok) throw new Error('Erreur chargement avatar');

          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          setAvatarUrl(objectUrl);

          // nettoyage pour éviter les fuites mémoire
          return () => URL.revokeObjectURL(objectUrl);
        } catch (err) {
          console.error(err);
        }
      }
    };

    loadAvatar();
  }, [baseUrl, comment, token]);

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
        subheader={comment.text}
      />
    </Card>
  );
};
export default CommentCard;
