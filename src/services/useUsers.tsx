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
  error?: any;
  getUsers: (search: string, page: number | string) => Promise<any>;
  getUser: (id: string) => Promise<any>;
  getUserPosts: (id: string) => Promise<any>;
  likePost: (id: number, like: boolean) => Promise<any>;
  updateUser: (id: string, params: any) => Promise<any>;
  deleteUser: (id: string) => void;
}

const UsersContext = createContext<UsersContextType>({} as UsersContextType);

// Export the provider as we need to wrap the entire app with it
export function UsersProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [users, setUsers] = useState<any>();
  const [posts, setPosts] = useState<any>();
  const [user, setUser] = useState<any>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
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

  async function getUserPosts(id: number | string) {
    setLoading(true);
    await axiosClient
      .get(`${baseUrl}/users/${id}/posts`)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function likePost(id: number, like: boolean) {
    await axiosClient
      .post(`${baseUrl}/posts/${id}/like`, { favorite: like })
      .then(() => {})
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
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
      loading,
      error,
      getUsers,
      getUser,
      getUserPosts,
      likePost,
      updateUser,
      deleteUser,
    }),
    [users, user, loading, error]
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
