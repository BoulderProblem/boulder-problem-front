import React from 'react';
import { Avatar, Box, Card, CardHeader, Typography } from '@mui/material';

import AuthImageWithSkeleton from '../AuthImageWithSkeleton';
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
            aria-label="recipe"
            onClick={() => {
              window.location.href = `/users/${comment.user.id}`;
            }}
          >
            {comment.user.avatar ? (
              <AuthImageWithSkeleton
                imageUrl={`${baseUrl}/users/${comment.user.id}/avatar/${comment.user.avatar}?size=200`}
                token={token}
                alt="Post image"
              />
            ) : (
              <svg
                width="48px"
                height="48px"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#494c4e"
                  d="M9 0a9 9 0 0 0-9 9 8.654 8.654 0 0 0 .05.92 9 9 0 0 0 17.9 0A8.654 8.654 0 0 0 18 9a9 9 0 0 0-9-9zm5.42 13.42c-.01 0-.06.08-.07.08a6.975 6.975 0 0 1-10.7 0c-.01 0-.06-.08-.07-.08a.512.512 0 0 1-.09-.27.522.522 0 0 1 .34-.48c.74-.25 1.45-.49 1.65-.54a.16.16 0 0 1 .03-.13.49.49 0 0 1 .43-.36l1.27-.1a2.077 2.077 0 0 0-.19-.79v-.01a2.814 2.814 0 0 0-.45-.78 3.83 3.83 0 0 1-.79-2.38A3.38 3.38 0 0 1 8.88 4h.24a3.38 3.38 0 0 1 3.1 3.58 3.83 3.83 0 0 1-.79 2.38 2.814 2.814 0 0 0-.45.78v.01a2.077 2.077 0 0 0-.19.79l1.27.1a.49.49 0 0 1 .43.36.16.16 0 0 1 .03.13c.2.05.91.29 1.65.54a.49.49 0 0 1 .25.75z"
                />
              </svg>
            )}
          </Avatar>
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
