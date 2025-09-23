import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { styled, useTheme } from '@mui/material/styles';
import {
  IconButton,
  MenuItem,
  SpeedDialAction,
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
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import RemoveIcon from '@mui/icons-material/Remove';
import ImageWithToken from 'react-image-with-auth';
import dayjs, { Dayjs } from 'dayjs';
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

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Contest = (props: any) => {
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
  const isMdUp = useMediaQuery(theme.breakpoints.down('md')); // mobile = <960px
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm')); // small = >=600px

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  dayjs.locale('fr');
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

  const openModalDelete = () => {
    setOpenDeleteContest(true);
  };

  const follow = () => {
    followContest(id).then(() => {
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

  const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  }));

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
              'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            gap: 2,
          }}
        >
          {contestUsers &&
            contestUsers.map((user: any) => (
              <Card
                key={user.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <Link to={'/users/' + user.id}>
                  <CardActionArea>
                    <CardContent sx={{ display: 'flex', width: '100%' }}>
                      <div className="avatar m-3">
                        <div className="rounded-full">
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
                        </div>
                      </div>
                      <div className="my-auto ms-3">
                        <Typography component="div">
                          {user.firstname}
                        </Typography>
                        <Typography color="text.secondary">
                          {user.lastname}
                        </Typography>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            ))}
        </Box>
      ),
    },
    {
      label: (
        <div className="relative">
          voies
          <div className="text-right absolute -right-6 md:-right-9 lg:right-0 -top-6 md:-top-7 lg:top-0">
            {contest && user?.id === contest.userId ? (
              <LightTooltip title="Ajouter une voie">
                <IconButton
                  onClick={() => openModalWay()}
                  color="primary"
                  component="span"
                >
                  <AddIcon />
                </IconButton>
              </LightTooltip>
            ) : null}
          </div>
        </div>
      ),
      content: (
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            gap: 2,
          }}
        >
          {contestWays &&
            contestWays.map((way: any) => (
              <Card
                key={way.id}
                sx={{
                  borderLeft: `6px solid ${way.color.color}`,
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardActionArea>
                  <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5" component="div">
                      {way.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      mur : {way.wall.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      salle : {way.wall.zone.place.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="pt-3"
                    >
                      difficultée : {way.difficulty.label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
        </Box>
      ),
    },
    {
      label: <div>Classement</div>,
      content: (
        <TableContainer component={Paper}>
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
                  <TableRow
                    key={ranking.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <div className="avatar">
                        <div className="rounded-full">
                          <ImageWithToken
                            imageUrl={
                              baseUrl +
                              '/users/' +
                              ranking.user_id +
                              '/avatar/' +
                              ranking.avatar +
                              '?size=40'
                            }
                            token={token}
                            alt="avatar"
                          />
                        </div>
                      </div>
                      <div className="my-auto ms-3">
                        {ranking.firstname} {ranking.lastname}
                      </div>
                    </TableCell>
                    <TableCell align="right">{ranking.score}</TableCell>
                  </TableRow>
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
        <div>Loading...</div>
      ) : (
        <div>
          <div className="m-5 relative">
            {!isSmUp ? (
              <div className="flex justify-center text-3xl my-10">
                {contest.name}
              </div>
            ) : (
              ''
            )}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <div className="text-right mr-3 md:mr-0">
                  <p className="font-bold my-3">
                    Statut : {Status[contest.status as keyof typeof Status]}
                  </p>
                  <p className="font-bold my-2">
                    Début :{' '}
                    {dayjs(contest.startDate).format('dddd D MMMM YYYY')}
                  </p>
                  <p className="font-bold my-2">
                    Fin : {dayjs(contest.endDate).format('dddd D MMMM YYYY')}
                  </p>
                </div>
              </Grid>
              {isSmUp ? (
                <Grid size={{ xs: 0, sm: 4 }}>
                  <div className="flex justify-center text-3xl my-10">
                    {contest.name}
                  </div>
                </Grid>
              ) : (
                ''
              )}
              <Grid size={{ xs: 6, sm: 4 }}>
                <div className=" ml-3 md:ml-0">
                  <p className="font-bold text-lg mt-10">
                    {contest.followCount || '0'}
                  </p>
                  Inscrits
                </div>
              </Grid>
            </Grid>
            <div className="text-right absolute w-16 right-0 top-0">
              {user?.id === contest.userId ? (
                <Box sx={{ mt: 0, height: 50 }}>
                  <StyledSpeedDial
                    key={'down'}
                    ariaLabel="SpeedDial playground example"
                    icon={<SettingsIcon />}
                    direction="down"
                    sx={{
                      '& .MuiFab-primary': {
                        width: 40,
                        height: 40,
                      },
                    }}
                    style={{
                      top: 0,
                      right: 0,
                    }}
                  >
                    <SpeedDialAction
                      key="update"
                      icon={<CreateIcon />}
                      onClick={() => openModal()}
                      slotProps={{
                        tooltip: {
                          title: 'Modifier',
                        },
                      }}
                    />
                    {contestUsers &&
                    contestUsers.filter((users: any) => users.id === user?.id)
                      .length > 0 ? (
                      <SpeedDialAction
                        key="delete"
                        icon={<RemoveIcon />}
                        onClick={() => follow()}
                        slotProps={{
                          tooltip: {
                            title: 'Se désinscrire',
                          },
                        }}
                      />
                    ) : (
                      <SpeedDialAction
                        key="add"
                        icon={<AddIcon />}
                        onClick={() => follow()}
                        slotProps={{
                          tooltip: {
                            title: "S'inscrire",
                          },
                        }}
                      />
                    )}
                    <SpeedDialAction
                      key="deleteOutline"
                      icon={<DeleteOutlineIcon />}
                      onClick={() => openModalDelete()}
                      slotProps={{
                        fab: {
                          disabled: contest.status !== 'waiting', // ✅ désactiver le bouton
                        },
                        tooltip: {
                          title: 'Supprimer',
                        },
                      }}
                    />
                  </StyledSpeedDial>
                </Box>
              ) : contestUsers &&
                contestUsers.filter((users: any) => users.id === user?.id)
                  .length > 0 ? (
                <LightTooltip title="Se désinscrire">
                  <IconButton
                    onClick={() => follow()}
                    color="primary"
                    component="span"
                  >
                    <RemoveIcon />
                  </IconButton>
                </LightTooltip>
              ) : (
                <LightTooltip title="S'inscrire">
                  <IconButton
                    onClick={() => follow()}
                    color="primary"
                    component="span"
                  >
                    <AddIcon />
                  </IconButton>
                </LightTooltip>
              )}
            </div>
          </div>
          <Divider />
          <Box sx={{ p: 2, marginTop: 5 }}>
            {isMdUp ? (
              // ✅ MOBILE VIEW - Tabs classiques
              <>
                <Tabs
                  value={tabIndex}
                  onChange={handleChange}
                  variant={isSmUp ? 'fullWidth' : 'standard'}
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

                <Box sx={{ mt: 2 }}>{tabContents[tabIndex].content}</Box>
              </>
            ) : (
              // ✅ DESKTOP VIEW - Tous les onglets visibles en colonne
              <Grid container spacing={2}>
                {tabContents.map((tab, index) => (
                  <Grid key={index} size={{ sm: 6, md: 6, lg: 3 }}>
                    <Typography>{tab.label}</Typography>
                    <Box className="mt-10">{tab.content}</Box>
                  </Grid>
                ))}
              </Grid>
            )}
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
            // value={inputs.owner}
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

export default Contest; // Don’t forget to use export default!
