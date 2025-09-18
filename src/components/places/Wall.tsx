import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { usePlaces } from '@/services/usePlaces';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';

const Wall = React.forwardRef(
  (props: { wallId: string; openModalWay: any; setWall: any }, ref) => {
    const { walls, updateWall, getWalls, zone } = usePlaces();

    useEffect(() => {}, []);

    const [orderWall, setOrderWall] = useState('asc');
    const [orderWallBy, setOrderWallBy] = useState('id');
    const [wallId, setWallId] = useState('');
    const [wallName, setWallName] = useState('');
    const [openWall, setOpenWall] = useState(false);
    // close modals
    const handleClose = () => {
      setOpenWall(false);
    };

    const handleRequestSortWall = (property: string) => {
      const isAsc = orderWallBy === property && orderWall === 'asc';
      setOrderWall(isAsc ? 'desc' : 'asc');
      setOrderWallBy(property);
    };

    const saveWall = () => {
      console.log(zone);

      updateWall(wallId, { name: wallName, zone_id: zone?.id });
      getWalls(zone?.id);
      setOpenWall(false);
    };
    const sortedWalls = [...walls].sort((a, b) => {
      if (a[orderWallBy] < b[orderWallBy]) return orderWall === 'asc' ? -1 : 1;
      if (a[orderWallBy] > b[orderWallBy]) return orderWall === 'asc' ? 1 : -1;
      return 0;
    });

    return (
      <div>
        <h1 className="text-center mt-10 mb-5 mx-5">Mur</h1>
        <table className="table table-fixed">
          <thead>
            <tr>
              <th>Mur sélectionné {zone?.id}</th>
              <th
                className="cursor-pointer"
                onClick={() => handleRequestSortWall('name')}
              >
                Nom
                {orderWallBy === 'name' &&
                  (orderWall === 'asc' ? (
                    <ArrowUpwardIcon />
                  ) : (
                    <ArrowDownwardIcon />
                  ))}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {walls &&
              sortedWalls.map((wall: any) => (
                <tr
                  key={wall.id}
                  className={wall.id == props.wallId ? 'bg-base-200' : ''}
                >
                  <th onClick={() => props.setWall(wall.id)}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={wall.id == props.wallId}
                      onChange={() => props.setWall(wall.id)}
                    />
                  </th>
                  <th onClick={() => props.setWall(wall.id)}>{wall.name}</th>
                  <th onClick={() => props.setWall(wall.id)}>
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
                          <a
                            onClick={() => {
                              props.openModalWay();
                            }}
                          >
                            Ajouter une voie
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() => {
                              setWallName(wall.name);
                              setWallId(wall.id);
                              setOpenWall(true);
                            }}
                          >
                            Modifier le mur
                          </a>
                        </li>
                        <li>
                          <a>Modifier le mur</a>
                        </li>
                      </ul>
                    </div>
                  </th>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Mur sélectionné</th>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
        <Dialog
          open={openWall}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Modifier le mur</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { m: 1 } }}
              noValidate
              autoComplete="off"
            >
              <Grid container spacing={2}>
                <TextField
                  id="standard-basic"
                  label="Standard"
                  fullWidth
                  variant="standard"
                  value={wallName}
                  onChange={(e) => setWallName(e.target.value)}
                />
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <button className="btn" onClick={() => setOpenWall(false)}>
              Fermer
            </button>
            <button className="btn" onClick={() => saveWall()}>
              Modifier
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
);

export default Wall; // Don’t forget to use export default!
