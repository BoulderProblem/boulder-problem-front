import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import usePlaces from "@/services/usePlaces";
import Place from "@/components/places/Place";
import Grid from "@mui/material/Grid2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Way from "@/components/places/Way";
import Wall from "@/components/places/wall";

const PlaceId = () => {
  const { id } = useParams();
  const {
    zones,
    walls,
    loading,
    getPlaceZones,
    getPlan,
    createWall,
    updateZone,
    getWalls,
    getWays,
  } = usePlaces();
  const [plan, setPlan] = useState("");
  const [wallId, setWallId] = useState("");
  const [wallName, setWallName] = useState("");
  const [zoneId, setZoneId] = useState("");

  const wayRef = useRef();
  const wallRef = useRef();

  useEffect(() => {
    getPlaceZones(parseInt(id || "0"));
  }, []);

  // set modal
  const [openWall, setOpenWall] = useState(false);
  const [openAddPlan, setOpenAddPlan] = useState(false);

  // close modals
  const handleClose = () => {
    setOpenWall(false);
    setOpenAddPlan(false);
  };

  // set plan form
  const [file, setFile] = useState();
  function handleChangeFile(event: any) {
    setFile(event.target.files[0]);
  }
  function handleAddPlan(event: any) {
    const formData = new FormData();
    formData.append("image", file);
    updateZone(zoneId, formData);
  }

  // create wall
  const handleCreateWall = () => {
    setOpenWall(false);
    // create wall
    createWall(zoneId, wallName).then((response) => {
      // set new id
      document.getElementById(wallId).setAttribute("fill", "#46768B");
      document.getElementById(wallId).setAttribute("id", response.id);
      setWallId(response.id);
      getWays(response.id);
      var paths = document.querySelectorAll('[id^="temp"]');

      paths.forEach((element) => {
        element.removeAttribute("id");
      });

      // save svg
      var myBlob = new Blob(
        [
          document
            .getElementsByClassName("displaysvg")[0]
            .children[0].outerHTML.toString(),
        ],
        { type: "image/svg+xml" }
      );

      const formData = new FormData();
      formData.append("image", myBlob, "a.svg");

      updateZone(zoneId, formData).then((x) => {
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
      document.getElementById(wallId).setAttribute("fill", "#46768B");
    }
    setWallId("");
    getWays(0);
    getWalls(id_zone);
  };

  // action when click in wall into plan
  const actionOnClick = (event: any) => {
    let id = event.target.getAttribute("id");

    if (id) {
      if (document.getElementById(wallId)) {
        document.getElementById(wallId).setAttribute("fill", "#46768B");
      }
      event.target.setAttribute("fill", "#ffffff");
      event.target.setAttribute("stroke", "#46768B");

      setWallId(id);

      //   // create wall if not already set
      if (id.slice(0, 4) === "temp") {
        setOpenWall(true);
        setWallName("");
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
      document.getElementById(wallId).setAttribute("fill", "#46768B");
    }
    document.getElementById(id).setAttribute("fill", "#ffffff");
    document.getElementById(id).setAttribute("stroke", "#46768B");
    setWallId(id.toString());
    getWays(id);
  };

  function addPlan(id: string) {
    setZoneId(id);
    if (document.getElementById(wallId)) {
      document.getElementById(wallId).setAttribute("fill", "#46768B");
    }
    setWallId("");
    getWays(0);
    getWalls(id);
    setOpenAddPlan(true);
  }

  function addIdToSVG(response: string) {
    let split = response.split("<path");

    let result = split[0];
    for (let i = 1; i < split.length; i++) {
      if (
        split[i].slice(1, 6).includes("id=") ||
        !split[i].includes("#46768B")
      ) {
        result += "<path" + split[i];
      } else {
        result += "<path id='temp-" + i + "'" + split[i];
      }
    }

    return result;
  }

  const openModalWay = () => {
    console.log("a");

    wayRef.current.openModalWay();
  };

  const setWall = (value: string) => {
    selectWall(value);
  };

  return (
    <div className="overflow-¬x-auto">
      <Place id={id} />
      <div>
        <h1 className="text-center mt-20 mb-5 mx-5">Zones</h1>
        <Grid container spacing={2} columns={{ xs: 1, sm: 12 }}>
          <Grid size={8} className="p-3">
            <table className="table table-fixed">
              {/* head */}
              <thead>
                <tr>
                  <th>Mur sélectionnée</th>
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
                      className={zone.id == zoneId ? "bg-base-200" : ""}
                    >
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={zone.id === zoneId}
                          onChange={(e) => {
                            showPlan(zone.id);
                          }}
                        />
                      </th>
                      <th>{zone.name}</th>
                      <th>{zone.floor}</th>
                      <th>
                        {zone.image ? (
                          ""
                        ) : (
                          <button
                            className="btn"
                            onClick={() => addPlan(zone.id)}
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
        open={openAddPlan}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Ajouter un plan</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <label className="form-control w-full">
              <input
                id="idPlan"
                type="hidden"
                value={zoneId}
                className="bg-gray-200 border border-gray-400 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Plan</span>
              </div>

              <input
                type="file"
                onChange={handleChangeFile}
                className="bg-gray-200 border border-gray-400 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </label>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button className="btn" onClick={handleAddPlan}>
            Ajouter le plan
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlaceId;
