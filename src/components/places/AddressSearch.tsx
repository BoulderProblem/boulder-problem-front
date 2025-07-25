import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

interface AddressSearchProps {
  onAddressSelect: (
    address: string,
    housenumber: string,
    street: string,
    city: string,
    postcode: string,
    coordinates: { x: number; y: number }
  ) => void;
  address: string;
}

interface AddressOption {
  address: string;
  housenumber: string;
  street: string;
  city: string;
  postcode: string;
  coordinates: { x: number; y: number };
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  onAddressSelect,
  address,
}) => {
  const [inputValue, setInputValue] = useState(address);
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputValue.length < 3) {
      setOptions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);
      axios
        .get('https://api-adresse.data.gouv.fr/search/', {
          params: { q: inputValue, limit: 5 },
        })
        .then((res) => {
          const results = res.data.features.map((feature: any) => ({
            address: feature.properties.label,
            housenumber: feature.properties.housenumber,
            street: feature.properties.street,
            city: feature.properties.city,
            postcode: feature.properties.postcode,
            coordinates: {
              x: feature.geometry.coordinates[0],
              y: feature.geometry.coordinates[1],
            },
          }));
          console.log(results);

          setOptions(results);
        })
        .catch(() => setOptions([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleChange = (_: any, newValue: AddressOption | null) => {
    if (newValue) {
      setInputValue(newValue.address);
      onAddressSelect(
        newValue.address,
        newValue.housenumber,
        newValue.street,
        newValue.city,
        newValue.postcode,
        newValue.coordinates
      );
    }
  };

  return (
    <Autocomplete
      fullWidth
      freeSolo
      options={options}
      getOptionLabel={(option: any) => option.address}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      onChange={handleChange}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Adresse"
          variant="standard"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AddressSearch;
