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
import { decrypt, encrypt, generateKeys } from '@/crypto';
import axios from 'axios';

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
  priv: string;
  pubSrvKey: string;
  loading: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  loginFirebase: (token: string, id: string) => Promise<void>;
  signUp: (email: string, name: string, password: string) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: number,
    password: string
  ) => Promise<void>;
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
  const [pubSrvKey, setPubSrvKey] = useState<string>('');
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [priv, setPriv] = useState<string>('');

  function generateOrGetKeys(
    password: string,
    publicKey: string,
    pubSrvKey: string
  ) {
    if (publicKey) {
      restore(password);
    } else {
      setup(password, pubSrvKey);
    }
  }

  // generate keys
  const setup = async (password: string, pubSrvKey: string) => {
    const k = await generateKeys();
    setPriv(k.priv);
    localStorage.setItem('PRIV', k.priv);
    backup(k, password, pubSrvKey);
  };

  // save keys on server
  const backup = async (
    k: { pub: string; priv: string },
    password: string,
    pubSrvKey: string
  ) => {
    const encrypted = await encrypt(k.priv, password);
    const encryptedSrv = await encrypt(k.priv, pubSrvKey);
    await axiosClient.post(`${baseUrl}/backup_key`, {
      priv: encrypted,
      privSrv: encryptedSrv,
      pub: k.pub,
    });
  };

  // give back private key from server
  const restore = async (password: string) => {
    const { data } = await axiosClient.get(`${baseUrl}/backup_key`);
    const privRestored = await decrypt(data, password);

    setPriv(privRestored);
    localStorage.setItem('PRIV', privRestored);
  };

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
    let priv = localStorage.getItem('PRIV');
    let pubSrv = localStorage.getItem('PUBSRV');
    setPriv(priv ? priv : '');
    setPubSrvKey(pubSrv ? pubSrv : '');
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
            setPubSrvKey(loginData.data.pubSrvKey);

            localStorage.setItem('PUBSRV', loginData.data.pubSrvKey);
            generateOrGetKeys(
              password,
              user.data.publicKey,
              loginData.data.pubSrvKey
            );
          }, 300);
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function loginFirebase(token: string, id: string) {
    axios
      .post(
        `${baseUrl}/auth/firebase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((loginData) => {
        localStorage.setItem('ACCESS_TOKEN', loginData.data.token);

        setToken(loginData.data.token);
        axiosClient.get(`${baseUrl}/user`).then((user) => {
          axiosClient.get(`${baseUrl}/srv_key`).then((res) => {
            setTimeout(() => {
              setUser(user.data);
              setPubSrvKey(res.data.pubSrvKey);
              localStorage.setItem('PUBSRV', loginData.data.pubSrvKey);
              generateOrGetKeys(
                id.toString(),
                user.data.publicKey,
                res.data.pubSrvKey
              );
            }, 300);
          });
        });
      });
  }

  async function forgotPassword(email: string) {
    setLoading(true);
    setError(undefined);

    await axiosClient
      .post(`${baseUrl}/forgot_password`, { email })
      .then((response) => {
        // success
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function resetPassword(email: string, code: number, password: string) {
    setLoading(true);
    setError(undefined);

    await axiosClient
      .post(`${baseUrl}/reset_password`, { email, code, password })
      .then((response) => {
        // success
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => {
        setLoading(false);
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
        localStorage.removeItem('PRIV');
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
      priv,
      pubSrvKey,
      loading,
      error,
      login,
      loginFirebase,
      forgotPassword,
      resetPassword,
      signUp,
      logout,
      getStats,
    }),
    [user, stats, token, priv, pubSrvKey, loading, error]
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
