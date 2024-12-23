import React, { useEffect, useImperativeHandle, useState } from "react";
import "leaflet/dist/leaflet.css";
import usePlaces from "@/services/usePlaces";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { WAY } from "@/types/way";

const Way = React.forwardRef((props: { wallId: string }, ref) => {
  const { ways, colors, difficulties, getWay, updateWay, addWay, deleteWay } =
    usePlaces();
  const [openDeleteWay, setOpenDeleteWay] = useState(false);
  const [openAddWay, setOpenAddWay] = useState(false);
  const [wayId, setWayId] = useState("");

  useEffect(() => {}, []);
  // close modals

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

  const [orderWay, setOrderWay] = useState("asc");
  const [orderWayBy, setOrderWayBy] = useState("id");

  const handleRequestSortWay = (property: string) => {
    const isAsc = orderWayBy === property && orderWay === "asc";
    setOrderWay(isAsc ? "desc" : "asc");
    setOrderWayBy(property);
  };
  let sortedWays: WAY[] = [];
  if (ways) {
    sortedWays = [...ways].sort((a, b) => {
      if (a[orderWayBy] < b[orderWayBy]) return orderWay === "asc" ? -1 : 1;
      if (a[orderWayBy] > b[orderWayBy]) return orderWay === "asc" ? 1 : -1;
      return 0;
    });
  }
  // way form
  const [wayInputs, setWayInputs] = useState<WAY | null>(null);

  const handleWayChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setWayInputs((values: any) => ({ ...values, [name]: value }));
  };

  const openModalWay = (id?: number) => {
    if (id) {
      getWay(id).then((response) => {
        console.log(response);
        setWayInputs(response);
        setOpenAddWay(true);

        // setWayInputs((values: any) => ({ ...values, [name]: value }));
      });
    } else {
      setWayInputs(null);
      setOpenAddWay(true);
    }
  };

  // add way
  function handleAddWay() {
    let params: any = wayInputs;
    if (params.wallId) {
      // update Way
      updateWay(params.id, params);
      handleClose();
    } else {
      //  crate way
      params.wallId = props.wallId;
      addWay(wayInputs);
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
              onClick={() => handleRequestSortWay("name")}
            >
              Nom / style
              {orderWayBy === "name" &&
                (orderWay === "asc" ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                ))}
            </th>
            <th
              className="cursor-pointer"
              onClick={() => handleRequestSortWay("difficultyId")}
            >
              Difficulté
              {orderWayBy === "difficultyId" &&
                (orderWay === "asc" ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                ))}
            </th>
            <th
              className="cursor-pointer"
              onClick={() => handleRequestSortWay("routeSetter")}
            >
              Ouvreur
              {orderWayBy === "routeSetter" &&
                (orderWay === "asc" ? (
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
                className={way.id == props.wallId ? "bg-base-200" : ""}
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
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: "dark:bg-zinc-700",
        }}
      >
        <DialogTitle>
          {wayInputs && wayInputs.name
            ? "Modifier une voie"
            : "Ajouter la voie"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Nom de la voie"
              fullWidth
              variant="standard"
              name="name"
              value={(wayInputs && wayInputs.name) || ""}
              onChange={handleWayChange}
              className="p-2.5"
            />
            <TextField
              id="standard-select-currency"
              select
              fullWidth
              label="Couleur"
              variant="standard"
              name="colorId"
              value={(wayInputs && wayInputs.colorId) || "0"}
              onChange={handleWayChange}
            >
              {colors &&
                colors.map((color: any) => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.label}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              id="standard-select-currency"
              select
              fullWidth
              label="Difficultée"
              variant="standard"
              name="difficultyId"
              value={(wayInputs && wayInputs.difficultyId) || "0"}
              onChange={handleWayChange}
            >
              {difficulties &&
                difficulties.map((difficulty: any) => (
                  <MenuItem key={difficulty.id} value={difficulty.id}>
                    {difficulty.label}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              id="standard-basic"
              label="Ouvreur"
              fullWidth
              variant="standard"
              name="routeSetter"
              value={(wayInputs && wayInputs.routeSetter) || ""}
              onChange={handleWayChange}
              className="p-2.5"
            />
            <TextField
              id="standard-basic"
              label="Style"
              fullWidth
              variant="standard"
              name="style"
              value={(wayInputs && wayInputs.style) || ""}
              onChange={handleWayChange}
              className="p-2.5"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <button className="btn" onClick={handleClose}>
            Fermer
          </button>
          <button className="btn" onClick={handleAddWay}>
            {wayInputs && wayInputs.name
              ? "Modifier une voie"
              : "Ajouter la voie"}
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
