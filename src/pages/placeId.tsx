import PlaceHeader from '@/components/places/PlaceHeader';
import PlaceZone from '@/components/places/PlaceZone';
import { usePlaces } from '@/services/usePlaces';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const PlaceId = () => {
  const { id } = useParams();
  const { getColors, getDifficulties, getPlaceZones, getWalls, getWays } =
    usePlaces();

  useEffect(() => {
    getColors();
    getDifficulties();
    getPlaceZones(parseInt(id || '0'));
    getWalls(0);
    getWays(0);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Boulder problem</title>
        <meta name="description" content="page de la salle d'escalade" />
      </Helmet>
      <PlaceHeader id={id} />
      <PlaceZone />
    </div>
  );
};

export default PlaceId;
