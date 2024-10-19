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

export interface ReviewForm {
  roomId: string;
  rating: number;
  comment: string;
}

export type GetListParamsReview = GetListParams<{
  roomId: string;
}>;
