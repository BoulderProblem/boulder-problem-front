import Roles from '@/enums/role';
import { useAuth } from '@/services/useAuth';
import { useUsers } from '@/services/useUsers';
import { useEffect, useState } from 'react';
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
  Avatar,
} from '@mui/material';
import { USER } from '@/types/user';
import SearchIcon from '@mui/icons-material/Search';
import { useAvatar } from '@/hooks/useAvatar';

const Users = () => {
  const { token } = useAuth();
  const { users, loading, getUsers } = useUsers();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

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
                    <TableRowItem key={user.id} user={user} token={token} />
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

const TableRowItem = ({ user, token }: { user: USER; token: string }) => {
  const navigate = useNavigate();

  const avatarUrl = useAvatar(user.id, user.avatar, token, 'user');
  return (
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
          <Avatar
            src={avatarUrl}
            alt="Profile"
            sx={{
              width: 48,
              height: 48,
              border: '3px solid var(--primary-600)',
            }}
          />
          <div>
            <div className="font-bold">{user.firstname}</div>
            <div className="text-sm opacity-80">{user.lastname}</div>
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
  );
};
export default Users;
