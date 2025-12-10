'use client';

import { usePlaces } from '@/services/usePlaces';
import { useContests } from '@/services/useContests';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { Grid } from '@mui/material';
import 'dayjs/locale/fr';
import Status from '@/enums/status';
import CreateContest from '../contests/CreateContest';

export function GerantHome() {
  const { getMyPlaces, myPlaces } = usePlaces();
  const { getMyContests, myContests } = useContests();
  useEffect(() => {
    getMyPlaces();
    getMyContests();
  }, []);

  const [openAddContest, setOpenAddContest] = useState(false);

  // close modals
  const handleClose = () => {
    setOpenAddContest(false);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <div className="bg-base-100 rounded-3xl p-3">
            <table className="table table-fixed">
              {/* head */}
              <thead>
                <tr>
                  <th className="text-lg text-primary-600">Mes salles</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myPlaces &&
                  myPlaces.map((place: any) => (
                    <tr
                      key={place.id}
                      className="rounded-3xl hover:bg-base-100"
                    >
                      <td>
                        <Link
                          to={'/places/' + place.id}
                          className="block w-full h-full"
                        >
                          {place.name}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={'/places/' + place.id}
                          className="block w-full h-full"
                        >
                          {place.favoriteCount} favoris
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <div className="bg-base-100 rounded-3xl p-3">
            <table className="table table-fixed">
              {/* head */}
              <thead>
                <tr>
                  <th className="text-lg text-primary-600">Mes contests</th>
                  <th></th>
                  <th
                    className="flex justify-end cursor-pointer"
                    onClick={() => {
                      setOpenAddContest(true);
                      formik.resetForm();
                    }}
                  >
                    <Add />
                  </th>
                </tr>
              </thead>
              <tbody>
                {myContests &&
                  myContests.map((contest: any) => (
                    <tr key={contest.id}>
                      <td>
                        <Link
                          to={`/contests/${contest.id}`}
                          className="block w-full h-full"
                        >
                          {contest.name}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/contests/${contest.id}`}
                          className="block w-full h-full"
                        >
                          {Status[contest.status as keyof typeof Status]}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/contests/${contest.id}`}
                          className="block w-full h-full"
                        >
                          {contest.followCount} participants
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <div className="bg-base-100 rounded-3xl p-5">
            <p className="font-bold text-lg text-primary-600">Mon abonnement</p>
            <p className="my-3">20€ / mois</p>
          </div>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <div className="bg-base-100 rounded-3xl p-5">
            <p className="font-bold text-lg text-primary-600">Mon abonnement</p>
            <p className="my-3">20€ / mois</p>
          </div>
        </Grid>
      </Grid>

      <CreateContest
        openAddContest={openAddContest}
        handleClose={handleClose}
      />
    </div>
  );
}
