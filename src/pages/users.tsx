import Roles from '@/enums/role';
import useAuth from '@/services/useAuth';
import { useEffect } from 'react';
import { AuthImage } from 'react-auth-image';

const Users = () => {
  const { users, loading, token, getUsers } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Nom</th>
              <th>email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-circle h-12 w-12">
                          {user.avatar ? (
                            <AuthImage
                              src={
                                'https://boulder-problem.chabs.fr/users/' +
                                user.id +
                                '/avatar/' +
                                user.avatar
                              }
                              token={token}
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
                        <div className="text-sm opacity-50">
                          {user.lastname}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.email}
                    <br />
                    <span className="badge badge-primary badge-sm">
                      {Roles[user.roleId]}
                    </span>
                  </td>
                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Nom</th>
              <th>email</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default Users;
