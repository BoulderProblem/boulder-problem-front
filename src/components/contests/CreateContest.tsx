import { Box, Dialog, DialogActions } from '@mui/material';
import { useFormik } from 'formik';
import { useContests } from '@/services/useContests';
import { usePlaces } from '@/services/usePlaces';
import { useAuth } from '@/services/useAuth';
import {
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Autocomplete,
} from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useEffect } from 'react';

const CreateContest = ({ openAddContest, handleClose }: any) => {
  const { getPlaces, places } = usePlaces();
  const { user } = useAuth();
  const { addContest, getMyContests } = useContests();

  useEffect(() => {}, [openAddContest]);

  // Fonction pour effectuer la recherche via l'API
  const fetchPlaces = async (query: string) => {
    getPlaces(query, 1);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      user_id: user?.id,
      description: '',
      start_date: '',
      end_date: '',
      place_id: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Un nom est requis'),
      description: Yup.string().required('Une description est requise'),
      place_id: Yup.string().required('Une salle est requise'),
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

  return (
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

          <Autocomplete
            fullWidth
            id="place_id"
            onChange={(_event: any, newValue: any) => {
              formik.setFieldValue('place_id', newValue.id);
            }}
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
          {formik.errors.place_id && formik.touched.place_id && (
            <p style={{ color: '#ff4444' }}>{formik.errors.place_id}</p>
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
                        onBlur: () => formik.setFieldTouched('end_date', true), // Marquer le champ comme "touché"
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
          Créer
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateContest;
