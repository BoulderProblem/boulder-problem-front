import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axiosClient from '../axios-client';
import { WAY } from '@/types/way';
import { PLACE } from '@/types/place';
import { ZONE } from '@/types/zone';
import { useAuth } from './useAuth';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

interface PlacesContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  colors: any;
  difficulties: any;
  places?: { data: PLACE[]; meta: any };
  myPlaces?: PLACE[];
  zone?: any;
  zones?: any[];
  walls: any[];
  ways?: WAY[];
  allWays?: ZONE[];
  place?: PLACE;
  loading: boolean;
  error?: any;
  getColors: () => void;
  getDifficulties: () => void;
  getPlaces: (search: string, page: number | string) => void;
  getMyPlaces: () => void;
  getPlace: (id: number | string) => Promise<any>;
  favoritePlace: (id: number | string, favorite: boolean) => Promise<any>;
  getZone: (id: number | string) => Promise<any>;
  getPlaceZones: (id: number | string) => Promise<any>;
  updatePlace: (id: number | string, params: any) => Promise<any>;
  getPlan: (id: number | string) => Promise<any>;
  createZone: (params: any) => Promise<any>;
  updateZone: (id: string, params: any) => Promise<any>;
  createWall: (zone_id: string, name: string) => Promise<any>;
  updateWall: (wall_id: string, params: any) => Promise<any>;
  getWalls: (id: number | string) => void;
  getWays: (id: number | string) => void;
  getAllWays: (id: number | string) => void;
  getWay: (id: number | string) => Promise<any>;
  addWay: (params: any) => void;
  updateWay: (id: number | string, params: any) => void;
  deleteWay: (id: number | string, wallId: number | string) => void;
  getWayComments: (wayId: number, getpage: number) => Promise<any>;
  addWayComment: (wayId: number, text: string) => Promise<any>;
  saveRating: (wayId: number, note: number) => void;
}

const PlacesContext = createContext<PlacesContextType>({} as PlacesContextType);

// Export the provider as we need to wrap the entire app with it
export function PlacesProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { user: me } = useAuth();
  const [colors, setColors] = useState<any>();
  const [difficulties, setDifficulties] = useState<any>();
  const [places, setPlaces] = useState<any>();
  const [myPlaces, setMyPlaces] = useState<any>();
  const [place, setPlace] = useState<any>();
  const [zone, setZone] = useState<any>();
  const [zones, setPlaceZones] = useState<any>();
  const [walls, setWalls] = useState<any>([]);
  const [ways, setWays] = useState<any>([]);
  const [allWays, setAllWays] = useState<any>([]);
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
  function getDifficulties() {
    axiosClient
      .get(`${baseUrl}/difficulties`)
      .then((response) => {
        setDifficulties(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getColors() {
    axiosClient
      .get(`${baseUrl}/colors`)
      .then((response) => {
        setColors(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getPlaces(search: string, page: number | string) {
    axiosClient
      .get(`${baseUrl}/places?search=${search}&page=${page}`)
      .then((response) => {
        if (
          response.data.data.length === 0 &&
          response.data.meta.currentPage !== 1
        ) {
          getPlaces(search, response.data.meta.lastPage);
        } else {
          setPlaces(response.data);
        }
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function favoritePlace(id: number | string, favorite: boolean) {
    await axiosClient
      .post(`${baseUrl}/places/${id}/favorite`, { favorite: favorite })
      .then(() => {
        // Optionally, you can update the local state to reflect the change
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));

    return;
  }

  function getMyPlaces() {
    axiosClient
      .get(`${baseUrl}/places/mine`)
      .then((response) => {
        setMyPlaces(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function getPlace(id: number | string) {
    let place;
    await axiosClient
      .get(`${baseUrl}/places/${id}`)
      .then((response) => {
        setPlace(response.data);
        place = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return place;
  }

  async function getZone(id: number | string) {
    let zone;
    await axiosClient
      .get(`${baseUrl}/zones/${id}`)
      .then((response) => {
        setZone(response.data);
        zone = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return zone;
  }

  async function getPlaceZones(id: number | string) {
    await axiosClient
      .get(`${baseUrl}/places/${id}/zones`)
      .then((response) => {
        setPlaceZones(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function updatePlace(id: number | string, params: any) {
    let place;
    await axiosClient
      .put(`${baseUrl}/places/${id}`, params)
      .then((response) => {
        place = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return place;
  }

  async function createZone(params: any) {
    return await axiosClient
      .post(`${baseUrl}/zones`, params)
      .then(() => {})
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function updateZone(id: string, params: any) {
    let zone;
    await axiosClient
      .put(`${baseUrl}/zones/${id}`, params)
      .then((response) => {
        zone = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return zone;
  }

  async function getPlan(id: number | string) {
    let plan;
    await axiosClient
      .get(`${baseUrl}/zones/${id}/plan`)
      .then((response) => {
        plan = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return plan;
  }

  async function createWall(zone_id: string, name: string) {
    let wall;
    await axiosClient
      .post(`${baseUrl}/walls`, { zone_id, name })
      .then((response) => {
        wall = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return wall;
  }

  function updateWall(id: number | string, params: any) {
    axiosClient
      .put(`${baseUrl}/walls/${id}`, params)
      .then(() => {
        getWalls(params.zone_id);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getWalls(id: number | string) {
    axiosClient
      .get(`${baseUrl}/zones/${id}/walls`)
      .then((response) => {
        setWalls(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getWays(id: number | string) {
    axiosClient
      .get(`${baseUrl}/walls/${id}/ways`)
      .then((response) => {
        setWays(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getAllWays(id: number | string) {
    axiosClient
      .get(`${baseUrl}/places/${id}/allways`)
      .then((response) => {
        setAllWays(response.data);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  async function getWay(id: number | string) {
    let way;
    await axiosClient
      .get(`${baseUrl}/ways/${id}`)
      .then((response) => {
        way = response.data;
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
    return way;
  }

  function addWay(params: any) {
    axiosClient
      .post(`${baseUrl}/ways`, params)
      .then(() => {
        getWays(params.wallId);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function updateWay(id: number | string, params: any) {
    axiosClient
      .put(`${baseUrl}/ways/${id}`, params)
      .then(() => {
        getWays(params.wallId);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function deleteWay(id: number | string, wallId: number | string) {
    axiosClient
      .delete(`${baseUrl}/ways/${id}`)
      .then(() => {
        getWays(wallId);
      })
      .catch((errors) => {
        setError(errors.response.data.errors[0].message);
      })
      .finally(() => setLoading(false));
  }

  function getWayComments(wayId: number, getpage: number): Promise<any> {
    return axiosClient
      .get(`${baseUrl}/ways/${wayId}/comments?page=${getpage}`)
      .then((response) => {
        const newComments = response.data.data;
        const haveNextPage = response.data.meta.lastPage > getpage;

        setWays((prev) => {
          return prev.map((way) => {
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

        console.log(newComment);

        setWays((prev: any) => {
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
        setWays((prev) => {
          return prev.map((way) => {
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
      colors,
      difficulties,
      places,
      myPlaces,
      place,
      zone,
      zones,
      walls,
      ways,
      allWays,
      loading,
      error,
      getColors,
      getDifficulties,
      getPlaces,
      getMyPlaces,
      getPlace,
      updatePlace,
      favoritePlace,
      getZone,
      getPlaceZones,
      getPlan,
      createWall,
      updateWall,
      createZone,
      updateZone,
      getWalls,
      getWays,
      getAllWays,
      getWay,
      addWay,
      updateWay,
      deleteWay,
      getWayComments,
      addWayComment,
      saveRating,
    }),
    [
      colors,
      difficulties,
      places,
      myPlaces,
      place,
      zone,
      zones,
      walls,
      ways,
      allWays,
      loading,
      error,
    ]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <PlacesContext.Provider value={memoedValue}>
      {children}
    </PlacesContext.Provider>
  );
}

// Let's only export the `usePlaces` hook instead of the context.
// We only want to use the hook directly and never the context component.
export function usePlaces() {
  return useContext(PlacesContext);
}
