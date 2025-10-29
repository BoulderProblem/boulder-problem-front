import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { usePlaces } from '@/services/usePlaces';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { PLACE } from '@/types/place';
import { useUsers } from '@/services/useUsers';
import 'dayjs/locale/fr';
import { useAuth } from '@/services/useAuth';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const PlaceHeader = (props: any) => {
  const { place, getPlace, getPlaceZones, favoritePlace, difficulties } =
    usePlaces();
  const { user } = useUsers();
  const { token } = useAuth();

  const [openHours, setOpenHours] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    getPlace(parseInt(props.id || '0')).then((response: PLACE) => {
      initHoraires(response.hours);
    });
    getPlaceZones(parseInt(props.id || '0'));
    return () => {
      setAvatarUrl(null);
    };
  }, []);

  useEffect(() => {
    const loadAvatar = async () => {
      if (place && place.logo) {
        try {
          const res = await fetch(
            `${baseUrl}/places/${place.id}/logo?size=100`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!res.ok) throw new Error('Erreur chargement avatar');

          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          setAvatarUrl(objectUrl);

          // nettoyage pour éviter les fuites mémoire
          return () => URL.revokeObjectURL(objectUrl);
        } catch (err) {
          console.error(err);
        }
      }
    };

    loadAvatar();
  }, [baseUrl, user, token]);

  const joursOuverts = [
    { jour: 'lundi', en: 'Mo' },
    { jour: 'mardi', en: 'Tu' },
    { jour: 'mercredi', en: 'We' },
    { jour: 'jeudi', en: 'Th' },
    { jour: 'vendredi', en: 'Fr' },
    { jour: 'samedi', en: 'Sa' },
    { jour: 'dimanche', en: 'Su' },
  ];

  type HorairesSemaine = {
    [key: string]: {
      ouvert: boolean;
      debut: string;
      fin: string;
    };
  };

  const [horaires, setHoraires] = useState<HorairesSemaine>({
    lundi: { ouvert: false, debut: '', fin: '' },
    mardi: { ouvert: false, debut: '', fin: '' },
    mercredi: { ouvert: false, debut: '', fin: '' },
    jeudi: { ouvert: false, debut: '', fin: '' },
    vendredi: { ouvert: false, debut: '', fin: '' },
    samedi: { ouvert: false, debut: '', fin: '' },
    dimanche: { ouvert: false, debut: '', fin: '' },
  });

  /**
   * décompresse les horaires pour initialiser le state au dessus
   * @param hours
   */
  const initHoraires = (hours: string) => {
    if (hours) {
      let plage = hours.split('; ');
      let i = 0;
      while (i < plage.length) {
        let open = false;

        joursOuverts.forEach((jours) => {
          if (plage[i].slice(0, 2) === jours.en || open) {
            let debut = plage[i].split(' ')[1].split('-')[0];
            let fin = plage[i].split(' ')[1].split('-')[1];

            setHoraires((values: any) => ({
              ...values,
              [jours.jour]: {
                ouvert: true,
                debut: debut,
                fin: fin,
              },
            }));
            if (!open && plage[i].slice(2, 3) === '-') {
              open = true;
            }
            if (open && plage[i].slice(3, 5) === jours.en) {
              open = false;
            }
          }
        });
        i++;
      }
    }
  };

  const openModal = (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    setOpenHours(true);
  };

  // close modals
  const handleClose = () => {
    setOpenHours(false);
  };

  const follow = (follow: boolean) => {
    favoritePlace(parseInt(props.id || '0'), follow).then(() => {
      getPlace(parseInt(props.id || '0'));
    });
  };

  return (
    <div>
      {place ? (
        <Box className="w-full max-w-5xl mx-auto px-4 py-6">
          {/* Avatar + Infos utilisateur */}
          <Box className="flex items-center space-x-4 mb-2">
            <Avatar
              src={avatarUrl}
              alt="Profile"
              sx={{
                width: 72,
                height: 72,
                border: '3px solid var(--primary-600)',
              }}
            />
            <Typography
              variant="h5"
              className="text-primary-600"
              sx={{ marginBottom: 1 }}
              fontWeight="bold"
            >
              {place.name}
            </Typography>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            {place.address && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: 1 }}
              >
                Adresse : {place.address}
              </Typography>
            )}
            {place.phone && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: 1 }}
              >
                Téléphone : {place.phone}
              </Typography>
            )}
            {place.website && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: 1 }}
                onClick={() => window.open(place.website)}
              >
                Site web : {place.website}
              </Typography>
            )}
          </Box>
          <Box className="flex gap-2 mt-4">
            {place.hours ? (
              <Button
                variant="contained"
                fullWidth
                onClick={openModal}
                sx={{
                  maxWidth: '200px',
                  color: 'white !important',
                  backgroundColor: 'var(--primary-600)', // si ta couleur Tailwind est en CSS var
                  '&:hover': {
                    backgroundColor: 'var(--primary-700)',
                  },
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Horaires
              </Button>
            ) : null}
            {place && place.isFavorite ? (
              <Button
                variant="contained"
                fullWidth
                onClick={() => follow(false)}
                sx={{
                  maxWidth: '200px',
                  color: 'white !important',
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
            {!place.isFavorite ? (
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
          <Dialog
            open={openHours}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>Modifier les horaires de la salle</DialogTitle>
            <DialogContent></DialogContent>
          </Dialog>
        </Box>
      ) : (
        ''
      )}
    </div>
  );
};

export default PlaceHeader; // Don’t forget to use export default!
