import Roles from '@/enums/role';
import { useAuth } from '@/services/useAuth';
import { useUsers } from '@/services/useUsers';
import { useEffect, useState } from 'react';
import ImageWithToken from 'react-image-with-auth';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { Stack, Container } from '@mui/material';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Users = () => {
  const { token } = useAuth();
  const { users, loading, getUsers } = useUsers();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers(search, 1);
  }, []);

  const changePage = (event: any, value: number) => {
    setPage(value);
    getUsers(search, value);
  };
  function changeSearch(value: string) {
    setSearch(value);
    getUsers(value, page);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex m-4">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Rechercher"
            onChange={(e) => changeSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container maxWidth="lg">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Nom</th>
                <th>email</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.data.map((user: any) => (
                  <tr key={user.id} className="hover:bg-base-200">
                    <td>
                      <Link to={'/users/' + user.id}>
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
                      </Link>
                    </td>
                    <td>
                      <Link to={'/users/' + user.id}>
                        {user.email}
                        <br />
                        <span
                          className={
                            'badge badge-sm ' +
                            (user.roleId === 1 ? 'bg-blue-800' : '') +
                            (user.roleId === 2 ? 'bg-green-800' : '') +
                            (user.roleId === 3 ? 'bg-red-800' : '')
                          }
                        >
                          {Roles[user.roleId]}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {users ? (
            <Stack alignItems="center">
              <Pagination
                count={users.meta.lastPage}
                page={page > users.meta.lastPage ? users.meta.lastPage : page}
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

export default Users;
