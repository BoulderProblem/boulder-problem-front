import { COMMENT } from './comment';
import { PLACE } from './place';

export type WAY = {
  id: number;
  colorId: number;
  wallId: number;
  difficultyId: number;
  name: string;
  image: string;
  currentPage: number;
  routeSetter: string;
  style: string;
  color: {
    id: number;
    color: string;
    label: string;
  };
  difficulty: {
    id: number;
    label: string;
  };
  avgNote: null | number;
  nbComments: number;
  comments?: COMMENT[];
  userNote: null | {
    note: number;
    wayId: number;
  };
  valid: null | {
    status: string;
  };
  wall?: {
    id: number;
    zoneId: number;
    name: string;
    zone: {
      id: number;
      name: string;
      floor: string;
      place: PLACE;
    };
  };
};
