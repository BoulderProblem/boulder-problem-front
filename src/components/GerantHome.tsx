'use client';

import usePlaces from '@/services/usePlaces';
import Grid from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Add } from '@mui/icons-material';

export function GerantHome() {
  const { getMyPlaces, myPlaces } = usePlaces();
  useEffect(() => {
    getMyPlaces();
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <div className="bg-base-300 rounded-3xl p-3">
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
                        <Link to={'/places/' + place.id}>{place.name}</Link>
                      </td>
                      <td>
                        <Link to={'/places/' + place.id}>
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
          <div className="bg-base-300 rounded-3xl p-3">
            <table className="table table-fixed">
              {/* head */}
              <thead>
                <tr>
                  <th className="text-lg text-primary-600">Mes contests</th>
                  <th className="flex justify-end">
                    <Add />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr key="1">
                  <td>plop plop</td>
                  <td>12 participants</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <div className="bg-base-300 rounded-3xl p-5">
            <p className="font-bold text-lg text-primary-600">Mon abonnement</p>
            <p className="my-3">20€ / mois</p>
          </div>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <div className="bg-base-300 rounded-3xl p-5">
            <p className="font-bold text-lg text-primary-600">Mon abonnement</p>
            <p className="my-3">20€ / mois</p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
