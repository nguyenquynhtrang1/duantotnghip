import { GetListParams } from "./common";

export interface RoomType {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomTypeForm {
  name: string;
  description?: string;
}

export type GetListParamsRoomType = GetListParams<object>;
