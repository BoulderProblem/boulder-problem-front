import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '@mui/material/styles';
import {
  IconButton,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Autocomplete,
  Grid,
  Tabs,
  Tab,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useContests } from '@/services/useContests';
import { useAuth } from '@/services/useAuth';
import { useNavigate, useParams } from 'react-router';
import Status from '@/enums/status';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usePlaces } from '@/services/usePlaces';
import WayTreeView from './WayTreeView';
import { RANKING } from '@/types/ranking';
import { useAvatar } from '@/hooks/useAvatar';
import WayCard from '../places/wayCard';

const Contest = () => {
  const { id } = useParams() as { id: string };
  const { user, token } = useAuth();
  const { place, places, allWays, getPlace, getPlaces, getAllWays } =
    usePlaces();
  const {
    getContest,
    getContestWays,
    updateContest,
    deleteContest,
    getContestUsers,
    getContestRanking,
    followContest,
    getWayComments,
    addWayComment,
    saveRating,
    saveValid,
    contest,
    contestWays,
    contestUsers,
    contestRanking,
  } = useContests();

  const navigate = useNavigate();

  const [openPlace, setOpenPlace] = useState(false);
  const [openWay, setOpenWay] = useState(false);
  const [openUpdateContest, setOpenUpdateContest] = useState(false);
  const [openDeleteContest, setOpenDeleteContest] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm')); // small = >=600px

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const locale = navigator.language || 'fr';
  dayjs.locale(locale);
  useEffect(() => {
    getContest(id);
    getContestWays(id);
    getContestUsers(id);
    getContestRanking(id);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      user_id: user?.id,
      description: '',
      status: '',
      start_date: '',
      end_date: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Un nom est requis'),
      description: Yup.string().required('Une description est requise'),
      start_date: Yup.date().required('Une date de début est requise'),
      end_date: Yup.date().required('Une date de fin est requise'),
    }),
    onSubmit: (values) => {
      values.start_date = dayjs(values.start_date).format('YYYY/MM/DD');
      values.end_date = dayjs(values.end_date).format('YYYY/MM/DD');

      updateContest(id, values).then(() => {
        getContest(id);
      });
      handleClose();
    },
  });

  const openModal = () => {
    formik.setValues({
      name: contest ? contest.name : '',
      user_id: user?.id,
      description: contest ? contest.description : '',
      status: contest ? contest.status : '',
      start_date: contest ? contest.startDate : null,
      end_date: contest ? contest.endDate : null,
    });
    setOpenUpdateContest(true);
  };

  const saveValidWay = (wayId: number, status: string) => {
    saveValid(wayId, status, id);
  };
  /**
   * get ways and open modal for add ways
   */
  const openModalWay = () => {
    getPlace(contest.placeId);
    getAllWays(contest.placeId);
    setOpenWay(true);
  };

  const openModalPlace = () => {
    fetchPlaces('');
    setOpenWay(false);
    setOpenPlace(true);
  };

  // Fonction pour effectuer la recherche via l'API
  const fetchPlaces = async (query: string) => {
    getPlaces(query, 1);
  };

  const selectPlace = (place: any) => {
    handleClose();
    getPlace(place.id);
    getAllWays(place.id);
    setOpenWay(true);
  };

  const follow = (follow: boolean) => {
    followContest(id, follow).then(() => {
      getContest(id);
      getContestUsers(id);
    });
  };

  const validDelete = () => {
    deleteContest(id);
    handleClose();
    navigate('/');
  };

  // close modals
  const handleClose = () => {
    setOpenUpdateContest(false);
    setOpenDeleteContest(false);
    setOpenPlace(false);
    setOpenWay(false);
  };

  const enumToArray = (data: any): any =>
    Object.keys(data)
      .filter((key) => Number.isNaN(+key))
      .map((key: string) => ({
        key: data[key],
        value: key,
      }));

  // Contenus des onglets
  const tabContents = [
    {
      label: <div>Description</div>,
      content: (
        <div className="text-base whitespace-pre-line">
          {contest && contest.description}
        </div>
      ),
    },
    {
      label: <div>Participants</div>,
      content: (
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
            gap: 2,
          }}
        >
          {contestUsers &&
            contestUsers.map((user: any) => (
              <UserCard key={user.id} user={user} token={token} />
            ))}
        </Box>
      ),
    },
    {
      label: <div>voies</div>,
      content: (
        <Box>
          {contest && user?.id === contest.userId ? (
            <Button onClick={() => openModalWay()}>
              <IconButton color="primary" component="span">
                <AddIcon />
              </IconButton>
              Ajouter des voies
            </Button>
          ) : null}
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
              gap: 2,
            }}
          >
            {contestWays &&
              contestWays.map((way: any) => (
                <WayCard
                  key={way.id}
                  way={way}
                  ways={contestWays}
                  saveRating={saveRating}
                  getWayComments={getWayComments}
                  addWayComment={addWayComment}
                  saveValid={saveValidWay}
                />
              ))}
          </Box>
        </Box>
      ),
    },
    {
      label: <div>Classement</div>,
      content: (
        <TableContainer
          component={Paper}
          sx={{ width: '100%', borderRadius: 6 }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Place</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contestRanking &&
                contestRanking.map((ranking: RANKING, index: number) => (
                  <TableRowItem
                    key={index}
                    index={index}
                    ranking={ranking}
                    token={token}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ),
    },
  ];

  return (
    <div>
      {!contest ? (
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
        <div>
          <Box
            className="w-full max-w-5xl mx-auto px-4 py-6"
            sx={{ marginTop: 4 }}
          >
            <Typography
              variant="h5"
              className="text-primary-600 flex justify-center"
              sx={{ marginBottom: 1 }}
              fontWeight="bold"
            >
              {contest.name}
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{ marginTop: 1 }}
            >
              Salle : {contest.place.name}
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{ marginTop: 1 }}
            >
              Statut : {Status[contest.status as keyof typeof Status]}
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{ marginTop: 1 }}
            >
              <span className="font-bold text-lg">
                {contest.followCount || '0'}
              </span>{' '}
              Inscrits
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{ marginTop: 1 }}
            >
              Début : {dayjs(contest.startDate).format('dddd D MMMM YYYY')}
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              sx={{ marginTop: 1 }}
            >
              Fin : {dayjs(contest.endDate).format('dddd D MMMM YYYY')}
            </Typography>
            <Box className="flex max-w-5xl mx-auto gap-2 mt-4">
              {user?.id === contest.userId || user?.roleId === 3 ? (
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
                  Modifier
                </Button>
              ) : null}
              {contestUsers &&
              contestUsers.filter((users: any) => users.id === user?.id)
                .length > 0 ? (
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
                  Se désinscrire
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => follow(true)}
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
                  S'inscrire
                </Button>
              )}
              {contest && contest.status === 'waiting' ? (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => follow(true)}
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
                  Supprimer
                </Button>
              ) : null}
            </Box>
          </Box>
          <Box className="max-w-5xl mx-auto w-full mt-7">
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              variant={isSmUp ? 'fullWidth' : 'standard'}
              className="bg-base-100"
              sx={{
                '& .MuiTab-root': {
                  minWidth: 0,
                  padding: '6px 8px',
                  fontSize: '0.8rem', // plus petit texte
                },
              }}
              aria-label="Onglets mobile"
            >
              {tabContents.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>

            <Box sx={{ p: 2, mt: 2 }}>{tabContents[tabIndex].content}</Box>
          </Box>
        </div>
      )}
      <Dialog
        open={openUpdateContest}
        onClose={handleClose}
        maxWidth={'md'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: 'dark:bg-zinc-700',
        }}
      >
        <DialogTitle>modifier le contest</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1 } }}
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <TextField
              label="Nom du contest"
              fullWidth
              variant="standard"
              id="title"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="p-2.5"
            />
            {formik.errors.name && formik.touched.name && (
              <p style={{ color: '#ff4444' }}>{formik.errors.name}</p>
            )}

            <TextField
              multiline
              label="Description"
              fullWidth
              variant="standard"
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="p-2.5 m-2"
              maxRows={15}
            />
            {formik.errors.description && formik.touched.description && (
              <p style={{ color: '#ff4444' }}>{formik.errors.description}</p>
            )}

            <TextField
              id="status"
              select
              fullWidth
              variant="standard"
              label="Statut"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
              className="p-2.5 m-2"
            >
              {enumToArray(Status).map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.key}
                </MenuItem>
              ))}
            </TextField>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="fr"
                >
                  <DemoContainer components={['DatePicker']}>
                    <MobileDatePicker
                      label="Date de début"
                      name="start_date"
                      value={
                        formik.values.start_date
                          ? dayjs(formik.values.start_date)
                          : null
                      } // Assurez-vous que c'est un objet Dayjs
                      onChange={(value) =>
                        formik.setFieldValue('start_date', value)
                      } // Lorsque la date est sélectionnée, mettre à jour la valeur avec Dayjs
                      slotProps={{
                        textField: {
                          variant: 'standard',
                          onBlur: () =>
                            formik.setFieldTouched('start_date', true), // Marquer le champ comme "touché"
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {formik.errors.start_date && formik.touched.start_date && (
                  <p style={{ color: '#ff4444' }}>{formik.errors.start_date}</p>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="fr"
                >
                  <DemoContainer components={['DatePicker']}>
                    <MobileDatePicker
                      label="Date de fin"
                      name="end_date"
                      value={
                        formik.values.end_date
                          ? dayjs(formik.values.end_date)
                          : null
                      } // Assurez-vous que c'est un objet Dayjs
                      onChange={(value) =>
                        formik.setFieldValue('end_date', value)
                      } // Lorsque la date est sélectionnée, mettre à jour la valeur avec Dayjs
                      slotProps={{
                        textField: {
                          variant: 'standard',
                          onBlur: () =>
                            formik.setFieldTouched('end_date', true), // Marquer le champ comme "touché"
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {formik.errors.end_date && formik.touched.end_date && (
                  <p style={{ color: '#ff4444' }}>{formik.errors.end_date}</p>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button
            className="btn"
            type="submit"
            onClick={() => formik.handleSubmit()}
          >
            Enregistrer
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteContest}
        onClose={handleClose}
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: 'dark:bg-zinc-700',
        }}
      >
        <DialogTitle>Voulez vous supprimer le contest ?</DialogTitle>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Annuler
          </button>
          <button className="btn" type="submit" onClick={validDelete}>
            Supprimer
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPlace}
        onClose={handleClose}
        maxWidth={'lg'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: '500px',
            maxWidth: '90%',
          },
          className: 'dark:bg-zinc-700',
        }}
      >
        <DialogTitle>Choisissez une salle</DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
            onChange={(_event: any, newValue: any) => {
              selectPlace(newValue);
            }}
            id="controllable-states-demo"
            options={places ? places.data : []}
            getOptionLabel={(option: any) =>
              option.name + ' ' + option.address || ''
            }
            getOptionKey={(option: any) => option.id}
            onInputChange={(event, newInputValue) => {
              if (event && !event.cancelable) fetchPlaces(newInputValue);
            }}
            disabled={user && user.roleId === 2}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Salle"
                variant="standard"
                className="p-2.5"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openWay}
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
        <button
          onClick={openModalPlace}
          className="md:absolute top-0 right-0 text-sm text-end mt-5 mr-5"
        >
          changer de salle
        </button>
        <DialogTitle className="mt-10 md:mt-0">
          {place && place.name}{' '}
        </DialogTitle>

        <DialogTitle>Choisissez les voies</DialogTitle>
        <DialogContent>
          {allWays && contestWays && (
            <WayTreeView
              id={id}
              data={allWays}
              selectedId={contestWays.map((way: any) => way.id)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const UserCard = ({ user, token }: { user: any; token: string }) => {
  const avatarUrl = useAvatar(user.id, user.avatar, token, 'user');
  return (
    <Card
      key={user.id}
      sx={{
        borderRadius: 6,
        boxShadow: 3,
      }}
    >
      <Link to={'/users/' + user.id}>
        <CardActionArea>
          <CardContent sx={{ display: 'flex', width: '100%' }}>
            <Avatar
              src={avatarUrl}
              alt="Profile"
              sx={{
                width: 48,
                height: 48,
                border: '3px solid var(--primary-600)',
              }}
            />
            <div className="my-auto ms-3">
              <Typography>{user.firstname}</Typography>
              <Typography color="text.secondary">{user.lastname}</Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

const TableRowItem = ({
  index,
  ranking,
  token,
}: {
  index: number;
  ranking: RANKING;
  token: string;
}) => {
  const avatarUrl = useAvatar(ranking.user_id, ranking.avatar, token, 'user');
  return (
    <TableRow
      key={index}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {index + 1}
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={avatarUrl}
          alt="Profile"
          sx={{
            width: 48,
            height: 48,
            border: '3px solid var(--primary-600)',
          }}
        />
        <div className="my-auto ms-3">
          {ranking.firstname} {ranking.lastname}
        </div>
      </TableCell>
      <TableCell align="right">{ranking.score}</TableCell>
    </TableRow>
  );
};
export default Contest; // Don’t forget to use export default!
