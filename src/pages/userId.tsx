import { useAuth } from '@/services/useAuth';
import { useParams } from 'react-router-dom';
import Header from '@/components/users/header';
import {
  Grid,
  Box,
  Card,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { useUsers } from '@/services/useUsers';
import { useEffect } from 'react';
import ImageWithToken from 'react-image-with-auth';
import dayjs from 'dayjs';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const UserId = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { user, posts, getUser, resetUserPosts, getUserPosts, likePost } =
    useUsers();

  dayjs.locale('fr');
  useEffect(() => {
    getUser(id || '0');
    getUserPosts(id || '0');
  }, []);

  useEffect(() => {
    // Cleanup function to reset posts when component unmounts
    return () => {
      resetUserPosts();
    };
  }, []);

  const handleLike = (postId: number, like: boolean) => {
    // Call the API to like/unlike the post
    likePost(postId, like);
  };

  return (
    <div className="overflow-x-auto">
      <Header></Header>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="p-1 sm:p-20 w-full whitespace-pre-line">
            <h1 className="mb-10">Posts</h1>
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                gap: 2,
              }}
            >
              {posts.length > 0 &&
                posts.map((post) => (
                  <Card
                    key={post.id}
                    sx={{
                      maxWidth: 400,
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar aria-label="recipe">
                          {user.avatar ? (
                            <ImageWithToken
                              imageUrl={
                                baseUrl +
                                '/users/' +
                                user.id +
                                '/avatar/' +
                                user.avatar +
                                '?size=200'
                              }
                              token={token}
                              alt="avatar"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // ou 'contain'
                              }}
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
                      title={user.firstname + ' ' + user.lastname}
                      subheader={post.title}
                    />
                    <div
                      style={{
                        aspectRatio: '3 / 2',
                        maxWidth: 400,
                        overflow: 'hidden',
                      }}
                    >
                      <ImageWithToken
                        imageUrl={
                          baseUrl +
                          '/posts/' +
                          post.id +
                          '/images/' +
                          post.image[0] +
                          '?size=500'
                        }
                        token={token}
                        alt="avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover', // ou 'contain'
                        }}
                      />
                    </div>
                    <CardContent className="h-28">
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
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
                      <IconButton aria-label="Commenter">
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
                  </Card>
                ))}
            </Box>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <div className="max-w-3xl m-1 sm:m-20 whitespace-pre-line">
            <h1 className="mb-10 relative">Stats</h1>
            plop
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserId;
