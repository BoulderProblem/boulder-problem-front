import React, { useEffect, useImperativeHandle, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { usePlaces } from '@/services/usePlaces';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WAY } from '@/types/way';

const Way = React.forwardRef((props: { wallId: string }, ref) => {
  const { ways, colors, difficulties, getWay, updateWay, addWay, deleteWay } =
    usePlaces();
  const [openDeleteWay, setOpenDeleteWay] = useState(false);
  const [openAddWay, setOpenAddWay] = useState(false);
  const [wayId, setWayId] = useState('');

  useEffect(() => {}, []);
  // close modals

  const formikWay = useFormik({
    initialValues: {
      id: '',
      name: '',
      colorId: '',
      difficultyId: '',
      routeSetter: '',
      style: '',
      wallId: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Un nom de voie est requis'),
      colorId: Yup.string().required('Une couleur est requise'),
      difficultyId: Yup.string().required('Une difficultée est requise'),
      routeSetter: Yup.string().required('Un ouvreur est requis'),
      style: Yup.string().required('Entrez un style de voie'),
    }),
    onSubmit: (values) => {
      handleAddWay(values); // Ferme le modal après soumission
    },
  });

  useImperativeHandle(ref, () => ({
    openModalWay() {
      openModalWay();
    },
  }));

  // close modals
  const handleClose = () => {
    setOpenDeleteWay(false);
    setOpenAddWay(false);
  };

  const openModalDeleteWay = (id: string) => {
    setWayId(id);
    setOpenDeleteWay(true);
  };

  // delete way
  function handleDeleteWay() {
    deleteWay(wayId, props.wallId);
    handleClose();
  }

  const [orderWay, setOrderWay] = useState('asc');
  const [orderWayBy, setOrderWayBy] = useState('id');

  const handleRequestSortWay = (property: string) => {
    const isAsc = orderWayBy === property && orderWay === 'asc';
    setOrderWay(isAsc ? 'desc' : 'asc');
    setOrderWayBy(property);
  };
  let sortedWays: WAY[] = [];
  if (ways) {
    sortedWays = [...ways].sort((a, b) => {
      if (a[orderWayBy] < b[orderWayBy]) return orderWay === 'asc' ? -1 : 1;
      if (a[orderWayBy] > b[orderWayBy]) return orderWay === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const openModalWay = (id?: number) => {
    if (id) {
      getWay(id).then((response) => {
        setWayId(response.id);
        setOpenAddWay(true);
        formikWay.setValues(response);
      });
    } else {
      setOpenAddWay(true);
      formikWay.resetForm();
    }
  };

  // add way
  function handleAddWay(values: any) {
    if (values.id) {
      // update Way
      updateWay(values.id, values);
      handleClose();
    } else {
      //  crate way
      values.wallId = props.wallId;
      addWay(values);
      handleClose();
    }
  }

  return (
    <div>
      <h1 className="text-center mt-10 mb-5 mx-5">Voies</h1>
      <table className="table table-fixed text-center">
        <thead>
          <tr>
            <th
              className="cursor-pointer"
              onClick={() => handleRequestSortWay('name')}
            >
              Nom / style
              {orderWayBy === 'name' &&
                (orderWay === 'asc' ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                ))}
            </th>
            <th
              className="cursor-pointer"
              onClick={() => handleRequestSortWay('difficultyId')}
            >
              Difficulté
              {orderWayBy === 'difficultyId' &&
                (orderWay === 'asc' ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                ))}
            </th>
            <th
              className="cursor-pointer"
              onClick={() => handleRequestSortWay('routeSetter')}
            >
              Ouvreur
              {orderWayBy === 'routeSetter' &&
                (orderWay === 'asc' ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                ))}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ways &&
            sortedWays.map((way: any) => (
              <tr
                key={way.id}
                className={way.id == props.wallId ? 'bg-base-200' : ''}
              >
                <th>
                  {way.name}
                  <br />
                  {way.style}
                </th>
                <th>
                  <div
                    style={{
                      backgroundColor: way.color.color,
                      borderColor: way.color.color,
                    }}
                    className="badge badge-neutral"
                  >
                    {way.color.label}
                  </div>
                  <br />
                  {way.difficulty.label}
                </th>
                <th>{way.routeSetter}</th>
                <th>
                  <div className="dropdown dropdown-hover dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn m-1 bg-base-300"
                    >
                      Actions
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
                    >
                      <li>
                        <a onClick={() => openModalWay(way.id)}>
                          Modifier la voie
                        </a>
                      </li>
                      <li>
                        <a onClick={() => openModalDeleteWay(way.id)}>
                          supprimer la voie
                        </a>
                      </li>
                    </ul>
                  </div>
                </th>
              </tr>
            ))}
        </tbody>
      </table>

      <Dialog
        open={openAddWay}
        onClose={handleClose}
        maxWidth={'xs'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: 'dark:bg-zinc-700',
        }}
      >
        <DialogTitle>
          {formikWay.values.id !== '' ? 'Modifier une voie' : 'Ajouter la voie'}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Nom de la voie"
              fullWidth
              variant="standard"
              name="name"
              value={formikWay.values.name}
              onChange={formikWay.handleChange}
              className="p-2.5"
            />
            {formikWay.errors.name && formikWay.touched.name && (
              <p style={{ color: '#ff4444' }}>{formikWay.errors.name}</p>
            )}
            <TextField
              id="standard-select-currency"
              select
              fullWidth
              label="Couleur"
              variant="standard"
              name="colorId"
              value={formikWay.values.colorId}
              onChange={formikWay.handleChange}
            >
              {colors &&
                colors.map((color: any) => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.label}
                  </MenuItem>
                ))}
            </TextField>
            {formikWay.errors.colorId && formikWay.touched.colorId && (
              <p style={{ color: '#ff4444' }}>{formikWay.errors.colorId}</p>
            )}
            <TextField
              id="standard-select-currency"
              select
              fullWidth
              label="Difficultée"
              variant="standard"
              name="difficultyId"
              value={formikWay.values.difficultyId}
              onChange={formikWay.handleChange}
            >
              {difficulties &&
                difficulties.map((difficulty: any) => (
                  <MenuItem key={difficulty.id} value={difficulty.id}>
                    {difficulty.label}
                  </MenuItem>
                ))}
            </TextField>
            {formikWay.errors.difficultyId &&
              formikWay.touched.difficultyId && (
                <p style={{ color: '#ff4444' }}>
                  {formikWay.errors.difficultyId}
                </p>
              )}
            <TextField
              id="standard-basic"
              label="Ouvreur"
              fullWidth
              variant="standard"
              name="routeSetter"
              value={formikWay.values.routeSetter}
              onChange={formikWay.handleChange}
              className="p-2.5"
            />
            {formikWay.errors.routeSetter && formikWay.touched.routeSetter && (
              <p style={{ color: '#ff4444' }}>{formikWay.errors.routeSetter}</p>
            )}
            <TextField
              id="standard-basic"
              label="Style"
              fullWidth
              variant="standard"
              name="style"
              value={formikWay.values.style}
              onChange={formikWay.handleChange}
              className="p-2.5"
            />
            {formikWay.errors.style && formikWay.touched.style && (
              <p style={{ color: '#ff4444' }}>{formikWay.errors.style}</p>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button
            className="btn"
            type="submit"
            onClick={() => formikWay.handleSubmit()}
          >
            {formikWay.values.id !== ''
              ? 'Modifier une voie'
              : 'Ajouter la voie'}
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteWay}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Supprimer la voie</DialogTitle>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button className="btn" onClick={handleDeleteWay}>
            Supprimer
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default Way; // Don’t forget to use export default!
