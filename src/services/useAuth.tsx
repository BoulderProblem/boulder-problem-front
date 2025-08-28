import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axiosClient from '../axios-client';
import { USER } from '@/types/user';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: USER;
  stats?: any;
  token: string;
  loading: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  loginGoogle: (token: string) => void;
  signUp: (email: string, name: string, password: string) => void;
  logout: () => void;
  getStats: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<USER>();
  const [stats, setStats] = useState<any>();
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
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
    let token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      axiosClient
        .get(`${baseUrl}/user`)
        .then((user) => {
          setUser(user.data);
          setToken(token ? token : '');
        })
        .catch((_error) => {
          console.log('error');
        })
        .finally(() => setLoadingInitial(false));
    } else {
      setLoadingInitial(false);
    }
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  function login(email: string, password: string) {
    setLoading(true);
    setError(undefined);

    axiosClient
      .post(`${baseUrl}/login`, { email, password })
      .then((loginData) => {
        localStorage.setItem('ACCESS_TOKEN', loginData.data.token);

        setToken(loginData.data.token);
        axiosClient.get(`${baseUrl}/user`).then((user) => {
          setTimeout(() => {
            setUser(user.data);
          }, 300);
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function loginGoogle(token: string) {
    localStorage.setItem('ACCESS_TOKEN', token);
    setToken(token);
    axiosClient.get(`${baseUrl}/user`).then((user) => {
      setTimeout(() => {
        setUser(user.data);
      }, 300);
    });
  }

  // Sends sign up details to the server. On success we just apply
  // the created user to the state.
  function signUp(email: string, name: string, password: string) {
    setLoading(true);

    // usersApi
    //   .signUp({ email, name, password })
    //   .then((user) => {
    //     setUser(user);
    //     history.push("/");
    //   })
    //   .catch((error) => setError(error))
    //   .finally(() => setLoading(false));
  }

  // Call the logout endpoint and then remove the user
  // from the state.
  function logout() {
    axiosClient
      .get(`${baseUrl}/logout`)
      .then(() => {})
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => {
        localStorage.removeItem('ACCESS_TOKEN');
        setUser(undefined);
      });
  }

  function getStats() {
    axiosClient
      .get(`${baseUrl}/stats`)
      .then((stats) => {
        setStats(stats.data);
      })
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
      user,
      stats,
      token,
      loading,
      error,
      login,
      loginGoogle,
      signUp,
      logout,
      getStats,
    }),
    [user, stats, token, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export function useAuth() {
  return useContext(AuthContext);
}
