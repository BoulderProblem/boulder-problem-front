import { COMMENT } from './comment';

export type POST = {
  id: number;
  userId: string;
  title: string;
  image: any;
  text: string;
  createdAt: string;
  updatedAt: string;
  isLike?: boolean;
  likesCount?: number;
  commentsCount?: number;
  user?: {
    id: number;
    firstname: string;
    lastname: string;
    avatar: string;
  };
  comments?: [COMMENT];
  haveNextPage?: boolean;
  currentPage?: number;
};
