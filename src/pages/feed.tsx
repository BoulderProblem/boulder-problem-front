import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/services/useAuth';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';

const Feed = () => {
  const {
    finished,
    loading,
    token,
    feed,
    setFinished,
    getFeed,
    resetFeed,
    likePost,
  } = useAuth();
  const lastElementRef = useRef(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    getFeed(1);

    return () => {
      resetFeed();
    };
  }, []);

  useEffect(() => {
    if (loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading]);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - 100 < e.target.clientHeight;
    if (bottom && !loading) {
      getFeed();
    }
  };

  return (
    <div
      className=" h-full overflow-scroll"
      onScroll={handleScroll}
      ref={lastElementRef}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill) minmax(100%, 1fr)',
          gap: 2,
        }}
      >
        {feed &&
          feed.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              token={token}
              likePost={likePost}
            />
          ))}
        {finished && (
          <p className="text-center">
            Vous n'avez pas d'autres posts à afficher
          </p>
        )}
        {loading && (
          <p className="text-center" ref={messagesEndRef}>
            <CircularProgress />
            Chargement...
          </p>
        )}
      </Box>
    </div>
  );
};

export default Feed;
