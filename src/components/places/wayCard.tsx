import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
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

type WayCardProps = {
  way: WAY;
  onClickValid: (id: number) => void;
  onClickComment: (id: number) => void;
  onClickNote: (id: number) => void;
};

const WayCard: React.FC<WayCardProps> = ({
  way,
  onClickValid,
  onClickComment,
  onClickNote,
}) => {
  return (
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
          onClickValid(way.id);
        }}
      >
        <CardContent sx={{ height: '100%' }}>
          <Typography variant="body1" sx={{ marginBottom: 1.5 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                {way.name}
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                {!way.valid && <PanoramaFishEyeIcon />}
                {way.valid && way.valid.status === 'zone' && (
                  <CheckCircleOutlineIcon />
                )}
                {way.valid && way.valid.status === 'top' && <CheckCircleIcon />}
                {way.valid && way.valid.status === 'flash' && <VerifiedIcon />}
              </Box>
            </Box>
          </Typography>
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
                  onClickComment(way.id);
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
                  onClickNote(way.id);
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
  );
};

export default WayCard;
