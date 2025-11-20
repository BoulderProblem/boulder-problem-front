import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { WAY } from '@/types/way';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import BuildIcon from '@mui/icons-material/Build';
import AddCommentIcon from '@mui/icons-material/AddComment';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useLocation } from 'react-router';
import CommentCard from '../posts/CommentCard';
import { useAuth } from '@/services/useAuth';
import MessageInput from '../posts/MessageInput';

const optionsValid = [
  { id: 'notvalid', label: 'Non validé', icon: <PanoramaFishEyeIcon /> },
  { id: 'zone', label: 'Zone', icon: <CheckCircleIcon /> },
  { id: 'top', label: 'Top', icon: <CheckCircleOutlineIcon /> },
  { id: 'flash', label: 'Flash', icon: <VerifiedIcon /> },
];

type WayCardProps = {
  way: WAY;
  ways: WAY[];
  saveRating: (id: number, rating: number) => void;
  getWayComments: (id: number, getPage: number) => void;
  addWayComment: (id: number, message: string) => void;
  saveValid: (id: number, status: string) => void;
};

const WayCard: React.FC<WayCardProps> = ({
  way,
  ways,
  saveRating,
  getWayComments,
  addWayComment,
  saveValid,
}) => {
  const { token } = useAuth();
  const [wayId, setWayId] = useState(-1);
  const [selectedRating, setSelectedRating] = useState(0);
  const [openNote, setOpenNote] = useState(false);
  const [openValid, setOpenValid] = useState(false);
  const [selectedValid, setSelectedValid] = useState('');
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md = >= 900px

  const wayClickNote = (wayId: number) => {
    setWayId(wayId);
    setOpenNote(true);
    if (ways?.find((way) => way.id === wayId)?.userNote) {
      console.log(ways?.find((way) => way.id === wayId)?.userNote);

      setSelectedRating(ways.find((way) => way.id === wayId)!.userNote!.note);
    } else {
      setSelectedRating(0);
    }
  };

  const wayClickValid = (wayId: number) => {
    setWayId(wayId);

    if (ways?.find((way) => way.id === wayId)?.valid) {
      setSelectedValid(ways.find((way) => way.id === wayId)!.valid!.status);
    } else {
      setSelectedValid('notvalid');
    }
    setOpenValid(true);
  };

  const wayClickComment = (wayId: number) => {
    // load comments
    setWayId(wayId);
    getWayComments(wayId, 1);
    setDrawer(true);
  };

  const handleLoadMoreComments = () => {
    getWayComments(wayId, way.currentPage + 1);
  };

  const handleRatingChange = (event: any) => {
    setSelectedRating(parseFloat(event.target.value));
  };

  const handleSubmitRating = () => {
    saveRating(wayId, selectedRating);
    setOpenNote(false);
  };

  const handleSubmitValid = () => {
    setOpenValid(false);
    if (selectedValid !== '') {
      saveValid(wayId, selectedValid);
    }
  };

  const handleAddComment = (wayId: number, message: string) => {
    console.log('Add comment to way ' + wayId + ' : ' + message);
    // add comment logic here
    addWayComment(wayId, message);
  };

  const handleClose = () => {
    setOpenNote(false);
    setOpenValid(false);
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
    <Box>
      <Card
        key={way.id}
        sx={{
          minWidth: 250,
          borderLeft: `6px solid ${way.color.color}`,
          borderRadius: 6,
          boxShadow: 3,
          flexShrink: 0,
        }}
      >
        <CardActionArea
          onClick={(e) => {
            e.stopPropagation();
            wayClickValid(way.id);
          }}
        >
          <CardContent sx={{ height: '100%' }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              marginBottom={1}
            >
              {location.pathname.includes('contests') ? (
                <Box display="flex" alignItems="center" gap={0.5}>
                  mur: {way.name}
                </Box>
              ) : (
                <Box display="flex" alignItems="center" gap={0.5}>
                  {way.name}
                </Box>
              )}
              <Box display="flex" alignItems="center" gap={0.5}>
                {!way.valid && <PanoramaFishEyeIcon />}
                {way.valid && way.valid.status === 'zone' && (
                  <CheckCircleOutlineIcon />
                )}
                {way.valid && way.valid.status === 'top' && <CheckCircleIcon />}
                {way.valid && way.valid.status === 'flash' && <VerifiedIcon />}
              </Box>
            </Box>
            {location.pathname.includes('contests') ? (
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                marginBottom={2}
              >
                salle: {way.wall!.zone.place.name}
              </Box>
            ) : null}
            <Typography variant="body2" color="text.secondary" className="pt-1">
              <BuildIcon /> {way.routeSetter}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="pt-3"
              component="div"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <SignalCellularAltIcon /> {way.difficulty.label}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  onClick={(e) => {
                    e.stopPropagation();
                    wayClickComment(way.id);
                  }}
                  sx={{
                    cursor: 'pointer',
                    px: 1,
                    py: 0.5,
                    borderRadius: 5,
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.18)',
                    },
                  }}
                >
                  <AddCommentIcon /> {way.nbComments}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  onClick={(e) => {
                    e.stopPropagation();
                    wayClickNote(way.id);
                  }}
                  sx={{
                    cursor: 'pointer',
                    px: 1,
                    py: 0.5,
                    borderRadius: 5,
                    transition: 'background-color 0.5s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.18)',
                    },
                  }}
                >
                  {way.userNote ? <StarIcon /> : <StarBorderIcon />}{' '}
                  {way.avgNote ? way.avgNote.toFixed(2) : 'N/A'}
                </Box>
              </Box>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <SwipeableDrawer
        anchor={isDesktop ? 'right' : 'bottom'}
        open={drawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: {
            maxHeight: isDesktop ? '100vh' : '85vh',
            borderTopLeftRadius: isDesktop ? 0 : 16,
            borderTopRightRadius: isDesktop ? 0 : 16,
            width: isDesktop ? 450 : '100%',
            overflow: 'hidden',
          },
        }}
      >
        <Box p={3} mx="auto">
          Commentaires
        </Box>
        <Box
          sx={{
            marginTop: 'auto',
            overflowY: 'scroll',
            scrollbarColor: 'base-400',
          }}
        >
          {ways
            ?.find((way) => way.id === wayId)
            ?.comments?.map((comment) => (
              <CommentCard key={comment.id} comment={comment} token={token} />
            ))}
        </Box>
        {way.comments && way.comments.length < way.nbComments ? (
          <Box
            margin={1}
            textAlign={'center'}
            sx={{
              cursor: 'pointer',
            }}
            onClick={handleLoadMoreComments}
          >
            Charger plus de commentaires
          </Box>
        ) : null}
        <MessageInput
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
            minWidth: '250px',
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
          <Button onClick={handleSubmitRating}>Valider</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openValid}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: '250px',
            borderRadius: 6,
          },
        }}
      >
        <DialogTitle>
          Valider le bloc {ways?.find((way) => way.id === wayId)?.name}
        </DialogTitle>
        <DialogContent>
          {optionsValid.map((opt) => (
            <Box
              key={opt.id}
              onClick={() => setSelectedValid(opt.id)}
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor:
                  selectedValid === opt.id ? 'var(--primary-600)' : '',
                color: selectedValid === opt.id ? 'white' : '',
                transition: '0.2s',
                '&:hover': { color: 'var(--primary-300)' },
              }}
            >
              {opt.icon}
              {opt.label}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmitValid}>Valider</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WayCard;
