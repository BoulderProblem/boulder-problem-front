import React, { Component, useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import "leaflet/dist/leaflet.css";
import usePlaces from "@/services/usePlaces";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Wall = React.forwardRef(
  (props: { wallId: string; openModalWay: any; setWall: any }, ref) => {
    const { walls, getWalls } = usePlaces();

    useEffect(() => {}, []);

    const [orderWall, setOrderWall] = useState("asc");
    const [orderWallBy, setOrderWallBy] = useState("id");

    const handleRequestSortWall = (property: string) => {
      const isAsc = orderWallBy === property && orderWall === "asc";
      setOrderWall(isAsc ? "desc" : "asc");
      setOrderWallBy(property);
    };

    const sortedWalls = [...walls].sort((a, b) => {
      if (a[orderWallBy] < b[orderWallBy]) return orderWall === "asc" ? -1 : 1;
      if (a[orderWallBy] > b[orderWallBy]) return orderWall === "asc" ? 1 : -1;
      return 0;
    });

    return (
      <div>
        <h1 className="text-center mt-10 mb-5 mx-5">Mur</h1>
        <table className="table table-fixed">
          <thead>
            <tr>
              <th>Mur sélectionnée</th>
              <th
                className="cursor-pointer"
                onClick={() => handleRequestSortWall("name")}
              >
                Nom
                {orderWallBy === "name" &&
                  (orderWall === "asc" ? (
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
                  className={wall.id == props.wallId ? "bg-base-200" : ""}
                >
                  <th onClick={(e) => props.setWall(wall.id)}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={wall.id == props.wallId}
                      onChange={(e) => props.setWall(wall.id)}
                    />
                  </th>
                  <th onClick={(e) => props.setWall(wall.id)}>{wall.name}</th>
                  <th onClick={(e) => props.setWall(wall.id)}>
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
                            onClick={(e) => {
                              props.openModalWay();
                            }}
                          >
                            Ajouter une voie
                          </a>
                        </li>
                        <li>
                          <a>Modifier le mur</a>
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
              <th>Mur sélectionnée</th>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

export default Wall; // Don’t forget to use export default!
