import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { usePlaces } from '@/services/usePlaces';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import 'dayjs/locale/fr';
import WayCard from './wayCard';

const PlaceZone = () => {
  const {
    place,
    zones,
    walls,
    ways,
    getPlan,
    getZone,
    getWalls,
    getWays,
    getWayComments,
    addWayComment,
    saveRating,
    saveValid,
  } = usePlaces();
  const [plan, setPlan] = useState('');
  const [wallId, setWallId] = useState('');
  const [wallName, setWallName] = useState('');
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md = >= 900px

  useEffect(() => {
    if (zones && zones.length === 1) {
      getPlan(parseInt(zones[0].id)).then((response) => {
        setPlan(addIdToSVG(response));
      });
      getZone(zones[0].id);
      getWalls(zones[0].id);
    }
  }, [place]);

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

  /**
   * action when click in wall into plan
   * @param event
   */
  const actionOnClick = (event: any) => {
    let id = event.target.getAttribute('id');

    if (!isDesktop) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (id) {
      if (document.getElementById(wallId)) {
        document.getElementById(wallId)?.setAttribute('fill', '#46768B');
      }
      event.target.setAttribute('fill', '#ffffff');
      event.target.setAttribute('stroke', '#46768B');

      setWallId(id);

      //   // create wall if not already set
      if (id.slice(0, 4) === 'temp') {
        // error wall not set
        setWallName('Mur non défini');
        getWays(-1);
      } else {
        getWays(id);
        setWallName(walls.find((wall) => wall.id === parseInt(id))?.name);
      }
    }
  };

  return (
    <div
      style={{
        height: isDesktop ? 'calc(100vh - 350px)' : 'calc(100vh - 64px)',
      }}
    >
      {place ? (
        <Box ref={sectionRef} className="w-full max-w-5xl mx-auto px-4 py-6">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: 'block',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                className="displaysvg grid max-h-[50vh]"
                dangerouslySetInnerHTML={{
                  __html: plan,
                }}
                onClick={(event) => {
                  actionOnClick(event);
                }}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {wallId && wallName ? (
                <Typography
                  variant="h5"
                  className="text-primary-600"
                  sx={{ marginTop: 2, textAlign: 'center' }}
                  fontWeight="bold"
                >
                  {wallName}
                </Typography>
              ) : (
                ''
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  gap: 2,
                  overflow: 'auto',
                  p: 2,
                  maxHeight: '400px',
                }}
              >
                {ways &&
                  ways.map((way) => (
                    <WayCard
                      key={way.id}
                      way={way}
                      ways={ways}
                      saveRating={saveRating}
                      getWayComments={getWayComments}
                      addWayComment={addWayComment}
                      saveValid={saveValid}
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        ''
      )}
    </div>
  );
};

export default PlaceZone; // Don’t forget to use export default!
