export type COMMENT = {
  id: number;
  userId: string;
  postId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    avatar: string;
  };
};
