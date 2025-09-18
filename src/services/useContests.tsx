import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axiosClient from '../axios-client';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

interface ContestsContextType {
  // We defined the Contest type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  contests: any;
  myContests: any;
  contest: any;
  contestWays: any;
  contestUsers: any;
  loading: boolean;
  error?: any;
  getMyContests: () => void;
  getContests: (page: number | string) => Promise<any>;
  getContest: (id: string) => Promise<any>;
  addContest: (params: any) => Promise<any>;
  updateContest: (id: string, params: any) => Promise<any>;
  addWayContest: (id: string, way_id: number) => Promise<any>;
  deleteWayContest: (id: string, way_id: number) => Promise<any>;
  deleteContest: (id: string) => void;
  getContestWays: (id: string) => void;
  getContestUsers: (id: string) => void;
  followContest: (id: string) => Promise<any>;
}

const ContestsContext = createContext<ContestsContextType>(
  {} as ContestsContextType
);

// Export the provider as we need to wrap the entire app with it
export function ContestsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [myContests, setMyContests] = useState<any>();
  const [contests, setContests] = useState<any>();
  const [contest, setContest] = useState<any>();
  const [contestWays, setContestWays] = useState<any>();
  const [contestUsers, setContestUsers] = useState<any>();
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
  async function getContests(page: number | string) {
    setLoading(true);
    await axiosClient
      .get(`${baseUrl}/contests?page=${page}`)
      .then((response) => {
        if (
          response.data.data.length === 0 &&
          response.data.meta.currentPage !== 1
        ) {
          getContests(response.data.meta.lastPage);
        } else {
          setContests(response.data);
        }
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return;
  }

  function getMyContests() {
    axiosClient
      .get(`${baseUrl}/contests/mine`)
      .then((response) => {
        setMyContests(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function getContest(id: number | string) {
    setLoading(true);
    let contest;
    await axiosClient
      .get(`${baseUrl}/contests/${id}`)
      .then((response) => {
        setContest(response.data);
        contest = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return contest;
  }

  async function addContest(params: any) {
    let contest;
    setLoading(true);
    await axiosClient
      .post(`${baseUrl}/contests`, params)
      .then((response) => {
        setContest(response.data);
        contest = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return contest;
  }

  async function updateContest(id: string, params: any) {
    let contest;
    setLoading(true);
    await axiosClient
      .put(`${baseUrl}/contests/${id}`, params)
      .then((response) => {
        setContest(response.data);
        contest = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return contest;
  }

  async function addWayContest(id: string, way_id: number) {
    setLoading(true);
    await axiosClient
      .post(`${baseUrl}/contests/${id}/ways/${way_id}`)
      .then((response) => {
        getContestWays(id);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function deleteWayContest(id: string, way_id: number) {
    setLoading(true);
    await axiosClient
      .delete(`${baseUrl}/contests/${id}/ways/${way_id}`)
      .then((response) => {
        getContestWays(id);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getContestWays(id: string) {
    setLoading(true);
    axiosClient
      .get(`${baseUrl}/contests/${id}/ways`)
      .then((response) => {
        setContestWays(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function deleteContest(id: string) {
    setLoading(true);
    axiosClient
      .delete(`${baseUrl}/contests/${id}`)
      .then(() => {
        setContest(undefined);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getContestUsers(id: string) {
    setLoading(true);
    axiosClient
      .get(`${baseUrl}/contests/${id}/users`)
      .then((response) => {
        setContestUsers(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function followContest(id: string) {
    setLoading(true);
    await axiosClient
      .post(`${baseUrl}/contests/${id}/follow`)
      .then(() => {
        // Optionally, you can update the local state to reflect the follow action
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return;
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the Contest,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      myContests,
      contests,
      contest,
      contestWays,
      contestUsers,
      loading,
      error,
      getMyContests,
      getContests,
      getContest,
      addContest,
      updateContest,
      addWayContest,
      deleteWayContest,
      getContestWays,
      deleteContest,
      getContestUsers,
      followContest,
    }),
    [myContests, contests, contest, contestWays, contestUsers, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current Contest.
  return (
    <ContestsContext.Provider value={memoedValue}>
      {children}
    </ContestsContext.Provider>
  );
}

// Let's only export the `usePlaces` hook instead of the context.
// We only want to use the hook directly and never the context component.
export function useContests() {
  return useContext(ContestsContext);
}
