import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import Status from '@/enums/status';
import SearchIcon from '@mui/icons-material/Search';
import { useContests } from '@/services/useContests';
import dayjs from 'dayjs';
import { CONTEST } from '@/types/contest';

const Places = () => {
  const { getContests, contests, loading } = useContests();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  const locale = navigator.language || 'fr';
  dayjs.locale(locale);

  useEffect(() => {
    getContests(1);
  }, []);

  function changeSearch(value: string) {
    setSearch(value);
    // getContests(value, page + 1);
  }

  const changePage = (_event: any, value: number) => {
    setPage(value);
    // getContests(search, value + 1);
  };

  return (
    <div>
      {loading && !contests ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress size={60} thickness={5} />
        </Box>
      ) : (
        <Paper
          className="max-w-7xl mx-auto mt-5"
          sx={{ overflow: 'hidden', borderRadius: { xs: 0, lg: 6 } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 300,
                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
              }}
            />
          </Box>
          <TableContainer
            component={Paper}
            sx={{ width: '100%', borderRadius: 6 }}
          >
            {contests ? (
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Salle</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contests.data.map((contest: CONTEST) => (
                    <TableRow
                      key={contest.id}
                      onClick={() => navigate(`/contests/${contest.id}`)}
                      hover
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {contest.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {contest.place.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Chip
                            key={contest.id}
                            label={
                              Status[contest.status as keyof typeof Status]
                            }
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="items-center gap-3">
                          <Box>
                            {dayjs(contest.startDate).format(
                              'dddd D MMMM YYYY'
                            )}
                          </Box>
                          <Box>
                            {dayjs(contest.endDate).format('dddd D MMMM YYYY')}
                          </Box>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10]}
                      count={contests.meta.total}
                      rowsPerPage={10}
                      page={
                        page > contests.meta.lastPage - 1
                          ? contests.meta.lastPage - 1
                          : page
                      }
                      onPageChange={changePage}
                      labelRowsPerPage="Lignes par page"
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            ) : null}
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

export default Places;
