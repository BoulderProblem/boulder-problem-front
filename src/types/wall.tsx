import { WAY } from './way';

export type WALL = {
  id: number;
  zoneId: number;
  name: string;
  ways: WAY[];
};
