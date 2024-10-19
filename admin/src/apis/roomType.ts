import { GetListResponse } from "../types/common";
import {
  GetListParamsRoomType,
  RoomType,
  RoomTypeForm,
} from "../types/roomType";
import api from "./config";

export const getRoomTypes = async (
  params: GetListParamsRoomType
): Promise<GetListResponse<RoomType>> => {
  try {
    const response = await api.get<GetListResponse<RoomType>>("/roomtypes", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Get room types API error:", error);
    throw new Error("Failed to get room types.");
  }
};

export const getRoomType = async (id: string): Promise<RoomType> => {
  try {
    const response = await api.get<RoomType>(`/roomtypes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get room type API error:", error);
    throw new Error("Failed to get room type.");
  }
};

export const createRoomType = async (
  roomType: RoomTypeForm
): Promise<RoomType> => {
  try {
    const response = await api.post<RoomType>("/roomtypes", roomType);
    return response.data;
  } catch (error) {
    console.error("Create room type API error:", error);
    throw new Error("Failed to create room type.");
  }
};

export const updateRoomType = async (
  id: string,
  roomType: RoomTypeForm
): Promise<RoomType> => {
  try {
    const response = await api.patch<RoomType>(`/roomtypes/${id}`, roomType);
    return response.data;
  } catch (error) {
    console.error("Update room type API error:", error);
    throw new Error("Failed to update room type.");
  }
};

export const deleteRoomType = async (id: string): Promise<void> => {
  try {
    await api.delete(`/roomtypes/${id}`);
  } catch (error) {
    console.error("Delete room type API error:", error);
    throw new Error("Failed to delete room type.");
  }
};
