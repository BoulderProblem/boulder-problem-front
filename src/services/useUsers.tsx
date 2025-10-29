import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axiosClient from '../axios-client';
import { POST } from '@/types/post';
import { get } from 'http';
import { useAuth } from './useAuth';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

interface UsersContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  users: any;
  user: any;
  posts: POST[];
  loading: boolean;
  loadingComment: boolean;
  error?: any;
  feed: POST[];
  finished: boolean;
  getUsers: (search: string, page: number | string) => Promise<any>;
  getUser: (id: string) => Promise<any>;
  followUser: (id: string, follow: boolean) => Promise<any>;
  resetUserPosts: () => Promise<any>;
  getUserPosts: (id: string) => Promise<any>;
  likePost: (id: number, like: boolean) => Promise<any>;
  updateUser: (id: string, params: any) => Promise<any>;
  deleteUser: (id: string) => void;
  setFinished: (finished: boolean) => void;
  getFeed: (getpage?: number) => void;
  resetFeed: () => void;
  getComments: (id: number, getpage: number) => Promise<any>;
  addComment: (id: number, text: string) => Promise<any>;
}

const UsersContext = createContext<UsersContextType>({} as UsersContextType);

// Export the provider as we need to wrap the entire app with it
export function UsersProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<any>();
  const [posts, setPosts] = useState<POST[]>([]);
  const [user, setUser] = useState<any>();
  const [feed, setFeed] = useState<POST[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  // We are using `react-router` for this example,
  // but feel free to omit this or use the
  // router of your choice.
  //   const location = useLocation();

  // Reset the error state if we change page
  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    // set color and difficulty
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  async function getUsers(search: string, page: number | string) {
    setLoading(true);
    await axiosClient
      .get(`${baseUrl}/users?search=${search}&page=${page}`)
      .then((response) => {
        if (
          response.data.data.length === 0 &&
          response.data.meta.currentPage !== 1
        ) {
          getUsers(search, response.data.meta.lastPage);
        } else {
          setUsers(response.data);
        }
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return;
  }

  async function getUser(id: number | string) {
    setLoading(true);
    let user;
    await axiosClient
      .get(`${baseUrl}/users/${id}`)
      .then((response) => {
        setUser(response.data);
        user = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return user;
  }

  async function resetUserPosts() {
    setPosts([]);
  }

  async function getUserPosts(id: number | string) {
    setLoading(true);
    await axiosClient
      .get(`${baseUrl}/users/${id}/posts`)
      .then((response) => {
        setPosts((prevPosts) => {
          const allPosts = [...prevPosts, ...response.data.data];

          return allPosts.filter(
            (post, index, self) =>
              index === self.findIndex((p) => p.id === post.id)
          );
        });
      })
      .catch((errors) => {
        console.log(errors);
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function likePost(id: number, like: boolean) {
    await axiosClient
      .post(`${baseUrl}/posts/${id}/like`, { like: like })
      .then((result) => {
        setPosts((prev) => {
          return prev.map((post) =>
            post.id === id
              ? {
                  ...post,
                  isLike: result.data.isLike,
                  likesCount: result.data.likesCount,
                }
              : post
          );
        });
        setFeed((prev) => {
          return prev.map((post) =>
            post.id === id
              ? {
                  ...post,
                  isLike: result.data.isLike,
                  likesCount: result.data.likesCount,
                }
              : post
          );
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function getComments(id: number, getpage: number) {
    setLoadingComment(true);
    await axiosClient
      .get(`${baseUrl}/posts/${id}/comments?page=${getpage}`)
      .then((response) => {
        const newComments = response.data.data;
        const haveNextPage = response.data.meta.lastPage > getpage;
        setPosts((prev) => {
          return prev.map((post) => {
            if (post.id !== id) return post;

            const existing = post.comments || [];
            const merged = [...existing, ...newComments].filter(
              (comment, index, self) =>
                index === self.findIndex((c) => c.id === comment.id)
            );

            return {
              ...post,
              comments: merged,
              haveNextPage,
              currentPage: getpage,
            };
          });
        });

        setFeed((prev) => {
          return prev.map((post) => {
            if (post.id !== id) return post;

            const existing = post.comments || [];
            const merged = [...existing, ...newComments].filter(
              (comment, index, self) =>
                index === self.findIndex((c) => c.id === comment.id)
            );

            return {
              ...post,
              comments: merged,
              haveNextPage,
              currentPage: getpage,
            };
          });
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoadingComment(false));
  }

  async function addComment(id: number, text: string) {
    await axiosClient
      .post(`${baseUrl}/posts/${id}/comments`, { text: text })
      .then((result) => {
        result.data.user = {
          avatar: me!.avatar,
          firstname: me!.firstname,
          id: me!.id,
          lastname: me!.lastname,
        };

        let newComment = [result.data];
        setPosts((prev) => {
          return prev.map((post) => {
            if (post.id !== id) return post;

            const existing = post.comments || [];
            const merged = [...newComment, ...existing].filter(
              (comment, index, self) =>
                index === self.findIndex((c) => c.id === comment.id)
            );

            return {
              ...post,
              commentsCount: post.commentsCount! + 1,
              comments: merged,
            };
          });
        });

        setFeed((prev) => {
          return prev.map((post) => {
            if (post.id !== id) return post;

            const existing = post.comments || [];
            const merged = [...newComment, ...existing].filter(
              (comment, index, self) =>
                index === self.findIndex((c) => c.id === comment.id)
            );

            return {
              ...post,
              commentsCount: post.commentsCount! + 1,
              comments: merged,
            };
          });
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => {});
  }

  async function updateUser(id: string, params: any) {
    let user;
    setLoading(true);
    await axiosClient
      .put(`${baseUrl}/users/${id}`, params)
      .then((response) => {
        setUser(response.data);
        user = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return user;
  }

  function followUser(id: string, follow: boolean) {
    setLoading(true);
    axiosClient
      .post(`${baseUrl}/users/${id}/follow`, { follow: follow })
      .then((result) => {
        setUser((prev: any) => {
          return {
            ...prev,
            isFollowing: result.data.isFollowing,
            nbFollower: result.data.nbFollower,
          };
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function deleteUser(id: string) {
    setLoading(true);
    axiosClient
      .delete(`${baseUrl}/users/${id}`)
      .then(() => {})
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getFeed(getpage?: number) {
    if (!finished) {
      setLoading(true);
      if (!getpage) {
        getpage = page;
      }
      axiosClient
        .get(`${baseUrl}/feed?page=${getpage}`)
        .then((feed) => {
          if (feed.data.data.length === 0) {
            setFinished(true);
          }
          if (getpage === 1) {
            setFeed(feed.data.data);
          } else {
            setFeed((prev) => {
              const newOnes = feed.data.data.filter(
                ({ id }: any) => !prev.some((e) => e.id === id)
              );
              return [...prev, ...newOnes];
            });
          }
          setPage(getpage + 1);
        })
        .catch((errors) => {
          setError(errors.response.data.errors[0].message);
        })
        .finally(() => setLoading(false));
    }
  }

  async function resetFeed() {
    setFeed([]);
    setPage(1);
    setFinished(false);
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      users,
      user,
      posts,
      feed,
      loading,
      error,
      finished,
      getUsers,
      getUser,
      followUser,
      resetUserPosts,
      getUserPosts,
      likePost,
      updateUser,
      deleteUser,
      setFinished,
      resetFeed,
      getFeed,
      getComments,
      addComment,
    }),
    [users, user, feed, posts, loading, finished, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <UsersContext.Provider value={memoedValue}>
      {children}
    </UsersContext.Provider>
  );
}

// Let's only export the `usePlaces` hook instead of the context.
// We only want to use the hook directly and never the context component.
export function useUsers() {
  return useContext(UsersContext);
}
