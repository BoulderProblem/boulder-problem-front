import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { usePlaces } from '@/services/usePlaces';
import {
  TextField,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Box,
  MenuItem,
  InputAdornment,
  Grid,
  Avatar,
} from '@mui/material';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { PLACE } from '@/types/place';
import { useUsers } from '@/services/useUsers';
import AddressSearch from './AddressSearch';
import ImageCropUpload from './ImageCropUpload';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { format } from 'date-fns'; // Importation de la fonction de formatage de date
import { useAuth } from '@/services/useAuth';
import L from 'leaflet';
import icon from '@/assets/icon-map.svg';
import { useAvatar } from '@/hooks/useAvatar';
import { SearchPeopleOption, SearchPeopleTag } from '../searchPeople';

const Place = (props: any) => {
  const { place, getPlace, updatePlace, getPlaceZones, difficulties } =
    usePlaces();
  const { getUsers, users } = useUsers();
  const { token, user } = useAuth();

  const [inputs, setInputs] = useState<PLACE | null>(null);
  const [openHours, setOpenHours] = useState(false);
  let avatarUrl;

  const iconPerson = new L.Icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    popupAnchor: [-0, -0],
    iconSize: [40, 56],
  });

  useEffect(() => {
    getPlace(parseInt(props.id || '0')).then((response: PLACE) => {
      setInputs(response);
      initHoraires(response.hours);
      avatarUrl = useAvatar(response.id.toString(), '', token, 'place');
    });
    getPlaceZones(parseInt(props.id || '0'));
    getUsers('', 1);
  }, []);

  // close modals
  const handleClose = () => {
    setOpenHours(false);
  };

  const openModal = (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    setOpenHours(true);
  };

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values: any) => ({ ...values, [name]: value }));
  };

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

  /**
   * Enregistre le changement d'horaire
   * @param value // nouvel horaire
   * @param jour // jour sélectionnée
   * @param name // début ou fin
   */
  const handleChangeHoraires = (value: Date, jour: string, name: string) => {
    setHoraires((prevHoraires) => ({
      ...prevHoraires,
      [jour]: {
        ...prevHoraires[jour],
        [name]: format(value, 'HH:mm'),
      },
    }));
  };

  /**
   * enregistre si un jour à été coché ou non
   * @param jour // jour sélectionné
   * @param e // info sur la checkbox
   */
  const handleCheckboxChange = (jour: string, e: any) => {
    const { checked } = e.target;
    setHoraires((prevHoraires) => ({
      ...prevHoraires,
      [jour]: {
        ...prevHoraires[jour],
        ouvert: checked,
      },
    }));
  };

  /**
   * format les horaire pour les enregistre au bon format
   * @returns
   */
  const formatHoraires = () => {
    let plage: Array<any> = [];

    joursOuverts.forEach((jours: any) => {
      if (
        horaires[jours.jour].ouvert &&
        horaires[jours.jour].debut !== '' &&
        horaires[jours.jour].debut !== ''
      ) {
        plage.push(
          jours.en +
            ' ' +
            horaires[jours.jour].debut +
            '-' +
            horaires[jours.jour].fin
        );
      } else {
        plage.push(' ');
      }
    });

    for (let i = plage.length - 1; i > 0; i--) {
      let cut = 2;
      if (plage[i].slice(2, 3) === '-') cut = 3;
      if (
        plage[i].slice(plage[i].slice(2, 3) === '-' ? 5 : 2) ===
          plage[i - 1].slice(2) &&
        plage[i].slice(plage[i].slice(2, 3) === '-' ? 5 : 2) !== ''
      ) {
        plage[i - 1] =
          plage[i - 1].slice(0, 2) +
          '-' +
          plage[i].slice(plage[i].slice(2, 3) === '-' ? 3 : 0);
        plage.splice(i, 1);
      }
      if (plage[i] === ' ') {
        plage.splice(i, 1);
      }
    }

    return plage.join('; ');
  };

  /**
   * enregistre les info sur la salle
   * @param event
   */
  const handleSubmit = (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    // enregistre les horaires en les reformatants
    const formData = new FormData();
    Object.entries(inputs ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'owners') {
          formData.append(
            key,
            JSON.stringify(value.map((user: any) => user.id))
          );
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
    });
    formData.append('hours', formatHoraires());

    updatePlace(parseInt(props.id || '0'), inputs);
  };

  /**
   * Enregistre les info du gérant sélectionné
   * @param user
   */
  const setOwner = (user: any) => {
    // if (user) {
    //   setInputs((values: any) => ({ ...values, ownerId: user.id }));
    setInputs((values: any) => ({ ...values, owners: user }));
    // } else {
    //   setInputs((values: any) => ({ ...values, ownerId: null }));
    //   setInputs((values: any) => ({ ...values, owner: null }));
    // }
  };

  /**
   * Enregistre le logo recadré
   * @param croppedBlob
   */
  const saveLogo = (croppedBlob: Blob | null) => {
    if (croppedBlob) {
      // Convert Blob to File

      const formData = new FormData();
      Object.entries(inputs ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, JSON.stringify(value));
        }
      });
      formData.append('image', croppedBlob);

      updatePlace(parseInt(props.id || '0'), formData).then(() => {
        window.location.reload();
      });
    }
  };

  /**
   * Enregistre l'adresse décomposée
   * @param address
   * @param address_components
   */
  const setAddress = (
    address: string,
    housenumber: string,
    street: string,
    city: string,
    postcode: string,
    coordinate: { x: number; y: number }
  ) => {
    setInputs((values: any) => ({
      ...values,
      address: address,
      houseNumber: housenumber,
      street: street,
      city: city,
      postalCode: postcode,
      coordinate: coordinate,
    }));
  };

  // Fonction pour effectuer la recherche via l'API
  const fetchPersons = async (query: string) => {
    getUsers(query, 1);
  };

  return (
    <div>
      {inputs ? (
        <div>
          <div className="mt-5">
            <Grid container spacing={2}>
              <Grid size={{ xs: 3, sm: 3 }}>
                <div className="h-full flex items-center justify-end">
                  <div className="w-[6rem] h-[6rem] avatar">
                    {inputs && inputs.logo ? (
                      <div className="relative group overflow-hidden p-1">
                        <Avatar
                          src={avatarUrl}
                          alt="Profile"
                          sx={{
                            width: 72,
                            height: 72,
                          }}
                        />
                        <div className="absolute flex bottom-0 right-0 !w-10 !h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ImageCropUpload
                            onImageCropped={(croppedBlob) => {
                              //save image
                              saveLogo(croppedBlob);
                              // Tu peux l'envoyer à un serveur ou le prévisualiser
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <ImageCropUpload
                        onImageCropped={(croppedBlob) => {
                          //save image
                          saveLogo(croppedBlob);
                          // Tu peux l'envoyer à un serveur ou le prévisualiser
                        }}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 6, sm: 6 }}>
                <h1 className="text-center my-5">{inputs.name || ''}</h1>
              </Grid>
              <Grid size={{ xs: 3, sm: 3 }}>
                <div className="h-full m-auto ">
                  <p className="font-bold text-lg">
                    {place ? place.favoriteCount : 0}
                  </p>{' '}
                  favoris
                </div>
              </Grid>
            </Grid>
          </div>
          <Grid container spacing={2} columns={{ xs: 1, sm: 12 }}>
            <Grid size={8} className="p-6">
              <form className="space-y-4 md:space-y-6">
                <Grid container spacing={2}>
                  <Grid size={8}>
                    <TextField
                      id="standard-basic"
                      label="Nom de la salle"
                      fullWidth
                      variant="standard"
                      name="name"
                      value={inputs.name || ''}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid size={4}>
                    <div className="flex justify-evenly">
                      <div>
                        <button
                          className="btn text-white bg-primary-600 hover:bg-primary-700"
                          onClick={openModal}
                        >
                          Horaires
                        </button>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <AddressSearch
                    onAddressSelect={(
                      address,
                      housenumber,
                      street,
                      city,
                      postcode,
                      coordinates
                    ) => {
                      setAddress(
                        address,
                        housenumber,
                        street,
                        city,
                        postcode,
                        coordinates
                      );
                    }}
                    address={inputs.address}
                  />
                  <Grid size={{ xs: 5, sm: 2 }}>
                    <TextField
                      id="standard-basic"
                      label="Numéro"
                      fullWidth
                      variant="standard"
                      name="houseNumber"
                      value={inputs.houseNumber || ''}
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 7, sm: 4 }}>
                    <TextField
                      id="standard-basic"
                      label="Rue"
                      fullWidth
                      variant="standard"
                      name="street"
                      value={inputs.street || ''}
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 5, sm: 3 }}>
                    <TextField
                      id="standard-basic"
                      label="Code postal"
                      fullWidth
                      variant="standard"
                      name="postalCode"
                      value={inputs.postalCode || ''}
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 7, sm: 3 }}>
                    <TextField
                      id="standard-basic"
                      label="Ville"
                      fullWidth
                      variant="standard"
                      name="city"
                      value={inputs.city || ''}
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 5, sm: 5 }}>
                    <TextField
                      id="standard-basic"
                      label="Téléphone"
                      fullWidth
                      variant="standard"
                      name="phone"
                      value={inputs.phone || ''}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 7, sm: 7 }}>
                    <TextField
                      id="standard-basic"
                      label="Site web"
                      fullWidth
                      variant="standard"
                      name="website"
                      value={inputs.website || ''}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                      id="standard-basic"
                      label="Difficultée min"
                      select
                      fullWidth
                      variant="standard"
                      name="gradeMin"
                      value={inputs.gradeMin || ''}
                      onChange={handleChange}
                    >
                      {difficulties &&
                        difficulties.map((difficulty: any) => (
                          <MenuItem
                            key={difficulty.label}
                            value={difficulty.label}
                          >
                            {difficulty.label}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                      id="standard-basic"
                      label="Difficultée max"
                      select
                      fullWidth
                      variant="standard"
                      name="gradeMax"
                      value={inputs.gradeMax || ''}
                      onChange={handleChange}
                    >
                      {difficulties &&
                        difficulties.map((difficulty: any) => (
                          <MenuItem
                            key={difficulty.label}
                            value={difficulty.label}
                          >
                            {difficulty.label}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                      id="standard-basic"
                      label="Hauteur min"
                      fullWidth
                      variant="standard"
                      name="lengthMin"
                      value={inputs.lengthMin || ''}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">m</InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 2 }}>
                    <TextField
                      id="standard-basic"
                      label="Hauteur max"
                      fullWidth
                      variant="standard"
                      name="lengthMax"
                      value={inputs.lengthMax || ''}
                      onChange={handleChange}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">m</InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Autocomplete
                      multiple
                      fullWidth
                      value={inputs.owners || []} // tableau des propriétaires sélectionnés
                      onChange={(_event, newValue) => {
                        setOwner(newValue); // newValue est un tableau
                      }}
                      id="owners-autocomplete"
                      options={users ? users.data : []}
                      getOptionLabel={(option: any) =>
                        option.firstname + ' ' + option.lastname || ''
                      }
                      getOptionKey={(option: any) => option.id}
                      onInputChange={(event, newInputValue) => {
                        if (event && !event.cancelable)
                          fetchPersons(newInputValue);
                      }}
                      disabled={user && user.roleId !== 3}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Gérants"
                          variant="standard"
                          className="p-2.5"
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          <SearchPeopleOption
                            user={option}
                            token={token}
                            key={option.id}
                            mb={0.5}
                          />
                        </li>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option) => (
                          <SearchPeopleTag
                            user={option}
                            token={token}
                            getTagProps={getTagProps}
                            key={option.id}
                          />
                        ))
                      }
                    />
                  </Grid>
                </Grid>

                <div className="flex justify-evenly">
                  <div>
                    <button
                      className="btn text-white bg-primary-600 hover:bg-primary-700"
                      onClick={handleSubmit}
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </form>
            </Grid>
            <Grid size={4} className="max-h-[500px] min-h-[300px] p-6">
              <div className="map-container h-full">
                <MapContainer
                  center={[inputs.coordinate.y, inputs.coordinate.x]}
                  zoom={13}
                  className="h-full rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="http://www.boulder-problem.chabs.fr/">boulder-problem</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    key={1}
                    position={[inputs.coordinate.y, inputs.coordinate.x]}
                    icon={iconPerson}
                  ></Marker>
                </MapContainer>
              </div>
            </Grid>
          </Grid>
          {/* horaire dialog */}
          <Dialog
            open={openHours}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>Modifier les horaires de la salle</DialogTitle>
            <DialogContent>
              <Box
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1 } }}
                noValidate
                autoComplete="off"
              >
                {Object.entries(horaires).map(
                  ([jour, { ouvert, debut, fin }]) => (
                    <div key={jour}>
                      <Grid container spacing={2}>
                        <Grid size={4}>
                          <FormControlLabel
                            label={jour.charAt(0).toUpperCase() + jour.slice(1)}
                            labelPlacement="start"
                            className="h-[4.9rem] w-full pr-4 min-w-28"
                            control={
                              <Checkbox
                                checked={ouvert}
                                onChange={(e) => handleCheckboxChange(jour, e)}
                              />
                            }
                          />
                        </Grid>
                        {ouvert && (
                          <>
                            <Grid size={4}>
                              <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="fr"
                              >
                                <DemoContainer components={['DatePicker']}>
                                  <MobileTimePicker
                                    format="HH:mm"
                                    label="Début"
                                    slotProps={{
                                      textField: {
                                        variant: 'standard',
                                      },
                                    }}
                                    defaultValue={dayjs()
                                      .set(
                                        'hour',
                                        parseInt(debut.split(':')[0])
                                      )
                                      .set(
                                        'minute',
                                        parseInt(debut.split(':')[1])
                                      )}
                                    onChange={(newValue: any) =>
                                      handleChangeHoraires(
                                        newValue,
                                        jour,
                                        'debut'
                                      )
                                    }
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </Grid>

                            <Grid size={4}>
                              <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale="fr"
                              >
                                <DemoContainer
                                  components={['MobileTimePicker']}
                                >
                                  <MobileTimePicker
                                    format="HH:mm"
                                    label="fin"
                                    slotProps={{
                                      textField: {
                                        variant: 'standard',
                                      },
                                    }}
                                    defaultValue={dayjs()
                                      .set('hour', parseInt(fin.split(':')[0]))
                                      .set(
                                        'minute',
                                        parseInt(fin.split(':')[1])
                                      )}
                                    onChange={(newValue: any) =>
                                      handleChangeHoraires(
                                        newValue,
                                        jour,
                                        'fin'
                                      )
                                    }
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </div>
                  )
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <button className="btn" onClick={() => setOpenHours(false)}>
                Fermer
              </button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Place; // Don’t forget to use export default!
