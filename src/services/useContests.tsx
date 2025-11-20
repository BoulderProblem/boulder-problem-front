import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axiosClient from '../axios-client';
import { RANKING } from '@/types/ranking';
import { WAY } from '@/types/way';
import { useAuth } from './useAuth';

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
  contestRanking: RANKING[] | undefined;
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
  getContestRanking: (id: string) => void;
  followContest: (id: string, follow: boolean) => Promise<any>;
  getWayComments: (wayId: number, getpage: number) => Promise<any>;
  addWayComment: (wayId: number, text: string) => Promise<any>;
  saveRating: (wayId: number, note: number) => void;
  saveValid: (wayId: number, status: string, id: string) => void;
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
  const { user: me } = useAuth();
  const [myContests, setMyContests] = useState<any>();
  const [contests, setContests] = useState<any>();
  const [contest, setContest] = useState<any>();
  const [contestWays, setContestWays] = useState<any>();
  const [contestUsers, setContestUsers] = useState<any>();
  const [contestRanking, setContestRanking] = useState<RANKING[]>();
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
      .then(() => {
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
      .then(() => {
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

  async function getContestRanking(id: string) {
    setLoading(true);
    await axiosClient
      .get(`${baseUrl}/contests/${id}/ranking`)
      .then((response) => {
        setContestRanking(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));

    return;
  }

  async function followContest(id: string, follow: boolean) {
    setLoading(true);
    await axiosClient
      .post(`${baseUrl}/contests/${id}/follow`, { follow })
      .then(() => {
        // Optionally, you can update the local state to reflect the follow action
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return;
  }

  function getWayComments(wayId: number, getpage: number): Promise<any> {
    return axiosClient
      .get(`${baseUrl}/ways/${wayId}/comments?page=${getpage}`)
      .then((response) => {
        const newComments = response.data.data;
        const haveNextPage = response.data.meta.lastPage > getpage;

        setContestWays((prev: any) => {
          return prev.map((way: WAY) => {
            if (way.id !== wayId) return way;

            const existing = way.comments || [];
            const merged = [...existing, ...newComments].filter(
              (comment, index, self) =>
                index === self.findIndex((c) => c.id === comment.id)
            );

            return {
              ...way,
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
      .finally(() => setLoading(false));
  }

  function addWayComment(wayId: number, text: string): Promise<any> {
    return axiosClient
      .post(`${baseUrl}/ways/${wayId}/comments`, { text })
      .then((response) => {
        response.data.user = {
          avatar: me!.avatar,
          firstname: me!.firstname,
          id: me!.id,
          lastname: me!.lastname,
        };

        let newComment = [response.data];

        setContestWays((prev: any) => {
          return prev.map((way: WAY) => {
            if (way.id !== wayId) return way;

            const existing = way.comments || [];
            const merged = [...newComment, ...existing];

            return {
              ...way,
              comments: merged,
              nbComments: way.nbComments + 1,
            };
          });
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function saveRating(wayId: number, note: number) {
    axiosClient
      .post(`${baseUrl}/ways/${wayId}/note`, { note: note })
      .then((response) => {
        setContestWays((prev: any) => {
          return prev.map((way: WAY) => {
            if (way.id !== wayId) return way;

            return {
              ...way,
              userNote: response.data.note,
              avgNote: response.data.avgNote,
            };
          });
        });
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function saveValid(wayId: number, status: string, id: string) {
    axiosClient
      .post(`${baseUrl}/ways/${wayId}/valid`, { status: status })
      .then((response) => {
        console.log(response.data);

        setContestWays((prev: any) => {
          return prev.map((way: WAY) => {
            if (way.id !== wayId) return way;

            return {
              ...way,
              valid: response.data,
            };
          });
        });
        getContestRanking(id);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
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
      contestRanking,
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
      getContestRanking,
      followContest,
      getWayComments,
      addWayComment,
      saveRating,
      saveValid,
    }),
    [
      myContests,
      contests,
      contest,
      contestWays,
      contestUsers,
      loading,
      error,
      contestRanking,
    ]
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
