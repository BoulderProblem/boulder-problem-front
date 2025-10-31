export type COMMENT = {
  id: number;
  userId: string;
  postId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
};
