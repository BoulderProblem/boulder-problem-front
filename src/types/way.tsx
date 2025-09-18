export type WAY = {
  id: number;
  colorId: number;
  wallId: number;
  difficultyId: number;
  name: string;
  routeSetter: string;
  style: string;
  color: {
    id: number;
    color: string;
    label: string;
  };
};
