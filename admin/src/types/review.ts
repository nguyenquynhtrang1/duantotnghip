import { GetListParams } from "./common";
import { Room } from "./room";
import { User } from "./user";

export interface Review {
  _id: string;
  user: User;
  room: Room;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export type GetListParamsReview = GetListParams<object>;
