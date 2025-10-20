import { useAuth } from '@/services/useAuth';
import { useParams } from 'react-router-dom';
import Header from '@/components/users/header';
import { Grid, Box } from '@mui/material';
import { useUsers } from '@/services/useUsers';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import PostCard from '@/components/posts/PostCard';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const UserId = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { user, posts, getUser, resetUserPosts, getUserPosts, likePost } =
    useUsers();

  const locale = navigator.language || 'fr';
  dayjs.locale(locale);
  useEffect(() => {
    getUser(id || '0').then(() => {
      getUserPosts(id || '0');
    });
  }, []);

  useEffect(() => {
    // Cleanup function to reset posts when component unmounts
    return () => {
      resetUserPosts();
    };
  }, []);

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
              {user &&
                posts.length > 0 &&
                posts
                  .map((post) => ({
                    ...post,
                    user: {
                      id: user.id,
                      firstname: user.firstname,
                      lastname: user.lastname,
                      avatar: user.avatar,
                    },
                  }))
                  .map((postWithUser) => (
                    <PostCard
                      key={postWithUser.id}
                      post={postWithUser}
                      token={token}
                      likePost={likePost}
                    />
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
