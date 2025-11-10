import { useAuth } from '@/services/useAuth';
import { useParams } from 'react-router-dom';
import Header from '@/components/users/header';
import { Box, Tab, Tabs } from '@mui/material';
import { useUsers } from '@/services/useUsers';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import PostCard from '@/components/posts/PostCard';

const UserId = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { user, posts, getUser, resetUserPosts, getUserPosts } = useUsers();
  const [tabIndex, setTabIndex] = useState(0);

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

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Contenus des onglets
  const tabContents = [
    {
      label: <div>Posts</div>,
      content: (
        <div className="p-1 sm:p-20 w-full whitespace-pre-line">
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(min(450px, 100%), 1fr))',
              gap: 1,
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
                  />
                ))}
          </Box>
        </div>
      ),
    },
    {
      label: <div>Stats</div>,
      content: (
        <div className="max-w-3xl m-1 sm:m-20 whitespace-pre-line">plop</div>
      ),
    },
  ];
  return (
    <div className="overflow-x-auto h-screen">
      <Header></Header>
      <Box className="max-w-5xl mx-auto w-full">
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant={'fullWidth'}
          className="bg-base-100"
          sx={{
            '& .MuiTab-root': {
              minWidth: 0,
              padding: '6px 8px',
              fontSize: '0.8rem', // plus petit texte
            },
          }}
          aria-label="Onglets mobile"
        >
          {tabContents.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ p: 2, mt: 2 }}>{tabContents[tabIndex].content}</Box>
      </Box>
    </div>
  );
};

export default UserId;
