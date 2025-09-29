export type USER = {
  id: string;
  roleId: number;
  follower: string;
  following: string;
  firstname: string;
  lastname: string;
  email: string;
  genderId: string;
  bio: string;
  birthDate: string;
  avatar?: any;
  publicKey?: string;
};
