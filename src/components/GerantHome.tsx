'use client';

import { usePlaces } from '@/services/usePlaces';
import { useContests } from '@/services/useContests';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import * as Yup from 'yup';
import { useAuth } from '@/services/useAuth';
import Status from '@/enums/status';

export function GerantHome() {
  const { getMyPlaces, myPlaces } = usePlaces();
  const { user } = useAuth();
  const { getMyContests, addContest, myContests } = useContests();
  useEffect(() => {
    getMyPlaces();
    getMyContests();
  }, []);

  const [openAddContest, setOpenAddContest] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      user_id: user?.id,
      description: '',
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

      addContest(values).then(() => {
        getMyContests();
        handleClose();
      });
    },
  });

  // close modals
  const handleClose = () => {
    setOpenAddContest(false);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <div className="bg-base-300 rounded-3xl p-3">
            <table className="table table-fixed">
              {/* head */}
              <thead>
                <tr>
                  <th className="text-lg text-primary-600">Mes salles</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myPlaces &&
                  myPlaces.map((place: any) => (
                    <tr
                      key={place.id}
                      className="rounded-3xl hover:bg-base-100"
                    >
                      <td>
                        <Link
                          to={'/places/' + place.id}
                          className="block w-full h-full"
                        >
                          {place.name}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={'/places/' + place.id}
                          className="block w-full h-full"
                        >
                          {place.favoriteCount} favoris
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <div className="bg-base-300 rounded-3xl p-3">
            <table className="table table-fixed">
              {/* head */}
              <thead>
                <tr>
                  <th className="text-lg text-primary-600">Mes contests</th>
                  <th></th>
                  <th
                    className="flex justify-end cursor-pointer"
                    onClick={() => {
                      setOpenAddContest(true);
                      formik.resetForm();
                    }}
                  >
                    <Add />
                  </th>
                </tr>
              </thead>
              <tbody>
                {myContests &&
                  myContests.map((contest: any) => (
                    <tr key={contest.id}>
                      <td>
                        <Link
                          to={`/contests/${contest.id}`}
                          className="block w-full h-full"
                        >
                          {contest.name}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/contests/${contest.id}`}
                          className="block w-full h-full"
                        >
                          {Status[contest.status as keyof typeof Status]}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/contests/${contest.id}`}
                          className="block w-full h-full"
                        >
                          {contest.followCount} participants
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <div className="bg-base-300 rounded-3xl p-5">
            <p className="font-bold text-lg text-primary-600">Mon abonnement</p>
            <p className="my-3">20€ / mois</p>
          </div>
        </Grid>
        <Grid size={{ xs: 6, sm: 2 }}>
          <div className="bg-base-300 rounded-3xl p-5">
            <p className="font-bold text-lg text-primary-600">Mon abonnement</p>
            <p className="my-3">20€ / mois</p>
          </div>
        </Grid>
      </Grid>

      <Dialog
        open={openAddContest}
        onClose={handleClose}
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: 'dark:bg-zinc-700',
        }}
      >
        <DialogTitle>Créer un contest</DialogTitle>
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
              label="Description"
              fullWidth
              variant="standard"
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="p-2.5 m-2"
            />
            {formik.errors.description && formik.touched.description && (
              <p style={{ color: '#ff4444' }}>{formik.errors.description}</p>
            )}

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
            Créer
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
