import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router';
import { useAuth } from '@/services/useAuth';
import { useUsers } from '@/services/useUsers';
import { USER } from '@/types/user';
import Roles from '@/enums/role';
import Genders from '@/enums/gender';
import Profile from './profile';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Header = () => {
  const { id } = useParams() as { id: string };
  const { user: me, token } = useAuth();
  const { user, getUser, followUser, updateUser } = useUsers();

  const [inputs, setInputs] = useState<USER | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    getUser(id || '0').then((response) => {
      setInputs(response);
    });
  }, []);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values: any) => ({ ...values, [name]: value }));
  };

  const openModal = () => {
    setInputs(user);
    setOpenUpdate(true);
  };
  const handleSubmit = (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    let update = Object.assign({}, inputs);
    delete update.avatar;
    updateUser(id || '0', update).then((response) => {
      setInputs(response);
    });
  };

  const handleClose = () => {
    setOpenUpdate(false);
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

  const tags = [
    'Bouldering',
    'Rock Climbing',
    'Competition',
    'Cordo',
    'Outdoor',
    'Nuts',
    'Pinch',
  ];

  return (
    <div className="overflow-x-auto">
      {!user ? (
        <div>Loading...</div>
      ) : (
        <Box className="w-full max-w-5xl mx-auto px-4 py-6">
          {/* Avatar + Infos utilisateur */}
          <Profile user={user} token={token} />

          {/* Bio */}
          <Typography variant="body2">{user.bio}</Typography>

          {/* Tags */}
          <Box className="flex flex-wrap gap-2 my-3">
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  color: 'black',
                  backgroundColor: 'var(--primary-200)',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>

          {/* Boutons */}
          <Box className="flex gap-2 mt-4">
            {me && (me.id === id || me.roleId === 3) && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => openModal()}
                sx={{
                  maxWidth: '200px',
                  backgroundColor: 'var(--primary-600)', // si ta couleur Tailwind est en CSS var
                  '&:hover': {
                    backgroundColor: 'var(--primary-700)',
                  },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Modifier le profil
              </Button>
            )}
            {me && me.id === id && (
              <Button
                variant="contained"
                fullWidth
                sx={{
                  maxWidth: '200px',
                  backgroundColor: 'var(--primary-600)', // si ta couleur Tailwind est en CSS var
                  '&:hover': {
                    backgroundColor: 'var(--primary-700)',
                  },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Ajouter un post
              </Button>
            )}
            {me && me.id !== id && user && user.isFollowing ? (
              <Button
                variant="contained"
                fullWidth
                onClick={() => follow(false)}
                sx={{
                  maxWidth: '200px',
                  backgroundColor: 'var(--primary-600)', // si ta couleur Tailwind est en CSS var
                  '&:hover': {
                    backgroundColor: 'var(--primary-700)',
                  },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Se désabonner
              </Button>
            ) : null}
            {me && me.id !== id && user && !user.isFollowing ? (
              <Button
                variant="contained"
                fullWidth
                onClick={() => follow(true)}
                sx={{
                  maxWidth: '200px',
                  backgroundColor: 'var(--primary-600)', // si ta couleur Tailwind est en CSS var
                  '&:hover': {
                    backgroundColor: 'var(--primary-700)',
                  },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                S'abonner
              </Button>
            ) : null}
          </Box>
        </Box>
      )}

      <Dialog
        open={openUpdate}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: '600px',
            maxWidth: '90%',
          },
          className: 'dark:bg-zinc-700 relative',
        }}
      >
        <DialogTitle>Modifier le profil</DialogTitle>

        {inputs && (
          <DialogContent>
            <TextField
              id="standard-basic"
              label="Prénom"
              fullWidth
              variant="standard"
              name="firstname"
              value={inputs.firstname || ''}
              onChange={handleChange}
            />
            <TextField
              id="standard-basic"
              label="Nom"
              fullWidth
              variant="standard"
              name="lastname"
              value={inputs.lastname || ''}
              onChange={handleChange}
            />
            <TextField
              id="standard-basic"
              label="Adresse"
              fullWidth
              variant="standard"
              name="email"
              value={inputs.email || ''}
              onChange={handleChange}
            />
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
          </DialogContent>
        )}
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button className="btn" onClick={handleSubmit}>
            Enregistrer
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header; // Don’t forget to use export default!
