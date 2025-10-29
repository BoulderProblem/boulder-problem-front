import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { POST } from '@/types/post';
import dayjs from 'dayjs';
import AuthImageWithSkeleton from '../AuthImageWithSkeleton';
import { useUsers } from '@/services/useUsers';
import MessageInput from './MessageInput';
import CommentCard from './CommentCard';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}
interface PostCardProps {
  token: string;
  post: POST;
}

const PostCard: React.FC<PostCardProps> = ({ post, token }) => {
  const { likePost, getComments, addComment } = useUsers();
  const locale = navigator.language || 'fr';
  const [avatarUrl, setAvatarUrl] = useState(null);
  dayjs.locale(locale);

  useEffect(() => {
    const loadAvatar = async () => {
      if (post.user!.avatar) {
        try {
          const res = await fetch(
            `${baseUrl}/users/${post.user!.id}/avatar/${
              post.user!.avatar
            }?size=100`,
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
  }, [baseUrl, post, token]);

  const handleLike = (postId: number, like: boolean) => {
    // Call the API to like/unlike the post
    likePost(postId, like);
  };

  const handleGetComment = (postId: number) => {
    getComments(postId, 1);
  };

  const handleAddComment = (postId: number, text: string) => {
    // Call the API to add a comment to the post
    addComment(postId, text);
  };

  return (
    <Card
      className="max-w-xl mx-auto w-full"
      sx={{ borderRadius: '12px' }}
      key={post.id}
    >
      <CardHeader
        onClick={() => {
          window.location.href = `/users/${post.user!.id}`;
        }}
        avatar={
          <Avatar
            src={avatarUrl}
            alt="Profile"
            sx={{
              width: 50,
              height: 50,
            }}
          />
        }
        title={post.user!.firstname + ' ' + post.user!.lastname}
        subheader={post.title}
      />
      <div
        style={{
          aspectRatio: '3 / 2',
          // maxWidth: 400,
          overflow: 'hidden',
        }}
      >
        <AuthImageWithSkeleton
          imageUrl={`${baseUrl}/posts/${post.id}/images/${post.image[0]}?size=500`}
          token={token}
          alt="Post image"
        />
      </div>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {post.text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="Like"
          onClick={() => {
            handleLike(post.id, !post.isLike);
          }}
        >
          <FavoriteIcon
            className="mr-3"
            color={post.isLike ? 'error' : 'inherit'}
          />
          {post.likesCount}
        </IconButton>
        <IconButton
          aria-label="Commenter"
          onClick={() => {
            handleGetComment(post.id);
          }}
        >
          <CommentIcon className="mr-3" />
          {post.commentsCount}
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{ marginLeft: 'auto' }}
            variant="body2"
            color="text.secondary"
          >
            {dayjs(post.createdAt).format('dddd D MMMM YYYY')}
          </Typography>
        </Box>
      </CardActions>
      {post.comments && (
        <Box display="contents" width="100%">
          <MessageInput
            onSend={(message) => {
              handleAddComment(post.id, message);
            }}
          />
          {post.comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} token={token} />
          ))}
          {post.haveNextPage && (
            <Button
              sx={{ width: '100%', padding: 2 }}
              onClick={() => {
                getComments(post.id, post.currentPage! + 1);
              }}
            >
              Voir plus de commentaires
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
};

export default PostCard;
