import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Status from '@/enums/status';
import { useContests } from '@/services/useContests';
import { Chip, Container } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Contests = () => {
  const { getContests, contests, loading } = useContests();

  const [page, setPage] = useState(1);

  dayjs.locale('fr');

  useEffect(() => {
    getContests(1);
  }, []);

  const changePage = (event: any, value: number) => {
    setPage(value);
    getContests(value);
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container maxWidth="lg">
          <table
            className="table"
            style={{ width: '100%', tableLayout: 'fixed' }}
          >
            {/* head */}
            <thead>
              <tr>
                <th>Nom</th>
                <th className="min-w-40">Status</th>
                <th>Début</th>
                <th>Fin</th>
              </tr>
            </thead>
            <tbody>
              {contests &&
                contests.data.map((contest: any) => (
                  <tr key={contest.id} className="hover:bg-base-200">
                    <td>
                      <Link
                        to={'/contests/' + contest.id}
                        className="block w-full h-full"
                      >
                        <div className="text-sm opacity-80">{contest.name}</div>
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={'/contests/' + contest.id}
                        className="block w-full h-full"
                      >
                        <Chip
                          key={contest.id}
                          label={Status[contest.status as keyof typeof Status]}
                          sx={{
                            backgroundColor:
                              contest.status === 'waiting'
                                ? '#c2410c !important' // orange-800
                                : contest.status === 'valid'
                                ? '#166534 !important' // green-800
                                : contest.status === 'cancelled'
                                ? '#991b1b !important' // red-800
                                : '#6b7280 !important', // gray-500 (fallback)
                            color: 'white !important',
                          }}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={'/contests/' + contest.id}
                        className="block w-full h-full"
                      >
                        {dayjs(contest.startDate).format('dddd D MMMM YYYY')}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={'/contests/' + contest.id}
                        className="block w-full h-full"
                      >
                        {dayjs(contest.endDate).format('dddd D MMMM YYYY')}
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {contests ? (
            <Stack alignItems="center">
              <Pagination
                count={contests.meta.lastPage}
                page={
                  page > contests.meta.lastPage ? contests.meta.lastPage : page
                }
                onChange={changePage}
              />
            </Stack>
          ) : (
            ''
          )}
        </Container>
      )}
    </div>
  );
};

export default Contests;
