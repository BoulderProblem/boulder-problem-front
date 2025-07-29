'use client';

import usePlaces from '@/services/usePlaces';
import Grid from '@mui/material/Grid2';
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
} from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import * as Yup from 'yup';

export function GerantHome() {
  const { getMyPlaces, myPlaces } = usePlaces();
  useEffect(() => {
    getMyPlaces();
  }, []);

  const [openAddContest, setOpenAddContest] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      start: null,
      end: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Un titre est requis'),
      description: Yup.string().required('Une description est requise'),
      start: Yup.date().required('Une date de début est requise'),
      end: Yup.date().required('Une date de fin est requise'),
    }),
    onSubmit: (values) => {
      handleClose(); // Ferme le modal après soumission
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
                        <Link to={'/places/' + place.id}>{place.name}</Link>
                      </td>
                      <td>
                        <Link to={'/places/' + place.id}>
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
                <tr key="1">
                  <td>plop plop</td>
                  <td>12 participants</td>
                </tr>
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
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="p-2.5"
            />
            {formik.errors.title && formik.touched.title && (
              <p style={{ color: '#ff4444' }}>{formik.errors.title}</p>
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
                      name="start"
                      value={
                        formik.values.start ? dayjs(formik.values.start) : null
                      } // Assurez-vous que c'est un objet Dayjs
                      onChange={(value) => formik.setFieldValue('start', value)} // Lorsque la date est sélectionnée, mettre à jour la valeur avec Dayjs
                      onBlur={() => formik.setFieldTouched('start', true)} // Marquer le champ comme "touché"
                      slotProps={{
                        textField: { variant: 'standard' },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {formik.errors.start && formik.touched.start && (
                  <p style={{ color: '#ff4444' }}>{formik.errors.start}</p>
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
                      name="end"
                      value={
                        formik.values.end ? dayjs(formik.values.end) : null
                      } // Assurez-vous que c'est un objet Dayjs
                      onChange={(value) => formik.setFieldValue('end', value)} // Lorsque la date est sélectionnée, mettre à jour la valeur avec Dayjs
                      onBlur={() => formik.setFieldTouched('end', true)} // Marquer le champ comme "touché"
                      slotProps={{
                        textField: { variant: 'standard' },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {formik.errors.end && formik.touched.end && (
                  <p style={{ color: '#ff4444' }}>{formik.errors.end}</p>
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
