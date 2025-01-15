import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useLoadScript } from '@react-google-maps/api';

const libraries: 'places'[] = ['places'];

interface AddressSearchProps {
  onAddressSelect?: (
    address: string,
    placeId: string,
    address_components: any
  ) => void;
  address: string;
}

export default function AddressSearch({
  onAddressSelect,
  address,
}: AddressSearchProps) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_KEY_GOOGLE,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && !loadError) {
      const input = document.getElementById(
        'address-search'
      ) as HTMLInputElement;
      const autocompleteInstance = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'FR' },
        fields: ['address_components', 'formatted_address', 'place_id'],
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.formatted_address && place.place_id && onAddressSelect) {
          onAddressSelect(
            place.formatted_address,
            place.place_id,
            place.address_components
          );
          console.log(place);
        }
      });

      setAutocomplete(autocompleteInstance);
    }
  }, [isLoaded, loadError, onAddressSelect]);

  if (loadError) {
    return (
      <TextField
        error
        fullWidth
        variant="standard"
        label="Erreur de chargement de Google Maps"
      />
    );
  }

  return (
    <TextField
      id="address-search"
      label="Rechercher une adresse"
      variant="standard"
      fullWidth
      defaultValue={address}
      placeholder="Entrez une adresse..."
      InputProps={{
        readOnly: !isLoaded,
      }}
    />
  );
}
