import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import "leaflet/dist/leaflet.css";
import usePlaces from "@/services/usePlaces";
import { TextField } from "@mui/material";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { PLACE } from "@/types/place";

const Place = (props: any) => {
  const { getPlace, updatePlace, getPlaceZones } = usePlaces();

  const [inputs, setInputs] = useState<PLACE | null>(null);
  useEffect(() => {
    getPlace(parseInt(props.id || "0")).then((response: PLACE) => {
      setInputs(response);
    });
    getPlaceZones(parseInt(props.id || "0"));
  }, []);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values: any) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event: React.ChangeEvent<unknown>) => {
    event.preventDefault();
    console.log(inputs);
    updatePlace(parseInt(props.id || "0"), inputs);
  };

  return (
    <div>
      {inputs ? (
        <div>
          <h1 className="text-center my-5">{inputs.name || ""}</h1>
          <Grid container spacing={2} columns={{ xs: 1, sm: 12 }}>
            <Grid size={8} className="p-6">
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <TextField
                  id="standard-basic"
                  label="Nom de la salle"
                  fullWidth
                  variant="standard"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <TextField
                      id="standard-basic"
                      label="Adresse"
                      fullWidth
                      variant="standard"
                      name="address"
                      value={inputs.address || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 7, sm: 4 }}>
                    <TextField
                      id="standard-basic"
                      label="Ville"
                      fullWidth
                      variant="standard"
                      name="city"
                      value={inputs.city || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 5, sm: 3 }}>
                    <TextField
                      id="standard-basic"
                      label="Code postal"
                      fullWidth
                      variant="standard"
                      name="postalCode"
                      value={inputs.postalCode || ""}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <TextField
                  id="standard-basic"
                  label="Téléphone"
                  fullWidth
                  variant="standard"
                  name="phone"
                  value={inputs.phone || ""}
                  onChange={handleChange}
                />
                <TextField
                  id="standard-basic"
                  label="Site web"
                  fullWidth
                  variant="standard"
                  name="website"
                  value={inputs.website || ""}
                  onChange={handleChange}
                />

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </Grid>
            <Grid size={4} className="max-h-[500px] min-h-[300px] p-6">
              <div className="map-container h-full">
                <MapContainer
                  center={[inputs.coordinate.y, inputs.coordinate.x]}
                  zoom={13}
                  className="h-full rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="http://www.boulder-problem.chabs.fr/">boulder-problem</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    key={1}
                    position={[inputs.coordinate.y, inputs.coordinate.x]}
                  ></Marker>
                </MapContainer>
              </div>
            </Grid>
          </Grid>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Place; // Don’t forget to use export default!
