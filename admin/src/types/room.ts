import { GetListParams } from "./common";
import { RoomType } from "./roomType";

export interface Room {
  _id: string;
  name: string;
  description: string;
  roomType: RoomType;
  photos: string[];
  price: number;
  rating: number;
  discount: number;
  numReviews: number;
  isFeatured: boolean;
  invalidDates: Date[];
  offeredAmenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomForm {
  name: string;
  roomType: string;
  price: number;
  photos: string[];
  rating?: number;
  discount?: number;
  numReviews?: number;
  description?: string;
  isFeatured?: boolean;
  offeredAmenities?: string[];
}

export type GetListParamsRoom = GetListParams<{
  roomTypes?: string[];
}>;
