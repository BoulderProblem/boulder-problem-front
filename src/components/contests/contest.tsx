import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import 'leaflet/dist/leaflet.css';
import { styled } from '@mui/material/styles';
import {
  IconButton,
  MenuItem,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ImageWithToken from 'react-image-with-auth';
import AddIcon from '@mui/icons-material/Add';
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

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const Contest = (props: any) => {
  const { id } = useParams() as { id: string };
  const { user, token } = useAuth();
  const {
    getContest,
    getContestWays,
    updateContest,
    deleteContest,
    getContestUsers,
    contest,
    contestWays,
    contestUsers,
  } = useContests();

  const navigate = useNavigate();

  const [openUpdateContest, setOpenUpdateContest] = useState(false);
  const [openDeleteContest, setOpenDeleteContest] = useState(false);

  dayjs.locale('fr');
  useEffect(() => {
    getContest(id);
    getContestWays(id);
    getContestUsers(id);
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

  const openModalDelete = () => {
    setOpenDeleteContest(true);
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

  return (
    <div>
      {!contest ? (
        <div>Loading...</div>
      ) : (
        <div className="m-5 relative">
          <Grid container spacing={2}>
            <Grid size={{ xs: 4, sm: 4 }}>
              <div className="text-right">
                <p className="font-bold my-3">
                  {Status[contest.status as keyof typeof Status]}
                </p>
                <p className="font-bold my-2">
                  Début : {dayjs(contest.startDate).format('dddd D MMMM YYYY')}
                </p>
                <p className="font-bold my-2">
                  Fin : {dayjs(contest.endDate).format('dddd D MMMM YYYY')}
                </p>
              </div>
            </Grid>
            <Grid size={{ xs: 4, sm: 4 }}>
              <div className="flex justify-center text-lg my-10">
                {contest.name}
              </div>
            </Grid>
            <Grid size={{ xs: 4, sm: 4 }}>
              <p className="font-bold text-lg mt-10">
                {contest.followCount || '0'}
              </p>
              Inscrits
            </Grid>
          </Grid>
          <div className="text-right absolute w-16 right-0 top-0">
            <Box sx={{ mt: 0, height: 50 }}>
              <StyledSpeedDial
                key={'down'}
                ariaLabel="SpeedDial playground example"
                icon={<SpeedDialIcon />}
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
                      title: 'update',
                    },
                  }}
                />
                <SpeedDialAction
                  key="delete"
                  icon={<DeleteOutlineIcon />}
                  onClick={() => openModalDelete()}
                  disabled={contest.status !== 'waiting'}
                  slotProps={{
                    tooltip: {
                      title: 'delete',
                    },
                  }}
                />
              </StyledSpeedDial>
            </Box>
          </div>

          <Grid container spacing={2}>
            <Grid size={{ md: 12, lg: 4 }}>
              <div className="max-w-3xl m-1 sm:m-20 whitespace-pre-line">
                <h1 className="mb-10">Description</h1>
                {contest.description}
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <div className="max-w-3xl m-1 sm:m-20 whitespace-pre-line">
                <h1 className="mb-10 relative">
                  Liste des voies
                  <div className="text-right absolute right-0 top-0">
                    <IconButton
                      onClick={() => openModal()}
                      color="primary"
                      component="span"
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                </h1>
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
                    contestWays.map((contest: any) => (
                      <Card
                        key={contest.id}
                        style={{
                          borderColor: contest.color.color,
                          borderWidth: 4,
                        }}
                      >
                        <CardActionArea
                          // onClick={() => setSelectedCard(index)}
                          // data-active={selectedCard === index ? '' : undefined}
                          sx={{
                            height: '100%',
                            '&[data-active]': {
                              backgroundColor: 'action.selected',
                              '&:hover': {
                                backgroundColor: 'action.selectedHover',
                              },
                            },
                          }}
                        >
                          <CardContent sx={{ height: '100%' }}>
                            <Typography variant="h5" component="div">
                              {contest.name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                              mur : {contest.wall.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              salle : {contest.wall.zone.place.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="pt-3"
                            >
                              difficultée : {contest.difficulty.label}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))}
                </Box>
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <div className="max-w-3xl m-1 sm:m-20 whitespace-pre-line">
                <h1 className="mb-10">Liste des participants</h1>
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
                      <Card key={contest.id}>
                        <CardActionArea
                          // onClick={() => setSelectedCard(index)}
                          // data-active={selectedCard === index ? '' : undefined}
                          sx={{
                            padding: 1,
                            height: '100%',
                            '&[data-active]': {
                              backgroundColor: 'action.selected',
                              '&:hover': {
                                backgroundColor: 'action.selectedHover',
                              },
                            },
                          }}
                        >
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
                              <Typography variant="h5" component="div">
                                {user.firstname}
                              </Typography>
                              <Typography variant="h6" color="text.secondary">
                                {user.lastname}
                              </Typography>
                            </div>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ))}
                </Box>
              </div>
            </Grid>
          </Grid>
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
                      onBlur={() => formik.setFieldTouched('start_date', true)} // Marquer le champ comme "touché"
                      slotProps={{
                        textField: { variant: 'standard' },
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
                      onBlur={() => formik.setFieldTouched('end_date', true)} // Marquer le champ comme "touché"
                      slotProps={{
                        textField: { variant: 'standard' },
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
    </div>
  );
};

export default Contest; // Don’t forget to use export default!
