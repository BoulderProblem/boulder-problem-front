import { usePlaces } from '@/services/usePlaces';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PLACE } from '@/types/place';

const Places = () => {
  const { places, loading, getPlaces } = usePlaces();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getPlaces(search, 1);
  }, []);

  function changeSearch(value: string) {
    setSearch(value);
    getPlaces(value, page + 1);
  }

  const changePage = (_event: any, value: number) => {
    setPage(value);
    getPlaces(search, value + 1);
  };

  return (
    <div className="overflow-x-auto h-screen">
      {loading && !places ? (
        <div>Loading...</div>
      ) : (
        <Paper
          className="max-w-7xl mx-auto mt-5"
          sx={{ overflow: 'hidden', borderRadius: { xs: 0, lg: 6 } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 300,
                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
              }}
            />
          </Box>
          <TableContainer
            component={Paper}
            sx={{ width: '100%', borderRadius: 6 }}
          >
            {places ? (
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Adresse</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {places.data.map((place: PLACE) => (
                    <TableRow
                      key={place.id}
                      onClick={() => navigate(`/places/${place.id}`)}
                      hover
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {place.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {place.address} {place.city}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10]}
                      count={places.meta.total}
                      rowsPerPage={10}
                      page={
                        page > places.meta.lastPage - 1
                          ? places.meta.lastPage - 1
                          : page
                      }
                      onPageChange={changePage}
                      labelRowsPerPage="Lignes par page"
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            ) : null}
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

export default Places;
