import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  MenuItem,
  TextField,
  Grid,
  IconButton,
  tooltipClasses,
  styled,
  Tooltip,
  TooltipProps,
} from '@mui/material';
import { useParams } from 'react-router';
import { useAuth } from '@/services/useAuth';
import { useUsers } from '@/services/useUsers';
import { USER } from '@/types/user';
import ImageWithToken from 'react-image-with-auth';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Roles from '@/enums/role';
import Genders from '@/enums/gender';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Header = () => {
  const { id } = useParams() as { id: string };
  const { user: me, token } = useAuth();
  const { user, getUser, followUser, updateUser } = useUsers();

  const [inputs, setInputs] = useState<USER | null>(null);

  useEffect(() => {
    getUser(id || '0').then((response: USER) => {
      setInputs(response);
    });
  }, []);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values: any) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    let update = Object.assign({}, inputs);
    delete update.avatar;
    updateUser(id || '0', update).then((response) => {
      setInputs(response);
    });
  };

  const enumToArray = (data: any): any =>
    Object.keys(data)
      .filter((key) => Number.isNaN(+key))
      .map((key: string) => ({
        key: data[key],
        value: key,
      }));

  const follow = (follow: boolean) => {
    followUser(id, follow);
  };

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  return (
    <div className="overflow-x-auto">
      {!inputs ? (
        <div>Loading...</div>
      ) : (
        <div className="m-5 relative">
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4, sm: 4 }}>
                <div className="text-right">
                  <p className="font-bold text-lg">{user.nbFollower || '0'}</p>
                  Abonnés
                </div>
              </Grid>
              <Grid size={{ xs: 4, sm: 4 }}>
                <div className="flex justify-center">
                  <div className="mask mask-circle h-20 w-20 sm:h-40 sm:w-40">
                    {inputs.avatar ? (
                      <ImageWithToken
                        imageUrl={
                          baseUrl +
                          '/users/' +
                          inputs.id +
                          '/avatar/' +
                          inputs.avatar +
                          '?size=500'
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
              </Grid>
              <Grid size={{ xs: 4, sm: 4 }}>
                <p className="font-bold text-lg">{user.nbFollowing || '0'}</p>
                Suivis
              </Grid>
            </Grid>
            <Grid container spacing={2} columns={12}>
              <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
                <TextField
                  id="standard-basic"
                  label="Prénom"
                  fullWidth
                  variant="standard"
                  name="firstname"
                  value={inputs.firstname || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
                <TextField
                  id="standard-basic"
                  label="Nom"
                  fullWidth
                  variant="standard"
                  name="lastname"
                  value={inputs.lastname || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
                <TextField
                  id="standard-basic"
                  label="Adresse"
                  fullWidth
                  variant="standard"
                  name="email"
                  value={inputs.email || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  id="standard-select-currency"
                  select
                  fullWidth
                  label="Rôle"
                  variant="standard"
                  name="roleId"
                  disabled={me && me.roleId === 2}
                  value={(inputs && inputs.roleId) || '0'}
                  onChange={handleChange}
                >
                  {enumToArray(Roles).map((difficulty: any) => (
                    <MenuItem key={difficulty.key} value={difficulty.key}>
                      {difficulty.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  id="standard-select-currency"
                  select
                  fullWidth
                  label="Genre"
                  variant="standard"
                  name="genderId"
                  value={inputs.genderId || '0'}
                  onChange={handleChange}
                >
                  {enumToArray(Genders).map((difficulty: any) => (
                    <MenuItem key={difficulty.key} value={difficulty.key}>
                      {difficulty.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <div className="text-center">
              <button
                type="submit"
                className="btn text-white bg-primary-600 hover:bg-primary-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
          <div className="text-right absolute w-16 right-0 top-0">
            {user ? (
              <div>
                <p>{user.isFollowing}</p>
                {user.isFollowing ? (
                  <LightTooltip title="Ne désabonner">
                    <IconButton
                      onClick={() => follow(false)}
                      color="primary"
                      component="span"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </LightTooltip>
                ) : (
                  <LightTooltip title="S'abonner">
                    <IconButton
                      onClick={() => follow(true)}
                      color="primary"
                      component="span"
                    >
                      <AddIcon />
                    </IconButton>
                  </LightTooltip>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header; // Don’t forget to use export default!
