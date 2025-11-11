import Roles from '@/enums/role';
import { useAuth } from '@/services/useAuth';
import { useUsers } from '@/services/useUsers';
import { useEffect, useState } from 'react';
import ImageWithToken from 'react-image-with-auth';
import { useNavigate } from 'react-router-dom';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  TableFooter,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { USER } from '@/types/user';
import SearchIcon from '@mui/icons-material/Search';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Users = () => {
  const { token } = useAuth();
  const { users, loading, getUsers } = useUsers();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getUsers(search, 1);
  }, []);

  const changePage = (_event: any, value: number) => {
    setPage(value);
    getUsers(search, value + 1);
  };
  function changeSearch(value: string) {
    setSearch(value);
    getUsers(value, page + 1);
  }

  return (
    <div>
      {loading && !users ? (
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
          sx={{
            overflow: 'hidden',
            borderRadius: { xs: 0, lg: 6 },
          }}
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
            {users ? (
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.data.map((user: USER) => (
                    <TableRow
                      key={user.id}
                      onClick={() => navigate(`/users/${user.id}`)}
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
                          <div className="avatar">
                            <div className="mask mask-circle h-12 w-12">
                              {user.avatar ? (
                                <ImageWithToken
                                  imageUrl={
                                    baseUrl +
                                    '/users/' +
                                    user.id +
                                    '/avatar/' +
                                    user.avatar +
                                    '?size=50'
                                  }
                                  token={token}
                                  alt="avatar"
                                />
                              ) : (
                                <svg
                                  width="48px"
                                  height="48px"
                                  viewBox="0 0 18 18"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill="#494c4e"
                                    d="M9 0a9 9 0 0 0-9 9 8.654 8.654 0 0 0 .05.92 9 9 0 0 0 17.9 0A8.654 8.654 0 0 0 18 9a9 9 0 0 0-9-9zm5.42 13.42c-.01 0-.06.08-.07.08a6.975 6.975 0 0 1-10.7 0c-.01 0-.06-.08-.07-.08a.512.512 0 0 1-.09-.27.522.522 0 0 1 .34-.48c.74-.25 1.45-.49 1.65-.54a.16.16 0 0 1 .03-.13.49.49 0 0 1 .43-.36l1.27-.1a2.077 2.077 0 0 0-.19-.79v-.01a2.814 2.814 0 0 0-.45-.78 3.83 3.83 0 0 1-.79-2.38A3.38 3.38 0 0 1 8.88 4h.24a3.38 3.38 0 0 1 3.1 3.58 3.83 3.83 0 0 1-.79 2.38 2.814 2.814 0 0 0-.45.78v.01a2.077 2.077 0 0 0-.19.79l1.27.1a.49.49 0 0 1 .43.36.16.16 0 0 1 .03.13c.2.05.91.29 1.65.54a.49.49 0 0 1 .25.75z"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.firstname}</div>
                            <div className="text-sm opacity-80">
                              {user.lastname}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.email}
                        <br />
                        <span
                          className={
                            'badge text-white badge-sm ' +
                            (user.roleId === 1 ? 'bg-blue-800' : '') +
                            (user.roleId === 2 ? 'bg-green-800' : '') +
                            (user.roleId === 3 ? 'bg-red-800' : '')
                          }
                        >
                          {Roles[user.roleId]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10]}
                      count={users.meta.total}
                      rowsPerPage={10}
                      page={
                        page > users.meta.lastPage - 1
                          ? users.meta.lastPage - 1
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

export default Users;
