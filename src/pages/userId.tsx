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
  const { posts, getUserPosts, likePost } = useUsers();

  dayjs.locale('fr');
  useEffect(() => {
    getUserPosts(id || '0');
  }, []);

  const handleLike = (postId: number, like: boolean) => {
    // Call the API to like/unlike the post
    likePost(postId, like).then(() => {
      getUserPosts(id || '0');
    });
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
              {posts &&
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
                          <ImageWithToken
                            imageUrl={
                              baseUrl +
                              '/users/' +
                              post.user!.id +
                              '/avatar/' +
                              post.user!.avatar +
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
                        </Avatar>
                      }
                      title={post.user!.firstname + ' ' + post.user!.lastname}
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
                          '/image/' +
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
