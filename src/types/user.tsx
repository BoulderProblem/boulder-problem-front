export type USER = {
  id: string;
  roleId: number;
  nbFollower: number;
  nbFollowing: number;
  isFollowing: boolean;
  firstname: string;
  lastname: string;
  email: string;
  genderId: string;
  bio: string;
  birthDate: string;
  avatar?: any;
  publicKey?: string;
};
