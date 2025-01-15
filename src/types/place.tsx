export type PLACE = {
  id: number;
  name: string;
  address: string;
  city: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  phone: string;
  website: string;
  coordinate: { x: number; y: number };
  ownerId: any;
  owner: any;
  hours: string;
  favoriteCount: number;
};
