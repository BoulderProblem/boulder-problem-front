import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { usePlaces } from '@/services/usePlaces';
import {
  Box,
  Typography,
  SwipeableDrawer,
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
  DialogActions,
  Button,
} from '@mui/material';
import 'dayjs/locale/fr';
import WayCard from './wayCard';
import MessageInput from '../posts/MessageInput';
import CommentCard from '../posts/CommentCard';
import { useAuth } from '@/services/useAuth';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const PlaceZone = (props: any) => {
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
  } = usePlaces();
  const { token } = useAuth();
  const [plan, setPlan] = useState('');
  const [wallId, setWallId] = useState('');
  const [wayId, setWayId] = useState(-1);
  const [wallName, setWallName] = useState('');
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [openNote, setOpenNote] = useState(false);

  const [drawer, setDrawer] = useState(false);

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

    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const WayClick = (wayId: number) => {
    console.log('Way click : ' + wayId);
    setWayId(wayId);
  };

  const WayClickComment = (wayId: number) => {
    console.log('Way comment click : ' + wayId);
    // load comments
    setWayId(wayId);
    getWayComments(wayId, 1);
    setDrawer(true);
  };

  const WayClickNote = (wayId: number) => {
    console.log('Way note click : ' + wayId);
    setWayId(wayId);
    setOpenNote(true);
    setSelectedRating(0);
    ways?.find((way) => way.id === wayId)?.userNote &&
      setSelectedRating(ways.find((way) => way.id === wayId)!.userNote!.note);
  };

  const handleRatingChange = (event: any) => {
    setSelectedRating(parseInt(event.target.value, 10));
  };

  const handleSubmit = () => {
    saveRating(selectedRating);
    setOpenNote(false);
  };

  const handleClose = () => {
    setOpenNote(false);
  };

  const handleAddComment = (wayId: number, message: string) => {
    console.log('Add comment to way ' + wayId + ' : ' + message);
    // add comment logic here
    addWayComment(wayId, message);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawer(open);
    };

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      {place ? (
        <Box ref={sectionRef} className="w-full max-w-5xl mx-auto px-4 py-6">
          <div
            className="displaysvg grid max-h-[400px]"
            dangerouslySetInnerHTML={{
              __html: plan,
            }}
            onClick={(event) => {
              actionOnClick(event);
            }}
          />

          {wallId && wallName ? (
            <Typography
              variant="h5"
              className="text-primary-600"
              sx={{ marginTop: 2 }}
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
              gap: 2,
              overflowX: 'auto',
              p: 2,
            }}
          >
            {ways &&
              ways.map((way) => (
                <WayCard
                  key={way.id}
                  way={way}
                  onClick={WayClick}
                  onClickComment={WayClickComment}
                  onClickNote={WayClickNote}
                />
              ))}
          </Box>
          <SwipeableDrawer
            anchor="bottom"
            open={drawer}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            PaperProps={{
              sx: {
                maxHeight: '85vh',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: 'hidden',
              },
            }}
          >
            <Box p={2} m="auto">
              Commentaires
            </Box>
            <Box sx={{ overflow: 'scroll' }}>
              {ways
                ?.find((way) => way.id === wayId)
                ?.comments?.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    token={token}
                  />
                ))}
            </Box>
            <MessageInput
              sx={{ position: 'absolute', bottom: 0, width: '100%' }}
              onSend={(message) => {
                handleAddComment(wayId, message);
              }}
            />
          </SwipeableDrawer>
          <Dialog
            open={openNote}
            onClose={handleClose}
            PaperProps={{
              sx: {
                minWidth: '220px',
                borderRadius: 6,
              },
            }}
          >
            <DialogTitle>
              Noter le bloc {ways?.find((way) => way.id === wayId)?.name}
            </DialogTitle>
            <DialogContent>
              <Rating
                name="size-large"
                value={selectedRating}
                onChange={handleRatingChange}
                precision={0.5}
                size="large"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button onClick={handleSubmit}>Valider</Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        ''
      )}
    </div>
  );
};

export default PlaceZone; // Don’t forget to use export default!
