import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { usePlaces } from '@/services/usePlaces';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { PLACE } from '@/types/place';
import 'dayjs/locale/fr';
import { useAuth } from '@/services/useAuth';
import Profile from './profile';

const PlaceHeader = (props: any) => {
  const { place, getPlace, getPlaceZones, favoritePlace } = usePlaces();
  const { token, user } = useAuth();

  const [openHours, setOpenHours] = useState(false);

  useEffect(() => {
    getPlace(parseInt(props.id || '0')).then((response: PLACE) => {
      initHoraires(response.hours);
    });
    getPlaceZones(parseInt(props.id || '0'));
  }, []);

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
    favoritePlace(parseInt(props.id || '0'), follow);
  };

  const updatePlace = (placeId: number) => {
    // redirect to update page
    window.location.href = `/places/${placeId}/update`;
  };

  return (
    <div>
      {place ? (
        <Box className="w-full max-w-2xl mx-auto px-4 py-6">
          {/* Avatar + Infos utilisateur */}
          <Profile place={place} token={token} />
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
            {place && !place.isFavorite ? (
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
            {user &&
            (user.roleId === 3 ||
              (place.owners &&
                place.owners.find((owner: any) => owner.id === user.id))) ? (
              <Button
                variant="contained"
                fullWidth
                onClick={() => updatePlace(place.id)}
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
                Modifier
              </Button>
            ) : null}
          </Box>
          <Dialog
            open={openHours}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              sx: {
                borderRadius: 6,
              },
            }}
          >
            <DialogTitle>Horaires d'ouverture de la salle</DialogTitle>
            <DialogContent>
              <Box sx={{ padding: 2 }}>
                {joursOuverts.map((jour) => (
                  <Box
                    key={jour.jour}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {jour.jour.charAt(0).toUpperCase() + jour.jour.slice(1)}
                    </Typography>
                    {horaires[jour.jour].ouvert ? (
                      <Typography variant="body1">
                        {horaires[jour.jour].debut} - {horaires[jour.jour].fin}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="error">
                        Fermé
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      ) : (
        ''
      )}
    </div>
  );
};

export default PlaceHeader; // Don’t forget to use export default!
