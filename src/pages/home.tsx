import { GraphHome } from '@/components/GraphHome.tsx';
import useAuth from '@/services/useAuth';
import { useEffect } from 'react';
import Grid from '@mui/material/Grid2';

const Home = () => {
  const { getStats, user } = useAuth();
  useEffect(() => {
    getStats();
  }, []);
  return (
    <div>
      <div className="mx-5 lg:mx-20 my-10">
        {user?.roleId === 3 ? <GraphHome></GraphHome> : ''}
      </div>
      <div className="mx-5 lg:mx-20 my-10">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
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
                  <tr key="1">
                    <td>plop plop</td>
                    <td>12 suivis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <div className="bg-base-300 rounded-3xl p-5">
              <p className="font-bold text-lg text-primary-600">plop</p>
              <p className="my-3">Abonnés</p>
            </div>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <div className="bg-base-300 rounded-3xl p-5">
              <p className="font-bold text-lg text-primary-600">
                Mon abonnement
              </p>
              <p className="my-3">20€ / mois</p>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Home;
