import usePlaces from "@/services/usePlaces";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Places = () => {
  const { places, loading, getPlaces } = usePlaces();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPlaces(search, 1);
  }, []);

  function changeSearch(value: string) {
    setSearch(value);
    getPlaces(value, page);
  }

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    getPlaces(search, value);
    console.log(value);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex m-4">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Rechercher"
            onChange={(e) => changeSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <table className="table table-fixed">
            {/* head */}
            <thead>
              <tr>
                <th>Nom</th>
                <th>Adresse</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {places &&
                places.data.map((place: any) => (
                  <tr key={place.id}>
                    <th>{place.name}</th>
                    <th>
                      {place.address} {place.city}
                    </th>
                    <th>
                      <button className="btn btn-xs bg-primary-300 text-white">
                        <Link to={"/places/" + place.id}>Détails</Link>
                      </button>
                    </th>
                  </tr>
                ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Nom</th>
                <th>Adresse</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
          {places ? (
            <Stack alignItems="center">
              <Pagination
                count={places.meta.lastPage}
                page={page > places.meta.lastPage ? places.meta.lastPage : page}
                onChange={changePage}
              />
            </Stack>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Places;
