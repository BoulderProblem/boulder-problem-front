import { WALL } from './wall';

export type ZONE = {
  id: number;
  name: string;
  floor: string;
  walls: WALL[];
};
