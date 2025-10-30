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

type WayCardProps = {
  way: WAY;
  onClick: (id: number) => void;
  onClickComment: (id: number) => void;
  onClickNote: (id: number) => void;
};

const WayCard: React.FC<WayCardProps> = ({
  way,
  onClick,
  onClickComment,
  onClickNote,
}) => {
  return (
    <Card
      key={way.id}
      sx={{
        minWidth: 230,
        borderLeft: `6px solid ${way.color.color}`,
        borderRadius: 6,
        boxShadow: 3,
        flexShrink: 0,
      }}
    >
      <CardActionArea
        onClick={(e) => {
          e.stopPropagation();
          onClick(way.id);
        }}
      >
        <CardContent sx={{ height: '100%' }}>
          <Typography variant="body1" sx={{ marginBottom: 1.5 }}>
            {way.name}
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
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickComment(way.id);
                }}
              >
                <AddCommentIcon /> {way.nbComments}
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <SignalCellularAltIcon /> {way.difficulty.label}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                onClick={(e) => {
                  e.stopPropagation();
                  onClickNote(way.id);
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
