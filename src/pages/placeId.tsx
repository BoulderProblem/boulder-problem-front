import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePlaces } from '@/services/usePlaces';
import Place from '@/components/places/Place';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Way from '@/components/places/Way';
import Wall from '@/components/places/Wall';
import { Helmet } from 'react-helmet-async';

const PlaceId = () => {
  const { id } = useParams();
  const {
    zones,
    getColors,
    getDifficulties,
    getPlaceZones,
    getPlan,
    getZone,
    createWall,
    createZone,
    updateZone,
    getWalls,
    getWays,
  } = usePlaces();
  const [plan, setPlan] = useState('');
  const [wallId, setWallId] = useState('');
  const [wallName, setWallName] = useState('');
  const [zoneId, setZoneId] = useState('');

  type WayModalHandle = {
    openModalWay: () => void;
  };

  const wayRef = useRef<WayModalHandle>(null);

  const wallRef = useRef();

  useEffect(() => {
    getColors();
    getDifficulties();
    getPlaceZones(parseInt(id || '0'));
    getWalls(0);
    getWays(0);
  }, []);

  // set modal
  const [openWall, setOpenWall] = useState(false);
  const [openAddZone, setOpenAddZone] = useState(false);
  const [inputs, setInputs] = useState<any | null>(null);

  // close modals
  const handleClose = () => {
    setOpenWall(false);
    setOpenAddZone(false);
  };

  // set plan form
  const [file, setFile] = useState<any>();
  function handleChangeFile(event: any) {
    setFile(event.target.files[0]);
    // setInputs((values: any) => ({
    //   ...values,
    //   image: event.target.files[0],
    // }));
  }

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values: any) => ({ ...values, [name]: value }));
  };

  function handleAddZone() {
    const formData = new FormData();
    formData.append('name', inputs.name);
    formData.append('floor', inputs.floor);
    if (file) {
      formData.append('image', file);
    }
    if (inputs.id) {
      updateZone(zoneId, formData).then(() =>
        getPlaceZones(parseInt(id || '0'))
      );
    } else {
      formData.append('placeId', String(id));
      createZone(formData).then(() => getPlaceZones(parseInt(id || '0')));
    }
    handleClose();
  }

  // create wall
  const handleCreateWall = () => {
    setOpenWall(false);
    // create wall
    createWall(zoneId, wallName).then((response) => {
      // set new id
      document.getElementById(wallId)?.setAttribute('fill', '#46768B');
      document.getElementById(wallId)?.setAttribute('id', response.id);
      setWallId(response.id);
      getWays(response.id);
      var paths = document.querySelectorAll('[id^="temp"]');

      paths.forEach((element) => {
        element.removeAttribute('id');
      });

      // save svg
      var myBlob = new Blob(
        [
          document
            .getElementsByClassName('displaysvg')[0]
            .children[0].outerHTML.toString(),
        ],
        { type: 'image/svg+xml' }
      );

      const formData = new FormData();
      formData.append('image', myBlob, 'a.svg');

      updateZone(zoneId, formData).then(() => {
        getPlan(parseInt(zoneId)).then((response) => {
          setPlan(addIdToSVG(response));
        });
        getWalls(zoneId);
      });
    });
  };

  // show plan with selected wall
  const showPlan = (id_zone: string) => {
    setZoneId(id_zone);
    getPlan(parseInt(id_zone)).then((response) => {
      setPlan(addIdToSVG(response));
    });
    if (document.getElementById(wallId)) {
      document.getElementById(wallId)?.setAttribute('fill', '#46768B');
    }
    setWallId('');
    getZone(id_zone);
    getWays(0);
    getWalls(id_zone);
  };

  /**
   * action when click in wall into plan
   * @param event
   */
  const actionOnClick = (event: any) => {
    let id = event.target.getAttribute('id');

    if (id) {
      if (document.getElementById(wallId)) {
        document.getElementById(wallId)?.setAttribute('fill', '#46768B');
      }
      event.target.setAttribute('fill', '#ffffff');
      event.target.setAttribute('stroke', '#46768B');

      setWallId(id);

      //   // create wall if not already set
      if (id.slice(0, 4) === 'temp') {
        setOpenWall(true);
        setWallName('');
        getWays(0);
      } else {
        getWays(id);
        setWallName(id);
      }
    }
  };

  // action when click in wall list
  const selectWall = (id: string) => {
    if (document.getElementById(wallId)) {
      document.getElementById(wallId)?.setAttribute('fill', '#46768B');
    }
    document.getElementById(id)?.setAttribute('fill', '#ffffff');
    document.getElementById(id)?.setAttribute('stroke', '#46768B');
    setWallId(id.toString());
    getWays(id);
  };

  function addZoneModal(id?: string) {
    if (id) {
      setZoneId(id);
      if (document.getElementById(wallId)) {
        document.getElementById(wallId)?.setAttribute('fill', '#46768B');
      }
      getWalls(id);
      getZone(id).then((response) => {
        setInputs(response);
      });
    } else {
      setInputs(null);
    }
    setWallId('');
    getWays(0);
    setOpenAddZone(true);
    setFile(null);
  }

  function addIdToSVG(response: string) {
    let split = response.split('<path');

    let result = split[0];
    for (let i = 1; i < split.length; i++) {
      if (
        split[i].slice(1, 6).includes('id=') ||
        !split[i].includes('#46768B')
      ) {
        result += '<path' + split[i];
      } else {
        result += "<path id='temp-" + i + "'" + split[i];
      }
    }

    return result;
  }

  const openModalWay = () => {
    wayRef.current?.openModalWay();
  };

  const setWall = (value: string) => {
    selectWall(value);
  };

  return (
    <div className="overflow-¬x-auto">
      <Helmet>
        <title>Boulder problem</title>
        <meta name="description" content="page de la salle d'escalade" />
      </Helmet>
      <Place id={id} />
      <div>
        <h1 className="text-center mt-20 mb-5 mx-5">
          Zones
          <button
            className="btn absolute right-8 text-white bg-primary-600 hover:bg-primary-700"
            onClick={() => {
              addZoneModal();
            }}
          >
            Ajouter une Zone
            <AddIcon />
          </button>
        </h1>
        <Grid container spacing={2} columns={{ xs: 1, sm: 12 }}>
          <Grid size={8} className="p-3">
            <table className="table table-fixed">
              {/* head */}
              <thead>
                <tr>
                  <th>Zone sélectionnée</th>
                  <th>Nom</th>
                  <th>Étage</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {zones &&
                  zones.map((zone: any) => (
                    <tr
                      key={zone.id}
                      className={zone.id == zoneId ? 'bg-base-200' : ''}
                    >
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={zone.id === zoneId}
                          onChange={() => {
                            showPlan(zone.id);
                          }}
                        />
                      </th>
                      <th>{zone.name}</th>
                      <th>{zone.floor}</th>
                      <th>
                        {zone.image ? (
                          ''
                        ) : (
                          <button
                            className="btn"
                            onClick={() => addZoneModal(zone.id)}
                          >
                            Ajouter un plan
                          </button>
                        )}
                      </th>
                    </tr>
                  ))}
              </tbody>
              {/* foot */}
              <tfoot>
                <tr>
                  <th>Zone sélectionnée</th>
                  <th>Nom</th>
                  <th>Étage</th>
                  <th>Image</th>
                </tr>
              </tfoot>
            </table>
          </Grid>
          <Grid size={4} className="p-3">
            <div
              className="displaysvg grid max-h-[400px]"
              dangerouslySetInnerHTML={{
                __html: plan,
              }}
              onClick={(event) => {
                actionOnClick(event);
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={{ xs: 1, sm: 12 }}>
          <Grid size={6} className="p-3">
            <Wall
              wallId={wallId}
              openModalWay={openModalWay}
              setWall={setWall}
              ref={wallRef}
            ></Wall>
          </Grid>
          <Grid size={6} className="p-3">
            <Way wallId={wallId} ref={wayRef}></Way>
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={openWall}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle>Ce mur n'existe pas, voulez-vous le créer ?</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            label="Standard"
            fullWidth
            variant="standard"
            value={wallName}
            onChange={(e) => setWallName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Plus tard
          </button>
          <button className="btn" onClick={handleCreateWall}>
            Créer le mur
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddZone}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Ajouter une zone</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Nom de la zone"
              fullWidth
              variant="standard"
              name="name"
              value={(inputs && inputs.name) || ''}
              onChange={handleChange}
            />
            <TextField
              id="standard-basic"
              label="Etage"
              fullWidth
              variant="standard"
              name="floor"
              value={(inputs && inputs.floor) || ''}
              onChange={handleChange}
            />
            <TextField
              id="standard-basic"
              label="Plan de la zone"
              fullWidth
              type="file"
              variant="standard"
              value={(inputs && inputs.image) || ''}
              onChange={handleChangeFile}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button className="btn" onClick={handleAddZone}>
            Ajouter la zone
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlaceId;
